import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Badge } from '@/components/ui/badge'
import { 
  Play, 
  Pause, 
  FastForward, 
  Rewind, 
  SkipBack, 
  SkipForward,
  Warning,
  Trophy,
  Crosshair,
  ChartLine
} from '@phosphor-icons/react'
import type { MatchReplay, ReplaySnapshot } from '@/lib/replayData'
import { formatGameTime, getSnapshotAtTime } from '@/lib/replayData'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

interface MatchReplayViewerProps {
  replay: MatchReplay
}

export function MatchReplayViewer({ replay }: MatchReplayViewerProps) {
  const [currentTime, setCurrentTime] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [playbackSpeed, setPlaybackSpeed] = useState(1)
  const [currentSnapshot, setCurrentSnapshot] = useState<ReplaySnapshot>(replay.snapshots[0])
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const snapshot = getSnapshotAtTime(replay, currentTime)
    setCurrentSnapshot(snapshot)
  }, [currentTime, replay])

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentTime(prev => {
          const next = prev + playbackSpeed
          if (next >= replay.duration) {
            setIsPlaying(false)
            return replay.duration
          }
          return next
        })
      }, 1000)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isPlaying, playbackSpeed, replay.duration])

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  const handleTimeChange = (value: number[]) => {
    setCurrentTime(value[0])
    setIsPlaying(false)
  }

  const handleSkipForward = () => {
    setCurrentTime(Math.min(currentTime + 30, replay.duration))
  }

  const handleSkipBackward = () => {
    setCurrentTime(Math.max(currentTime - 30, 0))
  }

  const handleRestart = () => {
    setCurrentTime(0)
    setIsPlaying(false)
  }

  const jumpToKeyMoment = (timestamp: number) => {
    setCurrentTime(timestamp)
    setIsPlaying(false)
  }

  const cyclePlaybackSpeed = () => {
    const speeds = [0.5, 1, 2, 4]
    const currentIndex = speeds.indexOf(playbackSpeed)
    const nextIndex = (currentIndex + 1) % speeds.length
    setPlaybackSpeed(speeds[nextIndex])
  }

  const goldDiffPercent = currentSnapshot.goldDiff / Math.max(currentSnapshot.teamGold, 1) * 100
  const isWinning = currentSnapshot.goldDiff > 0

  return (
    <div className="space-y-6">
      <Card className="glow-border bg-gradient-to-br from-primary/5 to-accent/5">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-2 rounded-lg bg-primary/20">
                <ChartLine size={24} weight="duotone" className="text-primary" />
              </div>
              <div>
                <CardTitle className="text-2xl">Match Replay</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {replay.match.date} vs {replay.match.opponent} - {replay.match.result.toUpperCase()}
                </p>
              </div>
            </div>
            <Badge 
              variant={replay.match.result === 'win' ? 'default' : 'destructive'}
              className="text-lg px-4 py-2"
            >
              {replay.match.result === 'win' ? 'Victory' : 'Defeat'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="relative h-3 bg-muted rounded-full overflow-hidden">
            <div 
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-accent transition-all duration-300"
              style={{ width: `${(currentTime / replay.duration) * 100}%` }}
            />
            
            {replay.keyMoments.map(moment => (
              <motion.button
                key={`marker-${moment.timestamp}`}
                className={cn(
                  "absolute top-0 bottom-0 w-1 cursor-pointer hover:w-2 transition-all",
                  moment.type === 'positive' && "bg-success",
                  moment.type === 'negative' && "bg-destructive",
                  moment.type === 'neutral' && "bg-warning"
                )}
                style={{ left: `${(moment.timestamp / replay.duration) * 100}%` }}
                onClick={() => jumpToKeyMoment(moment.timestamp)}
                whileHover={{ scale: 1.2 }}
                title={moment.label}
              />
            ))}
          </div>

          <div className="space-y-2">
            <Slider
              value={[currentTime]}
              min={0}
              max={replay.duration}
              step={1}
              onValueChange={handleTimeChange}
              className="cursor-pointer"
            />
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span className="font-mono font-semibold">{formatGameTime(currentTime)}</span>
              <span className="font-mono">{formatGameTime(replay.duration)}</span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3">
            <Button
              variant="outline"
              size="icon"
              onClick={handleRestart}
              title="Restart"
            >
              <SkipBack size={20} weight="fill" />
            </Button>
            
            <Button
              variant="outline"
              size="icon"
              onClick={handleSkipBackward}
              title="Back 30s"
            >
              <Rewind size={20} weight="fill" />
            </Button>
            
            <Button
              size="lg"
              onClick={handlePlayPause}
              className="w-16 h-16 rounded-full"
            >
              {isPlaying ? (
                <Pause size={28} weight="fill" />
              ) : (
                <Play size={28} weight="fill" />
              )}
            </Button>
            
            <Button
              variant="outline"
              size="icon"
              onClick={handleSkipForward}
              title="Forward 30s"
            >
              <FastForward size={20} weight="fill" />
            </Button>
            
            <Button
              variant="outline"
              size="icon"
              onClick={cyclePlaybackSpeed}
              title={`Speed: ${playbackSpeed}x`}
            >
              <span className="text-xs font-bold">{playbackSpeed}x</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className={cn(
          "transition-all duration-300",
          isWinning ? "glow-border-success" : "glow-border-destructive"
        )}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy size={20} weight="duotone" className={isWinning ? "text-success" : "text-destructive"} />
              Game State
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Gold Difference</span>
                <span className={cn(
                  "font-mono font-bold text-lg",
                  isWinning ? "text-success" : "text-destructive"
                )}>
                  {isWinning ? '+' : ''}{Math.round(currentSnapshot.goldDiff).toLocaleString()}
                </span>
              </div>
              <div className="relative h-8 bg-muted rounded-lg overflow-hidden">
                <div 
                  className={cn(
                    "absolute inset-y-0 transition-all duration-500",
                    isWinning ? "bg-success left-1/2" : "bg-destructive right-1/2"
                  )}
                  style={{ 
                    width: `${Math.abs(goldDiffPercent) / 2}%`,
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs font-semibold text-foreground mix-blend-difference">
                    {Math.abs(goldDiffPercent).toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-xs uppercase tracking-wide text-muted-foreground mb-2">Cloud9</div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Gold:</span>
                    <span className="font-mono font-semibold text-success">
                      {Math.round(currentSnapshot.teamGold).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Dragons:</span>
                    <span className="font-mono font-semibold">{currentSnapshot.objectives.dragons}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Barons:</span>
                    <span className="font-mono font-semibold">{currentSnapshot.objectives.barons}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Towers:</span>
                    <span className="font-mono font-semibold">{currentSnapshot.objectives.towers}</span>
                  </div>
                </div>
              </div>

              <div>
                <div className="text-xs uppercase tracking-wide text-muted-foreground mb-2">Enemy</div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Gold:</span>
                    <span className="font-mono font-semibold text-destructive">
                      {Math.round(currentSnapshot.enemyGold).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Dragons:</span>
                    <span className="font-mono font-semibold">{currentSnapshot.enemyObjectives.dragons}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Barons:</span>
                    <span className="font-mono font-semibold">{currentSnapshot.enemyObjectives.barons}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Towers:</span>
                    <span className="font-mono font-semibold">{currentSnapshot.enemyObjectives.towers}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glow-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Crosshair size={20} weight="duotone" />
              Player Stats
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {currentSnapshot.players.map(player => {
                const kda = player.deaths === 0 
                  ? player.kills + player.assists 
                  : ((player.kills + player.assists) / player.deaths)
                
                return (
                  <motion.div
                    key={player.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                    layout
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                        <span className="text-xs font-bold text-primary-foreground">
                          {player.name.substring(0, 2).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <div className="font-semibold">{player.name}</div>
                        <div className="text-xs text-muted-foreground">{player.champion}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="font-mono font-semibold text-sm">
                          {player.kills}/{player.deaths}/{player.assists}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          KDA: {kda.toFixed(1)}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-mono text-sm">{player.cs} CS</div>
                        <div className="text-xs text-warning">{Math.round(player.gold).toLocaleString()}g</div>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="glow-border-warning">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Warning size={20} weight="duotone" className="text-warning" />
            Event Timeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            <AnimatePresence mode="popLayout">
              {currentSnapshot.events.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No events in this time period
                </p>
              ) : (
                currentSnapshot.events.map((event, idx) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: idx * 0.05 }}
                    className={cn(
                      "flex items-start gap-3 p-3 rounded-lg border",
                      event.type === 'mistake' && "bg-destructive/10 border-destructive/30",
                      event.type === 'objective' && "bg-success/10 border-success/30",
                      event.type === 'kill' && "bg-primary/10 border-primary/30"
                    )}
                  >
                    <div className={cn(
                      "mt-0.5 p-1 rounded",
                      event.type === 'mistake' && "bg-destructive/20",
                      event.type === 'objective' && "bg-success/20",
                      event.type === 'kill' && "bg-primary/20"
                    )}>
                      {event.type === 'mistake' && <Warning size={16} weight="fill" className="text-destructive" />}
                      {event.type === 'objective' && <Trophy size={16} weight="fill" className="text-success" />}
                      {event.type === 'kill' && <Crosshair size={16} weight="fill" className="text-primary" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-xs text-muted-foreground">
                          {formatGameTime(event.timestamp)}
                        </span>
                        {event.playerName && (
                          <Badge variant="outline" className="text-xs">
                            {event.playerName}
                          </Badge>
                        )}
                        <Badge 
                          variant="outline"
                          className={cn(
                            "text-xs",
                            event.impact === 'critical' && "border-destructive text-destructive",
                            event.impact === 'high' && "border-warning text-warning"
                          )}
                        >
                          {event.impact}
                        </Badge>
                      </div>
                      <p className="text-sm leading-relaxed">{event.description}</p>
                      {event.data?.outcome && (
                        <p className="text-xs text-muted-foreground mt-1">→ {event.data.outcome}</p>
                      )}
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
