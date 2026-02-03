# Assistant Coach - Esports Analytics Platform Guidelines

## Project Overview

This is an AI-powered esports analytics platform for Cloud9 that integrates with GRID API to deliver real-time team insights, player performance tracking, and strategic analysis. Built for the Cloud9 x JetBrains Hackathon.

## Technology Stack

- **Framework**: React 19 + TypeScript
- **Styling**: Tailwind CSS 4 + shadcn/ui components
- **State Management**: React hooks and TanStack Query
- **Data Source**: GRID API (GraphQL) + Spark KV Storage
- **AI**: GPT-4 via Spark LLM API
- **Animation**: Framer Motion
- **Icons**: Phosphor Icons
- **Build Tool**: Vite

## Project Structure

```
src/
├── components/         # React components
│   ├── ui/            # shadcn/ui base components
│   └── *.tsx          # Feature-specific components
├── hooks/             # Custom React hooks (use-*.ts)
├── lib/               # Utility functions and API clients
│   ├── gridApi.ts     # GRID API client & queries
│   ├── types.ts       # TypeScript interfaces
│   ├── utils.ts       # Helper utilities
│   └── mockData.ts    # Fallback demo data
└── styles/            # CSS and styling files
```

## Coding Standards

### TypeScript

- Use strict TypeScript with `strictNullChecks` enabled
- Define explicit interfaces for all data types in `src/lib/types.ts`
- Prefer `interface` over `type` for object shapes
- Use union types for fixed string values (e.g., `'win' | 'loss'`)
- Export types alongside their related interfaces

### React Components

- Use functional components with hooks
- Component files use PascalCase: `PlayerCard.tsx`
- Export named components (not default exports)
- Define component props as interfaces: `interface ComponentNameProps { ... }`
- Keep components focused on a single responsibility

### File Naming

- Components: PascalCase (e.g., `LiveMatchTracker.tsx`)
- Hooks: kebab-case with `use-` prefix (e.g., `use-grid-data.ts`)
- Utilities: camelCase (e.g., `utils.ts`, `gridApi.ts`)
- Types: PascalCase for interfaces, camelCase for type aliases

### Styling

- Use Tailwind CSS utility classes exclusively
- Use the `cn()` utility from `@/lib/utils` for conditional classes
- Follow the existing color scheme using CSS variables (e.g., `text-primary`, `bg-card`)
- Use shadcn/ui components from `@/components/ui` for consistent UI elements

### Imports

- Use path aliases with `@/` prefix for src imports
- Order imports: React/external libraries first, then internal modules
- Group imports by type: components, hooks, utilities, types

```typescript
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { useGridData } from '@/hooks/use-grid-data'
import type { Player } from '@/lib/types'
```

## Best Practices

### Component Patterns

- Use Framer Motion for animations: `motion.div` with `whileHover`, `whileTap`
- Wrap interactive cards with motion components for consistent UX
- Use shadcn/ui Card components for data display containers
- Use Badge components for categorical labels (roles, status, titles)

### Data Handling

- All GRID API queries should be in `src/lib/gridApi.ts`
- Implement graceful fallback to mock data when API is unavailable
- Use custom hooks for data fetching: `use-grid-data.ts`, `use-live-match.ts`
- Cache data locally for offline access and improved performance

### Error Handling

- Always handle API failures gracefully with user-friendly messages
- Provide fallback UI states for loading and error conditions
- Use React Error Boundary for component-level error catching

### Performance

- Use React Query for server state caching and automatic background updates
- Implement lazy loading for heavy components
- Optimize animations to avoid layout thrashing

## UI/UX Guidelines

### Color Scheme

The application uses a dark theme with Cloud9's signature colors:
- Primary: Electric cyan (`oklch(0.72 0.16 195)`)
- Background: Deep space blue (`oklch(0.18 0.04 240)`)
- Success: Green for positive trends
- Warning: Amber for attention areas
- Critical: Red for high-impact issues

### Typography

- Primary font: "Space Grotesk" for headers and body
- Monospace font: "JetBrains Mono" for data/metrics display
- Use `font-mono` class for numerical data

### Animations

- Use subtle, purposeful animations
- Apply consistent hover states: `whileHover={{ scale: 1.02 }}`
- Use staggered animations for lists of items
- Highlight important data changes with color transitions

## Testing Approach

- Test with and without GRID API connection
- Verify graceful error handling and fallback behavior
- Check responsive design on mobile viewports
- Test with mock data for development

## Commands

```bash
# Development
npm run dev

# Build
npm run build

# Lint
npm run lint

# Preview production build
npm run preview
```

## Antipatterns to Avoid

- Do not use inline styles; use Tailwind classes instead
- Avoid deeply nested conditional rendering; extract to separate components
- Do not hardcode colors; use CSS variables and theme tokens
- Avoid magic numbers; use design tokens or named constants
- Do not mutate state directly; use proper React state management
- Avoid blocking the main thread with heavy computations

## Security Considerations

- Store API keys securely in browser local storage (not in code)
- All API calls should use HTTPS
- Never expose sensitive credentials in the codebase
- Validate and sanitize user inputs before API calls
