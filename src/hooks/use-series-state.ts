import { useState, useEffect, useCallback, useRef } from 'react'
import { useKV } from '@github/spark/hooks'
import { toast } from 'sonner'
import axios, { AxiosResponse } from 'axios'

const SERIES_STATE_ENDPOINT = 'https://api-op.grid.gg/live-data-feed/series-state/graphql'
const DEFAULT_API_KEY = 'GacqICJfwHbtteMEbQ8mUVztiBHCuKuzijh7m4N8'
const POLL_INTERVAL = 3000

export interface SeriesStatePlayer {
  name: string
  kills: number
  deaths: number
  netWorth: number
  money: number
  position: {
    x: number
    y: number
  }
}

export interface SeriesStateTeam {
  name: string
  players: SeriesStatePlayer[]
}

export interface SeriesStateGame {
  sequenceNumber: number
  teams: SeriesStateTeam[]
}

export interface SeriesStateTeamInfo {
  name: string
  won: number
}

export interface SeriesState {
  valid: boolean
  updatedAt: string
  format: string | null
  started: boolean
  finished: boolean
  teams: SeriesStateTeamInfo[]
  games: SeriesStateGame[]
}

interface GraphQLResponse<T> {
  data: T
  errors?: Array<{
    message: string
    path?: string[]
    extensions?: {
      errorType: string
    }
  }>
}

export function useSeriesState() {
  const [seriesId, setSeriesId] = useKV<string>('series-state-id', '')
  const [seriesState, setSeriesState] = useState<SeriesState | null>(null)
  const [isPolling, setIsPolling] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null)

  const fetchSeriesState = useCallback(async (id: string): Promise<SeriesState | null> => {
    if (!id) {
      return null
    }

    const query = `
      query GetLiveDotaSeriesState($seriesId: ID!) {
        seriesState(id: $seriesId) {
          valid
          updatedAt
          format
          started
          finished
          teams {
            name
            won
          }
          games(filter: { started: true, finished: false }) {
            sequenceNumber
            teams {
              name
              players {
                name
                kills
                deaths
                netWorth
                money
                position {
                  x
                  y
                }
              }
            }
          }
        }
      }
    `

    try {
      const response: AxiosResponse<GraphQLResponse<{ seriesState: SeriesState }>> = await axios.post(
        SERIES_STATE_ENDPOINT,
        {
          query,
          variables: {
            seriesId: id,
          },
        },
        {
          headers: {
            'x-api-key': DEFAULT_API_KEY,
            'Content-Type': 'application/json',
          },
        }
      )

      if (response.data.errors) {
        const errorMsg = response.data.errors[0]?.message || 'Unknown error'
        const errorType = response.data.errors[0]?.extensions?.errorType
        
        if (errorType === 'PERMISSION_DENIED') {
          console.warn('Series State API: Permission denied for series ID:', id)
          setError('Access denied - This series may not have live data available')
        } else {
          console.error('Series State API GraphQL errors:', response.data.errors)
          setError(errorMsg)
        }
        return null
      }

      const data = response.data.data.seriesState
      setError(null)
      setLastUpdate(new Date())
      return data
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const errorMsg = `Request failed: ${err.response?.status || err.message}`
        console.error('Series State API Error:', err.response?.status, err.response?.data)
        setError(errorMsg)
      } else {
        console.error('Unexpected error:', err)
        setError('Unexpected error occurred')
      }
      return null
    }
  }, [])

  const startPolling = useCallback(
    (id: string) => {
      if (!id) {
        toast.error('Please provide a series ID')
        return
      }

      setSeriesId(id)
      setIsPolling(true)
      setError(null)

      const poll = async () => {
        const state = await fetchSeriesState(id)
        if (state) {
          setSeriesState(state)
          
          if (state.finished) {
            stopPolling()
            toast.info('Series has finished')
          }
        }
      }

      poll()

      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current)
      }

      pollIntervalRef.current = setInterval(poll, POLL_INTERVAL)
      toast.success(`Tracking series ${id}`)
    },
    [fetchSeriesState]
  )

  const stopPolling = useCallback(() => {
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current)
      pollIntervalRef.current = null
    }
    setIsPolling(false)
  }, [])

  const resetState = useCallback(() => {
    stopPolling()
    setSeriesState(null)
    setSeriesId('')
    setError(null)
    setLastUpdate(null)
  }, [stopPolling])

  useEffect(() => {
    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current)
      }
    }
  }, [])

  useEffect(() => {
    if (seriesId && !isPolling) {
      startPolling(seriesId)
    }
  }, [])

  return {
    seriesState,
    seriesId,
    isPolling,
    error,
    lastUpdate,
    startPolling,
    stopPolling,
    resetState,
    fetchSeriesState,
  }
}
