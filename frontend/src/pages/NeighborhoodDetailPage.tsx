import React, { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, X, MapPin, Plane, DollarSign, Clock, Star, Home, Coffee, Activity } from 'lucide-react'
import { fetchPexelsImages } from '../services/pexels'
import { HotelBottomSheet } from '../components/HotelBottomSheet'
import neighborhoodsData from '../data/neighborhoods_data.json'

export const NeighborhoodDetailPage: React.FC = () => {
  const { city, neighborhoodId } = useParams<{ city: string; neighborhoodId: string }>()
  const navigate = useNavigate()
  
  const [activeTab, setActiveTab] = useState<'overview' | 'cafes' | 'hotels' | 'activities'>('overview')
  const [heroImages, setHeroImages] = useState<string[]>([])
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [showHotelSheet, setShowHotelSheet] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [scrollY, setScrollY] = useState(0)
  const [showBreadcrumb, setShowBreadcrumb] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)

  // Get neighborhood data
  const cityKey = city?.toLowerCase() || ''
  const neighborhoods = neighborhoodsData.neighborhoods[cityKey as keyof typeof neighborhoodsData.neighborhoods] || []
  const neighborhood = neighborhoods.find(n => n.neighbourhood_id === neighborhoodId)
  
  // Get hotels for this neighborhood
  const hotels = neighborhoodsData.hotels[neighborhoodId as keyof typeof neighborhoodsData.hotels] || []

  // Load hero images
  useEffect(() => {
    if (neighborhood) {
      const loadImages = async () => {
        const photos = await fetchPexelsImages(neighborhood.image_keywords, 5)
        setHeroImages(photos.map(p => p.src.large2x))
      }
      loadImages()
    }
  }, [neighborhood])

  // Auto-rotate hero images with Ken Burns effect
  useEffect(() => {
    if (heroImages.length > 1) {
      const interval = setInterval(() => {
        setCurrentImageIndex(prev => (prev + 1) % heroImages.length)
      }, 5000)
      return () => clearInterval(interval)
    }
  }, [heroImages.length])

  // Scroll detection for parallax and breadcrumb
  useEffect(() => {
    const handleScroll = () => {
      if (contentRef.current) {
        const scrollPosition = contentRef.current.scrollTop
        setScrollY(scrollPosition)
        setShowBreadcrumb(scrollPosition > 200)
      }
    }

    const container = contentRef.current
    if (container) {
      container.addEventListener('scroll', handleScroll)
      return () => container.removeEventListener('scroll', handleScroll)
    }
  }, [])

  // Handle expansion
  const handleExpand = () => {
    setIsExpanded(true)
  }

  const handleCollapse = () => {
    setIsExpanded(false)
    setScrollY(0)
    if (contentRef.current) {
      contentRef.current.scrollTop = 0
    }
  }

  if (!neighborhood) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{
        background: 'linear-gradient(to bottom, #0B0B0E, #18181B)'
      }}>
        <p className="text-white">Neighborhood not found</p>
      </div>
    )
  }

  const parallaxOffset = scrollY * 0.3

  return (
    <div 
      ref={contentRef}
      className="fixed inset-0 overflow-y-auto overflow-x-hidden"
      style={{
        background: 'linear-gradient(to bottom, #0B0B0E, #18181B)',
        scrollBehavior: 'smooth'
      }}
    >
      {/* Animated Breadcrumb Progress Bar */}
      {showBreadcrumb && (
        <div 
          className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
          style={{
            opacity: showBreadcrumb ? 1 : 0,
            transform: `translateY(${showBreadcrumb ? 0 : -20}px)`
          }}
        >
          {/* Glassmorphic breadcrumb */}
          <div 
            className="backdrop-blur-xl px-6 py-4"
            style={{
              background: 'rgba(11, 11, 14, 0.65)',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-white/80">
                <span className="hover:text-yellow-200 cursor-pointer transition-colors" onClick={() => navigate('/vault')}>
                  Vaults
                </span>
                <span>›</span>
                <span className="hover:text-yellow-200 cursor-pointer transition-colors capitalize" onClick={() => navigate(-1)}>
                  {city}
                </span>
                <span>›</span>
                <span className="text-yellow-200 font-medium">Neighbourhoods</span>
                <span>›</span>
                <span className="text-white font-semibold">{neighborhood.name}</span>
              </div>
              <button
                onClick={handleCollapse}
                className="p-2 hover:bg-white/10 rounded-full transition-all"
              >
                <X size={20} className="text-yellow-200" />
              </button>
            </div>
          </div>
          {/* Progress indicator */}
          <div className="h-0.5 bg-gray-800">
            <div 
              className="h-full transition-all duration-300"
              style={{
                width: `${Math.min((scrollY / (contentRef.current?.scrollHeight || 1)) * 100, 100)}%`,
                background: 'linear-gradient(to right, #FFD15C, #FFA500)'
              }}
            />
          </div>
        </div>
      )}

      {/* Hero Section with Parallax */}
      <div className="relative h-[60vh] overflow-hidden">
        {/* Parallax Background Layer */}
        <div 
          className="absolute inset-0"
          style={{
            transform: `translateY(${-parallaxOffset}px)`,
            transition: 'transform 0.1s linear'
          }}
        >
          {heroImages.length > 0 ? (
            <>
              {heroImages.map((img, idx) => (
                <div
                  key={idx}
                  className="absolute inset-0 w-full h-full"
                  style={{
                    opacity: idx === currentImageIndex ? 1 : 0,
                    transition: 'opacity 1s cubic-bezier(0.25,1,0.5,1)'
                  }}
                >
                  <img
                    src={img}
                    alt={neighborhood.name}
                    className="w-full h-full object-cover"
                    style={{
                      animation: idx === currentImageIndex ? 'kenBurns 8s ease-out forwards' : 'none'
                    }}
                  />
                </div>
              ))}
            </>
          ) : (
            <div 
              className="w-full h-full flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, #18181B, #0B0B0E)'
              }}
            >
              <MapPin size={64} className="text-gray-700" />
            </div>
          )}
          
          {/* Cinematic gradient overlay */}
          <div 
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(to top, #0B0B0E 0%, rgba(11, 11, 14, 0.7) 50%, transparent 100%)'
            }}
          />
          
          {/* Ambient gold rim light effect */}
          <div 
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(ellipse at bottom, rgba(255, 209, 92, 0.15) 0%, transparent 60%)'
            }}
          />
        </div>

        {/* Fixed Header Controls */}
        <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between z-20">
          <button
            onClick={() => navigate(-1)}
            className="p-3 backdrop-blur-xl rounded-full hover:scale-105 transition-all duration-300"
            style={{
              background: 'rgba(0, 0, 0, 0.5)',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}
          >
            <ArrowLeft size={20} className="text-white" />
          </button>
          
          {/* City breadcrumb chip */}
          <div 
            className="backdrop-blur-xl px-4 py-2 rounded-full"
            style={{
              background: 'rgba(0, 0, 0, 0.5)',
              border: '1px solid rgba(255, 209, 92, 0.3)'
            }}
          >
            <p className="text-white text-sm font-medium">
              {neighborhood.city} → <span className="text-yellow-200">{neighborhood.name}</span>
            </p>
          </div>

          <div className="w-11" /> {/* Spacer */}
        </div>

        {/* Hero Content Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-8 z-10">
          <div className="space-y-4">
            {/* Vibe tags */}
            <div className="flex items-center gap-2 flex-wrap">
              {neighborhood.vibe.slice(0, 3).map((v, idx) => (
                <span 
                  key={idx}
                  className="px-3 py-1.5 rounded-full text-xs font-medium backdrop-blur-xl uppercase tracking-wider"
                  style={{
                    background: 'rgba(255, 209, 92, 0.2)',
                    border: '1px solid rgba(255, 209, 92, 0.4)',
                    color: '#FFD15C'
                  }}
                >
                  {v}
                </span>
              ))}
            </div>
            
            {/* Title */}
            <h1 
              className="text-5xl font-bold text-white leading-tight"
              style={{
                textShadow: '0 4px 20px rgba(0, 0, 0, 0.6)',
                fontFamily: 'Inter, sans-serif'
              }}
            >
              {neighborhood.name}
            </h1>
            
            {/* Tagline */}
            <p 
              className="text-white/90 text-xl leading-relaxed max-w-2xl"
              style={{
                textShadow: '0 2px 10px rgba(0, 0, 0, 0.5)'
              }}
            >
              {neighborhood.tagline}
            </p>
          </div>
        </div>

        {/* Image carousel indicators */}
        {heroImages.length > 1 && (
          <div className="absolute bottom-32 left-0 right-0 flex justify-center gap-2 z-10">
            {heroImages.map((_, idx) => (
              <div
                key={idx}
                className="rounded-full transition-all duration-500"
                style={{
                  height: '4px',
                  width: idx === currentImageIndex ? '32px' : '4px',
                  background: idx === currentImageIndex ? '#FFD15C' : 'rgba(255, 255, 255, 0.4)'
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Sticky Tab Navigation */}
      <div 
        className="sticky z-30 backdrop-blur-xl"
        style={{
          top: showBreadcrumb ? '73px' : '0',
          background: 'rgba(11, 11, 14, 0.85)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          transition: 'top 0.3s cubic-bezier(0.25,1,0.5,1)'
        }}
      >
        <div className="flex">
          {[
            { key: 'overview', label: 'Overview', icon: MapPin },
            { key: 'cafes', label: 'Cafés', icon: Coffee },
            { key: 'hotels', label: 'Hotels', icon: Home },
            { key: 'activities', label: 'Activities', icon: Activity }
          ].map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className="flex-1 py-4 px-4 transition-all duration-300 group relative"
                style={{
                  color: activeTab === tab.key ? '#FFD15C' : 'rgba(255, 255, 255, 0.6)'
                }}
              >
                <div className="flex items-center justify-center gap-2">
                  <Icon size={18} />
                  <span className="font-medium">{tab.label}</span>
                </div>
                {/* Active indicator */}
                <div 
                  className="absolute bottom-0 left-0 right-0 h-0.5 transition-all duration-300"
                  style={{
                    background: activeTab === tab.key ? 'linear-gradient(to right, #FFD15C, #FFA500)' : 'transparent',
                    opacity: activeTab === tab.key ? 1 : 0
                  }}
                />
              </button>
            )
          })}
        </div>
      </div>

      {/* Content Body - Scrollable */}
      <div className="relative z-10">
        <div className="p-6 space-y-8 pb-32">
          {activeTab === 'overview' && (
            <>
              {/* Quick Stats - Glassmorphic Cards */}
              <div className="grid grid-cols-3 gap-4">
                <div 
                  className="backdrop-blur-xl rounded-2xl p-5 text-center transition-all duration-300 hover:scale-105"
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                  }}
                >
                  <Plane size={24} className="mx-auto mb-3" style={{ color: '#FFD15C' }} />
                  <p className="text-white/60 text-xs mb-2 uppercase tracking-wide">From Airport</p>
                  <p className="text-white font-bold text-base">{neighborhood.connectivity.to_airport}</p>
                </div>
                <div 
                  className="backdrop-blur-xl rounded-2xl p-5 text-center transition-all duration-300 hover:scale-105"
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                  }}
                >
                  <DollarSign size={24} className="mx-auto mb-3" style={{ color: '#FFD15C' }} />
                  <p className="text-white/60 text-xs mb-2 uppercase tracking-wide">Avg. Nightly</p>
                  <p className="text-white font-bold text-base">
                    ${neighborhood.price_range.min}-{neighborhood.price_range.max}
                  </p>
                </div>
                <div 
                  className="backdrop-blur-xl rounded-2xl p-5 text-center transition-all duration-300 hover:scale-105"
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                  }}
                >
                  <Clock size={24} className="mx-auto mb-3" style={{ color: '#FFD15C' }} />
                  <p className="text-white/60 text-xs mb-2 uppercase tracking-wide">Best Time</p>
                  <p className="text-white font-bold text-base">
                    {neighborhood.seasonality[0] === 'All year' 
                      ? 'All year' 
                      : neighborhood.seasonality.slice(0, 2).join(', ')}
                  </p>
                </div>
              </div>

              {/* Why Stay Here - Editorial Style */}
              <div className="space-y-6">
                <h3 className="text-3xl font-bold text-white">Why stay here?</h3>
                <div className="space-y-4">
                  {neighborhood.why_stay_here.map((reason, idx) => (
                    <div 
                      key={idx} 
                      className="flex items-start gap-4 p-4 rounded-xl backdrop-blur-xl transition-all duration-300 hover:translate-x-2"
                      style={{
                        background: 'rgba(255, 255, 255, 0.03)',
                        border: '1px solid rgba(255, 255, 255, 0.08)'
                      }}
                    >
                      <div 
                        className="w-2 h-2 rounded-full mt-2 flex-shrink-0"
                        style={{ background: '#FFD15C' }}
                      />
                      <p className="text-white/90 text-base leading-relaxed">{reason}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Vibe Section */}
              <div className="space-y-6">
                <h3 className="text-3xl font-bold text-white">Vibe</h3>
                <div className="flex flex-wrap gap-3">
                  {neighborhood.vibe.map((v, idx) => (
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

              {/* Best For Grid */}
              <div className="space-y-6">
                <h3 className="text-3xl font-bold text-white">Perfect for</h3>
                <div className="grid grid-cols-2 gap-4">
                  {neighborhood.best_for.map((item, idx) => (
                    <div 
                      key={idx} 
                      className="backdrop-blur-xl rounded-2xl p-6 transition-all duration-300 hover:scale-105"
                      style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)'
                      }}
                    >
                      <Star size={20} className="mb-3" style={{ color: '#FFD15C' }} />
                      <p className="text-white text-base font-semibold">{item}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Stay Types - Horizontal Scroll */}
              <div className="space-y-6">
                <h3 className="text-3xl font-bold text-white">Recommended stays</h3>
                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide -mx-6 px-6">
                  {neighborhood.recommended_stay_types.map((type, idx) => (
                    <div 
                      key={idx}
                      className="flex-none backdrop-blur-xl rounded-2xl p-6 min-w-[240px] transition-all duration-300 hover:scale-105"
                      style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)'
                      }}
                    >
                      <Home size={24} className="mb-3" style={{ color: '#FFD15C' }} />
                      <p className="text-white text-base font-semibold">{type}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Hotels Preview */}
              {hotels.length > 0 && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-3xl font-bold text-white">
                      Where to stay
                    </h3>
                    <span className="text-yellow-200 text-sm font-medium">
                      {hotels.length} options
                    </span>
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    {hotels.slice(0, 3).map((hotel) => (
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
                          <div className="flex items-center justify-between">
                            <span className="text-yellow-200 font-bold text-lg">
                              ${hotel.price_per_night.min} - ${hotel.price_per_night.max}<span className="text-sm font-normal">/night</span>
                            </span>
                            <button className="text-yellow-200 text-sm font-semibold group-hover:underline flex items-center gap-1">
                              View details →
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  {hotels.length > 3 && (
                    <button
                      onClick={() => setShowHotelSheet(true)}
                      className="w-full py-4 rounded-full backdrop-blur-xl font-semibold transition-all duration-300 hover:scale-105"
                      style={{
                        background: 'rgba(255, 209, 92, 0.15)',
                        border: '1px solid rgba(255, 209, 92, 0.3)',
                        color: '#FFD15C'
                      }}
                    >
                      View all {hotels.length} hotels
                    </button>
                  )}
                </div>
              )}
            </>
          )}

          {/* Cafés Tab */}
          {activeTab === 'cafes' && (
            <div className="text-center py-16 space-y-6">
              <Coffee size={64} className="mx-auto mb-4" style={{ color: '#FFD15C', opacity: 0.6 }} />
              <div className="space-y-3">
                <h3 className="text-2xl font-bold text-white">Discover cafés</h3>
                <p className="text-white/60 text-base max-w-md mx-auto">
                  Explore the best coffee spots and cozy corners in {neighborhood.name}
                </p>
              </div>
              <button
                onClick={() => navigate(`/vault/${neighborhood.country.toLowerCase()}/city/${neighborhood.city.toLowerCase()}`, { state: { tab: 'cafes', neighborhood: neighborhoodId } })}
                className="px-10 py-5 rounded-full font-bold transition-all duration-300 hover:scale-105"
                style={{
                  background: 'linear-gradient(135deg, #FFD15C, #FFA500)',
                  color: '#0B0B0E',
                  boxShadow: '0 8px 32px rgba(255, 209, 92, 0.3)'
                }}
              >
                View Cafés Feed
              </button>
            </div>
          )}

          {/* Hotels Tab */}
          {activeTab === 'hotels' && hotels.length > 0 && (
            <div className="space-y-6">
              <h3 className="text-3xl font-bold text-white">All stays in {neighborhood.name}</h3>
              <div className="grid grid-cols-1 gap-4">
                {hotels.map((hotel) => (
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
                            className="px-3 py-1 rounded-full text-xs backdrop-blur-xl"
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
                          View details →
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Activities Tab */}
          {activeTab === 'activities' && (
            <div className="text-center py-16 space-y-6">
              <Activity size={64} className="mx-auto mb-4" style={{ color: '#FFD15C', opacity: 0.6 }} />
              <div className="space-y-3">
                <h3 className="text-2xl font-bold text-white">Discover activities</h3>
                <p className="text-white/60 text-base max-w-md mx-auto">
                  Find unique experiences and things to do in {neighborhood.name}
                </p>
              </div>
              <button
                onClick={() => navigate(`/vault/${neighborhood.country.toLowerCase()}/city/${neighborhood.city.toLowerCase()}`, { state: { tab: 'activities', neighborhood: neighborhoodId } })}
                className="px-10 py-5 rounded-full font-bold transition-all duration-300 hover:scale-105"
                style={{
                  background: 'linear-gradient(135deg, #FFD15C, #FFA500)',
                  color: '#0B0B0E',
                  boxShadow: '0 8px 32px rgba(255, 209, 92, 0.3)'
                }}
              >
                View Activities Feed
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Floating CTA Bar - Bottom */}
      <div 
        className="fixed bottom-0 left-0 right-0 backdrop-blur-xl p-5 z-40"
        style={{
          background: 'rgba(11, 11, 14, 0.85)',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)'
        }}
      >
        <div className="flex gap-3">
          <button
            onClick={() => setShowHotelSheet(true)}
            className="flex-1 py-5 rounded-full font-bold transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
            style={{
              background: 'linear-gradient(135deg, #FFD15C, #FFA500)',
              color: '#0B0B0E',
              boxShadow: '0 8px 32px rgba(255, 209, 92, 0.3)'
            }}
          >
            <Home size={20} />
            Find a stay
          </button>
          <button
            onClick={() => navigate(`/vault/${neighborhood.country.toLowerCase()}/city/${neighborhood.city.toLowerCase()}`)}
            className="flex-1 py-5 rounded-full font-bold transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: 'white'
            }}
          >
            ☕ Explore nearby
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

      {/* Ken Burns Animation CSS */}
      <style>{`
        @keyframes kenBurns {
          from {
            transform: scale(1);
          }
          to {
            transform: scale(1.05);
          }
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
