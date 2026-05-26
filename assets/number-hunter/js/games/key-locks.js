(function () {
  function initKeyLocksGame(mountEl, options) {
    if (!mountEl) return;
    const skill = options?.skill || 'missingNumber';
    const difficulty = options?.difficulty || 'littleHunter';
    const p = window.MathEngine.generateProblem({ skill, difficulty });

    mountEl.innerHTML = '';
    const wrap = document.createElement('div');
    wrap.className = 'quest-card';
    wrap.innerHTML = `<p><strong>Unlock the Lock</strong></p><p>${p.prompt}</p>`;

    const feedback = document.createElement('p');
    feedback.textContent = 'Pick an answer:';

    p.choices.forEach((c) => {
      const b = document.createElement('button');
      b.className = 'btn';
      b.textContent = c;
      b.addEventListener('click', () => {
        feedback.textContent = c === p.answer ? 'Great Job! Key unlocked!' : 'Try Again!';
      });
      wrap.appendChild(b);
    });
    wrap.appendChild(feedback);
    mountEl.appendChild(wrap);
  }

  window.initKeyLocksGame = initKeyLocksGame;
})();
