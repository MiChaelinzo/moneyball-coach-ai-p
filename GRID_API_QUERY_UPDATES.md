# GRID API Query Updates

This document summarizes the GraphQL query updates made to align with the GRID Open Access API documentation.

## Updated Queries

### 1. Players Query (`fetchCloud9Players`)
**Before:** Fetched players from series data by filtering teams
**After:** Direct player query using team filter

```graphql
query GetPlayers {
  players(filter: {teamIdFilter: {id: "1"}}, first: 50) {
    edges {
      node {
        id
        nickname
        firstName
        lastName
        title {
          name
        }
      }
    }
    pageInfo {
      hasNextPage
      hasPreviousPage
    }
  }
}
```

### 2. Tournaments Query (`fetchTournaments`, `fetchCloud9Tournaments`)
**Before:** Used `allTournaments(first: $first)`
**After:** Uses `tournaments` (returns all tournaments)

```graphql
query GetTournaments {
  tournaments {
    pageInfo {
      hasPreviousPage
      hasNextPage
      startCursor
      endCursor
    }
    totalCount
    edges {
      cursor
      node {
        id
        name
        nameShortened
      }
    }
  }
}
```

### 3. Series Queries (`fetchCloud9Matches`, `fetchSeriesWithDetails`, `fetchOngoingCloud9Games`)
**Before:** Used variables like `$first`, `$titleId`, etc.
**After:** Embedded values directly in query or removed pagination

```graphql
query GetCloud9Series {
  allSeries(
    filter: {
      titleId: 3
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
      cursor
      node {
        id
        title {
          nameShortened
        }
        tournament {
          id
          name
          nameShortened
        }
        startTimeScheduled
        format {
          name
          nameShortened
        }
        teams {
          baseInfo {
            name
          }
          scoreAdvantage
        }
      }
    }
  }
}
```

### 4. Time Range Query (`fetchSeriesInTimeRange`)
**Before:** Used GraphQL variables for date filtering
**After:** Embedded date strings directly in filter

```graphql
query GetAllSeriesInNext24Hours {
  allSeries(
    filter:{
      startTimeScheduled:{
        gte: "2024-04-24T15:00:07Z"
        lte: "2024-04-25T15:00:07Z"
      }
    }
    orderBy: StartTimeScheduled
  ) {
    totalCount
    pageInfo {
      hasPreviousPage
      hasNextPage
      startCursor
      endCursor
    }
    edges {
      cursor
      node {
        id
        title {
          nameShortened
        }
        tournament {
          nameShortened
        }
        startTimeScheduled
        format {
          name
          nameShortened
        }
        teams {
          baseInfo {
            name
          }
          scoreAdvantage
        }
      }
    }
  }
}
```

## API Configuration

- **Endpoint:** `https://api-op.grid.gg/central-data/graphql`
- **API Key:** `GacqICJfwHbtteMEbQ8mUVztiBHCuKuzijh7m4N8`
- **Authentication:** `x-api-key` header

## Key Changes

1. **Removed GraphQL variables** where the Open Access API expects embedded values
2. **Updated player fetching** to use direct `players` query with team filter
3. **Fixed tournament queries** to use `tournaments` instead of `allTournaments`
4. **Simplified series queries** by removing unnecessary pagination variables
5. **Embedded date strings** directly in time range filters instead of using variables

## Testing

To test these updates:
1. Click "Refresh Data" in the GRID API Setup panel
2. Navigate to different tabs (Organization, Teams, Tournaments, Upcoming Series)
3. Verify data loads correctly from the GRID API
4. Check the browser console for successful API responses

## Notes

- The API key provided is pre-configured and should work immediately
- All queries now match the exact structure shown in the GRID API documentation
- Client-side pagination/limiting is applied after fetching results where needed
