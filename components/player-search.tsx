"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Loader2, X, User } from "lucide-react"
import { usePlayers } from "@/hooks/usa-nba-data"
import type { Player } from "@/types/nba"

interface PlayerSearchProps {
  onPlayerSelect: (player: Player) => void
}

export function PlayerSearch({ onPlayerSelect }: PlayerSearchProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const searchRef = useRef<HTMLDivElement>(null)

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm)
    }, 300)

    return () => clearTimeout(timer)
  }, [searchTerm])

  const { players, loading, error, isRateLimited, refetch } = usePlayers({
    search: debouncedSearch || undefined,
    per_page: 10,
  })

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleSearch = (value: string) => {
    setSearchTerm(value)
    setIsOpen(value.length > 0)

    if (value.length > 2) {
      refetch({ search: value, per_page: 10, reset: true })
    }
  }

  const handlePlayerSelect = (player: Player) => {
    onPlayerSelect(player)
    setSearchTerm("")
    setIsOpen(false)
  }

  const clearSearch = () => {
    setSearchTerm("")
    setIsOpen(false)
  }

  return (
    <div ref={searchRef} className="relative w-64">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          type="text"
          placeholder="Buscar jugador..."
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          className="pl-10 pr-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-white/40"
        />
        {searchTerm && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearSearch}
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-white/10"
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>

      {/* Dropdown Results */}
      {isOpen && (
        <Card className="absolute top-full left-0 right-0 mt-2 bg-slate-800 border-slate-700 shadow-xl z-50 max-h-80 overflow-y-auto">
          <CardContent className="p-2">
            {loading && (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="h-4 w-4 animate-spin text-gray-400 mr-2" />
                <span className="text-sm text-gray-400">Buscando jugadores...</span>
              </div>
            )}

            {error && !loading && (
              <div className="py-4 text-center">
                <p className="text-sm text-red-400 mb-2">{error}</p>
                {isRateLimited ? (
                  <Badge variant="destructive" className="text-xs">
                    Límite de búsquedas alcanzado
                  </Badge>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => refetch({ search: debouncedSearch, per_page: 10, reset: true })}
                    className="text-xs"
                  >
                    Reintentar
                  </Button>
                )}
              </div>
            )}

            {!loading && !error && searchTerm.length > 0 && players.length === 0 && (
              <div className="py-4 text-center">
                <User className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-400">No se encontraron jugadores</p>
                <p className="text-xs text-gray-500">Intenta con otro nombre</p>
              </div>
            )}

            {!loading && players.length > 0 && (
              <div className="space-y-1">
                {players.map((player) => (
                  <Button
                    key={player.id}
                    variant="ghost"
                    className="w-full justify-start p-3 h-auto hover:bg-white/10"
                    onClick={() => handlePlayerSelect(player)}
                  >
                    <div className="flex items-center gap-3 w-full">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-bold text-xs">
                          {player.first_name[0]}
                          {player.last_name[0]}
                        </span>
                      </div>
                      <div className="flex-1 text-left">
                        <div className="font-medium text-white text-sm">
                          {player.first_name} {player.last_name}
                        </div>
                        <div className="text-xs text-gray-400">
                          {player.team?.abbreviation} • #{player.jersey_number} • {player.position}
                        </div>
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            )}

            {searchTerm.length > 0 && searchTerm.length <= 2 && (
              <div className="py-4 text-center">
                <p className="text-sm text-gray-400">Escribe al menos 3 caracteres para buscar</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
