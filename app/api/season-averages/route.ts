import { NextResponse } from "next/server"
import { nbaApi } from "@/lib/api-client"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    
    const season = Number.parseInt(searchParams.get("season") || "2024")
    const player_ids_param = searchParams.get("player_ids")

    const params: any = { season }

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

    const data = await nbaApi.getSeasonAverages(params)

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching season averages:", error)
    return NextResponse.json(
      { error: "Failed to fetch season averages", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}
