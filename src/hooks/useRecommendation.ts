import { useMemo } from 'react'
import { MaxTest, ExerciseType, DailyRecommendation } from '../types'
import {
  getFitnessLevel,
  getExercisePlan,
  getDayExercises,
} from '../utils/volumeScaling'

export function useRecommendation(maxTest: MaxTest | null, date: Date = new Date()) {
  const recommendation: DailyRecommendation | null = useMemo(() => {
    if (!maxTest) return null

    const dayOfWeek = date.getDay()
    const exerciseList = getDayExercises(dayOfWeek)

    const exercises = exerciseList.map((exerciseId) => {
      const maxReps = maxTest.results[exerciseId]
      const fitnessLevel = getFitnessLevel(maxReps)
      const plan = getExercisePlan(fitnessLevel)

      return {
        exercise: exerciseId as ExerciseType,
        sets: plan.sets,
        reps: plan.reps,
        rpe: 'RPE 6-7',
      }
    })

    return {
      date: date.toISOString().split('T')[0],
      exercises,
    }
  }, [maxTest, date])

  return recommendation
}
