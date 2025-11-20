import Database from 'better-sqlite3';
import { searchComponents } from './src/search/component-search.js';

const db = new Database('ecl-database.sqlite');

console.log('Testing search with different parameters:\n');

// Test 1: Search with just category
console.log('1. Search by category: "forms"');
const test1 = searchComponents(db, { category: 'forms' });
console.log('Results:', test1);
console.log('');

// Test 2: Search with query
console.log('2. Search with query: "button"');
const test2 = searchComponents(db, { query: 'button' });
console.log('Results:', test2);
console.log('');

// Test 3: No parameters
console.log('3. No parameters (should return all):');
const test3 = searchComponents(db, {});
console.log('Results count:', test3.results?.length || 0);
console.log('');

db.close();
