import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Image from 'next/image'

export default async function DashboardPage() {
  const { userId: clerkId } = await auth()

  if (!clerkId) {
    redirect('/login')
  }

  const user = await prisma.user.findUnique({
    where: { clerkId },
    include: {
      teamFollows: {
        include: { team: true },
      },
    },
  })

  if (!user || user.teamFollows.length === 0) {
    redirect('/onboarding')
  }

  const teams = user.teamFollows.map((f) => f.team)

  return (
    <div>
      {/* Page header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Your Dashboard</h1>
        <p className="text-sm text-gray-500">
          Following {teams.length} team{teams.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Followed teams strip */}
      <div className="flex gap-3 mb-8 flex-wrap">
        {teams.map((team) => (
          <div
            key={team.apiId}
            className="flex items-center gap-2 bg-white border border-gray-200 rounded-full px-3 py-1.5"
          >
            {team.logoUrl && (
              <Image
                src={team.logoUrl}
                alt={team.name}
                width={20}
                height={20}
                className="object-contain"
              />
            )}
            <span className="text-sm font-medium text-gray-700">{team.name}</span>
          </div>
        ))}
      </div>

      {/* Widget grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Scores widget — Session 13 */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="font-semibold text-gray-900 mb-4">Recent Scores</h2>
          <p className="text-sm text-gray-400">Coming in Session 13</p>
        </div>

        {/* Fixtures widget — Session 14 */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="font-semibold text-gray-900 mb-4">Upcoming Fixtures</h2>
          <p className="text-sm text-gray-400">Coming in Session 14</p>
        </div>

        {/* Standings widget — Session 15 */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 md:col-span-2">
          <h2 className="font-semibold text-gray-900 mb-4">League Standings</h2>
          <p className="text-sm text-gray-400">Coming in Session 15</p>
        </div>
      </div>
    </div>
  )
}