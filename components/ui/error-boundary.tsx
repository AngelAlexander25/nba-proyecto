"use client"

import React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertTriangle, RefreshCw } from "lucide-react"

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <Card className="w-full max-w-md mx-auto mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Algo salió mal
            </CardTitle>
            <CardDescription>Ha ocurrido un error inesperado. Por favor, intenta recargar la página.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => window.location.reload()} className="w-full" variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Recargar página
            </Button>
            {this.state.error && (
              <details className="mt-4 text-sm text-muted-foreground">
                <summary className="cursor-pointer">Detalles del error</summary>
                <pre className="mt-2 whitespace-pre-wrap break-all">{this.state.error.message}</pre>
              </details>
            )}
          </CardContent>
        </Card>
      )
    }

    return this.props.children
  }
}

// Componente para mostrar errores de API de forma amigable
interface ApiErrorDisplayProps {
  error: string
  onRetry?: () => void
  title?: string
}

export function ApiErrorDisplay({ error, onRetry, title = "Error al cargar datos" }: ApiErrorDisplayProps) {
  const isRateLimit = error.includes("Rate limit") || error.includes("429")
  const isBadRequest = error.includes("Bad request") || error.includes("400")

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-destructive">
          <AlertTriangle className="h-5 w-5" />
          {title}
        </CardTitle>
        <CardDescription>
          {isRateLimit &&
            "Se ha excedido el límite de solicitudes. Por favor, espera un momento antes de intentar nuevamente."}
          {isBadRequest && "Los parámetros de la solicitud no son válidos. Por favor, verifica los filtros aplicados."}
          {!isRateLimit && !isBadRequest && "Ha ocurrido un error al obtener los datos de la API."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {onRetry && (
          <Button onClick={onRetry} variant="outline" className="w-full mb-4">
            <RefreshCw className="h-4 w-4 mr-2" />
            Intentar nuevamente
          </Button>
        )}
        <details className="text-sm text-muted-foreground">
          <summary className="cursor-pointer">Detalles del error</summary>
          <pre className="mt-2 whitespace-pre-wrap break-all text-xs">{error}</pre>
        </details>
      </CardContent>
    </Card>
  )
}
