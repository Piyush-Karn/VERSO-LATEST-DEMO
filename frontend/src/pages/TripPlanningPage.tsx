import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, MapPin, Calendar, Users, Heart, Plus, ChevronRight, Sparkles } from 'lucide-react'
import { fetchPexelsImages } from '../services/pexels'
import tripData from '../data/trip_data.json'

export const TripPlanningPage: React.FC = () => {
  const navigate = useNavigate()
  const [selectedCity, setSelectedCity] = useState<string | null>(null)
  const [cityImages, setCityImages] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)

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

        {/* Macro Stats */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          <div className="bg-gray-900 rounded-xl p-3 text-center border border-gray-800">
            <Calendar size={18} className="text-yellow-200 mx-auto mb-1" />
            <p className="text-2xl font-bold text-white">{trip.overview.total_days}</p>
            <p className="text-xs text-gray-400">days</p>
          </div>
          <div className="bg-gray-900 rounded-xl p-3 text-center border border-gray-800">
            <MapPin size={18} className="text-yellow-200 mx-auto mb-1" />
            <p className="text-2xl font-bold text-white">{trip.overview.total_cities}</p>
            <p className="text-xs text-gray-400">cities</p>
          </div>
          <div className="bg-gray-900 rounded-xl p-3 text-center border border-gray-800">
            <Heart size={18} className="text-yellow-200 mx-auto mb-1" />
            <p className="text-2xl font-bold text-white">{trip.overview.saved_experiences}</p>
            <p className="text-xs text-gray-400">saved</p>
          </div>
          <div className="bg-gray-900 rounded-xl p-3 text-center border border-gray-800">
            <Users size={18} className="text-yellow-200 mx-auto mb-1" />
            <p className="text-2xl font-bold text-white">{trip.overview.companions}</p>
            <p className="text-xs text-gray-400">people</p>
          </div>
        </div>

        {/* Route Overview */}
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-4 border border-gray-700">
          <p className="text-gray-400 text-xs mb-3 uppercase tracking-wide">Your Route</p>
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
            <span className="text-white text-sm whitespace-nowrap">Home</span>
            {trip.route.map((city, idx) => (
              <React.Fragment key={city.city_id}>
                <span className="text-gray-500 text-lg">{city.travel_from_previous.mode}</span>
                <span className="text-white font-semibold text-sm whitespace-nowrap">{city.city_name}</span>
              </React.Fragment>
            ))}
            <span className="text-gray-500 text-lg">✈️</span>
            <span className="text-white text-sm whitespace-nowrap">Home</span>
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

        {trip.route.map((city, idx) => (
          <div
            key={city.city_id}
            className="bg-gray-900 rounded-2xl overflow-hidden border border-gray-800 hover:border-gray-700 transition-all"
          >
            {/* City Header */}
            <button
              onClick={() => setSelectedCity(selectedCity === city.city_id ? null : city.city_id)}
              className="w-full"
            >
              <div className="relative h-48">
                {cityImages[city.city_id] ? (
                  <img 
                    src={cityImages[city.city_id]} 
                    alt={city.city_name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                    <MapPin size={36} className="text-gray-600" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                
                {/* Day badge */}
                <div className="absolute top-4 left-4">
                  <div className="bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20">
                    <span className="text-white text-xs font-medium">{city.days} Days</span>
                  </div>
                </div>

                {/* Travel mode badge */}
                {idx > 0 && (
                  <div className="absolute top-4 right-4">
                    <div className="bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20">
                      <span className="text-white text-xs">{city.travel_from_previous.mode} {city.travel_from_previous.duration}</span>
                    </div>
                  </div>
                )}
                
                {/* City info overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-1">{city.city_name}</h3>
                      <p className="text-white/80 text-sm">{city.vibe}</p>
                    </div>
                    <ChevronRight 
                      size={24} 
                      className={`text-white transition-transform ${selectedCity === city.city_id ? 'rotate-90' : ''}`}
                    />
                  </div>
                </div>
              </div>
            </button>

            {/* Expanded Content */}
            {selectedCity === city.city_id && (
              <div className="p-4 border-t border-gray-800 animate-fade-in">
                <p className="text-gray-400 text-xs mb-4 uppercase tracking-wide">
                  What you'll experience here
                </p>
                
                {/* Experience Cards */}
                <div className="space-y-3 mb-4">
                  {city.experiences.map((exp) => (
                    <div 
                      key={exp.experience_id || exp.cafe_id}
                      className="flex items-center gap-3 bg-gray-800/50 p-3 rounded-xl border border-gray-700/50"
                    >
                      <div className={`w-2 h-2 rounded-full ${exp.status === 'saved' ? 'bg-green-400' : 'bg-yellow-400'}`} />
                      <div className="flex-1">
                        <p className="text-white text-sm font-medium">{exp.title}</p>
                        <p className="text-gray-400 text-xs">
                          Day {exp.day} · {exp.time_of_day}
                        </p>
                      </div>
                      <Heart size={16} className={exp.status === 'saved' ? 'text-red-400 fill-red-400' : 'text-gray-500'} />
                    </div>
                  ))}
                </div>

                {/* Open slots */}
                {city.open_slots > 0 && (
                  <div className="bg-yellow-200/10 border border-yellow-200/30 rounded-xl p-3 mb-4">
                    <p className="text-yellow-200 text-xs">
                      <span className="font-semibold">{city.open_slots} open slots</span> — add more experiences or leave time to explore.
                    </p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2">
                  <button className="flex-1 bg-gray-800 hover:bg-gray-750 text-white text-sm font-medium py-3 rounded-full transition-colors border border-gray-700">
                    Add experience
                  </button>
                  <button className="flex-1 bg-yellow-200 hover:bg-yellow-300 text-black text-sm font-semibold py-3 rounded-full transition-colors">
                    Explore {city.city_name}
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
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
    </div>
  )
}
