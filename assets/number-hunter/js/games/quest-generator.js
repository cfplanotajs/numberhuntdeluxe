(function () {
  function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

  function generateGuardianQuest({ realm, difficulty, skill, style }) {
    const problem = window.MathEngine.generateProblem({ skill, difficulty });
    const action = pick(window.NH_DATA.actionPrompts[style] || window.NH_DATA.actionPrompts.silly);
    const template = pick(window.NH_DATA.questTemplates);
    const reward = `earn the ${realm.reward}`;

    return template
      .replace('{{realm}}', realm.name)
      .replace('{{prompt}}', problem.prompt)
      .replace('{{action}}', action)
      .replace('{{reward}}', reward);
  }

  window.generateGuardianQuest = generateGuardianQuest;
})();
