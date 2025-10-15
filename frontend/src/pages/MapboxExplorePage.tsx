import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { X } from 'lucide-react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN

// Visited countries data
const VISITED_COUNTRIES = [
  { name: 'Croatia', coords: [15.2, 45.1] },
  { name: 'Austria', coords: [14.5, 47.5] },
  { name: 'Thailand', coords: [100.5, 13.7] },
  { name: 'Sri Lanka', coords: [80.7, 7.8] },
  { name: 'Vietnam', coords: [108.3, 14.1] },
]

// Vault pins
const VAULT_PINS = [
  { id: '1', name: 'Japan Food Crawl', lng: 138.2529, lat: 36.2048, inspirations: 18 },
  { id: '2', name: 'Bali Week', lng: 115.0920, lat: -8.3405, inspirations: 24 },
  { id: '3', name: 'Coldplay Bangkok', lng: 100.5018, lat: 13.7563, inspirations: 12 },
  { id: '4', name: 'Italy Vault', lng: 12.5674, lat: 41.8719, inspirations: 31 },
]

const FILTERS = [
  { id: 'seasonal', label: 'Seasonal Picks ☀️' },
  { id: 'less-crowded', label: 'Less Crowded Now 🌿' },
  { id: 'hidden-cafes', label: 'Hidden Cafés ☕' },
  { id: 'creator-trips', label: 'Recent Creator Trips ✨' },
]

export const MapboxExplorePage: React.FC = () => {
  const navigate = useNavigate()
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const [selectedPin, setSelectedPin] = useState<typeof VAULT_PINS[0] | null>(null)
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null)
  const markers = useRef<mapboxgl.Marker[]>([])

  useEffect(() => {
    if (!mapContainer.current || map.current) return

    // Initialize Mapbox
    mapboxgl.accessToken = MAPBOX_TOKEN

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      projection: { name: 'globe' },
      center: [20, 30],
      zoom: 1.5,
      pitch: 0,
    })

    // Add globe atmosphere
    map.current.on('style.load', () => {
      if (!map.current) return

      map.current.setFog({
        color: 'rgb(10, 10, 10)',
        'high-color': 'rgb(20, 20, 30)',
        'horizon-blend': 0.02,
        'space-color': 'rgb(5, 5, 5)',
        'star-intensity': 0.6
      })

      // Add visited countries layer (darker overlay)
      VISITED_COUNTRIES.forEach((country) => {
        const el = document.createElement('div')
        el.className = 'visited-country-marker'
        el.style.width = '60px'
        el.style.height = '60px'
        el.style.borderRadius = '50%'
        el.style.backgroundColor = 'rgba(100, 100, 100, 0.3)'
        el.style.border = '2px solid rgba(150, 150, 150, 0.5)'
        el.style.pointerEvents = 'none'

        new mapboxgl.Marker(el)
          .setLngLat(country.coords as [number, number])
          .addTo(map.current!)
      })

      // Add vault pins
      VAULT_PINS.forEach((vault) => {
        const el = document.createElement('div')
        el.className = 'vault-pin'
        el.style.width = '20px'
        el.style.height = '20px'
        el.style.borderRadius = '50%'
        el.style.backgroundColor = '#FDE68A'
        el.style.border = '3px solid rgba(253, 230, 138, 0.5)'
        el.style.cursor = 'pointer'
        el.style.boxShadow = '0 0 20px rgba(253, 230, 138, 0.6)'
        el.style.transition = 'all 0.3s ease'

        el.addEventListener('mouseenter', () => {
          el.style.transform = 'scale(1.3)'
          el.style.boxShadow = '0 0 30px rgba(253, 230, 138, 0.9)'
        })

        el.addEventListener('mouseleave', () => {
          if (selectedPin?.id !== vault.id) {
            el.style.transform = 'scale(1)'
            el.style.boxShadow = '0 0 20px rgba(253, 230, 138, 0.6)'
          }
        })

        el.addEventListener('click', () => {
          setSelectedPin(selectedPin?.id === vault.id ? null : vault)
          map.current?.flyTo({
            center: [vault.lng, vault.lat],
            zoom: 4,
            duration: 2000,
          })
        })

        const marker = new mapboxgl.Marker(el)
          .setLngLat([vault.lng, vault.lat])
          .addTo(map.current!)

        markers.current.push(marker)
      })
    })

    // Auto-rotate globe slowly
    let userInteracting = false
    const rotateSpeed = 0.15

    const rotateCamera = () => {
      if (!map.current || userInteracting) return
      const center = map.current.getCenter()
      center.lng += rotateSpeed
      map.current.setCenter(center)
      requestAnimationFrame(rotateCamera)
    }

    map.current.on('mousedown', () => { userInteracting = true })
    map.current.on('mouseup', () => { userInteracting = false })
    map.current.on('touchstart', () => { userInteracting = true })
    map.current.on('touchend', () => { userInteracting = false })

    // Start rotation after a moment
    setTimeout(() => rotateCamera(), 2000)

    // Cleanup
    return () => {
      if (map.current) {
        map.current.remove()
        map.current = null
      }
    }
  }, [])

  const handleFilterClick = (filterId: string) => {
    setSelectedFilter(selectedFilter === filterId ? null : filterId)
    
    // Pan to a different region based on filter
    if (map.current && selectedFilter !== filterId) {
      const filterRegions: Record<string, [number, number, number]> = {
        'seasonal': [25, 15, 2.5], // Africa/Middle East
        'less-crowded': [110, -5, 3], // Southeast Asia
        'hidden-cafes': [12, 45, 4], // Europe
        'creator-trips': [-100, 40, 3], // North America
      }
      
      const [lng, lat, zoom] = filterRegions[filterId] || [20, 30, 1.5]
      map.current.flyTo({ center: [lng, lat], zoom, duration: 2000 })
    }
  }

  return (
    <div className="relative h-screen w-full overflow-hidden bg-black">
      {/* Mapbox Container */}
      <div ref={mapContainer} className="absolute inset-0" />

      {/* Title */}
      <div className="absolute top-6 left-4 right-4 z-10 pointer-events-none">
        <h1 className="text-2xl font-bold text-white mb-1">Explore</h1>
        <p className="text-gray-400 text-sm">Discover vaults and destinations worldwide</p>
      </div>

      {/* Floating Filter Chips */}
      <div className="absolute bottom-32 left-0 right-0 px-4 z-10">
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {FILTERS.map((filter) => (
            <button
              key={filter.id}
              onClick={() => handleFilterClick(filter.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-full whitespace-nowrap text-sm font-medium transition-all ${
                selectedFilter === filter.id
                  ? 'bg-yellow-200 text-black shadow-lg scale-105'
                  : 'bg-gray-900 text-gray-300 border border-gray-700 hover:bg-gray-800'
              }`}
            >
              <span>{filter.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Micro-Vault Preview Card */}
      {selectedPin && (
        <div className="absolute bottom-56 left-4 right-4 z-10 animate-in slide-in-from-bottom-4 duration-300">
          <div className="bg-gray-900 rounded-2xl p-4 border border-gray-800 shadow-2xl backdrop-blur-sm bg-opacity-95">
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
