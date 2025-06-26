"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, TrendingUp, Crown, BarChart3, ArrowLeft, Target } from "lucide-react"
import { PlayerStatsCard } from "@/components/player-stats-card"
import { PlayerSearch } from "@/components/player-search"
import { PremiumFeatures } from "@/components/premium-features"
import { PopularPlayers } from "@/components/popular-players"
import { usePlayers } from "@/hooks/usa-nba-data"
import Link from "next/link"
import type { Player } from "@/types/nba"

export default function Dashboard() {
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null)
  const [isPremium, setIsPremium] = useState(false)
  const {
    players,
    loading: playersLoading,
    error: playersError,
    refetch: refetchPlayers,
  } = usePlayers({ per_page: 25 })

  // Función para manejar retry
  const handleRetry = () => {
    refetchPlayers({ per_page: 25, reset: true })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Inicio
                </Button>
              </Link>
              <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                <BarChart3 className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white">NBA ProStats</h1>
              {isPremium && (
                <Badge className="bg-gradient-to-r from-orange-500 to-red-500">
                  <Crown className="w-3 h-3 mr-1" />
                  Premium
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-4">
              <PlayerSearch onPlayerSelect={setSelectedPlayer} />
              <Link href="/betting">
                <Button variant="ghost" className="text-white hover:bg-white/10">
                  <Target className="w-4 h-4 mr-2" />
                  Apuestas
                </Button>
              </Link>
              {!isPremium && (
                <Button
                  className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                  onClick={() => setIsPremium(true)}
                >
                  <Crown className="w-4 h-4 mr-2" />
                  Upgrade Premium
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-white/10 border-white/20">
            <TabsTrigger value="overview" className="data-[state=active]:bg-white/20">
              Vista General
            </TabsTrigger>
            <TabsTrigger value="advanced" className="data-[state=active]:bg-white/20">
              Estadísticas Avanzadas
              {!isPremium && <Crown className="w-3 h-3 ml-1 text-orange-400" />}
            </TabsTrigger>
            <TabsTrigger value="predictions" className="data-[state=active]:bg-white/20">
              Predicciones IA
              {!isPremium && <Crown className="w-3 h-3 ml-1 text-orange-400" />}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {selectedPlayer ? (
              <PlayerStatsCard player={selectedPlayer} isPremium={isPremium} />
            ) : (
              <>
                {/* Jugadores Populares */}
                <PopularPlayers
                  players={players}
                  loading={playersLoading}
                  error={playersError}
                  onPlayerSelect={setSelectedPlayer}
                  onRetry={handleRetry}
                />

                {/* Instrucciones */}
                <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                  <CardContent className="flex items-center justify-center py-12">
                    <div className="text-center">
                      <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-white mb-2">
                        Selecciona un jugador para ver estadísticas detalladas
                      </h3>
                      <p className="text-gray-400">Usa el buscador arriba o selecciona de los jugadores populares</p>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </TabsContent>

          <TabsContent value="advanced" className="space-y-6">
            {isPremium ? (
              <PremiumFeatures player={selectedPlayer} type="advanced" />
            ) : (
              <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                <CardContent className="flex items-center justify-center py-20">
                  <div className="text-center">
                    <Crown className="w-16 h-16 text-orange-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">Contenido Premium</h3>
                    <p className="text-gray-400 mb-6">
                      Accede a estadísticas avanzadas, mapas de calor y análisis profesionales
                    </p>
                    <Button
                      className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                      onClick={() => setIsPremium(true)}
                    >
                      Suscribirse por $29/mes
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="predictions" className="space-y-6">
            {isPremium ? (
              <PremiumFeatures player={selectedPlayer} type="predictions" />
            ) : (
              <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                <CardContent className="flex items-center justify-center py-20">
                  <div className="text-center">
                    <TrendingUp className="w-16 h-16 text-purple-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">Predicciones con IA</h3>
                    <p className="text-gray-400 mb-6">
                      Algoritmos avanzados predicen el rendimiento futuro de los jugadores
                    </p>
                    <Button
                      className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                      onClick={() => setIsPremium(true)}
                    >
                      Desbloquear Predicciones
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
