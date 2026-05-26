(function () {
  function initGuardianDashGame(mountEl, options) {
    if (!mountEl) return { cleanup() {} };

    const realm = options?.realm || { id: 'jungle', name: 'Jungle' };
    const difficulty = options?.difficulty || 'littleHunter';
    const skill = options?.skill || 'additionWithin10';
    const onRunComplete = typeof options?.onRunComplete === 'function' ? options.onRunComplete : function () {};

    let isCleaned = false;
    let questionIndex = 0;
    let correct = 0;
    const total = 5;
    let currentProblem = null;
    let solved = false;
    let wrongAttempts = 0;
    let runnerTimer = null;
    let runnerStep = 0;

    mountEl.innerHTML = `
      <div class="dash-wrap">
        <h3>Guardian Dash</h3>
        <p class="dash-realm">Realm: ${realm.name}</p>
        <p class="dash-tip">Pick the right gate!</p>
        <div class="dash-stats"><span id="dashCounter">Question 1 / ${total}</span><span id="dashScore">Score: 0</span></div>
        <div class="dash-lane"><div id="dashRunner" class="dash-runner">🏃</div></div>
        <p id="dashPrompt" class="dash-prompt"></p>
        <div id="dashChoices" class="dash-choices"></div>
        <p id="dashFeedback" class="dash-feedback">Dash!</p>
        <button id="dashPlayAgain" class="btn" type="button" style="display:none;">Play Again</button>
      </div>`;

    const counterEl = mountEl.querySelector('#dashCounter');
    const scoreEl = mountEl.querySelector('#dashScore');
    const promptEl = mountEl.querySelector('#dashPrompt');
    const choicesEl = mountEl.querySelector('#dashChoices');
    const feedbackEl = mountEl.querySelector('#dashFeedback');
    const playAgainEl = mountEl.querySelector('#dashPlayAgain');
    const runnerEl = mountEl.querySelector('#dashRunner');

    function startRunner() {
      stopRunner();
      runnerStep = 0;
      runnerEl.style.left = '0%';
      runnerTimer = setInterval(() => {
        if (isCleaned || solved) return;
        runnerStep = Math.min(100, runnerStep + 4);
        runnerEl.style.left = `${runnerStep}%`;
      }, 350);
    }

    function stopRunner() {
      if (runnerTimer) clearInterval(runnerTimer);
      runnerTimer = null;
    }

    function buildQuestion() {
      solved = false;
      wrongAttempts = 0;
      currentProblem = window.MathEngine.generateProblem({
        skill,
        difficulty,
        choices: difficulty === 'masterHunter' ? 4 : 3
      });
      counterEl.textContent = `Question ${questionIndex + 1} / ${total}`;
      scoreEl.textContent = `Score: ${correct}`;
      promptEl.textContent = currentProblem.prompt;
      feedbackEl.textContent = 'Dash!';
      choicesEl.innerHTML = '';

      currentProblem.choices.forEach((choice) => {
        const gate = document.createElement('button');
        gate.className = 'btn dash-gate';
        gate.type = 'button';
        gate.textContent = choice;
        gate.addEventListener('click', () => {
          if (isCleaned || solved) return;
          if (choice === currentProblem.answer) {
            solved = true;
            correct += 1;
            feedbackEl.textContent = 'Great job!';
            stopRunner();
            disableChoices();
            setTimeout(nextQuestion, 500);
          } else {
            wrongAttempts += 1;
            feedbackEl.textContent = wrongAttempts >= 2 ? `Try again! ${currentProblem.explanation}` : 'Try again!';
            gate.classList.add('dash-wrong');
            setTimeout(() => gate.classList.remove('dash-wrong'), 250);
          }
        });
        choicesEl.appendChild(gate);
      });

      startRunner();
    }

    function disableChoices() {
      choicesEl.querySelectorAll('button').forEach((b) => { b.disabled = true; });
    }

    function nextQuestion() {
      if (isCleaned) return;
      questionIndex += 1;
      if (questionIndex >= total) {
        runComplete();
        return;
      }
      buildQuestion();
    }

    function runComplete() {
      stopRunner();
      disableChoices();
      promptEl.textContent = 'Run Complete!';
      scoreEl.textContent = `Score: ${correct} / ${total}`;
      if (correct === total) feedbackEl.textContent = 'Amazing dash!';
      else if (correct >= 3) feedbackEl.textContent = 'Great run!';
      else feedbackEl.textContent = 'Nice try — play again!';
      playAgainEl.style.display = 'inline-block';
      onRunComplete({ correct, total, realmId: realm.id, difficulty, skill });
    }

    function resetRun() {
      if (isCleaned) return;
      questionIndex = 0;
      correct = 0;
      playAgainEl.style.display = 'none';
      buildQuestion();
    }

    playAgainEl.addEventListener('click', resetRun);
    buildQuestion();

    function cleanup() {
      if (isCleaned) return;
      isCleaned = true;
      stopRunner();
      mountEl.innerHTML = '';
    }

    return { cleanup };
  }

  window.initGuardianDashGame = initGuardianDashGame;
})();
