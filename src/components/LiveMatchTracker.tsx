import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { motion, AnimatePresence } from 'framer-motion'
import type { LiveMatch, LiveMatchPlayer } from '@/lib/types'
import { Play, Pause, Trophy, Skull, Crosshair, Coins, Sword, Shield } from '@phosphor-icons/react'

interface LiveMatchTrackerProps {
  match: LiveMatch
  onToggleTracking: () => void
  onReset?: () => void
  isUsingGridData?: boolean
}

export function LiveMatchTracker({ match, onToggleTracking, onReset, isUsingGridData }: LiveMatchTrackerProps) {
  const [prevStats, setPrevStats] = useState<Record<string, { kills: number; deaths: number; assists: number }>>({})

  useEffect(() => {
    const newStats: Record<string, { kills: number; deaths: number; assists: number }> = {}
    match.players.forEach(p => {
      newStats[p.id] = { kills: p.kills, deaths: p.deaths, assists: p.assists }
    })
    setPrevStats(newStats)
  }, [match.players])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getKDA = (player: LiveMatchPlayer) => {
    if (player.deaths === 0) return ((player.kills + player.assists) || 0).toFixed(1)
    return ((player.kills + player.assists) / player.deaths).toFixed(1)
  }

  const hasStatChanged = (playerId: string, stat: 'kills' | 'deaths' | 'assists', currentValue: number) => {
    return prevStats[playerId] && prevStats[playerId][stat] !== currentValue
  }

  const goldDiff = match.teamGold - match.enemyGold
  const goldAdvantage = goldDiff > 0

  const roleColors: Record<string, string> = {
    'Top': 'bg-chart-1/20 text-chart-1 border-chart-1/40',
    'Jungle': 'bg-chart-2/20 text-chart-2 border-chart-2/40',
    'Mid': 'bg-chart-3/20 text-chart-3 border-chart-3/40',
    'ADC': 'bg-chart-4/20 text-chart-4 border-chart-4/40',
    'Support': 'bg-chart-5/20 text-chart-5 border-chart-5/40',
  }

  return (
    <Card className="glow-border bg-gradient-to-br from-primary/5 to-accent/5">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className={`p-3 rounded-lg ${match.isActive ? 'bg-success/20' : 'bg-muted'}`}>
                <Crosshair size={28} weight="duotone" className={match.isActive ? 'text-success' : 'text-muted-foreground'} />
              </div>
              {match.isActive && (
                <motion.div
                  className="absolute -top-1 -right-1 w-3 h-3 bg-success rounded-full"
                  animate={{ scale: [1, 1.2, 1], opacity: [1, 0.7, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}
            </div>
            <div>
              <CardTitle className="text-2xl">Live Match vs {match.opponent}</CardTitle>
              <div className="flex items-center gap-3 mt-1">
                <Badge variant={match.isActive ? 'default' : 'secondary'} className="font-mono">
                  {match.isActive ? 'LIVE' : 'PAUSED'}
                </Badge>
                {isUsingGridData && (
                  <Badge variant="outline" className="bg-primary/20 text-primary border-primary/40 text-xs">
                    GRID API
                  </Badge>
                )}
                {!isUsingGridData && match.isActive && (
                  <Badge variant="outline" className="bg-muted text-muted-foreground border-muted-foreground/40 text-xs">
                    SIMULATED
                  </Badge>
                )}
                <span className="font-mono text-lg font-semibold text-primary">
                  {formatTime(match.gameTime)}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={onToggleTracking}
              variant={match.isActive ? 'destructive' : 'default'}
              className="gap-2"
            >
              {match.isActive ? (
                <>
                  <Pause size={18} weight="fill" />
                  Pause
                </>
              ) : (
                <>
                  <Play size={18} weight="fill" />
                  Resume
                </>
              )}
            </Button>
            {onReset && (
              <Button
                onClick={onReset}
                variant="outline"
                size="icon"
                title="Reset Match"
              >
                <Crosshair size={18} weight="duotone" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-3 gap-4">
          <Card className={`${goldAdvantage ? 'glow-border-success' : 'glow-border-destructive'}`}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Gold Diff</div>
                  <div className={`font-mono text-2xl font-bold ${goldAdvantage ? 'text-success' : 'text-destructive'}`}>
                    {goldAdvantage ? '+' : ''}{(goldDiff / 1000).toFixed(1)}k
                  </div>
                </div>
                <Coins size={32} weight="duotone" className={goldAdvantage ? 'text-success' : 'text-destructive'} />
              </div>
            </CardContent>
          </Card>

          <Card className="glow-border">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Objectives</div>
                  <div className="font-mono text-2xl font-bold text-primary">
                    {match.objectives.dragons + match.objectives.barons + match.objectives.towers}
                  </div>
                </div>
                <Trophy size={32} weight="duotone" className="text-primary" />
              </div>
              <div className="flex gap-3 mt-2 text-xs text-muted-foreground">
                <span>🐉 {match.objectives.dragons}</span>
                <span>👹 {match.objectives.barons}</span>
                <span>🗼 {match.objectives.towers}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="glow-border-warning">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Enemy Obj</div>
                  <div className="font-mono text-2xl font-bold text-warning">
                    {match.enemyObjectives.dragons + match.enemyObjectives.barons + match.enemyObjectives.towers}
                  </div>
                </div>
                <Shield size={32} weight="duotone" className="text-warning" />
              </div>
              <div className="flex gap-3 mt-2 text-xs text-muted-foreground">
                <span>🐉 {match.enemyObjectives.dragons}</span>
                <span>👹 {match.enemyObjectives.barons}</span>
                <span>🗼 {match.enemyObjectives.towers}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Sword size={20} weight="duotone" className="text-primary" />
            Player Performance
          </h3>
          <div className="space-y-3">
            {match.players.map((player) => {
              const kda = getKDA(player)
              const kdaValue = parseFloat(kda)

              return (
                <motion.div
                  key={player.id}
                  layout
                  className="flex items-center gap-4 p-4 bg-card border border-border rounded-lg hover:border-primary/40 transition-all"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <Badge className={`${roleColors[player.role]} text-xs w-20 justify-center`}>
                      {player.role}
                    </Badge>
                    <div className="flex-1">
                      <div className="font-semibold text-base">{player.name}</div>
                      <div className="text-xs text-muted-foreground">{player.champion}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-center min-w-[100px]">
                      <div className="flex items-center justify-center gap-1 font-mono text-lg font-semibold">
                        <AnimatePresence mode="wait">
                          {hasStatChanged(player.id, 'kills', player.kills) ? (
                            <motion.span
                              key={`k-${player.kills}`}
                              initial={{ y: -10, opacity: 0, color: 'oklch(0.68 0.18 145)' }}
                              animate={{ y: 0, opacity: 1, color: 'inherit' }}
                              exit={{ y: 10, opacity: 0 }}
                              transition={{ duration: 0.3 }}
                              className="text-success"
                            >
                              {player.kills}
                            </motion.span>
                          ) : (
                            <span>{player.kills}</span>
                          )}
                        </AnimatePresence>
                        <span className="text-muted-foreground">/</span>
                        <AnimatePresence mode="wait">
                          {hasStatChanged(player.id, 'deaths', player.deaths) ? (
                            <motion.span
                              key={`d-${player.deaths}`}
                              initial={{ y: -10, opacity: 0, color: 'oklch(0.60 0.22 25)' }}
                              animate={{ y: 0, opacity: 1, color: 'inherit' }}
                              exit={{ y: 10, opacity: 0 }}
                              transition={{ duration: 0.3 }}
                              className="text-destructive"
                            >
                              {player.deaths}
                            </motion.span>
                          ) : (
                            <span>{player.deaths}</span>
                          )}
                        </AnimatePresence>
                        <span className="text-muted-foreground">/</span>
                        <AnimatePresence mode="wait">
                          {hasStatChanged(player.id, 'assists', player.assists) ? (
                            <motion.span
                              key={`a-${player.assists}`}
                              initial={{ y: -10, opacity: 0, color: 'oklch(0.72 0.16 195)' }}
                              animate={{ y: 0, opacity: 1, color: 'inherit' }}
                              exit={{ y: 10, opacity: 0 }}
                              transition={{ duration: 0.3 }}
                              className="text-primary"
                            >
                              {player.assists}
                            </motion.span>
                          ) : (
                            <span>{player.assists}</span>
                          )}
                        </AnimatePresence>
                      </div>
                      <div className="text-xs text-muted-foreground uppercase tracking-wide">K / D / A</div>
                    </div>

                    <div className="text-center min-w-[80px]">
                      <div className={`font-mono text-xl font-bold ${
                        kdaValue >= 5 ? 'text-success' :
                        kdaValue >= 3 ? 'text-primary' :
                        kdaValue >= 2 ? 'text-warning' :
                        'text-destructive'
                      }`}>
                        {kda}
                      </div>
                      <div className="text-xs text-muted-foreground uppercase tracking-wide">KDA</div>
                    </div>

                    <div className="text-center min-w-[80px]">
                      <div className="font-mono text-lg font-semibold text-foreground">{player.cs}</div>
                      <div className="text-xs text-muted-foreground uppercase tracking-wide">CS</div>
                    </div>

                    <div className="text-center min-w-[80px]">
                      <div className="font-mono text-lg font-semibold text-warning">
                        {(player.gold / 1000).toFixed(1)}k
                      </div>
                      <div className="text-xs text-muted-foreground uppercase tracking-wide">Gold</div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
