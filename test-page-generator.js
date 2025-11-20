#!/usr/bin/env node
/**
 * Test Complete Page Generator
 */

import { getDatabase, closeDatabase } from './src/db.js';
import * as Generator from './src/generator/index.js';

const db = getDatabase(true);

console.log('=== Test 1: Basic Page ===');
const basic = Generator.generateCompletePage(db, {
    preset: 'ec',
    pageType: 'basic',
    pageTitle: 'Welcome to ECL',
    components: [],
    content: {
        mainHeading: 'Welcome',
        leadParagraph: 'This is a basic ECL page'
    }
});

console.log('Success:', basic.success);
console.log('File size:', basic.data.metadata.fileSize, 'bytes');
console.log('Interactive:', basic.data.metadata.interactive);
console.log('Notes:', basic.data.notes.length);
console.log('\nFirst 500 chars of HTML:');
console.log(basic.data.html.substring(0, 500));

console.log('\n=== Test 2: Page with Components ===');
const withComponents = Generator.generateCompletePage(db, {
    preset: 'ec',
    pageType: 'article',
    pageTitle: 'ECL Article Page',
    components: ['Breadcrumb', 'Buttons', 'Accordion'],
    content: {
        mainHeading: 'Article Title',
        leadParagraph: 'Article introduction'
    }
});

console.log('Success:', withComponents.success);
console.log('Components:', withComponents.data.metadata.components);
console.log('Interactive:', withComponents.data.metadata.interactive);
console.log('Interactive components:', withComponents.data.metadata.interactiveComponents);
console.log('File size:', withComponents.data.metadata.fileSize, 'bytes');
console.log('Notes:');
withComponents.data.notes.forEach(note => {
    console.log(`  [${note.type}] ${note.message}`);
});

console.log('\n=== Test 3: Landing Page ===');
const landing = Generator.generateCompletePage(db, {
    preset: 'eu',
    pageType: 'landing',
    pageTitle: 'EU Landing Page',
    components: ['Site header', 'Page banner', 'Cards', 'Site footer'],
    includePrint: true
});

console.log('Success:', landing.success);
console.log('Preset:', landing.data.metadata.preset);
console.log('Components:', landing.data.metadata.components);
console.log('Interactive components:', landing.data.metadata.interactiveComponents);
console.log('Has Site header JS:', landing.data.html.includes('ECL.SiteHeader'));

console.log('\n=== Test 4: Check HTML Structure ===');
const hasDoctype = withComponents.data.html.startsWith('<!DOCTYPE html>');
const hasNoJs = withComponents.data.html.includes('class="no-js"');
const hasFontFix = withComponents.data.html.includes('font-family: Arial');
const hasECLautoInit = withComponents.data.html.includes('ECL.autoInit()');

console.log('Has DOCTYPE:', hasDoctype);
console.log('Has no-js class:', hasNoJs);
console.log('Has font fix:', hasFontFix);
console.log('Has ECL.autoInit():', hasECLautoInit);

closeDatabase(db);

console.log('\n✅ All tests completed!');
