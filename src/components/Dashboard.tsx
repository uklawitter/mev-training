import { useState } from 'react'
import { MaxTest } from '../types'
import { useRecommendation } from '../hooks/useRecommendation'
import { getDaysSinceLastMaxTest, shouldPromptForMaxTest } from '../utils/volumeScaling'
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
  const recommendation = useRecommendation(maxTest, today)
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
          <div className="space-y-4">
            <div className="bg-slate-800 rounded-lg p-6 text-white">
              <h2 className="text-xl font-bold mb-4">
                {today.toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'short',
                  day: 'numeric',
                })}
              </h2>

              {recommendation.exercises.length > 0 ? (
                <div className="space-y-4">
                  {recommendation.exercises.map((ex) => (
                    <div
                      key={ex.exercise}
                      className="bg-slate-700 rounded-lg p-4 border-l-4 border-blue-500"
                    >
                      <h3 className="text-lg font-semibold mb-2">
                        {exerciseNames[ex.exercise]}
                      </h3>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <p className="text-slate-400 text-sm">Sets</p>
                          <p className="text-2xl font-bold">{ex.sets}</p>
                        </div>
                        <div>
                          <p className="text-slate-400 text-sm">Reps</p>
                          <p className="text-2xl font-bold">{ex.reps}</p>
                        </div>
                        <div>
                          <p className="text-slate-400 text-sm">RPE</p>
                          <p className="text-sm font-semibold text-green-400">{ex.rpe}</p>
                        </div>
                      </div>
                      <p className="text-slate-400 text-xs mt-3">
                        Stop 2-3 reps before failure. Minimal effective dose.
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-slate-700 rounded-lg p-8 text-center">
                  <p className="text-slate-400">Rest day today!</p>
                  <p className="text-slate-500 text-sm mt-2">
                    Focus on recovery and come back stronger.
                  </p>
                </div>
              )}
            </div>

            {recommendation.exercises.length > 0 && (
              <WorkoutLogger date={today} />
            )}
          </div>
        )}

        {currentView === 'history' && (
          <History />
        )}
      </div>
    </div>
  )
}
