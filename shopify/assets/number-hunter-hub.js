(function () {
  let activeRoot = null;
  const listenerCleanups = [];

  const state = {
    selectedRealmId: 'jungle',
    selectedDifficulty: 'littleHunter',
    selectedSkill: 'additionWithin10',
    keyLockSession: null,
    currentQuickQuest: null,
    treasureMergeSession: null,
    realmSkillIndex: {},
    questStyle: 'silly',
    guardianDashSession: null,
    isTreasureMergeActive: false,
    isGuardianDashActive: false,
    selectedActivity: 'quickQuest',
    evenOddSortSession: null
  };

  function el(id) {
    return (activeRoot && activeRoot.querySelector(`#${id}`)) || document.getElementById(id);
  }

  function findHubRoot(root) {
    if (root && root.id === 'numberHunterHub') return root;
    if (root && typeof root.querySelector === 'function') return root.querySelector('#numberHunterHub');
    return document.getElementById('numberHunterHub');
  }

  function addHubListener(target, eventName, handler) {
    if (!target) return;
    target.addEventListener(eventName, handler);
    listenerCleanups.push(() => target.removeEventListener(eventName, handler));
  }

  function cleanupHubListeners() {
    while (listenerCleanups.length) {
      const cleanup = listenerCleanups.pop();
      cleanup();
    }
  }

  function getSelectedRealm() {
    return window.NH_DATA.realms.find((r) => r.id === state.selectedRealmId) || window.NH_DATA.realms[0];
  }

  function getSkillsForRealm(realmId) {
    const realm = window.NH_DATA.realms.find((r) => r.id === realmId);
    return (window.NH_DATA.realmSkillMap[realmId] || realm?.skillFocus || ['additionWithin10']).slice();
  }

  function chooseSkillForRealm(realmId) {
    const skills = getSkillsForRealm(realmId);
    if (skills.length <= 1) return skills[0];
    const currentIndex = state.realmSkillIndex[realmId] || 0;
    const nextSkill = skills[currentIndex % skills.length];
    state.realmSkillIndex[realmId] = (currentIndex + 1) % skills.length;
    return nextSkill;
  }

  function getSkillLabel(skill) {
    const labels = {
      additionWithin10: 'Add to 10', subtractionWithin10: 'Subtract', evenOdd: 'Even / Odd',
      make10: 'Make 10', missingNumber: 'Missing Number', additionWithin20: 'Add to 20', subtractionWithin20: 'Subtract to 20'
    };
    return labels[skill] || 'Math Quest';
  }


  function renderQuestStyleButtons() {
    const silly = el('questStyleSillyBtn');
    const calm = el('questStyleCalmBtn');
    if (!silly || !calm) return;
    silly.classList.toggle('btn-primary', state.questStyle === 'silly');
    calm.classList.toggle('btn-primary', state.questStyle === 'calm');
  }


  function setSelectedActivity(activityId) {
    const previousActivity = state.selectedActivity;
    if (previousActivity && previousActivity !== activityId) {
      if (previousActivity === 'treasureMerge' && activityId !== 'treasureMerge') cleanupTreasureMergeToIdle();
      if (previousActivity === 'guardianDash' && activityId !== 'guardianDash') cleanupGuardianDashToIdle();
      if (previousActivity === 'evenOddSort' && activityId !== 'evenOddSort') cleanupEvenOddSort();
    }

    state.selectedActivity = activityId;
    if (activityId === 'keyLock') { cleanupTreasureMergeToIdle(); cleanupGuardianDashToIdle(); cleanupEvenOddSort(); mountKeyLockGame(); }
    if (activityId === 'evenOddSort') { cleanupTreasureMergeToIdle(); cleanupGuardianDashToIdle(); mountEvenOddSort(); }
    renderActivityCards();
    renderActivityPanels();
  }

  function renderActivityCards() {
    const mount = el('activityGrid');
    if (!mount) return;
    const progress = window.Progress.getProgress();
    const realm = getSelectedRealm();
    const keyEarned = !!progress.realmKeys[realm.id];
    mount.innerHTML = '';
    (window.NH_DATA.activities || []).forEach((activity) => {
      const card = document.createElement('button');
      card.type = 'button';
      const isSelected = state.selectedActivity === activity.id;
      card.className = `activity-card ${isSelected ? 'selected' : ''}`;
      card.setAttribute('aria-pressed', String(isSelected));
      let rewardLabel = activity.rewardLabel;
      if (activity.id === 'keyLock' && keyEarned) rewardLabel = 'Key Earned!';
      card.innerHTML = `<strong>${activity.title}${isSelected ? ' • Selected' : ''}</strong><small>${activity.description}</small><span>${rewardLabel}</span>`;
      addHubListener(card, 'click', () => setSelectedActivity(activity.id));
      mount.appendChild(card);
    });
  }

  function renderActivityPanels() {
    const activityIds = ['quickQuest', 'keyLock', 'treasureMerge', 'guardianDash', 'evenOddSort', 'guardianQuest'];
    activityIds.forEach((id) => {
      const panel = el(`activityPanel-${id}`);
      if (!panel) return;
      panel.style.display = state.selectedActivity === id ? 'block' : 'none';
    });
  }

  function renderDifficulty() {
    const mount = el('difficultyOptions');
    mount.innerHTML = '';
    window.NH_DATA.difficulties.forEach((d) => {
      const b = document.createElement('button');
      const isSelected = state.selectedDifficulty === d.id;
      b.className = `btn ${isSelected ? 'btn-primary' : ''}`;
      b.setAttribute('aria-pressed', String(isSelected));
      b.textContent = isSelected ? `${d.name} ✓` : d.name;
      addHubListener(b, 'click', () => {
        state.selectedDifficulty = d.id;
        const p = window.Progress.getProgress();
        p.selectedDifficulty = d.id;
        window.Progress.saveProgress(p);
        renderDifficulty();
        refreshSelectedActivityForContextChange();
        refreshProgress();
        renderActivityCards();
        renderActivityPanels();
      });
      mount.appendChild(b);
    });
  }

  function renderRealms() {
    const mount = el('realmGrid');
    const progress = window.Progress.getProgress();
    mount.innerHTML = '';
    window.NH_DATA.realms.forEach((realm) => {
      const keyEarned = !!progress.realmKeys[realm.id];
      const skill = (window.NH_DATA.realmSkillMap[realm.id] || realm.skillFocus)[0];
      const b = document.createElement('button');
      const isSelected = state.selectedRealmId === realm.id;
      b.className = `realm-card realm-${realm.id} ${isSelected ? 'selected' : ''} ${keyEarned ? 'realm-earned' : 'realm-needed'}`;
      b.setAttribute('aria-pressed', String(isSelected));
      b.innerHTML = `<strong>${realm.name}${isSelected ? ' ✓' : ''}</strong><br><small>${getSkillLabel(skill)}</small><br><small>${keyEarned ? 'Key Earned!' : 'Find Realm Key'}</small>`;
      addHubListener(b, 'click', () => {
        state.selectedRealmId = realm.id;
        state.selectedSkill = chooseSkillForRealm(realm.id);
        el('selectedRealmLabel').textContent = `Realm: ${realm.name}`;
        renderRealms();
        refreshSelectedActivityForContextChange();
        refreshProgress();
      });
      mount.appendChild(b);
    });
  }

  function renderProblem() {
    state.selectedSkill = chooseSkillForRealm(state.selectedRealmId);
    const choices = el('problemChoices');
    choices.innerHTML = '';

    let p;
    try {
      p = window.MathEngine.generateProblem({ skill: state.selectedSkill, difficulty: state.selectedDifficulty });
    } catch (err) {
      state.currentQuickQuest = { solved: true, answer: null };
      el('problemPrompt').textContent = 'Quest setup issue. Pick a realm and try again.';
      return;
    }

    state.currentQuickQuest = { solved: false, answer: p.answer };
    el('problemPrompt').textContent = p.prompt;

    function disableAllChoices() {
      choices.querySelectorAll('button').forEach((btn) => {
        btn.disabled = true;
        btn.classList.add('btn-ghost');
      });
    }

    let wrongAttempts = 0;

    p.choices.forEach((c) => {
      const b = document.createElement('button');
      b.className = 'btn';
      b.textContent = c;
      addHubListener(b, 'click', () => {
        if (!state.currentQuickQuest || state.currentQuickQuest.solved) return;
        if (c === p.answer) {
          state.currentQuickQuest.solved = true;
          window.Progress.awardStar();
          disableAllChoices();
          b.classList.remove('btn-ghost');
          b.classList.add('btn-primary');
          el('problemPrompt').textContent = `${p.prompt} ✓ Star earned!`;
          refreshProgress();
        } else {
          wrongAttempts += 1;
          el('problemPrompt').textContent = wrongAttempts >= 2 ? `Try again! ${p.explanation}` : 'Try again!';
          b.classList.add('quick-wrong');
          setTimeout(() => b.classList.remove('quick-wrong'), 260);
        }
      });
      choices.appendChild(b);
    });
  }

  function refreshProgress() {
    const p = window.Progress.getProgress();
    const keyTarget = window.NH_DATA.rewards.caveKeyTarget;
    const keys = Object.values(p.realmKeys).filter(Boolean).length;
    const caveOpen = p.caveUnlocked;
    const realm = getSelectedRealm();
    const realmKey = !!p.realmKeys[realm.id];
    const checklist = el('caveKeyChecklist');
    const rewardRoom = el('caveRewardRoom');
    const printBtn = el('printCaveCertificateBtn');

    el('progressSummary').textContent = `Stars: ${p.stars} • Realm Keys: ${keys} / ${keyTarget} • Level: ${p.selectedDifficulty}`;
    el('caveStatus').textContent = caveOpen ? 'Treasure Cave Open!' : 'Treasure Cave Locked';
    el('caveDetails').textContent = caveOpen ? 'You found every Realm Key!' : `Find all ${keyTarget} Realm Keys. Keys Found: ${keys} / ${keyTarget}`;
    el('nextHint').textContent = caveOpen ? 'The Treasure Cave is open!' : (realmKey ? 'Try a Star quest next!' : `Next: Play Key Lock for the ${realm.name} Key.`);

    if (checklist) {
      checklist.innerHTML = window.NH_DATA.realms.map((r) => {
        const earned = !!p.realmKeys[r.id];
        return `<li class="${earned ? 'earned' : 'missing'}">${r.name} Key: ${earned ? 'Key Earned!' : 'Still hidden'}</li>`;
      }).join('');
    }

    if (rewardRoom) {
      if (caveOpen) {
        const today = new Date().toLocaleDateString();
        rewardRoom.innerHTML = `
          <div class="certificate-block">
            <h3>Number Hunter Champion</h3>
            <p>You found all 6 Realm Keys and opened the Treasure Cave.</p>
            <p><strong>Total Stars:</strong> ${p.stars}</p>
            <p><strong>Date:</strong> ${today}</p>
            <p class="cave-celebrate">Treasure found! Great questing!</p>
          </div>`;
        if (printBtn) printBtn.style.display = 'inline-block';
      } else {
        rewardRoom.innerHTML = '';
        if (printBtn) printBtn.style.display = 'none';
      }
    }

    renderRealms();
    renderActivityCards();
  }


  function renderTreasureMergeIdle() {
    const mount = el('treasureMergeMount');
    if (!mount) return;
    mount.innerHTML = `<div class="game-idle"><p>Ready to merge?</p><p>Press Start Merge.</p></div>`;
  }

  function renderGuardianDashIdle() {
    const mount = el('guardianDashMount');
    if (!mount) return;
    mount.innerHTML = `<div class="game-idle"><p>Ready to dash?</p><p>Press Start Dash.</p></div>`;
  }

  function cleanupTreasureMergeToIdle() {
    if (state.treasureMergeSession && typeof state.treasureMergeSession.cleanup === 'function') state.treasureMergeSession.cleanup();
    state.treasureMergeSession = null;
    state.isTreasureMergeActive = false;
    renderTreasureMergeIdle();
  }

  function cleanupGuardianDashToIdle() {
    if (state.guardianDashSession && typeof state.guardianDashSession.cleanup === 'function') state.guardianDashSession.cleanup();
    state.guardianDashSession = null;
    state.isGuardianDashActive = false;
    renderGuardianDashIdle();
  }

  function cleanupKeyLock() {
    if (state.keyLockSession && typeof state.keyLockSession.cleanup === 'function') state.keyLockSession.cleanup();
    state.keyLockSession = null;
  }

  function mountKeyLockGame() {
    const realm = getSelectedRealm();
    cleanupKeyLock();
    state.keyLockSession = window.initKeyLocksGame(el('keyLocksMount'), {
      realm,
      difficulty: state.selectedDifficulty,
      onProgress: refreshProgress
    });
  }

  function mountTreasureMerge() {
    if (state.treasureMergeSession && typeof state.treasureMergeSession.cleanup === 'function') state.treasureMergeSession.cleanup();
    state.treasureMergeSession = window.initTreasureMergeGame(el('treasureMergeMount'), {
      realm: getSelectedRealm(),
      difficulty: state.selectedDifficulty,
      onRewardEarned: (payload) => {
        if (payload?.type !== 'star') return;
        window.Progress.awardStar();
        refreshProgress();
      }
    });
    state.isTreasureMergeActive = true;
  }


  function mountGuardianDash() {
    if (state.guardianDashSession && typeof state.guardianDashSession.cleanup === 'function') state.guardianDashSession.cleanup();
    state.selectedSkill = chooseSkillForRealm(state.selectedRealmId);
    state.guardianDashSession = window.initGuardianDashGame(el('guardianDashMount'), {
      realm: getSelectedRealm(),
      difficulty: state.selectedDifficulty,
      skill: state.selectedSkill,
      onRunComplete: (payload) => {
        if (!payload || payload.source !== 'guardianDash') return;
        if (payload.starEarned !== true) return;
        window.Progress.awardStar();
        refreshProgress();
      }
    });
    state.isGuardianDashActive = true;
  }


  function startTreasureMerge() {
    cleanupGuardianDashToIdle();
    mountTreasureMerge();
  }

  function startGuardianDash() {
    cleanupTreasureMergeToIdle();
    mountGuardianDash();
  }


  function cleanupEvenOddSort() {
    if (state.evenOddSortSession && typeof state.evenOddSortSession.cleanup === 'function') state.evenOddSortSession.cleanup();
    state.evenOddSortSession = null;
    const mount = el('evenOddSortMount');
    if (mount) mount.innerHTML = '<div class="game-idle"><p>Ready to sort?</p><p>Choose Even or Odd!</p></div>';
  }

  function mountEvenOddSort() {
    cleanupEvenOddSort();
    state.evenOddSortSession = window.initEvenOddSortGame(el('evenOddSortMount'), {
      realm: getSelectedRealm(),
      difficulty: state.selectedDifficulty,
      onRunComplete: (payload) => {
        if (!payload || payload.source !== 'evenOddSort' || payload.starEarned !== true) return;
        window.Progress.awardStar();
        refreshProgress();
      }
    });
  }

  function refreshSelectedActivityForContextChange() {
    cleanupTreasureMergeToIdle();
    cleanupGuardianDashToIdle();

    if (state.selectedActivity === 'evenOddSort') {
      mountEvenOddSort();
      return;
    }

    cleanupEvenOddSort();

    if (state.selectedActivity === 'keyLock') {
      mountKeyLockGame();
      return;
    }

    if (state.selectedActivity === 'quickQuest') {
      renderProblem();
    }
  }

  function wireActions() {
    addHubListener(el('startQuestBtn'), 'click', () => { setSelectedActivity('quickQuest'); renderProblem(); mountKeyLockGame(); refreshProgress(); });
    addHubListener(el('newProblemBtn'), 'click', () => { renderProblem(); refreshProgress(); });
    addHubListener(el('startTreasureMergeBtn'), 'click', startTreasureMerge);
    addHubListener(el('startGuardianDashBtn'), 'click', startGuardianDash);
    addHubListener(el('questStyleSillyBtn'), 'click', () => { state.questStyle = 'silly'; renderQuestStyleButtons(); });
    addHubListener(el('questStyleCalmBtn'), 'click', () => { state.questStyle = 'calm'; renderQuestStyleButtons(); });
    addHubListener(el('resetProgressBtn'), 'click', () => {
      const resetState = window.Progress.resetProgress();
      state.selectedDifficulty = resetState.selectedDifficulty;
      renderDifficulty();
      refreshSelectedActivityForContextChange();
      refreshProgress();
    });

    addHubListener(el('generateQuestBtn'), 'click', () => {
      const realm = getSelectedRealm();
      const packSize = Number(el('questPackSize')?.value || 1);
      const cards = [];
      for (let i = 0; i < packSize; i += 1) {
        state.selectedSkill = chooseSkillForRealm(state.selectedRealmId);
        cards.push(window.generateGuardianQuest({ realm, difficulty: state.selectedDifficulty, skill: state.selectedSkill, style: state.questStyle }));
      }
      el('generatedQuest').innerHTML = cards.map((card) => `
        <article class="guardian-card">
          <h3>${card.title}</h3>
          <p><strong>Difficulty:</strong> ${card.difficulty}</p>
          <p><strong>Skill:</strong> ${card.skillLabel}</p>
          <p><strong>Solve:</strong> ${card.mathPrompt}</p>
          <p><strong>Action:</strong> ${card.action}</p>
          <p><strong>Board Bonus:</strong> ${card.boardReward}</p>
          <p class="guardian-answer"><strong>Answer:</strong> ${card.answer}</p>
          <p class="guardian-tip"><strong>Parent Tip:</strong> ${card.parentTip}</p>
        </article>
      `).join('');
    });

    addHubListener(el('printQuestBtn'), 'click', () => { window.print(); });
    addHubListener(el('printCaveCertificateBtn'), 'click', () => { window.print(); });
  }

  function renderParentResources() {
    const list = el('parentResources');
    list.innerHTML = '';
    window.NH_DATA.parentResources.forEach((item) => {
      const li = document.createElement('li');
      li.textContent = item;
      list.appendChild(li);
    });
  }

  function init() {
    const progress = window.Progress.getProgress();
    state.selectedDifficulty = progress.selectedDifficulty || state.selectedDifficulty;
    state.selectedRealmId = window.NH_DATA.realms[0].id;
    state.selectedSkill = chooseSkillForRealm(state.selectedRealmId);
    el('selectedRealmLabel').textContent = `Realm: ${getSelectedRealm().name}`;

    renderDifficulty();
    renderRealms();
    renderProblem();
    renderParentResources();
    renderQuestStyleButtons();
    wireActions();
    mountKeyLockGame();
    renderTreasureMergeIdle();
    renderGuardianDashIdle();
    cleanupEvenOddSort();
    renderActivityCards();
    renderActivityPanels();
    refreshProgress();
  }

  function destroyHub(root) {
    const hubRoot = findHubRoot(root);
    if (!hubRoot || !hubRoot.__numberHunterHubInstance) return;
    cleanupTreasureMergeToIdle();
    cleanupGuardianDashToIdle();
    cleanupEvenOddSort();
    cleanupKeyLock();
    cleanupHubListeners();
    delete hubRoot.__numberHunterHubInstance;
    if (activeRoot === hubRoot) activeRoot = null;
  }

  function initHub(root) {
    const hubRoot = findHubRoot(root);
    if (!hubRoot) return null;
    if (hubRoot.__numberHunterHubInstance) return hubRoot.__numberHunterHubInstance;
    activeRoot = hubRoot;
    const instance = { destroy: () => destroyHub(hubRoot) };
    hubRoot.__numberHunterHubInstance = instance;
    init();
    return instance;
  }

  window.NumberHunterQuestHub = {
    init: initHub,
    destroy: destroyHub
  };

  function autoInit() {
    window.NumberHunterQuestHub.init(document.getElementById('numberHunterHub'));
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', autoInit, { once: true });
  else autoInit();

  document.addEventListener('shopify:section:load', (event) => {
    window.NumberHunterQuestHub.init(event.target);
  });

  document.addEventListener('shopify:section:unload', (event) => {
    window.NumberHunterQuestHub.destroy(event.target);
  });
})();
