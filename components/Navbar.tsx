import Link from 'next/link'
import { UserButton } from '@clerk/nextjs'

export default function Navbar() {
  return (
    <nav className="border-b border-gray-200 bg-white">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/dashboard" className="font-bold text-lg tracking-tight">
          Tifo
        </Link>
        <div className="flex items-center gap-4">
          <Link
            href="/onboarding"
            className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
          >
            Edit teams
          </Link>
          <UserButton />
        </div>
      </div>
    </nav>
  )
}