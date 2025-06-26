import { BalldontlieAPI } from "@balldontlie/sdk"
import { apiCache } from "./cache"

// Usar variable de entorno o fallback
const API_KEY = process.env.NBA_API_KEY || "0f127e85-f4b7-453b-9811-c0b8ea60070a"

interface RequestQueue {
  resolve: (value: any) => void
  reject: (error: any) => void
  request: () => Promise<any>
  priority: number
}

class NBAApiClient {
  private api: BalldontlieAPI | null = null
  private requestQueue: RequestQueue[] = []
  private isProcessing = false
  private lastRequestTime = 0
  private readonly MIN_REQUEST_INTERVAL = 3000 // Increased to 3 seconds
  private authError = false
  private rateLimitedUntil = 0
  private requestCount = 0
  private readonly MAX_REQUESTS_PER_MINUTE = 15 // Conservative limit

  constructor() {
    try {
      this.api = new BalldontlieAPI({ apiKey: API_KEY })
      console.log("NBA API Client initialized with key:", API_KEY.substring(0, 8) + "...")
    } catch (error) {
      console.error("Failed to initialize NBA API Client:", error)
      this.authError = true
    }
  }

  private async processQueue() {
    if (this.isProcessing || this.requestQueue.length === 0) return

    // Check if we're still rate limited
    if (Date.now() < this.rateLimitedUntil) {
      console.log(`Rate limited until ${new Date(this.rateLimitedUntil).toLocaleTimeString()}`)
      setTimeout(() => this.processQueue(), this.rateLimitedUntil - Date.now())
      return
    }

    this.isProcessing = true

    // Sort queue by priority (higher number = higher priority)
    this.requestQueue.sort((a, b) => b.priority - a.priority)

    while (this.requestQueue.length > 0) {
      const { resolve, reject, request } = this.requestQueue.shift()!

      try {
        // Check rate limit
        const now = Date.now()
        const timeSinceLastRequest = now - this.lastRequestTime

        // Reset request count every minute
        if (timeSinceLastRequest > 60000) {
          this.requestCount = 0
        }

        // Check if we've exceeded requests per minute
        if (this.requestCount >= this.MAX_REQUESTS_PER_MINUTE) {
          console.log("Rate limit reached, waiting 60 seconds...")
          this.rateLimitedUntil = now + 60000
          setTimeout(() => this.processQueue(), 60000)
          break
        }

        // Wait minimum interval between requests
        if (timeSinceLastRequest < this.MIN_REQUEST_INTERVAL) {
          await new Promise((resolve) => setTimeout(resolve, this.MIN_REQUEST_INTERVAL - timeSinceLastRequest))
        }

        console.log(`Making API request (${this.requestCount + 1}/${this.MAX_REQUESTS_PER_MINUTE})`)
        const result = await request()

        this.lastRequestTime = Date.now()
        this.requestCount++
        resolve(result)

        // Wait between requests
        await new Promise((resolve) => setTimeout(resolve, 1000))
      } catch (error: any) {
        console.error("Queue request failed:", error)

        // Handle rate limiting
        if (error.message?.includes("Too many requests") || error.message?.includes("429")) {
          console.log("Rate limit detected, backing off for 2 minutes")
          this.rateLimitedUntil = Date.now() + 120000 // 2 minutes

          // Put request back in queue with lower priority
          this.requestQueue.unshift({ resolve, reject, request, priority: 0 })

          setTimeout(() => this.processQueue(), 120000)
          break
        }

        reject(error)
      }
    }

    this.isProcessing = false
  }

  private async queueRequest<T>(request: () => Promise<T>, priority = 1): Promise<T> {
    return new Promise((resolve, reject) => {
      this.requestQueue.push({ resolve, reject, request, priority })
      this.processQueue()
    })
  }

  private handleAuthError(error: any, cacheKey: string) {
    console.error("Authentication error:", error)
    this.authError = true

    // Intentar usar datos del cache como fallback
    const fallbackData = apiCache.get(cacheKey)
    if (fallbackData) {
      console.log(`Using cached data as fallback for ${cacheKey}`)
      return fallbackData
    }

    throw new Error(`Authentication failed. Please check your API key. Cache key: ${cacheKey}`)
  }

  async getTeams() {
    const cacheKey = "teams_all"

    try {
      // Verificar cache primero
      const cachedData = apiCache.get(cacheKey)
      if (cachedData) {
        console.log("Teams: Using cached data")
        return cachedData
      }

      if (this.authError || !this.api) {
        throw new Error("API client not initialized or authentication failed")
      }

      console.log("Teams: Fetching from API")
      const result = await this.queueRequest(async () => {
        return await this.api!.nba.getTeams()
      }, 3) // High priority

      if (result?.data && Array.isArray(result.data)) {
        apiCache.set(cacheKey, result, 60 * 60 * 1000) // Cache for 1 hour
        console.log(`Teams: Cached ${result.data.length} teams`)
      }

      return result
    } catch (error: any) {
      if (error.message?.includes("Unauthorized") || error.message?.includes("401")) {
        return this.handleAuthError(error, cacheKey)
      }

      console.error("Error in getTeams:", error)
      const fallbackData = apiCache.get(cacheKey)
      if (fallbackData) {
        console.log("Teams: Using fallback cache data")
        return fallbackData
      }

      // Return empty result instead of throwing
      return { data: [] }
    }
  }

  async getPlayers(params?: {
    search?: string
    team_ids?: number[]
    per_page?: number
    cursor?: number
  }) {
    const cacheKey = params?.search
      ? `players_search_${params.search.toLowerCase()}`
      : params?.team_ids?.length
        ? `players_team_${params.team_ids.join(",")}`
        : `players_default_${params?.per_page || 25}`

    try {
      // Verificar cache primero
      const cachedData = apiCache.get(cacheKey)
      if (cachedData) {
        console.log(`Players: Using cached data for ${cacheKey}`)
        return cachedData
      }

      if (this.authError || !this.api) {
        throw new Error("API client not initialized or authentication failed")
      }

      console.log(`Players: Fetching from API for ${cacheKey}`)
      const result = await this.queueRequest(
        async () => {
          const options: any = {}

          if (params?.search) options.search = params.search
          if (params?.team_ids && params.team_ids.length > 0) {
            options.team_ids = params.team_ids
          }
          if (params?.per_page) options.per_page = Math.min(params.per_page, 25) // Reduced limit
          if (params?.cursor) options.cursor = params.cursor

          return await this.api!.nba.getPlayers(options)
        },
        params?.search ? 2 : 1,
      ) // Higher priority for searches

      if (result?.data && Array.isArray(result.data)) {
        apiCache.set(cacheKey, result, 15 * 60 * 1000) // Cache for 15 minutes
        console.log(`Players: Cached ${result.data.length} players for ${cacheKey}`)
      }

      return result
    } catch (error: any) {
      if (error.message?.includes("Unauthorized") || error.message?.includes("401")) {
        return this.handleAuthError(error, cacheKey)
      }

      console.error("Error in getPlayers:", error)
      const fallbackData = apiCache.getWithFallback(cacheKey, ["players_default_25", "players_default_20"])
      if (fallbackData) {
        console.log(`Players: Using fallback cache data for ${cacheKey}`)
        return fallbackData
      }

      // Return empty result instead of throwing
      return { data: [] }
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
    const cacheKey = `games_${params?.seasons?.join(",") || "2024"}_${params?.team_ids?.join(",") || "all"}_${params?.dates?.join(",") || "recent"}`

    try {
      const cachedData = apiCache.get(cacheKey)
      if (cachedData) {
        console.log(`Games: Using cached data for ${cacheKey}`)
        return cachedData
      }

      if (this.authError || !this.api) {
        throw new Error("API client not initialized or authentication failed")
      }

      console.log(`Games: Fetching from API for ${cacheKey}`)
      const result = await this.queueRequest(async () => {
        const options: any = {}

        if (params?.seasons && params.seasons.length > 0) {
          options.seasons = params.seasons
        }
        if (params?.team_ids && params.team_ids.length > 0) {
          options.team_ids = params.team_ids
        }
        if (params?.dates && params.dates.length > 0) {
          options.dates = params.dates
        }
        if (params?.per_page) options.per_page = Math.min(params.per_page, 25) // Reduced limit
        if (params?.cursor) options.cursor = params.cursor
        if (params?.start_date) options.start_date = params.start_date
        if (params?.end_date) options.end_date = params.end_date

        return await this.api!.nba.getGames(options)
      }, 1)

      if (result?.data && Array.isArray(result.data)) {
        apiCache.set(cacheKey, result, 10 * 60 * 1000) // Cache for 10 minutes
        console.log(`Games: Cached ${result.data.length} games for ${cacheKey}`)
      }

      return result
    } catch (error: any) {
      if (error.message?.includes("Unauthorized") || error.message?.includes("401")) {
        return this.handleAuthError(error, cacheKey)
      }

      console.error("Error in getGames:", error)
      const fallbackData = apiCache.get(cacheKey)
      if (fallbackData) {
        console.log(`Games: Using fallback cache data for ${cacheKey}`)
        return fallbackData
      }

      return { data: [] }
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
    const cacheKey = `stats_${params?.player_ids?.join(",") || "all"}_${params?.seasons?.join(",") || "2024"}`

    try {
      const cachedData = apiCache.get(cacheKey)
      if (cachedData) {
        console.log(`Stats: Using cached data for ${cacheKey}`)
        return cachedData
      }

      if (this.authError || !this.api) {
        throw new Error("API client not initialized or authentication failed")
      }

      console.log(`Stats: Fetching from API for ${cacheKey}`)
      const result = await this.queueRequest(async () => {
        const options: any = {}

        if (params?.seasons && params.seasons.length > 0) {
          options.seasons = params.seasons
        }
        if (params?.player_ids && params.player_ids.length > 0) {
          options.player_ids = params.player_ids
        }
        if (params?.game_ids && params.game_ids.length > 0) {
          options.game_ids = params.game_ids
        }
        if (params?.dates && params.dates.length > 0) {
          options.dates = params.dates
        }
        if (params?.per_page) options.per_page = Math.min(params.per_page, 25) // Reduced limit
        if (params?.cursor) options.cursor = params.cursor

        return await this.api!.nba.getStats(options)
      }, 2) // Higher priority for stats

      if (result?.data && Array.isArray(result.data)) {
        apiCache.set(cacheKey, result, 15 * 60 * 1000) // Cache for 15 minutes
        console.log(`Stats: Cached ${result.data.length} stats for ${cacheKey}`)
      }

      return result
    } catch (error: any) {
      if (error.message?.includes("Unauthorized") || error.message?.includes("401")) {
        return this.handleAuthError(error, cacheKey)
      }

      console.error("Error in getStats:", error)
      const fallbackData = apiCache.get(cacheKey)
      if (fallbackData) {
        console.log(`Stats: Using fallback cache data for ${cacheKey}`)
        return fallbackData
      }

      return { data: [] }
    }
  }

  async getSeasonAverages(params: {
    season: number
    player_ids?: number[]
  }) {
    const cacheKey = `season_averages_${params.season}_${params.player_ids?.join(",") || "all"}`

    try {
      const cachedData = apiCache.get(cacheKey)
      if (cachedData) {
        console.log(`Season Averages: Using cached data for ${cacheKey}`)
        return cachedData
      }

      if (this.authError || !this.api) {
        throw new Error("API client not initialized or authentication failed")
      }

      console.log(`Season Averages: Fetching from API for ${cacheKey}`)
      const result = await this.queueRequest(async () => {
        const options: any = {
          season: params.season,
        }

        if (params.player_ids && params.player_ids.length > 0) {
          options.player_ids = params.player_ids
        }

        return await this.api!.nba.getSeasonAverages(options)
      }, 2) // Higher priority

      if (result?.data && Array.isArray(result.data)) {
        apiCache.set(cacheKey, result, 30 * 60 * 1000) // Cache for 30 minutes
        console.log(`Season Averages: Cached ${result.data.length} averages for ${cacheKey}`)
      }

      return result
    } catch (error: any) {
      if (error.message?.includes("Unauthorized") || error.message?.includes("401")) {
        return this.handleAuthError(error, cacheKey)
      }

      console.error("Error in getSeasonAverages:", error)
      const fallbackData = apiCache.get(cacheKey)
      if (fallbackData) {
        console.log(`Season Averages: Using fallback cache data for ${cacheKey}`)
        return fallbackData
      }

      return { data: [] }
    }
  }

  async testConnection() {
    try {
      console.log("Testing API connection...")
      console.log("API Key being used:", API_KEY.substring(0, 8) + "...")
      console.log("Auth error status:", this.authError)

      if (this.authError || !this.api) {
        throw new Error("API client not initialized properly")
      }

      const response = await this.getTeams()
      console.log("API connection successful:", response)
      return true
    } catch (error) {
      console.error("API connection failed:", error)
      return false
    }
  }

  getCacheStats() {
    return {
      ...apiCache.getStats(),
      rateLimitedUntil: this.rateLimitedUntil,
      requestCount: this.requestCount,
      queueLength: this.requestQueue.length,
      isRateLimited: Date.now() < this.rateLimitedUntil,
    }
  }

  isAuthError() {
    return this.authError
  }

  getApiKeyInfo() {
    return {
      key: API_KEY.substring(0, 8) + "...",
      source: process.env.NBA_API_KEY ? "environment" : "hardcoded",
      authError: this.authError,
      rateLimited: Date.now() < this.rateLimitedUntil,
      requestsThisMinute: this.requestCount,
    }
  }
}

export const nbaApi = new NBAApiClient()
