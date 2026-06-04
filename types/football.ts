export interface Team {
    apiId: string
    name: string
    country: string
    logoUrl: string
    leagueId: string
    leagueName: string
}

export interface Match {
    fixtureId: string
    date: string
    status: 'scheduled' | 'live' | 'finished'
    homeTeam: {
        apiId: string
        name: string
        logoUrl: string
    }
    awayTeam: {
        apiId: string
        name: string
        logoUrl: string
    }
    score: {
        home: number | null
        away: number | null
    }
    leagueName: string
    leagueLogoUrl: string
}

export interface StandingRow {
    position: number
    team: {
    apiId: string
    name: string
    logoUrl: string
    }
    played: number
    won: number
    drawn: number
    lost: number
    goalsFor: number
    goalsAgainst: number
    points: number
    form: string | null
}