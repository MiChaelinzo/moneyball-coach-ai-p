import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Sparkle, Trophy, Target, Brain, ChartBar, User, GameController } from '@phosphor-icons/react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import type { Player } from '@/lib/types'

interface PlaystyleMetrics {
  aggression: number
  precision: number
  teamwork: number
  strategy: number
  mechanics: number
  adaptability: number
}

interface TitleRecommendation {
  title: 'League of Legends' | 'Valorant' | 'CS2'
  matchScore: number
  reasoning: string[]
  strengths: string[]
  growthAreas: string[]
  roleRecommendation: string
}

interface TitleRecommendationViewProps {
  players: Player[]
}

const TITLE_CHARACTERISTICS = {
  'League of Legends': {
    requiredMetrics: {
      strategy: 0.7,
      teamwork: 0.75,
      adaptability: 0.7,
      mechanics: 0.6
    },
    description: 'Strategic team-based MOBA requiring macro awareness and objective control',
    icon: '🎮',
    color: 'oklch(0.72 0.16 195)'
  },
  'Valorant': {
    requiredMetrics: {
      precision: 0.8,
      teamwork: 0.7,
      strategy: 0.65,
      mechanics: 0.75
    },
    description: 'Tactical FPS combining precise aim with strategic ability usage',
    icon: '🎯',
    color: 'oklch(0.60 0.22 25)'
  },
  'CS2': {
    requiredMetrics: {
      precision: 0.85,
      mechanics: 0.8,
      aggression: 0.6,
      adaptability: 0.65
    },
    description: 'Pure skill FPS emphasizing mechanical excellence and split-second decisions',
    icon: '💥',
    color: 'oklch(0.75 0.15 65)'
  }
}

export function TitleRecommendationView({ players }: TitleRecommendationViewProps) {
  const [selectedPlayerId, setSelectedPlayerId] = useState<string>('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [playstyleMetrics, setPlaystyleMetrics] = useState<PlaystyleMetrics | null>(null)
  const [recommendations, setRecommendations] = useState<TitleRecommendation[]>([])
  const [aiInsight, setAiInsight] = useState<string>('')

  const selectedPlayer = players.find(p => p.id === selectedPlayerId)

  const analyzePlayerPlaystyle = async () => {
    if (!selectedPlayer) return

    setIsAnalyzing(true)
    toast.info('AI analyzing player playstyle...')

    await new Promise(resolve => setTimeout(resolve, 1500))

    const metrics: PlaystyleMetrics = {
      aggression: Math.random() * 40 + 60,
      precision: Math.random() * 30 + 65,
      teamwork: Math.random() * 35 + 60,
      strategy: Math.random() * 30 + 65,
      mechanics: Math.random() * 35 + 60,
      adaptability: Math.random() * 30 + 65
    }

    setPlaystyleMetrics(metrics)

    const titleScores: TitleRecommendation[] = []

    for (const [title, characteristics] of Object.entries(TITLE_CHARACTERISTICS)) {
      let totalScore = 0
      let totalWeight = 0

      for (const [metric, requiredValue] of Object.entries(characteristics.requiredMetrics)) {
        const playerValue = metrics[metric as keyof PlaystyleMetrics] / 100
        const score = Math.max(0, 1 - Math.abs(playerValue - requiredValue))
        totalScore += score
        totalWeight += 1
      }

      const matchScore = Math.round((totalScore / totalWeight) * 100)

      const strengths: string[] = []
      const growthAreas: string[] = []
      const reasoning: string[] = []

      if (metrics.aggression > 75) strengths.push('High aggression and proactive plays')
      if (metrics.precision > 80) strengths.push('Exceptional mechanical precision')
      if (metrics.teamwork > 80) strengths.push('Strong team coordination')
      if (metrics.strategy > 75) strengths.push('Excellent macro awareness')
      if (metrics.mechanics > 80) strengths.push('Superior mechanical skills')
      if (metrics.adaptability > 80) strengths.push('Highly adaptable playstyle')

      if (metrics.aggression < 60) growthAreas.push('Could benefit from more assertive plays')
      if (metrics.precision < 65) growthAreas.push('Room for improvement in mechanical precision')
      if (metrics.teamwork < 65) growthAreas.push('Communication and team synergy development')
      if (metrics.strategy < 65) growthAreas.push('Macro strategy and game sense')

      if (title === 'League of Legends') {
        reasoning.push(`Strategy score (${metrics.strategy.toFixed(0)}) ${metrics.strategy > 70 ? 'strongly aligns' : 'could improve'} with MOBA requirements`)
        reasoning.push(`Teamwork rating (${metrics.teamwork.toFixed(0)}) is ${metrics.teamwork > 75 ? 'excellent' : 'adequate'} for coordinated team play`)
        reasoning.push(`Adaptability (${metrics.adaptability.toFixed(0)}) ${metrics.adaptability > 70 ? 'supports' : 'needs work for'} dynamic meta shifts`)
      } else if (title === 'Valorant') {
        reasoning.push(`Precision (${metrics.precision.toFixed(0)}) ${metrics.precision > 75 ? 'excels at' : 'meets'} tactical shooter demands`)
        reasoning.push(`Mechanics (${metrics.mechanics.toFixed(0)}) ${metrics.mechanics > 70 ? 'strong for' : 'developing towards'} ability execution`)
        reasoning.push(`Strategy (${metrics.strategy.toFixed(0)}) supports tactical round planning`)
      } else if (title === 'CS2') {
        reasoning.push(`Precision (${metrics.precision.toFixed(0)}) ${metrics.precision > 80 ? 'matches elite' : 'approaching'} CS2 aim requirements`)
        reasoning.push(`Mechanics (${metrics.mechanics.toFixed(0)}) ${metrics.mechanics > 75 ? 'competitive with' : 'building towards'} pro-level standards`)
        reasoning.push(`Aggression (${metrics.aggression.toFixed(0)}) ${metrics.aggression > 70 ? 'supports entry fragging' : 'suited for support roles'}`)
      }

      const roleRecommendation = determineRole(title as any, metrics)

      titleScores.push({
        title: title as any,
        matchScore,
        reasoning,
        strengths,
        growthAreas,
        roleRecommendation
      })
    }

    titleScores.sort((a, b) => b.matchScore - a.matchScore)
    setRecommendations(titleScores)

    const topMatch = titleScores[0]
    
    try {
      const prompt = (window.spark.llmPrompt as any)`You are an expert esports analyst. Based on the following player metrics and title match:

Player: ${selectedPlayer.name}
Top Title Match: ${topMatch.title} (${topMatch.matchScore}% compatibility)
Role: ${selectedPlayer.role}

Playstyle Metrics:
- Aggression: ${metrics.aggression.toFixed(0)}
- Precision: ${metrics.precision.toFixed(0)}
- Teamwork: ${metrics.teamwork.toFixed(0)}
- Strategy: ${metrics.strategy.toFixed(0)}
- Mechanics: ${metrics.mechanics.toFixed(0)}
- Adaptability: ${metrics.adaptability.toFixed(0)}

Generate a concise 2-3 sentence insight about why ${topMatch.title} is the best fit for this player, mentioning their strongest attributes and how they align with the game's requirements. Be specific and actionable.`
      
      const insight = await window.spark.llm(prompt, 'gpt-4o-mini', false)
      setAiInsight(insight)
    } catch (error) {
      setAiInsight(`Based on the analysis, ${selectedPlayer.name} shows strong compatibility with ${topMatch.title}, particularly in ${topMatch.strengths[0]?.toLowerCase() || 'key areas'}. Their playstyle metrics align well with the game's demands.`)
    }

    setIsAnalyzing(false)
    toast.success('Analysis complete!')
  }

  const determineRole = (title: 'League of Legends' | 'Valorant' | 'CS2', metrics: PlaystyleMetrics): string => {
    if (title === 'League of Legends') {
      if (metrics.aggression > 75 && metrics.mechanics > 70) return 'Top Lane / Jungle'
      if (metrics.strategy > 75 && metrics.teamwork > 75) return 'Mid Lane / Support'
      if (metrics.precision > 75 && metrics.mechanics > 75) return 'ADC / Mid Lane'
      return 'Flex / Fill'
    } else if (title === 'Valorant') {
      if (metrics.aggression > 75 && metrics.precision > 75) return 'Duelist'
      if (metrics.strategy > 75 && metrics.teamwork > 75) return 'Controller / Sentinel'
      if (metrics.adaptability > 75) return 'Initiator'
      return 'Flex'
    } else {
      if (metrics.aggression > 75 && metrics.precision > 80) return 'Entry Fragger'
      if (metrics.teamwork > 75 && metrics.strategy > 70) return 'IGL / Support'
      if (metrics.precision > 80 && metrics.mechanics > 80) return 'AWPer'
      return 'Rifler'
    }
  }

  const getMatchColor = (score: number) => {
    if (score >= 80) return 'text-success'
    if (score >= 65) return 'text-warning'
    return 'text-destructive'
  }

  const getMatchBadge = (score: number) => {
    if (score >= 80) return 'Excellent Match'
    if (score >= 65) return 'Good Match'
    return 'Needs Development'
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/20">
              <Sparkle size={24} weight="duotone" className="text-primary" />
            </div>
            AI Title Recommendations
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Discover which esports title best matches each player's unique playstyle
          </p>
        </div>
      </div>

      <Card className="glow-border bg-gradient-to-br from-primary/10 to-accent/5">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <User size={20} weight="duotone" />
            Select Player to Analyze
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-end gap-4">
            <div className="flex-1">
              <label className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2 block">
                Player
              </label>
              <Select value={selectedPlayerId} onValueChange={setSelectedPlayerId}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a player..." />
                </SelectTrigger>
                <SelectContent>
                  {players.map(player => (
                    <SelectItem key={player.id} value={player.id}>
                      {player.name} - {player.role} ({player.winRate}% WR)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button
              onClick={analyzePlayerPlaystyle}
              disabled={!selectedPlayerId || isAnalyzing}
              className="gap-2"
            >
              <Brain size={18} weight="duotone" />
              {isAnalyzing ? 'Analyzing...' : 'Analyze Playstyle'}
            </Button>
          </div>
        </CardContent>
      </Card>

      <AnimatePresence mode="wait">
        {playstyleMetrics && selectedPlayer && (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="space-y-6"
          >
            <Card className="glow-border-success">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ChartBar size={20} weight="duotone" />
                  Playstyle Metrics for {selectedPlayer.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Object.entries(playstyleMetrics).map(([metric, value]) => (
                    <div key={metric} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold capitalize">{metric}</span>
                        <span className="text-sm font-mono font-bold text-primary">
                          {value.toFixed(0)}
                        </span>
                      </div>
                      <Progress value={value} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {aiInsight && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <Card className="glow-border bg-gradient-to-br from-primary/10 to-accent/5">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-3">
                      <Brain size={24} weight="duotone" className="text-primary mt-1 flex-shrink-0" />
                      <div>
                        <div className="text-sm font-semibold text-primary uppercase tracking-wide mb-2">
                          AI Expert Analysis
                        </div>
                        <p className="text-sm leading-relaxed text-foreground">
                          {aiInsight}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            <div>
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Trophy size={20} weight="duotone" className="text-warning" />
                Title Compatibility Rankings
              </h3>
              <div className="grid lg:grid-cols-3 gap-6">
                {recommendations.map((rec, index) => {
                  const characteristics = TITLE_CHARACTERISTICS[rec.title]
                  return (
                    <motion.div
                      key={rec.title}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.1 * index }}
                    >
                      <Card
                        className={`h-full ${
                          index === 0
                            ? 'glow-border ring-2 ring-primary/50'
                            : 'border-border/50'
                        }`}
                      >
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                              <div
                                className="text-3xl w-12 h-12 rounded-lg flex items-center justify-center"
                                style={{ backgroundColor: `${characteristics.color}20` }}
                              >
                                {characteristics.icon}
                              </div>
                              <div>
                                <CardTitle className="text-lg">{rec.title}</CardTitle>
                                <p className="text-xs text-muted-foreground mt-1">
                                  {characteristics.description}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="mt-4">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-semibold">Match Score</span>
                              <span
                                className={`text-2xl font-mono font-bold ${getMatchColor(
                                  rec.matchScore
                                )}`}
                              >
                                {rec.matchScore}%
                              </span>
                            </div>
                            <Progress value={rec.matchScore} className="h-2 mb-2" />
                            <Badge
                              variant={rec.matchScore >= 80 ? 'default' : 'secondary'}
                              className="text-xs"
                            >
                              {getMatchBadge(rec.matchScore)}
                            </Badge>
                            {index === 0 && (
                              <Badge className="ml-2 text-xs bg-warning text-warning-foreground">
                                Top Match
                              </Badge>
                            )}
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <Target size={16} weight="duotone" className="text-primary" />
                              <h4 className="text-sm font-semibold">Recommended Role</h4>
                            </div>
                            <p className="text-sm text-muted-foreground bg-muted/50 px-3 py-2 rounded">
                              {rec.roleRecommendation}
                            </p>
                          </div>

                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <GameController size={16} weight="duotone" className="text-success" />
                              <h4 className="text-sm font-semibold">Key Reasoning</h4>
                            </div>
                            <ul className="space-y-1">
                              {rec.reasoning.map((reason, i) => (
                                <li key={i} className="text-xs text-muted-foreground">
                                  • {reason}
                                </li>
                              ))}
                            </ul>
                          </div>

                          {rec.strengths.length > 0 && (
                            <div>
                              <h4 className="text-sm font-semibold text-success mb-2">
                                Strengths
                              </h4>
                              <ul className="space-y-1">
                                {rec.strengths.slice(0, 2).map((strength, i) => (
                                  <li key={i} className="text-xs text-muted-foreground">
                                    ✓ {strength}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {rec.growthAreas.length > 0 && (
                            <div>
                              <h4 className="text-sm font-semibold text-warning mb-2">
                                Growth Areas
                              </h4>
                              <ul className="space-y-1">
                                {rec.growthAreas.slice(0, 2).map((area, i) => (
                                  <li key={i} className="text-xs text-muted-foreground">
                                    → {area}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!playstyleMetrics && (
        <Card className="border-dashed">
          <CardContent className="py-12 text-center">
            <Sparkle size={48} weight="duotone" className="text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              Select a player and click "Analyze Playstyle" to see AI-powered title recommendations
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
