import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, MapPin, Plane, DollarSign, Users, TrendingUp } from 'lucide-react'
import { fetchPexelsImages } from '../services/pexels'
import { NeighborhoodDetailModal } from '../components/NeighborhoodDetailModal'
// import neighborhoodsData from '../data/neighborhoods_data.json'
const neighborhoodsData: any = {}

export const NeighborhoodsHomePage: React.FC = () => {
  const { city } = useParams<{ city: string }>()
  const navigate = useNavigate()
  
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<string | null>(null)
  const [neighborhoodImages, setNeighborhoodImages] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)

  // Get neighborhood data
  const cityKey = city?.toLowerCase() || ''
  const neighborhoods = neighborhoodsData.neighborhoods[cityKey as keyof typeof neighborhoodsData.neighborhoods] || []

  useEffect(() => {
    const loadImages = async () => {
      setLoading(true)
      const images: Record<string, string> = {}
      
      for (const neighborhood of neighborhoods) {
        const photos = await fetchPexelsImages(neighborhood.image_keywords, 1)
        if (photos.length > 0) {
          images[neighborhood.neighbourhood_id] = photos[0].src.large2x
        }
      }
      
      setNeighborhoodImages(images)
      setLoading(false)
    }
    
    if (neighborhoods.length > 0) {
      loadImages()
    } else {
      setLoading(false)
    }
  }, [city, neighborhoods.length])

  // Get popular vibe descriptor
  const getVibeDescriptor = (neighborhood: any) => {
    const vibes = neighborhood.vibe || []
    if (vibes.includes('nightlife') || vibes.includes('energetic')) return 'Popular for parties'
    if (vibes.includes('traditional') || vibes.includes('cultural')) return 'Liked by tourists'
    if (vibes.includes('nomad') || vibes.includes('social')) return 'Loved by expats'
    if (vibes.includes('romantic') || vibes.includes('peaceful')) return 'Perfect for couples'
    return 'Trending neighbourhood'
  }

  return (
    <div 
      className="min-h-screen"
      style={{
        background: 'linear-gradient(to bottom, #0B0B0E, #18181B)'
      }}
    >
      {/* Header */}
      <div className="sticky top-0 backdrop-blur-xl z-20" style={{
        background: 'rgba(11, 11, 14, 0.85)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <div className="flex items-center justify-between p-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <ArrowLeft size={20} className="text-white" />
          </button>
          
          <h1 className="text-xl font-bold text-white capitalize">{city} Neighbourhoods</h1>
          
          <div className="w-9" /> {/* Spacer */}
        </div>
      </div>

      {/* Explore Callout Banner */}
      <div className="px-4 pt-6 pb-4">
        <div 
          className="backdrop-blur-xl rounded-2xl p-5 border"
          style={{
            background: 'linear-gradient(135deg, rgba(255, 209, 92, 0.15), rgba(255, 165, 0, 0.1))',
            borderColor: 'rgba(255, 209, 92, 0.3)'
          }}
        >
          <h2 className="text-white font-bold text-xl mb-2">
            Explore popular neighbourhoods in {city}
          </h2>
          <p className="text-white/80 text-sm leading-relaxed">
            Discover the unique character and hidden gems of each area
          </p>
        </div>
      </div>

      {/* Neighbourhoods Grid */}
      <div className="p-4 space-y-6 pb-24">
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2" style={{ borderColor: '#FFD15C' }} />
          </div>
        )}

        {!loading && neighborhoods.length === 0 && (
          <div className="text-center py-12">
            <MapPin size={48} className="mx-auto mb-4" style={{ color: 'rgba(255, 255, 255, 0.3)' }} />
            <p className="text-white/60">No neighbourhoods available</p>
          </div>
        )}

        {!loading && neighborhoods.map((neighborhood: any) => {
          const imageUrl = neighborhoodImages[neighborhood.neighbourhood_id]
          
          return (
            <button
              key={neighborhood.neighbourhood_id}
              onClick={() => setSelectedNeighborhood(neighborhood.neighbourhood_id)}
              className="w-full group"
            >
              {/* Collapsible Neighbourhood Card */}
              <div 
                className="relative rounded-3xl overflow-hidden transition-all duration-500 hover:scale-[1.02]"
                style={{
                  height: '400px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}
              >
                {/* Hero Image */}
                <div className="absolute inset-0">
                  {imageUrl ? (
                    <img 
                      src={imageUrl} 
                      alt={neighborhood.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
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
                      background: 'linear-gradient(to top, #0B0B0E 0%, rgba(11, 11, 14, 0.7) 60%, transparent 100%)'
                    }}
                  />
                </div>

                {/* Content Overlay */}
                <div className="absolute inset-0 flex flex-col justify-end p-6">
                  {/* Vibe descriptor tag */}
                  <div className="mb-3">
                    <span 
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium backdrop-blur-xl"
                      style={{
                        background: 'rgba(255, 209, 92, 0.2)',
                        border: '1px solid rgba(255, 209, 92, 0.4)',
                        color: '#FFD15C'
                      }}
                    >
                      <TrendingUp size={12} />
                      {getVibeDescriptor(neighborhood)}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-4xl font-bold text-white mb-2 leading-tight">
                    {neighborhood.name}
                  </h3>

                  {/* Tagline */}
                  <p className="text-white/90 text-lg mb-4 leading-relaxed">
                    {neighborhood.tagline}
                  </p>

                  {/* Quick Info Bar */}
                  <div className="flex items-center gap-3 flex-wrap">
                    <div 
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full backdrop-blur-xl"
                      style={{
                        background: 'rgba(0, 0, 0, 0.5)',
                        border: '1px solid rgba(255, 255, 255, 0.2)'
                      }}
                    >
                      <Plane size={14} style={{ color: '#FFD15C' }} />
                      <span className="text-white text-sm font-medium">{neighborhood.connectivity.to_airport}</span>
                    </div>
                    <div 
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full backdrop-blur-xl"
                      style={{
                        background: 'rgba(0, 0, 0, 0.5)',
                        border: '1px solid rgba(255, 255, 255, 0.2)'
                      }}
                    >
                      <DollarSign size={14} style={{ color: '#FFD15C' }} />
                      <span className="text-white text-sm font-medium">
                        ${neighborhood.price_range.min}-{neighborhood.price_range.max}
                      </span>
                    </div>
                    {neighborhood.best_for && neighborhood.best_for.length > 0 && (
                      <div 
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full backdrop-blur-xl"
                        style={{
                          background: 'rgba(0, 0, 0, 0.5)',
                          border: '1px solid rgba(255, 255, 255, 0.2)'
                        }}
                      >
                        <Users size={14} style={{ color: '#FFD15C' }} />
                        <span className="text-white text-sm font-medium">{neighborhood.best_for[0]}</span>
                      </div>
                    )}
                  </div>

                  {/* Tap to explore hint */}
                  <div className="mt-4 flex items-center justify-center gap-2 opacity-60">
                    <div className="w-1 h-1 bg-white rounded-full animate-pulse" />
                    <div className="w-1 h-1 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.1s' }} />
                    <div className="w-1 h-1 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
                  </div>
                </div>
              </div>
            </button>
          )
        })}
      </div>

      {/* Neighbourhood Detail Modal */}
      {selectedNeighborhood && (
        <NeighborhoodDetailModal
          city={cityKey}
          neighborhoodId={selectedNeighborhood}
          onClose={() => setSelectedNeighborhood(null)}
        />
      )}
    </div>
  )
}
