/**
 * ECL Icon Information Tool
 * 
 * Provides comprehensive information about ECL icons including
 * IDs, CDN paths, categories, and usage examples.
 */

/**
 * ECL Icon Library
 * Based on ECL 4.11.0 icon set
 */
const ECL_ICONS = {
    // UI Icons
    ui: [
        { id: 'corner-arrow', name: 'Corner Arrow', description: 'Navigation arrow, commonly rotated for different directions' },
        { id: 'close', name: 'Close', description: 'Close button, dismiss action' },
        { id: 'more', name: 'More', description: 'More options menu' },
        { id: 'check', name: 'Check', description: 'Confirmation, success state' },
        { id: 'error', name: 'Error', description: 'Error indicator' },
        { id: 'warning', name: 'Warning', description: 'Warning indicator' },
        { id: 'info', name: 'Info', description: 'Information indicator' },
        { id: 'success', name: 'Success', description: 'Success indicator' },
        { id: 'external-link', name: 'External Link', description: 'Link opens in new window' },
        { id: 'print', name: 'Print', description: 'Print action' },
        { id: 'edit', name: 'Edit', description: 'Edit action' },
        { id: 'delete', name: 'Delete', description: 'Delete action' },
        { id: 'copy', name: 'Copy', description: 'Copy to clipboard' },
        { id: 'share', name: 'Share', description: 'Share action' },
        { id: 'fullscreen', name: 'Fullscreen', description: 'Expand to fullscreen' }
    ],

    // General Icons
    general: [
        { id: 'search', name: 'Search', description: 'Search functionality' },
        { id: 'download', name: 'Download', description: 'Download file' },
        { id: 'upload', name: 'Upload', description: 'Upload file' },
        { id: 'calendar', name: 'Calendar', description: 'Date picker, calendar events' },
        { id: 'email', name: 'Email', description: 'Email address, contact' },
        { id: 'phone', name: 'Phone', description: 'Phone number, call' },
        { id: 'location', name: 'Location', description: 'Geographic location, address' },
        { id: 'home', name: 'Home', description: 'Home page, main navigation' },
        { id: 'menu', name: 'Menu', description: 'Navigation menu' },
        { id: 'user', name: 'User', description: 'User account, profile' },
        { id: 'settings', name: 'Settings', description: 'Settings, preferences' },
        { id: 'help', name: 'Help', description: 'Help, support' },
        { id: 'star', name: 'Star', description: 'Favorite, rating' },
        { id: 'tag', name: 'Tag', description: 'Tag, label, category' },
        { id: 'filter', name: 'Filter', description: 'Filter options' },
        { id: 'sort', name: 'Sort', description: 'Sort functionality' },
        { id: 'video', name: 'Video', description: 'Video content' },
        { id: 'image', name: 'Image', description: 'Image content' },
        { id: 'document', name: 'Document', description: 'Document file' },
        { id: 'folder', name: 'Folder', description: 'Folder, directory' },
        { id: 'link', name: 'Link', description: 'Hyperlink' }
    ],

    // File Type Icons
    files: [
        { id: 'file-pdf', name: 'PDF File', description: 'PDF document' },
        { id: 'file-word', name: 'Word File', description: 'Microsoft Word document' },
        { id: 'file-excel', name: 'Excel File', description: 'Microsoft Excel spreadsheet' },
        { id: 'file-powerpoint', name: 'PowerPoint File', description: 'Microsoft PowerPoint presentation' },
        { id: 'file-zip', name: 'ZIP File', description: 'Compressed archive' },
        { id: 'file-video', name: 'Video File', description: 'Video file' },
        { id: 'file-audio', name: 'Audio File', description: 'Audio file' },
        { id: 'file-image', name: 'Image File', description: 'Image file' }
    ],

    // Social Media Icons
    social: [
        { id: 'facebook', name: 'Facebook', description: 'Facebook social media' },
        { id: 'twitter', name: 'Twitter/X', description: 'Twitter/X social media' },
        { id: 'linkedin', name: 'LinkedIn', description: 'LinkedIn social media' },
        { id: 'youtube', name: 'YouTube', description: 'YouTube video platform' },
        { id: 'instagram', name: 'Instagram', description: 'Instagram social media' },
        { id: 'rss', name: 'RSS', description: 'RSS feed' }
    ]
};

/**
 * Get all ECL icons
 */
export function getAllIcons() {
    const startTime = Date.now();

    const allIcons = [];
    for (const [category, icons] of Object.entries(ECL_ICONS)) {
        for (const icon of icons) {
            allIcons.push({
                ...icon,
                category,
                cdn_path_ec: `https://cdn.jsdelivr.net/npm/@ecl/preset-ec@4.11.0/dist/images/icons/sprites/icons.svg#${category}--${icon.id}`,
                cdn_path_eu: `https://cdn.jsdelivr.net/npm/@ecl/preset-eu@4.11.0/dist/images/icons/sprites/icons.svg#${category}--${icon.id}`,
                usage_pattern: `<svg class="ecl-icon ecl-icon--xs" focusable="false" aria-hidden="true">
  <use xlink:href="https://cdn.jsdelivr.net/npm/@ecl/preset-ec@4.11.0/dist/images/icons/sprites/icons.svg#${category}--${icon.id}"></use>
</svg>`
            });
        }
    }

    return {
        success: true,
        data: {
            icons: allIcons,
            total: allIcons.length,
            categories: Object.keys(ECL_ICONS),
            sizes: ['xs', 's', 'm', 'l', 'xl', '2xl', '3xl', '4xl'],
            rotation_classes: ['ecl-icon--rotate-90', 'ecl-icon--rotate-180', 'ecl-icon--rotate-270'],
            flip_classes: ['ecl-icon--flip-horizontal', 'ecl-icon--flip-vertical']
        },
        metadata: {
            tool: 'ecl_get_icon_library',
            execution_time_ms: Date.now() - startTime,
            source: 'ecl-static-data',
            version: '2.0',
            ecl_version: '4.11.0'
        }
    };
}

/**
 * Search icons by query
 */
export function searchIcons(query, options = {}) {
    const startTime = Date.now();
    const { category = null, limit = 20 } = options;

    const searchTerm = query.toLowerCase();
    const results = [];

    for (const [cat, icons] of Object.entries(ECL_ICONS)) {
        if (category && cat !== category) {
            continue;
        }

        for (const icon of icons) {
            const matches =
                icon.id.toLowerCase().includes(searchTerm) ||
                icon.name.toLowerCase().includes(searchTerm) ||
                icon.description.toLowerCase().includes(searchTerm);

            if (matches) {
                results.push({
                    ...icon,
                    category: cat,
                    cdn_path_ec: `https://cdn.jsdelivr.net/npm/@ecl/preset-ec@4.11.0/dist/images/icons/sprites/icons.svg#${cat}--${icon.id}`,
                    cdn_path_eu: `https://cdn.jsdelivr.net/npm/@ecl/preset-eu@4.11.0/dist/images/icons/sprites/icons.svg#${cat}--${icon.id}`,
                    usage_example: generateIconUsageExample(cat, icon.id)
                });
            }

            if (results.length >= limit) {
                break;
            }
        }

        if (results.length >= limit) {
            break;
        }
    }

    return {
        success: true,
        data: {
            results,
            count: results.length,
            query: searchTerm,
            category_filter: category
        },
        metadata: {
            tool: 'ecl_search_icons',
            execution_time_ms: Date.now() - startTime,
            source: 'ecl-static-data',
            version: '2.0'
        }
    };
}

/**
 * Get icon by ID
 */
export function getIconById(iconId, options = {}) {
    const startTime = Date.now();
    const { preset = 'ec', size = 'xs' } = options;

    // Search for icon in all categories
    for (const [category, icons] of Object.entries(ECL_ICONS)) {
        const icon = icons.find(i => i.id === iconId);

        if (icon) {
            const presetName = preset === 'eu' ? 'preset-eu' : 'preset-ec';
            const cdnPath = `https://cdn.jsdelivr.net/npm/@ecl/${presetName}@4.11.0/dist/images/icons/sprites/icons.svg#${category}--${iconId}`;

            return {
                success: true,
                data: {
                    ...icon,
                    category,
                    cdn_path: cdnPath,
                    usage_examples: {
                        standalone: generateStandaloneIconExample(category, iconId, size),
                        button_before: generateButtonIconExample(category, iconId, 'before'),
                        button_after: generateButtonIconExample(category, iconId, 'after'),
                        button_only: generateIconOnlyButtonExample(category, iconId)
                    },
                    accessibility_notes: [
                        'Always include focusable="false" on SVG elements',
                        'Use aria-hidden="true" for decorative icons',
                        'For icon-only buttons, add aria-label to the button element',
                        'Include visually-hidden text for screen readers when needed'
                    ],
                    size_classes: ['ecl-icon--xs', 'ecl-icon--s', 'ecl-icon--m', 'ecl-icon--l'],
                    rotation_options: generateRotationExamples(category, iconId),
                    cors_warning: 'Icon sprites must be hosted on the same domain or use CORS-enabled CDN'
                },
                metadata: {
                    tool: 'ecl_get_icon_by_id',
                    execution_time_ms: Date.now() - startTime,
                    source: 'ecl-static-data',
                    version: '2.0'
                }
            };
        }
    }

    return {
        success: false,
        data: { icon: null },
        errors: [{
            code: 'ICON_NOT_FOUND',
            message: `Icon "${iconId}" not found in ECL icon library`
        }],
        metadata: {
            tool: 'ecl_get_icon_by_id',
            execution_time_ms: Date.now() - startTime
        }
    };
}

/**
 * Generate usage examples
 */
function generateIconUsageExample(category, iconId) {
    return `<!-- Standalone icon -->
<svg class="ecl-icon ecl-icon--xs" focusable="false" aria-hidden="true">
  <use xlink:href="https://cdn.jsdelivr.net/npm/@ecl/preset-ec@4.11.0/dist/images/icons/sprites/icons.svg#${category}--${iconId}"></use>
</svg>`;
}

function generateStandaloneIconExample(category, iconId, size) {
    return `<svg class="ecl-icon ecl-icon--${size}" focusable="false" aria-hidden="true">
  <use xlink:href="https://cdn.jsdelivr.net/npm/@ecl/preset-ec@4.11.0/dist/images/icons/sprites/icons.svg#${category}--${iconId}"></use>
</svg>`;
}

function generateButtonIconExample(category, iconId, position) {
    const iconClass = position === 'before' ? 'ecl-button__icon--before' : 'ecl-button__icon--after';

    return position === 'before'
        ? `<button class="ecl-button ecl-button--primary" type="button">
  <span class="ecl-button__container">
    <svg class="ecl-icon ecl-icon--xs ecl-button__icon ${iconClass}" focusable="false" aria-hidden="true">
      <use xlink:href="https://cdn.jsdelivr.net/npm/@ecl/preset-ec@4.11.0/dist/images/icons/sprites/icons.svg#${category}--${iconId}"></use>
    </svg>
    <span class="ecl-button__label" data-ecl-label>Button text</span>
  </span>
</button>`
        : `<button class="ecl-button ecl-button--primary" type="button">
  <span class="ecl-button__container">
    <span class="ecl-button__label" data-ecl-label>Button text</span>
    <svg class="ecl-icon ecl-icon--xs ecl-button__icon ${iconClass}" focusable="false" aria-hidden="true">
      <use xlink:href="https://cdn.jsdelivr.net/npm/@ecl/preset-ec@4.11.0/dist/images/icons/sprites/icons.svg#${category}--${iconId}"></use>
    </svg>
  </span>
</button>`;
}

function generateIconOnlyButtonExample(category, iconId) {
    return `<button class="ecl-button ecl-button--primary ecl-button--icon-only" type="button" aria-label="Descriptive label">
  <span class="ecl-button__container">
    <span class="ecl-button__label" data-ecl-label="true">Label</span>
    <svg class="ecl-icon ecl-icon--xs ecl-button__icon" focusable="false" aria-hidden="true">
      <use xlink:href="https://cdn.jsdelivr.net/npm/@ecl/preset-ec@4.11.0/dist/images/icons/sprites/icons.svg#${category}--${iconId}"></use>
    </svg>
  </span>
</button>`;
}

function generateRotationExamples(category, iconId) {
    return {
        rotate_90: `<svg class="ecl-icon ecl-icon--xs ecl-icon--rotate-90" focusable="false" aria-hidden="true">
  <use xlink:href="https://cdn.jsdelivr.net/npm/@ecl/preset-ec@4.11.0/dist/images/icons/sprites/icons.svg#${category}--${iconId}"></use>
</svg>`,
        rotate_180: `<svg class="ecl-icon ecl-icon--xs ecl-icon--rotate-180" focusable="false" aria-hidden="true">
  <use xlink:href="https://cdn.jsdelivr.net/npm/@ecl/preset-ec@4.11.0/dist/images/icons/sprites/icons.svg#${category}--${iconId}"></use>
</svg>`,
        rotate_270: `<svg class="ecl-icon ecl-icon--xs ecl-icon--rotate-270" focusable="false" aria-hidden="true">
  <use xlink:href="https://cdn.jsdelivr.net/npm/@ecl/preset-ec@4.11.0/dist/images/icons/sprites/icons.svg#${category}--${iconId}"></use>
</svg>`
    };
}
