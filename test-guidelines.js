import Database from 'better-sqlite3';
import { searchGuidance } from './src/search/guidance-search.js';
import { generateComponent } from './src/generator/index.js';

const db = new Database('ecl-database.sqlite');

console.log('📚 Testing ECL Guidelines Access\n');
console.log('='.repeat(80));

// All guidelines from the screenshot
const guidelines = [
  'Typography',
  'Colours',
  'Use of images',
  'Iconography',
  'Logos',
  'Spacing'
];

console.log('\n1️⃣  Testing Guideline Generation:\n');

const results = {
  success: [],
  failed: []
};

guidelines.forEach(guideline => {
  const result = generateComponent(db, guideline);
  
  if (result.success) {
    const code = result.generated_code?.html || result.generated_code;
    results.success.push({
      name: guideline,
      size: code?.length || 0,
      hasCode: code && code.length > 0
    });
    console.log(`✅ ${guideline.padEnd(25)} → ${code?.length || 0} bytes`);
  } else {
    results.failed.push({
      name: guideline,
      error: result.error
    });
    console.log(`❌ ${guideline.padEnd(25)} → ${result.error}`);
  }
});

console.log('\n' + '='.repeat(80));
console.log('\n2️⃣  Testing Guidance Search:\n');

const searches = [
  { query: 'typography font heading', desc: 'Typography guidance' },
  { query: 'color palette brand', desc: 'Color guidance' },
  { query: 'image photo picture', desc: 'Image guidance' },
  { query: 'icon svg graphic', desc: 'Icon guidance' },
  { query: 'logo brand identity', desc: 'Logo guidance' },
  { query: 'spacing margin padding', desc: 'Spacing guidance' }
];

searches.forEach(search => {
  const result = searchGuidance(db, { query: search.query });
  const count = result.results?.length || 0;
  console.log(`${count > 0 ? '✅' : '❌'} ${search.desc.padEnd(25)} → ${count} results`);
});

console.log('\n' + '='.repeat(80));
console.log(`\n📊 SUMMARY:\n`);
console.log(`✅ Working: ${results.success.length}/${guidelines.length} guidelines`);
console.log(`❌ Failed:  ${results.failed.length}/${guidelines.length} guidelines`);

if (results.failed.length > 0) {
  console.log('\n❌ FAILED GUIDELINES:');
  results.failed.forEach(item => {
    console.log(`   - ${item.name}: ${item.error}`);
  });
}

console.log('');

db.close();
