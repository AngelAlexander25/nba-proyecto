import { NextResponse } from "next/server"
import { nbaApi } from "@/lib/api-client"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    
    const seasons_param = searchParams.get("seasons")
    const player_ids_param = searchParams.get("player_ids")
    const game_ids_param = searchParams.get("game_ids")
    const dates_param = searchParams.get("dates")
    const per_page = searchParams.get("per_page")

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

    if (player_ids_param) {
      try {
        params.player_ids = player_ids_param
          .split(",")
          .map((id) => Number.parseInt(id.trim()))
          .filter((id) => !isNaN(id))
      } catch (e) {
        console.error("Error parsing player_ids:", e)
      }
    }

    if (game_ids_param) {
      try {
        params.game_ids = game_ids_param
          .split(",")
          .map((id) => Number.parseInt(id.trim()))
          .filter((id) => !isNaN(id))
      } catch (e) {
        console.error("Error parsing game_ids:", e)
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

    if (per_page) params.per_page = Number.parseInt(per_page)

    const data = await nbaApi.getStats(params)

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching stats:", error)
    return NextResponse.json(
      { error: "Failed to fetch stats", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}
