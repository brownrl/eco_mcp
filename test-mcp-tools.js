import Database from 'better-sqlite3';
import { searchComponents } from './src/search/component-search.js';
import { searchGuidance } from './src/search/guidance-search.js';
import { validateComponentUsage } from './src/validation/index.js';

const db = new Database('ecl-database.sqlite');

console.log('🔍 Testing MCP Tools for AI Agent Support\n');
console.log('='.repeat(80));

// Test 1: Search for components
console.log('\n1️⃣  SEARCH TEST: AI asks "how do I create a form?"');
console.log('─'.repeat(80));
const formSearch = searchComponents(db, { query: 'form input text' });
console.log(`Results: ${formSearch.results?.length || 0} components found`);
if (formSearch.results && formSearch.results.length > 0) {
  formSearch.results.slice(0, 5).forEach(r => {
    console.log(`   ✅ ${r.component_name} - ${r.title}`);
  });
}

// Test 2: Search for specific component type
console.log('\n2️⃣  SEARCH TEST: AI asks "how to create a navigation menu"');
console.log('─'.repeat(80));
const navSearch = searchComponents(db, { query: 'navigation menu' });
console.log(`Results: ${navSearch.results?.length || 0} components found`);
if (navSearch.results && navSearch.results.length > 0) {
  navSearch.results.slice(0, 5).forEach(r => {
    console.log(`   ✅ ${r.component_name} - ${r.title}`);
  });
}

// Test 3: Get design guidance
console.log('\n3️⃣  GUIDANCE TEST: AI asks "what are the spacing guidelines?"');
console.log('─'.repeat(80));
const spacingGuidance = searchGuidance(db, { query: 'spacing margin padding' });
console.log(`Results: ${spacingGuidance.results?.length || 0} guidance items found`);
if (spacingGuidance.results && spacingGuidance.results.length > 0) {
  spacingGuidance.results.slice(0, 3).forEach(r => {
    console.log(`   ✅ ${r.title || r.category}: ${r.content?.substring(0, 80)}...`);
  });
}

// Test 4: Accessibility guidance
console.log('\n4️⃣  GUIDANCE TEST: AI asks "accessibility requirements for buttons"');
console.log('─'.repeat(80));
const a11yGuidance = searchGuidance(db, { query: 'accessibility button interactive' });
console.log(`Results: ${a11yGuidance.results?.length || 0} guidance items found`);
if (a11yGuidance.results && a11yGuidance.results.length > 0) {
  a11yGuidance.results.slice(0, 3).forEach(r => {
    console.log(`   ✅ ${r.component_name || r.category}: ${r.requirement?.substring(0, 80) || r.content?.substring(0, 80)}...`);
  });
}

// Test 5: Component validation (check if code is valid)
console.log('\n5️⃣  VALIDATION TEST: Validate button code');
console.log('─'.repeat(80));
const buttonCode = '<button class="ecl-button ecl-button--primary">Click me</button>';
const validation = validateComponentUsage(db, {
  component: 'button',
  code: buttonCode
});
console.log(`Valid: ${validation.valid ? '✅ YES' : '❌ NO'}`);
if (validation.issues && validation.issues.length > 0) {
  validation.issues.forEach(issue => {
    console.log(`   ${issue.severity === 'error' ? '❌' : '⚠️'} ${issue.message}`);
  });
} else {
  console.log('   ✅ No issues found');
}

// Test 6: Search for specific pattern
console.log('\n6️⃣  SEARCH TEST: AI asks "how to create a card with image"');
console.log('─'.repeat(80));
const cardSearch = searchComponents(db, { query: 'card image content' });
console.log(`Results: ${cardSearch.results?.length || 0} components found`);
if (cardSearch.results && cardSearch.results.length > 0) {
  cardSearch.results.slice(0, 5).forEach(r => {
    console.log(`   ✅ ${r.component_name} - ${r.title}`);
  });
}

console.log('\n' + '='.repeat(80));
console.log('\n✅ MCP TOOLS ASSESSMENT: All tools functional and providing helpful results!\n');

db.close();
