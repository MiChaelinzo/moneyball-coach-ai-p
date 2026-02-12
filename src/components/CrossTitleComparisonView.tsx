import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CrossTitleBarChart } from '@/components/CrossTitleBarChart'
import { 
  fetchPlayerStatistics, 
  type PlayerStatistics 
} from '@/lib/gridApi'
import { 
  ChartBar, 
  TrendUp, 
  Target, 
  GameController, 
  Trophy,
  Crosshair,
  ArrowsClockwise,
  Table as TableIcon
} from '@phosphor-icons/react'
import { toast } from 'sonner'
import { motion } from 'framer-motion'
import type { Player, GameTitle } from '@/lib/types'

interface CrossTitleComparisonViewProps {
  players: Player[]
}

interface TitleStats {
  title: GameTitle
  stats: PlayerStatistics | null
  isLoading: boolean
  player: Player | null
}

interface ComparisonMetric {
  name: string
  lol: number | string
  valorant: number | string
  cs2: number | string
  unit?: string
}

const TITLE_COLORS: Record<Exclude<GameTitle, 'All'>, string> = {
  'LoL': 'oklch(0.60 0.15 265)',
  'Valorant': 'oklch(0.62 0.18 25)',
  'CS2': 'oklch(0.58 0.12 195)',
}

const TITLE_DISPLAY: Record<Exclude<GameTitle, 'All'>, string> = {
  'LoL': 'League of Legends',
  'Valorant': 'Valorant',
  'CS2': 'CS2',
}

export function CrossTitleComparisonView({ players }: CrossTitleComparisonViewProps) {
  const [selectedPlayers, setSelectedPlayers] = useState<{
    LoL: string
    Valorant: string
    CS2: string
  }>({
    LoL: '',
    Valorant: '',
    CS2: '',
  })

  const [titleStats, setTitleStats] = useState<{
    LoL: TitleStats
    Valorant: TitleStats
    CS2: TitleStats
  }>({
    LoL: { title: 'LoL', stats: null, isLoading: false, player: null },
    Valorant: { title: 'Valorant', stats: null, isLoading: false, player: null },
    CS2: { title: 'CS2', stats: null, isLoading: false, player: null },
  })

  const [isRefreshing, setIsRefreshing] = useState(false)
  const [hasLoadedInitially, setHasLoadedInitially] = useState(false)

  const lolPlayers = players.filter(p => p.title === 'LoL')
  const valorantPlayers = players.filter(p => p.title === 'Valorant')
  const cs2Players = players.filter(p => p.title === 'CS2')

  useEffect(() => {
    if (lolPlayers.length > 0 && !selectedPlayers.LoL) {
      setSelectedPlayers(prev => ({ ...prev, LoL: lolPlayers[0].id }))
    }
    if (valorantPlayers.length > 0 && !selectedPlayers.Valorant) {
      setSelectedPlayers(prev => ({ ...prev, Valorant: valorantPlayers[0].id }))
    }
    if (cs2Players.length > 0 && !selectedPlayers.CS2) {
      setSelectedPlayers(prev => ({ ...prev, CS2: cs2Players[0].id }))
    }
  }, [players])

  const fetchStatsForTitle = async (title: Exclude<GameTitle, 'All'>) => {
    const playerId = selectedPlayers[title]
    if (!playerId) return

    setTitleStats(prev => ({
      ...prev,
      [title]: { ...prev[title], isLoading: true }
    }))

    try {
      const stats = await fetchPlayerStatistics(playerId)
      const player = players.find(p => p.id === playerId)
      
      setTitleStats(prev => ({
        ...prev,
        [title]: { 
          title, 
          stats, 
          isLoading: false,
          player: player || null
        }
      }))
    } catch (error) {
      console.error(`Failed to fetch ${title} stats:`, error)
      setTitleStats(prev => ({
        ...prev,
        [title]: { ...prev[title], stats: null, isLoading: false }
      }))
      toast.error(`Failed to load ${title} statistics`)
    }
  }

  const handleLoadStatistics = async () => {
    setIsRefreshing(true)
    setHasLoadedInitially(true)
    const titles: Array<Exclude<GameTitle, 'All'>> = ['LoL', 'Valorant', 'CS2']
    
    try {
      const promises = titles
        .filter(title => selectedPlayers[title])
        .map(title => fetchStatsForTitle(title))
      
      await Promise.all(promises)
      toast.success('Statistics loaded successfully')
    } catch (error) {
      toast.error('Some statistics failed to load')
    } finally {
      setIsRefreshing(false)
    }
  }

  const handleRefreshAll = async () => {
    if (!hasLoadedInitially) {
      handleLoadStatistics()
      return
    }

    setIsRefreshing(true)
    const titles: Array<Exclude<GameTitle, 'All'>> = ['LoL', 'Valorant', 'CS2']
    
    try {
      const promises = titles
        .filter(title => selectedPlayers[title])
        .map(title => fetchStatsForTitle(title))
      
      await Promise.all(promises)
      toast.success('All statistics refreshed')
    } catch (error) {
      toast.error('Some statistics failed to refresh')
    } finally {
      setIsRefreshing(false)
    }
  }

  const getComparisonMetrics = (): ComparisonMetric[] => {
    const lolStats = titleStats.LoL.stats
    const valorantStats = titleStats.Valorant.stats
    const cs2Stats = titleStats.CS2.stats

    const getLolWinRate = () => {
      if (!lolStats || lolStats.game.count === 0) return 'N/A'
      const wins = lolStats.game.wins.find(w => w.value === true)
      return wins ? `${wins.percentage.toFixed(1)}%` : '0%'
    }

    const getValorantWinRate = () => {
      if (!valorantStats || valorantStats.game.count === 0) return 'N/A'
      const wins = valorantStats.game.wins.find(w => w.value === true)
      return wins ? `${wins.percentage.toFixed(1)}%` : '0%'
    }

    const getCS2WinRate = () => {
      if (!cs2Stats || cs2Stats.game.count === 0) return 'N/A'
      const wins = cs2Stats.game.wins.find(w => w.value === true)
      return wins ? `${wins.percentage.toFixed(1)}%` : '0%'
    }

    const getLolKDA = () => {
      if (!lolStats) return 'N/A'
      const segment = lolStats.segment[0]
      if (!segment || segment.deaths.avg === 0) return lolStats.series.kills.avg.toFixed(2)
      return (lolStats.series.kills.avg / segment.deaths.avg).toFixed(2)
    }

    const getValorantKDA = () => {
      if (!valorantStats) return 'N/A'
      const segment = valorantStats.segment[0]
      if (!segment || segment.deaths.avg === 0) return valorantStats.series.kills.avg.toFixed(2)
      return (valorantStats.series.kills.avg / segment.deaths.avg).toFixed(2)
    }

    const getCS2KDA = () => {
      if (!cs2Stats) return 'N/A'
      const segment = cs2Stats.segment[0]
      if (!segment || segment.deaths.avg === 0) return cs2Stats.series.kills.avg.toFixed(2)
      return (cs2Stats.series.kills.avg / segment.deaths.avg).toFixed(2)
    }

    return [
      {
        name: 'Games Played',
        lol: lolStats?.game.count || 'N/A',
        valorant: valorantStats?.game.count || 'N/A',
        cs2: cs2Stats?.game.count || 'N/A',
      },
      {
        name: 'Win Rate',
        lol: getLolWinRate(),
        valorant: getValorantWinRate(),
        cs2: getCS2WinRate(),
      },
      {
        name: 'Avg Kills per Series',
        lol: lolStats?.series.kills.avg.toFixed(1) || 'N/A',
        valorant: valorantStats?.series.kills.avg.toFixed(1) || 'N/A',
        cs2: cs2Stats?.series.kills.avg.toFixed(1) || 'N/A',
      },
      {
        name: 'KD Ratio',
        lol: getLolKDA(),
        valorant: getValorantKDA(),
        cs2: getCS2KDA(),
      },
      {
        name: 'Max Kills (Single Series)',
        lol: lolStats?.series.kills.max || 'N/A',
        valorant: valorantStats?.series.kills.max || 'N/A',
        cs2: cs2Stats?.series.kills.max || 'N/A',
      },
      {
        name: 'Avg Deaths per Round',
        lol: lolStats?.segment[0]?.deaths.avg.toFixed(2) || 'N/A',
        valorant: valorantStats?.segment[0]?.deaths.avg.toFixed(2) || 'N/A',
        cs2: cs2Stats?.segment[0]?.deaths.avg.toFixed(2) || 'N/A',
      },
    ]
  }

  const metrics = getComparisonMetrics()
  const hasAnyStats = titleStats.LoL.stats || titleStats.Valorant.stats || titleStats.CS2.stats

  const getChartData = () => {
    const getKD = (stats: PlayerStatistics | null) => {
      if (!stats) return 0
      const segment = stats.segment[0]
      if (!segment || segment.deaths.avg === 0) return stats.series.kills.avg
      return stats.series.kills.avg / segment.deaths.avg
    }

    return {
      winRate: [
        { 
          title: 'LoL' as Exclude<GameTitle, 'All'>, 
          value: titleStats.LoL.stats?.game.wins.find(w => w.value === true)?.percentage || 0, 
          color: TITLE_COLORS.LoL,
          label: 'League of Legends'
        },
        { 
          title: 'Valorant' as Exclude<GameTitle, 'All'>, 
          value: titleStats.Valorant.stats?.game.wins.find(w => w.value === true)?.percentage || 0, 
          color: TITLE_COLORS.Valorant,
          label: 'Valorant'
        },
        { 
          title: 'CS2' as Exclude<GameTitle, 'All'>, 
          value: titleStats.CS2.stats?.game.wins.find(w => w.value === true)?.percentage || 0, 
          color: TITLE_COLORS.CS2,
          label: 'CS2'
        },
      ],
      gamesPlayed: [
        { 
          title: 'LoL' as Exclude<GameTitle, 'All'>, 
          value: titleStats.LoL.stats?.game.count || 0, 
          color: TITLE_COLORS.LoL,
          label: 'League of Legends'
        },
        { 
          title: 'Valorant' as Exclude<GameTitle, 'All'>, 
          value: titleStats.Valorant.stats?.game.count || 0, 
          color: TITLE_COLORS.Valorant,
          label: 'Valorant'
        },
        { 
          title: 'CS2' as Exclude<GameTitle, 'All'>, 
          value: titleStats.CS2.stats?.game.count || 0, 
          color: TITLE_COLORS.CS2,
          label: 'CS2'
        },
      ],
      kdRatio: [
        { 
          title: 'LoL' as Exclude<GameTitle, 'All'>, 
          value: getKD(titleStats.LoL.stats), 
          color: TITLE_COLORS.LoL,
          label: 'League of Legends'
        },
        { 
          title: 'Valorant' as Exclude<GameTitle, 'All'>, 
          value: getKD(titleStats.Valorant.stats), 
          color: TITLE_COLORS.Valorant,
          label: 'Valorant'
        },
        { 
          title: 'CS2' as Exclude<GameTitle, 'All'>, 
          value: getKD(titleStats.CS2.stats), 
          color: TITLE_COLORS.CS2,
          label: 'CS2'
        },
      ],
      avgKills: [
        { 
          title: 'LoL' as Exclude<GameTitle, 'All'>, 
          value: titleStats.LoL.stats?.series.kills.avg || 0, 
          color: TITLE_COLORS.LoL,
          label: 'League of Legends'
        },
        { 
          title: 'Valorant' as Exclude<GameTitle, 'All'>, 
          value: titleStats.Valorant.stats?.series.kills.avg || 0, 
          color: TITLE_COLORS.Valorant,
          label: 'Valorant'
        },
        { 
          title: 'CS2' as Exclude<GameTitle, 'All'>, 
          value: titleStats.CS2.stats?.series.kills.avg || 0, 
          color: TITLE_COLORS.CS2,
          label: 'CS2'
        },
      ],
    }
  }

  const chartData = hasAnyStats ? getChartData() : null

  const renderTitleCard = (title: Exclude<GameTitle, 'All'>) => {
    const titleData = titleStats[title]
    const playersList = title === 'LoL' ? lolPlayers : title === 'Valorant' ? valorantPlayers : cs2Players
    const selectedId = selectedPlayers[title]
    const selectedPlayer = titleData.player

    return (
      <Card className="border-2" style={{ borderColor: TITLE_COLORS[title] }}>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: TITLE_COLORS[title] }}
              />
              <span>{TITLE_DISPLAY[title]}</span>
            </div>
            {titleData.isLoading && (
              <ArrowsClockwise size={20} className="animate-spin text-muted-foreground" />
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2 block">
              Select Player
            </label>
            <Select 
              value={selectedId} 
              onValueChange={(value) => setSelectedPlayers(prev => ({ ...prev, [title]: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder={`Select ${title} player`} />
              </SelectTrigger>
              <SelectContent>
                {playersList.length > 0 ? (
                  playersList.map(player => (
                    <SelectItem key={player.id} value={player.id}>
                      {player.name} - {player.role}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="none" disabled>
                    No {title} players available
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          {selectedPlayer && (
            <div className="p-3 bg-muted/30 rounded-lg">
              <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                Selected Player
              </div>
              <div className="font-semibold">{selectedPlayer.name}</div>
              <div className="text-sm text-muted-foreground">{selectedPlayer.role}</div>
              <div className="flex gap-2 mt-2">
                <Badge variant="outline" className="font-mono text-xs">
                  {selectedPlayer.kda.toFixed(2)} KDA
                </Badge>
                <Badge variant="outline" className="font-mono text-xs">
                  {selectedPlayer.winRate}% WR
                </Badge>
              </div>
            </div>
          )}

          {titleData.stats && (
            <div className="space-y-2 pt-2 border-t border-border">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Games</span>
                <span className="font-mono font-semibold">{titleData.stats.game.count}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Series</span>
                <span className="font-mono font-semibold">{titleData.stats.series.count}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Total Kills</span>
                <span className="font-mono font-semibold">{titleData.stats.series.kills.sum}</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold flex items-center gap-3">
            <GameController size={32} weight="duotone" className="text-primary" />
            Cross-Title Performance Comparison
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Compare player statistics across League of Legends, Valorant, and CS2
          </p>
        </div>
        <Button 
          onClick={handleRefreshAll}
          disabled={isRefreshing}
          className="gap-2"
        >
          <ArrowsClockwise size={18} className={isRefreshing ? 'animate-spin' : ''} />
          Refresh All
        </Button>
      </div>

      <div className="p-4 bg-gradient-to-br from-primary/10 to-accent/5 border border-primary/30 rounded-lg">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
          <span className="text-xs font-semibold uppercase tracking-wide text-primary">
            Live Cross-Title Analytics
          </span>
        </div>
        <p className="text-sm text-muted-foreground">
          Real-time statistics from GRID API comparing performance across multiple esports titles. 
          Select players from each game to see side-by-side performance metrics.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {renderTitleCard('LoL')}
        {renderTitleCard('Valorant')}
        {renderTitleCard('CS2')}
      </div>

      {hasAnyStats && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Tabs defaultValue="table" className="space-y-6">
            <TabsList className="grid w-full max-w-md grid-cols-2 mx-auto">
              <TabsTrigger value="table" className="flex items-center gap-2">
                <TableIcon size={16} weight="duotone" />
                Table View
              </TabsTrigger>
              <TabsTrigger value="charts" className="flex items-center gap-2">
                <ChartBar size={16} weight="duotone" />
                Chart View
              </TabsTrigger>
            </TabsList>

            <TabsContent value="table">
              <Card className="glow-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <TableIcon size={24} weight="duotone" className="text-primary" />
                    Performance Comparison Matrix
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left py-3 px-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                            Metric
                          </th>
                          <th className="text-center py-3 px-4 text-sm font-semibold uppercase tracking-wide" style={{ color: TITLE_COLORS.LoL }}>
                            League of Legends
                          </th>
                          <th className="text-center py-3 px-4 text-sm font-semibold uppercase tracking-wide" style={{ color: TITLE_COLORS.Valorant }}>
                            Valorant
                          </th>
                          <th className="text-center py-3 px-4 text-sm font-semibold uppercase tracking-wide" style={{ color: TITLE_COLORS.CS2 }}>
                            CS2
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {metrics.map((metric, idx) => (
                          <motion.tr
                            key={metric.name}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className="border-b border-border/50 hover:bg-muted/20 transition-colors"
                          >
                            <td className="py-4 px-4 font-medium">{metric.name}</td>
                            <td className="py-4 px-4 text-center">
                              <span className="font-mono text-lg font-semibold" style={{ color: TITLE_COLORS.LoL }}>
                                {metric.lol}
                              </span>
                            </td>
                            <td className="py-4 px-4 text-center">
                              <span className="font-mono text-lg font-semibold" style={{ color: TITLE_COLORS.Valorant }}>
                                {metric.valorant}
                              </span>
                            </td>
                            <td className="py-4 px-4 text-center">
                              <span className="font-mono text-lg font-semibold" style={{ color: TITLE_COLORS.CS2 }}>
                                {metric.cs2}
                              </span>
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="charts">
              {chartData && (
                <div className="grid md:grid-cols-2 gap-6">
                  <CrossTitleBarChart
                    title="Win Rate Comparison"
                    data={chartData.winRate}
                    maxValue={100}
                    unit="%"
                  />
                  <CrossTitleBarChart
                    title="Games Played"
                    data={chartData.gamesPlayed}
                  />
                  <CrossTitleBarChart
                    title="Kill/Death Ratio"
                    data={chartData.kdRatio}
                  />
                  <CrossTitleBarChart
                    title="Average Kills per Series"
                    data={chartData.avgKills}
                  />
                </div>
              )}
            </TabsContent>
          </Tabs>
        </motion.div>
      )}

      {hasAnyStats && (
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="glow-border-success">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Trophy size={20} weight="duotone" className="text-success" />
                Best Win Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              {(() => {
                const winRates = [
                  { title: 'LoL', rate: titleStats.LoL.stats?.game.wins.find(w => w.value === true)?.percentage || 0, color: TITLE_COLORS.LoL },
                  { title: 'Valorant', rate: titleStats.Valorant.stats?.game.wins.find(w => w.value === true)?.percentage || 0, color: TITLE_COLORS.Valorant },
                  { title: 'CS2', rate: titleStats.CS2.stats?.game.wins.find(w => w.value === true)?.percentage || 0, color: TITLE_COLORS.CS2 },
                ].sort((a, b) => b.rate - a.rate)

                const best = winRates[0]
                return (
                  <div className="space-y-3">
                    <div>
                      <div className="text-3xl font-bold font-mono" style={{ color: best.color }}>
                        {best.rate.toFixed(1)}%
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        {TITLE_DISPLAY[best.title as Exclude<GameTitle, 'All'>]}
                      </div>
                    </div>
                    <div className="space-y-2 pt-3 border-t border-border">
                      {winRates.map((item, idx) => (
                        <div key={item.title} className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">#{idx + 1} {item.title}</span>
                          <span className="font-mono font-semibold" style={{ color: item.color }}>
                            {item.rate.toFixed(1)}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })()}
            </CardContent>
          </Card>

          <Card className="glow-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Target size={20} weight="duotone" className="text-primary" />
                Most Active Title
              </CardTitle>
            </CardHeader>
            <CardContent>
              {(() => {
                const gameCounts = [
                  { title: 'LoL', count: titleStats.LoL.stats?.game.count || 0, color: TITLE_COLORS.LoL },
                  { title: 'Valorant', count: titleStats.Valorant.stats?.game.count || 0, color: TITLE_COLORS.Valorant },
                  { title: 'CS2', count: titleStats.CS2.stats?.game.count || 0, color: TITLE_COLORS.CS2 },
                ].sort((a, b) => b.count - a.count)

                const most = gameCounts[0]
                return (
                  <div className="space-y-3">
                    <div>
                      <div className="text-3xl font-bold font-mono" style={{ color: most.color }}>
                        {most.count}
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        {TITLE_DISPLAY[most.title as Exclude<GameTitle, 'All'>]} games
                      </div>
                    </div>
                    <div className="space-y-2 pt-3 border-t border-border">
                      {gameCounts.map((item, idx) => (
                        <div key={item.title} className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">#{idx + 1} {item.title}</span>
                          <span className="font-mono font-semibold" style={{ color: item.color }}>
                            {item.count}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })()}
            </CardContent>
          </Card>

          <Card className="glow-border-warning">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Crosshair size={20} weight="duotone" className="text-warning" />
                Best KD Ratio
              </CardTitle>
            </CardHeader>
            <CardContent>
              {(() => {
                const getKD = (stats: PlayerStatistics | null) => {
                  if (!stats) return 0
                  const segment = stats.segment[0]
                  if (!segment || segment.deaths.avg === 0) return stats.series.kills.avg
                  return stats.series.kills.avg / segment.deaths.avg
                }

                const kdRatios = [
                  { title: 'LoL', kd: getKD(titleStats.LoL.stats), color: TITLE_COLORS.LoL },
                  { title: 'Valorant', kd: getKD(titleStats.Valorant.stats), color: TITLE_COLORS.Valorant },
                  { title: 'CS2', kd: getKD(titleStats.CS2.stats), color: TITLE_COLORS.CS2 },
                ].sort((a, b) => b.kd - a.kd)

                const best = kdRatios[0]
                return (
                  <div className="space-y-3">
                    <div>
                      <div className="text-3xl font-bold font-mono" style={{ color: best.color }}>
                        {best.kd.toFixed(2)}
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        {TITLE_DISPLAY[best.title as Exclude<GameTitle, 'All'>]}
                      </div>
                    </div>
                    <div className="space-y-2 pt-3 border-t border-border">
                      {kdRatios.map((item, idx) => (
                        <div key={item.title} className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">#{idx + 1} {item.title}</span>
                          <span className="font-mono font-semibold" style={{ color: item.color }}>
                            {item.kd.toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })()}
            </CardContent>
          </Card>
        </div>
      )}

      {!hasAnyStats && !isRefreshing && (
        <Card className="border-dashed">
          <CardContent className="py-12 text-center">
            <GameController size={48} weight="duotone" className="text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">
              Select players from each title to start comparing performance
            </p>
            <Button 
              onClick={handleLoadStatistics} 
              disabled={!selectedPlayers.LoL && !selectedPlayers.Valorant && !selectedPlayers.CS2}
              className="gap-2"
            >
              <ChartBar size={18} weight="duotone" />
              Load Statistics
            </Button>
          </CardContent>
        </Card>
      )}
      
      {!hasAnyStats && isRefreshing && (
        <Card className="border-dashed">
          <CardContent className="py-12 text-center">
            <ArrowsClockwise size={48} weight="duotone" className="text-primary mx-auto mb-4 animate-spin" />
            <p className="text-muted-foreground">
              Loading statistics from GRID API...
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
