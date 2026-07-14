'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useDebounce } from 'use-debounce'
import TeamCard from '@/components/TeamCard'
import type { Team } from '@/types/football'

export default function OnboardingPage() {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [debouncedQuery] = useDebounce(query, 400)
  const [results, setResults] = useState<Team[]>([])
  const [selectedTeams, setSelectedTeams] = useState<Team[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Run a search whenever the debounced query changes
  useEffect(() => {
    if (debouncedQuery.length < 2) {
      setResults([])
      return
    }

    const searchTeams = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const response = await fetch(
          `/api/teams/search?q=${encodeURIComponent(debouncedQuery)}`
        )
        const data = await response.json()
        setResults(data.teams ?? [])
      } catch (err) {
        setError('Something went wrong. Please try again.')
      } finally {
        setIsLoading(false)
      }
    }

    searchTeams()
  }, [debouncedQuery])

  const handleToggleTeam = (team: Team) => {
    setSelectedTeams((prev) => {
      const isAlreadySelected = prev.some((t) => t.apiId === team.apiId)
      if (isAlreadySelected) {
        return prev.filter((t) => t.apiId !== team.apiId)
      }
      return [...prev, team]
    })
  }

  //save all selected teams then redirect
  const handleSave = async () => {
    if (selectedTeams.length === 0) return
    setIsSaving(true)
    setError(null)

    try {
      // Save each team one at a time using your POST endpoint
      await Promise.all(
        selectedTeams.map((team) =>
          fetch('/api/user/teams', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(team),
          })
        )
      )
      // All saved — go to dashboard
      router.push('/dashboard')
    } catch (err) {
      setError('Failed to save your teams. Please try again.')
      setIsSaving(false)
    }
  }

  return (
    <main className="max-w-lg mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Pick your teams
        </h1>
        <p className="text-gray-500">
          Search for the teams you want to follow. You can always change this later.
        </p>
      </div>

      {/* Search input */}
      <div className="mb-4">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for a team..."
          className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Selected teams count */}
      {selectedTeams.length > 0 && (
        <div className="mb-4 text-sm text-blue-600 font-medium">
          {selectedTeams.length} team{selectedTeams.length !== 1 ? 's' : ''} selected
        </div>
      )}

      {/* Search results */}
      <div className="space-y-2">
        {isLoading && (
          <p className="text-sm text-gray-400 text-center py-4">Searching...</p>
        )}

        {error && (
          <p className="text-sm text-red-500 text-center py-4">{error}</p>
        )}

        {!isLoading && results.length === 0 && debouncedQuery.length >= 2 && (
          <p className="text-sm text-gray-400 text-center py-4">
            No teams found for "{debouncedQuery}"
          </p>
        )}

        {results.map((team) => (
          <TeamCard
            key={team.apiId}
            team={team}
            isSelected={selectedTeams.some((t) => t.apiId === team.apiId)}
            onToggle={handleToggleTeam}
          />
        ))}
      </div>

      {/* Continue button — disabled until at least one team is selected */}
      {selectedTeams.length > 0 && (
        <div className="mt-8">
          <button
            onClick={handleSave}           // wired up now
            disabled={isSaving}            // disabled while saving
            className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving
              ? 'Saving...'
              : `Continue with ${selectedTeams.length} team${selectedTeams.length !== 1 ? 's' : ''}`
            }
          </button>
        </div>
      )}
    </main>
  )
}