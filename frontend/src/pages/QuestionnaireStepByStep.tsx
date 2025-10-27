import React, { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight } from 'lucide-react'

type QuestionStep = 
  | 'destination' 
  | 'dates' 
  | 'travelers' 
  | 'duration' 
  | 'home'

interface FormData {
  destination: string
  startDate: string
  endDate: string
  travelers: string
  duration: string
  homeLocation: string
}

export const QuestionnaireStepByStep: React.FC = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const preSelectedDestination = searchParams.get('vault') || searchParams.get('country')

  const [currentStep, setCurrentStep] = useState<QuestionStep>(
    preSelectedDestination ? 'dates' : 'destination'
  )
  
  const [formData, setFormData] = useState<FormData>({
    destination: preSelectedDestination || '',
    startDate: '',
    endDate: '',
    travelers: '2',
    duration: '7',
    homeLocation: ''
  })

  const destinations = [
    { value: 'Japan Food Crawl', emoji: '🇯🇵' },
    { value: 'Bali Week', emoji: '🇮🇩' },
    { value: 'Coldplay Bangkok', emoji: '🇹🇭' },
    { value: 'Italy Vault', emoji: '🇮🇹' },
    { value: 'Croatia', emoji: '🇭🇷' },
    { value: 'Austria', emoji: '🇦🇹' },
    { value: 'Sri Lanka', emoji: '🇱🇰' },
    { value: 'Vietnam', emoji: '🇻🇳' },
  ]

  const handleNext = () => {
    const steps: QuestionStep[] = ['destination', 'dates', 'travelers', 'duration', 'home']
    const currentIndex = steps.indexOf(currentStep)
    
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1])
    } else {
      // Submit and navigate to itinerary
      const params = new URLSearchParams({
        country: formData.destination,
        startDate: formData.startDate,
        endDate: formData.endDate,
        travelers: formData.travelers,
        duration: formData.duration,
        homeLocation: formData.homeLocation || 'Not specified',
      })
      
      // Store trip data in localStorage for the itinerary page
      const tripPreferences = {
        destination: formData.destination,
        startDate: formData.startDate,
        endDate: formData.endDate,
        travelers: parseInt(formData.travelers) || 2,
        duration: parseInt(formData.duration) || 7,
        homeLocation: formData.homeLocation
      }
      console.log('💾 [Questionnaire] Storing trip preferences:', tripPreferences)
      localStorage.setItem('tripPreferences', JSON.stringify(tripPreferences))
      console.log('✅ [Questionnaire] Saved to localStorage')
      
      // Redirect to unified trip planning page
      navigate('/trip/1')
    }
  }

  const handleBack = () => {
    const steps: QuestionStep[] = ['destination', 'dates', 'travelers', 'duration', 'home']
    const currentIndex = steps.indexOf(currentStep)
    
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1])
    } else {
      navigate(-1)
    }
  }

  const canProceed = () => {
    switch (currentStep) {
      case 'destination':
        return formData.destination.trim() !== ''
      case 'dates':
        return formData.startDate !== '' && formData.endDate !== ''
      case 'travelers':
        return formData.travelers !== ''
      case 'duration':
        return formData.duration !== ''
      case 'home':
        return true // Optional
      default:
        return false
    }
  }

  const getStepNumber = () => {
    const steps: QuestionStep[] = ['destination', 'dates', 'travelers', 'duration', 'home']
    return steps.indexOf(currentStep) + 1
  }

  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-gray-900 z-20">
        <div 
          className="h-full bg-yellow-200 transition-all duration-500 ease-out"
          style={{ width: `${(getStepNumber() / 5) * 100}%` }}
        />
      </div>

      {/* Header */}
      <div className="flex items-center justify-between p-4 pt-6">
        <button 
          onClick={handleBack}
          className="p-2 hover:bg-gray-900 rounded-lg transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <span className="text-sm text-gray-400">
          {getStepNumber()} of 5
        </span>
      </div>

      {/* Question Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-32">
        {/* Destination */}
        {currentStep === 'destination' && (
          <div className="w-full max-w-md space-y-6 animate-fade-in">
            <h1 className="text-4xl font-bold mb-8 leading-tight">
              Where would you like to go?
            </h1>
            <div className="grid grid-cols-2 gap-3">
              {destinations.map((dest) => (
                <button
                  key={dest.value}
                  onClick={() => setFormData({ ...formData, destination: dest.value })}
                  className={`p-4 rounded-2xl border-2 transition-all text-left ${
                    formData.destination === dest.value
                      ? 'border-yellow-200 bg-yellow-200 bg-opacity-10 scale-105'
                      : 'border-gray-800 bg-gray-900 hover:border-gray-700'
                  }`}
                >
                  <div className="text-3xl mb-2">{dest.emoji}</div>
                  <div className="text-sm font-medium">{dest.value}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Dates */}
        {currentStep === 'dates' && (
          <div className="w-full max-w-md space-y-8 animate-fade-in">
            <h1 className="text-4xl font-bold leading-tight">
              When are you planning to travel?
            </h1>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-3">
                  Start Date
                </label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="w-full bg-gray-900 border-2 border-gray-800 rounded-2xl px-6 py-4 text-lg text-white focus:outline-none focus:border-yellow-200 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-3">
                  End Date
                </label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  className="w-full bg-gray-900 border-2 border-gray-800 rounded-2xl px-6 py-4 text-lg text-white focus:outline-none focus:border-yellow-200 transition-colors"
                />
              </div>
            </div>
          </div>
        )}

        {/* Travelers */}
        {currentStep === 'travelers' && (
          <div className="w-full max-w-md space-y-8 animate-fade-in">
            <h1 className="text-4xl font-bold leading-tight">
              How many travelers?
            </h1>
            <div className="grid grid-cols-3 gap-3">
              {['1', '2', '3', '4', '5', '6+'].map((count) => (
                <button
                  key={count}
                  onClick={() => setFormData({ ...formData, travelers: count })}
                  className={`py-6 rounded-2xl border-2 transition-all ${
                    formData.travelers === count
                      ? 'border-yellow-200 bg-yellow-200 bg-opacity-10 scale-105'
                      : 'border-gray-800 bg-gray-900 hover:border-gray-700'
                  }`}
                >
                  <div className="text-3xl font-bold">{count}</div>
                  <div className="text-xs text-gray-400 mt-1">
                    {count === '1' ? 'person' : 'people'}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Duration */}
        {currentStep === 'duration' && (
          <div className="w-full max-w-md space-y-8 animate-fade-in">
            <h1 className="text-4xl font-bold leading-tight">
              How long is your trip?
            </h1>
            <div className="grid grid-cols-3 gap-3">
              {['3', '5', '7', '10', '14', '21'].map((days) => (
                <button
                  key={days}
                  onClick={() => setFormData({ ...formData, duration: days })}
                  className={`py-6 rounded-2xl border-2 transition-all ${
                    formData.duration === days
                      ? 'border-yellow-200 bg-yellow-200 bg-opacity-10 scale-105'
                      : 'border-gray-800 bg-gray-900 hover:border-gray-700'
                  }`}
                >
                  <div className="text-3xl font-bold">{days}</div>
                  <div className="text-xs text-gray-400 mt-1">days</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Home Location */}
        {currentStep === 'home' && (
          <div className="w-full max-w-md space-y-8 animate-fade-in">
            <h1 className="text-4xl font-bold leading-tight">
              Where are you traveling from?
            </h1>
            <p className="text-gray-400 text-lg">
              This helps us plan your journey better
            </p>
            <input
              type="text"
              value={formData.homeLocation}
              onChange={(e) => setFormData({ ...formData, homeLocation: e.target.value })}
              placeholder="Enter your home city"
              className="w-full bg-gray-900 border-2 border-gray-800 rounded-2xl px-6 py-4 text-lg text-white placeholder-gray-600 focus:outline-none focus:border-yellow-200 transition-colors"
            />
            <p className="text-sm text-gray-500">Optional - you can skip this</p>
          </div>
        )}
      </div>

      {/* Next Button */}
      <div className="fixed bottom-20 left-0 right-0 px-6">
        <button
          onClick={handleNext}
          disabled={!canProceed()}
          className={`w-full max-w-md mx-auto flex items-center justify-center gap-3 py-5 rounded-full text-lg font-bold transition-all ${
            canProceed()
              ? 'bg-yellow-200 text-black hover:bg-yellow-100 hover:scale-[1.02] shadow-lg'
              : 'bg-gray-800 text-gray-600 cursor-not-allowed'
          }`}
        >
          <span>{currentStep === 'home' ? 'Create Itinerary' : 'Continue'}</span>
          <ArrowRight size={20} />
        </button>
      </div>

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.4s ease-out;
        }
      `}</style>
    </div>
  )
}
