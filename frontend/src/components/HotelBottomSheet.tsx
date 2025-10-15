import React, { useState, useEffect } from 'react'
import { X, Star, Heart, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react'
import { fetchPexelsImages } from '../services/pexels'

interface Hotel {
  hotel_id: string
  name: string
  type: string
  image_keywords: string
  rating: number
  reviews: number
  price_per_night: { min: number; max: number }
  tagline: string
  features: string[]
}

interface HotelBottomSheetProps {
  hotels: Hotel[]
  neighborhoodName: string
  onClose: () => void
}

export const HotelBottomSheet: React.FC<HotelBottomSheetProps> = ({
  hotels,
  neighborhoodName,
  onClose
}) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [savedHotels, setSavedHotels] = useState<Set<string>>(new Set())
  const [hotelImages, setHotelImages] = useState<Record<string, string>>({})

  const currentHotel = hotels[currentIndex]

  useEffect(() => {
    const loadImages = async () => {
      const images: Record<string, string> = {}
      for (const hotel of hotels) {
        const photos = await fetchPexelsImages(hotel.image_keywords, 1)
        if (photos.length > 0) {
          images[hotel.hotel_id] = photos[0].src.large2x
        }
      }
      setHotelImages(images)
    }
    loadImages()
  }, [hotels])

  const handleSave = (hotelId: string) => {
    const newSaved = new Set(savedHotels)
    if (newSaved.has(hotelId)) {
      newSaved.delete(hotelId)
    } else {
      newSaved.add(hotelId)
    }
    setSavedHotels(newSaved)
  }

  const handleNext = () => {
    if (currentIndex < hotels.length - 1) {
      setCurrentIndex(prev => prev + 1)
    }
  }

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1)
    }
  }

  const handleSwipeRight = () => {
    handleSave(currentHotel.hotel_id)
    if (currentIndex < hotels.length - 1) {
      setTimeout(() => setCurrentIndex(prev => prev + 1), 300)
    }
  }

  return (
    <div 
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-t-3xl w-full max-w-2xl max-h-[85vh] overflow-hidden animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle bar */}
        <div className="sticky top-0 bg-white pt-3 pb-2 px-6 border-b border-gray-100 z-10">
          <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-4" />
          <div className="flex items-center justify-between">
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={20} className="text-gray-600" />
            </button>
            <h2 className="text-lg font-bold text-gray-900">
              Stay in {neighborhoodName}
            </h2>
            <div className="w-9" /> {/* Spacer */}
          </div>
        </div>

        {/* Hotel Carousel */}
        <div className="relative">
          {/* Navigation Arrows */}
          {currentIndex > 0 && (
            <button
              onClick={handlePrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-3 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-colors"
            >
              <ChevronLeft size={24} className="text-gray-700" />
            </button>
          )}
          {currentIndex < hotels.length - 1 && (
            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-3 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-colors"
            >
              <ChevronRight size={24} className="text-gray-700" />
            </button>
          )}

          {/* Hotel Card */}
          <div className="px-6 py-4 overflow-y-auto max-h-[calc(85vh-120px)]">
            <div 
              key={currentHotel.hotel_id}
              className="animate-fade-in"
            >
              {/* Hero Image */}
              <div className="relative h-80 bg-gradient-to-br from-gray-200 to-gray-300 rounded-2xl overflow-hidden mb-4">
                {hotelImages[currentHotel.hotel_id] ? (
                  <img 
                    src={hotelImages[currentHotel.hotel_id]} 
                    alt={currentHotel.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Star size={48} className="text-gray-400" />
                  </div>
                )}
                
                {/* Save button overlay */}
                <button
                  onClick={() => handleSave(currentHotel.hotel_id)}
                  className={`absolute top-4 right-4 p-3 rounded-full transition-all shadow-lg ${
                    savedHotels.has(currentHotel.hotel_id)
                      ? 'bg-red-500 scale-110'
                      : 'bg-white/90 backdrop-blur-sm hover:bg-white'
                  }`}
                >
                  <Heart 
                    size={20} 
                    className={savedHotels.has(currentHotel.hotel_id) ? 'text-white fill-white' : 'text-gray-700'} 
                  />
                </button>

                {/* Type badge */}
                <div className="absolute bottom-4 left-4">
                  <span className="px-3 py-1.5 bg-black/60 backdrop-blur-md text-white text-xs font-medium rounded-full">
                    {currentHotel.type}
                  </span>
                </div>
              </div>

              {/* Hotel Details */}
              <div className="space-y-4">
                {/* Name and Rating */}
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {currentHotel.name}
                  </h3>
                  <div className="flex items-center gap-2 mb-2">
                    <Star size={16} className="text-yellow-500 fill-yellow-500" />
                    <span className="text-gray-900 font-semibold">{currentHotel.rating.toFixed(1)}</span>
                    <span className="text-gray-500 text-sm">({currentHotel.reviews.toLocaleString()} reviews)</span>
                  </div>
                  <p className="text-gray-600 text-sm italic">
                    "{currentHotel.tagline}"
                  </p>
                </div>

                {/* Price */}
                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-4 border border-yellow-200">
                  <p className="text-gray-600 text-sm mb-1">Price per night</p>
                  <p className="text-3xl font-bold text-gray-900">
                    ${currentHotel.price_per_night.min}
                    <span className="text-lg text-gray-600"> - ${currentHotel.price_per_night.max}</span>
                  </p>
                </div>

                {/* Features */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">Features</h4>
                  <div className="flex flex-wrap gap-2">
                    {currentHotel.features.map((feature, idx) => (
                      <span 
                        key={idx}
                        className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-xs font-medium"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Progress Indicator */}
                <div className="flex items-center justify-center gap-2 py-2">
                  {hotels.map((_, idx) => (
                    <div
                      key={idx}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        idx === currentIndex ? 'w-8 bg-yellow-400' : 'w-1.5 bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sticky Actions */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 flex gap-3">
          <button
            onClick={() => handleSave(currentHotel.hotel_id)}
            className={`flex-1 font-semibold py-3 rounded-full transition-all ${
              savedHotels.has(currentHotel.hotel_id)
                ? 'bg-red-500 text-white'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
            }`}
          >
            <Heart size={18} className={`inline-block mr-2 ${savedHotels.has(currentHotel.hotel_id) ? 'fill-white' : ''}`} />
            {savedHotels.has(currentHotel.hotel_id) ? 'Saved' : 'Save to Vault'}
          </button>
          
          <button 
            className="flex-1 bg-yellow-200 hover:bg-yellow-300 text-black font-semibold py-3 rounded-full transition-all flex items-center justify-center gap-2"
            onClick={() => {
              // Handle booking
              window.open(`https://www.booking.com/search.html?ss=${currentHotel.name}`, '_blank')
            }}
          >
            Book on Partner Site
            <ExternalLink size={18} />
          </button>
        </div>

        {/* Swipe hint */}
        <div className="text-center py-2 text-xs text-gray-400">
          Swipe right to save · Tap to view details
        </div>
      </div>
    </div>
  )
}
