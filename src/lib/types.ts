export interface Player {
  id: string
  name: string
  role: string
  kda: number
  winRate: number
  gamesPlayed: number
}

export interface Mistake {
  id: string
  playerId: string
  playerName: string
  category: 'positioning' | 'mechanics' | 'decision-making' | 'communication' | 'macro'
  description: string
  timestamp: string
  impact: 'critical' | 'high' | 'medium' | 'low'
  matchId: string
  gameTime: number
  outcome: string
  mapPosition?: {
    x: number
    y: number
    zone: 'top' | 'jungle-top' | 'mid' | 'jungle-bot' | 'bot' | 'river' | 'baron' | 'dragon' | 'base'
  }
}

export interface Match {
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

export interface Insight {
  id: string
  type: 'pattern' | 'trend' | 'correlation' | 'recommendation'
  severity: 'critical' | 'high' | 'medium' | 'low'
  title: string
  description: string
  affectedPlayers: string[]
  frequency: number
  impactOnWinRate: number
  relatedMistakes: string[]
  recommendation: string
  confidence: number
}

export interface StrategicImpact {
  mistakeCategory: string
  occurrences: number
  avgTimeToObjectiveLoss: number
  winRateImpact: number
  objectivesLost: number
}

export interface PlayerAnalytics {
  playerId: string
  playerName: string
  topMistakes: Array<{
    category: string
    count: number
    trend: 'improving' | 'stable' | 'declining'
  }>
  performanceTrend: Array<{
    date: string
    kda: number
    mistakes: number
  }>
  comparedToAverage: {
    kda: number
    mistakeFrequency: number
    objectiveContribution: number
  }
}

export interface LiveMatchPlayer {
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

export interface LiveMatch {
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
