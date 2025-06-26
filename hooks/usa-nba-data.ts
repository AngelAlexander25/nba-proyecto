"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import type { Team, Player, Game } from "@/types/nba"
import { apiCache } from "@/lib/cache"

interface UseTeamsResult {
  teams: Team[]
  loading: boolean
  error: string | null
  refetch: () => void
}

export function useTeams(): UseTeamsResult {
  const [teams, setTeams] = useState<Team[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTeams = useCallback(async () => {
    const cacheKey = "teams_all"

    // Verificar cache primero
    const cachedData = apiCache.get<Team[]>(cacheKey)
    if (cachedData && Array.isArray(cachedData)) {
      setTeams(cachedData)
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)

      const response = await fetch("/api/teams")
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.details || data.error || "Failed to fetch teams")
      }

      const teamsData = Array.isArray(data.data) ? data.data : []
      setTeams(teamsData)

      // Guardar en cache por 1 hora
      if (teamsData.length > 0) {
        apiCache.set(cacheKey, teamsData, 60 * 60 * 1000)
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error fetching teams"
      setError(errorMessage)
      console.error("Error fetching teams:", err)

      // Try to use any cached data as fallback
      const fallbackData = apiCache.get<Team[]>(cacheKey)
      if (fallbackData && Array.isArray(fallbackData)) {
        setTeams(fallbackData)
        setError("Using cached data. Some information may be outdated.")
      } else {
        setTeams([])
      }
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchTeams()
  }, [fetchTeams])

  return { teams, loading, error, refetch: fetchTeams }
}

interface UsePlayersResult {
  players: Player[]
  loading: boolean
  error: string | null
  hasMore: boolean
  isRateLimited: boolean
  refetch: (params?: {
    search?: string
    team_ids?: string
    per_page?: number
    reset?: boolean
  }) => void
}

export function usePlayers(initialParams?: {
  search?: string
  team_ids?: string
  per_page?: number
}): UsePlayersResult {
  const [players, setPlayers] = useState<Player[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(true)
  const [isRateLimited, setIsRateLimited] = useState(false)
  const lastRequestTime = useRef<number>(0)
  const rateLimitCooldown = useRef<NodeJS.Timeout | null>(null)
  const hasInitialized = useRef(false)

  const fetchPlayers = useCallback(
    async (params?: {
      search?: string
      team_ids?: string
      per_page?: number
      reset?: boolean
    }) => {
      // Si estamos en cooldown de rate limit, no hacer la request
      if (isRateLimited) {
        return
      }

      // Crear clave de cache basada en parámetros
      const cacheKey = params?.search
        ? `players_search_${params.search.toLowerCase()}`
        : params?.team_ids
          ? `players_team_${params.team_ids}`
          : `players_default_${params?.per_page || 20}`

      // Verificar cache primero
      const cachedData = apiCache.get<Player[]>(cacheKey)
      if (cachedData && Array.isArray(cachedData) && (params?.reset || players.length === 0)) {
        console.log(`Using cached players: ${cacheKey}`)
        setPlayers(cachedData)
        setLoading(false)
        setError(null)
        return
      }

      // Si ya tenemos datos y no es reset, no hacer nueva request
      if (players.length > 0 && !params?.reset && !params?.search) {
        return
      }

      // Rate limiting: esperar al menos 5 segundos entre requests
      const now = Date.now()
      const timeSinceLastRequest = now - lastRequestTime.current
      if (timeSinceLastRequest < 5000) {
        console.log("Rate limiting: waiting before next request")
        await new Promise((resolve) => setTimeout(resolve, 5000 - timeSinceLastRequest))
      }

      try {
        if (params?.reset) {
          setPlayers([])
        }

        setLoading(true)
        setError(null)
        setIsRateLimited(false)

        const searchParams = new URLSearchParams()
        if (params?.search) searchParams.append("search", params.search)
        if (params?.team_ids) searchParams.append("team_ids", params.team_ids)
        if (params?.per_page) searchParams.append("per_page", Math.min(params.per_page, 20).toString()) // Reduced limit

        lastRequestTime.current = Date.now()
        console.log(`Fetching players: ${cacheKey}`)
        const response = await fetch(`/api/players?${searchParams.toString()}`)
        const data = await response.json()

        if (!response.ok) {
          if (response.status === 429) {
            // Rate limit alcanzado
            setIsRateLimited(true)
            setError("Too many requests. Please wait 2 minutes before trying again.")

            // Cooldown de 2 minutos
            if (rateLimitCooldown.current) {
              clearTimeout(rateLimitCooldown.current)
            }
            rateLimitCooldown.current = setTimeout(() => {
              setIsRateLimited(false)
              setError(null)
            }, 120000) // 2 minutes

            return
          }
          throw new Error(data.details || data.error || "Failed to fetch players")
        }

        const newPlayers = Array.isArray(data.data) ? data.data : []

        if (params?.reset || players.length === 0) {
          setPlayers(newPlayers)
          // Guardar en cache por 15 minutos
          if (newPlayers.length > 0) {
            apiCache.set(cacheKey, newPlayers, 15 * 60 * 1000)
          }
        } else {
          setPlayers((prev) => {
            const currentPlayers = Array.isArray(prev) ? prev : []
            return [...currentPlayers, ...newPlayers]
          })
        }

        setHasMore(newPlayers.length === (params?.per_page || 20))
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Error fetching players"
        setError(errorMessage)
        console.error("Error fetching players:", err)

        // Intentar usar datos del cache como último recurso
        const fallbackData = apiCache.getWithFallback<Player[]>(cacheKey, [
          "players_default_25",
          "players_default_20",
          "players_search_",
        ])

        if (fallbackData && Array.isArray(fallbackData) && fallbackData.length > 0) {
          console.log("Using fallback cache data")
          setPlayers(fallbackData)
          setError("Using cached data. Some information may be outdated.")
        } else if (params?.reset) {
          setPlayers([])
        }
      } finally {
        setLoading(false)
      }
    },
    [isRateLimited, players.length],
  )

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (rateLimitCooldown.current) {
        clearTimeout(rateLimitCooldown.current)
      }
    }
  }, [])

  // Inicialización automática con delay
  useEffect(() => {
    if (!hasInitialized.current && !initialParams?.search) {
      hasInitialized.current = true
      // Add delay to prevent immediate API call
      setTimeout(() => {
        fetchPlayers({ per_page: initialParams?.per_page || 20, reset: true })
      }, 1000)
    }
  }, [fetchPlayers, initialParams])

  return {
    players: Array.isArray(players) ? players : [],
    loading,
    error,
    hasMore,
    isRateLimited,
    refetch: fetchPlayers,
  }
}

interface UseGamesResult {
  games: Game[]
  loading: boolean
  error: string | null
  hasMore: boolean
  refetch: (params?: {
    seasons?: string
    team_ids?: string
    dates?: string
    per_page?: number
    start_date?: string
    end_date?: string
    reset?: boolean
  }) => void
}

export function useGames(initialParams?: {
  seasons?: string
  team_ids?: string
  dates?: string
  per_page?: number
  start_date?: string
  end_date?: string
}): UseGamesResult {
  const [games, setGames] = useState<Game[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(true)
  const lastRequestTime = useRef<number>(0)

  const fetchGames = useCallback(
    async (params?: {
      seasons?: string
      team_ids?: string
      dates?: string
      per_page?: number
      start_date?: string
      end_date?: string
      reset?: boolean
    }) => {
      // Crear clave de cache
      const cacheKey = `games_${params?.seasons || "2024"}_${params?.team_ids || "all"}_${params?.dates || "recent"}`

      // Verificar cache primero
      const cachedData = apiCache.get<Game[]>(cacheKey)
      if (cachedData && Array.isArray(cachedData) && (params?.reset || games.length === 0)) {
        setGames(cachedData)
        setLoading(false)
        return
      }

      // Rate limiting: esperar al menos 5 segundos entre requests
      const now = Date.now()
      const timeSinceLastRequest = now - lastRequestTime.current
      if (timeSinceLastRequest < 5000) {
        await new Promise((resolve) => setTimeout(resolve, 5000 - timeSinceLastRequest))
      }

      try {
        if (params?.reset) {
          setGames([])
        }

        setLoading(true)
        setError(null)

        const searchParams = new URLSearchParams()
        if (params?.seasons) searchParams.append("seasons", params.seasons)
        if (params?.team_ids) searchParams.append("team_ids", params.team_ids)
        if (params?.dates) searchParams.append("dates", params.dates)
        if (params?.per_page) searchParams.append("per_page", Math.min(params.per_page, 20).toString())
        if (params?.start_date) searchParams.append("start_date", params.start_date)
        if (params?.end_date) searchParams.append("end_date", params.end_date)

        lastRequestTime.current = Date.now()
        const response = await fetch(`/api/games?${searchParams.toString()}`)
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.details || data.error || "Failed to fetch games")
        }

        const newGames = Array.isArray(data.data) ? data.data : []

        if (params?.reset || games.length === 0) {
          setGames(newGames)
          // Guardar en cache por 10 minutos
          if (newGames.length > 0) {
            apiCache.set(cacheKey, newGames, 10 * 60 * 1000)
          }
        } else {
          setGames((prev) => {
            const currentGames = Array.isArray(prev) ? prev : []
            return [...currentGames, ...newGames]
          })
        }

        setHasMore(newGames.length === (params?.per_page || 20))
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Error fetching games"
        setError(errorMessage)
        console.error("Error fetching games:", err)

        // Intentar usar datos del cache como fallback
        const fallbackData = apiCache.getWithFallback<Game[]>(cacheKey)
        if (fallbackData && Array.isArray(fallbackData)) {
          setGames(fallbackData)
          setError("Using cached data. Some information may be outdated.")
        } else if (params?.reset) {
          setGames([])
        }
      } finally {
        setLoading(false)
      }
    },
    [games.length],
  )

  return {
    games: Array.isArray(games) ? games : [],
    loading,
    error,
    hasMore,
    refetch: fetchGames,
  }
}

// Hook para estadísticas con cache mejorado
interface UsePlayerStatsResult {
  stats: any[]
  loading: boolean
  error: string | null
  refetch: (params?: {
    player_ids?: string
    seasons?: string
    per_page?: number
  }) => void
}

export function usePlayerStats(initialParams?: {
  player_ids?: string
  seasons?: string
  per_page?: number
}): UsePlayerStatsResult {
  const [stats, setStats] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const lastRequestTime = useRef<number>(0)

  const fetchStats = useCallback(
    async (params?: {
      player_ids?: string
      seasons?: string
      per_page?: number
    }) => {
      if (!params?.player_ids) return

      // Verificar cache
      const cacheKey = `stats_${params.player_ids}_${params.seasons || "2024"}`
      const cachedData = apiCache.get<any[]>(cacheKey)
      if (cachedData && Array.isArray(cachedData)) {
        setStats(cachedData)
        setLoading(false)
        return
      }

      // Rate limiting
      const now = Date.now()
      const timeSinceLastRequest = now - lastRequestTime.current
      if (timeSinceLastRequest < 5000) {
        await new Promise((resolve) => setTimeout(resolve, 5000 - timeSinceLastRequest))
      }

      try {
        setLoading(true)
        setError(null)

        const searchParams = new URLSearchParams()
        if (params.player_ids) searchParams.append("player_ids", params.player_ids)
        if (params.seasons) searchParams.append("seasons", params.seasons)
        if (params.per_page) searchParams.append("per_page", Math.min(params.per_page, 50).toString())

        lastRequestTime.current = Date.now()
        const response = await fetch(`/api/stats?${searchParams.toString()}`)
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.details || data.error || "Failed to fetch stats")
        }

        const statsData = Array.isArray(data.data) ? data.data : []
        setStats(statsData)

        // Guardar en cache por 15 minutos
        if (statsData.length > 0) {
          apiCache.set(cacheKey, statsData, 15 * 60 * 1000)
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Error fetching stats"
        setError(errorMessage)
        console.error("Error fetching stats:", err)

        // Intentar fallback del cache
        const fallbackData = apiCache.getWithFallback<any[]>(cacheKey)
        if (fallbackData && Array.isArray(fallbackData)) {
          setStats(fallbackData)
          setError("Using cached data.")
        } else {
          setStats([])
        }
      } finally {
        setLoading(false)
      }
    },
    [],
  )

  useEffect(() => {
    if (initialParams?.player_ids) {
      // Add delay to prevent immediate API call
      setTimeout(() => {
        fetchStats(initialParams)
      }, 2000)
    }
  }, [initialParams, fetchStats])

  return {
    stats: Array.isArray(stats) ? stats : [],
    loading,
    error,
    refetch: fetchStats,
  }
}
