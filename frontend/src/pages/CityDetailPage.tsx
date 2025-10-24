import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Filter, Loader2, MapPin } from 'lucide-react'
import { fetchPexelsImages, type PexelsPhoto } from '../services/pexels'
import { FilterModal } from '../components/FilterModal'
import neighborhoodsData from '../data/neighborhoods_data.json'
import demoDataset from '../data/verso_demo_dataset.json'

export const CityDetailPage: React.FC = () => {
  const { country, cityName } = useParams<{ country: string; cityName: string }>()
  const navigate = useNavigate()
  
  const [activeTab, setActiveTab] = useState<'neighborhoods' | 'activities' | 'restaurants'>('neighborhoods')
  const [loading, setLoading] = useState(true)
  const [showFilter, setShowFilter] = useState(false)
  const [travelingWith, setTravelingWith] = useState<string>('')
  const [activityImages, setActivityImages] = useState<PexelsPhoto[]>([])
  const [restaurantImages, setRestaurantImages] = useState<PexelsPhoto[]>([])

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
    
    // Auto-navigate to neighbourhoods home page when neighborhoods tab is active
    if (activeTab === 'neighborhoods' && neighborhoods.length > 0) {
      navigate(`/neighbourhoods/${cityKey}`)
    } else {
      loadImages()
    }
  }, [activeTab, cityName, neighborhoods.length, activities.length, restaurants.length, cityKey, navigate])

  // Filter neighborhoods by traveling companion
  const filteredNeighborhoods = React.useMemo(() => {
    if (!travelingWith) return neighborhoods
    
    return neighborhoods.filter((n: any) => {
      const vibes = n.vibe || []
      const bestFor = n.best_for || []
      
      if (travelingWith === 'solo') {
        return vibes.some((v: string) => ['social', 'nomad', 'vibrant'].includes(v.toLowerCase()))
      } else if (travelingWith === 'couple') {
        return vibes.some((v: string) => ['romantic', 'peaceful', 'calm', 'premium'].includes(v.toLowerCase()))
      } else if (travelingWith === 'family') {
        return bestFor.some((b: string) => b.toLowerCase().includes('family')) || 
               vibes.some((v: string) => v.toLowerCase().includes('family'))
      } else if (travelingWith === 'friends') {
        return vibes.some((v: string) => ['energetic', 'nightlife', 'social', 'beach'].includes(v.toLowerCase()))
      }
      
      return true
    })
  }, [neighborhoods, travelingWith])

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
            {travelingWith && (
              <div className="mb-4 bg-yellow-200/10 border border-yellow-200/30 rounded-xl p-3">
                <p className="text-yellow-200 text-sm">
                  Showing neighborhoods perfect for <span className="font-semibold capitalize">{travelingWith}</span> travelers
                </p>
              </div>
            )}
            
            {loading && (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="animate-spin text-yellow-200" size={32} />
              </div>
            )}
            
            {!loading && filteredNeighborhoods.length === 0 && (
              <div className="text-center py-12">
                <MapPin size={48} className="text-gray-600 mx-auto mb-4" />
                <p className="text-gray-500">No neighborhoods found for this filter</p>
              </div>
            )}
            
            {!loading && filteredNeighborhoods.length > 0 && (
              <div className="space-y-6">
                {filteredNeighborhoods.map((neighborhood: any) => (
                  <NeighborhoodCard
                    key={neighborhood.neighbourhood_id}
                    neighborhood={neighborhood}
                    onClick={() => navigate(`/neighbourhoods/${cityKey}`)}
                  />
                ))}
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
