// Cliente API mejorado con manejo de rate limiting y errores
const API_KEY = "0f127e85-f4b7-453b-9811-c0b8ea60070a"
const BASE_URL = "https://api.balldontlie.io/v1"

interface ApiResponse<T> {
  data: T[]
  meta: {
    next_cursor?: number
    per_page: number
    total_pages?: number
    current_page?: number
    total_count?: number
  }
}

interface RequestQueue {
  resolve: (value: any) => void
  reject: (error: any) => void
  request: () => Promise<any>
}

class NBAApiClient {
  private requestQueue: RequestQueue[] = []
  private isProcessing = false
  private lastRequestTime = 0
  private readonly MIN_REQUEST_INTERVAL = 1000 // 1 segundo entre requests

  private async processQueue() {
    if (this.isProcessing || this.requestQueue.length === 0) return

    this.isProcessing = true

    while (this.requestQueue.length > 0) {
      const { resolve, reject, request } = this.requestQueue.shift()!

      try {
        // Esperar el intervalo mínimo entre requests
        const timeSinceLastRequest = Date.now() - this.lastRequestTime
        if (timeSinceLastRequest < this.MIN_REQUEST_INTERVAL) {
          await new Promise((resolve) => setTimeout(resolve, this.MIN_REQUEST_INTERVAL - timeSinceLastRequest))
        }

        const result = await request()
        this.lastRequestTime = Date.now()
        resolve(result)
      } catch (error) {
        reject(error)
      }

      // Pequeña pausa adicional para evitar rate limiting
      await new Promise((resolve) => setTimeout(resolve, 200))
    }

    this.isProcessing = false
  }

  private async queueRequest<T>(request: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.requestQueue.push({ resolve, reject, request })
      this.processQueue()
    })
  }

  private async makeRequest<T>(endpoint: string, params?: Record<string, string>): Promise<ApiResponse<T>> {
    return this.queueRequest(async () => {
      const url = new URL(`${BASE_URL}${endpoint}`)

      // Limpiar parámetros undefined o vacíos
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value && value.trim() !== "") {
            url.searchParams.append(key, value)
          }
        })
      }

      console.log(`Making API request to: ${url.toString()}`)

      const response = await fetch(url.toString(), {
        headers: {
          Authorization: API_KEY,
          "Content-Type": "application/json",
        },
        next: { revalidate: 300 },
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error(`API Error: ${response.status} - ${response.statusText}`, errorText)

        if (response.status === 429) {
          throw new Error(`Rate limit exceeded. Please try again later.`)
        } else if (response.status === 400) {
          throw new Error(`Bad request. Please check your parameters.`)
        } else if (response.status === 401) {
          throw new Error(`Unauthorized. Please check your API key.`)
        } else {
          throw new Error(`API Error: ${response.status} - ${response.statusText}`)
        }
      }

      const data = await response.json()
      console.log(`API Response received:`, { endpoint, dataLength: data.data?.length || 0 })
      return data
    })
  }

  async getTeams() {
    try {
      return await this.makeRequest("/teams")
    } catch (error) {
      console.error("Error in getTeams:", error)
      throw error
    }
  }

  async getPlayers(params?: {
    search?: string
    team_ids?: number[]
    per_page?: number
    cursor?: number
  }) {
    try {
      const queryParams: Record<string, string> = {}

      if (params?.search) queryParams.search = params.search
      if (params?.team_ids && params.team_ids.length > 0) {
        params.team_ids.forEach((id) => {
          queryParams[`team_ids[]`] = id.toString()
        })
      }
      if (params?.per_page) queryParams.per_page = Math.min(params.per_page, 100).toString()
      if (params?.cursor) queryParams.cursor = params.cursor.toString()

      return await this.makeRequest("/players", queryParams)
    } catch (error) {
      console.error("Error in getPlayers:", error)
      throw error
    }
  }

  async getGames(params?: {
    seasons?: number[]
    team_ids?: number[]
    dates?: string[]
    per_page?: number
    cursor?: number
    start_date?: string
    end_date?: string
  }) {
    try {
      const queryParams: Record<string, string> = {}

      if (params?.seasons && params.seasons.length > 0) {
        params.seasons.forEach((season) => {
          queryParams[`seasons[]`] = season.toString()
        })
      }
      if (params?.team_ids && params.team_ids.length > 0) {
        params.team_ids.forEach((id) => {
          queryParams[`team_ids[]`] = id.toString()
        })
      }
      if (params?.dates && params.dates.length > 0) {
        params.dates.forEach((date) => {
          queryParams[`dates[]`] = date
        })
      }
      if (params?.per_page) queryParams.per_page = Math.min(params.per_page, 100).toString()
      if (params?.cursor) queryParams.cursor = params.cursor.toString()
      if (params?.start_date) queryParams.start_date = params.start_date
      if (params?.end_date) queryParams.end_date = params.end_date

      return await this.makeRequest("/games", queryParams)
    } catch (error) {
      console.error("Error in getGames:", error)
      throw error
    }
  }

  async getStats(params?: {
    seasons?: number[]
    player_ids?: number[]
    game_ids?: number[]
    dates?: string[]
    per_page?: number
    cursor?: number
  }) {
    try {
      const queryParams: Record<string, string> = {}

      if (params?.seasons && params.seasons.length > 0) {
        params.seasons.forEach((season) => {
          queryParams[`seasons[]`] = season.toString()
        })
      }
      if (params?.player_ids && params.player_ids.length > 0) {
        params.player_ids.forEach((id) => {
          queryParams[`player_ids[]`] = id.toString()
        })
      }
      if (params?.game_ids && params.game_ids.length > 0) {
        params.game_ids.forEach((id) => {
          queryParams[`game_ids[]`] = id.toString()
        })
      }
      if (params?.dates && params.dates.length > 0) {
        params.dates.forEach((date) => {
          queryParams[`dates[]`] = date
        })
      }
      if (params?.per_page) queryParams.per_page = Math.min(params.per_page, 100).toString()
      if (params?.cursor) queryParams.cursor = params.cursor.toString()

      return await this.makeRequest("/stats", queryParams)
    } catch (error) {
      console.error("Error in getStats:", error)
      throw error
    }
  }

  async getSeasonAverages(params: {
    season: number
    player_ids?: number[]
  }) {
    try {
      const queryParams: Record<string, string> = {
        season: params.season.toString(),
      }

      if (params.player_ids && params.player_ids.length > 0) {
        params.player_ids.forEach((id) => {
          queryParams[`player_ids[]`] = id.toString()
        })
      }

      return await this.makeRequest("/season_averages", queryParams)
    } catch (error) {
      console.error("Error in getSeasonAverages:", error)
      throw error
    }
  }
}

export const nbaApi = new NBAApiClient()
