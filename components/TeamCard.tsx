'use client'

import Image from 'next/image'
import type { Team } from '@/types/football'

interface TeamCardProps {
  team: Team
  isSelected: boolean
  onToggle: (team: Team) => void
}

export default function TeamCard({ team, isSelected, onToggle }: TeamCardProps) {
  return (
    <button
      onClick={() => onToggle(team)}
      className={`flex items-center gap-3 w-full p-3 rounded-lg border transition-all ${
        isSelected
          ? 'border-blue-500 bg-blue-50'
          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
      }`}
    >
      {team.logoUrl && (
        <Image
          src={team.logoUrl}
          alt={`${team.name} logo`}
          width={32}
          height={32}
          className="object-contain"
        />
      )}
      <div className="text-left">
        <p className="font-medium text-sm text-gray-900">{team.name}</p>
        <p className="text-xs text-gray-500">{team.country}</p>
      </div>
      {isSelected && (
        <span className="ml-auto text-blue-500 text-sm font-medium">✓</span>
      )}
    </button>
  )
}