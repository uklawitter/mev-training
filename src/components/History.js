import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { getRecentWorkouts } from '../db/storage';
import { useMaxTests } from '../hooks/useMaxTests';
export function History() {
    const { all: allMaxTests } = useMaxTests();
    const [workouts, setWorkouts] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        loadWorkouts();
    }, []);
    async function loadWorkouts() {
        try {
            const recent = await getRecentWorkouts(90);
            setWorkouts(recent);
        }
        catch (error) {
            console.error('Error loading workouts:', error);
        }
        finally {
            setLoading(false);
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
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "bg-slate-800 rounded-lg p-6 text-white", children: [_jsx("h2", { className: "text-xl font-bold mb-4", children: "Max Tests" }), allMaxTests.length === 0 ? (_jsx("p", { className: "text-slate-400", children: "No max tests recorded yet." })) : (_jsx("div", { className: "space-y-3", children: allMaxTests.map((test) => (_jsxs("div", { className: "bg-slate-700 rounded p-4", children: [_jsx("p", { className: "text-slate-400 text-sm mb-2", children: new Date(test.date).toLocaleDateString('en-US', {
                                        weekday: 'short',
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric',
                                    }) }), _jsxs("div", { className: "grid grid-cols-3 gap-4", children: [_jsxs("div", { children: [_jsx("p", { className: "text-slate-500 text-xs", children: "Push-ups" }), _jsx("p", { className: "text-lg font-bold", children: test.results.pushups })] }), _jsxs("div", { children: [_jsx("p", { className: "text-slate-500 text-xs", children: "Ring-rows" }), _jsx("p", { className: "text-lg font-bold", children: test.results['ring-rows'] })] }), _jsxs("div", { children: [_jsx("p", { className: "text-slate-500 text-xs", children: "Air Squats" }), _jsx("p", { className: "text-lg font-bold", children: test.results['air-squats'] })] })] })] }, test.id))) }))] }), _jsxs("div", { className: "bg-slate-800 rounded-lg p-6 text-white", children: [_jsx("h2", { className: "text-xl font-bold mb-4", children: "Recent Workouts (90 days)" }), workouts.length === 0 ? (_jsx("p", { className: "text-slate-400", children: "No workouts logged yet. Start training!" })) : (_jsx("div", { className: "space-y-3", children: workouts.slice(0, 20).map((workout) => (_jsxs("div", { className: "bg-slate-700 rounded p-4 flex justify-between items-center", children: [_jsxs("div", { children: [_jsx("p", { className: "font-semibold", children: exerciseNames[workout.exercise] }), _jsx("p", { className: "text-slate-400 text-sm", children: new Date(workout.date).toLocaleDateString() })] }), _jsxs("div", { className: "text-right", children: [_jsxs("p", { className: "font-semibold", children: [workout.completedSets, " \u00D7 ", workout.completedReps] }), _jsxs("p", { className: "text-slate-400 text-sm", children: ["Planned: ", workout.plannedSets, " \u00D7 ", workout.plannedReps] })] })] }, workout.id))) }))] })] }));
}
