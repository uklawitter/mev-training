import { useMemo } from 'react'
import { MaxTest, ExerciseType, DailyRecommendation, Workout } from '../types'
import {
  getExercisePlan,
  getDayExercises,
  calculateWeeklyVolume,
  getAdjustedSets,
} from '../utils/volumeScaling'

export function useRecommendation(maxTest: MaxTest | null, date: Date = new Date(), workouts: Workout[] = []) {
  const recommendation: DailyRecommendation | null = useMemo(() => {
    if (!maxTest) return null

    const dayOfWeek = date.getDay()
    const exerciseList = getDayExercises(dayOfWeek)
    const weeklyVolume = calculateWeeklyVolume(workouts, date)

    const exercises = exerciseList.map((exerciseId) => {
      const maxReps = maxTest.results[exerciseId]
      const basePlan = getExercisePlan(maxReps, 3)
      const adjustedSets = getAdjustedSets(basePlan.sets, exerciseId as ExerciseType, weeklyVolume)
      const finalPlan = getExercisePlan(maxReps, adjustedSets)

      return {
        exercise: exerciseId as ExerciseType,
        sets: adjustedSets,
        repsPerSet: finalPlan.repsPerSet,
        rpe: 'RPE 8-9',
      }
    })

    return {
      date: date.toISOString().split('T')[0],
      exercises,
    }
  }, [maxTest, date, workouts])

  return recommendation
}
