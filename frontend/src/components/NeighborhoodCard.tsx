import React, { useState, useEffect } from 'react'
import { MapPin, Clock, DollarSign, Plane, ChevronRight } from 'lucide-react'
import { fetchPexelsImages } from '../services/pexels'

interface Neighborhood {
  neighbourhood_id: string
  city: string
  country: string
  name: string
  tagline: string
  image_keywords: string
  vibe: string[]
  best_for: string[]
  connectivity: {
    to_airport: string
    to_city_center: string
    transport_score: number
  }
  average_price_band: string
  price_range: { min: number; max: number }
  recommended_stay_types: string[]
  top_activities: string[]
  top_cafes: string[]
  seasonality: string[]
  why_stay_here: string[]
}

interface NeighborhoodCardProps {
  neighborhood: Neighborhood
  onClick: () => void
}

export const NeighborhoodCard: React.FC<NeighborhoodCardProps> = ({
  neighborhood,
  onClick
}) => {
  const [heroImage, setHeroImage] = useState<string>('')

  useEffect(() => {
    const loadImage = async () => {
      const photos = await fetchPexelsImages(neighborhood.image_keywords, 1)
      if (photos.length > 0) {
        setHeroImage(photos[0].src.large2x)
      }
    }
    loadImage()
  }, [neighborhood.image_keywords])

  return (
    <div
      onClick={onClick}
      className="relative h-[500px] rounded-3xl overflow-hidden cursor-pointer transform transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl group"
    >
      {/* Hero Image */}
      <div className="absolute inset-0">
        {heroImage ? (
          <img 
            src={heroImage} 
            alt={neighborhood.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
            <MapPin size={64} className="text-gray-600" />
          </div>
        )}
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
      </div>

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-end p-6">
        {/* Quick facts row */}
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <div className="flex items-center gap-1 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20">
            <Plane size={12} className="text-yellow-200" />
            <span className="text-xs text-white font-medium">{neighborhood.connectivity.to_airport}</span>
          </div>
          <div className="flex items-center gap-1 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20">
            <DollarSign size={12} className="text-yellow-200" />
            <span className="text-xs text-white font-medium">
              ${neighborhood.price_range.min}-{neighborhood.price_range.max}
            </span>
          </div>
          {neighborhood.seasonality.length > 0 && neighborhood.seasonality[0] !== 'All year' && (
            <div className="flex items-center gap-1 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20">
              <Clock size={12} className="text-yellow-200" />
              <span className="text-xs text-white font-medium">
                Best: {neighborhood.seasonality.slice(0, 2).join(', ')}
              </span>
            </div>
          )}
        </div>

        {/* Title */}
        <h3 className="text-3xl font-bold text-white mb-2 leading-tight">
          {neighborhood.name}
        </h3>

        {/* Tagline */}
        <p className="text-white/90 text-base mb-4 leading-relaxed">
          {neighborhood.tagline}
        </p>

        {/* Tags */}
        <div className="flex items-center gap-2 mb-5 flex-wrap">
          {neighborhood.best_for.slice(0, 3).map((tag, idx) => (
            <span 
              key={idx}
              className="px-3 py-1 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-xs text-white font-medium"
            >
              #{tag.toLowerCase().replace(/ /g, '')}
            </span>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="flex gap-3">
          <button
            onClick={(e) => {
              e.stopPropagation()
              onClick()
            }}
            className="flex-1 bg-yellow-200 hover:bg-yellow-100 text-black font-semibold py-3.5 rounded-full transition-all shadow-lg flex items-center justify-center gap-2"
          >
            Book a stay here
            <ChevronRight size={18} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              // Handle explore cafes
            }}
            className="flex-1 bg-white/10 backdrop-blur-md hover:bg-white/20 border-2 border-white/30 text-white font-semibold py-3.5 rounded-full transition-all shadow-lg"
          >
            Explore cafés
          </button>
        </div>

        {/* Secondary scroll hint */}
        <div className="flex items-center justify-center gap-2 mt-4 opacity-60">
          <div className="w-1 h-1 bg-white rounded-full animate-pulse" />
          <div className="w-1 h-1 bg-white rounded-full animate-pulse delay-100" />
          <div className="w-1 h-1 bg-white rounded-full animate-pulse delay-200" />
        </div>
      </div>
    </div>
  )
}
