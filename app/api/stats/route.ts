import { NextResponse } from "next/server"
import { nbaApi } from "@/lib/api-client"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const seasons = searchParams.get("seasons") || "2023"
    const player_ids = searchParams.get("player_ids") || undefined
    const game_ids = searchParams.get("game_ids") || undefined
    const dates = searchParams.get("dates") || undefined
    const per_page = searchParams.get("per_page") || "25"

    const data = await nbaApi.getStats({
      seasons,
      player_ids,
      game_ids,
      dates,
      per_page,
    })

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching stats:", error)
    return NextResponse.json(
      { error: "Failed to fetch stats", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}
