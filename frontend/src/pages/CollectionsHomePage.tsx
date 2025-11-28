import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Plus, MapPin, Coffee, Utensils, Mountain, Sparkles, Heart, 
  Bookmark, CheckCircle, Award, TrendingUp, MessageCircle, Edit2, X
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

type UpdateType = 'shared_vault' | 'completed_experience' | 'creator_vault' | 'on_trip' | 'milestone'

interface SharedActivity {
  id: string
  type: UpdateType
  contributorName: string
  contributorAvatar: string
  isCreator?: boolean
  caption: string
  vaultName: string
  vaultType: keyof typeof VAULT_TYPES
  heroImage?: string
  previewImages: string[]
  timeAgo: string
  isLive?: boolean
  badgeText?: string
  metadata?: string
  commentCount?: number
  dayNumber?: number
  totalDays?: number
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
    type: 'shared_vault',
    contributorName: 'Apoorv',
    contributorAvatar: '👨‍💼',
    caption: 'Just mapped out all the ramen spots from my Tokyo trip 🍜✨',
    vaultName: 'Tokyo Ramen Guide',
    vaultType: 'food_drink',
    previewImages: [],
    timeAgo: '2 hours ago'
  },
  {
    id: 's2',
    type: 'completed_experience',
    contributorName: 'Priya',
    contributorAvatar: '👩‍🎨',
    caption: 'Checked off Uluwatu Temple from my Bali bucket list 🌅🙏',
    vaultName: 'Bali Adventures',
    vaultType: 'adventures',
    heroImage: '',
    previewImages: [],
    timeAgo: '5 hours ago',
    commentCount: 12
  },
  {
    id: 's3',
    type: 'creator_vault',
    contributorName: 'Rahul',
    contributorAvatar: '🧑‍🍳',
    isCreator: true,
    caption: 'shared their Bangkok Street Eats Masterlist 🥢🔥',
    vaultName: 'Bangkok Street Food',
    vaultType: 'food_drink',
    previewImages: [],
    timeAgo: '1 day ago',
    metadata: 'Popular vault this week'
  },
  {
    id: 's4',
    type: 'on_trip',
    contributorName: 'Sneha',
    contributorAvatar: '👩',
    caption: 'is on their Japan trip 🇯🇵',
    vaultName: 'Tokyo Exploration',
    vaultType: 'trips',
    heroImage: '',
    previewImages: [],
    timeAgo: 'Live · 2 hours ago',
    isLive: true,
    dayNumber: 3,
    totalDays: 7,
    metadata: 'Day 3 → Tsukiji morning market'
  },
  {
    id: 's5',
    type: 'milestone',
    contributorName: 'Vikram',
    contributorAvatar: '🧑‍✈️',
    caption: 'Hit 100 cafés explored across Asia ☕✨',
    vaultName: 'Coffee Explorer',
    vaultType: 'city_gems',
    heroImage: '',
    previewImages: [],
    timeAgo: '3 days ago',
    badgeText: '100 Cafés'
  }
]

export const CollectionsHomePage: React.FC = () => {
  const navigate = useNavigate()
  const [vaults, setVaults] = useState<Vault[]>(DEMO_VAULTS)
  const [sharedActivities, setSharedActivities] = useState<SharedActivity[]>(SHARED_ACTIVITIES)
  const [vaultImages, setVaultImages] = useState<Record<string, string[]>>({})
  const [loading, setLoading] = useState(true)
  const [editingVaultId, setEditingVaultId] = useState<string | null>(null)

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
        const photos = await fetchPexelsImages(keywords, activity.type === 'creator_vault' ? 3 : 4)
        imageMap[activity.id] = photos.map(p => p.src.large)
        
        // Set hero image for certain types
        if (photos.length > 0 && (activity.type === 'completed_experience' || activity.type === 'on_trip' || activity.type === 'milestone')) {
          activity.heroImage = photos[0].src.large2x
        }
      }
      
      setVaultImages(imageMap)
      setLoading(false)
    }
    
    loadImages()
  }, [])

  const handleVaultTypeChange = (vaultId: string, newType: keyof typeof VAULT_TYPES) => {
    setVaults(vaults.map(v => 
      v.id === vaultId ? { ...v, type: newType } : v
    ))
    setEditingVaultId(null)
  }

  const renderSharedActivity = (activity: SharedActivity) => {
    const vaultType = VAULT_TYPES[activity.vaultType]
    const Icon = vaultType.icon
    const images = vaultImages[activity.id] || []

    switch (activity.type) {
      // A) Standard Shared Vault
      case 'shared_vault':
        return (
          <div 
            className="group cursor-pointer"
            onClick={() => navigate(`/vault/shared/${activity.id}`)}
            style={{
              boxShadow: '0 2px 16px rgba(0, 0, 0, 0.15)'
            }}
          >
            {/* Hero Image Banner */}
            {images.length > 0 && (
              <div className="relative h-64 rounded-t-2xl overflow-hidden">
                <img 
                  src={images[0]} 
                  alt=""
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div 
                  className="absolute inset-0"
                  style={{
                    background: 'linear-gradient(to top, rgba(11, 11, 14, 0.7) 0%, transparent 50%)'
                  }}
                />
              </div>
            )}

            {/* Content */}
            <div className="p-5 rounded-b-2xl" style={{ background: 'rgba(255, 255, 255, 0.03)' }}>
              <div className="flex items-start gap-3 mb-3">
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0"
                  style={{
                    background: 'rgba(255, 255, 255, 0.06)',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                  }}
                >
                  {activity.contributorAvatar}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-base leading-relaxed">
                    <span className="font-semibold">{activity.contributorName}</span>
                    {' '}
                    <span className="text-white/80">{activity.caption}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div 
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full"
                  style={{
                    background: `${vaultType.accent}12`,
                    border: `1px solid ${vaultType.accent}25`
                  }}
                >
                  <Icon size={11} style={{ color: vaultType.accent }} />
                  <span className="text-xs font-medium" style={{ color: vaultType.accent }}>
                    {activity.vaultName}
                  </span>
                </div>
                <span className="text-xs text-white/40">{activity.timeAgo}</span>
              </div>

              {/* Mini image strip */}
              {images.length > 1 && (
                <div className="flex gap-1.5 mt-4">
                  {images.slice(1, 4).map((img, idx) => (
                    <div key={idx} className="flex-1 h-16 rounded-lg overflow-hidden">
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )

      // B) Completed Experience (Achievement)
      case 'completed_experience':
        return (
          <div 
            className="relative rounded-2xl overflow-hidden group cursor-pointer"
            onClick={() => navigate(`/vault/shared/${activity.id}`)}
            style={{
              boxShadow: '0 4px 24px rgba(0, 0, 0, 0.2)'
            }}
          >
            {/* Large Hero Image */}
            {activity.heroImage && (
              <div className="relative h-80">
                <img 
                  src={activity.heroImage} 
                  alt=""
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div 
                  className="absolute inset-0"
                  style={{
                    background: 'linear-gradient(to top, rgba(11, 11, 14, 0.9) 0%, transparent 60%)'
                  }}
                />
                
                {/* Achievement Badge */}
                <div 
                  className="absolute top-4 right-4 backdrop-blur-xl rounded-2xl p-3"
                  style={{
                    background: 'rgba(52, 211, 153, 0.15)',
                    border: '2px solid rgba(52, 211, 153, 0.4)',
                    boxShadow: '0 8px 32px rgba(52, 211, 153, 0.3)'
                  }}
                >
                  <CheckCircle size={24} style={{ color: '#34D399' }} />
                </div>

                {/* Content Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <div className="flex items-start gap-3 mb-3">
                    <div 
                      className="w-11 h-11 rounded-full flex items-center justify-center text-lg flex-shrink-0"
                      style={{
                        background: 'rgba(0, 0, 0, 0.5)',
                        border: '2px solid rgba(255, 255, 255, 0.2)',
                        backdropFilter: 'blur(12px)'
                      }}
                    >
                      {activity.contributorAvatar}
                    </div>
                    <div className="flex-1">
                      <p className="text-white text-base font-medium leading-relaxed mb-2">
                        <span className="font-bold">{activity.contributorName}</span>
                        {' '}
                        <span>{activity.caption}</span>
                      </p>
                      <div className="flex items-center gap-3">
                        <div 
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full backdrop-blur-xl"
                          style={{
                            background: `${vaultType.accent}20`,
                            border: `1px solid ${vaultType.accent}40`
                          }}
                        >
                          <Icon size={10} style={{ color: vaultType.accent }} />
                          <span className="text-xs font-medium" style={{ color: vaultType.accent }}>
                            {activity.vaultName}
                          </span>
                        </div>
                        <span className="text-xs text-white/60">{activity.timeAgo}</span>
                        {activity.commentCount && (
                          <div className="flex items-center gap-1 text-white/60">
                            <MessageCircle size={12} />
                            <span className="text-xs">{activity.commentCount}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )

      // C) Creator Vault
      case 'creator_vault':
        return (
          <div 
            className="rounded-2xl overflow-hidden group cursor-pointer"
            onClick={() => navigate(`/vault/shared/${activity.id}`)}
            style={{
              background: 'linear-gradient(135deg, rgba(255, 209, 92, 0.08), rgba(251, 146, 60, 0.05))',
              border: '1px solid rgba(255, 209, 92, 0.2)',
              boxShadow: '0 4px 24px rgba(255, 209, 92, 0.15)'
            }}
          >
            <div className="p-5">
              {/* Creator Header */}
              <div className="flex items-start gap-3 mb-4">
                <div className="relative">
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center text-xl"
                    style={{
                      background: 'rgba(255, 209, 92, 0.15)',
                      border: '2px solid rgba(255, 209, 92, 0.4)'
                    }}
                  >
                    {activity.contributorAvatar}
                  </div>
                  <div 
                    className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center"
                    style={{
                      background: '#FFD15C',
                      border: '2px solid #0B0B0E'
                    }}
                  >
                    <Award size={10} style={{ color: '#0B0B0E' }} />
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-white text-base leading-relaxed mb-1">
                    <span className="font-bold">{activity.contributorName}</span>
                    {' '}
                    <span className="text-white/80">{activity.caption}</span>
                  </p>
                  {activity.metadata && (
                    <div className="flex items-center gap-1.5 text-yellow-200 text-xs">
                      <TrendingUp size={11} />
                      <span>{activity.metadata}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* 3-Wide Collage */}
              {images.length >= 3 && (
                <div className="grid grid-cols-3 gap-2 mb-3">
                  {images.slice(0, 3).map((img, idx) => (
                    <div key={idx} className="aspect-square rounded-xl overflow-hidden">
                      <img src={img} alt="" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    </div>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between">
                <div 
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full"
                  style={{
                    background: `${vaultType.accent}12`,
                    border: `1px solid ${vaultType.accent}25`
                  }}
                >
                  <Icon size={11} style={{ color: vaultType.accent }} />
                  <span className="text-xs font-medium" style={{ color: vaultType.accent }}>
                    Creator Vault
                  </span>
                </div>
                <span className="text-xs text-white/40">{activity.timeAgo}</span>
              </div>
            </div>
          </div>
        )

      // D) On Trip (Live)
      case 'on_trip':
        return (
          <div 
            className="rounded-2xl overflow-hidden group cursor-pointer"
            onClick={() => navigate(`/vault/shared/${activity.id}`)}
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(96, 165, 250, 0.3)',
              boxShadow: '0 4px 24px rgba(96, 165, 250, 0.2)'
            }}
          >
            {/* Hero Image/Map */}
            {activity.heroImage && (
              <div className="relative h-56">
                <img 
                  src={activity.heroImage} 
                  alt=""
                  className="w-full h-full object-cover"
                />
                <div 
                  className="absolute inset-0"
                  style={{
                    background: 'linear-gradient(to top, rgba(11, 11, 14, 0.8) 0%, transparent 50%)'
                  }}
                />
                
                {/* Live Badge */}
                <div 
                  className="absolute top-4 left-4 backdrop-blur-xl rounded-full px-3 py-1.5 flex items-center gap-2"
                  style={{
                    background: 'rgba(239, 68, 68, 0.2)',
                    border: '1px solid rgba(239, 68, 68, 0.5)'
                  }}
                >
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  <span className="text-xs font-semibold text-red-400">Live</span>
                </div>
              </div>
            )}

            <div className="p-5">
              <div className="flex items-start gap-3 mb-3">
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0"
                  style={{
                    background: 'rgba(96, 165, 250, 0.15)',
                    border: '1px solid rgba(96, 165, 250, 0.3)'
                  }}
                >
                  {activity.contributorAvatar}
                </div>
                <div className="flex-1">
                  <p className="text-white text-base leading-relaxed mb-2">
                    <span className="font-semibold">{activity.contributorName}</span>
                    {' '}
                    <span className="text-white/80">{activity.caption}</span>
                  </p>
                  {activity.metadata && (
                    <p className="text-white/70 text-sm mb-3">{activity.metadata}</p>
                  )}
                  
                  {/* Micro Timeline */}
                  {activity.dayNumber && activity.totalDays && (
                    <div className="flex items-center gap-1 mb-3">
                      {Array.from({ length: activity.totalDays }, (_, i) => (
                        <div 
                          key={i}
                          className="h-1 rounded-full flex-1"
                          style={{
                            background: i < activity.dayNumber 
                              ? '#60A5FA' 
                              : 'rgba(255, 255, 255, 0.1)'
                          }}
                        />
                      ))}
                    </div>
                  )}

                  <div className="flex items-center gap-3">
                    <span className="text-xs text-blue-400 font-medium">{activity.timeAgo}</span>
                    {activity.commentCount && (
                      <div className="flex items-center gap-1 text-white/50">
                        <MessageCircle size={12} />
                        <span className="text-xs">{activity.commentCount}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      // E) Milestone/Badge
      case 'milestone':
        return (
          <div 
            className="rounded-2xl overflow-hidden group cursor-pointer"
            onClick={() => navigate(`/vault/shared/${activity.id}`)}
            style={{
              background: 'linear-gradient(135deg, rgba(167, 139, 250, 0.08), rgba(139, 92, 246, 0.05))',
              border: '1px solid rgba(167, 139, 250, 0.25)',
              boxShadow: '0 4px 24px rgba(167, 139, 250, 0.2)'
            }}
          >
            <div className="p-5">
              <div className="flex items-start gap-4">
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center text-xl flex-shrink-0"
                  style={{
                    background: 'rgba(167, 139, 250, 0.15)',
                    border: '2px solid rgba(167, 139, 250, 0.4)'
                  }}
                >
                  {activity.contributorAvatar}
                </div>
                
                <div className="flex-1">
                  <p className="text-white text-base leading-relaxed mb-3">
                    <span className="font-bold">{activity.contributorName}</span>
                    {' '}
                    <span className="text-white/80">{activity.caption}</span>
                  </p>
                  
                  {/* Badge Graphic */}
                  {activity.badgeText && (
                    <div 
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl mb-3"
                      style={{
                        background: 'linear-gradient(135deg, rgba(167, 139, 250, 0.2), rgba(139, 92, 246, 0.15))',
                        border: '2px solid rgba(167, 139, 250, 0.4)'
                      }}
                    >
                      <Award size={20} style={{ color: '#A78BFA' }} />
                      <span className="text-lg font-bold" style={{ color: '#A78BFA' }}>
                        {activity.badgeText}
                      </span>
                    </div>
                  )}

                  {/* Optional Hero Image */}
                  {activity.heroImage && (
                    <div className="mb-3 rounded-xl overflow-hidden">
                      <img 
                        src={activity.heroImage} 
                        alt=""
                        className="w-full h-48 object-cover"
                      />
                    </div>
                  )}

                  <span className="text-xs text-white/40">{activity.timeAgo}</span>
                </div>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

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

      {/* Section 1: Your Vaults - Horizontal Scroll with Editable Tags */}
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
                  <div
                    key={vault.id}
                    className="group flex-shrink-0"
                  >
                    <div 
                      className="rounded-3xl overflow-hidden transition-all duration-500 hover:scale-[1.02] cursor-pointer"
                      style={{
                        width: '288px',
                        aspectRatio: '4/5',
                        background: 'rgba(255, 255, 255, 0.03)',
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
                      }}
                      onClick={() => navigate(`/vault/${vault.id}`)}
                    >
                      {/* Image Collage with Soft Blend */}
                      <div className="relative h-[65%] overflow-hidden">
                        {images.length >= 4 ? (
                          <div className="relative w-full h-full">
                            <div className="absolute inset-0">
                              <img 
                                src={images[0]} 
                                alt=""
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                              />
                            </div>
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
                        
                        <div 
                          className="absolute inset-0"
                          style={{
                            background: vaultType.overlayTint
                          }}
                        />

                        {/* Editable Type Chip */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            setEditingVaultId(vault.id)
                          }}
                          className="absolute top-3 left-3 backdrop-blur-xl rounded-full px-3 py-1.5 hover:scale-105 transition-transform"
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
                            <Edit2 size={9} style={{ color: vaultType.accent, opacity: 0.5 }} />
                          </div>
                        </button>
                      </div>

                      <div className="p-5 space-y-3">
                        <h3 className="text-white font-semibold text-lg leading-snug line-clamp-2">
                          {vault.name}
                        </h3>

                        <div className="flex items-center justify-between">
                          <p className="text-white/50 text-xs">
                            {vault.inspirations} saved · {vault.contributors} {vault.contributors === 1 ? 'person' : 'people'}
                          </p>

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
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </section>

      {/* Section 2: Shared by Friends - Premium Strava-Inspired Feed */}
      <section className="px-6 pb-24">
        <h2 className="text-lg font-semibold text-white mb-6">Shared by Friends</h2>

        <div className="space-y-6">
          {sharedActivities.map((activity) => (
            <div key={activity.id}>
              {renderSharedActivity(activity)}
            </div>
          ))}
        </div>
      </section>

      {/* Edit Vault Type Bottom Sheet */}
      {editingVaultId && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end"
          onClick={() => setEditingVaultId(null)}
        >
          <div 
            className="w-full rounded-t-3xl p-6 space-y-4"
            style={{
              background: 'linear-gradient(to bottom, #18181B, #0B0B0E)',
              boxShadow: '0 -8px 32px rgba(0, 0, 0, 0.5)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold text-lg">Change Vault Type</h3>
              <button
                onClick={() => setEditingVaultId(null)}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <X size={20} className="text-white" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {Object.values(VAULT_TYPES).map((type) => {
                const TypeIcon = type.icon
                return (
                  <button
                    key={type.id}
                    onClick={() => handleVaultTypeChange(editingVaultId, type.id as keyof typeof VAULT_TYPES)}
                    className="p-4 rounded-2xl transition-all hover:scale-105"
                    style={{
                      background: `${type.accent}10`,
                      border: `1px solid ${type.accent}30`
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <TypeIcon size={20} style={{ color: type.accent }} />
                      <span className="text-sm font-medium" style={{ color: type.accent }}>
                        {type.label}
                      </span>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      )}

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
