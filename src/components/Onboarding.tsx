import { useState } from 'react'
import { useMaxTests } from '../hooks/useMaxTests'

interface OnboardingProps {
  onComplete?: () => void
}

export function Onboarding({ onComplete: _onComplete }: OnboardingProps) {
  const { addMaxTest } = useMaxTests()
  const [pushups, setPushups] = useState('')
  const [ringRows, setRingRows] = useState('')
  const [airSquats, setAirSquats] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    const p = parseInt(pushups, 10)
    const r = parseInt(ringRows, 10)
    const a = parseInt(airSquats, 10)

    if (isNaN(p) || isNaN(r) || isNaN(a)) {
      setError('Please enter valid numbers for all exercises')
      return
    }

    if (p < 1 || r < 1 || a < 1) {
      setError('Maximum reps must be at least 1')
      return
    }

    try {
      setLoading(true)
      await addMaxTest(p, r, a)
      await new Promise(resolve => setTimeout(resolve, 500))
      window.location.reload()
    } catch (err) {
      setError('Failed to save max test. Please try again.')
      console.error(err)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-xl p-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">MEV Training</h1>
        <p className="text-slate-600 mb-8">
          Let's start with your maximum reps for each exercise.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Max Push-ups
            </label>
            <input
              type="number"
              min="1"
              max="999"
              value={pushups}
              onChange={(e) => setPushups(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="e.g., 15"
              disabled={loading}
            />
            <p className="text-xs text-slate-500 mt-1">How many push-ups can you do in one set?</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Max Ring-rows
            </label>
            <input
              type="number"
              min="1"
              max="999"
              value={ringRows}
              onChange={(e) => setRingRows(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="e.g., 10"
              disabled={loading}
            />
            <p className="text-xs text-slate-500 mt-1">How many ring-rows can you do in one set?</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Max Air Squats
            </label>
            <input
              type="number"
              min="1"
              max="999"
              value={airSquats}
              onChange={(e) => setAirSquats(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="e.g., 40"
              disabled={loading}
            />
            <p className="text-xs text-slate-500 mt-1">How many air squats can you do in one set?</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white font-semibold py-2 rounded-lg transition"
          >
            {loading ? 'Saving...' : 'Start Training'}
          </button>
        </form>

        <p className="text-xs text-slate-500 text-center mt-6">
          You can update these numbers every 4 weeks as you improve.
        </p>
      </div>
    </div>
  )
}
