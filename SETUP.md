# Setup Instructions for ECL MCP Server

## Prerequisites

You need Node.js installed on your system. Here's how to install it:

### Option 1: Using apt (Debian/Ubuntu)
```bash
# Install Node.js 20 (LTS)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### Option 2: Using nvm (Recommended)
```bash
# Install nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Restart your terminal or run:
source ~/.zshrc

# Install Node.js
nvm install 20
nvm use 20
```

### Option 3: Using Homebrew (if available)
```bash
brew install node
```

## Installation Steps

1. **Verify Node.js is installed:**
   ```bash
   node --version
   npm --version
   ```

2. **Navigate to the project directory:**
   ```bash
   cd /home/simon/git/CNECT/ecl_mcp
   ```

3. **Install dependencies:**
   ```bash
   npm install
   ```

4. **Test the server:**
   ```bash
   npm start
   ```

## Adding to Claude Desktop

1. Open Claude Desktop configuration file:
   - Linux: `~/.config/Claude/claude_desktop_config.json`
   - macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`

2. Add the ECL server:
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

3. Restart Claude Desktop

## Adding to Cline (VS Code Extension)

1. Open VS Code Settings (JSON)
2. Add to MCP servers configuration:
   ```json
   {
     "mcp.servers": {
       "ecl": {
         "command": "node",
         "args": ["/home/simon/git/CNECT/ecl_mcp/index.js"]
       }
     }
   }
   ```

## Testing the Server

Once installed, you can test the server by asking your MCP client:

- "What components are available in ECL?"
- "Show me how to create a button component"
- "Get the complete setup guide for ECL"
- "List all form components"
- "Generate code for an accordion component"

## Troubleshooting

### "Cannot find module '@modelcontextprotocol/sdk'"
Run: `npm install`

### "node: command not found"
Install Node.js using one of the methods above

### Server not appearing in MCP client
1. Check the path in the configuration is correct
2. Verify Node.js is in your PATH
3. Restart the MCP client application

## Development

To run with auto-restart on file changes:
```bash
npm run dev
```

To manually test the server:
```bash
node index.js
```

The server will output: "ECL MCP Server running on stdio"
