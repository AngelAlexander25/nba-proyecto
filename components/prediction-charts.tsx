"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts"
import { TrendingUp, Target, Activity, Zap, Brain } from "lucide-react"
import type { Player } from "@/types/nba"

interface PredictionChartsProps {
  selectedPlayer: Player | null
  players: Player[]
  onPlayerSelect: (player: Player) => void
}

export function PredictionCharts({ selectedPlayer, players, onPlayerSelect }: PredictionChartsProps) {
  const [predictionType, setPredictionType] = useState("performance")
  const [timeframe, setTimeframe] = useState("next_5_games")

  // Generar datos de predicción simulados basados en el jugador seleccionado
  const predictionData = useMemo(() => {
    if (!selectedPlayer) return null

    // Simular datos de rendimiento histórico y predicciones
    const basePoints = Math.floor(Math.random() * 15) + 15 // 15-30 puntos base
    const baseRebounds = Math.floor(Math.random() * 8) + 5 // 5-13 rebotes base
    const baseAssists = Math.floor(Math.random() * 6) + 3 // 3-9 asistencias base

    const performanceData = Array.from({ length: 10 }, (_, i) => ({
      game: `J${i + 1}`,
      points: basePoints + Math.floor(Math.random() * 10) - 5,
      rebounds: baseRebounds + Math.floor(Math.random() * 4) - 2,
      assists: baseAssists + Math.floor(Math.random() * 4) - 2,
      predicted: i >= 5, // Los últimos 5 son predicciones
    }))

    const trendData = [
      { metric: "Puntos", actual: basePoints, predicted: basePoints + 2.3, confidence: 87 },
      { metric: "Rebotes", actual: baseRebounds, predicted: baseRebounds + 1.1, confidence: 82 },
      { metric: "Asistencias", actual: baseAssists, predicted: baseAssists + 0.8, confidence: 79 },
      { metric: "FG%", actual: 45.2, predicted: 47.8, confidence: 74 },
    ]

    const radarData = [
      { stat: "Puntos", value: (basePoints / 35) * 100, fullMark: 100 },
      { stat: "Rebotes", value: (baseRebounds / 15) * 100, fullMark: 100 },
      { stat: "Asistencias", value: (baseAssists / 12) * 100, fullMark: 100 },
      { stat: "Eficiencia", value: Math.floor(Math.random() * 30) + 60, fullMark: 100 },
      { stat: "Defensa", value: Math.floor(Math.random() * 25) + 55, fullMark: 100 },
      { stat: "Consistencia", value: Math.floor(Math.random() * 20) + 70, fullMark: 100 },
    ]

    return { performanceData, trendData, radarData }
  }, [selectedPlayer])

  const COLORS = ["#8B5CF6", "#06B6D4", "#10B981", "#F59E0B", "#EF4444"]

  if (!selectedPlayer) {
    return (
      <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
        <CardContent className="flex items-center justify-center py-20">
          <div className="text-center">
            <Brain className="w-16 h-16 text-purple-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Selecciona un jugador para ver predicciones IA</h3>
            <p className="text-gray-400 mb-6">Elige un jugador de la lista para generar análisis predictivo avanzado</p>
            <Select
              onValueChange={(value) => {
                const player = players.find((p) => p.id.toString() === value)
                if (player) onPlayerSelect(player)
              }}
            >
              <SelectTrigger className="w-64 mx-auto">
                <SelectValue placeholder="Seleccionar jugador..." />
              </SelectTrigger>
              <SelectContent>
                {players.slice(0, 10).map((player) => (
                  <SelectItem key={player.id} value={player.id.toString()}>
                    {player.first_name} {player.last_name} - {player.team?.abbreviation}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header del Jugador */}
      <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                <span className="text-xl font-bold text-white">
                  {selectedPlayer.first_name[0]}
                  {selectedPlayer.last_name[0]}
                </span>
              </div>
              <div>
                <CardTitle className="text-white text-2xl">
                  {selectedPlayer.first_name} {selectedPlayer.last_name}
                </CardTitle>
                <CardDescription className="text-gray-300">
                  {selectedPlayer.team?.full_name} • #{selectedPlayer.jersey_number} • {selectedPlayer.position}
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                <Brain className="w-3 h-3 mr-1" />
                IA Activa
              </Badge>
              <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                <Activity className="w-3 h-3 mr-1" />
                En Vivo
              </Badge>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Controles */}
      <div className="flex gap-4">
        <Select value={predictionType} onValueChange={setPredictionType}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="performance">Rendimiento General</SelectItem>
            <SelectItem value="shooting">Análisis de Tiro</SelectItem>
            <SelectItem value="advanced">Métricas Avanzadas</SelectItem>
          </SelectContent>
        </Select>

        <Select value={timeframe} onValueChange={setTimeframe}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="next_5_games">Próximos 5 Juegos</SelectItem>
            <SelectItem value="next_10_games">Próximos 10 Juegos</SelectItem>
            <SelectItem value="rest_of_season">Resto de Temporada</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Gráficas de Predicción */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Gráfica de Rendimiento */}
        <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-purple-400" />
              Predicción de Rendimiento
            </CardTitle>
            <CardDescription className="text-gray-300">
              Análisis predictivo basado en IA para los próximos juegos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={predictionData?.performanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="game" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1F2937",
                      border: "1px solid #374151",
                      borderRadius: "8px",
                      color: "#F9FAFB",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="points"
                    stroke="#8B5CF6"
                    strokeWidth={3}
                    strokeDasharray={(data: any) => (data.predicted ? "5 5" : "0")}
                    name="Puntos"
                  />
                  <Line
                    type="monotone"
                    dataKey="rebounds"
                    stroke="#06B6D4"
                    strokeWidth={2}
                    strokeDasharray={(data: any) => (data.predicted ? "5 5" : "0")}
                    name="Rebotes"
                  />
                  <Line
                    type="monotone"
                    dataKey="assists"
                    stroke="#10B981"
                    strokeWidth={2}
                    strokeDasharray={(data: any) => (data.predicted ? "5 5" : "0")}
                    name="Asistencias"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-4 mt-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-purple-500 rounded"></div>
                <span className="text-gray-300">Puntos</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-cyan-500 rounded"></div>
                <span className="text-gray-300">Rebotes</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded"></div>
                <span className="text-gray-300">Asistencias</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-0.5 bg-gray-400" style={{ borderTop: "2px dashed" }}></div>
                <span className="text-gray-300">Predicción</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Radar Chart */}
        <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-400" />
              Análisis Multidimensional
            </CardTitle>
            <CardDescription className="text-gray-300">Evaluación completa de habilidades del jugador</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={predictionData?.radarData}>
                  <PolarGrid stroke="#374151" />
                  <PolarAngleAxis dataKey="stat" tick={{ fill: "#9CA3AF", fontSize: 12 }} />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: "#9CA3AF", fontSize: 10 }} />
                  <Radar
                    name="Habilidades"
                    dataKey="value"
                    stroke="#8B5CF6"
                    fill="#8B5CF6"
                    fillOpacity={0.3}
                    strokeWidth={2}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Métricas de Confianza */}
      <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Zap className="h-5 w-5 text-yellow-400" />
            Métricas de Confianza IA
          </CardTitle>
          <CardDescription className="text-gray-300">
            Nivel de confianza del algoritmo en las predicciones
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {predictionData?.trendData.map((item, index) => (
              <div key={item.metric} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-300">{item.metric}</span>
                  <Badge
                    variant="outline"
                    className={`${
                      item.confidence >= 85
                        ? "border-green-500 text-green-400"
                        : item.confidence >= 75
                          ? "border-yellow-500 text-yellow-400"
                          : "border-red-500 text-red-400"
                    }`}
                  >
                    {item.confidence}%
                  </Badge>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-400">Actual: {item.actual}</span>
                  <span className="text-white font-medium">Pred: {item.predicted}</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      item.confidence >= 85 ? "bg-green-500" : item.confidence >= 75 ? "bg-yellow-500" : "bg-red-500"
                    }`}
                    style={{ width: `${item.confidence}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
