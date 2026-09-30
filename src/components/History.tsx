import { useState, useEffect } from 'react'
import { Workout } from '../types'
import { getRecentWorkouts } from '../db/storage'
import { useMaxTests } from '../hooks/useMaxTests'

export function History() {
  const { all: allMaxTests } = useMaxTests()
  const [workouts, setWorkouts] = useState<Workout[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadWorkouts()
  }, [])

  async function loadWorkouts() {
    try {
      const recent = await getRecentWorkouts(90)
      setWorkouts(recent)
    } catch (error) {
      console.error('Error loading workouts:', error)
    } finally {
      setLoading(false)
    }
  }

  const exerciseNames: Record<string, string> = {
    pushups: 'Push-ups',
    'ring-rows': 'Ring-rows',
    'air-squats': 'Air Squats',
  }

  if (loading) {
    return (
      <div className="bg-slate-800 rounded-lg p-8 text-center text-slate-400">
        Loading...
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="bg-slate-800 rounded-lg p-6 text-white">
        <h2 className="text-xl font-bold mb-4">Max Tests</h2>

        {allMaxTests.length === 0 ? (
          <p className="text-slate-400">No max tests recorded yet.</p>
        ) : (
          <div className="space-y-3">
            {allMaxTests.map((test) => (
              <div key={test.id} className="bg-slate-700 rounded p-4">
                <p className="text-slate-400 text-sm mb-2">
                  {new Date(test.date).toLocaleDateString('en-US', {
                    weekday: 'short',
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </p>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-slate-500 text-xs">Push-ups</p>
                    <p className="text-lg font-bold">{test.results.pushups}</p>
                  </div>
                  <div>
                    <p className="text-slate-500 text-xs">Ring-rows</p>
                    <p className="text-lg font-bold">{test.results['ring-rows']}</p>
                  </div>
                  <div>
                    <p className="text-slate-500 text-xs">Air Squats</p>
                    <p className="text-lg font-bold">{test.results['air-squats']}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-slate-800 rounded-lg p-6 text-white">
        <h2 className="text-xl font-bold mb-4">Recent Workouts (90 days)</h2>

        {workouts.length === 0 ? (
          <p className="text-slate-400">No workouts logged yet. Start training!</p>
        ) : (
          <div className="space-y-3">
            {workouts.slice(0, 20).map((workout) => (
              <div key={workout.id} className="bg-slate-700 rounded p-4 flex justify-between items-center">
                <div>
                  <p className="font-semibold">{exerciseNames[workout.exercise]}</p>
                  <p className="text-slate-400 text-sm">
                    {new Date(workout.date).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">
                    {workout.completedSets} × {workout.completedReps}
                  </p>
                  <p className="text-slate-400 text-sm">
                    Planned: {workout.plannedSets} × {workout.plannedReps}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
