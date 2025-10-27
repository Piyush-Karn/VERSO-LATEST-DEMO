import React, { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Calendar, Users, MapPin, Plane, Home, Sparkles, Loader2, UtensilsCrossed, Hotel, DollarSign } from 'lucide-react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { addDays, differenceInDays, format } from 'date-fns'

type FlowPhase = 'month' | 'dates' | 'travelers' | 'locations' | 'preferences' | 'crafting' | 'summary'

interface TripContext {
  destination: string
  selectedMonth: string | null
  startDate: Date | null
  endDate: Date | null
  flexibleDates: boolean
  travelers: 'solo' | 'couple' | 'friends' | 'family-kids' | 'family-elders' | null
  originCity: string
  returnCity: string
  flightPreference: 'direct' | 'any' | null
  foodPreferences: string[]
  stayType: 'budget' | 'premium' | 'luxury' | null
}

const MONTH_DATA = [
  { id: 'Jan', name: 'January', season: 'Winter', insight: 'Snow season in the mountains', gradient: 'from-gray-900 to-gray-800', icon: '❄️' },
  { id: 'Feb', name: 'February', season: 'Winter', insight: 'Plum blossom viewing begins', gradient: 'from-gray-900 to-gray-800', icon: '🌸' },
  { id: 'Mar', name: 'March', season: 'Spring', insight: 'Ideal for cherry blossoms', gradient: 'from-yellow-900/40 to-amber-900/40', icon: '🌸' },
  { id: 'Apr', name: 'April', season: 'Spring', insight: 'Peak cherry blossom season', gradient: 'from-yellow-900/40 to-amber-900/40', icon: '🌺' },
  { id: 'May', name: 'May', season: 'Spring', insight: 'Golden Week festivals', gradient: 'from-yellow-900/40 to-amber-900/40', icon: '🎋' },
  { id: 'Jun', name: 'June', season: 'Summer', insight: 'Rainy season, lush gardens', gradient: 'from-gray-900 to-gray-800', icon: '☔' },
  { id: 'Jul', name: 'July', season: 'Summer', insight: 'Summer festivals begin', gradient: 'from-yellow-900/30 to-orange-900/30', icon: '🎆' },
  { id: 'Aug', name: 'August', season: 'Summer', insight: 'Fireworks festival season', gradient: 'from-yellow-900/30 to-orange-900/30', icon: '🎇' },
  { id: 'Sep', name: 'September', season: 'Autumn', insight: 'Harvest moon viewing', gradient: 'from-amber-900/30 to-yellow-900/30', icon: '🌕' },
  { id: 'Oct', name: 'October', season: 'Autumn', insight: 'Fall foliage begins', gradient: 'from-amber-900/30 to-orange-900/30', icon: '🍁' },
  { id: 'Nov', name: 'November', season: 'Autumn', insight: 'Peak autumn colors', gradient: 'from-amber-900/30 to-orange-900/30', icon: '🍂' },
  { id: 'Dec', name: 'December', season: 'Winter', insight: 'Winter illuminations', gradient: 'from-gray-900 to-gray-800', icon: '✨' }
]

const TRAVELER_OPTIONS = [
  { id: 'solo', label: 'Solo', icon: '👤', description: 'Independent exploration' },
  { id: 'couple', label: 'Couple', icon: '👥', description: 'Romantic getaway' },
  { id: 'friends', label: 'Friends', icon: '👯', description: 'Adventure together' },
  { id: 'family-kids', label: 'Family', icon: '👨‍👩‍👧', description: 'With kids' },
  { id: 'family-elders', label: 'Family', icon: '👴👵', description: 'With elders' }
]

const FOOD_OPTIONS = ['Vegetarian', 'Vegan', 'Gluten-free', 'Halal', 'No preferences']

export const TripCompanionFlowPhase1: React.FC = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const destinationParam = searchParams.get('destination') || 'Japan'
  
  const [phase, setPhase] = useState<FlowPhase>('month')
  const [tripContext, setTripContext] = useState<TripContext>({
    destination: destinationParam,
    selectedMonth: null,
    startDate: null,
    endDate: null,
    flexibleDates: false,
    travelers: null,
    originCity: 'San Francisco',
    returnCity: 'San Francisco',
    flightPreference: null,
    foodPreferences: [],
    stayType: null
  })

  const Hero = () => (
    <div className="p-6 border-b border-gray-800">
      <div className="bg-gradient-to-br from-yellow-900/20 to-purple-900/20 rounded-2xl p-6 border border-yellow-500/20">
        <h1 className="text-3xl font-bold mb-2">{tripContext.destination}</h1>
        <p className="text-gray-400 text-sm">Let's shape your journey together</p>
      </div>
    </div>
  )

  const handleMonthSelect = (monthId: string) => {
    setTripContext({ ...tripContext, selectedMonth: monthId })
    setTimeout(() => setPhase('dates'), 400)
  }

  const handleDateConfirm = () => {
    if (tripContext.startDate && tripContext.endDate) {
      setPhase('travelers')
    }
  }

  const handleTravelerSelect = (travelerId: any) => {
    setTripContext({ ...tripContext, travelers: travelerId })
    setTimeout(() => setPhase('locations'), 400)
  }

  const handleLocationsConfirm = () => {
    if (tripContext.originCity && tripContext.returnCity) {
      setPhase('preferences')
    }
  }

  const handlePreferencesConfirm = () => {
    // Save trip preferences to localStorage before navigating
    const tripPreferences = {
      destination: tripContext.destination, // Use the destination from URL params (Bali, Bangkok, etc.)
      startDate: tripContext.startDate ? format(tripContext.startDate, 'yyyy-MM-dd') : '',
      endDate: tripContext.endDate ? format(tripContext.endDate, 'yyyy-MM-dd') : '',
      travelers: tripContext.travelers || 2,
      duration: getDuration(),
      homeLocation: tripContext.originCity || 'Not specified'
    }
    
    console.log('💾 [TripCompanionFlow] Storing trip preferences:', tripPreferences)
    localStorage.setItem('tripPreferences', JSON.stringify(tripPreferences))
    console.log('✅ [TripCompanionFlow] Saved to localStorage')
    
    setPhase('crafting')
    setTimeout(() => {
      navigate('/trip/1') // Navigate to unified trip page
    }, 4000)
  }

  const getDuration = () => {
    if (tripContext.startDate && tripContext.endDate) {
      return differenceInDays(tripContext.endDate, tripContext.startDate)
    }
    return 0
  }

  const renderPhaseContent = () => {
    switch (phase) {
      case 'month':
        return (
          <div className="min-h-screen bg-black text-white flex flex-col animate-fade-in">
            <Hero />
            <div className="flex-1 p-6">
              <div className="flex items-center gap-2 mb-6">
                <Calendar size={20} className="text-yellow-200" />
                <p className="text-yellow-200/80 text-lg italic">When are you planning to travel?</p>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {MONTH_DATA.map((month) => (
                  <button
                    key={month.id}
                    onClick={() => handleMonthSelect(month.id)}
                    className="group relative overflow-hidden rounded-2xl border-2 border-gray-800 hover:border-yellow-200/50 transition-all duration-500 hover:scale-105"
                  >
                    <div className={`bg-gradient-to-br ${month.gradient} p-4 h-32 flex flex-col justify-between`}>
                      <div className="text-3xl mb-2">{month.icon}</div>
                      <div>
                        <p className="text-white font-bold text-lg mb-1">{month.id}</p>
                        <p className="text-white/70 text-xs leading-tight">{month.insight}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )

      case 'dates':
        return (
          <div className="min-h-screen bg-black text-white flex flex-col animate-fade-in">
            <Hero />
            <div className="flex-1 p-6">
              <div className="flex items-center gap-2 mb-6">
                <Calendar size={20} className="text-yellow-200" />
                <p className="text-yellow-200/80 text-lg italic">Pick your exact dates</p>
              </div>
              
              <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800 mb-4">
                <DatePicker
                  selected={tripContext.startDate}
                  onChange={(dates) => {
                    const [start, end] = dates as [Date | null, Date | null]
                    setTripContext({ ...tripContext, startDate: start, endDate: end })
                  }}
                  startDate={tripContext.startDate}
                  endDate={tripContext.endDate}
                  selectsRange
                  inline
                  minDate={new Date()}
                  className="w-full"
                  calendarClassName="custom-calendar"
                />
              </div>

              <label className="flex items-center gap-3 bg-gray-900 rounded-xl p-4 border border-gray-800 mb-4 cursor-pointer">
                <input
                  type="checkbox"
                  checked={tripContext.flexibleDates}
                  onChange={(e) => setTripContext({ ...tripContext, flexibleDates: e.target.checked })}
                  className="w-5 h-5 rounded border-gray-700 text-yellow-200 focus:ring-yellow-200"
                />
                <span className="text-gray-300 text-sm">I'm flexible with my dates</span>
              </label>

              {tripContext.startDate && tripContext.endDate && (
                <p className="text-gray-400 text-sm italic mb-6">
                  {getDuration()} days trip selected
                </p>
              )}
            </div>

            {tripContext.startDate && tripContext.endDate && (
              <div className="p-6 border-t border-gray-800">
                <button onClick={handleDateConfirm} className="w-full bg-yellow-200 hover:bg-yellow-300 text-black font-semibold py-4 rounded-full transition-all">
                  Continue
                </button>
              </div>
            )}
          </div>
        )

      case 'travelers':
        return (
          <div className="min-h-screen bg-black text-white flex flex-col animate-fade-in">
            <Hero />
            <div className="flex-1 p-6 flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-6">
                <Users size={20} className="text-yellow-200" />
                <p className="text-yellow-200/80 text-lg italic">Who's traveling with you?</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {TRAVELER_OPTIONS.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleTravelerSelect(option.id)}
                    className="p-6 rounded-2xl border-2 border-gray-800 hover:border-yellow-200 hover:scale-105 transition-all bg-gray-900 hover:bg-gray-850"
                  >
                    <div className="text-4xl mb-3">{option.icon}</div>
                    <p className="text-white font-semibold mb-1">{option.label}</p>
                    <p className="text-gray-400 text-xs">{option.description}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )

      case 'locations':
        return (
          <div className="min-h-screen bg-black text-white flex flex-col animate-fade-in">
            <Hero />
            <div className="flex-1 p-6 flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-6">
                <MapPin size={20} className="text-yellow-200" />
                <p className="text-yellow-200/80 text-lg italic">Where are you starting from?</p>
              </div>
              
              <div className="space-y-4 mb-6">
                <div>
                  <label className="text-gray-400 text-sm mb-2 block">Origin</label>
                  <input
                    type="text"
                    value={tripContext.originCity}
                    onChange={(e) => setTripContext({ ...tripContext, originCity: e.target.value })}
                    className="w-full bg-gray-900 border border-gray-700 rounded-xl px-6 py-4 text-white placeholder-gray-500 focus:border-yellow-200 focus:outline-none transition-colors"
                    placeholder="Your home city"
                  />
                </div>

                <div>
                  <label className="text-gray-400 text-sm mb-2 block">Return destination</label>
                  <input
                    type="text"
                    value={tripContext.returnCity}
                    onChange={(e) => setTripContext({ ...tripContext, returnCity: e.target.value })}
                    className="w-full bg-gray-900 border border-gray-700 rounded-xl px-6 py-4 text-white placeholder-gray-500 focus:border-yellow-200 focus:outline-none transition-colors"
                    placeholder="Where you'll end your trip"
                  />
                </div>
              </div>

              <p className="text-gray-500 text-xs italic">
                I'll connect your journey seamlessly from {tripContext.originCity} to {tripContext.destination} and back
              </p>
            </div>

            <div className="p-6 border-t border-gray-800">
              <button onClick={handleLocationsConfirm} className="w-full bg-yellow-200 hover:bg-yellow-300 text-black font-semibold py-4 rounded-full transition-all">
                Continue
              </button>
            </div>
          </div>
        )

      case 'preferences':
        return (
          <div className="min-h-screen bg-black text-white flex flex-col animate-fade-in">
            <Hero />
            <div className="flex-1 p-6">
              <div className="flex items-center gap-2 mb-6">
                <Sparkles size={20} className="text-yellow-200" />
                <p className="text-yellow-200/80 text-lg italic">A few small preferences</p>
              </div>

              <div className="space-y-6">
                {/* Flight Preference */}
                <div>
                  <label className="text-white font-semibold mb-3 block flex items-center gap-2">
                    <Plane size={18} />
                    Flight preference
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { id: 'direct', label: 'Direct flights preferred' },
                      { id: 'any', label: 'Any flight works' }
                    ].map((option) => (
                      <button
                        key={option.id}
                        onClick={() => setTripContext({ ...tripContext, flightPreference: option.id as any })}
                        className={`p-4 rounded-xl border-2 transition-all ${
                          tripContext.flightPreference === option.id
                            ? 'border-yellow-200 bg-yellow-200/10'
                            : 'border-gray-800 bg-gray-900 hover:border-gray-700'
                        }`}
                      >
                        <span className="text-white text-sm">{option.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Food Preferences */}
                <div>
                  <label className="text-white font-semibold mb-3 block flex items-center gap-2">
                    <UtensilsCrossed size={18} />
                    Food preferences
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {FOOD_OPTIONS.map((food) => (
                      <button
                        key={food}
                        onClick={() => {
                          const isSelected = tripContext.foodPreferences.includes(food)
                          setTripContext({
                            ...tripContext,
                            foodPreferences: isSelected
                              ? tripContext.foodPreferences.filter(f => f !== food)
                              : [...tripContext.foodPreferences, food]
                          })
                        }}
                        className={`px-4 py-2 rounded-full border transition-all text-sm ${
                          tripContext.foodPreferences.includes(food)
                            ? 'border-yellow-200 bg-yellow-200/10 text-yellow-200'
                            : 'border-gray-700 bg-gray-900 text-gray-400 hover:border-gray-600'
                        }`}
                      >
                        {food}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Stay Type */}
                <div>
                  <label className="text-white font-semibold mb-3 block flex items-center gap-2">
                    <Hotel size={18} />
                    Stay preference
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: 'budget', label: 'Budget', icon: '💰', desc: 'Cozy & affordable' },
                      { id: 'premium', label: 'Premium', icon: '✨', desc: 'Modern comfort' },
                      { id: 'luxury', label: 'Luxury', icon: '👑', desc: 'High-end experience' }
                    ].map((option) => (
                      <button
                        key={option.id}
                        onClick={() => setTripContext({ ...tripContext, stayType: option.id as any })}
                        className={`p-4 rounded-xl border-2 transition-all ${
                          tripContext.stayType === option.id
                            ? 'border-yellow-200 bg-yellow-200/10 scale-105'
                            : 'border-gray-800 bg-gray-900 hover:border-gray-700'
                        }`}
                      >
                        <div className="text-2xl mb-2">{option.icon}</div>
                        <p className="text-white font-semibold text-sm mb-1">{option.label}</p>
                        <p className="text-gray-400 text-xs">{option.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-800">
              <button
                onClick={handlePreferencesConfirm}
                className="w-full bg-yellow-200 hover:bg-yellow-300 text-black font-semibold py-4 rounded-full transition-all"
              >
                Craft My Journey
              </button>
            </div>
          </div>
        )

      case 'crafting':
        return (
          <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 animate-fade-in relative overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-900/10 via-purple-900/10 to-blue-900/10 animate-pulse-slow" />
            
            {/* Route Animation */}
            <div className="absolute top-1/4 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-yellow-200/30 to-transparent animate-pulse" />
            
            <div className="text-center max-w-md relative z-10">
              <div className="relative mb-8">
                <div className="w-32 h-32 bg-yellow-200/20 rounded-full flex items-center justify-center mx-auto animate-pulse-slow">
                  <Sparkles size={64} className="text-yellow-200" style={{ animation: 'spin 3s linear infinite' }} />
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Loader2 size={48} className="text-yellow-200 animate-spin" />
                </div>
                
                {/* Orbiting elements */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 animate-spin" style={{ animationDuration: '8s' }}>
                  <Plane size={24} className="text-yellow-200/50" style={{ transform: 'translateX(-80px)' }} />
                </div>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 animate-spin" style={{ animationDuration: '10s' }}>
                  <Hotel size={24} className="text-purple-300/50" style={{ transform: 'translateX(80px)' }} />
                </div>
              </div>
              
              <h1 className="text-3xl font-bold mb-4">Crafting your journey</h1>
              <p className="text-gray-400 leading-relaxed mb-6">
                Finding your best routes · experiences · stays · connections
              </p>
              
              <div className="space-y-3 text-sm text-gray-500">
                <p className="animate-fade-in" style={{ animationDelay: '0.5s' }}>✓ Analyzing {getDuration()} days in {tripContext.destination}</p>
                <p className="animate-fade-in" style={{ animationDelay: '1s' }}>✓ Finding optimal routes from {tripContext.originCity}</p>
                <p className="animate-fade-in" style={{ animationDelay: '1.5s' }}>✓ Selecting {tripContext.stayType} accommodations</p>
                <p className="animate-fade-in" style={{ animationDelay: '2s' }}>✓ Weaving experiences together</p>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-black">
      <style>{`
        .react-datepicker {
          background-color: #111827 !important;
          border: 1px solid #374151 !important;
          border-radius: 1rem !important;
          font-family: inherit !important;
        }
        .react-datepicker__header {
          background-color: #1f2937 !important;
          border-bottom: 1px solid #374151 !important;
          border-radius: 1rem 1rem 0 0 !important;
        }
        .react-datepicker__current-month {
          color: #fef08a !important;
          font-weight: 600 !important;
        }
        .react-datepicker__day-name {
          color: #9ca3af !important;
        }
        .react-datepicker__day {
          color: #e5e7eb !important;
        }
        .react-datepicker__day:hover {
          background-color: #374151 !important;
          border-radius: 0.5rem !important;
        }
        .react-datepicker__day--selected,
        .react-datepicker__day--in-range {
          background-color: #fef08a !important;
          color: #000 !important;
          font-weight: 600 !important;
          border-radius: 0.5rem !important;
        }
        .react-datepicker__day--disabled {
          color: #4b5563 !important;
        }
        .react-datepicker__navigation-icon::before {
          border-color: #fef08a !important;
        }
      `}</style>
      {renderPhaseContent()}
    </div>
  )
}
