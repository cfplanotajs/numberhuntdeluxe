#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const mappings = [
  ['assets/number-hunter/number-hunter-hub.css', 'shopify/assets/number-hunter-hub.css'],
  ['assets/number-hunter/js/data.js', 'shopify/assets/number-hunter-data.js'],
  ['assets/number-hunter/js/math-engine.js', 'shopify/assets/number-hunter-math-engine.js'],
  ['assets/number-hunter/js/progress.js', 'shopify/assets/number-hunter-progress.js'],
  ['assets/number-hunter/js/games/key-locks.js', 'shopify/assets/number-hunter-key-locks.js'],
  ['assets/number-hunter/js/games/treasure-merge.js', 'shopify/assets/number-hunter-treasure-merge.js'],
  ['assets/number-hunter/js/games/guardian-dash.js', 'shopify/assets/number-hunter-guardian-dash.js'],
  ['assets/number-hunter/js/games/even-odd-sort.js', 'shopify/assets/number-hunter-even-odd-sort.js'],
  ['assets/number-hunter/js/games/quest-generator.js', 'shopify/assets/number-hunter-quest-generator.js'],
  ['assets/number-hunter/js/number-hunter-hub.js', 'shopify/assets/number-hunter-hub.js']
];

function readFile(relativePath) {
  return fs.readFileSync(path.join(root, relativePath));
}

let failures = 0;

mappings.forEach(([source, target]) => {
  const sourcePath = path.join(root, source);
  const targetPath = path.join(root, target);

  if (!fs.existsSync(sourcePath)) {
    console.error(`Missing source: ${source}`);
    failures += 1;
    return;
  }

  if (!fs.existsSync(targetPath)) {
    console.error(`Missing Shopify copy: ${target}`);
    failures += 1;
    return;
  }

  if (!readFile(source).equals(readFile(target))) {
    console.error(`Out of sync: ${source} -> ${target}`);
    failures += 1;
    return;
  }

  console.log(`In sync: ${source} -> ${target}`);
});

console.log('Matter.js 0.20.0 remains a manual launch asset TODO.');

if (failures > 0) {
  console.error(`${failures} Shopify asset sync issue(s) found.`);
  process.exit(1);
}

console.log('All Shopify handoff assets match source files.');
