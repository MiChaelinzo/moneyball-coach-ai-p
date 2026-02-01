# GRID API Endpoint Update - Fixed 400 Error

## Problem
The application was receiving a 400 error when making requests to the GRID API because it was using the wrong endpoint URL.

## Solution
Updated the GRID API endpoint from the standard access URL to the **Open Access** endpoint:

### Before (Incorrect)
```typescript
const GRID_API_BASE = 'https://api.grid.gg/central-data/graphql'
```

### After (Correct)
```typescript
const GRID_API_BASE = 'https://api-op.grid.gg/central-data/graphql'
```

## Key Changes Made

### 1. Updated API Endpoint
- Changed base URL to Open Access endpoint: `https://api-op.grid.gg/central-data/graphql`
- This endpoint is specifically designed for hackathon participants with open access

### 2. Updated GraphQL Queries to Match API Schema

#### Series/Matches Query
```graphql
query GetCloud9Series($first: Int!) {
  allSeries(
    first: $first
    filter: {
      titleId: 3          # League of Legends
      types: ESPORTS      # Only esports matches
    }
    orderBy: StartTimeScheduled
    orderDirection: DESC
  ) {
    edges {
      node {
        id
        title { nameShortened }
        tournament { nameShortened }
        startTimeScheduled
        format {
          name
          nameShortened
        }
        teams {
          baseInfo { name }
          scoreAdvantage
        }
      }
    }
  }
}
```

#### Teams/Players Query
```graphql
query GetCloud9Teams {
  allTeams(
    first: 20
    filter: { name: "Cloud9" }
  ) {
    edges {
      node {
        id
        baseInfo { name }
        players {
          id
          handle
          firstName
          lastName
        }
      }
    }
  }
}
```

#### Tournaments Query
```graphql
query GetTournaments($first: Int!) {
  allTournaments(first: $first) {
    edges {
      node {
        id
        name
        nameShortened
      }
    }
  }
}
```

## Updated Functions

1. **`fetchCloud9Players()`** - Now uses `allTeams` with `baseInfo` structure
2. **`fetchCloud9Matches()`** - Uses `titleId` filter and new team structure with `baseInfo`
3. **`fetchOngoingCloud9Games()`** - Updated to work with new schema
4. **`fetchTournaments()`** - Changed from `tournaments` to `allTournaments`
5. **`fetchCloud9Tournaments()`** - Uses series data to extract unique tournaments
6. **`fetchSeriesWithDetails()`** - New function to fetch comprehensive series data

## Title IDs Reference
- **League of Legends**: 3
- **VALORANT**: 6
- **Rainbow 6: Siege**: 25

## API Key
The application is pre-configured with the hackathon API key:
```
GacqICJfwHbtteMEbQ8mUVztiBHCuKuzijh7m4N8
```

## Testing
After these changes:
1. The GRID API should initialize successfully on app load
2. Clicking "Refresh Data" should fetch real series, tournament, and team data
3. No more 400 errors when making API requests
4. Data should populate in the UI within 3 seconds

## Notes
- The Open Access endpoint has the same authentication method (x-api-key header)
- All queries now properly match the GraphQL schema available on the Open Access endpoint
- The application gracefully falls back to mock data if the API is unavailable
