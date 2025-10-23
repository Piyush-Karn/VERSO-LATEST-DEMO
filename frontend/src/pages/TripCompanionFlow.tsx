import React, { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Calendar, Users, MapPin, Plane, CheckCircle, Sparkles, Home, Loader2 } from 'lucide-react'
import { fetchPexelsImages } from '../services/pexels'

type FlowPhase = 'when' | 'who' | 'duration' | 'home' | 'neighborhood' | 'stay' | 'generating' | 'complete'

interface TripContext {
  destination: string
  travelMonth: string
  travelers: 'solo' | 'couple' | 'family' | 'friends'
  duration: number
  homeCity: string
}

interface NeighborhoodOption {
  id: string
  name: string
  vibe: string
  tags: string[]
  image_keywords: string
}

interface StayOption {
  id: string
  name: string
  description: string
  amenities: string[]
  image_keywords: string
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const DURATION_OPTIONS = [3, 5, 7, 10, 14, 21]

const NEIGHBORHOODS_BY_DESTINATION: Record<string, NeighborhoodOption[]> = {
  'Kyoto': [
    { id: 'gion', name: 'Gion', vibe: 'Cultural · Riverside calm', tags: ['Best for Couples', 'Traditional'], image_keywords: 'gion kyoto geisha district evening' },
    { id: 'arashiyama', name: 'Arashiyama', vibe: 'Nature · Peaceful retreat', tags: ['Best for Nature Lovers', 'Scenic'], image_keywords: 'arashiyama bamboo forest mountain' },
    { id: 'pontocho', name: 'Pontocho', vibe: 'Dining · Nightlife hub', tags: ['Best for Foodies', 'Vibrant'], image_keywords: 'pontocho kyoto alley restaurants night' }
  ],
  'Japan': [
    { id: 'shibuya', name: 'Shibuya', vibe: 'Urban energy · Neon nights', tags: ['Best for Nightlife', 'Shopping'], image_keywords: 'shibuya tokyo crossing night neon' },
    { id: 'asakusa', name: 'Asakusa', vibe: 'Traditional · Temple district', tags: ['Best for Culture', 'Historic'], image_keywords: 'asakusa tokyo sensoji temple traditional' },
    { id: 'harajuku', name: 'Harajuku', vibe: 'Youth culture · Fashion hub', tags: ['Best for Shopping', 'Trendy'], image_keywords: 'harajuku tokyo fashion street colorful' }
  ],
  'default': [
    { id: 'downtown', name: 'Downtown', vibe: 'Urban center · Vibrant energy', tags: ['Best for First-timers', 'Central'], image_keywords: 'city center downtown urban night' },
    { id: 'historic', name: 'Historic Quarter', vibe: 'Cultural heritage · Old town charm', tags: ['Best for Culture', 'Traditional'], image_keywords: 'historic quarter old town streets' },
    { id: 'waterfront', name: 'Waterfront', vibe: 'Scenic views · Relaxed atmosphere', tags: ['Best for Relaxation', 'Scenic'], image_keywords: 'waterfront harbor ocean view sunset' }
  ]
}

const STAYS_BY_DESTINATION: Record<string, StayOption[]> = {
  'Kyoto': [
    { id: 'gion_house', name: 'The Gion House', description: 'Charming townhouse with local breakfast', amenities: ['Traditional rooms', 'Breakfast included', '5 min walk to temples'], image_keywords: 'traditional japanese house gion interior' },
    { id: 'hyatt_kyoto', name: 'Hyatt Centric Kyoto', description: 'Modern design, 5 mins from train', amenities: ['Rooftop bar', 'Gym & spa', 'Central location'], image_keywords: 'modern hotel kyoto interior design' },
    { id: 'machiya_retreat', name: 'Machiya Retreat', description: 'Authentic wooden home, quiet alleyway', amenities: ['Private courtyard', 'Tatami rooms', 'Tea ceremony space'], image_keywords: 'machiya house kyoto wooden interior' }
  ],
  'Japan': [
    { id: 'tokyo_modern', name: 'Park Hyatt Tokyo', description: 'Luxury in the sky with city views', amenities: ['Peak fitness center', 'New York Grill', 'Pool & spa'], image_keywords: 'park hyatt tokyo luxury hotel interior' },
    { id: 'capsule_zen', name: 'Nine Hours Capsule', description: 'Minimalist capsule hotel experience', amenities: ['Ultra-modern pods', 'Shared lounge', 'Budget-friendly'], image_keywords: 'capsule hotel tokyo modern minimalist' },
    { id: 'ryokan_tokyo', name: 'Hoshinoya Tokyo', description: 'Traditional ryokan in modern Tokyo', amenities: ['Onsen baths', 'Kaiseki dining', 'Tatami rooms'], image_keywords: 'ryokan tokyo traditional japanese interior' }
  ],
  'default': [
    { id: 'boutique', name: 'Boutique Central Hotel', description: 'Design-forward hotel in prime location', amenities: ['Rooftop terrace', 'Restaurant & bar', 'Central location'], image_keywords: 'boutique hotel modern interior design' },
    { id: 'heritage', name: 'Heritage House', description: 'Historic property with modern comforts', amenities: ['Traditional architecture', 'Local breakfast', 'Cultural experience'], image_keywords: 'heritage hotel traditional architecture interior' },
    { id: 'modern_stay', name: 'Modern Stay', description: 'Contemporary rooms with all amenities', amenities: ['Gym & pool', 'Business center', 'Fast WiFi'], image_keywords: 'modern hotel room contemporary interior' }
  ]
}

export const TripCompanionFlow: React.FC = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const destinationParam = searchParams.get('destination') || 'Kyoto'
  
  const [phase, setPhase] = useState<FlowPhase>('when')
  const [tripContext, setTripContext] = useState<TripContext>({
    destination: destinationParam,
    travelMonth: 'Mar',
    travelers: 'couple',
    duration: 7,
    homeCity: 'San Francisco'
  })
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<string | null>(null)
  const [selectedStay, setSelectedStay] = useState<string | null>(null)
  const [neighborhoodImages, setNeighborhoodImages] = useState<Record<string, string>>({})
  const [stayImages, setStayImages] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)

  const getNeighborhoods = () => NEIGHBORHOODS_BY_DESTINATION[tripContext.destination] || NEIGHBORHOODS_BY_DESTINATION['default']
  const getStays = () => STAYS_BY_DESTINATION[tripContext.destination] || STAYS_BY_DESTINATION['default']

  useEffect(() => {
    if (phase === 'neighborhood') loadNeighborhoodImages()
    else if (phase === 'stay') loadStayImages()
    else if (phase === 'generating') {
      const timer = setTimeout(() => setPhase('complete'), 3000)
      return () => clearTimeout(timer)
    }
  }, [phase])

  const loadNeighborhoodImages = async () => {
    setLoading(true)
    const images: Record<string, string> = {}
    for (const neighborhood of getNeighborhoods()) {
      const photos = await fetchPexelsImages(neighborhood.image_keywords, 1)
      if (photos.length > 0) images[neighborhood.id] = photos[0].src.large2x
    }
    setNeighborhoodImages(images)
    setLoading(false)
  }

  const loadStayImages = async () => {
    setLoading(true)
    const images: Record<string, string> = {}
    for (const stay of getStays()) {
      const photos = await fetchPexelsImages(stay.image_keywords, 1)
      if (photos.length > 0) images[stay.id] = photos[0].src.large2x
    }
    setStayImages(images)
    setLoading(false)
  }

  const Hero = () => (
    <div className="p-6 border-b border-gray-800">
      <div className="bg-gradient-to-br from-yellow-900/20 to-purple-900/20 rounded-2xl p-6 border border-yellow-500/20">
        <h1 className="text-3xl font-bold mb-2">{tripContext.destination}</h1>
        <p className="text-gray-400 text-sm">Let's shape your journey together</p>
      </div>
    </div>
  )

  const renderPhaseContent = () => {
    switch (phase) {
      case 'when':
        return (
          <div className="min-h-screen bg-black text-white flex flex-col animate-fade-in">
            <Hero />
            <div className="flex-1 p-6 flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-6">
                <Calendar size={20} className="text-yellow-200" />
                <p className="text-yellow-200/80 text-lg italic">When are you planning to travel?</p>
              </div>
              <div className="grid grid-cols-4 gap-3">
                {MONTHS.map((month) => (
                  <button key={month} onClick={() => setTripContext({ ...tripContext, travelMonth: month })}
                    className={`p-4 rounded-xl border transition-all ${tripContext.travelMonth === month ? 'bg-yellow-200/20 border-yellow-200 text-yellow-200 scale-105' : 'bg-gray-900 border-gray-700 text-white hover:border-gray-600'}`}>
                    <span className="text-sm font-medium">{month}</span>
                  </button>
                ))}
              </div>
              {tripContext.travelMonth === 'Mar' && <p className="text-gray-400 text-sm italic mt-4">March is ideal for cherry blossoms</p>}
            </div>
            <div className="p-6 border-t border-gray-800">
              <button onClick={() => setPhase('who')} className="w-full bg-yellow-200 hover:bg-yellow-300 text-black font-semibold py-4 rounded-full transition-all">Continue</button>
            </div>
          </div>
        )

      case 'who':
        return (
          <div className="min-h-screen bg-black text-white flex flex-col animate-fade-in">
            <Hero />
            <div className="flex-1 p-6 flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-6">
                <Users size={20} className="text-yellow-200" />
                <p className="text-yellow-200/80 text-lg italic">Who's traveling with you?</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { id: 'solo', label: 'Solo', icon: '👤' },
                  { id: 'couple', label: 'Couple', icon: '👥' },
                  { id: 'family', label: 'Family', icon: '👨‍👩‍👧' },
                  { id: 'friends', label: 'Friends', icon: '👯' }
                ].map((option) => (
                  <button key={option.id} onClick={() => setTripContext({ ...tripContext, travelers: option.id as any })}
                    className={`p-6 rounded-xl border transition-all ${tripContext.travelers === option.id ? 'bg-yellow-200/20 border-yellow-200 scale-105' : 'bg-gray-900 border-gray-700 hover:border-gray-600'}`}>
                    <div className="text-3xl mb-2">{option.icon}</div>
                    <span className="text-sm font-medium text-white">{option.label}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="p-6 border-t border-gray-800">
              <button onClick={() => setPhase('duration')} className="w-full bg-yellow-200 hover:bg-yellow-300 text-black font-semibold py-4 rounded-full transition-all">Continue</button>
            </div>
          </div>
        )

      case 'duration':
        return (
          <div className="min-h-screen bg-black text-white flex flex-col animate-fade-in">
            <Hero />
            <div className="flex-1 p-6 flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-6">
                <Calendar size={20} className="text-yellow-200" />
                <p className="text-yellow-200/80 text-lg italic">How long do you want this escape to be?</p>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {DURATION_OPTIONS.map((days) => (
                  <button key={days} onClick={() => setTripContext({ ...tripContext, duration: days })}
                    className={`p-6 rounded-xl border transition-all ${tripContext.duration === days ? 'bg-yellow-200/20 border-yellow-200 scale-105' : 'bg-gray-900 border-gray-700 hover:border-gray-600'}`}>
                    <div className="text-3xl font-bold text-white mb-1">{days}</div>
                    <span className="text-xs text-gray-400">days</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="p-6 border-t border-gray-800">
              <button onClick={() => setPhase('home')} className="w-full bg-yellow-200 hover:bg-yellow-300 text-black font-semibold py-4 rounded-full transition-all">Continue</button>
            </div>
          </div>
        )

      case 'home':
        return (
          <div className="min-h-screen bg-black text-white flex flex-col animate-fade-in">
            <Hero />
            <div className="flex-1 p-6 flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-6">
                <Home size={20} className="text-yellow-200" />
                <p className="text-yellow-200/80 text-lg italic">Where are you starting from?</p>
              </div>
              <input type="text" value={tripContext.homeCity} onChange={(e) => setTripContext({ ...tripContext, homeCity: e.target.value })}
                className="w-full bg-gray-900 border border-gray-700 rounded-xl px-6 py-4 text-white placeholder-gray-500 focus:border-yellow-200 focus:outline-none transition-colors"
                placeholder="Your home city" />
            </div>
            <div className="p-6 border-t border-gray-800">
              <button onClick={() => setPhase('neighborhood')} className="w-full bg-yellow-200 hover:bg-yellow-300 text-black font-semibold py-4 rounded-full transition-all">Continue</button>
            </div>
          </div>
        )

      case 'neighborhood':
        return (
          <div className="min-h-screen bg-black text-white">
            <div className="p-6 border-b border-gray-800">
              <div className="flex items-center gap-2 mb-2">
                <MapPin size={20} className="text-yellow-200" />
                <p className="text-yellow-200/80 text-lg italic">Choose your neighborhood</p>
              </div>
            </div>
            <div className="p-6 space-y-6 pb-32">
              {getNeighborhoods().map((neighborhood) => (
                <button key={neighborhood.id} onClick={() => setSelectedNeighborhood(neighborhood.id)}
                  className={`w-full group transition-all ${selectedNeighborhood === neighborhood.id ? 'scale-105' : ''}`}>
                  <div className={`rounded-3xl overflow-hidden border-2 transition-all ${selectedNeighborhood === neighborhood.id ? 'border-yellow-200' : 'border-gray-800 hover:border-gray-700'}`}>
                    <div className="relative h-64">
                      {neighborhoodImages[neighborhood.id] ? (
                        <img src={neighborhoodImages[neighborhood.id]} alt={neighborhood.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                      ) : (
                        <div className="w-full h-full bg-gray-800 flex items-center justify-center"><MapPin size={48} className="text-gray-600" /></div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                      {selectedNeighborhood === neighborhood.id && (
                        <div className="absolute top-4 right-4">
                          <div className="bg-yellow-200 rounded-full p-2 animate-pulse-slow"><CheckCircle size={24} className="text-black" /></div>
                        </div>
                      )}
                      <div className="absolute bottom-0 left-0 right-0 p-6">
                        <h3 className="text-2xl font-bold text-white mb-2">{neighborhood.name}</h3>
                        <p className="text-white/80 text-sm mb-3">{neighborhood.vibe}</p>
                        <div className="flex gap-2 flex-wrap">
                          {neighborhood.tags.map((tag) => (
                            <span key={tag} className="px-3 py-1 bg-black/60 backdrop-blur-md rounded-full text-xs text-white border border-white/20">{tag}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
            {selectedNeighborhood && (
              <div className="fixed bottom-0 left-0 right-0 p-6 border-t border-gray-800 bg-black/95 backdrop-blur-md animate-slide-up">
                <button onClick={() => setPhase('stay')} className="w-full bg-yellow-200 hover:bg-yellow-300 text-black font-semibold py-4 rounded-full transition-all">Continue</button>
              </div>
            )}
          </div>
        )

      case 'stay':
        return (
          <div className="min-h-screen bg-black text-white">
            <div className="p-6 border-b border-gray-800">
              <div className="flex items-center gap-2 mb-2">
                <Home size={20} className="text-yellow-200" />
                <p className="text-yellow-200/80 text-lg italic">Choose where you'll stay</p>
              </div>
            </div>
            <div className="p-6 space-y-6 pb-32">
              {getStays().map((stay) => (
                <button key={stay.id} onClick={() => setSelectedStay(stay.id)} className={`w-full group transition-all ${selectedStay === stay.id ? 'scale-105' : ''}`}>
                  <div className={`rounded-3xl overflow-hidden border-2 transition-all ${selectedStay === stay.id ? 'border-yellow-200' : 'border-gray-800 hover:border-gray-700'}`}>
                    <div className="relative h-48">
                      {stayImages[stay.id] ? (
                        <img src={stayImages[stay.id]} alt={stay.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                      ) : (
                        <div className="w-full h-full bg-gray-800 flex items-center justify-center"><Home size={36} className="text-gray-600" /></div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                      {selectedStay === stay.id && (
                        <div className="absolute top-4 right-4">
                          <div className="bg-yellow-200 rounded-full p-2 animate-pulse-slow"><CheckCircle size={20} className="text-black" /></div>
                        </div>
                      )}
                    </div>
                    <div className="p-4 bg-gray-900">
                      <h3 className="text-lg font-bold text-white mb-1">{stay.name}</h3>
                      <p className="text-gray-400 text-sm mb-3">{stay.description}</p>
                      <div className="space-y-1">
                        {stay.amenities.map((amenity) => (<p key={amenity} className="text-xs text-gray-500">• {amenity}</p>))}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
            {selectedStay && (
              <div className="fixed bottom-0 left-0 right-0 p-6 border-t border-gray-800 bg-black/95 backdrop-blur-md animate-slide-up">
                <button onClick={() => setPhase('generating')} className="w-full bg-yellow-200 hover:bg-yellow-300 text-black font-semibold py-4 rounded-full transition-all">Generate Trip</button>
              </div>
            )}
          </div>
        )

      case 'generating':
        return (
          <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 animate-fade-in">
            <div className="text-center max-w-md">
              <div className="relative mb-8">
                <div className="w-32 h-32 bg-yellow-200/20 rounded-full flex items-center justify-center mx-auto animate-pulse-slow">
                  <Sparkles size={64} className="text-yellow-200" style={{ animation: 'spin 3s linear infinite' }} />
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Loader2 size={48} className="text-yellow-200 animate-spin" />
                </div>
              </div>
              <h1 className="text-3xl font-bold mb-4">Crafting your journey</h1>
              <p className="text-gray-400 leading-relaxed mb-6">Weaving together flights, stays, and experiences</p>
              <div className="space-y-3 text-sm text-gray-500">
                <p className="animate-fade-in" style={{ animationDelay: '0.5s' }}>✓ Finding best connections</p>
                <p className="animate-fade-in" style={{ animationDelay: '1s' }}>✓ Securing your stay</p>
                <p className="animate-fade-in" style={{ animationDelay: '1.5s' }}>✓ Planning local experiences</p>
              </div>
            </div>
          </div>
        )

      case 'complete':
        return (
          <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 animate-fade-in">
            <div className="text-center max-w-md">
              <div className="w-24 h-24 bg-yellow-200/20 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse-slow">
                <Sparkles size={48} className="text-yellow-200" />
              </div>
              <h1 className="text-3xl font-bold mb-4">Your journey is ready</h1>
              <p className="text-gray-400 mb-8 leading-relaxed">Everything flows naturally — just as you imagined</p>
              <button onClick={() => navigate('/trip/1')} className="w-full bg-yellow-200 hover:bg-yellow-300 text-black font-semibold py-4 rounded-full transition-all mb-3">View Your Journey</button>
              <button onClick={() => navigate('/collections')} className="w-full bg-gray-900 hover:bg-gray-850 text-white font-medium py-4 rounded-full transition-colors border border-gray-700">Back to Collections</button>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return <div className="min-h-screen bg-black">{renderPhaseContent()}</div>
}
