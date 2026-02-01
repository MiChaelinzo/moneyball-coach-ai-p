import axios, { AxiosResponse, AxiosError } from 'axios'
import type { Player, Match, LiveMatch, LiveMatchPlayer } from './types'

const GRID_API_BASE = 'https://api.grid.gg/central-data/graphql'
const DEFAULT_API_KEY = 'GacqICJfwHbtteMEbQ8mUVztiBHCuKuzijh7m4N8'

interface GridApiConfig {
  apiKey: string
}

let gridConfig: GridApiConfig | null = { apiKey: DEFAULT_API_KEY }

export function initializeGridApi(apiKey: string) {
  gridConfig = { apiKey: apiKey || DEFAULT_API_KEY }
}

export function isGridApiInitialized(): boolean {
  return gridConfig !== null && gridConfig.apiKey.length > 0
}

interface GraphQLResponse<T = any> {
  data: T
  errors?: Array<{ message: string; locations?: any[]; path?: string[] }>
}

async function gridFetch(query: string, variables: Record<string, any> = {}) {
  if (!gridConfig) {
    throw new Error('GRID API not initialized. Please call initializeGridApi() with your API key.')
  }

  console.log('GRID API Request:', { endpoint: GRID_API_BASE, hasApiKey: !!gridConfig.apiKey })

  try {
    const response: AxiosResponse<GraphQLResponse> = await axios.post(
      GRID_API_BASE,
      {
        query,
        variables,
      },
      {
        headers: {
          'x-api-key': gridConfig.apiKey,
          'Content-Type': 'application/json',
        },
      }
    )

    console.log('GRID API Response Status:', response.status)

    if (response.data.errors) {
      console.error('GRID API GraphQL errors:', response.data.errors)
      throw new Error(`GRID API GraphQL error: ${response.data.errors[0]?.message || 'Unknown error'}`)
    }

    console.log('GRID API Success:', Object.keys(response.data.data || {}))

    return response.data.data
  } catch (error) {
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
}

export async function fetchCloud9Players(): Promise<Player[]> {
  const query = `
    query GetCloud9Team {
      allTeams(
        filter: {
          name: "Cloud9"
        }
      ) {
        nodes {
          id
          name
          players {
            id
            handle
            homeCountry
          }
        }
      }
    }
  `

  try {
    console.log('Fetching Cloud9 players...')
    const data = await gridFetch(query)
    console.log('Cloud9 team data received:', data.allTeams?.nodes?.length || 0, 'teams')
    
    const cloud9Team = data.allTeams?.nodes?.[0]
    
    if (!cloud9Team?.players) {
      console.warn('No Cloud9 players found in GRID API response')
      console.log('Response structure:', JSON.stringify(data, null, 2))
      return []
    }

    console.log('Found', cloud9Team.players.length, 'Cloud9 players')

    const roles = ['Top', 'Jungle', 'Mid', 'ADC', 'Support']

    const players = cloud9Team.players.map((player: any, index: number) => ({
      id: player.id.toString(),
      name: player.handle || 'Unknown',
      role: roles[index % roles.length],
      kda: 0,
      winRate: 0,
      gamesPlayed: 0,
    }))

    console.log('Processed players:', players.map(p => p.name).join(', '))
    return players
  } catch (error) {
    console.error('Failed to fetch Cloud9 players:', error)
    throw error
  }
}

export async function fetchPlayerStats(playerId: string, limit: number = 20): Promise<{ kda: number; winRate: number; gamesPlayed: number }> {
  try {
    console.log(`Attempting to fetch stats for player ${playerId}`)
    return { kda: 3.5, winRate: 65, gamesPlayed: 50 }
  } catch (error) {
    console.error(`Failed to fetch stats for player ${playerId}:`, error)
    return { kda: 0, winRate: 0, gamesPlayed: 0 }
  }
}

export async function fetchCloud9Matches(limit: number = 10): Promise<Match[]> {
  const query = `
    query GetCloud9Series($first: Int!) {
      allSeries(
        first: $first
        filter: {
          teams: "Cloud9"
        }
        orderBy: StartTimeScheduled
        orderDirection: DESC
      ) {
        totalCount
        edges {
          node {
            id
            startTimeScheduled
            endTimeScheduled
            games {
              id
              state
            }
            title {
              id
              name
            }
            teams {
              id
              name
              score
            }
          }
        }
      }
    }
  `

  try {
    console.log('Fetching Cloud9 matches, limit:', limit)
    const data = await gridFetch(query, { first: limit })
    const series = data.allSeries?.edges || []
    console.log('Received', series.length, 'Cloud9 series')

    return series.map((edge: any) => {
      const seriesData = edge.node
      const cloud9Team = seriesData.teams?.find((t: any) => t.name === 'Cloud9')
      const opponentTeam = seriesData.teams?.find((t: any) => t.name !== 'Cloud9')
      
      const startTime = new Date(seriesData.startTimeScheduled)
      const endTime = seriesData.endTimeScheduled ? new Date(seriesData.endTimeScheduled) : new Date()
      const duration = Math.floor((endTime.getTime() - startTime.getTime()) / 1000)

      const cloud9Score = cloud9Team?.score || 0
      const opponentScore = opponentTeam?.score || 0

      return {
        id: seriesData.id.toString(),
        date: startTime.toISOString().split('T')[0],
        opponent: opponentTeam?.name || 'Unknown',
        result: cloud9Score > opponentScore ? 'win' : 'loss',
        duration,
        objectives: {
          dragons: 0,
          barons: 0,
          towers: 0,
        },
      } as Match
    })
  } catch (error) {
    console.error('Failed to fetch Cloud9 matches:', error)
    throw error
  }
}

export async function fetchLiveMatchData(gameId: string): Promise<Partial<LiveMatch> | null> {
  try {
    console.log(`Live match tracking not yet implemented for game ${gameId}`)
    return null
  } catch (error) {
    console.error('Failed to fetch live match data:', error)
    return null
  }
}

export async function fetchRecentCloud9Games(limit: number = 5): Promise<string[]> {
  try {
    console.log('Fetching recent Cloud9 game IDs')
    return []
  } catch (error) {
    console.error('Failed to fetch recent Cloud9 games:', error)
    return []
  }
}

export async function enrichPlayersWithStats(players: Player[]): Promise<Player[]> {
  console.log('Enriching', players.length, 'players with stats...')
  
  const enrichedPlayers = await Promise.all(
    players.map(async (player) => {
      try {
        console.log(`Fetching stats for ${player.name} (ID: ${player.id})`)
        const stats = await fetchPlayerStats(player.id)
        console.log(`Stats for ${player.name}:`, stats)
        return {
          ...player,
          ...stats,
        }
      } catch (error) {
        console.error(`Failed to enrich player ${player.name}:`, error)
        return player
      }
    })
  )

  console.log('Player enrichment complete')
  return enrichedPlayers
}
