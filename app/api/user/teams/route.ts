import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'


// GET /api/user/teams — fetch the logged-in user's followed teams
export async function GET() {
  // 1. Get the logged-in user's Clerk ID
  const { userId: clerkId } = await auth()

  if (!clerkId) {
    return NextResponse.json(
      { error: 'You must be logged in' },
      { status: 401 }
    )
  }

  // 2. Find that user in our database
  const user = await prisma.user.findUnique({
    where: { clerkId },
    include: {
      teamFollows: {
        include: {
          team: true,
        },
      },
    },
  })

  if (!user) {
    return NextResponse.json({ teams: [] })
  }

  // 3. Return just the team data in a clean shape
  const teams = user.teamFollows.map(
  (follow: { team: { id: string; apiId: string; name: string; country: string; logoUrl: string; leagueId: string; leagueName: string; createdAt: Date } }) => follow.team
  )
  return NextResponse.json({ teams })
}

// POST /api/user/teams — save a team to the logged-in user's favourites
export async function POST(request: NextRequest) {
  // 1. Get the logged-in user's Clerk ID
  const { userId: clerkId } = await auth()

  if (!clerkId) {
    return NextResponse.json(
      { error: 'You must be logged in' },
      { status: 401 }
    )
  }

  // 2. Read the team data from the request body
  const body = await request.json()
  const { apiId, name, country, logoUrl, leagueId, leagueName } = body

  if (!apiId || !name) {
    return NextResponse.json(
      { error: 'apiId and name are required' },
      { status: 400 }
    )
  }

  // 3. Find or create the user in our database
  // "upsert" means: update if exists, insert if not
  const user = await prisma.user.upsert({
    where: { clerkId },
    update: {},
    create: {
      clerkId,
      email: '',
    },
  })

  // 4. Find or create the team in our database
  const team = await prisma.team.upsert({
    where: { apiId },
    update: { name, country, logoUrl, leagueId, leagueName },
    create: { apiId, name, country, logoUrl: logoUrl ?? '', leagueId: leagueId ?? '', leagueName: leagueName ?? '' },
  })

  // 5. Create the follow relationship (ignore if it already exists)
  await prisma.teamFollow.upsert({
    where: {
      userId_teamId: {
        userId: user.id,
        teamId: team.id,
      },
    },
    update: {},
    create: {
      userId: user.id,
      teamId: team.id,
    },
  })

  return NextResponse.json({ success: true, team })
}

// DELETE /api/user/teams — remove a team from the logged-in user's favourites
export async function DELETE(request: NextRequest) {
  const { userId: clerkId } = await auth()

  if (!clerkId) {
    return NextResponse.json(
      { error: 'You must be logged in' },
      { status: 401 }
    )
  }

  const body = await request.json()
  const { apiId } = body

  if (!apiId) {
    return NextResponse.json(
      { error: 'apiId is required' },
      { status: 400 }
    )
  }

  // Find the user and team
  const user = await prisma.user.findUnique({ where: { clerkId } })
  const team = await prisma.team.findUnique({ where: { apiId } })

  if (!user || !team) {
    return NextResponse.json(
      { error: 'User or team not found' },
      { status: 404 }
    )
  }

  // Delete the follow relationship
  await prisma.teamFollow.deleteMany({
    where: {
      userId: user.id,
      teamId: team.id,
    },
  })

  return NextResponse.json({ success: true })
}