import { afterEach, beforeAll, vi } from 'vitest'
import { cleanup } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'

beforeAll(() => {
  // Mock service worker registration
  Object.defineProperty(navigator, 'serviceWorker', {
    value: {
      register: vi.fn().mockResolvedValue(undefined),
    },
    configurable: true,
  })
})

afterEach(() => {
  cleanup()
})

beforeEach(() => {
  // Mock IndexedDB
  const stores = new Map()
  const databases = new Map()

  window.indexedDB = {
    open: (name: string, version?: number) => {
      const request = new EventTarget()
      const db = {
        objectStoreNames: [],
        transaction: (storeNames: string | string[], mode = 'readonly') => {
          const storeArray = Array.isArray(storeNames) ? storeNames : [storeNames]
          return {
            objectStore: (name: string) => {
              if (!stores.has(name)) {
                stores.set(name, {
                  data: new Map(),
                  indexes: new Map(),
                })
              }
              const store = stores.get(name)
              return {
                put: (value: any) => ({
                  onerror: null,
                  onsuccess: null,
                  addEventListener: function (event: string, handler: Function) {
                    if (event === 'success') {
                      store.data.set(value.id, value)
                      setTimeout(handler, 0)
                    }
                  },
                }),
                getAll: () => ({
                  onerror: null,
                  onsuccess: null,
                  result: Array.from(store.data.values()),
                  addEventListener: function (event: string, handler: Function) {
                    if (event === 'success') {
                      setTimeout(handler, 0)
                    }
                  },
                }),
                get: (key: any) => ({
                  onerror: null,
                  onsuccess: null,
                  result: store.data.get(key),
                  addEventListener: function (event: string, handler: Function) {
                    if (event === 'success') {
                      setTimeout(handler, 0)
                    }
                  },
                }),
                index: (indexName: string) => ({
                  getAll: (key?: any) => ({
                    result: key ? [store.data.get(key)] : Array.from(store.data.values()),
                    addEventListener: function (event: string, handler: Function) {
                      if (event === 'success') {
                        setTimeout(handler, 0)
                      }
                    },
                  }),
                  openCursor: (range?: any, direction?: string) => ({
                    result: null,
                    addEventListener: function (event: string, handler: Function) {
                      if (event === 'success') {
                        setTimeout(handler, 0)
                      }
                    },
                  }),
                }),
              }
            },
          }
        },
      } as any
      setTimeout(() => {
        if (typeof request.onsuccess === 'function') {
          Object.defineProperty(request, 'result', { value: db })
          request.onsuccess({ target: request })
        }
      }, 0)
      return request as any
    },
    deleteDatabase: (name: string) => {
      databases.delete(name)
      return new EventTarget()
    },
    databases: () => Promise.resolve(Array.from(databases.keys()).map((name) => ({ name }))),
  } as any
})
