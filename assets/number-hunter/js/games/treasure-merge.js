(function () {
  const REALM_SKINS = {
    jungle: { label: 'Fruit', color: '#89d97f' },
    frozen: { label: 'Snowball', color: '#9fdfff' },
    ocean: { label: 'Bubble', color: '#88c9ff' },
    rainbow: { label: 'Crystal', color: '#cb9dff' },
    desert: { label: 'Gem', color: '#f7c67a' },
    volcano: { label: 'Lava Rock', color: '#ff8e7c' }
  };

  function valuesForDifficulty(difficulty) {
    if (difficulty === 'littleHunter') return [1, 2, 4];
    if (difficulty === 'numberAdventurer') return [2, 4, 8];
    return [2, 4, 8, 16];
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
    const skin = REALM_SKINS[realm.id] || REALM_SKINS.jungle;
    const availableValues = valuesForDifficulty(difficulty);

    let score = 0;
    let bestMerge = 0;
    let active = true;
    let nextValue = availableValues[Math.floor(Math.random() * availableValues.length)];
    let isCleanedUp = false;

    let engine;
    let render;
    let runner;
    let collisionHandler;
    let boardEl;
    let scoreEl;
    let bestEl;
    let mathEl;
    let nextEl;
    let laneEl;
    let dropEl;
    let restartEl;

    function makeBall(x, y, value) {
      const radius = 16 + Math.min(24, Math.log2(value) * 5);
      const b = Matter.Bodies.circle(x, y, radius, {
        restitution: 0.15,
        friction: 0.02,
        render: { fillStyle: skin.color }
      });
      b.gameValue = value;
      return b;
    }

    function updateHud(msg) {
      if (!scoreEl || !bestEl || !mathEl || !nextEl) return;
      scoreEl.textContent = `Score: ${score}`;
      bestEl.textContent = `Best Merge: ${bestMerge}`;
      if (msg) mathEl.textContent = msg;
      nextEl.textContent = `Next ${skin.label}: ${nextValue}`;
      onScoreChange(score);
    }

    function checkGameOver() {
      if (!active || !engine) return;
      const dynamic = Matter.Composite.allBodies(engine.world).filter((b) => !b.isStatic);
      const tooHigh = dynamic.some((b) => b.position.y < 40 && b.speed < 0.2);
      if (tooHigh && dynamic.length > 8) {
        active = false;
        if (dropEl) dropEl.disabled = true;
        if (mathEl) mathEl.textContent = 'Treasure pile is full!';
        onGameEnd({ score, bestMerge, realm: realm.id });
      }
    }

    function spawnDrop() {
      if (!active || !engine || !laneEl) return;
      const x = Number(laneEl.value);
      Matter.World.add(engine.world, makeBall(x, 25, nextValue));
      nextValue = availableValues[Math.floor(Math.random() * availableValues.length)];
      updateHud();
      setTimeout(checkGameOver, 600);
    }

    function renderShell() {
      mountEl.innerHTML = `
        <div class="merge-wrap merge-${realm.id}">
          <h3>Treasure Merge</h3>
          <p class="merge-realm">Realm: ${realm.name}</p>
          <p class="merge-tip">Merge matching numbers!</p>
          <div class="merge-stats">
            <span id="mergeScore">Score: 0</span>
            <span id="mergeBest">Best Merge: 0</span>
          </div>
          <p id="mergeMath" class="merge-math">Great merge!</p>
          <p id="mergeNext" class="merge-next">Next ${skin.label}: ${nextValue}</p>
          <div id="mergeBoard" class="merge-board" aria-label="Treasure Merge board"></div>
          <div class="merge-controls">
            <label for="mergeX">Drop Lane</label>
            <input id="mergeX" type="range" min="20" max="280" value="150" />
            <button id="mergeDrop" class="btn btn-primary" type="button">Drop</button>
            <button id="mergeRestart" class="btn" type="button">Play Again</button>
          </div>
        </div>`;

      boardEl = mountEl.querySelector('#mergeBoard');
      scoreEl = mountEl.querySelector('#mergeScore');
      bestEl = mountEl.querySelector('#mergeBest');
      mathEl = mountEl.querySelector('#mergeMath');
      nextEl = mountEl.querySelector('#mergeNext');
      laneEl = mountEl.querySelector('#mergeX');
      dropEl = mountEl.querySelector('#mergeDrop');
      restartEl = mountEl.querySelector('#mergeRestart');
    }

    function setupWorld() {
      const width = 300;
      const height = 360;
      engine = Matter.Engine.create();
      runner = Matter.Runner.create();
      render = Matter.Render.create({
        element: boardEl,
        engine,
        options: { width, height, wireframes: false, background: '#f8fbff' }
      });

      const floor = Matter.Bodies.rectangle(width / 2, height + 15, width, 30, { isStatic: true });
      const leftWall = Matter.Bodies.rectangle(-15, height / 2, 30, height, { isStatic: true });
      const rightWall = Matter.Bodies.rectangle(width + 15, height / 2, 30, height, { isStatic: true });
      Matter.World.add(engine.world, [floor, leftWall, rightWall]);

      collisionHandler = function (event) {
        const consumedBodies = new Set();
        event.pairs.forEach((pair) => {
          const a = pair.bodyA;
          const b = pair.bodyB;
          if (!a || !b || !a.gameValue || !b.gameValue || a.gameValue !== b.gameValue) return;
          if (consumedBodies.has(a.id) || consumedBodies.has(b.id)) return;
          if (!Matter.Composite.get(engine.world, a.id, 'body') || !Matter.Composite.get(engine.world, b.id, 'body')) return;

          consumedBodies.add(a.id);
          consumedBodies.add(b.id);

          const mergedValue = a.gameValue * 2;
          const x = (a.position.x + b.position.x) / 2;
          const y = (a.position.y + b.position.y) / 2;

          Matter.World.remove(engine.world, a);
          Matter.World.remove(engine.world, b);
          Matter.World.add(engine.world, makeBall(x, y, mergedValue));

          score += mergedValue;
          bestMerge = Math.max(bestMerge, mergedValue);
          updateHud(`${a.gameValue} + ${b.gameValue} = ${mergedValue}`);
        });
        checkGameOver();
      };

      Matter.Events.on(engine, 'collisionStart', collisionHandler);
      Matter.Render.run(render);
      Matter.Runner.run(runner, engine);

      dropEl.addEventListener('click', spawnDrop);
      restartEl.addEventListener('click', resetGame);
    }

    function tearDownWorld(clearMount) {
      if (dropEl) dropEl.removeEventListener('click', spawnDrop);
      if (restartEl) restartEl.removeEventListener('click', resetGame);
      if (engine && collisionHandler) Matter.Events.off(engine, 'collisionStart', collisionHandler);
      if (runner) Matter.Runner.stop(runner);
      if (render) Matter.Render.stop(render);
      if (engine) {
        Matter.World.clear(engine.world, false);
        Matter.Engine.clear(engine);
      }
      if (render && render.canvas && render.canvas.parentNode) render.canvas.parentNode.removeChild(render.canvas);
      if (render && render.textures) render.textures = {};

      engine = null;
      render = null;
      runner = null;
      collisionHandler = null;
      boardEl = null;
      scoreEl = null;
      bestEl = null;
      mathEl = null;
      nextEl = null;
      laneEl = null;
      dropEl = null;
      restartEl = null;

      if (clearMount) mountEl.innerHTML = '';
    }

    function resetGame() {
      if (isCleanedUp) return;
      score = 0;
      bestMerge = 0;
      active = true;
      nextValue = availableValues[Math.floor(Math.random() * availableValues.length)];
      tearDownWorld(false);
      renderShell();
      setupWorld();
      updateHud('Great merge!');
    }

    function cleanup() {
      if (isCleanedUp) return;
      isCleanedUp = true;
      active = false;
      tearDownWorld(true);
    }

    renderShell();
    setupWorld();
    updateHud('Great merge!');

    return { cleanup };
  }

  window.initTreasureMergeGame = initTreasureMergeGame;
})();
