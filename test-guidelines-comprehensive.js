import Database from 'better-sqlite3';
import { generateComponent } from './src/generator/index.js';

const db = new Database('ecl-database.sqlite');

console.log('📚 Comprehensive ECL Guidelines Test\n');
console.log('='.repeat(80));

const guidelines = [
  { name: 'Typography', variations: ['typography', 'type', 'font', 'text'] },
  { name: 'Colours', variations: ['colours', 'colors', 'colour', 'color'] },
  { name: 'Use of images', variations: ['use of images', 'images', 'image'] },
  { name: 'Iconography', variations: ['iconography', 'icons'] },
  { name: 'Logos', variations: ['logos', 'logo'] },
  { name: 'Spacing', variations: ['spacing', 'space', 'margin', 'padding'] }
];

console.log('\n1️⃣  Testing Primary Guideline Names:\n');

let allPass = true;
guidelines.forEach(guideline => {
  const result = generateComponent(db, guideline.name);
  
  if (result.success) {
    const content = result.generated_code?.html || result.generated_code;
    console.log(`✅ ${guideline.name.padEnd(20)} → ${content.length} bytes`);
    console.log(`   Preview: ${content.substring(0, 80).replace(/\n/g, ' ')}...`);
  } else {
    console.log(`❌ ${guideline.name.padEnd(20)} → ${result.error}`);
    allPass = false;
  }
});

console.log('\n' + '='.repeat(80));
console.log('\n2️⃣  Testing Natural Language Variations:\n');

guidelines.forEach(guideline => {
  console.log(`\n${guideline.name}:`);
  const variations = guideline.variations.slice(0, 3);
  
  variations.forEach(variation => {
    const result = generateComponent(db, variation);
    const status = result.success ? 
      `✅ Found (${(result.generated_code?.html || result.generated_code)?.length || 0}b)` : 
      '❌ Not found';
    console.log(`  "${variation}": ${status}`);
  });
});

console.log('\n' + '='.repeat(80));
console.log('\n3️⃣  Sample Guideline Content:\n');

const sampleGuidelines = ['Colours', 'Iconography', 'Typography'];
sampleGuidelines.forEach(name => {
  const result = generateComponent(db, name);
  if (result.success) {
    const content = result.generated_code?.html || result.generated_code;
    console.log(`\n${name.toUpperCase()}:`);
    console.log('─'.repeat(40));
    console.log(content.split('\n').slice(0, 8).join('\n'));
    console.log('...');
  }
});

console.log('\n' + '='.repeat(80));
console.log(`\n✅ ${allPass ? 'ALL TESTS PASSED' : 'SOME TESTS FAILED'}\n`);

db.close();
