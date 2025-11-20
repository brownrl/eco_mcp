# Sample Prompt for Testing ECL MCP Server

This file contains a sample prompt you can use to test the MCP server functionality.

## Prompt

```
Using the connected ECL MCP server, find the HTML we need to create a mega menu component.
```

## Expected Workflow

1. **Search** for "mega menu" to find relevant pages
2. **Get the code page URL** from search results (should be: `https://ec.europa.eu/component-library/ec/components/navigation/mega-menu/code/`)
3. **Fetch full HTML** using `get_page` tool with that URL
4. **Extract and present** the HTML structure needed

## What You Should Get

- Main container with `<nav class="ecl-mega-menu">`
- Menu items (simple links vs. items with children)
- Submenu structure with panels
- Complete code examples

## Alternative Test Prompts

- "Show me the HTML for a button component"
- "Find the typography guidelines and get the full documentation"
- "Get me the code for a card component"
- "What HTML do I need for a search form?"
