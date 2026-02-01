import { useState, useEffect, useCallback, useRef } from 'react'
import type { LiveMatch } from '@/lib/types'
import { createInitialLiveMatch, simulateLiveMatchUpdate } from '@/lib/mockData'
import { fetchLiveMatchData, isGridApiInitialized, fetchOngoingCloud9Games, fetchRecentCloud9Games } from '@/lib/gridApi'
import { useKV } from '@github/spark/hooks'
import { toast } from 'sonner'

const GRID_POLL_INTERVAL = 5000
const SIMULATION_UPDATE_INTERVAL = 1000

export function useLiveMatch() {
  const [liveMatch, setLiveMatch] = useKV<LiveMatch>('live-match', createInitialLiveMatch())
  const [isTracking, setIsTracking] = useState(false)
  const [gridGameId, setGridGameId] = useKV<string>('grid-game-id', '')
  const [useGridData, setUseGridData] = useState(false)
  const [autoDetectEnabled, setAutoDetectEnabled] = useKV<boolean>('auto-detect-live-matches', false)
  const [isCheckingForGames, setIsCheckingForGames] = useState(false)
  const lastUpdateRef = useRef<number>(0)
  const autoCheckIntervalRef = useRef<NodeJS.Timeout | null>(null)

  const currentMatch = liveMatch || createInitialLiveMatch()

  const checkForLiveGames = useCallback(async (): Promise<boolean> => {
    if (!isGridApiInitialized()) {
      return false
    }

    setIsCheckingForGames(true)
    try {
      const ongoingSeries = await fetchOngoingCloud9Games()
      
      if (ongoingSeries.length > 0) {
        const series = ongoingSeries[0]
        const runningGame = series.games.find(g => g.state === 'RUNNING' && g.statsAvailable)
        
        if (runningGame) {
          console.log(`Found live Cloud9 game: ${runningGame.id}`)
          setGridGameId(runningGame.id)
          setUseGridData(true)
          
          const opponent = series.teams.find(t => t.name !== 'Cloud9')?.name || 'Unknown'
          
          setLiveMatch((current) => ({
            ...(current || createInitialLiveMatch()),
            id: runningGame.id,
            opponent,
            isActive: true,
          }))
          
          toast.success(`Live Cloud9 match detected vs ${opponent}!`, {
            description: 'Now tracking real-time match data'
          })
          
          return true
        }
      }
      
      console.log('No live Cloud9 games found')
      return false
    } catch (error) {
      console.error('Error checking for live games:', error)
      return false
    } finally {
      setIsCheckingForGames(false)
    }
  }, [setGridGameId, setLiveMatch])

  useEffect(() => {
    if (autoDetectEnabled && isGridApiInitialized()) {
      autoCheckIntervalRef.current = setInterval(() => {
        checkForLiveGames()
      }, 30000)
      
      checkForLiveGames()
      
      return () => {
        if (autoCheckIntervalRef.current) {
          clearInterval(autoCheckIntervalRef.current)
        }
      }
    }
  }, [autoDetectEnabled, checkForLiveGames])

  useEffect(() => {
    if (!currentMatch.isActive) {
      return
    }

    const interval = setInterval(async () => {
      const now = Date.now()
      
      if (useGridData && isGridApiInitialized() && gridGameId) {
        if (now - lastUpdateRef.current < GRID_POLL_INTERVAL) {
          return
        }
        
        lastUpdateRef.current = now
        
        try {
          console.log(`Polling GRID API for game ${gridGameId}...`)
          const gridData = await fetchLiveMatchData(gridGameId)
          
          if (gridData && gridData.players && gridData.players.length > 0) {
            console.log('Live data received, updating match...')
            setLiveMatch((current) => {
              const base = current || createInitialLiveMatch()
              return {
                ...base,
                ...gridData,
                id: gridGameId,
                isActive: true,
                gameTime: base.gameTime + 5,
              }
            })
            return
          } else {
            console.log('No live data available yet, using simulation')
          }
        } catch (error) {
          console.error('Failed to fetch GRID live data:', error)
          toast.error('Live data fetch failed', {
            description: 'Falling back to simulation mode'
          })
        }
      }

      setLiveMatch((current) => {
        const match = current || createInitialLiveMatch()
        return simulateLiveMatchUpdate(match)
      })
    }, SIMULATION_UPDATE_INTERVAL)

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
    setUseGridData(false)
    setGridGameId('')
    lastUpdateRef.current = 0
  }, [setLiveMatch, setGridGameId])

  const setGridGame = useCallback((gameId: string, opponent?: string) => {
    setGridGameId(gameId)
    setUseGridData(true)
    
    setLiveMatch((current) => ({
      ...(current || createInitialLiveMatch()),
      id: gameId,
      opponent: opponent || current?.opponent || 'Unknown',
      isActive: true,
    }))
    
    toast.success('Tracking live match', {
      description: `Game ID: ${gameId}`
    })
  }, [setGridGameId, setLiveMatch])

  const useSimulatedData = useCallback(() => {
    setUseGridData(false)
    setGridGameId('')
    lastUpdateRef.current = 0
    toast.info('Switched to simulation mode')
  }, [setGridGameId])

  const toggleAutoDetect = useCallback(() => {
    setAutoDetectEnabled((prev) => !prev)
  }, [setAutoDetectEnabled])

  return {
    liveMatch: currentMatch,
    isTracking,
    toggleTracking,
    resetMatch,
    setGridGame,
    useSimulatedData,
    isUsingGridData: useGridData && isGridApiInitialized(),
    autoDetectEnabled: autoDetectEnabled || false,
    toggleAutoDetect,
    checkForLiveGames,
    isCheckingForGames,
  }
}
