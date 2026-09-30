import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useMaxTests } from '../hooks/useMaxTests';
export function MaxTestUpdate({ onComplete, onSkip }) {
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
    return (_jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50", children: _jsxs("div", { className: "w-full max-w-md bg-white rounded-lg shadow-xl p-8", children: [_jsx("h2", { className: "text-2xl font-bold text-slate-900 mb-2", children: "Update Max Test" }), _jsx("p", { className: "text-slate-600 mb-6", children: "It's been 4 weeks! Let's retest and update your training recommendations." }), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-6", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-slate-700 mb-2", children: "Max Push-ups" }), _jsx("input", { type: "number", min: "1", max: "999", value: pushups, onChange: (e) => setPushups(e.target.value), className: "w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none", placeholder: "e.g., 15", disabled: loading })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-slate-700 mb-2", children: "Max Ring-rows" }), _jsx("input", { type: "number", min: "1", max: "999", value: ringRows, onChange: (e) => setRingRows(e.target.value), className: "w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none", placeholder: "e.g., 10", disabled: loading })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-slate-700 mb-2", children: "Max Air Squats" }), _jsx("input", { type: "number", min: "1", max: "999", value: airSquats, onChange: (e) => setAirSquats(e.target.value), className: "w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none", placeholder: "e.g., 40", disabled: loading })] }), error && (_jsx("div", { className: "bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded", children: error })), _jsxs("div", { className: "flex gap-3", children: [_jsx("button", { type: "submit", disabled: loading, className: "flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white font-semibold py-2 rounded-lg transition", children: loading ? 'Saving...' : 'Update' }), onSkip && (_jsx("button", { type: "button", onClick: onSkip, disabled: loading, className: "flex-1 bg-slate-300 hover:bg-slate-400 disabled:bg-slate-200 text-slate-900 font-semibold py-2 rounded-lg transition", children: "Skip" }))] })] })] }) }));
}
