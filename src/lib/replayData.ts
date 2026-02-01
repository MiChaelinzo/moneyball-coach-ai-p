import type { Match, Mistake, LiveMatchPlayer } from './types'

export interface ReplayEvent {
  id: string
  timestamp: number
  type: 'kill' | 'death' | 'assist' | 'objective' | 'mistake' | 'gold_milestone' | 'level_up' | 'item_purchase'
  playerId?: string
  playerName?: string
  description: string
  impact: 'critical' | 'high' | 'medium' | 'low'
  data?: any
}

export interface ReplaySnapshot {
  gameTime: number
  players: LiveMatchPlayer[]
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
  goldDiff: number
  events: ReplayEvent[]
}

export interface MatchReplay {
  matchId: string
  match: Match
  duration: number
  snapshots: ReplaySnapshot[]
  allEvents: ReplayEvent[]
  keyMoments: Array<{
    timestamp: number
    label: string
    type: 'positive' | 'negative' | 'neutral'
  }>
}

export function generateMatchReplay(match: Match, mistakes: Mistake[]): MatchReplay {
  const duration = match.duration
  const snapshotInterval = 60
  const numSnapshots = Math.ceil(duration / snapshotInterval)
  
  const snapshots: ReplaySnapshot[] = []
  const allEvents: ReplayEvent[] = []
  const keyMoments: Array<{ timestamp: number; label: string; type: 'positive' | 'negative' | 'neutral' }> = []

  const players: LiveMatchPlayer[] = [
    { id: '1', name: 'Fudge', role: 'Top', kills: 0, deaths: 0, assists: 0, cs: 0, gold: 500, champion: 'Aatrox' },
    { id: '2', name: 'Blaber', role: 'Jungle', kills: 0, deaths: 0, assists: 0, cs: 0, gold: 500, champion: 'Viego' },
    { id: '3', name: 'Jensen', role: 'Mid', kills: 0, deaths: 0, assists: 0, cs: 0, gold: 500, champion: 'Azir' },
    { id: '4', name: 'Berserker', role: 'ADC', kills: 0, deaths: 0, assists: 0, cs: 0, gold: 500, champion: 'Jinx' },
    { id: '5', name: 'Zven', role: 'Support', kills: 0, deaths: 0, assists: 0, cs: 0, gold: 500, champion: 'Thresh' },
  ]

  let teamGold = 2500
  let enemyGold = 2500
  let objectives = { dragons: 0, barons: 0, towers: 0 }
  let enemyObjectives = { dragons: 0, barons: 0, towers: 0 }

  const matchMistakes = mistakes.filter(m => m.matchId === match.id)

  for (let i = 0; i <= numSnapshots; i++) {
    const gameTime = i * snapshotInterval
    if (gameTime > duration) break

    const progress = gameTime / duration

    players.forEach((player, idx) => {
      const baseKills = Math.floor((match.result === 'win' ? 15 : 8) * progress)
      const baseDeaths = Math.floor((match.result === 'win' ? 5 : 12) * progress)
      const variance = Math.floor(Math.random() * 3)
      
      player.kills = Math.max(0, baseKills + variance - idx)
      player.deaths = Math.max(0, baseDeaths + variance - (4 - idx))
      player.assists = Math.max(0, player.kills * 2 + Math.floor(Math.random() * 5))
      player.cs = Math.floor(gameTime / 30 * (6 + idx * 0.5))
      player.gold = 500 + player.cs * 20 + player.kills * 300 + Math.floor(gameTime * 0.8)
    })

    teamGold = players.reduce((sum, p) => sum + p.gold, 0)
    enemyGold = match.result === 'win' 
      ? teamGold * (1 - progress * 0.2)
      : teamGold * (1 + progress * 0.15)

    const objectiveProgress = Math.floor(progress * match.objectives.dragons)
    if (objectiveProgress > objectives.dragons && objectiveProgress <= match.objectives.dragons) {
      objectives.dragons = objectiveProgress
      const event: ReplayEvent = {
        id: `event-dragon-${gameTime}`,
        timestamp: gameTime,
        type: 'objective',
        description: `Cloud9 secured Dragon #${objectiveProgress}`,
        impact: 'high',
        data: { objective: 'dragon' }
      }
      allEvents.push(event)
      keyMoments.push({
        timestamp: gameTime,
        label: `Dragon Secured`,
        type: 'positive'
      })
    }

    const baronProgress = gameTime > duration * 0.6 ? Math.floor((progress - 0.6) * 2.5 * match.objectives.barons) : 0
    if (baronProgress > objectives.barons && baronProgress <= match.objectives.barons) {
      objectives.barons = baronProgress
      const event: ReplayEvent = {
        id: `event-baron-${gameTime}`,
        timestamp: gameTime,
        type: 'objective',
        description: `Cloud9 secured Baron Nashor`,
        impact: 'critical',
        data: { objective: 'baron' }
      }
      allEvents.push(event)
      keyMoments.push({
        timestamp: gameTime,
        label: `Baron Secured`,
        type: 'positive'
      })
    }

    const towerProgress = Math.floor(progress * match.objectives.towers)
    if (towerProgress > objectives.towers) {
      objectives.towers = towerProgress
    }

    enemyObjectives = {
      dragons: match.result === 'win' ? Math.floor(progress * 1.5) : Math.floor(progress * 3),
      barons: match.result === 'win' ? 0 : Math.floor((progress - 0.7) * 2),
      towers: match.result === 'win' ? Math.floor(progress * 3) : Math.floor(progress * 7)
    }

    const mistakesAtTime = matchMistakes.filter(m => 
      Math.abs(m.gameTime - gameTime) < snapshotInterval
    )

    mistakesAtTime.forEach(mistake => {
      const event: ReplayEvent = {
        id: mistake.id,
        timestamp: mistake.gameTime,
        type: 'mistake',
        playerId: mistake.playerId,
        playerName: mistake.playerName,
        description: mistake.description,
        impact: mistake.impact,
        data: { category: mistake.category, outcome: mistake.outcome }
      }
      allEvents.push(event)
      
      if (mistake.impact === 'critical' || mistake.impact === 'high') {
        keyMoments.push({
          timestamp: mistake.gameTime,
          label: `Critical: ${mistake.playerName}`,
          type: 'negative'
        })
      }
    })

    if (gameTime > 0 && gameTime % 300 === 0) {
      players.forEach(player => {
        if (Math.random() > 0.7) {
          const event: ReplayEvent = {
            id: `event-kill-${player.id}-${gameTime}`,
            timestamp: gameTime,
            type: 'kill',
            playerId: player.id,
            playerName: player.name,
            description: `${player.name} secured a kill`,
            impact: 'medium'
          }
          allEvents.push(event)
        }
      })
    }

    snapshots.push({
      gameTime,
      players: JSON.parse(JSON.stringify(players)),
      teamGold,
      enemyGold,
      objectives: { ...objectives },
      enemyObjectives: { ...enemyObjectives },
      goldDiff: teamGold - enemyGold,
      events: allEvents.filter(e => e.timestamp <= gameTime && e.timestamp > gameTime - snapshotInterval)
    })
  }

  allEvents.sort((a, b) => a.timestamp - b.timestamp)
  keyMoments.sort((a, b) => a.timestamp - b.timestamp)

  return {
    matchId: match.id,
    match,
    duration,
    snapshots,
    allEvents,
    keyMoments
  }
}

export function formatGameTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

export function getSnapshotAtTime(replay: MatchReplay, time: number): ReplaySnapshot {
  const snapshot = replay.snapshots.find(s => s.gameTime >= time)
  return snapshot || replay.snapshots[replay.snapshots.length - 1]
}

export function getEventsInRange(replay: MatchReplay, startTime: number, endTime: number): ReplayEvent[] {
  return replay.allEvents.filter(e => e.timestamp >= startTime && e.timestamp <= endTime)
}
