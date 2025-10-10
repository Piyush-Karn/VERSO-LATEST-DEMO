import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Layout } from './components/Layout'

// Simple test component first
const TestHomePage: React.FC = () => (
  <div className="flex-1 bg-black text-white min-h-screen p-4">
    <h1 className="text-2xl font-bold mb-4">Verso Travel Platform</h1>
    <p className="text-gray-400 mb-4">Original black theme restored!</p>
    <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
      <p className="text-green-400">✅ React Router working</p>
      <p className="text-green-400">✅ Black minimalistic theme</p>
      <p className="text-green-400">✅ Tailwind CSS functional</p>
    </div>
  </div>
)

const TestTripPage: React.FC = () => (
  <div className="flex-1 bg-black text-white min-h-screen p-4">
    <h1 className="text-xl font-bold mb-4">Trip Planning</h1>
    <p className="text-gray-400">Trip page with original styling</p>
  </div>
)

function App() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Routes>
        {/* Main Layout Routes */}
        <Route path="/" element={<Layout />}>
          <Route index element={<TestHomePage />} />
          <Route path="trip" element={<TestTripPage />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}

export default App