export type ExerciseType = 'pushups' | 'ring-rows' | 'air-squats'

export interface Exercise {
  id: ExerciseType
  name: string
  description: string
}

export interface MaxTest {
  id: string
  date: number
  results: {
    pushups: number
    'ring-rows': number
    'air-squats': number
  }
}

export interface Workout {
  id: string
  date: number
  exercise: ExerciseType
  plannedSets: number
  plannedReps: number
  completedSets: number
  completedReps: number
  rpe?: number
}

export interface DailyRecommendation {
  date: string
  exercises: {
    exercise: ExerciseType
    sets: number
    reps: number
    rpe: string
  }[]
}

export type FitnessLevel = 'beginner' | 'intermediate' | 'advanced'

export interface VolumeConfig {
  weeklyTarget: number
  setsPerSession: { min: number; max: number }
  repsPerSet: { min: number; max: number }
  sessionsPerWeek: number
}
