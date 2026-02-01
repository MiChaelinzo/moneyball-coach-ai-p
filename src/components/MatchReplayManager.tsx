import { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { MatchReplayViewer } from '@/components/MatchReplayViewer'
import { ClockCounterClockwise, Trophy, Target, Clock, Sparkle } from '@phosphor-icons/react'
import type { Match, Mistake } from '@/lib/types'
import type { MatchReplay } from '@/lib/replayData'
import { generateMatchReplay, formatGameTime } from '@/lib/replayData'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface MatchReplayManagerProps {
  matches: Match[]
  mistakes: Mistake[]
}

export function MatchReplayManager({ matches, mistakes }: MatchReplayManagerProps) {
  const [selectedMatchId, setSelectedMatchId] = useState<string | null>(null)
  const [filterResult, setFilterResult] = useState<'all' | 'win' | 'loss'>('all')

  const filteredMatches = useMemo(() => {
    if (filterResult === 'all') return matches
    return matches.filter(m => m.result === filterResult)
  }, [matches, filterResult])

  const currentReplay: MatchReplay | null = useMemo(() => {
    if (!selectedMatchId) return null
    const match = matches.find(m => m.id === selectedMatchId)
    if (!match) return null
    return generateMatchReplay(match, mistakes)
  }, [selectedMatchId, matches, mistakes])

  const getMatchStats = (match: Match) => {
    const matchMistakes = mistakes.filter(m => m.matchId === match.id)
    const criticalMistakes = matchMistakes.filter(m => m.impact === 'critical').length
    return {
      mistakes: matchMistakes.length,
      criticalMistakes,
      totalObjectives: match.objectives.dragons + match.objectives.barons + match.objectives.towers
    }
  }

  if (currentReplay) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => setSelectedMatchId(null)}
            className="gap-2"
          >
            <ClockCounterClockwise size={18} weight="duotone" />
            Back to Match History
          </Button>
        </div>
        <MatchReplayViewer replay={currentReplay} />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card className="glow-border bg-gradient-to-br from-primary/5 to-accent/5">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/20">
                <ClockCounterClockwise size={24} weight="duotone" className="text-primary" />
              </div>
              <div>
                <CardTitle className="text-2xl">Match History Replays</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Review past games with timeline scrubbing and event analysis
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Select value={filterResult} onValueChange={(v) => setFilterResult(v as any)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Games</SelectItem>
                  <SelectItem value="win">Wins Only</SelectItem>
                  <SelectItem value="loss">Losses Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="text-xs uppercase tracking-wide text-muted-foreground font-semibold">
              {filteredMatches.length} {filteredMatches.length === 1 ? 'Match' : 'Matches'} Available
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {filteredMatches.map((match, index) => {
          const stats = getMatchStats(match)
          const isWin = match.result === 'win'

          return (
            <motion.div
              key={match.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className={cn(
                "cursor-pointer transition-all hover:scale-[1.02] hover:shadow-lg",
                isWin ? "glow-border-success" : "glow-border-destructive"
              )}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between gap-6">
                    <div className="flex items-center gap-4 flex-1">
                      <div className={cn(
                        "w-16 h-16 rounded-xl flex items-center justify-center",
                        isWin ? "bg-success/20" : "bg-destructive/20"
                      )}>
                        <Trophy 
                          size={32} 
                          weight="duotone" 
                          className={isWin ? "text-success" : "text-destructive"} 
                        />
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold">vs {match.opponent}</h3>
                          <Badge 
                            variant={isWin ? 'default' : 'destructive'}
                            className="font-semibold"
                          >
                            {isWin ? 'Victory' : 'Defeat'}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1.5">
                            <Clock size={16} />
                            <span>{match.date}</span>
                          </div>
                          <span>·</span>
                          <div className="flex items-center gap-1.5">
                            <Clock size={16} />
                            <span>{formatGameTime(match.duration)}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-6 mt-3">
                          <div className="flex items-center gap-2">
                            <Target size={16} className="text-primary" />
                            <span className="text-sm">
                              <span className="font-semibold">{stats.totalObjectives}</span>
                              <span className="text-muted-foreground ml-1">objectives</span>
                            </span>
                          </div>
                          
                          {stats.mistakes > 0 && (
                            <div className="flex items-center gap-2">
                              <Sparkle size={16} className="text-warning" />
                              <span className="text-sm">
                                <span className="font-semibold">{stats.mistakes}</span>
                                <span className="text-muted-foreground ml-1">tracked events</span>
                              </span>
                            </div>
                          )}

                          {stats.criticalMistakes > 0 && (
                            <Badge variant="outline" className="border-destructive text-destructive">
                              {stats.criticalMistakes} critical
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-3">
                      <div className="grid grid-cols-3 gap-3 text-center">
                        <div>
                          <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                            Dragons
                          </div>
                          <div className="font-mono font-bold text-lg">
                            {match.objectives.dragons}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                            Barons
                          </div>
                          <div className="font-mono font-bold text-lg">
                            {match.objectives.barons}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                            Towers
                          </div>
                          <div className="font-mono font-bold text-lg">
                            {match.objectives.towers}
                          </div>
                        </div>
                      </div>

                      <Button
                        onClick={() => setSelectedMatchId(match.id)}
                        className="w-full gap-2"
                      >
                        <ClockCounterClockwise size={18} weight="duotone" />
                        Watch Replay
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>

      {filteredMatches.length === 0 && (
        <Card className="glow-border">
          <CardContent className="py-12 text-center">
            <ClockCounterClockwise size={48} weight="duotone" className="text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              No matches found for the selected filter
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
