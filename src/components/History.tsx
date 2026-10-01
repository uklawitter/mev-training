import { useState, useEffect } from 'react'
import { Workout, MaxTest } from '../types'
import { getRecentWorkouts, deleteWorkout, getAllMaxTests, deleteMaxTest } from '../db/storage'
import { useMaxTests } from '../hooks/useMaxTests'

interface HistoryProps {
  onWorkoutDeleted?: () => void
}

export function History({ onWorkoutDeleted }: HistoryProps) {
  const { all: hookMaxTests } = useMaxTests()
  const [maxTests, setMaxTests] = useState<MaxTest[]>([])
  const [workouts, setWorkouts] = useState<Workout[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    try {
      const recent = await getRecentWorkouts(90)
      const allTests = await getAllMaxTests()
      setWorkouts(recent)
      setMaxTests(allTests)
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleDeleteWorkout(workoutId: string) {
    try {
      await deleteWorkout(workoutId)
      setWorkouts(workouts.filter((w) => w.id !== workoutId))
      onWorkoutDeleted?.()
    } catch (error) {
      console.error('Error deleting workout:', error)
    }
  }

  async function handleDeleteMaxTest(testId: string) {
    try {
      await deleteMaxTest(testId)
      setMaxTests(maxTests.filter((t) => t.id !== testId))
      window.location.reload()
    } catch (error) {
      console.error('Error deleting max test:', error)
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
    <div className="space-y-4">
      <div className="bg-slate-800 rounded-lg p-4 text-white">
        <h2 className="text-lg font-bold mb-3">Max Tests</h2>

        {maxTests.length === 0 ? (
          <p className="text-slate-400">No max tests recorded yet.</p>
        ) : (
          <div className="space-y-3">
            {maxTests.map((test) => (
              <div key={test.id} className="bg-slate-700 rounded p-3 space-y-2">
                <div className="flex justify-between items-center">
                  <p className="text-slate-400 text-xs">
                    {new Date(test.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </p>
                  <button
                    onClick={() => {
                      if (confirm('Delete this max test?')) {
                        handleDeleteMaxTest(test.id)
                      }
                    }}
                    className="text-red-400 hover:text-red-300 text-xs font-semibold"
                  >
                    Delete
                  </button>
                </div>
                <div className="flex gap-2 justify-around text-center text-xs">
                  <div className="flex-1">
                    <p className="text-slate-500">Pushups</p>
                    <p className="font-bold text-base">{test.results.pushups}</p>
                  </div>
                  <div className="flex-1">
                    <p className="text-slate-500">Rows</p>
                    <p className="font-bold text-base">{test.results['ring-rows']}</p>
                  </div>
                  <div className="flex-1">
                    <p className="text-slate-500">Squats</p>
                    <p className="font-bold text-base">{test.results['air-squats']}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-slate-800 rounded-lg p-4 text-white">
        <h2 className="text-lg font-bold mb-3">Recent Workouts</h2>

        {workouts.length === 0 ? (
          <p className="text-slate-400 text-sm">No workouts logged yet.</p>
        ) : (
          <div className="space-y-2">
            {workouts.slice(0, 20).map((workout) => (
              <div key={workout.id} className="bg-slate-700 rounded p-3">
                <div className="flex justify-between items-start gap-2 mb-2">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate">{exerciseNames[workout.exercise]}</p>
                    <p className="text-slate-400 text-xs">
                      {new Date(workout.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      if (confirm('Delete this workout?')) {
                        handleDeleteWorkout(workout.id)
                      }
                    }}
                    className="text-red-400 hover:text-red-300 text-xs font-semibold whitespace-nowrap"
                  >
                    Delete
                  </button>
                </div>
                <div className="bg-slate-600 rounded p-2 space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Done:</span>
                    <span className="font-semibold break-all">{workout.completedRepsPerSet.join('-')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Plan:</span>
                    <span className="font-semibold break-all">{workout.plannedRepsPerSet.join('-')}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
