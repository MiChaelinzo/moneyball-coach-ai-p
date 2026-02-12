import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { TrendInsightCard } from './TrendInsightCard'
import { ExportButton } from './ExportButton'
import { 
  Brain, 
  TrendUp, 
  TrendDown, 
  ChartLine, 
  Users, 
  Target,
  Lightning,
  Sparkle
} from '@phosphor-icons/react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import type { Match, Mistake, Player } from '@/lib/types'
import { 
  analyzeLongTermTrends, 
  generateMultiMatchAIInsight,
  type MultiMatchAnalysis 
} from '@/lib/trendAnalysis'
import { exportMatchesToCSV, exportMistakesToCSV, downloadFile, type ExportFormat } from '@/lib/exportUtils'

interface MultiMatchAnalysisViewProps {
  matches: Match[]
  mistakes: Mistake[]
  players: Player[]
}

function generateTrendAnalysisPDF(matches: Match[], mistakes: Mistake[], analysis: MultiMatchAnalysis | null): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body {
      font-family: 'Space Grotesk', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      color: #1a1a1a;
      line-height: 1.6;
      padding: 40px;
      max-width: 1200px;
      margin: 0 auto;
    }
    h1 {
      color: #00c8ff;
      border-bottom: 3px solid #00c8ff;
      padding-bottom: 10px;
      margin-bottom: 30px;
    }
    h2 {
      color: #333;
      margin-top: 30px;
      border-left: 4px solid #00c8ff;
      padding-left: 15px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 20px 0;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    th {
      background-color: #00c8ff;
      color: white;
      padding: 12px;
      text-align: left;
      font-weight: 600;
      text-transform: uppercase;
      font-size: 12px;
    }
    td {
      padding: 10px 12px;
      border-bottom: 1px solid #e0e0e0;
    }
  </style>
</head>
<body>
  <h1>Multi-Match Trend Analysis</h1>
  <p>Generated: ${new Date().toLocaleString()}</p>
  <p>Analysis Period: ${matches.length} matches</p>
  
  <h2>Match Results</h2>
  <table>
    <thead>
      <tr>
        <th>Date</th>
        <th>Opponent</th>
        <th>Result</th>
        <th>Score</th>
        <th>Duration</th>
      </tr>
    </thead>
    <tbody>
      ${matches.slice(0, 20).map(m => `
        <tr>
          <td>${m.date}</td>
          <td>${m.opponent}</td>
          <td>${m.result.toUpperCase()}</td>
          <td>${m.score || 'N/A'}</td>
          <td>${Math.round(m.duration / 60)} min</td>
        </tr>
      `).join('')}
    </tbody>
  </table>
  
  <h2>Mistake Summary</h2>
  <p>Total Mistakes Tracked: ${mistakes.length}</p>
</body>
</html>
  `
}

export function MultiMatchAnalysisView({ matches, mistakes, players }: MultiMatchAnalysisViewProps) {
  const [analysis, setAnalysis] = useState<MultiMatchAnalysis | null>(null)
  const [aiInsight, setAiInsight] = useState<string>('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  useEffect(() => {
    if (matches.length > 0 && mistakes.length > 0 && players.length > 0 && !analysis) {
      performAnalysis()
    }
  }, [])

  const performAnalysis = () => {
    setIsAnalyzing(true)
    setAiInsight('')
    setTimeout(() => {
      const result = analyzeLongTermTrends(matches, mistakes, players)
      setAnalysis(result)
      setIsAnalyzing(false)
    }, 500)
  }

  const handleGenerateAIInsight = async () => {
    if (!analysis) return
    
    setIsGenerating(true)
    toast.info('AI analyzing long-term trends...')
    
    const insight = await generateMultiMatchAIInsight(analysis, matches, mistakes)
    setAiInsight(insight)
    setIsGenerating(false)
    toast.success('Long-term analysis complete!')
  }

  const handleExport = (format: ExportFormat) => {
    const timestamp = new Date().toISOString().split('T')[0]
    
    if (format === 'csv') {
      const sections: string[] = []
      sections.push('MULTI-MATCH TREND ANALYSIS')
      sections.push(`Generated: ${new Date().toLocaleString()}\n`)
      sections.push('MATCH HISTORY')
      sections.push(exportMatchesToCSV(matches))
      sections.push('\nMISTAKE TRENDS')
      sections.push(exportMistakesToCSV(mistakes))
      
      const csv = sections.join('\n')
      downloadFile(csv, `multi-match-analysis-${timestamp}.csv`, 'text/csv')
    } else if (format === 'pdf') {
      const html = generateTrendAnalysisPDF(matches, mistakes, analysis)
      const printWindow = window.open('', '_blank')
      if (printWindow) {
        printWindow.document.write(html)
        printWindow.document.close()
        printWindow.focus()
        setTimeout(() => {
          printWindow.print()
        }, 250)
      }
    }
  }

  if (isAnalyzing) {
    return (
      <Card className="glow-border">
        <CardContent className="py-12 text-center">
          <Brain size={48} weight="duotone" className="text-primary mx-auto mb-4 animate-pulse" />
          <p className="text-muted-foreground">Analyzing trends across {matches.length} matches...</p>
        </CardContent>
      </Card>
    )
  }

  if (!analysis) {
    return (
      <Card className="glow-border">
        <CardContent className="py-12 text-center">
          <ChartLine size={48} weight="duotone" className="text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground mb-4">No analysis data available</p>
          <Button onClick={performAnalysis}>Run Analysis</Button>
        </CardContent>
      </Card>
    )
  }

  const playerTrendsArray = Array.from(analysis.playerTrends.values())

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-semibold">Multi-Match Trend Analysis</h2>
          <p className="text-sm text-muted-foreground">
            Comprehensive analysis across {matches.length} matches
          </p>
        </div>
        <ExportButton
          onExport={handleExport}
          label="Export Analysis"
          variant="outline"
        />
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
                  <Brain size={24} weight="duotone" className="text-primary" />
                </div>
                <div>
                  <CardTitle className="text-xl">Long-Term Insights</CardTitle>
                  <CardDescription>
                    Analysis of {analysis.totalMatches} matches • {analysis.timeframe}
                  </CardDescription>
                </div>
              </div>
              <Button 
                onClick={handleGenerateAIInsight}
                disabled={isGenerating}
                className="gap-2"
              >
                <Sparkle size={18} weight="duotone" />
                {isGenerating ? 'Analyzing...' : 'Generate AI Summary'}
              </Button>
            </div>
          </CardHeader>
          {aiInsight && (
            <CardContent>
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
                      AI Strategic Insight
                    </div>
                    <p className="text-sm leading-relaxed text-foreground">
                      {aiInsight}
                    </p>
                  </div>
                </div>
              </motion.div>
            </CardContent>
          )}
        </Card>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="glow-border-success">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <TrendUp size={20} weight="duotone" className="text-success" />
              <CardTitle className="text-sm uppercase tracking-wide text-muted-foreground">
                Overall Trends
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="font-mono text-3xl font-bold text-foreground mb-1">
              {analysis.overallTrends.length}
            </div>
            <p className="text-xs text-muted-foreground">
              Long-term patterns identified
            </p>
          </CardContent>
        </Card>

        <Card className="glow-border-warning">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Target size={20} weight="duotone" className="text-warning" />
              <CardTitle className="text-sm uppercase tracking-wide text-muted-foreground">
                Category Trends
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="font-mono text-3xl font-bold text-foreground mb-1">
              {analysis.categoryTrends.length}
            </div>
            <p className="text-xs text-muted-foreground">
              Mistake categories tracked
            </p>
          </CardContent>
        </Card>

        <Card className="glow-border">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Lightning size={20} weight="duotone" className="text-primary" />
              <CardTitle className="text-sm uppercase tracking-wide text-muted-foreground">
                Correlations
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="font-mono text-3xl font-bold text-foreground mb-1">
              {analysis.correlations.length}
            </div>
            <p className="text-xs text-muted-foreground">
              Pattern correlations found
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="trends" className="space-y-6">
        <TabsList className="grid w-full max-w-xl grid-cols-4">
          <TabsTrigger value="trends" className="flex items-center gap-2">
            <ChartLine size={18} weight="duotone" />
            <span className="hidden sm:inline">Trends</span>
          </TabsTrigger>
          <TabsTrigger value="players" className="flex items-center gap-2">
            <Users size={18} weight="duotone" />
            <span className="hidden sm:inline">Players</span>
          </TabsTrigger>
          <TabsTrigger value="categories" className="flex items-center gap-2">
            <Target size={18} weight="duotone" />
            <span className="hidden sm:inline">Categories</span>
          </TabsTrigger>
          <TabsTrigger value="correlations" className="flex items-center gap-2">
            <Lightning size={18} weight="duotone" />
            <span className="hidden sm:inline">Patterns</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="trends" className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-4">Long-Term Trends</h3>
            <div className="grid gap-6">
              {analysis.overallTrends.map((trend, index) => (
                <TrendInsightCard key={trend.id} insight={trend} index={index} />
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="players" className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-4">Player Trend Analysis</h3>
            <div className="grid gap-6">
              {playerTrendsArray.map((playerTrend, index) => (
                <motion.div
                  key={playerTrend.playerId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.3 }}
                >
                  <Card className="glow-border">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-xl">{playerTrend.playerName}</CardTitle>
                          <CardDescription>Performance trends over {analysis.totalMatches} matches</CardDescription>
                        </div>
                        <div className="text-right">
                          <div className={`font-mono text-2xl font-bold ${
                            playerTrend.improvementRate > 0 ? 'text-success' : 
                            playerTrend.improvementRate < 0 ? 'text-destructive' : 'text-warning'
                          }`}>
                            {playerTrend.improvementRate > 0 ? '+' : ''}{playerTrend.improvementRate.toFixed(0)}%
                          </div>
                          <div className="text-xs text-muted-foreground uppercase tracking-wide">
                            Improvement
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">
                          Mistake Frequency Over Time
                        </div>
                        <div className="flex items-end gap-2 h-20">
                          {playerTrend.mistakeFrequency.map((point, idx) => {
                            const maxCount = Math.max(...playerTrend.mistakeFrequency.map(p => p.count), 1)
                            const height = (point.count / maxCount) * 100
                            
                            return (
                              <div
                                key={idx}
                                className="flex-1 bg-warning/20 rounded-t hover:bg-warning/40 transition-colors relative group"
                                style={{ height: `${height || 5}%` }}
                              >
                                <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-popover text-popover-foreground text-xs px-2 py-1 rounded whitespace-nowrap pointer-events-none z-10">
                                  {point.date}: {point.count} mistakes
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>

                      {playerTrend.topIssues.length > 0 && (
                        <div>
                          <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                            Top Issues
                          </div>
                          <div className="grid gap-2">
                            {playerTrend.topIssues.map(issue => {
                              const TrendIcon = issue.trend === 'improving' ? TrendUp :
                                               issue.trend === 'declining' ? TrendDown : TrendUp
                              const trendColor = issue.trend === 'improving' ? 'text-success' :
                                                issue.trend === 'declining' ? 'text-destructive' : 'text-warning'
                              
                              return (
                                <div 
                                  key={issue.category}
                                  className="flex items-center justify-between p-3 bg-card rounded-lg border border-border"
                                >
                                  <div className="flex items-center gap-3">
                                    <Badge variant="outline" className="text-xs">
                                      {issue.category}
                                    </Badge>
                                    <span className="font-mono text-sm font-semibold">
                                      {issue.count} occurrences
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <TrendIcon size={16} weight="bold" className={trendColor} />
                                    <span className={`text-xs uppercase tracking-wide ${trendColor}`}>
                                      {issue.trend}
                                    </span>
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="categories" className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-4">Mistake Category Trends</h3>
            <div className="grid gap-4">
              {analysis.categoryTrends.map((category, index) => {
                const TrendIcon = category.trend === 'increasing' ? TrendUp :
                                 category.trend === 'decreasing' ? TrendDown : TrendUp
                const trendColor = category.trend === 'decreasing' ? 'text-success' :
                                  category.trend === 'increasing' ? 'text-destructive' : 'text-warning'
                
                return (
                  <motion.div
                    key={category.category}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.3 }}
                  >
                    <Card className="glow-border">
                      <CardContent className="py-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                              <TrendIcon size={24} weight="bold" className={trendColor} />
                              <div>
                                <h4 className="font-semibold capitalize">{category.category}</h4>
                                <p className="text-xs text-muted-foreground">
                                  Peak: {category.peakPeriod}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-6">
                            <div className="text-center">
                              <div className="font-mono text-xl font-bold text-foreground">
                                {category.occurrences}
                              </div>
                              <div className="text-xs text-muted-foreground uppercase tracking-wide">
                                Total
                              </div>
                            </div>
                            <div className="text-center">
                              <div className={`font-mono text-xl font-bold ${
                                category.impactOnWinRate < 0 ? 'text-destructive' : 'text-success'
                              }`}>
                                {category.impactOnWinRate > 0 ? '+' : ''}{category.impactOnWinRate.toFixed(1)}%
                              </div>
                              <div className="text-xs text-muted-foreground uppercase tracking-wide">
                                Win Impact
                              </div>
                            </div>
                            <div className="text-center">
                              <div className="font-mono text-xl font-bold text-foreground">
                                {category.affectedMatches.length}
                              </div>
                              <div className="text-xs text-muted-foreground uppercase tracking-wide">
                                Matches
                              </div>
                            </div>
                            <Badge variant="outline" className={`${trendColor} border-current`}>
                              {category.trend}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="correlations" className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-4">Pattern Correlations</h3>
            {analysis.correlations.length > 0 ? (
              <div className="grid gap-6">
                {analysis.correlations.map((correlation, index) => (
                  <motion.div
                    key={correlation.pattern}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.3 }}
                  >
                    <Card className="glow-border-warning bg-warning/5">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-warning/20">
                              <Lightning size={24} weight="duotone" className="text-warning" />
                            </div>
                            <div>
                              <CardTitle className="text-lg">{correlation.pattern}</CardTitle>
                              <CardDescription>
                                Found in {correlation.matchIds.length} matches
                              </CardDescription>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-mono text-2xl font-bold text-warning">
                              {(correlation.strength * 100).toFixed(0)}%
                            </div>
                            <div className="text-xs text-muted-foreground uppercase tracking-wide">
                              Correlation
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-sm leading-relaxed text-foreground">
                          {correlation.description}
                        </p>
                        <div className="p-3 bg-primary/10 rounded-lg border border-primary/20">
                          <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                            Recommendation
                          </div>
                          <p className="text-sm leading-relaxed text-foreground">
                            {correlation.recommendation}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            ) : (
              <Card className="glow-border">
                <CardContent className="py-12 text-center">
                  <Lightning size={48} weight="duotone" className="text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    No strong correlations detected. More data may be needed.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
