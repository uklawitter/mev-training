import { MaxTest, Workout } from '../types'

const DB_NAME = 'mev-training'
const DB_VERSION = 1

let db: IDBDatabase | null = null

export async function initDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onerror = () => reject(request.error)
    request.onsuccess = () => {
      db = request.result
      resolve(db)
    }

    request.onupgradeneeded = (event) => {
      const database = (event.target as IDBOpenDBRequest).result

      if (!database.objectStoreNames.contains('maxTests')) {
        const store = database.createObjectStore('maxTests', { keyPath: 'id' })
        store.createIndex('date', 'date', { unique: false })
      }

      if (!database.objectStoreNames.contains('workouts')) {
        const store = database.createObjectStore('workouts', { keyPath: 'id' })
        store.createIndex('date', 'date', { unique: false })
        store.createIndex('exercise', 'exercise', { unique: false })
      }
    }
  })
}

function getDB(): IDBDatabase {
  if (!db) throw new Error('Database not initialized')
  return db
}

export async function saveMaxTest(test: MaxTest): Promise<void> {
  const database = getDB()
  const tx = database.transaction('maxTests', 'readwrite')
  const store = tx.objectStore('maxTests')

  return new Promise((resolve, reject) => {
    const request = store.put(test)
    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve()
  })
}

export async function getLatestMaxTest(): Promise<MaxTest | null> {
  const database = getDB()
  const tx = database.transaction('maxTests', 'readonly')
  const store = tx.objectStore('maxTests')
  const index = store.index('date')

  return new Promise((resolve, reject) => {
    const request = index.openCursor(null, 'prev')
    request.onerror = () => reject(request.error)
    request.onsuccess = (event) => {
      const cursor = (event.target as IDBRequest).result
      resolve(cursor ? cursor.value : null)
    }
  })
}

export async function getAllMaxTests(): Promise<MaxTest[]> {
  const database = getDB()
  const tx = database.transaction('maxTests', 'readonly')
  const store = tx.objectStore('maxTests')

  return new Promise((resolve, reject) => {
    const request = store.getAll()
    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result.sort((a, b) => b.date - a.date))
  })
}

export async function saveWorkout(workout: Workout): Promise<void> {
  const database = getDB()
  const tx = database.transaction('workouts', 'readwrite')
  const store = tx.objectStore('workouts')

  return new Promise((resolve, reject) => {
    const request = store.put(workout)
    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve()
  })
}

export async function getWorkoutsForDate(date: number): Promise<Workout[]> {
  const database = getDB()
  const tx = database.transaction('workouts', 'readonly')
  const store = tx.objectStore('workouts')
  const index = store.index('date')

  return new Promise((resolve, reject) => {
    const request = index.getAll(date)
    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result)
  })
}

export async function getRecentWorkouts(days: number = 30): Promise<Workout[]> {
  const database = getDB()
  const tx = database.transaction('workouts', 'readonly')
  const store = tx.objectStore('workouts')

  const cutoffDate = Date.now() - days * 24 * 60 * 60 * 1000

  return new Promise((resolve, reject) => {
    const request = store.getAll()
    request.onerror = () => reject(request.error)
    request.onsuccess = () => {
      const all = request.result
      resolve(all.filter((w) => w.date >= cutoffDate).sort((a, b) => b.date - a.date))
    }
  })
}
