"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { nbaApi } from "@/lib/api-client"

export function ApiDebug() {
  const [testing, setTesting] = useState(false)
  const [result, setResult] = useState<any>(null)

  const testConnection = async () => {
    setTesting(true)
    setResult(null)

    try {
      const success = await nbaApi.testConnection()
      setResult({
        success,
        message: success ? "API connection successful" : "API connection failed",
        timestamp: new Date().toISOString(),
      })
    } catch (error) {
      setResult({
        success: false,
        message: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      })
    } finally {
      setTesting(false)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          API Debug
          <Badge variant="outline">NBA API</Badge>
        </CardTitle>
        <CardDescription>Test the NBA API connection and authentication</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={testConnection} disabled={testing} className="w-full">
          {testing ? "Testing..." : "Test API Connection"}
        </Button>

        {result && (
          <div
            className={`p-3 rounded-md ${result.success ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"}`}
          >
            <div className="flex items-center gap-2 mb-2">
              <Badge variant={result.success ? "default" : "destructive"}>{result.success ? "Success" : "Error"}</Badge>
              <span className="text-sm text-gray-500">{result.timestamp}</span>
            </div>
            <p className="text-sm">{result.message}</p>
          </div>
        )}

        <div className="text-xs text-gray-500 space-y-1">
          <p>
            <strong>API Base:</strong> https://api.balldontlie.io/v1
          </p>
          <p>
            <strong>Key Format:</strong> Direct Authorization
          </p>
          <p>
            <strong>Fallback:</strong> Bearer Token
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
