import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, MapPin, Calendar, Users, Heart, Plus, ChevronRight, Sparkles, Plane, Train, Home, Coffee, CheckCircle } from 'lucide-react'
import { fetchPexelsImages } from '../services/pexels'
import { TripBottomSheet } from '../components/TripBottomSheet'
import tripData from '../data/trip_data.json'

export const TripPlanningPage: React.FC = () => {
  const navigate = useNavigate()
  const { tripId } = useParams<{ tripId: string }>()
  const [selectedCity, setSelectedCity] = useState<string | null>(null)
  const [cityImages, setCityImages] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [activeSheet, setActiveSheet] = useState<'days' | 'cities' | 'saved' | 'people' | 'flight' | 'train' | 'visa' | null>(null)

  const trip = tripData.trip

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
          
          <div className="w-9" />
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
            <p className="text-2xl font-bold text-white">{trip.overview.total_days}</p>
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
            <p className="text-2xl font-bold text-white">{trip.overview.companions}</p>
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

      {/* Your Journey - Cinematic City Cards */}
      <div className="p-4 pb-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-white">Your Journey</h2>
          <button className="flex items-center gap-2 px-3 py-2 bg-yellow-200/10 hover:bg-yellow-200/20 rounded-full border border-yellow-200/30 transition-colors">
            <Plus size={16} className="text-yellow-200" />
            <span className="text-xs text-yellow-200 font-medium">Add city</span>
          </button>
        </div>

        <div className="space-y-8">
          {trip.route.map((city, cityIdx) => (
            <div key={city.city_id} className="space-y-4">
              {/* Travel Separator */}
              {cityIdx > 0 && (
                <div className="flex items-center gap-3 py-6">
                  <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-700 to-gray-700/50" />
                  <div className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-gray-900 to-gray-800 rounded-full border border-gray-700 shadow-lg">
                    <span className="text-2xl">{city.travel_from_previous.mode}</span>
                    <span className="text-gray-300 text-sm font-medium">{city.travel_from_previous.duration}</span>
                  </div>
                  <div className="flex-1 h-px bg-gradient-to-l from-transparent via-gray-700 to-gray-700/50" />
                </div>
              )}

              {/* City Card - Magazine Style */}
              <div className="bg-gray-900 rounded-3xl overflow-hidden border border-gray-800 shadow-2xl group hover:border-yellow-200/30 transition-all duration-700">
                {/* Hero Image */}
                <div 
                  onClick={() => {
                    console.log('Clicked city:', city.city_id, 'Current selected:', selectedCity)
                    setSelectedCity(selectedCity === city.city_id ? null : city.city_id)
                  }}
                  className="w-full relative cursor-pointer"
                >
                  <div className="relative h-80 overflow-hidden">
                    {cityImages[city.city_id] ? (
                      <img 
                        src={cityImages[city.city_id]} 
                        alt={city.city_name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[3000ms]"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                        <MapPin size={64} className="text-gray-600" />
                      </div>
                    )}
                    
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
                    
                    {/* Days Badge */}
                    <div className="absolute top-6 left-6">
                      <div className="bg-black/80 backdrop-blur-md px-4 py-2 rounded-full border border-white/30">
                        <span className="text-white text-sm font-semibold">{city.days} Days</span>
                      </div>
                    </div>

                    {/* City Title Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-8">
                      <div className="flex items-end justify-between">
                        <div className="flex-1">
                          <h3 className="text-4xl font-bold text-white mb-2 leading-tight">{city.city_name}</h3>
                          <p className="text-yellow-200/90 text-base font-light italic mb-3">{city.vibe}</p>
                          <div className="flex items-center gap-3 text-white/70 text-sm">
                            <span>{city.experiences.length} experiences</span>
                            {city.open_slots > 0 && (
                              <>
                                <span>·</span>
                                <span className="text-yellow-200">{city.open_slots} open slots</span>
                              </>
                            )}
                          </div>
                        </div>
                        <ChevronRight 
                          size={32} 
                          className={`text-white transition-transform duration-500 ${selectedCity === city.city_id ? 'rotate-90' : ''}`}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Expanded Experiences */}
                {selectedCity === city.city_id && (
                  <div className="p-6 space-y-4 animate-fade-in border-t border-gray-800">
                    <p className="text-gray-500 text-xs uppercase tracking-wider mb-4">Day-by-Day Itinerary</p>
                    
                    {city.experiences.map((exp, expIdx) => (
                      <div
                        key={exp.experience_id || exp.cafe_id}
                        className="group/exp flex items-start gap-4 p-4 rounded-2xl bg-gray-800/50 hover:bg-gray-800 border border-gray-700/50 hover:border-yellow-200/30 transition-all duration-500 cursor-pointer"
                      >
                        {/* Day Badge */}
                        <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-yellow-200/20 to-yellow-300/10 rounded-full flex items-center justify-center border border-yellow-200/30 shadow-lg">
                          <span className="text-yellow-200 text-sm font-bold">D{exp.day}</span>
                        </div>

                        {/* Experience Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-3 mb-2">
                            <div className="flex-1">
                              <h4 className="text-white font-semibold text-base mb-1 group-hover/exp:text-yellow-200 transition-colors">
                                {exp.title}
                              </h4>
                              <div className="flex items-center gap-2 text-xs text-gray-400">
                                <Clock size={12} />
                                <span className="capitalize">{exp.time_of_day}</span>
                                <span>·</span>
                                <span className="capitalize px-2 py-0.5 bg-gray-700 rounded-full">{exp.type}</span>
                              </div>
                            </div>
                            <Heart 
                              size={20} 
                              className={`flex-shrink-0 transition-all ${
                                exp.status === 'saved' 
                                  ? 'text-red-400 fill-red-400' 
                                  : 'text-gray-600 group-hover/exp:text-gray-500'
                              }`} 
                            />
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Actions */}
                    <div className="flex gap-3 pt-2">
                      <button className="flex-1 bg-gray-800 hover:bg-gray-750 text-white text-sm font-medium py-3 rounded-full transition-all border border-gray-700 hover:border-gray-600">
                        Add experience
                      </button>
                      <button className="flex-1 bg-yellow-200 hover:bg-yellow-300 text-black text-sm font-bold py-3 rounded-full transition-all shadow-lg shadow-yellow-200/20">
                        Explore {city.city_name}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
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
        isOpen={activeSheet !== null}
        onClose={() => setActiveSheet(null)}
        type={activeSheet || 'days'}
        data={trip}
      />
    </div>
  )
}
