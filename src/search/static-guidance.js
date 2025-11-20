/**
 * Static Guidance Resources
 * 
 * Provides searchable static guidance for topics not in the database
 * (typography, spacing, colors, accessibility, etc.)
 */

export const STATIC_GUIDANCE = {
    typography: {
        title: 'Typography',
        type: 'design_guideline',
        category: 'design',
        keywords: ['typography', 'font', 'text', 'paragraph', 'heading', 'arial', 'type'],
        summary: 'ECL uses a utility-first approach for typography. Apply typography utility classes directly to HTML elements.',
        key_points: [
            'ECL uses Arial as the primary font family',
            'Apply ecl-u-type-paragraph class to all <p> tags for standard body text',
            'Use ecl-u-type-paragraph-lead for introductory/lead paragraphs',
            'Apply ecl-u-type-heading-1 through ecl-u-type-heading-6 to heading elements',
            'Never use inline styles or global CSS resets - use ECL utility classes instead',
            'Unclassed paragraphs will display in browser defaults (often Times New Roman)'
        ],
        common_issues: [
            {
                problem: 'Text appears in Times New Roman or serif font',
                solution: 'Add ecl-u-type-paragraph class to your <p> tags',
                example: '<p class="ecl-u-type-paragraph">Your text</p>'
            },
            {
                problem: 'How do I change font family?',
                solution: 'ECL uses Arial by default. Apply typography utility classes to elements.',
                note: 'ECL does not provide font-family utility classes. Use the provided typography utilities.'
            }
        ],
        related_tools: [
            'ecl_get_resources with type="typography" for complete typography guide',
            'ecl_search with type="component" and query="text" for text components'
        ],
        content: `ECL Typography Guide

ECL uses a UTILITY-FIRST approach for typography. This means you apply typography classes directly to your HTML elements rather than using global CSS resets.

Primary Font: Arial, sans-serif

Essential Classes:
- ecl-u-type-paragraph: Standard body text (1rem, line-height 1.5)
- ecl-u-type-paragraph-lead: Larger intro text (1.25rem)
- ecl-u-type-heading-1 to ecl-u-type-heading-6: Heading styles
- ecl-u-type-bold: Bold text (font-weight 700)
- ecl-u-type-color-*: Text colors

Best Practices:
1. ALWAYS apply typography classes to text elements
2. Use semantic HTML with ECL classes: <h1 class="ecl-u-type-heading-1">
3. Never use inline styles on the html tag
4. Maintain proper heading hierarchy (h1 → h2 → h3)

For complete typography documentation, use: ecl_get_resources {type: "typography"}`
    },

    spacing: {
        title: 'Spacing',
        type: 'design_guideline',
        category: 'design',
        keywords: ['spacing', 'margin', 'padding', 'gap', 'layout', 'whitespace'],
        summary: 'ECL provides spacing utilities following an 8px grid system for consistent layouts.',
        key_points: [
            'ECL uses an 8px base unit for spacing',
            'Spacing utilities: ecl-u-mt-*, ecl-u-mb-*, ecl-u-ml-*, ecl-u-mr-* (margin)',
            'Padding utilities: ecl-u-pt-*, ecl-u-pb-*, ecl-u-pl-*, ecl-u-pr-*',
            'Sizes: none, xs, s, m, l, xl, 2xl, 3xl, 4xl',
            'Use consistent spacing for visual hierarchy'
        ],
        related_tools: [
            'ecl_search with type="component" to see spacing in component examples'
        ],
        content: 'ECL Spacing follows an 8px grid system. Use spacing utilities like ecl-u-mt-m (margin-top medium) for consistent layouts.'
    },

    colors: {
        title: 'Colors',
        type: 'design_guideline',
        category: 'design',
        keywords: ['color', 'colours', 'palette', 'blue', 'yellow', 'grey', 'primary', 'secondary'],
        summary: 'ECL color system includes primary blue, secondary yellow, and semantic colors for different states.',
        key_points: [
            'Primary color: EU Blue (#004494)',
            'Secondary color: EU Yellow (#FFD617)',
            'Semantic colors: success (green), error (red), warning (orange), info (blue)',
            'Grey scale: grey-5 to grey-100',
            'Use ecl-u-bg-* for backgrounds, ecl-u-type-color-* for text'
        ],
        related_tools: [
            'ecl_get_resources with type="tokens" for complete color tokens'
        ],
        content: 'ECL uses EU Blue as primary and EU Yellow as secondary. Apply colors via utility classes like ecl-u-bg-primary or ecl-u-type-color-error.'
    },

    accessibility: {
        title: 'Accessibility',
        type: 'best_practice',
        category: 'development',
        keywords: ['accessibility', 'a11y', 'wcag', 'aria', 'screen reader', 'contrast', 'keyboard'],
        summary: 'ECL components are built to meet WCAG 2.1 Level AA standards for accessibility.',
        key_points: [
            'All components meet WCAG 2.1 Level AA standards',
            'Use semantic HTML elements (h1-h6, nav, main, etc.)',
            'Maintain proper heading hierarchy',
            'Ensure color contrast ratio of at least 4.5:1 for normal text',
            'Provide alternative text for images and icons',
            'Ensure keyboard navigation works for all interactive elements',
            'Use ARIA labels when semantic HTML is insufficient'
        ],
        related_tools: [
            'ecl_validate with type="accessibility" to check your code'
        ],
        content: 'ECL components are accessible by default. Use semantic HTML, maintain heading hierarchy, and ensure sufficient color contrast.'
    },

    'utility-first': {
        title: 'Utility-First Approach',
        type: 'concept',
        category: 'development',
        keywords: ['utility', 'utility-first', 'classes', 'approach', 'methodology', 'css'],
        summary: 'ECL uses a utility-first CSS approach where you apply pre-built utility classes directly to HTML elements.',
        key_points: [
            'Apply utility classes directly to HTML elements',
            'Avoid writing custom CSS - use ECL utilities',
            'Combine multiple utility classes for complex styling',
            'Never use inline styles or global CSS resets',
            'Each element should have its own utility classes'
        ],
        content: 'ECL follows a utility-first approach. Apply classes like ecl-u-type-paragraph, ecl-u-mt-m, ecl-u-bg-primary directly to elements instead of writing custom CSS.'
    }
};

/**
 * Search static guidance resources
 */
export function searchStaticGuidance(query) {
    const queryLower = query.toLowerCase();
    const results = [];

    for (const [key, guide] of Object.entries(STATIC_GUIDANCE)) {
        // Check if query matches title, keywords, or content
        const matchesTitle = guide.title.toLowerCase().includes(queryLower);
        const matchesKeywords = guide.keywords.some(k =>
            k.includes(queryLower) || queryLower.includes(k)
        );
        const matchesContent = guide.summary.toLowerCase().includes(queryLower) ||
            guide.content.toLowerCase().includes(queryLower);

        if (matchesTitle || matchesKeywords || matchesContent) {
            results.push({
                id: `static_${key}`,
                title: guide.title,
                type: guide.type,
                category: guide.category,
                summary: guide.summary,
                key_points: guide.key_points,
                common_issues: guide.common_issues || [],
                related_tools: guide.related_tools || [],
                content: guide.content,
                source: 'static_resource'
            });
        }
    }

    return results;
}

/**
 * Generate helpful suggestions based on query and results
 */
export function generateSuggestions(query, hasResults) {
    const suggestions = [];
    const queryLower = query.toLowerCase();

    // Typography-related suggestions
    if (queryLower.includes('font') || queryLower.includes('typography') || queryLower.includes('text')) {
        if (!hasResults) {
            suggestions.push('Try: ecl_get_resources {type: "typography"} for complete typography guide');
        }
        suggestions.push('Try: ecl_search {query: "paragraph", type: "component"} for text components');
    }

    // Color-related suggestions
    if (queryLower.includes('color') || queryLower.includes('colour')) {
        suggestions.push('Try: ecl_get_resources {type: "tokens"} for color tokens');
    }

    // Spacing-related suggestions
    if (queryLower.includes('spacing') || queryLower.includes('margin') || queryLower.includes('padding')) {
        suggestions.push('Try: ecl_search {query: "spacing", type: "component"} to see spacing in examples');
    }

    // Component-related suggestions
    if (!hasResults && !queryLower.includes('how') && !queryLower.includes('what')) {
        suggestions.push('Try: ecl_search {query: "' + query + '", type: "component"} to search components');
    }

    // General fallback
    if (suggestions.length === 0 && !hasResults) {
        suggestions.push('Try: ecl_search {query: "' + query + '", type: "component"} for components');
        suggestions.push('Try: ecl_get_resources {type: "typography"} for design guidelines');
    }

    return suggestions;
}
