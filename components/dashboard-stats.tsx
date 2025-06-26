"use client"

import { useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Users, Trophy, Activity, TrendingUp, Crown, BarChart3 } from "lucide-react"
import type { Player, Team } from "@/types/nba"

interface DashboardStatsProps {
  players: Player[]
  teams: Team[]
  loading: boolean
  isPremium: boolean
  onUpgrade: () => void
}

export function DashboardStats({ players, teams, loading, isPremium, onUpgrade }: DashboardStatsProps) {
  // Calcular estadísticas reales basadas en los datos
  const stats = useMemo(() => {
    if (!players.length || !teams.length) {
      return {
        totalPlayers: 0,
        totalTeams: 0,
        conferences: { East: 0, West: 0 },
        positions: { G: 0, F: 0, C: 0 },
        topTeams: [],
      }
    }

    // Contar conferencias
    const conferences = teams.reduce(
      (acc, team) => {
        acc[team.conference as keyof typeof acc]++
        return acc
      },
      { East: 0, West: 0 },
    )

    // Contar posiciones
    const positions = players.reduce(
      (acc, player) => {
        const pos = player.position?.[0] as keyof typeof acc
        if (pos && acc[pos] !== undefined) {
          acc[pos]++
        }
        return acc
      },
      { G: 0, F: 0, C: 0 },
    )

    // Equipos con más jugadores en la muestra
    const teamCounts = players.reduce(
      (acc, player) => {
        const teamId = player.team?.id
        if (teamId) {
          acc[teamId] = (acc[teamId] || 0) + 1
        }
        return acc
      },
      {} as Record<number, number>,
    )

    const topTeams = Object.entries(teamCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([teamId, count]) => {
        const team = teams.find((t) => t.id === Number.parseInt(teamId))
        return { team, count }
      })
      .filter((item) => item.team)

    return {
      totalPlayers: players.length,
      totalTeams: teams.length,
      conferences,
      positions,
      topTeams,
    }
  }, [players, teams])

  if (loading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="bg-white/5 border-white/10 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-600 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-600 rounded w-1/2"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Estadísticas Principales */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Jugadores Activos</p>
                <p className="text-2xl font-bold text-white">{stats.totalPlayers}</p>
              </div>
              <Users className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Equipos NBA</p>
                <p className="text-2xl font-bold text-white">{stats.totalTeams}</p>
              </div>
              <Trophy className="h-8 w-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Conferencia Este</p>
                <p className="text-2xl font-bold text-white">{stats.conferences.East}</p>
              </div>
              <Activity className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Conferencia Oeste</p>
                <p className="text-2xl font-bold text-white">{stats.conferences.West}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Distribución por Posiciones */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white">Distribución por Posiciones</CardTitle>
            <CardDescription className="text-gray-300">Jugadores por posición en la muestra actual</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-300">Guards (G)</span>
                <span className="text-sm font-medium text-white">{stats.positions.G}</span>
              </div>
              <Progress value={(stats.positions.G / stats.totalPlayers) * 100} className="h-2" />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-300">Forwards (F)</span>
                <span className="text-sm font-medium text-white">{stats.positions.F}</span>
              </div>
              <Progress value={(stats.positions.F / stats.totalPlayers) * 100} className="h-2" />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-300">Centers (C)</span>
                <span className="text-sm font-medium text-white">{stats.positions.C}</span>
              </div>
              <Progress value={(stats.positions.C / stats.totalPlayers) * 100} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Equipos con Más Jugadores */}
        <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white">Equipos Destacados</CardTitle>
            <CardDescription className="text-gray-300">Equipos con más jugadores en la muestra</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.topTeams.map((item, index) => (
                <div key={item.team?.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-xs">{item.team?.abbreviation}</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{item.team?.name}</p>
                      <p className="text-xs text-gray-400">{item.team?.city}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="border-gray-600 text-gray-300">
                    {item.count} jugadores
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sección Premium */}
      {!isPremium && (
        <Card className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border-orange-500/20 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Crown className="h-12 w-12 text-orange-400" />
                <div>
                  <h3 className="text-lg font-semibold text-white">Desbloquea Analytics Premium</h3>
                  <p className="text-gray-300">Accede a predicciones IA, análisis avanzados y métricas profesionales</p>
                </div>
              </div>
              <Button
                onClick={onUpgrade}
                className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
              >
                <Crown className="w-4 h-4 mr-2" />
                Upgrade Now
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Analytics Premium */}
      {isPremium && (
        <Card className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border-green-500/20 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-green-400" />
              Analytics Premium Activo
            </CardTitle>
            <CardDescription className="text-gray-300">
              Tienes acceso completo a todas las funciones avanzadas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">∞</div>
                <div className="text-sm text-gray-300">Búsquedas ilimitadas</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">AI</div>
                <div className="text-sm text-gray-300">Predicciones activas</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">24/7</div>
                <div className="text-sm text-gray-300">Soporte premium</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
