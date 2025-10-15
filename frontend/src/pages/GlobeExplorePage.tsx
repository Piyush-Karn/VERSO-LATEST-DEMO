import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { X } from 'lucide-react'

// Visited countries data (mocked)
const VISITED_COUNTRIES = ['Croatia', 'Austria', 'Thailand', 'Sri Lanka', 'Vietnam']

// Mock pins for recommended vaults
const MOCK_PINS = [
  { id: 1, name: 'Japan Food Crawl', lat: 36, lng: 138, inspirations: 18 },
  { id: 2, name: 'Bali Week', lat: -8, lng: 115, inspirations: 24 },
  { id: 3, name: 'Coldplay Bangkok', lat: 13, lng: 100, inspirations: 12 },
  { id: 4, name: 'Italy Vault', lat: 42, lng: 12, inspirations: 31 },
]

const FILTERS = [
  { id: 'seasonal', label: 'Seasonal Picks ☀️', emoji: '☀️' },
  { id: 'less-crowded', label: 'Less Crowded Now', emoji: '🌿' },
  { id: 'hidden-cafes', label: 'Hidden Cafés', emoji: '☕' },
  { id: 'creator-trips', label: 'Recent Creator Trips', emoji: '✨' },
]

export const GlobeExplorePage: React.FC = () => {
  const navigate = useNavigate()
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null)
  const [selectedPin, setSelectedPin] = useState<typeof MOCK_PINS[0] | null>(null)
  const [rotation, setRotation] = useState(0)

  const handlePinClick = (pin: typeof MOCK_PINS[0]) => {
    setSelectedPin(selectedPin?.id === pin.id ? null : pin)
  }

  const handleFilterClick = (filterId: string) => {
    setSelectedFilter(selectedFilter === filterId ? null : filterId)
    // Rotate globe slightly when filter is selected
    setRotation((prev) => prev + 15)
  }

  return (
    <div className="relative h-screen w-full overflow-hidden bg-black">
      {/* Globe Container */}
      <div className="absolute inset-0 flex items-center justify-center">
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 600 600"
          className="transition-transform duration-1000 ease-out"
          style={{ transform: `rotate(${rotation}deg)` }}
        >
          {/* Globe Circle */}
          <circle
            cx="300"
            cy="300"
            r="220"
            fill="#0a0a0a"
            stroke="#2a2a2a"
            strokeWidth="2"
          />

          {/* Subtle gradient overlay */}
          <defs>
            <radialGradient id="globe-gradient" cx="40%" cy="40%">
              <stop offset="0%" stopColor="#1a1a1a" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#0a0a0a" stopOpacity="1" />
            </radialGradient>
          </defs>
          <circle cx="300" cy="300" r="220" fill="url(#globe-gradient)" />

          {/* Latitude/Longitude lines */}
          <g stroke="#2a2a2a" strokeWidth="0.5" opacity="0.3">
            {/* Longitude lines */}
            {[0, 30, 60].map((angle) => (
              <ellipse
                key={`lng-${angle}`}
                cx="300"
                cy="300"
                rx={Math.abs(220 * Math.cos((angle * Math.PI) / 180))}
                ry="220"
                fill="none"
              />
            ))}
            {/* Latitude lines */}
            {[-30, 0, 30].map((lat) => (
              <ellipse
                key={`lat-${lat}`}
                cx="300"
                cy="300"
                rx="220"
                ry={Math.abs(220 * Math.cos((lat * Math.PI) / 180))}
                fill="none"
              />
            ))}
          </g>

          {/* Continents (simplified shapes) */}
          <g fill="#1a1a1a" stroke="#2a2a2a" strokeWidth="1">
            {/* North America */}
            <path d="M 150,180 Q 180,160 210,180 L 220,220 Q 210,240 190,250 L 160,240 Q 150,210 150,180 Z" opacity="0.6" />
            {/* South America */}
            <path d="M 200,280 Q 220,300 220,340 L 210,370 Q 200,380 190,370 L 185,330 Q 190,300 200,280 Z" opacity="0.6" />
            {/* Europe */}
            <path d="M 330,190 Q 360,180 380,200 L 385,230 Q 380,250 360,245 L 335,240 Q 330,215 330,190 Z" opacity="0.6" />
            {/* Africa */}
            <path d="M 340,260 Q 370,270 385,300 L 385,350 Q 370,380 350,375 L 330,350 Q 325,300 340,260 Z" opacity="0.6" />
            {/* Asia */}
            <path d="M 400,200 Q 450,180 480,210 L 490,260 Q 480,280 450,275 L 410,265 Q 400,235 400,200 Z" opacity="0.6" />
            {/* Australia */}
            <path d="M 460,350 Q 490,360 500,380 L 495,400 Q 480,405 470,395 L 460,375 Q 458,360 460,350 Z" opacity="0.6" />
          </g>

          {/* Highlight visited countries with darker shade */}
          <g fill="#333" stroke="#444" strokeWidth="1">
            {/* Croatia/Austria (Europe) */}
            <path d="M 345,210 Q 355,208 365,215 L 368,230 Q 363,238 355,235 L 345,228 Q 343,218 345,210 Z" />
            {/* Thailand/Vietnam (Southeast Asia) */}
            <path d="M 455,270 Q 465,268 475,275 L 478,290 Q 473,298 465,295 L 455,288 Q 453,278 455,270 Z" />
            {/* Sri Lanka (South Asia) */}
            <circle cx="430" cy="305" r="6" />
          </g>

          {/* Vault Pins */}
          {MOCK_PINS.map((pin) => {
            // Convert lat/lng to x/y (simplified projection)
            const x = 300 + ((pin.lng + 180) / 360) * 300 - 150
            const y = 300 - ((pin.lat + 90) / 180) * 300 + 150
            const isSelected = selectedPin?.id === pin.id

            return (
              <g
                key={pin.id}
                onClick={() => handlePinClick(pin)}
                className="cursor-pointer"
              >
                {/* Glow effect for selected pin */}
                {isSelected && (
                  <circle
                    cx={x}
                    cy={y}
                    r="30"
                    fill="#FDE68A"
                    opacity="0.2"
                    className="animate-pulse"
                  />
                )}
                {/* Pin marker */}
                <circle cx={x} cy={y} r="6" fill="#FDE68A" opacity="0.9" />
                <circle
                  cx={x}
                  cy={y}
                  r="10"
                  fill="none"
                  stroke="#FDE68A"
                  strokeWidth="2"
                  opacity={isSelected ? 1 : 0.5}
                  className="transition-opacity"
                />
              </g>
            )
          })}
        </svg>
      </div>

      {/* Floating Filter Chips */}
      <div className="absolute bottom-32 left-0 right-0 px-4">
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {FILTERS.map((filter) => (
            <button
              key={filter.id}
              onClick={() => handleFilterClick(filter.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-full whitespace-nowrap text-sm font-medium transition-all ${
                selectedFilter === filter.id
                  ? 'bg-yellow-200 text-black shadow-lg scale-105'
                  : 'bg-gray-900 text-gray-300 border border-gray-700'
              }`}
            >
              <span>{filter.emoji}</span>
              <span>{filter.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Micro-Vault Preview Card */}
      {selectedPin && (
        <div className="absolute bottom-56 left-4 right-4 animate-in slide-in-from-bottom-4 duration-300">
          <div className="bg-gray-900 rounded-2xl p-4 border border-gray-800 shadow-2xl">
            <div className="flex items-start gap-4">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-2xl">📍</span>
              </div>
              <div className="flex-1">
                <h3 className="text-white font-semibold mb-1">{selectedPin.name}</h3>
                <p className="text-gray-400 text-sm mb-3">
                  {selectedPin.inspirations} saved inspirations
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => navigate(`/vault/${selectedPin.id}`)}
                    className="flex-1 bg-yellow-200 hover:bg-yellow-100 text-black font-semibold py-2 px-4 rounded-lg text-sm transition-colors"
                  >
                    Open Vault
                  </button>
                  <button
                    onClick={() => setSelectedPin(null)}
                    className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    <X size={20} className="text-gray-400" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Title */}
      <div className="absolute top-6 left-4 right-4">
        <h1 className="text-2xl font-bold text-white mb-1">Explore</h1>
        <p className="text-gray-400 text-sm">Discover vaults and destinations worldwide</p>
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        @keyframes slide-in-from-bottom-4 {
          from {
            transform: translateY(16px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-in {
          animation: slide-in-from-bottom-4 0.3s ease-out;
        }
      `}</style>
    </div>
  )
}
