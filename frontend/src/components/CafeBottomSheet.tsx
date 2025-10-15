import React from 'react'
import { X, MapPin, Wifi, Zap, Sun, CreditCard, Users, Star, Navigation, MessageCircle, Heart } from 'lucide-react'

interface Cafe {
  cafe_id: string
  name: string
  image_keywords: string
  vibe: string
  price_level: string
  open_hours: string
  features: string[]
  menu_highlights: string[]
  nearby_activities?: string[]
  notes: string
  dietary_friendly?: string[]
  noise_level?: string
}

interface CafeBottomSheetProps {
  cafe: Cafe
  images: string[]
  onClose: () => void
  onSave: () => void
  onAddToTrip: () => void
  isSaved: boolean
}

export const CafeBottomSheet: React.FC<CafeBottomSheetProps> = ({
  cafe,
  images,
  onClose,
  onSave,
  onAddToTrip,
  isSaved
}) => {
  const featureIcons: Record<string, React.ReactNode> = {
    wifi: <Wifi size={16} />,
    power: <Zap size={16} />,
    outdoor: <Sun size={16} />,
    cards: <CreditCard size={16} />,
    kid_friendly: <Users size={16} />
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm animate-fade-in"
         onClick={onClose}>
      <div className="bg-white rounded-t-3xl w-full max-w-2xl max-h-[85vh] overflow-y-auto animate-slide-up"
           onClick={(e) => e.stopPropagation()}>
        
        {/* Handle bar */}
        <div className="sticky top-0 bg-white pt-3 pb-2 px-6 border-b border-gray-100">
          <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-4" />
          <div className="flex items-center justify-between">
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={20} className="text-gray-600" />
            </button>
            <h2 className="text-lg font-bold text-gray-900 flex-1 text-center">{cafe.name}</h2>
            <div className="w-9" /> {/* Spacer for centering */}
          </div>
        </div>

        {/* Hero Image Carousel */}
        <div className="relative h-64 bg-gradient-to-br from-gray-200 to-gray-300">
          {images.length > 0 ? (
            <div className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide h-full">
              {images.slice(0, 3).map((img, idx) => (
                <div key={idx} className="flex-none w-full h-full snap-center">
                  <img src={img} alt={cafe.name} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <MapPin size={48} className="text-gray-400" />
            </div>
          )}
          
          {/* Tagline overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
            <p className="text-white text-sm">{cafe.notes.split('—')[0]}</p>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Key Badges */}
          <div className="flex items-center gap-3 flex-wrap">
            <span className="px-3 py-1.5 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
              {cafe.vibe?.split(',')[0] || 'Cozy'}
            </span>
            <span className="px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-xs font-medium">
              {cafe.price_level === 'low' ? '$' : cafe.price_level === 'mid' ? '$$' : '$$$'}
            </span>
            <span className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
              Opens {cafe.open_hours.split('-')[0]}
            </span>
            {cafe.noise_level && (
              <span className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-xs font-medium capitalize">
                {cafe.noise_level}
              </span>
            )}
          </div>

          {/* Quick Facts */}
          {cafe.features && cafe.features.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Amenities</h3>
              <div className="flex items-center gap-4 flex-wrap">
                {cafe.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-gray-600">
                    {featureIcons[feature] || <MapPin size={16} />}
                    <span className="text-xs capitalize">{feature.replace('_', ' ')}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Menu Highlights */}
          {cafe.menu_highlights && cafe.menu_highlights.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Menu Highlights</h3>
              <div className="space-y-2">
                {cafe.menu_highlights.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <Star size={14} className="text-yellow-500 fill-yellow-500" />
                    <span className="text-sm text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Nearby Activities */}
          {cafe.nearby_activities && cafe.nearby_activities.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Nearby Experiences</h3>
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {cafe.nearby_activities.slice(0, 3).map((activity, idx) => (
                  <div key={idx} className="flex-none w-32 h-20 bg-gray-200 rounded-xl flex items-center justify-center">
                    <span className="text-xs text-gray-600 text-center px-2">{activity}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Social Proof */}
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Star size={16} className="text-yellow-500 fill-yellow-500" />
              <span className="text-sm font-semibold text-gray-900">4.7</span>
              <span className="text-xs text-gray-500">(230 reviews)</span>
            </div>
            <p className="text-xs text-gray-600 italic">
              "Perfect spot for morning work sessions with excellent coffee."
            </p>
          </div>
        </div>

        {/* Sticky Actions */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 flex gap-3">
          <button
            onClick={onSave}
            className={`flex-1 font-semibold py-3 rounded-full transition-all ${
              isSaved
                ? 'bg-red-500 text-white'
                : 'bg-yellow-200 hover:bg-yellow-300 text-black'
            }`}
          >
            <Heart size={18} className={`inline-block mr-2 ${isSaved ? 'fill-white' : ''}`} />
            {isSaved ? 'Saved' : 'Save'}
          </button>
          
          <button className="p-3 border-2 border-gray-200 rounded-full hover:border-gray-300 transition-colors">
            <Navigation size={18} className="text-gray-700" />
          </button>
          
          <button className="p-3 border-2 border-gray-200 rounded-full hover:border-gray-300 transition-colors">
            <MessageCircle size={18} className="text-gray-700" />
          </button>
        </div>
      </div>
    </div>
  )
}
