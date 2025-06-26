"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Target, Clock, DollarSign, BarChart3, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useGames, useTeams } from "@/hooks/usa-nba-data"

export default function BettingPage() {
  const [betAmount, setBetAmount] = useState("")
  const [selectedBets, setSelectedBets] = useState<any[]>([])
  const { games, loading: gamesLoading } = useGames({
    seasons: "2023",
    per_page: 10,
  })
  const { teams } = useTeams()

  // Datos de ejemplo para cuotas (en una app real vendrían de una API de apuestas)
  const bettingMarkets = [
    {
      id: 1,
      type: "Ganador del Partido",
      game: "Lakers vs Warriors",
      date: "2024-01-15",
      time: "20:00",
      options: [
        { team: "Lakers", odds: 1.85, type: "home" },
        { team: "Warriors", odds: 1.95, type: "away" },
      ],
    },
    {
      id: 2,
      type: "Total de Puntos",
      game: "Celtics vs Heat",
      date: "2024-01-15",
      time: "21:30",
      options: [
        { team: "Más de 220.5", odds: 1.9, type: "over" },
        { team: "Menos de 220.5", odds: 1.9, type: "under" },
      ],
    },
    {
      id: 3,
      type: "Ganador del Partido",
      game: "Nuggets vs Suns",
      date: "2024-01-16",
      time: "19:00",
      options: [
        { team: "Nuggets", odds: 1.75, type: "home" },
        { team: "Suns", odds: 2.1, type: "away" },
      ],
    },
  ]

  const playerProps = [
    {
      id: 1,
      player: "LeBron James",
      team: "Lakers",
      stat: "Puntos",
      line: 25.5,
      over: 1.85,
      under: 1.95,
    },
    {
      id: 2,
      player: "Stephen Curry",
      team: "Warriors",
      stat: "Triples",
      line: 4.5,
      over: 1.9,
      under: 1.9,
    },
    {
      id: 3,
      player: "Nikola Jokic",
      team: "Nuggets",
      stat: "Rebotes",
      line: 11.5,
      over: 1.8,
      under: 2.0,
    },
  ]

  const addToBetSlip = (bet: any) => {
    setSelectedBets((prev) => [...prev, bet])
  }

  const removeBet = (betId: string) => {
    setSelectedBets((prev) => prev.filter((bet) => bet.id !== betId))
  }

  const calculatePotentialWin = () => {
    if (!betAmount || selectedBets.length === 0) return 0
    const totalOdds = selectedBets.reduce((acc, bet) => acc * bet.odds, 1)
    return (Number.parseFloat(betAmount) * totalOdds).toFixed(2)
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
              <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                <Target className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white">Centro de Apuestas NBA</h1>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/dashboard">
                <Button variant="ghost" className="text-white hover:bg-white/10">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Estadísticas
                </Button>
              </Link>
              <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600">
                Mi Cuenta
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Main Betting Content */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="games" className="space-y-6">
              <TabsList className="bg-white/10 border-white/20">
                <TabsTrigger value="games" className="data-[state=active]:bg-white/20">
                  Partidos
                </TabsTrigger>
                <TabsTrigger value="props" className="data-[state=active]:bg-white/20">
                  Props de Jugadores
                </TabsTrigger>
                <TabsTrigger value="live" className="data-[state=active]:bg-white/20">
                  En Vivo
                </TabsTrigger>
              </TabsList>

              <TabsContent value="games" className="space-y-4">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white">Próximos Partidos</h2>
                  <Badge className="bg-green-500/20 text-green-300">
                    <Clock className="w-3 h-3 mr-1" />
                    Actualizando en vivo
                  </Badge>
                </div>

                {bettingMarkets.map((market) => (
                  <Card key={market.id} className="bg-white/5 border-white/10 backdrop-blur-sm">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-white">{market.game}</CardTitle>
                          <p className="text-gray-400 text-sm">
                            {market.date} • {market.time}
                          </p>
                        </div>
                        <Badge variant="outline" className="border-green-500/30 text-green-300">
                          {market.type}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4">
                        {market.options.map((option, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            className="border-white/20 text-white hover:bg-green-500/20 hover:border-green-500/50 h-16 flex flex-col"
                            onClick={() =>
                              addToBetSlip({
                                id: `${market.id}-${index}`,
                                game: market.game,
                                type: market.type,
                                selection: option.team,
                                odds: option.odds,
                              })
                            }
                          >
                            <span className="font-medium">{option.team}</span>
                            <span className="text-green-400 font-bold">{option.odds}</span>
                          </Button>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="props" className="space-y-4">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white">Props de Jugadores</h2>
                  <Badge className="bg-purple-500/20 text-purple-300">Estadísticas Individuales</Badge>
                </div>

                {playerProps.map((prop) => (
                  <Card key={prop.id} className="bg-white/5 border-white/10 backdrop-blur-sm">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-white">{prop.player}</CardTitle>
                          <p className="text-gray-400 text-sm">
                            {prop.team} • {prop.stat}
                          </p>
                        </div>
                        <Badge variant="outline" className="border-purple-500/30 text-purple-300">
                          Línea: {prop.line}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4">
                        <Button
                          variant="outline"
                          className="border-white/20 text-white hover:bg-green-500/20 hover:border-green-500/50 h-16 flex flex-col"
                          onClick={() =>
                            addToBetSlip({
                              id: `${prop.id}-over`,
                              player: prop.player,
                              type: `${prop.stat} Más de ${prop.line}`,
                              selection: `Más de ${prop.line}`,
                              odds: prop.over,
                            })
                          }
                        >
                          <span className="font-medium">Más de {prop.line}</span>
                          <span className="text-green-400 font-bold">{prop.over}</span>
                        </Button>
                        <Button
                          variant="outline"
                          className="border-white/20 text-white hover:bg-red-500/20 hover:border-red-500/50 h-16 flex flex-col"
                          onClick={() =>
                            addToBetSlip({
                              id: `${prop.id}-under`,
                              player: prop.player,
                              type: `${prop.stat} Menos de ${prop.line}`,
                              selection: `Menos de ${prop.line}`,
                              odds: prop.under,
                            })
                          }
                        >
                          <span className="font-medium">Menos de {prop.line}</span>
                          <span className="text-red-400 font-bold">{prop.under}</span>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="live" className="space-y-4">
                <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                  <CardContent className="flex items-center justify-center py-20">
                    <div className="text-center">
                      <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-white mb-2">Apuestas en Vivo</h3>
                      <p className="text-gray-400">
                        Las apuestas en vivo estarán disponibles cuando haya partidos en curso
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Bet Slip */}
          <div className="lg:col-span-1">
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm sticky top-24">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Boleto de Apuesta
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedBets.length === 0 ? (
                  <div className="text-center py-8">
                    <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-400 text-sm">Selecciona apuestas para agregar a tu boleto</p>
                  </div>
                ) : (
                  <>
                    <div className="space-y-3">
                      {selectedBets.map((bet) => (
                        <div key={bet.id} className="bg-white/5 rounded-lg p-3">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-white text-sm font-medium">{bet.game || bet.player}</span>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => removeBet(bet.id)}
                              className="text-red-400 hover:text-red-300 h-6 w-6 p-0"
                            >
                              ×
                            </Button>
                          </div>
                          <p className="text-gray-400 text-xs">{bet.type}</p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-green-400 text-sm">{bet.selection}</span>
                            <span className="text-green-400 font-bold">{bet.odds}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-3 pt-4 border-t border-white/10">
                      <div>
                        <label className="text-white text-sm font-medium mb-2 block">Monto a Apostar</label>
                        <Input
                          type="number"
                          placeholder="0.00"
                          value={betAmount}
                          onChange={(e) => setBetAmount(e.target.value)}
                          className="bg-white/10 border-white/20 text-white"
                        />
                      </div>

                      <div className="bg-white/5 rounded-lg p-3">
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-400">Cuota Total:</span>
                          <span className="text-white">
                            {selectedBets.reduce((acc, bet) => acc * bet.odds, 1).toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Ganancia Potencial:</span>
                          <span className="text-green-400 font-bold">${calculatePotentialWin()}</span>
                        </div>
                      </div>

                      <Button
                        className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                        disabled={!betAmount || selectedBets.length === 0}
                      >
                        Confirmar Apuesta
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
