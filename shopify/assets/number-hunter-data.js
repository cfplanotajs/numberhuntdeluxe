(function () {
  const NH_DATA = {
    difficulties: [
      { id: 'littleHunter', name: 'Little Hunter' },
      { id: 'numberAdventurer', name: 'Number Adventurer' },
      { id: 'masterHunter', name: 'Master Hunter' }
    ],
    realms: [
      { id: 'jungle', name: 'Jungle', reward: 'Jungle Key', skillFocus: ['additionWithin10'] },
      { id: 'frozen', name: 'Frozen Land', reward: 'Ice Key', skillFocus: ['subtractionWithin10'] },
      { id: 'ocean', name: 'Ocean', reward: 'Ocean Key', skillFocus: ['evenOdd'] },
      { id: 'rainbow', name: 'Rainbow Mountains', reward: 'Rainbow Key', skillFocus: ['make10'] },
      { id: 'desert', name: 'Desert', reward: 'Desert Key', skillFocus: ['missingNumber'] },
      { id: 'volcano', name: 'Volcano', reward: 'Volcano Key', skillFocus: ['additionWithin20', 'subtractionWithin20'] }
    ],
    realmSkillMap: {
      jungle: ['additionWithin10'],
      frozen: ['subtractionWithin10'],
      ocean: ['evenOdd'],
      rainbow: ['make10'],
      desert: ['missingNumber'],
      volcano: ['additionWithin20', 'subtractionWithin20']
    },
    rewards: { caveKeyTarget: 6, starLabel: 'Star', keyLabel: 'Realm Key' },
    activities: [
      { id: 'quickQuest', title: 'Quick Quest', rewardLabel: 'Earn Star', description: 'Answer one math challenge.', kind: 'digital' },
      { id: 'keyLock', title: 'Key Lock', rewardLabel: 'Earn Realm Key', description: 'Open 3 locks for this Realm Key.', kind: 'digital' },
      { id: 'treasureMerge', title: 'Treasure Merge', rewardLabel: 'Earn Star', description: 'Merge matching numbers to earn a Star.', kind: 'digital' },
      { id: 'guardianDash', title: 'Guardian Dash', rewardLabel: 'Earn Star', description: 'Pick the right gates in a 5-question dash.', kind: 'digital' },
      { id: 'evenOddSort', title: 'Even/Odd Sort', rewardLabel: 'Earn Star', description: 'Sort numbers into Even and Odd.', kind: 'digital' },
      { id: 'guardianQuest', title: 'Bonus Board Quest', rewardLabel: 'Board Game Bonus', description: 'Make a board-game challenge.', kind: 'parent-led' }
    ],
    skillLabels: {
      additionWithin10: 'Addition', subtractionWithin10: 'Subtraction', additionWithin20: 'Addition',
      subtractionWithin20: 'Subtraction', evenOdd: 'Even or Odd', make10: 'Make 10', missingNumber: 'Missing Number'
    },
    realmFlavor: {
      jungle: ['hidden temple vines', 'parrot lookout', 'tiny tiger trail'],
      frozen: ['snowflake bridge', 'penguin steps', 'frozen lock path'],
      ocean: ['bubble wave lane', 'sea turtle trail', 'treasure chest reef'],
      rainbow: ['crystal bridge climb', 'color sparkle path', 'mountain rainbow gate'],
      desert: ['pyramid gate walk', 'sand dune path', 'ancient gem arch'],
      volcano: ['lava drum trail', 'rumbling rock path', 'fire crystal gate']
    },
    boardRewards: ['move ahead 1 space', 'move ahead 2 spaces', 'take one extra roll', 'choose your next path', 'skip one challenge card once', 'collect a pretend star', 'high-five your teammate'],
    parentTips: ['Let your child explain how they found the answer.', 'Use fingers or small objects to show the math.', 'Praise the strategy, not just the answer.', 'Keep the round to 1 minute for quick confidence wins.'],
    questTemplates: [
      'Solve {{prompt}}. Then {{action}}. If correct, {{reward}}!',
      '{{realm}} Guardian Quest: Answer {{prompt}}. Next, {{action}}. Then {{reward}}.'
    ],
    parentResources: [
      'Play one 5-minute Realm quest between board game rounds.',
      'Pick Little Hunter for gentle practice.',
      'Ask: How did you know?'
    ],
    actionPrompts: {
      silly: ['roar like a tiny tiger', 'wiggle like a jellyfish', 'stomp like a volcano giant', 'bounce like a happy monkey'],
      calm: ['trace the answer in the air', 'whisper the answer', 'tap the table softly', 'point to the bigger number', 'show the answer with fingers']
    }
  };
  window.NH_DATA = NH_DATA;
})();
