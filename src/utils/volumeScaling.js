const VOLUME_CONFIGS = {
    beginner: {
        weeklyTarget: 8,
        setsPerSession: { min: 2, max: 3 },
        repsPerSet: { min: 2, max: 4 },
        sessionsPerWeek: 2,
    },
    intermediate: {
        weeklyTarget: 12,
        setsPerSession: { min: 2, max: 3 },
        repsPerSet: { min: 4, max: 8 },
        sessionsPerWeek: 3,
    },
    advanced: {
        weeklyTarget: 20,
        setsPerSession: { min: 3, max: 4 },
        repsPerSet: { min: 5, max: 12 },
        sessionsPerWeek: 3,
    },
};
export function getFitnessLevel(maxReps) {
    if (maxReps < 10)
        return 'beginner';
    if (maxReps < 30)
        return 'intermediate';
    return 'advanced';
}
export function getVolumeConfig(fitnessLevel) {
    return VOLUME_CONFIGS[fitnessLevel];
}
export function calculateRecommendedReps(fitnessLevel) {
    const config = getVolumeConfig(fitnessLevel);
    const avgRepsPerSet = (config.repsPerSet.min + config.repsPerSet.max) / 2;
    const setsPerSession = config.setsPerSession.min;
    const sessionsPerWeek = config.sessionsPerWeek;
    const weeklyReps = avgRepsPerSet * setsPerSession * sessionsPerWeek;
    return Math.max(Math.round(weeklyReps / 2), config.repsPerSet.min);
}
export function getExercisePlan(fitnessLevel) {
    const config = getVolumeConfig(fitnessLevel);
    const targetReps = calculateRecommendedReps(fitnessLevel);
    const avgSets = (config.setsPerSession.min + config.setsPerSession.max) / 2;
    const sets = Math.round(avgSets);
    const repsPerSet = Math.round(targetReps / sets);
    return {
        sets,
        reps: Math.max(repsPerSet, config.repsPerSet.min),
    };
}
export function getDayExercises(day) {
    const schedules = {
        0: ['pushups', 'air-squats'],
        1: ['ring-rows', 'air-squats'],
        2: ['pushups'],
        3: ['ring-rows', 'air-squats'],
        4: ['pushups'],
        5: ['ring-rows'],
        6: ['air-squats'],
    };
    return schedules[day % 7] || [];
}
export function getDaysSinceLastMaxTest(lastMaxTest) {
    if (!lastMaxTest)
        return Infinity;
    const daysSince = (Date.now() - lastMaxTest.date) / (1000 * 60 * 60 * 24);
    return Math.floor(daysSince);
}
export function shouldPromptForMaxTest(lastMaxTest) {
    const daysSince = getDaysSinceLastMaxTest(lastMaxTest);
    return daysSince >= 28;
}
