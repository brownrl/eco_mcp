/**
 * Complete Page Generator
 * 
 * Generates complete, ready-to-use ECL pages with all boilerplate,
 * components, and initialization code.
 */

/**
 * Generate a complete ECL page
 * @param {Object} db - Database instance
 * @param {Object} options - Page generation options
 * @param {string} options.preset - 'ec' or 'eu'
 * @param {string} options.pageType - Page type (landing, article, search-results, etc.)
 * @param {string} options.pageTitle - Page title
 * @param {Array<string>} options.components - Component names to include
 * @param {Object} options.content - Content placeholders
 * @param {string} options.cdnVersion - ECL version (default: 4.11.0)
 * @returns {Object} Generated page
 */
export function generateCompletePage(db, options = {}) {
    const startTime = Date.now();

    const {
        preset = 'ec',
        pageType = 'basic',
        pageTitle = 'European Commission Page',
        components = [],
        content = {},
        cdnVersion = '4.11.0',
        includeReset = true,
        includePrint = false
    } = options;

    try {
        // Get page template based on type
        const template = getPageTemplate(pageType);

        // Get component HTML for requested components
        const componentData = getComponentsHTML(db, components, preset);

        // Detect interactive components
        const interactiveComponents = detectInteractiveComponents(components);
        const needsJS = interactiveComponents.length > 0;

        // Build page HTML
        const html = buildPageHTML({
            preset,
            pageTitle,
            pageType,
            template,
            componentData,
            content,
            cdnVersion,
            includeReset,
            includePrint,
            needsJS,
            interactiveComponents
        });

        // Generate metadata
        const metadata = {
            preset,
            pageType,
            components: components.length,
            interactive: needsJS,
            interactiveComponents,
            cdnVersion,
            fileSize: html.length
        };

        return {
            success: true,
            data: {
                html,
                metadata,
                notes: generatePageNotes(pageType, componentData, interactiveComponents)
            },
            metadata: {
                tool: 'ecl_generate_complete_page',
                execution_time_ms: Date.now() - startTime,
                source: 'ecl-database',
                version: '2.0'
            }
        };

    } catch (error) {
        return {
            success: false,
            data: { html: '', metadata: {}, notes: [] },
            errors: [{
                code: 'PAGE_GENERATION_ERROR',
                message: error.message,
                details: error.stack
            }],
            metadata: {
                tool: 'ecl_generate_complete_page',
                execution_time_ms: Date.now() - startTime
            }
        };
    }
}

/**
 * Get page template structure
 */
function getPageTemplate(pageType) {
    const templates = {
        basic: {
            structure: ['header', 'main', 'footer'],
            description: 'Basic page with header, main content, and footer'
        },
        landing: {
            structure: ['header', 'hero', 'content-sections', 'footer'],
            description: 'Landing page with hero banner and content sections'
        },
        article: {
            structure: ['header', 'breadcrumb', 'page-header', 'article-content', 'footer'],
            description: 'Article/content page with breadcrumb and page header'
        },
        'search-results': {
            structure: ['header', 'breadcrumb', 'search-form', 'results-list', 'pagination', 'footer'],
            description: 'Search results page'
        },
        'list-page': {
            structure: ['header', 'breadcrumb', 'page-header', 'filters', 'list-content', 'pagination', 'footer'],
            description: 'List/index page with filters and pagination'
        }
    };

    return templates[pageType] || templates.basic;
}

/**
 * Get HTML for requested components
 */
function getComponentsHTML(db, components, preset) {
    const componentData = [];

    for (const componentName of components) {
        try {
            // Get component page that has HTML examples
            const page = db.prepare(`
        SELECT DISTINCT p.id, p.title, p.url
        FROM pages p
        JOIN code_examples ce ON p.id = ce.page_id
        WHERE LOWER(p.title) = LOWER(?)
        AND ce.language = 'html'
        ORDER BY p.id ASC
        LIMIT 1
      `).get(componentName);

            if (!page) {
                componentData.push({
                    name: componentName,
                    success: false,
                    html: `<!-- Component "${componentName}" not found -->`,
                    note: `Component "${componentName}" not found in database`
                });
                continue;
            }

            // Get a complete example (prioritize complete, but fall back to any example)
            const example = db.prepare(`
        SELECT ce.code, ece.variant, ece.use_case, ece.complete_example
        FROM code_examples ce
        LEFT JOIN enhanced_code_examples ece ON ce.id = ece.example_id
        WHERE ce.page_id = ? AND ce.language = 'html'
        ORDER BY 
          ece.complete_example DESC,
          LENGTH(ce.code) DESC,
          ce.id ASC
        LIMIT 1
      `).get(page.id);

            if (example) {
                componentData.push({
                    name: componentName,
                    success: true,
                    html: example.code,
                    variant: example.variant,
                    use_case: example.use_case,
                    url: page.url
                });
            } else {
                componentData.push({
                    name: componentName,
                    success: false,
                    html: `<!-- No complete example found for "${componentName}" -->`,
                    note: `No complete HTML example available for "${componentName}"`
                });
            }

        } catch (error) {
            componentData.push({
                name: componentName,
                success: false,
                html: `<!-- Error loading "${componentName}": ${error.message} -->`,
                note: error.message
            });
        }
    }

    return componentData;
}

/**
 * Detect interactive components that need JavaScript
 */
function detectInteractiveComponents(components) {
    const interactiveList = [
        'accordion', 'banner', 'carousel', 'category filter', 'datepicker',
        'expandable', 'file upload', 'gallery', 'inpage navigation',
        'mega menu', 'menu', 'message', 'modal', 'navigation list',
        'notification', 'popover', 'tabs', 'timeline', 'site header',
        'site footer', 'site-header', 'site-footer'
    ];

    return components.filter(comp => {
        const normalized = comp.toLowerCase().trim();
        return interactiveList.some(ic => {
            const icNorm = ic.toLowerCase();
            return normalized.includes(icNorm) || icNorm.includes(normalized);
        });
    });
}

/**
 * Build complete HTML page
 */
function buildPageHTML(options) {
    const {
        preset,
        pageTitle,
        pageType,
        template,
        componentData,
        content,
        cdnVersion,
        includeReset,
        includePrint,
        needsJS,
        interactiveComponents
    } = options;

    const presetName = preset === 'eu' ? 'preset-eu' : 'preset-ec';
    const cdnBase = `https://cdn.jsdelivr.net/npm/@ecl/${presetName}@${cdnVersion}`;

    // Build HTML
    let html = `<!DOCTYPE html>
<html lang="en" class="no-js">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(pageTitle)}</title>
  
  <!-- ECL Stylesheets -->
  <link rel="stylesheet" href="${cdnBase}/dist/styles/ecl-${preset}.css" media="screen">
  <link rel="stylesheet" href="${cdnBase}/dist/styles/ecl-${preset}-utilities.css" media="screen">`;

    if (includePrint) {
        html += `
  <link rel="stylesheet" href="${cdnBase}/dist/styles/ecl-${preset}-print.css" media="print">`;
    }

    html += `
  
  <!-- Critical CSS: Font Family Fix -->
  <style>
    html {
      font-family: Arial, sans-serif !important;
    }
  </style>
  
  <!-- No-JS Detection -->
  <script>
    document.documentElement.classList.remove('no-js');
    document.documentElement.classList.add('has-js');
  </script>
</head>
<body>`;

    // Add page structure based on template
    html += generatePageStructure(template, componentData, content, preset);

    // Add JavaScript if needed
    if (needsJS) {
        html += `

  <!-- ECL JavaScript -->
  <script src="${cdnBase}/dist/scripts/ecl-${preset}.js"></script>
  <script>
    // Initialize all ECL components
    ECL.autoInit();
    
    // Manual initialization examples (if needed):`;

        for (const comp of interactiveComponents) {
            const className = getECLClassName(comp);
            html += `
    // ECL.${className}.initAll();`;
        }

        html += `
  </script>`;
    }

    html += `
</body>
</html>`;

    return html;
}

/**
 * Generate page structure based on template
 */
function generatePageStructure(template, componentData, content, preset) {
    let structure = '\n  <!-- Main Page Container -->\n';
    structure += '  <main class="ecl-container">\n';

    // Add components in order
    for (const comp of componentData) {
        if (comp.success) {
            structure += `\n    <!-- ${comp.name} -->\n`;
            structure += indentHTML(comp.html, 4);
            structure += '\n';
        } else {
            structure += `\n    ${comp.html}\n`;
        }
    }

    // Add placeholder content if no components
    if (componentData.length === 0) {
        structure += `
    <div class="ecl-u-pv-2xl">
      <h1 class="ecl-u-type-heading-1">${escapeHtml(content.mainHeading || 'Page Title')}</h1>
      <p class="ecl-u-type-paragraph-lead">${escapeHtml(content.leadParagraph || 'This is a template page. Add components to customize it.')}</p>
    </div>`;
    }

    structure += '  </main>\n';

    return structure;
}

/**
 * Get ECL JavaScript class name for component
 */
function getECLClassName(componentName) {
    const classMap = {
        'accordion': 'Accordion',
        'banner': 'Banner',
        'carousel': 'Carousel',
        'datepicker': 'Datepicker',
        'expandable': 'Expandable',
        'file upload': 'FileUpload',
        'gallery': 'Gallery',
        'inpage navigation': 'InpageNavigation',
        'mega menu': 'MegaMenu',
        'menu': 'Menu',
        'message': 'Message',
        'modal': 'Modal',
        'notification': 'Notification',
        'popover': 'Popover',
        'tabs': 'Tabs',
        'timeline': 'Timeline',
        'site header': 'SiteHeader',
        'site-header': 'SiteHeader',
        'site footer': 'SiteFooter',
        'site-footer': 'SiteFooter'
    };

    return classMap[componentName.toLowerCase()] || toPascalCase(componentName);
}

/**
 * Convert to PascalCase
 */
function toPascalCase(str) {
    return str
        .split(/[\s-_]+/)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join('');
}

/**
 * Indent HTML
 */
function indentHTML(html, spaces) {
    const indent = ' '.repeat(spaces);
    return html
        .split('\n')
        .map(line => line.trim() ? indent + line : line)
        .join('\n');
}

/**
 * Escape HTML entities
 */
function escapeHtml(str) {
    const entities = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
    };
    return str.replace(/[&<>"']/g, char => entities[char]);
}

/**
 * Generate page notes
 */
function generatePageNotes(pageType, componentData, interactiveComponents) {
    const notes = [];

    notes.push({
        type: 'info',
        message: `Generated ${pageType} page with ${componentData.length} component(s)`
    });

    const failedComponents = componentData.filter(c => !c.success);
    if (failedComponents.length > 0) {
        notes.push({
            type: 'warning',
            message: `${failedComponents.length} component(s) could not be loaded: ${failedComponents.map(c => c.name).join(', ')}`
        });
    }

    if (interactiveComponents.length > 0) {
        notes.push({
            type: 'success',
            message: `JavaScript initialized for: ${interactiveComponents.join(', ')}`
        });
    }

    notes.push({
        type: 'tip',
        message: 'Remember to replace placeholder content with real data before deployment'
    });

    notes.push({
        type: 'important',
        message: 'Font fix is applied via inline <style> tag. ECL reset.css does not set base font-family.'
    });

    return notes;
}
