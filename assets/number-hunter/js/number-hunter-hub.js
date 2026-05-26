(function () {
  const state = {
    selectedRealmId: 'jungle',
    selectedDifficulty: 'littleHunter',
    selectedSkill: 'additionWithin10',
    keyLockSession: null
  };

  function el(id) { return document.getElementById(id); }

  function getSelectedRealm() {
    return window.NH_DATA.realms.find((r) => r.id === state.selectedRealmId) || window.NH_DATA.realms[0];
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
      });
      mount.appendChild(b);
    });
  }

  function renderRealms() {
    const mount = el('realmGrid');
    mount.innerHTML = '';
    window.NH_DATA.realms.forEach((realm) => {
      const b = document.createElement('button');
      b.className = `realm-card realm-${realm.id} ${state.selectedRealmId === realm.id ? 'selected' : ''}`;
      b.textContent = realm.name;
      b.addEventListener('click', () => {
        state.selectedRealmId = realm.id;
        state.selectedSkill = (window.NH_DATA.realmSkillMap[realm.id] || realm.skillFocus)[0];
        el('selectedRealmLabel').textContent = `Realm: ${realm.name}`;
        renderRealms();
        renderProblem();
        mountKeyLockGame();
      });
      mount.appendChild(b);
    });
  }

  function renderProblem() {
    const p = window.MathEngine.generateProblem({ skill: state.selectedSkill, difficulty: state.selectedDifficulty });
    el('problemPrompt').textContent = p.prompt;
    const choices = el('problemChoices');
    choices.innerHTML = '';
    p.choices.forEach((c) => {
      const b = document.createElement('button');
      b.className = 'btn';
      b.textContent = c;
      b.addEventListener('click', () => {
        if (c === p.answer) {
          window.Progress.awardStar();
          refreshProgress();
        }
      });
      choices.appendChild(b);
    });
  }

  function refreshProgress() {
    const p = window.Progress.getProgress();
    const keys = Object.values(p.realmKeys).filter(Boolean).length;
    el('progressSummary').textContent = `Stars: ${p.stars} • Keys: ${keys} • Level: ${p.selectedDifficulty}`;
    el('caveStatus').textContent = p.caveUnlocked ? 'Unlocked! Treasure Cave is open!' : 'Locked: Earn 3 keys to unlock!';
  }

  function mountKeyLockGame() {
    const realm = getSelectedRealm();
    state.selectedSkill = (window.NH_DATA.realmSkillMap[realm.id] || realm.skillFocus)[0];
    state.keyLockSession = window.initKeyLocksGame(el('keyLocksMount'), {
      realm,
      difficulty: state.selectedDifficulty,
      onProgress: refreshProgress
    });
  }

  function wireActions() {
    el('startQuestBtn').addEventListener('click', () => {
      renderProblem();
      mountKeyLockGame();
    });
    el('newProblemBtn').addEventListener('click', renderProblem);
    el('awardStarBtn').addEventListener('click', () => { window.Progress.awardStar(); refreshProgress(); });
    el('earnKeyBtn').addEventListener('click', () => {
      window.Progress.unlockRealmKey(state.selectedRealmId);
      refreshProgress();
    });
    el('resetProgressBtn').addEventListener('click', () => {
      const resetState = window.Progress.resetProgress();
      state.selectedDifficulty = resetState.selectedDifficulty;
      renderDifficulty();
      refreshProgress();
      mountKeyLockGame();
    });

    el('generateQuestBtn').addEventListener('click', () => {
      const realm = getSelectedRealm();
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
    state.selectedSkill = window.NH_DATA.realms[0].skillFocus[0];
    el('selectedRealmLabel').textContent = `Realm: ${getSelectedRealm().name}`;

    renderDifficulty();
    renderRealms();
    renderProblem();
    refreshProgress();
    renderParentResources();
    wireActions();
    mountKeyLockGame();
  }

  document.addEventListener('DOMContentLoaded', init);
})();
