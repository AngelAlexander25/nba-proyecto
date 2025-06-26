// Sistema de cache persistente para datos NBA
interface CacheItem<T> {
  data: T
  timestamp: number
  expiry: number
}

class DataCache {
  private cache = new Map<string, CacheItem<any>>()
  private readonly DEFAULT_EXPIRY = 5 * 60 * 1000 // 5 minutos

  set<T>(key: string, data: T, expiryMs?: number): void {
    const expiry = expiryMs || this.DEFAULT_EXPIRY
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      expiry: Date.now() + expiry,
    })

    // También guardar en localStorage para persistencia entre sesiones
    try {
      const cacheData = {
        data,
        timestamp: Date.now(),
        expiry: Date.now() + expiry,
      }
      localStorage.setItem(`nba_cache_${key}`, JSON.stringify(cacheData))
    } catch (error) {
      console.warn("Could not save to localStorage:", error)
    }
  }
