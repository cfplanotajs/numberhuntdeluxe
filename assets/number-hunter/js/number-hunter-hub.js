(function () {
  const state = {
    selectedRealmId: 'jungle',
    selectedDifficulty: 'littleHunter',
    selectedSkill: 'additionWithin10',
    keyLockSession: null,
    currentQuickQuest: null,
    treasureMergeSession: null,
    realmSkillIndex: {}
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
        mountTreasureMerge();
        refreshProgress();
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
        mountTreasureMerge();
        refreshProgress();
      });
      mount.appendChild(b);
    });
  }

  function renderProblem() {
    state.selectedSkill = chooseSkillForRealm(state.selectedRealmId);
    const p = window.MathEngine.generateProblem({ skill: state.selectedSkill, difficulty: state.selectedDifficulty });
    state.currentQuickQuest = { solved: false, answer: p.answer };

    el('problemPrompt').textContent = p.prompt;
    const choices = el('problemChoices');
    choices.innerHTML = '';

    function disableAllChoices() {
      choices.querySelectorAll('button').forEach((btn) => {
        btn.disabled = true;
        btn.classList.add('btn-ghost');
      });
    }

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

    el('progressSummary').textContent = `Stars: ${p.stars} • Keys: ${keys} / ${keyTarget} • Level: ${p.selectedDifficulty}`;
    el('caveStatus').textContent = caveOpen ? 'Treasure Cave Unlocked!' : 'Treasure Cave Locked';
    el('caveDetails').textContent = caveOpen ? 'You found every realm key! Open the Treasure!' : `Find all ${keyTarget} realm keys to open it. Keys Found: ${keys} / ${keyTarget}`;
    el('nextHint').textContent = caveOpen ? 'The Treasure Cave is open!' : (realmKey ? 'Try Treasure Merge to earn more stars.' : `Play Key Lock to earn the ${realm.name} Key.`);

    renderRealms();
  }

  function mountKeyLockGame() {
    const realm = getSelectedRealm();
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
  }

  function wireActions() {
    el('startQuestBtn').addEventListener('click', () => { renderProblem(); mountKeyLockGame(); mountTreasureMerge(); refreshProgress(); });
    el('newProblemBtn').addEventListener('click', () => { renderProblem(); refreshProgress(); });
    el('startTreasureMergeBtn').addEventListener('click', mountTreasureMerge);
    el('resetProgressBtn').addEventListener('click', () => {
      const resetState = window.Progress.resetProgress();
      state.selectedDifficulty = resetState.selectedDifficulty;
      renderDifficulty();
      renderProblem();
      mountKeyLockGame();
      mountTreasureMerge();
      refreshProgress();
    });

    el('generateQuestBtn').addEventListener('click', () => {
      const realm = getSelectedRealm();
      state.selectedSkill = chooseSkillForRealm(state.selectedRealmId);
      const text = window.generateGuardianQuest({ realm, difficulty: state.selectedDifficulty, skill: state.selectedSkill, style: 'silly' });
      el('generatedQuest').textContent = text;
    });
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
    wireActions();
    mountKeyLockGame();
    mountTreasureMerge();
    refreshProgress();
  }

  document.addEventListener('DOMContentLoaded', init);
})();
