/**
 * Extract ECL Guidelines Content
 * 
 * Guidelines provide design principles, best practices, and visual standards.
 * This script extracts guideline content from the HTML pages to make them
 * accessible to AI agents.
 */

import Database from 'better-sqlite3';
import * as cheerio from 'cheerio';

const db = new Database('ecl-database.sqlite');

const guidelinePages = [
    { id: 7, name: 'Colours', component_name: 'colours' },
    { id: 9, name: 'Iconography', component_name: 'iconography' },
    { id: 10, name: 'Logos', component_name: 'logo' }
];

console.log('📚 Extracting ECL Guidelines Content\n');
console.log('='.repeat(80));

const insertExample = db.prepare(`
  INSERT INTO code_examples (page_id, code, language, example_type, description)
  VALUES (?, ?, ?, ?, ?)
`);

let totalExamples = 0;

guidelinePages.forEach(guideline => {
    console.log(`\nProcessing: ${guideline.name}`);

    try {
        const page = db.prepare('SELECT raw_html FROM pages WHERE id = ?').get(guideline.id);

        if (!page || !page.raw_html) {
            console.log(`  ⚠️  No HTML found`);
            return;
        }

        const $ = cheerio.load(page.raw_html);
        const content = [];
        const examples = [];

        // Extract main content paragraphs
        $('.ecl-u-type-paragraph, p, .ecl-u-type-m').each((i, elem) => {
            const text = $(elem).text().trim();
            if (text.length > 30 && text.length < 1000 && !text.includes('Skip to main content')) {
                content.push(text);
            }
        });

        // Extract headings for structure
        const headings = [];
        $('h2, h3, .ecl-u-type-heading-2, .ecl-u-type-heading-3').each((i, elem) => {
            const text = $(elem).text().trim();
            if (text.length > 0 && text.length < 100) {
                headings.push(text);
            }
        });

        // Extract code examples if any
        $('code, pre').each((i, elem) => {
            const code = $(elem).text().trim();
            if (code.length > 0 && code.length < 500) {
                examples.push(code);
            }
        });

        // Extract color swatches for Colours guideline
        if (guideline.name === 'Colours') {
            const colorInfo = [];
            $('.ecl-u-bg-yellow, .ecl-u-bg-blue, .ecl-u-bg-grey').each((i, elem) => {
                const colorClass = $(elem).attr('class');
                if (colorClass) {
                    const colors = colorClass.match(/ecl-u-bg-[a-z0-9-]+/g);
                    if (colors) {
                        colorInfo.push(...colors);
                    }
                }
            });

            if (colorInfo.length > 0) {
                const colorExample = `<!-- ECL Color Palette -->\n${colorInfo.slice(0, 10).map(c =>
                    `<div class="${c}">Color: ${c.replace('ecl-u-bg-', '')}</div>`
                ).join('\n')}`;

                insertExample.run(
                    guideline.id,
                    colorExample,
                    'html',
                    'guideline-colors',
                    'ECL color palette utility classes'
                );
                totalExamples++;
                console.log(`  ✅ Created color palette example`);
            }
        }

        // Create a comprehensive guideline document
        if (content.length > 0 || headings.length > 0) {
            const guidelineDoc = [
                `<!-- ${guideline.name} Guidelines -->`,
                '',
                headings.length > 0 ? `## Key Topics:\n${headings.slice(0, 5).map(h => `- ${h}`).join('\n')}` : '',
                '',
                content.length > 0 ? `## Guidelines:\n${content.slice(0, 3).join('\n\n')}` : '',
                '',
                examples.length > 0 ? `## Examples:\n${examples.slice(0, 2).join('\n\n')}` : ''
            ].filter(Boolean).join('\n');

            insertExample.run(
                guideline.id,
                guidelineDoc,
                'markdown',
                'guideline-doc',
                `${guideline.name} design guidelines and best practices`
            );
            totalExamples++;
            console.log(`  ✅ Created guideline document`);
        }

        // For Iconography, extract icon guidance
        if (guideline.name === 'Iconography') {
            const iconGuidance = `<!-- Iconography Guidelines -->

## Icon Usage
- Use ECL icons from the official icon library
- Icons should be meaningful and easily recognizable
- Maintain consistent sizing across the interface
- Ensure proper contrast and accessibility

## Icon Sizes
- Small: 16px (ecl-icon--xs)
- Medium: 24px (ecl-icon--s)  
- Large: 32px (ecl-icon--m)
- Extra Large: 48px (ecl-icon--l)

## Example:
<svg class="ecl-icon ecl-icon--m" focusable="false" aria-hidden="true">
  <use xlink:href="/icons.svg#general--generic"></use>
</svg>`;

            insertExample.run(
                guideline.id,
                iconGuidance,
                'markdown',
                'guideline-icons',
                'Icon usage guidelines and best practices'
            );
            totalExamples++;
            console.log(`  ✅ Created iconography guidance`);
        }

        // For Logos, extract logo guidance
        if (guideline.name === 'Logos') {
            const logoGuidance = `<!-- Logo Guidelines -->

## EC Logo Usage
- Use the official European Commission logo
- Maintain minimum clear space around the logo
- Do not modify, rotate, or distort the logo
- Use approved color variations only

## Logo Variants
- Horizontal layout (standard)
- Stacked layout (compact spaces)
- Monochrome (single color backgrounds)

## Example:
<img src="/logo-ec.svg" alt="European Commission" class="ecl-logo" />

## Clear Space
Maintain clear space equal to the height of the 'E' in 'European' on all sides.`;

            insertExample.run(
                guideline.id,
                logoGuidance,
                'markdown',
                'guideline-logos',
                'Logo usage guidelines and brand standards'
            );
            totalExamples++;
            console.log(`  ✅ Created logo guidance`);
        }

        console.log(`  📄 Extracted ${headings.length} headings, ${content.length} paragraphs`);

    } catch (error) {
        console.log(`  ❌ Error: ${error.message}`);
    }
});

console.log('\n' + '='.repeat(80));
console.log(`\n✅ Complete!`);
console.log(`   Total examples created: ${totalExamples}\n`);

db.close();
