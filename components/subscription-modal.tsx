"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Crown, Check, X, CreditCard, Shield, Zap, TrendingUp, BarChart3, Target, Star } from "lucide-react"

interface SubscriptionModalProps {
  isOpen: boolean
  onClose: () => void
  onSubscribe: () => void
}

export function SubscriptionModal({ isOpen, onClose, onSubscribe }: SubscriptionModalProps) {
  const [selectedPlan, setSelectedPlan] = useState("pro")
  const [isProcessing, setIsProcessing] = useState(false)

  const plans = [
    {
      id: "free",
      name: "Free",
      price: 0,
      period: "Siempre gratis",
      description: "Perfecto para comenzar",
      features: [
        "Estadísticas básicas de jugadores",
        "Información de equipos",
        "Hasta 10 búsquedas por día",
        "Datos de temporada actual",
      ],
      limitations: ["Sin predicciones IA", "Sin análisis avanzados", "Sin gráficas premium", "Soporte limitado"],
      color: "gray",
      icon: Shield,
    },
    {
      id: "pro",
      name: "Pro",
      price: 29,
      period: "por mes",
      description: "Para analistas serios",
      features: [
        "Todas las funciones Free",
        "Predicciones IA avanzadas",
        "Análisis multidimensional",
        "Gráficas interactivas premium",
        "Datos históricos completos",
        "Alertas personalizadas",
        "Exportación de datos",
        "Soporte prioritario 24/7",
      ],
      limitations: [],
      color: "orange",
      icon: Crown,
      popular: true,
    },
    {
      id: "enterprise",
      name: "Enterprise",
      price: 99,
      period: "por mes",
      description: "Para equipos profesionales",
      features: [
        "Todas las funciones Pro",
        "API personalizada",
        "Integración con sistemas externos",
        "Análisis de equipos completos",
        "Reportes automatizados",
        "Consultoría especializada",
        "SLA garantizado",
        "Gerente de cuenta dedicado",
      ],
      limitations: [],
      color: "purple",
      icon: Star,
    },
  ]

  const handleSubscribe = async () => {
    setIsProcessing(true)

    // Simular procesamiento de pago
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setIsProcessing(false)
    onSubscribe()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto bg-slate-900 border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white flex items-center gap-2">
            <Crown className="h-6 w-6 text-orange-400" />
            Upgrade a NBA ProStats Premium
          </DialogTitle>
          <DialogDescription className="text-gray-300">
            Desbloquea el poder completo de la inteligencia artificial para análisis deportivo
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 md:grid-cols-3 mt-6">
          {plans.map((plan) => {
            const Icon = plan.icon
            const isSelected = selectedPlan === plan.id

            return (
              <Card
                key={plan.id}
                className={`relative cursor-pointer transition-all duration-200 ${
                  isSelected
                    ? `bg-${plan.color}-500/10 border-${plan.color}-500/50 ring-2 ring-${plan.color}-500/30`
                    : "bg-white/5 border-white/10 hover:bg-white/10"
                }`}
                onClick={() => setSelectedPlan(plan.id)}
              >
                {plan.popular && (
                  <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-orange-500 to-red-500">
                    Más Popular
                  </Badge>
                )}

                <CardHeader className="text-center">
                  <div
                    className={`w-12 h-12 mx-auto rounded-full bg-${plan.color}-500/20 flex items-center justify-center mb-4`}
                  >
                    <Icon className={`h-6 w-6 text-${plan.color}-400`} />
                  </div>
                  <CardTitle className="text-white text-xl">{plan.name}</CardTitle>
                  <CardDescription className="text-gray-300">{plan.description}</CardDescription>
                  <div className="text-center">
                    <span className="text-3xl font-bold text-white">${plan.price}</span>
                    <span className="text-gray-400 ml-1">{plan.period}</span>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-400 flex-shrink-0" />
                        <span className="text-sm text-gray-300">{feature}</span>
                      </div>
                    ))}
                    {plan.limitations.map((limitation, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <X className="h-4 w-4 text-red-400 flex-shrink-0" />
                        <span className="text-sm text-gray-400">{limitation}</span>
                      </div>
                    ))}
                  </div>

                  {plan.id !== "free" && (
                    <Button
                      className={`w-full ${
                        isSelected ? `bg-${plan.color}-500 hover:bg-${plan.color}-600` : "bg-gray-600 hover:bg-gray-700"
                      }`}
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedPlan(plan.id)
                      }}
                    >
                      {isSelected ? "Seleccionado" : "Seleccionar"}
                    </Button>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Características Premium Destacadas */}
        <div className="mt-8 p-6 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-lg border border-purple-500/20">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Zap className="h-5 w-5 text-yellow-400" />
            ¿Qué obtienes con Premium?
          </h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-8 w-8 text-purple-400" />
              <div>
                <div className="font-medium text-white">Predicciones IA</div>
                <div className="text-sm text-gray-400">Algoritmos ML avanzados</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <BarChart3 className="h-8 w-8 text-blue-400" />
              <div>
                <div className="font-medium text-white">Analytics Pro</div>
                <div className="text-sm text-gray-400">Métricas profesionales</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Target className="h-8 w-8 text-green-400" />
              <div>
                <div className="font-medium text-white">Betting Insights</div>
                <div className="text-sm text-gray-400">Análisis de apuestas</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Shield className="h-8 w-8 text-orange-400" />
              <div>
                <div className="font-medium text-white">Datos Premium</div>
                <div className="text-sm text-gray-400">Acceso completo</div>
              </div>
            </div>
          </div>
        </div>

        {/* Botones de Acción */}
        <div className="flex gap-4 mt-6">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-800"
          >
            Cancelar
          </Button>
          {selectedPlan !== "free" && (
            <Button
              onClick={handleSubscribe}
              disabled={isProcessing}
              className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Procesando...
                </>
              ) : (
                <>
                  <CreditCard className="w-4 h-4 mr-2" />
                  Suscribirse a {plans.find((p) => p.id === selectedPlan)?.name} - $
                  {plans.find((p) => p.id === selectedPlan)?.price}/mes
                </>
              )}
            </Button>
          )}
        </div>

        {/* Garantía */}
        <div className="text-center mt-4 text-sm text-gray-400">
          <Shield className="h-4 w-4 inline mr-1" />
          Garantía de devolución de 30 días • Cancela en cualquier momento
        </div>
      </DialogContent>
    </Dialog>
  )
}
