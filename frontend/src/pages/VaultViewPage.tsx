import React, { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

// Mock vault data - will be replaced with API calls
const MOCK_VAULTS = [
  {
    id: '1',
    name: 'Japan Food Crawl',
    inspirations: 18,
    collaborators: 2,
    status: 'Idea' as const,
    images: [
      'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800',
      'https://images.unsplash.com/photo-1553621042-f6e147245754?w=800',
    ],
    region: { lat: 36.2048, lng: 138.2529 },
  },
  {
    id: '2',
    name: 'Bali Week',
    inspirations: 24,
    collaborators: 3,
    status: 'Planning' as const,
    images: [
      'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800',
      'https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=800',
    ],
    region: { lat: -8.3405, lng: 115.0920 },
  },
  {
    id: '3',
    name: 'Coldplay Bangkok',
    inspirations: 12,
    collaborators: 1,
    status: 'Booked' as const,
    images: [
      'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=800',
      'https://images.unsplash.com/photo-1563492065599-3520f775eeed?w=800',
    ],
    region: { lat: 13.7563, lng: 100.5018 },
  },
  {
    id: '4',
    name: 'Italy Vault',
    inspirations: 31,
    collaborators: 4,
    status: 'Idea' as const,
    images: [
      'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=800',
      'https://images.unsplash.com/photo-1525874684015-58379d421a52?w=800',
    ],
    region: { lat: 41.8719, lng: 12.5674 },
  },
]

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN

const STATUS_COLORS = {
  Idea: 'bg-blue-500',
  Planning: 'bg-yellow-500',
  Booked: 'bg-green-500',
}

export const VaultViewPage: React.FC = () => {
  const navigate = useNavigate()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [mapCenter, setMapCenter] = useState<[number, number]>([MOCK_VAULTS[0].region.lng, MOCK_VAULTS[0].region.lat])
  const scrollRef = useRef<HTMLDivElement>(null)
  const longPressTimer = useRef<NodeJS.Timeout | null>(null)

  const currentVault = MOCK_VAULTS[currentIndex]

  // Update map center when vault changes
  useEffect(() => {
    const vault = MOCK_VAULTS[currentIndex]
    setMapCenter([vault.region.lng, vault.region.lat])
  }, [currentIndex])

  // Handle scroll to snap cards
  const handleScroll = () => {
    if (!scrollRef.current) return
    const scrollLeft = scrollRef.current.scrollLeft
    const cardWidth = scrollRef.current.offsetWidth - 32 // Account for margin
    const newIndex = Math.round(scrollLeft / cardWidth)
    if (newIndex !== currentIndex && newIndex >= 0 && newIndex < MOCK_VAULTS.length) {
      setCurrentIndex(newIndex)
    }
  }

  // Handle card tap
  const handleCardTap = (vaultId: string) => {
    navigate(`/vault/${vaultId}`)
  }

  // Handle long press for "Ask Verso"
  const handleLongPressStart = (vaultId: string) => {
    longPressTimer.current = setTimeout(() => {
      // Open Ask Verso modal with context
      alert(`Ask Verso: "Plan this trip for me" - ${MOCK_VAULTS.find(v => v.id === vaultId)?.name}`)
    }, 500)
  }

  const handleLongPressEnd = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current)
      longPressTimer.current = null
    }
  }

  return (
    <div className="relative h-screen w-full overflow-hidden bg-black">
      {/* Background Map */}
      <div className="absolute inset-0 z-0 opacity-30">
        <Map
          mapboxAccessToken={MAPBOX_TOKEN}
          initialViewState={{
            longitude: mapCenter[0],
            latitude: mapCenter[1],
            zoom: 3,
          }}
          longitude={mapCenter[0]}
          latitude={mapCenter[1]}
          zoom={3}
          style={{ width: '100%', height: '100%' }}
          mapStyle="mapbox://styles/mapbox/dark-v11"
          interactive={false}
          transitionDuration={1000}
        >
          {/* Glow effect for current region */}
          <Source
            id="glow-source"
            type="geojson"
            data={{
              type: 'Feature',
              geometry: {
                type: 'Point',
                coordinates: mapCenter,
              },
              properties: {},
            }}
          >
            <Layer
              id="glow-layer"
              type="circle"
              paint={{
                'circle-radius': 100,
                'circle-color': '#FDE68A',
                'circle-opacity': 0.3,
                'circle-blur': 1,
              }}
            />
          </Source>
        </Map>
      </div>

      {/* Vault Cards - Horizontal Scroll */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="absolute inset-0 z-10 flex items-center overflow-x-auto overflow-y-hidden snap-x snap-mandatory scrollbar-hide px-4 gap-4"
        style={{
          scrollSnapType: 'x mandatory',
          scrollBehavior: 'smooth',
        }}
      >
        {MOCK_VAULTS.map((vault, index) => (
          <div
            key={vault.id}
            className="flex-shrink-0 w-[calc(100%-32px)] h-[75vh] snap-center"
            style={{
              transform: currentIndex === index ? 'scale(1)' : 'scale(0.95)',
              transition: 'transform 0.3s ease-out',
            }}
          >
            <div
              className="relative w-full h-full rounded-3xl overflow-hidden shadow-2xl cursor-pointer group"
              onClick={() => handleCardTap(vault.id)}
              onTouchStart={() => handleLongPressStart(vault.id)}
              onTouchEnd={handleLongPressEnd}
              onMouseDown={() => handleLongPressStart(vault.id)}
              onMouseUp={handleLongPressEnd}
              onMouseLeave={handleLongPressEnd}
              style={{
                transition: 'transform 0.2s ease-out',
              }}
            >
              {/* Hero Images - Blended */}
              <div className="absolute inset-0">
                {vault.images.map((img, i) => (
                  <div
                    key={i}
                    className="absolute inset-0"
                    style={{
                      backgroundImage: `url(${img})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      opacity: i === 0 ? 0.7 : 0.3,
                      transform: `scale(${1 + i * 0.05})`,
                      transition: 'transform 0.5s ease-out',
                    }}
                  />
                ))}
              </div>

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent opacity-90" />

              {/* Parallax effect on hover/active */}
              <div
                className="absolute inset-0 transition-transform duration-300 group-hover:translate-y-[-4px] group-active:translate-y-[-2px]"
                style={{
                  transform: currentIndex === index ? 'translateY(-2px)' : 'translateY(0)',
                }}
              >
                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-8 pb-12">
                  {/* Status Pill */}
                  <div className="inline-flex items-center mb-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium text-white ${STATUS_COLORS[vault.status]}`}>
                      {vault.status}
                    </span>
                  </div>

                  {/* Trip Name */}
                  <h2 className="text-white text-4xl font-bold mb-3 leading-tight tracking-tight">
                    {vault.name}
                  </h2>

                  {/* Subtext */}
                  <p className="text-gray-300 text-sm">
                    {vault.inspirations} saved inspirations · {vault.collaborators} collaborator{vault.collaborators > 1 ? 's' : ''}
                  </p>
                </div>
              </div>

              {/* Subtle glow effect on active card */}
              {currentIndex === index && (
                <div className="absolute inset-0 ring-2 ring-yellow-200/20 rounded-3xl pointer-events-none" />
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Scroll Indicators */}
      <div className="absolute bottom-8 left-0 right-0 z-20 flex justify-center gap-2 pb-2">
        {MOCK_VAULTS.map((_, index) => (
          <div
            key={index}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              currentIndex === index
                ? 'w-8 bg-yellow-200'
                : 'w-1.5 bg-gray-500'
            }`}
          />
        ))}
      </div>

      {/* Floating "Ask Verso" Button */}
      <button
        className="absolute top-6 right-6 z-20 bg-yellow-200 hover:bg-yellow-100 text-black font-semibold px-4 py-2 rounded-full text-sm shadow-lg transition-all duration-200 hover:scale-105 active:scale-95"
        onClick={() => alert('Ask Verso AI assistant')}
      >
        ✨ Ask Verso
      </button>

      {/* Custom scrollbar hide */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  )
}
