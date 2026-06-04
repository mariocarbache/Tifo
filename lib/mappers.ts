import type { ApiFootballTeam, ApiFootballFixture, ApiFootballStanding } from '@/types/api-football'
import type { Team, Match, StandingRow } from '@/types/football'

export function mapTeam(raw: ApiFootballTeam): Team {
  return {
    apiId: String(raw.team.id),
    name: raw.team.name,
    country: raw.team.country,
    logoUrl: raw.team.logo,
    leagueId: '',
    leagueName: '',
  }
}

export function mapFixture(raw: ApiFootballFixture): Match {
  const statusMap: Record<string, Match['status']> = {
    'NS': 'scheduled',
    '1H': 'live',
    'HT': 'live',
    '2H': 'live',
    'FT': 'finished',
    'AET': 'finished',
    'PEN': 'finished',
  }

  return {
    fixtureId: String(raw.fixture.id),
    date: raw.fixture.date,
    status: statusMap[raw.fixture.status.short] ?? 'scheduled',
    homeTeam: {
      apiId: String(raw.teams.home.id),
      name: raw.teams.home.name,
      logoUrl: raw.teams.home.logo,
    },
    awayTeam: {
      apiId: String(raw.teams.away.id),
      name: raw.teams.away.name,
      logoUrl: raw.teams.away.logo,
    },
    score: {
      home: raw.goals.home,
      away: raw.goals.away,
    },
    leagueName: raw.league.name,
    leagueLogoUrl: raw.league.logo,
  }
}

export function mapStandingRow(raw: ApiFootballStanding): StandingRow {
  return {
    position: raw.rank,
    team: {
      apiId: String(raw.team.id),
      name: raw.team.name,
      logoUrl: raw.team.logo,
    },
    played: raw.all.played,
    won: raw.all.win,
    drawn: raw.all.draw,
    lost: raw.all.lose,
    goalsFor: raw.all.goals.for,
    goalsAgainst: raw.all.goals.against,
    points: raw.points,
    form: raw.form,
  }
}