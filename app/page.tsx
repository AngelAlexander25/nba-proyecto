"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { RefreshCw, Database } from "lucide-react"
import { usePersistentTeams, usePersistentTeamStats, useCacheStats } from "@/hooks/use-persistent-nba-data"
import { ApiErrorDisplay } from "@/components/error-boundary"

export default function Dashboard() {
  const [selectedSeason, setSelectedSeason] = useState("2023")
  const { teams, loading: teamsLoading, error: teamsError } = usePersistentTeams()
  const { teamStats, loading: statsLoading, error: statsError, refetch } = usePersistentTeamStats(selectedSeason)
  const { cacheStats, clearCache } = useCacheStats()

  const seasons = ["2023", "2022", "2021", "2020", "2019"]
  const loading = teamsLoading || statsLoading
  const error = teamsError || statsError

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div className="flex items-center space-x-2">
          <SidebarTrigger />
          <h2 className="text-3xl font-bold tracking-tight">Dashboard NBA</h2>
        </div>
        <div className="flex items-center space-x-2">
          <Select value={selectedSeason} onValueChange={setSelectedSeason}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Seleccionar temporada" />
            </SelectTrigger>
            <SelectContent>
              {seasons.map((season) => (
                <SelectItem key={season} value={season}>
                  Temporada {season}-{Number.parseInt(season) + 1}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualizar
          </Button>
        </div>
      </div>

      {/* Información del Cache */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm">
            <Database className="h-4 w-4" />
            Estado del Cache
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between text-sm">
            <span>Elementos en cache: {cacheStats.size}</span>
            <Button variant="ghost" size="sm" onClick={() => clearCache()}>
              Limpiar Cache
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Equipos</CardTitle>
            <Badge variant="secondary">NBA</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teams.length}</div>
            <p className="text-xs text-muted-foreground">30 equipos en la liga</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Temporada Actual</CardTitle>
            <Badge variant="outline">{selectedSeason}</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">82</div>
            <p className="text-xs text-muted-foreground">Juegos por temporada</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Equipos con Datos</CardTitle>
            <Badge variant="secondary">{teamStats.length}</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teamStats.length}</div>
            <p className="text-xs text-muted-foreground">Con estadísticas calculadas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Datos en Cache</CardTitle>
            <Badge variant="outline">{cacheStats.size}</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{cacheStats.size}</div>
            <p className="text-xs text-muted-foreground">Elementos guardados</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1">
        <Card>
          <CardHeader>
            <CardTitle>Estadísticas de Equipos - Temporada {selectedSeason}</CardTitle>
            <CardDescription>
              Datos reales calculados desde la API de Ball Don't Lie (datos persistentes)
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error ? (
              <ApiErrorDisplay error={error} onRetry={() => refetch()} title="Error al cargar estadísticas" />
            ) : loading ? (
              <div className="space-y-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="flex items-center space-x-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-[200px]" />
                      <Skeleton className="h-4 w-[160px]" />
                    </div>
                  </div>
                ))}
              </div>
            ) : teamStats.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No hay datos disponibles para la temporada {selectedSeason}</p>
                <Button variant="outline" className="mt-4" onClick={() => refetch()}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Intentar cargar datos
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {teamStats.slice(0, 10).map((stat) => (
                  <div key={stat.team.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
                        {stat.team.abbreviation}
                      </div>
                      <div>
                        <p className="text-sm font-medium leading-none">{stat.team.full_name}</p>
                        <p className="text-sm text-muted-foreground">
                          {stat.team.conference} • {stat.team.division}
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-5 gap-4 text-center">
                      <div>
                        <p className="text-sm font-medium">
                          {stat.wins}-{stat.losses}
                        </p>
                        <p className="text-xs text-muted-foreground">W-L</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">{(stat.win_percentage * 100).toFixed(1)}%</p>
                        <p className="text-xs text-muted-foreground">Win%</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">{stat.points_per_game.toFixed(1)}</p>
                        <p className="text-xs text-muted-foreground">PPG</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">{stat.last_10_record}</p>
                        <p className="text-xs text-muted-foreground">L10</p>
                      </div>
                      <div>
                        <Badge variant={stat.current_streak.startsWith("W") ? "default" : "destructive"}>
                          {stat.current_streak}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
