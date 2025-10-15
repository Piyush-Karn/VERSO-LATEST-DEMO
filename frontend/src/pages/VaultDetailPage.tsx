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
  const [activeTab, setActiveTab] = useState<'cities' | 'neighborhoods' | 'things_to_do'>('cities')
  const [showFilterModal, setShowFilterModal] = useState(false)
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
        {['cities', 'neighborhoods', 'things_to_do'].map((tab) => (
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
                {vaultData.cities.map((city: string, idx: number) => (
                  <button
                    key={city}
                    onClick={() => navigate(`/vault/${vaultId}/city/${encodeURIComponent(city)}`)}
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
                      
                      {/* Overlay Metadata */}
                      <div className="absolute bottom-0 left-0 right-0 p-6">
                        <h3 className="text-2xl font-bold text-white mb-2">{city}</h3>
                        <p className="text-gray-300 text-sm">
                          Curated from {Math.floor(Math.random() * 20) + 10} saved inspirations · {Math.floor(Math.random() * 3) + 1} contributor{Math.floor(Math.random() * 3) + 1 > 1 ? 's' : ''}
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

        {activeTab === 'neighborhoods' && (
          <div>
            <p className="text-gray-400 text-sm mb-6">
              Discover where to stay in {vaultData.country}
            </p>
            {(() => {
              // Get neighborhoods for this country/city
              const countryKey = vaultData.country?.toLowerCase() || ''
              const citiesData = vaultData.cities || []
              
              // Aggregate neighborhoods from all cities
              const allNeighborhoods: any[] = []
              citiesData.forEach((city: string) => {
                const cityKey = city.toLowerCase()
                const hoods = (neighborhoodsData.neighborhoods as any)[cityKey] || []
                allNeighborhoods.push(...hoods)
              })

              if (allNeighborhoods.length === 0) {
                return (
                  <div className="text-center py-12">
                    <MapPin size={48} className="text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-500">No neighborhoods data available yet</p>
                  </div>
                )
              }

              return (
                <div className="space-y-6">
                  {allNeighborhoods.map((neighborhood) => (
                    <NeighborhoodCard
                      key={neighborhood.neighbourhood_id}
                      neighborhood={neighborhood}
                      onClick={() => navigate(`/neighborhood/${neighborhood.city.toLowerCase()}/${neighborhood.neighbourhood_id}`)}
                    />
                  ))}
                </div>
              )
            })()}
          </div>
        )}

        {activeTab === 'seasons' && (
          <div>
            <p className="text-gray-400 text-sm mb-6">
              Best times to visit {vaultData.country}
            </p>
            <div className="space-y-6">
              {vaultData.seasons.map((season: any, idx: number) => (
                <div 
                  key={season.month} 
                  className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-6 border border-gray-700 overflow-hidden"
                >
                  {/* Decorative background element */}
                  <div 
                    className="absolute top-0 right-0 w-40 h-40 opacity-5"
                    style={{
                      background: idx % 3 === 0 ? 'radial-gradient(circle, #FDE68A 0%, transparent 70%)' :
                                  idx % 3 === 1 ? 'radial-gradient(circle, #93C5FD 0%, transparent 70%)' :
                                  'radial-gradient(circle, #FCA5A5 0%, transparent 70%)'
                    }}
                  />
                  
                  <div className="relative z-10">
                    {/* Month Badge */}
                    <div className="inline-flex items-center gap-2 bg-black/30 px-4 py-2 rounded-full mb-4">
                      <Calendar size={16} className="text-yellow-200" />
                      <span className="text-sm font-semibold text-white">{season.month}</span>
                    </div>

                    {/* Highlight */}
                    <h3 className="text-xl font-bold text-white mb-4 leading-tight">
                      {season.highlight}
                    </h3>

                    {/* Activities */}
                    <div className="space-y-2">
                      <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-3">
                        What to do
                      </p>
                      <div className="grid grid-cols-1 gap-2">
                        {season.activities.map((activity: string) => (
                          <div 
                            key={activity}
                            className="flex items-center gap-3 bg-black/20 backdrop-blur-sm px-4 py-3 rounded-xl border border-gray-700/50"
                          >
                            <div className="w-1.5 h-1.5 rounded-full bg-yellow-200" />
                            <span className="text-sm text-gray-200">{activity}</span>
                          </div>
                        ))}
                      </div>
                    </div>
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
