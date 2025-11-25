# EC Europa Component Library MCP Server

A Model Context Protocol (MCP) server that provides AI agents with access to the European Commission's Component Library documentation.

## Features

- **Full-text search** across 159 documentation pages
- **Structured data** with categories and hierarchical paths
- **Code examples extraction** - 270 clean HTML examples from 85 pages
- **Complete coverage** of EC components, forms, media, navigation, utilities, and layouts

## Installation

Install from GitHub:

```bash
npm install github:brownrl/eco_mcp
```

Or install the published package:

```bash
npm install eco_mcp
```

## Configuration

### Charm Crush

Create a `.crush.json` file in your project root:

```json
{
  "$schema": "https://charm.land/crush.json",
  "mcp": {
    "ecl": {
      "command": "npx",
      "type": "stdio",
      "args": [
        "ecl-mcp"
      ]
    }
  }
}
```

### VSCode with MCP Extension

Create a `.vscode/mcp.json` file in your project root:

```json
{
  "servers": {
    "ecl": {
      "type": "stdio",
      "command": "npx",
      "args": [
        "ecl-mcp"
      ]
    }
  }
}
```

### Claude Desktop

Add to your Claude Desktop configuration:

```json
{
  "mcpServers": {
    "ecl": {
      "command": "npx",
      "args": [
        "ecl-mcp"
      ]
    }
  }
}
```

## Available Tools

### Core Tools

#### `about`
Get comprehensive information about the ECL MCP server, component catalog, and AI agent workflow guide.

**Parameters:** None

**Returns:**
- Overview of 159 documentation pages
- Complete component catalog (70+ UI, 24 form, 21 navigation components)
- Quick start workflow for AI agents
- Common search queries and usage patterns

---

### Documentation Search Tools

#### `search`
Search across all 159 ECL documentation pages using full-text search.

**Parameters:**
- `query` (string, required): Search query to find relevant documentation pages
- `limit` (number, optional): Maximum results to return (default: 10)

**Returns:**
- Page title, URL, category
- Hierarchical path (e.g., components > button > code)
- Content snippet with highlighted search terms
- Ranked by relevance

**Examples:**
```javascript
search(query: "button primary")
search(query: "form validation", limit: 5)
search(query: "site header")
```

#### `index`
Get the complete list of all 159 pages in the ECL documentation database.

**Parameters:** None

**Returns:**
- JSON array of all pages with URLs, titles, categories, and hierarchy paths
- Sorted by category and hierarchy

**Use for:** Browsing full catalog, building navigation, seeing everything at once

---

### Code Examples Tools

#### `search_examples`
Search across all 270+ code examples using natural language queries. **Best for finding specific HTML patterns quickly.**

**Parameters:**
- `query` (string, required): Search query for code examples (e.g., "button primary", "checkbox required")
- `limit` (number, optional): Maximum results (default: 10)

**Returns:**
- Matching code snippets with full HTML
- Source page title, URL, and category
- Example labels
- Highlighted match snippets

**Examples:**
```javascript
search_examples(query: "primary button")
search_examples(query: "form validation")
search_examples(query: "sortable table")
```

#### `get_examples`
Retrieve all code examples from a specific documentation page. **Faster than `get_page` for code.**

**Parameters:**
- `url` (string, required): Full URL of the page (from search results)

**Returns:**
- All code examples from the page
- Example labels and positions
- Clean, copy-paste ready HTML

**Example:**
```javascript
get_examples(url: "https://ec.europa.eu/component-library/ec/components/button/code/")
```

#### `get_example`
Get a single specific code example by URL and label or index.

**Parameters:**
- `url` (string, required): Page URL (from search results)
- `label` (string, optional): Example label to match (case-insensitive, partial matching)
- `index` (number, optional): Example index (0-based)

**Note:** Must provide either `label` or `index`

**Returns:**
- Single targeted code example
- Page context and example metadata

**Examples:**
```javascript
get_example(url: "...", label: "Primary button")
get_example(url: "...", index: 0)
```

---

### Recipe Tools (Pre-built Patterns)

#### `recipe_search`
Search curated recipes for common implementation patterns. **Best for complete workflows and end-to-end guides.**

**Parameters:**
- `query` (string, required): Search query (e.g., "complete webpage", "form", "dashboard")
- `limit` (number, optional): Maximum results (default: 5)

**Returns:**
- Recipe ID, title, description
- Difficulty level
- Components used
- Match snippets

**Examples:**
```javascript
recipe_search(query: "complete webpage")
recipe_search(query: "form layout")
recipe_search(query: "dashboard")
```

#### `recipe_get`
Retrieve the complete recipe with full step-by-step instructions.

**Parameters:**
- `id` (number, required): Recipe ID from `recipe_search` results

**Returns:**
- Full markdown content with detailed instructions
- Code examples and best practices
- Common pitfalls and solutions
- Production deployment checklists

**Example:**
```javascript
recipe_get(id: 1)
```

---

### Utility Tools

#### `get_starter_template`
Generate a complete HTML boilerplate with proper ECL CDN setup. **Start here for new projects.**

**Parameters:**
- `title` (string, optional): Page title (default: "ECL Page")

**Returns:**
- Complete HTML template with:
  - Official EC CDN links (v4.11.1)
  - Required CSS (reset, main, utilities, print)
  - ECL JavaScript with auto-initialization
  - Proper meta tags and structure

**Example:**
```javascript
get_starter_template(title: "My ECL Application")
```

#### `get_page`
Get the complete HTML documentation page content. **Use `get_examples` for code instead - it's faster.**

**Parameters:**
- `url` (string, required): Full URL of the page
- `content` (boolean, optional): If true (default), returns cleaned content; if false, returns raw HTML

**Returns:**
- Page title, URL, category
- Complete page content (verbose)

**Example:**
```javascript
get_page(url: "https://ec.europa.eu/component-library/ec/components/button/usage/")
get_page(url: "...", content: false)  // Get raw HTML
```

## Recommended Workflows

### For New Projects
1. `get_starter_template(title: "My Page")` - Get HTML boilerplate
2. `search_examples(query: "site header")` - Find header code
3. `get_example(url: "...", index: 0)` - Get specific example
4. Insert code and repeat for other components

### For Finding Specific Components
1. `search(query: "button primary")` - Find relevant pages
2. `get_examples(url: "...")` - Get all button examples
3. Copy desired HTML

### For Complete Implementation Guides
1. `recipe_search(query: "complete webpage")` - Find relevant recipes
2. `recipe_get(id: 1)` - Get full step-by-step guide
3. Follow instructions with code examples

### For Quick Code Snippets
1. `search_examples(query: "primary button")` - Direct code search
2. Copy HTML from results

---

## Database

The server uses a SQLite database (`ecl-database.sqlite`, ~21MB) containing:

**Documentation:**
- 159 crawled documentation pages
- Full HTML content and cleaned content versions
- Metadata (titles, categories, hierarchical paths)
- FTS5 full-text search index

**Code Examples:**
- 270 extracted code examples from 85 pages
- Labeled examples with positions
- Separate FTS5 index for fast code search

**Recipes:**
- Curated implementation patterns and workflows
- Step-by-step guides with code
- Difficulty levels and component lists
- FTS5 indexed for search

## Updating Documentation

To re-crawl the documentation:

```bash
node crawl.js
```

This will:
- Fetch any new URLs from `pages-to-crawl.txt`
- Update metadata for existing pages (without re-fetching HTML)
- Extract and store hierarchical path information
- Extract code examples and store them separately for fast retrieval

## Technical Details

**MCP Protocol:** Model Context Protocol v1.0  
**Transport:** stdio  
**ECL Version:** v4.11.1  
**Database:** SQLite 3 with FTS5 full-text search  
**CDN:** Official EC CDN (cdn1.fpfis.tech.ec.europa.eu)

## License

ISC
