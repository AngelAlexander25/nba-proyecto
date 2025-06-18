// Tipos principales para la aplicación NBA
export interface Team {
  id: number
  name: string
  full_name: string
  abbreviation: string
  city: string
  conference: string
  division: string
}

export interface Player {
  id: number
  first_name: string
  last_name: string
  position: string
  height: string
  weight: string
  jersey_number: string
  college: string
  country: string
  draft_year: number
  draft_round: number
  draft_number: number
  team: Team
}

export interface Game {
  id: number
  date: string
  season: number
  status: string
  period: number
  time: string
  postseason: boolean
  home_team: Team
  visitor_team: Team
  home_team_score: number
  visitor_team_score: number
}

export interface GameStats {
  id: number
  ast: number
  blk: number
  dreb: number
  fg3_pct: number
  fg3a: number
  fg3m: number
  fg_pct: number
  fga: number
  fgm: number
  ft_pct: number
  fta: number
  ftm: number
  game: Game
  min: string
  oreb: number
  pf: number
  player: Player
  pts: number
  reb: number
  stl: number
  team: Team
  turnover: number
}

export interface SeasonAverages {
  games_played: number
  player_id: number
  season: number
  min: string
  fgm: number
  fga: number
  fg3m: number
  fg3a: number
  ftm: number
  fta: number
  oreb: number
  dreb: number
  reb: number
  ast: number
  stl: number
  blk: number
  turnover: number
  pf: number
  pts: number
  fg_pct: number
  fg3_pct: number
  ft_pct: number
}

export interface TeamStats {
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
}
