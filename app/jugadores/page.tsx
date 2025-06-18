"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Search, RefreshCw } from "lucide-react"
import { usePersistentPlayers, usePersistentTeams } from "@/hooks/use-persistent-nba-data"
import { ApiErrorDisplay } from "@/components/error-boundary"
import type { Player } from "@/types/nba"

export default function Jugadores() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTeam, setSelectedTeam] = useState("all")
  const [selectedPosition, setSelectedPosition] = useState("all")

  const { teams } = usePersistentTeams()
  const { players, loading, error, refetch } = usePersistentPlayers({
    search: searchTerm || undefined,
    team_ids: selectedTeam !== "all" ? selectedTeam : undefined,
    per_page: 50,
  })

  // Filtrar por posición localmente ya que la API no soporta este filtro
  const filteredPlayers = players.filter((player) => {
    if (selectedPosition === "all") return true
    return player.position === selectedPosition
  })

  const positions = ["all", "PG", "SG", "SF", "PF", "C"]

  const handleSearch = () => {
    refetch()
  }

  const handleTeamChange = (teamId: string) => {
    setSelectedTeam(teamId)
    // La búsqueda se actualizará automáticamente por el hook
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div className="flex items-center space-x-2">
          <SidebarTrigger />
          <h2 className="text-3xl font-bold tracking-tight">Jugadores NBA</h2>
        </div>
        <Button variant="outline" size="sm" onClick={() => refetch()}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Actualizar
        </Button>
      </div>

      <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar jugadores por nombre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            className="pl-8"
          />
        </div>
        <Select value={selectedTeam} onValueChange={handleTeamChange}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Equipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los equipos</SelectItem>
            {teams.map((team) => (
              <SelectItem key={team.id} value={team.id.toString()}>
                {team.full_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={selectedPosition} onValueChange={setSelectedPosition}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Posición" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las posiciones</SelectItem>
            <SelectItem value="PG">Point Guard</SelectItem>
            <SelectItem value="SG">Shooting Guard</SelectItem>
            <SelectItem value="SF">Small Forward</SelectItem>
            <SelectItem value="PF">Power Forward</SelectItem>
            <SelectItem value="C">Center</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={handleSearch}>Buscar</Button>
      </div>

      {error ? (
        <ApiErrorDisplay error={error} onRetry={() => refetch()} title="Error al cargar jugadores" />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {loading ? (
            [...Array(12)].map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-4 w-[200px]" />
                  <Skeleton className="h-4 w-[160px]" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                </CardContent>
              </Card>
            ))
          ) : filteredPlayers.length === 0 ? (
            <div className="col-span-full">
              <Card>
                <CardContent className="flex flex-col items-center justify-center h-32 space-y-4">
                  <p className="text-muted-foreground">
                    {players.length === 0
                      ? "No se encontraron jugadores."
                      : "No hay jugadores que coincidan con los filtros aplicados."}
                  </p>
                  <Button variant="outline" onClick={() => refetch()}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Intentar nuevamente
                  </Button>
                </CardContent>
              </Card>
            </div>
          ) : (
            filteredPlayers.map((player) => <PlayerCard key={player.id} player={player} />)
          )}
        </div>
      )}

      {!loading && filteredPlayers.length > 0 && (
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Mostrando {filteredPlayers.length} de {players.length} jugadores
          </p>
        </div>
      )}
    </div>
  )
}

// Componente separado para la tarjeta del jugador
function PlayerCard({ player }: { player: Player }) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">
            {player.first_name} {player.last_name}
          </CardTitle>
          <Badge variant="outline">{player.position || "N/A"}</Badge>
        </div>
        <CardDescription>{player.team?.full_name || "Sin equipo"}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Altura:</span>
              <span className="font-medium">{player.height || "N/A"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Peso:</span>
              <span className="font-medium">{player.weight || "N/A"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Jersey:</span>
              <span className="font-medium">#{player.jersey_number || "N/A"}</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Universidad:</span>
              <span className="font-medium text-xs">{player.college || "N/A"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">País:</span>
              <span className="font-medium">{player.country || "N/A"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Draft:</span>
              <span className="font-medium">{player.draft_year ? `${player.draft_year}` : "N/A"}</span>
            </div>
          </div>
        </div>
        {player.draft_year && player.draft_round && player.draft_number && (
          <div className="mt-4 pt-4 border-t">
            <div className="flex justify-center text-sm">
              <Badge variant="secondary">
                Draft {player.draft_year} - Ronda {player.draft_round}, Pick {player.draft_number}
              </Badge>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
