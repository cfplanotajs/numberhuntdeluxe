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
    rewards: { caveKeyTarget: 3, starLabel: 'Star', keyLabel: 'Realm Key' },
    questTemplates: [
      'Solve {{prompt}}. Then {{action}}. If correct, {{reward}}!',
      '{{realm}} Guardian Quest: Answer {{prompt}}. Next, {{action}}. Then {{reward}}.'
    ],
    parentResources: [
      'Pick one 5-minute realm quest after each board game round.',
      'Use Little Hunter for gentle practice and confidence.',
      'Ask your child to explain why an answer is even or odd.'
    ],
    actionPrompts: {
      silly: ['roar like a tiny tiger', 'freeze like an ice statue for 5 seconds', 'wiggle like a treasure worm'],
      calm: ['take three deep breaths', 'do a slow hero stretch', 'walk in place for five steps']
    }
  };
  window.NH_DATA = NH_DATA;
})();
