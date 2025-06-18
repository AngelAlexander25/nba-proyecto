import { NextResponse } from "next/server"
import { nbaApi } from "@/lib/api-client"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)

    // Parsear parámetros de manera más robusta
    const seasons_param = searchParams.get("seasons")
    const team_ids_param = searchParams.get("team_ids")
    const dates_param = searchParams.get("dates")
    const per_page = Number.parseInt(searchParams.get("per_page") || "25")
    const cursor = searchParams.get("cursor") ? Number.parseInt(searchParams.get("cursor")!) : undefined
    const start_date = searchParams.get("start_date") || undefined
    const end_date = searchParams.get("end_date") || undefined

    let seasons: number[] | undefined
    if (seasons_param) {
      try {
        seasons = seasons_param
          .split(",")
          .map((s) => Number.parseInt(s.trim()))
          .filter((s) => !isNaN(s))
      } catch (e) {
        console.error("Error parsing seasons:", e)
      }
    }

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

    let dates: string[] | undefined
    if (dates_param) {
      try {
        dates = dates_param
          .split(",")
          .map((d) => d.trim())
          .filter((d) => d.length > 0)
      } catch (e) {
        console.error("Error parsing dates:", e)
      }
    }

    const data = await nbaApi.getGames({
      seasons,
      team_ids,
      dates,
      per_page: Math.min(per_page, 100),
      cursor,
      start_date,
      end_date,
    })

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
