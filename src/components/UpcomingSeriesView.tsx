import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { CalendarBlank, Warning, Clock, Trophy, ListBullets, ArrowsClockwise, CurrencyDollar, MapPin, Globe } from '@phosphor-icons/react'
import { motion } from 'framer-motion'
import { fetchSeriesInTimeRange } from '@/lib/gridApi'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import type { Tournament } from '@/lib/types'

interface SeriesData {
  id: string
  title: {
    nameShortened: string
  }
  tournament: Tournament
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

type DateRangeOption = 'next24h' | 'nextWeek' | 'nextMonth' | '2025' | '2026' | 'all2025-2026'

export function UpcomingSeriesView() {
  const [series, setSeries] = useState<SeriesData[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [dateRange, setDateRange] = useState<DateRangeOption>('all2025-2026')

  const getDateRange = (option: DateRangeOption): { start: string; end: string } => {
    const now = new Date()
    
    switch (option) {
      case 'next24h': {
        const tomorrow = new Date(now)
        tomorrow.setHours(now.getHours() + 24)
        return { start: now.toISOString(), end: tomorrow.toISOString() }
      }
      case 'nextWeek': {
        const nextWeek = new Date(now)
        nextWeek.setDate(now.getDate() + 7)
        return { start: now.toISOString(), end: nextWeek.toISOString() }
      }
      case 'nextMonth': {
        const nextMonth = new Date(now)
        nextMonth.setMonth(now.getMonth() + 1)
        return { start: now.toISOString(), end: nextMonth.toISOString() }
      }
      case '2025':
        return { start: '2025-01-01T00:00:00Z', end: '2025-12-31T23:59:59Z' }
      case '2026':
        return { start: '2026-01-01T00:00:00Z', end: '2026-12-31T23:59:59Z' }
      case 'all2025-2026':
        return { start: '2025-01-01T00:00:00Z', end: '2026-12-31T23:59:59Z' }
      default:
        return { start: now.toISOString(), end: now.toISOString() }
    }
  }

  const loadUpcomingSeries = async (rangeOption: DateRangeOption = dateRange) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const { start, end } = getDateRange(rangeOption)
      
      console.log('Fetching series from', start, 'to', end)
      
      const data = await fetchSeriesInTimeRange(start, end, 3, 100)
      setSeries(data)
      
      if (data.length === 0) {
        toast.info('No series found in this date range')
      } else {
        toast.success(`Loaded ${data.length} series with detailed information`)
      }
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

  const handleRefresh = () => {
    loadUpcomingSeries(dateRange)
  }

  const handleDateRangeChange = (value: string) => {
    const newRange = value as DateRangeOption
    setDateRange(newRange)
    loadUpcomingSeries(newRange)
  }

  if (error) {
    return (
      <Card className="glow-border-warning">
        <CardContent className="py-12 text-center">
          <Warning size={48} weight="duotone" className="text-warning mx-auto mb-4" />
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={handleRefresh} disabled={isLoading}>
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
          <h2 className="text-2xl font-semibold">Upcoming Series</h2>
          <p className="text-sm text-muted-foreground">
            Scheduled matches and series
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={dateRange} onValueChange={handleDateRangeChange}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="next24h">Next 24 Hours</SelectItem>
              <SelectItem value="nextWeek">Next Week</SelectItem>
              <SelectItem value="nextMonth">Next Month</SelectItem>
              <SelectItem value="2025">Year 2025</SelectItem>
              <SelectItem value="2026">Year 2026</SelectItem>
              <SelectItem value="all2025-2026">2025-2026</SelectItem>
            </SelectContent>
          </Select>
          <Badge variant="outline" className="gap-2 px-4 py-2">
            <CalendarBlank size={18} weight="duotone" />
            {series.length} Series
          </Badge>
          <Button onClick={handleRefresh} disabled={isLoading} variant="outline" size="sm">
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
                    <div className="space-y-4">
                      <div className="flex items-center justify-between gap-6">
                        <div className="flex items-center gap-4 flex-1">
                          <div className={cn(
                            "w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0",
                            isStartingSoon ? "bg-warning/20" : hasStarted ? "bg-success/20" : "bg-primary/20"
                          )}>
                            <CalendarBlank 
                              size={28} 
                              weight="duotone" 
                              className={isStartingSoon ? "text-warning" : hasStarted ? "text-success" : "text-primary"} 
                            />
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-2 flex-wrap">
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
                            
                            <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
                              <div className="flex items-center gap-1.5">
                                <Clock size={16} />
                                <span>{formatTime(item.startTimeScheduled)}</span>
                              </div>
                              <span>·</span>
                              <div className="flex items-center gap-1.5">
                                <Trophy size={16} />
                                <span className="truncate">{item.tournament.nameShortened}</span>
                              </div>
                              <span>·</span>
                              <div className="flex items-center gap-1.5">
                                <ListBullets size={16} />
                                <span>{item.format.name.replace(/-/g, ' ')}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col items-end gap-2 flex-shrink-0">
                          <Badge variant="secondary" className="font-mono text-xs">
                            ID: {item.id}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {item.title.nameShortened}
                          </Badge>
                        </div>
                      </div>

                      {(item.tournament.prizePool || item.tournament.venue || item.tournament.location) && (
                        <div className="pt-3 border-t border-border/50">
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            {item.tournament.prizePool && item.tournament.prizePool !== 'TBD' && (
                              <div className="flex items-start gap-2">
                                <div className="p-1.5 rounded-md bg-primary/10">
                                  <CurrencyDollar size={16} weight="duotone" className="text-primary" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="text-xs text-muted-foreground uppercase tracking-wide">Prize Pool</div>
                                  <div className="text-sm font-semibold text-foreground truncate">{item.tournament.prizePool}</div>
                                </div>
                              </div>
                            )}
                            
                            {item.tournament.venue && item.tournament.venue !== 'TBD' && (
                              <div className="flex items-start gap-2">
                                <div className="p-1.5 rounded-md bg-accent/10">
                                  <MapPin size={16} weight="duotone" className="text-accent" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="text-xs text-muted-foreground uppercase tracking-wide">Venue</div>
                                  <div className="text-sm font-semibold text-foreground truncate">{item.tournament.venue}</div>
                                </div>
                              </div>
                            )}
                            
                            {item.tournament.location && item.tournament.location !== 'TBD' && (
                              <div className="flex items-start gap-2">
                                <div className="p-1.5 rounded-md bg-success/10">
                                  <Globe size={16} weight="duotone" className="text-success" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="text-xs text-muted-foreground uppercase tracking-wide">Location</div>
                                  <div className="text-sm font-semibold text-foreground truncate">
                                    {item.tournament.location}
                                    {item.tournament.country && item.tournament.country !== 'TBD' && (
                                      <span className="text-muted-foreground">, {item.tournament.country}</span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
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
