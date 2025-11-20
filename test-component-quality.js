import { generateComponent } from './src/generator/index.js';
import Database from 'better-sqlite3';

const db = new Database('ecl-database.sqlite');

console.log('🔍 Quality Check: Sample Components\n');
console.log('='.repeat(80));

const samples = [
  { name: 'button', expect: 'ecl-button' },
  { name: 'modal', expect: 'ecl-modal' },
  { name: 'search form', expect: 'ecl-search-form' },
  { name: 'breadcrumb', expect: 'ecl-breadcrumb' },
  { name: 'datepicker', expect: 'ecl-datepicker' }
];

samples.forEach(sample => {
  console.log(`\n${'─'.repeat(80)}`);
  console.log(`Testing: ${sample.name.toUpperCase()}`);
  console.log('─'.repeat(80));
  
  const result = generateComponent(db, sample.name);
  
  if (result.success) {
    const code = result.generated_code.html || result.generated_code;
    
    // Quality checks
    const checks = {
      hasExpectedClass: code.includes(sample.expect),
      hasEclPrefix: code.includes('ecl-'),
      notEmpty: code.length > 100,
      hasStructure: code.includes('<') && code.includes('>'),
      hasClasses: code.includes('class=')
    };
    
    console.log('\n✅ Code Generated:');
    console.log(`   Size: ${code.length} bytes`);
    console.log(`   Expected class "${sample.expect}": ${checks.hasExpectedClass ? '✅' : '❌'}`);
    console.log(`   Has ECL classes: ${checks.hasEclPrefix ? '✅' : '❌'}`);
    console.log(`   Substantial content: ${checks.notEmpty ? '✅' : '❌'}`);
    console.log(`   Valid HTML structure: ${checks.hasStructure ? '✅' : '❌'}`);
    
    // Show first 300 chars
    console.log('\n📄 Code Preview:');
    console.log('   ' + code.substring(0, 300).replace(/\n/g, '\n   '));
    
    // Check for usage instructions
    if (result.usage_instructions) {
      console.log('\n📚 Usage Instructions: ✅ PROVIDED');
      console.log(`   Length: ${result.usage_instructions.length} chars`);
    } else {
      console.log('\n📚 Usage Instructions: ❌ MISSING');
    }
    
    const allPassed = Object.values(checks).every(v => v === true);
    console.log(`\n${allPassed ? '✅ QUALITY: EXCELLENT' : '⚠️  QUALITY: NEEDS REVIEW'}`);
    
  } else {
    console.log(`\n❌ FAILED: ${result.error}`);
  }
});

db.close();
