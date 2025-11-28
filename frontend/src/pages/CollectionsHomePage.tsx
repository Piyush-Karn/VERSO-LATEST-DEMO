import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Plus, MapPin, Coffee, Utensils, Mountain, Sparkles, Heart, 
  Users, Clock, Bookmark
} from 'lucide-react'
import { fetchPexelsImages } from '../services/pexels'

// Vault type system with distinct visual identities
export const VAULT_TYPES = {
  trips: {
    id: 'trips',
    label: 'Trips',
    icon: MapPin,
    accent: '#FFD15C',
    gradient: 'from-amber-400/10 via-yellow-500/5 to-transparent',
    overlayTint: 'rgba(255, 209, 92, 0.08)',
    description: 'Travel planning & adventures'
  },
  city_gems: {
    id: 'city_gems',
    label: 'City Gems',
    icon: Sparkles,
    accent: '#60A5FA',
    gradient: 'from-blue-400/10 via-cyan-500/5 to-transparent',
    overlayTint: 'rgba(96, 165, 250, 0.08)',
    description: 'Hidden neighborhood finds'
  },
  food_drink: {
    id: 'food_drink',
    label: 'Food & Drink',
    icon: Utensils,
    accent: '#F472B6',
    gradient: 'from-pink-400/10 via-rose-500/5 to-transparent',
    overlayTint: 'rgba(244, 114, 182, 0.08)',
    description: 'Culinary maps'
  },
  adventures: {
    id: 'adventures',
    label: 'Adventures',
    icon: Mountain,
    accent: '#34D399',
    gradient: 'from-emerald-400/10 via-green-500/5 to-transparent',
    overlayTint: 'rgba(52, 211, 153, 0.08)',
    description: 'Outdoor experiences'
  },
  vibe_boards: {
    id: 'vibe_boards',
    label: 'Vibe Boards',
    icon: Heart,
    accent: '#A78BFA',
    gradient: 'from-purple-400/10 via-violet-500/5 to-transparent',
    overlayTint: 'rgba(167, 139, 250, 0.08)',
    description: 'Aesthetic inspiration'
  },
  wishlists: {
    id: 'wishlists',
    label: 'Wishlists',
    icon: Bookmark,
    accent: '#FB923C',
    gradient: 'from-orange-400/10 via-amber-500/5 to-transparent',
    overlayTint: 'rgba(251, 146, 60, 0.08)',
    description: 'Future dreams'
  }
}

interface Vault {
  id: string
  name: string
  type: keyof typeof VAULT_TYPES
  inspirations: number
  contributors: number
  images: string[]
  contributorAvatars?: string[]
}

interface SharedActivity {
  id: string
  contributorName: string
  contributorAvatar: string
  caption: string
  vaultName: string
  vaultType: keyof typeof VAULT_TYPES
  previewImages: string[]
  timeAgo: string
}

const DEMO_VAULTS: Vault[] = [
  {
    id: '1',
    name: 'Japan Food Crawl',
    type: 'trips',
    inspirations: 18,
    contributors: 2,
    images: [],
    contributorAvatars: ['🧑', '👨']
  },
  {
    id: '2',
    name: 'Mumbai Hidden Cafés',
    type: 'city_gems',
    inspirations: 24,
    contributors: 1,
    images: []
  },
  {
    id: '3',
    name: 'Bali Beachside Dining',
    type: 'food_drink',
    inspirations: 12,
    contributors: 3,
    images: [],
    contributorAvatars: ['👩', '🧑', '👨']
  },
  {
    id: '4',
    name: 'Goa Surf & Dive',
    type: 'adventures',
    inspirations: 8,
    contributors: 2,
    images: []
  },
  {
    id: '5',
    name: 'Aesthetic Japan',
    type: 'vibe_boards',
    inspirations: 31,
    contributors: 1,
    images: []
  },
  {
    id: '6',
    name: 'European Summer Dreams',
    type: 'wishlists',
    inspirations: 15,
    contributors: 1,
    images: []
  }
]

const SHARED_ACTIVITIES: SharedActivity[] = [
  {
    id: 's1',
    contributorName: 'Apoorv',
    contributorAvatar: '👨‍💼',
    caption: 'Added 3 ramen gems from last weekend 🍜',
    vaultName: 'Tokyo Ramen Guide',
    vaultType: 'food_drink',
    previewImages: [],
    timeAgo: '2 hours ago'
  },
  {
    id: 's2',
    contributorName: 'Priya',
    contributorAvatar: '👩‍🎨',
    caption: 'Building my summer surf diary 🌊',
    vaultName: 'Bali Adventures',
    vaultType: 'adventures',
    previewImages: [],
    timeAgo: '1 day ago'
  },
  {
    id: 's3',
    contributorName: 'Rahul',
    contributorAvatar: '🧑‍🍳',
    caption: 'New cafés I want to try this month ☕',
    vaultName: 'Bangkok Street Food',
    vaultType: 'city_gems',
    previewImages: [],
    timeAgo: '3 days ago'
  },
  {
    id: 's4',
    contributorName: 'Sneha',
    contributorAvatar: '👩',
    caption: 'Found this hidden rooftop bar in Mumbai 🍹',
    vaultName: 'Mumbai Nights',
    vaultType: 'vibe_boards',
    previewImages: [],
    timeAgo: '5 days ago'
  }
]

export const CollectionsHomePage: React.FC = () => {
  const navigate = useNavigate()
  const [vaults, setVaults] = useState<Vault[]>(DEMO_VAULTS)
  const [sharedActivities, setSharedActivities] = useState<SharedActivity[]>(SHARED_ACTIVITIES)
  const [vaultImages, setVaultImages] = useState<Record<string, string[]>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadImages = async () => {
      const imageMap: Record<string, string[]> = {}
      
      // Load vault images
      for (const vault of vaults) {
        const keywords = `${vault.name} ${VAULT_TYPES[vault.type].label}`
        const photos = await fetchPexelsImages(keywords, 4)
        imageMap[vault.id] = photos.map(p => p.src.large)
      }
      
      // Load shared activity images
      for (const activity of sharedActivities) {
        const keywords = `${activity.vaultName} ${VAULT_TYPES[activity.vaultType].label}`
        const photos = await fetchPexelsImages(keywords, 3)
        imageMap[activity.id] = photos.map(p => p.src.medium)
      }
      
      setVaultImages(imageMap)
      setLoading(false)
    }
    
    loadImages()
  }, [])

  return (
    <div 
      className="min-h-screen"
      style={{
        background: 'linear-gradient(to bottom, #0B0B0E, #18181B)'
      }}
    >
      {/* Minimal Header */}
      <div className="px-6 pt-8 pb-6">
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">Collections</h1>
            <p className="text-white/50 text-sm">Your travel inspiration</p>
          </div>
          
          {/* Subtle Create Vault Button */}
          <button
            onClick={() => navigate('/vault/create')}
            className="group flex items-center gap-2 px-4 py-2.5 rounded-full transition-all hover:scale-105"
            style={{
              background: 'rgba(255, 209, 92, 0.1)',
              border: '1px solid rgba(255, 209, 92, 0.2)'
            }}
          >
            <Plus size={18} style={{ color: '#FFD15C' }} />
            <span className="text-sm font-medium" style={{ color: '#FFD15C' }}>New Vault</span>
          </button>
        </div>
      </div>

      {/* Section 1: Your Vaults - Horizontal Scroll */}
      <section className="mb-12">
        <div className="px-6 mb-4">
          <h2 className="text-lg font-semibold text-white">Your Vaults</h2>
        </div>

        {loading ? (
          <div className="px-6">
            <div className="animate-pulse flex gap-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="w-72 h-96 bg-white/5 rounded-3xl" />
              ))}
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto scrollbar-hide">
            <div className="flex gap-5 px-6 pb-2">
              {vaults.map((vault) => {
                const vaultType = VAULT_TYPES[vault.type]
                const Icon = vaultType.icon
                const images = vaultImages[vault.id] || []

                return (
                  <button
                    key={vault.id}
                    onClick={() => navigate(`/vault/${vault.id}`)}
                    className="group flex-shrink-0"
                  >
                    <div 
                      className="rounded-3xl overflow-hidden transition-all duration-500 hover:scale-[1.02]"
                      style={{
                        width: '288px',
                        aspectRatio: '4/5',
                        background: 'rgba(255, 255, 255, 0.03)',
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
                      }}
                    >
                      {/* Image Collage with Soft Blend */}
                      <div className="relative h-[65%] overflow-hidden">
                        {images.length >= 4 ? (
                          <div className="relative w-full h-full">
                            {/* Main large image */}
                            <div className="absolute inset-0">
                              <img 
                                src={images[0]} 
                                alt=""
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                              />
                            </div>
                            {/* Small thumbnails overlay */}
                            <div className="absolute bottom-3 right-3 flex gap-1.5">
                              {images.slice(1, 4).map((img, idx) => (
                                <div 
                                  key={idx}
                                  className="w-12 h-12 rounded-lg overflow-hidden"
                                  style={{
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.4)'
                                  }}
                                >
                                  <img src={img} alt="" className="w-full h-full object-cover" />
                                </div>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <div 
                            className={`w-full h-full bg-gradient-to-br ${vaultType.gradient} flex items-center justify-center`}
                          >
                            <Icon size={56} style={{ color: vaultType.accent, opacity: 0.3 }} />
                          </div>
                        )}
                        
                        {/* Subtle overlay tint */}
                        <div 
                          className="absolute inset-0"
                          style={{
                            background: vaultType.overlayTint
                          }}
                        />

                        {/* Type Chip - Clean & Minimal */}
                        <div 
                          className="absolute top-3 left-3 backdrop-blur-xl rounded-full px-3 py-1.5"
                          style={{
                            background: `${vaultType.accent}15`,
                            border: `1px solid ${vaultType.accent}30`
                          }}
                        >
                          <div className="flex items-center gap-1.5">
                            <Icon size={11} style={{ color: vaultType.accent }} />
                            <span className="text-xs font-medium tracking-wide" style={{ color: vaultType.accent }}>
                              {vaultType.label}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Content - Spacious & Clean */}
                      <div className="p-5 space-y-3">
                        {/* Vault Name - No truncation, 2 lines max */}
                        <h3 className="text-white font-semibold text-lg leading-snug line-clamp-2">
                          {vault.name}
                        </h3>

                        {/* Minimal Metadata */}
                        <div className="flex items-center justify-between">
                          <p className="text-white/50 text-xs">
                            {vault.inspirations} saved · {vault.contributors} {vault.contributors === 1 ? 'person' : 'people'}
                          </p>

                          {/* Contributor Avatars - Micro */}
                          {vault.contributorAvatars && vault.contributorAvatars.length > 0 && (
                            <div className="flex -space-x-1.5">
                              {vault.contributorAvatars.slice(0, 3).map((avatar, idx) => (
                                <div 
                                  key={idx}
                                  className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] border"
                                  style={{
                                    background: 'rgba(255, 255, 255, 0.08)',
                                    borderColor: '#18181B'
                                  }}
                                >
                                  {avatar}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        )}
      </section>

      {/* Section 2: Shared by Friends - Vertical Feed (Strava-inspired) */}
      <section className="px-6 pb-24">
        <h2 className="text-lg font-semibold text-white mb-6">Shared by Friends</h2>

        <div className="space-y-6">
          {sharedActivities.map((activity) => {
            const vaultType = VAULT_TYPES[activity.vaultType]
            const Icon = vaultType.icon
            const images = vaultImages[activity.id] || []

            return (
              <div 
                key={activity.id}
                className="flex gap-4 transition-opacity hover:opacity-90 cursor-pointer"
                onClick={() => navigate(`/vault/shared/${activity.id}`)}
              >
                {/* Avatar */}
                <div 
                  className="w-11 h-11 rounded-full flex items-center justify-center text-lg flex-shrink-0"
                  style={{
                    background: 'rgba(255, 255, 255, 0.06)',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                  }}
                >
                  {activity.contributorAvatar}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  {/* Name & Caption */}
                  <div className="mb-2.5">
                    <p className="text-white text-sm leading-relaxed">
                      <span className="font-semibold">{activity.contributorName}</span>
                      {' '}
                      <span className="text-white/70">{activity.caption}</span>
                    </p>
                  </div>

                  {/* Vault Tag & Time */}
                  <div className="flex items-center gap-2.5 mb-3">
                    <div 
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full"
                      style={{
                        background: `${vaultType.accent}12`,
                        border: `1px solid ${vaultType.accent}25`
                      }}
                    >
                      <Icon size={10} style={{ color: vaultType.accent }} />
                      <span className="text-xs font-medium" style={{ color: vaultType.accent }}>
                        {activity.vaultName}
                      </span>
                    </div>
                    <span className="text-xs text-white/40">{activity.timeAgo}</span>
                  </div>

                  {/* Preview Images - Subtle */}
                  {images.length > 0 && (
                    <div className="flex gap-2">
                      {images.slice(0, 3).map((img, idx) => (
                        <div 
                          key={idx}
                          className="w-20 h-20 rounded-xl overflow-hidden"
                          style={{
                            border: '1px solid rgba(255, 255, 255, 0.08)'
                          }}
                        >
                          <img src={img} alt="" className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Custom scrollbar styling */}
      <style>{`
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
