"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { RefreshCw } from "lucide-react"
import { usePersistentTeamStats } from "@/hooks/use-persistent-nba-data"
import { ApiErrorDisplay } from "@/components/error-boundary"
import type { CalculatedTeamStats } from "@/lib/stats-calculator"

export default function Equipos() {
  const [selectedSeason, setSelectedSeason] = useState("2023")
  const { teamStats, loading, error, refetch } = usePersistentTeamStats(selectedSeason)

  // Separar equipos por conferencia
  const easternTeams = teamStats.filter((team) => team.team.conference === "East")
  const westernTeams = teamStats.filter((team) => team.team.conference === "West")

  // Ordenar por porcentaje de victorias
  easternTeams.sort((a, b) => b.win_percentage - a.win_percentage)
  westernTeams.sort((a, b) => b.win_percentage - a.win_percentage)

  const TeamTable = ({ teams, conference }: { teams: CalculatedTeamStats[]; conference: string }) => (
    <div className="space-y-4">
      {teams.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No hay datos disponibles para la Conferencia {conference}</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {teams.map((teamStat, index) => (
            <Card key={teamStat.team.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold">
                      {index + 1}
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-secondary-foreground font-bold text-sm">
                        {teamStat.team.abbreviation}
                      </div>
                      <div>
                        <p className="font-medium">{teamStat.team.full_name}</p>
                        <p className="text-sm text-muted-foreground">{teamStat.team.division}</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-6 gap-4 text-center text-sm">
                    <div>
                      <p className="font-medium">
                        {teamStat.wins}-{teamStat.losses}
                      </p>
                      <p className="text-xs text-muted-foreground">W-L</p>
                    </div>
                    <div>
                      <p className="font-medium">{(teamStat.win_percentage * 100).toFixed(1)}%</p>
                      <p className="text-xs text-muted-foreground">PCT</p>
                    </div>
                    <div>
                      <p className="font-medium">
                        {teamStat.home_wins}-{teamStat.home_losses}
                      </p>
                      <p className="text-xs text-muted-foreground">Casa</p>
                    </div>
                    <div>
                      <p className="font-medium">
                        {teamStat.away_wins}-{teamStat.away_losses}
                      </p>
                      <p className="text-xs text-muted-foreground">Visita</p>
                    </div>
                    <div>
                      <p className="font-medium">{teamStat.last_10_record}</p>
                      <p className="text-xs text-muted-foreground">Últimos 10</p>
                    </div>
                    <div>
                      <Badge variant={teamStat.current_streak.startsWith("W") ? "default" : "destructive"}>
                        {teamStat.current_streak}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t">
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Puntos a favor</p>
                      <p className="font-medium">{teamStat.points_per_game.toFixed(1)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Puntos en contra</p>
                      <p className="font-medium">{teamStat.points_allowed_per_game.toFixed(1)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Diferencial</p>
                      <p
                        className={`font-medium ${teamStat.point_differential >= 0 ? "text-green-600" : "text-red-600"}`}
                      >
                        {teamStat.point_differential >= 0 ? "+" : ""}
                        {teamStat.point_differential.toFixed(1)}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )

  if (error) {
    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center space-x-2">
          <SidebarTrigger />
          <h2 className="text-3xl font-bold tracking-tight">Equipos NBA</h2>
        </div>
        <ApiErrorDisplay error={error} onRetry={() => refetch()} title="Error al cargar equipos" />
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <SidebarTrigger />
          <h2 className="text-3xl font-bold tracking-tight">Equipos NBA</h2>
        </div>
        <Button variant="outline" size="sm" onClick={() => refetch()}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Actualizar
        </Button>
      </div>

      <Tabs defaultValue="eastern" className="space-y-4">
        <TabsList>
          <TabsTrigger value="eastern">Conferencia Este ({easternTeams.length})</TabsTrigger>
          <TabsTrigger value="western">Conferencia Oeste ({westernTeams.length})</TabsTrigger>
          <TabsTrigger value="stats">Estadísticas</TabsTrigger>
        </TabsList>

        <TabsContent value="eastern" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Conferencia Este</CardTitle>
              <CardDescription>
                Clasificación actual basada en datos reales de la temporada {selectedSeason}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="h-20 bg-muted animate-pulse rounded" />
                  ))}
                </div>
              ) : (
                <TeamTable teams={easternTeams} conference="Este" />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="western" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Conferencia Oeste</CardTitle>
              <CardDescription>
                Clasificación actual basada en datos reales de la temporada {selectedSeason}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="h-20 bg-muted animate-pulse rounded" />
                  ))}
                </div>
              ) : (
                <TeamTable teams={westernTeams} conference="Oeste" />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stats" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Mejores Ofensivas</CardTitle>
                <CardDescription>Equipos con mayor promedio de puntos (datos reales)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {teamStats
                    .sort((a, b) => b.points_per_game - a.points_per_game)
                    .slice(0, 5)
                    .map((team, index) => (
                      <div key={team.team.id} className="flex items-center space-x-4">
                        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{team.team.full_name}</p>
                          <Progress value={(team.points_per_game / 130) * 100} className="h-2" />
                        </div>
                        <div className="text-sm font-medium">{team.points_per_game.toFixed(1)}</div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Mejores Defensivas</CardTitle>
                <CardDescription>Equipos que menos puntos permiten (datos reales)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {teamStats
                    .sort((a, b) => a.points_allowed_per_game - b.points_allowed_per_game)
                    .slice(0, 5)
                    .map((team, index) => (
                      <div key={team.team.id} className="flex items-center space-x-4">
                        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-green-600 text-white text-xs font-bold">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{team.team.full_name}</p>
                          <Progress value={((130 - team.points_allowed_per_game) / 30) * 100} className="h-2" />
                        </div>
                        <div className="text-sm font-medium">{team.points_allowed_per_game.toFixed(1)}</div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
