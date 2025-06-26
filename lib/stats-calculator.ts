// Calculadora de estadísticas reales basada en datos de la API
import type { Game, GameStats, Team, Player } from "@/types/nba"

export interface CalculatedTeamStats {
  team: Team
  games_played: number
  wins: number
  losses: number
  win_percentage: number
  points_per_game: number
  points_allowed_per_game: number
  rebounds_per_game: number
  assists_per_game: number
  steals_per_game: number
  blocks_per_game: number
  turnovers_per_game: number
  field_goal_percentage: number
  three_point_percentage: number
  free_throw_percentage: number
  home_wins: number
  home_losses: number
  away_wins: number
  away_losses: number
  last_10_record: string
  current_streak: string
  point_differential: number
}

export interface CalculatedPlayerStats {
  player: Player
  games_played: number
  minutes_per_game: number
  points_per_game: number
  rebounds_per_game: number
  assists_per_game: number
  steals_per_game: number
  blocks_per_game: number
  turnovers_per_game: number
  field_goal_percentage: number
  three_point_percentage: number
  free_throw_percentage: number
  field_goals_made: number
  field_goals_attempted: number
  three_pointers_made: number
  three_pointers_attempted: number
  free_throws_made: number
  free_throws_attempted: number
}

export class StatsCalculator {
  static calculateTeamStats(team: Team, games: Game[], teamStats?: GameStats[]): CalculatedTeamStats {
    const teamGames = games.filter((game) => game.home_team.id === team.id || game.visitor_team.id === team.id)

    let wins = 0
    let losses = 0
    let homeWins = 0
    let homeLosses = 0
    let awayWins = 0
    let awayLosses = 0
    let totalPointsFor = 0
    let totalPointsAgainst = 0

    // Calcular record básico
    teamGames.forEach((game) => {
      const isHome = game.home_team.id === team.id
      const teamScore = isHome ? game.home_team_score : game.visitor_team_score
      const opponentScore = isHome ? game.visitor_team_score : game.home_team_score

      totalPointsFor += teamScore
      totalPointsAgainst += opponentScore

      if (teamScore > opponentScore) {
        wins++
        if (isHome) homeWins++
        else awayWins++
      } else {
        losses++
        if (isHome) homeLosses++
        else awayLosses++
      }
    })

    // Calcular últimos 10 juegos
    const last10Games = teamGames.slice(-10)
    let last10Wins = 0
    last10Games.forEach((game) => {
      const isHome = game.home_team.id === team.id
      const teamScore = isHome ? game.home_team_score : game.visitor_team_score
      const opponentScore = isHome ? game.visitor_team_score : game.home_team_score
      if (teamScore > opponentScore) last10Wins++
    })

    // Calcular racha actual
    let currentStreak = 0
    let streakType = ""
    if (teamGames.length > 0) {
      const lastGame = teamGames[teamGames.length - 1]
      const isHome = lastGame.home_team.id === team.id
      const teamScore = isHome ? lastGame.home_team_score : lastGame.visitor_team_score
      const opponentScore = isHome ? lastGame.visitor_team_score : lastGame.home_team_score
      const lastGameWon = teamScore > opponentScore

      streakType = lastGameWon ? "W" : "L"
      currentStreak = 1

      // Contar hacia atrás para encontrar la racha
      for (let i = teamGames.length - 2; i >= 0; i--) {
        const game = teamGames[i]
        const isHomeGame = game.home_team.id === team.id
        const score = isHomeGame ? game.home_team_score : game.visitor_team_score
        const oppScore = isHomeGame ? game.visitor_team_score : game.home_team_score
        const won = score > oppScore

        if ((lastGameWon && won) || (!lastGameWon && !won)) {
          currentStreak++
        } else {
          break
        }
      }
    }

    const gamesPlayed = teamGames.length
    const winPercentage = gamesPlayed > 0 ? wins / gamesPlayed : 0
    const pointsPerGame = gamesPlayed > 0 ? totalPointsFor / gamesPlayed : 0
    const pointsAllowedPerGame = gamesPlayed > 0 ? totalPointsAgainst / gamesPlayed : 0

    return {
      team,
      games_played: gamesPlayed,
      wins,
      losses,
      win_percentage: winPercentage,
      points_per_game: pointsPerGame,
      points_allowed_per_game: pointsAllowedPerGame,
      rebounds_per_game: 0, // Requiere datos de stats individuales
      assists_per_game: 0,
      steals_per_game: 0,
      blocks_per_game: 0,
      turnovers_per_game: 0,
      field_goal_percentage: 0,
      three_point_percentage: 0,
      free_throw_percentage: 0,
      home_wins: homeWins,
      home_losses: homeLosses,
      away_wins: awayWins,
      away_losses: awayLosses,
      last_10_record: `${last10Wins}-${last10Games.length - last10Wins}`,
      current_streak: `${streakType}${currentStreak}`,
      point_differential: pointsPerGame - pointsAllowedPerGame,
    }
  }

  static calculatePlayerStats(player: Player, stats: GameStats[]): CalculatedPlayerStats {
    const playerStats = stats.filter((stat) => stat.player.id === player.id)

    if (playerStats.length === 0) {
      return {
        player,
        games_played: 0,
        minutes_per_game: 0,
        points_per_game: 0,
        rebounds_per_game: 0,
        assists_per_game: 0,
        steals_per_game: 0,
        blocks_per_game: 0,
        turnovers_per_game: 0,
        field_goal_percentage: 0,
        three_point_percentage: 0,
        free_throw_percentage: 0,
        field_goals_made: 0,
        field_goals_attempted: 0,
        three_pointers_made: 0,
        three_pointers_attempted: 0,
        free_throws_made: 0,
        free_throws_attempted: 0,
      }
    }

    const totals = playerStats.reduce(
      (acc, stat) => ({
        minutes: acc.minutes + this.parseMinutes(stat.min),
        points: acc.points + stat.pts,
        rebounds: acc.rebounds + stat.reb,
        assists: acc.assists + stat.ast,
        steals: acc.steals + stat.stl,
        blocks: acc.blocks + stat.blk,
        turnovers: acc.turnovers + stat.turnover,
        fgm: acc.fgm + stat.fgm,
        fga: acc.fga + stat.fga,
        fg3m: acc.fg3m + stat.fg3m,
        fg3a: acc.fg3a + stat.fg3a,
        ftm: acc.ftm + stat.ftm,
        fta: acc.fta + stat.fta,
      }),
      {
        minutes: 0,
        points: 0,
        rebounds: 0,
        assists: 0,
        steals: 0,
        blocks: 0,
        turnovers: 0,
        fgm: 0,
        fga: 0,
        fg3m: 0,
        fg3a: 0,
        ftm: 0,
        fta: 0,
      },
    )

    const gamesPlayed = playerStats.length

    return {
      player,
      games_played: gamesPlayed,
      minutes_per_game: totals.minutes / gamesPlayed,
      points_per_game: totals.points / gamesPlayed,
      rebounds_per_game: totals.rebounds / gamesPlayed,
      assists_per_game: totals.assists / gamesPlayed,
      steals_per_game: totals.steals / gamesPlayed,
      blocks_per_game: totals.blocks / gamesPlayed,
      turnovers_per_game: totals.turnovers / gamesPlayed,
      field_goal_percentage: totals.fga > 0 ? totals.fgm / totals.fga : 0,
      three_point_percentage: totals.fg3a > 0 ? totals.fg3m / totals.fg3a : 0,
      free_throw_percentage: totals.fta > 0 ? totals.ftm / totals.fta : 0,
      field_goals_made: totals.fgm,
      field_goals_attempted: totals.fga,
      three_pointers_made: totals.fg3m,
      three_pointers_attempted: totals.fg3a,
      free_throws_made: totals.ftm,
      free_throws_attempted: totals.fta,
    }
  }

  private static parseMinutes(minString: string): number {
    if (!minString) return 0
    const parts = minString.split(":")
    if (parts.length !== 2) return 0
    return Number.parseInt(parts[0]) + Number.parseInt(parts[1]) / 60
  }
}
