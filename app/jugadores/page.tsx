"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Search, RefreshCw, ArrowLeft, Brain, TrendingUp } from "lucide-react"
import { usePersistentPlayers, usePersistentTeams } from "@/hooks/use-persistent-nba-data"
import { ApiErrorDisplay } from "@/components/ui/error-boundary"
import { PlayerStatsCard } from "@/components/player-stats-card"
import { PredictionCharts } from "@/components/prediction-charts"
import { SubscriptionModal } from "@/components/subscription-modal"
import type { Player } from "@/types/nba"

export default function Jugadores() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTeam, setSelectedTeam] = useState("all")
  const [selectedPosition, setSelectedPosition] = useState("all")
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null)
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false)
  const [isPremium, setIsPremium] = useState(false)

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

  const handleSearch = () => {
    refetch()
  }

  const handleTeamChange = (teamId: string) => {
    setSelectedTeam(teamId)
  }

  const handlePlayerClick = (player: Player) => {
    setSelectedPlayer(player)
  }

  const handleBackToList = () => {
    setSelectedPlayer(null)
  }

  const handlePremiumUpgrade = () => {
    setShowSubscriptionModal(true)
  }

  const handleSubscriptionSuccess = () => {
    setIsPremium(true)
    setShowSubscriptionModal(false)
  }

  // Si hay un jugador seleccionado, mostrar su detalle
  if (selectedPlayer) {
    return (
      <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={handleBackToList}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver a la lista
            </Button>
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-white">
                {selectedPlayer.first_name} {selectedPlayer.last_name}
              </h2>
              <p className="text-gray-400">
                {selectedPlayer.team?.full_name} • #{selectedPlayer.jersey_number} • {selectedPlayer.position}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <SidebarTrigger />
            {!isPremium && (
              <Button onClick={handlePremiumUpgrade} className="bg-gradient-to-r from-purple-600 to-blue-600">
                <Brain className="h-4 w-4 mr-2" />
                Upgrade Premium
              </Button>
            )}
          </div>
        </div>

        {/* Estadísticas del Jugador */}
        <PlayerStatsCard player={selectedPlayer} isPremium={isPremium} />

        {/* Predicciones IA */}
        <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-purple-400" />
                <CardTitle className="text-white">Predicciones IA Avanzadas</CardTitle>
              </div>
              {isPremium ? (
                <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">Premium Activo</Badge>
              ) : (
                <Badge variant="outline" className="border-gray-500 text-gray-400">
                  Premium Requerido
                </Badge>
              )}
            </div>
            <CardDescription className="text-gray-300">
              {isPremium
                ? "Análisis predictivo avanzado basado en IA y machine learning"
                : "Desbloquea predicciones avanzadas con IA para análisis profundo del rendimiento"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isPremium ? (
              <PredictionCharts selectedPlayer={selectedPlayer} players={[selectedPlayer]} onPlayerSelect={() => {}} />
            ) : (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Brain className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Predicciones IA Premium</h3>
                <p className="text-gray-400 mb-6 max-w-md mx-auto">
                  Accede a análisis predictivo avanzado, tendencias de rendimiento, y proyecciones basadas en IA
                </p>
                <div className="grid md:grid-cols-3 gap-4 mb-6 max-w-2xl mx-auto">
                  <div className="text-center">
                    <TrendingUp className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                    <h4 className="font-medium text-white">Tendencias</h4>
                    <p className="text-sm text-gray-400">Análisis de patrones de rendimiento</p>
                  </div>
                  <div className="text-center">
                    <Brain className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                    <h4 className="font-medium text-white">IA Predictiva</h4>
                    <p className="text-sm text-gray-400">Proyecciones de próximos juegos</p>
                  </div>
                  <div className="text-center">
                    <div className="w-8 h-8 bg-green-400 rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-white font-bold text-sm">%</span>
                    </div>
                    <h4 className="font-medium text-white">Confianza</h4>
                    <p className="text-sm text-gray-400">Métricas de precisión</p>
                  </div>
                </div>
                <Button
                  onClick={handlePremiumUpgrade}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                >
                  <Brain className="h-4 w-4 mr-2" />
                  Desbloquear Predicciones IA
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Modal de Suscripción */}
        <SubscriptionModal
          isOpen={showSubscriptionModal}
          onClose={() => setShowSubscriptionModal(false)}
          onSuccess={handleSubscriptionSuccess}
        />
      </div>
    )
  }

  // Vista de lista de jugadores
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
            filteredPlayers.map((player) => (
              <PlayerCard key={player.id} player={player} onClick={() => handlePlayerClick(player)} />
            ))
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
function PlayerCard({ player, onClick }: { player: Player; onClick: () => void }) {
  return (
    <Card className="hover:shadow-lg transition-all cursor-pointer hover:scale-105 hover:bg-white/5" onClick={onClick}>
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

        {/* Indicador de que hay más información disponible */}
        <div className="mt-4 pt-4 border-t">
          <div className="flex items-center justify-center text-sm text-blue-400">
            <Brain className="h-4 w-4 mr-1" />
            <span>Ver estadísticas y predicciones IA</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
