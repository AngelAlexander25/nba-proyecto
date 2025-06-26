"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Trophy, TrendingUp, TrendingDown, RefreshCw } from "lucide-react"
import { usePersistentTeamStats } from "@/hooks/use-persistent-nba-data"
import { ApiErrorDisplay } from "@/components/error-boundary"
import type { CalculatedTeamStats } from "@/lib/stats-calculator"

interface PlayoffTeam extends CalculatedTeamStats {
  seed: number
  games_behind: number
  playoff_probability: number
  trend: "up" | "down" | "stable"
}

export default function Clasificacion() {
  const { teamStats, loading, error, refetch } = usePersistentTeamStats("2023")

  // Convertir estadísticas reales a formato de playoffs
  const convertToPlayoffTeams = (teams: CalculatedTeamStats[], conference: string): PlayoffTeam[] => {
    const conferenceTeams = teams.filter((team) => team.team.conference === conference)

    // Ordenar por porcentaje de victorias
    conferenceTeams.sort((a, b) => b.win_percentage - a.win_percentage)

    const leader = conferenceTeams[0]
    const leaderWins = leader?.wins || 0

    return conferenceTeams.slice(0, 10).map((team, index) => {
      const seed = index + 1
      const gamesBehind = seed === 1 ? 0 : Math.max(0, leaderWins - team.wins)

      // Calcular probabilidad de playoffs basada en posición y record
      let playoffProbability = 0
      if (seed <= 6) {
        playoffProbability = Math.min(95, 80 + team.win_percentage * 20)
      } else if (seed <= 8) {
        playoffProbability = Math.min(80, 40 + team.win_percentage * 40)
      } else {
        playoffProbability = Math.max(5, team.win_percentage * 30)
      }

      // Determinar tendencia basada en racha actual
      let trend: "up" | "down" | "stable" = "stable"
      if (team.current_streak.startsWith("W") && Number.parseInt(team.current_streak.slice(1)) >= 3) {
        trend = "up"
      } else if (team.current_streak.startsWith("L") && Number.parseInt(team.current_streak.slice(1)) >= 3) {
        trend = "down"
      }

      return {
        ...team,
        seed,
        games_behind: gamesBehind,
        playoff_probability: playoffProbability,
        trend,
      }
    })
  }

  const easternPlayoffs = convertToPlayoffTeams(teamStats, "East")
  const westernPlayoffs = convertToPlayoffTeams(teamStats, "West")

  const PlayoffCard = ({ teams, conference }: { teams: PlayoffTeam[]; conference: string }) => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5" />
          Playoffs - Conferencia {conference}
        </CardTitle>
        <CardDescription>Clasificación basada en datos reales de la temporada actual</CardDescription>
      </CardHeader>
      <CardContent>
        {teams.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No hay datos disponibles para la Conferencia {conference}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {teams.map((team) => (
              <div key={team.team.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div
                    className={`flex items-center justify-center w-8 h-8 rounded-full text-white text-sm font-bold ${
                      team.seed <= 6 ? "bg-green-600" : team.seed <= 8 ? "bg-yellow-600" : "bg-gray-600"
                    }`}
                  >
                    {team.seed}
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-sm">
                      {team.team.abbreviation}
                    </div>
                    <div>
                      <p className="font-medium">{team.team.full_name}</p>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-muted-foreground">
                          {team.wins}-{team.losses}
                        </span>
                        {team.games_behind > 0 && (
                          <span className="text-xs text-muted-foreground">{team.games_behind} GB</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-6">
                  <div className="text-center">
                    <p className="text-sm font-medium">{(team.win_percentage * 100).toFixed(1)}%</p>
                    <p className="text-xs text-muted-foreground">PCT</p>
                  </div>

                  <div className="text-center min-w-[80px]">
                    <div className="flex items-center justify-center space-x-1">
                      <span className="text-sm font-medium">{team.playoff_probability.toFixed(0)}%</span>
                      {team.trend === "up" && <TrendingUp className="h-4 w-4 text-green-600" />}
                      {team.trend === "down" && <TrendingDown className="h-4 w-4 text-red-600" />}
                    </div>
                    <Progress value={team.playoff_probability} className="h-2 w-16" />
                  </div>

                  <Badge variant={team.seed <= 6 ? "default" : team.seed <= 8 ? "secondary" : "outline"}>
                    {team.seed <= 6 ? "Playoffs" : team.seed <= 8 ? "Play-in" : "Eliminado"}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )

  if (error) {
    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center space-x-2">
          <SidebarTrigger />
          <h2 className="text-3xl font-bold tracking-tight">Clasificación NBA</h2>
        </div>
        <ApiErrorDisplay error={error} onRetry={() => refetch()} title="Error al cargar clasificación" />
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <SidebarTrigger />
          <h2 className="text-3xl font-bold tracking-tight">Clasificación NBA</h2>
        </div>
        <Button variant="outline" size="sm" onClick={() => refetch()}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Actualizar
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        {loading ? (
          <>
            <div className="h-96 bg-muted animate-pulse rounded-lg" />
            <div className="h-96 bg-muted animate-pulse rounded-lg" />
          </>
        ) : (
          <>
            <PlayoffCard teams={easternPlayoffs} conference="Este" />
            <PlayoffCard teams={westernPlayoffs} conference="Oeste" />
          </>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Playoffs Directos</CardTitle>
            <CardDescription>Posiciones 1-6</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-green-600 rounded-full" />
              <span className="text-sm">Clasificación automática a playoffs</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Play-in Tournament</CardTitle>
            <CardDescription>Posiciones 7-10</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-yellow-600 rounded-full" />
              <span className="text-sm">Torneo de play-in para playoffs</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Eliminados</CardTitle>
            <CardDescription>Posiciones 11-15</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-gray-600 rounded-full" />
              <span className="text-sm">Fuera de playoffs</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
