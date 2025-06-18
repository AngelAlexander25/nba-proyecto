"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Clock, ExternalLink, TrendingUp } from "lucide-react"

interface NewsItem {
  id: number
  title: string
  summary: string
  category: string
  timestamp: string
  impact: "high" | "medium" | "low"
  teams: string[]
}

export default function Noticias() {
  const [news, setNews] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    generateMockNews()
  }, [])

  const generateMockNews = () => {
    const mockNews: NewsItem[] = [
      {
        id: 1,
        title: "Lakers adquieren nuevo jugador estrella en intercambio",
        summary:
          "Los Angeles Lakers completan un intercambio de múltiples jugadores que podría cambiar su temporada. El movimiento incluye picks de draft y jugadores veteranos.",
        category: "Intercambios",
        timestamp: "Hace 2 horas",
        impact: "high",
        teams: ["Lakers", "Nets"],
      },
      {
        id: 2,
        title: "Lesión de Stephen Curry afecta las probabilidades de Warriors",
        summary:
          "La estrella de Golden State Warriors sufrió una lesión en el tobillo que lo mantendrá fuera por 2-3 semanas, impactando significativamente las cuotas de apuestas.",
        category: "Lesiones",
        timestamp: "Hace 4 horas",
        impact: "high",
        teams: ["Warriors"],
      },
      {
        id: 3,
        title: "Celtics extienden racha ganadora a 8 juegos",
        summary:
          "Boston Celtics continúa su impresionante racha con una victoria dominante sobre Miami Heat. Su ofensiva ha promediado 118 puntos en los últimos 5 juegos.",
        category: "Resultados",
        timestamp: "Hace 6 horas",
        impact: "medium",
        teams: ["Celtics", "Heat"],
      },
      {
        id: 4,
        title: "Análisis: ¿Pueden los Nuggets repetir como campeones?",
        summary:
          "Un análisis profundo de las posibilidades de Denver Nuggets de defender su título, considerando su rendimiento actual y la competencia en el Oeste.",
        category: "Análisis",
        timestamp: "Hace 8 horas",
        impact: "medium",
        teams: ["Nuggets"],
      },
      {
        id: 5,
        title: "Rookie del año: Wembanyama lidera las estadísticas",
        summary:
          "Victor Wembanyama de San Antonio Spurs continúa impresionando con promedios de 18.2 puntos, 10.1 rebotes y 2.8 bloqueos por juego.",
        category: "Jugadores",
        timestamp: "Hace 12 horas",
        impact: "low",
        teams: ["Spurs"],
      },
      {
        id: 6,
        title: "Cambios en las cuotas: Favoritos para el MVP",
        summary:
          "Las casas de apuestas ajustan las probabilidades para el MVP tras las actuaciones recientes. Jokic y Tatum lideran las apuestas.",
        category: "Apuestas",
        timestamp: "Hace 1 día",
        impact: "medium",
        teams: ["Nuggets", "Celtics"],
      },
      {
        id: 7,
        title: "Suspensión afecta a jugador clave de Phoenix Suns",
        summary:
          "La NBA suspende a un jugador titular de Phoenix Suns por 3 juegos debido a una falta flagrante, afectando sus próximos enfrentamientos.",
        category: "Disciplina",
        timestamp: "Hace 1 día",
        impact: "high",
        teams: ["Suns"],
      },
      {
        id: 8,
        title: "Récord histórico: Más triples en una temporada",
        summary:
          "La NBA está en camino de establecer un nuevo récord de triples intentados y convertidos en una temporada regular.",
        category: "Récords",
        timestamp: "Hace 2 días",
        impact: "low",
        teams: [],
      },
    ]

    setNews(mockNews)
    setLoading(false)
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "high":
        return "destructive"
      case "medium":
        return "default"
      case "low":
        return "secondary"
      default:
        return "outline"
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Intercambios":
        return "bg-blue-100 text-blue-800"
      case "Lesiones":
        return "bg-red-100 text-red-800"
      case "Resultados":
        return "bg-green-100 text-green-800"
      case "Análisis":
        return "bg-purple-100 text-purple-800"
      case "Jugadores":
        return "bg-yellow-100 text-yellow-800"
      case "Apuestas":
        return "bg-orange-100 text-orange-800"
      case "Disciplina":
        return "bg-gray-100 text-gray-800"
      case "Récords":
        return "bg-indigo-100 text-indigo-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div className="flex items-center space-x-2">
          <SidebarTrigger />
          <h2 className="text-3xl font-bold tracking-tight">Noticias NBA</h2>
        </div>
        <Button variant="outline" onClick={generateMockNews}>
          <TrendingUp className="h-4 w-4 mr-2" />
          Actualizar
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1">
        {loading
          ? [...Array(6)].map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <div className="h-4 bg-muted animate-pulse rounded w-3/4" />
                  <div className="h-3 bg-muted animate-pulse rounded w-1/2" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="h-3 bg-muted animate-pulse rounded" />
                    <div className="h-3 bg-muted animate-pulse rounded" />
                    <div className="h-3 bg-muted animate-pulse rounded w-2/3" />
                  </div>
                </CardContent>
              </Card>
            ))
          : news.map((item) => (
              <Card key={item.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg leading-tight mb-2">{item.title}</CardTitle>
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge className={getCategoryColor(item.category)}>{item.category}</Badge>
                        <Badge variant={getImpactColor(item.impact)}>
                          Impacto {item.impact === "high" ? "Alto" : item.impact === "medium" ? "Medio" : "Bajo"}
                        </Badge>
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="h-4 w-4 mr-1" />
                        {item.timestamp}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm leading-relaxed mb-4">{item.summary}</CardDescription>

                  {item.teams.length > 0 && (
                    <div className="flex items-center space-x-2 mb-4">
                      <span className="text-sm font-medium">Equipos afectados:</span>
                      <div className="flex space-x-1">
                        {item.teams.map((team) => (
                          <Badge key={team} variant="outline" className="text-xs">
                            {team}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {item.impact === "high" && (
                        <div className="flex items-center text-sm text-red-600">
                          <TrendingUp className="h-4 w-4 mr-1" />
                          <span>Alto impacto en apuestas</span>
                        </div>
                      )}
                    </div>
                    <Button variant="ghost" size="sm">
                      <ExternalLink className="h-4 w-4 mr-1" />
                      Leer más
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Próximos Eventos Importantes</CardTitle>
          <CardDescription>Fechas clave que podrían impactar las apuestas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">Trade Deadline</p>
                <p className="text-sm text-muted-foreground">Fecha límite para intercambios</p>
              </div>
              <Badge variant="outline">8 Feb 2024</Badge>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">All-Star Break</p>
                <p className="text-sm text-muted-foreground">Pausa del Juego de Estrellas</p>
              </div>
              <Badge variant="outline">16-25 Feb 2024</Badge>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">Playoffs Begin</p>
                <p className="text-sm text-muted-foreground">Inicio de los playoffs</p>
              </div>
              <Badge variant="outline">20 Abr 2024</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
