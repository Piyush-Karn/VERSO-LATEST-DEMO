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

      {/* Your Journey - Cinematic Day-by-Day View */}
      <div className="p-4 pb-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-white">Your Journey</h2>
          <button className="flex items-center gap-2 px-3 py-2 bg-yellow-200/10 hover:bg-yellow-200/20 rounded-full border border-yellow-200/30 transition-colors">
            <Plus size={16} className="text-yellow-200" />
            <span className="text-xs text-yellow-200 font-medium">Add day</span>
          </button>
        </div>

        <div className="space-y-6">
          {trip.route.map((city, cityIdx) => (
            <div key={city.city_id} className="space-y-4">
              {/* City Separator with Travel Info */}
              {cityIdx > 0 && (
                <div className="flex items-center gap-3 py-4">
                  <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent" />
                  <div className="flex items-center gap-2 px-4 py-2 bg-gray-900 rounded-full border border-gray-700">
                    <span className="text-lg">{city.travel_from_previous.mode}</span>
                    <span className="text-gray-400 text-sm">{city.travel_from_previous.duration}</span>
                  </div>
                  <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent" />
                </div>
              )}

              {/* City Name Header */}
              <div className="flex items-center gap-3 mb-4">
                <MapPin size={20} className="text-yellow-200" />
                <div>
                  <h3 className="text-xl font-bold text-white">{city.city_name}</h3>
                  <p className="text-gray-400 text-sm">{city.vibe} · {city.days} days</p>
                </div>
              </div>

              {/* Experiences for this city */}
              <div className="space-y-3">
                {city.experiences.map((exp, expIdx) => (
                  <div
                    key={exp.experience_id || exp.cafe_id}
                    className="bg-gray-900 rounded-2xl overflow-hidden border border-gray-800 hover:border-gray-700 transition-all"
                  >
                    {/* Experience Header */}
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-yellow-200/10 rounded-full flex items-center justify-center border border-yellow-200/30">
                            <span className="text-yellow-200 text-sm font-semibold">D{exp.day}</span>
                          </div>
                          <div>
                            <h4 className="text-white font-semibold">{exp.title}</h4>
                            <p className="text-gray-400 text-xs">{exp.time_of_day}</p>
                          </div>
                        </div>
                        <Heart size={18} className={exp.status === 'saved' ? 'text-red-400 fill-red-400' : 'text-gray-500'} />
                      </div>

                      {/* Experience Meta */}
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        {exp.category && (
                          <span className="px-2 py-1 bg-gray-800 rounded-full">{exp.category}</span>
                        )}
                        {exp.duration && (
                          <span className="flex items-center gap-1">
                            <Clock size={12} />
                            {exp.duration}
                          </span>
                        )}
                        {exp.cost && (
                          <span className="flex items-center gap-1">
                            <DollarSign size={12} />
                            {exp.cost}
                          </span>
                        )}
                      </div>

                      {/* Description */}
                      {exp.description && (
                        <p className="text-gray-400 text-sm mt-3 leading-relaxed">
                          {exp.description}
                        </p>
                      )}
                    </div>

                    {/* Experience Image */}
                    {cityImages[city.city_id] && expIdx === 0 && (
                      <div className="relative h-48 overflow-hidden">
                        <img 
                          src={cityImages[city.city_id]} 
                          alt={exp.title}
                          className="w-full h-full object-cover opacity-60"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent" />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Open slots */}
              {city.open_slots > 0 && (
                <div className="bg-yellow-200/10 border border-yellow-200/30 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-yellow-200 text-sm">
                      <span className="font-semibold">{city.open_slots} open slots</span> in {city.city_name}
                    </p>
                    <button className="text-yellow-200 text-xs hover:underline">Add more</button>
                  </div>
                </div>
              )}
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
