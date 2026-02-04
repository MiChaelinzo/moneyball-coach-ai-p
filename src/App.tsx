import { useState, useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { InsightCard } from '@/components/InsightCard'
import { PlayerCard } from '@/components/PlayerCard'
import { StrategicImpactView } from '@/components/StrategicImpactView'
import { PlayerAnalyticsView } from '@/components/PlayerAnalyticsView'
import { PlayerBiographyView } from '@/components/PlayerBiographyView'
import { LiveMatchTracker } from '@/components/LiveMatchTracker'
import { LiveGameSelector } from '@/components/LiveGameSelector'
import { GridApiSetup } from '@/components/GridApiSetup'
import { DataSourceIndicator } from '@/components/DataSourceIndicator'
import { MultiMatchAnalysisView } from '@/components/MultiMatchAnalysisView'
import { GridApiTestPanel } from '@/components/GridApiTestPanel'
import { MatchReplayManager } from '@/components/MatchReplayManager'
import { MistakeHeatmap } from '@/components/MistakeHeatmap'
import { TournamentsView } from '@/components/TournamentsView'
import { SeriesFormatsView } from '@/components/SeriesFormatsView'
import { UpcomingSeriesView } from '@/components/UpcomingSeriesView'
import { OrganizationView } from '@/components/OrganizationView'
import { TeamsView } from '@/components/TeamsView'
import { SeriesStateTracker } from '@/components/SeriesStateTracker'
import { StatisticsView } from '@/components/StatisticsView'
import { CrossTitleComparisonView } from '@/components/CrossTitleComparisonView'
import { TitleRecommendationView } from '@/components/TitleRecommendationView'
import { ExportButton } from '@/components/ExportButton'
import { BatchBiographyEnricher } from '@/components/BatchBiographyEnricher'
import { PlayerTransferHistoryView } from '@/components/PlayerTransferHistoryView'
import { DynamicBackground } from '@/components/DynamicBackground'
import { MouseTrail } from '@/components/MouseTrail'
import { FloatingParticles } from '@/components/FloatingParticles'
import { AnimatedCloud9Logo } from '@/components/AnimatedCloud9Logo'
import { EnergyBeams } from '@/components/EnergyBeams'
import { TabSearch, type TabItem } from '@/components/TabSearch'
import { TabFilter } from '@/components/TabFilter'
import { AIChatSupport } from '@/components/AIChatSupport'
import { FileUploadGuide } from '@/components/FileUploadGuide'
import { ChartBar, Users, Target, Cpu, Sparkle, Crosshair, ChartLine, ClockCounterClockwise, MapPin, Trophy, ListBullets, CalendarBlank, GameController, ChartLineUp, ArrowsLeftRight, Lightbulb, ArrowsClockwise } from '@phosphor-icons/react'
import { PLAYERS, INSIGHTS, STRATEGIC_IMPACTS, getPlayerAnalytics, MATCHES, MISTAKES, generateAIInsight } from '@/lib/mockData'
import { mergeEnrichedData } from '@/lib/biographyEnrichment'
import { useLiveMatch } from '@/hooks/use-live-match'
import { useGridData } from '@/hooks/use-grid-data'
import { useKV } from '@github/spark/hooks'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { Player, Match } from '@/lib/types'
import { 
    exportTeamAnalytics, 
    exportPlayerAnalytics,
    type ExportFormat,
    type TeamAnalyticsExport,
    type PlayerAnalyticsExport
} from '@/lib/exportUtils'

function App() {
    const gridData = useGridData()
    const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null)
    const [selectedMatch, setSelectedMatch] = useState<string>('')
    const [aiInsight, setAiInsight] = useState<string>('')
    const [isGeneratingInsight, setIsGeneratingInsight] = useState(false)
    const [hasAutoFetched, setHasAutoFetched] = useState(false)
    const [titleFilter, setTitleFilter] = useState<string>('All')
    const [enrichedPlayers, setEnrichedPlayers] = useState<Player[]>([])
    const [activeTab, setActiveTab] = useState('dashboard')
    const [filteredTabsList, setFilteredTabsList] = useState<TabItem[]>([])
    const [importedPlayers, setImportedPlayers] = useKV<Player[]>('imported-players', [])
    const { 
        liveMatch, 
        toggleTracking, 
        setGridGame, 
        resetMatch,
        autoDetectEnabled,
        toggleAutoDetect,
        checkForLiveGames,
        isCheckingForGames,
        isUsingGridData,
    } = useLiveMatch()

    const players: Player[] = enrichedPlayers.length > 0 
        ? [...enrichedPlayers, ...(importedPlayers || [])]
        : (gridData.players.length > 0 ? [...gridData.players, ...(importedPlayers || [])] : [...PLAYERS, ...(importedPlayers || [])])
    const matches: Match[] = gridData.matches.length > 0 ? gridData.matches : MATCHES
    
    const filteredPlayers = titleFilter === 'All' 
        ? players 
        : players.filter(p => p.title === titleFilter)
    
    useEffect(() => {
        const loadEnrichedData = async () => {
            const basePlayers = gridData.players.length > 0 ? gridData.players : PLAYERS
            const merged = await mergeEnrichedData(basePlayers)
            if (merged.some(p => p.biography || (p.careerHistory && p.careerHistory.length > 0))) {
                setEnrichedPlayers(merged)
            }
        }
        loadEnrichedData()
    }, [gridData.players])
    
    useEffect(() => {
        if (gridData.isInitialized && !hasAutoFetched && !gridData.hasCachedData) {
            setHasAutoFetched(true)
            setTimeout(() => {
                gridData.fetchData(false)
            }, 1000)
        }
    }, [gridData.isInitialized, hasAutoFetched, gridData.hasCachedData])
    
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

    const handleExportTeamAnalytics = (format: ExportFormat) => {
        const exportData: TeamAnalyticsExport = {
            players,
            matches,
            mistakes: MISTAKES,
            insights: INSIGHTS,
            strategicImpacts: STRATEGIC_IMPACTS,
            teams: gridData.teams,
            generatedAt: new Date().toLocaleString(),
            reportTitle: `${gridData.organization?.name || 'Cloud9'} Team Analytics Report`
        }
        exportTeamAnalytics(exportData, format)
    }

    const handleExportPlayerAnalytics = (format: ExportFormat) => {
        if (!selectedPlayer || !selectedPlayerAnalytics) {
            toast.error('Please select a player first')
            return
        }

        const player = players.find(p => p.id === selectedPlayer)
        if (!player) return

        const playerMistakes = MISTAKES.filter(m => m.playerId === selectedPlayer)
        const playerMatches = matches.slice(0, 10)

        const exportData: PlayerAnalyticsExport = {
            player,
            analytics: selectedPlayerAnalytics,
            recentMatches: playerMatches,
            mistakes: playerMistakes,
            generatedAt: new Date().toLocaleString()
        }
        exportPlayerAnalytics(exportData, format)
    }

    const handleEnrichmentComplete = (updatedPlayers: Player[]) => {
        setEnrichedPlayers(updatedPlayers)
        toast.success('Player biographies have been updated!')
    }

    const handleDataImport = async (importedData: {
        players?: Player[]
        matches?: Match[]
        tournaments?: any[]
        teams?: any[]
    }) => {
        try {
            if (importedData.players && importedData.players.length > 0) {
                const existingPlayers = enrichedPlayers.length > 0 ? enrichedPlayers : players
                const newPlayers: Player[] = importedData.players.map((p, idx) => ({
                    id: p.id || `imported-player-${Date.now()}-${idx}`,
                    name: p.name || (p as any).nickname || 'Unknown',
                    title: p.title || 'LoL',
                    role: p.role || 'Player',
                    kda: typeof p.kda === 'number' ? p.kda : 0,
                    winRate: typeof p.winRate === 'number' ? p.winRate : 0,
                    gamesPlayed: typeof p.gamesPlayed === 'number' ? p.gamesPlayed : 0,
                    biography: p.biography,
                    careerHistory: p.careerHistory
                }))
                
                const mergedPlayers = [...existingPlayers, ...newPlayers]
                setEnrichedPlayers(mergedPlayers)
                
                setImportedPlayers((current) => [...(current || []), ...newPlayers])
            }

            toast.success('Data imported successfully!')
        } catch (error) {
            toast.error('Failed to import data')
            console.error('Import error:', error)
        }
    }

    const selectedPlayerAnalytics = selectedPlayer ? getPlayerAnalytics(selectedPlayer) : null

    const availableTabs: TabItem[] = [
        { value: 'dashboard', label: 'Dashboard', icon: <ChartBar size={18} weight="duotone" />, keywords: ['home', 'overview', 'main'] },
        { value: 'players', label: 'Players', icon: <Users size={18} weight="duotone" />, keywords: ['roster', 'team members', 'athletes'] },
        { value: 'teams', label: 'Teams', icon: <Trophy size={18} weight="duotone" />, keywords: ['squads', 'rosters'] },
        { value: 'organization', label: 'Organization', icon: <Cpu size={18} weight="duotone" />, keywords: ['cloud9', 'org', 'company'] },
        { value: 'statistics', label: 'Statistics', icon: <ChartLineUp size={18} weight="duotone" />, keywords: ['stats', 'numbers', 'data', 'metrics'] },
        { value: 'insights', label: 'Insights', icon: <Sparkle size={18} weight="duotone" />, keywords: ['ai', 'analysis', 'recommendations'] },
        { value: 'live', label: 'Live Match', icon: <Crosshair size={18} weight="duotone" />, keywords: ['current', 'ongoing', 'real-time', 'active'] },
        { value: 'trends', label: 'Trends', icon: <ChartLine size={18} weight="duotone" />, keywords: ['patterns', 'analysis', 'multi-match'] },
        { value: 'heatmap', label: 'Heatmap', icon: <MapPin size={18} weight="duotone" />, keywords: ['mistakes', 'visualization', 'map'] },
        { value: 'replay', label: 'Replay', icon: <ClockCounterClockwise size={18} weight="duotone" />, keywords: ['history', 'review', 'past matches'] },
        { value: 'cross-title', label: 'Cross-Title', icon: <ArrowsLeftRight size={18} weight="duotone" />, keywords: ['comparison', 'games', 'lol', 'valorant', 'cs2'] },
        { value: 'recommendations', label: 'Recommendations', icon: <Lightbulb size={18} weight="duotone" />, keywords: ['suggestions', 'ai', 'advice'] },
        { value: 'transfers', label: 'Transfers', icon: <ArrowsClockwise size={18} weight="duotone" />, keywords: ['history', 'movement', 'roster changes'] },
        { value: 'series-state', label: 'Series State', icon: <GameController size={18} weight="duotone" />, keywords: ['match state', 'series', 'games'] },
        { value: 'upcoming', label: 'Upcoming', icon: <CalendarBlank size={18} weight="duotone" />, keywords: ['schedule', 'future', 'calendar'] },
        { value: 'tournaments', label: 'Tournaments', icon: <Trophy size={18} weight="duotone" />, keywords: ['competitions', 'events'] },
        { value: 'formats', label: 'Formats', icon: <ListBullets size={18} weight="duotone" />, keywords: ['series formats', 'match types'] },
        { value: 'strategic', label: 'Strategic', icon: <Target size={18} weight="duotone" />, keywords: ['impact', 'strategy', 'macro'] },
    ]

    const displayedTabs = filteredTabsList.length > 0 ? filteredTabsList : availableTabs

    useEffect(() => {
        setFilteredTabsList(availableTabs)
    }, [])

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
            <DynamicBackground />
            <MouseTrail />
            <FloatingParticles />
            <AnimatedCloud9Logo />
            <EnergyBeams />
            <div className="relative overflow-hidden">
                
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
                                            <p className="text-sm text-muted-foreground">
                                                {gridData.organization?.name || 'Cloud9'} Esports Analytics Platform
                                            </p>
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
                                    <ExportButton
                                        onExport={handleExportTeamAnalytics}
                                        label="Export Report"
                                        variant="default"
                                    />
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
                        <div className="mb-8 space-y-6">
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

                            <GridApiTestPanel
                                onTestFetch={async () => await gridData.fetchData(true)}
                                players={players}
                                matches={matches}
                                tournaments={gridData.tournaments}
                                organization={gridData.organization}
                                teams={gridData.teams}
                                isLoading={gridData.isLoading}
                                error={gridData.error}
                                isInitialized={gridData.isInitialized}
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
                                        {players.length}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="mb-6 flex items-center justify-between">
                            <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
                            <TabSearch 
                                tabs={availableTabs}
                                currentTab={activeTab}
                                onTabSelect={setActiveTab}
                            />
                        </div>

                        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
                            <div className="space-y-4">
                                <TabFilter 
                                    tabs={availableTabs}
                                    onFilterChange={setFilteredTabsList}
                                />
                                <TabsList className="flex flex-wrap w-full mx-auto gap-1 h-auto p-1.5 bg-card/50 backdrop-blur-sm">
                                    {displayedTabs.map((tab) => (
                                        <TabsTrigger 
                                            key={tab.value} 
                                            value={tab.value} 
                                            className="flex items-center gap-1.5 px-3 py-2"
                                        >
                                            {tab.icon}
                                            <span>{tab.label}</span>
                                        </TabsTrigger>
                                    ))}
                                </TabsList>
                                {displayedTabs.length === 0 && (
                                    <div className="text-center py-8 text-muted-foreground">
                                        No tabs found. Clear the filter to see all tabs.
                                    </div>
                                )}
                            </div>

                            <TabsContent value="organization" className="space-y-6">
                                <OrganizationView 
                                    organization={gridData.organization} 
                                    isLoading={gridData.isLoading}
                                />
                            </TabsContent>

                            <TabsContent value="teams" className="space-y-6">
                                <TeamsView 
                                    teams={gridData.teams} 
                                    isLoading={gridData.isLoading}
                                />
                            </TabsContent>

                            <TabsContent value="transfers" className="space-y-6">
                                <PlayerTransferHistoryView players={players} />
                            </TabsContent>

                            <TabsContent value="statistics" className="space-y-6">
                                <StatisticsView
                                    players={players}
                                    teams={gridData.teams}
                                    matches={matches}
                                />
                            </TabsContent>

                            <TabsContent value="cross-title" className="space-y-6">
                                <CrossTitleComparisonView
                                    players={players}
                                />
                            </TabsContent>

                            <TabsContent value="recommendations" className="space-y-6">
                                <TitleRecommendationView
                                    players={players}
                                />
                            </TabsContent>

                            <TabsContent value="live" className="space-y-6">
                                <LiveGameSelector
                                    onSelectGame={(gameId, opponent) => setGridGame(gameId, opponent)}
                                    autoDetectEnabled={autoDetectEnabled}
                                    onToggleAutoDetect={toggleAutoDetect}
                                    isCheckingForGames={isCheckingForGames}
                                    onCheckForGames={checkForLiveGames}
                                    currentGameId={liveMatch.id}
                                    isUsingGridData={isUsingGridData}
                                />
                                <LiveMatchTracker 
                                    match={liveMatch} 
                                    onToggleTracking={toggleTracking}
                                    onReset={resetMatch}
                                    isUsingGridData={isUsingGridData}
                                />
                            </TabsContent>

                            <TabsContent value="series-state" className="space-y-6">
                                <SeriesStateTracker />
                            </TabsContent>

                            <TabsContent value="upcoming" className="space-y-6">
                                <UpcomingSeriesView />
                            </TabsContent>

                            <TabsContent value="replay" className="space-y-6">
                                <MatchReplayManager
                                    matches={matches}
                                    mistakes={MISTAKES}
                                />
                            </TabsContent>

                            <TabsContent value="heatmap" className="space-y-6">
                                <MistakeHeatmap mistakes={MISTAKES} />
                            </TabsContent>

                            <TabsContent value="trends" className="space-y-6">
                                <MultiMatchAnalysisView
                                    matches={matches}
                                    mistakes={MISTAKES}
                                    players={players}
                                />
                            </TabsContent>

                            <TabsContent value="dashboard" className="space-y-8">
                                <div className="grid lg:grid-cols-2 gap-6">
                                    <BatchBiographyEnricher 
                                        players={players}
                                        onEnrichmentComplete={handleEnrichmentComplete}
                                    />
                                    <FileUploadGuide />
                                </div>

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
                                                                    {match.date} - vs {match.opponent} ({match.result.toUpperCase()}) {match.score ? `${match.score}` : ''}
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
                                    <div className="flex items-center justify-between mb-6">
                                        <h2 className="text-2xl font-semibold">Team Roster</h2>
                                        <div className="w-48">
                                            <Select value={titleFilter} onValueChange={setTitleFilter}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Filter by title" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="All">All Games</SelectItem>
                                                    <SelectItem value="LoL">League of Legends</SelectItem>
                                                    <SelectItem value="Valorant">Valorant</SelectItem>
                                                    <SelectItem value="CS2">CS2</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                                        {filteredPlayers.map(player => (
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
                                        className="space-y-4"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h3 className="text-xl font-semibold">Player Analytics</h3>
                                                <p className="text-sm text-muted-foreground">
                                                    Detailed performance breakdown
                                                </p>
                                            </div>
                                            <ExportButton
                                                onExport={handleExportPlayerAnalytics}
                                                label="Export Player Report"
                                                variant="outline"
                                            />
                                        </div>
                                        <PlayerAnalyticsView analytics={selectedPlayerAnalytics} />
                                        {selectedPlayer && (
                                            <PlayerBiographyView 
                                                player={players.find(p => p.id === selectedPlayer)!}
                                            />
                                        )}
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
                                    <ExportButton
                                        onExport={handleExportTeamAnalytics}
                                        label="Export Insights"
                                        variant="outline"
                                    />
                                </div>
                                <div className="grid gap-6">
                                    {INSIGHTS.map((insight, index) => (
                                        <InsightCard key={insight.id} insight={insight} index={index} />
                                    ))}
                                </div>
                            </TabsContent>

                            <TabsContent value="players" className="space-y-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <h2 className="text-2xl font-semibold">Player Analytics</h2>
                                        <p className="text-sm text-muted-foreground">
                                            Select a player to view detailed performance metrics
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-48">
                                            <Select value={titleFilter} onValueChange={setTitleFilter}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Filter by title" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="All">All Games</SelectItem>
                                                    <SelectItem value="LoL">League of Legends</SelectItem>
                                                    <SelectItem value="Valorant">Valorant</SelectItem>
                                                    <SelectItem value="CS2">CS2</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <ExportButton
                                            onExport={handleExportPlayerAnalytics}
                                            label="Export Player Report"
                                            variant="outline"
                                            disabled={!selectedPlayer}
                                        />
                                    </div>
                                </div>

                                <BatchBiographyEnricher 
                                    players={players}
                                    onEnrichmentComplete={handleEnrichmentComplete}
                                />
                                
                                <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
                                    {filteredPlayers.map(player => (
                                        <PlayerCard
                                            key={player.id}
                                            player={player}
                                            isSelected={selectedPlayer === player.id}
                                            onClick={() => setSelectedPlayer(player.id)}
                                        />
                                    ))}
                                </div>

                                {selectedPlayerAnalytics ? (
                                    <div className="space-y-6">
                                        <PlayerAnalyticsView analytics={selectedPlayerAnalytics} />
                                        {selectedPlayer && (
                                            <PlayerBiographyView 
                                                player={players.find(p => p.id === selectedPlayer)!}
                                            />
                                        )}
                                    </div>
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

                            <TabsContent value="tournaments">
                                <TournamentsView tournaments={gridData.tournaments} />
                            </TabsContent>

                            <TabsContent value="formats">
                                <SeriesFormatsView />
                            </TabsContent>

                            <TabsContent value="strategic">
                                <StrategicImpactView impacts={STRATEGIC_IMPACTS} />
                            </TabsContent>
                        </Tabs>
                    </main>
                </div>
            </div>
            <AIChatSupport onDataImport={handleDataImport} />
        </div>
    )
}

export default App