import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { useSeriesState } from '@/hooks/use-series-state'
import { SeriesFinder } from '@/components/SeriesFinder'
import { useState } from 'react'
import { Play, Stop, ArrowClockwise, Crosshair, Trophy, Skull, Wallet, MapPin } from '@phosphor-icons/react'
import { motion, AnimatePresence } from 'framer-motion'

export function SeriesStateTracker() {
  const {
    seriesState,
    seriesId,
    isPolling,
    error,
    lastUpdate,
    startPolling,
    stopPolling,
    resetState,
  } = useSeriesState()

  const [inputSeriesId, setInputSeriesId] = useState(seriesId || '2')

  const handleSelectSeries = (id: string) => {
    setInputSeriesId(id)
    startPolling(id)
  }

  const handleStart = () => {
    if (inputSeriesId.trim()) {
      startPolling(inputSeriesId.trim())
    }
  }

  const formatTime = (dateStr: string | null) => {
    if (!dateStr) return 'Never'
    const date = new Date(dateStr)
    return date.toLocaleTimeString()
  }

  return (
    <div className="space-y-6">
      {!isPolling && <SeriesFinder onSelectSeries={handleSelectSeries} />}
      
      <Card className="glow-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/20">
                <Crosshair size={24} weight="duotone" className="text-primary" />
              </div>
              <div>
                <CardTitle className="text-xl">Live Series State Tracker</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Real-time DOTA 2 match data via GRID API
                </p>
              </div>
            </div>
            {isPolling && (
              <Badge className="bg-success/20 text-success border-success/40 animate-pulse">
                Live
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-3">
            <Input
              placeholder="Enter Series ID (e.g., 2)"
              value={inputSeriesId}
              onChange={(e) => setInputSeriesId(e.target.value)}
              disabled={isPolling}
              className="flex-1"
            />
            {!isPolling ? (
              <Button onClick={handleStart} className="gap-2">
                <Play size={18} weight="fill" />
                Start Tracking
              </Button>
            ) : (
              <Button onClick={stopPolling} variant="destructive" className="gap-2">
                <Stop size={18} weight="fill" />
                Stop
              </Button>
            )}
            <Button onClick={resetState} variant="outline" className="gap-2">
              <ArrowClockwise size={18} weight="bold" />
              Reset
            </Button>
          </div>

          {error && (
            <div className="p-3 bg-destructive/10 border border-destructive/30 rounded-lg text-sm text-destructive">
              {error}
            </div>
          )}

          {lastUpdate && (
            <div className="text-xs text-muted-foreground">
              Last updated: {lastUpdate.toLocaleTimeString()}
            </div>
          )}
        </CardContent>
      </Card>

      <AnimatePresence>
        {seriesState && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <Card className="glow-border-success">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Series Overview</span>
                  <div className="flex gap-2">
                    {seriesState.started && (
                      <Badge className="bg-success/20 text-success border-success/40">
                        Started
                      </Badge>
                    )}
                    {seriesState.finished && (
                      <Badge className="bg-muted/20 text-muted-foreground border-muted/40">
                        Finished
                      </Badge>
                    )}
                    {!seriesState.valid && (
                      <Badge className="bg-warning/20 text-warning border-warning/40">
                        Invalid Data
                      </Badge>
                    )}
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-muted-foreground uppercase tracking-wide mb-1">
                      Format
                    </div>
                    <div className="font-mono text-lg font-bold">
                      {seriesState.format || 'Unknown'}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground uppercase tracking-wide mb-1">
                      Updated At
                    </div>
                    <div className="font-mono text-lg font-bold">
                      {formatTime(seriesState.updatedAt)}
                    </div>
                  </div>
                </div>

                <div>
                  <div className="text-sm text-muted-foreground uppercase tracking-wide mb-3">
                    Team Scores
                  </div>
                  <div className="flex gap-4">
                    {seriesState.teams.map((team, idx) => (
                      <div
                        key={idx}
                        className="flex-1 p-4 bg-card border border-border rounded-lg"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <Trophy size={20} weight="duotone" className="text-primary" />
                          <div className="font-semibold">{team.name}</div>
                        </div>
                        <div className="font-mono text-3xl font-bold text-primary">
                          {team.won}
                        </div>
                        <div className="text-xs text-muted-foreground">Games Won</div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {seriesState.games.length > 0 ? (
              seriesState.games.map((game) => (
                <Card key={game.sequenceNumber} className="glow-border">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Crosshair size={24} weight="duotone" className="text-primary" />
                      Game {game.sequenceNumber}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {game.teams.map((team, teamIdx) => (
                      <div key={teamIdx} className="space-y-3">
                        <div className="flex items-center gap-2 pb-2 border-b border-border">
                          <div className="text-lg font-bold">{team.name}</div>
                          <Badge variant="outline">{team.players.length} Players</Badge>
                        </div>

                        <div className="grid gap-3">
                          {team.players.map((player, playerIdx) => (
                            <motion.div
                              key={playerIdx}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: playerIdx * 0.05 }}
                              className="p-3 bg-secondary/30 rounded-lg border border-border"
                            >
                              <div className="flex items-center justify-between mb-2">
                                <div className="font-semibold font-mono">
                                  {player.name}
                                </div>
                                <div className="flex gap-2">
                                  <Badge className="bg-success/20 text-success border-success/40">
                                    <Crosshair size={14} weight="fill" className="mr-1" />
                                    {player.kills}
                                  </Badge>
                                  <Badge className="bg-destructive/20 text-destructive border-destructive/40">
                                    <Skull size={14} weight="fill" className="mr-1" />
                                    {player.deaths}
                                  </Badge>
                                </div>
                              </div>
                              
                              <div className="grid grid-cols-3 gap-2 text-xs">
                                <div className="flex items-center gap-1">
                                  <Wallet size={14} className="text-warning" />
                                  <span className="text-muted-foreground">Net Worth:</span>
                                  <span className="font-mono font-semibold">
                                    {player.netWorth.toLocaleString()}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Wallet size={14} className="text-primary" />
                                  <span className="text-muted-foreground">Money:</span>
                                  <span className="font-mono font-semibold">
                                    {player.money.toLocaleString()}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <MapPin size={14} className="text-accent" />
                                  <span className="text-muted-foreground">Pos:</span>
                                  <span className="font-mono font-semibold">
                                    ({player.position.x.toFixed(0)}, {player.position.y.toFixed(0)})
                                  </span>
                                </div>
                              </div>

                              <div className="mt-2 flex items-center gap-2">
                                <div className="flex-1 h-1 bg-muted rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-gradient-to-r from-success to-primary"
                                    style={{
                                      width: `${Math.min(
                                        100,
                                        (player.netWorth / 20000) * 100
                                      )}%`,
                                    }}
                                  />
                                </div>
                                <div className="text-xs text-muted-foreground font-mono">
                                  KDA: {player.deaths > 0 
                                    ? (player.kills / player.deaths).toFixed(2)
                                    : player.kills.toFixed(2)}
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card className="glow-border">
                <CardContent className="py-12 text-center">
                  <Crosshair
                    size={48}
                    weight="duotone"
                    className="text-muted-foreground mx-auto mb-4"
                  />
                  <p className="text-muted-foreground">
                    No active games in this series
                  </p>
                </CardContent>
              </Card>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
