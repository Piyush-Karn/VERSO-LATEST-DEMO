import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Calendar, MapPin, Heart, Users, Plus, ChevronRight, Sparkles, Plane, Train, Home, CheckCircle, Edit2, X, Trash2 } from 'lucide-react'

interface TripData {
  destination: string
  duration: number
  totalCities: number
  savedExperiences: number
  travelers: number
  route: RouteCity[]
  estimatedCost: number
  flightConfirmed: boolean
  visaConfirmed: boolean
}

interface RouteCity {
  id: string
  name: string
  days: number
  order: number
  transport: {
    mode: string
    emoji: string
    duration: string
  }
  experiences: Experience[]
  neighborhoods: string[]
  vibe: string
  status: 'planning' | 'confirmed'
}

interface Experience {
  id: string
  title: string
  type: 'activity' | 'cafe' | 'restaurant'
  day: number
  timeOfDay: string
  status: 'saved' | 'suggested' | 'booked'
  cost?: number
}

type BottomSheetType = 'days' | 'cities' | 'saved' | 'people' | 'flight' | 'train' | 'visa' | 'city-detail' | null

const DEMO_TRIP: TripData = {
  destination: 'Japan',
  duration: 8,
  totalCities: 3,
  savedExperiences: 12,
  travelers: 2,
  estimatedCost: 125000,
  flightConfirmed: false,
  visaConfirmed: false,
  route: [
    {
      id: 'tokyo',
      name: 'Tokyo',
      days: 3,
      order: 1,
      transport: { mode: 'Flight', emoji: '✈️', duration: '11h direct' },
      experiences: [
        { id: 'e1', title: 'Shibuya Crossing Food Tour', type: 'activity', day: 1, timeOfDay: 'evening', status: 'saved', cost: 3500 },
        { id: 'e2', title: 'Senso-ji Temple', type: 'activity', day: 2, timeOfDay: 'morning', status: 'saved', cost: 0 },
        { id: 'e3', title: 'Fuglen Tokyo', type: 'cafe', day: 2, timeOfDay: 'afternoon', status: 'suggested', cost: 800 }
      ],
      neighborhoods: ['Shibuya', 'Asakusa'],
      vibe: 'Urban energy meets tradition',
      status: 'planning'
    },
    {
      id: 'kyoto',
      name: 'Kyoto',
      days: 3,
      order: 2,
      transport: { mode: 'Shinkansen', emoji: '🚆', duration: '2h 15m' },
      experiences: [
        { id: 'e4', title: 'Fushimi Inari Shrine', type: 'activity', day: 4, timeOfDay: 'morning', status: 'saved', cost: 0 },
        { id: 'e5', title: 'Arashiyama Bamboo', type: 'activity', day: 5, timeOfDay: 'morning', status: 'saved', cost: 0 },
        { id: 'e6', title: 'Tea Ceremony', type: 'activity', day: 5, timeOfDay: 'afternoon', status: 'saved', cost: 5000 }
      ],
      neighborhoods: ['Gion', 'Arashiyama'],
      vibe: 'Timeless elegance and zen',
      status: 'planning'
    },
    {
      id: 'osaka',
      name: 'Osaka',
      days: 2,
      order: 3,
      transport: { mode: 'Local Train', emoji: '🚆', duration: '30 mins' },
      experiences: [
        { id: 'e7', title: 'Dotonbori Food Walk', type: 'activity', day: 7, timeOfDay: 'evening', status: 'saved', cost: 4000 },
        { id: 'e8', title: 'Osaka Castle', type: 'activity', day: 8, timeOfDay: 'morning', status: 'suggested', cost: 600 }
      ],
      neighborhoods: ['Dotonbori', 'Umeda'],
      vibe: 'Street food and nightlife',
      status: 'planning'
    }
  ]
}

export const DynamicTripSummary: React.FC = () => {
  const navigate = useNavigate()
  const { summaryId } = useParams()
  
  const [tripData, setTripData] = useState<TripData>(DEMO_TRIP)
  const [activeSheet, setActiveSheet] = useState<BottomSheetType>(null)
  const [selectedCity, setSelectedCity] = useState<RouteCity | null>(null)
  const [expandedCity, setExpandedCity] = useState<string | null>(null)
  const [showCostBreakdown, setShowCostBreakdown] = useState(false)

  const formatCurrency = (amount: number) => {
    return `₹${(amount / 1000).toFixed(2)}L`
  }

  const handleCityExpand = (cityId: string) => {
    setExpandedCity(expandedCity === cityId ? null : cityId)
  }

  const handleCityDetail = (city: RouteCity) => {
    setSelectedCity(city)
    setActiveSheet('city-detail')
  }

  const handleFlightClick = () => {
    setActiveSheet('flight')
  }

  const handleTrainClick = (cityId: string) => {
    const city = tripData.route.find(c => c.id === cityId)
    if (city) {
      setSelectedCity(city)
      setActiveSheet('train')
    }
  }

  const handleVisaClick = () => {
    setActiveSheet('visa')
  }

  const confirmFlight = () => {
    setTripData({ ...tripData, flightConfirmed: true, estimatedCost: tripData.estimatedCost + 45000 })
    setActiveSheet(null)
  }

  const confirmVisa = () => {
    setTripData({ ...tripData, visaConfirmed: true })
    setActiveSheet(null)
  }

  const renderBottomSheet = () => {
    if (!activeSheet) return null

    return (
      <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm animate-fade-in" onClick={() => setActiveSheet(null)}>
        <div className="bg-gray-900 rounded-t-3xl w-full max-w-2xl max-h-[70vh] overflow-y-auto animate-slide-up border-t border-gray-800" onClick={(e) => e.stopPropagation()}>
          <div className="sticky top-0 bg-gray-900 pt-3 pb-2 px-6 border-b border-gray-800 z-10">
            <div className="w-12 h-1.5 bg-gray-700 rounded-full mx-auto mb-4" />
            <button onClick={() => setActiveSheet(null)} className="absolute top-6 right-6 p-2 hover:bg-gray-800 rounded-full transition-colors">
              <X size={20} className="text-gray-400" />
            </button>
          </div>

          <div className="p-6">
            {activeSheet === 'flight' && (
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">Your Flight</h2>
                <p className="text-gray-400 mb-6">San Francisco → Tokyo</p>
                
                <div className="space-y-4">
                  <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
                    <div className="flex items-center gap-3 mb-3">
                      <Plane size={20} className="text-yellow-200" />
                      <p className="text-white font-semibold">ANA 838 · Recommended</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-gray-400 text-xs mb-1">Departure</p>
                        <p className="text-white text-sm">SFO · 11:00 AM</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs mb-1">Arrival</p>
                        <p className="text-white text-sm">NRT · 2:00 PM (+1)</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-sm">Direct · 11h</span>
                      <span className="text-yellow-200 font-semibold">{formatCurrency(45000)}</span>
                    </div>
                  </div>

                  <button className="w-full text-yellow-200 text-sm py-2">View alternative flights</button>
                </div>
                
                {!tripData.flightConfirmed && (
                  <button onClick={confirmFlight} className="w-full mt-4 bg-yellow-200 hover:bg-yellow-300 text-black font-semibold py-4 rounded-full transition-all">
                    Confirm Flight
                  </button>
                )}
                {tripData.flightConfirmed && (
                  <div className="mt-4 bg-green-900/20 border border-green-500/30 rounded-xl p-4 flex items-center gap-3">
                    <CheckCircle size={20} className="text-green-400" />
                    <span className="text-green-400 text-sm">Flight confirmed · Your routes are set</span>
                  </div>
                )}
              </div>
            )}

            {activeSheet === 'train' && selectedCity && (
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">Inter-City Travel</h2>
                <p className="text-gray-400 mb-6">Getting to {selectedCity.name}</p>
                
                <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700 mb-4">
                  <div className="flex items-center gap-3 mb-3">
                    <Train size={20} className="text-yellow-200" />
                    <p className="text-white font-semibold">{selectedCity.transport.mode}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm">{selectedCity.transport.duration}</span>
                    <span className="text-yellow-200 font-semibold">₹3.5K</span>
                  </div>
                </div>

                <p className="text-gray-500 text-sm italic">We'll take the Shinkansen — scenic all the way</p>
                
                <button className="w-full mt-4 bg-yellow-200 hover:bg-yellow-300 text-black font-semibold py-4 rounded-full transition-all">
                  Confirm Route
                </button>
              </div>
            )}

            {activeSheet === 'visa' && (
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">Visa & Entry</h2>
                <p className="text-gray-400 mb-6">Japan requirements</p>
                
                <div className="space-y-3 mb-6">
                  <div className="bg-green-900/20 border border-green-500/30 rounded-xl p-4">
                    <div className="flex items-center gap-3">
                      <CheckCircle size={24} className="text-green-400" />
                      <div>
                        <p className="text-white font-semibold">Visa-free entry</p>
                        <p className="text-gray-400 text-sm">US passport holders can stay up to 90 days</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
                    <p className="text-white font-medium mb-2">Entry requirements:</p>
                    <ul className="space-y-2 text-sm text-gray-400">
                      <li className="flex items-start gap-2">
                        <CheckCircle size={16} className="text-green-400 mt-0.5" />
                        <span>Valid passport (6+ months validity)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle size={16} className="text-green-400 mt-0.5" />
                        <span>Return flight ticket</span>
                      </li>
                    </ul>
                  </div>
                </div>
                
                {!tripData.visaConfirmed && (
                  <button onClick={confirmVisa} className="w-full bg-yellow-200 hover:bg-yellow-300 text-black font-semibold py-4 rounded-full transition-all">
                    Mark as Ready
                  </button>
                )}
                {tripData.visaConfirmed && (
                  <div className="bg-green-900/20 border border-green-500/30 rounded-xl p-4 flex items-center gap-3">
                    <CheckCircle size={20} className="text-green-400" />
                    <span className="text-green-400 text-sm">Documents ready · Freedom to explore awaits</span>
                  </div>
                )}
              </div>
            )}

            {activeSheet === 'city-detail' && selectedCity && (
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">{selectedCity.name}</h2>
                <p className="text-gray-400 mb-6">{selectedCity.days} days · {selectedCity.vibe}</p>
                
                <div className="space-y-4 mb-6">
                  <div>
                    <p className="text-gray-400 text-xs uppercase tracking-wide mb-3">Experiences</p>
                    {selectedCity.experiences.map((exp) => (
                      <div key={exp.id} className="flex items-center gap-3 bg-gray-800/50 p-3 rounded-xl border border-gray-700/50 mb-2">
                        <div className={`w-2 h-2 rounded-full ${exp.status === 'saved' ? 'bg-green-400' : exp.status === 'booked' ? 'bg-blue-400' : 'bg-yellow-400'}`} />
                        <div className="flex-1">
                          <p className="text-white text-sm font-medium">{exp.title}</p>
                          <p className="text-gray-400 text-xs">Day {exp.day} · {exp.timeOfDay}</p>
                        </div>
                        <Heart size={16} className={exp.status === 'saved' ? 'text-red-400 fill-red-400' : 'text-gray-500'} />
                      </div>
                    ))}
                  </div>

                  <div>
                    <p className="text-gray-400 text-xs uppercase tracking-wide mb-3">Neighborhoods</p>
                    <div className="flex gap-2">
                      {selectedCity.neighborhoods.map((n) => (
                        <span key={n} className="px-3 py-1 bg-gray-800 rounded-full text-xs text-white border border-gray-700">{n}</span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button className="flex-1 bg-gray-800 hover:bg-gray-750 text-white text-sm font-medium py-3 rounded-full transition-colors border border-gray-700">
                    Add experience
                  </button>
                  <button className="flex-1 bg-yellow-200 hover:bg-yellow-300 text-black text-sm font-semibold py-3 rounded-full transition-colors">
                    Explore {selectedCity.name}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white pb-24">
      {/* Header */}
      <div className="sticky top-0 bg-black/95 backdrop-blur-md border-b border-gray-800 z-20">
        <div className="flex items-center justify-between p-4">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-800 rounded-full transition-colors">
            <ChevronRight size={20} className="text-white rotate-180" />
          </button>
          <h1 className="text-xl font-bold text-white">Your Journey</h1>
          <button className="p-2 hover:bg-gray-800 rounded-full transition-colors">
            <Edit2 size={20} className="text-white" />
          </button>
        </div>
      </div>

      {/* Hero Message */}
      <div className="p-6 border-b border-gray-800">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles size={20} className="text-yellow-200" />
          <p className="text-yellow-200/80 text-sm italic">Your journey is taking shape</p>
        </div>

        {/* Vintage Ticket UI */}
        <div className="bg-gradient-to-br from-yellow-900/20 to-amber-900/20 rounded-2xl border-2 border-yellow-500/20 overflow-hidden">
          <div className="p-6">
            <h2 className="text-3xl font-bold mb-6">{tripData.destination}</h2>
            
            {/* Macro Stats */}
            <div className="grid grid-cols-4 gap-3 mb-6">
              <button onClick={() => setActiveSheet('days')} className="bg-gray-900/50 hover:bg-gray-850 rounded-xl p-3 text-center border border-gray-800 hover:border-yellow-200/50 transition-all">
                <Calendar size={18} className="text-yellow-200 mx-auto mb-1" />
                <p className="text-2xl font-bold text-white">{tripData.duration}</p>
                <p className="text-xs text-gray-400">days</p>
              </button>
              <button onClick={() => setActiveSheet('cities')} className="bg-gray-900/50 hover:bg-gray-850 rounded-xl p-3 text-center border border-gray-800 hover:border-yellow-200/50 transition-all">
                <MapPin size={18} className="text-yellow-200 mx-auto mb-1" />
                <p className="text-2xl font-bold text-white">{tripData.totalCities}</p>
                <p className="text-xs text-gray-400">cities</p>
              </button>
              <button onClick={() => setActiveSheet('saved')} className="bg-gray-900/50 hover:bg-gray-850 rounded-xl p-3 text-center border border-gray-800 hover:border-yellow-200/50 transition-all">
                <Heart size={18} className="text-yellow-200 mx-auto mb-1" />
                <p className="text-2xl font-bold text-white">{tripData.savedExperiences}</p>
                <p className="text-xs text-gray-400">saved</p>
              </button>
              <button onClick={() => setActiveSheet('people')} className="bg-gray-900/50 hover:bg-gray-850 rounded-xl p-3 text-center border border-gray-800 hover:border-yellow-200/50 transition-all">
                <Users size={18} className="text-yellow-200 mx-auto mb-1" />
                <p className="text-2xl font-bold text-white">{tripData.travelers}</p>
                <p className="text-xs text-gray-400">people</p>
              </button>
            </div>

            {/* Route Ribbon */}
            <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-700/50">
              <p className="text-gray-400 text-xs mb-3 uppercase tracking-wide">Your Route</p>
              <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide pb-2">
                <div className="flex items-center gap-1">
                  <span className="text-white text-sm whitespace-nowrap px-2">Home</span>
                  {tripData.route.map((city, idx) => (
                    <React.Fragment key={city.id}>
                      <button
                        onClick={() => idx === 0 ? handleFlightClick() : handleTrainClick(city.id)}
                        className="group flex flex-col items-center gap-1 px-3 py-2 rounded-xl hover:bg-gray-800 transition-all border-2 border-transparent hover:border-yellow-200/50"
                      >
                        <span className="text-2xl group-hover:scale-125 transition-transform">{city.transport.emoji}</span>
                        <span className="text-xs text-gray-500 group-hover:text-yellow-200 whitespace-nowrap">{city.transport.duration}</span>
                      </button>
                      <span className="text-white font-semibold text-sm whitespace-nowrap px-2">{city.name}</span>
                    </React.Fragment>
                  ))}
                  <button
                    onClick={handleFlightClick}
                    className="group flex flex-col items-center gap-1 px-3 py-2 rounded-xl hover:bg-gray-800 transition-all border-2 border-transparent hover:border-yellow-200/50"
                  >
                    <span className="text-2xl group-hover:scale-125 transition-transform">✈️</span>
                    <span className="text-xs text-gray-500 group-hover:text-yellow-200 whitespace-nowrap">11h</span>
                  </button>
                  <span className="text-white text-sm whitespace-nowrap px-2">Home</span>
                </div>
              </div>
            </div>

            {/* Visa Status */}
            <button onClick={handleVisaClick} className="w-full mt-4 bg-green-900/20 border border-green-500/30 hover:border-green-500/50 rounded-xl p-4 text-left transition-all">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {tripData.visaConfirmed ? (
                    <CheckCircle size={20} className="text-green-400" />
                  ) : (
                    <div className="w-5 h-5 border-2 border-green-500/50 rounded-full" />
                  )}
                  <div>
                    <p className="text-white font-semibold text-sm">Visa-free entry</p>
                    <p className="text-gray-400 text-xs">Japan · up to 90 days</p>
                  </div>
                </div>
                <ChevronRight size={20} className="text-gray-400" />
              </div>
            </button>
          </div>
          
          {/* Ticket Perforation */}
          <div className="h-8 relative">
            <div className="absolute inset-0 flex justify-between px-2">
              {[...Array(20)].map((_, i) => (
                <div key={i} className="w-3 h-3 bg-black rounded-full" />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* City Cards */}
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-bold text-white">Your Cities</h2>
          <button className="flex items-center gap-2 px-3 py-2 bg-yellow-200/10 hover:bg-yellow-200/20 rounded-full border border-yellow-200/30 transition-colors">
            <Plus size={16} className="text-yellow-200" />
            <span className="text-xs text-yellow-200 font-medium">Add city</span>
          </button>
        </div>

        {tripData.route.map((city) => (
          <div key={city.id} className="bg-gray-900 rounded-2xl overflow-hidden border border-gray-800 hover:border-gray-700 transition-all">
            <button onClick={() => handleCityExpand(city.id)} className="w-full p-4 text-left">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">{city.name}</h3>
                  <p className="text-gray-400 text-sm">{city.days} days · {city.vibe}</p>
                </div>
                <ChevronRight size={24} className={`text-white transition-transform ${expandedCity === city.id ? 'rotate-90' : ''}`} />
              </div>
            </button>

            {expandedCity === city.id && (
              <div className="p-4 border-t border-gray-800 animate-fade-in">
                <p className="text-gray-400 text-xs mb-4 uppercase tracking-wide">What you'll experience</p>
                <div className="space-y-2 mb-4">
                  {city.experiences.slice(0, 3).map((exp) => (
                    <div key={exp.id} className="flex items-center gap-3 bg-gray-800/50 p-3 rounded-xl">
                      <div className={`w-2 h-2 rounded-full ${exp.status === 'saved' ? 'bg-green-400' : 'bg-yellow-400'}`} />
                      <p className="text-white text-sm flex-1">{exp.title}</p>
                    </div>
                  ))}
                </div>
                <button onClick={() => handleCityDetail(city)} className="w-full bg-yellow-200 hover:bg-yellow-300 text-black text-sm font-semibold py-3 rounded-full transition-colors">
                  Explore {city.name}
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Floating Cost Calculator */}
      <button
        onClick={() => setShowCostBreakdown(!showCostBreakdown)}
        className="fixed bottom-6 right-6 bg-yellow-200 hover:bg-yellow-300 text-black font-bold px-6 py-4 rounded-full shadow-2xl transition-all hover:scale-105 border-2 border-yellow-400 z-30"
      >
        <div className="flex items-center gap-2">
          <span className="text-lg">{formatCurrency(tripData.estimatedCost)}</span>
          <span className="text-xs opacity-70">per person</span>
        </div>
        {tripData.flightConfirmed && (
          <div className="text-xs text-green-700 mt-1">✓ Updated</div>
        )}
      </button>

      {/* Cost Breakdown Modal */}
      {showCostBreakdown && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowCostBreakdown(false)}>
          <div className="bg-gray-900 rounded-3xl w-full max-w-md m-4 p-6 border border-gray-800" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-2xl font-bold text-white mb-6">Cost Breakdown</h2>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Flights</span>
                <span className="text-white font-semibold">{tripData.flightConfirmed ? formatCurrency(45000) : '—'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Stays (8 nights)</span>
                <span className="text-white font-semibold">{formatCurrency(40000)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Experiences</span>
                <span className="text-white font-semibold">{formatCurrency(25000)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Local transport</span>
                <span className="text-white font-semibold">{formatCurrency(15000)}</span>
              </div>
              <div className="border-t border-gray-700 pt-3 flex justify-between">
                <span className="text-white font-bold">Total</span>
                <span className="text-yellow-200 font-bold text-lg">{formatCurrency(tripData.estimatedCost)}</span>
              </div>
            </div>
            <button onClick={() => setShowCostBreakdown(false)} className="w-full bg-gray-800 hover:bg-gray-750 text-white py-3 rounded-full">
              Close
            </button>
          </div>
        </div>
      )}

      {renderBottomSheet()}
    </div>
  )
}
