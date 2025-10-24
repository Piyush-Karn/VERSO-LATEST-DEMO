import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Filter, Loader2, MapPin, Plane, DollarSign, Users, TrendingUp } from 'lucide-react'
import { fetchPexelsImages, type PexelsPhoto } from '../services/pexels'
import { FilterModal } from '../components/FilterModal'
import { NeighborhoodDetailModal } from '../components/NeighborhoodDetailModal'
import neighborhoodsData from '../data/neighborhoods_data.json'
import demoDataset from '../data/verso_demo_dataset.json'

export const CityDetailPage: React.FC = () => {
  const { country, cityName } = useParams<{ country: string; cityName: string }>()
  const navigate = useNavigate()
  
  const [activeTab, setActiveTab] = useState<'neighborhoods' | 'activities' | 'restaurants'>('neighborhoods')
  const [loading, setLoading] = useState(true)
  const [showFilter, setShowFilter] = useState(false)
  const [travelingWith, setTravelingWith] = useState<string>('')
  const [neighborhoodImages, setNeighborhoodImages] = useState<Record<string, string>>({})
  const [activityImages, setActivityImages] = useState<PexelsPhoto[]>([])
  const [restaurantImages, setRestaurantImages] = useState<PexelsPhoto[]>([])
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<string | null>(null)

  // Get city data
  const cityKey = cityName?.toLowerCase() || ''
  const countryKey = country?.toLowerCase() || ''
  const neighborhoods = (neighborhoodsData.neighborhoods as any)[cityKey] || []
  
  // Get city activities and restaurants from demo dataset
  const countryData = (demoDataset.countries as any)[countryKey]
  const cityData = countryData?.cities?.[cityKey]
  const activities = cityData?.things_to_do || []
  const restaurants = cityData?.cafes || []

  useEffect(() => {
    const loadImages = async () => {
      setLoading(true)
      
      if (activeTab === 'neighborhoods' && neighborhoods.length > 0) {
        // Load one image per neighborhood
        const images: Record<string, string> = {}
        for (const neighborhood of neighborhoods) {
          const photos = await fetchPexelsImages(neighborhood.image_keywords, 1)
          if (photos.length > 0) {
            images[neighborhood.neighbourhood_id] = photos[0].src.large2x
          }
        }
        setNeighborhoodImages(images)
      }
      
      if (activeTab === 'activities' && activities.length > 0) {
        const photos = await fetchPexelsImages(`${cityName} activities attractions`, 6)
        setActivityImages(photos)
      }
      
      if (activeTab === 'restaurants' && restaurants.length > 0) {
        const photos = await fetchPexelsImages(`${cityName} cafes restaurants food`, 6)
        setRestaurantImages(photos)
      }
      
      setLoading(false)
    }
    
    loadImages()
  }, [activeTab, cityName, neighborhoods.length, activities.length, restaurants.length])

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
          
          <h1 className="text-xl font-bold text-white capitalize">{cityName}</h1>
          
          {activeTab === 'neighborhoods' && (
            <button
              onClick={() => setShowFilter(true)}
              className="p-2 hover:bg-gray-800 rounded-full transition-colors relative"
            >
              <Filter size={20} className="text-white" />
              {travelingWith && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-200 rounded-full border-2 border-black" />
              )}
            </button>
          )}
          {activeTab !== 'neighborhoods' && <div className="w-9" />}
        </div>

        {/* Tab Navigation */}
        <div className="flex border-t border-gray-800">
          {['neighborhoods', 'activities', 'restaurants'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`flex-1 py-3 px-4 capitalize transition-colors ${
                activeTab === tab 
                  ? 'border-b-2 border-yellow-200 text-yellow-200' 
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 pb-24">
        {/* Neighborhoods Tab */}
        {activeTab === 'neighborhoods' && (
          <div>
            {loading && (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="animate-spin text-yellow-200" size={32} />
              </div>
            )}

            {!loading && neighborhoods.length === 0 && (
              <div className="text-center py-12">
                <MapPin size={48} className="text-gray-600 mx-auto mb-4" />
                <p className="text-gray-500">No neighborhoods available</p>
              </div>
            )}

            {!loading && neighborhoods.length > 0 && (
              <div className="space-y-6">
                {neighborhoods.map((neighborhood: any) => {
                  const imageUrl = neighborhoodImages[neighborhood.neighbourhood_id]
                  
                  // Get popular vibe descriptor
                  const getVibeDescriptor = () => {
                    const vibes = neighborhood.vibe || []
                    if (vibes.includes('nightlife') || vibes.includes('energetic')) return 'Popular for parties'
                    if (vibes.includes('traditional') || vibes.includes('cultural')) return 'Liked by tourists'
                    if (vibes.includes('nomad') || vibes.includes('social')) return 'Loved by expats'
                    if (vibes.includes('romantic') || vibes.includes('peaceful')) return 'Perfect for couples'
                    return 'Trending neighbourhood'
                  }
                  
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
                              {getVibeDescriptor()}
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
            )}
          </div>
        )}

        {/* Activities Tab */}
        {activeTab === 'activities' && (
          <div>
            <p className="text-gray-400 text-sm mb-4">
              Things to do in {cityName}
            </p>
            
            {loading && (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="animate-spin text-yellow-200" size={32} />
              </div>
            )}
            
            {!loading && activities.length === 0 && (
              <div className="text-center py-12">
                <MapPin size={48} className="text-gray-600 mx-auto mb-4" />
                <p className="text-gray-500">No activities data available yet</p>
              </div>
            )}
            
            {!loading && activities.length > 0 && (
              <div className="grid grid-cols-1 gap-4">
                {activities.map((activity: any, idx: number) => (
                  <button
                    key={activity.experience_id || idx}
                    onClick={() => navigate(`/vault/${countryKey}/city/${cityKey}`)}
                    className="bg-gray-900 rounded-2xl overflow-hidden border border-gray-800 hover:border-gray-700 transition-all"
                  >
                    <div className="relative h-48">
                      {activityImages[idx] ? (
                        <img 
                          src={activityImages[idx].src.large}
                          alt={activity.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                          <MapPin size={36} className="text-gray-600" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <h3 className="font-bold text-white mb-1">{activity.title}</h3>
                        <p className="text-gray-300 text-sm line-clamp-2">{activity.subtitle || activity.description}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Restaurants Tab */}
        {activeTab === 'restaurants' && (
          <div>
            <p className="text-gray-400 text-sm mb-4">
              Cafés and restaurants in {cityName}
            </p>
            
            {loading && (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="animate-spin text-yellow-200" size={32} />
              </div>
            )}
            
            {!loading && restaurants.length === 0 && (
              <div className="text-center py-12">
                <MapPin size={48} className="text-gray-600 mx-auto mb-4" />
                <p className="text-gray-500">No restaurants data available yet</p>
              </div>
            )}
            
            {!loading && restaurants.length > 0 && (
              <div className="grid grid-cols-1 gap-4">
                {restaurants.map((restaurant: any, idx: number) => (
                  <div
                    key={restaurant.cafe_id || idx}
                    className="bg-gray-900 rounded-2xl overflow-hidden border border-gray-800"
                  >
                    <div className="relative h-48">
                      {restaurantImages[idx] ? (
                        <img 
                          src={restaurantImages[idx].src.large}
                          alt={restaurant.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                          <MapPin size={36} className="text-gray-600" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <h3 className="font-bold text-white mb-1">{restaurant.name}</h3>
                        <p className="text-gray-300 text-sm">{restaurant.notes || restaurant.vibe}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Filter Modal */}
      <FilterModal
        isOpen={showFilter}
        onClose={() => setShowFilter(false)}
        type="travel_companion"
        currentValue={travelingWith}
        onSelect={setTravelingWith}
      />
    </div>
  )
}
