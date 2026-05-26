(function () {
  function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function shuffle(items) {
    const arr = items.slice();
    for (let i = arr.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  function addNumberChoices(answer, count, min, max) {
    const set = new Set([answer]);
    let guard = 0;
    while (set.size < count && guard < 100) {
      guard += 1;
      const delta = randInt(1, 4);
      const candidate = Math.max(min, Math.min(max, answer + (Math.random() > 0.5 ? delta : -delta)));
      set.add(candidate);
    }
    while (set.size < count) {
      set.add(randInt(min, max));
    }
    return shuffle(Array.from(set));
  }

  function selectRangeByDifficulty(difficulty, forSkill) {
    if (difficulty === 'littleHunter') return forSkill.includes('20') ? [0, 10] : [0, 10];
    if (difficulty === 'numberAdventurer') return [0, 20];
    return [0, 20];
  }

  const MathEngine = {
    generateProblem(options) {
      const skill = options?.skill || 'additionWithin10';
      const difficulty = options?.difficulty || 'littleHunter';
      const [min, max] = selectRangeByDifficulty(difficulty, skill);
      const choiceCount = options?.choices || (difficulty === 'masterHunter' ? 4 : 3);

      let a = 0;
      let b = 0;
      let answer;
      let prompt = '';
      let explanation = '';

      if (skill === 'additionWithin10' || (skill === 'additionWithin20' && difficulty === 'littleHunter')) {
        a = randInt(min, Math.min(10, max));
        b = randInt(min, Math.min(10, max - a));
        answer = a + b;
        prompt = `${a} + ${b} = ?`;
      } else if (skill === 'additionWithin20') {
        a = randInt(min, max);
        b = randInt(min, max - a);
        answer = a + b;
        prompt = `${a} + ${b} = ?`;
      } else if (skill === 'subtractionWithin10' || (skill === 'subtractionWithin20' && difficulty === 'littleHunter')) {
        a = randInt(1, Math.min(10, max));
        b = randInt(0, a);
        answer = a - b;
        prompt = `${a} - ${b} = ?`;
      } else if (skill === 'subtractionWithin20') {
        a = randInt(Math.max(1, min), max);
        b = randInt(min, a);
        answer = a - b;
        prompt = `${a} - ${b} = ?`;
      } else if (skill === 'evenOdd') {
        a = randInt(Math.max(1, min), max || 20);
        answer = a % 2 === 0 ? 'Even' : 'Odd';
        prompt = `${a} is ...`;
      } else if (skill === 'make10') {
        a = randInt(0, 10);
        answer = 10 - a;
        prompt = `${a} + __ = 10`;
      } else if (skill === 'missingNumber') {
        answer = randInt(difficulty === 'masterHunter' ? 2 : 1, difficulty === 'littleHunter' ? 10 : 20);
        b = randInt(0, difficulty === 'littleHunter' ? 10 : 20 - answer);
        a = answer + b;
        prompt = `${a} - __ = ${b}`;
      } else {
        a = randInt(0, 10);
        b = randInt(0, 10 - a);
        answer = a + b;
        prompt = `${a} + ${b} = ?`;
      }

      explanation = typeof answer === 'string'
        ? `${a} is ${answer.toLowerCase()} because it can${answer === 'Even' ? '' : 'not'} be split into pairs.`
        : `Great work! ${prompt.replace('?', answer)}.`;

      const choices = typeof answer === 'string'
        ? shuffle(['Even', 'Odd'])
        : addNumberChoices(answer, choiceCount, 0, Math.max(20, answer + 5));

      return {
        prompt,
        answer,
        choices,
        explanation,
        skill,
        difficulty
      };
    }
  };

  window.MathEngine = MathEngine;
})();
