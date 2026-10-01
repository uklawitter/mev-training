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

export function getExercisePlan(maxReps: number, numSets: number = 3): { sets: number; repsPerSet: number[]; hardSetsPerWeek: number } {
  const config = HARD_SET_CONFIG
  const hardSetsPerWeek = config.setsPerSession * config.sessionsPerWeek

  const repsPerSet: number[] = []
  for (let i = 0; i < numSets; i++) {
    const capacityFactor = Math.max(0.5, 0.9 - i * 0.12)
    repsPerSet.push(Math.round(maxReps * capacityFactor))
  }

  return {
    sets: numSets,
    repsPerSet,
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

export function getWeekStart(date: Date): Date {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() - day
  return new Date(d.setDate(diff))
}

export function calculateWeeklyVolume(workouts: any[], date: Date): Record<ExerciseType, number> {
  const weekStart = getWeekStart(date)
  const weekEnd = new Date(weekStart.getTime() + 7 * 24 * 60 * 60 * 1000)

  const volume: Record<ExerciseType, number> = {
    pushups: 0,
    'ring-rows': 0,
    'air-squats': 0,
  }

  workouts.forEach((w) => {
    const workoutDate = new Date(w.date)
    if (workoutDate >= weekStart && workoutDate < weekEnd) {
      volume[w.exercise] += w.completedRepsPerSet?.length || 0
    }
  })

  return volume
}

export function getAdjustedSets(basesets: number, exercise: ExerciseType, weeklyVolume: Record<ExerciseType, number>): number {
  const TARGET_SETS_PER_WEEK = 9
  const doneThisWeek = weeklyVolume[exercise]
  const remaining = Math.max(0, TARGET_SETS_PER_WEEK - doneThisWeek)

  if (remaining <= 0) {
    return Math.max(1, basesets - 1)
  }

  if (remaining > 3) {
    return basesets + 2
  } else if (remaining > 0) {
    return basesets + 1
  }

  return basesets
}
