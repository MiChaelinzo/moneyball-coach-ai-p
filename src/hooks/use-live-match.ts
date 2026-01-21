import { useState, useEffect, useCallback } from 'react'
import type { LiveMatch } from '@/lib/types'
import { createInitialLiveMatch, simulateLiveMatchUpdate } from '@/lib/mockData'
import { useKV } from '@github/spark/hooks'

export function useLiveMatch() {
  const [liveMatch, setLiveMatch] = useKV<LiveMatch>('live-match', createInitialLiveMatch())
  const [isTracking, setIsTracking] = useState(false)

  const currentMatch = liveMatch || createInitialLiveMatch()

  useEffect(() => {
    if (!currentMatch.isActive) {
      return
    }

    const interval = setInterval(() => {
      setLiveMatch((current) => {
        const match = current || createInitialLiveMatch()
        return simulateLiveMatchUpdate(match)
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [currentMatch.isActive, setLiveMatch])

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

  return {
    liveMatch: currentMatch,
    isTracking,
    toggleTracking,
    resetMatch
  }
}
