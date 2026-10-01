import { ExerciseType, HardSetConfig, MaxTest } from '../types'

const HARD_SET_CONFIG: HardSetConfig = {
  targetHardSetsPerWeek: { min: 8, max: 10 },
  setsPerSession: 3,
  sessionsPerWeek: 3,
  rpeTarget: 8.5,
}

export function calculateRepsAtRPE(maxReps: number, targetRPE: number): number {
  if (targetRPE >= 10) return maxReps
  if (targetRPE <= 6) return Math.max(1, Math.round(maxReps * 0.5))
  if (targetRPE >= 8.5) return Math.round(maxReps * 0.9)
  if (targetRPE >= 7.5) return Math.round(maxReps * 0.8)
  return Math.round(maxReps * 0.7)
}

export function getExercisePlan(maxReps: number): { sets: number; reps: number; hardSetsPerWeek: number } {
  const config = HARD_SET_CONFIG
  const repsAtRPE89 = Math.round(maxReps * 0.9)
  const hardSetsPerWeek = config.setsPerSession * config.sessionsPerWeek

  return {
    sets: config.setsPerSession,
    reps: repsAtRPE89,
    hardSetsPerWeek,
  }
}

export function getDayExercises(day: number): ExerciseType[] {
  const schedules: Record<number, ExerciseType[]> = {
    0: ['pushups', 'air-squats'],
    1: ['ring-rows', 'air-squats'],
    2: ['pushups'],
    3: ['ring-rows', 'air-squats'],
    4: ['pushups'],
    5: ['ring-rows'],
    6: ['air-squats'],
  }
  return schedules[day % 7] || []
}

export function getDaysSinceLastMaxTest(lastMaxTest: MaxTest | null): number {
  if (!lastMaxTest) return Infinity
  const daysSince = (Date.now() - lastMaxTest.date) / (1000 * 60 * 60 * 24)
  return Math.floor(daysSince)
}

export function shouldPromptForMaxTest(lastMaxTest: MaxTest | null): boolean {
  const daysSince = getDaysSinceLastMaxTest(lastMaxTest)
  return daysSince >= 28
}
