(function () {
  const KEY = 'numberHunterProgress';
  const defaultProgress = {
    selectedDifficulty: 'littleHunter',
    stars: 0,
    realmKeys: { jungle: false, frozen: false, ocean: false, rainbow: false, desert: false, volcano: false },
    badges: [],
    caveUnlocked: false
  };

  function getProgress() {
    try { return { ...defaultProgress, ...(JSON.parse(localStorage.getItem(KEY)) || {}) }; }
    catch (_) { return { ...defaultProgress }; }
  }
  function saveProgress(progress) { localStorage.setItem(KEY, JSON.stringify(progress)); return progress; }
  function resetProgress() { return saveProgress({ ...defaultProgress, realmKeys: { ...defaultProgress.realmKeys }, badges: [] }); }
  function awardStar() { const p = getProgress(); p.stars += 1; updateCave(p); return saveProgress(p); }
  function unlockRealmKey(realmId) { const p = getProgress(); if (p.realmKeys[realmId] !== undefined) p.realmKeys[realmId] = true; updateCave(p); return saveProgress(p); }
  function isCaveUnlocked() { return getProgress().caveUnlocked; }
  function updateCave(progress) { const unlocked = Object.values(progress.realmKeys).filter(Boolean).length >= (window.NH_DATA?.rewards?.caveKeyTarget || 3); progress.caveUnlocked = unlocked; }

  window.Progress = { getProgress, saveProgress, resetProgress, awardStar, unlockRealmKey, isCaveUnlocked };
})();
