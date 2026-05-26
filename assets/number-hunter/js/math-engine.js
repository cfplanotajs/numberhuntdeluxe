(function () {
  function randInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
  function shuffled(arr) { return arr.slice().sort(() => Math.random() - 0.5); }
  function choiceSet(answer, spread, count) {
    const set = new Set([answer]);
    while (set.size < count) set.add(answer + randInt(-spread, spread || 1));
    return shuffled(Array.from(set));
  }

  const MathEngine = {
    generateProblem(options) {
      const skill = options.skill || 'additionWithin10';
      const difficulty = options.difficulty || 'littleHunter';
      let a = 0, b = 0, answer = 0, prompt = '', explanation = '';

      if (skill === 'additionWithin10') { a = randInt(0, 10); b = randInt(0, 10 - a); answer = a + b; prompt = `${a} + ${b} = ?`; }
      else if (skill === 'subtractionWithin10') { a = randInt(1, 10); b = randInt(0, a); answer = a - b; prompt = `${a} - ${b} = ?`; }
      else if (skill === 'additionWithin20') { a = randInt(0, 20); b = randInt(0, 20 - a); answer = a + b; prompt = `${a} + ${b} = ?`; }
      else if (skill === 'subtractionWithin20') { a = randInt(1, 20); b = randInt(0, a); answer = a - b; prompt = `${a} - ${b} = ?`; }
      else if (skill === 'evenOdd') { a = randInt(1, 20); answer = a % 2 === 0 ? 'Even' : 'Odd'; prompt = `${a} is ...`; }
      else if (skill === 'make10') { a = randInt(0, 10); answer = 10 - a; prompt = `${a} + __ = 10`; }
      else if (skill === 'missingNumber') { b = randInt(0, 10); answer = randInt(1, 10); a = answer + b; prompt = `${a} - __ = ${b}`; }

      explanation = `Great work! The answer is ${answer}.`;
      const choices = typeof answer === 'string' ? shuffled(['Even', 'Odd']) : choiceSet(answer, 4, 3);

      return { prompt, answer, choices, explanation, skill, difficulty };
    }
  };

  window.MathEngine = MathEngine;
})();
