import React, { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Heart, MapPin, Clock, DollarSign, X, Star, TrendingUp } from 'lucide-react'
import { fetchPexelsImages, type PexelsPhoto } from '../services/pexels'

interface Activity {
  id: string
  title: string
  location: string
  duration: string
  cost: string
  image: string
  description: string
  tags: string[]
  rating: number
  reviews: number
  bestTime: string
  crowdLevel: string
  bookable: boolean
}

// Location-specific activities database
const ACTIVITIES_BY_LOCATION: Record<string, Activity[]> = {
  // Japan - Tokyo
  'Tokyo': [
    {
      id: 'tokyo-1',
      title: 'Shibuya Crossing Food Tour',
      location: 'Shibuya',
      duration: '2 hrs',
      cost: '$$',
      image: '',
      description: 'Experience the electric energy of Tokyo\'s most famous intersection while sampling authentic street food',
      tags: ['Food', 'Culture', 'Walking'],
      rating: 4.8,
      reviews: 342,
      bestTime: '6-9 PM',
      crowdLevel: 'Very Busy',
      bookable: true
    },
    {
      id: 'tokyo-2',
      title: 'Senso-ji Temple Visit',
      location: 'Asakusa',
      duration: '1.5 hrs',
      cost: 'Free',
      image: '',
      description: 'Tokyo\'s oldest temple with stunning architecture and traditional shopping streets',
      tags: ['Culture', 'History', 'Photography'],
      rating: 4.9,
      reviews: 567,
      bestTime: '7-9 AM',
      crowdLevel: 'Moderate',
      bookable: false
    },
    {
      id: 'tokyo-3',
      title: 'TeamLab Borderless',
      location: 'Odaiba',
      duration: '3 hrs',
      cost: '$$$',
      image: '',
      description: 'Immersive digital art museum with interactive installations',
      tags: ['Art', 'Technology', 'Indoor'],
      rating: 4.7,
      reviews: 892,
      bestTime: '10 AM - 12 PM',
      crowdLevel: 'Busy',
      bookable: true
    },
  ],
  // Japan - Kyoto
  'Kyoto': [
    {
      id: 'kyoto-1',
      title: 'Fushimi Inari Shrine Hike',
      location: 'Fushimi',
      duration: '3 hrs',
      cost: 'Free',
      image: '',
      description: 'Walk through thousands of vermillion torii gates on the mountain trails',
      tags: ['Culture', 'Hiking', 'Photography'],
      rating: 4.9,
      reviews: 1203,
      bestTime: '6-8 AM',
      crowdLevel: 'Very Busy',
      bookable: false
    },
    {
      id: 'kyoto-2',
      title: 'Arashiyama Bamboo Grove',
      location: 'Arashiyama',
      duration: '2 hrs',
      cost: 'Free',
      image: '',
      description: 'Magical bamboo forest with ethereal light filtering through towering stalks',
      tags: ['Nature', 'Photography', 'Walking'],
      rating: 4.7,
      reviews: 892,
      bestTime: '7-9 AM',
      crowdLevel: 'Busy',
      bookable: false
    },
    {
      id: 'kyoto-3',
      title: 'Traditional Tea Ceremony',
      location: 'Gion',
      duration: '1.5 hrs',
      cost: '$$$',
      image: '',
      description: 'Authentic tea ceremony experience in a historic machiya townhouse',
      tags: ['Culture', 'Traditional', 'Experience'],
      rating: 4.8,
      reviews: 456,
      bestTime: '2-4 PM',
      crowdLevel: 'Moderate',
      bookable: true
    },
  ],
  // Bali - Ubud
  'Ubud': [
    {
      id: 'ubud-1',
      title: 'Tegalalang Rice Terrace Walk',
      location: 'Tegalalang',
      duration: '2 hrs',
      cost: '$',
      image: '',
      description: 'Stunning cascading rice paddies with iconic Bali scenery',
      tags: ['Nature', 'Photography', 'Walking'],
      rating: 4.6,
      reviews: 678,
      bestTime: '8-10 AM',
      crowdLevel: 'Busy',
      bookable: false
    },
    {
      id: 'ubud-2',
      title: 'Sacred Monkey Forest',
      location: 'Ubud Center',
      duration: '1.5 hrs',
      cost: '$',
      image: '',
      description: 'Ancient temple complex inhabited by hundreds of playful long-tailed macaques',
      tags: ['Nature', 'Wildlife', 'Photography'],
      rating: 4.5,
      reviews: 892,
      bestTime: '7-9 AM',
      crowdLevel: 'Very Busy',
      bookable: false
    },
    {
      id: 'ubud-3',
      title: 'Balinese Cooking Class',
      location: 'Ubud',
      duration: '4 hrs',
      cost: '$$',
      image: '',
      description: 'Learn to cook authentic Balinese dishes with a local chef',
      tags: ['Food', 'Culture', 'Experience'],
      rating: 4.9,
      reviews: 523,
      bestTime: '9 AM - 1 PM',
      crowdLevel: 'Moderate',
      bookable: true
    },
  ],
  // Bali - Seminyak
  'Seminyak': [
    {
      id: 'seminyak-1',
      title: 'Sunset Beach Club Hopping',
      location: 'Seminyak Beach',
      duration: '3 hrs',
      cost: '$$$',
      image: '',
      description: 'Visit the best beach clubs along Seminyak\'s stunning coastline',
      tags: ['Beach', 'Nightlife', 'Sunset'],
      rating: 4.7,
      reviews: 734,
      bestTime: '4-7 PM',
      crowdLevel: 'Busy',
      bookable: true
    },
    {
      id: 'seminyak-2',
      title: 'Surf Lesson at Double Six',
      location: 'Double Six Beach',
      duration: '2 hrs',
      cost: '$$',
      image: '',
      description: 'Learn to surf on Bali\'s beginner-friendly waves',
      tags: ['Sports', 'Beach', 'Adventure'],
      rating: 4.8,
      reviews: 456,
      bestTime: '7-9 AM',
      crowdLevel: 'Moderate',
      bookable: true
    },
    {
      id: 'seminyak-3',
      title: 'Boutique Shopping Tour',
      location: 'Seminyak Center',
      duration: '2 hrs',
      cost: '$$',
      image: '',
      description: 'Explore Seminyak\'s trendy boutiques and designer stores',
      tags: ['Shopping', 'Fashion', 'Culture'],
      rating: 4.4,
      reviews: 289,
      bestTime: '10 AM - 2 PM',
      crowdLevel: 'Moderate',
      bookable: false
    },
  ],
  // Default fallback
  'default': [
    {
      id: 'default-1',
      title: 'City Walking Tour',
      location: 'City Center',
      duration: '2 hrs',
      cost: '$$',
      image: '',
      description: 'Explore the highlights of this beautiful destination',
      tags: ['Walking', 'Culture', 'Photography'],
      rating: 4.5,
      reviews: 234,
      bestTime: '9-11 AM',
      crowdLevel: 'Moderate',
      bookable: true
    },
    {
      id: 'default-2',
      title: 'Local Food Experience',
      location: 'Various',
      duration: '3 hrs',
      cost: '$$',
      image: '',
      description: 'Taste authentic local cuisine at hidden gems',
      tags: ['Food', 'Culture', 'Experience'],
      rating: 4.7,
      reviews: 456,
      bestTime: '12-3 PM',
      crowdLevel: 'Busy',
      bookable: true
    },
    {
      id: 'default-3',
      title: 'Scenic Viewpoint Visit',
      location: 'Outskirts',
      duration: '1.5 hrs',
      cost: '$',
      image: '',
      description: 'Breathtaking views of the surrounding landscape',
      tags: ['Nature', 'Photography', 'Scenic'],
      rating: 4.6,
      reviews: 321,
      bestTime: '5-7 PM',
      crowdLevel: 'Moderate',
      bookable: false
    },
  ]
}

export const CityFeedView: React.FC = () => {
  const { vaultId, cityName, categoryName } = useParams<{ vaultId: string; cityName?: string; categoryName?: string }>()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<'activities' | 'cafes'>('activities')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null)
  const [showDetails, setShowDetails] = useState(false)
  const [liked, setLiked] = useState<Set<string>>(new Set())
  const [images, setImages] = useState<Record<string, string>>({})
  const containerRef = useRef<HTMLDivElement>(null)
  const startY = useRef(0)
  const startTime = useRef(0)
  const startMouseY = useRef(0)
  const [activeReviewTab, setActiveReviewTab] = useState<'tripadvisor' | 'reddit' | 'google'>('tripadvisor')

  // Get location name - either city or category
  const locationKey = cityName || categoryName || 'default'
  const displayName = decodeURIComponent(locationKey)
  
  // Get activities based on location
  const getActivitiesForLocation = () => {
    if (ACTIVITIES_BY_LOCATION[locationKey]) {
      return ACTIVITIES_BY_LOCATION[locationKey]
    }
    return ACTIVITIES_BY_LOCATION['default']
  }

  const [activities, setActivities] = useState<Activity[]>(getActivitiesForLocation())

  // Fetch images for activities
  useEffect(() => {
    const loadImages = async () => {
      const newImages: Record<string, string> = {}
      const currentActivities = getActivitiesForLocation()
      
      for (const activity of currentActivities) {
        const searchQuery = categoryName 
          ? `${activity.title} ${displayName}`
          : `${activity.title} ${displayName}`
        const photos = await fetchPexelsImages(searchQuery, 1)
        if (photos.length > 0) {
          newImages[activity.id] = photos[0].src.large
        }
      }
      setImages(newImages)
      
      // Update activities with images
      setActivities(currentActivities.map(act => ({
        ...act,
        image: newImages[act.id] || act.image
      })))
    }
    loadImages()
  }, [cityName, categoryName])

  const handleTouchStart = (e: React.TouchEvent) => {
    startY.current = e.touches[0].clientY
    startTime.current = Date.now()
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    const endY = e.changedTouches[0].clientY
    const diff = startY.current - endY
    const duration = Date.now() - startTime.current

    // Require at least 50px movement
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        // Swipe up - next activity
        if (currentIndex < activities.length - 1) {
          setCurrentIndex(prev => prev + 1)
        }
      } else if (diff < 0) {
        // Swipe down
        if (currentIndex === 0) {
          // At first card, close view
          navigate(-1)
        } else if (currentIndex > 0) {
          setCurrentIndex(prev => prev - 1)
        }
      }
    }
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    startMouseY.current = e.clientY
    startTime.current = Date.now()
  }

  const handleMouseUp = (e: React.MouseEvent) => {
    const endY = e.clientY
    const diff = startMouseY.current - endY
    
    // Require at least 50px movement
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        // Swipe up - next activity
        if (currentIndex < activities.length - 1) {
          setCurrentIndex(prev => prev + 1)
        }
      } else if (diff < 0) {
        // Swipe down
        if (currentIndex === 0) {
          navigate(-1)
        } else if (currentIndex > 0) {
          setCurrentIndex(prev => prev - 1)
        }
      }
    }
  }

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault()
        if (currentIndex > 0) {
          setCurrentIndex(prev => prev - 1)
        }
      } else if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        e.preventDefault()
        if (currentIndex < activities.length - 1) {
          setCurrentIndex(prev => prev + 1)
        }
      } else if (e.key === 'Escape') {
        navigate(-1)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentIndex, activities.length, navigate])

  const handleLike = (activityId: string) => {
    setLiked(prev => {
      const newSet = new Set(prev)
      if (newSet.has(activityId)) {
        newSet.delete(activityId)
      } else {
        newSet.add(activityId)
      }
      return newSet
    })
  }

  const handleActivityClick = (activity: Activity) => {
    setSelectedActivity(activity)
    setShowDetails(true)
  }

  const currentActivity = activities[currentIndex]

  return (
    <div className="fixed inset-0 bg-black z-40">
      {/* Background Map Layer (blurred) */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900 to-black opacity-25 blur-sm" />

      {/* Top Bar */}
      <div className="absolute top-0 left-0 right-0 z-20 p-4 bg-gradient-to-b from-black/60 to-transparent">
        <div className="flex items-center justify-between">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 rounded-full bg-black/40 backdrop-blur-md hover:bg-black/60 transition-all"
          >
            <ArrowLeft size={24} className="text-white" />
          </button>
          
          <div className="flex gap-6">
            <button
              onClick={() => setActiveTab('activities')}
              className={`text-sm font-semibold transition-all ${
                activeTab === 'activities' 
                  ? 'text-white border-b-2 border-yellow-200 pb-1' 
                  : 'text-gray-400'
              }`}
            >
              Activities
            </button>
            <button
              onClick={() => setActiveTab('cafes')}
              className={`text-sm font-semibold transition-all ${
                activeTab === 'cafes' 
                  ? 'text-white border-b-2 border-yellow-200 pb-1' 
                  : 'text-gray-400'
              }`}
            >
              Cafés
            </button>
          </div>

          <div className="w-10" /> {/* Spacer */}
        </div>
      </div>

      {/* Feed Cards Container */}
      <div 
        ref={containerRef}
        className="absolute inset-0 overflow-hidden select-none"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        style={{ touchAction: 'none', userSelect: 'none' }}
      >
        {activities.map((activity, index) => (
          <div
            key={activity.id}
            className="absolute inset-0 transition-all duration-700 ease-in-out"
            style={{
              transform: `translateY(${(index - currentIndex) * 100}%)`,
              opacity: index === currentIndex ? 1 : 0.3,
            }}
          >
            {/* Activity Image */}
            <div className="absolute inset-0">
              {activity.image ? (
                <img 
                  src={activity.image} 
                  alt={activity.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                  <MapPin size={64} className="text-gray-600" />
                </div>
              )}
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
            </div>

            {/* Card Content */}
            {index === currentIndex && (
              <div className="absolute bottom-0 left-0 right-0 p-6 pb-32 z-10 animate-fade-in">
                {/* Micro-tags row at top */}
                <div className="flex items-center gap-2 mb-3 flex-wrap">
                  <div className="flex items-center gap-1 bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20">
                    <DollarSign size={12} className="text-yellow-200" />
                    <span className="text-xs text-white font-medium">{activity.cost}</span>
                  </div>
                  <div className="flex items-center gap-1 bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20">
                    <Clock size={12} className="text-yellow-200" />
                    <span className="text-xs text-white font-medium">{activity.duration}</span>
                  </div>
                  <div className="flex items-center gap-1 bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20">
                    <MapPin size={12} className="text-yellow-200" />
                    <span className="text-xs text-white font-medium">{activity.location}</span>
                  </div>
                  {activity.crowdLevel && activity.crowdLevel !== 'Moderate' && (
                    <div className="flex items-center gap-1 bg-green-500/30 backdrop-blur-md px-2.5 py-1 rounded-full border border-green-400/30">
                      <TrendingUp size={12} className="text-green-200" />
                      <span className="text-xs text-green-100 font-medium">{activity.crowdLevel}</span>
                    </div>
                  )}
                </div>

                {/* Title - 2 lines max */}
                <h2 className="text-3xl font-bold text-white mb-2 leading-tight line-clamp-2">
                  {activity.title}
                </h2>

                {/* Sensory subcopy - 12-14 words max */}
                <p className="text-white/90 text-base mb-4 leading-relaxed line-clamp-1">
                  {activity.description}
                </p>

                {/* Rating row */}
                <div className="flex items-center gap-2 mb-5">
                  <Star size={16} className="text-yellow-200 fill-yellow-200" />
                  <span className="text-white font-semibold">{activity.rating.toFixed(1)}</span>
                  <span className="text-white/60 text-sm">({activity.reviews} reviews)</span>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={() => handleActivityClick(activity)}
                    className="flex-1 bg-yellow-200 hover:bg-yellow-100 text-black font-semibold py-4 rounded-full transition-all shadow-lg"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => handleLike(activity.id)}
                    className={`p-4 rounded-full border-2 transition-all shadow-lg ${
                      liked.has(activity.id)
                        ? 'bg-red-500 border-red-500'
                        : 'bg-black/40 backdrop-blur-sm border-white/20 hover:border-white/40'
                    }`}
                  >
                    <Heart 
                      size={24} 
                      className={liked.has(activity.id) ? 'text-white fill-white' : 'text-white'} 
                    />
                  </button>
                </div>

                {/* Swipe hint indicator */}
                <div className="flex items-center justify-center gap-2 mt-6 opacity-60">
                  <div className="w-1 h-1 bg-white rounded-full animate-pulse" />
                  <div className="w-1 h-1 bg-white rounded-full animate-pulse delay-100" />
                  <div className="w-1 h-1 bg-white rounded-full animate-pulse delay-200" />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Progress Indicator */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2 z-20 pointer-events-none">
        {activities.map((_, index) => (
          <div
            key={index}
            className={`h-1 rounded-full transition-all duration-300 ${
              index === currentIndex ? 'w-8 bg-yellow-200' : 'w-1 bg-gray-600'
            }`}
          />
        ))}
      </div>

      {/* Detail Bottom Sheet */}
      {showDetails && selectedActivity && (
        <div className="fixed inset-0 z-50 animate-slide-up">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowDetails(false)}
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gray-900 rounded-t-3xl max-h-[70vh] overflow-auto">
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-12 h-1.5 bg-gray-700 rounded-full" />
            </div>

            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-white mb-2">{selectedActivity.title}</h3>
                  <p className="text-gray-400 text-sm">{selectedActivity.description}</p>
                </div>
                <button 
                  onClick={() => setShowDetails(false)}
                  className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <X size={24} className="text-gray-400" />
                </button>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-800 rounded-xl p-4">
                  <p className="text-gray-400 text-xs mb-1">Best Time</p>
                  <p className="text-white font-semibold">{selectedActivity.bestTime}</p>
                </div>
                <div className="bg-gray-800 rounded-xl p-4">
                  <p className="text-gray-400 text-xs mb-1">Crowd Level</p>
                  <p className="text-white font-semibold">{selectedActivity.crowdLevel}</p>
                </div>
                <div className="bg-gray-800 rounded-xl p-4">
                  <p className="text-gray-400 text-xs mb-1">Duration</p>
                  <p className="text-white font-semibold">{selectedActivity.duration}</p>
                </div>
                <div className="bg-gray-800 rounded-xl p-4">
                  <p className="text-gray-400 text-xs mb-1">Cost Range</p>
                  <p className="text-white font-semibold">{selectedActivity.cost}</p>
                </div>
              </div>

              {/* Bookable */}
              {selectedActivity.bookable && (
                <button className="w-full bg-yellow-200 hover:bg-yellow-100 text-black font-semibold py-4 rounded-full mb-6 transition-all">
                  Book Now
                </button>
              )}

              {/* Reviews Section */}
              <div>
                <h4 className="text-lg font-bold text-white mb-4">Reviews</h4>
                
                {/* Review Tabs */}
                <div className="flex gap-2 mb-4 border-b border-gray-800">
                  <button
                    onClick={() => setActiveReviewTab('tripadvisor')}
                    className={`px-4 py-2 text-sm font-medium transition-colors ${
                      activeReviewTab === 'tripadvisor'
                        ? 'text-yellow-200 border-b-2 border-yellow-200'
                        : 'text-gray-400'
                    }`}
                  >
                    TripAdvisor
                  </button>
                  <button
                    onClick={() => setActiveReviewTab('reddit')}
                    className={`px-4 py-2 text-sm font-medium transition-colors ${
                      activeReviewTab === 'reddit'
                        ? 'text-yellow-200 border-b-2 border-yellow-200'
                        : 'text-gray-400'
                    }`}
                  >
                    Reddit
                  </button>
                  <button
                    onClick={() => setActiveReviewTab('google')}
                    className={`px-4 py-2 text-sm font-medium transition-colors ${
                      activeReviewTab === 'google'
                        ? 'text-yellow-200 border-b-2 border-yellow-200'
                        : 'text-gray-400'
                    }`}
                  >
                    Google
                  </button>
                </div>

                {/* Review Content */}
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-gray-800 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Star size={14} className="text-yellow-200 fill-yellow-200" />
                        <span className="text-white font-semibold text-sm">4.5</span>
                        <span className="text-gray-400 text-xs">· 2 days ago</span>
                      </div>
                      <p className="text-gray-300 text-sm">
                        Amazing experience! The guide was knowledgeable and the food was incredible.
                      </p>
                      <p className="text-gray-500 text-xs mt-2">via {activeReviewTab}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slide-up {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
        .animate-slide-up {
          animation: slide-up 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }
      `}</style>
    </div>
  )
}
