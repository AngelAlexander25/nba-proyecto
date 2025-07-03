"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, TrendingUp, Crown, BarChart3, Target, Users, Trophy, ArrowLeft } from "lucide-react"
import { PlayerStatsCard } from "@/components/player-stats-card"
import { PopularPlayers } from "@/components/popular-players"
import { PredictionCharts } from "@/components/prediction-charts"
import { SubscriptionModal } from "@/components/subscription-modal"
import { DashboardStats } from "@/components/dashboard-stats"
import { usePlayers, useTeams } from "@/hooks/usa-nba-data"
import type { Player } from "@/types/nba"

export default function AppPage() {
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null)
  const [isPremium, setIsPremium] = useState(false)
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")
  const router = useRouter()

  const {
    players,
    loading: playersLoading,
    error: playersError,
    refetch: refetchPlayers,
  } = usePlayers({ per_page: 25 })

  const { teams, loading: teamsLoading } = useTeams()

  // Función para manejar retry
  const handleRetry = () => {
    refetchPlayers({ per_page: 25, reset: true })
  }

  // Función para volver al landing
  const goBackToLanding = () => {
    router.push("/")
  }

  // Función para manejar suscripción
  const handleSubscribe = () => {
    setIsPremium(true)
    setShowSubscriptionModal(false)
  }

  // Función para acceder a funciones premium
  const handlePremiumFeature = () => {
    if (!isPremium) {
      setShowSubscriptionModal(true)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={goBackToLanding}
                className="text-gray-300 hover:text-white hover:bg-gray-800"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver al inicio
              </Button>
              <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                <BarChart3 className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white">NBA ProStats v2</h1>
              {isPremium && (
                <Badge className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
                  <Crown className="w-3 h-3 mr-1" />
                  Premium
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar jugador..."
                  className="pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-orange-500"
                />
              </div>
              <Button variant="ghost" className="text-gray-300 hover:text-white hover:bg-gray-800">
                <Target className="w-4 h-4 mr-2" />
                Apuestas
              </Button>
              {!isPremium && (
                <Button
                  className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                  onClick={() => setShowSubscriptionModal(true)}
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
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-white/10 border-white/20">
            <TabsTrigger value="overview" className="data-[state=active]:bg-white/20">
              <BarChart3 className="w-4 h-4 mr-2" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="players" className="data-[state=active]:bg-white/20">
              <Users className="w-4 h-4 mr-2" />
              Jugadores
            </TabsTrigger>
            <TabsTrigger
              value="predictions"
              className="data-[state=active]:bg-white/20"
              onClick={() => !isPremium && handlePremiumFeature()}
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              Predicciones IA
              {!isPremium && <Crown className="w-3 h-3 ml-1 text-orange-400" />}
            </TabsTrigger>
            <TabsTrigger value="teams" className="data-[state=active]:bg-white/20">
              <Trophy className="w-4 h-4 mr-2" />
              Equipos
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Overview */}
          <TabsContent value="overview" className="space-y-6">
            <DashboardStats
              players={players}
              teams={teams}
              loading={playersLoading || teamsLoading}
              isPremium={isPremium}
              onUpgrade={() => setShowSubscriptionModal(true)}
            />
          </TabsContent>

          {/* Jugadores */}
          <TabsContent value="players" className="space-y-6">
            {selectedPlayer ? (
              <div className="space-y-6">
                <Button
                  variant="outline"
                  onClick={() => setSelectedPlayer(null)}
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  ← Volver a la lista
                </Button>
                <PlayerStatsCard player={selectedPlayer} isPremium={isPremium} />
              </div>
            ) : (
              <>
                <PopularPlayers
                  players={players}
                  loading={playersLoading}
                  error={playersError}
                  onPlayerSelect={setSelectedPlayer}
                  onRetry={handleRetry}
                />
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

          {/* Predicciones IA */}
          <TabsContent value="predictions" className="space-y-6">
            {isPremium ? (
              <PredictionCharts selectedPlayer={selectedPlayer} players={players} onPlayerSelect={setSelectedPlayer} />
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
                      onClick={() => setShowSubscriptionModal(true)}
                    >
                      Desbloquear Predicciones
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Equipos */}
          <TabsContent value="teams" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {teams.slice(0, 9).map((team) => (
                <Card
                  key={team.id}
                  className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors"
                >
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm">{team.abbreviation}</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">{team.full_name}</h3>
                        <p className="text-sm text-gray-400">
                          {team.conference} • {team.division}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            {teams.length > 9 && (
              <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                <CardContent className="flex items-center justify-center py-8">
                  <div className="text-center">
                    <p className="text-gray-400 mb-4">Mostrando 9 de {teams.length} equipos</p>
                    <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 bg-transparent">
                      Ver todos los equipos
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Modal de Suscripción Simulado */}
      <SubscriptionModal
        isOpen={showSubscriptionModal}
        onClose={() => setShowSubscriptionModal(false)}
        onSubscribe={handleSubscribe}
      />
    </div>
  )
}
