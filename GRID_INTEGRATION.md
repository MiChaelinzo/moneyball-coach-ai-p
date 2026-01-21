# GRID API Integration Guide

This application integrates with GRID's esports data API to fetch real Cloud9 match data and player statistics.

## Getting Your GRID API Key

1. **Apply for Access**: Visit the hackathon resources page and apply for GRID API access
2. **Receive Your Key**: Once approved, you'll receive your personal API key
3. **Keep It Secure**: Never commit your API key to version control

## Setting Up the Integration

### In the Application

1. Launch the application
2. On the dashboard, you'll see the "GRID API Integration" card
3. Click the "Configure API" button
4. Enter your API key in the dialog
5. Click "Connect"

The application will:
- Validate your API key
- Fetch Cloud9 player roster
- Retrieve recent match history
- Cache data locally for offline use
- Auto-refresh data every 5 minutes

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

The integration uses GRID's GraphQL API:

```
https://api-op.grid.gg/central-data/graphql
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

The application gracefully handles various error scenarios:

- **Invalid API Key**: Clear error message with setup instructions
- **Network Errors**: Falls back to cached data
- **API Rate Limits**: Respects rate limits and retries appropriately
- **Missing Data**: Uses mock data as fallback for demonstrations

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

### No Data Loading
- Verify your internet connection
- Check if GRID API is operational
- Try the manual "Refresh Data" button
- Clear cache and reconnect

### Stale Data
- Click "Refresh Data" to force an update
- Check the last update timestamp
- Ensure auto-refresh is enabled

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
- [GRID API Documentation](https://api-docs.grid.gg/)
- Hackathon Discord channel
- Contact Cloud9 hackathon organizers
