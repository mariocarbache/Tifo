import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'

export default async function DashboardPage() {
  const { userId: clerkId } = await auth()

  if (!clerkId) {
    redirect('/login')
  }

  // Find the user and their followed teams directly from the database
  const user = await prisma.user.findUnique({
    where: { clerkId },
    include: {
      teamFollows: {
        include: { team: true },
      },
    },
  })

  // No user record or no followed teams → send to onboarding
  if (!user || user.teamFollows.length === 0) {
    redirect('/onboarding')
  }

  const teams = user.teamFollows.map((f) => f.team)

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Your Dashboard</h1>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {teams.map((team) => (
          <div key={team.apiId} className="p-4 border border-gray-200 rounded-lg">
            <p className="font-medium text-sm">{team.name}</p>
            <p className="text-xs text-gray-500">{team.leagueName}</p>
          </div>
        ))}
      </div>
    </main>
  )
}
