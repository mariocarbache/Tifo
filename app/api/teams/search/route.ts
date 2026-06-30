import { NextRequest, NextResponse } from 'next/server'
import { mapTeam } from '@/lib/mappers'
import type { ApiFootballTeam } from '@/types/api-football'
import { redis } from '@/lib/redis'
import { Team } from '@/types/football'

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
  //3. Build a cache key — a unique string identifying this specific request
  const cacheKey = `teams:search:${query.toLowerCase().trim()}`

  // 4. Check Redis first
  const cached = await redis.get<Team[]>(cacheKey)
  if (cached) {
    console.log(`[CACHE HIT] ${cacheKey}`)
    return NextResponse.json({ teams: cached, source: 'cache' })
  }
  console.log(`[CACHE MISS] ${cacheKey} — calling API`)

  // 5. Call API-Football
  const apiKey = process.env.API_FOOTBALL_KEY
  const response = await fetch(
    `https://v3.football.api-sports.io/teams?search=${encodeURIComponent(query)}`,
    {
      headers: {
        'x-apisports-key': apiKey as string,
      },
    }
  )

  // 6. Handle API errors
  if (!response.ok) {
    return NextResponse.json(
      { error: 'Failed to fetch teams from API' },
      { status: 502 }
    )
  }

  // 6. Parse, normalize, and return
  const data = await response.json()
  const rawTeams: ApiFootballTeam[] = data.response
  const teams = rawTeams.map(mapTeam)

  // 7. Store in Redis with a 1 hour TTL (3600 seconds)
  await redis.set(cacheKey, teams, { ex: 3600 })
  console.log(`[CACHE SET] ${cacheKey} — expires in 1 hour`)

  return NextResponse.json({ teams, source: 'api' })
}