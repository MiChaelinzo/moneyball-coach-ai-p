import { useState, useEffect, useCallback } from 'react'
import { useKV } from '@github/spark/hooks'
import { toast } from 'sonner'
import type { Player, Match, Tournament } from '@/lib/types'
import {
  initializeGridApi,
  isGridApiInitialized,
  fetchCloud9Players,
  fetchCloud9Matches,
  fetchCloud9Tournaments,
  enrichPlayersWithStats,
  fetchCloud9Organization,
  type Organization,
} from '@/lib/gridApi'

interface GridDataState {
  players: Player[]
  matches: Match[]
  tournaments: Tournament[]
  organization: Organization | null
  isLoading: boolean
  error: string | null
  isInitialized: boolean
}

const DEFAULT_API_KEY = 'GacqICJfwHbtteMEbQ8mUVztiBHCuKuzijh7m4N8'

export function useGridData() {
  const [apiKey, setApiKey] = useKV<string>('grid-api-key', DEFAULT_API_KEY)
  const [cachedPlayers, setCachedPlayers] = useKV<Player[]>('grid-cached-players', [])
  const [cachedMatches, setCachedMatches] = useKV<Match[]>('grid-cached-matches', [])
  const [cachedTournaments, setCachedTournaments] = useKV<Tournament[]>('grid-cached-tournaments', [])
  const [cachedOrganization, setCachedOrganization] = useKV<Organization | null>('grid-cached-organization', null)
  const [lastFetchTime, setLastFetchTime] = useKV<number>('grid-last-fetch', 0)
  
  const [state, setState] = useState<GridDataState>({
    players: cachedPlayers || [],
    matches: cachedMatches || [],
    tournaments: cachedTournaments || [],
    organization: cachedOrganization || null,
    isLoading: false,
    error: null,
    isInitialized: isGridApiInitialized(),
  })

  const CACHE_DURATION = 5 * 60 * 1000

  const initializeApi = useCallback((key: string) => {
    if (!key || key.trim().length === 0) {
      setState(prev => ({ ...prev, error: 'API key is required', isInitialized: false }))
      return
    }

    try {
      initializeGridApi(key)
      setApiKey(key)
      setState(prev => ({ ...prev, isInitialized: true, error: null }))
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Failed to initialize GRID API',
        isInitialized: false
      }))
    }
  }, [setApiKey])

  const fetchData = useCallback(async (forceRefresh: boolean = false) => {
    if (!isGridApiInitialized()) {
      setState(prev => ({ ...prev, error: 'GRID API not initialized' }))
      return
    }

    const now = Date.now()
    const timeSinceLastFetch = now - (lastFetchTime || 0)
    
    if (!forceRefresh && timeSinceLastFetch < CACHE_DURATION && cachedPlayers && cachedPlayers.length > 0) {
      console.log('Using cached data, last fetch:', Math.floor(timeSinceLastFetch / 1000), 'seconds ago')
      setState(prev => ({
        ...prev,
        players: cachedPlayers,
        matches: cachedMatches || [],
        tournaments: cachedTournaments || [],
        organization: cachedOrganization || null,
        isLoading: false,
        error: null,
      }))
      return
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }))
    console.log('=== Starting GRID API Data Fetch ===')
    console.log('Force refresh:', forceRefresh)
    toast.info('Fetching Cloud9 data from GRID API...')

    try {
      console.log('Step 1: Fetching organization, players, matches, and tournaments in parallel...')
      const [organization, players, matches, tournaments] = await Promise.all([
        fetchCloud9Organization(),
        fetchCloud9Players(),
        fetchCloud9Matches(10),
        fetchCloud9Tournaments(20),
      ])

      console.log('Step 2: Enriching players with statistics...')
      const enrichedPlayers = await enrichPlayersWithStats(players)

      console.log('Step 3: Caching data...')
      setCachedOrganization(organization)
      setCachedPlayers(enrichedPlayers)
      setCachedMatches(matches)
      setCachedTournaments(tournaments)
      setLastFetchTime(now)

      console.log('Step 4: Updating state...')
      setState({
        players: enrichedPlayers,
        matches,
        tournaments,
        organization,
        isLoading: false,
        error: null,
        isInitialized: true,
      })

      console.log('=== GRID API Data Fetch Complete ===')
      console.log('Organization:', organization?.name || 'N/A')
      console.log('Teams:', organization?.teams?.length || 0)
      console.log('Players:', enrichedPlayers.length)
      console.log('Matches:', matches.length)
      console.log('Tournaments:', tournaments.length)
      toast.success(`Loaded ${organization?.name || 'organization'} data: ${enrichedPlayers.length} players, ${matches.length} matches`)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch data from GRID API'
      console.error('=== GRID API Data Fetch Failed ===')
      console.error('Error:', errorMessage)
      console.error('Full error:', error)
      
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
        players: cachedPlayers || [],
        matches: cachedMatches || [],
        tournaments: cachedTournaments || [],
        organization: cachedOrganization || null,
      }))
      toast.error(`Failed to fetch data: ${errorMessage}`)
    }
  }, [lastFetchTime, cachedPlayers, cachedMatches, cachedTournaments, cachedOrganization, setCachedPlayers, setCachedMatches, setCachedTournaments, setCachedOrganization, setLastFetchTime])

  const clearApiKey = useCallback(() => {
    setApiKey(DEFAULT_API_KEY)
    initializeGridApi(DEFAULT_API_KEY)
    setState(prev => ({
      ...prev,
      isInitialized: true,
      error: null,
    }))
  }, [setApiKey])

  useEffect(() => {
    if (apiKey && apiKey.length > 0) {
      if (!isGridApiInitialized()) {
        initializeApi(apiKey)
      }
    } else {
      initializeApi(DEFAULT_API_KEY)
    }
  }, [apiKey, initializeApi])

  useEffect(() => {
    if (isGridApiInitialized() && cachedPlayers && cachedPlayers.length > 0) {
      setState(prev => ({
        ...prev,
        players: cachedPlayers,
        matches: cachedMatches || [],
        tournaments: cachedTournaments || [],
        organization: cachedOrganization || null,
        isInitialized: true,
      }))
    }
  }, [cachedPlayers, cachedMatches, cachedTournaments, cachedOrganization])

  return {
    ...state,
    apiKey: apiKey || '',
    initializeApi,
    fetchData,
    clearApiKey,
    hasCachedData: (cachedPlayers?.length || 0) > 0,
  }
}
