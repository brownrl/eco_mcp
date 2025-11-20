/**
 * Test Blockquote Component Generation
 */

import * as Generator from './src/generator/index.js';
import { getDatabase } from './src/db.js';

console.log('🧪 Testing Blockquote Component Generation\n');

const db = getDatabase();

// Test 1: Basic component generation
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('Test 1: Generate Blockquote Component');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

const result = Generator.generateComponent(db, 'Blockquote', {
    includeComments: false
});

console.log('Result:', result.success ? '✅ SUCCESS' : '❌ FAILED');

if (result.success) {
    console.log('\n📝 Generated Code:');
    console.log(result.generated_code);
    console.log('\n✅ Structure Validation:');

    const code = result.generated_code.html || result.generated_code;

    // Check for correct root element
    if (code.includes('<figure class="ecl-blockquote">')) {
        console.log('   ✅ Root element is <figure class="ecl-blockquote">');
    } else {
        console.log('   ❌ Root element is NOT <figure>');
    }

    // Check for body wrapper
    if (code.includes('<div class="ecl-blockquote__body">')) {
        console.log('   ✅ Has body wrapper: <div class="ecl-blockquote__body">');
    } else {
        console.log('   ❌ Missing body wrapper');
    }

    // Check for nested blockquote
    if (code.includes('<blockquote class="ecl-blockquote__quote">')) {
        console.log('   ✅ Has nested blockquote: <blockquote class="ecl-blockquote__quote">');
    } else {
        console.log('   ❌ Missing nested blockquote element');
    }

    // Check for citation
    if (code.includes('class="ecl-blockquote__citation"')) {
        console.log('   ✅ Has citation paragraph with correct class');
    } else {
        console.log('   ❌ Missing citation paragraph');
    }

    // Check for footer and cite
    if (code.includes('<footer class="ecl-blockquote__attribution">')) {
        console.log('   ✅ Has attribution footer');
    } else {
        console.log('   ❌ Missing attribution footer');
    }

    if (code.includes('<cite class="ecl-blockquote__author">')) {
        console.log('   ✅ Has author cite element');
    } else {
        console.log('   ❌ Missing author cite');
    }

    console.log('\n📚 Usage Instructions:');
    console.log(result.usage_instructions || 'N/A');

    console.log('\n♿ Accessibility Notes:');
    console.log(result.accessibility_notes || 'N/A');
} else {
    console.log('Error:', result.error);
}

// Test 2: Get complete example
console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('Test 2: Get Complete Blockquote Example');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

const completeResult = Generator.getCompleteExample(db, 'Blockquote');

console.log('Result:', completeResult.success ? '✅ SUCCESS' : '❌ FAILED');

if (completeResult.success) {
    console.log('\nExample Type:', completeResult.example_type);
    console.log('Description:', completeResult.description);
    console.log('\n📝 HTML Code:');
    console.log(completeResult.html);

    // Check variants
    if (completeResult.variants && completeResult.variants.length > 0) {
        console.log('\n🎨 Available Variants:');
        completeResult.variants.forEach(v => {
            console.log(`   - ${v.variant}: ${v.description || 'N/A'}`);
        });
    }
} else {
    console.log('Error:', completeResult.error);
}

// Test 3: Search for blockquote examples
console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('Test 3: Search Blockquote Code Examples');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

const examples = db.prepare(`
  SELECT 
    ce.example_type,
    ce.description,
    ece.variant,
    ece.complexity
  FROM code_examples ce
  JOIN pages p ON ce.page_id = p.id
  LEFT JOIN enhanced_code_examples ece ON ce.id = ece.example_id
  WHERE p.title = 'Blockquote'
  ORDER BY ece.complexity
`).all();

console.log(`✅ Found ${examples.length} examples:\n`);
examples.forEach((ex, i) => {
    console.log(`${i + 1}. ${ex.description}`);
    console.log(`   Type: ${ex.example_type}`);
    console.log(`   Variant: ${ex.variant || 'N/A'}`);
    console.log(`   Complexity: ${ex.complexity || 'N/A'}\n`);
});

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('✨ All Tests Complete');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
