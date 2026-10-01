import { useState, useEffect } from 'react'
import { MaxTest, Workout } from '../types'
import { useRecommendation } from '../hooks/useRecommendation'
import { getDaysSinceLastMaxTest, shouldPromptForMaxTest } from '../utils/volumeScaling'
import { getRecentWorkouts } from '../db/storage'
import { WorkoutLogger } from './WorkoutLogger'
import { MaxTestUpdate } from './MaxTestUpdate'
import { History } from './History'

interface DashboardProps {
  maxTest: MaxTest
  onMaxTestUpdate: () => void
}

type View = 'today' | 'history'

export function Dashboard({ maxTest, onMaxTestUpdate }: DashboardProps) {
  const today = new Date()
  const [workouts, setWorkouts] = useState<Workout[]>([])

  useEffect(() => {
    loadRecentWorkouts()
  }, [])

  async function loadRecentWorkouts() {
    try {
      const recent = await getRecentWorkouts(7)
      setWorkouts(recent)
    } catch (error) {
      console.error('Error loading workouts:', error)
    }
  }

  const handleWorkoutDeleted = () => {
    loadRecentWorkouts()
  }

  const recommendation = useRecommendation(maxTest, today, workouts)
  const [currentView, setCurrentView] = useState<View>('today')
  const [showMaxTestModal, setShowMaxTestModal] = useState(
    shouldPromptForMaxTest(maxTest)
  )
  const daysSince = getDaysSinceLastMaxTest(maxTest)

  const exerciseNames: Record<string, string> = {
    pushups: 'Push-ups',
    'ring-rows': 'Ring-rows',
    'air-squats': 'Air Squats',
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-4">
      {showMaxTestModal && (
        <MaxTestUpdate
          onComplete={() => {
            setShowMaxTestModal(false)
            onMaxTestUpdate()
          }}
          onSkip={() => setShowMaxTestModal(false)}
        />
      )}

      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center justify-between bg-slate-800 rounded-lg p-4 text-white">
            <div>
              <h1 className="text-2xl font-bold">MEV Training</h1>
              <p className="text-slate-400 text-sm">
                Last max test: {daysSince} days ago
                {daysSince >= 28 && ' (time to retest!)'}
              </p>
            </div>
            <button
              onClick={() => setShowMaxTestModal(true)}
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-sm font-semibold"
            >
              New Max Test
            </button>
          </div>
        </div>

        <div className="flex gap-2 mb-6 bg-slate-800 p-2 rounded-lg">
          <button
            onClick={() => setCurrentView('today')}
            className={`flex-1 py-2 rounded font-semibold transition ${
              currentView === 'today'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            Today
          </button>
          <button
            onClick={() => setCurrentView('history')}
            className={`flex-1 py-2 rounded font-semibold transition ${
              currentView === 'history'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            History
          </button>
        </div>

        {currentView === 'today' && recommendation && (
          <div>
            {recommendation.exercises.length > 0 ? (
              <WorkoutLogger date={today} />
            ) : (
              <div className="bg-slate-800 rounded-lg p-8 text-center text-white">
                <p className="text-slate-400 text-lg">Rest day today!</p>
                <p className="text-slate-500 text-sm mt-2">
                  Focus on recovery and come back stronger.
                </p>
              </div>
            )}
          </div>
        )}

        {currentView === 'history' && (
          <History onWorkoutDeleted={handleWorkoutDeleted} />
        )}
      </div>
    </div>
  )
}
