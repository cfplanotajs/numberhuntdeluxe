(function () {
  const KEY = 'numberHunterDeluxeQuestProgress';
  const BASE_PROGRESS = {
    selectedDifficulty: 'littleHunter',
    stars: 0,
    caveUnlocked: false
  };
  const BASE_REALM_KEYS = { jungle: false, frozen: false, ocean: false, rainbow: false, desert: false, volcano: false };

  function createDefaultProgress() {
    return {
      selectedDifficulty: BASE_PROGRESS.selectedDifficulty,
      stars: BASE_PROGRESS.stars,
      realmKeys: { ...BASE_REALM_KEYS },
      badges: [],
      caveUnlocked: BASE_PROGRESS.caveUnlocked
    };
  }

  function normalizeProgress(rawProgress) {
    const defaults = createDefaultProgress();
    const safe = rawProgress && typeof rawProgress === 'object' ? rawProgress : {};

    const normalized = {
      ...defaults,
      ...safe,
      realmKeys: {
        ...defaults.realmKeys,
        ...(safe.realmKeys && typeof safe.realmKeys === 'object' ? safe.realmKeys : {})
      },
      badges: Array.isArray(safe.badges) ? [...safe.badges] : []
    };

    updateCave(normalized);
    return normalized;
  }

  function getProgress() {
    try {
      const stored = JSON.parse(localStorage.getItem(KEY));
      return normalizeProgress(stored);
    } catch (_) {
      return createDefaultProgress();
    }
  }

  function saveProgress(progress) {
    const normalized = normalizeProgress(progress);
    try {
      localStorage.setItem(KEY, JSON.stringify(normalized));
    } catch (error) {
      console.warn('Number Hunter progress was not saved to localStorage.', error);
    }
    return normalized;
  }

  function resetProgress() {
    return saveProgress(createDefaultProgress());
  }

  function awardStar() {
    const p = getProgress();
    p.stars += 1;
    updateCave(p);
    return saveProgress(p);
  }

  function unlockRealmKey(realmId) {
    const p = getProgress();
    if (p.realmKeys[realmId] !== undefined) p.realmKeys[realmId] = true;
    updateCave(p);
    return saveProgress(p);
  }

  function isCaveUnlocked() {
    return getProgress().caveUnlocked;
  }

  function updateCave(progress) {
    const unlocked = Object.values(progress.realmKeys).filter(Boolean).length >= (window.NH_DATA?.rewards?.caveKeyTarget || 3);
    progress.caveUnlocked = unlocked;
  }

  window.Progress = { getProgress, saveProgress, resetProgress, awardStar, unlockRealmKey, isCaveUnlocked, createDefaultProgress };
})();
