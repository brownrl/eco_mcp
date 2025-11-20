#!/usr/bin/env node

/**
 * Fix Code Example Duplicates in Database
 * 
 * Issue: Many examples have duplicate code (102 total, 34 unique in Stacks)
 * This script identifies and removes duplicate code examples while preserving
 * the most descriptive/complete example for each unique code block.
 */

import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');
const dbPath = join(projectRoot, 'ecl-database.sqlite');

console.log('🔧 CODE EXAMPLE DEDUPLICATION SCRIPT\n');
console.log('Database:', dbPath);
console.log('');

const db = new Database(dbPath);

// Start transaction for safety
db.exec('BEGIN TRANSACTION');

try {
  console.log('ANALYZING code_examples TABLE');
  console.log('='.repeat(60));
  
  const totalExamples = db.prepare('SELECT COUNT(*) as count FROM code_examples').get();
  console.log(`Total examples: ${totalExamples.count}`);
  
  // Count duplicates using code content
  const duplicateAnalysis = db.prepare(`
    SELECT 
      COUNT(*) as total_rows,
      COUNT(DISTINCT code) as unique_code_blocks,
      COUNT(*) - COUNT(DISTINCT code) as duplicate_count
    FROM code_examples
  `).get();
  
  console.log(`Unique code blocks: ${duplicateAnalysis.unique_code_blocks}`);
  console.log(`Duplicates to remove: ${duplicateAnalysis.duplicate_count}`);
  console.log('');
  
  // Find examples with duplicates
  const pagesWithDuplicates = db.prepare(`
    SELECT 
      page_id,
      COUNT(*) as total,
      COUNT(DISTINCT code) as unique_code
    FROM code_examples
    GROUP BY page_id
    HAVING total > unique_code
    ORDER BY (total - unique_code) DESC
    LIMIT 10
  `).all();
  
  if (pagesWithDuplicates.length > 0) {
    console.log('Pages with most duplicates:');
    pagesWithDuplicates.forEach(page => {
      console.log(`  Page ${page.page_id}: ${page.total} examples, ${page.unique_code} unique (${page.total - page.unique_code} dupes)`);
    });
    console.log('');
  }
  
  // Deduplicate by keeping the best example for each unique code block
  console.log('DEDUPLICATING code_examples...');
  console.log('Strategy: Keep example with longest description for each unique code block');
  console.log('');
  
  // Create temp table with best example for each unique code
  db.exec(`
    CREATE TEMP TABLE code_examples_unique AS
    SELECT 
      id,
      component_id,
      page_id,
      example_type,
      language,
      code,
      description,
      position,
      created_at
    FROM (
      SELECT 
        *,
        ROW_NUMBER() OVER (
          PARTITION BY page_id, code 
          ORDER BY 
            CASE WHEN description IS NOT NULL THEN 1 ELSE 0 END DESC,
            LENGTH(COALESCE(description, '')) DESC,
            id ASC
        ) as rn
      FROM code_examples
    )
    WHERE rn = 1
  `);
  
  const uniqueExamples = db.prepare('SELECT COUNT(*) as count FROM code_examples_unique').get();
  console.log(`Unique examples selected: ${uniqueExamples.count}`);
  console.log(`Removing: ${totalExamples.count - uniqueExamples.count} duplicates`);
  console.log('');
  
  // Replace table
  db.exec('DELETE FROM code_examples');
  db.exec(`
    INSERT INTO code_examples 
    SELECT * FROM code_examples_unique
  `);
  
  const finalCount = db.prepare('SELECT COUNT(*) as count FROM code_examples').get();
  console.log(`After deduplication: ${finalCount.count} examples`);
  
  // Also deduplicate enhanced_code_examples if it exists
  console.log('');
  console.log('CHECKING enhanced_code_examples TABLE');
  console.log('='.repeat(60));
  
  const enhancedExists = db.prepare(`
    SELECT COUNT(*) as count 
    FROM sqlite_master 
    WHERE type='table' AND name='enhanced_code_examples'
  `).get();
  
  if (enhancedExists.count > 0) {
    const enhancedTotal = db.prepare('SELECT COUNT(*) as count FROM enhanced_code_examples').get();
    console.log(`Total enhanced examples: ${enhancedTotal.count}`);
    
    if (enhancedTotal.count > 0) {
      // Deduplicate enhanced examples by example_id
      db.exec(`
        CREATE TEMP TABLE enhanced_code_examples_unique AS
        SELECT 
          MIN(id) as id,
          example_id,
          variant,
          use_case,
          complexity,
          complete_example,
          requires_data,
          interactive,
          accessibility_notes,
          MIN(created_at) as created_at
        FROM enhanced_code_examples
        GROUP BY example_id
      `);
      
      const uniqueEnhanced = db.prepare('SELECT COUNT(*) as count FROM enhanced_code_examples_unique').get();
      console.log(`Unique enhanced examples: ${uniqueEnhanced.count}`);
      
      if (enhancedTotal.count > uniqueEnhanced.count) {
        db.exec('DELETE FROM enhanced_code_examples');
        db.exec(`
          INSERT INTO enhanced_code_examples
          SELECT * FROM enhanced_code_examples_unique
        `);
        
        const finalEnhanced = db.prepare('SELECT COUNT(*) as count FROM enhanced_code_examples').get();
        console.log(`After deduplication: ${finalEnhanced.count} enhanced examples`);
      } else {
        console.log('No duplicates found in enhanced_code_examples');
      }
    } else {
      console.log('Table is empty, skipping');
    }
  } else {
    console.log('Table does not exist, skipping');
  }
  
  // Commit transaction
  db.exec('COMMIT');
  
  console.log('');
  console.log('='.repeat(60));
  console.log('✅ CODE EXAMPLE DEDUPLICATION COMPLETE');
  console.log('='.repeat(60));
  console.log(`\nRemoved ${totalExamples.count - finalCount.count} duplicate code examples`);
  
} catch (error) {
  console.error('\n❌ ERROR during deduplication:', error.message);
  console.error('Rolling back changes...');
  db.exec('ROLLBACK');
  process.exit(1);
}

db.close();
