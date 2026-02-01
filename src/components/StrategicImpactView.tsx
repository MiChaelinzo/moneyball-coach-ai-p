import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { StrategicImpact } from '@/lib/types'
import { Target, TrendDown, Clock, Warning } from '@phosphor-icons/react'
import { ExportButton } from './ExportButton'
import { exportStrategicImpactsToCSV, downloadFile, type ExportFormat } from '@/lib/exportUtils'

interface StrategicImpactViewProps {
  impacts: StrategicImpact[]
}

function generateStrategicImpactPDF(impacts: StrategicImpact[]): string {
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
  <h1>Strategic Impact Analysis</h1>
  <p>Generated: ${new Date().toLocaleString()}</p>
  <table>
    <thead>
      <tr>
        <th>Mistake Category</th>
        <th>Occurrences</th>
        <th>Avg Time to Obj Loss</th>
        <th>Win Rate Impact</th>
        <th>Objectives Lost</th>
      </tr>
    </thead>
    <tbody>
      ${impacts.map(i => `
        <tr>
          <td><strong>${i.mistakeCategory}</strong></td>
          <td>${i.occurrences}</td>
          <td>${i.avgTimeToObjectiveLoss}s</td>
          <td>${i.winRateImpact.toFixed(1)}%</td>
          <td>${i.objectivesLost}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>
</body>
</html>
  `
}

export function StrategicImpactView({ impacts }: StrategicImpactViewProps) {
  const sortedImpacts = [...impacts].sort((a, b) => 
    Math.abs(b.winRateImpact) - Math.abs(a.winRateImpact)
  )

  const handleExport = (format: ExportFormat) => {
    if (format === 'csv') {
      const csv = exportStrategicImpactsToCSV(sortedImpacts)
      const timestamp = new Date().toISOString().split('T')[0]
      downloadFile(csv, `strategic-impact-analysis-${timestamp}.csv`, 'text/csv')
    } else if (format === 'pdf') {
      const html = generateStrategicImpactPDF(sortedImpacts)
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
      <div className="flex items-center justify-between">
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
        <ExportButton
          onExport={handleExport}
          label="Export Analysis"
          variant="outline"
        />
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
