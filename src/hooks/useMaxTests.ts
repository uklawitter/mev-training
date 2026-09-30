import { useState, useEffect } from 'react'
import { MaxTest } from '../types'
import { getLatestMaxTest, saveMaxTest, getAllMaxTests } from '../db/storage'

export function useMaxTests() {
  const [latest, setLatest] = useState<MaxTest | null>(null)
  const [all, setAll] = useState<MaxTest[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadTests()
  }, [])

  async function loadTests() {
    try {
      const latestTest = await getLatestMaxTest()
      const allTests = await getAllMaxTests()
      setLatest(latestTest)
      setAll(allTests)
    } catch (error) {
      console.error('Error loading max tests:', error)
    } finally {
      setLoading(false)
    }
  }

  async function addMaxTest(pushups: number, ringRows: number, airSquats: number) {
    const test: MaxTest = {
      id: `test-${Date.now()}`,
      date: Date.now(),
      results: {
        pushups,
        'ring-rows': ringRows,
        'air-squats': airSquats,
      },
    }

    try {
      await saveMaxTest(test)
      setLatest(test)
      setAll([test, ...all])
    } catch (error) {
      console.error('Error saving max test:', error)
      throw error
    }
  }

  return { latest, all, loading, addMaxTest }
}
