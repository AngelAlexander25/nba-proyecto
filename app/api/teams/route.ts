import { NextResponse } from "next/server"
import { nbaApi } from "@/lib/api-client"

export async function GET() {
  try {
    console.log("Teams API route called")
    const data = await nbaApi.getTeams()
    
    console.log("Teams API response:", {
      dataLength: data?.data?.length || 0,
      hasData: !!data?.data,
    })

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error in teams API route:", error)

    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"

    return NextResponse.json(
      {
        error: "Failed to fetch teams",
        details: errorMessage,
        data: [], // Fallback con array vacío
        meta: { per_page: 0 },
      },
      { status: 500 },
    )
  }
}
