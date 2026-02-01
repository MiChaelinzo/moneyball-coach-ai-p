import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Flask, ArrowsClockwise, Check, X, Database, Buildings, Trophy } from '@phosphor-icons/react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Player, Match, Tournament, Team } from '@/lib/types'
import type { Organization } from '@/lib/gridApi'

interface GridApiTestPanelProps {
  onTestFetch: () => Promise<void>
  players: Player[]
  matches: Match[]
  tournaments: Tournament[]
  organization: Organization | null
  teams: Team[]
  isLoading: boolean
  error: string | null
  isInitialized: boolean
}

export function GridApiTestPanel({ 
  onTestFetch, 
  players, 
  matches,
  tournaments,
  organization,
  teams,
  isLoading, 
  error,
  isInitialized 
}: GridApiTestPanelProps) {
  const [testLog, setTestLog] = useState<string[]>([])
  const [lastTestTime, setLastTestTime] = useState<Date | null>(null)

  const handleTest = async () => {
    const timestamp = new Date().toLocaleTimeString()
    setTestLog(prev => [`[${timestamp}] Starting GRID API test...`, ...prev])
    setLastTestTime(new Date())
    
    try {
      await onTestFetch()
      setTestLog(prev => [`[${timestamp}] ✅ Test completed successfully`, ...prev])
    } catch (err) {
      setTestLog(prev => [`[${timestamp}] ❌ Test failed: ${err}`, ...prev])
    }
  }

  const getStatusColor = () => {
    if (error) return 'destructive'
    if (isLoading) return 'warning'
    if (players.length > 0) return 'success'
    return 'muted'
  }

  return (
    <Card className="glow-border bg-gradient-to-br from-primary/5 to-accent/5">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/20">
              <Flask size={24} weight="duotone" className="text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">GRID API Test Panel</CardTitle>
              <CardDescription>
                Test live data fetching from GRID API
              </CardDescription>
            </div>
          </div>
          <Button
            onClick={handleTest}
            disabled={isLoading || !isInitialized}
            className="gap-2"
            size="lg"
          >
            <ArrowsClockwise size={20} weight="bold" className={isLoading ? 'animate-spin' : ''} />
            {isLoading ? 'Testing...' : 'Run Test'}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid md:grid-cols-6 gap-4">
          <Card className={`border-2 ${isInitialized ? 'border-success/40 bg-success/5' : 'border-muted'}`}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-muted-foreground">API Status</span>
                {isInitialized ? (
                  <Check size={20} weight="bold" className="text-success" />
                ) : (
                  <X size={20} weight="bold" className="text-muted-foreground" />
                )}
              </div>
              <div className="font-mono text-lg font-bold">
                {isInitialized ? 'Connected' : 'Disconnected'}
              </div>
            </CardContent>
          </Card>

          <Card className={`border-2 ${organization ? 'border-primary/40 bg-primary/5' : 'border-muted'}`}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-muted-foreground">Organization</span>
                <Buildings size={20} weight="duotone" className="text-primary" />
              </div>
              <div className="font-mono text-lg font-bold text-primary">
                {organization?.name || 'N/A'}
              </div>
              {organization && (
                <div className="text-xs text-muted-foreground mt-1">
                  {organization.teams.length} teams
                </div>
              )}
            </CardContent>
          </Card>

          <Card className={`border-2 ${teams.length > 0 ? 'border-primary/40 bg-primary/5' : 'border-muted'}`}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-muted-foreground">Teams</span>
                <Trophy size={20} weight="duotone" className="text-primary" />
              </div>
              <div className="font-mono text-2xl font-bold text-primary">
                {teams.length}
              </div>
            </CardContent>
          </Card>

          <Card className={`border-2 ${players.length > 0 ? 'border-accent/40 bg-accent/5' : 'border-muted'}`}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-muted-foreground">Players</span>
                <Database size={20} weight="duotone" className="text-accent" />
              </div>
              <div className="font-mono text-2xl font-bold text-accent">
                {players.length}
              </div>
            </CardContent>
          </Card>

          <Card className={`border-2 ${matches.length > 0 ? 'border-warning/40 bg-warning/5' : 'border-muted'}`}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-muted-foreground">Matches</span>
                <Database size={20} weight="duotone" className="text-warning" />
              </div>
              <div className="font-mono text-2xl font-bold text-warning">
                {matches.length}
              </div>
            </CardContent>
          </Card>

          <Card className={`border-2 ${tournaments.length > 0 ? 'border-success/40 bg-success/5' : 'border-muted'}`}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-muted-foreground">Tournaments</span>
                <Database size={20} weight="duotone" className="text-success" />
              </div>
              <div className="font-mono text-2xl font-bold text-success">
                {tournaments.length}
              </div>
            </CardContent>
          </Card>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription className="font-mono text-sm">
              {error}
            </AlertDescription>
          </Alert>
        )}

        {lastTestTime && (
          <div className="text-sm text-muted-foreground">
            Last test: {lastTestTime.toLocaleString()}
          </div>
        )}

        {players.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-sm uppercase tracking-wide">Loaded Players</h4>
              <Badge variant="secondary">{players.length} total</Badge>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
              {players.map(player => (
                <Card key={player.id} className="bg-card/50">
                  <CardContent className="p-3">
                    <div className="font-semibold text-sm">{player.name}</div>
                    <div className="text-xs text-muted-foreground">{player.role}</div>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline" className="text-xs">
                        KDA: {player.kda || 0}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>
        )}

        {matches.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-sm uppercase tracking-wide">Recent Matches</h4>
              <Badge variant="secondary">{matches.length} loaded</Badge>
            </div>
            <div className="space-y-2">
              {matches.slice(0, 5).map(match => (
                <Card key={match.id} className="bg-card/50">
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-sm">
                          Cloud9 vs {match.opponent}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {match.date} • {Math.floor(match.duration / 60)}m
                        </div>
                      </div>
                      <Badge variant={match.result === 'win' ? 'default' : 'destructive'}>
                        {match.result.toUpperCase()}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>
        )}

        {tournaments.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-sm uppercase tracking-wide">Cloud9 Tournaments</h4>
              <Badge variant="secondary">{tournaments.length} found</Badge>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {tournaments.slice(0, 8).map(tournament => (
                <Card key={tournament.id} className="bg-card/50">
                  <CardContent className="p-3">
                    <div className="font-semibold text-sm line-clamp-1">
                      {tournament.nameShortened}
                    </div>
                    <div className="text-xs text-muted-foreground line-clamp-2 mt-1">
                      {tournament.name}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>
        )}

        {teams.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-sm uppercase tracking-wide">Teams from GRID</h4>
              <Badge variant="secondary">{teams.length} found</Badge>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
              {teams.slice(0, 10).map(team => (
                <Card key={team.id} className="bg-card/50 border" style={{ borderColor: team.colorPrimary + '40' }}>
                  <CardContent className="p-3">
                    {team.logoUrl && (
                      <div className="w-10 h-10 mb-2 mx-auto">
                        <img src={team.logoUrl} alt={team.name} className="w-full h-full object-contain" />
                      </div>
                    )}
                    <div className="font-semibold text-sm text-center line-clamp-1">
                      {team.name}
                    </div>
                    <div className="flex gap-1 mt-2 justify-center">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: team.colorPrimary }}
                        title="Primary color"
                      />
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: team.colorSecondary }}
                        title="Secondary color"
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>
        )}

        {testLog.length > 0 && (
          <details className="space-y-2">
            <summary className="cursor-pointer font-semibold text-sm uppercase tracking-wide text-muted-foreground hover:text-foreground">
              Test Log ({testLog.length})
            </summary>
            <div className="bg-muted/50 rounded-lg p-3 space-y-1 max-h-48 overflow-y-auto font-mono text-xs">
              <AnimatePresence>
                {testLog.map((log, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-muted-foreground"
                  >
                    {log}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </details>
        )}
      </CardContent>
    </Card>
  )
}
