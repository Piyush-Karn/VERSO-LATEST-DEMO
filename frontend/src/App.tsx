import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Layout } from './components/Layout'
import { MapboxExplorePage } from './pages/MapboxExplorePage'
import { VaultViewPage } from './pages/VaultViewPage'
import { VaultDetailPage } from './pages/VaultDetailPage'
import { TripPageSimple } from './pages/TripPageSimple'
import { QuestionnairePage } from './pages/QuestionnairePage'
import { ItineraryPage } from './pages/ItineraryPage'
import { InterestsPage } from './pages/InterestsPage'
import { AddPage } from './pages/AddPage'

// Simple Ask Verso placeholder
const AskVersoPage = () => (
  <div className="flex-1 bg-black text-white min-h-screen flex items-center justify-center p-4">
    <div className="text-center max-w-md">
      <div className="text-6xl mb-4">✨</div>
      <h1 className="text-3xl font-bold mb-4">Ask Verso</h1>
      <p className="text-gray-400 mb-6">
        Your AI travel companion is coming soon. Ask anything about your trips, get recommendations, and plan seamlessly.
      </p>
      <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
        <p className="text-sm text-gray-500">Example questions:</p>
        <ul className="text-left text-sm text-gray-400 mt-2 space-y-1">
          <li>• "Plan a 5-day trip to Tokyo"</li>
          <li>• "Best cafés in Bali for remote work"</li>
          <li>• "When should I visit Italy?"</li>
        </ul>
      </div>
    </div>
  </div>
)

function App() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Routes>
        {/* Main Layout Routes */}
        <Route path="/" element={<Layout />}>
          <Route index element={<MapboxExplorePage />} />
          <Route path="collections" element={<VaultViewPage />} />
          <Route path="vault/:vaultId" element={<VaultDetailPage />} />
          <Route path="trip" element={<TripPageSimple />} />
          <Route path="ask-verso" element={<AskVersoPage />} />
          <Route path="organize/interests" element={<InterestsPage />} />
          <Route path="add" element={<AddPage />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}

export default App