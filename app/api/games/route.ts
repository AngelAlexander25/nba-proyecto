import { NextResponse } from "next/server"
import { nbaApi } from "@/lib/api-client"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)

    // Parsear parámetros
    const seasons_param = searchParams.get("seasons")
    const team_ids_param = searchParams.get("team_ids")
    const dates_param = searchParams.get("dates")
    const per_page = Number.parseInt(searchParams.get("per_page") || "25")
    const cursor = searchParams.get("cursor") ? Number.parseInt(searchParams.get("cursor")!) : undefined
    const start_date = searchParams.get("start_date") || undefined
    const end_date = searchParams.get("end_date") || undefined

    const params: any = {}

    if (seasons_param) {
      try {
        params.seasons = seasons_param
          .split(",")
          .map((s) => Number.parseInt(s.trim()))
          .filter((s) => !isNaN(s))
      } catch (e) {
        console.error("Error parsing seasons:", e)
      }
    }

    if (team_ids_param) {
      try {
        params.team_ids = team_ids_param
          .split(",")
          .map((id) => Number.parseInt(id.trim()))
          .filter((id) => !isNaN(id))
      } catch (e) {
        console.error("Error parsing team_ids:", e)
      }
    }

    if (dates_param) {
      try {
        params.dates = dates_param
          .split(",")
          .map((d) => d.trim())
          .filter((d) => d.length > 0)
      } catch (e) {
        console.error("Error parsing dates:", e)
      }
    }

    if (per_page) params.per_page = Math.min(per_page, 100)
    if (cursor) params.cursor = cursor
    if (start_date) params.start_date = start_date
    if (end_date) params.end_date = end_date

    const data = await nbaApi.getGames(params)

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error in games API route:", error)

    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"

    return NextResponse.json(
      {
        error: "Failed to fetch games",
        details: errorMessage,
        data: [],
        meta: { per_page: 0 },
      },
      { status: 500 },
    )
  }
}
