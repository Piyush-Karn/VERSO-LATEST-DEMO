import React, { useState, useEffect } from 'react'
import { X, MapPin, Plane, DollarSign, Clock, Star, Home, Coffee, Activity, Users, Train, Calendar, Filter as FilterIcon, TrendingUp } from 'lucide-react'
import { fetchPexelsImages } from '../services/pexels'
import { HotelBottomSheet } from './HotelBottomSheet'
import neighborhoodsData from '../data/neighborhoods_data.json'

interface NeighborhoodDetailModalProps {
  city: string
  neighborhoodId: string
  onClose: () => void
}

export const NeighborhoodDetailModal: React.FC<NeighborhoodDetailModalProps> = ({
  city,
  neighborhoodId,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'hotels' | 'things_to_do' | 'restaurants'>('overview')
  const [heroImage, setHeroImage] = useState<string>('')
  const [showHotelSheet, setShowHotelSheet] = useState(false)
  const [hotelFilters, setHotelFilters] = useState({
    checkIn: '',
    checkOut: '',
    minReview: 0,
    priceRange: [0, 1000]
  })
  
  // Get neighborhood data
  const neighborhoods = neighborhoodsData.neighborhoods[city as keyof typeof neighborhoodsData.neighborhoods] || []
  const neighborhood = neighborhoods.find(n => n.neighbourhood_id === neighborhoodId)
  
  // Get hotels for this neighborhood
  const hotels = neighborhoodsData.hotels[neighborhoodId as keyof typeof neighborhoodsData.hotels] || []

  useEffect(() => {
    if (neighborhood) {
      const loadImage = async () => {
        const photos = await fetchPexelsImages(neighborhood.image_keywords, 1)
        if (photos.length > 0) {
          setHeroImage(photos[0].src.large2x)
        }
      }
      loadImage()
    }
  }, [neighborhood])

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [onClose])

  if (!neighborhood) {
    return null
  }

  // Filter hotels based on criteria
  const filteredHotels = hotels.filter(hotel => {
    if (hotelFilters.minReview > 0 && hotel.rating < hotelFilters.minReview) return false
    if (hotel.price_per_night.min < hotelFilters.priceRange[0] || 
        hotel.price_per_night.max > hotelFilters.priceRange[1]) return false
    return true
  })

  return (
    <div 
      className="fixed inset-0 z-50 overflow-hidden"
      style={{
        background: 'linear-gradient(to bottom, #0B0B0E, #18181B)'
      }}
    >
      {/* Modal Content - Scrollable */}
      <div className="h-full overflow-y-auto">
        {/* Compact Hero Section */}
        <div className="relative h-[35vh] overflow-hidden">
          {/* Hero Image */}
          <div className="absolute inset-0">
            {heroImage ? (
              <img 
                src={heroImage} 
                alt={neighborhood.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div 
                className="w-full h-full flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, #18181B, #0B0B0E)'
                }}
              >
                <MapPin size={64} style={{ color: 'rgba(255, 255, 255, 0.2)' }} />
              </div>
            )}
            
            {/* Gradient overlay */}
            <div 
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(to top, #0B0B0E 0%, rgba(11, 11, 14, 0.6) 70%, transparent 100%)'
              }}
            />
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-3 backdrop-blur-xl rounded-full transition-all hover:scale-110 z-10"
            style={{
              background: 'rgba(0, 0, 0, 0.5)',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}
          >
            <X size={20} className="text-white" />
          </button>

          {/* Title Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <h1 className="text-4xl font-bold text-white mb-2 leading-tight">
              {neighborhood.name}
            </h1>
            <p className="text-white/90 text-base leading-relaxed">
              {neighborhood.tagline}
            </p>
          </div>
        </div>

        {/* Sticky Tab Navigation */}
        <div 
          className="sticky top-0 z-30 backdrop-blur-xl"
          style={{
            background: 'rgba(11, 11, 14, 0.90)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
          }}
        >
          <div className="flex">
            {[
              { key: 'overview', label: 'Overview', icon: MapPin },
              { key: 'hotels', label: 'Hotels', icon: Home },
              { key: 'things_to_do', label: 'Things to Do', icon: Activity },
              { key: 'cafes', label: 'Cafes', icon: Coffee }
            ].map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className="flex-1 py-4 px-3 transition-all duration-300 group relative"
                  style={{
                    color: activeTab === tab.key ? '#FFD15C' : 'rgba(255, 255, 255, 0.6)'
                  }}
                >
                  <div className="flex items-center justify-center gap-2">
                    <Icon size={18} />
                    <span className="font-medium text-sm">{tab.label}</span>
                  </div>
                  {activeTab === tab.key && (
                    <div 
                      className="absolute bottom-0 left-0 right-0 h-0.5"
                      style={{
                        background: 'linear-gradient(to right, #FFD15C, #FFA500)'
                      }}
                    />
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-8 pb-32">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <>
              {/* Quick Info Cards */}
              <div>
                <h3 className="text-2xl font-bold text-white mb-4">Quick Info</h3>
                <div className="grid grid-cols-1 gap-4">
                  {/* Airport Distance */}
                  <div 
                    className="backdrop-blur-xl rounded-2xl p-5 transition-all duration-300 hover:scale-[1.02]"
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)'
                    }}
                  >
                    <div className="flex items-start gap-4">
                      <div 
                        className="p-3 rounded-xl"
                        style={{
                          background: 'rgba(255, 209, 92, 0.15)',
                          border: '1px solid rgba(255, 209, 92, 0.3)'
                        }}
                      >
                        <Plane size={24} style={{ color: '#FFD15C' }} />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-white font-semibold mb-1">From Airport</h4>
                        <p className="text-white/70 text-sm">{neighborhood.connectivity.to_airport}</p>
                      </div>
                    </div>
                  </div>

                  {/* Local Transport */}
                  <div 
                    className="backdrop-blur-xl rounded-2xl p-5 transition-all duration-300 hover:scale-[1.02]"
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)'
                    }}
                  >
                    <div className="flex items-start gap-4">
                      <div 
                        className="p-3 rounded-xl"
                        style={{
                          background: 'rgba(255, 209, 92, 0.15)',
                          border: '1px solid rgba(255, 209, 92, 0.3)'
                        }}
                      >
                        <Train size={24} style={{ color: '#FFD15C' }} />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-white font-semibold mb-1">Local Connectivity</h4>
                        <p className="text-white/70 text-sm">
                          {neighborhood.connectivity.transport_score >= 4 ? 'Excellent public transport & taxis' : 'Taxis & ride-sharing available'}
                        </p>
                        <div className="flex gap-1 mt-2">
                          {[...Array(5)].map((_, i) => (
                            <div 
                              key={i}
                              className="w-8 h-1 rounded-full"
                              style={{
                                background: i < neighborhood.connectivity.transport_score ? '#FFD15C' : 'rgba(255, 255, 255, 0.2)'
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Ideal For */}
                  <div 
                    className="backdrop-blur-xl rounded-2xl p-5 transition-all duration-300 hover:scale-[1.02]"
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)'
                    }}
                  >
                    <div className="flex items-start gap-4">
                      <div 
                        className="p-3 rounded-xl"
                        style={{
                          background: 'rgba(255, 209, 92, 0.15)',
                          border: '1px solid rgba(255, 209, 92, 0.3)'
                        }}
                      >
                        <Users size={24} style={{ color: '#FFD15C' }} />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-white font-semibold mb-2">Ideal For</h4>
                        <div className="flex flex-wrap gap-2">
                          {neighborhood.best_for.slice(0, 4).map((item: string, idx: number) => (
                            <span 
                              key={idx}
                              className="px-3 py-1.5 rounded-full text-sm font-medium"
                              style={{
                                background: 'rgba(255, 209, 92, 0.15)',
                                border: '1px solid rgba(255, 209, 92, 0.3)',
                                color: '#FFD15C'
                              }}
                            >
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Why Stay Here - Redesigned */}
              <div>
                <h3 className="text-2xl font-bold text-white mb-4">Why stay in {neighborhood.name}?</h3>
                <div className="space-y-3">
                  {neighborhood.why_stay_here.map((reason: string, idx: number) => (
                    <div 
                      key={idx}
                      className="backdrop-blur-xl rounded-2xl p-5 transition-all duration-300 hover:translate-x-2"
                      style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)'
                      }}
                    >
                      <div className="flex items-start gap-4">
                        <div 
                          className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                          style={{
                            background: 'rgba(255, 209, 92, 0.2)',
                            border: '1px solid rgba(255, 209, 92, 0.4)'
                          }}
                        >
                          <TrendingUp size={16} style={{ color: '#FFD15C' }} />
                        </div>
                        <p className="text-white/90 leading-relaxed">{reason}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Vibe Section */}
              <div>
                <h3 className="text-2xl font-bold text-white mb-4">Neighbourhood Vibe</h3>
                <div className="flex flex-wrap gap-3">
                  {neighborhood.vibe.map((v: string, idx: number) => (
                    <span 
                      key={idx}
                      className="px-5 py-3 backdrop-blur-xl rounded-full text-base font-semibold capitalize transition-all duration-300 hover:scale-105"
                      style={{
                        background: 'rgba(255, 209, 92, 0.15)',
                        border: '1px solid rgba(255, 209, 92, 0.3)',
                        color: '#FFD15C'
                      }}
                    >
                      {v}
                    </span>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Hotels Tab */}
          {activeTab === 'hotels' && (
            <>
              {/* Hotel Filters */}
              <div 
                className="backdrop-blur-xl rounded-2xl p-5"
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <FilterIcon size={20} style={{ color: '#FFD15C' }} />
                  <h3 className="text-lg font-bold text-white">Filters</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Date Filters */}
                  <div>
                    <label className="text-white/70 text-sm mb-2 block">Check-in</label>
                    <input 
                      type="date"
                      value={hotelFilters.checkIn}
                      onChange={(e) => setHotelFilters({...hotelFilters, checkIn: e.target.value})}
                      className="w-full px-4 py-2 rounded-xl text-white"
                      style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        border: '1px solid rgba(255, 255, 255, 0.2)'
                      }}
                    />
                  </div>
                  <div>
                    <label className="text-white/70 text-sm mb-2 block">Check-out</label>
                    <input 
                      type="date"
                      value={hotelFilters.checkOut}
                      onChange={(e) => setHotelFilters({...hotelFilters, checkOut: e.target.value})}
                      className="w-full px-4 py-2 rounded-xl text-white"
                      style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        border: '1px solid rgba(255, 255, 255, 0.2)'
                      }}
                    />
                  </div>

                  {/* Review Score Filter */}
                  <div>
                    <label className="text-white/70 text-sm mb-2 block">Minimum Review Score</label>
                    <select
                      value={hotelFilters.minReview}
                      onChange={(e) => setHotelFilters({...hotelFilters, minReview: Number(e.target.value)})}
                      className="w-full px-4 py-2 rounded-xl text-white"
                      style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        border: '1px solid rgba(255, 255, 255, 0.2)'
                      }}
                    >
                      <option value="0">Any</option>
                      <option value="4">4.0+</option>
                      <option value="4.5">4.5+</option>
                      <option value="4.7">4.7+</option>
                    </select>
                  </div>

                  {/* Price Range */}
                  <div>
                    <label className="text-white/70 text-sm mb-2 block">Max Price per Night</label>
                    <select
                      value={hotelFilters.priceRange[1]}
                      onChange={(e) => setHotelFilters({...hotelFilters, priceRange: [0, Number(e.target.value)]})}
                      className="w-full px-4 py-2 rounded-xl text-white"
                      style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        border: '1px solid rgba(255, 255, 255, 0.2)'
                      }}
                    >
                      <option value="1000">Any</option>
                      <option value="100">Under $100</option>
                      <option value="200">Under $200</option>
                      <option value="300">Under $300</option>
                      <option value="500">Under $500</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Hotels List */}
              <div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  Hotels in {neighborhood.name} ({filteredHotels.length})
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  {filteredHotels.map((hotel) => (
                    <div 
                      key={hotel.hotel_id}
                      className="backdrop-blur-xl rounded-2xl overflow-hidden transition-all duration-500 hover:scale-[1.02] cursor-pointer group"
                      style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)'
                      }}
                      onClick={() => setShowHotelSheet(true)}
                    >
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h4 className="text-white font-bold text-lg mb-1">{hotel.name}</h4>
                            <p className="text-white/60 text-sm">{hotel.type}</p>
                          </div>
                          <div className="flex items-center gap-1.5 px-3 py-1.5 backdrop-blur-xl rounded-full"
                            style={{
                              background: 'rgba(255, 209, 92, 0.2)',
                              border: '1px solid rgba(255, 209, 92, 0.3)'
                            }}
                          >
                            <Star size={14} style={{ color: '#FFD15C' }} fill="#FFD15C" />
                            <span className="text-white text-sm font-bold">{hotel.rating}</span>
                          </div>
                        </div>
                        <p className="text-white/70 text-sm mb-4 italic leading-relaxed">"{hotel.tagline}"</p>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {hotel.features.map((feature, idx) => (
                            <span 
                              key={idx}
                              className="px-3 py-1 rounded-full text-xs"
                              style={{
                                background: 'rgba(255, 255, 255, 0.08)',
                                color: 'rgba(255, 255, 255, 0.8)'
                              }}
                            >
                              {feature}
                            </span>
                          ))}
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-yellow-200 font-bold text-lg">
                            ${hotel.price_per_night.min} - ${hotel.price_per_night.max}<span className="text-sm font-normal">/night</span>
                          </span>
                          <button className="text-yellow-200 text-sm font-semibold group-hover:underline flex items-center gap-1">
                            Book now →
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Things to Do Tab */}
          {activeTab === 'things_to_do' && (
            <div>
              <h3 className="text-2xl font-bold text-white mb-4">Things to Do in {neighborhood.name}</h3>
              <div className="space-y-6">
                {neighborhood.top_activities && neighborhood.top_activities.length > 0 ? (
                  neighborhood.top_activities.map((activityId: string, idx: number) => (
                    <div 
                      key={idx}
                      className="backdrop-blur-xl rounded-2xl overflow-hidden transition-all duration-500 hover:scale-[1.02]"
                      style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        minHeight: '250px'
                      }}
                    >
                      <div className="p-6">
                        <div className="flex items-start gap-4 mb-4">
                          <div 
                            className="p-3 rounded-xl"
                            style={{
                              background: 'rgba(255, 209, 92, 0.15)',
                              border: '1px solid rgba(255, 209, 92, 0.3)'
                            }}
                          >
                            <Activity size={24} style={{ color: '#FFD15C' }} />
                          </div>
                          <div className="flex-1">
                            <h4 className="text-white font-bold text-lg mb-2">Activity {idx + 1}</h4>
                            <p className="text-white/70 leading-relaxed">
                              Explore authentic experiences in {neighborhood.name}. Discover local favorites and hidden gems.
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <span 
                            className="px-3 py-1.5 rounded-full text-sm"
                            style={{
                              background: 'rgba(255, 209, 92, 0.15)',
                              color: '#FFD15C'
                            }}
                          >
                            2-3 hours
                          </span>
                          <span 
                            className="px-3 py-1.5 rounded-full text-sm"
                            style={{
                              background: 'rgba(255, 209, 92, 0.15)',
                              color: '#FFD15C'
                            }}
                          >
                            Guided tour
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <Activity size={48} className="mx-auto mb-4" style={{ color: 'rgba(255, 255, 255, 0.3)' }} />
                    <p className="text-white/60">Activities coming soon for {neighborhood.name}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Cafes Tab */}
          {activeTab === 'cafes' && (
            <div>
              <h3 className="text-2xl font-bold text-white mb-4">Cafes in {neighborhood.name}</h3>
              <div className="grid grid-cols-1 gap-4">
                {neighborhood.top_cafes && neighborhood.top_cafes.length > 0 ? (
                  neighborhood.top_cafes.map((cafe: string, idx: number) => (
                    <div 
                      key={idx}
                      className="backdrop-blur-xl rounded-2xl overflow-hidden transition-all duration-500 hover:scale-[1.02] cursor-pointer group"
                      style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)'
                      }}
                    >
                      <div className="p-6">
                        <div className="flex items-start gap-4">
                          <div 
                            className="p-3 rounded-xl"
                            style={{
                              background: 'rgba(255, 209, 92, 0.15)',
                              border: '1px solid rgba(255, 209, 92, 0.3)'
                            }}
                          >
                            <Coffee size={24} style={{ color: '#FFD15C' }} />
                          </div>
                          <div className="flex-1">
                            <h4 className="text-white font-bold text-lg mb-1">{cafe}</h4>
                            <p className="text-white/70 text-sm mb-3">
                              Specialty coffee · Cozy atmosphere · Local favorite
                            </p>
                            <div className="flex items-center gap-3">
                              <div className="flex items-center gap-1">
                                <Star size={14} style={{ color: '#FFD15C' }} fill="#FFD15C" />
                                <span className="text-white text-sm font-semibold">4.{Math.floor(Math.random() * 3) + 6}</span>
                              </div>
                              <span className="text-white/60 text-sm">·</span>
                              <span className="text-white/60 text-sm">$$</span>
                            </div>
                          </div>
                          <button className="text-yellow-200 text-sm font-semibold group-hover:underline">
                            View →
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <Coffee size={48} className="mx-auto mb-4" style={{ color: 'rgba(255, 255, 255, 0.3)' }} />
                    <p className="text-white/60">Cafe recommendations coming soon for {neighborhood.name}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Hotel Bottom Sheet (if needed) */}
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
