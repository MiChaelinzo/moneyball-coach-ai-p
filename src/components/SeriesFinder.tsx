import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CalendarBlank, ArrowClockwise, Trophy, GameController } from '@phosphor-icons/react'
import { toast } from 'sonner'

const CENTRAL_DATA_ENDPOINT = 'https://api-op.grid.gg/central-data/graphql'
const DEFAULT_API_KEY = 'GacqICJfwHbtteMEbQ8mUVztiBHCuKuzijh7m4N8'

interface Series {
  id: string
  title: {
    nameShortened: string
  }
  tournament: {
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
  }>
}

interface SeriesFinderProps {
  onSelectSeries: (seriesId: string) => void
}

export function SeriesFinder({ onSelectSeries }: SeriesFinderProps) {
  const [series, setSeries] = useState<Series[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchUpcomingSeries = async () => {
    setIsLoading(true)
    setError(null)

    const query = `
      query GetUpcomingSeries($gte: DateTime!, $lte: DateTime!) {
        allSeries(
          filter: {
            titleId: 5
            types: ESPORTS
            startTimeScheduled: {
              gte: $gte
              lte: $lte
            }
          }
          orderBy: StartTimeScheduled
          orderDirection: ASC
          first: 50
        ) {
          edges {
            node {
              id
              title {
                nameShortened
              }
              tournament {
                nameShortened
              }
              startTimeScheduled
              format {
                name
                nameShortened
              }
              teams {
                baseInfo {
                  name
                }
              }
            }
          }
        }
      }
    `

    try {
      const response = await fetch(CENTRAL_DATA_ENDPOINT, {
        method: 'POST',
        headers: {
          'x-api-key': DEFAULT_API_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query,
          variables: {
            gte: '2025-01-01T00:00:00Z',
            lte: '2026-12-31T23:59:59Z',
          },
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status} ${response.statusText}`)
      }

      const result = await response.json()

      if (result.errors) {
        throw new Error(result.errors[0]?.message || 'Unknown error')
      }

      const seriesData = result.data.allSeries.edges.map((edge: any) => edge.node)
      setSeries(seriesData)
      
      if (seriesData.length === 0) {
        toast.info('No DOTA 2 series found for 2025-2026')
      } else {
        toast.success(`Found ${seriesData.length} series in 2025-2026`)
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unexpected error occurred'
      setError(errorMsg)
      toast.error(errorMsg)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchUpcomingSeries()
  }, [])

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <Card className="glow-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/20">
              <CalendarBlank size={24} weight="duotone" className="text-primary" />
            </div>
            <div>
              <CardTitle className="text-xl">DOTA 2 Series (2025-2026)</CardTitle>
              <p className="text-sm text-muted-foreground">
                Select a series to track live state
              </p>
            </div>
          </div>
          <Button onClick={fetchUpcomingSeries} disabled={isLoading} variant="outline" className="gap-2">
            <ArrowClockwise size={18} weight="bold" />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="p-3 bg-destructive/10 border border-destructive/30 rounded-lg text-sm text-destructive mb-4">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="text-center py-8 text-muted-foreground">
            Loading upcoming series...
          </div>
        ) : series.length > 0 ? (
          <div className="grid gap-3">
            {series.map((s) => (
              <div
                key={s.id}
                className="p-4 bg-secondary/30 rounded-lg border border-border hover:border-primary/50 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <GameController size={18} weight="duotone" className="text-primary" />
                      <span className="font-mono font-semibold">Series #{s.id}</span>
                      <Badge variant="outline" className="text-xs">
                        {s.format.nameShortened}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm">
                      <Trophy size={16} className="text-warning" />
                      <span className="text-muted-foreground">{s.tournament.nameShortened}</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      {s.teams.map((team, idx) => (
                        <span key={idx} className="font-semibold">
                          {team.baseInfo.name}
                          {idx < s.teams.length - 1 && (
                            <span className="text-muted-foreground mx-2">vs</span>
                          )}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <CalendarBlank size={14} />
                      {formatDate(s.startTimeScheduled)}
                    </div>
                  </div>

                  <Button
                    onClick={() => onSelectSeries(s.id)}
                    size="sm"
                    className="gap-2"
                  >
                    Track
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            No upcoming series found
          </div>
        )}
      </CardContent>
    </Card>
  )
}
