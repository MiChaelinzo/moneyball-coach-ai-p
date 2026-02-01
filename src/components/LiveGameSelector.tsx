import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { fetchRecentCloud9Games, isGridApiInitialized } from '@/lib/gridApi'
import { Radio, MagnifyingGlass, Cpu, Lightning, CheckCircle } from '@phosphor-icons/react'
import { motion, AnimatePresence } from 'framer-motion'

interface LiveGameSelectorProps {
  onSelectGame: (gameId: string, opponent: string) => void
  autoDetectEnabled: boolean
  onToggleAutoDetect: () => void
  isCheckingForGames: boolean
  onCheckForGames: () => Promise<boolean>
  currentGameId?: string
  isUsingGridData: boolean
}

export function LiveGameSelector({
  onSelectGame,
  autoDetectEnabled,
  onToggleAutoDetect,
  isCheckingForGames,
  onCheckForGames,
  currentGameId,
  isUsingGridData,
}: LiveGameSelectorProps) {
  const [availableGames, setAvailableGames] = useState<Array<{ id: string; opponent: string; state: string }>>([])
  const [isLoading, setIsLoading] = useState(false)
  const [lastChecked, setLastChecked] = useState<Date | null>(null)

  const loadAvailableGames = async () => {
    if (!isGridApiInitialized()) {
      return
    }

    setIsLoading(true)
    try {
      const games = await fetchRecentCloud9Games(10)
      setAvailableGames(games)
      setLastChecked(new Date())
    } catch (error) {
      console.error('Failed to load available games:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (isGridApiInitialized()) {
      loadAvailableGames()
    }
  }, [])

  const handleManualCheck = async () => {
    const found = await onCheckForGames()
    if (!found) {
      await loadAvailableGames()
    }
  }

  const liveGames = availableGames.filter(g => g.state === 'RUNNING')
  const upcomingGames = availableGames.filter(g => g.state === 'UNSTARTED')

  return (
    <Card className="glow-border bg-gradient-to-br from-primary/5 to-accent/5">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Radio size={24} weight="duotone" className="text-primary" />
              Live Match Selection
            </CardTitle>
            <CardDescription className="mt-1">
              Connect to real Cloud9 matches via GRID API
            </CardDescription>
          </div>
          {isUsingGridData && currentGameId && (
            <Badge className="bg-success/20 text-success border-success/40 gap-1">
              <CheckCircle size={14} weight="fill" />
              Connected
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between p-4 bg-card border border-border rounded-lg">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/20">
              <Lightning size={20} weight="duotone" className="text-primary" />
            </div>
            <div>
              <Label htmlFor="auto-detect" className="text-base font-semibold cursor-pointer">
                Auto-Detect Live Matches
              </Label>
              <p className="text-xs text-muted-foreground mt-0.5">
                Automatically find and connect to ongoing Cloud9 games
              </p>
            </div>
          </div>
          <Switch
            id="auto-detect"
            checked={autoDetectEnabled}
            onCheckedChange={onToggleAutoDetect}
            disabled={!isGridApiInitialized()}
          />
        </div>

        <Separator />

        {!isGridApiInitialized() ? (
          <Alert>
            <AlertDescription>
              Initialize the GRID API connection above to access live match tracking.
            </AlertDescription>
          </Alert>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold">Available Cloud9 Matches</h4>
                {lastChecked && (
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Last checked: {lastChecked.toLocaleTimeString()}
                  </p>
                )}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleManualCheck}
                disabled={isLoading || isCheckingForGames}
                className="gap-2"
              >
                <MagnifyingGlass size={16} weight="duotone" />
                {isLoading || isCheckingForGames ? 'Checking...' : 'Check Now'}
              </Button>
            </div>

            <AnimatePresence mode="wait">
              {liveGames.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-2"
                >
                  <div className="flex items-center gap-2 text-sm font-semibold text-success">
                    <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
                    Live Matches ({liveGames.length})
                  </div>
                  {liveGames.map((game) => (
                    <motion.div
                      key={game.id}
                      layout
                      className={`flex items-center justify-between p-3 border rounded-lg transition-all ${
                        currentGameId === game.id
                          ? 'bg-primary/10 border-primary glow-border'
                          : 'bg-card border-border hover:border-primary/40'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className="bg-success/20 text-success border-success/40 font-mono text-xs">
                          LIVE
                        </Badge>
                        <div>
                          <div className="font-semibold">Cloud9 vs {game.opponent}</div>
                          <div className="text-xs text-muted-foreground font-mono">ID: {game.id}</div>
                        </div>
                      </div>
                      {currentGameId === game.id ? (
                        <Badge variant="outline" className="bg-success/20 text-success border-success/40">
                          Tracking
                        </Badge>
                      ) : (
                        <Button
                          size="sm"
                          onClick={() => onSelectGame(game.id, game.opponent)}
                          className="gap-2"
                        >
                          <Cpu size={14} />
                          Track
                        </Button>
                      )}
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {upcomingGames.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                  Upcoming Matches ({upcomingGames.length})
                </div>
                {upcomingGames.slice(0, 3).map((game) => (
                  <div
                    key={game.id}
                    className="flex items-center justify-between p-3 bg-muted/30 border border-border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="font-mono text-xs">
                        SCHEDULED
                      </Badge>
                      <div>
                        <div className="font-medium text-sm">Cloud9 vs {game.opponent}</div>
                        <div className="text-xs text-muted-foreground font-mono">ID: {game.id}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {liveGames.length === 0 && upcomingGames.length === 0 && !isLoading && (
              <Alert>
                <AlertDescription>
                  No Cloud9 matches found. {autoDetectEnabled ? 'Auto-detection is active and will notify you when a match starts.' : 'Enable auto-detection to be notified when matches start.'}
                </AlertDescription>
              </Alert>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}
