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
    if (!mountEl) return { cleanup() {}, restart() {} };

    const realm = options?.realm || window.NH_DATA.realms[0];
    const difficulty = options?.difficulty || 'littleHunter';
    const onProgress = typeof options?.onProgress === 'function' ? options.onProgress : function () {};
    const roundsToWin = 3;
    const pendingTimers = new Set();
    let isCleaned = false;

    const session = {
      correctCount: 0,
      round: 1,
      attempt: 0,
      complete: false,
      problem: null
    };

    function safeTimeout(fn, ms) {
      const id = setTimeout(() => {
        pendingTimers.delete(id);
        if (isCleaned) return;
        fn();
      }, ms);
      pendingTimers.add(id);
      return id;
    }

    function renderShell() {
      if (isCleaned) return;
      mountEl.innerHTML = `
        <div class="key-lock-game">
          <p class="key-lock-realm">${realm.name} Lock</p>
          <h3 class="key-lock-title">Earn the Realm Key</h3>
          <p class="key-lock-round" id="keyLockRound"></p>
          <p class="key-lock-prompt" id="keyLockPrompt"></p>
          <div class="key-lock-choices" id="keyLockChoices"></div>
          <p class="key-lock-feedback" id="keyLockFeedback">Tap an answer to open each lock.</p>
          <div class="key-lock-controls">
            <button class="btn" type="button" id="keyLockNextBtn" style="display:none;">Next Lock</button>
            <button class="btn btn-primary" type="button" id="keyLockRestartBtn" style="display:none;">Play Again</button>
          </div>
        </div>`;
    }

    function renderRound() {
      if (isCleaned) return;
      const roundEl = mountEl.querySelector('#keyLockRound');
      const promptEl = mountEl.querySelector('#keyLockPrompt');
      const choicesEl = mountEl.querySelector('#keyLockChoices');
      const feedbackEl = mountEl.querySelector('#keyLockFeedback');
      const nextBtn = mountEl.querySelector('#keyLockNextBtn');
      const restartBtn = mountEl.querySelector('#keyLockRestartBtn');
      if (!roundEl || !promptEl || !choicesEl || !feedbackEl || !nextBtn || !restartBtn) return;

      if (session.complete) {
        roundEl.textContent = `Key Earned!`;
        promptEl.textContent = 'Realm Key unlocked!';
        choicesEl.innerHTML = '';
        feedbackEl.textContent = 'Stars earned. Realm Key found!';
        nextBtn.style.display = 'none';
        restartBtn.style.display = 'inline-block';
        return;
      }

      const skill = pickSkill(realm.id, difficulty);
      try {
        session.problem = window.MathEngine.generateProblem({ skill, difficulty, choices: difficulty === 'masterHunter' ? 4 : 3 });
      } catch (err) {
        feedbackEl.textContent = 'Lock setup issue. Try a different realm.';
        choicesEl.innerHTML = '';
        nextBtn.style.display = 'none';
        restartBtn.style.display = 'inline-block';
        return;
      }
      session.attempt = 0;

      roundEl.textContent = `Lock ${session.round} of ${roundsToWin} • Open ${session.correctCount}/${roundsToWin}`;
      promptEl.textContent = session.problem.prompt;
      feedbackEl.textContent = 'Tap an answer to open each lock.';
      choicesEl.innerHTML = '';
      nextBtn.style.display = 'none';
      restartBtn.style.display = 'none';

      function disableChoices() {
        choicesEl.querySelectorAll('button').forEach((button) => { button.disabled = true; });
      }

      session.problem.choices.forEach((choice) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'btn key-lock-choice';
        btn.textContent = choice;
        btn.addEventListener('click', function () {
          if (isCleaned || session.complete) return;
          if (choice === session.problem.answer) {
            session.correctCount += 1;
            session.round += 1;
            feedbackEl.textContent = 'Great job! Lock opened!';
            window.Progress.awardStar();
            onProgress(window.Progress.getProgress());
            disableChoices();

            if (session.correctCount >= roundsToWin) {
              window.Progress.unlockRealmKey(realm.id);
              onProgress(window.Progress.getProgress());
              session.complete = true;
              safeTimeout(renderRound, 450);
            } else {
              nextBtn.style.display = 'inline-block';
            }
          } else {
            session.attempt += 1;
            feedbackEl.textContent = session.attempt >= 2 ? `Try again! ${session.problem.explanation}` : 'Try again!';
            btn.classList.add('key-lock-wrong');
            safeTimeout(() => btn.classList.remove('key-lock-wrong'), 280);
          }
        });
        choicesEl.appendChild(btn);
      });
    }

    function wire() {
      if (isCleaned) return;
      const nextBtn = mountEl.querySelector('#keyLockNextBtn');
      const restartBtn = mountEl.querySelector('#keyLockRestartBtn');
      if (!nextBtn || !restartBtn) return;
      nextBtn.addEventListener('click', renderRound);
      restartBtn.addEventListener('click', function () {
        if (isCleaned) return;
        session.correctCount = 0;
        session.round = 1;
        session.attempt = 0;
        session.complete = false;
        renderRound();
      });
    }

    function cleanup() {
      if (isCleaned) return;
      isCleaned = true;
      pendingTimers.forEach((id) => clearTimeout(id));
      pendingTimers.clear();
      mountEl.innerHTML = '';
    }

    renderShell();
    wire();
    renderRound();

    return { restart: renderRound, cleanup };
  }

  window.initKeyLocksGame = initKeyLocksGame;
})();
