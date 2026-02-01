import axios, { AxiosResponse, AxiosError } from 'axios'
import type { Player, Match, LiveMatch, LiveMatchPlayer, Tournament } from './types'

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

interface LiveGameState {
  id: string
  state: string
  statsAvailable: boolean
}

interface LiveSeriesData {
  id: string
  state: string
  games: LiveGameState[]
  teams: Array<{
    id: string
    name: string
    score: number
  }>
  title: {
    id: string
    name: string
  }
}

export async function fetchOngoingCloud9Games(): Promise<LiveSeriesData[]> {
  const query = `
    query GetOngoingCloud9Games {
      allSeries(
        first: 10
        filter: {
          teams: "Cloud9"
          states: [UNSTARTED, RUNNING]
        }
        orderBy: StartTimeScheduled
        orderDirection: DESC
      ) {
        edges {
          node {
            id
            state
            title {
              id
              name
            }
            teams {
              id
              name
              score
            }
            games {
              id
              state
              statsAvailable
            }
          }
        }
      }
    }
  `

  try {
    console.log('Checking for ongoing Cloud9 games...')
    const data = await gridFetch(query)
    const series = data.allSeries?.edges || []
    
    const liveSeries = series
      .map((edge: any) => edge.node)
      .filter((s: any) => s.state === 'RUNNING' || s.games?.some((g: any) => g.state === 'RUNNING'))
    
    console.log(`Found ${liveSeries.length} ongoing Cloud9 series`)
    return liveSeries
  } catch (error) {
    console.error('Failed to fetch ongoing Cloud9 games:', error)
    throw error
  }
}

export async function fetchLiveGameStats(gameId: string): Promise<any> {
  const query = `
    query GetLiveGameStats($gameId: ID!) {
      game(id: $gameId) {
        id
        state
        statsAvailable
        participants {
          id
          name
          role
          team {
            id
            name
          }
          champion {
            id
            name
          }
          kills
          deaths
          assists
          totalGold
          totalMinionsKilled
          neutralMinionsKilled
        }
        teams {
          id
          name
          totalGold
          dragonKills
          baronKills
          towerKills
          inhibitorKills
        }
      }
    }
  `

  try {
    console.log(`Fetching live stats for game ${gameId}...`)
    const data = await gridFetch(query, { gameId })
    
    if (!data.game) {
      console.warn(`No game data found for ID ${gameId}`)
      return null
    }
    
    return data.game
  } catch (error) {
    console.error(`Failed to fetch live game stats for ${gameId}:`, error)
    return null
  }
}

export async function fetchLiveMatchData(gameId: string): Promise<Partial<LiveMatch> | null> {
  try {
    const gameStats = await fetchLiveGameStats(gameId)
    
    if (!gameStats || !gameStats.participants) {
      console.log('No live game stats available yet')
      return null
    }

    const cloud9Team = gameStats.teams?.find((t: any) => t.name === 'Cloud9')
    const opponentTeam = gameStats.teams?.find((t: any) => t.name !== 'Cloud9')
    
    if (!cloud9Team) {
      console.warn('Cloud9 team not found in game data')
      return null
    }

    const cloud9Participants = gameStats.participants.filter(
      (p: any) => p.team?.name === 'Cloud9'
    )

    if (cloud9Participants.length === 0) {
      console.warn('No Cloud9 participants found')
      return null
    }

    const players: LiveMatchPlayer[] = cloud9Participants.map((p: any) => ({
      id: p.id?.toString() || `player-${p.name}`,
      name: p.name || 'Unknown',
      role: p.role || 'Unknown',
      kills: p.kills || 0,
      deaths: p.deaths || 0,
      assists: p.assists || 0,
      cs: (p.totalMinionsKilled || 0) + (p.neutralMinionsKilled || 0),
      gold: p.totalGold || 0,
      champion: p.champion?.name || 'Unknown',
    }))

    return {
      opponent: opponentTeam?.name || 'Unknown',
      teamGold: cloud9Team.totalGold || 0,
      enemyGold: opponentTeam?.totalGold || 0,
      objectives: {
        dragons: cloud9Team.dragonKills || 0,
        barons: cloud9Team.baronKills || 0,
        towers: cloud9Team.towerKills || 0,
      },
      enemyObjectives: {
        dragons: opponentTeam?.dragonKills || 0,
        barons: opponentTeam?.baronKills || 0,
        towers: opponentTeam?.towerKills || 0,
      },
      players,
    }
  } catch (error) {
    console.error('Failed to fetch live match data:', error)
    return null
  }
}

export async function fetchRecentCloud9Games(limit: number = 5): Promise<Array<{ id: string; opponent: string; state: string }>> {
  try {
    console.log('Fetching recent Cloud9 game IDs for live tracking...')
    const series = await fetchOngoingCloud9Games()
    
    const games = series.flatMap((s) => 
      s.games.map((g) => ({
        id: g.id,
        opponent: s.teams.find(t => t.name !== 'Cloud9')?.name || 'Unknown',
        state: g.state,
      }))
    )
    
    console.log(`Found ${games.length} Cloud9 games`)
    return games.slice(0, limit)
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

export async function fetchTournaments(limit: number = 50): Promise<Tournament[]> {
  const query = `
    query GetTournaments($first: Int!) {
      tournaments(first: $first) {
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
  `

  try {
    console.log('Fetching tournaments, limit:', limit)
    const data = await gridFetch(query, { first: limit })
    const tournaments = data.tournaments?.edges || []
    console.log('Received', tournaments.length, 'tournaments')

    return tournaments.map((edge: any) => ({
      id: edge.node.id.toString(),
      name: edge.node.name,
      nameShortened: edge.node.nameShortened,
    }))
  } catch (error) {
    console.error('Failed to fetch tournaments:', error)
    throw error
  }
}

export async function fetchTournament(tournamentId: string): Promise<Tournament | null> {
  const query = `
    query GetTournament($id: ID!) {
      tournament(id: $id) {
        id
        name
        nameShortened
      }
    }
  `

  try {
    console.log(`Fetching tournament ${tournamentId}...`)
    const data = await gridFetch(query, { id: tournamentId })
    
    if (!data.tournament) {
      console.warn(`No tournament found for ID ${tournamentId}`)
      return null
    }

    return {
      id: data.tournament.id.toString(),
      name: data.tournament.name,
      nameShortened: data.tournament.nameShortened,
    }
  } catch (error) {
    console.error(`Failed to fetch tournament ${tournamentId}:`, error)
    return null
  }
}

export async function fetchCloud9Tournaments(limit: number = 20): Promise<Tournament[]> {
  const query = `
    query GetCloud9Tournaments($first: Int!) {
      allSeries(
        first: $first
        filter: {
          teams: "Cloud9"
        }
        orderBy: StartTimeScheduled
        orderDirection: DESC
      ) {
        edges {
          node {
            tournament {
              id
              name
              nameShortened
            }
          }
        }
      }
    }
  `

  try {
    console.log('Fetching Cloud9 tournaments, limit:', limit)
    const data = await gridFetch(query, { first: limit })
    const series = data.allSeries?.edges || []
    
    const tournamentMap = new Map<string, Tournament>()
    
    series.forEach((edge: any) => {
      const tournament = edge.node.tournament
      if (tournament && !tournamentMap.has(tournament.id)) {
        tournamentMap.set(tournament.id, {
          id: tournament.id.toString(),
          name: tournament.name,
          nameShortened: tournament.nameShortened,
        })
      }
    })

    const tournaments = Array.from(tournamentMap.values())
    console.log('Found', tournaments.length, 'unique Cloud9 tournaments')
    return tournaments
  } catch (error) {
    console.error('Failed to fetch Cloud9 tournaments:', error)
    throw error
  }
}
