import { generateComponent } from './src/generator/index.js';
import Database from 'better-sqlite3';

const db = new Database('ecl-database.sqlite');

console.log('Testing guideline name variations:\n');

const variations = [
  // Colours
  ['Colours', 'colours', 'Colors', 'colors', 'Colour', 'colour', 'Color', 'color'],
  // Iconography  
  ['Iconography', 'iconography', 'icon', 'icons'],
  // Logos
  ['Logos', 'logos', 'Logo', 'logo']
];

variations.forEach(names => {
  console.log(`\nTesting variations of "${names[0]}":`);
  names.forEach(name => {
    const result = generateComponent(db, name);
    const status = result.success ? `✅ ${(result.generated_code?.html || result.generated_code)?.length} bytes` : `❌ ${result.error}`;
    console.log(`  "${name}": ${status}`);
  });
});

db.close();
