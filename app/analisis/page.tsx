"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { ContrastIcon as Versus, BarChart3, Users, RefreshCw } from "lucide-react"
import { usePersistentTeams, usePersistentPlayers, usePersistentTeamStats } from "@/hooks/use-persistent-nba-data"
import { ApiErrorDisplay } from "@/components/error-boundary"
import type { CalculatedTeamStats } from "@/lib/stats-calculator"
import type { Player } from "@/types/nba"

interface TeamComparison {
  team1: CalculatedTeamStats
  team2: CalculatedTeamStats
}

interface PlayerComparison {
  player1: Player
  player2: Player
}

export default function Analisis() {
  const [selectedTeam1, setSelectedTeam1] = useState("")
  const [selectedTeam2, setSelectedTeam2] = useState("")
  const [selectedPlayer1, setSelectedPlayer1] = useState("")
  const [selectedPlayer2, setSelectedPlayer2] = useState("")
  const [teamComparison, setTeamComparison] = useState<TeamComparison | null>(null)
  const [playerComparison, setPlayerComparison] = useState<PlayerComparison | null>(null)

  const { teams, loading: teamsLoading, error: teamsError } = usePersistentTeams()
  const { players, loading: playersLoading, error: playersError } = usePersistentPlayers({ per_page: 100 })
  const { teamStats, loading: statsLoading, error: statsError } = usePersistentTeamStats("2023")

  const compareTeams = () => {
    if (!selectedTeam1 || !selectedTeam2) return

    const team1Stats = teamStats.find((t) => t.team.id.toString() === selectedTeam1)
    const team2Stats = teamStats.find((t) => t.team.id.toString() === selectedTeam2)

    if (!team1Stats || !team2Stats) return

    setTeamComparison({
      team1: team1Stats,
      team2: team2Stats,
    })
  }

  const comparePlayers = () => {
    if (!selectedPlayer1 || !selectedPlayer2) return

    const player1 = players.find((p) => p.id.toString() === selectedPlayer1)
    const player2 = players.find((p) => p.id.toString() === selectedPlayer2)

    if (!player1 || !player2) return

    setPlayerComparison({
      player1,
      player2,
    })
  }

  const StatComparison = ({
    label,
    value1,
    value2,
    format = (v: number) => v.toFixed(1),
  }: {
    label: string
    value1: number
    value2: number
    format?: (v: number) => string
  }) => {
    const isValue1Better = value1 > value2
    return (
      <div className="flex items-center justify-between py-2 border-b">
        <div className="flex-1 text-right">
          <span className={`font-medium ${isValue1Better ? "text-green-600" : "text-muted-foreground"}`}>
            {format(value1)}
          </span>
        </div>
        <div className="flex-1 text-center px-4">
          <span className="text-sm text-muted-foreground">{label}</span>
        </div>
        <div className="flex-1 text-left">
          <span className={`font-medium ${!isValue1Better ? "text-green-600" : "text-muted-foreground"}`}>
            {format(value2)}
          </span>
        </div>
      </div>
    )
  }

  const error = teamsError || playersError || statsError
  const loading = teamsLoading || playersLoading || statsLoading

  if (error) {
    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center space-x-2">
          <SidebarTrigger />
          <h2 className="text-3xl font-bold tracking-tight">Análisis y Comparaciones</h2>
        </div>
        <ApiErrorDisplay error={error} onRetry={() => window.location.reload()} title="Error al cargar datos" />
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <SidebarTrigger />
          <h2 className="text-3xl font-bold tracking-tight">Análisis y Comparaciones</h2>
        </div>
        <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Actualizar
        </Button>
      </div>

      <Tabs defaultValue="teams" className="space-y-4">
        <TabsList>
          <TabsTrigger value="teams">Comparar Equipos</TabsTrigger>
          <TabsTrigger value="players">Comparar Jugadores</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="teams" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Comparación de Equipos (Datos Reales)
              </CardTitle>
              <CardDescription>Selecciona dos equipos para comparar sus estadísticas reales</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Cargando datos de equipos...</p>
                </div>
              ) : (
                <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
                  <Select value={selectedTeam1} onValueChange={setSelectedTeam1}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Seleccionar primer equipo" />
                    </SelectTrigger>
                    <SelectContent>
                      {teams.map((team) => (
                        <SelectItem key={team.id} value={team.id.toString()}>
                          {team.full_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <div className="flex items-center justify-center">
                    <Versus className="h-6 w-6 text-muted-foreground" />
                  </div>

                  <Select value={selectedTeam2} onValueChange={setSelectedTeam2}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Seleccionar segundo equipo" />
                    </SelectTrigger>
                    <SelectContent>
                      {teams.map((team) => (
                        <SelectItem key={team.id} value={team.id.toString()}>
                          {team.full_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Button onClick={compareTeams} disabled={!selectedTeam1 || !selectedTeam2}>
                    Comparar
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {teamComparison && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="text-center">
                      <p className="font-bold">{teamComparison.team1.team.full_name}</p>
                      <Badge variant="outline">{teamComparison.team1.team.abbreviation}</Badge>
                    </div>
                    <Versus className="h-6 w-6" />
                    <div className="text-center">
                      <p className="font-bold">{teamComparison.team2.team.full_name}</p>
                      <Badge variant="outline">{teamComparison.team2.team.abbreviation}</Badge>
                    </div>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <StatComparison
                    label="Victorias"
                    value1={teamComparison.team1.wins}
                    value2={teamComparison.team2.wins}
                    format={(v) => v.toString()}
                  />
                  <StatComparison
                    label="% Victorias"
                    value1={teamComparison.team1.win_percentage}
                    value2={teamComparison.team2.win_percentage}
                    format={(v) => `${(v * 100).toFixed(1)}%`}
                  />
                  <StatComparison
                    label="Puntos por juego"
                    value1={teamComparison.team1.points_per_game}
                    value2={teamComparison.team2.points_per_game}
                  />
                  <StatComparison
                    label="Puntos permitidos"
                    value1={teamComparison.team2.points_allowed_per_game} // Invertido: menos es mejor
                    value2={teamComparison.team1.points_allowed_per_game}
                    format={(v) => v.toFixed(1)}
                  />
                  <StatComparison
                    label="Diferencial de puntos"
                    value1={teamComparison.team1.point_differential}
                    value2={teamComparison.team2.point_differential}
                    format={(v) => `${v >= 0 ? "+" : ""}${v.toFixed(1)}`}
                  />
                  <StatComparison
                    label="Record en casa"
                    value1={
                      teamComparison.team1.home_wins /
                      (teamComparison.team1.home_wins + teamComparison.team1.home_losses)
                    }
                    value2={
                      teamComparison.team2.home_wins /
                      (teamComparison.team2.home_wins + teamComparison.team2.home_losses)
                    }
                    format={(v) => `${(v * 100).toFixed(1)}%`}
                  />
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="players" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Comparación de Jugadores (Datos Reales)
              </CardTitle>
              <CardDescription>Selecciona dos jugadores para comparar su información</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Cargando datos de jugadores...</p>
                </div>
              ) : (
                <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
                  <Select value={selectedPlayer1} onValueChange={setSelectedPlayer1}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Seleccionar primer jugador" />
                    </SelectTrigger>
                    <SelectContent>
                      {players.map((player) => (
                        <SelectItem key={player.id} value={player.id.toString()}>
                          {player.first_name} {player.last_name} ({player.team?.abbreviation || "N/A"})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <div className="flex items-center justify-center">
                    <Versus className="h-6 w-6 text-muted-foreground" />
                  </div>

                  <Select value={selectedPlayer2} onValueChange={setSelectedPlayer2}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Seleccionar segundo jugador" />
                    </SelectTrigger>
                    <SelectContent>
                      {players.map((player) => (
                        <SelectItem key={player.id} value={player.id.toString()}>
                          {player.first_name} {player.last_name} ({player.team?.abbreviation || "N/A"})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Button onClick={comparePlayers} disabled={!selectedPlayer1 || !selectedPlayer2}>
                    Comparar
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {playerComparison && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="text-center">
                      <p className="font-bold">
                        {playerComparison.player1.first_name} {playerComparison.player1.last_name}
                      </p>
                      <Badge variant="outline">{playerComparison.player1.team?.abbreviation || "N/A"}</Badge>
                    </div>
                    <Versus className="h-6 w-6" />
                    <div className="text-center">
                      <p className="font-bold">
                        {playerComparison.player2.first_name} {playerComparison.player2.last_name}
                      </p>
                      <Badge variant="outline">{playerComparison.player2.team?.abbreviation || "N/A"}</Badge>
                    </div>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-3">Información Física</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Altura:</span>
                        <span>{playerComparison.player1.height || "N/A"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Peso:</span>
                        <span>{playerComparison.player1.weight || "N/A"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Posición:</span>
                        <span>{playerComparison.player1.position || "N/A"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Jersey:</span>
                        <span>#{playerComparison.player1.jersey_number || "N/A"}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-3">Información Física</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Altura:</span>
                        <span>{playerComparison.player2.height || "N/A"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Peso:</span>
                        <span>{playerComparison.player2.weight || "N/A"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Posición:</span>
                        <span>{playerComparison.player2.position || "N/A"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Jersey:</span>
                        <span>#{playerComparison.player2.jersey_number || "N/A"}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Análisis de Datos Reales</CardTitle>
                <CardDescription>Insights basados en estadísticas actuales</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium">Equipos Más Consistentes</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Los equipos con menor diferencia entre record en casa y visitante tienden a ser más confiables
                      para apuestas.
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium">Diferencial de Puntos</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Los equipos con mejor diferencial de puntos (+/- por juego) suelen cubrir mejor los spreads.
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium">Rachas Actuales</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Las rachas de 3+ juegos (ganados o perdidos) pueden indicar tendencias importantes para
                      considerar.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Factores para Apuestas</CardTitle>
                <CardDescription>Métricas clave basadas en datos reales</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium">Record Real vs Expectativas</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Comparar el record actual con las expectativas pre-temporada puede revelar valor en las apuestas.
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium">Rendimiento por Conferencia</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Los equipos pueden tener diferentes rendimientos contra equipos de su conferencia vs la contraria.
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium">Últimos 10 Juegos</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      El record en los últimos 10 juegos puede ser más indicativo del rendimiento actual que el record
                      general.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
