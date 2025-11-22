#!/usr/bin/env node

const sqlite3 = require('better-sqlite3');
const prettier = require('prettier');

const db = sqlite3('./ecl-database.sqlite');

async function cleanupExamples() {
  console.log('Starting HTML cleanup for all examples...\n');
  
  // Get all examples
  const examples = db.prepare('SELECT id, code FROM examples').all();
  console.log(`Found ${examples.length} examples to process\n`);
  
  let successCount = 0;
  let errorCount = 0;
  let unchangedCount = 0;
  const errors = [];
  
  const updateStmt = db.prepare('UPDATE examples SET code = ? WHERE id = ?');
  
  for (const example of examples) {
    try {
      // Format with Prettier
      const formatted = await prettier.format(example.code, {
        parser: 'html',
        printWidth: 120,
        tabWidth: 2,
        useTabs: false,
        htmlWhitespaceSensitivity: 'ignore',
        bracketSameLine: true,
        singleAttributePerLine: false
      });
      
      // Only update if changed
      if (formatted.trim() !== example.code.trim()) {
        updateStmt.run(formatted.trim(), example.id);
        successCount++;
        if (successCount % 50 === 0) {
          console.log(`Processed ${successCount} examples...`);
        }
      } else {
        unchangedCount++;
      }
      
    } catch (err) {
      errorCount++;
      errors.push({ id: example.id, error: err.message });
    }
  }
  
  console.log('\n=== Cleanup Complete ===');
  console.log(`✅ Successfully formatted: ${successCount}`);
  console.log(`📝 Unchanged: ${unchangedCount}`);
  console.log(`❌ Errors: ${errorCount}`);
  
  if (errors.length > 0) {
    console.log('\nErrors encountered:');
    errors.forEach(e => console.log(`  - ID ${e.id}: ${e.error}`));
  }
  
  // Verify FTS is synced (triggers should handle this automatically)
  console.log('\nFTS triggers should have automatically updated the search index.');
}

cleanupExamples()
  .then(() => {
    db.close();
    console.log('\nDatabase closed.');
  })
  .catch(err => {
    console.error('Fatal error:', err);
    db.close();
    process.exit(1);
  });
