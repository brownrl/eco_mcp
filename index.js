#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListResourcesRequestSchema,
  ListToolsRequestSchema,
  ReadResourceRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load ECL data
const eclDataPath = path.join(__dirname, 'ecl-data.json');
let eclData;

try {
  const data = await fs.readFile(eclDataPath, 'utf-8');
  eclData = JSON.parse(data);
} catch (error) {
  console.error('Error loading ECL data:', error);
  process.exit(1);
}

// Create server instance
const server = new Server(
  {
    name: 'ecl-mcp-server',
    version: '1.0.0',
  },
  {
    capabilities: {
      resources: {},
      tools: {},
    },
  }
);

// List available resources
server.setRequestHandler(ListResourcesRequestSchema, async () => {
  return {
    resources: [
      {
        uri: 'ecl://overview',
        mimeType: 'application/json',
        name: 'ECL Overview',
        description: 'Complete overview of Europa Component Library',
      },
      {
        uri: 'ecl://installation',
        mimeType: 'application/json',
        name: 'ECL Installation Guide',
        description: 'How to install and set up ECL in your project',
      },
      {
        uri: 'ecl://components',
        mimeType: 'application/json',
        name: 'ECL Components List',
        description: 'List of all available ECL components',
      },
      {
        uri: 'ecl://guidelines',
        mimeType: 'application/json',
        name: 'ECL Guidelines',
        description: 'Design guidelines for typography, colors, spacing, etc.',
      },
      {
        uri: 'ecl://setup-template',
        mimeType: 'text/html',
        name: 'ECL HTML Setup Template',
        description: 'Ready-to-use HTML template with ECL integration',
      },
    ],
  };
});

// Read resource content
server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const uri = request.params.uri;

  if (uri === 'ecl://overview') {
    return {
      contents: [
        {
          uri,
          mimeType: 'application/json',
          text: JSON.stringify(
            {
              name: eclData.name,
              description: eclData.description,
              version: eclData.version,
              resources: eclData.resources,
              important_notes: eclData.important_notes,
            },
            null,
            2
          ),
        },
      ],
    };
  }

  if (uri === 'ecl://installation') {
    return {
      contents: [
        {
          uri,
          mimeType: 'application/json',
          text: JSON.stringify(
            {
              installation: eclData.installation,
              setup: eclData.setup,
            },
            null,
            2
          ),
        },
      ],
    };
  }

  if (uri === 'ecl://components') {
    return {
      contents: [
        {
          uri,
          mimeType: 'application/json',
          text: JSON.stringify(
            {
              components: eclData.components,
              total_count: Object.keys(eclData.components).length,
            },
            null,
            2
          ),
        },
      ],
    };
  }

  if (uri === 'ecl://guidelines') {
    return {
      contents: [
        {
          uri,
          mimeType: 'application/json',
          text: JSON.stringify(
            {
              guidelines: eclData.guidelines,
              utilities: eclData.utilities,
            },
            null,
            2
          ),
        },
      ],
    };
  }

  if (uri === 'ecl://setup-template') {
    return {
      contents: [
        {
          uri,
          mimeType: 'text/html',
          text: eclData.setup.html_template,
        },
      ],
    };
  }

  throw new Error(`Unknown resource: ${uri}`);
});

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'get_component',
        description: 'Get detailed information about a specific ECL component including usage, examples, and documentation',
        inputSchema: {
          type: 'object',
          properties: {
            component_name: {
              type: 'string',
              description: 'Name of the ECL component (e.g., "button", "card", "accordion")',
            },
          },
          required: ['component_name'],
        },
      },
      {
        name: 'search_components',
        description: 'Search for ECL components by category, name, or keyword',
        inputSchema: {
          type: 'object',
          properties: {
            query: {
              type: 'string',
              description: 'Search query (can be category like "forms", "navigation" or keyword like "input", "menu")',
            },
          },
          required: ['query'],
        },
      },
      {
        name: 'generate_component_code',
        description: 'Generate ready-to-use HTML code for an ECL component with optional customization',
        inputSchema: {
          type: 'object',
          properties: {
            component_name: {
              type: 'string',
              description: 'Name of the ECL component',
            },
            variant: {
              type: 'string',
              description: 'Optional variant (e.g., "primary", "secondary" for buttons)',
            },
          },
          required: ['component_name'],
        },
      },
      {
        name: 'get_setup_guide',
        description: 'Get complete setup guide for integrating ECL into a project',
        inputSchema: {
          type: 'object',
          properties: {
            method: {
              type: 'string',
              enum: ['npm', 'cdn', 'complete'],
              description: 'Installation method: npm, cdn, or complete guide',
            },
          },
          required: ['method'],
        },
      },
      {
        name: 'list_components_by_category',
        description: 'List all components in a specific category',
        inputSchema: {
          type: 'object',
          properties: {
            category: {
              type: 'string',
              enum: ['forms', 'navigation', 'content', 'media', 'banners', 'site-wide'],
              description: 'Component category',
            },
          },
          required: ['category'],
        },
      },
      {
        name: 'get_guidelines',
        description: 'Get ECL design guidelines for typography, colors, spacing, etc.',
        inputSchema: {
          type: 'object',
          properties: {
            guideline_type: {
              type: 'string',
              enum: ['typography', 'colours', 'colors', 'images', 'iconography', 'spacing', 'all'],
              description: 'Type of guideline to retrieve',
            },
          },
          required: ['guideline_type'],
        },
      },
      {
        name: 'get_javascript_init',
        description: 'Get JavaScript initialization code for ECL components',
        inputSchema: {
          type: 'object',
          properties: {
            component_name: {
              type: 'string',
              description: 'Component name to get initialization code for (optional - returns general info if not provided)',
            },
          },
        },
      },
    ],
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    if (name === 'get_component') {
      const componentName = args.component_name.toLowerCase().replace(/\s+/g, '-');
      const component = eclData.components[componentName];

      if (!component) {
        return {
          content: [
            {
              type: 'text',
              text: `Component "${args.component_name}" not found. Use search_components to find available components.`,
            },
          ],
        };
      }

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(
              {
                name: component.name,
                category: component.category,
                description: component.description,
                usage: component.usage,
                url: component.url,
                variants: component.variants,
                dependencies: component.dependencies,
                auto_init: component.auto_init,
                example: component.example,
              },
              null,
              2
            ),
          },
        ],
      };
    }

    if (name === 'search_components') {
      const query = args.query.toLowerCase();
      const results = [];

      for (const [key, component] of Object.entries(eclData.components)) {
        if (
          key.includes(query) ||
          component.name.toLowerCase().includes(query) ||
          component.category.includes(query) ||
          component.description.toLowerCase().includes(query)
        ) {
          results.push({
            id: key,
            name: component.name,
            category: component.category,
            description: component.description,
            url: component.url,
          });
        }
      }

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(
              {
                query: args.query,
                count: results.length,
                results: results,
              },
              null,
              2
            ),
          },
        ],
      };
    }

    if (name === 'generate_component_code') {
      const componentName = args.component_name.toLowerCase().replace(/\s+/g, '-');
      const component = eclData.components[componentName];

      if (!component) {
        return {
          content: [
            {
              type: 'text',
              text: `Component "${args.component_name}" not found.`,
            },
          ],
        };
      }

      let code = component.example || `<!-- ${component.name} component -->\n<!-- See documentation: ${component.url} -->`;

      if (args.variant && component.variants) {
        code += `\n\n<!-- Available variants: ${component.variants.join(', ')} -->`;
      }

      if (component.auto_init) {
        code += `\n\n<!-- Auto-initialization: Add data-ecl-auto-init="${component.auto_init}" to the root element -->`;
      }

      return {
        content: [
          {
            type: 'text',
            text: code,
          },
        ],
      };
    }

    if (name === 'get_setup_guide') {
      const method = args.method;

      if (method === 'npm') {
        return {
          content: [
            {
              type: 'text',
              text: `# ECL Setup with NPM

## Installation
\`\`\`bash
${eclData.installation.npm}
# or
${eclData.installation.yarn}
\`\`\`

## Setup
1. Install the package in your project
2. Import or copy the CSS and JS files to your public directory
3. Reference them in your HTML:

\`\`\`html
<link rel="stylesheet" href="/styles/ecl-eu.css" media="screen" />
<script src="/scripts/ecl-eu.js"></script>
<script>
  ECL.autoInit();
</script>
\`\`\`

## Optional Dependencies
${eclData.setup.dependencies.pikaday}: ${eclData.setup.dependencies.moment}
`,
            },
          ],
        };
      }

      if (method === 'cdn') {
        return {
          content: [
            {
              type: 'text',
              text: `# ECL Setup with CDN

## CDN Pattern
${eclData.installation.cdn_pattern}

## Example
${eclData.installation.cdn_example}

## Important Notes
${eclData.important_notes.filter((note) => note.includes('CDN') || note.includes('SVG')).join('\n')}

## Setup
\`\`\`html
<link rel="stylesheet" href="https://cdn1.fpfis.tech.ec.europa.eu/ecl/v${eclData.version}/eu/styles/ecl-eu.css" media="screen" />
<script src="https://cdn1.fpfis.tech.ec.europa.eu/ecl/v${eclData.version}/eu/scripts/ecl-eu.js"></script>
<script>
  ECL.autoInit();
</script>
\`\`\`
`,
            },
          ],
        };
      }

      // complete
      return {
        content: [
          {
            type: 'text',
            text: `# Complete ECL Setup Guide

## Installation Options

### NPM (Recommended)
\`\`\`bash
${eclData.installation.npm}
\`\`\`

### CDN
${eclData.installation.cdn_pattern}

## Complete HTML Template
\`\`\`html
${eclData.setup.html_template}
\`\`\`

## Optional Styles
${eclData.setup.optional_styles.map((s) => `- **${s.name}**: ${s.description}`).join('\n')}

## JavaScript Initialization
- **Auto-init**: ${eclData.setup.javascript.auto_init}
- **Data attribute**: ${eclData.setup.javascript.data_attribute}

## Important Notes
${eclData.important_notes.map((note) => `- ${note}`).join('\n')}

## Resources
- Playground: ${eclData.resources.playground}
- GitHub: ${eclData.resources.github}
- NPM: ${eclData.resources.npm_org}
`,
          },
        ],
      };
    }

    if (name === 'list_components_by_category') {
      const category = args.category;
      const components = Object.entries(eclData.components)
        .filter(([_, comp]) => comp.category === category)
        .map(([key, comp]) => ({
          id: key,
          name: comp.name,
          description: comp.description,
          url: comp.url,
        }));

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(
              {
                category: category,
                count: components.length,
                components: components,
              },
              null,
              2
            ),
          },
        ],
      };
    }

    if (name === 'get_guidelines') {
      const type = args.guideline_type.toLowerCase();

      if (type === 'all') {
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(
                {
                  guidelines: eclData.guidelines,
                  utilities: eclData.utilities,
                },
                null,
                2
              ),
            },
          ],
        };
      }

      // Handle both 'colours' and 'colors'
      const guidelineKey = type === 'colors' ? 'colours' : type;
      const guideline = eclData.guidelines[guidelineKey];

      if (!guideline) {
        return {
          content: [
            {
              type: 'text',
              text: `Guideline type "${args.guideline_type}" not found. Available: typography, colours, images, iconography, spacing`,
            },
          ],
        };
      }

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(guideline, null, 2),
          },
        ],
      };
    }

    if (name === 'get_javascript_init') {
      const componentName = args.component_name
        ? args.component_name.toLowerCase().replace(/\s+/g, '-')
        : null;

      if (componentName) {
        const component = eclData.components[componentName];

        if (!component) {
          return {
            content: [
              {
                type: 'text',
                text: `Component "${args.component_name}" not found.`,
              },
            ],
          };
        }

        if (!component.auto_init) {
          return {
            content: [
              {
                type: 'text',
                text: `Component "${component.name}" does not require JavaScript initialization.`,
              },
            ],
          };
        }

        return {
          content: [
            {
              type: 'text',
              text: `# JavaScript Initialization for ${component.name}

## Auto-initialization
Add the data attribute to the root element:
\`\`\`html
data-ecl-auto-init="${component.auto_init}"
\`\`\`

## Complete Example
\`\`\`html
${component.example || `<!-- Add data-ecl-auto-init="${component.auto_init}" to the component root -->`}
\`\`\`

## Global Initialization
Add to the end of your page:
\`\`\`html
<script src="/scripts/ecl-eu.js"></script>
<script>
  ECL.autoInit();
</script>
\`\`\`

For manual initialization, see: ${component.url}
`,
            },
          ],
        };
      }

      // General JavaScript info
      return {
        content: [
          {
            type: 'text',
            text: `# ECL JavaScript Initialization

## Auto-initialization (Recommended)
1. Add data attribute to component root element:
   \`\`\`html
   data-ecl-auto-init="[ComponentName]"
   \`\`\`

2. Call ECL.autoInit() after page load:
   \`\`\`html
   <script src="/scripts/ecl-eu.js"></script>
   <script>
     ECL.autoInit();
   </script>
   \`\`\`

## Components requiring JavaScript
${Object.entries(eclData.components)
  .filter(([_, comp]) => comp.auto_init)
  .map(([_, comp]) => `- **${comp.name}**: data-ecl-auto-init="${comp.auto_init}"`)
  .join('\n')}

## Dependencies
${Object.entries(eclData.setup.dependencies)
  .map(([key, value]) => `- **${key}**: ${value}`)
  .join('\n')}

For manual initialization details, check individual component documentation.
`,
          },
        ],
      };
    }

    return {
      content: [
        {
          type: 'text',
          text: `Unknown tool: ${name}`,
        },
      ],
    };
  } catch (error) {
    return {
      content: [
        {
          type: 'text',
          text: `Error: ${error.message}`,
        },
      ],
      isError: true,
    };
  }
});

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('ECL MCP Server running on stdio');
}

main().catch((error) => {
  console.error('Server error:', error);
  process.exit(1);
});
