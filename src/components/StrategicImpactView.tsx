import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { StrategicImpact } from '@/lib/types'
import { Target, TrendDown, Clock, Warning } from '@phosphor-icons/react'

interface StrategicImpactViewProps {
  impacts: StrategicImpact[]
}

export function StrategicImpactView({ impacts }: StrategicImpactViewProps) {
  const sortedImpacts = [...impacts].sort((a, b) => 
    Math.abs(b.winRateImpact) - Math.abs(a.winRateImpact)
  )

  const categoryIcons: Record<string, any> = {
    positioning: Target,
    'decision-making': Warning,
    communication: Warning,
    macro: TrendDown,
    mechanics: Target
  }

  const categoryColors: Record<string, string> = {
    positioning: 'border-destructive/40 bg-destructive/5',
    'decision-making': 'border-warning/40 bg-warning/5',
    communication: 'border-chart-4/40 bg-chart-4/5',
    macro: 'border-chart-2/40 bg-chart-2/5',
    mechanics: 'border-primary/40 bg-primary/5'
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
          <TrendDown size={20} weight="duotone" className="text-primary" />
        </div>
        <div>
          <h2 className="text-2xl font-semibold">Strategic Impact Analysis</h2>
          <p className="text-sm text-muted-foreground">
            How individual mistakes cascade into macro-level outcomes
          </p>
        </div>
      </div>

      <div className="grid gap-4">
        {sortedImpacts.map((impact) => {
          const Icon = categoryIcons[impact.mistakeCategory] || Target
          
          return (
            <Card 
              key={impact.mistakeCategory}
              className={`${categoryColors[impact.mistakeCategory]} border`}
            >
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-card">
                    <Icon size={20} weight="duotone" />
                  </div>
                  <CardTitle className="text-lg capitalize">
                    {impact.mistakeCategory.replace('-', ' ')} Mistakes
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <div className="font-mono text-2xl font-semibold text-foreground">
                      {impact.occurrences}
                    </div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wide">
                      Occurrences
                    </div>
                  </div>
                  <div>
                    <div className="font-mono text-2xl font-semibold text-destructive">
                      {impact.winRateImpact}%
                    </div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wide">
                      Win Rate Impact
                    </div>
                  </div>
                  <div>
                    <div className="font-mono text-2xl font-semibold text-warning">
                      {impact.objectivesLost}
                    </div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wide">
                      Objectives Lost
                    </div>
                  </div>
                  <div>
                    <div className="font-mono text-2xl font-semibold text-muted-foreground">
                      {Math.floor(impact.avgTimeToObjectiveLoss / 60)}m
                    </div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wide flex items-center gap-1">
                      <Clock size={12} weight="bold" />
                      Avg Cascade Time
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-border/50">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Impact Severity
                    </span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 h-2 bg-background rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${
                            Math.abs(impact.winRateImpact) > 15 ? 'bg-destructive' :
                            Math.abs(impact.winRateImpact) > 10 ? 'bg-warning' :
                            Math.abs(impact.winRateImpact) > 5 ? 'bg-primary' :
                            'bg-success'
                          }`}
                          style={{ 
                            width: `${Math.min(Math.abs(impact.winRateImpact) * 4, 100)}%` 
                          }}
                        />
                      </div>
                      <Badge 
                        variant="outline"
                        className={`text-xs ${
                          Math.abs(impact.winRateImpact) > 15 ? 'border-destructive text-destructive' :
                          Math.abs(impact.winRateImpact) > 10 ? 'border-warning text-warning' :
                          Math.abs(impact.winRateImpact) > 5 ? 'border-primary text-primary' :
                          'border-success text-success'
                        }`}
                      >
                        {Math.abs(impact.winRateImpact) > 15 ? 'Critical' :
                         Math.abs(impact.winRateImpact) > 10 ? 'High' :
                         Math.abs(impact.winRateImpact) > 5 ? 'Medium' : 'Low'}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
