#!/usr/bin/env node

/**
 * Comprehensive MCP Tool Testing Script
 * Tests all 7 MCP tools with real-world queries to verify complete ECL coverage
 */

import { handleToolCall } from './src/tools/index.js';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load ECL data
const eclDataPath = path.join(__dirname, 'ecl-data.json');
const eclData = JSON.parse(await fs.readFile(eclDataPath, 'utf-8'));

// Test results tracking
const results = {
    total: 0,
    passed: 0,
    failed: 0,
    tests: []
};

// Test helper
async function test(name, toolName, args, validator) {
    results.total++;
    console.log(`\n🧪 Testing: ${name}`);
    console.log(`   Tool: ${toolName}`);
    console.log(`   Args: ${JSON.stringify(args, null, 2)}`);

    try {
        const response = await handleToolCall(toolName, args, eclData);
        const content = response.content[0].text;
        const data = JSON.parse(content);

        const isValid = validator(data);

        if (isValid) {
            results.passed++;
            console.log(`   ✅ PASS`);
            results.tests.push({ name, status: 'PASS', tool: toolName });
        } else {
            results.failed++;
            console.log(`   ❌ FAIL: Validation failed`);
            console.log(`   Response: ${JSON.stringify(data, null, 2).substring(0, 500)}`);
            results.tests.push({ name, status: 'FAIL', tool: toolName, reason: 'Validation failed' });
        }
    } catch (error) {
        results.failed++;
        console.log(`   ❌ FAIL: ${error.message}`);
        results.tests.push({ name, status: 'FAIL', tool: toolName, reason: error.message });
    }
}

console.log('═══════════════════════════════════════════════════════');
console.log('  ECL MCP SERVER - COMPREHENSIVE TOOL TESTING');
console.log('═══════════════════════════════════════════════════════\n');

// ============================================================================
// PHASE 1: Component Search & Retrieval (Critical Page-Building Components)
// ============================================================================
console.log('\n📦 PHASE 1: CRITICAL COMPONENT TESTING\n');

// Test 1: Search for Mega Menu
await test(
    'Search for "mega-menu" component',
    'ecl_search',
    { query: 'mega-menu', type: 'component' },
    (data) => data.success && data.data.results.length > 0
);

// Test 2: Get Mega Menu with examples
await test(
    'Get Mega Menu component with examples',
    'ecl_get_component',
    { component: 'mega-menu', include: ['details', 'examples'] },
    (data) => {
        if (!data.examples || !data.examples.success) return false;
        const examples = data.examples.data.examples;
        // Check that we have HTML examples with FULL code (not previews)
        return examples.html && examples.html.length > 0 &&
            examples.html[0].code && examples.html[0].code.length > 1000;
    }
);

// Test 3: Site Header
await test(
    'Get Site Header with examples',
    'ecl_get_component',
    { component: 'site-header', include: ['examples'] },
    (data) => data.examples && data.examples.success && data.examples.data.examples.html
);

// Test 4: Page Header
await test(
    'Get Page Header with examples',
    'ecl_get_component',
    { component: 'page-header', include: ['examples'] },
    (data) => data.examples && data.examples.success
);

// Test 5: Breadcrumb
await test(
    'Get Breadcrumb with examples',
    'ecl_get_component',
    { component: 'breadcrumb', include: ['examples'] },
    (data) => data.examples && data.examples.success && data.examples.data.total_count >= 3
);

// Test 6: Footer
await test(
    'Get Footer with examples',
    'ecl_get_component',
    { component: 'footer', include: ['examples'] },
    (data) => data.examples && data.examples.success
);

// ============================================================================
// PHASE 2: Form Components
// ============================================================================
console.log('\n📝 PHASE 2: FORM COMPONENT TESTING\n');

// Test 7: Text Field
await test(
    'Get Text Field with examples',
    'ecl_get_component',
    { component: 'text-field', include: ['examples'] },
    (data) => {
        if (!data.examples || !data.examples.success) return false;
        const examples = data.examples.data.examples.html;
        // Verify full code is returned (not truncated preview)
        return examples && examples.length > 0 && examples[0].code && examples[0].code.includes('ecl-form-group');
    }
);

// Test 8: Select
await test(
    'Get Select with examples',
    'ecl_get_component',
    { component: 'select', include: ['examples'] },
    (data) => data.examples && data.examples.success
);

// Test 9: Checkbox
await test(
    'Get Checkbox with examples',
    'ecl_get_component',
    { component: 'checkbox', include: ['examples'] },
    (data) => data.examples && data.examples.success
);

// Test 10: Radio
await test(
    'Get Radio with examples',
    'ecl_get_component',
    { component: 'radio', include: ['examples'] },
    (data) => data.examples && data.examples.success
);

// Test 11: File Upload
await test(
    'Get File Upload with examples',
    'ecl_get_component',
    { component: 'file-upload', include: ['examples'] },
    (data) => data.examples && data.examples.success
);

// Test 12: Datepicker
await test(
    'Get Datepicker with examples',
    'ecl_get_component',
    { component: 'datepicker', include: ['examples'] },
    (data) => data.examples && data.examples.success
);

// ============================================================================
// PHASE 3: Content Components
// ============================================================================
console.log('\n📄 PHASE 3: CONTENT COMPONENT TESTING\n');

// Test 13: Blockquote
await test(
    'Get Blockquote with examples',
    'ecl_get_component',
    { component: 'blockquote', include: ['examples'] },
    (data) => data.examples && data.examples.success
);

// Test 14: Button
await test(
    'Get Button with examples',
    'ecl_get_component',
    { component: 'button', include: ['examples'] },
    (data) => data.examples && data.examples.success
);

// Test 15: Card
await test(
    'Get Card with examples',
    'ecl_get_component',
    { component: 'card', include: ['examples'] },
    (data) => data.examples && data.examples.success
);

// Test 16: Table
await test(
    'Get Table with examples',
    'ecl_get_component',
    { component: 'table', include: ['examples'] },
    (data) => data.examples && data.examples.success
);

// Test 17: Accordion
await test(
    'Get Accordion with examples',
    'ecl_get_component',
    { component: 'accordion', include: ['examples'] },
    (data) => data.examples && data.examples.success
);

// ============================================================================
// PHASE 4: Utilities
// ============================================================================
console.log('\n🛠️  PHASE 4: UTILITIES TESTING\n');

// Test 18: Typography utilities
await test(
    'Search for Typography utilities',
    'ecl_search',
    { query: 'typography', type: 'typography' },
    (data) => data.success && data.data
);

// Test 19: Get Typography resources
await test(
    'Get Typography guide',
    'ecl_get_resources',
    { type: 'typography' },
    (data) => data && Object.keys(data).length > 0
);

// ============================================================================
// PHASE 5: Code Generation
// ============================================================================
console.log('\n⚙️  PHASE 5: CODE GENERATION TESTING\n');

// Test 20: Generate component code
await test(
    'Generate Button component code',
    'ecl_generate_code',
    { type: 'component', name: 'Button' },
    (data) => data.success && data.data && data.data.code
);

// Test 21: Generate complete page
await test(
    'Generate basic page',
    'ecl_generate_code',
    { type: 'page', name: 'basic', options: { pageTitle: 'Test Page' } },
    (data) => data.success && data.data && data.data.html
);

// ============================================================================
// PHASE 6: Edge Cases & Fuzzy Matching
// ============================================================================
console.log('\n🔍 PHASE 6: FUZZY MATCHING & EDGE CASES\n');

// Test 22: UPPERCASE search
await test(
    'Search with UPPERCASE: "BREADCRUMB"',
    'ecl_get_component',
    { component: 'BREADCRUMB', include: ['examples'] },
    (data) => data.examples && data.examples.success
);

// Test 23: Mixed case with spaces
await test(
    'Search with spaces: "Mega menu"',
    'ecl_get_component',
    { component: 'Mega menu', include: ['examples'] },
    (data) => data.examples && data.examples.success
);

// Test 24: Hyphens
await test(
    'Search with hyphens: "text-field"',
    'ecl_get_component',
    { component: 'text-field', include: ['examples'] },
    (data) => data.examples && data.examples.success
);

// Test 25: Partial match
await test(
    'Partial match: "mega"',
    'ecl_search',
    { query: 'mega', type: 'component' },
    (data) => data.success && data.data.results.some(r => r.title.toLowerCase().includes('mega'))
);

// ============================================================================
// PHASE 7: System Health
// ============================================================================
console.log('\n🏥 PHASE 7: SYSTEM HEALTH\n');

// Test 26: System info
await test(
    'Get system info',
    'ecl_system_info',
    {},
    (data) => data.success && data.data && data.data.status === 'healthy'
);

// ============================================================================
// RESULTS SUMMARY
// ============================================================================
console.log('\n═══════════════════════════════════════════════════════');
console.log('  TEST RESULTS SUMMARY');
console.log('═══════════════════════════════════════════════════════\n');

console.log(`Total Tests:  ${results.total}`);
console.log(`✅ Passed:    ${results.passed} (${Math.round(results.passed / results.total * 100)}%)`);
console.log(`❌ Failed:    ${results.failed} (${Math.round(results.failed / results.total * 100)}%)`);

if (results.failed > 0) {
    console.log('\n❌ FAILED TESTS:');
    results.tests.filter(t => t.status === 'FAIL').forEach(t => {
        console.log(`   - ${t.name} (${t.tool}): ${t.reason}`);
    });
}

console.log('\n═══════════════════════════════════════════════════════\n');

// Exit with appropriate code
process.exit(results.failed > 0 ? 1 : 0);
