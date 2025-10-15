import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Calendar, MapPin, Compass, Loader2 } from 'lucide-react'
import { fetchPexelsImages, type PexelsPhoto } from '../services/pexels'
import { NeighborhoodCard } from '../components/NeighborhoodCard'
import neighborhoodsData from '../data/neighborhoods_data.json'

// Mock vault data - matches with VaultViewPage and Explore page
const MOCK_VAULT_DATA: Record<string, any> = {
  '1': {
    name: 'Japan Food Crawl',
    country: 'Japan',
    flag: '🇯🇵',
    cities: ['Tokyo', 'Kyoto', 'Osaka'],
    categories: ['Ramen Spots', 'Sushi Bars', 'Tea Ceremonies', 'Temples'],
    seasons: [
      { month: 'March', highlight: 'Cherry Blossom Season', activities: ['Hanami picnics', 'Spring festivals', 'Temple visits'] },
      { month: 'June', highlight: 'Rainy Season', activities: ['Indoor dining', 'Izakaya hopping', 'Museums'] },
      { month: 'October', highlight: 'Autumn Colors', activities: ['Food tours', 'Harvest festivals', 'Mountain hikes'] }
    ]
  },
  '2': {
    name: 'Bali Week',
    country: 'Bali',
    flag: '🇮🇩',
    cities: ['Ubud', 'Seminyak', 'Canggu'],
    categories: ['Beach Clubs', 'Yoga Studios', 'Temples', 'Surf Spots'],
    seasons: [
      { month: 'April', highlight: 'Dry Season Begins', activities: ['Beach days', 'Temple tours', 'Surfing'] },
      { month: 'July', highlight: 'Peak Season', activities: ['Surfing', 'Yoga retreats', 'Beach clubs'] },
      { month: 'September', highlight: 'Perfect Weather', activities: ['Island hopping', 'Sunset spots', 'Rice terrace walks'] }
    ]
  },
  '3': {
    name: 'Coldplay Bangkok',
    country: 'Thailand',
    flag: '🇹🇭',
    cities: ['Bangkok', 'Phuket', 'Chiang Mai'],
    categories: ['Street Food', 'Night Markets', 'Temples', 'Beach Clubs'],
    seasons: [
      { month: 'November', highlight: 'Cool Season', activities: ['Market exploration', 'Temple visits', 'Street food tours'] },
      { month: 'December', highlight: 'Festival Season', activities: ['Live music', 'Night markets', 'Beach parties'] },
      { month: 'January', highlight: 'Perfect Weather', activities: ['Outdoor events', 'River cruises', 'Island hopping'] }
    ]
  },
  '4': {
    name: 'Italy Vault',
    country: 'Italy',
    flag: '🇮🇹',
    cities: ['Rome', 'Florence', 'Venice'],
    categories: ['Historic Sites', 'Restaurants', 'Art Museums', 'Wine Tasting'],
    seasons: [
      { month: 'April', highlight: 'Spring Blooms', activities: ['City walks', 'Outdoor dining', 'Art galleries'] },
      { month: 'September', highlight: 'Harvest Season', activities: ['Wine tours', 'Food festivals', 'Countryside trips'] },
      { month: 'October', highlight: 'Autumn Colors', activities: ['Art galleries', 'Countryside trips', 'Food tours'] }
    ]
  },
  '5': {
    name: 'Croatia',
    country: 'Croatia',
    flag: '🇭🇷',
    cities: ['Dubrovnik', 'Split', 'Rovinj'],
    categories: ['Coastal Escapes', 'Heritage Trails', 'Island Hopping', 'Local Cuisine'],
    seasons: [
      { month: 'June', highlight: 'Perfect Beach Season', activities: ['Island hopping', 'Coastal sailing', 'Beach clubs'] },
      { month: 'September', highlight: 'Harvest & Wine Season', activities: ['Wine tasting', 'Food festivals', 'Fewer crowds'] },
      { month: 'October', highlight: 'Autumn Colors', activities: ['Heritage tours', 'Hiking trails', 'City exploration'] }
    ]
  },
  '6': {
    name: 'New Zealand',
    country: 'New Zealand',
    flag: '🇳🇿',
    cities: ['Queenstown', 'Auckland', 'Rotorua'],
    categories: ['Adventure Sports', 'Fjords', 'Wine Tasting', 'Maori Culture'],
    seasons: [
      { month: 'December', highlight: 'Summer Season', activities: ['Hiking', 'Water sports', 'Beach activities'] },
      { month: 'March', highlight: 'Autumn Colors', activities: ['Wine tours', 'Scenic drives', 'Hiking'] },
      { month: 'September', highlight: 'Spring Blooms', activities: ['Wildlife tours', 'Adventure sports', 'City exploration'] }
    ]
  },
  '7': {
    name: 'South Africa',
    country: 'South Africa',
    flag: '🇿🇦',
    cities: ['Cape Town', 'Stellenbosch', 'Kruger'],
    categories: ['Safari', 'Wine Estates', 'Coastal Drives', 'Adventure'],
    seasons: [
      { month: 'September', highlight: 'Spring Wildlife Season', activities: ['Safari drives', 'Whale watching', 'Hiking'] },
      { month: 'November', highlight: 'Perfect Weather', activities: ['Beach days', 'Wine tours', 'City exploration'] },
      { month: 'March', highlight: 'Harvest Season', activities: ['Wine tasting', 'Vineyard tours', 'Food festivals'] }
    ]
  }
}

export const VaultDetailPage: React.FC = () => {
  const { vaultId } = useParams<{ vaultId: string }>()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<'cities' | 'things_to_do'>('cities')
  const [showFilterModal, setShowFilterModal] = useState(false)
  const [selectedMonth, setSelectedMonth] = useState<string>('')
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

      if (activeTab === 'things_to_do' && Object.keys(categoryImages).length === 0) {
        // Fetch images for all activities/categories
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
        {['cities', 'things_to_do'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`flex-1 py-3 px-4 capitalize transition-colors ${
              activeTab === tab 
                ? 'border-b-2 border-yellow-200 text-yellow-200' 
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            {tab === 'things_to_do' ? 'Things To Do' : tab}
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
                {vaultData.cities.map((city: string, idx: number) => (
                  <button
                    key={city}
                    onClick={() => navigate(`/city/${vaultData.country.toLowerCase()}/${city.toLowerCase()}`)}
                    className="w-full bg-gray-900 rounded-3xl overflow-hidden border border-gray-800 hover:border-yellow-200/30 transition-all duration-700 hover:scale-[1.02] group"
                  >
                    {/* Full-bleed Hero Visual */}
                    <div className="relative h-64 bg-gray-800 overflow-hidden">
                      {cityImages[city] && cityImages[city].length > 0 ? (
                        <div className="relative h-full">
                          {/* Main hero image */}
                          <img
                            src={cityImages[city][0].src.large}
                            alt={city}
                            className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-[900ms]"
                          />
                          {/* Collage effect - small images overlaid */}
                          {cityImages[city].slice(1, 3).map((photo, collageIdx) => (
                            <div
                              key={photo.id}
                              className="absolute w-20 h-20 rounded-lg overflow-hidden border-2 border-white/20 shadow-xl"
                              style={{
                                bottom: '12px',
                                right: collageIdx === 0 ? '12px' : '96px',
                                opacity: 0.9
                              }}
                            >
                              <img
                                src={photo.src.small}
                                alt={`${city} ${collageIdx + 2}`}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <MapPin className="text-gray-600" size={64} />
                        </div>
                      )}
                      {/* Gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                      
                      {/* Seasonality Chip (top-right) */}
                      {vaultData.seasons && vaultData.seasons.length > 0 && (
                        <div className="absolute top-4 right-4">
                          <div className="bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20">
                            <span className="text-white text-xs font-medium">
                              ☀️ Best in {vaultData.seasons[0].month}
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Overlay Metadata */}
                      <div className="absolute bottom-0 left-0 right-0 p-6">
                        <h3 className="text-2xl font-bold text-white mb-2">{city}</h3>
                        <p className="text-gray-300 text-sm">
                          Curated from {Math.floor(Math.random() * 20) + 5} saved inspirations
                        </p>
                      </div>
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
            {loading && (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="animate-spin text-yellow-200" size={32} />
              </div>
            )}
            {!loading && (
              <div className="space-y-4">
                {vaultData.categories.map((category: string) => (
                  <button
                    key={category}
                    onClick={() => navigate(`/vault/${vaultId}/category/${encodeURIComponent(category)}`)}
                    className="w-full bg-gray-900 rounded-2xl overflow-hidden border border-gray-800 hover:border-gray-700 transition-all hover:scale-[1.02]"
                  >
                    {/* Horizontal Image Scroll */}
                    <div className="flex overflow-x-auto gap-1 h-32 bg-gray-800 scrollbar-hide">
                      {categoryImages[category] && categoryImages[category].length > 0 ? (
                        categoryImages[category].slice(0, 5).map((photo) => (
                          <div
                            key={photo.id}
                            className="flex-shrink-0 w-32 h-full relative"
                          >
                            <img
                              src={photo.src.small}
                              alt={category}
                              className="absolute inset-0 w-full h-full object-cover"
                            />
                          </div>
                        ))
                      ) : (
                        <div className="flex items-center justify-center w-full h-full">
                          <Compass className="text-gray-600" size={36} />
                        </div>
                      )}
                    </div>
                    
                    {/* Category Info */}
                    <div className="p-4 text-left">
                      <h3 className="font-bold text-white mb-1">{category}</h3>
                      <p className="text-gray-400 text-sm">
                        {Math.floor(Math.random() * 8) + 2} places saved
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'things_to_do' && (
          <div>
            <p className="text-gray-400 text-sm mb-4">
              Experiences and activities across {vaultData.country}
            </p>
            {loading && (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="animate-spin text-yellow-200" size={32} />
              </div>
            )}
            {!loading && (
              <div className="space-y-4">
                {vaultData.categories.map((category: string) => (
                  <button
                    key={category}
                    onClick={() => navigate(`/vault/${vaultId}/category/${encodeURIComponent(category)}`)}
                    className="w-full bg-gray-900 rounded-2xl overflow-hidden border border-gray-800 hover:border-gray-700 transition-all hover:scale-[1.02]"
                  >
                    {/* Horizontal Image Scroll */}
                    <div className="relative flex overflow-x-auto gap-1 h-48 bg-gray-800 scrollbar-hide">
                      {categoryImages[category] && categoryImages[category].length > 0 ? (
                        categoryImages[category].slice(0, 5).map((photo) => (
                          <div
                            key={photo.id}
                            className="flex-shrink-0 w-48 h-full relative"
                          >
                            <img
                              src={photo.src.large}
                              alt={category}
                              className="absolute inset-0 w-full h-full object-cover"
                            />
                          </div>
                        ))
                      ) : (
                        <div className="flex items-center justify-center w-full h-full">
                          <Compass className="text-gray-600" size={36} />
                        </div>
                      )}
                      
                      {/* Seasonality Chip Overlay */}
                      {vaultData.seasons && vaultData.seasons.length > 0 && (
                        <div className="absolute top-4 right-4 z-10">
                          <div className="bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20">
                            <span className="text-white text-xs font-medium">
                              ☀️ Best in {vaultData.seasons[0].month}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Category Info */}
                    <div className="p-4 text-left">
                      <h3 className="font-bold text-white mb-1">{category}</h3>
                      <p className="text-gray-400 text-sm">
                        {Math.floor(Math.random() * 8) + 2} experiences saved
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}
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
