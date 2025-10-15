import React, { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Calendar, Users, MapPin, Plane, Train, CheckCircle, ArrowRight, Sparkles, Home } from 'lucide-react'
import { fetchPexelsImages } from '../services/pexels'

type FlowPhase = 'context' | 'neighborhood' | 'stay' | 'flight' | 'visa' | 'logistics' | 'complete'

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

const DEMO_NEIGHBORHOODS: NeighborhoodOption[] = [
  {
    id: 'gion',
    name: 'Gion',
    vibe: 'Cultural · Riverside calm',
    tags: ['Best for Couples', 'Traditional'],
    image_keywords: 'gion kyoto geisha district evening'
  },
  {
    id: 'arashiyama',
    name: 'Arashiyama',
    vibe: 'Nature · Peaceful retreat',
    tags: ['Best for Nature Lovers', 'Scenic'],
    image_keywords: 'arashiyama bamboo forest mountain'
  },
  {
    id: 'pontocho',
    name: 'Pontocho',
    vibe: 'Dining · Nightlife hub',
    tags: ['Best for Foodies', 'Vibrant'],
    image_keywords: 'pontocho kyoto alley restaurants night'
  }
]

const DEMO_STAYS: StayOption[] = [
  {
    id: 'gion_house',
    name: 'The Gion House',
    description: 'Charming townhouse with local breakfast',
    amenities: ['Traditional rooms', 'Breakfast included', '5 min walk to temples'],
    image_keywords: 'traditional japanese house gion interior'
  },
  {
    id: 'hyatt_kyoto',
    name: 'Hyatt Centric Kyoto',
    description: 'Modern design, 5 mins from train',
    amenities: ['Rooftop bar', 'Gym & spa', 'Central location'],
    image_keywords: 'modern hotel kyoto interior design'
  },
  {
    id: 'machiya_retreat',
    name: 'Machiya Retreat',
    description: 'Authentic wooden home, quiet alleyway',
    amenities: ['Private courtyard', 'Tatami rooms', 'Tea ceremony space'],
    image_keywords: 'machiya house kyoto wooden interior'
  }
]

export const TripCompanionFlow: React.FC = () => {
  const navigate = useNavigate()
  const [phase, setPhase] = useState<FlowPhase>('context')
  const [tripContext, setTripContext] = useState<TripContext>({
    destination: 'Kyoto',
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

  // Load images when phase changes
  useEffect(() => {
    if (phase === 'neighborhood') {
      loadNeighborhoodImages()
    } else if (phase === 'stay') {
      loadStayImages()
    }
  }, [phase])

  const loadNeighborhoodImages = async () => {
    setLoading(true)
    const images: Record<string, string> = {}
    for (const neighborhood of DEMO_NEIGHBORHOODS) {
      const photos = await fetchPexelsImages(neighborhood.image_keywords, 1)
      if (photos.length > 0) {
        images[neighborhood.id] = photos[0].src.large2x
      }
    }
    setNeighborhoodImages(images)
    setLoading(false)
  }

  const loadStayImages = async () => {
    setLoading(true)
    const images: Record<string, string> = {}
    for (const stay of DEMO_STAYS) {
      const photos = await fetchPexelsImages(stay.image_keywords, 1)
      if (photos.length > 0) {
        images[stay.id] = photos[0].src.large2x
      }
    }
    setStayImages(images)
    setLoading(false)
  }

  const renderPhaseContent = () => {
    switch (phase) {
      case 'context':
        return (
          <div className="min-h-screen bg-black text-white flex flex-col">
            {/* Hero Destination Card */}
            <div className="p-6 border-b border-gray-800">
              <div className="bg-gradient-to-br from-yellow-900/20 to-purple-900/20 rounded-2xl p-6 border border-yellow-500/20">
                <h1 className="text-3xl font-bold mb-2">{tripContext.destination}</h1>
                <p className="text-gray-400 text-sm">Let's shape your journey together</p>
              </div>
            </div>

            {/* Question 1: When */}
            <div className="flex-1 p-6 space-y-8 animate-fade-in">
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <Sparkles size={20} className="text-yellow-200" />
                  <p className="text-yellow-200/80 text-lg italic">
                    When are you planning to travel?
                  </p>
                </div>
                
                <div className="grid grid-cols-4 gap-3 mb-4">
                  {MONTHS.map((month) => (
                    <button
                      key={month}
                      onClick={() => setTripContext({ ...tripContext, travelMonth: month })}
                      className={`p-4 rounded-xl border transition-all ${
                        tripContext.travelMonth === month
                          ? 'bg-yellow-200/20 border-yellow-200 text-yellow-200 scale-105'
                          : 'bg-gray-900 border-gray-700 text-white hover:border-gray-600'
                      }`}
                    >
                      <span className="text-sm font-medium">{month}</span>
                    </button>
                  ))}
                </div>
                
                {tripContext.travelMonth === 'Mar' && (
                  <p className="text-gray-400 text-sm italic">
                    ✨ Perfect choice — March is ideal for cherry blossoms
                  </p>
                )}
              </div>

              {/* Question 2: Who */}
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <Users size={20} className="text-yellow-200" />
                  <p className="text-yellow-200/80 text-lg italic">
                    Who's traveling with you?
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { id: 'solo', label: 'Solo', icon: '👤' },
                    { id: 'couple', label: 'Couple', icon: '👥' },
                    { id: 'family', label: 'Family', icon: '👨‍👩‍👧' },
                    { id: 'friends', label: 'Friends', icon: '👯' }
                  ].map((option) => (
                    <button
                      key={option.id}
                      onClick={() => setTripContext({ ...tripContext, travelers: option.id as any })}
                      className={`p-6 rounded-xl border transition-all ${
                        tripContext.travelers === option.id
                          ? 'bg-yellow-200/20 border-yellow-200 scale-105'
                          : 'bg-gray-900 border-gray-700 hover:border-gray-600'
                      }`}
                    >
                      <div className="text-3xl mb-2">{option.icon}</div>
                      <span className="text-sm font-medium text-white">{option.label}</span>
                    </button>
                  ))}
                </div>
                
                {tripContext.travelers === 'couple' && (
                  <p className="text-gray-400 text-sm italic mt-4">
                    ✨ I'll pace your trip for two
                  </p>
                )}
              </div>

              {/* Question 3: Duration */}
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <Calendar size={20} className="text-yellow-200" />
                  <p className="text-yellow-200/80 text-lg italic">
                    How long do you want this escape to be?
                  </p>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  {DURATION_OPTIONS.map((days) => (
                    <button
                      key={days}
                      onClick={() => setTripContext({ ...tripContext, duration: days })}
                      className={`p-6 rounded-xl border transition-all ${
                        tripContext.duration === days
                          ? 'bg-yellow-200/20 border-yellow-200 scale-105'
                          : 'bg-gray-900 border-gray-700 hover:border-gray-600'
                      }`}
                    >
                      <div className="text-3xl font-bold text-white mb-1">{days}</div>
                      <span className="text-xs text-gray-400">days</span>
                    </button>
                  ))}
                </div>
                
                <p className="text-gray-400 text-sm italic mt-4">
                  We'll keep it balanced — not a checklist, a rhythm
                </p>
              </div>

              {/* Question 4: Home City */}
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <Home size={20} className="text-yellow-200" />
                  <p className="text-yellow-200/80 text-lg italic">
                    Where are you starting from?
                  </p>
                </div>
                
                <input
                  type="text"
                  value={tripContext.homeCity}
                  onChange={(e) => setTripContext({ ...tripContext, homeCity: e.target.value })}
                  className="w-full bg-gray-900 border border-gray-700 rounded-xl px-6 py-4 text-white placeholder-gray-500 focus:border-yellow-200 focus:outline-none transition-colors"
                  placeholder="Your home city"
                />
                
                <p className="text-gray-400 text-sm italic mt-4">
                  That helps me plan routes better
                </p>
              </div>
            </div>

            {/* Bottom CTA */}
            <div className="p-6 border-t border-gray-800">
              <button
                onClick={() => setPhase('neighborhood')}
                className="w-full bg-yellow-200 hover:bg-yellow-300 text-black font-semibold py-4 rounded-full transition-all flex items-center justify-center gap-2 hover:scale-105"
              >
                <span>Perfect. Now, let's choose where you'll feel most at home</span>
                <ArrowRight size={20} />
              </button>
            </div>
          </div>
        )

      case 'neighborhood':
        return (
          <div className="min-h-screen bg-black text-white">
            {/* Header */}
            <div className="p-6 border-b border-gray-800">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles size={20} className="text-yellow-200" />
                <p className="text-yellow-200/80 text-lg italic">
                  Let's find your perfect neighbourhood in {tripContext.destination}
                </p>
              </div>
              <p className="text-gray-400 text-sm">
                Choose a base that matches your vibe
              </p>
            </div>

            {/* Neighborhood Cards */}
            <div className="p-6 space-y-6">
              {DEMO_NEIGHBORHOODS.map((neighborhood) => (
                <button
                  key={neighborhood.id}
                  onClick={() => setSelectedNeighborhood(neighborhood.id)}
                  className={`w-full group transition-all ${
                    selectedNeighborhood === neighborhood.id ? 'scale-105' : ''
                  }`}
                >
                  <div className={`rounded-3xl overflow-hidden border-2 transition-all ${
                    selectedNeighborhood === neighborhood.id
                      ? 'border-yellow-200'
                      : 'border-gray-800 hover:border-gray-700'
                  }`}>
                    {/* Hero Image */}
                    <div className="relative h-64">
                      {neighborhoodImages[neighborhood.id] ? (
                        <img
                          src={neighborhoodImages[neighborhood.id]}
                          alt={neighborhood.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                          <MapPin size={48} className="text-gray-600" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                      
                      {/* Selection indicator */}
                      {selectedNeighborhood === neighborhood.id && (
                        <div className="absolute top-4 right-4">
                          <div className="bg-yellow-200 rounded-full p-2 animate-pulse-slow">
                            <CheckCircle size={24} className="text-black" />
                          </div>
                        </div>
                      )}

                      {/* Content overlay */}
                      <div className="absolute bottom-0 left-0 right-0 p-6">
                        <h3 className="text-2xl font-bold text-white mb-2">{neighborhood.name}</h3>
                        <p className="text-white/80 text-sm mb-3">{neighborhood.vibe}</p>
                        <div className="flex gap-2 flex-wrap">
                          {neighborhood.tags.map((tag) => (
                            <span
                              key={tag}
                              className="px-3 py-1 bg-black/60 backdrop-blur-md rounded-full text-xs text-white border border-white/20"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Bottom CTA */}
            {selectedNeighborhood && (
              <div className="p-6 border-t border-gray-800 animate-fade-in">
                <p className="text-gray-400 text-sm italic mb-4 text-center">
                  That's a lovely choice — {DEMO_NEIGHBORHOODS.find(n => n.id === selectedNeighborhood)?.name} has beautiful evening walks
                </p>
                <button
                  onClick={() => setPhase('stay')}
                  className="w-full bg-yellow-200 hover:bg-yellow-300 text-black font-semibold py-4 rounded-full transition-all flex items-center justify-center gap-2 hover:scale-105"
                >
                  <span>Now, let's anchor you here with the right stay</span>
                  <ArrowRight size={20} />
                </button>
              </div>
            )}
          </div>
        )

      case 'stay':
        return (
          <div className="min-h-screen bg-black text-white">
            {/* Header */}
            <div className="p-6 border-b border-gray-800">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles size={20} className="text-yellow-200" />
                <p className="text-yellow-200/80 text-lg italic">
                  Let's find your perfect stay in {DEMO_NEIGHBORHOODS.find(n => n.id === selectedNeighborhood)?.name}
                </p>
              </div>
              <p className="text-gray-400 text-sm">
                Choose a place that feels right
              </p>
            </div>

            {/* Stay Cards */}
            <div className="p-6 space-y-6">
              {DEMO_STAYS.map((stay) => (
                <button
                  key={stay.id}
                  onClick={() => setSelectedStay(stay.id)}
                  className={`w-full group transition-all ${
                    selectedStay === stay.id ? 'scale-105' : ''
                  }`}
                >
                  <div className={`rounded-3xl overflow-hidden border-2 transition-all ${
                    selectedStay === stay.id
                      ? 'border-yellow-200'
                      : 'border-gray-800 hover:border-gray-700'
                  }`}>
                    {/* Hero Image */}
                    <div className="relative h-48">
                      {stayImages[stay.id] ? (
                        <img
                          src={stayImages[stay.id]}
                          alt={stay.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                          <Home size={36} className="text-gray-600" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                      
                      {/* Selection indicator */}
                      {selectedStay === stay.id && (
                        <div className="absolute top-4 right-4">
                          <div className="bg-yellow-200 rounded-full p-2 animate-pulse-slow">
                            <CheckCircle size={20} className="text-black" />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Details */}
                    <div className="p-4 bg-gray-900">
                      <h3 className="text-lg font-bold text-white mb-1">{stay.name}</h3>
                      <p className="text-gray-400 text-sm mb-3">{stay.description}</p>
                      <div className="space-y-1">
                        {stay.amenities.map((amenity) => (
                          <p key={amenity} className="text-xs text-gray-500">
                            • {amenity}
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Bottom CTA */}
            {selectedStay && (
              <div className="p-6 border-t border-gray-800 animate-fade-in">
                <p className="text-gray-400 text-sm italic mb-4 text-center">
                  Beautiful. I've locked this stay for your time in {DEMO_NEIGHBORHOODS.find(n => n.id === selectedNeighborhood)?.name}
                </p>
                <button
                  onClick={() => setPhase('flight')}
                  className="w-full bg-yellow-200 hover:bg-yellow-300 text-black font-semibold py-4 rounded-full transition-all flex items-center justify-center gap-2 hover:scale-105"
                >
                  <span>Now, let's make sure you're all set to fly there comfortably</span>
                  <ArrowRight size={20} />
                </button>
              </div>
            )}
          </div>
        )

      case 'flight':
        return (
          <div className="min-h-screen bg-black text-white flex flex-col">
            {/* Header */}
            <div className="p-6 border-b border-gray-800">
              <div className="flex items-center gap-2 mb-2">
                <Plane size={20} className="text-yellow-200" />
                <p className="text-yellow-200/80 text-lg italic">
                  Let's plan your flight from {tripContext.homeCity} to {tripContext.destination}
                </p>
              </div>
              <p className="text-gray-400 text-sm">
                I'll keep this simple and flexible
              </p>
            </div>

            {/* Flight Options */}
            <div className="flex-1 p-6 space-y-4">
              {[
                { id: 'ana', airline: 'ANA 838', description: 'Morning flight · Arrive mid-afternoon', price: '$850' },
                { id: 'sg', airline: 'Singapore Airlines 503', description: '1 stop via Singapore', price: '$720' },
                { id: 'jal', airline: 'Japan Airlines 720', description: 'Overnight flight · Sleep while you fly', price: '$880' }
              ].map((flight) => (
                <button
                  key={flight.id}
                  className="w-full bg-gray-900 hover:bg-gray-850 rounded-2xl p-5 border border-gray-800 hover:border-yellow-200/50 transition-all text-left"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-white font-semibold mb-1">{flight.airline}</h3>
                      <p className="text-gray-400 text-sm">{flight.description}</p>
                    </div>
                    <span className="text-yellow-200 font-semibold">{flight.price}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>11h 30m</span>
                    <span>Direct</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Bottom CTA */}
            <div className="p-6 border-t border-gray-800">
              <button
                onClick={() => setPhase('visa')}
                className="w-full bg-yellow-200 hover:bg-yellow-300 text-black font-semibold py-4 rounded-full transition-all flex items-center justify-center gap-2 hover:scale-105"
              >
                <span>Flights secured. Let's check visa requirements</span>
                <ArrowRight size={20} />
              </button>
            </div>
          </div>
        )

      case 'visa':
        return (
          <div className="min-h-screen bg-black text-white flex flex-col">
            {/* Header */}
            <div className="p-6 border-b border-gray-800">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle size={20} className="text-green-400" />
                <p className="text-yellow-200/80 text-lg italic">
                  Let's check your visa requirements
                </p>
              </div>
              <p className="text-gray-400 text-sm">
                Making sure you're all set for entry
              </p>
            </div>

            {/* Visa Status */}
            <div className="flex-1 p-6">
              <div className="bg-green-900/20 border border-green-500/30 rounded-2xl p-6 mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <CheckCircle size={32} className="text-green-400" />
                  <div>
                    <h3 className="text-white font-semibold text-lg">Visa-free entry</h3>
                    <p className="text-gray-400 text-sm">US passport holders can stay up to 90 days</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-900 rounded-2xl p-5 border border-gray-800 mb-6">
                <p className="text-white font-medium mb-4">Entry requirements:</p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle size={18} className="text-green-400 mt-0.5" />
                    <span className="text-gray-400 text-sm">Valid passport (6+ months validity)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle size={18} className="text-green-400 mt-0.5" />
                    <span className="text-gray-400 text-sm">Return flight ticket</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle size={18} className="text-green-400 mt-0.5" />
                    <span className="text-gray-400 text-sm">Proof of accommodation</span>
                  </li>
                </ul>
              </div>

              <p className="text-gray-400 text-sm italic text-center">
                I can help you gather documents and track updates
              </p>
            </div>

            {/* Bottom CTA */}
            <div className="p-6 border-t border-gray-800">
              <button
                onClick={() => setPhase('logistics')}
                className="w-full bg-yellow-200 hover:bg-yellow-300 text-black font-semibold py-4 rounded-full transition-all flex items-center justify-center gap-2 hover:scale-105"
              >
                <span>Everything's ready. Let's finalize local details</span>
                <ArrowRight size={20} />
              </button>
            </div>
          </div>
        )

      case 'logistics':
        return (
          <div className="min-h-screen bg-black text-white flex flex-col">
            {/* Header */}
            <div className="p-6 border-b border-gray-800">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles size={20} className="text-yellow-200" />
                <p className="text-yellow-200/80 text-lg italic">
                  Let's wrap up the final details
                </p>
              </div>
              <p className="text-gray-400 text-sm">
                Local commutes, cafés, and bookings
              </p>
            </div>

            {/* Commute Section */}
            <div className="flex-1 p-6 space-y-6">
              <div>
                <p className="text-gray-400 text-xs uppercase tracking-wide mb-4">Commute Connections</p>
                <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
                  <span className="text-white text-sm whitespace-nowrap">🏠 {tripContext.homeCity}</span>
                  <span className="text-gray-500">✈️</span>
                  <span className="text-white text-sm whitespace-nowrap">{tripContext.destination}</span>
                  <span className="text-gray-500">🚆</span>
                  <span className="text-white text-sm whitespace-nowrap">Tokyo</span>
                  <span className="text-gray-500">✈️</span>
                  <span className="text-white text-sm whitespace-nowrap">🏠 {tripContext.homeCity}</span>
                </div>
                <p className="text-gray-400 text-sm italic mt-3">
                  We'll take the Shinkansen — 2 hours, scenic all the way
                </p>
              </div>

              {/* Cafés Preview */}
              <div>
                <p className="text-gray-400 text-xs uppercase tracking-wide mb-4">Cafés & Restaurants</p>
                <div className="space-y-3">
                  <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
                    <p className="text-white font-medium mb-1">☕ Fuglen Tokyo</p>
                    <p className="text-gray-400 text-sm mb-2">Brunch · Near Shibuya</p>
                    <button className="text-yellow-200 text-sm font-medium">Reserve a table</button>
                  </div>
                  <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
                    <p className="text-white font-medium mb-1">🍣 Uobei Sushi</p>
                    <p className="text-gray-400 text-sm mb-2">Quick lunch · Conveyor belt</p>
                    <button className="text-yellow-200 text-sm font-medium">Reserve a table</button>
                  </div>
                </div>
              </div>

              {/* Activity Booking */}
              <div>
                <p className="text-gray-400 text-xs uppercase tracking-wide mb-4">Activity Confirmations</p>
                <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-xl p-4">
                  <p className="text-yellow-200 text-sm">
                    ⚠️ 2 activities recommended for booking — shall I confirm them now?
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom CTA */}
            <div className="p-6 border-t border-gray-800">
              <p className="text-gray-400 text-sm italic mb-4 text-center">
                Everything's shaping up beautifully
              </p>
              <button
                onClick={() => setPhase('complete')}
                className="w-full bg-yellow-200 hover:bg-yellow-300 text-black font-semibold py-4 rounded-full transition-all flex items-center justify-center gap-2 hover:scale-105"
              >
                <span>I've synced everything — ready to preview your journey</span>
                <ArrowRight size={20} />
              </button>
            </div>
          </div>
        )

      case 'complete':
        return (
          <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6">
            <div className="text-center max-w-md animate-fade-in">
              <div className="w-24 h-24 bg-yellow-200/20 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse-slow">
                <Sparkles size={48} className="text-yellow-200" />
              </div>
              
              <h1 className="text-3xl font-bold mb-4">Your journey is ready</h1>
              <p className="text-gray-400 mb-8 leading-relaxed">
                I've woven together your flights, stays, and bookings into a beautiful itinerary. 
                Everything flows naturally — just as you imagined.
              </p>

              <button
                onClick={() => navigate('/trip/1')}
                className="w-full bg-yellow-200 hover:bg-yellow-300 text-black font-semibold py-4 rounded-full transition-all hover:scale-105 mb-3"
              >
                View Your Journey
              </button>
              
              <button
                onClick={() => navigate('/collections')}
                className="w-full bg-gray-900 hover:bg-gray-850 text-white font-medium py-4 rounded-full transition-colors border border-gray-700"
              >
                Back to Collections
              </button>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-black">
      {renderPhaseContent()}
    </div>
  )
}
