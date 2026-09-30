import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { getWorkoutsForDate, saveWorkout } from '../db/storage';
import { useRecommendation } from '../hooks/useRecommendation';
import { useMaxTests } from '../hooks/useMaxTests';
export function WorkoutLogger({ date }) {
    const { latest: maxTest } = useMaxTests();
    const recommendation = useRecommendation(maxTest, date);
    const [workouts, setWorkouts] = useState([]);
    const [loading, setLoading] = useState(true);
    const dateNum = Math.floor(date.getTime() / (1000 * 60 * 60 * 24));
    useEffect(() => {
        loadWorkouts();
    }, [dateNum]);
    async function loadWorkouts() {
        try {
            const existing = await getWorkoutsForDate(dateNum * (1000 * 60 * 60 * 24));
            setWorkouts(existing);
        }
        catch (error) {
            console.error('Error loading workouts:', error);
        }
        finally {
            setLoading(false);
        }
    }
    async function logWorkout(exerciseId, completedSets, completedReps, rpe) {
        const workout = {
            id: `workout-${Date.now()}`,
            date: dateNum * (1000 * 60 * 60 * 24),
            exercise: exerciseId,
            plannedSets: recommendation?.exercises.find((e) => e.exercise === exerciseId)?.sets || 0,
            plannedReps: recommendation?.exercises.find((e) => e.exercise === exerciseId)?.reps || 0,
            completedSets,
            completedReps,
            rpe,
        };
        try {
            await saveWorkout(workout);
            setWorkouts([...workouts, workout]);
        }
        catch (error) {
            console.error('Error saving workout:', error);
        }
    }
    if (loading)
        return null;
    const exerciseNames = {
        pushups: 'Push-ups',
        'ring-rows': 'Ring-rows',
        'air-squats': 'Air Squats',
    };
    return (_jsxs("div", { className: "bg-slate-800 rounded-lg p-6 text-white", children: [_jsx("h3", { className: "text-lg font-bold mb-4", children: "Log Workout" }), recommendation?.exercises.map((rec) => {
                const logged = workouts.find((w) => w.exercise === rec.exercise);
                return (_jsxs("div", { className: "mb-4 pb-4 border-b border-slate-700 last:border-0", children: [_jsx("p", { className: "font-semibold mb-2", children: exerciseNames[rec.exercise] }), logged ? (_jsx("div", { className: "bg-green-900 bg-opacity-50 rounded p-3", children: _jsxs("p", { className: "text-sm text-green-300", children: ["\u2713 Logged: ", logged.completedSets, " sets \u00D7 ", logged.completedReps, " reps", logged.rpe && ` (RPE ${logged.rpe})`] }) })) : (_jsxs("div", { className: "flex gap-2", children: [_jsx("input", { type: "number", min: "0", placeholder: "Sets", className: "w-20 px-2 py-1 bg-slate-700 border border-slate-600 rounded text-white", id: `sets-${rec.exercise}` }), _jsx("input", { type: "number", min: "0", placeholder: "Reps", className: "w-20 px-2 py-1 bg-slate-700 border border-slate-600 rounded text-white", id: `reps-${rec.exercise}` }), _jsx("input", { type: "number", min: "1", max: "10", placeholder: "RPE", className: "w-20 px-2 py-1 bg-slate-700 border border-slate-600 rounded text-white", id: `rpe-${rec.exercise}` }), _jsx("button", { onClick: () => {
                                        const setsInput = document.getElementById(`sets-${rec.exercise}`);
                                        const repsInput = document.getElementById(`reps-${rec.exercise}`);
                                        const rpeInput = document.getElementById(`rpe-${rec.exercise}`);
                                        const sets = parseInt(setsInput.value, 10);
                                        const reps = parseInt(repsInput.value, 10);
                                        const rpe = rpeInput.value ? parseInt(rpeInput.value, 10) : undefined;
                                        if (sets > 0 && reps > 0) {
                                            logWorkout(rec.exercise, sets, reps, rpe);
                                        }
                                    }, className: "bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-sm font-semibold", children: "Log" })] }))] }, rec.exercise));
            })] }));
}
