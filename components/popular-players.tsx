"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, User, Star, RefreshCw, AlertCircle } from "lucide-react"
import type { Player } from "@/types/nba"

interface PopularPlayersProps {
  players?: Player[]
  loading?: boolean
  error?: string | null
  onPlayerSelect: (player: Player) => void
  onRetry: () => void
}

export function PopularPlayers({
  players = [],
  loading = false,
  error = null,
  onPlayerSelect,
  onRetry,
}: PopularPlayersProps) {
  // Asegurar que players sea siempre un array
  const safePlayersArray = Array.isArray(players) ? players : []

  if (loading) {
    return (
      <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-gray-400 mx-auto mb-4 animate-spin" />
            <p className="text-white mb-2">Cargando jugadores de la NBA...</p>
            <p className="text-gray-400 text-sm">Obteniendo datos de la API oficial</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error && safePlayersArray.length === 0) {
    return (
      <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Error al cargar jugadores</h3>
            <p className="text-gray-400 mb-4 max-w-md">{error}</p>
            <Button variant="outline" onClick={onRetry} className="border-white/20 text-white hover:bg-white/10">
              <RefreshCw className="h-4 w-4 mr-2" />
              Reintentar
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (safePlayersArray.length === 0) {
    return (
      <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center">
            <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">No hay jugadores disponibles</h3>
            <p className="text-gray-400 mb-4">No se pudieron obtener datos de la API</p>
            <Button variant="outline" onClick={onRetry} className="border-white/20 text-white hover:bg-white/10">
              <RefreshCw className="h-4 w-4 mr-2" />
              Cargar jugadores
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-400" />
            Jugadores NBA ({safePlayersArray.length})
          </CardTitle>
          {error && (
            <div className="flex items-center gap-2">
              <span className="text-yellow-400 text-sm">Datos guardados</span>
              <Button variant="ghost" size="sm" onClick={onRetry} className="text-gray-400 hover:text-white">
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="mb-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
            <p className="text-yellow-400 text-sm">⚠️ {error}</p>
          </div>
        )}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {safePlayersArray.slice(0, 16).map((player) => {
            // Validar que el jugador tenga las propiedades necesarias
            if (!player || !player.id || !player.first_name || !player.last_name) {
              return null
            }

            return (
              <Button
                key={player.id}
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10 h-auto p-4 flex flex-col items-center gap-2 transition-all hover:scale-105"
                onClick={() => onPlayerSelect(player)}
              >
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center text-sm font-bold">
                  {player.first_name[0] || "?"}
                  {player.last_name[0] || "?"}
                </div>
                <div className="text-center">
                  <div className="font-medium text-sm">
                    {player.first_name} {player.last_name}
                  </div>
                  <div className="text-xs text-gray-400">
                    {player.team?.abbreviation || "N/A"} • {player.position || "N/A"}
                  </div>
                </div>
              </Button>
            )
          })}
        </div>
        {safePlayersArray.length > 16 && (
          <div className="mt-4 text-center">
            <p className="text-gray-400 text-sm">Mostrando 16 de {safePlayersArray.length} jugadores</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
