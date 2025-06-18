import { NextResponse } from "next/server"
import { nbaApi } from "@/lib/api-client"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search") || undefined
    const team_ids_param = searchParams.get("team_ids")
    const per_page = Number.parseInt(searchParams.get("per_page") || "25")
    const cursor = searchParams.get("cursor") ? Number.parseInt(searchParams.get("cursor")!) : undefined

    // Parsear team_ids si existe
    let team_ids: number[] | undefined
    if (team_ids_param) {
      try {
        team_ids = team_ids_param
          .split(",")
          .map((id) => Number.parseInt(id.trim()))
          .filter((id) => !isNaN(id))
      } catch (e) {
        console.error("Error parsing team_ids:", e)
      }
    }

    const data = await nbaApi.getPlayers({
      search,
      team_ids,
      per_page: Math.min(per_page, 100), // Limitar a máximo 100
      cursor,
    })

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error in players API route:", error)

    // Devolver un error más específico
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"

    return NextResponse.json(
      {
        error: "Failed to fetch players",
        details: errorMessage,
        data: [], // Devolver array vacío como fallback
        meta: { per_page: 0 },
      },
      { status: 500 },
    )
  }
}
