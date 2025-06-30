"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, TrendingUp, Crown, BarChart3, Target, Users, Trophy, ArrowLeft } from "lucide-react"

export default function AppPage() {
  const [selectedPlayer, setSelectedPlayer] = useState(null)
  const [isPremium, setIsPremium] = useState(false)
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")
  const router = useRouter()

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
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardContent className="flex items-center justify-center py-20">
                <div className="text-center">
                  <BarChart3 className="w-16 h-16 text-orange-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">Dashboard de Estadísticas NBA</h3>
                  <p className="text-gray-400 mb-6">Bienvenido a tu centro de control de estadísticas NBA con IA</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
                    <div className="bg-white/5 rounded-lg p-4">
                      <div className="text-2xl font-bold text-orange-500">30+</div>
                      <div className="text-sm text-gray-400">Equipos NBA</div>
                    </div>
                    <div className="bg-white/5 rounded-lg p-4">
                      <div className="text-2xl font-bold text-orange-500">500+</div>
                      <div className="text-sm text-gray-400">Jugadores Activos</div>
                    </div>
                    <div className="bg-white/5 rounded-lg p-4">
                      <div className="text-2xl font-bold text-orange-500">24/7</div>
                      <div className="text-sm text-gray-400">Datos en Tiempo Real</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Jugadores */}
          <TabsContent value="players" className="space-y-6">
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardContent className="flex items-center justify-center py-12">
                <div className="text-center">
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">Estadísticas de Jugadores NBA</h3>
                  <p className="text-gray-400">Explora las estadísticas detalladas de tus jugadores favoritos</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Predicciones IA */}
          <TabsContent value="predictions" className="space-y-6">
            {isPremium ? (
              <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                <CardContent className="flex items-center justify-center py-20">
                  <div className="text-center">
                    <TrendingUp className="w-16 h-16 text-green-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">Predicciones con IA Activadas</h3>
                    <p className="text-gray-400 mb-6">Acceso completo a nuestros algoritmos de predicción avanzados</p>
                  </div>
                </CardContent>
              </Card>
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
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardContent className="flex items-center justify-center py-12">
                <div className="text-center">
                  <Trophy className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">Estadísticas de Equipos NBA</h3>
                  <p className="text-gray-400">Analiza el rendimiento de todos los equipos de la NBA</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Modal de Suscripción Simulado */}
      {showSubscriptionModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-lg p-8 max-w-md w-full mx-4">
            <h3 className="text-2xl font-bold text-white mb-4">Upgrade a Premium</h3>
            <p className="text-gray-400 mb-6">Desbloquea todas las funciones premium incluyendo predicciones con IA</p>
            <div className="flex gap-4">
              <Button
                className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 flex-1"
                onClick={handleSubscribe}
              >
                Suscribirse
              </Button>
              <Button
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10 bg-transparent"
                onClick={() => setShowSubscriptionModal(false)}
              >
                Cancelar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
