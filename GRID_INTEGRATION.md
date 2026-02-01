# GRID API Integration Guide

This application integrates with GRID's esports data API to fetch real Cloud9 match data and player statistics.

## ⚡ Recent Updates

**Latest**: GRID API now uses axios with proper TypeScript typing for improved error handling and type safety. All API calls use the recommended header-based authentication method.

## Pre-Configured API Key

This application comes pre-configured with a GRID API key (`GacqICJfwHbtteMEbQ8mUVztiBHCuKuzijh7m4N8`) for immediate access to Cloud9 esports data. The API key is automatically initialized when the application loads.

## Setting Up the Integration

### Automatic Initialization

The application automatically:
- Initializes the GRID API with the pre-configured key using **axios** for HTTP requests
- Connects to the GRID API endpoint: `https://api.grid.gg/central-data/graphql`
- Uses the `x-api-key` header for authentication (secure method recommended by GRID)
- Implements proper TypeScript typing for all API responses
- Provides enhanced error handling with axios error detection
- Is ready to fetch Cloud9 data immediately

### Technology Stack

- **HTTP Client**: axios (v1.13.4)
- **Authentication**: Header-based with `x-api-key` (recommended method)
- **Type Safety**: Full TypeScript support with typed responses
- **Error Handling**: axios-specific error detection and reporting

### Manual Data Fetching

1. Launch the application
2. On the dashboard, you'll see the "GRID API Connected" card
3. Click "Refresh Data" to fetch the latest Cloud9 data
4. The application will automatically fetch data on first load

The application will:
- Fetch Cloud9 player roster with current statistics
- Retrieve recent match history
- Cache data locally for offline use
- Auto-refresh data every 5 minutes when requested

### Data Sources

The application intelligently switches between data sources:

- **GRID API Connected**: Uses live Cloud9 esports data
- **Cached Data**: Falls back to locally cached data if API is temporarily unavailable
- **Mock Data**: Uses demonstration data if no API key is configured

### Features Powered by GRID API

#### Player Statistics
- Real Cloud9 roster with actual player names and roles
- Live KDA (Kills/Deaths/Assists) ratios
- Current win rates
- Games played counts

#### Match History
- Recent Cloud9 matches with real opponents
- Actual match results (wins/losses)
- Match dates and durations
- Objective statistics (dragons, barons, towers)

#### Live Match Tracking
- Connect to ongoing Cloud9 matches
- Real-time player statistics
- Live objective tracking
- Gold differential monitoring

## API Endpoints Used

The integration uses GRID's Central Data GraphQL API with axios:

```
https://api.grid.gg/central-data/graphql
```

Authentication is handled via the `x-api-key` request header using axios, which is the secure method recommended by GRID's documentation.

### Example axios Request

```typescript
import axios from 'axios';

const response = await axios.post(
  'https://api.grid.gg/central-data/graphql',
  {
    query: graphqlQuery,
    variables: queryVariables,
  },
  {
    headers: {
      'x-api-key': 'YOUR_API_KEY',
      'Content-Type': 'application/json',
    },
  }
);

const data = response.data.data;
```

### Queries

**Team & Players**
```graphql
query GetCloud9Team {
  allTeam(filter: { name: { equalTo: "Cloud9" } }) {
    nodes {
      playersInTeams(filter: { active: { equalTo: true } }) {
        nodes {
          player { id, nickname }
          position
        }
      }
    }
  }
}
```

**Player Statistics**
```graphql
query GetPlayerStats($playerId: BigInt!, $limit: Int!) {
  allPlayerGameParticipant(
    filter: { playerId: { equalTo: $playerId } }
    first: $limit
  ) {
    nodes {
      kills, deaths, assists
      game { state, teams { nodes { won } } }
    }
  }
}
```

**Match History**
```graphql
query GetCloud9Matches($limit: Int!) {
  allGame(
    filter: {
      state: { equalTo: "FINISHED" }
      teams: { some: { name: { equalTo: "Cloud9" } } }
    }
    first: $limit
  ) {
    nodes {
      id, startTime, endTime
      teams { nodes { name, won, towers, dragons, barons } }
    }
  }
}
```

**Live Match Data**
```graphql
query GetLiveGame($gameId: BigInt!) {
  game(id: $gameId) {
    id, state, startTime
    teams {
      nodes {
        name, goldEarned, towers, dragons, barons
        players {
          nodes {
            player { nickname }
            position, championName
            kills, deaths, assists, creepScore, goldEarned
          }
        }
      }
    }
  }
}
```

## Data Caching

To optimize performance and provide offline functionality:

- **Cache Duration**: 5 minutes
- **Storage**: Browser's persistent key-value store
- **Automatic Refresh**: Silently updates in background
- **Manual Refresh**: Click "Refresh Data" to force update

## Error Handling

The application gracefully handles various error scenarios with enhanced axios error detection:

- **Invalid API Key**: Clear error message with setup instructions, detected via axios error response
- **400 Bad Request**: GraphQL query syntax errors or missing variables
- **401 Unauthorized**: Invalid or missing API key authentication
- **Network Errors**: Falls back to cached data, with detailed axios error reporting
- **API Rate Limits**: Respects rate limits and retries appropriately
- **Missing Data**: Uses mock data as fallback for demonstrations
- **GraphQL Errors**: Parses and displays specific GraphQL error messages from response

### Error Detection Example

```typescript
try {
  const response = await axios.post(url, data, config);
  return response.data.data;
} catch (error) {
  if (axios.isAxiosError(error)) {
    console.error('API Error:', error.response?.status, error.response?.data);
    throw new Error(`GRID API error (${error.response?.status}): ${error.response?.statusText}`);
  }
  throw error;
}
```

## Privacy & Security

- API keys are stored locally in your browser
- No keys are transmitted to any third-party services
- All API communication is encrypted (HTTPS)
- You can disconnect and clear your API key at any time

## Troubleshooting

### "GRID API not initialized" Error
- Ensure you've entered a valid API key
- Try disconnecting and reconnecting
- Check that your API key hasn't expired

### 400 Bad Request Error
- **Cause**: GraphQL query syntax error or invalid variables
- **Solution**: Check the browser console for detailed error messages
- **Fix**: Verify GraphQL query syntax and variable types match schema
- Review the query in GRID's GraphQL Playground

### 401 Unauthorized Error
- **Cause**: Invalid or missing API key
- **Solution**: Verify API key is correct in the setup dialog
- **Fix**: Re-enter your API key or use the pre-configured default key

### No Data Loading
- Verify your internet connection
- Check if GRID API is operational
- Try the manual "Refresh Data" button
- Clear cache and reconnect
- Check browser console for axios error messages

### Stale Data
- Click "Refresh Data" to force an update
- Check the last update timestamp
- Ensure auto-refresh is enabled

### GraphQL Errors
- Check browser console for specific GraphQL error messages
- Verify field names match GRID API schema
- Ensure filter parameters are valid
- Test query in GRID's GraphQL Playground

## Development Notes

### File Structure
```
src/
├── lib/
│   ├── gridApi.ts          # GRID API client & queries
│   └── types.ts            # TypeScript interfaces
├── hooks/
│   ├── use-grid-data.ts    # Data fetching & caching hook
│   └── use-live-match.ts   # Live match tracking hook
└── components/
    └── GridApiSetup.tsx    # API configuration UI
```

### Adding New Queries

1. Define GraphQL query in `src/lib/gridApi.ts`
2. Create a typed fetch function
3. Add caching logic in `use-grid-data.ts`
4. Update TypeScript interfaces in `types.ts`

### Testing Without API Key

The application works fully without a GRID API key using mock data, allowing you to:
- Test all UI functionality
- Demonstrate features
- Develop new components
- Simulate live matches

## Support

For GRID API documentation and support:
- [GRID API Documentation](https://portal.grid.gg/documentation)
- [GRID GraphQL Playground](https://portal.grid.gg/gql-playground)
- [Authentication Guide](https://portal.grid.gg/documentation/tutorials/developers/authenticating-your-api-requests)
- [Fetching Series Guide](https://portal.grid.gg/documentation/tutorials/developers/fetching-lists-of-series-from-the-grid-api)
- Hackathon Discord channel
- Contact Cloud9 hackathon organizers

## Additional Resources

See `GRID_API_IMPLEMENTATION.md` for detailed technical documentation including:
- Complete TypeScript implementation examples
- GraphQL query templates
- Error handling patterns
- Authentication methods comparison
- Game title ID reference
