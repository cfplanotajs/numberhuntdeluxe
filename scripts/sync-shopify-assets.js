#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const assetDir = path.join(root, 'shopify/assets');
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

try {
  fs.mkdirSync(assetDir, { recursive: true });

  mappings.forEach(([source, target]) => {
    const sourcePath = path.join(root, source);
    const targetPath = path.join(root, target);

    if (!fs.existsSync(sourcePath)) throw new Error(`Missing source: ${source}`);

    fs.copyFileSync(sourcePath, targetPath);
    console.log(`Copied: ${source} -> ${target}`);
  });

  console.log(`Copied ${mappings.length} Shopify handoff asset(s).`);
  console.log('Matter.js 0.20.0 remains a manual launch asset TODO; matter.min.js was not created or modified.');
} catch (err) {
  console.error(err.message);
  process.exit(1);
}
