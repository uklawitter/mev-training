import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { getRecentWorkouts, deleteWorkout, getAllMaxTests, deleteMaxTest } from '../db/storage';
export function History({ onWorkoutDeleted }) {
    const [maxTests, setMaxTests] = useState([]);
    const [workouts, setWorkouts] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        loadData();
    }, []);
    async function loadData() {
        try {
            const recent = await getRecentWorkouts(90);
            const allTests = await getAllMaxTests();
            setWorkouts(recent);
            setMaxTests(allTests);
        }
        catch (error) {
            console.error('Error loading data:', error);
        }
        finally {
            setLoading(false);
        }
    }
    async function handleDeleteWorkout(workoutId) {
        try {
            await deleteWorkout(workoutId);
            setWorkouts(workouts.filter((w) => w.id !== workoutId));
            onWorkoutDeleted?.();
        }
        catch (error) {
            console.error('Error deleting workout:', error);
        }
    }
    async function handleDeleteMaxTest(testId) {
        try {
            await deleteMaxTest(testId);
            setMaxTests(maxTests.filter((t) => t.id !== testId));
            window.location.reload();
        }
        catch (error) {
            console.error('Error deleting max test:', error);
        }
    }
    const exerciseNames = {
        pushups: 'Push-ups',
        'ring-rows': 'Ring-rows',
        'air-squats': 'Air Squats',
    };
    if (loading) {
        return (_jsx("div", { className: "bg-slate-800 rounded-lg p-8 text-center text-slate-400", children: "Loading..." }));
    }
    return (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "bg-slate-800 rounded-lg p-4 text-white", children: [_jsx("h2", { className: "text-lg font-bold mb-3", children: "Max Tests" }), maxTests.length === 0 ? (_jsx("p", { className: "text-slate-400", children: "No max tests recorded yet." })) : (_jsx("div", { className: "space-y-3", children: maxTests.map((test) => (_jsxs("div", { className: "bg-slate-700 rounded p-3 space-y-2", children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsx("p", { className: "text-slate-400 text-xs", children: new Date(test.date).toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                            }) }), _jsx("button", { onClick: () => {
                                                if (confirm('Delete this max test?')) {
                                                    handleDeleteMaxTest(test.id);
                                                }
                                            }, className: "text-red-400 hover:text-red-300 text-xs font-semibold", children: "Delete" })] }), _jsxs("div", { className: "flex gap-2 justify-around text-center text-xs", children: [_jsxs("div", { className: "flex-1", children: [_jsx("p", { className: "text-slate-500", children: "Pushups" }), _jsx("p", { className: "font-bold text-base", children: test.results.pushups })] }), _jsxs("div", { className: "flex-1", children: [_jsx("p", { className: "text-slate-500", children: "Rows" }), _jsx("p", { className: "font-bold text-base", children: test.results['ring-rows'] })] }), _jsxs("div", { className: "flex-1", children: [_jsx("p", { className: "text-slate-500", children: "Squats" }), _jsx("p", { className: "font-bold text-base", children: test.results['air-squats'] })] })] })] }, test.id))) }))] }), _jsxs("div", { className: "bg-slate-800 rounded-lg p-4 text-white", children: [_jsx("h2", { className: "text-lg font-bold mb-3", children: "Recent Workouts" }), workouts.length === 0 ? (_jsx("p", { className: "text-slate-400 text-sm", children: "No workouts logged yet." })) : (_jsx("div", { className: "space-y-2", children: workouts.slice(0, 20).map((workout) => (_jsxs("div", { className: "bg-slate-700 rounded p-3", children: [_jsxs("div", { className: "flex justify-between items-start gap-2 mb-2", children: [_jsxs("div", { className: "flex-1 min-w-0", children: [_jsx("p", { className: "font-semibold text-sm truncate", children: exerciseNames[workout.exercise] }), _jsx("p", { className: "text-slate-400 text-xs", children: new Date(workout.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) })] }), _jsx("button", { onClick: () => {
                                                if (confirm('Delete this workout?')) {
                                                    handleDeleteWorkout(workout.id);
                                                }
                                            }, className: "text-red-400 hover:text-red-300 text-xs font-semibold whitespace-nowrap", children: "Delete" })] }), _jsxs("div", { className: "bg-slate-600 rounded p-2 space-y-1 text-xs", children: [_jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-slate-400", children: "Done:" }), _jsx("span", { className: "font-semibold break-all", children: workout.completedRepsPerSet.join('-') })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-slate-400", children: "Plan:" }), _jsx("span", { className: "font-semibold break-all", children: workout.plannedRepsPerSet.join('-') })] })] })] }, workout.id))) }))] })] }));
}
