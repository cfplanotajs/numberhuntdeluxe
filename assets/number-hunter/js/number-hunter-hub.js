(function () {
  const state = { selectedRealmId: null, selectedDifficulty: 'littleHunter', selectedSkill: 'additionWithin10' };

  function el(id) { return document.getElementById(id); }

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
      });
      mount.appendChild(b);
    });
  }

  function renderRealms() {
    const mount = el('realmGrid');
    mount.innerHTML = '';
    window.NH_DATA.realms.forEach((realm) => {
      const b = document.createElement('button');
      b.className = `realm-card realm-${realm.id === 'frozen' ? 'frozen' : realm.id} ${state.selectedRealmId === realm.id ? 'selected' : ''}`;
      b.textContent = realm.name;
      b.addEventListener('click', () => {
        state.selectedRealmId = realm.id;
        state.selectedSkill = realm.skillFocus[0];
        el('selectedRealmLabel').textContent = `Realm: ${realm.name}`;
        renderRealms();
        renderProblem();
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

  function wireActions() {
    el('startQuestBtn').addEventListener('click', renderProblem);
    el('newProblemBtn').addEventListener('click', renderProblem);
    el('awardStarBtn').addEventListener('click', () => { window.Progress.awardStar(); refreshProgress(); });
    el('earnKeyBtn').addEventListener('click', () => {
      if (!state.selectedRealmId) return;
      window.Progress.unlockRealmKey(state.selectedRealmId);
      refreshProgress();
    });
    el('resetProgressBtn').addEventListener('click', () => { window.Progress.resetProgress(); refreshProgress(); });

    el('generateQuestBtn').addEventListener('click', () => {
      const realm = window.NH_DATA.realms.find((r) => r.id === state.selectedRealmId) || window.NH_DATA.realms[0];
      const text = window.generateGuardianQuest({ realm, difficulty: state.selectedDifficulty, skill: state.selectedSkill, style: 'silly' });
      el('generatedQuest').textContent = text;
    });
  }

  function renderParentResources() {
    const list = el('parentResources');
    window.NH_DATA.parentResources.forEach((item) => {
      const li = document.createElement('li');
      li.textContent = item;
      list.appendChild(li);
    });
  }

  function init() {
    const progress = window.Progress.getProgress();
    state.selectedDifficulty = progress.selectedDifficulty || state.selectedDifficulty;
    renderDifficulty();
    renderRealms();
    renderProblem();
    refreshProgress();
    renderParentResources();
    wireActions();
    window.initKeyLocksGame(el('keyLocksMount'), { skill: 'missingNumber', difficulty: state.selectedDifficulty });
  }

  document.addEventListener('DOMContentLoaded', init);
})();
