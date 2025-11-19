# ECL MCP Server

A Model Context Protocol (MCP) server that provides comprehensive knowledge about the **Europa Component Library (ECL)** - the design system for the European Commission and websites managed by the Commission.

## Overview

This MCP server gives you instant access to:
- 50+ ECL components with usage examples
- Complete setup and installation guides
- Design guidelines (typography, colors, spacing, iconography, images)
- Ready-to-use code snippets
- JavaScript initialization patterns
- Best practices and important notes

## Installation

```bash
npm install
```

## Usage

### Running the Server

```bash
npm start
```

For development with auto-restart:
```bash
npm run dev
```

### Adding to MCP Client Configuration

Add this server to your MCP client configuration (e.g., Claude Desktop, Cline):

```json
{
  "mcpServers": {
    "ecl": {
      "command": "node",
      "args": ["/home/simon/git/CNECT/ecl_mcp/index.js"]
    }
  }
}
```

## Available Tools

### 1. `get_component`
Get detailed information about a specific ECL component.

**Parameters:**
- `component_name` (string): Name of the component (e.g., "button", "card", "accordion")

**Example:**
```json
{
  "component_name": "button"
}
```

### 2. `search_components`
Search for components by category, name, or keyword.

**Parameters:**
- `query` (string): Search query (category, keyword, or name)

**Example:**
```json
{
  "query": "forms"
}
```

### 3. `generate_component_code`
Generate ready-to-use HTML code for a component.

**Parameters:**
- `component_name` (string): Name of the component
- `variant` (string, optional): Component variant (e.g., "primary", "secondary")

**Example:**
```json
{
  "component_name": "button",
  "variant": "primary"
}
```

### 4. `get_setup_guide`
Get complete setup guide for integrating ECL.

**Parameters:**
- `method` (string): "npm", "cdn", or "complete"

**Example:**
```json
{
  "method": "complete"
}
```

### 5. `list_components_by_category`
List all components in a specific category.

**Parameters:**
- `category` (string): One of: "forms", "navigation", "content", "media", "banners", "site-wide"

**Example:**
```json
{
  "category": "forms"
}
```

### 6. `get_guidelines`
Get ECL design guidelines.

**Parameters:**
- `guideline_type` (string): One of: "typography", "colours", "colors", "images", "iconography", "spacing", "all"

**Example:**
```json
{
  "guideline_type": "typography"
}
```

### 7. `get_javascript_init`
Get JavaScript initialization code for components.

**Parameters:**
- `component_name` (string, optional): Specific component name

**Example:**
```json
{
  "component_name": "accordion"
}
```

## Available Resources

The server provides several resources that can be accessed directly:

- `ecl://overview` - Complete overview of ECL
- `ecl://installation` - Installation and setup guide
- `ecl://components` - List of all components
- `ecl://guidelines` - Design guidelines
- `ecl://setup-template` - Ready-to-use HTML template

## ECL Components Included

### Forms
Checkbox, Datepicker, File Upload, Radio, Range, Rating Field, Search Form, Select, Text Area, Text Field

### Navigation
Breadcrumb, Inpage Navigation, Links, Mega Menu, Menu, Navigation List, Pagination, Tabs

### Content
Accordion, Blockquote, Button, Card, Category Filter, Content Item, Date Block, Expandable, Fact & Figures, File, Icon, Label, List, List with Illustration, Loading Indicator, Message, Modal, News Ticker, Notification, Popover, Separator, Social Media Follow, Social Media Share, Splash Page, Table, Tag, Timeline

### Media
Featured Item, Gallery, Media Container

### Banners
Banner, Carousel

### Site-wide
Site Header, Page Header, Site Footer

## Features

- **Comprehensive Component Database**: All 50+ ECL components with descriptions, usage guidelines, and examples
- **Code Generation**: Get ready-to-use HTML snippets for any component
- **Setup Assistance**: Complete installation and integration guides for NPM and CDN
- **Search & Discovery**: Find components by category, name, or keyword
- **JavaScript Initialization**: Auto-init patterns and manual initialization guidance
- **Design Guidelines**: Access to typography, color, spacing, and icon guidelines
- **Best Practices**: Important notes and recommendations for ECL implementation

## Example Use Cases

1. **Starting a new project**: Use `get_setup_guide` with "complete" to get the full setup
2. **Building a form**: Use `list_components_by_category` with "forms" to see all form components
3. **Implementing a component**: Use `get_component` for detailed info and `generate_component_code` for code
4. **Styling guidance**: Use `get_guidelines` to access design system guidelines
5. **JavaScript setup**: Use `get_javascript_init` for initialization patterns

## ECL Version

This server is based on **ECL v4.11.1** (EU variant)

## Resources

- Official ECL Site: https://ec.europa.eu/component-library/
- GitHub: https://github.com/ec-europa/europa-component-library
- NPM: https://www.npmjs.com/org/ecl
- Playground: https://ec.europa.eu/component-library/playground/eu/

## License

MIT

## Important Notes

- Always host SVG sprites on the same domain to avoid CORS issues
- ECL uses Pikaday for datepicker - must be loaded separately
- Include Cookie Consent Kit before going live
- Recommended to host ECL resources locally rather than using CDN
- Use `data-ecl-auto-init` attribute for automatic component initialization
- Call `ECL.autoInit()` after page load for auto-initialization

## Support

For ECL-specific questions, refer to the official documentation at https://ec.europa.eu/component-library/

For issues with this MCP server, please check the code or create an issue in your repository.
