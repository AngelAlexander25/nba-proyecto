"use client"

import { useState, useEffect, useCallback } from "react"
import { dataCache } from "@/lib/data-cache"
import { StatsCalculator, type CalculatedTeamStats } from "@/lib/stats-calculator"
import type { Team, Player, Game } from "@/types/nba"

// Hook para equipos con cache persistente
export function usePersistentTeams() {
  const [teams, setTeams] = useState<Team[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTeams = useCallback(async (forceRefresh = false) => {
    const cacheKey = "teams"

    // Verificar cache primero
    if (!forceRefresh) {
      const cachedTeams = dataCache.get<Team[]>(cacheKey)
      if (cachedTeams) {
        setTeams(cachedTeams)
        setLoading(false)
        return
      }
    }

    try {
      setLoading(true)
      setError(null)

      const response = await fetch("/api/teams")
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.details || data.error || "Failed to fetch teams")
      }

      const teamsData = data.data || []
      setTeams(teamsData)

      // Guardar en cache por 1 hora
      dataCache.set(cacheKey, teamsData, 60 * 60 * 1000)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error fetching teams"
      setError(errorMessage)
      console.error("Error fetching teams:", err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchTeams()
  }, [fetchTeams])

  return { teams, loading, error, refetch: () => fetchTeams(true) }
}

// Hook para estadísticas de equipos calculadas con datos reales
export function usePersistentTeamStats(season = "2023") {
  const [teamStats, setTeamStats] = useState<CalculatedTeamStats[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const { teams } = usePersistentTeams()

  const fetchTeamStats = useCallback(
    async (forceRefresh = false) => {
      if (teams.length === 0) return

      const cacheKey = `team_stats_${season}`

      // Verificar cache primero
      if (!forceRefresh) {
        const cachedStats = dataCache.get<CalculatedTeamStats[]>(cacheKey)
        if (cachedStats) {
          setTeamStats(cachedStats)
          setLoading(false)
          return
        }
      }

      try {
        setLoading(true)
        setError(null)

        // Obtener juegos de la temporada para todos los equipos
        const gamesResponse = await fetch(`/api/games?seasons=${season}&per_page=100`)
        const gamesData = await gamesResponse.json()

        if (!gamesResponse.ok) {
          throw new Error(gamesData.details || gamesData.error || "Failed to fetch games")
        }

        const games: Game[] = gamesData.data || []

        // Calcular estadísticas para cada equipo
        const calculatedStats = teams.map((team) => StatsCalculator.calculateTeamStats(team, games))

        // Ordenar por porcentaje de victorias
        calculatedStats.sort((a, b) => b.win_percentage - a.win_percentage)

        setTeamStats(calculatedStats)

        // Guardar en cache por 30 minutos
        dataCache.set(cacheKey, calculatedStats, 30 * 60 * 1000)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Error calculating team stats"
        setError(errorMessage)
        console.error("Error calculating team stats:", err)
      } finally {
        setLoading(false)
      }
    },
    [teams, season],
  )

  useEffect(() => {
    fetchTeamStats()
  }, [fetchTeamStats])

  return { teamStats, loading, error, refetch: () => fetchTeamStats(true) }
}

// Hook para jugadores con cache persistente
export function usePersistentPlayers(params?: { search?: string; team_ids?: string; per_page?: number }) {
  const [players, setPlayers] = useState<Player[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPlayers = useCallback(
    async (forceRefresh = false) => {
      const cacheKey = `players_${JSON.stringify(params || {})}`

      // Verificar cache primero
      if (!forceRefresh) {
        const cachedPlayers = dataCache.get<Player[]>(cacheKey)
        if (cachedPlayers) {
          setPlayers(cachedPlayers)
          setLoading(false)
          return
        }
      }

      try {
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

        const playersData = data.data || []
        setPlayers(playersData)

        // Guardar en cache por 15 minutos
        dataCache.set(cacheKey, playersData, 15 * 60 * 1000)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Error fetching players"
        setError(errorMessage)
        console.error("Error fetching players:", err)
      } finally {
        setLoading(false)
      }
    },
    [params],
  )

  useEffect(() => {
    fetchPlayers()
  }, [fetchPlayers])

  return { players, loading, error, refetch: () => fetchPlayers(true) }
}

// Hook para obtener estadísticas del cache
export function useCacheStats() {
  const [cacheStats, setCacheStats] = useState({ size: 0, keys: [] as string[] })

  const updateStats = useCallback(() => {
    setCacheStats(dataCache.getStats())
  }, [])

  const clearCache = useCallback(
    (key?: string) => {
      dataCache.clear(key)
      updateStats()
    },
    [updateStats],
  )

  useEffect(() => {
    updateStats()
    const interval = setInterval(updateStats, 5000) // Actualizar cada 5 segundos
    return () => clearInterval(interval)
  }, [updateStats])

  return { cacheStats, clearCache, updateStats }
}
