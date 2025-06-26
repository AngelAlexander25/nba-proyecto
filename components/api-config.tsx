"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, CheckCircle, Key, RefreshCw } from "lucide-react"
import { nbaApi } from "@/lib/api-client"

export function ApiConfig() {
  const [apiInfo, setApiInfo] = useState<any>(null)
  const [connectionStatus, setConnectionStatus] = useState<"idle" | "testing" | "success" | "error">("idle")
  const [cacheStats, setCacheStats] = useState<any>(null)

  useEffect(() => {
    // Obtener información de la API al cargar
    const info = nbaApi.getApiKeyInfo()
    setApiInfo(info)

    // Obtener estadísticas del cache
    const stats = nbaApi.getCacheStats()
    setCacheStats(stats)
  }, [])

  const testConnection = async () => {
    setConnectionStatus("testing")
    try {
      const success = await nbaApi.testConnection()
      setConnectionStatus(success ? "success" : "error")

      // Actualizar estadísticas del cache
      const stats = nbaApi.getCacheStats()
      setCacheStats(stats)
    } catch (error) {
      console.error("Connection test failed:", error)
      setConnectionStatus("error")
    }
  }

  const refreshCache = () => {
    const stats = nbaApi.getCacheStats()
    setCacheStats(stats)
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Key className="h-5 w-5" />
          API Configuration & Status
        </CardTitle>
        <CardDescription>Monitor NBA API connection and cache status</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* API Key Info */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium">API Key Information</h4>
          <div className="flex items-center gap-2">
            <Badge variant={apiInfo?.source === "environment" ? "default" : "secondary"}>
              {apiInfo?.key || "Loading..."}
            </Badge>
            <Badge variant={apiInfo?.source === "environment" ? "default" : "outline"}>
              {apiInfo?.source || "unknown"}
            </Badge>
            {apiInfo?.authError && (
              <Badge variant="destructive" className="flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                Auth Error
              </Badge>
            )}
          </div>
        </div>

        {/* Connection Test */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Connection Status</h4>
          <div className="flex items-center gap-2">
            <Button onClick={testConnection} disabled={connectionStatus === "testing"} size="sm" variant="outline">
              {connectionStatus === "testing" ? (
                <RefreshCw className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-2" />
              )}
              Test Connection
            </Button>

            {connectionStatus === "success" && (
              <Badge variant="default" className="flex items-center gap-1">
                <CheckCircle className="h-3 w-3" />
                Connected
              </Badge>
            )}

            {connectionStatus === "error" && (
              <Badge variant="destructive" className="flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                Failed
              </Badge>
            )}
          </div>
        </div>

        {/* Cache Stats */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-medium">Cache Statistics</h4>
            <Button onClick={refreshCache} size="sm" variant="ghost">
              <RefreshCw className="h-3 w-3" />
            </Button>
          </div>

          {cacheStats && (
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Keys:</span>
                <span className="font-medium">{cacheStats.totalKeys}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Cache Hits:</span>
                <span className="font-medium">{cacheStats.hits}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Cache Misses:</span>
                <span className="font-medium">{cacheStats.misses}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Hit Rate:</span>
                <span className="font-medium">
                  {cacheStats.hits + cacheStats.misses > 0
                    ? Math.round((cacheStats.hits / (cacheStats.hits + cacheStats.misses)) * 100)
                    : 0}
                  %
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Setup Instructions</h4>
          <div className="text-sm text-muted-foreground space-y-1">
            <p>
              1. Get your API key from{" "}
              <a
                href="https://www.balldontlie.io/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                balldontlie.io
              </a>
            </p>
            <p>
              2. Add it as environment variable:{" "}
              <code className="bg-muted px-1 rounded">NBA_API_KEY=your_key_here</code>
            </p>
            <p>3. Restart your development server</p>
            <p>4. Test the connection above</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
