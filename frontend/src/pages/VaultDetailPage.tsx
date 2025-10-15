import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Calendar, MapPin, Compass, Loader2 } from 'lucide-react'
import { fetchPexelsImages, type PexelsPhoto } from '../services/pexels'

// Mock vault data - matches with VaultViewPage
const MOCK_VAULT_DATA: Record<string, any> = {
  '1': {
    name: 'Japan Food Crawl',
    country: 'Japan',
    flag: '🇯🇵',
    cities: ['Tokyo', 'Kyoto', 'Osaka'],
    categories: ['Ramen Spots', 'Sushi Bars', 'Street Food', 'Tea Ceremonies'],
    seasons: [
      { month: 'March', highlight: 'Cherry Blossom Season', activities: ['Hanami picnics', 'Spring festivals'] },
      { month: 'June', highlight: 'Rainy Season', activities: ['Indoor dining', 'Izakaya hopping'] },
      { month: 'October', highlight: 'Autumn Colors', activities: ['Food tours', 'Harvest festivals'] }
    ]
  },
  '2': {
    name: 'Bali Week',
    country: 'Bali',
    flag: '🇮🇩',
    cities: ['Ubud', 'Seminyak', 'Canggu', 'Uluwatu'],
    categories: ['Beach Clubs', 'Yoga Studios', 'Temples', 'Cafés'],
    seasons: [
      { month: 'April', highlight: 'Dry Season Begins', activities: ['Beach days', 'Temple tours'] },
      { month: 'July', highlight: 'Peak Season', activities: ['Surfing', 'Yoga retreats'] },
      { month: 'September', highlight: 'Perfect Weather', activities: ['Island hopping', 'Sunset spots'] }
    ]
  },
  '3': {
    name: 'Coldplay Bangkok',
    country: 'Thailand',
    flag: '🇹🇭',
    cities: ['Bangkok', 'Pattaya'],
    categories: ['Concert Venues', 'Night Markets', 'Rooftop Bars', 'Street Food'],
    seasons: [
      { month: 'November', highlight: 'Cool Season', activities: ['Concert prep', 'Market exploration'] },
      { month: 'December', highlight: 'Festival Season', activities: ['Live music', 'Night markets'] },
      { month: 'January', highlight: 'Perfect Weather', activities: ['Outdoor events', 'River cruises'] }
    ]
  },
  '4': {
    name: 'Italy Vault',
    country: 'Italy',
    flag: '🇮🇹',
    cities: ['Rome', 'Florence', 'Venice', 'Milan'],
    categories: ['Historic Sites', 'Restaurants', 'Art Museums', 'Wine Tasting'],
    seasons: [
      { month: 'April', highlight: 'Spring Blooms', activities: ['City walks', 'Outdoor dining'] },
      { month: 'September', highlight: 'Harvest Season', activities: ['Wine tours', 'Food festivals'] },
      { month: 'October', highlight: 'Autumn Colors', activities: ['Art galleries', 'Countryside trips'] }
    ]
  }
}

export const VaultDetailPage: React.FC = () => {
  const { vaultId } = useParams<{ vaultId: string }>()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<'cities' | 'categories' | 'seasons'>('cities')
  const [cityImages, setCityImages] = useState<Record<string, PexelsPhoto[]>>({})
  const [categoryImages, setCategoryImages] = useState<Record<string, PexelsPhoto[]>>({})
  const [loading, setLoading] = useState(false)

  const vaultData = vaultId ? MOCK_VAULT_DATA[vaultId] : null

  // Fetch images when tab changes
  useEffect(() => {
    if (!vaultData) return

    const loadImages = async () => {
      setLoading(true)
      
      if (activeTab === 'cities' && Object.keys(cityImages).length === 0) {
        // Fetch images for all cities
        const images: Record<string, PexelsPhoto[]> = {}
        for (const city of vaultData.cities) {
          const photos = await fetchPexelsImages(`${city} ${vaultData.country} travel`, 5)
          images[city] = photos
        }
        setCityImages(images)
      }

      if (activeTab === 'categories' && Object.keys(categoryImages).length === 0) {
        // Fetch images for all categories
        const images: Record<string, PexelsPhoto[]> = {}
        for (const category of vaultData.categories) {
          const photos = await fetchPexelsImages(`${category} ${vaultData.country}`, 5)
          images[category] = photos
        }
        setCategoryImages(images)
      }

      setLoading(false)
    }

    loadImages()
  }, [activeTab, vaultData])

  if (!vaultId || !vaultData) {
    return (
      <div className="flex-1 bg-black text-white p-4 min-h-screen">
        <p className="text-red-400">Vault not found</p>
      </div>
    )
  }

  return (
    <div className="flex-1 bg-black text-white min-h-screen">
      {/* Header */}
      <div className="flex items-center gap-4 p-4 border-b border-gray-800">
        <button 
          onClick={() => navigate(-1)} 
          className="p-2 hover:bg-gray-900 rounded-lg transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <div className="flex items-center gap-2">
          <span className="text-2xl">{vaultData.flag}</span>
          <h1 className="text-xl font-semibold">{vaultData.name}</h1>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-gray-800 bg-black sticky top-0 z-10">
        {['cities', 'categories', 'seasons'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`flex-1 py-3 px-4 capitalize transition-colors ${
              activeTab === tab 
                ? 'border-b-2 border-yellow-200 text-yellow-200' 
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            {tab === 'categories' ? 'Things to do' : tab}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="p-4 pb-32">
        {activeTab === 'cities' && (
          <div>
            <p className="text-gray-400 text-sm mb-4">
              Explore your saved inspirations by city
            </p>
            {loading && (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="animate-spin text-yellow-200" size={32} />
              </div>
            )}
            {!loading && (
              <div className="space-y-6">
                {vaultData.cities.map((city: string) => (
                  <button
                    key={city}
                    onClick={() => navigate(`/vault/${vaultId}/city/${city}`)}
                    className="w-full bg-gray-900 rounded-2xl overflow-hidden border border-gray-800 hover:border-gray-700 transition-all hover:scale-[1.02]"
                  >
                    {/* Image Gallery */}
                    <div className="relative h-48 bg-gray-800">
                      {cityImages[city] && cityImages[city].length > 0 ? (
                        <div className="grid grid-cols-5 h-full gap-px">
                          {cityImages[city].slice(0, 5).map((photo, idx) => (
                            <div
                              key={photo.id}
                              className="relative overflow-hidden"
                              style={{
                                gridColumn: idx === 0 ? 'span 2' : 'span 1',
                                gridRow: idx === 0 ? 'span 2' : 'span 1',
                              }}
                            >
                              <img
                                src={photo.src.medium}
                                alt={`${city} ${idx + 1}`}
                                className="absolute inset-0 w-full h-full object-cover"
                              />
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <MapPin className="text-gray-600" size={48} />
                        </div>
                      )}
                      {/* Gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    </div>
                    
                    {/* City Info */}
                    <div className="p-4 text-left">
                      <h3 className="font-bold text-lg text-white mb-1">{city}</h3>
                      <p className="text-gray-400 text-sm">
                        {Math.floor(Math.random() * 10) + 3} spots saved
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'categories' && (
          <div>
            <p className="text-gray-400 text-sm mb-4">
              Browse by type of experience
            </p>
            <div className="grid grid-cols-2 gap-4">
              {vaultData.categories.map((category: string, idx: number) => (
                <button
                  key={category}
                  onClick={() => navigate(`/vault/${vaultId}/category/${encodeURIComponent(category)}`)}
                  className="bg-gray-900 rounded-xl p-6 hover:bg-gray-800 transition-all hover:scale-105 border border-gray-800"
                >
                  <div 
                    className={`w-14 h-14 rounded-lg mx-auto mb-3 ${
                      idx % 4 === 0 ? 'bg-gradient-to-br from-blue-500 to-purple-600' :
                      idx % 4 === 1 ? 'bg-gradient-to-br from-green-500 to-teal-600' :
                      idx % 4 === 2 ? 'bg-gradient-to-br from-orange-500 to-red-600' :
                      'bg-gradient-to-br from-pink-500 to-purple-600'
                    }`}
                  />
                  <h3 className="font-semibold text-white text-sm">{category}</h3>
                  <p className="text-gray-400 text-xs mt-1">
                    {Math.floor(Math.random() * 8) + 2} saved
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'seasons' && (
          <div>
            <p className="text-gray-400 text-sm mb-4">
              Best times to visit and seasonal highlights
            </p>
            <div className="space-y-4">
              {vaultData.seasons.map((season: any) => (
                <div key={season.month} className="bg-gray-900 rounded-xl p-5 border border-gray-800">
                  <div className="flex items-center gap-3 mb-3">
                    <Calendar size={20} className="text-yellow-200" />
                    <div>
                      <h3 className="font-semibold text-white">{season.month}</h3>
                      <p className="text-gray-400 text-sm">{season.highlight}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {season.activities.map((activity: string) => (
                      <span 
                        key={activity} 
                        className="bg-gray-800 px-3 py-1.5 rounded-full text-sm text-gray-300 border border-gray-700"
                      >
                        {activity}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Plan Your Trip CTA */}
      <div className="fixed bottom-20 left-4 right-4">
        <button 
          onClick={() => navigate(`/trip/questionnaire?vault=${encodeURIComponent(vaultData.name)}`)}
          className="w-full bg-yellow-200 hover:bg-yellow-100 text-black font-bold py-4 rounded-full transition-all shadow-xl hover:shadow-2xl hover:scale-[1.02]"
        >
          <div className="flex items-center justify-center gap-2">
            <Compass size={20} />
            <span>Plan Your Trip to {vaultData.country}</span>
          </div>
        </button>
      </div>
    </div>
  )
}
