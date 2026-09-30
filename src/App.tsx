import { useState } from 'react'
import { useMaxTests } from './hooks/useMaxTests'
import { Onboarding } from './components/Onboarding'
import { Dashboard } from './components/Dashboard'

function App() {
  const { latest, loading } = useMaxTests()
  const [, setRefreshTrigger] = useState(0)

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-white text-center">
          <p className="text-xl font-semibold mb-4">Loading your training data...</p>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
        </div>
      </div>
    )
  }

  if (!latest) {
    return <Onboarding onComplete={() => setRefreshTrigger((x) => x + 1)} />
  }

  return <Dashboard maxTest={latest} onMaxTestUpdate={() => setRefreshTrigger((x) => x + 1)} />
}

export default App
