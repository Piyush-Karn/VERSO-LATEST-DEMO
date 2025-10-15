import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, MapPin, Plane, DollarSign, Clock, Star, Home } from 'lucide-react'
import { fetchPexelsImages } from '../services/pexels'
import { HotelBottomSheet } from '../components/HotelBottomSheet'
import neighborhoodsData from '../data/neighborhoods_data.json'

export const NeighborhoodDetailPage: React.FC = () => {
  const { city, neighborhoodId } = useParams<{ city: string; neighborhoodId: string }>()
  const navigate = useNavigate()
  
  const [activeTab, setActiveTab] = useState<'overview' | 'activities' | 'cafes'>('overview')
  const [heroImages, setHeroImages] = useState<string[]>([])
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [showHotelSheet, setShowHotelSheet] = useState(false)

  // Get neighborhood data
  const cityKey = city?.toLowerCase() || ''
  const neighborhoods = neighborhoodsData.neighborhoods[cityKey as keyof typeof neighborhoodsData.neighborhoods] || []
  const neighborhood = neighborhoods.find(n => n.neighbourhood_id === neighborhoodId)
  
  // Get hotels for this neighborhood
  const hotels = neighborhoodsData.hotels[neighborhoodId as keyof typeof neighborhoodsData.hotels] || []

  useEffect(() => {
    if (neighborhood) {
      const loadImages = async () => {
        const photos = await fetchPexelsImages(neighborhood.image_keywords, 5)
        setHeroImages(photos.map(p => p.src.large2x))
      }
      loadImages()
    }
  }, [neighborhood])

  // Auto-rotate hero images
  useEffect(() => {
    if (heroImages.length > 1) {
      const interval = setInterval(() => {
        setCurrentImageIndex(prev => (prev + 1) % heroImages.length)
      }, 5000)
      return () => clearInterval(interval)
    }
  }, [heroImages.length])

  if (!neighborhood) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <p className="text-white">Neighborhood not found</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Hero Section */}
      <div className="relative h-[60vh] overflow-hidden">
        {/* Image Carousel */}
        <div className="absolute inset-0">
          {heroImages.length > 0 ? (
            <>
              {heroImages.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={neighborhood.name}
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
                    idx === currentImageIndex ? 'opacity-100' : 'opacity-0'
                  }`}
                />
              ))}
            </>
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
              <MapPin size={64} className="text-gray-600" />
            </div>
          )}
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent" />
        </div>

        {/* Header */}
        <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between z-10">
          <button
            onClick={() => navigate(-1)}
            className="p-3 bg-black/50 backdrop-blur-md rounded-full hover:bg-black/70 transition-colors"
          >
            <ArrowLeft size={20} className="text-white" />
          </button>
          
          {/* Breadcrumb */}
          <div className="bg-black/50 backdrop-blur-md px-4 py-2 rounded-full">
            <p className="text-white text-sm">
              {neighborhood.city} → {neighborhood.name}
            </p>
          </div>

          <div className="w-11" /> {/* Spacer */}
        </div>

        {/* Title Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
          <h1 className="text-4xl font-bold text-white mb-2 leading-tight">
            {neighborhood.name}
          </h1>
          <p className="text-white/90 text-lg leading-relaxed">
            {neighborhood.tagline}
          </p>
        </div>

        {/* Image indicators */}
        {heroImages.length > 1 && (
          <div className="absolute bottom-24 left-0 right-0 flex justify-center gap-2 z-10">
            {heroImages.map((_, idx) => (
              <div
                key={idx}
                className={`h-1 rounded-full transition-all duration-300 ${
                  idx === currentImageIndex ? 'w-8 bg-yellow-200' : 'w-1 bg-white/40'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="relative -mt-6 bg-gray-900 rounded-t-3xl z-20">
        {/* Tab Navigation */}
        <div className="flex border-b border-gray-800 sticky top-0 bg-gray-900 z-10">
          {[
            { key: 'overview', label: 'Overview' },
            { key: 'activities', label: 'Activities' },
            { key: 'cafes', label: 'Cafés' }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex-1 py-3 px-4 transition-colors ${
                activeTab === tab.key 
                  ? 'border-b-2 border-yellow-200 text-yellow-200' 
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-6 space-y-6">
          {activeTab === 'overview' && (
            <>
          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-gray-800 rounded-xl p-4 text-center">
              <Plane size={20} className="text-yellow-200 mx-auto mb-2" />
              <p className="text-white/60 text-xs mb-1">From Airport</p>
              <p className="text-white font-semibold text-sm">{neighborhood.connectivity.to_airport}</p>
            </div>
            <div className="bg-gray-800 rounded-xl p-4 text-center">
              <DollarSign size={20} className="text-yellow-200 mx-auto mb-2" />
              <p className="text-white/60 text-xs mb-1">Avg. Nightly</p>
              <p className="text-white font-semibold text-sm">
                ${neighborhood.price_range.min}-{neighborhood.price_range.max}
              </p>
            </div>
            <div className="bg-gray-800 rounded-xl p-4 text-center">
              <Clock size={20} className="text-yellow-200 mx-auto mb-2" />
              <p className="text-white/60 text-xs mb-1">Best Time</p>
              <p className="text-white font-semibold text-sm">
                {neighborhood.seasonality[0] === 'All year' 
                  ? 'All year' 
                  : neighborhood.seasonality.slice(0, 2).join(', ')}
              </p>
            </div>
          </div>

          {/* Why Stay Here */}
          <div>
            <h3 className="text-xl font-bold text-white mb-4">Why stay here?</h3>
            <div className="space-y-3">
              {neighborhood.why_stay_here.map((reason, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 bg-yellow-200 rounded-full mt-2 flex-shrink-0" />
                  <p className="text-white/80 text-sm leading-relaxed">{reason}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Vibe Tags */}
          <div>
            <h3 className="text-xl font-bold text-white mb-4">Vibe</h3>
            <div className="flex flex-wrap gap-2">
              {neighborhood.vibe.map((v, idx) => (
                <span 
                  key={idx}
                  className="px-4 py-2 bg-yellow-200/20 border border-yellow-200/30 text-yellow-200 rounded-full text-sm font-medium capitalize"
                >
                  {v}
                </span>
              ))}
            </div>
          </div>

          {/* Best For */}
          <div>
            <h3 className="text-xl font-bold text-white mb-4">Perfect for</h3>
            <div className="grid grid-cols-2 gap-3">
              {neighborhood.best_for.map((item, idx) => (
                <div key={idx} className="bg-gray-800 rounded-xl p-4">
                  <Star size={16} className="text-yellow-200 mb-2" />
                  <p className="text-white text-sm font-medium">{item}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Stay Types */}
          <div>
            <h3 className="text-xl font-bold text-white mb-4">Recommended stays</h3>
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {neighborhood.recommended_stay_types.map((type, idx) => (
                <div 
                  key={idx}
                  className="flex-none bg-gray-800 rounded-xl p-4 min-w-[200px]"
                >
                  <Home size={20} className="text-yellow-200 mb-2" />
                  <p className="text-white text-sm font-medium">{type}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Hotels Preview - Overview Tab Only */}
          {activeTab === 'overview' && hotels.length > 0 && (
            <div>
              <h3 className="text-xl font-bold text-white mb-4">
                Where to stay ({hotels.length} options)
              </h3>
              <div className="grid grid-cols-1 gap-4">
                {hotels.slice(0, 2).map((hotel) => (
                  <div 
                    key={hotel.hotel_id}
                    className="bg-gray-800 rounded-xl overflow-hidden hover:bg-gray-750 transition-colors cursor-pointer"
                    onClick={() => setShowHotelSheet(true)}
                  >
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h4 className="text-white font-semibold mb-1">{hotel.name}</h4>
                          <p className="text-white/60 text-xs">{hotel.type}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star size={14} className="text-yellow-500 fill-yellow-500" />
                          <span className="text-white text-sm font-semibold">{hotel.rating}</span>
                        </div>
                      </div>
                      <p className="text-white/70 text-sm mb-3 italic">"{hotel.tagline}"</p>
                      <div className="flex items-center justify-between">
                        <span className="text-yellow-200 font-bold">
                          ${hotel.price_per_night.min} - ${hotel.price_per_night.max}/night
                        </span>
                        <button className="text-yellow-200 text-sm font-medium hover:underline">
                          View →
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sticky CTA Bar */}
        <div className="sticky bottom-0 bg-gray-800 border-t border-gray-700 p-4 flex gap-3">
          <button
            onClick={() => setShowHotelSheet(true)}
            className="flex-1 bg-yellow-200 hover:bg-yellow-300 text-black font-semibold py-4 rounded-full transition-all shadow-lg flex items-center justify-center gap-2"
          >
            <Home size={18} />
            Book a stay in {neighborhood.name}
          </button>
          <button
            onClick={() => navigate(`/vault/${neighborhood.country.toLowerCase()}/city/${neighborhood.city.toLowerCase()}`)}
            className="flex-1 bg-white/10 backdrop-blur-md hover:bg-white/20 border-2 border-white/30 text-white font-semibold py-4 rounded-full transition-all shadow-lg flex items-center justify-center gap-2"
          >
            ☕ Explore cafés nearby
          </button>
        </div>
      </div>

      {/* Hotel Bottom Sheet */}
      {showHotelSheet && hotels.length > 0 && (
        <HotelBottomSheet
          hotels={hotels}
          neighborhoodName={neighborhood.name}
          onClose={() => setShowHotelSheet(false)}
        />
      )}
    </div>
  )
}
