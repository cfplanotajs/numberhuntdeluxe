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
    let nextTimer = null;
    let questionToken = 0;
    let runCompleteEmitted = false;

    function getStarGoalForDifficulty(level) {
      if (level === 'littleHunter') return 3;
      if (level === 'numberAdventurer') return 4;
      return 4;
    }

    const starGoal = getStarGoalForDifficulty(difficulty);

    mountEl.innerHTML = `
      <div class="dash-wrap">
        <h3>Guardian Dash</h3>
        <p class="dash-realm">Realm: ${realm.name}</p>
        <p class="dash-tip">Pick the right gate!</p>
        <div class="dash-stats"><span id="dashCounter">Question 1 / ${total}</span><span id="dashScore">Score: 0 / ${total}</span></div>
        <p id="dashGoal" class="dash-goal">Star Goal: ${starGoal} correct</p>
        <div class="dash-lane"><div id="dashRunner" class="dash-runner">🏃</div></div>
        <p id="dashPrompt" class="dash-prompt"></p>
        <div id="dashChoices" class="dash-choices"></div>
        <p id="dashFeedback" class="dash-feedback">Go!</p>
        <p id="dashReward" class="dash-reward">Reach the Star Goal!</p>
        <button id="dashPlayAgain" class="btn" type="button" style="display:none;">Play Again</button>
      </div>`;

    const counterEl = mountEl.querySelector('#dashCounter');
    const scoreEl = mountEl.querySelector('#dashScore');
    const promptEl = mountEl.querySelector('#dashPrompt');
    const choicesEl = mountEl.querySelector('#dashChoices');
    const feedbackEl = mountEl.querySelector('#dashFeedback');
    const rewardEl = mountEl.querySelector('#dashReward');
    const goalEl = mountEl.querySelector('#dashGoal');
    const playAgainEl = mountEl.querySelector('#dashPlayAgain');
    const runnerEl = mountEl.querySelector('#dashRunner');

    function clearNextTimer() {
      if (nextTimer) clearTimeout(nextTimer);
      nextTimer = null;
    }

    function queueNextQuestion(delay) {
      clearNextTimer();
      const tokenAtSchedule = questionToken;
      nextTimer = setTimeout(() => {
        nextTimer = null;
        if (isCleaned || tokenAtSchedule !== questionToken) return;
        nextQuestion();
      }, delay);
    }

    function stopRunner() {
      if (runnerTimer) clearInterval(runnerTimer);
      runnerTimer = null;
    }

    function disableChoices() {
      choicesEl.querySelectorAll('button').forEach((b) => { b.disabled = true; });
    }

    function handleMiss() {
      if (isCleaned || solved) return;
      solved = true;
      stopRunner();
      disableChoices();
      feedbackEl.textContent = `Almost! Try the next gate. ${currentProblem.explanation}`;
      queueNextQuestion(700);
    }

    function startRunner() {
      stopRunner();
      runnerStep = 0;
      runnerEl.style.left = '0%';
      const tokenAtStart = questionToken;
      runnerTimer = setInterval(() => {
        if (isCleaned || solved || tokenAtStart !== questionToken) return;
        runnerStep = Math.min(100, runnerStep + 4);
        runnerEl.style.left = `${runnerStep}%`;
        if (runnerStep >= 100) handleMiss();
      }, 350);
    }

    function buildQuestion() {
      questionToken += 1;
      solved = false;
      wrongAttempts = 0;
      try {
        currentProblem = window.MathEngine.generateProblem({
          skill,
          difficulty,
          choices: difficulty === 'masterHunter' ? 4 : 3
        });
      } catch (err) {
        stopRunner();
        clearNextTimer();
        promptEl.textContent = 'Dash setup issue.';
        feedbackEl.textContent = 'Pick another realm and try again!';
        choicesEl.innerHTML = '';
        playAgainEl.style.display = 'inline-block';
        return;
      }
      counterEl.textContent = `Question ${questionIndex + 1} / ${total}`;
      scoreEl.textContent = `Score: ${correct} / ${total}`;
      promptEl.textContent = currentProblem.prompt;
      feedbackEl.textContent = 'Go!';
      if (rewardEl) rewardEl.textContent = `Goal: ${starGoal} correct to earn a star.`;
      if (goalEl) goalEl.textContent = `Star Goal: ${starGoal} correct`; 
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
            feedbackEl.textContent = 'Great gate!';
            stopRunner();
            disableChoices();
            queueNextQuestion(500);
          } else {
            wrongAttempts += 1;
            feedbackEl.textContent = wrongAttempts >= 2 ? `Try again! ${currentProblem.explanation}` : 'Try again!';
            gate.classList.add('dash-wrong');
            const gateRef = gate;
            setTimeout(() => { if (!isCleaned) gateRef.classList.remove('dash-wrong'); }, 250);
          }
        });
        choicesEl.appendChild(gate);
      });

      startRunner();
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
      if (isCleaned || runCompleteEmitted) return;
      runCompleteEmitted = true;
      stopRunner();
      clearNextTimer();
      disableChoices();
      const starEarned = correct >= starGoal;
      promptEl.textContent = 'Run Complete!';
      scoreEl.textContent = `Score: ${correct} / ${total}`;
      if (starEarned) {
        feedbackEl.textContent = 'Great dash!';
        if (rewardEl) rewardEl.textContent = 'You earned a star!';
      } else if (correct + 1 >= starGoal) {
        feedbackEl.textContent = 'You were close!';
        if (rewardEl) rewardEl.textContent = 'Play again to earn a star.';
      } else {
        feedbackEl.textContent = 'Nice dash — try again!';
        if (rewardEl) rewardEl.textContent = 'Play again to earn a star.';
      }
      playAgainEl.style.display = 'inline-block';
      onRunComplete({
        correct,
        total,
        goal: starGoal,
        starEarned,
        realmId: realm.id,
        difficulty,
        skill,
        source: 'guardianDash'
      });
    }

    function resetRun() {
      if (isCleaned) return;
      stopRunner();
      clearNextTimer();
      questionIndex = 0;
      correct = 0;
      runCompleteEmitted = false;
      playAgainEl.style.display = 'none';
      buildQuestion();
    }

    playAgainEl.addEventListener('click', resetRun);
    buildQuestion();

    function cleanup() {
      if (isCleaned) return;
      isCleaned = true;
      stopRunner();
      clearNextTimer();
      mountEl.innerHTML = '';
    }

    return { cleanup };
  }

  window.initGuardianDashGame = initGuardianDashGame;
})();
