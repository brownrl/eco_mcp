#!/usr/bin/env node

/**
 * Test Design Token Tools
 * Tests all token-related MCP tools after extraction
 */

import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const DB_PATH = join(__dirname, 'ecl-database.sqlite');

const db = new Database(DB_PATH);

let testsPassed = 0;
let testsFailed = 0;

function assert(condition, message) {
    if (condition) {
        console.log(`✓ ${message}`);
        testsPassed++;
    } else {
        console.error(`✗ ${message}`);
        testsFailed++;
    }
}

function test(name, fn) {
    console.log(`\n${name}`);
    try {
        fn();
    } catch (error) {
        console.error(`✗ Test failed: ${error.message}`);
        testsFailed++;
    }
}

// Import token search functions
import {
    searchDesignTokens,
    getTokensByCategory,
    getToken,
    getTokenCategories
} from './src/search/token-search.js';

test('Search color tokens by keyword', () => {
    const response = searchDesignTokens(db, { query: 'primary' });
    assert(response.success, 'Search succeeded');
    assert(response.data.total_count > 0, `Found ${response.data.total_count} primary tokens`);
    assert(response.data.categories.includes('color'), 'Results include color category');
});

test('Search spacing tokens', () => {
    const response = searchDesignTokens(db, { query: 'spacing', category: 'spacing' });
    assert(response.success, 'Search succeeded');
    assert(response.data.total_count >= 10, `Found ${response.data.total_count} spacing tokens (expected >=10)`);
});

test('Get color tokens by category', () => {
    const response = getTokensByCategory(db, 'color');
    assert(response.success, 'Get tokens succeeded');
    assert(response.data.count === 37, `Found ${response.data.count} color tokens (expected 37)`);
    assert(response.data.tokens.some(c => c.value && c.value.startsWith('#')), 'Colors have hex values');
});

test('Get spacing tokens by category', () => {
    const response = getTokensByCategory(db, 'spacing');
    assert(response.success, 'Get tokens succeeded');
    assert(response.data.count === 10, `Found ${response.data.count} spacing tokens (expected 10)`);
    assert(response.data.tokens.some(s => s.value && s.value.includes('px')), 'Spacing has pixel values');
});

test('Get typography tokens by category', () => {
    const response = getTokensByCategory(db, 'typography');
    assert(response.success, 'Get tokens succeeded');
    assert(response.data.count === 14, `Found ${response.data.count} typography tokens (expected 14)`);
    assert(response.data.tokens.some(t => t.token_name && t.token_name.includes('heading')), 'Typography includes heading tokens');
});

test('Get specific token by name', () => {
    const response = getToken(db, 'Primary-100 (Primary)');
    assert(response.success, 'Get token succeeded');
    assert(response.data.value === '#3860ED', `Primary color is #3860ED (got ${response.data.value})`);
    assert(response.data.css_variable === '--ecl-color-primary-100', `CSS variable is --ecl-color-primary-100`);
});

test('Get spacing token by name', () => {
    const response = getToken(db, 'xl');
    assert(response.success, 'Get token succeeded');
    assert(response.data.value === '24px', `XL spacing is 24px (got ${response.data.value})`);
    assert(response.data.category === 'spacing', 'Token is spacing category');
});

test('Get typography token', () => {
    const response = getToken(db, 'body-base');
    assert(response.success, 'Get token succeeded');
    assert(response.data.value === '16px', `Body base is 16px (got ${response.data.value})`);
    assert(response.data.css_variable === '--ecl-font-size-base', 'Has correct CSS variable');
});

test('Search tokens with multiple matches', () => {
    const response = searchDesignTokens(db, { query: 'neutral' });
    assert(response.success, 'Search succeeded');
    assert(response.data.total_count > 0, `Found ${response.data.total_count} neutral tokens`);
});

test('Search returns usage context', () => {
    const response = searchDesignTokens(db, { query: 'heading' });
    assert(response.success, 'Search succeeded');
    assert(response.data.total_count > 0, 'Found heading tokens');
    // Check that at least one token has usage context
    const allTokens = Object.values(response.data.results).flat();
    assert(allTokens.some(t => t.usage_context && t.usage_context.length > 0), 'At least one token has usage context');
});

test('Token descriptions are populated', () => {
    const response = getTokensByCategory(db, 'color');
    assert(response.success, 'Get tokens succeeded');
    assert(response.data.tokens.every(t => t.description && t.description.length > 0), 'All color tokens have descriptions');
});

test('CSS variables follow ECL naming', () => {
    const colorResp = getTokensByCategory(db, 'color');
    assert(colorResp.data.tokens.every(c => c.css_variable && c.css_variable.startsWith('--ecl-color-')), 'All color CSS vars start with --ecl-color-');

    const spacingResp = getTokensByCategory(db, 'spacing');
    assert(spacingResp.data.tokens.every(s => s.css_variable && s.css_variable.startsWith('--ecl-spacing-')), 'All spacing CSS vars start with --ecl-spacing-');
});

test('Verify all categories exist', () => {
    const response = getTokenCategories(db);
    assert(response.success, 'Get categories succeeded');

    const categoryNames = response.data.categories.map(c => c.name);
    assert(categoryNames.includes('color'), 'Color category exists');
    assert(categoryNames.includes('spacing'), 'Spacing category exists');
    assert(categoryNames.includes('typography'), 'Typography category exists');
    assert(response.data.total_categories === 3, `Exactly 3 categories (got ${response.data.total_categories})`);
    assert(response.data.total_tokens === 61, `Total 57 tokens (got ${response.data.total_tokens})`);
});

test('Search case insensitivity', () => {
    const lower = searchDesignTokens(db, { query: 'primary' });
    const upper = searchDesignTokens(db, { query: 'PRIMARY' });
    const mixed = searchDesignTokens(db, { query: 'Primary' });

    assert(lower.data.total_count === upper.data.total_count && upper.data.total_count === mixed.data.total_count,
        'Case-insensitive search works');
});

test('Get non-existent token', () => {
    const response = getToken(db, 'nonexistent-token-xyz');
    assert(!response.success, 'Returns error for non-existent token');
    assert(response.data === null, 'Data is null for non-existent token');
    assert(response.suggestions && response.suggestions.length > 0, 'Provides suggestions');
});

test('Get tokens with special characters', () => {
    const response = getToken(db, 'heading-1-3xl'); // Contains hyphens and numbers
    assert(response.success, 'Found token with hyphens and numbers');
});

test('Search by category filter', () => {
    const response = searchDesignTokens(db, { category: 'typography' });
    assert(response.success, 'Search succeeded');
    assert(response.data.total_count === 14, `Found ${response.data.total_count} typography tokens (expected 14)`);
    assert(response.data.categories.length === 1, 'Only one category in results');
    assert(response.data.categories[0] === 'typography', 'Category is typography');
});

test('Search with limit', () => {
    const response = searchDesignTokens(db, { query: '', limit: 5 });
    assert(response.success, 'Search succeeded');
    assert(response.data.total_count <= 5, `Respects limit of 5 (got ${response.data.total_count})`);
});

test('Token values have correct formats', () => {
    const colorResp = getTokensByCategory(db, 'color');
    assert(colorResp.data.tokens.every(t => /^#[0-9A-F]{6}$/i.test(t.value)), 'All colors are valid hex codes');

    const spacingResp = getTokensByCategory(db, 'spacing');
    assert(spacingResp.data.tokens.every(t => /^\d+px$/.test(t.value)), 'All spacing values are in pixels');

    const typographyResp = getTokensByCategory(db, 'typography');
    const numericTokens = typographyResp.data.tokens.filter(t => !t.token_name.includes('weight') && !t.token_name.includes('height'));
    assert(numericTokens.every(t => /^\d+px$/.test(t.value) || /^[\d.]+$/.test(t.value)), 'Typography values are numeric or pixels');
});

// Summary
console.log('\n' + '='.repeat(50));
console.log(`Tests Passed: ${testsPassed}`);
console.log(`Tests Failed: ${testsFailed}`);
console.log('='.repeat(50));

db.close();

process.exit(testsFailed > 0 ? 1 : 0);
