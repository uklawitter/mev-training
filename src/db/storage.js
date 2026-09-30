const DB_NAME = 'mev-training';
const DB_VERSION = 1;
let db = null;
export async function initDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);
        request.onerror = () => reject(request.error);
        request.onsuccess = () => {
            db = request.result;
            resolve(db);
        };
        request.onupgradeneeded = (event) => {
            const database = event.target.result;
            if (!database.objectStoreNames.contains('maxTests')) {
                const store = database.createObjectStore('maxTests', { keyPath: 'id' });
                store.createIndex('date', 'date', { unique: false });
            }
            if (!database.objectStoreNames.contains('workouts')) {
                const store = database.createObjectStore('workouts', { keyPath: 'id' });
                store.createIndex('date', 'date', { unique: false });
                store.createIndex('exercise', 'exercise', { unique: false });
            }
        };
    });
}
function getDB() {
    if (!db)
        throw new Error('Database not initialized');
    return db;
}
export async function saveMaxTest(test) {
    const database = getDB();
    const tx = database.transaction('maxTests', 'readwrite');
    const store = tx.objectStore('maxTests');
    return new Promise((resolve, reject) => {
        const request = store.put(test);
        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve();
    });
}
export async function getLatestMaxTest() {
    const database = getDB();
    const tx = database.transaction('maxTests', 'readonly');
    const store = tx.objectStore('maxTests');
    const index = store.index('date');
    return new Promise((resolve, reject) => {
        const request = index.openCursor(null, 'prev');
        request.onerror = () => reject(request.error);
        request.onsuccess = (event) => {
            const cursor = event.target.result;
            resolve(cursor ? cursor.value : null);
        };
    });
}
export async function getAllMaxTests() {
    const database = getDB();
    const tx = database.transaction('maxTests', 'readonly');
    const store = tx.objectStore('maxTests');
    return new Promise((resolve, reject) => {
        const request = store.getAll();
        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve(request.result.sort((a, b) => b.date - a.date));
    });
}
export async function saveWorkout(workout) {
    const database = getDB();
    const tx = database.transaction('workouts', 'readwrite');
    const store = tx.objectStore('workouts');
    return new Promise((resolve, reject) => {
        const request = store.put(workout);
        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve();
    });
}
export async function getWorkoutsForDate(date) {
    const database = getDB();
    const tx = database.transaction('workouts', 'readonly');
    const store = tx.objectStore('workouts');
    const index = store.index('date');
    return new Promise((resolve, reject) => {
        const request = index.getAll(date);
        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve(request.result);
    });
}
export async function getRecentWorkouts(days = 30) {
    const database = getDB();
    const tx = database.transaction('workouts', 'readonly');
    const store = tx.objectStore('workouts');
    const cutoffDate = Date.now() - days * 24 * 60 * 60 * 1000;
    return new Promise((resolve, reject) => {
        const request = store.getAll();
        request.onerror = () => reject(request.error);
        request.onsuccess = () => {
            const all = request.result;
            resolve(all.filter((w) => w.date >= cutoffDate).sort((a, b) => b.date - a.date));
        };
    });
}
