import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useRecommendation } from '../hooks/useRecommendation';
import { getDaysSinceLastMaxTest, shouldPromptForMaxTest } from '../utils/volumeScaling';
import { WorkoutLogger } from './WorkoutLogger';
import { MaxTestUpdate } from './MaxTestUpdate';
import { History } from './History';
export function Dashboard({ maxTest, onMaxTestUpdate }) {
    const today = new Date();
    const recommendation = useRecommendation(maxTest, today);
    const [currentView, setCurrentView] = useState('today');
    const [showMaxTestModal, setShowMaxTestModal] = useState(shouldPromptForMaxTest(maxTest));
    const daysSince = getDaysSinceLastMaxTest(maxTest);
    const exerciseNames = {
        pushups: 'Push-ups',
        'ring-rows': 'Ring-rows',
        'air-squats': 'Air Squats',
    };
    return (_jsxs("div", { className: "min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-4", children: [showMaxTestModal && (_jsx(MaxTestUpdate, { onComplete: () => {
                    setShowMaxTestModal(false);
                    onMaxTestUpdate();
                }, onSkip: () => setShowMaxTestModal(false) })), _jsxs("div", { className: "max-w-2xl mx-auto", children: [_jsx("div", { className: "mb-6", children: _jsxs("div", { className: "flex items-center justify-between bg-slate-800 rounded-lg p-4 text-white", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold", children: "MEV Training" }), _jsxs("p", { className: "text-slate-400 text-sm", children: ["Last max test: ", daysSince, " days ago", daysSince >= 28 && ' (time to retest!)'] })] }), _jsx("button", { onClick: () => setShowMaxTestModal(true), className: "bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-sm font-semibold", children: "New Max Test" })] }) }), _jsxs("div", { className: "flex gap-2 mb-6 bg-slate-800 p-2 rounded-lg", children: [_jsx("button", { onClick: () => setCurrentView('today'), className: `flex-1 py-2 rounded font-semibold transition ${currentView === 'today'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`, children: "Today" }), _jsx("button", { onClick: () => setCurrentView('history'), className: `flex-1 py-2 rounded font-semibold transition ${currentView === 'history'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`, children: "History" })] }), currentView === 'today' && recommendation && (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "bg-slate-800 rounded-lg p-6 text-white", children: [_jsx("h2", { className: "text-xl font-bold mb-4", children: today.toLocaleDateString('en-US', {
                                            weekday: 'long',
                                            month: 'short',
                                            day: 'numeric',
                                        }) }), recommendation.exercises.length > 0 ? (_jsx("div", { className: "space-y-4", children: recommendation.exercises.map((ex) => (_jsxs("div", { className: "bg-slate-700 rounded-lg p-4 border-l-4 border-blue-500", children: [_jsx("h3", { className: "text-lg font-semibold mb-2", children: exerciseNames[ex.exercise] }), _jsxs("div", { className: "grid grid-cols-3 gap-4", children: [_jsxs("div", { children: [_jsx("p", { className: "text-slate-400 text-sm", children: "Sets" }), _jsx("p", { className: "text-2xl font-bold", children: ex.sets })] }), _jsxs("div", { children: [_jsx("p", { className: "text-slate-400 text-sm", children: "Reps" }), _jsx("p", { className: "text-2xl font-bold", children: ex.reps })] }), _jsxs("div", { children: [_jsx("p", { className: "text-slate-400 text-sm", children: "RPE" }), _jsx("p", { className: "text-sm font-semibold text-green-400", children: ex.rpe })] })] }), _jsx("p", { className: "text-slate-400 text-xs mt-3", children: "Stop 2-3 reps before failure. Minimal effective dose." })] }, ex.exercise))) })) : (_jsxs("div", { className: "bg-slate-700 rounded-lg p-8 text-center", children: [_jsx("p", { className: "text-slate-400", children: "Rest day today!" }), _jsx("p", { className: "text-slate-500 text-sm mt-2", children: "Focus on recovery and come back stronger." })] }))] }), recommendation.exercises.length > 0 && (_jsx(WorkoutLogger, { date: today }))] })), currentView === 'history' && (_jsx(History, {}))] })] }));
}
