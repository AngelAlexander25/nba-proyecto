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

  get<T>(key: string): T | null {
    // Primero verificar cache en memoria
    const memoryItem = this.cache.get(key)
    if (memoryItem && Date.now() < memoryItem.expiry) {
      return memoryItem.data
    }

    // Si no está en memoria, verificar localStorage
    try {
      const stored = localStorage.getItem(`nba_cache_${key}`)
      if (stored) {
        const item: CacheItem<T> = JSON.parse(stored)
        if (Date.now() < item.expiry) {
          // Restaurar a memoria también
          this.cache.set(key, item)
          return item.data
        } else {
          // Limpiar datos expirados
          localStorage.removeItem(`nba_cache_${key}`)
        }
      }
    } catch (error) {
      console.warn("Could not read from localStorage:", error)
    }

    return null
  }

  has(key: string): boolean {
    return this.get(key) !== null
  }

  clear(key?: string): void {
    if (key) {
      this.cache.delete(key)
      try {
        localStorage.removeItem(`nba_cache_${key}`)
      } catch (error) {
        console.warn("Could not remove from localStorage:", error)
      }
    } else {
      this.cache.clear()
      try {
        // Limpiar todas las claves de NBA del localStorage
        const keys = Object.keys(localStorage).filter((k) => k.startsWith("nba_cache_"))
        keys.forEach((k) => localStorage.removeItem(k))
      } catch (error) {
        console.warn("Could not clear localStorage:", error)
      }
    }
  }

  // Método para obtener estadísticas del cache
  getStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    }
  }
}

export const dataCache = new DataCache()
