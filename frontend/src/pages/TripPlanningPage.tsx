import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, MapPin, Calendar, Users, Heart, Plus, ChevronRight, Sparkles, Plane, Train, Home, Coffee, CheckCircle, Clock, DollarSign, X, Activity } from 'lucide-react'
import { fetchPexelsImages } from '../services/pexels'
import { TripBottomSheet } from '../components/TripBottomSheet'
import tripData from '../data/trip_data.json'

export const TripPlanningPage: React.FC = () => {
  const navigate = useNavigate()
  const { tripId } = useParams<{ tripId: string }>()
  const [selectedCity, setSelectedCity] = useState<string | null>(null)
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null)
  const [cityImages, setCityImages] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [activeSheet, setActiveSheet] = useState<'days' | 'cities' | 'saved' | 'people' | 'flight' | 'train' | 'visa' | 'cost' | null>(null)
  const [tripPreferences, setTripPreferences] = useState<any>(null)

  const trip = tripData.trip

  // Load trip preferences from localStorage (from questionnaire)
  useEffect(() => {
    const stored = localStorage.getItem('tripPreferences')
    console.log('📦 [TripPlanningPage] Reading from localStorage:', stored)
    if (stored) {
      try {
        const prefs = JSON.parse(stored)
        console.log('✅ [TripPlanningPage] Parsed preferences:', prefs)
        setTripPreferences(prefs)
      } catch (e) {
        console.error('❌ [TripPlanningPage] Failed to parse trip preferences', e)
      }
    } else {
      console.log('⚠️ [TripPlanningPage] No trip preferences found in localStorage')
    }
  }, [])

  // Use questionnaire data if available, otherwise fall back to static data
  const totalDays = tripPreferences?.duration || trip.overview.total_days
  const travelers = tripPreferences?.travelers || trip.overview.companions
  const destination = tripPreferences?.destination || 'Japan'
  
  // Check if destination matches the static data
  const isDataMismatch = tripPreferences?.destination && 
    tripPreferences.destination !== 'Japan' && 
    tripPreferences.destination !== 'Japan Food Crawl'
  
  console.log('🌍 [TripPlanningPage] Destination:', destination, 'Mismatch:', isDataMismatch)
  
  // Calculate realistic costs based on duration
  const calculateCosts = () => {
    const baseCostPerDay = 150 // $150 per day per person
    const flightCost = 800 // $800 per person round trip
    const accommodationPerNight = 100 // $100 per night
    
    const totalFlights = flightCost * travelers
    const totalAccommodation = accommodationPerNight * (totalDays - 1) // nights = days - 1
    const totalActivities = baseCostPerDay * totalDays * travelers
    
    return {
      flights: totalFlights,
      accommodation: totalAccommodation,
      activities: totalActivities,
      total: totalFlights + totalAccommodation + totalActivities
    }
  }
  
  const costs = calculateCosts()

  useEffect(() => {
    const loadImages = async () => {
      setLoading(true)
      const images: Record<string, string> = {}
      
      for (const city of trip.route) {
        const photos = await fetchPexelsImages(city.image_keywords, 1)
        if (photos.length > 0) {
          images[city.city_id] = photos[0].src.large2x
        }
      }
      
      setCityImages(images)
      setLoading(false)
    }
    
    loadImages()
  }, [])

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="sticky top-0 bg-black/95 backdrop-blur-md border-b border-gray-800 z-20">
        <div className="flex items-center justify-between p-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-800 rounded-full transition-colors"
          >
            <ArrowLeft size={20} className="text-white" />
          </button>
          
          <h1 className="text-xl font-bold text-white">Your Journey</h1>
          
          {/* Compact Cost Box - Top Right */}
          <button 
            onClick={() => setActiveSheet('cost')}
            className="backdrop-blur-xl rounded-xl px-4 py-2 border transition-all hover:scale-105"
            style={{
              background: 'rgba(255, 209, 92, 0.15)',
              borderColor: 'rgba(255, 209, 92, 0.3)'
            }}
          >
            <p className="text-yellow-200 text-xs font-medium mb-0.5">Your trip cost</p>
            <p className="text-white font-bold text-lg">${costs.total.toLocaleString()}</p>
          </button>
        </div>
      </div>

      {/* Hero Section - Trip Overview */}
      <div className="p-6 border-b border-gray-800">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles size={20} className="text-yellow-200" />
          <p className="text-yellow-200/80 text-sm italic">
            Your journey is shaping up beautifully.
          </p>
        </div>

        {/* Macro Stats - Interactive */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          <button
            onClick={() => setActiveSheet('days')}
            className="bg-gray-900 hover:bg-gray-850 rounded-xl p-3 text-center border border-gray-800 hover:border-yellow-200/50 transition-all hover:scale-105"
          >
            <Calendar size={18} className="text-yellow-200 mx-auto mb-1" />
            <p className="text-2xl font-bold text-white">{totalDays}</p>
            <p className="text-xs text-gray-400">days</p>
          </button>
          <button
            onClick={() => setActiveSheet('cities')}
            className="bg-gray-900 hover:bg-gray-850 rounded-xl p-3 text-center border border-gray-800 hover:border-yellow-200/50 transition-all hover:scale-105"
          >
            <MapPin size={18} className="text-yellow-200 mx-auto mb-1" />
            <p className="text-2xl font-bold text-white">{trip.overview.total_cities}</p>
            <p className="text-xs text-gray-400">cities</p>
          </button>
          <button
            onClick={() => setActiveSheet('saved')}
            className="bg-gray-900 hover:bg-gray-850 rounded-xl p-3 text-center border border-gray-800 hover:border-yellow-200/50 transition-all hover:scale-105"
          >
            <Heart size={18} className="text-yellow-200 mx-auto mb-1" />
            <p className="text-2xl font-bold text-white">{trip.overview.saved_experiences}</p>
            <p className="text-xs text-gray-400">saved</p>
          </button>
          <button
            onClick={() => setActiveSheet('people')}
            className="bg-gray-900 hover:bg-gray-850 rounded-xl p-3 text-center border border-gray-800 hover:border-yellow-200/50 transition-all hover:scale-105"
          >
            <Users size={18} className="text-yellow-200 mx-auto mb-1" />
            <p className="text-2xl font-bold text-white">{travelers}</p>
            <p className="text-xs text-gray-400">people</p>
          </button>
        </div>

        {/* Route Overview */}
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-4 border border-gray-700">
          <p className="text-gray-400 text-xs mb-3 uppercase tracking-wide">Your Route</p>
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
            <span className="text-white text-sm whitespace-nowrap">Home</span>
            {trip.route.map((city, idx) => (
              <React.Fragment key={city.city_id}>
                <button
                  onClick={() => setActiveSheet(city.travel_from_previous.mode === '✈️' ? 'flight' : 'train')}
                  className="text-gray-500 text-lg hover:text-yellow-200 transition-colors hover:scale-110"
                >
                  {city.travel_from_previous.mode}
                </button>
                <span className="text-white font-semibold text-sm whitespace-nowrap">{city.city_name}</span>
              </React.Fragment>
            ))}
            <button
              onClick={() => setActiveSheet('flight')}
              className="text-gray-500 text-lg hover:text-yellow-200 transition-colors hover:scale-110"
            >
              ✈️
            </button>
            <span className="text-white text-sm whitespace-nowrap">Home</span>
          </div>
        </div>

        {/* Visa Status */}
        <div className="mt-4">
          <button
            onClick={() => setActiveSheet('visa')}
            className="w-full bg-green-900/20 border border-green-500/30 hover:border-green-500/50 rounded-xl p-4 text-left transition-all hover:bg-green-900/30"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                  <CheckCircle size={20} className="text-green-400" />
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">Visa-free entry</p>
                  <p className="text-gray-400 text-xs">Japan · up to 90 days</p>
                </div>
              </div>
              <ChevronRight size={20} className="text-gray-400" />
            </div>
          </button>
        </div>
      </div>

      {/* Data Mismatch Warning */}
      {isDataMismatch && (
        <div className="p-4">
          <div 
            className="backdrop-blur-xl rounded-2xl p-5 border-2"
            style={{
              background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.15), rgba(220, 38, 38, 0.1))',
              borderColor: 'rgba(239, 68, 68, 0.4)'
            }}
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 p-2 bg-red-500/20 rounded-lg">
                <MapPin size={20} className="text-red-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-white font-bold text-lg mb-2">
                  🚧 Demo Data - {destination} Itinerary Coming Soon
                </h3>
                <p className="text-white/80 text-sm leading-relaxed mb-3">
                  You selected <span className="font-semibold text-yellow-200">{destination}</span> in the questionnaire, 
                  but we're currently showing <span className="font-semibold">Japan</span> sample data as a preview.
                </p>
                <p className="text-white/70 text-xs">
                  Your preferences ({totalDays} days, {travelers} traveler{travelers > 1 ? 's' : ''}) are saved. 
                  Full {destination} itinerary data will be available soon!
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Your Journey - Deck Style Cards */}
      <div className="p-4 pb-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-white">
            {isDataMismatch ? `${destination} Journey (Sample)` : 'Your Journey'}
          </h2>
          <button className="flex items-center gap-2 px-3 py-2 bg-yellow-200/10 hover:bg-yellow-200/20 rounded-full border border-yellow-200/30 transition-colors">
            <Plus size={16} className="text-yellow-200" />
            <span className="text-xs text-yellow-200 font-medium">Add city</span>
          </button>
        </div>

        <div className="space-y-4">
          {trip.route.map((city, cityIdx) => {
            const isExpanded = selectedCity === city.city_id
            const cityColors = [
              'from-purple-500/20 to-purple-600/10 border-purple-500/30',
              'from-pink-500/20 to-pink-600/10 border-pink-500/30',
              'from-amber-500/20 to-orange-600/10 border-amber-500/30',
              'from-blue-500/20 to-blue-600/10 border-blue-500/30',
              'from-green-500/20 to-green-600/10 border-green-500/30'
            ]
            const colorClass = cityColors[cityIdx % cityColors.length]

            return (
              <div key={city.city_id}>
                {/* Travel Separator with Connector */}
                {cityIdx > 0 && !isExpanded && (
                  <div className="relative">
                    {/* Vertical Connector Line */}
                    <div className="absolute left-1/2 -translate-x-1/2 w-0.5 h-8 bg-gradient-to-b from-gray-700 to-transparent -top-8" />
                    
                    <div className="flex items-center gap-3 py-3 mb-4">
                      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-700 to-gray-700/50" />
                      <div className="flex items-center gap-2 px-4 py-1.5 bg-gray-900 rounded-full border border-gray-700 shadow-lg relative z-10">
                        <span className="text-lg">{city.travel_from_previous.mode}</span>
                        <span className="text-gray-400 text-xs">{city.travel_from_previous.duration}</span>
                      </div>
                      <div className="flex-1 h-px bg-gradient-to-l from-transparent via-gray-700 to-gray-700/50" />
                    </div>
                    
                    {/* Vertical Connector Line to Next Card */}
                    <div className="absolute left-1/2 -translate-x-1/2 w-0.5 h-8 bg-gradient-to-b from-transparent to-gray-700 -bottom-8" />
                  </div>
                )}

                {/* City Card */}
                <div className={`bg-gradient-to-br ${colorClass} backdrop-blur-sm rounded-2xl border overflow-hidden transition-all duration-500 ${isExpanded ? 'shadow-2xl' : 'shadow-lg'}`}>
                  {/* Collapsed State - Compact Card */}
                  {!isExpanded && (
                    <div
                      onClick={() => {
                        setSelectedCity(city.city_id)
                        setSelectedActivity(null)
                      }}
                      className="p-5 cursor-pointer"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <Calendar size={18} className="text-white/70" />
                          <span className="text-white/60 text-sm">{city.days} Days</span>
                        </div>
                        <ChevronRight size={20} className="text-white/70" />
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-2">{city.city_name}</h3>
                      <p className="text-white/80 text-sm italic">{city.vibe}</p>
                    </div>
                  )}

                  {/* Expanded State - Activities List */}
                  {isExpanded && (
                    <div className="animate-fade-in">
                      {/* Header */}
                      <div
                        onClick={() => {
                          setSelectedCity(null)
                          setSelectedActivity(null)
                        }}
                        className="p-5 cursor-pointer border-b border-white/10"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <Calendar size={18} className="text-white/70" />
                            <span className="text-white/60 text-sm">{city.days} Days</span>
                          </div>
                          <ChevronRight size={20} className="text-white/70 rotate-90" />
                        </div>
                        <h3 className="text-2xl font-bold text-white">{city.city_name}</h3>
                      </div>

                      {/* Activities List */}
                      <div className="p-4 space-y-3">
                        {city.experiences.map((exp) => {
                          const activityId = exp.experience_id || exp.cafe_id
                          const isActivityExpanded = selectedActivity === activityId

                          return (
                            <div key={activityId}>
                              {/* Activity Compact */}
                              {!isActivityExpanded && (
                                <div
                                  onClick={() => setSelectedActivity(activityId)}
                                  className="flex items-center gap-3 p-3 bg-white/10 hover:bg-white/15 backdrop-blur-sm rounded-xl border border-white/20 cursor-pointer transition-all"
                                >
                                  {cityImages[city.city_id] && (
                                    <img
                                      src={cityImages[city.city_id]}
                                      alt={exp.title}
                                      className="w-16 h-16 rounded-lg object-cover"
                                    />
                                  )}
                                  <div className="flex-1 min-w-0">
                                    <h4 className="text-white font-medium text-sm truncate">{exp.title}</h4>
                                    <p className="text-white/60 text-xs capitalize">{exp.time_of_day}</p>
                                  </div>
                                  <ChevronRight size={18} className="text-white/60 flex-shrink-0" />
                                </div>
                              )}

                              {/* Activity Expanded Detail */}
                              {isActivityExpanded && (
                                <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 overflow-hidden animate-fade-in">
                                  {/* Hero Image */}
                                  {cityImages[city.city_id] && (
                                    <div className="relative h-48">
                                      <img
                                        src={cityImages[city.city_id]}
                                        alt={exp.title}
                                        className="w-full h-full object-cover"
                                      />
                                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                      <button
                                        onClick={() => setSelectedActivity(null)}
                                        className="absolute top-3 left-3 p-2 bg-black/50 backdrop-blur-md rounded-full"
                                      >
                                        <ChevronRight size={18} className="text-white rotate-180" />
                                      </button>
                                    </div>
                                  )}

                                  {/* Details */}
                                  <div className="p-5">
                                    <h4 className="text-white font-bold text-lg mb-2">{exp.title}</h4>
                                    <div className="flex flex-wrap items-center gap-3 mb-4 text-xs text-white/70">
                                      <div className="flex items-center gap-1">
                                        <Clock size={14} />
                                        <span className="capitalize">{exp.time_of_day}</span>
                                      </div>
                                      <span className="w-1 h-1 bg-white/30 rounded-full" />
                                      <span className="px-2 py-1 bg-white/10 rounded-full capitalize">{exp.type}</span>
                                      <span className="w-1 h-1 bg-white/30 rounded-full" />
                                      <span>Day {exp.day}</span>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex gap-2">
                                      <button className="flex-1 bg-white/10 hover:bg-white/20 text-white text-sm font-medium py-2.5 rounded-xl border border-white/20 transition-all">
                                        Edit
                                      </button>
                                      <button className="flex-1 bg-white text-black text-sm font-bold py-2.5 rounded-xl transition-all hover:bg-white/90">
                                        View Details
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          )
                        })}

                        {/* Add Activity Button */}
                        <button className="w-full bg-white/10 hover:bg-white/15 text-white text-sm font-medium py-3 rounded-xl border border-white/20 border-dashed transition-all flex items-center justify-center gap-2">
                          <Plus size={16} />
                          Add activity
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Companion Notes */}
      {trip.companion_notes && trip.companion_notes.length > 0 && (
        <div className="p-4 pb-24">
          <div className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 rounded-2xl p-5 border border-purple-500/20">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles size={18} className="text-purple-300" />
              <p className="text-purple-300 text-sm font-semibold">Verso adjusted your plan</p>
            </div>
            <div className="space-y-2">
              {trip.companion_notes.map((note, idx) => (
                <p key={idx} className="text-gray-300 text-sm leading-relaxed">
                  • {note}
                </p>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Bottom Sheet */}
      <TripBottomSheet
        isOpen={activeSheet !== null && activeSheet !== 'cost'}
        onClose={() => setActiveSheet(null)}
        type={activeSheet || 'days'}
        data={trip}
      />

      {/* Cost Breakdown Bottom Sheet */}
      {activeSheet === 'cost' && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end"
          onClick={() => setActiveSheet(null)}
        >
          <div 
            className="bg-gray-900 rounded-t-3xl w-full max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 bg-gray-900 border-b border-gray-800 p-6">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-2xl font-bold text-white">Trip Cost Breakdown</h2>
                <button
                  onClick={() => setActiveSheet(null)}
                  className="p-2 hover:bg-gray-800 rounded-full transition-colors"
                >
                  <X size={20} className="text-white" />
                </button>
              </div>
              <p className="text-gray-400 text-sm">
                Estimated costs for {travelers} traveler{travelers > 1 ? 's' : ''} · {totalDays} days
              </p>
            </div>

            {/* Cost Items */}
            <div className="p-6 space-y-4">
              {/* Flights */}
              <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-yellow-200/20 rounded-lg">
                      <Plane size={20} style={{ color: '#FFD15C' }} />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">Flights</h3>
                      <p className="text-gray-400 text-sm">Round-trip for {travelers} person{travelers > 1 ? 's' : ''}</p>
                    </div>
                  </div>
                  <p className="text-white font-bold text-lg">${costs.flights.toLocaleString()}</p>
                </div>
                <p className="text-gray-500 text-xs">$800 per person</p>
              </div>

              {/* Accommodation */}
              <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-yellow-200/20 rounded-lg">
                      <Home size={20} style={{ color: '#FFD15C' }} />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">Accommodation</h3>
                      <p className="text-gray-400 text-sm">{totalDays - 1} nights</p>
                    </div>
                  </div>
                  <p className="text-white font-bold text-lg">${costs.accommodation.toLocaleString()}</p>
                </div>
                <p className="text-gray-500 text-xs">$100 per night</p>
              </div>

              {/* Activities & Food */}
              <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-yellow-200/20 rounded-lg">
                      <Activity size={20} style={{ color: '#FFD15C' }} />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">Activities & Food</h3>
                      <p className="text-gray-400 text-sm">{totalDays} days for {travelers} person{travelers > 1 ? 's' : ''}</p>
                    </div>
                  </div>
                  <p className="text-white font-bold text-lg">${costs.activities.toLocaleString()}</p>
                </div>
                <p className="text-gray-500 text-xs">$150 per day per person</p>
              </div>

              {/* Total */}
              <div className="bg-gradient-to-r from-yellow-200/20 to-orange-200/20 rounded-xl p-6 border-2 border-yellow-200/30 mt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-yellow-200/80 text-sm mb-1">Total Estimated Cost</p>
                    <p className="text-white text-3xl font-bold">${costs.total.toLocaleString()}</p>
                  </div>
                  <DollarSign size={48} style={{ color: '#FFD15C', opacity: 0.5 }} />
                </div>
                <p className="text-gray-400 text-xs mt-3">
                  * Prices are estimates and may vary based on season, booking time, and personal preferences
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
