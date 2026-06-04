// What API-Football actually returns for a team search
export interface ApiFootballTeam {
  team: {
    id: number
    name: string
    country: string
    logo: string
  }
  venue: {
    name: string
    city: string
  }
}

// What API-Football returns for a fixture
export interface ApiFootballFixture {
  fixture: {
    id: number
    date: string
    status: {
      short: string
    }
  }
  league: {
    id: number
    name: string
    logo: string
  }
  teams: {
    home: {
      id: number
      name: string
      logo: string
    }
    away: {
      id: number
      name: string
      logo: string
    }
  }
  goals: {
    home: number | null
    away: number | null
  }
}

// What API-Football returns for standings
export interface ApiFootballStanding {
  rank: number
  team: {
    id: number
    name: string
    logo: string
  }
  all: {
    played: number
    win: number
    draw: number
    lose: number
    goals: {
      for: number
      against: number
    }
  }
  points: number
  form: string | null
}