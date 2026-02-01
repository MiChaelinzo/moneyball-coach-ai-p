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
import { ChartBar, TrendUp, TrendDown, Target, Crosshair, User, Users, Funnel, GameController } from '@phosphor-icons/react'
import { toast } from 'sonner'
import type { Player, Team, GameTitle } from '@/lib/types'

interface StatisticsViewProps {
  players: Player[]
  teams: Team[]
  matches: any[]
}

const TITLE_ID_MAP: Record<GameTitle, number | null> = {
  'LoL': 3,
  'Valorant': 6,
  'CS2': 25,
  'All': null,
}

export function StatisticsView({ players, teams, matches }: StatisticsViewProps) {
  const [selectedPlayer, setSelectedPlayer] = useState<string>('')
  const [selectedTeam, setSelectedTeam] = useState<string>('')
  const [playerStats, setPlayerStats] = useState<PlayerStatistics | null>(null)
  const [teamStats, setTeamStats] = useState<TeamStatistics | null>(null)
  const [isLoadingPlayer, setIsLoadingPlayer] = useState(false)
  const [isLoadingTeam, setIsLoadingTeam] = useState(false)
  const [seriesFilter, setSeriesFilter] = useState<'all' | 'last3'>('all')
  const [gameTitleFilter, setGameTitleFilter] = useState<GameTitle>('All')
  const [aggregateStats, setAggregateStats] = useState<{
    totalPlayers: number
    totalTeams: number
    avgGamesPerPlayer: number
    avgWinRate: number
  }>({ totalPlayers: 0, totalTeams: 0, avgGamesPerPlayer: 0, avgWinRate: 0 })

  const filteredPlayers = gameTitleFilter === 'All' 
    ? players 
    : players.filter(p => p.title === gameTitleFilter)

  const filteredTeams = gameTitleFilter === 'All' 
    ? teams 
    : teams.filter(t => t.title === gameTitleFilter)

  useEffect(() => {
    setPlayerStats(null)
    setTeamStats(null)
    if (filteredPlayers.length > 0) {
      setSelectedPlayer(filteredPlayers[0].id)
    }
    if (filteredTeams.length > 0) {
      setSelectedTeam(filteredTeams[0].id)
    }
  }, [gameTitleFilter])

  useEffect(() => {
    const playersToUse = filteredPlayers
    if (playersToUse.length > 0) {
      const totalGames = playersToUse.reduce((sum, p) => sum + (p.gamesPlayed || 0), 0)
      const avgGames = playersToUse.length > 0 ? totalGames / playersToUse.length : 0
      const avgWin = playersToUse.length > 0 
        ? playersToUse.reduce((sum, p) => sum + (p.winRate || 0), 0) / playersToUse.length 
        : 0
      
      setAggregateStats({
        totalPlayers: playersToUse.length,
        totalTeams: filteredTeams.length,
        avgGamesPerPlayer: Math.round(avgGames),
        avgWinRate: Math.round(avgWin),
      })
    }
  }, [filteredPlayers, filteredTeams, gameTitleFilter])

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
    if (filteredPlayers.length > 0 && !selectedPlayer) {
      setSelectedPlayer(filteredPlayers[0].id)
    }
  }, [filteredPlayers, selectedPlayer])

  useEffect(() => {
    if (filteredTeams.length > 0 && !selectedTeam) {
      setSelectedTeam(filteredTeams[0].id)
    }
  }, [filteredTeams, selectedTeam])

  useEffect(() => {
    if (selectedPlayer && !playerStats && !isLoadingPlayer && filteredPlayers.length > 0) {
      const timer = setTimeout(() => {
        handleFetchPlayerStats()
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [selectedPlayer, filteredPlayers.length])

  useEffect(() => {
    if (selectedTeam && !teamStats && !isLoadingTeam && filteredTeams.length > 0) {
      const timer = setTimeout(() => {
        handleFetchTeamStats()
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [selectedTeam, filteredTeams.length])

  const renderPlayerStats = (stats: PlayerStatistics) => {
    const winData = stats.game.wins.find(w => w.value === true)
    const lossData = stats.game.wins.find(w => w.value === false)
    const segment = stats.segment[0]
    const kda = segment && segment.deaths.avg > 0 
      ? (stats.series.kills.avg / segment.deaths.avg).toFixed(2)
      : stats.series.kills.avg.toFixed(2)

    const currentPlayer = filteredPlayers.find(p => p.id === selectedPlayer)

    return (
      <div className="space-y-6">
        <div className="p-4 bg-gradient-to-br from-primary/10 to-accent/5 border border-primary/30 rounded-lg">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            <span className="text-xs font-semibold uppercase tracking-wide text-primary">
              Real-Time Statistics from GRID API
            </span>
            {currentPlayer?.title && (
              <Badge variant="outline" className="ml-auto font-mono text-xs">
                {currentPlayer.title}
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            Statistics pulled directly from GRID's Statistics Feed API. 
            {seriesFilter === 'last3' ? ' Showing data from last 3 matches.' : ' Showing all available data.'}
            {gameTitleFilter !== 'All' && ` Filtered by ${gameTitleFilter}.`}
          </p>
        </div>

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
              <div className="text-xs text-muted-foreground mt-1">
                per series
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
              <div className="text-xs text-muted-foreground mt-1">
                per {segment?.type || 'segment'}
              </div>
            </CardContent>
          </Card>

          <Card className="glow-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-xs uppercase tracking-wide text-muted-foreground">
                KDA Ratio
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="font-mono text-3xl font-bold text-primary">
                {kda}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                kill/death ratio
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
    const kda = segment && segment.deaths.avg > 0 
      ? (stats.series.kills.avg / segment.deaths.avg).toFixed(2)
      : stats.series.kills.avg.toFixed(2)

    const currentTeam = filteredTeams.find(t => t.id === selectedTeam)

    return (
      <div className="space-y-6">
        <div className="p-4 bg-gradient-to-br from-primary/10 to-accent/5 border border-primary/30 rounded-lg">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            <span className="text-xs font-semibold uppercase tracking-wide text-primary">
              Real-Time Statistics from GRID API
            </span>
            {currentTeam?.title && (
              <Badge variant="outline" className="ml-auto font-mono text-xs">
                {currentTeam.title}
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            Team statistics pulled directly from GRID's Statistics Feed API. 
            {seriesFilter === 'last3' ? ' Showing data from last 3 matches.' : ' Showing all available data.'}
            {gameTitleFilter !== 'All' && ` Filtered by ${gameTitleFilter}.`}
          </p>
        </div>

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
              <div className="text-xs text-muted-foreground mt-1">
                per series
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
              <div className="text-xs text-muted-foreground mt-1">
                per {segment?.type || 'segment'}
              </div>
            </CardContent>
          </Card>

          <Card className="glow-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-xs uppercase tracking-wide text-muted-foreground">
                Team KDA
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="font-mono text-3xl font-bold text-primary">
                {kda}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                kill/death ratio
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
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-semibold mb-1">Detailed Statistics</h2>
          <p className="text-sm text-muted-foreground">
            Real-time player and team statistics from GRID API
          </p>
          {players.length === 0 && teams.length === 0 && (
            <div className="mt-2 p-3 bg-warning/10 border border-warning/30 rounded-lg">
              <p className="text-sm text-warning">
                No players or teams available. Initialize GRID API and fetch data first.
              </p>
            </div>
          )}
        </div>
        {(players.length > 0 || teams.length > 0) && (
          <div className="flex items-center gap-2 px-3 py-2 bg-primary/10 border border-primary/30 rounded-lg">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            <span className="text-xs font-semibold uppercase tracking-wide text-primary">
              Live Data Available
            </span>
          </div>
        )}
      </div>

      {(players.length > 0 || teams.length > 0) && (
        <Card className="glow-border bg-gradient-to-br from-primary/5 to-accent/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Funnel size={20} weight="duotone" className="text-primary" />
              Advanced Filtering
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Filter statistics by game title to view title-specific data
            </p>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <label className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2 block">
                  Game Title Filter
                </label>
                <Select value={gameTitleFilter} onValueChange={(v) => setGameTitleFilter(v as GameTitle)}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">
                      <div className="flex items-center gap-2">
                        <GameController size={16} weight="duotone" />
                        All Games
                      </div>
                    </SelectItem>
                    <SelectItem value="LoL">
                      <div className="flex items-center gap-2">
                        <GameController size={16} weight="duotone" />
                        League of Legends
                      </div>
                    </SelectItem>
                    <SelectItem value="Valorant">
                      <div className="flex items-center gap-2">
                        <GameController size={16} weight="duotone" />
                        Valorant
                      </div>
                    </SelectItem>
                    <SelectItem value="CS2">
                      <div className="flex items-center gap-2">
                        <GameController size={16} weight="duotone" />
                        Counter-Strike 2
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="pt-7">
                <Badge variant="outline" className="font-mono">
                  {filteredPlayers.length} players • {filteredTeams.length} teams
                </Badge>
              </div>
            </div>
            {gameTitleFilter !== 'All' && (
              <div className="mt-3 p-3 bg-primary/10 border border-primary/30 rounded-lg">
                <div className="flex items-center gap-2 text-sm text-primary">
                  <Funnel size={16} weight="duotone" />
                  <span className="font-semibold">Active Filter:</span>
                  <span>{gameTitleFilter} statistics only</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {(players.length > 0 || teams.length > 0) && (
        <div className="grid md:grid-cols-4 gap-4">
          <Card className="glow-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-xs uppercase tracking-wide text-muted-foreground flex items-center gap-2">
                <User size={14} weight="duotone" />
                Total Players
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="font-mono text-3xl font-bold text-foreground">
                {aggregateStats.totalPlayers}
              </div>
            </CardContent>
          </Card>

          <Card className="glow-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-xs uppercase tracking-wide text-muted-foreground flex items-center gap-2">
                <Users size={14} weight="duotone" />
                Total Teams
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="font-mono text-3xl font-bold text-foreground">
                {aggregateStats.totalTeams}
              </div>
            </CardContent>
          </Card>

          <Card className="glow-border-success">
            <CardHeader className="pb-3">
              <CardTitle className="text-xs uppercase tracking-wide text-muted-foreground flex items-center gap-2">
                <TrendUp size={14} weight="duotone" />
                Avg Win Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="font-mono text-3xl font-bold text-success">
                {aggregateStats.avgWinRate}%
              </div>
            </CardContent>
          </Card>

          <Card className="glow-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-xs uppercase tracking-wide text-muted-foreground flex items-center gap-2">
                <ChartBar size={14} weight="duotone" />
                Avg Games
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="font-mono text-3xl font-bold text-primary">
                {aggregateStats.avgGamesPerPlayer}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {(filteredPlayers.length > 0 || filteredTeams.length > 0) && (
        <Card className="glow-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ChartBar size={20} weight="duotone" className="text-primary" />
              Team Roster Overview
              {gameTitleFilter !== 'All' && (
                <Badge variant="outline" className="ml-2 font-mono text-xs">
                  {gameTitleFilter}
                </Badge>
              )}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Quick statistics for all players from GRID data
              {gameTitleFilter !== 'All' && ` (filtered by ${gameTitleFilter})`}
            </p>
          </CardHeader>
          <CardContent>
            {filteredPlayers.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 text-xs uppercase tracking-wide text-muted-foreground font-semibold">
                        Player
                      </th>
                      <th className="text-left py-3 px-4 text-xs uppercase tracking-wide text-muted-foreground font-semibold">
                        Role
                      </th>
                      <th className="text-center py-3 px-4 text-xs uppercase tracking-wide text-muted-foreground font-semibold">
                        Games
                      </th>
                      <th className="text-center py-3 px-4 text-xs uppercase tracking-wide text-muted-foreground font-semibold">
                        Win Rate
                      </th>
                      <th className="text-center py-3 px-4 text-xs uppercase tracking-wide text-muted-foreground font-semibold">
                        KDA
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPlayers.map((player) => (
                      <tr 
                        key={player.id} 
                        className="border-b border-border/50 hover:bg-accent/5 transition-colors cursor-pointer"
                        onClick={() => {
                          setSelectedPlayer(player.id)
                          const playerTabTrigger = document.querySelector('[value="player"]') as HTMLElement
                          playerTabTrigger?.click()
                        }}
                      >
                        <td className="py-3 px-4">
                          <div className="font-semibold text-foreground">{player.name}</div>
                        </td>
                        <td className="py-3 px-4">
                          <Badge variant="outline" className="font-mono text-xs">
                            {player.role}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className="font-mono text-sm">{player.gamesPlayed || 0}</span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <Badge 
                            className="font-mono"
                            style={{
                              backgroundColor: `oklch(${player.winRate > 50 ? '0.68 0.18 145' : '0.60 0.22 25'} / 0.2)`,
                              color: player.winRate > 50 ? 'oklch(0.68 0.18 145)' : 'oklch(0.60 0.22 25)',
                              borderColor: player.winRate > 50 ? 'oklch(0.68 0.18 145 / 0.4)' : 'oklch(0.60 0.22 25 / 0.4)',
                            }}
                          >
                            {player.winRate || 0}%
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className="font-mono text-sm font-semibold text-primary">
                            {player.kda?.toFixed(2) || '0.00'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="py-8 text-center text-muted-foreground text-sm">
                No player data available for {gameTitleFilter}. Try selecting a different game title.
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {filteredTeams.length > 0 && (
        <Card className="glow-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users size={20} weight="duotone" className="text-primary" />
              Teams Overview
              {gameTitleFilter !== 'All' && (
                <Badge variant="outline" className="ml-2 font-mono text-xs">
                  {gameTitleFilter}
                </Badge>
              )}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              All teams fetched from GRID API
              {gameTitleFilter !== 'All' && ` (filtered by ${gameTitleFilter})`}
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredTeams.slice(0, 20).map((team) => (
                <div
                  key={team.id}
                  onClick={() => {
                    setSelectedTeam(team.id)
                    const teamTabTrigger = document.querySelector('[value="team"]') as HTMLElement
                    teamTabTrigger?.click()
                  }}
                  className="p-4 border border-border rounded-lg hover:border-primary/50 hover:bg-accent/5 transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    {team.logoUrl && (
                      <img 
                        src={team.logoUrl} 
                        alt={team.name}
                        className="w-10 h-10 rounded object-contain"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm text-foreground truncate group-hover:text-primary transition-colors">
                        {team.name}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        {team.colorPrimary && (
                          <div 
                            className="w-3 h-3 rounded-full border border-border"
                            style={{ backgroundColor: team.colorPrimary }}
                          />
                        )}
                        {team.colorSecondary && (
                          <div 
                            className="w-3 h-3 rounded-full border border-border"
                            style={{ backgroundColor: team.colorSecondary }}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {filteredTeams.length > 20 && (
              <div className="mt-4 pt-4 border-t border-border text-center text-sm text-muted-foreground">
                Showing 20 of {filteredTeams.length} teams
              </div>
            )}
          </CardContent>
        </Card>
      )}

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
                      <SelectValue placeholder="Choose a player..." />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredPlayers.length > 0 ? (
                        filteredPlayers.map(player => (
                          <SelectItem key={player.id} value={player.id}>
                            {player.name} - {player.role}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="none" disabled>No players available for {gameTitleFilter}</SelectItem>
                      )}
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

          {isLoadingPlayer ? (
            <Card className="glow-border">
              <CardContent className="py-12 text-center">
                <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Fetching player statistics from GRID API...
                </p>
              </CardContent>
            </Card>
          ) : playerStats && playerStats.game.count > 0 ? (
            renderPlayerStats(playerStats)
          ) : playerStats === null ? (
            <Card className="glow-border">
              <CardContent className="py-12 text-center">
                <User size={48} weight="duotone" className="text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-2">
                  {filteredPlayers.length > 0 
                    ? "Select a player and click 'Fetch Stats' to view detailed statistics"
                    : `No players available for ${gameTitleFilter}. Try selecting a different game title.`}
                </p>
                {filteredPlayers.length > 0 && (
                  <p className="text-xs text-muted-foreground/70">
                    Statistics are fetched from the GRID Statistics Feed API in real-time
                  </p>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card className="glow-border">
              <CardContent className="py-12 text-center">
                <User size={48} weight="duotone" className="text-warning mx-auto mb-4" />
                <p className="text-muted-foreground mb-2">
                  No statistics available for this player
                </p>
                <p className="text-xs text-muted-foreground/70">
                  This player may not have any recorded match data in the GRID system
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
                      <SelectValue placeholder="Choose a team..." />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredTeams.length > 0 ? (
                        filteredTeams.map(team => (
                          <SelectItem key={team.id} value={team.id}>
                            {team.name}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="none" disabled>No teams available for {gameTitleFilter}</SelectItem>
                      )}
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

          {isLoadingTeam ? (
            <Card className="glow-border">
              <CardContent className="py-12 text-center">
                <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Fetching team statistics from GRID API...
                </p>
              </CardContent>
            </Card>
          ) : teamStats && teamStats.game.count > 0 ? (
            renderTeamStats(teamStats)
          ) : teamStats === null ? (
            <Card className="glow-border">
              <CardContent className="py-12 text-center">
                <Users size={48} weight="duotone" className="text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-2">
                  {filteredTeams.length > 0 
                    ? "Select a team and click 'Fetch Stats' to view detailed statistics"
                    : `No teams available for ${gameTitleFilter}. Try selecting a different game title.`}
                </p>
                {filteredTeams.length > 0 && (
                  <p className="text-xs text-muted-foreground/70">
                    Statistics are fetched from the GRID Statistics Feed API in real-time
                  </p>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card className="glow-border">
              <CardContent className="py-12 text-center">
                <Users size={48} weight="duotone" className="text-warning mx-auto mb-4" />
                <p className="text-muted-foreground mb-2">
                  No statistics available for this team
                </p>
                <p className="text-xs text-muted-foreground/70">
                  This team may not have any recorded match data in the GRID system
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
