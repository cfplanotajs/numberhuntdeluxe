(function () {
  function pickSkill(realmId, difficulty) {
    const byRealm = window.NH_DATA?.realmSkillMap?.[realmId] || ['additionWithin10'];
    if (realmId === 'volcano') {
      if (difficulty === 'littleHunter') return 'additionWithin10';
      return byRealm[Math.floor(Math.random() * byRealm.length)];
    }
    return byRealm[0];
  }

  function initKeyLocksGame(mountEl, options) {
    if (!mountEl) return { restart() {} };

    const realm = options?.realm || window.NH_DATA.realms[0];
    const difficulty = options?.difficulty || 'littleHunter';
    const onProgress = typeof options?.onProgress === 'function' ? options.onProgress : function () {};
    const roundsToWin = 3;

    const session = {
      correctCount: 0,
      round: 1,
      attempt: 0,
      complete: false,
      problem: null
    };

    function renderShell() {
      mountEl.innerHTML = `
        <div class="key-lock-game">
          <p class="key-lock-realm">${realm.name} Lock</p>
          <h3 class="key-lock-title">Unlock the Key</h3>
          <p class="key-lock-round" id="keyLockRound"></p>
          <p class="key-lock-prompt" id="keyLockPrompt"></p>
          <div class="key-lock-choices" id="keyLockChoices"></div>
          <p class="key-lock-feedback" id="keyLockFeedback">Tap the right answer to open the lock.</p>
          <div class="key-lock-controls">
            <button class="btn" type="button" id="keyLockNextBtn" style="display:none;">Next Lock</button>
            <button class="btn btn-primary" type="button" id="keyLockRestartBtn" style="display:none;">Play Again</button>
          </div>
        </div>`;
    }

    function renderRound() {
      const roundEl = mountEl.querySelector('#keyLockRound');
      const promptEl = mountEl.querySelector('#keyLockPrompt');
      const choicesEl = mountEl.querySelector('#keyLockChoices');
      const feedbackEl = mountEl.querySelector('#keyLockFeedback');
      const nextBtn = mountEl.querySelector('#keyLockNextBtn');
      const restartBtn = mountEl.querySelector('#keyLockRestartBtn');

      if (session.complete) {
        roundEl.textContent = `Success! ${roundsToWin}/${roundsToWin} locks opened`;
        promptEl.textContent = 'Great Job! Realm key unlocked.';
        choicesEl.innerHTML = '';
        feedbackEl.textContent = 'You earned stars and unlocked this realm key.';
        nextBtn.style.display = 'none';
        restartBtn.style.display = 'inline-block';
        return;
      }

      const skill = pickSkill(realm.id, difficulty);
      session.problem = window.MathEngine.generateProblem({ skill, difficulty, choices: difficulty === 'masterHunter' ? 4 : 3 });
      session.attempt = 0;

      roundEl.textContent = `Lock ${session.round} of ${roundsToWin} • Correct ${session.correctCount}/${roundsToWin}`;
      promptEl.textContent = session.problem.prompt;
      feedbackEl.textContent = 'Tap the right answer to open the lock.';
      choicesEl.innerHTML = '';
      nextBtn.style.display = 'none';
      restartBtn.style.display = 'none';

      session.problem.choices.forEach((choice) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'btn key-lock-choice';
        btn.textContent = choice;
        btn.addEventListener('click', function () {
          if (session.complete) return;
          if (choice === session.problem.answer) {
            session.correctCount += 1;
            session.round += 1;
            feedbackEl.textContent = 'Great Job! Lock opened!';
            window.Progress.awardStar();
            onProgress(window.Progress.getProgress());
            disableChoices();

            if (session.correctCount >= roundsToWin) {
              window.Progress.unlockRealmKey(realm.id);
              onProgress(window.Progress.getProgress());
              session.complete = true;
              setTimeout(renderRound, 450);
            } else {
              nextBtn.style.display = 'inline-block';
            }
          } else {
            session.attempt += 1;
            feedbackEl.textContent = session.attempt >= 2 ? `Try Again! ${session.problem.explanation}` : 'Try Again!';
            btn.classList.add('key-lock-wrong');
            setTimeout(() => btn.classList.remove('key-lock-wrong'), 280);
          }
        });
        choicesEl.appendChild(btn);
      });

      function disableChoices() {
        choicesEl.querySelectorAll('button').forEach((button) => { button.disabled = true; });
      }
    }

    function wire() {
      mountEl.querySelector('#keyLockNextBtn').addEventListener('click', renderRound);
      mountEl.querySelector('#keyLockRestartBtn').addEventListener('click', function () {
        session.correctCount = 0;
        session.round = 1;
        session.attempt = 0;
        session.complete = false;
        renderRound();
      });
    }

    renderShell();
    wire();
    renderRound();

    return { restart: renderRound };
  }

  window.initKeyLocksGame = initKeyLocksGame;
})();
