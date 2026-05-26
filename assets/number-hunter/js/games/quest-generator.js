(function () {
  function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

  function generateGuardianQuest({ realm, difficulty, skill, style }) {
    const problem = window.MathEngine.generateProblem({ skill, difficulty });
    const action = pick(window.NH_DATA.actionPrompts[style] || window.NH_DATA.actionPrompts.silly);
    const reward = pick(window.NH_DATA.boardRewards || ['move ahead 1 space']);
    const parentTip = pick(window.NH_DATA.parentTips || ['Let your child explain their answer.']);
    const flavor = pick((window.NH_DATA.realmFlavor && window.NH_DATA.realmFlavor[realm.id]) || ['adventure path']);
    const difficultyLabel = (window.NH_DATA.difficulties.find((d) => d.id === difficulty) || {}).name || difficulty;
    const skillLabel = (window.NH_DATA.skillLabels && window.NH_DATA.skillLabels[skill]) || skill;

    return {
      title: `${realm.name} Guardian Quest`,
      realm: realm.name,
      difficulty: difficultyLabel,
      skillLabel,
      mathPrompt: problem.prompt,
      answer: problem.answer,
      action: `${action} by the ${flavor}.`,
      boardReward: `If correct, ${reward}.`,
      parentTip
    };
  }

  window.generateGuardianQuest = generateGuardianQuest;
})();
