import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { PlayerAnalytics } from '@/lib/types'
import { TrendUp, TrendDown, Minus, ChartLine } from '@phosphor-icons/react'

interface PlayerAnalyticsViewProps {
  analytics: PlayerAnalytics
}

export function PlayerAnalyticsView({ analytics }: PlayerAnalyticsViewProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-1">{analytics.playerName}</h2>
        <p className="text-sm text-muted-foreground">Individual Performance Analysis</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <Card className="glow-border-success">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm uppercase tracking-wide text-muted-foreground">
              KDA vs Average
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-2">
              <span className={`font-mono text-3xl font-bold ${
                analytics.comparedToAverage.kda > 0 ? 'text-success' : 'text-destructive'
              }`}>
                {analytics.comparedToAverage.kda > 0 ? '+' : ''}{analytics.comparedToAverage.kda.toFixed(1)}
              </span>
              {analytics.comparedToAverage.kda > 0 ? (
                <TrendUp size={24} weight="bold" className="text-success mb-1" />
              ) : (
                <TrendDown size={24} weight="bold" className="text-destructive mb-1" />
              )}
            </div>
          </CardContent>
        </Card>

        <Card className={analytics.comparedToAverage.mistakeFrequency < 0 ? 'glow-border-success' : 'glow-border-destructive'}>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm uppercase tracking-wide text-muted-foreground">
              Mistake Frequency
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-2">
              <span className={`font-mono text-3xl font-bold ${
                analytics.comparedToAverage.mistakeFrequency < 0 ? 'text-success' : 'text-destructive'
              }`}>
                {analytics.comparedToAverage.mistakeFrequency > 0 ? '+' : ''}{analytics.comparedToAverage.mistakeFrequency.toFixed(1)}
              </span>
              {analytics.comparedToAverage.mistakeFrequency < 0 ? (
                <TrendUp size={24} weight="bold" className="text-success mb-1" />
              ) : (
                <TrendDown size={24} weight="bold" className="text-destructive mb-1" />
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="glow-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm uppercase tracking-wide text-muted-foreground">
              Objective Contribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-2">
              <span className={`font-mono text-3xl font-bold ${
                analytics.comparedToAverage.objectiveContribution > 0 ? 'text-success' : 
                analytics.comparedToAverage.objectiveContribution < 0 ? 'text-destructive' : 'text-muted-foreground'
              }`}>
                {analytics.comparedToAverage.objectiveContribution > 0 ? '+' : ''}{(analytics.comparedToAverage.objectiveContribution * 100).toFixed(0)}%
              </span>
              {analytics.comparedToAverage.objectiveContribution > 0 ? (
                <TrendUp size={24} weight="bold" className="text-success mb-1" />
              ) : analytics.comparedToAverage.objectiveContribution < 0 ? (
                <TrendDown size={24} weight="bold" className="text-destructive mb-1" />
              ) : (
                <Minus size={24} weight="bold" className="text-muted-foreground mb-1" />
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/20">
              <ChartLine size={20} weight="duotone" className="text-primary" />
            </div>
            <CardTitle>Performance Trend (Last 5 Games)</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {analytics.performanceTrend.map((trend, index) => (
              <div key={trend.date} className="flex items-center gap-4">
                <div className="text-sm text-muted-foreground font-mono w-24">
                  {new Date(trend.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </div>
                <div className="flex-1 grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground w-12">KDA:</span>
                    <div className="flex-1 h-2 bg-background rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary"
                        style={{ width: `${Math.min((trend.kda / 8) * 100, 100)}%` }}
                      />
                    </div>
                    <span className="font-mono text-sm font-semibold w-12 text-right">
                      {trend.kda.toFixed(1)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground w-16">Mistakes:</span>
                    <div className="flex-1 h-2 bg-background rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-destructive"
                        style={{ width: `${(trend.mistakes / 5) * 100}%` }}
                      />
                    </div>
                    <span className="font-mono text-sm font-semibold w-8 text-right">
                      {trend.mistakes}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Top Recurring Mistakes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {analytics.topMistakes.length === 0 ? (
              <p className="text-sm text-muted-foreground">No significant recurring patterns detected.</p>
            ) : (
              analytics.topMistakes.map((mistake, index) => (
                <div key={mistake.category} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="font-mono text-2xl font-bold text-muted-foreground">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-semibold capitalize">{mistake.category.replace('-', ' ')}</div>
                      <div className="text-sm text-muted-foreground">
                        {mistake.count} occurrence{mistake.count > 1 ? 's' : ''} in recent matches
                      </div>
                    </div>
                  </div>
                  <Badge 
                    variant="outline"
                    className={`${
                      mistake.trend === 'improving' ? 'border-success text-success' :
                      mistake.trend === 'declining' ? 'border-destructive text-destructive' :
                      'border-muted-foreground text-muted-foreground'
                    }`}
                  >
                    {mistake.trend === 'improving' ? (
                      <TrendUp size={14} weight="bold" className="mr-1" />
                    ) : mistake.trend === 'declining' ? (
                      <TrendDown size={14} weight="bold" className="mr-1" />
                    ) : (
                      <Minus size={14} weight="bold" className="mr-1" />
                    )}
                    {mistake.trend}
                  </Badge>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
