interface CacheItem<T> {
  data: T
  timestamp: number
  expiresIn: number
}

class SimpleCache {
  private cache = new Map<string, CacheItem<any>>()
  private readonly DEFAULT_TTL = 10 * 60 * 1000 // 10 minutos para datos de jugadores
  private readonly LONG_TTL = 30 * 60 * 1000 // 30 minutos para datos que cambian poco

  set<T>(key: string, data: T, ttl: number = this.DEFAULT_TTL): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      expiresIn: ttl,
    })
    console.log(`Cache SET: ${key} (TTL: ${ttl}ms)`)
  }

  get<T>(key: string): T | null {
    const item = this.cache.get(key)

    if (!item) {
      console.log(`Cache MISS: ${key}`)
      return null
    }

    const now = Date.now()
    if (now - item.timestamp > item.expiresIn) {
      this.cache.delete(key)
      console.log(`Cache EXPIRED: ${key}`)
      return null
    }

    console.log(`Cache HIT: ${key}`)
    return item.data as T
  }

  has(key: string): boolean {
    const item = this.cache.get(key)
    if (!item) return false

    const now = Date.now()
    if (now - item.timestamp > item.expiresIn) {
      this.cache.delete(key)
      return false
    }

    return true
  }

  // Método para obtener datos con diferentes estrategias de cache
  getWithFallback<T>(primaryKey: string, fallbackKeys: string[] = []): T | null {
    // Intentar con la clave principal
    let data = this.get<T>(primaryKey)
    if (data) return data

    // Intentar con claves de fallback
    for (const fallbackKey of fallbackKeys) {
      data = this.get<T>(fallbackKey)
      if (data) {
        console.log(`Cache FALLBACK HIT: ${fallbackKey} for ${primaryKey}`)
        return data
      }
    }

    return null
  }

  // Método para precargar datos relacionados
  preload<T>(key: string, data: T, ttl?: number): void {
    if (!this.has(key)) {
      this.set(key, data, ttl)
    }
  }

  clear(): void {
    this.cache.clear()
    console.log("Cache CLEARED")
  }

  delete(key: string): void {
    this.cache.delete(key)
    console.log(`Cache DELETE: ${key}`)
  }

  // Obtener estadísticas del cache
  getStats() {
    const now = Date.now()
    let valid = 0
    let expired = 0

    this.cache.forEach((item) => {
      if (now - item.timestamp > item.expiresIn) {
        expired++
      } else {
        valid++
      }
    })

    return { total: this.cache.size, valid, expired }
  }
}

export const apiCache = new SimpleCache()
