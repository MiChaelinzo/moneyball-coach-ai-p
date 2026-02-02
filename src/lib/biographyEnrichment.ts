import type { Player, PlayerBiography, CareerMilestone } from './types'

export interface EnrichedPlayerData {
  playerId: string
  biography: PlayerBiography
  careerHistory: CareerMilestone[]
  enrichedAt: string
}

const ENRICHED_PLAYERS_KEY = 'enriched-player-biographies'

export async function saveEnrichedPlayers(players: Player[]): Promise<void> {
  const enrichedData: EnrichedPlayerData[] = players
    .filter(p => p.biography || (p.careerHistory && p.careerHistory.length > 0))
    .map(p => ({
      playerId: p.id,
      biography: p.biography!,
      careerHistory: p.careerHistory || [],
      enrichedAt: new Date().toISOString()
    }))
  
  await (window as any).spark.kv.set(ENRICHED_PLAYERS_KEY, enrichedData)
}

export async function loadEnrichedPlayers(): Promise<EnrichedPlayerData[]> {
  const data: EnrichedPlayerData[] | undefined = await (window as any).spark.kv.get(ENRICHED_PLAYERS_KEY)
  return data || []
}

export async function mergeEnrichedData(basePlayers: Player[]): Promise<Player[]> {
  const enrichedData = await loadEnrichedPlayers()
  
  if (enrichedData.length === 0) {
    return basePlayers
  }
  
  const enrichedMap = new Map(enrichedData.map(d => [d.playerId, d]))
  
  return basePlayers.map(player => {
    const enriched = enrichedMap.get(player.id)
    if (enriched) {
      return {
        ...player,
        biography: enriched.biography,
        careerHistory: enriched.careerHistory
      }
    }
    return player
  })
}

export async function clearEnrichedPlayers(): Promise<void> {
  await (window as any).spark.kv.delete(ENRICHED_PLAYERS_KEY)
}
