import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Plus, MapPin, Coffee, Utensils, Mountain, Sparkles, Heart, 
  Bookmark, CheckCircle, Award, Check, X
} from 'lucide-react'
import { fetchPexelsImages } from '../services/pexels'

// ============================================================================
// UNIFIED DESIGN SYSTEM
// ============================================================================

const DESIGN_TOKENS = {
  // Spacing
  spacing: {
    cardMargin: '24px',
    avatarToCaption: '8px',
    captionToTag: '12px',
    tagToImage: '16px',
    imageToTimestamp: '12px',
    cardVertical: '24px',
    cardPadding: '20px'
  },
  // Typography
  typography: {
    caption: { size: '17px', weight: '600', lineHeight: '1.4' },
    name: { size: '16px', weight: '500' },
    timestamp: { size: '13px', weight: '400', opacity: '0.65' },
    tag: { size: '13px', weight: '500' },
    badge: { size: '14px', weight: '500' }
  },
  // Shadow
  shadow: '0 4px 20px rgba(0, 0, 0, 0.16)',
  // Border Radius
  radius: '16px',
  // Colors
  colors: {
    gold: '#FFD15C',
    purple: '#A78BFA',
    blue: '#60A5FA',
    olive: '#84CC9C',
    rose: '#FB7185',
    red: '#EF4444',
    textPrimary: 'rgba(255, 255, 255, 0.95)',
    textSecondary: 'rgba(255, 255, 255, 0.65)',
    cardBg: 'rgba(255, 255, 255, 0.03)',
    cardBorder: 'rgba(255, 255, 255, 0.08)'
  }
}

// Refined Vault Types with Subtle Colors
export const VAULT_TYPES = {
  trips: {
    id: 'trips',
    label: 'Trips',
    icon: MapPin,
    accent: DESIGN_TOKENS.colors.blue,
    bg: 'rgba(96, 165, 250, 0.12)',
    description: 'Travel planning'
  },
  city_gems: {
    id: 'city_gems',
    label: 'City Gems',
    icon: Sparkles,
    accent: DESIGN_TOKENS.colors.gold,
    bg: 'rgba(255, 209, 92, 0.12)',
    description: 'Hidden finds'
  },
  food_drink: {
    id: 'food_drink',
    label: 'Food & Drink',
    icon: Utensils,
    accent: DESIGN_TOKENS.colors.rose,
    bg: 'rgba(251, 113, 133, 0.12)',
    description: 'Culinary maps'
  },
  adventures: {
    id: 'adventures',
    label: 'Adventures',
    icon: Mountain,
    accent: DESIGN_TOKENS.colors.olive,
    bg: 'rgba(132, 204, 156, 0.12)',
    description: 'Outdoor experiences'
  },
  vibe_boards: {
    id: 'vibe_boards',
    label: 'Vibe Boards',
    icon: Heart,
    accent: DESIGN_TOKENS.colors.purple,
    bg: 'rgba(167, 139, 250, 0.12)',
    description: 'Aesthetic inspo'
  },
  wishlists: {
    id: 'wishlists',
    label: 'Wishlists',
    icon: Bookmark,
    accent: '#FB923C',
    bg: 'rgba(251, 146, 60, 0.12)',
    description: 'Future dreams'
  }
}

// ============================================================================
// TYPES
// ============================================================================

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

// ============================================================================
// MOCK DATA
// ============================================================================

const DEMO_VAULTS: Vault[] = [
  {
    id: '1',
    name: 'Japan Food Crawl',
    type: 'food_drink',
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
    name: 'Southeast Asia Adventure',
    type: 'trips',
    inspirations: 32,
    contributors: 3,
    images: [],
    contributorAvatars: ['👩', '🧑', '👨']
  },
  {
    id: '4',
    name: 'Maldives Scuba & Dive',
    type: 'adventures',
    inspirations: 15,
    contributors: 2,
    images: [],
    contributorAvatars: ['🧑', '👩']
  },
  {
    id: '5',
    name: 'European Summer Dreams',
    type: 'wishlists',
    inspirations: 28,
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

// ============================================================================
// REUSABLE COMPONENTS
// ============================================================================

// Tag Chip Component (Unified)
const TagChip: React.FC<{ 
  label: string
  accent: string
  bg: string
  icon?: React.ComponentType<any>
}> = ({ label, accent, bg, icon: Icon }) => (
  <div 
    className="inline-flex items-center gap-1.5 px-3 py-1.5"
    style={{
      background: bg,
      borderRadius: '8px',
      fontSize: DESIGN_TOKENS.typography.tag.size,
      fontWeight: DESIGN_TOKENS.typography.tag.weight,
      color: accent
    }}
  >
    {Icon && <Icon size={12} />}
    <span>{label}</span>
  </div>
)

// Avatar Component
const Avatar: React.FC<{ emoji: string; size?: number }> = ({ emoji, size = 40 }) => (
  <div 
    className="flex items-center justify-center flex-shrink-0"
    style={{
      width: `${size}px`,
      height: `${size}px`,
      borderRadius: '50%',
      background: 'rgba(255, 255, 255, 0.1)',
      fontSize: `${size * 0.5}px`
    }}
  >
    {emoji}
  </div>
)

// Hero Image with Vignette
const HeroImage: React.FC<{ src: string; height: string; className?: string }> = ({ src, height, className = '' }) => (
  <div 
    className={`relative overflow-hidden ${className}`}
    style={{ 
      height,
      borderRadius: DESIGN_TOKENS.radius
    }}
  >
    <img 
      src={src}
      alt=""
      className="w-full h-full object-cover"
      style={{
        filter: 'contrast(1.05)'
      }}
    />
    {/* Vignette */}
    <div 
      className="absolute inset-0 pointer-events-none"
      style={{
        background: 'radial-gradient(ellipse at center, transparent 0%, rgba(0, 0, 0, 0.25) 100%)'
      }}
    />
  </div>
)

// ============================================================================
// FEED CARD COMPONENTS
// ============================================================================

// A) SHARED VAULT CARD (Classic Share)
const SharedVaultCard: React.FC<{ activity: SharedActivity; images: string[] }> = ({ activity, images }) => {
  const vaultType = VAULT_TYPES[activity.vaultType]
  const Icon = vaultType.icon

  return (
    <div 
      className="w-full"
      style={{
        background: DESIGN_TOKENS.colors.cardBg,
        borderRadius: DESIGN_TOKENS.radius,
        border: `1px solid ${DESIGN_TOKENS.colors.cardBorder}`,
        boxShadow: DESIGN_TOKENS.shadow,
        padding: DESIGN_TOKENS.spacing.cardPadding
      }}
    >
      {/* Avatar + Name + Caption */}
      <div className="flex items-start gap-3 mb-3">
        <Avatar emoji={activity.contributorAvatar} size={40} />
        <div className="flex-1 min-w-0">
          <div 
            style={{
              fontSize: DESIGN_TOKENS.typography.name.size,
              fontWeight: DESIGN_TOKENS.typography.name.weight,
              color: DESIGN_TOKENS.colors.textPrimary,
              marginBottom: '2px'
            }}
          >
            {activity.contributorName}
          </div>
          <div 
            style={{
              fontSize: DESIGN_TOKENS.typography.caption.size,
              fontWeight: DESIGN_TOKENS.typography.caption.weight,
              lineHeight: DESIGN_TOKENS.typography.caption.lineHeight,
              color: DESIGN_TOKENS.colors.textPrimary
            }}
          >
            {activity.caption}
          </div>
        </div>
      </div>

      {/* Tag */}
      <div style={{ marginBottom: DESIGN_TOKENS.spacing.tagToImage }}>
        <TagChip 
          label={activity.vaultName}
          accent={vaultType.accent}
          bg={vaultType.bg}
          icon={Icon}
        />
      </div>

      {/* Hero Image or Collage */}
      {images.length > 0 && (
        <div style={{ marginBottom: DESIGN_TOKENS.spacing.imageToTimestamp }}>
          {images.length === 1 ? (
            <HeroImage src={images[0]} height="280px" />
          ) : (
            <div className="grid grid-cols-3 gap-2">
              {images.slice(0, 3).map((img, idx) => (
                <div 
                  key={idx}
                  className="relative overflow-hidden"
                  style={{ 
                    height: '120px',
                    borderRadius: DESIGN_TOKENS.radius
                  }}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Timestamp */}
      <div 
        style={{
          fontSize: DESIGN_TOKENS.typography.timestamp.size,
          fontWeight: DESIGN_TOKENS.typography.timestamp.weight,
          color: DESIGN_TOKENS.colors.textSecondary,
          opacity: DESIGN_TOKENS.typography.timestamp.opacity
        }}
      >
        {activity.timeAgo}
      </div>
    </div>
  )
}

// B) COMPLETED EXPERIENCE CARD (Achievement)
const CompletedExperienceCard: React.FC<{ activity: SharedActivity; images: string[] }> = ({ activity, images }) => {
  const vaultType = VAULT_TYPES[activity.vaultType]
  const Icon = vaultType.icon

  return (
    <div 
      className="w-full"
      style={{
        background: DESIGN_TOKENS.colors.cardBg,
        borderRadius: DESIGN_TOKENS.radius,
        border: `1px solid ${DESIGN_TOKENS.colors.cardBorder}`,
        boxShadow: DESIGN_TOKENS.shadow,
        padding: DESIGN_TOKENS.spacing.cardPadding
      }}
    >
      {/* Hero Image */}
      {activity.heroImage && (
        <div style={{ marginBottom: '16px' }}>
          <HeroImage src={activity.heroImage} height="320px" />
        </div>
      )}

      {/* Avatar + Name + Caption */}
      <div className="flex items-start gap-3 mb-3">
        <Avatar emoji={activity.contributorAvatar} size={40} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <div 
              style={{
                fontSize: DESIGN_TOKENS.typography.name.size,
                fontWeight: DESIGN_TOKENS.typography.name.weight,
                color: DESIGN_TOKENS.colors.textPrimary
              }}
            >
              {activity.contributorName}
            </div>
            <div 
              className="flex items-center justify-center"
              style={{
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                background: vaultType.bg,
                color: vaultType.accent
              }}
            >
              <CheckCircle size={12} />
            </div>
          </div>
          <div 
            style={{
              fontSize: DESIGN_TOKENS.typography.caption.size,
              fontWeight: DESIGN_TOKENS.typography.caption.weight,
              lineHeight: DESIGN_TOKENS.typography.caption.lineHeight,
              color: DESIGN_TOKENS.colors.textPrimary
            }}
          >
            {activity.caption}
          </div>
        </div>
      </div>

      {/* Tag */}
      <div style={{ marginBottom: DESIGN_TOKENS.spacing.imageToTimestamp }}>
        <TagChip 
          label={activity.vaultName}
          accent={vaultType.accent}
          bg={vaultType.bg}
          icon={Icon}
        />
      </div>

      {/* Timestamp + Comment Count */}
      <div className="flex items-center justify-between">
        <div 
          style={{
            fontSize: DESIGN_TOKENS.typography.timestamp.size,
            fontWeight: DESIGN_TOKENS.typography.timestamp.weight,
            color: DESIGN_TOKENS.colors.textSecondary,
            opacity: DESIGN_TOKENS.typography.timestamp.opacity
          }}
        >
          {activity.timeAgo}
        </div>
        {activity.commentCount && (
          <div 
            style={{
              fontSize: DESIGN_TOKENS.typography.timestamp.size,
              color: DESIGN_TOKENS.colors.textSecondary,
              opacity: 0.5
            }}
          >
            {activity.commentCount} comments
          </div>
        )}
      </div>
    </div>
  )
}

// C) CREATOR VAULT CARD (Editorial)
const CreatorVaultCard: React.FC<{ activity: SharedActivity; images: string[] }> = ({ activity, images }) => {
  const vaultType = VAULT_TYPES[activity.vaultType]

  return (
    <div 
      className="w-full"
      style={{
        background: DESIGN_TOKENS.colors.cardBg,
        borderRadius: DESIGN_TOKENS.radius,
        border: `1px solid ${DESIGN_TOKENS.colors.cardBorder}`,
        boxShadow: DESIGN_TOKENS.shadow,
        padding: DESIGN_TOKENS.spacing.cardPadding
      }}
    >
      {/* Avatar + Name + Caption */}
      <div className="flex items-start gap-3 mb-3">
        <Avatar emoji={activity.contributorAvatar} size={40} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <div 
              style={{
                fontSize: DESIGN_TOKENS.typography.name.size,
                fontWeight: DESIGN_TOKENS.typography.name.weight,
                color: DESIGN_TOKENS.colors.textPrimary
              }}
            >
              {activity.contributorName}
            </div>
            {/* Verified Badge */}
            <div 
              className="flex items-center justify-center"
              style={{
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                background: DESIGN_TOKENS.colors.purple,
                opacity: 0.9
              }}
            >
              <Check size={11} strokeWidth={3} color="#000" />
            </div>
          </div>
          <div 
            style={{
              fontSize: DESIGN_TOKENS.typography.caption.size,
              fontWeight: DESIGN_TOKENS.typography.caption.weight,
              lineHeight: DESIGN_TOKENS.typography.caption.lineHeight,
              color: DESIGN_TOKENS.colors.textPrimary
            }}
          >
            {activity.caption}
          </div>
        </div>
      </div>

      {/* Creator Vault Tag + Metadata */}
      <div className="flex items-center gap-2 mb-4">
        <TagChip 
          label="Creator Vault"
          accent={DESIGN_TOKENS.colors.purple}
          bg="rgba(167, 139, 250, 0.12)"
        />
        {activity.metadata && (
          <span 
            style={{
              fontSize: '12px',
              color: DESIGN_TOKENS.colors.textSecondary,
              opacity: 0.6
            }}
          >
            · {activity.metadata}
          </span>
        )}
      </div>

      {/* Horizontal Collage (3 tiles) */}
      {images.length >= 3 && (
        <div className="grid grid-cols-3 gap-3 mb-3">
          {images.slice(0, 3).map((img, idx) => (
            <div 
              key={idx}
              className="relative overflow-hidden"
              style={{ 
                height: '140px',
                borderRadius: DESIGN_TOKENS.radius
              }}
            >
              <img src={img} alt="" className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      )}

      {/* Timestamp */}
      <div 
        style={{
          fontSize: DESIGN_TOKENS.typography.timestamp.size,
          fontWeight: DESIGN_TOKENS.typography.timestamp.weight,
          color: DESIGN_TOKENS.colors.textSecondary,
          opacity: DESIGN_TOKENS.typography.timestamp.opacity
        }}
      >
        {activity.timeAgo}
      </div>
    </div>
  )
}

// D) ON TRIP CARD (Live)
const OnTripCard: React.FC<{ activity: SharedActivity; images: string[] }> = ({ activity, images }) => {
  const totalDays = activity.totalDays || 7
  const currentDay = activity.dayNumber || 3

  return (
    <div 
      className="w-full"
      style={{
        background: DESIGN_TOKENS.colors.cardBg,
        borderRadius: DESIGN_TOKENS.radius,
        border: `1px solid ${DESIGN_TOKENS.colors.cardBorder}`,
        boxShadow: DESIGN_TOKENS.shadow,
        padding: DESIGN_TOKENS.spacing.cardPadding
      }}
    >
      {/* Hero Image with Live Badge */}
      {activity.heroImage && (
        <div className="relative mb-4">
          <HeroImage src={activity.heroImage} height="280px" />
          {/* Live Badge */}
          <div 
            className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1"
            style={{
              background: DESIGN_TOKENS.colors.red,
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: '600',
              color: '#fff'
            }}
          >
            <div 
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: '#fff',
                animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
              }}
            />
            Live
          </div>
        </div>
      )}

      {/* Avatar + Name + Caption */}
      <div className="flex items-start gap-3 mb-3">
        <Avatar emoji={activity.contributorAvatar} size={40} />
        <div className="flex-1 min-w-0">
          <div 
            style={{
              fontSize: DESIGN_TOKENS.typography.name.size,
              fontWeight: DESIGN_TOKENS.typography.name.weight,
              color: DESIGN_TOKENS.colors.textPrimary,
              marginBottom: '2px'
            }}
          >
            {activity.contributorName}
          </div>
          <div 
            style={{
              fontSize: DESIGN_TOKENS.typography.caption.size,
              fontWeight: DESIGN_TOKENS.typography.caption.weight,
              lineHeight: DESIGN_TOKENS.typography.caption.lineHeight,
              color: DESIGN_TOKENS.colors.textPrimary
            }}
          >
            {activity.caption}
          </div>
        </div>
      </div>

      {/* Current Activity */}
      {activity.metadata && (
        <div 
          className="mb-3 px-3 py-2"
          style={{
            background: 'rgba(96, 165, 250, 0.08)',
            borderRadius: '10px',
            fontSize: '14px',
            fontWeight: '500',
            color: DESIGN_TOKENS.colors.blue
          }}
        >
          {activity.metadata}
        </div>
      )}

      {/* Timeline Progress */}
      <div className="mb-3">
        <div className="flex items-center gap-1.5 mb-2">
          {Array.from({ length: totalDays }).map((_, idx) => (
            <div 
              key={idx}
              style={{
                flex: 1,
                height: '4px',
                borderRadius: '2px',
                background: idx < currentDay ? DESIGN_TOKENS.colors.blue : 'rgba(255, 255, 255, 0.1)',
                transition: 'background 0.3s ease'
              }}
            />
          ))}
        </div>
        <div 
          style={{
            fontSize: '12px',
            color: DESIGN_TOKENS.colors.textSecondary,
            opacity: 0.6
          }}
        >
          Day {currentDay} of {totalDays}
        </div>
      </div>

      {/* Timestamp */}
      <div 
        style={{
          fontSize: DESIGN_TOKENS.typography.timestamp.size,
          fontWeight: DESIGN_TOKENS.typography.timestamp.weight,
          color: DESIGN_TOKENS.colors.textSecondary,
          opacity: DESIGN_TOKENS.typography.timestamp.opacity
        }}
      >
        {activity.timeAgo}
      </div>
    </div>
  )
}

// E) MILESTONE CARD
const MilestoneCard: React.FC<{ activity: SharedActivity; images: string[] }> = ({ activity, images }) => {
  const vaultType = VAULT_TYPES[activity.vaultType]

  return (
    <div 
      className="w-full"
      style={{
        background: DESIGN_TOKENS.colors.cardBg,
        borderRadius: DESIGN_TOKENS.radius,
        border: `1px solid ${DESIGN_TOKENS.colors.cardBorder}`,
        boxShadow: DESIGN_TOKENS.shadow,
        padding: DESIGN_TOKENS.spacing.cardPadding
      }}
    >
      {/* Avatar + Name */}
      <div className="flex items-center gap-3 mb-4">
        <Avatar emoji={activity.contributorAvatar} size={40} />
        <div 
          style={{
            fontSize: DESIGN_TOKENS.typography.name.size,
            fontWeight: DESIGN_TOKENS.typography.name.weight,
            color: DESIGN_TOKENS.colors.textPrimary
          }}
        >
          {activity.contributorName}
        </div>
      </div>

      {/* Large Badge */}
      {activity.badgeText && (
        <div 
          className="flex items-center justify-center gap-2 mb-3 py-4"
          style={{
            background: vaultType.bg,
            borderRadius: DESIGN_TOKENS.radius,
            border: `1px solid ${vaultType.accent}20`
          }}
        >
          <Award size={24} color={vaultType.accent} />
          <div 
            style={{
              fontSize: '20px',
              fontWeight: '600',
              color: vaultType.accent
            }}
          >
            {activity.badgeText}
          </div>
        </div>
      )}

      {/* Caption */}
      <div 
        className="mb-4"
        style={{
          fontSize: DESIGN_TOKENS.typography.caption.size,
          fontWeight: DESIGN_TOKENS.typography.caption.weight,
          lineHeight: DESIGN_TOKENS.typography.caption.lineHeight,
          color: DESIGN_TOKENS.colors.textPrimary,
          textAlign: 'center'
        }}
      >
        {activity.caption}
      </div>

      {/* Optional Hero Image */}
      {activity.heroImage && (
        <div style={{ marginBottom: DESIGN_TOKENS.spacing.imageToTimestamp }}>
          <HeroImage src={activity.heroImage} height="200px" />
        </div>
      )}

      {/* Timestamp */}
      <div 
        className="text-center"
        style={{
          fontSize: DESIGN_TOKENS.typography.timestamp.size,
          fontWeight: DESIGN_TOKENS.typography.timestamp.weight,
          color: DESIGN_TOKENS.colors.textSecondary,
          opacity: DESIGN_TOKENS.typography.timestamp.opacity
        }}
      >
        {activity.timeAgo}
      </div>
    </div>
  )
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export const CollectionsHomePage: React.FC = () => {
  const navigate = useNavigate()
  const [vaults, setVaults] = useState<Vault[]>(DEMO_VAULTS)
  const [sharedActivities] = useState<SharedActivity[]>(SHARED_ACTIVITIES)
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
        if (photos.length > 0 && (
          activity.type === 'completed_experience' || 
          activity.type === 'on_trip' || 
          activity.type === 'milestone'
        )) {
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
    const images = vaultImages[activity.id] || []

    switch (activity.type) {
      case 'shared_vault':
        return <SharedVaultCard activity={activity} images={images} />
      case 'completed_experience':
        return <CompletedExperienceCard activity={activity} images={images} />
      case 'creator_vault':
        return <CreatorVaultCard activity={activity} images={images} />
      case 'on_trip':
        return <OnTripCard activity={activity} images={images} />
      case 'milestone':
        return <MilestoneCard activity={activity} images={images} />
      default:
        return null
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0B0B0E] to-[#18181B] flex items-center justify-center">
        <div style={{ color: DESIGN_TOKENS.colors.textSecondary }}>Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0B0B0E] to-[#18181B]">
      {/* Header */}
      <div 
        className="sticky top-0 z-10 backdrop-blur-xl"
        style={{
          background: 'rgba(11, 11, 14, 0.8)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
          padding: '16px 24px'
        }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 
              style={{
                fontSize: '28px',
                fontWeight: '700',
                color: DESIGN_TOKENS.colors.textPrimary
              }}
            >
              Collections
            </h1>
            <p 
              style={{
                fontSize: '14px',
                color: DESIGN_TOKENS.colors.textSecondary,
                marginTop: '2px'
              }}
            >
              Your travel inspiration
            </p>
          </div>
          <button
            className="flex items-center gap-2 px-4 py-2"
            style={{
              background: DESIGN_TOKENS.colors.gold,
              color: '#000',
              borderRadius: '12px',
              fontSize: '14px',
              fontWeight: '600',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            <Plus size={18} />
            New Vault
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="pb-24">
        {/* Your Vaults Section */}
        <div style={{ padding: '24px 0' }}>
          <h2 
            style={{
              fontSize: '20px',
              fontWeight: '600',
              color: DESIGN_TOKENS.colors.textPrimary,
              marginBottom: '16px',
              paddingLeft: DESIGN_TOKENS.spacing.cardMargin
            }}
          >
            Your Vaults
          </h2>
          
          <div 
            className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar"
            style={{
              paddingLeft: DESIGN_TOKENS.spacing.cardMargin,
              paddingRight: DESIGN_TOKENS.spacing.cardMargin
            }}
          >
            {vaults.map((vault) => {
              const vaultType = VAULT_TYPES[vault.type]
              const Icon = vaultType.icon
              const images = vaultImages[vault.id] || []

              return (
                <div
                  key={vault.id}
                  className="flex-shrink-0"
                  style={{ width: '280px' }}
                >
                  <div
                    className="cursor-pointer group"
                    style={{
                      background: DESIGN_TOKENS.colors.cardBg,
                      borderRadius: DESIGN_TOKENS.radius,
                      border: `1px solid ${DESIGN_TOKENS.colors.cardBorder}`,
                      boxShadow: DESIGN_TOKENS.shadow,
                      overflow: 'hidden'
                    }}
                    onClick={() => navigate(`/vault/${vault.id}`)}
                  >
                    {/* Hero Image */}
                    {images.length > 0 && (
                      <div 
                        className="relative overflow-hidden"
                        style={{ height: '180px' }}
                      >
                        <img
                          src={images[0]}
                          alt=""
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div 
                          className="absolute inset-0"
                          style={{
                            background: 'linear-gradient(to top, rgba(11, 11, 14, 0.6) 0%, transparent 60%)'
                          }}
                        />
                      </div>
                    )}

                    {/* Content */}
                    <div style={{ padding: '16px' }}>
                      <div 
                        style={{
                          fontSize: '18px',
                          fontWeight: '600',
                          color: DESIGN_TOKENS.colors.textPrimary,
                          marginBottom: '8px'
                        }}
                      >
                        {vault.name}
                      </div>

                      <div className="flex items-center gap-2 mb-3">
                        <span 
                          style={{
                            fontSize: '13px',
                            color: DESIGN_TOKENS.colors.textSecondary
                          }}
                        >
                          {vault.inspirations} saved · {vault.contributors} {vault.contributors === 1 ? 'person' : 'people'}
                        </span>
                      </div>

                      {/* Editable Tag */}
                      <div 
                        className="inline-block cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation()
                          setEditingVaultId(vault.id)
                        }}
                      >
                        <div 
                          className="flex items-center gap-1.5 px-2.5 py-1.5 transition-all hover:opacity-80"
                          style={{
                            background: vaultType.bg,
                            borderRadius: '8px',
                            border: `1px solid ${vaultType.accent}20`
                          }}
                        >
                          <Icon size={12} color={vaultType.accent} />
                          <span 
                            style={{
                              fontSize: '12px',
                              fontWeight: '500',
                              color: vaultType.accent
                            }}
                          >
                            {vaultType.label}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Shared by Friends Section */}
        <div style={{ padding: '24px 0' }}>
          <h2 
            style={{
              fontSize: '20px',
              fontWeight: '600',
              color: DESIGN_TOKENS.colors.textPrimary,
              marginBottom: '20px',
              paddingLeft: DESIGN_TOKENS.spacing.cardMargin
            }}
          >
            Shared by Friends
          </h2>

          <div 
            className="flex flex-col"
            style={{
              gap: DESIGN_TOKENS.spacing.cardVertical,
              paddingLeft: DESIGN_TOKENS.spacing.cardMargin,
              paddingRight: DESIGN_TOKENS.spacing.cardMargin
            }}
          >
            {sharedActivities.map((activity) => (
              <div key={activity.id}>
                {renderSharedActivity(activity)}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Sheet for Vault Type Selection */}
      {editingVaultId && (
        <div
          className="fixed inset-0 z-50 flex items-end"
          onClick={() => setEditingVaultId(null)}
        >
          <div 
            className="absolute inset-0"
            style={{ background: 'rgba(0, 0, 0, 0.6)' }}
          />
          <div
            className="relative w-full"
            style={{
              background: '#1C1C1E',
              borderTopLeftRadius: '24px',
              borderTopRightRadius: '24px',
              padding: '24px',
              maxHeight: '70vh',
              overflowY: 'auto'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 
                style={{
                  fontSize: '20px',
                  fontWeight: '600',
                  color: DESIGN_TOKENS.colors.textPrimary
                }}
              >
                Select Vault Type
              </h3>
              <button
                onClick={() => setEditingVaultId(null)}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                <X size={18} color={DESIGN_TOKENS.colors.textPrimary} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {Object.values(VAULT_TYPES).map((type) => {
                const Icon = type.icon
                return (
                  <button
                    key={type.id}
                    onClick={() => handleVaultTypeChange(editingVaultId, type.id as keyof typeof VAULT_TYPES)}
                    className="text-left p-4 transition-all hover:scale-[1.02]"
                    style={{
                      background: type.bg,
                      border: `1px solid ${type.accent}30`,
                      borderRadius: DESIGN_TOKENS.radius,
                      cursor: 'pointer'
                    }}
                  >
                    <Icon size={24} color={type.accent} className="mb-2" />
                    <div 
                      style={{
                        fontSize: '16px',
                        fontWeight: '600',
                        color: type.accent,
                        marginBottom: '4px'
                      }}
                    >
                      {type.label}
                    </div>
                    <div 
                      style={{
                        fontSize: '13px',
                        color: DESIGN_TOKENS.colors.textSecondary,
                        opacity: 0.7
                      }}
                    >
                      {type.description}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      )}

      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
      `}</style>
    </div>
  )
}
