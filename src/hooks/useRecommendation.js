import { useMemo } from 'react';
import { getFitnessLevel, getExercisePlan, getDayExercises, } from '../utils/volumeScaling';
export function useRecommendation(maxTest, date = new Date()) {
    const recommendation = useMemo(() => {
        if (!maxTest)
            return null;
        const dayOfWeek = date.getDay();
        const exerciseList = getDayExercises(dayOfWeek);
        const exercises = exerciseList.map((exerciseId) => {
            const maxReps = maxTest.results[exerciseId];
            const fitnessLevel = getFitnessLevel(maxReps);
            const plan = getExercisePlan(fitnessLevel);
            return {
                exercise: exerciseId,
                sets: plan.sets,
                reps: plan.reps,
                rpe: 'RPE 6-7',
            };
        });
        return {
            date: date.toISOString().split('T')[0],
            exercises,
        };
    }, [maxTest, date]);
    return recommendation;
}
