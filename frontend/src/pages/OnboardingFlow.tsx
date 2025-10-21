import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Globe, Map, Mountain, Coffee, Camera, Utensils, Waves, Tent, Wine, ArrowRight } from 'lucide-react'

type OnboardingStep = 'welcome' | 'passport' | 'experiences' | 'persona' | 'generating'

interface UserProfile {
  visitedRegions: string[]
  experiences: string[]
  persona: string | null
}

const REGIONS = [
  { id: 'asia', name: 'Asia', emoji: '🌏' },
  { id: 'europe', name: 'Europe', emoji: '🇪🇺' },
  { id: 'north-america', name: 'North America', emoji: '🗽' },
  { id: 'south-america', name: 'South America', emoji: '🌎' },
  { id: 'africa', name: 'Africa', emoji: '🦁' },
  { id: 'oceania', name: 'Oceania', emoji: '🏝️' }
]

const EXPERIENCES = [
  { id: 'surfing', label: 'Surfing', icon: Waves },
  { id: 'hiking', label: 'Hiking', icon: Mountain },
  { id: 'city-hopping', label: 'City Hopping', icon: Map },
  { id: 'diving', label: 'Diving', icon: Waves },
  { id: 'camping', label: 'Camping', icon: Tent },
  { id: 'food-wine', label: 'Food & Wine', icon: Wine }
]

const PERSONAS = [
  { id: 'seeker', emoji: '🧘', label: 'Seeker', description: 'Mindful and immersive' },
  { id: 'explorer', emoji: '🧳', label: 'Explorer', description: 'Adventurous and curious' },
  { id: 'indulger', emoji: '🍸', label: 'Indulger', description: 'Luxurious and refined' },
  { id: 'storyteller', emoji: '📸', label: 'Storyteller', description: 'Creative and social' }
]

export const OnboardingFlow: React.FC = () => {
  const navigate = useNavigate()
  const [step, setStep] = useState<OnboardingStep>('welcome')
  const [profile, setProfile] = useState<UserProfile>({
    visitedRegions: [],
    experiences: [],
    persona: null
  })
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)

  const toggleRegion = (regionId: string) => {
    setProfile(prev => ({
      ...prev,
      visitedRegions: prev.visitedRegions.includes(regionId)
        ? prev.visitedRegions.filter(r => r !== regionId)
        : [...prev.visitedRegions, regionId]
    }))
  }

  const toggleExperience = (expId: string) => {
    setProfile(prev => ({
      ...prev,
      experiences: prev.experiences.includes(expId)
        ? prev.experiences.filter(e => e !== expId)
        : [...prev.experiences, expId]
    }))
  }

  const selectPersona = (personaId: string) => {
    setProfile(prev => ({ ...prev, persona: personaId }))
  }

  const handleContinue = () => {
    if (step === 'welcome') setStep('passport')
    else if (step === 'passport') setStep('experiences')
    else if (step === 'experiences') setStep('persona')
    else if (step === 'persona') {
      setStep('generating')
      setTimeout(() => {
        // Save profile to localStorage
        localStorage.setItem('versoUserProfile', JSON.stringify(profile))
        navigate('/explore')
      }, 3000)
    }
  }

  const canContinue = () => {
    if (step === 'passport') return profile.visitedRegions.length > 0
    if (step === 'experiences') return profile.experiences.length > 0
    if (step === 'persona') return profile.persona !== null
    return true
  }

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Welcome Screen */}
      {step === 'welcome' && (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 animate-fade-in relative">
          {/* Animated Globe Background */}
          <div className="absolute inset-0 flex items-center justify-center opacity-20">
            <Globe size={300} className="text-yellow-200 animate-spin-slow" style={{ animationDuration: '60s' }} />
          </div>
          
          <div className="relative z-10 text-center max-w-md">
            <div className="mb-8">
              <div className="w-24 h-24 bg-yellow-200/10 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse-slow">
                <Globe size={48} className="text-yellow-200" />
              </div>
              <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-yellow-200 to-amber-400 bg-clip-text text-transparent">
                Let's shape your travel story
              </h1>
              <p className="text-gray-400 text-lg leading-relaxed">
                Before we explore, tell me a bit about how you travel
              </p>
            </div>

            <button
              onClick={handleContinue}
              className="group px-8 py-4 bg-yellow-200 hover:bg-yellow-300 text-black font-semibold rounded-full transition-all hover:scale-105 flex items-center gap-2 mx-auto"
            >
              <span>Begin</span>
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      )}

      {/* Passport Screen */}
      {step === 'passport' && (
        <div className="min-h-screen flex flex-col p-6 animate-fade-in">
          <div className="flex-1 flex flex-col justify-center max-w-lg mx-auto w-full">
            <div className="mb-12 text-center">
              <h1 className="text-3xl font-bold mb-3 bg-gradient-to-r from-yellow-200 to-amber-400 bg-clip-text text-transparent">
                Where have you been?
              </h1>
              <p className="text-gray-400 text-sm leading-relaxed italic">
                Each place leaves a mark. Pick a few that tell your story.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-12">
              {REGIONS.map((region) => (
                <button
                  key={region.id}
                  onClick={() => toggleRegion(region.id)}
                  className={`relative group p-6 rounded-2xl border-2 transition-all duration-500 ${
                    profile.visitedRegions.includes(region.id)
                      ? 'bg-yellow-200/10 border-yellow-200 scale-105'
                      : 'bg-gray-900/50 border-gray-800 hover:border-gray-700'
                  }`}
                >
                  <div className="text-4xl mb-3 transition-transform group-hover:scale-110">
                    {region.emoji}
                  </div>
                  <p className="text-white text-sm font-medium">{region.name}</p>
                  
                  {/* Stamp effect */}
                  {profile.visitedRegions.includes(region.id) && (
                    <div className="absolute top-2 right-2 animate-fade-in">
                      <div className="w-8 h-8 bg-yellow-200 rounded-full flex items-center justify-center">
                        <span className="text-black text-xs">✓</span>
                      </div>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleContinue}
            disabled={!canContinue()}
            className={`w-full py-4 font-semibold rounded-full transition-all ${
              canContinue()
                ? 'bg-yellow-200 hover:bg-yellow-300 text-black hover:scale-105'
                : 'bg-gray-800 text-gray-500 cursor-not-allowed'
            }`}
          >
            Continue
          </button>
        </div>
      )}

      {/* Experiences Screen */}
      {step === 'experiences' && (
        <div className="min-h-screen flex flex-col p-6 animate-fade-in">
          <div className="flex-1 flex flex-col justify-center max-w-lg mx-auto w-full">
            <div className="mb-12 text-center">
              <h1 className="text-3xl font-bold mb-3 bg-gradient-to-r from-yellow-200 to-amber-400 bg-clip-text text-transparent">
                What kind of adventures excite you?
              </h1>
              <p className="text-gray-400 text-sm leading-relaxed italic">
                Pick a few you've done or dream of doing
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-12">
              {EXPERIENCES.map((exp) => {
                const Icon = exp.icon
                return (
                  <button
                    key={exp.id}
                    onClick={() => toggleExperience(exp.id)}
                    className={`relative group p-6 rounded-2xl border-2 transition-all duration-500 ${
                      profile.experiences.includes(exp.id)
                        ? 'bg-yellow-200/10 border-yellow-200 scale-105'
                        : 'bg-gray-900/50 border-gray-800 hover:border-gray-700'
                    }`}
                  >
                    <Icon size={32} className={`mb-3 transition-colors ${
                      profile.experiences.includes(exp.id) ? 'text-yellow-200' : 'text-gray-400 group-hover:text-white'
                    }`} />
                    <p className="text-white text-sm font-medium">{exp.label}</p>
                    
                    {/* Ripple effect on selection */}
                    {profile.experiences.includes(exp.id) && (
                      <div className="absolute inset-0 rounded-2xl border-2 border-yellow-200 animate-ping" style={{ animationDuration: '1.5s' }} />
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          <button
            onClick={handleContinue}
            disabled={!canContinue()}
            className={`w-full py-4 font-semibold rounded-full transition-all ${
              canContinue()
                ? 'bg-yellow-200 hover:bg-yellow-300 text-black hover:scale-105'
                : 'bg-gray-800 text-gray-500 cursor-not-allowed'
            }`}
          >
            Continue
          </button>
        </div>
      )}

      {/* Persona Screen */}
      {step === 'persona' && (
        <div className="min-h-screen flex flex-col p-6 animate-fade-in">
          <div className="flex-1 flex flex-col justify-center max-w-lg mx-auto w-full">
            <div className="mb-12 text-center">
              <h1 className="text-3xl font-bold mb-3 bg-gradient-to-r from-yellow-200 to-amber-400 bg-clip-text text-transparent">
                What kind of traveler are you?
              </h1>
              <p className="text-gray-400 text-sm leading-relaxed italic">
                There's no wrong answer — this helps me personalize your adventures
              </p>
            </div>

            <div className="space-y-4 mb-12">
              {PERSONAS.map((persona) => (
                <button
                  key={persona.id}
                  onClick={() => selectPersona(persona.id)}
                  onMouseEnter={() => setHoveredCard(persona.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                  className={`relative w-full group p-6 rounded-2xl border-2 transition-all duration-500 ${
                    profile.persona === persona.id
                      ? 'bg-gradient-to-br from-yellow-900/20 to-amber-900/20 border-yellow-200 scale-105'
                      : 'bg-gray-900/50 border-gray-800 hover:border-gray-700 hover:bg-gray-900/70'
                  }`}
                  style={{
                    transform: hoveredCard === persona.id ? 'translateY(-4px)' : 'translateY(0)',
                    boxShadow: hoveredCard === persona.id ? '0 8px 30px rgba(253, 230, 138, 0.2)' : 'none'
                  }}
                >
                  <div className="flex items-center gap-4">
                    <div className="text-5xl">{persona.emoji}</div>
                    <div className="text-left flex-1">
                      <p className="text-white text-xl font-bold mb-1">{persona.label}</p>
                      <p className="text-gray-400 text-sm">{persona.description}</p>
                    </div>
                    {profile.persona === persona.id && (
                      <div className="w-6 h-6 bg-yellow-200 rounded-full flex items-center justify-center animate-fade-in">
                        <span className="text-black text-xs">✓</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Subtle gold glow */}
                  {profile.persona === persona.id && (
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-yellow-200/5 to-amber-200/5 pointer-events-none" />
                  )}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleContinue}
            disabled={!canContinue()}
            className={`w-full py-4 font-semibold rounded-full transition-all ${
              canContinue()
                ? 'bg-yellow-200 hover:bg-yellow-300 text-black hover:scale-105'
                : 'bg-gray-800 text-gray-500 cursor-not-allowed'
            }`}
          >
            Continue
          </button>
        </div>
      )}

      {/* Generating Screen */}
      {step === 'generating' && (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 animate-fade-in relative overflow-hidden">
          {/* Animated particles */}
          <div className="absolute inset-0">
            {profile.visitedRegions.map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-yellow-200 rounded-full animate-pulse"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${2 + Math.random() * 2}s`
                }}
              />
            ))}
          </div>

          <div className="relative z-10 text-center max-w-md">
            <div className="mb-8">
              <div className="relative w-32 h-32 mx-auto mb-6">
                <Globe size={128} className="text-yellow-200 animate-spin-slow" style={{ animationDuration: '3s' }} />
                <div className="absolute inset-0 flex items-center justify-center">
                  {profile.visitedRegions.map((region, i) => (
                    <div
                      key={region}
                      className="absolute w-2 h-2 bg-yellow-200 rounded-full"
                      style={{
                        animation: `orbit ${3 + i}s linear infinite`,
                        animationDelay: `${i * 0.5}s`
                      }}
                    />
                  ))}
                </div>
              </div>
              
              <h1 className="text-3xl font-bold mb-4 animate-pulse-slow">
                Got it. Your travel canvas is ready.
              </h1>
              <p className="text-gray-400 leading-relaxed">
                Weaving your journey preferences...
              </p>
            </div>
          </div>

          <style>{`
            @keyframes orbit {
              from { transform: rotate(0deg) translateX(60px) rotate(0deg); }
              to { transform: rotate(360deg) translateX(60px) rotate(-360deg); }
            }
          `}</style>
        </div>
      )}
    </div>
  )
}
