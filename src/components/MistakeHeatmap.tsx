import { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Slider } from '@/components/ui/slider'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { MapPin, Clock, Warning, Crosshair } from '@phosphor-icons/react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Mistake } from '@/lib/types'
import { ExportButton } from './ExportButton'
import { exportMistakesToCSV, downloadFile, type ExportFormat } from '@/lib/exportUtils'

interface MistakeHeatmapProps {
  mistakes: Mistake[]
}

interface HeatmapPoint {
  x: number
  y: number
  intensity: number
  mistakes: Mistake[]
}

const formatGameTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

const getImpactColor = (impact: string): string => {
  switch (impact) {
    case 'critical': return 'oklch(0.60 0.22 25)'
    case 'high': return 'oklch(0.75 0.15 65)'
    case 'medium': return 'oklch(0.72 0.16 195)'
    case 'low': return 'oklch(0.68 0.18 145)'
    default: return 'oklch(0.72 0.16 195)'
  }
}

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'positioning': return <MapPin size={16} weight="duotone" />
    case 'mechanics': return <Crosshair size={16} weight="duotone" />
    case 'decision-making': return <Warning size={16} weight="duotone" />
    case 'communication': return <Warning size={16} weight="duotone" />
    case 'macro': return <Clock size={16} weight="duotone" />
    default: return <Warning size={16} weight="duotone" />
  }
}

export function MistakeHeatmap({ mistakes }: MistakeHeatmapProps) {
  const [timeRange, setTimeRange] = useState<[number, number]>([0, 3000])
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [impactFilter, setImpactFilter] = useState<string>('all')
  const [hoveredPoint, setHoveredPoint] = useState<HeatmapPoint | null>(null)

  const handleExport = (format: ExportFormat) => {
    const timestamp = new Date().toISOString().split('T')[0]
    
    if (format === 'csv') {
      const csv = exportMistakesToCSV(filteredMistakes)
      downloadFile(csv, `mistake-heatmap-${timestamp}.csv`, 'text/csv')
    } else if (format === 'pdf') {
      const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: 'Space Grotesk', sans-serif; padding: 40px; }
    h1 { color: #00c8ff; border-bottom: 3px solid #00c8ff; padding-bottom: 10px; }
    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    th { background-color: #00c8ff; color: white; padding: 12px; text-align: left; }
    td { padding: 10px 12px; border-bottom: 1px solid #e0e0e0; }
  </style>
</head>
<body>
  <h1>Mistake Heatmap Analysis</h1>
  <p>Generated: ${new Date().toLocaleString()}</p>
  <p>Total Mistakes: ${filteredMistakes.length}</p>
  <table>
    <thead>
      <tr>
        <th>Player</th>
        <th>Category</th>
        <th>Impact</th>
        <th>Zone</th>
        <th>Game Time</th>
      </tr>
    </thead>
    <tbody>
      ${filteredMistakes.map(m => `
        <tr>
          <td>${m.playerName}</td>
          <td>${m.category}</td>
          <td>${m.impact}</td>
          <td>${m.mapPosition?.zone || 'N/A'}</td>
          <td>${formatGameTime(m.gameTime)}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>
</body>
</html>
      `
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

  const maxGameTime = useMemo(() => {
    return Math.max(...mistakes.map(m => m.gameTime), 3000)
  }, [mistakes])

  const filteredMistakes = useMemo(() => {
    return mistakes.filter(m => {
      if (!m.mapPosition) return false
      if (m.gameTime < timeRange[0] || m.gameTime > timeRange[1]) return false
      if (categoryFilter !== 'all' && m.category !== categoryFilter) return false
      if (impactFilter !== 'all' && m.impact !== impactFilter) return false
      return true
    })
  }, [mistakes, timeRange, categoryFilter, impactFilter])

  const heatmapData = useMemo(() => {
    const gridSize = 10
    const points: HeatmapPoint[] = []

    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        const cellX = i * gridSize + gridSize / 2
        const cellY = j * gridSize + gridSize / 2
        
        const mistakesInCell = filteredMistakes.filter(m => {
          if (!m.mapPosition) return false
          const dx = Math.abs(m.mapPosition.x - cellX)
          const dy = Math.abs(m.mapPosition.y - cellY)
          return dx <= gridSize && dy <= gridSize
        })

        if (mistakesInCell.length > 0) {
          let intensity = mistakesInCell.length
          mistakesInCell.forEach(m => {
            if (m.impact === 'critical') intensity += 2
            else if (m.impact === 'high') intensity += 1
          })

          points.push({
            x: cellX,
            y: cellY,
            intensity,
            mistakes: mistakesInCell
          })
        }
      }
    }

    return points
  }, [filteredMistakes])

  const maxIntensity = useMemo(() => {
    return Math.max(...heatmapData.map(p => p.intensity), 1)
  }, [heatmapData])

  return (
    <Card className="glow-border">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-destructive/20">
              <MapPin size={24} weight="duotone" className="text-destructive" />
            </div>
            <div>
              <CardTitle className="text-xl">Mistake Heatmap</CardTitle>
              <p className="text-sm text-muted-foreground">
                Spatial analysis of mistakes across the map
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="font-mono">
              {filteredMistakes.length} mistakes
            </Badge>
            <ExportButton
              onExport={handleExport}
              label="Export"
              variant="outline"
              size="sm"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Category
            </label>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="positioning">Positioning</SelectItem>
                <SelectItem value="mechanics">Mechanics</SelectItem>
                <SelectItem value="decision-making">Decision Making</SelectItem>
                <SelectItem value="communication">Communication</SelectItem>
                <SelectItem value="macro">Macro</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Impact
            </label>
            <Select value={impactFilter} onValueChange={setImpactFilter}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Impacts</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Game Time Range
            </label>
            <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
              <span>{formatGameTime(timeRange[0])}</span>
              <span>-</span>
              <span>{formatGameTime(timeRange[1])}</span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Slider
            value={timeRange}
            onValueChange={(value) => setTimeRange(value as [number, number])}
            min={0}
            max={maxGameTime}
            step={60}
            className="w-full"
          />
        </div>

        <div className="relative w-full aspect-square bg-gradient-to-br from-card to-muted/30 rounded-lg border-2 border-border overflow-hidden">
          <div className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `repeating-linear-gradient(
                0deg,
                transparent,
                transparent 10%,
                oklch(0.72 0.16 195 / 0.1) 10%,
                oklch(0.72 0.16 195 / 0.1) 10.5%
              ),
              repeating-linear-gradient(
                90deg,
                transparent,
                transparent 10%,
                oklch(0.72 0.16 195 / 0.1) 10%,
                oklch(0.72 0.16 195 / 0.1) 10.5%
              )`
            }}
          />

          <div className="absolute top-2 left-2 px-2 py-1 bg-card/80 backdrop-blur-sm rounded text-xs font-semibold text-primary border border-primary/30">
            TOP
          </div>
          <div className="absolute bottom-2 right-2 px-2 py-1 bg-card/80 backdrop-blur-sm rounded text-xs font-semibold text-primary border border-primary/30">
            BOT
          </div>
          <div className="absolute top-2 right-2 px-2 py-1 bg-card/80 backdrop-blur-sm rounded text-xs font-semibold text-warning border border-warning/30">
            BARON
          </div>
          <div className="absolute bottom-2 left-2 px-2 py-1 bg-card/80 backdrop-blur-sm rounded text-xs font-semibold text-warning border border-warning/30">
            DRAGON
          </div>

          {heatmapData.map((point, index) => {
            const intensity = point.intensity / maxIntensity
            const size = 40 + intensity * 40
            const opacity = 0.3 + intensity * 0.6

            return (
              <motion.div
                key={index}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity }}
                className="absolute cursor-pointer"
                style={{
                  left: `${point.x}%`,
                  top: `${point.y}%`,
                  width: `${size}px`,
                  height: `${size}px`,
                  transform: 'translate(-50%, -50%)',
                }}
                onMouseEnter={() => setHoveredPoint(point)}
                onMouseLeave={() => setHoveredPoint(null)}
              >
                <div
                  className="w-full h-full rounded-full"
                  style={{
                    background: `radial-gradient(circle, ${getImpactColor(point.mistakes[0].impact)} ${opacity * 100}%, transparent)`,
                    boxShadow: `0 0 ${size/2}px ${getImpactColor(point.mistakes[0].impact)}`,
                  }}
                />
              </motion.div>
            )
          })}

          {filteredMistakes.map((mistake, index) => (
            mistake.mapPosition && (
              <motion.div
                key={mistake.id}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.02 }}
                className="absolute"
                style={{
                  left: `${mistake.mapPosition.x}%`,
                  top: `${mistake.mapPosition.y}%`,
                  transform: 'translate(-50%, -50%)',
                }}
              >
                <div
                  className="w-3 h-3 rounded-full border-2 border-background"
                  style={{
                    backgroundColor: getImpactColor(mistake.impact),
                  }}
                />
              </motion.div>
            )
          ))}

          <AnimatePresence>
            {hoveredPoint && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="absolute z-10 bg-card/95 backdrop-blur-sm border border-border rounded-lg p-3 shadow-lg"
                style={{
                  left: `${hoveredPoint.x}%`,
                  top: `${hoveredPoint.y}%`,
                  transform: 'translate(-50%, -120%)',
                  maxWidth: '300px',
                }}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-muted-foreground uppercase">
                      {hoveredPoint.mistakes.length} Mistakes
                    </span>
                    <Badge variant="outline" className="text-xs">
                      {hoveredPoint.mistakes[0].mapPosition?.zone}
                    </Badge>
                  </div>
                  <div className="space-y-1 max-h-32 overflow-y-auto">
                    {hoveredPoint.mistakes.map(m => (
                      <div key={m.id} className="flex items-start gap-2 text-xs">
                        <div className="mt-0.5">{getCategoryIcon(m.category)}</div>
                        <div className="flex-1">
                          <div className="font-semibold">{m.playerName}</div>
                          <div className="text-muted-foreground line-clamp-2">{m.description}</div>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge 
                              variant="outline" 
                              className="text-xs"
                              style={{ 
                                borderColor: getImpactColor(m.impact),
                                color: getImpactColor(m.impact)
                              }}
                            >
                              {m.impact}
                            </Badge>
                            <span className="text-muted-foreground font-mono">
                              {formatGameTime(m.gameTime)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-destructive/10 to-destructive/5 border-destructive/30">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-3 h-3 rounded-full bg-destructive" />
                <span className="text-xs font-semibold text-muted-foreground uppercase">Critical</span>
              </div>
              <div className="font-mono text-2xl font-bold text-destructive">
                {filteredMistakes.filter(m => m.impact === 'critical').length}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-warning/10 to-warning/5 border-warning/30">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-3 h-3 rounded-full bg-warning" />
                <span className="text-xs font-semibold text-muted-foreground uppercase">High</span>
              </div>
              <div className="font-mono text-2xl font-bold text-warning">
                {filteredMistakes.filter(m => m.impact === 'high').length}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/30">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-3 h-3 rounded-full bg-primary" />
                <span className="text-xs font-semibold text-muted-foreground uppercase">Medium</span>
              </div>
              <div className="font-mono text-2xl font-bold text-primary">
                {filteredMistakes.filter(m => m.impact === 'medium').length}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-success/10 to-success/5 border-success/30">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-3 h-3 rounded-full bg-success" />
                <span className="text-xs font-semibold text-muted-foreground uppercase">Low</span>
              </div>
              <div className="font-mono text-2xl font-bold text-success">
                {filteredMistakes.filter(m => m.impact === 'low').length}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            Hot Zones
          </h4>
          <div className="grid gap-2">
            {Array.from(new Set(filteredMistakes.map(m => m.mapPosition?.zone).filter(Boolean)))
              .map(zone => {
                const zoneCount = filteredMistakes.filter(m => m.mapPosition?.zone === zone).length
                return (
                  <div key={zone} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border border-border/50">
                    <div className="flex items-center gap-3">
                      <MapPin size={20} weight="duotone" className="text-primary" />
                      <span className="font-semibold capitalize">{zone?.replace('-', ' ')}</span>
                    </div>
                    <Badge variant="outline" className="font-mono">
                      {zoneCount} mistakes
                    </Badge>
                  </div>
                )
              })}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
