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
  const recommendation = useRecommendation(maxTest, date)
  const [workouts, setWorkouts] = useState<Workout[]>([])
  const [loading, setLoading] = useState(true)

  const dateNum = Math.floor(date.getTime() / (1000 * 60 * 60 * 24))

  useEffect(() => {
    loadWorkouts()
  }, [dateNum])

  async function loadWorkouts() {
    try {
      const existing = await getWorkoutsForDate(dateNum * (1000 * 60 * 60 * 24))
      setWorkouts(existing)
    } catch (error) {
      console.error('Error loading workouts:', error)
    } finally {
      setLoading(false)
    }
  }

  async function logWorkout(exerciseId: string, completedSets: number, completedReps: number, rpe?: number) {
    const workout: Workout = {
      id: `workout-${Date.now()}`,
      date: dateNum * (1000 * 60 * 60 * 24),
      exercise: exerciseId as any,
      plannedSets: recommendation?.exercises.find((e) => e.exercise === exerciseId)?.sets || 0,
      plannedReps: recommendation?.exercises.find((e) => e.exercise === exerciseId)?.reps || 0,
      completedSets,
      completedReps,
      rpe,
    }

    try {
      await saveWorkout(workout)
      setWorkouts([...workouts, workout])
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
        const logged = workouts.find((w) => w.exercise === rec.exercise)

        return (
          <div key={rec.exercise} className="mb-4 pb-4 border-b border-slate-700 last:border-0">
            <p className="font-semibold mb-2">{exerciseNames[rec.exercise]}</p>

            {logged ? (
              <div className="bg-green-900 bg-opacity-50 rounded p-3">
                <p className="text-sm text-green-300">
                  ✓ Logged: {logged.completedSets} sets × {logged.completedReps} reps
                  {logged.rpe && ` (RPE ${logged.rpe})`}
                </p>
              </div>
            ) : (
              <div className="flex gap-2">
                <input
                  type="number"
                  min="0"
                  placeholder="Sets"
                  className="w-20 px-2 py-1 bg-slate-700 border border-slate-600 rounded text-white"
                  id={`sets-${rec.exercise}`}
                />
                <input
                  type="number"
                  min="0"
                  placeholder="Reps"
                  className="w-20 px-2 py-1 bg-slate-700 border border-slate-600 rounded text-white"
                  id={`reps-${rec.exercise}`}
                />
                <input
                  type="number"
                  min="1"
                  max="10"
                  placeholder="RPE"
                  className="w-20 px-2 py-1 bg-slate-700 border border-slate-600 rounded text-white"
                  id={`rpe-${rec.exercise}`}
                />
                <button
                  onClick={() => {
                    const setsInput = document.getElementById(
                      `sets-${rec.exercise}`
                    ) as HTMLInputElement
                    const repsInput = document.getElementById(
                      `reps-${rec.exercise}`
                    ) as HTMLInputElement
                    const rpeInput = document.getElementById(
                      `rpe-${rec.exercise}`
                    ) as HTMLInputElement

                    const sets = parseInt(setsInput.value, 10)
                    const reps = parseInt(repsInput.value, 10)
                    const rpe = rpeInput.value ? parseInt(rpeInput.value, 10) : undefined

                    if (sets > 0 && reps > 0) {
                      logWorkout(rec.exercise, sets, reps, rpe)
                    }
                  }}
                  className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-sm font-semibold"
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
