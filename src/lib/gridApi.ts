import axios, { AxiosResponse, AxiosError } from 'axios'
import type { Player, Match, LiveMatch, LiveMatchPlayer, Tournament, Team, GameTitle, CareerMilestone } from './types'

declare global {
  interface Window {
    spark: {
      llmPrompt: (strings: TemplateStringsArray, ...values: any[]) => string
      llm: (prompt: string, modelName?: string, jsonMode?: boolean) => Promise<string>
    }
  }
}

const spark = typeof window !== 'undefined' ? window.spark : null

const GRID_API_BASE = 'https://api-op.grid.gg/central-data/graphql'
const GRID_STATS_API_BASE = 'https://api-op.grid.gg/statistics-feed/graphql'
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

async function gridFetch(query: string, variables: Record<string, any> = {}, endpoint: string = GRID_API_BASE) {
  if (!gridConfig) {
    throw new Error('GRID API not initialized. Please call initializeGridApi() with your API key.')
  }

  console.log('GRID API Request:', { endpoint, hasApiKey: !!gridConfig.apiKey })

  try {
    const response: AxiosResponse<GraphQLResponse> = await axios.post(
      endpoint,
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
    query GetPlayers {
      players(filter: {teamIdFilter: {id: "1"}}, first: 50) {
        edges {
          node {
            id
            nickname
            title {
              id
              name
            }
            homeCountry {
              code
              name
            }
            activeSince
          }
        }
        pageInfo {
          hasNextPage
          hasPreviousPage
        }
      }
    }
  `

  try {
    console.log('Fetching Cloud9 players...')
    const data = await gridFetch(query)
    console.log('Players data received:', data.players?.edges?.length || 0, 'players')
    
    const playerEdges = data.players?.edges || []
    
    if (playerEdges.length === 0) {
      console.warn('No players found in GRID API response')
      return []
    }

    const roles = ['Top', 'Jungle', 'Mid', 'ADC', 'Support']
    
    const titleIdToName = (titleId: string): GameTitle => {
      switch(titleId) {
        case '3': return 'LoL'
        case '6': return 'Valorant'
        case '25': return 'CS2'
        default: return 'LoL'
      }
    }

    const allPlayers = playerEdges.map((edge: any, index: number) => {
      const player = edge.node
      const titleId = player.title?.id?.toString() || '3'
      return {
        id: player.id.toString(),
        name: player.nickname || 'Unknown',
        role: roles[index % roles.length],
        kda: 0,
        winRate: 0,
        gamesPlayed: 0,
        title: titleIdToName(titleId),
        titleId: titleId,
        biography: player.homeCountry ? {
          nationality: player.homeCountry.name,
          bio: '',
          careerStart: player.activeSince ? parseInt(player.activeSince) : undefined,
        } : undefined,
      }
    })

    console.log('Processed Cloud9 players:', allPlayers.map(p => `${p.name} (${p.title})`).join(', '))
    return allPlayers
  } catch (error) {
    console.error('Failed to fetch Cloud9 players:', error)
    throw error
  }
}

export async function fetchPlayerStats(playerId: string, limit: number = 20): Promise<{ kda: number; winRate: number; gamesPlayed: number }> {
  try {
    console.log(`Fetching stats for player ${playerId}`)
    
    const stats = await fetchPlayerStatistics(playerId)
    
    if (!stats || stats.game.count === 0) {
      console.log(`No statistics available for player ${playerId}, using defaults`)
      return { kda: 0, winRate: 0, gamesPlayed: 0 }
    }
    
    const winData = stats.game.wins.find(w => w.value === true)
    const winRate = winData ? winData.percentage : 0
    
    const totalKills = stats.series.kills.avg || 0
    const totalDeaths = stats.segment.length > 0 ? stats.segment[0].deaths.avg : 1
    const kda = totalDeaths > 0 ? totalKills / totalDeaths : totalKills
    
    console.log(`Stats for player ${playerId}:`, {
      gamesPlayed: stats.game.count,
      winRate: Math.round(winRate),
      kda: parseFloat(kda.toFixed(2))
    })
    
    return {
      kda: parseFloat(kda.toFixed(2)),
      winRate: Math.round(winRate),
      gamesPlayed: stats.game.count
    }
  } catch (error) {
    console.error(`Failed to fetch stats for player ${playerId}:`, error)
    return { kda: 0, winRate: 0, gamesPlayed: 0 }
  }
}

export async function fetchCloud9Matches(limit: number = 10): Promise<Match[]> {
  const query = `
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
  `

  try {
    console.log('Fetching Cloud9 matches, limit:', limit)
    const data = await gridFetch(query)
    const series = data.allSeries?.edges || []
    console.log('Received', series.length, 'series')

    return series.slice(0, limit).map((edge: any) => {
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
      .slice(0, 20)
    
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
  `

  try {
    console.log('Fetching tournaments, limit:', limit)
    const data = await gridFetch(query)
    const tournaments = data.tournaments?.edges || []
    console.log('Received', tournaments.length, 'tournaments')

    return tournaments.slice(0, limit).map((edge: any) => ({
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
    query GetRecentTournaments {
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
  `

  try {
    console.log('Fetching tournaments, limit:', limit)
    const data = await gridFetch(query)
    const tournaments = data.tournaments?.edges || []
    console.log('Received', tournaments.length, 'tournaments')

    return tournaments.slice(0, limit).map((edge: any) => ({
      id: edge.node.id.toString(),
      name: edge.node.name,
      nameShortened: edge.node.nameShortened,
    }))
  } catch (error) {
    console.error('Failed to fetch tournaments:', error)
    throw error
  }
}

export async function fetchSeriesWithDetails(limit: number = 50, titleId: number = 3): Promise<any[]> {
  const query = `
    query GetSeriesDetails {
      allSeries(
        filter: {
          titleId: ${titleId}
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
    const data = await gridFetch(query)
    const series = data.allSeries?.edges || []
    console.log(`Received ${series.length} series with details`)
    
    return series.slice(0, limit).map((edge: any) => ({
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
    query GetAllSeriesInNext24Hours {
      allSeries(
        filter:{
          startTimeScheduled:{
            gte: "${startTime}"
            lte: "${endTime}"
          }
        }
        orderBy: StartTimeScheduled
      ) {
        totalCount,
        pageInfo{
          hasPreviousPage
          hasNextPage
          startCursor
          endCursor
        }
        edges{
          cursor
          node{
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
  `

  try {
    console.log(`Fetching series in time range: ${startTime} to ${endTime}`)
    const data = await gridFetch(query)
    const series = data.allSeries?.edges || []
    console.log(`Received ${series.length} series in time range`)
    
    return series.slice(0, limit).map((edge: any) => ({
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
    console.log('Fetching organizations to find Cloud9...')
    const data = await gridFetch(query, { first: 20 })
    const organizations = data.organizations?.edges || []
    console.log(`Received ${organizations.length} organizations`)
    
    const cloud9Org = organizations.find((edge: any) => 
      edge.node.name.toLowerCase().includes('cloud9') || 
      edge.node.name.toLowerCase().includes('c9')
    )
    
    if (!cloud9Org) {
      console.warn('Cloud9 organization not found, returning first available organization')
      if (organizations.length > 0) {
        const firstOrg = organizations[0].node
        console.log(`Using organization: ${firstOrg.name} (ID: ${firstOrg.id})`)
        console.log(`Teams found: ${firstOrg.teams?.length || 0}`)
        return {
          id: firstOrg.id,
          name: firstOrg.name,
          teams: firstOrg.teams || [],
        }
      }
      return null
    }

    console.log(`Organization: ${cloud9Org.node.name} (ID: ${cloud9Org.node.id})`)
    console.log(`Teams found: ${cloud9Org.node.teams?.length || 0}`)
    
    return {
      id: cloud9Org.node.id,
      name: cloud9Org.node.name,
      teams: cloud9Org.node.teams || [],
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

export async function fetchTeams(limit: number = 50): Promise<Team[]> {
  const query = `
    query GetTeams($first: Int!, $after: String) {
      teams(first: $first, after: $after) {
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
            name
            colorPrimary
            colorSecondary
            logoUrl
            externalLinks {
              dataProvider {
                name
              }
              externalEntity {
                id
              }
            }
          }
        }
      }
    }
  `

  try {
    console.log(`Fetching ${limit} teams...`)
    const allTeams: Team[] = []
    let hasNextPage = true
    let after: string | null = null
    let fetchedCount = 0
    
    const titleIdToName = (titleName: string): GameTitle => {
      const lowerTitle = titleName.toLowerCase()
      if (lowerTitle.includes('league') || lowerTitle.includes('lol')) return 'LoL'
      if (lowerTitle.includes('valorant') || lowerTitle.includes('val')) return 'Valorant'
      if (lowerTitle.includes('counter') || lowerTitle.includes('cs')) return 'CS2'
      return 'LoL'
    }
    
    while (hasNextPage && fetchedCount < limit) {
      const batchSize = Math.min(50, limit - fetchedCount)
      const data = await gridFetch(query, { first: batchSize, after })
      const teams = data.teams?.edges || []
      
      if (teams.length === 0) break
      
      const mappedTeams = teams.map((edge: any) => {
        const externalLinks = edge.node.externalLinks || []
        const titleName = externalLinks.length > 0 
          ? externalLinks[0].dataProvider?.name || 'League of Legends'
          : 'League of Legends'
        
        const title = titleIdToName(titleName)
        const titleIdMap: Record<GameTitle, string> = {
          'LoL': '3',
          'Valorant': '6',
          'CS2': '25',
          'All': '3',
        }
        
        return {
          id: edge.node.id,
          name: edge.node.name,
          colorPrimary: edge.node.colorPrimary || '#000000',
          colorSecondary: edge.node.colorSecondary || '#ffffff',
          logoUrl: edge.node.logoUrl,
          title: title,
          titleId: titleIdMap[title],
          externalLinks: edge.node.externalLinks || [],
        }
      })
      
      allTeams.push(...mappedTeams)
      fetchedCount += teams.length
      
      hasNextPage = data.teams?.pageInfo?.hasNextPage || false
      after = data.teams?.pageInfo?.endCursor || null
      
      if (!hasNextPage) break
    }
    
    console.log(`Received ${allTeams.length} teams total`)
    
    const naTeams = ['Cloud9', 'Team Liquid', 'FlyQuest', '100 Thieves', 'TSM', 'Evil Geniuses', 
                     'Dignitas', 'Golden Guardians', 'Immortals', 'NRG', 'Sentinels', 'OpTic', 
                     'FaZe Clan', 'Complexity', 'LOUD', 'KRÜ', 'Leviatán', 'MIBR', 'FURIA']
    
    const priorityGames = ['VALORANT', 'League of Legends', 'Counter-Strike']
    
    const prioritizedTeams = allTeams.sort((a, b) => {
      const aIsNA = naTeams.some(na => a.name.toLowerCase().includes(na.toLowerCase()))
      const bIsNA = naTeams.some(na => b.name.toLowerCase().includes(na.toLowerCase()))
      
      const aHasPriorityGame = a.externalLinks?.some(link => 
        priorityGames.some(game => link.dataProvider.name.toLowerCase().includes(game.toLowerCase()))
      )
      const bHasPriorityGame = b.externalLinks?.some(link => 
        priorityGames.some(game => link.dataProvider.name.toLowerCase().includes(game.toLowerCase()))
      )
      
      if (aIsNA && !bIsNA) return -1
      if (!aIsNA && bIsNA) return 1
      
      if (aHasPriorityGame && !bHasPriorityGame) return -1
      if (!aHasPriorityGame && bHasPriorityGame) return 1
      
      return 0
    })
    
    return prioritizedTeams
  } catch (error) {
    console.error('Failed to fetch teams:', error)
    throw error
  }
}

export async function fetchTeamsByGame(gameTitle: 'lol' | 'valorant' | 'cs2', limit: number = 50): Promise<Team[]> {
  const titleIdMap = {
    'lol': 3,
    'valorant': 6,
    'cs2': 27,
  }
  
  const titleId = titleIdMap[gameTitle]
  
  const query = `
    query GetSeriesForGame {
      allSeries(
        first: 50
        filter: {
          titleId: ${titleId}
          types: ESPORTS
        }
        orderBy: StartTimeScheduled
        orderDirection: DESC
      ) {
        edges {
          node {
            teams {
              baseInfo {
                id
                name
              }
            }
          }
        }
      }
    }
  `
  
  try {
    console.log(`Fetching teams for ${gameTitle}...`)
    const data = await gridFetch(query)
    const series = data.allSeries?.edges || []
    
    const teamMap = new Map<string, { id: string; name: string }>()
    
    series.forEach((edge: any) => {
      edge.node.teams?.forEach((team: any) => {
        if (team.baseInfo?.id && team.baseInfo?.name) {
          teamMap.set(team.baseInfo.id, {
            id: team.baseInfo.id,
            name: team.baseInfo.name,
          })
        }
      })
    })
    
    const uniqueTeams = Array.from(teamMap.values())
    console.log(`Found ${uniqueTeams.length} unique teams for ${gameTitle}`)
    
    const detailedTeams = await Promise.all(
      uniqueTeams.slice(0, limit).map(async (team) => {
        try {
          const fullTeam = await fetchTeam(team.id)
          return fullTeam
        } catch (error) {
          console.error(`Failed to fetch details for team ${team.id}:`, error)
          return null
        }
      })
    )
    
    return detailedTeams.filter((team): team is Team => team !== null)
  } catch (error) {
    console.error(`Failed to fetch teams for ${gameTitle}:`, error)
    throw error
  }
}

export async function fetchTeam(teamId: string): Promise<Team | null> {
  const query = `
    query GetTeam($id: ID!) {
      team(id: $id) {
        id
        name
        colorPrimary
        colorSecondary
        logoUrl
        externalLinks {
          dataProvider {
            name
          }
          externalEntity {
            id
          }
        }
      }
    }
  `

  try {
    console.log(`Fetching team ${teamId}...`)
    const data = await gridFetch(query, { id: teamId })
    
    if (!data.team) {
      console.warn(`No team found for ID ${teamId}`)
      return null
    }

    return {
      id: data.team.id,
      name: data.team.name,
      colorPrimary: data.team.colorPrimary || '#000000',
      colorSecondary: data.team.colorSecondary || '#ffffff',
      logoUrl: data.team.logoUrl,
      externalLinks: data.team.externalLinks || [],
    }
  } catch (error) {
    console.error(`Failed to fetch team ${teamId}:`, error)
    return null
  }
}

export interface PlayerStatistics {
  id: string
  aggregationSeriesIds: string[]
  series: {
    count: number
    kills: {
      sum: number
      min: number
      max: number
      avg: number
    }
  }
  game: {
    count: number
    wins: Array<{
      value: boolean
      count: number
      percentage: number
      streak: {
        min: number
        max: number
        current: number
      }
    }>
  }
  segment: Array<{
    type: string
    count: number
    deaths: {
      sum: number
      min: number
      max: number
      avg: number
    }
  }>
}

export interface TeamStatistics {
  id: string
  aggregationSeriesIds: string[]
  series: {
    count: number
    kills: {
      sum: number
      min: number
      max: number
      avg: number
    }
  }
  game: {
    count: number
    wins: Array<{
      value: boolean
      count: number
      percentage: number
      streak: {
        min: number
        max: number
        current: number
      }
    }>
  }
  segment: Array<{
    type: string
    count: number
    deaths: {
      sum: number
      min: number
      max: number
      avg: number
    }
  }>
}

export async function fetchPlayerStatistics(
  playerId: string,
  seriesIds?: string[]
): Promise<PlayerStatistics | null> {
  const query = `
    query GetPlayerStats($playerId: ID!, $seriesIds: [ID!]) {
      playerStatistics(id: $playerId, aggregationSeriesIds: $seriesIds) {
        id
        aggregationSeriesIds
        series {
          count
          kills {
            sum
            min
            max
            avg
          }
        }
        game {
          count
          wins {
            value
            count
            percentage
            streak {
              min
              max
              current
            }
          }
        }
        segment {
          type
          count
          deaths {
            sum
            min
            max
            avg
          }
        }
      }
    }
  `

  try {
    console.log(`Fetching statistics for player ${playerId}${seriesIds ? ` with ${seriesIds.length} series` : ''}...`)
    const variables: any = { playerId }
    if (seriesIds && seriesIds.length > 0) {
      variables.seriesIds = seriesIds
    }
    
    const data = await gridFetch(query, variables, GRID_STATS_API_BASE)
    
    if (!data.playerStatistics) {
      console.warn(`No statistics found for player ${playerId}`)
      return null
    }

    console.log(`Statistics for player ${playerId}:`, data.playerStatistics)
    return data.playerStatistics
  } catch (error) {
    console.error(`Failed to fetch player statistics for ${playerId}:`, error)
    return null
  }
}

export async function fetchTeamStatistics(
  teamId: string,
  seriesIds?: string[]
): Promise<TeamStatistics | null> {
  const query = `
    query GetTeamStats($teamId: ID!, $seriesIds: [ID!]) {
      teamStatistics(id: $teamId, aggregationSeriesIds: $seriesIds) {
        id
        aggregationSeriesIds
        series {
          count
          kills {
            sum
            min
            max
            avg
          }
        }
        game {
          count
          wins {
            value
            count
            percentage
            streak {
              min
              max
              current
            }
          }
        }
        segment {
          type
          count
          deaths {
            sum
            min
            max
            avg
          }
        }
      }
    }
  `

  try {
    console.log(`Fetching statistics for team ${teamId}${seriesIds ? ` with ${seriesIds.length} series` : ''}...`)
    const variables: any = { teamId }
    if (seriesIds && seriesIds.length > 0) {
      variables.seriesIds = seriesIds
    }
    
    const data = await gridFetch(query, variables, GRID_STATS_API_BASE)
    
    if (!data.teamStatistics) {
      console.warn(`No statistics found for team ${teamId}`)
      return null
    }

    console.log(`Statistics for team ${teamId}:`, data.teamStatistics)
    return data.teamStatistics
  } catch (error) {
    console.error(`Failed to fetch team statistics for ${teamId}:`, error)
    return null
  }
}

export async function fetchPlayerDetails(playerId: string): Promise<any> {
  const query = `
    query GetPlayer($id: ID!) {
      player(id: $id) {
        id
        nickname
        title {
          id
          name
        }
        homeCountry {
          code
          name
        }
        activeSince
      }
    }
  `

  try {
    console.log(`Fetching detailed info for player ${playerId}...`)
    const data = await gridFetch(query, { id: playerId })
    
    if (!data.player) {
      console.warn(`No player found for ID ${playerId}`)
      return null
    }

    return data.player
  } catch (error) {
    console.error(`Failed to fetch player details for ${playerId}:`, error)
    return null
  }
}

export async function enrichPlayerWithBiography(player: Player): Promise<Player> {
  try {
    console.log(`Enriching biography for ${player.name}...`)
    
    if (!spark) {
      console.warn('Spark SDK not available, skipping biography enrichment')
      return player
    }
    
    const playerDetails = await fetchPlayerDetails(player.id)
    const stats = await fetchPlayerStats(player.id)
    
    const titleName = player.title || 'esports'
    const nationality = playerDetails?.homeCountry?.name || 'Unknown'
    const careerStart = playerDetails?.activeSince || 2020
    
    const prompt = spark.llmPrompt`You are a professional esports biographer. Generate a concise, engaging 2-3 sentence biography for an esports player named ${player.name}. 

Context:
- Player name: ${player.name}
- Game: ${titleName}
- Role/Position: ${player.role}
- Nationality: ${nationality}
- Career start: ${careerStart}
- Win rate: ${stats.winRate}%
- Games played: ${stats.gamesPlayed}
- KDA: ${stats.kda}

Write a professional, third-person biography that highlights their competitive journey, playing style, and accomplishments. Focus on their strengths and reputation in the scene. Keep it concise but memorable.`

    const bio = await spark.llm(prompt, 'gpt-4o-mini')
    
    const playstylePrompt = spark.llmPrompt`Based on this ${titleName} player named ${player.name} who plays ${player.role} with a ${stats.kda} KDA and ${stats.winRate}% win rate, describe their playstyle in one concise sentence (10-15 words max). Focus on how they approach the game tactically.`
    
    const playstyle = await spark.llm(playstylePrompt, 'gpt-4o-mini')
    
    const signaturePrompt = spark.llmPrompt`What would be a signature move or characteristic for a ${titleName} ${player.role} player named ${player.name}? Answer in 5-8 words describing a memorable aspect of their gameplay.`
    
    const signature = await spark.llm(signaturePrompt, 'gpt-4o-mini')
    
    const careerMilestones = await generateCareerMilestones(player, careerStart)
    
    const enrichedPlayer: Player = {
      ...player,
      ...stats,
      biography: {
        nationality,
        careerStart: parseInt(careerStart.toString()),
        bio: bio.trim(),
        playstyle: playstyle.trim(),
        signature: signature.trim(),
      },
      careerHistory: careerMilestones,
    }
    
    console.log(`Biography enrichment complete for ${player.name}`)
    return enrichedPlayer
  } catch (error) {
    console.error(`Failed to enrich biography for ${player.name}:`, error)
    return player
  }
}

async function generateCareerMilestones(player: Player, careerStart: number): Promise<CareerMilestone[]> {
  try {
    if (!spark) {
      console.warn('Spark SDK not available, skipping career milestones')
      return []
    }
    
    const prompt = spark.llmPrompt`Generate a realistic career timeline for esports player ${player.name} who plays ${player.title} as a ${player.role}. They started their professional career around ${careerStart}.

Create 3-5 career milestones in chronological order. Each milestone should be realistic and appropriate for a professional ${player.title} player. Return ONLY a JSON object with this exact structure:

{
  "milestones": [
    {
      "year": 2020,
      "event": "Event name",
      "achievement": "What they accomplished",
      "team": "Team name (optional)",
      "title": "LoL or Valorant or CS2"
    }
  ]
}

Make the milestones realistic and progressive (e.g., joining academy team → first tournament → major achievement).`

    const response = await spark.llm(prompt, 'gpt-4o-mini', true)
    const data = JSON.parse(response)
    
    if (data.milestones && Array.isArray(data.milestones)) {
      return data.milestones.map((m: any) => ({
        year: m.year,
        event: m.event,
        achievement: m.achievement,
        team: m.team,
        title: m.title as GameTitle,
      }))
    }
    
    return []
  } catch (error) {
    console.error(`Failed to generate career milestones for ${player.name}:`, error)
    return []
  }
}

export async function enrichAllPlayersWithBiographies(players: Player[]): Promise<Player[]> {
  console.log(`Enriching biographies for ${players.length} players...`)
  
  const enrichedPlayers: Player[] = []
  
  for (const player of players) {
    try {
      const enriched = await enrichPlayerWithBiography(player)
      enrichedPlayers.push(enriched)
      
      await new Promise(resolve => setTimeout(resolve, 500))
    } catch (error) {
      console.error(`Failed to enrich ${player.name}, using basic data:`, error)
      enrichedPlayers.push(player)
    }
  }
  
  console.log('All player biographies enriched')
  return enrichedPlayers
}
