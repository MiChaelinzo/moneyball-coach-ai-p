import { useState, useEffect, useCallback } from 'react'
import type { LiveMatch } from '@/lib/types'
import { createInitialLiveMatch, simulateLiveMatchUpdate } from '@/lib/mockData'
import { fetchLiveMatchData, isGridApiInitialized } from '@/lib/gridApi'
import { useKV } from '@github/spark/hooks'

export function useLiveMatch() {
  const [liveMatch, setLiveMatch] = useKV<LiveMatch>('live-match', createInitialLiveMatch())
  const [isTracking, setIsTracking] = useState(false)
  const [gridGameId, setGridGameId] = useKV<string>('grid-game-id', '')
  const [useGridData, setUseGridData] = useState(false)

  const currentMatch = liveMatch || createInitialLiveMatch()

  useEffect(() => {
    if (!currentMatch.isActive) {
      return
    }

    const interval = setInterval(async () => {
      if (useGridData && isGridApiInitialized() && gridGameId) {
        try {
          const gridData = await fetchLiveMatchData(gridGameId)
          if (gridData) {
            setLiveMatch((current) => ({
              ...(current || createInitialLiveMatch()),
              ...gridData,
              isActive: true,
            }))
            return
          }
        } catch (error) {
          console.error('Failed to fetch GRID live data, falling back to simulation:', error)
        }
      }

      setLiveMatch((current) => {
        const match = current || createInitialLiveMatch()
        return simulateLiveMatchUpdate(match)
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [currentMatch.isActive, setLiveMatch, useGridData, gridGameId])

  const toggleTracking = useCallback(() => {
    setLiveMatch((current) => {
      const match = current || createInitialLiveMatch()
      return {
        ...match,
        isActive: !match.isActive
      }
    })
    setIsTracking((prev) => !prev)
  }, [setLiveMatch])

  const resetMatch = useCallback(() => {
    setLiveMatch(createInitialLiveMatch())
    setIsTracking(false)
  }, [setLiveMatch])

  const setGridGame = useCallback((gameId: string) => {
    setGridGameId(gameId)
    setUseGridData(true)
  }, [setGridGameId])

  const useSimulatedData = useCallback(() => {
    setUseGridData(false)
    setGridGameId('')
  }, [setGridGameId])

  return {
    liveMatch: currentMatch,
    isTracking,
    toggleTracking,
    resetMatch,
    setGridGame,
    useSimulatedData,
    isUsingGridData: useGridData && isGridApiInitialized(),
  }
}
