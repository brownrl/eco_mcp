/**
 * ECL Component Structure Validator
 * 
 * Enhanced validation for complex component hierarchies,
 * wrapper requirements, and parent-child relationships.
 */

/**
 * Wrapper hierarchy rules for complex components
 */
const WRAPPER_HIERARCHIES = {
    'site-header': {
        required: [
            { selector: '.ecl-site-header', level: 0, name: 'Site Header Root' },
            { selector: '.ecl-site-header__header', level: 1, name: 'Header Container', parent: '.ecl-site-header' },
            { selector: '.ecl-site-header__container', level: 2, name: 'Inner Container', parent: '.ecl-site-header__header' }
        ],
        optional: [
            { selector: '.ecl-site-header__banner', level: 1, name: 'Banner', parent: '.ecl-site-header' },
            { selector: '.ecl-site-header__background', level: 0, name: 'Background', parent: '.ecl-site-header' }
        ]
    },
    'site-footer': {
        required: [
            { selector: '.ecl-footer', level: 0, name: 'Footer Root' },
            { selector: '.ecl-footer__container', level: 1, name: 'Footer Container', parent: '.ecl-footer' }
        ],
        optional: [
            { selector: '.ecl-footer__section', level: 2, name: 'Footer Section', parent: '.ecl-footer__container' }
        ]
    },
    'page-header': {
        required: [
            { selector: '.ecl-page-header', level: 0, name: 'Page Header Root' },
            { selector: '.ecl-container', level: 1, name: 'Container', parent: '.ecl-page-header' },
            { selector: '.ecl-page-header__body', level: 2, name: 'Body', parent: '.ecl-container' }
        ]
    },
    'card': {
        required: [
            { selector: '.ecl-card', level: 0, name: 'Card Root' },
            { selector: '.ecl-card__body', level: 1, name: 'Card Body', parent: '.ecl-card' }
        ],
        optional: [
            { selector: '.ecl-card__header', level: 1, name: 'Card Header', parent: '.ecl-card' },
            { selector: '.ecl-card__footer', level: 1, name: 'Card Footer', parent: '.ecl-card' },
            { selector: '.ecl-card__image', level: 1, name: 'Card Image', parent: '.ecl-card' }
        ]
    },
    'accordion': {
        required: [
            { selector: '.ecl-accordion', level: 0, name: 'Accordion Root' },
            { selector: '.ecl-accordion__item', level: 1, name: 'Accordion Item', parent: '.ecl-accordion' },
            { selector: '.ecl-accordion__header', level: 2, name: 'Item Header', parent: '.ecl-accordion__item' },
            { selector: '.ecl-accordion__toggle', level: 3, name: 'Toggle Button', parent: '.ecl-accordion__header' },
            { selector: '.ecl-accordion__content', level: 2, name: 'Item Content', parent: '.ecl-accordion__item' }
        ]
    },
    'modal': {
        required: [
            { selector: '.ecl-modal', level: 0, name: 'Modal Root' },
            { selector: '.ecl-modal__container', level: 1, name: 'Modal Container', parent: '.ecl-modal' },
            { selector: '.ecl-modal__content', level: 2, name: 'Modal Content', parent: '.ecl-modal__container' },
            { selector: '.ecl-modal__header', level: 3, name: 'Modal Header', parent: '.ecl-modal__content' },
            { selector: '.ecl-modal__body', level: 3, name: 'Modal Body', parent: '.ecl-modal__content' }
        ]
    }
};

/**
 * Required data attributes for components
 */
const REQUIRED_DATA_ATTRIBUTES = {
    'site-header': [
        { selector: '.ecl-site-header', attribute: 'data-ecl-auto-init', value: 'SiteHeader' }
    ],
    'accordion': [
        { selector: '.ecl-accordion', attribute: 'data-ecl-auto-init', value: 'Accordion' },
        { selector: '.ecl-accordion__toggle', attribute: 'aria-controls', required: true },
        { selector: '.ecl-accordion__toggle', attribute: 'aria-expanded', value: ['true', 'false'] },
        { selector: '.ecl-accordion__content', attribute: 'id', required: true }
    ],
    'modal': [
        { selector: '.ecl-modal', attribute: 'data-ecl-auto-init', value: 'Modal' },
        { selector: '.ecl-modal', attribute: 'role', value: 'dialog' },
        { selector: '.ecl-modal', attribute: 'aria-labelledby', required: true },
        { selector: '.ecl-modal__close', attribute: 'data-ecl-modal-close', value: 'true' }
    ],
    'tabs': [
        { selector: '.ecl-tabs', attribute: 'data-ecl-auto-init', value: 'Tabs' },
        { selector: '[role="tab"]', attribute: 'aria-selected', value: ['true', 'false'] },
        { selector: '[role="tab"]', attribute: 'aria-controls', required: true },
        { selector: '[role="tabpanel"]', attribute: 'id', required: true }
    ],
    'button': [
        { selector: '.ecl-button--icon-only', attribute: 'aria-label', required: true }
    ]
};

/**
 * Parent-child relationship rules
 */
const PARENT_CHILD_RULES = {
    '.ecl-accordion__toggle': {
        parent: '.ecl-accordion__header',
        error: 'Accordion toggle must be direct child of ecl-accordion__header'
    },
    '.ecl-card__body': {
        parent: '.ecl-card',
        error: 'Card body must be direct child of ecl-card'
    },
    '.ecl-button__icon': {
        parent: '.ecl-button__container',
        error: 'Button icon must be inside ecl-button__container span'
    },
    '.ecl-button__label': {
        parent: '.ecl-button__container',
        error: 'Button label must be inside ecl-button__container span'
    }
};

/**
 * Validate component structure hierarchy
 */
export function validateStructureHierarchy($, componentName, errors, warnings) {
    const normalizedName = componentName.toLowerCase().replace(/\s+/g, '-');
    const hierarchy = WRAPPER_HIERARCHIES[normalizedName];

    if (!hierarchy) {
        return; // No specific hierarchy rules for this component
    }

    // Check required elements
    for (const rule of hierarchy.required) {
        const elements = $(rule.selector);

        if (elements.length === 0) {
            errors.push({
                severity: 'error',
                message: `Missing required element: ${rule.name} (${rule.selector})`,
                suggestion: `Add the required ${rule.selector} element to the component structure`,
                category: 'structure'
            });
            continue;
        }

        // Validate parent relationship if specified
        if (rule.parent) {
            elements.each((i, el) => {
                const $el = $(el);
                const hasCorrectParent = $el.parent().is(rule.parent) || $el.closest(rule.parent).length > 0;

                if (!hasCorrectParent) {
                    errors.push({
                        severity: 'error',
                        message: `${rule.name} (${rule.selector}) must be inside ${rule.parent}`,
                        suggestion: `Ensure ${rule.selector} is properly nested within ${rule.parent}`,
                        category: 'structure'
                    });
                }
            });
        }
    }

    // Check optional elements (warnings only)
    for (const rule of hierarchy.optional || []) {
        const elements = $(rule.selector);

        if (elements.length > 0 && rule.parent) {
            elements.each((i, el) => {
                const $el = $(el);
                const hasCorrectParent = $el.parent().is(rule.parent) || $el.closest(rule.parent).length > 0;

                if (!hasCorrectParent) {
                    warnings.push({
                        severity: 'warning',
                        message: `${rule.name} (${rule.selector}) should be inside ${rule.parent}`,
                        suggestion: `For best practices, nest ${rule.selector} within ${rule.parent}`,
                        category: 'structure'
                    });
                }
            });
        }
    }
}

/**
 * Validate required data attributes
 */
export function validateDataAttributes($, componentName, errors, warnings) {
    const normalizedName = componentName.toLowerCase().replace(/\s+/g, '-');
    const rules = REQUIRED_DATA_ATTRIBUTES[normalizedName];

    if (!rules) {
        return; // No specific attribute rules for this component
    }

    for (const rule of rules) {
        const elements = $(rule.selector);

        if (elements.length === 0) {
            continue; // Element doesn't exist, structure validation will catch this
        }

        elements.each((i, el) => {
            const $el = $(el);
            const attrValue = $el.attr(rule.attribute);

            if (rule.required && !attrValue) {
                errors.push({
                    severity: 'error',
                    message: `Missing required attribute: ${rule.attribute} on ${rule.selector}`,
                    suggestion: `Add ${rule.attribute} attribute to ${rule.selector}`,
                    category: 'attributes'
                });
            } else if (rule.value && attrValue) {
                const expectedValues = Array.isArray(rule.value) ? rule.value : [rule.value];
                if (!expectedValues.includes(attrValue)) {
                    warnings.push({
                        severity: 'warning',
                        message: `Unexpected value "${attrValue}" for ${rule.attribute} on ${rule.selector}`,
                        suggestion: `Expected one of: ${expectedValues.join(', ')}`,
                        category: 'attributes'
                    });
                }
            }
        });
    }
}

/**
 * Validate parent-child relationships
 */
export function validateParentChildRelationships($, errors) {
    for (const [childSelector, rule] of Object.entries(PARENT_CHILD_RULES)) {
        const children = $(childSelector);

        children.each((i, el) => {
            const $el = $(el);
            const parent = $el.parent();

            if (!parent.is(rule.parent)) {
                errors.push({
                    severity: 'error',
                    message: rule.error,
                    suggestion: `Ensure ${childSelector} is a direct child of ${rule.parent}`,
                    category: 'structure'
                });
            }
        });
    }
}

/**
 * Validate nesting depth
 */
export function validateNestingDepth($, componentName, warnings) {
    const normalizedName = componentName.toLowerCase().replace(/\s+/g, '-');
    const hierarchy = WRAPPER_HIERARCHIES[normalizedName];

    if (!hierarchy) {
        return;
    }

    // Check if nesting exceeds recommended levels
    for (const rule of hierarchy.required) {
        const elements = $(rule.selector);

        elements.each((i, el) => {
            const depth = $(el).parents().length;

            if (depth > 10) {
                warnings.push({
                    severity: 'warning',
                    message: `Deep nesting detected in ${rule.selector} (${depth} levels)`,
                    suggestion: 'Consider simplifying the DOM structure for better performance',
                    category: 'performance'
                });
            }
        });
    }
}

/**
 * Main structure validation function
 */
export function validateEnhancedStructure($, componentName, errors, warnings) {
    validateStructureHierarchy($, componentName, errors, warnings);
    validateDataAttributes($, componentName, errors, warnings);
    validateParentChildRelationships($, errors);
    validateNestingDepth($, componentName, warnings);
}
