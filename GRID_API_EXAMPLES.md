# GRID API Usage Examples

This document provides practical examples of using the GRID API integration in the Assistant Coach application.

## Basic Usage in Components

### Using the useGridData Hook

The simplest way to access GRID API data in your React components:

```typescript
import { useGridData } from '@/hooks/use-grid-data'

function MyComponent() {
  const {
    players,        // Cloud9 players with stats
    matches,        // Recent Cloud9 matches
    isLoading,      // Loading state
    error,          // Error message if any
    isInitialized,  // API connection status
    fetchData,      // Manual refresh function
    hasCachedData,  // Whether cached data exists
  } = useGridData()

  // Auto-fetches on mount if API is initialized
  // Data is cached for 5 minutes

  if (isLoading) {
    return <div>Loading Cloud9 data...</div>
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  return (
    <div>
      <h2>{players.length} Players Found</h2>
      {players.map(player => (
        <div key={player.id}>
          {player.name} - {player.role} - {player.winRate}% WR
        </div>
      ))}
      <button onClick={() => fetchData(true)}>Refresh Data</button>
    </div>
  )
}
```

## Direct API Usage

### Fetching Cloud9 Players

```typescript
import { fetchCloud9Players, enrichPlayersWithStats } from '@/lib/gridApi'

async function loadPlayers() {
  try {
    // Fetch basic player roster
    const players = await fetchCloud9Players()
    console.log('Players:', players)
    // Returns: [{ id, name, role, kda: 0, winRate: 0, gamesPlayed: 0 }]

    // Enrich with statistics
    const enrichedPlayers = await enrichPlayersWithStats(players)
    console.log('Enriched:', enrichedPlayers)
    // Returns: [{ id, name, role, kda, winRate, gamesPlayed }]
  } catch (error) {
    console.error('Failed to load players:', error)
  }
}
```

### Fetching Match History

```typescript
import { fetchCloud9Matches } from '@/lib/gridApi'

async function loadMatches() {
  try {
    // Fetch last 10 matches
    const matches = await fetchCloud9Matches(10)
    
    matches.forEach(match => {
      console.log(`
        ${match.date} vs ${match.opponent}
        Result: ${match.result}
        Duration: ${Math.floor(match.duration / 60)}m
        Dragons: ${match.objectives.dragons}
        Barons: ${match.objectives.barons}
      `)
    })
  } catch (error) {
    console.error('Failed to load matches:', error)
  }
}
```

### Live Match Tracking

```typescript
import { fetchLiveMatchData, fetchRecentCloud9Games } from '@/lib/gridApi'

async function trackLiveMatch() {
  try {
    // Get recent game IDs
    const gameIds = await fetchRecentCloud9Games(5)
    
    if (gameIds.length === 0) {
      console.log('No recent games found')
      return
    }

    // Fetch live data for the most recent game
    const liveData = await fetchLiveMatchData(gameIds[0])
    
    if (!liveData || !liveData.isActive) {
      console.log('Game is not active')
      return
    }

    console.log(`
      ${liveData.opponent}
      Game Time: ${Math.floor(liveData.gameTime / 60)}m
      Gold: ${liveData.teamGold} vs ${liveData.enemyGold}
      Dragons: ${liveData.objectives.dragons}
    `)

    // Display player stats
    liveData.players.forEach(player => {
      console.log(`${player.name}: ${player.kills}/${player.deaths}/${player.assists}`)
    })
  } catch (error) {
    console.error('Failed to track live match:', error)
  }
}
```

### Player Statistics

```typescript
import { fetchPlayerStats } from '@/lib/gridApi'

async function loadPlayerStats(playerId: string) {
  try {
    // Fetch stats from last 20 games
    const stats = await fetchPlayerStats(playerId, 20)
    
    console.log(`
      KDA: ${stats.kda}
      Win Rate: ${stats.winRate}%
      Games Played: ${stats.gamesPlayed}
    `)
  } catch (error) {
    console.error('Failed to load player stats:', error)
  }
}
```

## Initializing with Custom API Key

```typescript
import { initializeGridApi, isGridApiInitialized } from '@/lib/gridApi'

function setupCustomApiKey(apiKey: string) {
  // Initialize with custom key
  initializeGridApi(apiKey)
  
  // Check if initialized
  if (isGridApiInitialized()) {
    console.log('GRID API initialized successfully')
  } else {
    console.log('GRID API initialization failed')
  }
}
```

## Error Handling Patterns

### Basic Error Handling

```typescript
import { fetchCloud9Players } from '@/lib/gridApi'
import axios from 'axios'

async function safeLoadPlayers() {
  try {
    const players = await fetchCloud9Players()
    return { success: true, data: players }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // Handle axios-specific errors
      const status = error.response?.status
      const message = error.response?.statusText || error.message
      
      if (status === 401) {
        return { success: false, error: 'Invalid API key' }
      } else if (status === 400) {
        return { success: false, error: 'Bad request - check query syntax' }
      } else {
        return { success: false, error: `API error: ${message}` }
      }
    }
    return { success: false, error: 'Unknown error occurred' }
  }
}
```

### Retry Logic

```typescript
import { fetchCloud9Players } from '@/lib/gridApi'

async function loadPlayersWithRetry(maxRetries = 3) {
  let lastError: Error | null = null
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      const players = await fetchCloud9Players()
      return players
    } catch (error) {
      lastError = error as Error
      console.log(`Attempt ${i + 1} failed, retrying...`)
      // Wait before retry (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, i)))
    }
  }
  
  throw lastError || new Error('Failed after retries')
}
```

### Graceful Fallback

```typescript
import { fetchCloud9Players } from '@/lib/gridApi'
import { PLAYERS as MOCK_PLAYERS } from '@/lib/mockData'

async function loadPlayersWithFallback() {
  try {
    // Try to fetch real data
    const players = await fetchCloud9Players()
    if (players.length > 0) {
      return { data: players, source: 'live' }
    }
  } catch (error) {
    console.warn('Live data unavailable, using mock data')
  }
  
  // Fall back to mock data
  return { data: MOCK_PLAYERS, source: 'mock' }
}
```

## Caching Strategies

### Manual Cache Management

```typescript
import { useKV } from '@github/spark/hooks'
import { fetchCloud9Players } from '@/lib/gridApi'

function usePlayerCache() {
  const [cachedPlayers, setCachedPlayers] = useKV('players-cache', [])
  const [cacheTime, setCacheTime] = useKV('players-cache-time', 0)
  
  async function loadPlayers(forceRefresh = false) {
    const now = Date.now()
    const cacheAge = now - cacheTime
    const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes
    
    // Use cache if fresh and not forcing refresh
    if (!forceRefresh && cacheAge < CACHE_DURATION && cachedPlayers.length > 0) {
      console.log('Using cached data')
      return cachedPlayers
    }
    
    // Fetch fresh data
    const players = await fetchCloud9Players()
    setCachedPlayers(players)
    setCacheTime(now)
    
    return players
  }
  
  return { loadPlayers, cachedPlayers, cacheAge: Date.now() - cacheTime }
}
```

## Combining Multiple Queries

### Parallel Data Fetching

```typescript
import { fetchCloud9Players, fetchCloud9Matches, enrichPlayersWithStats } from '@/lib/gridApi'

async function loadAllData() {
  try {
    // Fetch players and matches in parallel
    const [players, matches] = await Promise.all([
      fetchCloud9Players(),
      fetchCloud9Matches(10)
    ])
    
    // Then enrich players with stats
    const enrichedPlayers = await enrichPlayersWithStats(players)
    
    return {
      players: enrichedPlayers,
      matches,
      loadedAt: new Date()
    }
  } catch (error) {
    console.error('Failed to load all data:', error)
    throw error
  }
}
```

### Sequential Data Fetching

```typescript
import { fetchCloud9Players, fetchPlayerStats } from '@/lib/gridApi'

async function loadPlayersSequentially() {
  try {
    // First get the roster
    const players = await fetchCloud9Players()
    
    // Then fetch detailed stats for each player
    const detailedPlayers = []
    for (const player of players) {
      const stats = await fetchPlayerStats(player.id)
      detailedPlayers.push({ ...player, ...stats })
      
      // Optional: add delay between requests
      await new Promise(resolve => setTimeout(resolve, 100))
    }
    
    return detailedPlayers
  } catch (error) {
    console.error('Failed to load players sequentially:', error)
    throw error
  }
}
```

## Real-Time Updates

### Polling for Live Updates

```typescript
import { fetchLiveMatchData } from '@/lib/gridApi'
import { useState, useEffect } from 'react'

function useLiveMatchPolling(gameId: string, interval = 1000) {
  const [liveData, setLiveData] = useState(null)
  const [isPolling, setIsPolling] = useState(false)
  
  useEffect(() => {
    if (!isPolling) return
    
    const poll = async () => {
      try {
        const data = await fetchLiveMatchData(gameId)
        setLiveData(data)
      } catch (error) {
        console.error('Polling error:', error)
      }
    }
    
    // Initial fetch
    poll()
    
    // Set up interval
    const intervalId = setInterval(poll, interval)
    
    return () => clearInterval(intervalId)
  }, [gameId, interval, isPolling])
  
  return {
    liveData,
    startPolling: () => setIsPolling(true),
    stopPolling: () => setIsPolling(false),
    isPolling
  }
}
```

## TypeScript Types

### Available Interfaces

```typescript
// From @/lib/types

interface Player {
  id: string
  name: string
  role: string
  kda: number
  winRate: number
  gamesPlayed: number
}

interface Match {
  id: string
  date: string
  opponent: string
  result: 'win' | 'loss'
  duration: number
  objectives: {
    dragons: number
    barons: number
    towers: number
  }
}

interface LiveMatchPlayer {
  id: string
  name: string
  role: string
  kills: number
  deaths: number
  assists: number
  cs: number
  gold: number
  champion: string
}

interface LiveMatch {
  id: string
  isActive: boolean
  opponent: string
  gameTime: number
  teamGold: number
  enemyGold: number
  objectives: {
    dragons: number
    barons: number
    towers: number
  }
  enemyObjectives: {
    dragons: number
    barons: number
    towers: number
  }
  players: LiveMatchPlayer[]
}
```

## Best Practices

1. **Always handle errors**: API calls can fail for many reasons
2. **Use caching**: Reduce API calls with appropriate caching strategies
3. **Show loading states**: Inform users when data is being fetched
4. **Provide fallbacks**: Use mock/cached data when live data is unavailable
5. **Respect rate limits**: Don't make excessive API calls
6. **Type your data**: Use TypeScript interfaces for type safety
7. **Log errors**: Help with debugging by logging detailed error information
8. **Test offline**: Ensure app works when API is unavailable

## Common Patterns

### Loading State Component

```typescript
function PlayerList() {
  const { players, isLoading, error } = useGridData()
  
  if (isLoading) return <LoadingSpinner />
  if (error) return <ErrorMessage error={error} />
  if (players.length === 0) return <EmptyState />
  
  return (
    <div>
      {players.map(player => (
        <PlayerCard key={player.id} player={player} />
      ))}
    </div>
  )
}
```

### Refresh Button

```typescript
function RefreshButton() {
  const { fetchData, isLoading } = useGridData()
  
  return (
    <button
      onClick={() => fetchData(true)}
      disabled={isLoading}
    >
      {isLoading ? 'Refreshing...' : 'Refresh Data'}
    </button>
  )
}
```

### Data Source Indicator

```typescript
function DataSourceBadge() {
  const { isInitialized, hasCachedData } = useGridData()
  
  if (isInitialized) {
    return <span className="badge-success">Live Data</span>
  } else if (hasCachedData) {
    return <span className="badge-warning">Cached Data</span>
  } else {
    return <span className="badge-default">Mock Data</span>
  }
}
```
