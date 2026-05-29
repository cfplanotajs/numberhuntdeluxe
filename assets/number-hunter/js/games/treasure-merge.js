(function () {
  const REALM_SKINS = {
    jungle: { label: 'Fruit', color: '#89d97f', stroke: '#4f9f48' },
    frozen: { label: 'Snowball', color: '#9fdfff', stroke: '#4a8ab0' },
    ocean: { label: 'Bubble', color: '#88c9ff', stroke: '#2f6ea3' },
    rainbow: { label: 'Crystal', color: '#cb9dff', stroke: '#7952b3' },
    desert: { label: 'Gem', color: '#f7c67a', stroke: '#a36b1d' },
    volcano: { label: 'Lava Rock', color: '#ff8e7c', stroke: '#a04335' }
  };

  const STAR_GOALS = {
    littleHunter: 16,
    numberAdventurer: 32,
    masterHunter: 64
  };

  function pickNextValue(difficulty) {
    if (window.MathEngine && typeof window.MathEngine.pickMergeValue === 'function') {
      return window.MathEngine.pickMergeValue({ difficulty });
    }
    // Minimal safe fallback if MathEngine is unavailable
    if (difficulty === 'littleHunter') return 1;
    if (difficulty === 'masterHunter') return 2;
    return 2;
  }

  function initTreasureMergeGame(mountEl, options) {
    if (!mountEl) return { cleanup() {} };
    if (!window.Matter) {
      mountEl.innerHTML = '<p class="merge-fallback">Treasure Merge could not load. Try refreshing the page.</p>';
      return { cleanup() { mountEl.innerHTML = ''; } };
    }

    const Matter = window.Matter;
    const realm = options?.realm || { id: 'jungle', name: 'Jungle' };
    const difficulty = options?.difficulty || 'littleHunter';
    const onScoreChange = typeof options?.onScoreChange === 'function' ? options.onScoreChange : function () {};
    const onGameEnd = typeof options?.onGameEnd === 'function' ? options.onGameEnd : function () {};
    const onRewardEarned = typeof options?.onRewardEarned === 'function' ? options.onRewardEarned : function () {};
    const skin = REALM_SKINS[realm.id] || REALM_SKINS.jungle;
    const starGoal = STAR_GOALS[difficulty] || 32;

    let score = 0;
    let bestMerge = 0;
    let active = true;
    let nextValue = pickNextValue(difficulty);
    let isCleanedUp = false;
    let lastDropAt = 0;
    let dropX = 150;
    let starAwardedThisSession = false;

    let engine; let render; let runner; let collisionHandler; let afterRenderHandler;
    let boardEl; let scoreEl; let bestEl; let mathEl; let nextEl; let laneEl; let dropEl; let restartEl; let markerEl;
    let starGoalEl; let starProgressEl; let starStatusEl;
    let laneInputHandler;
    let width = 300; let height = 380;

    function calcBoardSize() {
      const available = Math.max(260, Math.min(420, Math.floor((mountEl.clientWidth || 320) - 24)));
      width = available;
      height = 380;
      dropX = Math.max(22, Math.min(width - 22, dropX));
    }

    function makeBall(x, y, value) {
      const radius = 17 + Math.min(22, Math.log2(value || 1) * 4);
      const b = Matter.Bodies.circle(x, y, radius, {
        restitution: 0.14,
        friction: 0.02,
        render: { fillStyle: skin.color, strokeStyle: skin.stroke, lineWidth: 2 }
      });
      b.gameValue = value;
      return b;
    }

    function maybeAwardStar() {
      if (isCleanedUp || !active || starAwardedThisSession || score < starGoal) return;
      starAwardedThisSession = true;
      if (starStatusEl) starStatusEl.textContent = 'You earned a star!';
      onRewardEarned({ type: 'star', source: 'treasureMerge', score, realmId: realm.id, difficulty });
    }

    function updateMarker() {
      if (!markerEl) return;
      markerEl.style.left = `${dropX}px`;
      markerEl.textContent = `↓ ${nextValue}`;
    }

    function updateHud(msg) {
      if (!scoreEl || !bestEl || !mathEl || !nextEl) return;
      scoreEl.textContent = `Score: ${score}`;
      bestEl.textContent = `Best Merge: ${bestMerge}`;
      if (msg) mathEl.textContent = msg;
      nextEl.textContent = `Next ${skin.label}: ${nextValue}`;
      if (starGoalEl) starGoalEl.textContent = `Star Goal: ${starGoal}`;
      if (starProgressEl) starProgressEl.textContent = `Score: ${Math.min(score, starGoal)} / ${starGoal}`;
      if (starStatusEl && !starAwardedThisSession) starStatusEl.textContent = 'Keep merging!';
      updateMarker();
      maybeAwardStar();
      onScoreChange(score);
    }

    function checkGameOver() {
      if (!active || !engine) return;
      const dynamic = Matter.Composite.allBodies(engine.world).filter((b) => !b.isStatic);
      const tooHigh = dynamic.some((b) => b.position.y < 44 && b.speed < 0.2);
      if (tooHigh && dynamic.length > 8) {
        active = false;
        if (dropEl) dropEl.disabled = true;
        if (mathEl) mathEl.textContent = 'Treasure pile is full! Play Again?';
        onGameEnd({ score, bestMerge, realm: realm.id });
      }
    }

    function spawnDrop() {
      if (!active || !engine) return;
      const now = Date.now();
      if (now - lastDropAt < 220) return;
      lastDropAt = now;
      Matter.World.add(engine.world, makeBall(dropX, 26, nextValue));
      nextValue = pickNextValue(difficulty);
      updateHud('Drop treasure!');
      setTimeout(checkGameOver, 650);
    }

    function onBoardPointer(event) {
      if (!active || !boardEl) return;
      const rect = boardEl.getBoundingClientRect();
      const x = (event.touches?.[0]?.clientX ?? event.clientX) - rect.left;
      dropX = Math.max(22, Math.min(width - 22, x));
      if (laneEl) laneEl.value = String(Math.round(dropX));
      updateMarker();
    }

    function renderShell() {
      calcBoardSize();
      mountEl.innerHTML = `
        <div class="merge-wrap merge-${realm.id}">
          <h3>Treasure Merge</h3>
          <p class="merge-realm">Realm: ${realm.name}</p>
          <p class="merge-tip">Match numbers. Make treasure!</p>
          <div class="merge-stats">
            <span id="mergeScore">Score: 0</span>
            <span id="mergeBest">Best Merge: 0</span>
          </div>
          <p id="mergeMath" class="merge-math">Drop treasure!</p>
          <p id="mergeNext" class="merge-next">Next ${skin.label}: ${nextValue}</p>
          <div class="merge-star-row">
            <span id="mergeStarGoal">Star Goal: ${starGoal}</span>
            <span id="mergeStarProgress">Score: 0 / ${starGoal}</span>
          </div>
          <p id="mergeStarStatus" class="merge-star-status">Keep merging!</p>
          <div id="mergeBoard" class="merge-board" aria-label="Treasure Merge board">
            <div id="mergeDropMarker" class="merge-drop-marker">↓ ${nextValue}</div>
          </div>
          <div class="merge-controls">
            <label for="mergeX">Pick drop spot</label>
            <input id="mergeX" type="range" min="22" max="${Math.max(22, width - 22)}" value="${Math.round(dropX)}" />
            <button id="mergeDrop" class="btn btn-primary" type="button">Drop</button>
            <button id="mergeRestart" class="btn" type="button">Play Again</button>
          </div>
        </div>`;

      boardEl = mountEl.querySelector('#mergeBoard');
      markerEl = mountEl.querySelector('#mergeDropMarker');
      scoreEl = mountEl.querySelector('#mergeScore');
      bestEl = mountEl.querySelector('#mergeBest');
      mathEl = mountEl.querySelector('#mergeMath');
      nextEl = mountEl.querySelector('#mergeNext');
      laneEl = mountEl.querySelector('#mergeX');
      dropEl = mountEl.querySelector('#mergeDrop');
      restartEl = mountEl.querySelector('#mergeRestart');
      starGoalEl = mountEl.querySelector('#mergeStarGoal');
      starProgressEl = mountEl.querySelector('#mergeStarProgress');
      starStatusEl = mountEl.querySelector('#mergeStarStatus');
      boardEl.style.height = `${height}px`;
      updateMarker();
    }

    function setupWorld() {
      engine = Matter.Engine.create();
      runner = Matter.Runner.create();
      render = Matter.Render.create({ element: boardEl, engine, options: { width, height, wireframes: false, background: '#f8fbff' } });

      Matter.World.add(engine.world, [
        Matter.Bodies.rectangle(width / 2, height + 15, width, 30, { isStatic: true }),
        Matter.Bodies.rectangle(-15, height / 2, 30, height, { isStatic: true }),
        Matter.Bodies.rectangle(width + 15, height / 2, 30, height, { isStatic: true })
      ]);

      collisionHandler = function (event) {
        const consumedBodies = new Set();
        event.pairs.forEach((pair) => {
          const a = pair.bodyA; const b = pair.bodyB;
          if (!a || !b || !a.gameValue || !b.gameValue || a.gameValue !== b.gameValue) return;
          if (consumedBodies.has(a.id) || consumedBodies.has(b.id)) return;
          if (!Matter.Composite.get(engine.world, a.id, 'body') || !Matter.Composite.get(engine.world, b.id, 'body')) return;
          consumedBodies.add(a.id); consumedBodies.add(b.id);
          const mergedValue = a.gameValue * 2;
          Matter.World.remove(engine.world, a); Matter.World.remove(engine.world, b);
          Matter.World.add(engine.world, makeBall((a.position.x + b.position.x) / 2, (a.position.y + b.position.y) / 2, mergedValue));
          score += mergedValue; bestMerge = Math.max(bestMerge, mergedValue);
          updateHud(`${a.gameValue} + ${b.gameValue} = ${mergedValue}`);
        });
        checkGameOver();
      };

      afterRenderHandler = function () {
        const ctx = render.context;
        const bodies = Matter.Composite.allBodies(engine.world).filter((b) => !b.isStatic && b.gameValue);
        ctx.save();
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#1f2a44';
        bodies.forEach((b) => {
          const size = Math.max(14, Math.min(24, b.circleRadius * 0.9));
          ctx.font = `700 ${size}px Arial`;
          ctx.fillText(String(b.gameValue), b.position.x, b.position.y + 1);
        });
        ctx.restore();
      };

      Matter.Events.on(engine, 'collisionStart', collisionHandler);
      Matter.Events.on(render, 'afterRender', afterRenderHandler);
      Matter.Render.run(render);
      Matter.Runner.run(runner, engine);

      dropEl.addEventListener('click', spawnDrop);
      restartEl.addEventListener('click', resetGame);
      laneInputHandler = function () { dropX = Number(laneEl.value); updateMarker(); };
      laneEl.addEventListener('input', laneInputHandler);
      boardEl.addEventListener('click', onBoardPointer);
      boardEl.addEventListener('touchstart', onBoardPointer, { passive: true });
    }

    function tearDownWorld(clearMount) {
      if (dropEl) dropEl.removeEventListener('click', spawnDrop);
      if (restartEl) restartEl.removeEventListener('click', resetGame);
      if (laneEl && laneInputHandler) laneEl.removeEventListener('input', laneInputHandler);
      if (boardEl) {
        boardEl.removeEventListener('click', onBoardPointer);
        boardEl.removeEventListener('touchstart', onBoardPointer);
      }
      if (engine && collisionHandler) Matter.Events.off(engine, 'collisionStart', collisionHandler);
      if (render && afterRenderHandler) Matter.Events.off(render, 'afterRender', afterRenderHandler);
      if (runner) Matter.Runner.stop(runner);
      if (render) Matter.Render.stop(render);
      if (engine) { Matter.World.clear(engine.world, false); Matter.Engine.clear(engine); }
      if (render && render.canvas && render.canvas.parentNode) render.canvas.parentNode.removeChild(render.canvas);
      if (render && render.textures) render.textures = {};

      engine = null; render = null; runner = null; collisionHandler = null; afterRenderHandler = null;
      boardEl = null; scoreEl = null; bestEl = null; mathEl = null; nextEl = null; laneEl = null; dropEl = null; restartEl = null; markerEl = null; laneInputHandler = null;
      starGoalEl = null; starProgressEl = null; starStatusEl = null;
      if (clearMount) mountEl.innerHTML = '';
    }

    function resetGame() {
      if (isCleanedUp) return;
      score = 0; bestMerge = 0; active = true; lastDropAt = 0;
      starAwardedThisSession = false;
      nextValue = pickNextValue(difficulty);
      tearDownWorld(false);
      renderShell();
      setupWorld();
      updateHud('Drop treasure!');
    }

    function cleanup() {
      if (isCleanedUp) return;
      isCleanedUp = true;
      active = false;
      tearDownWorld(true);
    }

    renderShell();
    setupWorld();
    updateHud('Drop treasure!');

    return { cleanup };
  }

  window.initTreasureMergeGame = initTreasureMergeGame;
})();
