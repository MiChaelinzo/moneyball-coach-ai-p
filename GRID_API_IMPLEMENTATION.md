# GRID API Implementation Guide

This document describes how the GRID API integration has been implemented in the Assistant Coach application.

## Overview

The application uses axios with proper TypeScript typing to interact with the GRID API. All API calls use the recommended header-based authentication method for enhanced security.

## API Configuration

- **Base URL**: `https://api.grid.gg/central-data/graphql`
- **API Key**: Pre-configured with `GacqICJfwHbtteMEbQ8mUVztiBHCuKuzijh7m4N8`
- **Authentication**: Uses `x-api-key` header (recommended method)

## Key Features

### 1. Axios-Based Implementation

All API calls now use axios instead of fetch for:
- Better error handling
- Type safety with TypeScript
- Automatic JSON transformation
- Request/response interceptor support

### 2. GraphQL Queries

The application executes GraphQL queries against the GRID Central Data API to fetch:
- Cloud9 team roster with active players
- Player statistics (KDA, win rate, games played)
- Recent Cloud9 matches with results and objectives
- Live match data with real-time updates

### 3. Type Safety

All API responses are properly typed using TypeScript interfaces:
```typescript
interface GraphQLResponse<T = any> {
  data: T
  errors?: Array<{ message: string; locations?: any[]; path?: string[] }>
}
```

### 4. Error Handling

Enhanced error handling using axios error detection:
```typescript
catch (error) {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError
    console.error('GRID API Error:', axiosError.response?.status, axiosError.response?.data)
    throw new Error(
      `GRID API error (${axiosError.response?.status || 'unknown'}): ${
        axiosError.response?.statusText || axiosError.message
      }`
    )
  }
  throw error
}
```

## Main API Functions

### `fetchCloud9Players()`
Fetches the current Cloud9 roster with active players.

**GraphQL Query**: `allTeam` with filter for Cloud9
**Returns**: Array of Player objects with ID, name, role

### `fetchPlayerStats(playerId, limit)`
Retrieves recent game statistics for a specific player.

**GraphQL Query**: `allPlayerGameParticipant`
**Returns**: KDA, win rate, and games played

### `fetchCloud9Matches(limit)`
Gets recent Cloud9 match results.

**GraphQL Query**: `allGame` with Cloud9 team filter
**Returns**: Array of Match objects with results and objectives

### `fetchLiveMatchData(gameId)`
Retrieves real-time data for an ongoing match.

**GraphQL Query**: `game` by ID
**Returns**: Live match state with player stats and objectives

### `enrichPlayersWithStats(players)`
Enriches player data with their recent statistics.

**Process**: Fetches stats for each player in parallel
**Returns**: Enhanced player objects with complete statistics

## Usage in Components

The `useGridData` hook provides a React-friendly interface:

```typescript
const {
  players,        // Current player data
  matches,        // Recent matches
  isLoading,      // Loading state
  error,          // Error message if any
  isInitialized,  // API initialization status
  fetchData,      // Manual data refresh
  apiKey,         // Current API key
  hasCachedData,  // Cache status
} = useGridData()
```

## Caching Strategy

- Data is cached in KV storage using `useKV` hook
- Cache duration: 5 minutes
- Automatic cache check before fetching new data
- Force refresh option available

## Authentication Methods

### Recommended: Header-Based (Currently Implemented)
```typescript
const response = await axios.post(
  GRID_API_BASE,
  { query, variables },
  {
    headers: {
      'x-api-key': apiKey,
      'Content-Type': 'application/json',
    },
  }
)
```

### Alternative: URL Parameter (Not Recommended)
```typescript
const url = `https://api.grid.gg/file-download/end-state/grid/series/${seriesId}?key=${apiKey}`
const response = await axios.get(url)
```

## Example: Fetching Series Data

To fetch Valorant series data:

```typescript
const query = `
  query GetSeries($first: Int) {
    allSeries(
      first: $first,
      filter: {
        titleId: 6
        types: ESPORTS
      }
      orderBy: StartTimeScheduled
      orderDirection: DESC
    ) {
      totalCount
      pageInfo {
        hasPreviousPage
        hasNextPage
        startCursor
        endCursor
      }
      edges {
        node {
          id
          title {
            id
          }
          tournament {
            id
            name
          }
        }
      }
    }
  }
`

const response = await axios.post(
  'https://api.grid.gg/central-data/graphql',
  {
    query,
    variables: { first: 50 }
  },
  {
    headers: {
      'x-api-key': API_KEY,
      'Content-Type': 'application/json'
    }
  }
)

const data = response.data.data
```

## Game Title IDs

- League of Legends: 3
- Valorant: 6
- Rainbow 6: Siege: 25

## Troubleshooting

### 400 Bad Request Error
- Check that the GraphQL query syntax is correct
- Verify that all required variables are provided
- Ensure the API key is valid and properly formatted

### 401 Unauthorized Error
- Verify the API key is set correctly
- Check that the `x-api-key` header is included
- Confirm the API key has proper permissions

### GraphQL Errors
- Review the `errors` array in the response
- Check field names match the schema
- Verify filter parameters are valid

## Resources

- [GRID API Documentation](https://portal.grid.gg/documentation)
- [GraphQL Playground](https://portal.grid.gg/gql-playground)
- [Authentication Guide](https://portal.grid.gg/documentation/tutorials/developers/authenticating-your-api-requests)
