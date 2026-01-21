import type { Player, Match, LiveMatch, LiveMatchPlayer } from './types'

const GRID_API_BASE = 'https://api-op.grid.gg/central-data/graphql'

interface GridApiConfig {
  apiKey: string
}

let gridConfig: GridApiConfig | null = null

export function initializeGridApi(apiKey: string) {
  gridConfig = { apiKey }
}

export function isGridApiInitialized(): boolean {
  return gridConfig !== null && gridConfig.apiKey.length > 0
}

async function gridFetch(query: string, variables: Record<string, any> = {}) {
  if (!gridConfig) {
    throw new Error('GRID API not initialized. Please call initializeGridApi() with your API key.')
  }

  const response = await fetch(GRID_API_BASE, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': gridConfig.apiKey,
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  })

  if (!response.ok) {
    throw new Error(`GRID API error: ${response.statusText}`)
  }

  const data = await response.json()
  
  if (data.errors) {
    console.error('GRID API GraphQL errors:', data.errors)
    throw new Error(`GRID API GraphQL error: ${data.errors[0]?.message || 'Unknown error'}`)
  }

  return data.data
}

export async function fetchCloud9Players(): Promise<Player[]> {
  const query = `
    query GetCloud9Team {
      allTeam(
        filter: {
          name: { equalTo: "Cloud9" }
        }
      ) {
        nodes {
          id
          name
          playersInTeams(filter: { active: { equalTo: true } }) {
            nodes {
              player {
                id
                nickname
                firstName
                lastName
              }
              position
            }
          }
        }
      }
    }
  `

  try {
    const data = await gridFetch(query)
    const cloud9Team = data.allTeam?.nodes?.[0]
    
    if (!cloud9Team?.playersInTeams?.nodes) {
      console.warn('No Cloud9 players found in GRID API')
      return []
    }

    const positionMap: Record<string, string> = {
      'TOP': 'Top',
      'JUNGLE': 'Jungle',
      'MID': 'Mid',
      'ADC': 'ADC',
      'SUPPORT': 'Support',
    }

    return cloud9Team.playersInTeams.nodes.map((pit: any, index: number) => ({
      id: pit.player.id.toString(),
      name: pit.player.nickname || pit.player.firstName || 'Unknown',
      role: positionMap[pit.position] || pit.position,
      kda: 0,
      winRate: 0,
      gamesPlayed: 0,
    }))
  } catch (error) {
    console.error('Failed to fetch Cloud9 players:', error)
    throw error
  }
}

export async function fetchPlayerStats(playerId: string, limit: number = 20): Promise<{ kda: number; winRate: number; gamesPlayed: number }> {
  const query = `
    query GetPlayerStats($playerId: BigInt!, $limit: Int!) {
      allPlayerGameParticipant(
        filter: { playerId: { equalTo: $playerId } }
        first: $limit
        orderBy: GAME_ID_DESC
      ) {
        nodes {
          kills
          deaths
          assists
          game {
            state
            teams {
              nodes {
                name
                won
                players {
                  nodes {
                    playerId
                  }
                }
              }
            }
          }
        }
        totalCount
      }
    }
  `

  try {
    const data = await gridFetch(query, { playerId: parseInt(playerId), limit })
    const games = data.allPlayerGameParticipant?.nodes || []
    
    if (games.length === 0) {
      return { kda: 0, winRate: 0, gamesPlayed: 0 }
    }

    let totalKills = 0
    let totalDeaths = 0
    let totalAssists = 0
    let wins = 0
    let gamesPlayed = 0

    games.forEach((game: any) => {
      if (game.game?.state !== 'FINISHED') return
      
      gamesPlayed++
      totalKills += game.kills || 0
      totalDeaths += game.deaths || 0
      totalAssists += game.assists || 0

      const playerTeam = game.game.teams?.nodes?.find((team: any) =>
        team.players?.nodes?.some((p: any) => p.playerId.toString() === playerId)
      )
      
      if (playerTeam?.won) {
        wins++
      }
    })

    const kda = totalDeaths > 0 
      ? parseFloat(((totalKills + totalAssists) / totalDeaths).toFixed(2))
      : parseFloat((totalKills + totalAssists).toFixed(2))
    
    const winRate = gamesPlayed > 0 ? Math.round((wins / gamesPlayed) * 100) : 0

    return { kda, winRate, gamesPlayed }
  } catch (error) {
    console.error(`Failed to fetch stats for player ${playerId}:`, error)
    return { kda: 0, winRate: 0, gamesPlayed: 0 }
  }
}

export async function fetchCloud9Matches(limit: number = 10): Promise<Match[]> {
  const query = `
    query GetCloud9Matches($limit: Int!) {
      allGame(
        filter: {
          state: { equalTo: "FINISHED" }
          teams: {
            some: {
              name: { equalTo: "Cloud9" }
            }
          }
        }
        first: $limit
        orderBy: START_TIME_DESC
      ) {
        nodes {
          id
          startTime
          endTime
          state
          teams {
            nodes {
              id
              name
              won
              towers
              dragons
              barons
            }
          }
        }
      }
    }
  `

  try {
    const data = await gridFetch(query, { limit })
    const games = data.allGame?.nodes || []

    return games.map((game: any) => {
      const cloud9Team = game.teams?.nodes?.find((t: any) => t.name === 'Cloud9')
      const opponentTeam = game.teams?.nodes?.find((t: any) => t.name !== 'Cloud9')
      
      const startTime = new Date(game.startTime)
      const endTime = new Date(game.endTime)
      const duration = Math.floor((endTime.getTime() - startTime.getTime()) / 1000)

      return {
        id: game.id.toString(),
        date: startTime.toISOString().split('T')[0],
        opponent: opponentTeam?.name || 'Unknown',
        result: cloud9Team?.won ? 'win' : 'loss',
        duration,
        objectives: {
          dragons: cloud9Team?.dragons || 0,
          barons: cloud9Team?.barons || 0,
          towers: cloud9Team?.towers || 0,
        },
      } as Match
    })
  } catch (error) {
    console.error('Failed to fetch Cloud9 matches:', error)
    throw error
  }
}

export async function fetchLiveMatchData(gameId: string): Promise<Partial<LiveMatch> | null> {
  const query = `
    query GetLiveGame($gameId: BigInt!) {
      game(id: $gameId) {
        id
        startTime
        state
        platform
        teams {
          nodes {
            id
            name
            won
            towers
            dragons
            barons
            goldEarned
            players {
              nodes {
                playerId
                player {
                  nickname
                }
                position
                championName
                kills
                deaths
                assists
                creepScore
                goldEarned
              }
            }
          }
        }
      }
    }
  `

  try {
    const data = await gridFetch(query, { gameId: parseInt(gameId) })
    const game = data.game
    
    if (!game) {
      return null
    }

    const cloud9Team = game.teams?.nodes?.find((t: any) => t.name === 'Cloud9')
    const opponentTeam = game.teams?.nodes?.find((t: any) => t.name !== 'Cloud9')

    if (!cloud9Team) {
      return null
    }

    const startTime = new Date(game.startTime)
    const now = new Date()
    const gameTime = Math.floor((now.getTime() - startTime.getTime()) / 1000)

    const positionMap: Record<string, string> = {
      'TOP': 'Top',
      'JUNGLE': 'Jungle',
      'MID': 'Mid',
      'ADC': 'ADC',
      'SUPPORT': 'Support',
    }

    const players: LiveMatchPlayer[] = cloud9Team.players?.nodes?.map((p: any) => ({
      id: p.playerId.toString(),
      name: p.player?.nickname || 'Unknown',
      role: positionMap[p.position] || p.position,
      kills: p.kills || 0,
      deaths: p.deaths || 0,
      assists: p.assists || 0,
      cs: p.creepScore || 0,
      gold: p.goldEarned || 0,
      champion: p.championName || 'Unknown',
    })) || []

    return {
      id: game.id.toString(),
      isActive: game.state === 'INPROGRESS',
      opponent: opponentTeam?.name || 'Unknown',
      gameTime,
      teamGold: cloud9Team.goldEarned || 0,
      enemyGold: opponentTeam?.goldEarned || 0,
      objectives: {
        dragons: cloud9Team.dragons || 0,
        barons: cloud9Team.barons || 0,
        towers: cloud9Team.towers || 0,
      },
      enemyObjectives: {
        dragons: opponentTeam?.dragons || 0,
        barons: opponentTeam?.barons || 0,
        towers: opponentTeam?.towers || 0,
      },
      players,
    }
  } catch (error) {
    console.error('Failed to fetch live match data:', error)
    return null
  }
}

export async function fetchRecentCloud9Games(limit: number = 5): Promise<string[]> {
  const query = `
    query GetRecentCloud9Games($limit: Int!) {
      allGame(
        filter: {
          state: { in: ["INPROGRESS", "FINISHED"] }
          teams: {
            some: {
              name: { equalTo: "Cloud9" }
            }
          }
        }
        first: $limit
        orderBy: START_TIME_DESC
      ) {
        nodes {
          id
        }
      }
    }
  `

  try {
    const data = await gridFetch(query, { limit })
    return data.allGame?.nodes?.map((g: any) => g.id.toString()) || []
  } catch (error) {
    console.error('Failed to fetch recent Cloud9 games:', error)
    return []
  }
}

export async function enrichPlayersWithStats(players: Player[]): Promise<Player[]> {
  const enrichedPlayers = await Promise.all(
    players.map(async (player) => {
      try {
        const stats = await fetchPlayerStats(player.id)
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

  return enrichedPlayers
}
