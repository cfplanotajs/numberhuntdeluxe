(function () {
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

  function el(id) { return document.getElementById(id); }

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
      card.className = `activity-card ${state.selectedActivity === activity.id ? 'selected' : ''}`;
      let rewardLabel = activity.rewardLabel;
      if (activity.id === 'keyLock' && keyEarned) rewardLabel = 'Key Earned!';
      card.innerHTML = `<strong>${activity.title}</strong><small>${activity.description}</small><span>${rewardLabel}</span>`;
      card.addEventListener('click', () => setSelectedActivity(activity.id));
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
      b.className = `btn ${state.selectedDifficulty === d.id ? 'btn-primary' : ''}`;
      b.textContent = d.name;
      b.addEventListener('click', () => {
        state.selectedDifficulty = d.id;
        const p = window.Progress.getProgress();
        p.selectedDifficulty = d.id;
        window.Progress.saveProgress(p);
        renderDifficulty();
        renderProblem();
        mountKeyLockGame();
        cleanupTreasureMergeToIdle();
        cleanupGuardianDashToIdle();
        cleanupEvenOddSort();
        setSelectedActivity('quickQuest');
      refreshProgress();
        renderActivityCards();
        renderActivityPanels();
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
      b.className = `realm-card realm-${realm.id} ${state.selectedRealmId === realm.id ? 'selected' : ''} ${keyEarned ? 'realm-earned' : 'realm-needed'}`;
      b.innerHTML = `<strong>${realm.name}</strong><br><small>${getSkillLabel(skill)}</small><br><small>${keyEarned ? 'Key Earned!' : 'Key Needed'}</small>`;
      b.addEventListener('click', () => {
        state.selectedRealmId = realm.id;
        state.selectedSkill = chooseSkillForRealm(realm.id);
        el('selectedRealmLabel').textContent = `Realm: ${realm.name}`;
        renderRealms();
        renderProblem();
        mountKeyLockGame();
        cleanupTreasureMergeToIdle();
        cleanupGuardianDashToIdle();
        cleanupEvenOddSort();
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
      b.addEventListener('click', () => {
        if (!state.currentQuickQuest || state.currentQuickQuest.solved) return;
        if (c === p.answer) {
          state.currentQuickQuest.solved = true;
          window.Progress.awardStar();
          disableAllChoices();
          b.classList.remove('btn-ghost');
          b.classList.add('btn-primary');
          el('problemPrompt').textContent = `${p.prompt} ✓ Great Job!`;
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

    el('progressSummary').textContent = `Stars: ${p.stars} • Keys: ${keys} / ${keyTarget} • Level: ${p.selectedDifficulty}`;
    el('caveStatus').textContent = caveOpen ? 'Treasure Cave Unlocked!' : 'Treasure Cave Locked';
    el('caveDetails').textContent = caveOpen ? 'You found every realm key!' : `Find all ${keyTarget} realm keys to open it. Keys Found: ${keys} / ${keyTarget}`;
    el('nextHint').textContent = caveOpen ? 'The Treasure Cave is open!' : (realmKey ? 'Try Treasure Merge or Guardian Dash to earn stars.' : `Next: Play Key Lock in ${realm.name} to earn the ${realm.name} Key.`);

    if (checklist) {
      checklist.innerHTML = window.NH_DATA.realms.map((r) => {
        const earned = !!p.realmKeys[r.id];
        return `<li class="${earned ? 'earned' : 'missing'}">${r.name} Key: ${earned ? 'Earned!' : 'Missing'}</li>`;
      }).join('');
    }

    if (rewardRoom) {
      if (caveOpen) {
        const today = new Date().toLocaleDateString();
        rewardRoom.innerHTML = `
          <div class="certificate-block">
            <h3>Number Hunter Champion</h3>
            <p>You unlocked all 6 realm keys and opened the Treasure Cave.</p>
            <p><strong>Total Stars:</strong> ${p.stars}</p>
            <p><strong>Date:</strong> ${today}</p>
            <p class="cave-celebrate">Treasure found! Great adventuring!</p>
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
    mount.innerHTML = `<div class="game-idle"><p>Ready to merge treasures?</p><p>Pick a realm, then press Start.</p></div>`;
  }

  function renderGuardianDashIdle() {
    const mount = el('guardianDashMount');
    if (!mount) return;
    mount.innerHTML = `<div class="game-idle"><p>Ready to dash through answer gates?</p><p>Press Start when you're ready.</p></div>`;
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
    cleanupEvenOddSort();
  }

  function mountKeyLockGame() {
    const realm = getSelectedRealm();
    if (state.keyLockSession && typeof state.keyLockSession.cleanup === 'function') state.keyLockSession.cleanup();
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

  function wireActions() {
    el('startQuestBtn').addEventListener('click', () => { setSelectedActivity('quickQuest'); renderProblem(); mountKeyLockGame(); refreshProgress(); });
    el('newProblemBtn').addEventListener('click', () => { renderProblem(); refreshProgress(); });
    el('startTreasureMergeBtn').addEventListener('click', startTreasureMerge);
    el('startGuardianDashBtn').addEventListener('click', startGuardianDash);
    el('questStyleSillyBtn').addEventListener('click', () => { state.questStyle = 'silly'; renderQuestStyleButtons(); });
    el('questStyleCalmBtn').addEventListener('click', () => { state.questStyle = 'calm'; renderQuestStyleButtons(); });
    el('resetProgressBtn').addEventListener('click', () => {
      const resetState = window.Progress.resetProgress();
      state.selectedDifficulty = resetState.selectedDifficulty;
      renderDifficulty();
      renderProblem();
      mountKeyLockGame();
      cleanupTreasureMergeToIdle();
      cleanupGuardianDashToIdle();
      cleanupEvenOddSort();
      refreshProgress();
    });

    el('generateQuestBtn').addEventListener('click', () => {
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
          <p><strong>Board Reward:</strong> ${card.boardReward}</p>
          <p class="guardian-answer"><strong>Answer:</strong> ${card.answer}</p>
          <p class="guardian-tip"><strong>Parent Tip:</strong> ${card.parentTip}</p>
        </article>
      `).join('');
    });

    el('printQuestBtn').addEventListener('click', () => { window.print(); });
    if (el('printCaveCertificateBtn')) el('printCaveCertificateBtn').addEventListener('click', () => { window.print(); });
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

  document.addEventListener('DOMContentLoaded', init);
})();
