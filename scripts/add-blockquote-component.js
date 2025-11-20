/**
 * Add Blockquote Component to ECL Database
 * Fixes incorrect blockquote structure with proper ECL-compliant HTML
 */

import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const dbPath = join(__dirname, '..', 'ecl-database.sqlite');

const db = new Database(dbPath);

console.log('\n📝 Adding Blockquote Component to ECL Database\n');

// 1. Create/update component
console.log('1️⃣ Creating Blockquote component...');
const insertComponent = db.prepare(`
  INSERT OR REPLACE INTO components (name, category, description, url)
  VALUES (?, ?, ?, ?)
`);

insertComponent.run(
  'Blockquote',
  'content',
  'Blockquote component for displaying quoted text with optional image and author attribution',
  'https://ec.europa.eu/component-library/ec/components/blockquote/'
);

const componentId = db.prepare('SELECT id FROM components WHERE name = ?').get('Blockquote').id;
console.log(`   ✅ Component created with ID: ${componentId}\n`);

// 2. Create page for blockquote
console.log('2️⃣ Creating Blockquote documentation page...');
const insertPage = db.prepare(`
  INSERT OR REPLACE INTO pages (url, title, component_name, category, raw_html)
  VALUES (?, ?, ?, ?, ?)
`);

insertPage.run(
  'https://ec.europa.eu/component-library/ec/components/blockquote/',
  'Blockquote',
  'Blockquote',
  'content',
  '<!-- Blockquote component page -->'
);

const pageId = db.prepare('SELECT id FROM pages WHERE title = ?').get('Blockquote').id;
console.log(`   ✅ Page created with ID: ${pageId}\n`);

// 3. Add code examples
console.log('3️⃣ Adding code examples...');

const examples = [
  {
    example_type: 'blockquote-text-only',
    description: 'Blockquote with text only (no image)',
    code: `<figure class="ecl-blockquote">
  <div class="ecl-blockquote__body">
    <blockquote class="ecl-blockquote__quote">
      <p class="ecl-blockquote__citation" lang="en">The European Union is a unique economic and political union between 27 EU countries that together cover much of the continent.</p>
      <footer class="ecl-blockquote__attribution">
        <cite class="ecl-blockquote__author">European Commission</cite>
      </footer>
    </blockquote>
  </div>
</figure>`,
    complexity: 'basic'
  },
  {
    example_type: 'blockquote-with-image',
    description: 'Blockquote with image and attribution',
    code: `<figure class="ecl-blockquote">
  <picture class="ecl-picture ecl-blockquote__picture">
    <img class="ecl-blockquote__image" src="https://inno-ecl.s3.amazonaws.com/media/examples/example-image.jpg" alt="Image description">
  </picture>
  <div class="ecl-blockquote__body">
    <blockquote class="ecl-blockquote__quote">
      <p class="ecl-blockquote__citation" lang="en">The European Union is a unique economic and political union between 27 EU countries that together cover much of the continent.</p>
      <footer class="ecl-blockquote__attribution">
        <cite class="ecl-blockquote__author">European Commission</cite>
      </footer>
    </blockquote>
  </div>
</figure>`,
    complexity: 'intermediate'
  },
  {
    example_type: 'blockquote-multilingual',
    description: 'Blockquote with multilingual citation',
    code: `<figure class="ecl-blockquote">
  <div class="ecl-blockquote__body">
    <blockquote class="ecl-blockquote__quote">
      <p class="ecl-blockquote__citation" lang="fr">L'Union européenne est une union économique et politique unique entre 27 pays de l'UE qui couvrent ensemble une grande partie du continent.</p>
      <footer class="ecl-blockquote__attribution">
        <cite class="ecl-blockquote__author">Commission européenne</cite>
      </footer>
    </blockquote>
  </div>
</figure>`,
    complexity: 'basic'
  }
];

const insertExample = db.prepare(`
  INSERT INTO code_examples (component_id, page_id, example_type, language, code, description, position)
  VALUES (?, ?, ?, ?, ?, ?, ?)
`);

const insertEnhanced = db.prepare(`
  INSERT INTO enhanced_code_examples (example_id, variant, use_case, complexity, complete_example, accessibility_notes)
  VALUES (?, ?, ?, ?, ?, ?)
`);

examples.forEach((example, index) => {
  const result = insertExample.run(
    componentId,
    pageId,
    example.example_type,
    'html',
    example.code,
    example.description,
    index
  );
  
  const exampleId = result.lastInsertRowid;
  
  // Add enhanced metadata
  insertEnhanced.run(
    exampleId,
    example.example_type.replace('blockquote-', ''),
    example.description,
    example.complexity,
    1, // complete_example
    'Use semantic HTML with lang attribute on citation. Figure element provides proper document structure.'
  );
  
  console.log(`   ✅ ${example.description}`);
});

console.log();

// 4. Add usage guidance
console.log('4️⃣ Adding usage guidance...');

const guidance = [
  {
    guidance_type: 'when-to-use',
    content: 'Use blockquotes to highlight important quotes, testimonials, or statements from authoritative sources. The blockquote component provides visual emphasis and proper semantic structure.'
  },
  {
    guidance_type: 'best-practice',
    content: 'Always include attribution using the <cite> element within the footer. Use the lang attribute on the citation paragraph when quoting text in a different language.'
  },
  {
    guidance_type: 'best-practice',
    content: 'The root element MUST be <figure class="ecl-blockquote">, not <blockquote>. The actual <blockquote> element is nested inside the body wrapper.'
  },
  {
    guidance_type: 'caveat',
    content: 'Do NOT use <blockquote> as the root element. ECL uses <figure> as the root with proper BEM nesting: figure > div.ecl-blockquote__body > blockquote.ecl-blockquote__quote'
  },
  {
    guidance_type: 'limitation',
    content: 'Images are optional but must use the structure: <picture class="ecl-picture ecl-blockquote__picture"> with <img class="ecl-blockquote__image">. Do not add images directly without proper wrapper.'
  }
];

const insertGuidance = db.prepare(`
  INSERT INTO usage_guidance (page_id, guidance_type, content, priority)
  VALUES (?, ?, ?, ?)
`);

guidance.forEach(g => {
  const priority = g.guidance_type === 'caveat' ? 10 : (g.guidance_type === 'best-practice' ? 8 : 5);
  insertGuidance.run(pageId, g.guidance_type, g.content, priority);
  console.log(`   ✅ ${g.guidance_type}: ${g.content.substring(0, 60)}...`);
});

console.log();

// 5. Add component metadata
console.log('5️⃣ Adding component metadata...');

const insertMetadata = db.prepare(`
  INSERT INTO component_metadata (page_id, component_name, component_type, complexity, requires_js)
  VALUES (?, ?, ?, ?, ?)
`);

insertMetadata.run(pageId, 'Blockquote', 'component', 'simple', 0);
console.log('   ✅ Metadata added\n');

// 6. Add component tags
console.log('6️⃣ Adding component tags...');

const tags = [
  { tag: 'quote', tag_type: 'feature' },
  { tag: 'citation', tag_type: 'feature' },
  { tag: 'testimonial', tag_type: 'use-case' },
  { tag: 'semantic-html', tag_type: 'feature' },
  { tag: 'content', tag_type: 'category' }
];

const insertTag = db.prepare(`
  INSERT OR IGNORE INTO component_tags (page_id, tag, tag_type)
  VALUES (?, ?, ?)
`);

tags.forEach(t => {
  insertTag.run(pageId, t.tag, t.tag_type);
  console.log(`   ✅ Tag: ${t.tag} (${t.tag_type})`);
});

console.log();

// 7. Add accessibility requirements
console.log('7️⃣ Adding accessibility requirements...');

const a11yRequirements = [
  {
    requirement_type: 'best-practice',
    description: 'Use semantic HTML elements (figure, blockquote, cite) for proper document structure',
    implementation: 'Root element is <figure>, quote text in <blockquote>, author in <cite>'
  },
  {
    requirement_type: 'wcag-aa',
    wcag_criterion: '3.1.2',
    description: 'Language of parts - Use lang attribute on citation when quoting text in different language',
    implementation: '<p class="ecl-blockquote__citation" lang="fr">Quote in French</p>'
  }
];

const insertA11y = db.prepare(`
  INSERT INTO accessibility_requirements (page_id, requirement_type, wcag_criterion, description, implementation)
  VALUES (?, ?, ?, ?, ?)
`);

a11yRequirements.forEach(req => {
  insertA11y.run(
    pageId,
    req.requirement_type,
    req.wcag_criterion || null,
    req.description,
    req.implementation
  );
  console.log(`   ✅ ${req.requirement_type}: ${req.description.substring(0, 50)}...`);
});

console.log();

// 8. Add content sections for documentation
console.log('8️⃣ Adding content sections...');

const sections = [
  {
    section_type: 'structure',
    heading: 'HTML Structure',
    content: `The blockquote component uses a figure element as the root, containing an optional picture element and a required body wrapper. The actual blockquote element is nested inside the body.

Correct structure:
- figure.ecl-blockquote (root)
  - picture.ecl-blockquote__picture (optional)
    - img.ecl-blockquote__image
  - div.ecl-blockquote__body (required)
    - blockquote.ecl-blockquote__quote (required)
      - p.ecl-blockquote__citation (quote text)
      - footer.ecl-blockquote__attribution
        - cite.ecl-blockquote__author (author name)`,
    position: 0
  },
  {
    section_type: 'usage',
    heading: 'When to Use',
    content: 'Use blockquotes to highlight important quotes, testimonials, or statements from authoritative sources. Include attribution to provide context and credibility.',
    position: 1
  },
  {
    section_type: 'accessibility',
    heading: 'Accessibility',
    content: 'Use the lang attribute on the citation paragraph when the quote is in a different language than the page. Use semantic HTML elements (figure, blockquote, cite) for proper screen reader support.',
    position: 2
  }
];

const insertSection = db.prepare(`
  INSERT INTO content_sections (page_id, section_type, heading, content, position)
  VALUES (?, ?, ?, ?, ?)
`);

sections.forEach(section => {
  insertSection.run(pageId, section.section_type, section.heading, section.content, section.position);
  console.log(`   ✅ ${section.heading}`);
});

db.close();

console.log('\n✨ Blockquote Component Successfully Added!\n');
console.log('📊 Summary:');
console.log('   - Component: Blockquote');
console.log('   - Code examples: 3 (text-only, with-image, multilingual)');
console.log('   - Usage guidance: 5 entries');
console.log('   - Tags: 5');
console.log('   - Accessibility requirements: 2');
console.log('   - Content sections: 3');
console.log();
console.log('🎯 Structure:');
console.log('   Root element: <figure class="ecl-blockquote">');
console.log('   Nested correctly: figure > div > blockquote > p + footer');
console.log('   All BEM classes matching ECL specification');
console.log();
console.log('✅ The ecl_generate_component tool will now return correct blockquote HTML!');
console.log();
