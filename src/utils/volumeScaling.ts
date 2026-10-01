import { ExerciseType, FitnessLevel, VolumeConfig, MaxTest } from '../types'

const VOLUME_CONFIGS: Record<FitnessLevel, VolumeConfig> = {
  beginner: {
    weeklyTarget: 35,
    setsPerSession: { min: 3, max: 4 },
    repsPerSet: { min: 5, max: 8 },
    sessionsPerWeek: 2,
  },
  intermediate: {
    weeklyTarget: 50,
    setsPerSession: { min: 2, max: 3 },
    repsPerSet: { min: 8, max: 12 },
    sessionsPerWeek: 3,
  },
  advanced: {
    weeklyTarget: 80,
    setsPerSession: { min: 3, max: 4 },
    repsPerSet: { min: 10, max: 15 },
    sessionsPerWeek: 3,
  },
}

export function getFitnessLevel(maxReps: number): FitnessLevel {
  if (maxReps < 10) return 'beginner'
  if (maxReps < 30) return 'intermediate'
  return 'advanced'
}

export function getVolumeConfig(fitnessLevel: FitnessLevel): VolumeConfig {
  return VOLUME_CONFIGS[fitnessLevel]
}

export function calculateRecommendedReps(fitnessLevel: FitnessLevel): number {
  const config = getVolumeConfig(fitnessLevel)
  return config.weeklyTarget
}

export function getExercisePlan(
  fitnessLevel: FitnessLevel
): { sets: number; reps: number } {
  const config = getVolumeConfig(fitnessLevel)
  const weeklyTarget = config.weeklyTarget

  const repsPerSession = Math.round(weeklyTarget / config.sessionsPerWeek)
  const avgSets = (config.setsPerSession.min + config.setsPerSession.max) / 2
  const sets = Math.round(avgSets)
  const repsPerSet = Math.round(repsPerSession / sets)

  return {
    sets,
    reps: Math.max(repsPerSet, config.repsPerSet.min),
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
