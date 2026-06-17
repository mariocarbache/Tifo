import { NextRequest, NextResponse } from 'next/server'
import { mapTeam } from '@/lib/mappers'
import type { ApiFootballTeam } from '@/types/api-football'

export async function GET(request: NextRequest) {
  // 1. Read the search query from the URL
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get('q')

  // 2. Validate — don't call the API if there's no search term
  if (!query || query.trim().length < 2) {
    return NextResponse.json(
      { error: 'Search query must be at least 2 characters' },
      { status: 400 }
    )
  }

  // 3. Call API-Football
  const apiKey = process.env.API_FOOTBALL_KEY
  const response = await fetch(
    `https://v3.football.api-sports.io/teams?search=${encodeURIComponent(query)}`,
    {
      headers: {
        'x-apisports-key': apiKey as string,
      },
    }
  )

  // 4. Handle API errors
  if (!response.ok) {
    return NextResponse.json(
      { error: 'Failed to fetch teams from API' },
      { status: 502 }
    )
  }

  // 5. Parse, normalize, and return
  const data = await response.json()
  const rawTeams: ApiFootballTeam[] = data.response
  const teams = rawTeams.map(mapTeam)

  return NextResponse.json({ teams })
}