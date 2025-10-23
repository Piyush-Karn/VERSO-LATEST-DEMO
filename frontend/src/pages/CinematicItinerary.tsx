import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { MapPin, Clock, DollarSign, Cloud, Users, Share2, MessageCircle, Map as MapIcon, ChevronLeft, Sparkles } from 'lucide-react'

interface Day {
  id: number
  title: string
  subtitle: string
  heroImage: string
  weather: string
  timeRange: string
  budget: string
  distance: string
  activities: Activity[]
  savedFrom?: string
  sharedBy?: string
}

interface Activity {
  id: string
  title: string
  time: string
  period: 'Morning' | 'Afternoon' | 'Evening'
  type: 'experience' | 'meal' | 'transfer'
  image?: string
  description: string
}

const DEMO_DAYS: Day[] = [
  {
    id: 1,
    title: 'Day 1 – Tokyo',
    subtitle: 'Arrival and Shibuya exploration',
    heroImage: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1200',
    weather: 'Sunny 22°C',
    timeRange: '2PM - 11PM',
    budget: '₹8,500',
    distance: '5.2 km',
    savedFrom: 'Instagram Reels',
    sharedBy: 'Priya',
    activities: [
      { id: 'a1', title: 'Hotel Check-in', time: '2:00 PM', period: 'Afternoon', type: 'transfer', description: 'Shibuya Stream Hotel' },
      { id: 'a2', title: 'Shibuya Crossing', time: '4:30 PM', period: 'Afternoon', type: 'experience', description: 'Iconic intersection walk', image: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=400' },
      { id: 'a3', title: 'Izakaya Dinner', time: '7:00 PM', period: 'Evening', type: 'meal', description: 'Local street food', image: 'https://images.unsplash.com/photo-1555126634-323283e090fa?w=400' }
    ]
  },
  {
    id: 2,
    title: 'Day 2 – Kyoto',
    subtitle: 'Morning tea ceremony, evening izakaya trail',
    heroImage: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1200',
    weather: 'Partly Cloudy 19°C',
    timeRange: '8AM - 10PM',
    budget: '₹12,000',
    distance: '12.8 km',
    savedFrom: 'YouTube',
    activities: [
      { id: 'b1', title: 'Shinkansen to Kyoto', time: '8:00 AM', period: 'Morning', type: 'transfer', description: '2h 15m scenic ride' },
      { id: 'b2', title: 'Fushimi Inari Shrine', time: '11:00 AM', period: 'Morning', type: 'experience', description: 'Thousand torii gates', image: 'https://images.unsplash.com/photo-1478436127897-769e1b3f0f36?w=400' },
      { id: 'b3', title: 'Traditional Tea Ceremony', time: '3:00 PM', period: 'Afternoon', type: 'experience', description: 'Authentic matcha experience', image: 'https://images.unsplash.com/photo-1545048702-79362596cdc9?w=400' }
    ]
  },
  {
    id: 3,
    title: 'Day 3 – Kyoto',
    subtitle: 'Arashiyama bamboo forest and riverside',
    heroImage: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=1200',
    weather: 'Clear 24°C',
    timeRange: '9AM - 8PM',
    budget: '₹9,200',
    distance: '8.3 km',
    sharedBy: 'Rohan',
    activities: [
      { id: 'c1', title: 'Arashiyama Bamboo Grove', time: '9:00 AM', period: 'Morning', type: 'experience', description: 'Peaceful morning walk', image: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=400' },
      { id: 'c2', title: 'Riverside Lunch', time: '1:00 PM', period: 'Afternoon', type: 'meal', description: 'Seasonal kaiseki' },
      { id: 'c3', title: 'Monkey Park', time: '4:00 PM', period: 'Afternoon', type: 'experience', description: 'Mountain viewpoint' }
    ]
  }
]

export const CinematicItinerary: React.FC = () => {
  const navigate = useNavigate()
  const { tripId } = useParams()
  const [currentDay, setCurrentDay] = useState(0)
  const [showTransition, setShowTransition] = useState(true)
  const [expandedActivity, setExpandedActivity] = useState<string | null>(null)
  const [showMap, setShowMap] = useState(false)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Vault to itinerary transition
    const timer = setTimeout(() => setShowTransition(false), 2500)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      if (!scrollContainerRef.current) return
      const scrollTop = scrollContainerRef.current.scrollTop
      const dayHeight = window.innerHeight * 0.9
      const newDay = Math.round(scrollTop / dayHeight)
      if (newDay !== currentDay && newDay >= 0 && newDay < DEMO_DAYS.length) {
        setCurrentDay(newDay)
      }
    }

    const container = scrollContainerRef.current
    container?.addEventListener('scroll', handleScroll)
    return () => container?.removeEventListener('scroll', handleScroll)
  }, [currentDay])

  if (showTransition) {
    return (
      <div className="fixed inset-0 bg-[#F9F8F7] flex items-center justify-center overflow-hidden">
        <div className="relative w-full max-w-4xl p-8">
          {/* Memory cards floating and merging */}
          <div className="grid grid-cols-3 gap-4 animate-fade-in">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="aspect-square rounded-2xl bg-white shadow-lg transform transition-all duration-1000"
                style={{
                  animation: `float ${2 + i * 0.2}s ease-in-out infinite, merge 2s ease-out forwards`,
                  animationDelay: `${i * 0.1}s, 0.5s`,
                  backgroundImage: `url(${DEMO_DAYS[i % DEMO_DAYS.length].heroImage})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              />
            ))}
          </div>

          {/* Overlay text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <div className="text-center animate-fade-in" style={{ animationDelay: '1s' }}>
              <p className="text-[#1B1B1B] text-2xl font-light mb-2 italic">From memories to movement</p>
              <p className="text-[#7A7A7A] text-sm">Verso organizes your saved chaos into a journey</p>
            </div>
            
            {/* Light beam sweep effect */}
            <div 
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'linear-gradient(90deg, transparent, rgba(234, 221, 212, 0.6), transparent)',
                animation: 'sweep 2s ease-out forwards',
                animationDelay: '1.2s'
              }}
            />
          </div>
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

  return (
    <div className="fixed inset-0 bg-[#F9F8F7] overflow-hidden">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-30 bg-gradient-to-b from-[#F9F8F7] to-transparent p-6 transition-opacity duration-500"
        style={{ opacity: scrollContainerRef.current?.scrollTop > 100 ? 0 : 1 }}>
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-white/50 rounded-full transition-colors">
            <ChevronLeft size={24} className="text-[#1B1B1B]" />
          </button>
          <div className="text-center">
            <h1 className="text-xl font-semibold text-[#1B1B1B]">Tokyo & Kyoto</h1>
            <p className="text-xs text-[#7A7A7A]">April 2025</p>
          </div>
          <div className="w-10" />
        </div>
      </div>

      {/* Floating Actions */}
      <div className="absolute top-20 right-6 z-30 flex flex-col gap-3">
        <button className="p-3 bg-white/80 backdrop-blur-md hover:bg-white rounded-full shadow-lg transition-all hover:scale-110 border border-[#EADDD4]">
          <Users size={20} className="text-[#1B1B1B]" />
        </button>
        <button 
          onClick={() => setShowMap(!showMap)}
          className="p-3 bg-white/80 backdrop-blur-md hover:bg-white rounded-full shadow-lg transition-all hover:scale-110 border border-[#EADDD4]">
          <MapIcon size={20} className="text-[#1B1B1B]" />
        </button>
        <button className="p-3 bg-white/80 backdrop-blur-md hover:bg-white rounded-full shadow-lg transition-all hover:scale-110 border border-[#EADDD4]">
          <Share2 size={20} className="text-[#1B1B1B]" />
        </button>
      </div>

      {/* Context Bar */}
      <div className="absolute bottom-6 right-6 z-30">
        <div className="bg-white/90 backdrop-blur-md rounded-2xl px-4 py-3 shadow-lg border border-[#EADDD4] transition-all duration-500"
          style={{ opacity: 0.6 + (currentDay * 0.1) }}>
          <div className="flex items-center gap-4 text-xs text-[#1B1B1B]">
            <div className="flex items-center gap-1">
              <Cloud size={14} className="text-[#EADDD4]" />
              <span>{DEMO_DAYS[currentDay]?.weather}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock size={14} className="text-[#EADDD4]" />
              <span>{DEMO_DAYS[currentDay]?.timeRange}</span>
            </div>
            <div className="flex items-center gap-1">
              <DollarSign size={14} className="text-[#EADDD4]" />
              <span>{DEMO_DAYS[currentDay]?.budget}</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin size={14} className="text-[#EADDD4]" />
              <span>{DEMO_DAYS[currentDay]?.distance}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scrollable Days */}
      <div 
        ref={scrollContainerRef}
        className="h-full overflow-y-scroll snap-y snap-mandatory scrollbar-hide"
        style={{ scrollBehavior: 'smooth' }}>
        {DEMO_DAYS.map((day, index) => (
          <div
            key={day.id}
            className="min-h-screen snap-start flex items-center justify-center px-6 py-12"
            style={{ scrollSnapAlign: 'start' }}>
            <div className="max-w-4xl w-full">
              {/* Day Card */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl" style={{ boxShadow: '0 20px 60px rgba(27, 27, 27, 0.12)' }}>
                {/* Hero Image with Parallax */}
                <div 
                  className="relative h-96 overflow-hidden"
                  style={{
                    transform: `translateY(${(currentDay - index) * 20}px)`,
                    transition: 'transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)'
                  }}>
                  <img
                    src={day.heroImage}
                    alt={day.title}
                    className="w-full h-full object-cover"
                    style={{
                      transform: currentDay === index ? 'scale(1.05)' : 'scale(1)',
                      transition: 'transform 3s ease-out'
                    }}
                  />
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1B1B1B]/80 via-[#1B1B1B]/30 to-transparent" />
                  
                  {/* Day Info */}
                  <div className="absolute bottom-0 left-0 right-0 p-8">
                    <div className="flex items-center gap-2 mb-3">
                      {day.savedFrom && (
                        <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs text-white border border-white/30">
                          Saved from {day.savedFrom}
                        </span>
                      )}
                      {day.sharedBy && (
                        <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs text-white border border-white/30">
                          Shared by {day.sharedBy}
                        </span>
                      )}
                    </div>
                    <h2 className="text-4xl font-bold text-white mb-2" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                      {day.title}
                    </h2>
                    <p className="text-[#EADDD4] text-lg font-light">{day.subtitle}</p>
                    <div className="w-16 h-1 bg-[#EADDD4] mt-4 rounded-full" />
                  </div>
                </div>

                {/* Activities */}
                <div className="bg-white p-8">
                  <div className="space-y-6">
                    {day.activities.map((activity) => (
                      <div key={activity.id}>
                        <button
                          onClick={() => setExpandedActivity(expandedActivity === activity.id ? null : activity.id)}
                          className="w-full text-left group">
                          <div className="flex items-start gap-4 p-4 rounded-2xl hover:bg-[#F9F8F7] transition-all">
                            {activity.image && (
                              <img
                                src={activity.image}
                                alt={activity.title}
                                className="w-20 h-20 rounded-xl object-cover shadow-md"
                              />
                            )}
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="px-2 py-0.5 bg-[#EADDD4] rounded-full text-xs text-[#1B1B1B] font-medium">
                                  {activity.period}
                                </span>
                                <span className="text-sm text-[#7A7A7A]">{activity.time}</span>
                              </div>
                              <h3 className="text-lg font-semibold text-[#1B1B1B] mb-1">{activity.title}</h3>
                              <p className="text-sm text-[#7A7A7A]">{activity.description}</p>
                            </div>
                          </div>
                        </button>

                        {/* Expanded Detail */}
                        {expandedActivity === activity.id && (
                          <div className="mt-4 p-6 bg-[#F9F8F7] rounded-2xl animate-fade-in border border-[#EADDD4]">
                            <div className="flex gap-4">
                              {activity.image && (
                                <img src={activity.image} alt={activity.title} className="w-32 h-32 rounded-xl object-cover" />
                              )}
                              <div className="flex-1">
                                <p className="text-sm text-[#1B1B1B] leading-relaxed mb-4">{activity.description}</p>
                                <div className="flex gap-2">
                                  <button className="px-4 py-2 bg-white hover:bg-[#EADDD4] rounded-full text-xs font-medium text-[#1B1B1B] transition-colors border border-[#EADDD4]">
                                    View on map
                                  </button>
                                  <button className="px-4 py-2 bg-white hover:bg-[#EADDD4] rounded-full text-xs font-medium text-[#1B1B1B] transition-colors border border-[#EADDD4] flex items-center gap-1">
                                    <MessageCircle size={12} />
                                    Add note
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Scroll indicator */}
              {index < DEMO_DAYS.length - 1 && (
                <div className="flex justify-center mt-8 animate-bounce">
                  <div className="w-8 h-8 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center shadow-lg border border-[#EADDD4]">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-[#1B1B1B]">
                      <path d="M8 3V13M8 13L12 9M8 13L4 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Map Overlay */}
      {showMap && (
        <div className="absolute inset-0 z-40 bg-white/95 backdrop-blur-md animate-fade-in flex items-center justify-center">
          <div className="text-center">
            <MapIcon size={48} className="text-[#EADDD4] mx-auto mb-4" />
            <p className="text-[#1B1B1B] text-lg">Map view coming soon</p>
            <button onClick={() => setShowMap(false)} className="mt-4 px-6 py-2 bg-[#1B1B1B] text-white rounded-full hover:bg-[#2B2B2B]">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
