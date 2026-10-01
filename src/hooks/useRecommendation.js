import { useMemo } from 'react';
import { getExercisePlan, getDayExercises, calculateWeeklyVolume, getAdjustedSets, } from '../utils/volumeScaling';
export function useRecommendation(maxTest, date = new Date(), workouts = []) {
    const recommendation = useMemo(() => {
        if (!maxTest)
            return null;
        const dayOfWeek = date.getDay();
        const exerciseList = getDayExercises(dayOfWeek);
        const weeklyVolume = calculateWeeklyVolume(workouts, date);
        const exercises = exerciseList.map((exerciseId) => {
            const maxReps = maxTest.results[exerciseId];
            const basePlan = getExercisePlan(maxReps, 3);
            const adjustedSets = getAdjustedSets(basePlan.sets, exerciseId, weeklyVolume);
            const finalPlan = getExercisePlan(maxReps, adjustedSets);
            return {
                exercise: exerciseId,
                sets: adjustedSets,
                repsPerSet: finalPlan.repsPerSet,
                rpe: 'RPE 8-9',
            };
        });
        return {
            date: date.toISOString().split('T')[0],
            exercises,
        };
    }, [maxTest, date, workouts]);
    return recommendation;
}
