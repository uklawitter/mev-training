import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useMaxTests } from './hooks/useMaxTests';
import { Onboarding } from './components/Onboarding';
import { Dashboard } from './components/Dashboard';
function App() {
    const { latest, loading } = useMaxTests();
    const [, setRefreshTrigger] = useState(0);
    if (loading) {
        return (_jsx("div", { className: "min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center", children: _jsxs("div", { className: "text-white text-center", children: [_jsx("p", { className: "text-xl font-semibold mb-4", children: "Loading your training data..." }), _jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto" })] }) }));
    }
    if (!latest) {
        return _jsx(Onboarding, { onComplete: () => setRefreshTrigger((x) => x + 1) });
    }
    return _jsx(Dashboard, { maxTest: latest, onMaxTestUpdate: () => setRefreshTrigger((x) => x + 1) });
}
export default App;
