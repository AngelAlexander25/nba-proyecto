import { type NextRequest, NextResponse } from "next/server"
import { nbaApi } from "@/lib/api-client"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const search = searchParams.get("search")
    const team_ids = searchParams.get("team_ids")
    const per_page = searchParams.get("per_page")
    const cursor = searchParams.get("cursor")

    console.log("Players API route called with params:", { search, team_ids, per_page, cursor })

    const params: any = {}

    if (search) params.search = search
    if (team_ids) {
      // Convertir string de IDs separados por coma a array de números
      params.team_ids = team_ids
        .split(",")
        .map((id) => Number.parseInt(id.trim()))
        .filter((id) => !isNaN(id))
    }
    if (per_page) params.per_page = Math.min(Number.parseInt(per_page), 100)
    if (cursor) params.cursor = Number.parseInt(cursor)

    // Si no hay parámetros específicos, usar valores por defecto para obtener jugadores populares
    if (!search && !team_ids) {
      params.per_page = params.per_page || 25
    }

    console.log("Calling nbaApi.getPlayers with params:", params)
    const response = await nbaApi.getPlayers(params)

    console.log("Players API response received:", {
      dataLength: response?.data?.length || 0,
      hasData: !!response?.data,
      meta: response?.meta,
    })

    return NextResponse.json(response)
  } catch (error) {
    console.error("Players API route error:", error)

    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"

    // Manejar diferentes tipos de errores
    if (errorMessage.includes("Authentication failed") || errorMessage.includes("401")) {
      return NextResponse.json(
        {
          error: "Authentication Error",
          details: "API key authentication failed. Please check the API configuration.",
          data: [],
          meta: { per_page: 25 },
        },
        { status: 401 },
      )
    }

    if (errorMessage.includes("Rate limit") || errorMessage.includes("429")) {
      return NextResponse.json(
        {
          error: "Rate Limit Exceeded",
          details: "Too many requests. Please try again later.",
          data: [],
          meta: { per_page: 25 },
          retryAfter: 30,
        },
        { status: 429 },
      )
    }

    return NextResponse.json(
      {
        error: "API Error",
        details: errorMessage,
        data: [],
        meta: { per_page: 25 },
      },
      { status: 500 },
    )
  }
}
