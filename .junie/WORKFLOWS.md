# Junie AI Workflows & Integration Conventions

This document defines the standard workflows and conventions for using Junie AI agent within the Assistant Coach - Esports Analytics Platform project.

## Agent Workflows

### 1. Component Creation Workflow

When asking Junie to create a new React component:

```
Workflow: Create Component
├── 1. Analyze similar existing components
├── 2. Define TypeScript interface for props
├── 3. Create functional component with motion wrapper
├── 4. Apply shadcn/ui base components
├── 5. Add Tailwind styling with CSS variables
└── 6. Export as named export
```

**Example Prompt:**
```
Create a new component called MatchSummaryCard that displays:
- Match result (win/loss)
- Opponent name
- Match duration
- Key statistics
Follow the existing PlayerCard component pattern.
```

**Expected Junie Behavior:**
1. Examines `PlayerCard.tsx` for patterns
2. Creates interface `MatchSummaryCardProps`
3. Uses `motion.div` wrapper with hover effects
4. Applies `Card`, `CardHeader`, `CardContent` from shadcn/ui
5. Uses existing color tokens (`text-success`, `text-destructive`)
6. Exports `MatchSummaryCard` as named export

---

### 2. API Integration Workflow

When adding new GRID API queries:

```
Workflow: Add API Query
├── 1. Define TypeScript types in types.ts
├── 2. Create GraphQL query in gridApi.ts
├── 3. Add fallback mock data in mockData.ts
├── 4. Create custom hook for data fetching
└── 5. Handle loading/error states
```

**Example Prompt:**
```
Add a new API query to fetch tournament standings from GRID API.
Include error handling and mock data fallback.
```

**Expected Junie Behavior:**
1. Adds `TournamentStanding` interface to `src/lib/types.ts`
2. Adds GraphQL query to `src/lib/gridApi.ts`
3. Adds mock standings data to `src/lib/mockData.ts`
4. Creates `use-tournament-standings.ts` hook
5. Implements graceful error handling with fallback

---

### 3. Styling Workflow

When asking Junie to style components:

```
Workflow: Apply Styling
├── 1. Use Tailwind utility classes only
├── 2. Reference CSS variables for colors
├── 3. Apply responsive classes for mobile
├── 4. Use cn() for conditional classes
└── 5. Follow existing spacing conventions
```

**Example Prompt:**
```
Style this component to match the dark theme with Cloud9 colors.
Make it responsive for mobile devices.
```

**Expected Junie Behavior:**
1. Uses `bg-card`, `text-primary`, `border-border` tokens
2. Applies responsive prefixes (`sm:`, `md:`, `lg:`)
3. Uses `cn()` from `@/lib/utils` for conditional styling
4. Follows `gap-4`, `p-6` spacing conventions
5. Never uses inline styles or hardcoded colors

---

### 4. Type Definition Workflow

When adding or modifying TypeScript types:

```
Workflow: Define Types
├── 1. Place in src/lib/types.ts
├── 2. Use interface for object shapes
├── 3. Use union types for literals
├── 4. Export alongside related types
└── 5. Add JSDoc comments if complex
```

**Example Prompt:**
```
Add types for a new draft pick tracking feature with player, team, and pick order.
```

**Expected Junie Behavior:**
1. Creates interfaces in `src/lib/types.ts`
2. Uses `interface DraftPick { ... }`
3. Uses `'first' | 'second'` for pick sides
4. Groups with related match/player types
5. Adds brief JSDoc comments for clarity

---

### 5. Bug Fix Workflow

When asking Junie to fix bugs:

```
Workflow: Fix Bug
├── 1. Analyze the error/issue
├── 2. Identify root cause
├── 3. Propose minimal fix
├── 4. Explain the fix clearly
└── 5. Suggest prevention measures
```

**Example Prompt:**
```
The player stats are not updating when switching between players.
Diagnose and fix the issue.
```

**Expected Junie Behavior:**
1. Analyzes component lifecycle and state
2. Identifies missing dependency or stale closure
3. Proposes targeted fix (not complete rewrite)
4. Explains why the fix works
5. Suggests adding tests or guards

---

## Integration Conventions

### Convention 1: Error Handling Pattern

All API calls should follow this pattern:

```typescript
try {
  const data = await fetchFromAPI()
  return data
} catch (error) {
  console.error('API Error:', error)
  // Fallback to mock data
  return mockData
}
```

### Convention 2: Component Props Pattern

Always define props interface above the component:

```typescript
interface MyComponentProps {
  data: DataType
  isLoading?: boolean
  onAction?: () => void
}

export function MyComponent({ data, isLoading, onAction }: MyComponentProps) {
  // ...
}
```

### Convention 3: Animation Pattern

Wrap interactive elements with motion:

```typescript
<motion.div
  whileHover={{ scale: 1.02 }}
  whileTap={{ scale: 0.98 }}
>
  <Card>...</Card>
</motion.div>
```

### Convention 4: Data Fetching Pattern

Use custom hooks for data fetching:

```typescript
// In hooks/use-my-data.ts
export function useMyData() {
  const [data, setData] = useState<DataType | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  
  // Fetch logic with error handling
  
  return { data, isLoading, error }
}
```

### Convention 5: Conditional Styling Pattern

Use cn() utility for conditional classes:

```typescript
import { cn } from '@/lib/utils'

<div className={cn(
  'base-classes',
  isActive && 'active-classes',
  isError && 'error-classes'
)}>
```

---

## Agent Communication Guidelines

### DO: Provide Context

```
✅ "Create a PlayerStatsCard component similar to PlayerCard but showing 
   detailed statistics including KDA breakdown, CS per minute, and damage share."
```

### DON'T: Be Vague

```
❌ "Make a card for stats"
```

### DO: Reference Existing Patterns

```
✅ "Following the pattern in use-grid-data.ts, create a hook for 
   fetching team rankings."
```

### DON'T: Ignore Project Conventions

```
❌ "Create a class-based component with inline styles"
```

### DO: Ask for Explanations

```
✅ "Explain why this component re-renders when the parent state changes"
```

### DON'T: Accept Without Understanding

```
❌ "Just fix it without explaining what was wrong"
```

---

## Workflow Triggers

Junie responds to these workflow triggers:

| Trigger Phrase | Workflow Activated |
|---------------|-------------------|
| "Create component" | Component Creation |
| "Add API query" | API Integration |
| "Style this" | Styling |
| "Add types for" | Type Definition |
| "Fix this bug" | Bug Fix |
| "Refactor" | Code Improvement |
| "Explain" | Code Analysis |
| "Test" | Testing Guidance |

---

## Quality Checklist

Before accepting Junie's output, verify:

- [ ] Types are properly defined
- [ ] Component follows naming conventions
- [ ] Imports use path aliases (`@/`)
- [ ] No inline styles used
- [ ] Error handling is present
- [ ] Animation patterns are consistent
- [ ] CSS variables used for colors
- [ ] Named exports (not default)
