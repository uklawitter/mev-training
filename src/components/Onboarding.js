import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useMaxTests } from '../hooks/useMaxTests';
export function Onboarding({ onComplete }) {
    const { addMaxTest } = useMaxTests();
    const [pushups, setPushups] = useState('');
    const [ringRows, setRingRows] = useState('');
    const [airSquats, setAirSquats] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    async function handleSubmit(e) {
        e.preventDefault();
        setError(null);
        const p = parseInt(pushups, 10);
        const r = parseInt(ringRows, 10);
        const a = parseInt(airSquats, 10);
        if (isNaN(p) || isNaN(r) || isNaN(a)) {
            setError('Please enter valid numbers for all exercises');
            return;
        }
        if (p < 1 || r < 1 || a < 1) {
            setError('Maximum reps must be at least 1');
            return;
        }
        try {
            setLoading(true);
            await addMaxTest(p, r, a);
            onComplete();
        }
        catch (err) {
            setError('Failed to save max test. Please try again.');
            console.error(err);
        }
        finally {
            setLoading(false);
        }
    }
    return (_jsx("div", { className: "min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4", children: _jsxs("div", { className: "w-full max-w-md bg-white rounded-lg shadow-xl p-8", children: [_jsx("h1", { className: "text-3xl font-bold text-slate-900 mb-2", children: "MEV Training" }), _jsx("p", { className: "text-slate-600 mb-8", children: "Let's start with your maximum reps for each exercise." }), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-6", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-slate-700 mb-2", children: "Max Push-ups" }), _jsx("input", { type: "number", min: "1", max: "999", value: pushups, onChange: (e) => setPushups(e.target.value), className: "w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none", placeholder: "e.g., 15", disabled: loading }), _jsx("p", { className: "text-xs text-slate-500 mt-1", children: "How many push-ups can you do in one set?" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-slate-700 mb-2", children: "Max Ring-rows" }), _jsx("input", { type: "number", min: "1", max: "999", value: ringRows, onChange: (e) => setRingRows(e.target.value), className: "w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none", placeholder: "e.g., 10", disabled: loading }), _jsx("p", { className: "text-xs text-slate-500 mt-1", children: "How many ring-rows can you do in one set?" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-slate-700 mb-2", children: "Max Air Squats" }), _jsx("input", { type: "number", min: "1", max: "999", value: airSquats, onChange: (e) => setAirSquats(e.target.value), className: "w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none", placeholder: "e.g., 40", disabled: loading }), _jsx("p", { className: "text-xs text-slate-500 mt-1", children: "How many air squats can you do in one set?" })] }), error && (_jsx("div", { className: "bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded", children: error })), _jsx("button", { type: "submit", disabled: loading, className: "w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white font-semibold py-2 rounded-lg transition", children: loading ? 'Saving...' : 'Start Training' })] }), _jsx("p", { className: "text-xs text-slate-500 text-center mt-6", children: "You can update these numbers every 4 weeks as you improve." })] }) }));
}
