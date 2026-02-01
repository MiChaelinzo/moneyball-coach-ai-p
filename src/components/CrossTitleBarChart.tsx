import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { GameTitle } from '@/lib/types'

interface CrossTitleBarChartProps {
  title: string
  data: Array<{
    title: Exclude<GameTitle, 'All'>
    value: number
    color: string
    label: string
  }>
  maxValue?: number
  unit?: string
}

export function CrossTitleBarChart({ title, data, maxValue, unit = '' }: CrossTitleBarChartProps) {
  const max = maxValue || Math.max(...data.map(d => d.value))
  
  return (
    <Card className="glow-border">
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {data.map((item, idx) => {
            const percentage = max > 0 ? (item.value / max) * 100 : 0
            
            return (
              <div key={item.title}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">{item.label}</span>
                  <span className="font-mono font-semibold text-lg" style={{ color: item.color }}>
                    {item.value.toFixed(1)}{unit}
                  </span>
                </div>
                <div className="relative h-8 bg-muted rounded-lg overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 0.8, delay: idx * 0.1, ease: 'easeOut' }}
                    className="h-full rounded-lg"
                    style={{ 
                      backgroundColor: item.color,
                      opacity: 0.8
                    }}
                  />
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 0.8, delay: idx * 0.1 + 0.2, ease: 'easeOut' }}
                    className="absolute inset-0 h-full rounded-lg"
                    style={{ 
                      backgroundColor: item.color,
                      opacity: 0.3
                    }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
