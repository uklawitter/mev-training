import { jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { initDB } from './db/storage';
initDB()
    .then(() => {
    ReactDOM.createRoot(document.getElementById('root')).render(_jsx(React.StrictMode, { children: _jsx(App, {}) }));
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js').catch((err) => {
            console.warn('Service worker registration failed:', err);
        });
    }
})
    .catch((err) => {
    console.error('Failed to initialize database:', err);
});
