import { useState, useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { InsightCard } from '@/components/InsightCard'
import { PlayerCard } from '@/components/PlayerCard'
import { StrategicImpactView } from '@/components/StrategicImpactView'
import { PlayerAnalyticsView } from '@/components/PlayerAnalyticsView'
import { LiveMatchTracker } from '@/components/LiveMatchTracker'
import { GridApiSetup } from '@/components/GridApiSetup'
import { DataSourceIndicator } from '@/components/DataSourceIndicator'
import { MultiMatchAnalysisView } from '@/components/MultiMatchAnalysisView'
import { ChartBar, Users, Target, Cpu, Sparkle, Crosshair, ChartLine } from '@phosphor-icons/react'
import { PLAYERS, INSIGHTS, STRATEGIC_IMPACTS, getPlayerAnalytics, MATCHES, MISTAKES, generateAIInsight } from '@/lib/mockData'
import { useLiveMatch } from '@/hooks/use-live-match'
import { useGridData } from '@/hooks/use-grid-data'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { Player, Match } from '@/lib/types'

function App() {
    const gridData = useGridData()
    const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null)
    const [selectedMatch, setSelectedMatch] = useState<string>('')
    const [aiInsight, setAiInsight] = useState<string>('')
    const [isGeneratingInsight, setIsGeneratingInsight] = useState(false)
    const { liveMatch, toggleTracking } = useLiveMatch()

    const players: Player[] = gridData.players.length > 0 ? gridData.players : PLAYERS
    const matches: Match[] = gridData.matches.length > 0 ? gridData.matches : MATCHES
    
    useEffect(() => {
        if (matches.length > 0 && !selectedMatch) {
            setSelectedMatch(matches[0].id)
        }
    }, [matches, selectedMatch])

    const handleGenerateAIInsight = async () => {
        setIsGeneratingInsight(true)
        const match = matches.find(m => m.id === selectedMatch)
        if (!match) {
            setIsGeneratingInsight(false)
            return
        }
        const matchMistakes = MISTAKES.filter(m => m.matchId === selectedMatch)
        
        toast.info('AI analyzing match data...')
        const insight = await generateAIInsight(match, matchMistakes)
        setAiInsight(insight)
        setIsGeneratingInsight(false)
        toast.success('Analysis complete!')
    }

    const selectedPlayerAnalytics = selectedPlayer ? getPlayerAnalytics(selectedPlayer) : null

    const teamStats = {
        avgWinRate: players.length > 0 
            ? Math.round(players.reduce((sum, p) => sum + p.winRate, 0) / players.length)
            : 0,
        totalGames: players.length > 0 ? players[0].gamesPlayed : 0,
        totalMistakes: MISTAKES.length,
        criticalInsights: INSIGHTS.filter(i => i.severity === 'critical').length
    }

    return (
        <div className="min-h-screen bg-background text-foreground">
            <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
                <div 
                    className="absolute inset-0 opacity-30"
                    style={{
                        backgroundImage: `repeating-linear-gradient(
                            0deg,
                            transparent,
                            transparent 2px,
                            oklch(0.72 0.16 195 / 0.03) 2px,
                            oklch(0.72 0.16 195 / 0.03) 4px
                        )`
                    }}
                />
                
                <div className="relative">
                    <header className="border-b border-border/50 backdrop-blur-sm bg-background/80">
                        <div className="container mx-auto px-6 py-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                                        <Cpu size={28} weight="duotone" className="text-primary-foreground" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h1 className="text-3xl font-bold tracking-tight">Assistant Coach</h1>
                                            {gridData.isInitialized && (
                                                <span className="px-2 py-1 text-xs font-semibold uppercase tracking-wide rounded-full bg-success/20 text-success border border-success/40">
                                                    Live Data
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <p className="text-sm text-muted-foreground">Cloud9 Esports Analytics Platform</p>
                                            <span className="text-muted-foreground">·</span>
                                            <DataSourceIndicator
                                                isLiveData={gridData.isInitialized}
                                                hasCachedData={gridData.hasCachedData && !gridData.isInitialized}
                                                isLoading={gridData.isLoading}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="text-right">
                                        <div className="font-mono text-2xl font-bold text-success">
                                            {teamStats.avgWinRate}%
                                        </div>
                                        <div className="text-xs text-muted-foreground uppercase tracking-wide">
                                            Team Win Rate
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </header>

                    <main className="container mx-auto px-6 py-8">
                        <div className="mb-8">
                            <GridApiSetup
                                isInitialized={gridData.isInitialized}
                                hasApiKey={gridData.apiKey.length > 0}
                                isLoading={gridData.isLoading}
                                error={gridData.error}
                                onInitialize={gridData.initializeApi}
                                onFetchData={gridData.fetchData}
                                onClearKey={gridData.clearApiKey}
                                hasCachedData={gridData.hasCachedData}
                            />
                        </div>

                        <div className="grid lg:grid-cols-4 gap-6 mb-8">
                            <Card className="glow-border">
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-sm uppercase tracking-wide text-muted-foreground">
                                        Total Games
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="font-mono text-3xl font-bold text-foreground">
                                        {teamStats.totalGames}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="glow-border-warning">
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-sm uppercase tracking-wide text-muted-foreground">
                                        Tracked Mistakes
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="font-mono text-3xl font-bold text-warning">
                                        {teamStats.totalMistakes}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="glow-border-destructive">
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-sm uppercase tracking-wide text-muted-foreground">
                                        Critical Insights
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="font-mono text-3xl font-bold text-destructive">
                                        {teamStats.criticalInsights}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="glow-border-success">
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-sm uppercase tracking-wide text-muted-foreground">
                                        Players Analyzed
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="font-mono text-3xl font-bold text-success">
                                        {PLAYERS.length}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <Tabs defaultValue="dashboard" className="space-y-8">
                            <TabsList className="grid w-full max-w-3xl grid-cols-6 mx-auto">
                                <TabsTrigger value="live" className="flex items-center gap-2">
                                    <Crosshair size={18} weight="duotone" />
                                    <span className="hidden sm:inline">Live</span>
                                </TabsTrigger>
                                <TabsTrigger value="dashboard" className="flex items-center gap-2">
                                    <ChartBar size={18} weight="duotone" />
                                    <span className="hidden sm:inline">Dashboard</span>
                                </TabsTrigger>
                                <TabsTrigger value="trends" className="flex items-center gap-2">
                                    <ChartLine size={18} weight="duotone" />
                                    <span className="hidden sm:inline">Trends</span>
                                </TabsTrigger>
                                <TabsTrigger value="insights" className="flex items-center gap-2">
                                    <Sparkle size={18} weight="duotone" />
                                    <span className="hidden sm:inline">Insights</span>
                                </TabsTrigger>
                                <TabsTrigger value="players" className="flex items-center gap-2">
                                    <Users size={18} weight="duotone" />
                                    <span className="hidden sm:inline">Players</span>
                                </TabsTrigger>
                                <TabsTrigger value="strategic" className="flex items-center gap-2">
                                    <Target size={18} weight="duotone" />
                                    <span className="hidden sm:inline">Strategic</span>
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="live" className="space-y-6">
                                <LiveMatchTracker match={liveMatch} onToggleTracking={toggleTracking} />
                            </TabsContent>

                            <TabsContent value="trends" className="space-y-6">
                                <MultiMatchAnalysisView
                                    matches={matches}
                                    mistakes={MISTAKES}
                                    players={players}
                                />
                            </TabsContent>

                            <TabsContent value="dashboard" className="space-y-8">
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    <Card className="glow-border bg-gradient-to-br from-primary/10 to-accent/5">
                                        <CardHeader>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 rounded-lg bg-primary/20">
                                                        <Cpu size={24} weight="duotone" className="text-primary" />
                                                    </div>
                                                    <div>
                                                        <CardTitle className="text-xl">AI-Powered Match Analysis</CardTitle>
                                                        <p className="text-sm text-muted-foreground">
                                                            Generate intelligent insights from match data
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="flex items-end gap-4">
                                                <div className="flex-1">
                                                    <label className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2 block">
                                                        Select Match
                                                    </label>
                                                    <Select value={selectedMatch} onValueChange={setSelectedMatch}>
                                                        <SelectTrigger>
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {matches.map(match => (
                                                                <SelectItem key={match.id} value={match.id}>
                                                                    {match.date} - vs {match.opponent} ({match.result.toUpperCase()})
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <Button 
                                                    onClick={handleGenerateAIInsight}
                                                    disabled={isGeneratingInsight}
                                                    className="gap-2"
                                                >
                                                    <Cpu size={18} weight="duotone" />
                                                    {isGeneratingInsight ? 'Analyzing...' : 'Generate Analysis'}
                                                </Button>
                                            </div>

                                            {aiInsight && (
                                                <motion.div
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: 'auto' }}
                                                    transition={{ duration: 0.3 }}
                                                    className="p-4 bg-primary/10 border border-primary/30 rounded-lg"
                                                >
                                                    <div className="flex items-start gap-3">
                                                        <Sparkle size={20} weight="duotone" className="text-primary mt-1 flex-shrink-0" />
                                                        <div>
                                                            <div className="text-sm font-semibold text-primary uppercase tracking-wide mb-2">
                                                                AI Insight
                                                            </div>
                                                            <p className="text-sm leading-relaxed text-foreground">
                                                                {aiInsight}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </CardContent>
                                    </Card>
                                </motion.div>

                                <div>
                                    <h2 className="text-2xl font-semibold mb-6">Team Roster</h2>
                                    <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                                        {players.map(player => (
                                            <PlayerCard
                                                key={player.id}
                                                player={player}
                                                isSelected={selectedPlayer === player.id}
                                                onClick={() => setSelectedPlayer(player.id)}
                                            />
                                        ))}
                                    </div>
                                </div>

                                {selectedPlayerAnalytics && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5 }}
                                    >
                                        <PlayerAnalyticsView analytics={selectedPlayerAnalytics} />
                                    </motion.div>
                                )}
                            </TabsContent>

                            <TabsContent value="insights" className="space-y-6">
                                <div className="flex items-center justify-between mb-6">
                                    <div>
                                        <h2 className="text-2xl font-semibold">AI-Generated Insights</h2>
                                        <p className="text-sm text-muted-foreground">
                                            Pattern recognition and strategic recommendations
                                        </p>
                                    </div>
                                </div>
                                <div className="grid gap-6">
                                    {INSIGHTS.map((insight, index) => (
                                        <InsightCard key={insight.id} insight={insight} index={index} />
                                    ))}
                                </div>
                            </TabsContent>

                            <TabsContent value="players" className="space-y-6">
                                <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
                                    {players.map(player => (
                                        <PlayerCard
                                            key={player.id}
                                            player={player}
                                            isSelected={selectedPlayer === player.id}
                                            onClick={() => setSelectedPlayer(player.id)}
                                        />
                                    ))}
                                </div>

                                {selectedPlayerAnalytics ? (
                                    <PlayerAnalyticsView analytics={selectedPlayerAnalytics} />
                                ) : (
                                    <Card className="glow-border">
                                        <CardContent className="py-12 text-center">
                                            <Users size={48} weight="duotone" className="text-muted-foreground mx-auto mb-4" />
                                            <p className="text-muted-foreground">
                                                Select a player to view detailed analytics
                                            </p>
                                        </CardContent>
                                    </Card>
                                )}
                            </TabsContent>

                            <TabsContent value="strategic">
                                <StrategicImpactView impacts={STRATEGIC_IMPACTS} />
                            </TabsContent>
                        </Tabs>
                    </main>
                </div>
            </div>
        </div>
    )
}

export default App