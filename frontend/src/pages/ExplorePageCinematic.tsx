import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { Calendar, Compass, Clock, Sparkles, X, ChevronRight, User, Settings, LogOut, RefreshCw, Bookmark, MapPin, MessageCircle } from 'lucide-react'

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN

// Mock data for filters
const MONTHS = [
  { value: 'Jan', label: 'January', image: 'https://images.unsplash.com/photo-1483921020237-2ff51e8e4b22?w=300', regions: [[25, 45, 4]] },
  { value: 'Feb', label: 'February', image: 'https://images.unsplash.com/photo-1518640467707-6811f4a6ab73?w=300', regions: [[30, 40, 4]] },
  { value: 'Mar', label: 'March', image: 'https://images.unsplash.com/photo-1490730141103-6cac27aaab94?w=300', regions: [[140, 35, 4]] },
  { value: 'Apr', label: 'April', image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=300', regions: [[10, 50, 4]] },
  { value: 'May', label: 'May', image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=300', regions: [[100, 15, 4]] },
  { value: 'Jun', label: 'June', image: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=300', regions: [[115, -8, 4]] },
  { value: 'Jul', label: 'July', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=300', regions: [[-100, 20, 4]] },
  { value: 'Aug', label: 'August', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300', regions: [[80, 7, 4]] },
  { value: 'Sep', label: 'September', image: 'https://images.unsplash.com/photo-1504575110460-7b4e9b08c9c3?w=300', regions: [[12, 42, 4]] },
  { value: 'Oct', label: 'October', image: 'https://images.unsplash.com/photo-1445250327237-c815a2b7cd8f?w=300', regions: [[-70, 40, 4]] },
  { value: 'Nov', label: 'November', image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=300', regions: [[138, 36, 4]] },
  { value: 'Dec', label: 'December', image: 'https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?w=300', regions: [[15, 47, 4]] },
]

const THEMES = [
  { id: 'beaches', label: 'Beaches', emoji: '🏖️', color: 'from-blue-400 to-cyan-300' },
  { id: 'mountains', label: 'Mountains', emoji: '⛰️', color: 'from-gray-600 to-slate-400' },
  { id: 'wildlife', label: 'Wildlife', emoji: '🦁', color: 'from-green-600 to-emerald-400' },
  { id: 'heritage', label: 'Heritage', emoji: '🏛️', color: 'from-amber-600 to-yellow-400' },
  { id: 'city', label: 'City Life', emoji: '🌆', color: 'from-purple-600 to-pink-400' },
  { id: 'food', label: 'Food', emoji: '🍜', color: 'from-orange-600 to-red-400' },
  { id: 'water', label: 'Water Adventures', emoji: '🌊', color: 'from-teal-600 to-blue-400' },
]

const TRAVEL_DISTANCES = [
  { range: '0-2h', label: '0–2h', radius: 500 },
  { range: '3-5h', label: '3–5h', radius: 1500 },
  { range: '6-9h', label: '6–9h', radius: 3000 },
  { range: '10h+', label: '10h+', radius: 6000 },
]

const MOCK_COUNTRIES = [
  { id: 1, name: 'Japan', coords: [138.2, 36.2], image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800', reason: 'Ancient traditions meet neon-lit modernity' },
  { id: 2, name: 'Bali', coords: [115.0, -8.3], image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800', reason: 'Island of gods with endless summer vibes' },
  { id: 3, name: 'Thailand', coords: [100.5, 13.7], image: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=800', reason: 'Vibrant street food and tropical islands' },
  { id: 4, name: 'Italy', coords: [12.5, 41.8], image: 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=800', reason: 'Ancient heritage meets culinary paradise' },
  { id: 5, name: 'Croatia', coords: [15.2, 45.1], image: 'https://images.unsplash.com/photo-1555990538-c7d2f78f5a6f?w=800', reason: 'Adriatic jewel with turquoise waters' },
  { id: 6, name: 'New Zealand', coords: [174.8, -41.3], image: 'https://images.unsplash.com/photo-1507699622108-4be3abd695ad?w=800', reason: 'Land of fjords and endless adventure' },
  { id: 7, name: 'South Africa', coords: [18.4, -33.9], image: 'https://images.unsplash.com/photo-1484318571209-661cf29a69c3?w=800', reason: 'Safari wilderness meets coastal beauty' },
]

type FilterType = 'time' | 'theme' | 'distance' | 'surprise' | null

export const ExplorePageCinematic: React.FC = () => {
  const navigate = useNavigate()
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  
  const [activeFilter, setActiveFilter] = useState<FilterType>(null)
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null)
  const [selectedThemes, setSelectedThemes] = useState<string[]>([])
  const [selectedDistance, setSelectedDistance] = useState<string | null>(null)
  const [isFiltered, setIsFiltered] = useState(false)
  const [surpriseLocation, setSurpriseLocation] = useState<any>(null)
  const [isSpinning, setIsSpinning] = useState(false)
  const [showProfileModal, setShowProfileModal] = useState(false)
  
  // Bottom nav collapsible state
  const [isNavVisible, setIsNavVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const navHideTimeout = useRef<NodeJS.Timeout | null>(null)
  const [isNearBottom, setIsNearBottom] = useState(false)

  // Initialize Mapbox globe
  useEffect(() => {
    if (!mapContainer.current || map.current) return

    mapboxgl.accessToken = MAPBOX_TOKEN

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/satellite-streets-v12',
      projection: { name: 'globe' },
      center: [20, 30],
      zoom: 1.5,
      pitch: 0,
    })

    map.current.on('style.load', () => {
      if (!map.current) return

      // Add ambient fog
      map.current.setFog({
        color: 'rgb(15, 15, 20)',
        'high-color': 'rgb(25, 25, 35)',
        'horizon-blend': 0.02,
        'space-color': 'rgb(5, 5, 10)',
        'star-intensity': 0.4
      })

      // Add home location pulse (example: New York)
      const homeEl = document.createElement('div')
      homeEl.className = 'home-pulse'
      homeEl.style.width = '20px'
      homeEl.style.height = '20px'
      homeEl.style.borderRadius = '50%'
      homeEl.style.backgroundColor = '#FDE68A'
      homeEl.style.boxShadow = '0 0 20px rgba(253, 230, 138, 0.8)'
      homeEl.style.animation = 'pulse 2s infinite'

      new mapboxgl.Marker(homeEl)
        .setLngLat([-74.0, 40.7])
        .addTo(map.current!)
    })

    return () => {
      if (map.current) {
        map.current.remove()
        map.current = null
      }
    }
  }, [])

  // Bottom nav auto-hide logic
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      // Scrolling down - hide nav
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsNavVisible(false)
        if (navHideTimeout.current) clearTimeout(navHideTimeout.current)
      }
      // Scrolling up - show nav
      else if (currentScrollY < lastScrollY) {
        setIsNavVisible(true)
        // Auto-hide after 1.5s of inactivity
        if (navHideTimeout.current) clearTimeout(navHideTimeout.current)
        navHideTimeout.current = setTimeout(() => {
          setIsNavVisible(false)
        }, 2000)
      }

      setLastScrollY(currentScrollY)
    }

    const handleMouseMove = (e: MouseEvent) => {
      const windowHeight = window.innerHeight
      const mouseY = e.clientY

      // Check if mouse is near bottom (within 64px)
      if (windowHeight - mouseY <= 64) {
        setIsNearBottom(true)
        setIsNavVisible(true)
        // Auto-hide after 1.5s
        if (navHideTimeout.current) clearTimeout(navHideTimeout.current)
        navHideTimeout.current = setTimeout(() => {
          setIsNavVisible(false)
        }, 1500)
      } else {
        setIsNearBottom(false)
      }
    }

    const handleTouchStart = (e: TouchEvent) => {
      const windowHeight = window.innerHeight
      const touchY = e.touches[0].clientY

      // Check if touch is near bottom (within 64px)
      if (windowHeight - touchY <= 64) {
        setIsNavVisible(true)
        // Auto-hide after 1.5s
        if (navHideTimeout.current) clearTimeout(navHideTimeout.current)
        navHideTimeout.current = setTimeout(() => {
          setIsNavVisible(false)
        }, 1500)
      }
    }

    // Initial auto-hide after 2s
    navHideTimeout.current = setTimeout(() => {
      setIsNavVisible(false)
    }, 2000)

    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    window.addEventListener('touchstart', handleTouchStart, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('touchstart', handleTouchStart)
      if (navHideTimeout.current) clearTimeout(navHideTimeout.current)
    }
  }, [lastScrollY])

  const handleFilterClick = (filter: FilterType) => {
    setActiveFilter(activeFilter === filter ? null : filter)
  }

  const handleMonthSelect = (month: typeof MONTHS[0]) => {
    setSelectedMonth(month.value)
    setIsFiltered(true)
    setActiveFilter(null)
    
    // Zoom to region
    if (map.current && month.regions[0]) {
      map.current.flyTo({
        center: [month.regions[0][0], month.regions[0][1]],
        zoom: month.regions[0][2],
        duration: 900,
        essential: true
      })
    }
  }

  const handleThemeToggle = (themeId: string) => {
    setSelectedThemes(prev => 
      prev.includes(themeId) 
        ? prev.filter(id => id !== themeId)
        : [...prev, themeId]
    )
  }

  const handleThemeApply = () => {
    if (selectedThemes.length > 0) {
      setIsFiltered(true)
      setActiveFilter(null)
      
      // Zoom to example region
      if (map.current) {
        map.current.flyTo({
          center: [25, 40],
          zoom: 3,
          duration: 900
        })
      }
    }
  }

  const handleDistanceSelect = (distance: typeof TRAVEL_DISTANCES[0]) => {
    setSelectedDistance(distance.range)
    setIsFiltered(true)
    setActiveFilter(null)
    
    // Adjust zoom based on distance
    if (map.current) {
      const zoomLevel = distance.radius < 1000 ? 5 : distance.radius < 2000 ? 4 : 3
      map.current.flyTo({
        center: [-74.0, 40.7],
        zoom: zoomLevel,
        duration: 700
      })
    }
  }

  const handleSurpriseMe = () => {
    setIsSpinning(true)
    setActiveFilter(null)
    
    // Spin the globe
    if (map.current) {
      const randomCountry = MOCK_COUNTRIES[Math.floor(Math.random() * MOCK_COUNTRIES.length)]
      
      map.current.flyTo({
        center: randomCountry.coords as [number, number],
        zoom: 5,
        duration: 2000,
        essential: true
      })

      setTimeout(() => {
        setIsSpinning(false)
        setSurpriseLocation(randomCountry)
      }, 2000)
    }
  }

  const clearFilters = () => {
    setIsFiltered(false)
    setSelectedMonth(null)
    setSelectedThemes([])
    setSelectedDistance(null)
    setSurpriseLocation(null)
    
    if (map.current) {
      map.current.flyTo({
        center: [20, 30],
        zoom: 1.5,
        duration: 900
      })
    }
  }

  return (
    <div className="relative h-screen w-full overflow-hidden bg-black">
      {/* Globe Backdrop */}
      <div 
        ref={mapContainer} 
        className="absolute inset-0 transition-all duration-[900ms] ease-in-out"
        style={{
          height: isFiltered ? '50%' : '100%',
          top: 0
        }}
      />

      {/* Vignette Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40 pointer-events-none" />

      {/* Title (only when not filtered) */}
      {!isFiltered && (
        <div className="absolute top-8 left-6 right-6 z-10 animate-fade-in flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Explore</h1>
            <p className="text-gray-300 text-sm">Wander before you wonder</p>
          </div>
          <button
            onClick={() => setShowProfileModal(true)}
            className="p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full border border-white/20 transition-all hover:scale-110"
          >
            <User size={20} className="text-white" />
          </button>
        </div>
      )}

      {/* Profile Modal */}
      {showProfileModal && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in" onClick={() => setShowProfileModal(false)}>
          <div className="bg-gray-900 rounded-3xl w-full max-w-md m-4 p-6 border border-gray-800 animate-slide-up" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Profile</h2>
              <button onClick={() => setShowProfileModal(false)} className="p-2 hover:bg-gray-800 rounded-full transition-colors">
                <X size={20} className="text-gray-400" />
              </button>
            </div>

            <div className="space-y-4">
              {/* User Info */}
              <div className="bg-gradient-to-br from-yellow-900/20 to-amber-900/20 rounded-2xl p-6 border border-yellow-500/20">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-yellow-200/20 rounded-full flex items-center justify-center">
                    <User size={32} className="text-yellow-200" />
                  </div>
                  <div>
                    <p className="text-white font-bold text-lg">Explorer</p>
                    <p className="text-gray-400 text-sm">Travel enthusiast</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-black/30 rounded-xl p-3">
                    <p className="text-yellow-200 text-2xl font-bold">5</p>
                    <p className="text-gray-400 text-xs">Regions visited</p>
                  </div>
                  <div className="bg-black/30 rounded-xl p-3">
                    <p className="text-yellow-200 text-2xl font-bold">12</p>
                    <p className="text-gray-400 text-xs">Saved places</p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-2">
                <button
                  onClick={() => {
                    setShowProfileModal(false)
                    navigate('/onboarding')
                  }}
                  className="w-full flex items-center gap-3 p-4 bg-gray-800/50 hover:bg-gray-800 rounded-xl transition-colors text-left border border-gray-700"
                >
                  <RefreshCw size={20} className="text-yellow-200" />
                  <div>
                    <p className="text-white font-medium">Update Preferences</p>
                    <p className="text-gray-400 text-xs">Retake onboarding</p>
                  </div>
                </button>

                <button className="w-full flex items-center gap-3 p-4 bg-gray-800/50 hover:bg-gray-800 rounded-xl transition-colors text-left border border-gray-700">
                  <Settings size={20} className="text-gray-400" />
                  <div>
                    <p className="text-white font-medium">Settings</p>
                    <p className="text-gray-400 text-xs">Preferences and privacy</p>
                  </div>
                </button>

                <button className="w-full flex items-center gap-3 p-4 bg-gray-800/50 hover:bg-gray-800 rounded-xl transition-colors text-left border border-gray-700">
                  <LogOut size={20} className="text-gray-400" />
                  <div>
                    <p className="text-white font-medium">Sign out</p>
                    <p className="text-gray-400 text-xs">See you soon</p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Filter Bar */}
      {!isFiltered && (
        <div className="absolute bottom-24 left-0 right-0 px-4 z-20">
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            <button
              onClick={() => handleFilterClick('time')}
              className={`flex-shrink-0 flex items-center gap-2 px-5 py-3.5 rounded-full backdrop-blur-md border transition-all duration-600 ${
                activeFilter === 'time'
                  ? 'bg-white/20 border-white/40 scale-110 shadow-2xl'
                  : 'bg-black/30 border-white/10 hover:scale-105 hover:bg-white/15'
              }`}
            >
              <Calendar size={18} className="text-yellow-200" />
              <span className="text-sm font-medium text-white whitespace-nowrap">When to travel</span>
            </button>

            <button
              onClick={() => handleFilterClick('theme')}
              className={`flex-shrink-0 flex items-center gap-2 px-5 py-3.5 rounded-full backdrop-blur-md border transition-all duration-600 ${
                activeFilter === 'theme'
                  ? 'bg-white/20 border-white/40 scale-110 shadow-2xl'
                  : 'bg-black/30 border-white/10 hover:scale-105 hover:bg-white/15'
              }`}
            >
              <Compass size={18} className="text-yellow-200" />
              <span className="text-sm font-medium text-white whitespace-nowrap">Travel vibe</span>
            </button>

            <button
              onClick={() => handleFilterClick('distance')}
              className={`flex-shrink-0 flex items-center gap-2 px-5 py-3.5 rounded-full backdrop-blur-md border transition-all duration-600 ${
                activeFilter === 'distance'
                  ? 'bg-white/20 border-white/40 scale-110 shadow-2xl'
                  : 'bg-black/30 border-white/10 hover:scale-105 hover:bg-white/15'
              }`}
            >
              <Clock size={18} className="text-yellow-200" />
              <span className="text-sm font-medium text-white whitespace-nowrap">How far away</span>
            </button>

            <button
              onClick={handleSurpriseMe}
              className="flex-shrink-0 flex items-center gap-2 px-5 py-3.5 rounded-full backdrop-blur-md border transition-all duration-600 bg-gradient-to-r from-yellow-200/20 to-orange-200/20 border-yellow-200/30 hover:scale-105 hover:from-yellow-200/30 hover:to-orange-200/30"
            >
              <Sparkles size={18} className="text-yellow-200" />
              <span className="text-sm font-medium text-white whitespace-nowrap">Surprise me</span>
            </button>
          </div>
        </div>
      )}

      {/* Filter Dropdowns */}
      {activeFilter === 'time' && (
        <div className="absolute bottom-48 left-4 right-4 z-30 animate-scale-in">
          <div className="bg-black/80 backdrop-blur-xl rounded-3xl p-6 border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Best seasons for your vibe</h3>
              <button onClick={() => setActiveFilter(null)} className="p-2 hover:bg-white/10 rounded-lg">
                <X size={20} className="text-gray-400" />
              </button>
            </div>
            <div className="grid grid-cols-4 gap-3 max-h-64 overflow-y-auto">
              {MONTHS.map((month) => (
                <button
                  key={month.value}
                  onClick={() => handleMonthSelect(month)}
                  className="flex flex-col items-center gap-2 p-2 rounded-xl hover:bg-white/10 transition-all duration-300"
                >
                  <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white/20">
                    <img src={month.image} alt={month.label} className="w-full h-full object-cover" />
                  </div>
                  <span className="text-xs text-gray-300">{month.value}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeFilter === 'theme' && (
        <div className="absolute bottom-48 left-4 right-4 z-30 animate-scale-in">
          <div className="bg-black/80 backdrop-blur-xl rounded-3xl p-6 border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Pick your vibe — we'll show you where</h3>
              <button onClick={() => setActiveFilter(null)} className="p-2 hover:bg-white/10 rounded-lg">
                <X size={20} className="text-gray-400" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-4">
              {THEMES.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => handleThemeToggle(theme.id)}
                  className={`p-4 rounded-2xl transition-all duration-300 ${
                    selectedThemes.includes(theme.id)
                      ? `bg-gradient-to-br ${theme.color} border-2 border-yellow-200`
                      : 'bg-white/5 border-2 border-white/10 hover:bg-white/10'
                  }`}
                >
                  <div className="text-3xl mb-2">{theme.emoji}</div>
                  <div className="text-sm font-medium text-white">{theme.label}</div>
                </button>
              ))}
            </div>
            <button
              onClick={handleThemeApply}
              disabled={selectedThemes.length === 0}
              className="w-full bg-yellow-200 hover:bg-yellow-100 disabled:bg-gray-700 disabled:text-gray-500 text-black font-semibold py-3 rounded-full transition-all"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}

      {activeFilter === 'distance' && (
        <div className="absolute bottom-48 left-4 right-4 z-30 animate-scale-in">
          <div className="bg-black/80 backdrop-blur-xl rounded-3xl p-6 border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Set your radius — we'll find nearby wonders</h3>
              <button onClick={() => setActiveFilter(null)} className="p-2 hover:bg-white/10 rounded-lg">
                <X size={20} className="text-gray-400" />
              </button>
            </div>
            <div className="space-y-3">
              {TRAVEL_DISTANCES.map((distance) => (
                <button
                  key={distance.range}
                  onClick={() => handleDistanceSelect(distance)}
                  className="w-full p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all text-left"
                >
                  <span className="text-white font-medium">{distance.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Surprise Me Result */}
      {surpriseLocation && (
        <div className="absolute inset-x-4 top-1/3 z-30 animate-scale-in">
          <div className="bg-black/90 backdrop-blur-xl rounded-3xl p-8 border border-yellow-200/30 text-center">
            <Sparkles size={48} className="text-yellow-200 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">This might be your next adventure</h2>
            <p className="text-lg text-gray-300 mb-6">{surpriseLocation.name} in June</p>
            <div className="flex gap-3">
              <button
                onClick={() => navigate(`/collections`)}
                className="flex-1 bg-yellow-200 hover:bg-yellow-100 text-black font-semibold py-3 rounded-full transition-all"
              >
                Save to Vault
              </button>
              <button
                onClick={handleSurpriseMe}
                className="flex-1 bg-white/10 hover:bg-white/20 text-white font-semibold py-3 rounded-full border border-white/20 transition-all"
              >
                Spin Again
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Post-Filter State: Country Thumbnails */}
      {isFiltered && !surpriseLocation && (
        <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black via-black/95 to-transparent z-20 animate-slide-up">
          <div className="p-6 h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold text-white mb-1">
                  {selectedMonth ? `Perfect for ${MONTHS.find(m => m.value === selectedMonth)?.label}` : 
                   selectedThemes.length > 0 ? 'Trips for your vibe' :
                   selectedDistance ? 'Nearby destinations' : 'Recommended for you'}
                </h2>
                <p className="text-sm text-gray-400">
                  {MOCK_COUNTRIES.length} destinations match your filters
                </p>
              </div>
              <button 
                onClick={clearFilters}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full text-sm text-white transition-all"
              >
                Clear
              </button>
            </div>

            {/* Country Carousel */}
            <div className="flex-1 overflow-x-auto overflow-y-hidden scrollbar-hide">
              <div className="flex gap-4 pb-4 h-full">
                {MOCK_COUNTRIES.map((country) => (
                  <button
                    key={country.id}
                    onClick={() => navigate(`/vault/${country.id}`)}
                    className="flex-shrink-0 w-72 h-full rounded-2xl overflow-hidden bg-gray-900 border border-gray-800 hover:border-yellow-200/50 transition-all duration-600 hover:scale-[1.02] group"
                  >
                    <div className="relative h-2/3">
                      <img 
                        src={country.image} 
                        alt={country.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[900ms]"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                      <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="text-2xl font-bold text-white mb-1">{country.name}</h3>
                      </div>
                    </div>
                    <div className="p-4 h-1/3 flex flex-col justify-between">
                      <p className="text-sm text-gray-300 line-clamp-2">{country.reason}</p>
                      <div className="flex items-center text-yellow-200 text-sm font-medium mt-2">
                        <span>Explore vaults</span>
                        <ChevronRight size={16} className="ml-1" />
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Spinning indicator */}
      {isSpinning && (
        <div className="absolute inset-0 flex items-center justify-center z-30 bg-black/50">
          <div className="text-center">
            <Sparkles size={64} className="text-yellow-200 mx-auto mb-4 animate-spin" />
            <p className="text-white text-lg">Discovering your next adventure...</p>
          </div>
        </div>
      )}

      {/* Collapsible Bottom Navigation Bar */}
      <div 
        className={`fixed bottom-0 left-0 right-0 z-40 transition-all duration-300 ${
          isNavVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
        }`}
        style={{
          height: '72px',
          backgroundColor: 'rgba(17, 17, 17, 0.6)',
          backdropFilter: 'blur(20px)',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)'
        }}
        onMouseEnter={() => {
          setIsNavVisible(true)
          if (navHideTimeout.current) clearTimeout(navHideTimeout.current)
        }}
        onMouseLeave={() => {
          navHideTimeout.current = setTimeout(() => {
            setIsNavVisible(false)
          }, 1500)
        }}
        role="navigation"
        aria-label="Navigation bar – collapsible. Appears when you reach the bottom of the screen."
      >
        <div className="h-full flex items-center justify-around px-4 max-w-md mx-auto">
          {/* Explore */}
          <button
            onClick={() => navigate('/explore')}
            className="flex flex-col items-center justify-center gap-1 w-16 h-16 transition-all"
            style={{ minWidth: '44px', minHeight: '44px' }}
            aria-label="Explore"
          >
            <Compass 
              size={24} 
              className="transition-colors"
              style={{ color: '#FFD15C' }}
            />
            <span className="text-xs font-medium" style={{ color: '#FFD15C' }}>Explore</span>
          </button>

          {/* Collections */}
          <button
            onClick={() => navigate('/collections')}
            className="flex flex-col items-center justify-center gap-1 w-16 h-16 transition-all"
            style={{ minWidth: '44px', minHeight: '44px' }}
            aria-label="Collections"
          >
            <Bookmark 
              size={24} 
              className="transition-colors"
              style={{ color: '#80838A' }}
            />
            <span className="text-xs font-medium" style={{ color: '#80838A' }}>Collections</span>
          </button>

          {/* Your Trip */}
          <button
            onClick={() => navigate('/trip')}
            className="flex flex-col items-center justify-center gap-1 w-16 h-16 transition-all"
            style={{ minWidth: '44px', minHeight: '44px' }}
            aria-label="Your Trip"
          >
            <MapPin 
              size={24} 
              className="transition-colors"
              style={{ color: '#80838A' }}
            />
            <span className="text-xs font-medium" style={{ color: '#80838A' }}>Your Trip</span>
          </button>

          {/* Ask Verso */}
          <button
            onClick={() => {
              // TODO: Implement Ask Verso feature
              console.log('Ask Verso clicked')
            }}
            className="flex flex-col items-center justify-center gap-1 w-16 h-16 transition-all"
            style={{ minWidth: '44px', minHeight: '44px' }}
            aria-label="Ask Verso"
          >
            <MessageCircle 
              size={24} 
              className="transition-colors"
              style={{ color: '#80838A' }}
            />
            <span className="text-xs font-medium" style={{ color: '#80838A' }}>Ask Verso</span>
          </button>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.5);
            opacity: 0.5;
          }
        }
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        @keyframes slide-up {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
        .animate-scale-in {
          animation: scale-in 0.6s ease-out;
        }
        .animate-slide-up {
          animation: slide-up 0.9s ease-out;
        }
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
