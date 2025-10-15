import React, { useState, useEffect } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { ChevronRight, Plus, Minus, Heart, MapPin, Calendar, Clock, DollarSign, X, Coffee, UtensilsCrossed, Sparkles, Hotel, CheckCircle } from 'lucide-react'
import { fetchPexelsImages } from '../services/pexels'

interface Neighborhood {
  id: string
  name: string
  vibe: string
  tags: string[]
  image_keywords: string
}

interface Stay {
  id: string
  name: string
  type: string
  price: number
  amenities: string[]
  neighborhood: string
  image_keywords: string
}

interface Experience {
  id: string
  title: string
  type: 'activity' | 'cafe' | 'restaurant'
  neighborhood: string
  cost: number
  duration: string
  timeOfDay: string
  status: 'saved' | 'suggested' | 'booked'
  description: string
  image_keywords: string
}

const NEIGHBORHOODS: Neighborhood[] = [
  { id: 'shibuya', name: 'Shibuya', vibe: 'Urban energy · Neon nights', tags: ['Nightlife', 'Shopping'], image_keywords: 'shibuya tokyo crossing night' },
  { id: 'asakusa', name: 'Asakusa', vibe: 'Traditional · Temple district', tags: ['Culture', 'Historic'], image_keywords: 'asakusa tokyo temple traditional' },
  { id: 'harajuku', name: 'Harajuku', vibe: 'Youth culture · Fashion hub', tags: ['Shopping', 'Trendy'], image_keywords: 'harajuku tokyo fashion colorful' }
]

const STAYS: Stay[] = [
  { id: 's1', name: 'Park Hyatt Tokyo', type: 'Luxury', price: 35000, amenities: ['Sky view', 'Spa', 'Fine dining'], neighborhood: 'Shibuya', image_keywords: 'park hyatt tokyo luxury interior' },
  { id: 's2', name: 'Hoshinoya Tokyo', type: 'Premium', price: 28000, amenities: ['Onsen', 'Kaiseki', 'Traditional'], neighborhood: 'Asakusa', image_keywords: 'hoshinoya tokyo ryokan interior' },
  { id: 's3', name: 'Shibuya Stream', type: 'Budget', price: 12000, amenities: ['Modern', 'Central', 'Rooftop'], neighborhood: 'Shibuya', image_keywords: 'modern hotel tokyo interior' }
]

const EXPERIENCES: Experience[] = [
  { id: 'e1', title: 'Shibuya Crossing Food Tour', type: 'activity', neighborhood: 'Shibuya', cost: 3500, duration: '3h', timeOfDay: 'Evening', status: 'saved', description: 'Explore Shibuya\'s best street food', image_keywords: 'shibuya tokyo food tour night' },
  { id: 'e2', title: 'Senso-ji Temple Visit', type: 'activity', neighborhood: 'Asakusa', cost: 0, duration: '2h', timeOfDay: 'Morning', status: 'saved', description: 'Tokyo\'s oldest Buddhist temple', image_keywords: 'sensoji temple asakusa tokyo' },
  { id: 'e3', title: 'Fuglen Tokyo', type: 'cafe', neighborhood: 'Shibuya', cost: 800, duration: '1h', timeOfDay: 'Afternoon', status: 'suggested', description: 'Norwegian-style café with specialty coffee', image_keywords: 'fuglen tokyo cafe interior' },
  { id: 'e4', title: 'Harajuku Street Fashion', type: 'activity', neighborhood: 'Harajuku', cost: 0, duration: '2h', timeOfDay: 'Afternoon', status: 'suggested', description: 'Explore Takeshita Street', image_keywords: 'harajuku takeshita street tokyo' },
  { id: 'e5', title: 'Blue Bottle Aoyama', type: 'cafe', neighborhood: 'Shibuya', cost: 600, duration: '30m', timeOfDay: 'Morning', status: 'suggested', description: 'Minimalist café in a Japanese garden', image_keywords: 'blue bottle aoyama tokyo' },
  { id: 'e6', title: 'Ichiran Ramen', type: 'restaurant', neighborhood: 'Shibuya', cost: 1200, duration: '45m', timeOfDay: 'Dinner', status: 'suggested', description: 'Solo dining ramen experience', image_keywords: 'ichiran ramen tokyo interior' }
]

type SheetType = 'neighborhood' | 'stay' | 'experience' | 'reservation' | null

export const CityExplorationPage: React.FC = () => {
  const navigate = useNavigate()
  const { cityId } = useParams()
  const [searchParams] = useSearchParams()
  const cityName = searchParams.get('name') || 'Tokyo'
  const days = parseInt(searchParams.get('days') || '3')
  
  const [activeTab, setActiveTab] = useState<'experiences' | 'cafes' | 'restaurants'>('experiences')
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<string | null>(null)
  const [selectedStay, setSelectedStay] = useState<Stay | null>(null)
  const [activeSheet, setActiveSheet] = useState<SheetType>(null)
  const [sheetData, setSheetData] = useState<any>(null)
  const [cityDays, setCityDays] = useState(days)
  const [savedExperiences, setSavedExperiences] = useState<string[]>(['e1', 'e2'])
  const [images, setImages] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadImages()
  }, [])

  const loadImages = async () => {
    setLoading(true)
    const imageMap: Record<string, string> = {}
    
    // Load neighborhood images
    for (const n of NEIGHBORHOODS.slice(0, 2)) {
      const photos = await fetchPexelsImages(n.image_keywords, 1)
      if (photos.length > 0) imageMap[n.id] = photos[0].src.large2x
    }
    
    // Load experience images
    for (const exp of EXPERIENCES.slice(0, 3)) {
      const photos = await fetchPexelsImages(exp.image_keywords, 1)
      if (photos.length > 0) imageMap[exp.id] = photos[0].src.large2x
    }
    
    setImages(imageMap)
    setLoading(false)
  }

  const toggleExperience = (expId: string) => {
    setSavedExperiences(prev =>
      prev.includes(expId) ? prev.filter(id => id !== expId) : [...prev, expId]
    )
  }

  const handleNeighborhoodClick = (neighborhood: Neighborhood) => {
    setSheetData(neighborhood)
    setActiveSheet('neighborhood')
  }

  const handleExperienceClick = (experience: Experience) => {
    setSheetData(experience)
    setActiveSheet('experience')
  }

  const handleReservation = (item: Experience) => {
    setSheetData(item)
    setActiveSheet('reservation')
  }

  const confirmStay = (stay: Stay) => {
    setSelectedStay(stay)
    setActiveSheet(null)
  }

  const getFilteredExperiences = () => {
    let filtered = EXPERIENCES
    if (activeTab === 'cafes') filtered = EXPERIENCES.filter(e => e.type === 'cafe')
    else if (activeTab === 'restaurants') filtered = EXPERIENCES.filter(e => e.type === 'restaurant')
    else filtered = EXPERIENCES.filter(e => e.type === 'activity')
    
    if (selectedNeighborhood) filtered = filtered.filter(e => e.neighborhood === selectedNeighborhood)
    return filtered
  }

  const renderBottomSheet = () => {
    if (!activeSheet || !sheetData) return null

    return (
      <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm animate-fade-in" onClick={() => setActiveSheet(null)}>
        <div className="bg-gray-900 rounded-t-3xl w-full max-w-2xl max-h-[80vh] overflow-y-auto animate-slide-up border-t border-gray-800" onClick={(e) => e.stopPropagation()}>
          <div className="sticky top-0 bg-gray-900 pt-3 pb-2 px-6 border-b border-gray-800 z-10">
            <div className="w-12 h-1.5 bg-gray-700 rounded-full mx-auto mb-4" />
            <button onClick={() => setActiveSheet(null)} className="absolute top-6 right-6 p-2 hover:bg-gray-800 rounded-full transition-colors">
              <X size={20} className="text-gray-400" />
            </button>
          </div>

          <div className="p-6">
            {activeSheet === 'neighborhood' && (
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">{sheetData.name}</h2>
                <p className="text-gray-400 mb-6">{sheetData.vibe}</p>
                
                {images[sheetData.id] && (
                  <img src={images[sheetData.id]} alt={sheetData.name} className="w-full h-48 object-cover rounded-2xl mb-6" />
                )}
                
                <div className="space-y-4 mb-6">
                  <div>
                    <p className="text-gray-400 text-sm mb-2">Why stay here</p>
                    <p className="text-white text-sm leading-relaxed">
                      {sheetData.name} offers the perfect blend of {sheetData.tags.join(' and ').toLowerCase()} experiences, with easy access to major attractions.
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-gray-400 text-sm mb-3">Available stays</p>
                    <div className="space-y-2">
                      {STAYS.filter(s => s.neighborhood === sheetData.id).map(stay => (
                        <button key={stay.id} onClick={() => { setSheetData(stay); setActiveSheet('stay'); }}
                          className="w-full bg-gray-800/50 hover:bg-gray-800 p-4 rounded-xl text-left border border-gray-700 hover:border-yellow-200/50 transition-all">
                          <div className="flex justify-between items-start mb-2">
                            <p className="text-white font-semibold">{stay.name}</p>
                            <span className="text-yellow-200 text-sm font-semibold">₹{(stay.price / 1000).toFixed(1)}K</span>
                          </div>
                          <p className="text-gray-400 text-xs">{stay.type} · {stay.amenities.join(', ')}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <button className="w-full bg-yellow-200 hover:bg-yellow-300 text-black font-semibold py-4 rounded-full transition-all">
                  Explore {sheetData.name}
                </button>
              </div>
            )}

            {activeSheet === 'stay' && (
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">{sheetData.name}</h2>
                <p className="text-gray-400 mb-6">{sheetData.type} stay in {sheetData.neighborhood}</p>
                
                <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700 mb-4">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-gray-400 text-sm">Per night</span>
                    <span className="text-yellow-200 text-2xl font-bold">₹{(sheetData.price / 1000).toFixed(1)}K</span>
                  </div>
                  <div className="space-y-2">
                    {sheetData.amenities.map((amenity: string) => (
                      <p key={amenity} className="text-sm text-gray-400">• {amenity}</p>
                    ))}
                  </div>
                </div>

                <button onClick={() => confirmStay(sheetData)} className="w-full bg-yellow-200 hover:bg-yellow-300 text-black font-semibold py-4 rounded-full transition-all">
                  Confirm Stay
                </button>
              </div>
            )}

            {activeSheet === 'experience' && (
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">{sheetData.title}</h2>
                <p className="text-gray-400 mb-6">{sheetData.neighborhood} · {sheetData.timeOfDay}</p>
                
                {images[sheetData.id] && (
                  <img src={images[sheetData.id]} alt={sheetData.title} className="w-full h-48 object-cover rounded-2xl mb-6" />
                )}
                
                <div className="grid grid-cols-3 gap-3 mb-6">
                  <div className="bg-gray-800/50 rounded-xl p-3 border border-gray-700">
                    <Clock size={16} className="text-yellow-200 mb-2" />
                    <p className="text-white text-sm font-semibold">{sheetData.duration}</p>
                    <p className="text-gray-400 text-xs">Duration</p>
                  </div>
                  <div className="bg-gray-800/50 rounded-xl p-3 border border-gray-700">
                    <DollarSign size={16} className="text-yellow-200 mb-2" />
                    <p className="text-white text-sm font-semibold">₹{sheetData.cost}</p>
                    <p className="text-gray-400 text-xs">Cost</p>
                  </div>
                  <div className="bg-gray-800/50 rounded-xl p-3 border border-gray-700">
                    <MapPin size={16} className="text-yellow-200 mb-2" />
                    <p className="text-white text-sm font-semibold">{sheetData.timeOfDay}</p>
                    <p className="text-gray-400 text-xs">Best time</p>
                  </div>
                </div>

                <p className="text-gray-300 text-sm mb-6 leading-relaxed">{sheetData.description}</p>

                <div className="flex gap-3">
                  <button onClick={() => toggleExperience(sheetData.id)}
                    className={`flex-1 font-semibold py-4 rounded-full transition-all ${
                      savedExperiences.includes(sheetData.id)
                        ? 'bg-gray-800 text-white border-2 border-gray-700'
                        : 'bg-yellow-200 hover:bg-yellow-300 text-black'
                    }`}>
                    {savedExperiences.includes(sheetData.id) ? 'Remove from trip' : 'Add to trip'}
                  </button>
                  {(sheetData.type === 'cafe' || sheetData.type === 'restaurant') && (
                    <button onClick={() => handleReservation(sheetData)} className="px-6 py-4 bg-gray-800 hover:bg-gray-750 text-white font-semibold rounded-full border-2 border-gray-700 transition-colors">
                      Reserve
                    </button>
                  )}
                </div>
              </div>
            )}

            {activeSheet === 'reservation' && (
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">Reserve a table</h2>
                <p className="text-gray-400 mb-6">{sheetData.title}</p>
                
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="text-gray-400 text-sm mb-2 block">Date</label>
                    <input type="date" className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-yellow-200 focus:outline-none" />
                  </div>
                  <div>
                    <label className="text-gray-400 text-sm mb-2 block">Time</label>
                    <select className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-yellow-200 focus:outline-none">
                      <option>10:00 AM</option>
                      <option>12:00 PM</option>
                      <option>2:00 PM</option>
                      <option>6:00 PM</option>
                      <option>8:00 PM</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-gray-400 text-sm mb-2 block">Party size</label>
                    <select className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-yellow-200 focus:outline-none">
                      <option>1 person</option>
                      <option>2 people</option>
                      <option>3 people</option>
                      <option>4 people</option>
                    </select>
                  </div>
                </div>

                <button className="w-full bg-yellow-200 hover:bg-yellow-300 text-black font-semibold py-4 rounded-full transition-all">
                  Confirm Reservation
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white pb-24">
      {/* Header */}
      <div className="sticky top-0 bg-black/95 backdrop-blur-md border-b border-gray-800 z-20">
        <div className="flex items-center justify-between p-4">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-800 rounded-full transition-colors">
            <ChevronRight size={20} className="text-white rotate-180" />
          </button>
          <div className="text-center">
            <h1 className="text-xl font-bold text-white">{cityName}</h1>
            <p className="text-xs text-gray-400">{cityDays} days</p>
          </div>
          <div className="flex items-center gap-1">
            <button onClick={() => cityDays > 1 && setCityDays(cityDays - 1)} className="p-2 hover:bg-gray-800 rounded-full transition-colors">
              <Minus size={16} className="text-white" />
            </button>
            <button onClick={() => setCityDays(cityDays + 1)} className="p-2 hover:bg-gray-800 rounded-full transition-colors">
              <Plus size={16} className="text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* Stay Section */}
      {selectedStay && (
        <div className="p-4 border-b border-gray-800">
          <div className="bg-green-900/20 border border-green-500/30 rounded-2xl p-4 flex items-start gap-3">
            <CheckCircle size={20} className="text-green-400 mt-0.5" />
            <div className="flex-1">
              <p className="text-white font-semibold mb-1">{selectedStay.name}</p>
              <p className="text-gray-400 text-sm">{selectedStay.neighborhood} · ₹{(selectedStay.price / 1000).toFixed(1)}K/night</p>
            </div>
            <button onClick={() => setSelectedStay(null)} className="p-1 hover:bg-gray-800 rounded-full">
              <X size={16} className="text-gray-400" />
            </button>
          </div>
        </div>
      )}

      {/* Neighborhoods */}
      <div className="p-4 border-b border-gray-800">
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Hotel size={20} className="text-yellow-200" />
          Neighborhoods
        </h2>
        <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
          {NEIGHBORHOODS.map(n => (
            <button key={n.id} onClick={() => handleNeighborhoodClick(n)}
              className={`min-w-[200px] rounded-2xl overflow-hidden border-2 transition-all ${
                selectedNeighborhood === n.id ? 'border-yellow-200 scale-105' : 'border-gray-800 hover:border-gray-700'
              }`}>
              <div className="relative h-32">
                {images[n.id] ? (
                  <img src={images[n.id]} alt={n.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                    <MapPin size={32} className="text-gray-600" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <p className="text-white font-bold text-sm mb-1">{n.name}</p>
                  <p className="text-white/80 text-xs">{n.vibe}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="sticky top-[73px] bg-black/95 backdrop-blur-md border-b border-gray-800 z-10">
        <div className="flex gap-1 p-2">
          {(['experiences', 'cafes', 'restaurants'] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 rounded-xl font-medium text-sm transition-all ${
                activeTab === tab ? 'bg-yellow-200 text-black' : 'bg-gray-900 text-gray-400 hover:bg-gray-850'
              }`}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Experiences Feed */}
      <div className="p-4 space-y-4">
        {getFilteredExperiences().map(exp => (
          <button key={exp.id} onClick={() => handleExperienceClick(exp)} className="w-full group">
            <div className="bg-gray-900 rounded-2xl overflow-hidden border border-gray-800 hover:border-gray-700 transition-all">
              <div className="relative h-48">
                {images[exp.id] ? (
                  <img src={images[exp.id]} alt={exp.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                ) : (
                  <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                    {exp.type === 'cafe' ? <Coffee size={32} className="text-gray-600" /> : <UtensilsCrossed size={32} className="text-gray-600" />}
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                
                <button onClick={(e) => { e.stopPropagation(); toggleExperience(exp.id); }}
                  className="absolute top-3 right-3 p-2 bg-black/60 backdrop-blur-md rounded-full hover:bg-black/80 transition-colors z-10">
                  <Heart size={18} className={savedExperiences.includes(exp.id) ? 'text-red-400 fill-red-400' : 'text-white'} />
                </button>

                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-white font-bold text-lg mb-2">{exp.title}</h3>
                  <div className="flex items-center gap-4 text-xs text-white/80">
                    <span className="flex items-center gap-1"><Clock size={14} />{exp.duration}</span>
                    <span className="flex items-center gap-1"><MapPin size={14} />{exp.neighborhood}</span>
                    {exp.cost > 0 && <span className="flex items-center gap-1"><DollarSign size={14} />₹{exp.cost}</span>}
                  </div>
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Floating summary */}
      <div className="fixed bottom-6 left-6 right-6 bg-yellow-200 hover:bg-yellow-300 text-black font-bold p-4 rounded-full shadow-2xl transition-all z-30 flex items-center justify-between">
        <div>
          <p className="text-sm">{savedExperiences.length} experiences saved</p>
          <p className="text-xs opacity-70">in {cityDays} days</p>
        </div>
        <ChevronRight size={20} />
      </div>

      {renderBottomSheet()}
    </div>
  )
}
