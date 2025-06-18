"use client"

import { useState, useEffect, useCallback } from "react"
import type { Team, Player, Game } from "@/types/nba"

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
    try {
      setLoading(true)
      setError(null)

      const response = await fetch("/api/teams")
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.details || data.error || "Failed to fetch teams")
      }

      setTeams(data.data || [])
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error fetching teams"
      setError(errorMessage)
      console.error("Error fetching teams:", err)

      // No limpiar los datos existentes en caso de error
      if (teams.length === 0) {
        setTeams([]) // Solo limpiar si no hay datos previos
      }
    } finally {
      setLoading(false)
    }
  }, [teams.length])

  useEffect(() => {
    fetchTeams()
  }, [])

  return { teams, loading, error, refetch: fetchTeams }
}

interface UsePlayersResult {
  players: Player[]
  loading: boolean
  error: string | null
  hasMore: boolean
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
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(true)

  const fetchPlayers = useCallback(
    async (params?: {
      search?: string
      team_ids?: string
      per_page?: number
      reset?: boolean
    }) => {
      try {
        if (params?.reset) {
          setPlayers([])
        }

        setLoading(true)
        setError(null)

        const searchParams = new URLSearchParams()
        if (params?.search) searchParams.append("search", params.search)
        if (params?.team_ids) searchParams.append("team_ids", params.team_ids)
        if (params?.per_page) searchParams.append("per_page", Math.min(params.per_page, 100).toString())

        const response = await fetch(`/api/players?${searchParams.toString()}`)
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.details || data.error || "Failed to fetch players")
        }

        const newPlayers = data.data || []

        if (params?.reset) {
          setPlayers(newPlayers)
        } else {
          setPlayers((prev) => [...prev, ...newPlayers])
        }

        // Determinar si hay más datos
        setHasMore(newPlayers.length === (params?.per_page || 25))
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Error fetching players"
        setError(errorMessage)
        console.error("Error fetching players:", err)

        // En caso de error, mantener los datos existentes
        if (players.length === 0) {
          setPlayers([])
        }
      } finally {
        setLoading(false)
      }
    },
    [players.length],
  )

  useEffect(() => {
    fetchPlayers({ ...initialParams, reset: true })
  }, [])

  return { players, loading, error, hasMore, refetch: fetchPlayers }
}

// Hook similar para games con manejo de errores mejorado
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
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(true)

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
        if (params?.per_page) searchParams.append("per_page", Math.min(params.per_page, 100).toString())
        if (params?.start_date) searchParams.append("start_date", params.start_date)
        if (params?.end_date) searchParams.append("end_date", params.end_date)

        const response = await fetch(`/api/games?${searchParams.toString()}`)
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.details || data.error || "Failed to fetch games")
        }

        const newGames = data.data || []

        if (params?.reset) {
          setGames(newGames)
        } else {
          setGames((prev) => [...prev, ...newGames])
        }

        setHasMore(newGames.length === (params?.per_page || 25))
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Error fetching games"
        setError(errorMessage)
        console.error("Error fetching games:", err)

        if (games.length === 0) {
          setGames([])
        }
      } finally {
        setLoading(false)
      }
    },
    [games.length],
  )

  useEffect(() => {
    fetchGames({ ...initialParams, reset: true })
  }, [])

  return { games, loading, error, hasMore, refetch: fetchGames }
}
