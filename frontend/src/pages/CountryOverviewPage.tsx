import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowLeft, MapPin, Heart, Clock, DollarSign, ChevronRight, Map as MapIcon } from 'lucide-react'
import { fetchPexelsImages } from '../services/pexels'

interface Experience {
  id: string
  title: string
  location: string
  duration: string
  cost: string
  image: string
  theme: string
  tags: string[]
}

interface Theme {
  id: string
  name: string
  emoji: string
  color: string
  experiences: Experience[]
}

const COUNTRY_DATA: Record<string, any> = {
  'Croatia': {
    name: 'Croatia',
    tagline: 'Step inside Croatia.',
    subtitle: 'Perfect for June · 3 themes trending · 42 saved experiences',
    hero: 'https://images.unsplash.com/photo-1555990538-c7d2f78f5a6f?w=1200',
    themes: [
      {
        id: 'coastal',
        name: 'Coastal Escapes',
        emoji: '🏖️',
        color: 'from-blue-500 to-cyan-400',
        experiences: [
          {
            id: 'cr-1',
            title: 'Rovinj Sunset Sail',
            location: 'Rovinj',
            duration: '2 hrs',
            cost: '$$',
            image: '',
            theme: 'Coastal Escapes',
            tags: ['Sailing', 'Sunset', 'Romantic']
          },
          {
            id: 'cr-2',
            title: 'Hvar Island Hopping',
            location: 'Hvar',
            duration: '6 hrs',
            cost: '$$$',
            image: '',
            theme: 'Coastal Escapes',
            tags: ['Islands', 'Beach', 'Adventure']
          },
          {
            id: 'cr-3',
            title: 'Split Seafront Walk',
            location: 'Split',
            duration: '1.5 hrs',
            cost: 'Free',
            image: '',
            theme: 'Coastal Escapes',
            tags: ['Walking', 'Scenic', 'Photo']
          }
        ]
      },
      {
        id: 'heritage',
        name: 'Heritage Trails',
        emoji: '🏛️',
        color: 'from-amber-600 to-orange-400',
        experiences: [
          {
            id: 'cr-4',
            title: 'Dubrovnik Old Town Tour',
            location: 'Dubrovnik',
            duration: '3 hrs',
            cost: '$$',
            image: '',
            theme: 'Heritage Trails',
            tags: ['History', 'Culture', 'Walking']
          },
          {
            id: 'cr-5',
            title: 'Diocletian Palace',
            location: 'Split',
            duration: '2 hrs',
            cost: '$',
            image: '',
            theme: 'Heritage Trails',
            tags: ['Ancient', 'Architecture', 'UNESCO']
          },
          {
            id: 'cr-6',
            title: 'Pula Roman Arena',
            location: 'Pula',
            duration: '1.5 hrs',
            cost: '$',
            image: '',
            theme: 'Heritage Trails',
            tags: ['Roman', 'History', 'Architecture']
          }
        ]
      },
      {
        id: 'nature',
        name: 'Nature & Adventure',
        emoji: '🏞️',
        color: 'from-green-600 to-emerald-400',
        experiences: [
          {
            id: 'cr-7',
            title: 'Plitvice Lakes Hiking',
            location: 'Plitvice',
            duration: '5 hrs',
            cost: '$$',
            image: '',
            theme: 'Nature & Adventure',
            tags: ['Hiking', 'Waterfalls', 'Nature']
          },
          {
            id: 'cr-8',
            title: 'Krka Waterfalls Swim',
            location: 'Krka',
            duration: '4 hrs',
            cost: '$$',
            image: '',
            theme: 'Nature & Adventure',
            tags: ['Swimming', 'Nature', 'Adventure']
          },
          {
            id: 'cr-9',
            title: 'Paklenica Climbing',
            location: 'Paklenica',
            duration: '6 hrs',
            cost: '$$$',
            image: '',
            theme: 'Nature & Adventure',
            tags: ['Climbing', 'Adventure', 'Extreme']
          }
        ]
      }
    ]
  },
  'Japan': {
    name: 'Japan',
    tagline: 'Step inside Japan.',
    subtitle: 'Perfect for all seasons · 5 themes trending · 89 saved experiences',
    hero: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1200',
    themes: [
      {
        id: 'culture',
        name: 'Cultural Heritage',
        emoji: '⛩️',
        color: 'from-red-600 to-pink-400',
        experiences: [
          {
            id: 'jp-1',
            title: 'Fushimi Inari Shrine',
            location: 'Kyoto',
            duration: '3 hrs',
            cost: 'Free',
            image: '',
            theme: 'Cultural Heritage',
            tags: ['Shrine', 'Photography', 'Hiking']
          },
          {
            id: 'jp-2',
            title: 'Tea Ceremony Experience',
            location: 'Kyoto',
            duration: '1.5 hrs',
            cost: '$$$',
            image: '',
            theme: 'Cultural Heritage',
            tags: ['Traditional', 'Culture', 'Tea']
          },
          {
            id: 'jp-3',
            title: 'Senso-ji Temple',
            location: 'Tokyo',
            duration: '2 hrs',
            cost: 'Free',
            image: '',
            theme: 'Cultural Heritage',
            tags: ['Temple', 'History', 'Shopping']
          }
        ]
      }
    ]
  }
}

export const CountryOverviewPage: React.FC = () => {
  const { countryName } = useParams<{ countryName: string }>()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [activeView, setActiveView] = useState<'visual' | 'map'>('visual')
  const [activeTab, setActiveTab] = useState<'experiences' | 'community'>('experiences')
  const [savedExperiences, setSavedExperiences] = useState<Set<string>>(new Set())
  const [images, setImages] = useState<Record<string, string>>({})

  const country = countryName ? COUNTRY_DATA[decodeURIComponent(countryName)] : null

  // Fetch images for experiences
  useEffect(() => {
    if (!country) return

    const loadImages = async () => {
      const newImages: Record<string, string> = {}
      
      for (const theme of country.themes) {
        for (const exp of theme.experiences) {
          const photos = await fetchPexelsImages(`${exp.title} ${country.name}`, 1)
          if (photos.length > 0) {
            newImages[exp.id] = photos[0].src.large
          }
        }
      }
      
      setImages(newImages)
    }

    loadImages()
  }, [country])

  const handleSave = (expId: string) => {
    setSavedExperiences(prev => {
      const newSet = new Set(prev)
      if (newSet.has(expId)) {
        newSet.delete(expId)
      } else {
        newSet.add(expId)
      }
      return newSet
    })
  }

  if (!country) {
    return <div className="flex items-center justify-center h-screen bg-black text-white">Country not found</div>
  }

  return (
    <div className="relative min-h-screen bg-black text-white overflow-x-hidden">
      {/* Background Map Layer (subtle, blurred) */}
      <div className="fixed inset-0 opacity-15 blur-sm pointer-events-none">
        <div className="w-full h-full bg-gradient-to-br from-gray-900 via-gray-800 to-black" />
      </div>

      {/* Hero Header (40%) */}
      <div className="relative h-[40vh] overflow-hidden animate-zoom-in">
        {/* Hero Image with Ken Burns effect */}
        <div 
          className="absolute inset-0 bg-cover bg-center animate-ken-burns"
          style={{ backgroundImage: `url(${country.hero})` }}
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />

        {/* Back Button */}
        <button 
          onClick={() => navigate(-1)}
          className="absolute top-6 left-4 z-20 p-3 rounded-full bg-black/40 backdrop-blur-md hover:bg-black/60 transition-all"
        >
          <ArrowLeft size={24} className="text-white" />
        </button>

        {/* Map/Visual Toggle */}
        <button
          onClick={() => setActiveView(prev => prev === 'visual' ? 'map' : 'visual')}
          className="absolute top-6 right-4 z-20 px-4 py-2 rounded-full bg-black/40 backdrop-blur-md hover:bg-black/60 transition-all text-sm font-medium text-white flex items-center gap-2"
        >
          <MapIcon size={16} />
          <span>{activeView === 'visual' ? 'Map' : 'Visual'}</span>
        </button>

        {/* Tagline */}
        <div className="absolute top-24 left-6 right-6 z-10 animate-fade-in-up">
          <p className="text-yellow-200 text-sm font-medium mb-2">{country.tagline}</p>
        </div>

        {/* Country Info */}
        <div className="absolute bottom-6 left-6 right-6 z-10 animate-fade-in-up-delayed">
          <h1 className="text-5xl font-bold text-white mb-3 leading-tight">{country.name}</h1>
          <p className="text-gray-300 text-sm mb-3">{country.subtitle}</p>
          
          {/* Filter tags */}
          {searchParams.get('filters') && (
            <div className="flex gap-2 flex-wrap">
              <span className="px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-xs text-white">
                #Beaches
              </span>
              <span className="px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-xs text-white">
                #Heritage
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="sticky top-0 z-30 bg-black/80 backdrop-blur-xl border-b border-gray-800">
        <div className="flex">
          <button
            onClick={() => setActiveTab('experiences')}
            className={`flex-1 py-4 px-6 text-sm font-semibold transition-colors ${
              activeTab === 'experiences'
                ? 'text-yellow-200 border-b-2 border-yellow-200'
                : 'text-gray-400'
            }`}
          >
            Experiences
          </button>
          <button
            onClick={() => setActiveTab('community')}
            className={`flex-1 py-4 px-6 text-sm font-semibold transition-colors ${
              activeTab === 'community'
                ? 'text-yellow-200 border-b-2 border-yellow-200'
                : 'text-gray-400'
            }`}
          >
            Community Vaults
          </button>
        </div>
      </div>

      {/* Content Sections */}
      <div className="relative z-10 pb-32">
        {activeTab === 'experiences' ? (
          <div className="px-6 pt-8 space-y-12">
            {/* Section Header */}
            <div className="animate-fade-in">
              <h2 className="text-2xl font-bold text-white mb-2">Feel the country through its experiences.</h2>
              <p className="text-gray-400 text-sm">Start with the feeling, not the map.</p>
            </div>

            {/* Theme Carousels */}
            {country.themes.map((theme: Theme, themeIdx: number) => (
              <div 
                key={theme.id} 
                className="animate-fade-in"
                style={{ animationDelay: `${themeIdx * 150}ms` }}
              >
                {/* Theme Header */}
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${theme.color} flex items-center justify-center text-2xl`}>
                    {theme.emoji}
                  </div>
                  <h3 className="text-xl font-bold text-white">{theme.name}</h3>
                </div>

                {/* Horizontal Scroll */}
                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide -mx-6 px-6">
                  {theme.experiences.map((exp: Experience) => (
                    <div
                      key={exp.id}
                      className="flex-shrink-0 w-72 bg-gray-900 rounded-2xl overflow-hidden border border-gray-800 hover:border-yellow-200/30 transition-all group cursor-pointer"
                      onClick={() => navigate(`/vault/1/city/${encodeURIComponent(exp.location)}`)}
                    >
                      {/* Image */}
                      <div className="relative h-48 bg-gray-800 overflow-hidden">
                        {images[exp.id] ? (
                          <img 
                            src={images[exp.id]} 
                            alt={exp.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <MapPin className="text-gray-600" size={48} />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                        
                        {/* Save Button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleSave(exp.id)
                          }}
                          className="absolute top-3 right-3 p-2 rounded-full bg-black/60 backdrop-blur-sm hover:bg-black/80 transition-all"
                        >
                          <Heart 
                            size={18} 
                            className={savedExperiences.has(exp.id) ? 'text-red-500 fill-red-500' : 'text-white'}
                          />
                        </button>
                      </div>

                      {/* Content */}
                      <div className="p-4">
                        <h4 className="text-white font-semibold mb-2">{exp.title}</h4>
                        <div className="flex items-center gap-3 text-xs text-gray-400 mb-3">
                          <span className="flex items-center gap-1">
                            <MapPin size={12} />
                            {exp.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock size={12} />
                            {exp.duration}
                          </span>
                          <span className="flex items-center gap-1">
                            <DollarSign size={12} />
                            {exp.cost}
                          </span>
                        </div>
                        <div className="flex gap-2 flex-wrap">
                          {exp.tags.map(tag => (
                            <span key={tag} className="px-2 py-1 bg-gray-800 rounded-full text-xs text-gray-300">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="px-6 pt-8">
            <div className="text-center py-16">
              <p className="text-gray-400 text-lg mb-4">Trips our travelers loved here.</p>
              <p className="text-gray-500 text-sm">Community vaults coming soon...</p>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes zoom-in {
          from {
            transform: scale(1.1);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        @keyframes ken-burns {
          0% {
            transform: scale(1);
          }
          100% {
            transform: scale(1.1);
          }
        }
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-zoom-in {
          animation: zoom-in 0.9s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .animate-ken-burns {
          animation: ken-burns 20s ease-out infinite alternate;
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out;
        }
        .animate-fade-in-up-delayed {
          animation: fade-in-up 0.6s ease-out 0.2s both;
        }
        .animate-fade-in {
          animation: fade-in-up 0.6s ease-out both;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  )
}
