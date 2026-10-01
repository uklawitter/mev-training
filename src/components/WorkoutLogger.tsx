import { useState, useEffect } from 'react'
import { Workout } from '../types'
import { getWorkoutsForDate, saveWorkout } from '../db/storage'
import { useRecommendation } from '../hooks/useRecommendation'
import { useMaxTests } from '../hooks/useMaxTests'

interface WorkoutLoggerProps {
  date: Date
}

export function WorkoutLogger({ date }: WorkoutLoggerProps) {
  const { latest: maxTest } = useMaxTests()
  const [todayWorkouts, setTodayWorkouts] = useState<Workout[]>([])
  const [weekWorkouts, setWeekWorkouts] = useState<Workout[]>([])
  const [loading, setLoading] = useState(true)
  const [inputState, setInputState] = useState<Record<string, number[]>>({})

  const dateNum = Math.floor(date.getTime() / (1000 * 60 * 60 * 24))
  const recommendation = useRecommendation(maxTest, date, weekWorkouts)

  useEffect(() => {
    loadWorkouts()
  }, [dateNum])

  async function loadWorkouts() {
    try {
      const todayExisting = await getWorkoutsForDate(dateNum * (1000 * 60 * 60 * 24))
      const recentWorkouts = await import('../db/storage').then(m => m.getRecentWorkouts(7))
      setTodayWorkouts(todayExisting)
      setWeekWorkouts(recentWorkouts)
    } catch (error) {
      console.error('Error loading workouts:', error)
    } finally {
      setLoading(false)
    }
  }

  async function logWorkout(exerciseId: string, completedRepsPerSet: number[]) {
    const rec = recommendation?.exercises.find((e) => e.exercise === exerciseId)
    if (!rec) return

    const workout: Workout = {
      id: `workout-${Date.now()}`,
      date: dateNum * (1000 * 60 * 60 * 24),
      exercise: exerciseId as any,
      plannedSets: rec.sets,
      plannedRepsPerSet: rec.repsPerSet,
      completedRepsPerSet,
    }

    try {
      await saveWorkout(workout)
      setTodayWorkouts([...todayWorkouts, workout])
      setWeekWorkouts([...weekWorkouts, workout])
      setInputState({ ...inputState, [exerciseId]: [] })
    } catch (error) {
      console.error('Error saving workout:', error)
    }
  }

  if (loading) return null

  const exerciseNames: Record<string, string> = {
    pushups: 'Push-ups',
    'ring-rows': 'Ring-rows',
    'air-squats': 'Air Squats',
  }

  return (
    <div className="bg-slate-800 rounded-lg p-6 text-white">
      <h3 className="text-lg font-bold mb-4">Log Workout</h3>

      {recommendation?.exercises.map((rec) => {
        const logged = todayWorkouts.find((w) => w.exercise === rec.exercise)
        const inputs = inputState[rec.exercise] || Array(rec.sets).fill(0)

        return (
          <div key={rec.exercise} className="mb-4 pb-4 border-b border-slate-700 last:border-0">
            <p className="font-semibold mb-2">{exerciseNames[rec.exercise]}</p>
            <p className="text-xs text-slate-400 mb-3">Planned: {rec.repsPerSet.join('-')}</p>

            {logged ? (
              <div className="bg-green-900 bg-opacity-50 rounded p-3">
                <p className="text-sm text-green-300">
                  ✓ Logged: {logged.completedRepsPerSet.join('-')}
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex flex-col gap-2">
                  {Array(rec.sets).fill(0).map((_, idx) => (
                    <input
                      key={idx}
                      type="number"
                      min="0"
                      placeholder={`Set ${idx + 1} - ${rec.repsPerSet[idx]} Reps`}
                      value={inputs[idx] || ''}
                      onChange={(e) => {
                        const newInputs = [...inputs]
                        newInputs[idx] = e.target.value ? parseInt(e.target.value, 10) : 0
                        setInputState({ ...inputState, [rec.exercise]: newInputs })
                      }}
                      className="w-full px-2 py-1 bg-slate-700 border border-slate-600 rounded text-white"
                    />
                  ))}
                </div>
                <button
                  onClick={() => {
                    if (inputs.every((r) => r > 0)) {
                      logWorkout(rec.exercise, inputs)
                    }
                  }}
                  className="w-full bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-sm font-semibold"
                >
                  Log
                </button>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
