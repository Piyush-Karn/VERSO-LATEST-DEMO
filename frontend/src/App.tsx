import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Layout } from './components/Layout'
import { VaultViewPage } from './pages/VaultViewPage'
import { TripPageSimple } from './pages/TripPageSimple'
import { InterestsPage } from './pages/InterestsPage'
import { AddPage } from './pages/AddPage'

function App() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Routes>
        {/* Main Layout Routes */}
        <Route path="/" element={<Layout />}>
          <Route index element={<VaultViewPage />} />
          <Route path="trip" element={<TripPageSimple />} />
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