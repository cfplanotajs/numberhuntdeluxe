(function () {
  function initEvenOddSortGame(mountEl, options) {
    if (!mountEl) return { cleanup() {} };

    const realm = options?.realm || { id: 'ocean', name: 'Ocean' };
    const difficulty = options?.difficulty || 'littleHunter';
    const onRunComplete = typeof options?.onRunComplete === 'function' ? options.onRunComplete : function () {};

    const total = 10;
    let index = 0;
    let correct = 0;
    let wrongAttempts = 0;
    let current = null;
    let resolved = false;
    let cleaned = false;
    const timers = new Set();

    function later(fn, ms) {
      const id = setTimeout(() => {
        timers.delete(id);
        if (cleaned) return;
        fn();
      }, ms);
      timers.add(id);
      return id;
    }

    function buildItem() {
      const p = window.MathEngine.generateProblem({ skill: 'evenOdd', difficulty, choices: 2 });
      const value = Number(String(p.prompt).split(' ')[0]);
      return { value, answer: p.answer, explanation: p.explanation };
    }

    function renderShell() {
      mountEl.innerHTML = `
        <div class="sort-wrap sort-${realm.id}">
          <h3>Even/Odd Critter Sort</h3>
          <p class="sort-realm">Realm: ${realm.name}</p>
          <p class="sort-tip">Sort the number!</p>
          <div class="sort-stats"><span id="sortCounter">1 / ${total}</span><span id="sortScore">Score: 0</span></div>
          <div id="sortToken" class="sort-token">?</div>
          <div class="sort-zones">
            <button id="sortEven" class="btn sort-zone" type="button">Even</button>
            <button id="sortOdd" class="btn sort-zone" type="button">Odd</button>
          </div>
          <p id="sortFeedback" class="sort-feedback">Tap Even or Odd.</p>
          <button id="sortPlayAgain" class="btn" type="button" style="display:none;">Play Again</button>
        </div>`;
    }

    function setButtonsDisabled(disabled) {
      mountEl.querySelectorAll('.sort-zone').forEach((b) => { b.disabled = disabled; });
    }

    function finishRun() {
      setButtonsDisabled(true);
      const feedback = mountEl.querySelector('#sortFeedback');
      const token = mountEl.querySelector('#sortToken');
      const scoreEl = mountEl.querySelector('#sortScore');
      const playAgain = mountEl.querySelector('#sortPlayAgain');
      token.textContent = 'Run Complete!';
      scoreEl.textContent = `Score: ${correct} / ${total}`;
      if (correct >= 9) feedback.textContent = 'Amazing sorting!';
      else if (correct >= 6) feedback.textContent = 'Great work!';
      else feedback.textContent = 'Nice try — play again!';
      playAgain.style.display = 'inline-block';
      onRunComplete({ correct, total, realmId: realm.id, difficulty, source: 'evenOddSort' });
    }

    function nextItem() {
      if (cleaned) return;
      if (index >= total) return finishRun();
      current = buildItem();
      resolved = false;
      wrongAttempts = 0;
      mountEl.querySelector('#sortCounter').textContent = `${index + 1} / ${total}`;
      mountEl.querySelector('#sortScore').textContent = `Score: ${correct}`;
      mountEl.querySelector('#sortToken').textContent = String(current.value);
      mountEl.querySelector('#sortFeedback').textContent = 'Sort the number!';
      setButtonsDisabled(false);
    }

    function handlePick(label, buttonEl) {
      if (cleaned || resolved || !current) return;
      if (label === current.answer) {
        resolved = true;
        correct += 1;
        index += 1;
        setButtonsDisabled(true);
        mountEl.querySelector('#sortScore').textContent = `Score: ${correct}`;
        mountEl.querySelector('#sortFeedback').textContent = 'Great sort!';
        later(nextItem, 420);
      } else {
        wrongAttempts += 1;
        mountEl.querySelector('#sortFeedback').textContent = wrongAttempts >= 2 ? `Try again! ${current.explanation}` : 'Try again!';
        buttonEl.classList.add('sort-wrong');
        later(() => buttonEl.classList.remove('sort-wrong'), 250);
      }
    }

    function resetRun() {
      if (cleaned) return;
      index = 0;
      correct = 0;
      mountEl.querySelector('#sortPlayAgain').style.display = 'none';
      nextItem();
    }

    renderShell();
    const evenBtn = mountEl.querySelector('#sortEven');
    const oddBtn = mountEl.querySelector('#sortOdd');
    const playAgain = mountEl.querySelector('#sortPlayAgain');
    evenBtn.addEventListener('click', () => handlePick('Even', evenBtn));
    oddBtn.addEventListener('click', () => handlePick('Odd', oddBtn));
    playAgain.addEventListener('click', resetRun);
    nextItem();

    return {
      cleanup() {
        if (cleaned) return;
        cleaned = true;
        timers.forEach((id) => clearTimeout(id));
        timers.clear();
        mountEl.innerHTML = '';
      }
    };
  }

  window.initEvenOddSortGame = initEvenOddSortGame;
})();
