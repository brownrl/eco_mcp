import { getDatabase } from './src/db.js';
const db = getDatabase(true);

const testComponents = ['Breadcrumb', 'Accordion', 'Cards'];

for (const compName of testComponents) {
    console.log(`\n=== ${compName} ===`);

    const page = db.prepare('SELECT id, title FROM pages WHERE LOWER(title) = LOWER(?) LIMIT 1').get(compName);
    console.log('Page found:', page?.title, '(ID:', page?.id, ')');

    if (page) {
        const example = db.prepare(`
      SELECT ce.id, ce.code, ece.variant, ece.use_case, ece.complete_example
      FROM code_examples ce
      LEFT JOIN enhanced_code_examples ece ON ce.id = ece.example_id
      WHERE ce.page_id = ? AND ce.language = 'html'
      ORDER BY 
        ece.complete_example DESC,
        LENGTH(ce.code) DESC,
        ce.id ASC
      LIMIT 1
    `).get(page.id);

        console.log('Example ID:', example?.id);
        console.log('Code length:', example?.code?.length);
        console.log('Variant:', example?.variant || 'none');
        console.log('Complete:', example?.complete_example);
        console.log('Code preview:', example?.code?.substring(0, 100));
    }
}

db.close();
