import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Plus, MapPin, Coffee, Utensils, Mountain, Sparkles, Heart, 
  Users, Clock, ArrowRight, UserPlus, Bookmark 
} from 'lucide-react'
import { fetchPexelsImages } from '../services/pexels'

// Vault type definitions with colors and icons
export const VAULT_TYPES = {
  trips: {
    id: 'trips',
    label: 'Trips',
    icon: MapPin,
    color: '#FFD15C',
    bgGradient: 'from-yellow-500/20 to-orange-500/10',
    borderColor: 'border-yellow-500/30',
    description: 'Plan your travels'
  },
  city_gems: {
    id: 'city_gems',
    label: 'City Gems',
    icon: Sparkles,
    color: '#60A5FA',
    bgGradient: 'from-blue-500/20 to-cyan-500/10',
    borderColor: 'border-blue-500/30',
    description: 'Hidden local spots'
  },
  food_drink: {
    id: 'food_drink',
    label: 'Food & Drink',
    icon: Utensils,
    color: '#F472B6',
    bgGradient: 'from-pink-500/20 to-rose-500/10',
    borderColor: 'border-pink-500/30',
    description: 'Culinary adventures'
  },
  adventures: {
    id: 'adventures',
    label: 'Adventures',
    icon: Mountain,
    color: '#34D399',
    bgGradient: 'from-green-500/20 to-emerald-500/10',
    borderColor: 'border-green-500/30',
    description: 'Outdoor experiences'
  },
  vibe_boards: {
    id: 'vibe_boards',
    label: 'Vibe Boards',
    icon: Heart,
    color: '#A78BFA',
    bgGradient: 'from-purple-500/20 to-violet-500/10',
    borderColor: 'border-purple-500/30',
    description: 'Aesthetic inspiration'
  },
  wishlists: {
    id: 'wishlists',
    label: 'Wishlists',
    icon: Bookmark,
    color: '#FB923C',
    bgGradient: 'from-orange-500/20 to-amber-500/10',
    borderColor: 'border-orange-500/30',
    description: 'Future dreams'
  }
}

interface Vault {
  id: string
  name: string
  type: keyof typeof VAULT_TYPES
  inspirations: number
  contributors: number
  lastUpdated: string
  images: string[]
  contributorAvatars?: string[]
}

interface SharedVault {
  id: string
  vaultName: string
  friendName: string
  friendAvatar: string
  action: string
  itemsAdded: number
  timeAgo: string
  previewImages: string[]
  type: keyof typeof VAULT_TYPES
}

const DEMO_VAULTS: Vault[] = [
  {
    id: '1',
    name: 'Japan Food Crawl',
    type: 'trips',
    inspirations: 18,
    contributors: 2,
    lastUpdated: '2 days ago',
    images: [],
    contributorAvatars: ['🧑', '👨']
  },
  {
    id: '2',
    name: 'Mumbai Coffee Spots',
    type: 'city_gems',
    inspirations: 24,
    contributors: 1,
    lastUpdated: '5 days ago',
    images: []
  },
  {
    id: '3',
    name: 'Bali Beachside Dining',
    type: 'food_drink',
    inspirations: 12,
    contributors: 3,
    lastUpdated: '1 week ago',
    images: [],
    contributorAvatars: ['👩', '🧑', '👨']
  },
  {
    id: '4',
    name: 'Goa Surf Trip',
    type: 'adventures',
    inspirations: 8,
    contributors: 2,
    lastUpdated: '3 days ago',
    images: []
  },
  {
    id: '5',
    name: 'Aesthetic Japan',
    type: 'vibe_boards',
    inspirations: 31,
    contributors: 1,
    lastUpdated: '1 day ago',
    images: []
  }
]

const SHARED_VAULTS: SharedVault[] = [
  {
    id: 's1',
    vaultName: 'Tokyo Ramen Guide',
    friendName: 'Apoorv',
    friendAvatar: '👨‍💼',
    action: 'added 3 ramen spots',
    itemsAdded: 3,
    timeAgo: '2 hours ago',
    previewImages: [],
    type: 'food_drink'
  },
  {
    id: 's2',
    vaultName: 'Bali Adventures',
    friendName: 'Priya',
    friendAvatar: '👩‍🎨',
    action: 'shared a surf spot',
    itemsAdded: 1,
    timeAgo: '1 day ago',
    previewImages: [],
    type: 'adventures'
  },
  {
    id: 's3',
    vaultName: 'Bangkok Street Food',
    friendName: 'Rahul',
    friendAvatar: '🧑‍🍳',
    action: 'added 5 food stalls',
    itemsAdded: 5,
    timeAgo: '3 days ago',
    previewImages: [],
    type: 'food_drink'
  }
]

export const CollectionsHomePage: React.FC = () => {
  const navigate = useNavigate()
  const [vaults, setVaults] = useState<Vault[]>(DEMO_VAULTS)
  const [sharedVaults, setSharedVaults] = useState<SharedVault[]>(SHARED_VAULTS)
  const [vaultImages, setVaultImages] = useState<Record<string, string[]>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadVaultImages = async () => {
      const imageMap: Record<string, string[]> = {}
      
      for (const vault of vaults) {
        const keywords = `${vault.name} ${VAULT_TYPES[vault.type].label}`
        const photos = await fetchPexelsImages(keywords, 4)
        imageMap[vault.id] = photos.map(p => p.src.large)
      }
      
      for (const shared of sharedVaults) {
        const keywords = `${shared.vaultName} ${VAULT_TYPES[shared.type].label}`
        const photos = await fetchPexelsImages(keywords, 2)
        imageMap[shared.id] = photos.map(p => p.src.medium)
      }
      
      setVaultImages(imageMap)
      setLoading(false)
    }
    
    loadVaultImages()
  }, [])

  return (
    <div 
      className="min-h-screen pb-24"
      style={{
        background: 'linear-gradient(to bottom, #0B0B0E, #18181B)'
      }}
    >
      {/* Header */}
      <div className="sticky top-0 backdrop-blur-xl z-20 border-b"
        style={{
          background: 'rgba(11, 11, 14, 0.85)',
          borderColor: 'rgba(255, 255, 255, 0.1)'
        }}
      >
        <div className="p-6">
          <h1 className="text-3xl font-bold text-white mb-2">Collections</h1>
          <p className="text-white/60 text-sm">Your travel inspiration boards</p>
        </div>
      </div>

      <div className="p-6 space-y-12">
        {/* Your Vaults - Two Column Grid */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Your Vaults</h2>
            <span className="text-white/60 text-sm">{vaults.length} vaults</span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Create New Vault Card - FIRST */}
            <button
              onClick={() => navigate('/vault/create')}
              className="group"
            >
              <div 
                className="rounded-3xl border-2 border-dashed transition-all duration-300 hover:scale-[1.02] hover:border-yellow-200/50"
                style={{
                  aspectRatio: '1 / 1.2',
                  background: 'rgba(255, 255, 255, 0.03)',
                  borderColor: 'rgba(255, 255, 255, 0.2)'
                }}
              >
                <div className="h-full flex flex-col items-center justify-center gap-4 p-6">
                  <div 
                    className="w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                    style={{
                      background: 'linear-gradient(135deg, rgba(255, 209, 92, 0.2), rgba(255, 165, 0, 0.1))',
                      border: '1px solid rgba(255, 209, 92, 0.3)'
                    }}
                  >
                    <Plus size={32} style={{ color: '#FFD15C' }} />
                  </div>
                  <div className="text-center">
                    <p className="text-white font-semibold text-lg mb-1">Create Vault</p>
                    <p className="text-white/60 text-xs">Start a new collection</p>
                  </div>
                </div>
              </div>
            </button>

            {/* Vault Cards */}
            {vaults.map((vault) => {
              const vaultType = VAULT_TYPES[vault.type]
              const Icon = vaultType.icon
              const images = vaultImages[vault.id] || []

              return (
                <button
                  key={vault.id}
                  onClick={() => navigate(`/vault/${vault.id}`)}
                  className="group text-left"
                >
                  <div 
                    className="rounded-3xl overflow-hidden border transition-all duration-300 hover:scale-[1.02]"
                    style={{
                      aspectRatio: '1 / 1.2',
                      background: 'rgba(255, 255, 255, 0.05)',
                      borderColor: 'rgba(255, 255, 255, 0.1)'
                    }}
                  >
                    {/* Image Collage */}
                    <div className="relative h-[60%] overflow-hidden">
                      {images.length > 0 ? (
                        <div className="grid grid-cols-2 gap-1 h-full">
                          {images.slice(0, 4).map((img, idx) => (
                            <div key={idx} className="relative overflow-hidden">
                              <img 
                                src={img} 
                                alt=""
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                              />
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div 
                          className={`w-full h-full bg-gradient-to-br ${vaultType.bgGradient} flex items-center justify-center`}
                        >
                          <Icon size={48} style={{ color: vaultType.color, opacity: 0.5 }} />
                        </div>
                      )}
                      
                      {/* Type Tag - Overlaid */}
                      <div 
                        className={`absolute top-3 left-3 backdrop-blur-xl rounded-full px-3 py-1.5 border ${vaultType.borderColor}`}
                        style={{
                          background: `${vaultType.color}20`
                        }}
                      >
                        <div className="flex items-center gap-1.5">
                          <Icon size={12} style={{ color: vaultType.color }} />
                          <span className="text-xs font-semibold" style={{ color: vaultType.color }}>
                            {vaultType.label}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Vault Info */}
                    <div className="p-4 space-y-3">
                      <h3 className="text-white font-bold text-base leading-tight line-clamp-2">
                        {vault.name}
                      </h3>

                      {/* Metadata Row */}
                      <div className="flex items-center gap-3 text-xs text-white/60">
                        <span>{vault.inspirations} saved</span>
                        <span>•</span>
                        <div className="flex items-center gap-1">
                          <Users size={12} />
                          <span>{vault.contributors}</span>
                        </div>
                      </div>

                      {/* Contributors & Time */}
                      <div className="flex items-center justify-between">
                        {vault.contributorAvatars && (
                          <div className="flex -space-x-2">
                            {vault.contributorAvatars.slice(0, 3).map((avatar, idx) => (
                              <div 
                                key={idx}
                                className="w-6 h-6 rounded-full flex items-center justify-center text-xs border-2"
                                style={{
                                  background: 'rgba(255, 255, 255, 0.1)',
                                  borderColor: '#0B0B0E'
                                }}
                              >
                                {avatar}
                              </div>
                            ))}
                          </div>
                        )}
                        <div className="flex items-center gap-1 text-xs text-white/50">
                          <Clock size={12} />
                          <span>{vault.lastUpdated}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </section>

        {/* Shared by Friends - Vertical Feed */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Shared by Friends</h2>
            <button className="text-yellow-200 text-sm font-medium hover:underline">
              See all
            </button>
          </div>

          <div className="space-y-4">
            {sharedVaults.map((shared) => {
              const vaultType = VAULT_TYPES[shared.type]
              const Icon = vaultType.icon
              const images = vaultImages[shared.id] || []

              return (
                <div 
                  key={shared.id}
                  className="backdrop-blur-xl rounded-2xl p-5 border transition-all duration-300 hover:scale-[1.01]"
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderColor: 'rgba(255, 255, 255, 0.1)'
                  }}
                >
                  <div className="flex gap-4">
                    {/* Friend Avatar */}
                    <div 
                      className="w-12 h-12 rounded-full flex items-center justify-center text-xl flex-shrink-0"
                      style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        border: '2px solid rgba(255, 255, 255, 0.2)'
                      }}
                    >
                      {shared.friendAvatar}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="mb-3">
                        <p className="text-white text-sm mb-1">
                          <span className="font-semibold">{shared.friendName}</span>
                          {' '}<span className="text-white/70">{shared.action}</span>
                        </p>
                        <div className="flex items-center gap-2">
                          <div 
                            className={`flex items-center gap-1 px-2 py-1 rounded-full ${vaultType.borderColor}`}
                            style={{
                              background: `${vaultType.color}15`
                            }}
                          >
                            <Icon size={10} style={{ color: vaultType.color }} />
                            <span className="text-xs font-medium" style={{ color: vaultType.color }}>
                              {shared.vaultName}
                            </span>
                          </div>
                          <span className="text-xs text-white/50">{shared.timeAgo}</span>
                        </div>
                      </div>

                      {/* Preview Images */}
                      {images.length > 0 && (
                        <div className="flex gap-2 mb-3">
                          {images.slice(0, 2).map((img, idx) => (
                            <div key={idx} className="w-20 h-20 rounded-xl overflow-hidden">
                              <img src={img} alt="" className="w-full h-full object-cover" />
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <button 
                          className="flex-1 py-2 px-4 rounded-full text-sm font-semibold transition-all hover:scale-105"
                          style={{
                            background: 'linear-gradient(135deg, #FFD15C, #FFA500)',
                            color: '#0B0B0E'
                          }}
                        >
                          Add to My Vaults
                        </button>
                        <button 
                          className="py-2 px-4 rounded-full text-sm font-semibold transition-all hover:bg-white/10"
                          style={{
                            background: 'rgba(255, 255, 255, 0.05)',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            color: 'white'
                          }}
                        >
                          Open
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      </div>
    </div>
  )
}
