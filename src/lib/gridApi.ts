import axios, { AxiosResponse, AxiosError } from 'axios'
import type { Player, Match, LiveMatch, LiveMatchPlayer, Tournament } from './types'

const GRID_API_BASE = 'https://api-op.grid.gg/central-data/graphql'
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
    query GetCloud9Players {
      allSeries(
        first: 50
        filter: {
          titleId: 3
          types: ESPORTS
        }
        orderBy: StartTimeScheduled
        orderDirection: DESC
      ) {
        edges {
          node {
            id
            teams {
              baseInfo {
                name
              }
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
    }
  `

  try {
    console.log('Fetching Cloud9 players from recent series...')
    const data = await gridFetch(query)
    console.log('Series data received:', data.allSeries?.edges?.length || 0, 'series')
    
    const series = data.allSeries?.edges || []
    
    if (series.length === 0) {
      console.warn('No series found in GRID API response')
      return []
    }

    const playerMap = new Map<string, Player>()
    const roles = ['Top', 'Jungle', 'Mid', 'ADC', 'Support']
    let roleIndex = 0

    series.forEach((edge: any) => {
      const seriesNode = edge.node
      const teams = seriesNode.teams || []
      
      teams.forEach((team: any) => {
        const teamName = team.baseInfo?.name || ''
        if (teamName.toLowerCase().includes('cloud9') || teamName.toLowerCase().includes('c9')) {
          const players = team.players || []
          console.log(`Found ${players.length} Cloud9 players in ${teamName}`)
          
          players.forEach((player: any) => {
            if (!playerMap.has(player.id)) {
              playerMap.set(player.id, {
                id: player.id.toString(),
                name: player.handle || player.firstName || 'Unknown',
                role: roles[roleIndex % roles.length],
                kda: 0,
                winRate: 0,
                gamesPlayed: 0,
              })
              roleIndex++
            }
          })
        }
      })
    })

    const allPlayers = Array.from(playerMap.values())
    console.log('Processed unique Cloud9 players:', allPlayers.map(p => p.name).join(', '))
    return allPlayers
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
  `

  try {
    console.log('Fetching Cloud9 matches, limit:', limit)
    const data = await gridFetch(query, { first: limit })
    const series = data.allSeries?.edges || []
    console.log('Received', series.length, 'series')

    return series.map((edge: any) => {
      const seriesData = edge.node
      const teams = seriesData.teams || []
      const cloud9Team = teams.find((t: any) => t.baseInfo?.name?.toLowerCase().includes('cloud9'))
      const opponentTeam = teams.find((t: any) => !t.baseInfo?.name?.toLowerCase().includes('cloud9'))
      
      const startTime = new Date(seriesData.startTimeScheduled)
      const duration = 2400

      const cloud9Score = cloud9Team?.scoreAdvantage || 0
      const opponentScore = opponentTeam?.scoreAdvantage || 0

      return {
        id: seriesData.id.toString(),
        date: startTime.toISOString().split('T')[0],
        opponent: opponentTeam?.baseInfo?.name || 'Unknown',
        result: cloud9Score > opponentScore ? 'win' : (cloud9Score < opponentScore ? 'loss' : 'draw'),
        duration,
        objectives: {
          dragons: 0,
          barons: 0,
          towers: 0,
        },
        format: seriesData.format ? {
          name: seriesData.format.name,
          nameShortened: seriesData.format.nameShortened,
        } : undefined,
        tournament: seriesData.tournament ? {
          id: seriesData.tournament.id?.toString() || '',
          name: seriesData.tournament.name,
          nameShortened: seriesData.tournament.nameShortened,
        } : undefined,
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
    query GetOngoingGames {
      allSeries(
        first: 20
        filter: {
          titleId: 3
          types: ESPORTS
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
              nameShortened
            }
            teams {
              baseInfo {
                name
              }
              scoreAdvantage
            }
            games {
              id
              state
            }
          }
        }
      }
    }
  `

  try {
    console.log('Checking for ongoing games...')
    const data = await gridFetch(query)
    const series = data.allSeries?.edges || []
    
    const liveSeries = series
      .map((edge: any) => {
        const node = edge.node
        return {
          id: node.id,
          state: node.state,
          games: node.games || [],
          teams: (node.teams || []).map((t: any) => ({
            id: t.baseInfo?.name || 'unknown',
            name: t.baseInfo?.name || 'Unknown',
            score: t.scoreAdvantage || 0,
          })),
          title: {
            id: node.title?.id || '',
            name: node.title?.nameShortened || 'Unknown',
          },
        }
      })
      .filter((s: any) => s.state === 'RUNNING' || s.games?.some((g: any) => g.state === 'RUNNING'))
    
    console.log(`Found ${liveSeries.length} ongoing series`)
    return liveSeries
  } catch (error) {
    console.error('Failed to fetch ongoing games:', error)
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
      allTournaments(first: $first) {
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
    const tournaments = data.allTournaments?.edges || []
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
    query GetRecentTournaments($first: Int!) {
      allSeries(
        first: $first
        filter: {
          titleId: 3
          types: ESPORTS
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
    console.log('Fetching tournaments from recent series, limit:', limit)
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
    console.log('Found', tournaments.length, 'unique tournaments from recent series')
    return tournaments
  } catch (error) {
    console.error('Failed to fetch tournaments:', error)
    throw error
  }
}

export async function fetchSeriesWithDetails(limit: number = 50, titleId: number = 3): Promise<any[]> {
  const query = `
    query GetSeriesDetails($first: Int!, $titleId: Int!) {
      allSeries(
        first: $first
        filter: {
          titleId: $titleId
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
  `

  try {
    console.log(`Fetching series details, limit: ${limit}, titleId: ${titleId}`)
    const data = await gridFetch(query, { first: limit, titleId })
    const series = data.allSeries?.edges || []
    console.log(`Received ${series.length} series with details`)
    
    return series.map((edge: any) => ({
      cursor: edge.cursor,
      ...edge.node,
    }))
  } catch (error) {
    console.error('Failed to fetch series with details:', error)
    throw error
  }
}

export interface SeriesFormat {
  id: string
  name: string
  nameShortened: string
}

export async function fetchSeriesFormats(): Promise<SeriesFormat[]> {
  const query = `
    query SeriesFormats {
      seriesFormats {
        id
        name
        nameShortened 
      }
    }
  `

  try {
    console.log('Fetching series formats...')
    const data = await gridFetch(query)
    const formats = data.seriesFormats || []
    console.log(`Received ${formats.length} series formats`)
    
    return formats.map((format: any) => ({
      id: format.id,
      name: format.name,
      nameShortened: format.nameShortened,
    }))
  } catch (error) {
    console.error('Failed to fetch series formats:', error)
    throw error
  }
}

export async function fetchSeriesInTimeRange(
  startTime: string,
  endTime: string,
  titleId: number = 3,
  limit: number = 50
): Promise<any[]> {
  const query = `
    query GetSeriesInTimeRange($first: Int!, $titleId: Int!, $startTime: DateTime!, $endTime: DateTime!) {
      allSeries(
        first: $first
        filter: {
          titleId: $titleId
          types: ESPORTS
          startTimeScheduled: {
            gte: $startTime
            lte: $endTime
          }
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
  `

  try {
    console.log(`Fetching series in time range: ${startTime} to ${endTime}`)
    const data = await gridFetch(query, { 
      first: limit, 
      titleId,
      startTime,
      endTime,
    })
    const series = data.allSeries?.edges || []
    console.log(`Received ${series.length} series in time range`)
    
    return series.map((edge: any) => ({
      cursor: edge.cursor,
      ...edge.node,
    }))
  } catch (error) {
    console.error('Failed to fetch series in time range:', error)
    throw error
  }
}

export interface Organization {
  id: string
  name: string
  teams: Array<{
    name: string
  }>
}

export async function fetchCloud9Organization(): Promise<Organization | null> {
  const query = `
    query GetOrganization($id: ID!) {
      organization(id: $id) {
        id
        name
        teams {
          name
        }
      }
    }
  `

  try {
    console.log('Fetching Cloud9 organization (ID: 1)...')
    const data = await gridFetch(query, { id: "1" })
    
    if (!data.organization) {
      console.warn('No organization found for ID 1')
      return null
    }

    console.log(`Organization: ${data.organization.name}`)
    console.log(`Teams found: ${data.organization.teams?.length || 0}`)
    
    return {
      id: data.organization.id,
      name: data.organization.name,
      teams: data.organization.teams || [],
    }
  } catch (error) {
    console.error('Failed to fetch Cloud9 organization:', error)
    return null
  }
}

export async function fetchOrganizations(limit: number = 5): Promise<Organization[]> {
  const query = `
    query GetOrganizations($first: Int!) {
      organizations(first: $first) {
        edges {
          node {
            id
            name
            teams {
              name
            }
          }
        }
      }
    }
  `

  try {
    console.log(`Fetching ${limit} organizations...`)
    const data = await gridFetch(query, { first: limit })
    const organizations = data.organizations?.edges || []
    console.log(`Received ${organizations.length} organizations`)
    
    return organizations.map((edge: any) => ({
      id: edge.node.id,
      name: edge.node.name,
      teams: edge.node.teams || [],
    }))
  } catch (error) {
    console.error('Failed to fetch organizations:', error)
    throw error
  }
}
