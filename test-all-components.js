import { generateComponent } from './src/generator/index.js';
import Database from 'better-sqlite3';

const db = new Database('ecl-database.sqlite');

// All ECL components from the list
const components = [
  // Content components
  'Accordion', 'Blockquotes', 'Buttons', 'Cards', 'Category filter',
  'Content items', 'Date blocks', 'Expandables', 'Fact and figures',
  'File', 'Icons', 'Labels', 'Lists', 'List with illustrations',
  'Notifications', 'Modal', 'News ticker', 'Popover',
  'Social media follow', 'Social media share', 'Splash page',
  'Loading indicator', 'Tables', 'Tags', 'Timeline',
  
  // Site wide
  'Site header', 'Page header', 'Site footer',
  
  // Banners
  'Banner', 'Carousel',
  
  // Forms
  'Checkbox', 'Datepicker', 'File upload', 'Radio', 'Range',
  'Search form', 'Select', 'Text area', 'Text field', 'Rating field',
  
  // Media
  'Gallery', 'Media container', 'Featured item',
  
  // Navigation
  'Breadcrumb', 'Inpage navigation', 'Links', 'Menu',
  'Navigation list', 'Pagination', 'Tabs'
];

console.log('🔍 Testing All ECL Components');
console.log('='.repeat(80));
console.log(`Total components to test: ${components.length}\n`);

const results = {
  success: [],
  failed: [],
  empty: []
};

components.forEach(component => {
  const result = generateComponent(db, component);
  
  if (result.success) {
    const code = result.generated_code.html || result.generated_code;
    if (code && code.length > 50) {
      results.success.push({
        name: component,
        size: code.length,
        hasInstructions: !!result.usage_instructions
      });
      console.log(`✅ ${component.padEnd(30)} → ${code.length.toString().padStart(5)} bytes`);
    } else {
      results.empty.push(component);
      console.log(`⚠️  ${component.padEnd(30)} → Generated but too short (${code.length} bytes)`);
    }
  } else {
    results.failed.push({
      name: component,
      error: result.error
    });
    console.log(`❌ ${component.padEnd(30)} → FAILED: ${result.error}`);
  }
});

console.log('\n' + '='.repeat(80));
console.log('\n📊 SUMMARY\n');
console.log(`✅ Success: ${results.success.length}/${components.length} (${Math.round(results.success.length/components.length*100)}%)`);
console.log(`❌ Failed:  ${results.failed.length}/${components.length}`);
console.log(`⚠️  Empty:   ${results.empty.length}/${components.length}`);

if (results.failed.length > 0) {
  console.log('\n❌ FAILED COMPONENTS:');
  results.failed.forEach(item => {
    console.log(`   - ${item.name}: ${item.error}`);
  });
}

if (results.empty.length > 0) {
  console.log('\n⚠️  EMPTY/SHORT COMPONENTS:');
  results.empty.forEach(name => {
    console.log(`   - ${name}`);
  });
}

// Test with variations (singular forms)
console.log('\n' + '='.repeat(80));
console.log('\n🔄 Testing Singular Variations\n');

const singularTests = [
  'accordion', 'button', 'card', 'icon', 'label', 'list', 'table', 'tag', 'tab', 'link'
];

singularTests.forEach(component => {
  const result = generateComponent(db, component);
  if (result.success) {
    console.log(`✅ "${component}" (singular) → Found!`);
  } else {
    console.log(`❌ "${component}" (singular) → ${result.error}`);
  }
});

db.close();
