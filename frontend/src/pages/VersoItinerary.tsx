import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { MapPin, Clock, DollarSign, Cloud, Users, Share2, MessageCircle, ChevronLeft, X } from 'lucide-react'

interface Day {
  id: number
  number: number
  city: string
  title: string
  tagline: string
  heroImage: string
  weather: string
  timeRange: string
  budget: string
  distance: string
  activities: Activity[]
  lightingOverlay: string
}

interface Activity {
  id: string
  title: string
  period: 'Morning' | 'Afternoon' | 'Evening'
  pois: string[]
  savedContent: string[]
}

interface City {
  id: string
  name: string
  duration: string
  tagline: string
  heroImage: string
  days: Day[]
  transitFrom?: { method: string, duration: string, cost: string }
}

const CITIES: City[] = [
  {
    id: 'tokyo',
    name: 'Tokyo',
    duration: '3 days',
    tagline: 'Urban energy meets tradition',
    heroImage: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1200',
    transitFrom: { method: 'Flight from home', duration: '11h', cost: '₹45,000' },
    days: [
      {
        id: 1, number: 1, city: 'Tokyo', title: 'Day 1 · Shibuya & Asakusa', tagline: 'A day of contrasts — tradition meets neon chaos',
        heroImage: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=1200',
        weather: 'Sunny', timeRange: '9h', budget: '₹8,500', distance: '5.2km',
        lightingOverlay: 'rgba(255, 159, 90, 0.15)',
        activities: [
          { id: 'a1', title: 'Morning in Shibuya', period: 'Morning', pois: ['Shibuya Crossing', 'Meiji Shrine', 'Harajuku Takeshita Street'], savedContent: ['reel1', 'reel2'] },
          { id: 'a2', title: 'Afternoon in Asakusa', period: 'Afternoon', pois: ['Senso-ji Temple', 'Nakamise Street'], savedContent: ['reel3'] },
          { id: 'a3', title: 'Evening Izakaya Trail', period: 'Evening', pois: ['Shibuya Izakayas', 'Golden Gai'], savedContent: [] }
        ]
      },
      {
        id: 2, number: 2, city: 'Tokyo', title: 'Day 2 · Tsukiji & Tokyo Tower', tagline: 'Fresh sushi and city lights',
        heroImage: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=1200',
        weather: 'Partly Cloudy', timeRange: '10h', budget: '₹9,200', distance: '6.8km',
        lightingOverlay: 'rgba(255, 159, 90, 0.15)',
        activities: [
          { id: 'b1', title: 'Morning Fish Market', period: 'Morning', pois: ['Tsukiji Outer Market'], savedContent: [] },
          { id: 'b2', title: 'Afternoon in Roppongi', period: 'Afternoon', pois: ['Mori Art Museum', 'Roppongi Hills'], savedContent: [] },
          { id: 'b3', title: 'Evening Tower Views', period: 'Evening', pois: ['Tokyo Tower'], savedContent: [] }
        ]
      },
      {
        id: 3, number: 3, city: 'Tokyo', title: 'Day 3 · Akihabara & Odaiba', tagline: 'Tech wonderland to waterfront',
        heroImage: 'https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?w=1200',
        weather: 'Clear', timeRange: '8h', budget: '₹7,800', distance: '4.5km',
        lightingOverlay: 'rgba(255, 159, 90, 0.15)',
        activities: [
          { id: 'c1', title: 'Morning in Akihabara', period: 'Morning', pois: ['Electric Town', 'Anime Shops'], savedContent: [] },
          { id: 'c2', title: 'Afternoon Transfer', period: 'Afternoon', pois: ['Odaiba Seaside Park'], savedContent: [] },
          { id: 'c3', title: 'Evening Waterfront', period: 'Evening', pois: ['DiverCity Tokyo', 'teamLab Borderless'], savedContent: [] }
        ]
      }
    ]
  },
  {
    id: 'kyoto',
    name: 'Kyoto',
    duration: '3 days',
    tagline: 'Timeless elegance and zen',
    heroImage: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1200',
    transitFrom: { method: 'Shinkansen', duration: '2h 15m', cost: '₹6,500' },
    days: [
      {
        id: 4, number: 4, city: 'Kyoto', title: 'Day 4 · Arashiyama', tagline: 'Bamboo groves and mountain temples',
        heroImage: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=1200',
        weather: 'Misty', timeRange: '9h', budget: '₹8,000', distance: '8.3km',
        lightingOverlay: 'rgba(107, 142, 110, 0.08)',
        activities: [
          { id: 'd1', title: 'Morning Bamboo Forest', period: 'Morning', pois: ['Arashiyama Bamboo Grove', 'Tenryu-ji Temple'], savedContent: [] },
          { id: 'd2', title: 'Afternoon by the River', period: 'Afternoon', pois: ['Togetsukyo Bridge', 'Monkey Park'], savedContent: [] },
          { id: 'd3', title: 'Evening in Gion', period: 'Evening', pois: ['Gion District'], savedContent: [] }
        ]
      },
      {
        id: 5, number: 5, city: 'Kyoto', title: 'Day 5 · Fushimi Inari & Tea Ceremony', tagline: 'Thousand gates and ancient rituals',
        heroImage: 'https://images.unsplash.com/photo-1478436127897-769e1b3f0f36?w=1200',
        weather: 'Golden Hour', timeRange: '10h', budget: '₹10,500', distance: '7.2km',
        lightingOverlay: 'rgba(255, 159, 90, 0.12)',
        activities: [
          { id: 'e1', title: 'Morning Shrine Hike', period: 'Morning', pois: ['Fushimi Inari Taisha'], savedContent: [] },
          { id: 'e2', title: 'Afternoon Tea Ceremony', period: 'Afternoon', pois: ['Traditional Tea House'], savedContent: [] },
          { id: 'e3', title: 'Evening Temple Walk', period: 'Evening', pois: ['Kiyomizu-dera'], savedContent: [] }
        ]
      },
      {
        id: 6, number: 6, city: 'Kyoto', title: 'Day 6 · Philosopher\'s Path', tagline: 'Cherry blossoms and quiet contemplation',
        heroImage: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=1200',
        weather: 'Soft Light', timeRange: '8h', budget: '₹7,200', distance: '6.1km',
        lightingOverlay: 'rgba(212, 197, 176, 0.10)',
        activities: [
          { id: 'f1', title: 'Morning Zen Walk', period: 'Morning', pois: ['Philosopher\'s Path', 'Nanzen-ji Temple'], savedContent: [] },
          { id: 'f2', title: 'Afternoon Craft Workshops', period: 'Afternoon', pois: ['Traditional Ceramics'], savedContent: [] },
          { id: 'f3', title: 'Evening Lantern Glow', period: 'Evening', pois: ['Gion Corner'], savedContent: [] }
        ]
      }
    ]
  },
  {
    id: 'osaka',
    name: 'Osaka',
    duration: '2 days',
    tagline: 'Street food and nightlife',
    heroImage: 'https://images.unsplash.com/photo-1590559899731-a382839e5549?w=1200',
    transitFrom: { method: 'Local Train', duration: '30m', cost: '₹800' },
    days: [
      {
        id: 7, number: 7, city: 'Osaka', title: 'Day 7 · Dotonbori Nights', tagline: 'Neon streets and takoyaki trails',
        heroImage: 'https://images.unsplash.com/photo-1589452271712-64eaae3fb4e6?w=1200',
        weather: 'Vibrant', timeRange: '11h', budget: '₹11,000', distance: '5.8km',
        lightingOverlay: 'rgba(255, 61, 154, 0.15)',
        activities: [
          { id: 'g1', title: 'Osaka Castle', period: 'Morning', pois: ['Osaka Castle Park'], savedContent: [] },
          { id: 'g2', title: 'Afternoon Markets', period: 'Afternoon', pois: ['Kuromon Ichiba Market'], savedContent: [] },
          { id: 'g3', title: 'Evening Dotonbori', period: 'Evening', pois: ['Dotonbori', 'Glico Sign', 'Street Food'], savedContent: [] }
        ]
      },
      {
        id: 8, number: 8, city: 'Osaka', title: 'Day 8 · Final Farewell', tagline: 'Last bites and city lights',
        heroImage: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1200',
        weather: 'Cool Evening', timeRange: '6h', budget: '₹8,500', distance: '3.2km',
        lightingOverlay: 'rgba(0, 217, 255, 0.10)',
        activities: [
          { id: 'h1', title: 'Morning Cafe Hopping', period: 'Morning', pois: ['Namba', 'Americamura'], savedContent: [] },
          { id: 'h2', title: 'Afternoon Shopping', period: 'Afternoon', pois: ['Shinsaibashi'], savedContent: [] },
          { id: 'h3', title: 'Farewell Dinner', period: 'Evening', pois: ['Umeda Sky Building'], savedContent: [] }
        ]
      }
    ]
  }
]

export const VersoItinerary: React.FC = () => {
  const navigate = useNavigate()
  const { tripId } = useParams()
  const [scene, setScene] = useState<'vault' | 'overview' | 'timeline' | 'city'>('vault')
  const [activeCity, setActiveCity] = useState<string | null>(null)
  const [currentDayIndex, setCurrentDayIndex] = useState(0)
  const [modalOpen, setModalOpen] = useState(false)
  const [modalContent, setModalContent] = useState<Activity | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const vaultTimer = setTimeout(() => setScene('overview'), 2500)
    return () => clearTimeout(vaultTimer)
  }, [])

  useEffect(() => {
    if (scene === 'overview') {
      const overviewTimer = setTimeout(() => setScene('timeline'), 4000)
      return () => clearTimeout(overviewTimer)
    }
  }, [scene])

  const handleCityClick = (cityId: string) => {
    setActiveCity(cityId)
    setTimeout(() => setScene('city'), 100)
  }

  const handleActivityClick = (activity: Activity) => {
    setModalContent(activity)
    setModalOpen(true)
  }

  const allDays = CITIES.flatMap(city => city.days)
  const currentDay = allDays[currentDayIndex]

  // Vault Awakening Scene
  if (scene === 'vault') {
    return (
      <div className="fixed inset-0 bg-[#0B0B0E] flex items-center justify-center overflow-hidden">
        <div className="relative w-full max-w-4xl p-8">
          <div className="grid grid-cols-3 gap-4">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="aspect-square rounded-2xl bg-white/10 shadow-lg"
                style={{
                  animation: `float ${2 + i * 0.2}s ease-in-out infinite, merge 2s ease-out forwards`,
                  animationDelay: `${i * 0.1}s, 0.5s`,
                  backgroundImage: `url(${CITIES[i % 3].heroImage})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              />
            ))}
          </div>
          
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none animate-fade-in" style={{ animationDelay: '1s' }}>
            <p className="text-white/90 text-2xl font-light mb-2 italic">From memories to movement</p>
            <p className="text-white/70 text-sm">Verso organizes your saved chaos into a journey</p>
          </div>
          
          <div className="absolute inset-0 pointer-events-none" style={{
            background: 'linear-gradient(90deg, transparent, rgba(255, 209, 92, 0.6), transparent)',
            animation: 'sweep 2s ease-out forwards',
            animationDelay: '1.2s'
          }} />
        </div>

        <style>{`
          @keyframes float {
            0%, 100% { transform: translateY(0px) scale(1); }
            50% { transform: translateY(-10px) scale(1.02); }
          }
          @keyframes merge {
            0% { transform: scale(1) rotate(0deg); opacity: 1; }
            100% { transform: scale(0.8) rotate(-5deg) translateX(50%); opacity: 0.3; }
          }
          @keyframes sweep {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
        `}</style>
      </div>
    )
  }

  // Trip Overview Scene
  if (scene === 'overview') {
    return (
      <div className="fixed inset-0 bg-[#0B0B0E] flex items-center justify-center overflow-hidden">
        <div className="relative max-w-2xl w-full p-8 text-center animate-fade-in">
          <div className="mb-8">
            <div className="w-48 h-48 mx-auto mb-8 rounded-full bg-gradient-to-br from-[#18181B] to-[#0D0D11] flex items-center justify-center">
              <MapPin size={64} className="text-[#FFD15C]" />
            </div>
          </div>
          
          <h1 className="text-5xl font-bold text-white/90 mb-4" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
            Your Journey
          </h1>
          <p className="text-white/60 text-2xl mb-2">Japan · 8 Days</p>
          <p className="text-white/40 text-sm">Organized by Verso</p>
          
          <div className="absolute inset-0 pointer-events-none" style={{
            background: 'linear-gradient(90deg, transparent, rgba(255, 209, 92, 0.2), transparent)',
            animation: 'sweepSlow 3s ease-out forwards'
          }} />
        </div>

        <style>{`
          @keyframes sweepSlow {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
        `}</style>
      </div>
    )
  }

  // City Timeline Scene
  if (scene === 'timeline') {
    return (
      <div className="fixed inset-0 bg-[#0B0B0E] overflow-hidden">
        <button onClick={() => navigate(-1)} className="absolute top-6 left-6 z-50 p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full border border-white/20 transition-all">
          <ChevronLeft size={24} className="text-white" />
        </button>

        <div className="h-full overflow-y-scroll snap-y snap-mandatory scrollbar-hide" ref={scrollRef}>
          {CITIES.map((city, index) => (
            <div key={city.id} className="min-h-screen snap-start flex items-center justify-center px-6 relative">
              <button onClick={() => handleCityClick(city.id)} className="w-full max-w-2xl group">
                <div className="relative rounded-3xl overflow-hidden border-2 border-[#FFD15C]/30 hover:border-[#FFD15C] transition-all duration-500 shadow-2xl hover:shadow-[0_12px_48px_rgba(255,209,92,0.3)]">
                  <div className="relative h-96">
                    <img src={city.heroImage} alt={city.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[3000ms]" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0E]/90 via-[#0B0B0E]/40 to-transparent" />
                    
                    <div className="absolute bottom-0 left-0 right-0 p-8">
                      <h2 className="text-5xl font-bold text-white mb-2">{city.name}</h2>
                      <p className="text-white/80 text-xl font-light">{city.duration} · {city.tagline}</p>
                      <div className="w-16 h-1 bg-[#FFD15C] mt-4 rounded-full" />
                    </div>
                  </div>
                </div>
              </button>

              {/* Connector Line */}
              {index < CITIES.length - 1 && (
                <div className="absolute left-12 bottom-0 flex flex-col items-center">
                  <div className="w-0.5 h-24 bg-[#FFD15C]/40" style={{ backgroundImage: 'repeating-linear-gradient(0deg, #FFD15C 0px, #FFD15C 8px, transparent 8px, transparent 20px)' }} />
                  <div className="w-4 h-4 rounded-full bg-gradient-to-br from-[#FFD15C] to-[#FFB52C] shadow-[0_0_12px_rgba(255,209,92,0.6)] animate-pulse" />
                  {CITIES[index + 1].transitFrom && (
                    <div className="absolute left-8 top-8 text-white/70 text-xs whitespace-nowrap bg-[#18181B]/60 backdrop-blur-md px-3 py-1 rounded-full">
                      {CITIES[index + 1].transitFrom.duration} | {CITIES[index + 1].transitFrom.method}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    )
  }

  // City Deep Dive Scene
  if (scene === 'city' && activeCity) {
    const city = CITIES.find(c => c.id === activeCity)
    if (!city) return null

    return (
      <div className="fixed inset-0 bg-[#0B0B0E] overflow-hidden">
        <button onClick={() => setScene('timeline')} className="absolute top-6 left-6 z-50 p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full border border-white/20 transition-all">
          <ChevronLeft size={24} className="text-white" />
        </button>

        <div className="absolute top-6 right-6 z-40 flex flex-col gap-3">
          <button className="p-3 bg-white/10 backdrop-blur-md hover:bg-white/20 rounded-full shadow-lg transition-all border border-[#FFD15C]/20">
            <Users size={20} className="text-white" />
          </button>
          <button className="p-3 bg-white/10 backdrop-blur-md hover:bg-white/20 rounded-full shadow-lg transition-all border border-[#FFD15C]/20">
            <Share2 size={20} className="text-white" />
          </button>
        </div>

        <div className="h-full overflow-y-scroll snap-y snap-mandatory scrollbar-hide">
          {city.days.map((day, index) => (
            <div key={day.id} className="min-h-screen snap-start relative flex items-center justify-center px-6 py-12">
              <div className="max-w-4xl w-full">
                <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                  <div className="relative h-96 overflow-hidden">
                    <img src={day.heroImage} alt={day.title} className="w-full h-full object-cover" style={{ transform: `scale(${1 + (index === currentDayIndex ? 0.05 : 0)})`, transition: 'transform 20s ease-out' }} />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0E]/90 via-[#0B0B0E]/40 to-transparent" />
                    <div className="absolute inset-0" style={{ backgroundColor: day.lightingOverlay }} />
                    
                    <div className="absolute bottom-0 left-0 right-0 p-8">
                      <h2 className="text-4xl font-bold text-white mb-2">{day.title}</h2>
                      <p className="text-white/70 text-lg font-light">{day.tagline}</p>
                      <div className="w-16 h-1 bg-[#FFD15C] mt-4 rounded-full" />
                    </div>
                  </div>

                  <div className="bg-[#18181B] p-8">
                    <div className="flex gap-3 mb-6 flex-wrap">
                      {day.activities.map((activity) => (
                        <button
                          key={activity.id}
                          onClick={() => handleActivityClick(activity)}
                          className="px-5 py-3 rounded-full bg-[#FFD15C]/15 border border-[#FFD15C]/30 hover:bg-[#FFD15C]/25 transition-all hover:scale-105"
                          style={{ fontFamily: 'Inter, sans-serif' }}>
                          <span className="text-white font-medium text-sm">{activity.period}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Context Bar */}
        <div className="fixed bottom-6 right-6 z-30 bg-[#18181B]/90 backdrop-blur-md rounded-2xl px-4 py-3 shadow-lg border border-[#FFD15C]/20">
          <div className="flex items-center gap-4 text-xs text-white/80">
            <div className="flex items-center gap-1">
              <Cloud size={14} className="text-[#FFD15C]" />
              <span>{currentDay?.weather}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock size={14} className="text-[#FFD15C]" />
              <span>{currentDay?.timeRange}</span>
            </div>
            <div className="flex items-center gap-1">
              <DollarSign size={14} className="text-[#FFD15C]" />
              <span>{currentDay?.budget}</span>
            </div>
          </div>
        </div>

        {/* Activity Modal */}
        {modalOpen && modalContent && (
          <div className="fixed inset-0 z-50 flex items-end justify-center bg-[#0B0B0E]/80 backdrop-blur-sm animate-fade-in" onClick={() => setModalOpen(false)}>
            <div className="bg-[#18181B]/95 backdrop-blur-md rounded-t-3xl w-full max-w-2xl max-h-[60vh] overflow-y-auto border-t-2 border-[#FFD15C]/30 animate-slide-up" onClick={(e) => e.stopPropagation()}>
              <div className="p-6">
                <div className="w-10 h-1 bg-white/30 rounded-full mx-auto mb-6" />
                <button onClick={() => setModalOpen(false)} className="absolute top-6 right-6 p-2 hover:bg-white/10 rounded-full transition-colors">
                  <X size={20} className="text-white/60" />
                </button>
                
                <h2 className="text-2xl font-bold text-white mb-6">{modalContent.title}</h2>
                
                <div className="mb-6">
                  <p className="text-white/60 text-sm mb-3">Points of Interest:</p>
                  <ul className="space-y-2">
                    {modalContent.pois.map((poi, i) => (
                      <li key={i} className="text-white/80 text-sm flex items-start gap-2">
                        <MapPin size={16} className="text-[#FFD15C] mt-0.5" />
                        {poi}
                      </li>
                    ))}
                  </ul>
                </div>

                <button className="w-full bg-[#FFD15C]/20 hover:bg-[#FFD15C]/30 border border-[#FFD15C]/40 text-white font-semibold py-3 rounded-full transition-all">
                  View Full Route on Map
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  return null
}
