import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CalendarBlank, Warning, Clock, Trophy, ListBullets, ArrowsClockwise } from '@phosphor-icons/react'
import { motion } from 'framer-motion'
import { fetchSeriesInTimeRange } from '@/lib/gridApi'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface SeriesData {
  id: string
  title: {
    nameShortened: string
  }
  tournament: {
    id: string
    name: string
    nameShortened: string
  }
  startTimeScheduled: string
  format: {
    name: string
    nameShortened: string
  }
  teams: Array<{
    baseInfo: {
      name: string
    }
    scoreAdvantage: number
  }>
}

export function UpcomingSeriesView() {
  const [series, setSeries] = useState<SeriesData[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadUpcomingSeries = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const now = new Date()
      const tomorrow = new Date(now)
      tomorrow.setHours(now.getHours() + 24)
      
      const startTime = now.toISOString()
      const endTime = tomorrow.toISOString()
      
      console.log('Fetching series from', startTime, 'to', endTime)
      
      const data = await fetchSeriesInTimeRange(startTime, endTime, 3, 50)
      setSeries(data)
      toast.success(`Loaded ${data.length} upcoming series`)
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to load upcoming series'
      setError(errorMsg)
      toast.error(errorMsg)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadUpcomingSeries()
  }, [])

  const formatTime = (isoString: string) => {
    const date = new Date(isoString)
    const now = new Date()
    const diffMs = date.getTime() - now.getTime()
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))
    
    if (diffHours < 0) {
      return 'Started'
    } else if (diffHours === 0) {
      return `In ${diffMins}m`
    } else if (diffHours < 24) {
      return `In ${diffHours}h ${diffMins}m`
    } else {
      return date.toLocaleDateString()
    }
  }

  const getTimeUntilStart = (isoString: string): number => {
    return new Date(isoString).getTime() - new Date().getTime()
  }

  if (error) {
    return (
      <Card className="glow-border-warning">
        <CardContent className="py-12 text-center">
          <Warning size={48} weight="duotone" className="text-warning mx-auto mb-4" />
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={loadUpcomingSeries} disabled={isLoading}>
            <ArrowsClockwise size={18} weight="duotone" className="mr-2" />
            Try Again
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (isLoading) {
    return (
      <Card className="glow-border">
        <CardContent className="py-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading upcoming series...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Upcoming Series (Next 24 Hours)</h2>
          <p className="text-sm text-muted-foreground">
            Scheduled matches and series
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="gap-2 px-4 py-2">
            <CalendarBlank size={18} weight="duotone" />
            {series.length} Series
          </Badge>
          <Button onClick={loadUpcomingSeries} disabled={isLoading} variant="outline" size="sm">
            <ArrowsClockwise size={18} weight="duotone" />
          </Button>
        </div>
      </div>

      {series.length === 0 ? (
        <Card className="glow-border">
          <CardContent className="py-12 text-center">
            <CalendarBlank size={48} weight="duotone" className="text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No series scheduled in the next 24 hours</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {series.map((item, index) => {
            const team1 = item.teams[0]
            const team2 = item.teams[1]
            const timeUntilStart = getTimeUntilStart(item.startTimeScheduled)
            const isStartingSoon = timeUntilStart < 3600000 && timeUntilStart > 0
            const hasStarted = timeUntilStart < 0

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card className={cn(
                  "glow-border hover:bg-card/80 transition-all",
                  isStartingSoon && "glow-border-warning",
                  hasStarted && "glow-border-success"
                )}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between gap-6">
                      <div className="flex items-center gap-4 flex-1">
                        <div className={cn(
                          "w-14 h-14 rounded-xl flex items-center justify-center",
                          isStartingSoon ? "bg-warning/20" : hasStarted ? "bg-success/20" : "bg-primary/20"
                        )}>
                          <CalendarBlank 
                            size={28} 
                            weight="duotone" 
                            className={isStartingSoon ? "text-warning" : hasStarted ? "text-success" : "text-primary"} 
                          />
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-bold">
                              {team1?.baseInfo?.name || 'TBD'} vs {team2?.baseInfo?.name || 'TBD'}
                            </h3>
                            {item.format && (
                              <Badge variant="outline" className="font-mono text-xs">
                                {item.format.nameShortened}
                              </Badge>
                            )}
                            {isStartingSoon && (
                              <Badge variant="outline" className="border-warning text-warning">
                                Starting Soon
                              </Badge>
                            )}
                            {hasStarted && (
                              <Badge variant="outline" className="border-success text-success">
                                Live
                              </Badge>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1.5">
                              <Clock size={16} />
                              <span>{formatTime(item.startTimeScheduled)}</span>
                            </div>
                            <span>·</span>
                            <div className="flex items-center gap-1.5">
                              <Trophy size={16} />
                              <span>{item.tournament.nameShortened}</span>
                            </div>
                            <span>·</span>
                            <div className="flex items-center gap-1.5">
                              <ListBullets size={16} />
                              <span>{item.format.name.replace(/-/g, ' ')}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-2">
                        <Badge variant="secondary" className="font-mono text-xs">
                          ID: {item.id}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {item.title.nameShortened}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}
