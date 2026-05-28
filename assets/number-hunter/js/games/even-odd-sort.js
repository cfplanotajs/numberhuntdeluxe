(function () {
  function getStarGoal(difficulty) {
    if (difficulty === 'littleHunter') return 7;
    if (difficulty === 'numberAdventurer') return 8;
    return 8;
  }

  function initEvenOddSortGame(mountEl, options) {
    if (!mountEl) return { cleanup() {} };

    const realm = options?.realm || { id: 'ocean', name: 'Ocean' };
    const difficulty = options?.difficulty || 'littleHunter';
    const onRunComplete = typeof options?.onRunComplete === 'function' ? options.onRunComplete : function () {};

    const total = 10;
    const goal = getStarGoal(difficulty);
    let index = 0;
    let correct = 0;
    let wrongAttempts = 0;
    let current = null;
    let resolved = false;
    let cleaned = false;
    let runCompleteEmitted = false;
    let starRewardEmitted = false;
    let runToken = 0;
    const timers = new Set();

    function later(fn, ms, tokenAtSchedule) {
      const id = setTimeout(() => {
        timers.delete(id);
        if (cleaned || tokenAtSchedule !== runToken) return;
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
          <p class="sort-goal">Star Goal: ${goal} correct</p>
          <div class="sort-stats"><span id="sortCounter">1 / ${total}</span><span id="sortScore">Score: 0 / ${total}</span></div>
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

    function emitRunComplete(payload) {
      if (runCompleteEmitted || cleaned) return;
      runCompleteEmitted = true;
      if (payload.starEarned) starRewardEmitted = true;
      onRunComplete(payload);
    }

    function finishRun() {
      if (cleaned) return;
      setButtonsDisabled(true);
      const feedback = mountEl.querySelector('#sortFeedback');
      const token = mountEl.querySelector('#sortToken');
      const scoreEl = mountEl.querySelector('#sortScore');
      const playAgain = mountEl.querySelector('#sortPlayAgain');
      const starEarned = correct >= goal;
      token.textContent = 'Run Complete!';
      scoreEl.textContent = `Score: ${correct} / ${total}`;
      if (starEarned) {
        feedback.textContent = 'You earned a star!';
        feedback.classList.add('sort-earned-star');
      } else if (correct >= goal - 1) {
        feedback.textContent = 'You were close! Play again to earn a star.';
      } else {
        feedback.textContent = 'Nice sorting — try again!';
      }
      playAgain.style.display = 'inline-block';
      emitRunComplete({ correct, total, goal, starEarned, realmId: realm.id, difficulty, source: 'evenOddSort' });
    }

    function nextItem() {
      if (cleaned) return;
      if (index >= total) return finishRun();
      current = buildItem();
      resolved = false;
      wrongAttempts = 0;
      mountEl.querySelector('#sortCounter').textContent = `${index + 1} / ${total}`;
      mountEl.querySelector('#sortScore').textContent = `Score: ${correct} / ${total}`;
      mountEl.querySelector('#sortToken').textContent = String(current.value);
      const feedback = mountEl.querySelector('#sortFeedback');
      feedback.textContent = 'Sort the number!';
      feedback.classList.remove('sort-earned-star');
      setButtonsDisabled(false);
    }

    function handlePick(label, buttonEl) {
      if (cleaned || resolved || !current) return;
      if (label === current.answer) {
        resolved = true;
        correct += 1;
        index += 1;
        setButtonsDisabled(true);
        mountEl.querySelector('#sortScore').textContent = `Score: ${correct} / ${total}`;
        mountEl.querySelector('#sortFeedback').textContent = 'Great sort!';
        const token = runToken;
        later(nextItem, 420, token);
      } else {
        wrongAttempts += 1;
        mountEl.querySelector('#sortFeedback').textContent = wrongAttempts >= 2 ? `Try again! ${current.explanation}` : 'Try again!';
        buttonEl.classList.add('sort-wrong');
        const token = runToken;
        later(() => buttonEl.classList.remove('sort-wrong'), 250, token);
      }
    }

    function resetRun() {
      if (cleaned) return;
      runToken += 1;
      timers.forEach((id) => clearTimeout(id));
      timers.clear();
      index = 0;
      correct = 0;
      runCompleteEmitted = false;
      starRewardEmitted = false;
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
        runToken += 1;
        timers.forEach((id) => clearTimeout(id));
        timers.clear();
        mountEl.innerHTML = '';
      }
    };
  }

  window.initEvenOddSortGame = initEvenOddSortGame;
})();
