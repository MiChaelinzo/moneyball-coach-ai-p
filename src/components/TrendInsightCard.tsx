import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { motion } from 'framer-motion'
import { TrendUp, TrendDown, Minus, Target, Lightning, Brain, ChartLine } from '@phosphor-icons/react'
import type { TrendInsight } from '@/lib/trendAnalysis'

interface TrendInsightCardProps {
  insight: TrendInsight
  index: number
  onSelect?: () => void
}

export function TrendInsightCard({ insight, index, onSelect }: TrendInsightCardProps) {
  const severityColors = {
    critical: 'glow-border-destructive bg-destructive/5',
    high: 'glow-border-warning bg-warning/5',
    medium: 'glow-border bg-primary/5',
    low: 'glow-border-success bg-success/5'
  }

  const typeIcons = {
    pattern: Target,
    trend: ChartLine,
    correlation: Lightning,
    recommendation: Brain
  }

  const trendIcons = {
    improving: TrendUp,
    declining: TrendDown,
    stable: Minus
  }

  const trendColors = {
    improving: 'text-success',
    declining: 'text-destructive',
    stable: 'text-warning'
  }

  const Icon = typeIcons[insight.type]
  const TrendIcon = trendIcons[insight.trendDirection]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.3 }}
    >
      <Card
        className={`${severityColors[insight.severity]} cursor-pointer transition-all hover:scale-[1.02]`}
        onClick={onSelect}
      >
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3 flex-1">
              <div className="p-2 rounded-lg bg-card mt-1">
                <Icon size={20} weight="duotone" className="text-primary" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <CardTitle className="text-lg leading-tight">
                    {insight.title}
                  </CardTitle>
                  <TrendIcon 
                    size={20} 
                    weight="bold" 
                    className={trendColors[insight.trendDirection]}
                  />
                </div>
                <div className="flex flex-wrap gap-2 mb-2">
                  <Badge variant="outline" className="text-xs uppercase tracking-wide">
                    {insight.type}
                  </Badge>
                  <Badge 
                    variant="outline" 
                    className={`text-xs uppercase tracking-wide ${
                      insight.severity === 'critical' ? 'border-destructive text-destructive' :
                      insight.severity === 'high' ? 'border-warning text-warning' :
                      insight.severity === 'medium' ? 'border-primary text-primary' :
                      'border-success text-success'
                    }`}
                  >
                    {insight.severity}
                  </Badge>
                  <Badge variant="outline" className={`text-xs uppercase tracking-wide ${trendColors[insight.trendDirection]}`}>
                    {insight.trendDirection}
                  </Badge>
                </div>
                <CardDescription className="text-xs text-muted-foreground">
                  {insight.matchesAnalyzed.length} matches analyzed • {insight.timeframe}
                </CardDescription>
              </div>
            </div>
            <div className="text-right flex-shrink-0">
              <div className="font-mono text-2xl font-semibold text-primary">
                {(insight.confidence * 100).toFixed(0)}%
              </div>
              <div className="text-xs text-muted-foreground uppercase tracking-wide">
                Confidence
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <CardDescription className="text-sm leading-relaxed">
            {insight.description}
          </CardDescription>

          <div className="grid grid-cols-3 gap-4 p-4 bg-background/50 rounded-lg">
            <div>
              <div className="font-mono text-xl font-semibold text-foreground">
                {(insight.frequency * 100).toFixed(0)}%
              </div>
              <div className="text-xs text-muted-foreground uppercase tracking-wide">
                Frequency
              </div>
            </div>
            <div>
              <div className={`font-mono text-xl font-semibold ${
                insight.impactOnWinRate < 0 ? 'text-destructive' : 'text-success'
              }`}>
                {insight.impactOnWinRate > 0 ? '+' : ''}{insight.impactOnWinRate.toFixed(1)}%
              </div>
              <div className="text-xs text-muted-foreground uppercase tracking-wide">
                Win Rate Impact
              </div>
            </div>
            <div>
              <div className="font-mono text-xl font-semibold text-foreground">
                {insight.matchesAnalyzed.length}
              </div>
              <div className="text-xs text-muted-foreground uppercase tracking-wide">
                Matches
              </div>
            </div>
          </div>

          {insight.historicalData && insight.historicalData.length > 0 && (
            <div className="space-y-2">
              <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Historical Trend
              </div>
              <div className="flex items-end gap-1 h-16">
                {insight.historicalData.map((point, idx) => {
                  const maxValue = Math.max(...insight.historicalData.map(p => p.value), 1)
                  const height = (point.value / maxValue) * 100
                  
                  return (
                    <div
                      key={idx}
                      className="flex-1 bg-primary/20 rounded-t hover:bg-primary/40 transition-colors relative group"
                      style={{ height: `${height}%` }}
                    >
                      <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-popover text-popover-foreground text-xs px-2 py-1 rounded whitespace-nowrap pointer-events-none z-10">
                        {point.date}: {point.value}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          <div className="space-y-2">
            <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Recommendation
            </div>
            <p className="text-sm text-foreground leading-relaxed bg-primary/10 p-3 rounded-lg border border-primary/20">
              {insight.recommendation}
            </p>
          </div>

          {insight.affectedPlayers.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Affected:
              </span>
              {insight.affectedPlayers.map(playerId => {
                const playerNames: Record<string, string> = {
                  '1': 'Fudge',
                  '2': 'Blaber',
                  '3': 'Jensen',
                  '4': 'Berserker',
                  '5': 'Zven'
                }
                return (
                  <Badge key={playerId} variant="secondary" className="text-xs">
                    {playerNames[playerId] || `Player ${playerId}`}
                  </Badge>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
