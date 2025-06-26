"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  User,
  MapPin,
  Calendar,
  Trophy,
  TrendingUp,
  Target,
  BarChart3,
  Zap,
  Award,
  Globe,
  GraduationCap,
  Ruler,
} from "lucide-react"
import type { Player } from "@/types/nba"

interface PlayerStatsCardProps {
  player: Player
  isPremium: boolean
}

export function PlayerStatsCard({ player, isPremium }: PlayerStatsCardProps) {
  const [selectedSeason, setSelectedSeason] = useState("2023-24")

  // Generar estadísticas simuladas basadas en datos reales del jugador
  const playerStats = useMemo(() => {
    // Usar el ID del jugador para generar datos consistentes
    const seed = player.id
    const random = (min: number, max: number) => {
      const x = Math.sin(seed * 9999) * 10000
      return min + (x - Math.floor(x)) * (max - min)
    }

    // Estadísticas base según posición
    const positionStats = {
      PG: { pts: [15, 25], reb: [3, 8], ast: [6, 12], fg: [42, 48] },
      SG: { pts: [18, 28], reb: [4, 7], ast: [3, 7], fg: [44, 50] },
      SF: { pts: [16, 26], reb: [5, 9], ast: [4, 8], fg: [45, 51] },
      PF: { pts: [14, 24], reb: [7, 12], ast: [2, 5], fg: [48, 54] },
      C: { pts: [12, 22], reb: [8, 14], ast: [1, 4], fg: [52, 58] },
      G: { pts: [16, 26], reb: [3, 7], ast: [5, 10], fg: [43, 49] },
      F: { pts: [15, 25], reb: [6, 10], ast: [3, 6], fg: [46, 52] },
    }

    const pos = player.position || "G"
    const stats = positionStats[pos as keyof typeof positionStats] || positionStats["G"]

    const currentStats = {
      points: Math.round(random(stats.pts[0], stats.pts[1])),
      rebounds: Math.round(random(stats.reb[0], stats.reb[1])),
      assists: Math.round(random(stats.ast[0], stats.ast[1])),
      fieldGoalPct: Math.round(random(stats.fg[0], stats.fg[1])),
      threePtPct: Math.round(random(32, 42)),
      freeThrowPct: Math.round(random(75, 90)),
      steals: Math.round(random(0.8, 2.2)),
      blocks: Math.round(random(0.3, 1.8)),
      turnovers: Math.round(random(1.5, 3.5)),
      gamesPlayed: Math.round(random(65, 82)),
    }

    // Generar datos históricos (últimos 5 años)
    const historicalData = Array.from({ length: 5 }, (_, i) => {
      const year = 2024 - i
      const variation = random(-0.15, 0.15) // ±15% variación
      return {
        season: `${year - 1}-${year.toString().slice(-2)}`,
        points: Math.max(5, Math.round(currentStats.points * (1 + variation))),
        rebounds: Math.max(1, Math.round(currentStats.rebounds * (1 + variation))),
        assists: Math.max(1, Math.round(currentStats.assists * (1 + variation))),
        fieldGoalPct: Math.max(30, Math.min(60, Math.round(currentStats.fieldGoalPct * (1 + variation / 2)))),
        gamesPlayed: Math.round(random(60, 82)),
      }
    }).reverse()

    // Características físicas y técnicas
    const characteristics = {
      physical: {
        height: player.height || "6-6",
        weight: player.weight || "200",
        wingspan: `${Number.parseInt(player.height?.split("-")[0] || "6") * 12 + Number.parseInt(player.height?.split("-")[1] || "6") + Math.round(random(2, 6))}"`,
        verticalLeap: `${Math.round(random(28, 38))}"`,
        bodyFat: `${Math.round(random(6, 12))}%`,
        speed: Math.round(random(75, 95)),
      },
      technical: {
        shooting: Math.round(random(70, 95)),
        dribbling: Math.round(random(65, 90)),
        passing: Math.round(random(60, 90)),
        defense: Math.round(random(65, 85)),
        rebounding: Math.round(random(60, 90)),
        basketball_iq: Math.round(random(75, 95)),
      },
      mental: {
        leadership: Math.round(random(70, 95)),
        clutch: Math.round(random(65, 90)),
        consistency: Math.round(random(70, 88)),
        work_ethic: Math.round(random(80, 98)),
        adaptability: Math.round(random(70, 90)),
        pressure_handling: Math.round(random(65, 92)),
      },
    }

    return { currentStats, historicalData, characteristics }
  }, [player])

  return (
    <div className="space-y-6">
      {/* Información Básica del Jugador */}
      <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700">
        <CardHeader>
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
              <span className="text-3xl font-bold text-white">
                {player.first_name[0]}
                {player.last_name[0]}
              </span>
            </div>
            <div className="flex-1">
              <CardTitle className="text-3xl text-white mb-2">
                {player.first_name} {player.last_name}
              </CardTitle>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="flex items-center gap-2 text-gray-300">
                  <User className="w-4 h-4" />
                  <span>
                    #{player.jersey_number} • {player.position}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <MapPin className="w-4 h-4" />
                  <span>
                    {player.team?.city} {player.team?.name}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <Calendar className="w-4 h-4" />
                  <span>Draft {player.draft_year}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <Globe className="w-4 h-4" />
                  <span>{player.country}</span>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Tabs para diferentes secciones */}
      <Tabs defaultValue="stats" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 bg-gray-800">
          <TabsTrigger value="stats" className="data-[state=active]:bg-purple-600">
            <BarChart3 className="w-4 h-4 mr-2" />
            Estadísticas
          </TabsTrigger>
          <TabsTrigger value="characteristics" className="data-[state=active]:bg-purple-600">
            <Target className="w-4 h-4 mr-2" />
            Características
          </TabsTrigger>
          <TabsTrigger value="history" className="data-[state=active]:bg-purple-600">
            <TrendingUp className="w-4 h-4 mr-2" />
            Historial
          </TabsTrigger>
          <TabsTrigger value="analysis" className="data-[state=active]:bg-purple-600">
            <Zap className="w-4 h-4 mr-2" />
            Análisis IA
          </TabsTrigger>
        </TabsList>

        {/* Estadísticas Actuales */}
        <TabsContent value="stats" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="bg-gray-900 border-gray-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-gray-400">Puntos por Juego</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{playerStats.currentStats.points}</div>
                <Progress value={(playerStats.currentStats.points / 35) * 100} className="mt-2" />
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-gray-400">Rebotes por Juego</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{playerStats.currentStats.rebounds}</div>
                <Progress value={(playerStats.currentStats.rebounds / 15) * 100} className="mt-2" />
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-gray-400">Asistencias por Juego</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{playerStats.currentStats.assists}</div>
                <Progress value={(playerStats.currentStats.assists / 12) * 100} className="mt-2" />
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-gray-400">% Tiros de Campo</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{playerStats.currentStats.fieldGoalPct}%</div>
                <Progress value={playerStats.currentStats.fieldGoalPct} className="mt-2" />
              </CardContent>
            </Card>
          </div>

          {/* Estadísticas Detalladas */}
          <Card className="bg-gray-900 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Estadísticas Detalladas - Temporada 2023-24</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-300">Ofensiva</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400">% Triples</span>
                      <span className="text-white">{playerStats.currentStats.threePtPct}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">% Tiros Libres</span>
                      <span className="text-white">{playerStats.currentStats.freeThrowPct}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Pérdidas</span>
                      <span className="text-white">{playerStats.currentStats.turnovers}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-300">Defensiva</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Robos</span>
                      <span className="text-white">{playerStats.currentStats.steals}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Bloqueos</span>
                      <span className="text-white">{playerStats.currentStats.blocks}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-300">General</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Juegos Jugados</span>
                      <span className="text-white">{playerStats.currentStats.gamesPlayed}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Minutos por Juego</span>
                      <span className="text-white">{Math.round(28 + Math.random() * 10)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Características Físicas y Técnicas */}
        <TabsContent value="characteristics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            {/* Características Físicas */}
            <Card className="bg-gray-900 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Ruler className="w-5 h-5 text-blue-400" />
                  Físicas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Altura</span>
                    <span className="text-white font-medium">{playerStats.characteristics.physical.height}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Peso</span>
                    <span className="text-white font-medium">{playerStats.characteristics.physical.weight} lbs</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Envergadura</span>
                    <span className="text-white font-medium">{playerStats.characteristics.physical.wingspan}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Salto Vertical</span>
                    <span className="text-white font-medium">{playerStats.characteristics.physical.verticalLeap}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Velocidad</span>
                    <div className="flex items-center gap-2">
                      <Progress value={playerStats.characteristics.physical.speed} className="w-16 h-2" />
                      <span className="text-white text-sm">{playerStats.characteristics.physical.speed}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Habilidades Técnicas */}
            <Card className="bg-gray-900 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Target className="w-5 h-5 text-green-400" />
                  Técnicas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(playerStats.characteristics.technical).map(([skill, value]) => (
                  <div key={skill} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400 capitalize">{skill.replace("_", " ")}</span>
                      <span className="text-white">{value}</span>
                    </div>
                    <Progress value={value} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Aspectos Mentales */}
            <Card className="bg-gray-900 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Zap className="w-5 h-5 text-yellow-400" />
                  Mentales
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(playerStats.characteristics.mental).map(([aspect, value]) => (
                  <div key={aspect} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400 capitalize">{aspect.replace("_", " ")}</span>
                      <span className="text-white">{value}</span>
                    </div>
                    <Progress value={value} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Información Adicional */}
          <Card className="bg-gray-900 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-purple-400" />
                Información Adicional
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-400">Universidad:</span>
                    <span className="text-white">{player.college || "N/A"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-400">Año de Draft:</span>
                    <span className="text-white">{player.draft_year}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-400">Ronda:</span>
                    <span className="text-white">{player.draft_round}</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-400">Pick:</span>
                    <span className="text-white">#{player.draft_number}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-400">País:</span>
                    <span className="text-white">{player.country}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-400">Conferencia:</span>
                    <span className="text-white">{player.team?.conference}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Historial de Rendimiento */}
        <TabsContent value="history" className="space-y-4">
          <Card className="bg-gray-900 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Evolución de Estadísticas (Últimas 5 Temporadas)</CardTitle>
              <CardDescription className="text-gray-400">
                Tendencias de rendimiento a lo largo de los años
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Gráfica de Puntos */}
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-300">Puntos por Juego</h4>
                  <div className="flex items-end gap-2 h-32">
                    {playerStats.historicalData.map((season, index) => (
                      <div key={season.season} className="flex-1 flex flex-col items-center">
                        <div
                          className="w-full bg-gradient-to-t from-purple-600 to-purple-400 rounded-t"
                          style={{ height: `${(season.points / 35) * 100}%` }}
                        ></div>
                        <div className="text-xs text-gray-400 mt-2 transform -rotate-45 origin-left">
                          {season.season}
                        </div>
                        <div className="text-xs text-white font-medium">{season.points}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Gráfica de Rebotes */}
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-300">Rebotes por Juego</h4>
                  <div className="flex items-end gap-2 h-32">
                    {playerStats.historicalData.map((season, index) => (
                      <div key={season.season} className="flex-1 flex flex-col items-center">
                        <div
                          className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t"
                          style={{ height: `${(season.rebounds / 15) * 100}%` }}
                        ></div>
                        <div className="text-xs text-gray-400 mt-2 transform -rotate-45 origin-left">
                          {season.season}
                        </div>
                        <div className="text-xs text-white font-medium">{season.rebounds}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Gráfica de Asistencias */}
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-300">Asistencias por Juego</h4>
                  <div className="flex items-end gap-2 h-32">
                    {playerStats.historicalData.map((season, index) => (
                      <div key={season.season} className="flex-1 flex flex-col items-center">
                        <div
                          className="w-full bg-gradient-to-t from-green-600 to-green-400 rounded-t"
                          style={{ height: `${(season.assists / 12) * 100}%` }}
                        ></div>
                        <div className="text-xs text-gray-400 mt-2 transform -rotate-45 origin-left">
                          {season.season}
                        </div>
                        <div className="text-xs text-white font-medium">{season.assists}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Análisis IA */}
        <TabsContent value="analysis" className="space-y-4">
          {isPremium ? (
            <div className="space-y-4">
              <Card className="bg-gradient-to-br from-purple-900/50 to-blue-900/50 border-purple-500/30">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Zap className="w-5 h-5 text-yellow-400" />
                    Análisis IA Avanzado
                  </CardTitle>
                  <CardDescription className="text-gray-300">
                    Insights generados por inteligencia artificial
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-3">
                      <h4 className="font-semibold text-green-400">Fortalezas Identificadas</h4>
                      <ul className="space-y-2 text-sm text-gray-300">
                        <li>• Excelente consistencia en tiros libres</li>
                        <li>• Liderazgo natural en momentos clave</li>
                        <li>• Adaptabilidad táctica superior</li>
                        <li>• Resistencia física excepcional</li>
                      </ul>
                    </div>
                    <div className="space-y-3">
                      <h4 className="font-semibold text-red-400">Áreas de Mejora</h4>
                      <ul className="space-y-2 text-sm text-gray-300">
                        <li>• Reducir pérdidas de balón</li>
                        <li>• Mejorar porcentaje de triples</li>
                        <li>• Incrementar rebotes defensivos</li>
                        <li>• Optimizar selección de tiros</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-900 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Proyecciones de Rendimiento</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-400">↗ +12%</div>
                      <div className="text-sm text-gray-400">Mejora Esperada</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-400">87%</div>
                      <div className="text-sm text-gray-400">Confianza IA</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-400">Elite</div>
                      <div className="text-sm text-gray-400">Categoría</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card className="bg-gray-900 border-gray-700">
              <CardContent className="text-center py-12">
                <Zap className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Análisis IA Premium</h3>
                <p className="text-gray-400 mb-6">
                  Desbloquea insights avanzados generados por inteligencia artificial
                </p>
                <Button className="bg-gradient-to-r from-purple-600 to-blue-600">Upgrade a Premium</Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

