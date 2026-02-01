import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Sparkle, User, CheckCircle, WarningCircle, Clock, Trash } from '@phosphor-icons/react'
import type { Player, PlayerBiography, CareerMilestone } from '@/lib/types'
import { saveEnrichedPlayers, clearEnrichedPlayers } from '@/lib/biographyEnrichment'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'

interface BatchBiographyEnricherProps {
  players: Player[]
  onEnrichmentComplete: (enrichedPlayers: Player[]) => void
}

interface EnrichmentProgress {
  playerId: string
  playerName: string
  status: 'pending' | 'processing' | 'completed' | 'error'
  error?: string
}

export function BatchBiographyEnricher({ players, onEnrichmentComplete }: BatchBiographyEnricherProps) {
  const [isEnriching, setIsEnriching] = useState(false)
  const [progress, setProgress] = useState<EnrichmentProgress[]>([])
  const [currentProgress, setCurrentProgress] = useState(0)

  const playersWithoutBio = players.filter(p => !p.biography || !p.careerHistory || p.careerHistory.length === 0)
  const playersWithBio = players.filter(p => p.biography || (p.careerHistory && p.careerHistory.length > 0))

  const handleClearBiographies = async () => {
    await clearEnrichedPlayers()
    const clearedPlayers = players.map(p => ({
      ...p,
      biography: undefined,
      careerHistory: []
    }))
    onEnrichmentComplete(clearedPlayers)
    setProgress([])
    toast.success('All biographies cleared!')
  }

  const enrichPlayerBiography = async (player: Player): Promise<{ biography: PlayerBiography; careerHistory: CareerMilestone[] }> => {
    const prompt = window.spark.llmPrompt`You are a professional esports researcher. Generate a realistic and detailed biography for an esports player with the following information:

Player Name: ${player.name}
Role: ${player.role}
Game: ${player.title || 'Esports'}
Current Win Rate: ${player.winRate}%
Games Played: ${player.gamesPlayed}

Generate a biography that includes:
1. A realistic full name (first and last)
2. A plausible nationality (consider common esports regions: USA, South Korea, China, Denmark, Brazil, etc.)
3. A birth date that would make them between 18-28 years old
4. A hometown from their nationality
5. A compelling 2-3 sentence bio describing their journey, playstyle, and what makes them unique
6. A playstyle description (aggressive, calculated, supportive, carry-focused, etc.)
7. Their signature move, champion, or strategic specialty
8. Career start year (typically 2-8 years ago for active pros)

Also generate 3-5 career milestones/achievements that feel authentic for this player's skill level and experience.

Return ONLY valid JSON in this exact format:
{
  "biography": {
    "realName": "First Last",
    "nationality": "Country Name",
    "birthDate": "YYYY-MM-DD",
    "hometown": "City, Country",
    "bio": "Biography text here",
    "playstyle": "Playstyle description",
    "signature": "Signature move/champion",
    "careerStart": 2018
  },
  "careerHistory": [
    {
      "year": 2023,
      "event": "Tournament Name",
      "achievement": "Achievement description",
      "team": "Team Name",
      "title": "${player.title || 'All'}"
    }
  ]
}`

    try {
      const response = await window.spark.llm(prompt, 'gpt-4o', true)
      const data = JSON.parse(response)
      return data
    } catch (error) {
      console.error('Failed to enrich biography:', error)
      throw new Error('Failed to generate biography')
    }
  }

  const startBatchEnrichment = async () => {
    if (playersWithoutBio.length === 0) {
      toast.info('All players already have biographies!')
      return
    }

    setIsEnriching(true)
    setCurrentProgress(0)
    
    const initialProgress: EnrichmentProgress[] = playersWithoutBio.map(p => ({
      playerId: p.id,
      playerName: p.name,
      status: 'pending'
    }))
    setProgress(initialProgress)

    const enrichedPlayers: Player[] = []
    let completedCount = 0

    toast.info(`Starting biography enrichment for ${playersWithoutBio.length} players...`)

    for (let i = 0; i < playersWithoutBio.length; i++) {
      const player = playersWithoutBio[i]
      
      setProgress(prev => prev.map(p => 
        p.playerId === player.id 
          ? { ...p, status: 'processing' }
          : p
      ))

      try {
        const enrichedData = await enrichPlayerBiography(player)
        
        const enrichedPlayer: Player = {
          ...player,
          biography: enrichedData.biography,
          careerHistory: enrichedData.careerHistory
        }
        
        enrichedPlayers.push(enrichedPlayer)
        completedCount++
        
        setProgress(prev => prev.map(p => 
          p.playerId === player.id 
            ? { ...p, status: 'completed' }
            : p
        ))
        
        setCurrentProgress(Math.round((completedCount / playersWithoutBio.length) * 100))
        
        await new Promise(resolve => setTimeout(resolve, 500))
        
      } catch (error) {
        setProgress(prev => prev.map(p => 
          p.playerId === player.id 
            ? { ...p, status: 'error', error: 'Failed to generate biography' }
            : p
        ))
      }
    }

    const allEnrichedPlayers = players.map(p => {
      const enriched = enrichedPlayers.find(ep => ep.id === p.id)
      return enriched || p
    })

    await saveEnrichedPlayers(allEnrichedPlayers)

    onEnrichmentComplete(allEnrichedPlayers)
    setIsEnriching(false)
    
    const successCount = progress.filter(p => p.status === 'completed').length
    const errorCount = progress.filter(p => p.status === 'error').length
    
    toast.success(`Biography enrichment complete! ${successCount} succeeded, ${errorCount} failed.`)
  }

  const getStatusIcon = (status: EnrichmentProgress['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle size={20} weight="fill" className="text-success" />
      case 'error':
        return <WarningCircle size={20} weight="fill" className="text-destructive" />
      case 'processing':
        return <Clock size={20} weight="duotone" className="text-primary animate-pulse" />
      default:
        return <User size={20} weight="duotone" className="text-muted-foreground" />
    }
  }

  return (
    <Card className="glow-border bg-gradient-to-br from-primary/10 to-accent/5">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/20">
              <Sparkle size={24} weight="duotone" className="text-primary" />
            </div>
            <div>
              <CardTitle>Batch Biography Enrichment</CardTitle>
              <CardDescription>
                AI-powered biography generation for all players
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {playersWithBio.length > 0 && (
              <Badge variant="secondary" className="text-sm px-3 py-1.5">
                <CheckCircle size={16} weight="fill" className="text-success mr-1.5" />
                {playersWithBio.length} enriched
              </Badge>
            )}
            <Badge variant="outline" className="text-lg px-4 py-2">
              {playersWithoutBio.length} / {players.length}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            {playersWithoutBio.length > 0 ? (
              <>
                {playersWithoutBio.length} player{playersWithoutBio.length > 1 ? 's' : ''} without complete biographies
              </>
            ) : (
              'All players have biographies!'
            )}
          </div>
          <div className="flex items-center gap-2">
            {playersWithBio.length > 0 && (
              <Button
                onClick={handleClearBiographies}
                disabled={isEnriching}
                variant="outline"
                size="sm"
                className="gap-2"
              >
                <Trash size={16} weight="duotone" />
                Clear All
              </Button>
            )}
            <Button
              onClick={startBatchEnrichment}
              disabled={isEnriching || playersWithoutBio.length === 0}
              className="gap-2"
            >
              <Sparkle size={18} weight="duotone" />
              {isEnriching ? 'Enriching...' : 'Enrich All'}
            </Button>
          </div>
        </div>

        {isEnriching && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="space-y-4"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground font-semibold">Overall Progress</span>
                <span className="font-mono text-primary font-bold">{currentProgress}%</span>
              </div>
              <Progress value={currentProgress} className="h-2" />
            </div>

            <div className="max-h-96 overflow-y-auto space-y-2 pr-2">
              <AnimatePresence>
                {progress.map((item) => (
                  <motion.div
                    key={item.playerId}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className={`
                      p-3 rounded-lg border flex items-center justify-between
                      ${item.status === 'completed' ? 'bg-success/10 border-success/30' : ''}
                      ${item.status === 'error' ? 'bg-destructive/10 border-destructive/30' : ''}
                      ${item.status === 'processing' ? 'bg-primary/10 border-primary/30' : ''}
                      ${item.status === 'pending' ? 'bg-muted/50 border-border' : ''}
                    `}
                  >
                    <div className="flex items-center gap-3">
                      {getStatusIcon(item.status)}
                      <div>
                        <div className="font-semibold text-sm">{item.playerName}</div>
                        {item.error && (
                          <div className="text-xs text-destructive">{item.error}</div>
                        )}
                        {item.status === 'processing' && (
                          <div className="text-xs text-primary">Generating biography...</div>
                        )}
                      </div>
                    </div>
                    <Badge 
                      variant={
                        item.status === 'completed' ? 'default' : 
                        item.status === 'error' ? 'destructive' : 
                        'outline'
                      }
                      className="text-xs"
                    >
                      {item.status}
                    </Badge>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        )}

        {!isEnriching && progress.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-4 bg-success/10 border border-success/30 rounded-lg"
          >
            <div className="flex items-center gap-3">
              <CheckCircle size={24} weight="fill" className="text-success" />
              <div>
                <div className="font-semibold text-success">Enrichment Complete</div>
                <div className="text-sm text-muted-foreground">
                  {progress.filter(p => p.status === 'completed').length} biographies generated successfully
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </CardContent>
    </Card>
  )
}
