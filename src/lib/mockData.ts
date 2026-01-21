import type { Player, Mistake, Match, Insight, StrategicImpact, PlayerAnalytics } from './types'

export const PLAYERS: Player[] = [
  { id: '1', name: 'Fudge', role: 'Top', kda: 3.2, winRate: 58, gamesPlayed: 24 },
  { id: '2', name: 'Blaber', role: 'Jungle', kda: 4.1, winRate: 62, gamesPlayed: 24 },
  { id: '3', name: 'Jensen', role: 'Mid', kda: 5.3, winRate: 65, gamesPlayed: 24 },
  { id: '4', name: 'Berserker', role: 'ADC', kda: 6.8, winRate: 70, gamesPlayed: 24 },
  { id: '5', name: 'Zven', role: 'Support', kda: 3.9, winRate: 61, gamesPlayed: 24 },
]

export const MATCHES: Match[] = [
  {
    id: 'm1',
    date: '2024-01-15',
    opponent: 'Team Liquid',
    result: 'win',
    duration: 2145,
    objectives: { dragons: 3, barons: 1, towers: 9 }
  },
  {
    id: 'm2',
    date: '2024-01-14',
    opponent: 'FlyQuest',
    result: 'loss',
    duration: 2567,
    objectives: { dragons: 1, barons: 0, towers: 4 }
  },
  {
    id: 'm3',
    date: '2024-01-13',
    opponent: '100 Thieves',
    result: 'win',
    duration: 1987,
    objectives: { dragons: 4, barons: 2, towers: 11 }
  },
  {
    id: 'm4',
    date: '2024-01-12',
    opponent: 'TSM',
    result: 'win',
    duration: 2234,
    objectives: { dragons: 2, barons: 1, towers: 8 }
  },
  {
    id: 'm5',
    date: '2024-01-11',
    opponent: 'Evil Geniuses',
    result: 'loss',
    duration: 2789,
    objectives: { dragons: 2, barons: 0, towers: 5 }
  },
]

export const MISTAKES: Mistake[] = [
  {
    id: 'mk1',
    playerId: '2',
    playerName: 'Blaber',
    category: 'positioning',
    description: 'Over-aggressive invade without vision control leading to death',
    timestamp: '2024-01-14T15:30:00',
    impact: 'critical',
    matchId: 'm2',
    gameTime: 420,
    outcome: 'Lost baron control, enemy secured baron at 24:00'
  },
  {
    id: 'mk2',
    playerId: '1',
    playerName: 'Fudge',
    category: 'decision-making',
    description: 'Teleport timing error - TPd to losing fight instead of split pushing',
    timestamp: '2024-01-14T15:45:00',
    impact: 'high',
    matchId: 'm2',
    gameTime: 1320,
    outcome: 'Team wiped, lost 3 towers'
  },
  {
    id: 'mk3',
    playerId: '2',
    playerName: 'Blaber',
    category: 'positioning',
    description: 'Face-checked brush in enemy jungle without team backup',
    timestamp: '2024-01-15T14:20:00',
    impact: 'medium',
    matchId: 'm1',
    gameTime: 680,
    outcome: 'Death but team secured dragon after enemy recall'
  },
  {
    id: 'mk4',
    playerId: '4',
    playerName: 'Berserker',
    category: 'mechanics',
    description: 'Missed crucial skill shot in team fight, failed to secure kill',
    timestamp: '2024-01-13T16:10:00',
    impact: 'medium',
    matchId: 'm3',
    gameTime: 1560,
    outcome: 'Extended fight duration, support died'
  },
  {
    id: 'mk5',
    playerId: '3',
    playerName: 'Jensen',
    category: 'communication',
    description: 'Called for baron but team wasn\'t in position',
    timestamp: '2024-01-11T17:30:00',
    impact: 'critical',
    matchId: 'm5',
    gameTime: 1880,
    outcome: 'Split team, 3 deaths, lost baron and elder dragon'
  },
  {
    id: 'mk6',
    playerId: '2',
    playerName: 'Blaber',
    category: 'macro',
    description: 'Prioritized farming over objective control during dragon spawn',
    timestamp: '2024-01-11T17:15:00',
    impact: 'high',
    matchId: 'm5',
    gameTime: 1680,
    outcome: 'Enemy secured soul dragon'
  },
  {
    id: 'mk7',
    playerId: '5',
    playerName: 'Zven',
    category: 'positioning',
    description: 'Out of position during team rotation, caught and killed',
    timestamp: '2024-01-12T15:50:00',
    impact: 'medium',
    matchId: 'm4',
    gameTime: 890,
    outcome: '4v5 fight, lost but survived with inhibitor intact'
  },
  {
    id: 'mk8',
    playerId: '1',
    playerName: 'Fudge',
    category: 'decision-making',
    description: 'Engaged without checking ultimate cooldowns',
    timestamp: '2024-01-15T14:35:00',
    impact: 'low',
    matchId: 'm1',
    gameTime: 1020,
    outcome: 'Team disengaged safely, no casualties'
  },
]

export const INSIGHTS: Insight[] = [
  {
    id: 'in1',
    type: 'pattern',
    severity: 'critical',
    title: 'Recurring Jungle Over-Aggression Pattern',
    description: 'Blaber consistently invades enemy jungle without vision control or lane priority, resulting in deaths that directly cost objective control.',
    affectedPlayers: ['2'],
    frequency: 0.67,
    impactOnWinRate: -15,
    relatedMistakes: ['mk1', 'mk3', 'mk6'],
    recommendation: 'Implement pre-invade vision protocol: require 2+ enemy positions confirmed before deep invade. Practice risk assessment drills.',
    confidence: 0.89
  },
  {
    id: 'in2',
    type: 'correlation',
    severity: 'critical',
    title: 'Communication Breakdown → Objective Loss Chain',
    description: 'Misaligned objective calls correlate with 85% of baron/elder losses. Jensen and Blaber show pattern of initiating plays without confirming team readiness.',
    affectedPlayers: ['2', '3'],
    frequency: 0.45,
    impactOnWinRate: -22,
    relatedMistakes: ['mk5', 'mk6'],
    recommendation: 'Institute verbal confirmation protocol for high-stakes objective plays. Require all 5 players to confirm readiness before baron/elder attempts.',
    confidence: 0.92
  },
  {
    id: 'in3',
    type: 'trend',
    severity: 'high',
    title: 'Top Lane TP Usage Declining in Effectiveness',
    description: 'Fudge\'s teleport usage effectiveness has dropped 30% over last 8 games. Pattern shows reactive TP to losing fights rather than proactive map pressure.',
    affectedPlayers: ['1'],
    frequency: 0.56,
    impactOnWinRate: -8,
    relatedMistakes: ['mk2', 'mk8'],
    recommendation: 'Review split-push timing with Fudge. Establish clear decision tree: TP only if fight is even/winning OR to create cross-map pressure, never to lost causes.',
    confidence: 0.81
  },
  {
    id: 'in4',
    type: 'recommendation',
    severity: 'medium',
    title: 'Pre-Fight Coordination Opportunity',
    description: 'Team shows 40% higher win rate when ultimate cooldowns are verbally confirmed before engages. Currently only happening in 35% of teamfights.',
    affectedPlayers: ['1', '2', '3', '4', '5'],
    frequency: 0.35,
    impactOnWinRate: 12,
    relatedMistakes: ['mk8'],
    recommendation: 'Make ultimate cooldown callouts mandatory before any planned engage. Designate support (Zven) as cooldown coordinator.',
    confidence: 0.76
  },
  {
    id: 'in5',
    type: 'pattern',
    severity: 'medium',
    title: 'Mid-Game Positioning Lapses During Rotations',
    description: 'Support player consistently trails team during rotations, creating 4v5 vulnerabilities. Occurs primarily during 15-25 minute window.',
    affectedPlayers: ['5'],
    frequency: 0.42,
    impactOnWinRate: -6,
    relatedMistakes: ['mk7'],
    recommendation: 'Zven should prioritize movement speed items earlier. Practice rotation drills focusing on positioning within team formation.',
    confidence: 0.73
  }
]

export const STRATEGIC_IMPACTS: StrategicImpact[] = [
  {
    mistakeCategory: 'positioning',
    occurrences: 4,
    avgTimeToObjectiveLoss: 240,
    winRateImpact: -12,
    objectivesLost: 3
  },
  {
    mistakeCategory: 'decision-making',
    occurrences: 2,
    avgTimeToObjectiveLoss: 180,
    winRateImpact: -8,
    objectivesLost: 2
  },
  {
    mistakeCategory: 'communication',
    occurrences: 1,
    avgTimeToObjectiveLoss: 120,
    winRateImpact: -22,
    objectivesLost: 2
  },
  {
    mistakeCategory: 'macro',
    occurrences: 1,
    avgTimeToObjectiveLoss: 300,
    winRateImpact: -15,
    objectivesLost: 1
  },
  {
    mistakeCategory: 'mechanics',
    occurrences: 1,
    avgTimeToObjectiveLoss: 480,
    winRateImpact: -3,
    objectivesLost: 0
  }
]

export function getPlayerAnalytics(playerId: string): PlayerAnalytics {
  const player = PLAYERS.find(p => p.id === playerId)!
  const playerMistakes = MISTAKES.filter(m => m.playerId === playerId)
  
  const mistakesByCategory = playerMistakes.reduce((acc, mistake) => {
    acc[mistake.category] = (acc[mistake.category] || 0) + 1
    return acc
  }, {} as Record<string, number>)
  
  const getTrend = (count: number): 'improving' | 'stable' | 'declining' => {
    if (count > 2) return 'declining'
    if (count > 1) return 'stable'
    return 'improving'
  }
  
  return {
    playerId: player.id,
    playerName: player.name,
    topMistakes: Object.entries(mistakesByCategory)
      .map(([category, count]) => ({
        category,
        count,
        trend: getTrend(count)
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 3),
    performanceTrend: [
      { date: '2024-01-11', kda: player.kda - 0.8, mistakes: 3 },
      { date: '2024-01-12', kda: player.kda - 0.4, mistakes: 1 },
      { date: '2024-01-13', kda: player.kda + 0.2, mistakes: 1 },
      { date: '2024-01-14', kda: player.kda - 0.6, mistakes: 2 },
      { date: '2024-01-15', kda: player.kda + 0.4, mistakes: 2 },
    ],
    comparedToAverage: {
      kda: player.kda - 4.2,
      mistakeFrequency: (playerMistakes.length / player.gamesPlayed) - 1.5,
      objectiveContribution: player.role === 'Jungle' ? 0.15 : player.role === 'Support' ? 0.08 : -0.05
    }
  }
}

export async function generateAIInsight(matchData: Match, mistakes: Mistake[]): Promise<string> {
  try {
    const mistakesList = mistakes.map(m => 
      `- ${m.playerName} (${m.category}): ${m.description} - Impact: ${m.impact}, Outcome: ${m.outcome}`
    ).join('\n')
    
    const prompt = `You are an esports analytics AI assistant analyzing League of Legends match data.

Match Result: ${matchData.result}
Opponent: ${matchData.opponent}
Duration: ${Math.floor(matchData.duration / 60)} minutes
Objectives: ${matchData.objectives.dragons} dragons, ${matchData.objectives.barons} barons, ${matchData.objectives.towers} towers

Key Mistakes:
${mistakesList}

Provide a concise 2-3 sentence strategic insight connecting these individual mistakes to the match outcome and macro strategy. Focus on actionable coaching points.`

    const insight = await window.spark.llm(prompt, 'gpt-4o-mini')
    return insight
  } catch (error) {
    return 'Analysis in progress. Pattern recognition systems are processing match data to identify strategic correlations.'
  }
}
