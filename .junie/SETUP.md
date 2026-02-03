# Junie AI Setup Instructions

This document describes how to initialize and connect JetBrains Junie AI agent to the Assistant Coach - Esports Analytics Platform project.

## Prerequisites

- JetBrains IDE (IntelliJ IDEA, WebStorm, or other JetBrains IDE) with Junie plugin installed
- Node.js 18+ and npm installed
- Git installed and configured
- (Optional) GRID API key for real esports data

## Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/MiChaelinzo/moneyball-coach-ai-p.git
cd moneyball-coach-ai-p
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Open in JetBrains IDE

Open the project root folder in your JetBrains IDE. Junie will automatically detect the `.junie/` configuration folder.

### 4. Verify Junie Detection

1. Open `Tools > Junie > Project Settings` in your IDE
2. Verify that Junie has detected the guidelines file at `.junie/guidelines.md`
3. Check that the configuration is loaded from `.junie/junie.config.yaml`

## Configuration

### Automatic Configuration

Junie automatically reads configuration from:
- `.junie/guidelines.md` — Coding standards and conventions
- `.junie/junie.config.yaml` — Structured metadata and behavior settings
- `.junie/WORKFLOWS.md` — Agent workflow definitions

### Manual Configuration (Optional)

If you need to customize Junie's behavior:

1. Navigate to `Tools > Junie > Project Settings`
2. Under "Guidelines File", ensure `.junie/guidelines.md` is selected
3. Adjust any agent behavior settings as needed

## Environment Setup

### Development Environment

```bash
# Start development server
npm run dev

# The app will be available at http://localhost:5173
```

### API Keys (Optional)

For real GRID API data integration:

1. Obtain a GRID API key from the hackathon resources
2. In the running application, click "Configure API"
3. Enter your API key and click "Connect"

> **Note**: API keys are stored in browser local storage, not in the codebase.

## Junie Initialization Checklist

- [ ] IDE with Junie plugin installed
- [ ] Project cloned and dependencies installed
- [ ] `.junie/` folder detected by Junie
- [ ] Guidelines file loaded
- [ ] Configuration file parsed
- [ ] Development server running (for testing)

## Verifying Junie Connection

To verify Junie is properly connected:

1. Open any `.tsx` or `.ts` file in the `src/` directory
2. Ask Junie to explain the file or suggest improvements
3. Junie should respond using the coding conventions defined in `guidelines.md`

### Example Verification Prompts

Try these prompts to test Junie integration:

```
"Explain the structure of this React component"
"Suggest improvements following the project's coding standards"
"Generate a new component following the shadcn/ui patterns"
"Add TypeScript types for this function"
```

## Troubleshooting

### Junie Not Detecting Configuration

1. Ensure `.junie/` folder is at the project root
2. Check that `guidelines.md` exists and is readable
3. Restart the IDE and reopen the project
4. Verify Junie plugin is up to date

### Configuration Not Loading

1. Check for syntax errors in `junie.config.yaml`
2. Validate YAML format using an online validator
3. Ensure file encoding is UTF-8

### Junie Not Following Guidelines

1. Verify guidelines file path in IDE settings
2. Check that guidelines are specific and actionable
3. Update guidelines with more explicit rules if needed

## Support

- **JetBrains Junie Docs**: https://junie.jetbrains.com/docs/
- **Project Issues**: GitHub repository issues
- **Hackathon Support**: Cloud9 x JetBrains Hackathon resources
