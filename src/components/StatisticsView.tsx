import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  fetchPlayerStatistics, 
  fetchTeamStatistics,
  type PlayerStatistics,
  type TeamStatistics
} from '@/lib/gridApi'
import { ChartBar, TrendUp, TrendDown, Target, Crosshair, User, Users } from '@phosphor-icons/react'
import { toast } from 'sonner'
import type { Player, Team } from '@/lib/types'

interface StatisticsViewProps {
  players: Player[]
  teams: Team[]
  matches: any[]
}

export function StatisticsView({ players, teams, matches }: StatisticsViewProps) {
  const [selectedPlayer, setSelectedPlayer] = useState<string>('')
  const [selectedTeam, setSelectedTeam] = useState<string>('')
  const [playerStats, setPlayerStats] = useState<PlayerStatistics | null>(null)
  const [teamStats, setTeamStats] = useState<TeamStatistics | null>(null)
  const [isLoadingPlayer, setIsLoadingPlayer] = useState(false)
  const [isLoadingTeam, setIsLoadingTeam] = useState(false)
  const [seriesFilter, setSeriesFilter] = useState<'all' | 'last3'>('all')

  const handleFetchPlayerStats = async () => {
    if (!selectedPlayer) return

    setIsLoadingPlayer(true)
    try {
      const seriesIds = seriesFilter === 'last3' 
        ? matches.slice(0, 3).map(m => m.id)
        : undefined

      const stats = await fetchPlayerStatistics(selectedPlayer, seriesIds)
      setPlayerStats(stats)
      
      if (stats && stats.game.count > 0) {
        toast.success(`Loaded statistics for player ${selectedPlayer}`)
      } else {
        toast.warning('No statistics available for this player')
      }
    } catch (error) {
      toast.error('Failed to fetch player statistics')
      console.error(error)
    } finally {
      setIsLoadingPlayer(false)
    }
  }

  const handleFetchTeamStats = async () => {
    if (!selectedTeam) return

    setIsLoadingTeam(true)
    try {
      const seriesIds = seriesFilter === 'last3' 
        ? matches.slice(0, 3).map(m => m.id)
        : undefined

      const stats = await fetchTeamStatistics(selectedTeam, seriesIds)
      setTeamStats(stats)
      
      if (stats && stats.game.count > 0) {
        toast.success(`Loaded statistics for team ${selectedTeam}`)
      } else {
        toast.warning('No statistics available for this team')
      }
    } catch (error) {
      toast.error('Failed to fetch team statistics')
      console.error(error)
    } finally {
      setIsLoadingTeam(false)
    }
  }

  useEffect(() => {
    if (players.length > 0 && !selectedPlayer) {
      setSelectedPlayer(players[0].id)
    }
  }, [players, selectedPlayer])

  useEffect(() => {
    if (teams.length > 0 && !selectedTeam) {
      setSelectedTeam(teams[0].id)
    }
  }, [teams, selectedTeam])

  const renderPlayerStats = (stats: PlayerStatistics) => {
    const winData = stats.game.wins.find(w => w.value === true)
    const lossData = stats.game.wins.find(w => w.value === false)
    const segment = stats.segment[0]

    return (
      <div className="space-y-6">
        <div className="grid md:grid-cols-4 gap-4">
          <Card className="glow-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-xs uppercase tracking-wide text-muted-foreground">
                Games Played
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="font-mono text-3xl font-bold text-foreground">
                {stats.game.count}
              </div>
            </CardContent>
          </Card>

          <Card className="glow-border-success">
            <CardHeader className="pb-3">
              <CardTitle className="text-xs uppercase tracking-wide text-muted-foreground">
                Win Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="font-mono text-3xl font-bold text-success">
                {winData ? Math.round(winData.percentage) : 0}%
              </div>
            </CardContent>
          </Card>

          <Card className="glow-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-xs uppercase tracking-wide text-muted-foreground">
                Avg Kills
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="font-mono text-3xl font-bold text-primary">
                {stats.series.kills.avg.toFixed(1)}
              </div>
            </CardContent>
          </Card>

          <Card className="glow-border-destructive">
            <CardHeader className="pb-3">
              <CardTitle className="text-xs uppercase tracking-wide text-muted-foreground">
                Avg Deaths
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="font-mono text-3xl font-bold text-destructive">
                {segment ? segment.deaths.avg.toFixed(1) : 0}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="glow-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target size={20} weight="duotone" className="text-primary" />
                Kill Statistics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Total Kills</span>
                <span className="font-mono text-lg font-bold">{stats.series.kills.sum}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Min Kills (Series)</span>
                <span className="font-mono text-lg font-bold">{stats.series.kills.min}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Max Kills (Series)</span>
                <span className="font-mono text-lg font-bold">{stats.series.kills.max}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Series Played</span>
                <span className="font-mono text-lg font-bold">{stats.series.count}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="glow-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Crosshair size={20} weight="duotone" className="text-destructive" />
                Death Statistics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {segment && (
                <>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Total Deaths</span>
                    <span className="font-mono text-lg font-bold">{segment.deaths.sum}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Min Deaths ({segment.type})</span>
                    <span className="font-mono text-lg font-bold">{segment.deaths.min}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Max Deaths ({segment.type})</span>
                    <span className="font-mono text-lg font-bold">{segment.deaths.max}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Segments Played</span>
                    <span className="font-mono text-lg font-bold">{segment.count}</span>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="glow-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendUp size={20} weight="duotone" className="text-success" />
              Win/Loss Streaks
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {winData && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs uppercase tracking-wide text-muted-foreground mb-2">Wins</div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Total</span>
                      <Badge variant="outline" className="font-mono">{winData.count}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Current Streak</span>
                      <Badge className="font-mono bg-success/20 text-success border-success/40">
                        {winData.streak.current}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Best Streak</span>
                      <Badge className="font-mono bg-success/20 text-success border-success/40">
                        {winData.streak.max}
                      </Badge>
                    </div>
                  </div>
                </div>
                {lossData && (
                  <div>
                    <div className="text-xs uppercase tracking-wide text-muted-foreground mb-2">Losses</div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Total</span>
                        <Badge variant="outline" className="font-mono">{lossData.count}</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Current Streak</span>
                        <Badge className="font-mono bg-destructive/20 text-destructive border-destructive/40">
                          {lossData.streak.current}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Worst Streak</span>
                        <Badge className="font-mono bg-destructive/20 text-destructive border-destructive/40">
                          {lossData.streak.max}
                        </Badge>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  const renderTeamStats = (stats: TeamStatistics) => {
    const winData = stats.game.wins.find(w => w.value === true)
    const lossData = stats.game.wins.find(w => w.value === false)
    const segment = stats.segment[0]

    return (
      <div className="space-y-6">
        <div className="grid md:grid-cols-4 gap-4">
          <Card className="glow-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-xs uppercase tracking-wide text-muted-foreground">
                Games Played
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="font-mono text-3xl font-bold text-foreground">
                {stats.game.count}
              </div>
            </CardContent>
          </Card>

          <Card className="glow-border-success">
            <CardHeader className="pb-3">
              <CardTitle className="text-xs uppercase tracking-wide text-muted-foreground">
                Win Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="font-mono text-3xl font-bold text-success">
                {winData ? Math.round(winData.percentage) : 0}%
              </div>
            </CardContent>
          </Card>

          <Card className="glow-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-xs uppercase tracking-wide text-muted-foreground">
                Avg Team Kills
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="font-mono text-3xl font-bold text-primary">
                {stats.series.kills.avg.toFixed(1)}
              </div>
            </CardContent>
          </Card>

          <Card className="glow-border-destructive">
            <CardHeader className="pb-3">
              <CardTitle className="text-xs uppercase tracking-wide text-muted-foreground">
                Avg Team Deaths
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="font-mono text-3xl font-bold text-destructive">
                {segment ? segment.deaths.avg.toFixed(1) : 0}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="glow-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target size={20} weight="duotone" className="text-primary" />
                Team Kill Statistics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Total Kills</span>
                <span className="font-mono text-lg font-bold">{stats.series.kills.sum}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Min Kills (Series)</span>
                <span className="font-mono text-lg font-bold">{stats.series.kills.min}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Max Kills (Series)</span>
                <span className="font-mono text-lg font-bold">{stats.series.kills.max}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Series Played</span>
                <span className="font-mono text-lg font-bold">{stats.series.count}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="glow-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendUp size={20} weight="duotone" className="text-success" />
                Win/Loss Record
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {winData && (
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Wins</span>
                    <Badge className="font-mono bg-success/20 text-success border-success/40">
                      {winData.count} ({Math.round(winData.percentage)}%)
                    </Badge>
                  </div>
                  {lossData && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Losses</span>
                      <Badge className="font-mono bg-destructive/20 text-destructive border-destructive/40">
                        {lossData.count} ({Math.round(lossData.percentage)}%)
                      </Badge>
                    </div>
                  )}
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Current Win Streak</span>
                    <Badge className="font-mono">{winData.streak.current}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Best Win Streak</span>
                    <Badge className="font-mono bg-primary/20 text-primary border-primary/40">
                      {winData.streak.max}
                    </Badge>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-1">Detailed Statistics</h2>
        <p className="text-sm text-muted-foreground">
          Real-time player and team statistics from GRID API
        </p>
      </div>

      <Tabs defaultValue="player" className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="player" className="flex items-center gap-2">
            <User size={16} weight="duotone" />
            Player Stats
          </TabsTrigger>
          <TabsTrigger value="team" className="flex items-center gap-2">
            <Users size={16} weight="duotone" />
            Team Stats
          </TabsTrigger>
        </TabsList>

        <TabsContent value="player" className="space-y-6">
          <Card className="glow-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ChartBar size={20} weight="duotone" className="text-primary" />
                Player Statistics Lookup
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-end gap-4">
                <div className="flex-1">
                  <label className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2 block">
                    Select Player
                  </label>
                  <Select value={selectedPlayer} onValueChange={setSelectedPlayer}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {players.map(player => (
                        <SelectItem key={player.id} value={player.id}>
                          {player.name} - {player.role}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="w-48">
                  <label className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2 block">
                    Series Filter
                  </label>
                  <Select value={seriesFilter} onValueChange={(v) => setSeriesFilter(v as 'all' | 'last3')}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Series</SelectItem>
                      <SelectItem value="last3">Last 3 Matches</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button 
                  onClick={handleFetchPlayerStats}
                  disabled={isLoadingPlayer || !selectedPlayer}
                  className="gap-2"
                >
                  <ChartBar size={18} weight="duotone" />
                  {isLoadingPlayer ? 'Loading...' : 'Fetch Stats'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {playerStats && playerStats.game.count > 0 ? (
            renderPlayerStats(playerStats)
          ) : playerStats === null ? (
            <Card className="glow-border">
              <CardContent className="py-12 text-center">
                <User size={48} weight="duotone" className="text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Select a player and click "Fetch Stats" to view detailed statistics
                </p>
              </CardContent>
            </Card>
          ) : (
            <Card className="glow-border">
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">
                  No statistics available for this player
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="team" className="space-y-6">
          <Card className="glow-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ChartBar size={20} weight="duotone" className="text-primary" />
                Team Statistics Lookup
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-end gap-4">
                <div className="flex-1">
                  <label className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2 block">
                    Select Team
                  </label>
                  <Select value={selectedTeam} onValueChange={setSelectedTeam}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {teams.map(team => (
                        <SelectItem key={team.id} value={team.id}>
                          {team.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="w-48">
                  <label className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2 block">
                    Series Filter
                  </label>
                  <Select value={seriesFilter} onValueChange={(v) => setSeriesFilter(v as 'all' | 'last3')}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Series</SelectItem>
                      <SelectItem value="last3">Last 3 Matches</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button 
                  onClick={handleFetchTeamStats}
                  disabled={isLoadingTeam || !selectedTeam}
                  className="gap-2"
                >
                  <ChartBar size={18} weight="duotone" />
                  {isLoadingTeam ? 'Loading...' : 'Fetch Stats'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {teamStats && teamStats.game.count > 0 ? (
            renderTeamStats(teamStats)
          ) : teamStats === null ? (
            <Card className="glow-border">
              <CardContent className="py-12 text-center">
                <Users size={48} weight="duotone" className="text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Select a team and click "Fetch Stats" to view detailed statistics
                </p>
              </CardContent>
            </Card>
          ) : (
            <Card className="glow-border">
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">
                  No statistics available for this team
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
