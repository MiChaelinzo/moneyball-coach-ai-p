# Extending & Maintaining Junie Integration

This document provides guidance for developers who need to extend or maintain the Junie AI integration for the Assistant Coach - Esports Analytics Platform.

## Overview

The Junie integration consists of several configuration files that work together to guide the AI agent's behavior:

```
.junie/
├── guidelines.md      # Core coding standards and conventions
├── junie.config.yaml  # Structured configuration metadata
├── SETUP.md           # Setup and initialization instructions
├── WORKFLOWS.md       # Agent workflows and patterns
└── EXTENDING.md       # This file - extension guidelines
```

## Extending the Guidelines

### Adding New Coding Standards

To add new coding standards to `guidelines.md`:

1. **Identify the Category**
   - Determine if it fits under TypeScript, React, Styling, etc.
   - If it's a new category, add a new `###` section

2. **Write Clear Rules**
   - Use imperative language: "Use X", "Avoid Y"
   - Provide code examples when helpful
   - Explain the reasoning briefly

3. **Example Addition**
   ```markdown
   ### State Management
   
   - Use Zustand for global state when React Context becomes complex
   - Keep state as close to where it's used as possible
   - Avoid prop drilling more than 2 levels deep
   ```

### Updating Existing Standards

When updating existing standards:

1. Review current usage in the codebase
2. Ensure backward compatibility
3. Update related sections (e.g., config.yaml if patterns change)
4. Document the change in commit message

## Extending the Configuration

### junie.config.yaml Structure

The configuration file uses YAML format with these main sections:

| Section | Purpose |
|---------|---------|
| `project` | Project metadata |
| `junie` | Agent behavior settings |
| `languages` | Language configuration |
| `frameworks` | Framework definitions |
| `patterns` | Code patterns |
| `api` | API integration settings |
| `styling` | Styling configuration |
| `imports` | Import rules |
| `testing` | Testing configuration |
| `commands` | Available commands |
| `security` | Security rules |
| `antipatterns` | Patterns to avoid |

### Adding New Configuration

To add new configuration options:

```yaml
# Example: Adding a new feature flag section
feature_flags:
  experimental_features: false
  enable_ai_insights: true
  live_data_polling: true
```

### Validation

After modifying the config:

1. Validate YAML syntax using a linter
2. Restart the IDE to reload configuration
3. Test that Junie reads the new settings

## Adding New Workflows

### Workflow Template

Use this template when adding new workflows to `WORKFLOWS.md`:

```markdown
### N. [Workflow Name] Workflow

When asking Junie to [action]:

\`\`\`
Workflow: [Name]
├── 1. [First step]
├── 2. [Second step]
├── 3. [Third step]
└── 4. [Final step]
\`\`\`

**Example Prompt:**
\`\`\`
[Example of how to ask Junie]
\`\`\`

**Expected Junie Behavior:**
1. [What Junie should do first]
2. [What Junie should do next]
3. [Final expected action]
```

### Integration with Configuration

Ensure new workflows reference:
- Patterns defined in `junie.config.yaml`
- Standards in `guidelines.md`
- File locations and naming conventions

## Maintaining the Integration

### Regular Maintenance Tasks

| Task | Frequency | Description |
|------|-----------|-------------|
| Review guidelines | Monthly | Ensure guidelines match current codebase |
| Update dependencies | As needed | Update framework versions in config |
| Add new patterns | When introduced | Document new patterns as they emerge |
| Remove deprecated | Quarterly | Clean up outdated guidelines |

### Syncing with Codebase Changes

When the codebase evolves:

1. **New Dependencies Added**
   - Update `frameworks` section in config
   - Add guidelines for the new dependency

2. **File Structure Changes**
   - Update `patterns.files` in config
   - Update project structure in guidelines

3. **New Component Patterns**
   - Add to `patterns.components` in config
   - Document in workflows

4. **API Changes**
   - Update `api` section in config
   - Document new integration patterns

### Version Control

- Commit Junie configuration changes separately
- Use descriptive commit messages:
  ```
  .junie: Add workflow for analytics components
  .junie: Update framework versions to match package.json
  .junie: Fix deprecated pattern in guidelines
  ```

## Troubleshooting Integration Issues

### Common Issues

#### Junie Ignoring Guidelines

**Symptoms:** Junie generates code that doesn't follow guidelines

**Solutions:**
1. Make guidelines more specific and explicit
2. Add code examples to illustrate rules
3. Restart IDE to reload configuration

#### Configuration Not Loading

**Symptoms:** Changes to config have no effect

**Solutions:**
1. Check YAML syntax for errors
2. Verify file is saved with UTF-8 encoding
3. Check IDE logs for parsing errors

#### Workflow Not Recognized

**Symptoms:** Junie doesn't follow expected workflow

**Solutions:**
1. Use explicit trigger phrases
2. Reference workflow name in prompt
3. Provide more context in the request

## Best Practices for Extension

### DO

- ✅ Keep guidelines concise and actionable
- ✅ Use consistent formatting
- ✅ Provide examples for complex rules
- ✅ Test changes before committing
- ✅ Document reasoning for rules

### DON'T

- ❌ Add vague or subjective guidelines
- ❌ Create conflicting rules
- ❌ Remove rules without checking impact
- ❌ Add framework-agnostic patterns
- ❌ Forget to update related files

## Contributing Guidelines

When contributing to the Junie integration:

1. **Fork & Branch**
   - Create a feature branch for changes

2. **Make Changes**
   - Follow the templates above
   - Keep changes focused

3. **Test**
   - Verify Junie responds correctly
   - Check for conflicts with existing rules

4. **Document**
   - Update this file if adding new sections
   - Add clear commit messages

5. **Review**
   - Request review from maintainers
   - Address feedback

## Resources

### JetBrains Junie

- [Junie Documentation](https://junie.jetbrains.com/docs/)
- [Junie Guidelines Repository](https://github.com/JetBrains/junie-guidelines)
- [JetBrains AI Guide](https://www.jetbrains.com/guide/ai/)

### Project-Specific

- [Project README](../README.md)
- [Product Requirements](../PRD.md)
- [GRID Integration Guide](../GRID_INTEGRATION.md)

## Changelog

| Date | Change | Author |
|------|--------|--------|
| 2024-XX-XX | Initial Junie integration | - |
| - | Future changes logged here | - |
