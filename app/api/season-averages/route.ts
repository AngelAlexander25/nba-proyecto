import { NextResponse } from "next/server"
import { nbaApi } from "@/lib/api-client"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const season = searchParams.get("season") || "2023"
    const player_ids = searchParams.get("player_ids") || undefined

    const data = await nbaApi.getSeasonAverages({
      season,
      player_ids,
    })

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching season averages:", error)
    return NextResponse.json(
      { error: "Failed to fetch season averages", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}
