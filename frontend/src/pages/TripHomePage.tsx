import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, MapPin, Calendar, CheckCircle, Clock, AlertCircle, Plus, Sparkles } from 'lucide-react'
import { fetchPexelsImages } from '../services/pexels'

interface Vault {
  id: string
  name: string
  country: string
  image_keywords: string
  stage: 'planning' | 'booked' | 'upcoming' | 'completed'
  progress: number
  cities: number
  days: number
  start_date?: string
}

const DEMO_VAULTS: Vault[] = [
  {
    id: '1',
    name: 'Japan Food Crawl',
    country: 'Japan',
    image_keywords: 'japan tokyo shibuya night neon',
    stage: 'planning',
    progress: 65,
    cities: 3,
    days: 8,
    start_date: '2025-03-15'
  },
  {
    id: '2',
    name: 'Bali Wellness Retreat',
    country: 'Bali',
    image_keywords: 'bali ubud rice terraces sunset',
    stage: 'booked',
    progress: 90,
    cities: 2,
    days: 10,
    start_date: '2025-04-20'
  },
  {
    id: '3',
    name: 'Croatia Island Hopping',
    country: 'Croatia',
    image_keywords: 'croatia dubrovnik old town sunset',
    stage: 'upcoming',
    progress: 100,
    cities: 3,
    days: 7,
    start_date: '2025-02-10'
  }
]

export const TripHomePage: React.FC = () => {
  const navigate = useNavigate()
  const [vaultImages, setVaultImages] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadImages = async () => {
      setLoading(true)
      const images: Record<string, string> = {}
      
      for (const vault of DEMO_VAULTS) {
        const photos = await fetchPexelsImages(vault.image_keywords, 1)
        if (photos.length > 0) {
          images[vault.id] = photos[0].src.large2x
        }
      }
      
      setVaultImages(images)
      setLoading(false)
    }
    
    loadImages()
  }, [])

  const handleVaultClick = (vault: Vault) => {
    // Set localStorage before navigating so TripPlanningPage can read it
    const tripPreferences = {
      destination: vault.country,
      startDate: vault.start_date || '',
      endDate: vault.start_date || '',
      travelers: 2,
      duration: vault.days,
      homeLocation: 'Not specified'
    }
    
    console.log('💾 [TripHomePage] Setting trip preferences for vault:', tripPreferences)
    localStorage.setItem('tripPreferences', JSON.stringify(tripPreferences))
    
    navigate(`/trip/${vault.id}`)
  }

  const getStageInfo = (stage: string) => {
    switch (stage) {
      case 'planning':
        return {
          icon: <Clock size={16} />,
          color: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
          label: 'Planning'
        }
      case 'booked':
        return {
          icon: <CheckCircle size={16} />,
          color: 'bg-green-500/20 text-green-300 border-green-500/30',
          label: 'Booked'
        }
      case 'upcoming':
        return {
          icon: <Sparkles size={16} />,
          color: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
          label: 'Upcoming'
        }
      case 'completed':
        return {
          icon: <CheckCircle size={16} />,
          color: 'bg-gray-500/20 text-gray-300 border-gray-500/30',
          label: 'Completed'
        }
      default:
        return {
          icon: <Clock size={16} />,
          color: 'bg-gray-500/20 text-gray-300 border-gray-500/30',
          label: 'Draft'
        }
    }
  }

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
          
          <h1 className="text-xl font-bold text-white">Your Trips</h1>
          
          <button 
            onClick={() => navigate('/trip/create')}
            className="p-2 hover:bg-gray-800 rounded-full transition-colors"
          >
            <Plus size={20} className="text-white" />
          </button>
        </div>
      </div>

      {/* Hero Message */}
      <div className="p-6 border-b border-gray-800">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles size={20} className="text-yellow-200" />
          <p className="text-yellow-200/80 text-sm italic">
            Your adventures await
          </p>
        </div>
        <p className="text-gray-400 text-sm">
          {DEMO_VAULTS.length} trips in the works · Verso is here to help
        </p>
      </div>

      {/* Vault Cards */}
      <div className="p-4 space-y-6">
        {DEMO_VAULTS.map((vault) => {
          const stageInfo = getStageInfo(vault.stage)
          
          return (
            <button
              key={vault.id}
              onClick={() => handleVaultClick(vault)}
              className="w-full group"
            >
              <div className="bg-gray-900 rounded-3xl overflow-hidden border border-gray-800 hover:border-yellow-200/30 transition-all duration-700 hover:scale-[1.02]">
                {/* Hero Image */}
                <div className="relative h-72">
                  {vaultImages[vault.id] ? (
                    <img 
                      src={vaultImages[vault.id]} 
                      alt={vault.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[900ms]"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                      <MapPin size={48} className="text-gray-600" />
                    </div>
                  )}
                  
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                  
                  {/* Stage Badge */}
                  <div className="absolute top-4 right-4">
                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border backdrop-blur-md ${stageInfo.color}`}>
                      {stageInfo.icon}
                      <span className="text-xs font-medium">{stageInfo.label}</span>
                    </div>
                  </div>

                  {/* Title Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h2 className="text-3xl font-bold text-white mb-2 leading-tight">
                      {vault.name}
                    </h2>
                    <div className="flex items-center gap-4 text-white/80 text-sm">
                      <span className="flex items-center gap-1">
                        <MapPin size={14} />
                        {vault.cities} cities
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar size={14} />
                        {vault.days} days
                      </span>
                    </div>
                  </div>
                </div>

                {/* Progress Section */}
                <div className="p-4 border-t border-gray-800">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-400 text-xs uppercase tracking-wide">
                      Trip Progress
                    </span>
                    <span className="text-yellow-200 text-sm font-semibold">
                      {vault.progress}%
                    </span>
                  </div>
                  <div className="relative pt-1">
                    <div className="overflow-hidden h-2 text-xs flex rounded-full bg-gray-800">
                      <div 
                        style={{ width: `${vault.progress}%` }}
                        className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-yellow-200 transition-all duration-1000"
                      />
                    </div>
                  </div>
                  
                  {/* Start Date */}
                  {vault.start_date && (
                    <p className="text-gray-500 text-xs mt-3 mb-3">
                      Starts {new Date(vault.start_date).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric', 
                        year: 'numeric' 
                      })}
                    </p>
                  )}

                  {/* Action Button */}
                  <div className="mt-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        navigate(`/trip/${vault.id}`)
                      }}
                      className="w-full bg-yellow-200 hover:bg-yellow-300 text-black font-semibold py-2.5 px-4 rounded-full transition-all text-sm flex items-center justify-center gap-2"
                    >
                      <Sparkles size={16} />
                      View Trip
                    </button>
                  </div>
                </div>
              </div>
            </button>
          )
        })}

        {/* Create New Trip Card */}
        <button
          onClick={() => navigate('/trip/create')}
          className="w-full bg-gray-900 rounded-3xl border-2 border-dashed border-gray-700 hover:border-yellow-200/50 transition-all p-8 flex flex-col items-center justify-center gap-3 min-h-[200px]"
        >
          <div className="w-16 h-16 bg-yellow-200/10 rounded-full flex items-center justify-center">
            <Plus size={32} className="text-yellow-200" />
          </div>
          <div className="text-center">
            <p className="text-white font-semibold mb-1">Start a new trip</p>
            <p className="text-gray-400 text-sm">Let Verso guide you through planning</p>
          </div>
        </button>
      </div>
    </div>
  )
}
