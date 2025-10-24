import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Globe, Heart, Check, ChevronRight, Instagram, MapPin, 
  X, Info, Sparkles, Share2, Camera, Music, UtensilsCrossed,
  Waves, Mountain, Map as MapIcon, Wine, TreePine, Plane
} from 'lucide-react'

type OnboardingStep = 
  | 'landing'
  | 'instagram'
  | 'import-options'
  | 'countries'
  | 'experiences'
  | 'passport-reveal'

interface UserProfile {
  instagramHandle: string | null
  visitedCountries: string[]
  experiences: string[]
  passportData: {
    countries: Array<{ name: string; saves: number; emoji: string }>
    createdAt: string
  } | null
}

const COUNTRIES = [
  { name: 'Japan', emoji: '🇯🇵', saves: 18 },
  { name: 'Italy', emoji: '🇮🇹', saves: 12 },
  { name: 'France', emoji: '🇫🇷', saves: 9 },
  { name: 'Thailand', emoji: '🇹🇭', saves: 15 },
  { name: 'USA', emoji: '🇺🇸', saves: 6 },
  { name: 'Spain', emoji: '🇪🇸', saves: 8 },
  { name: 'Greece', emoji: '🇬🇷', saves: 11 },
  { name: 'India', emoji: '🇮🇳', saves: 7 },
  { name: 'UK', emoji: '🇬🇧', saves: 5 },
  { name: 'Australia', emoji: '🇦🇺', saves: 10 },
  { name: 'Indonesia', emoji: '🇮🇩', saves: 14 },
  { name: 'Portugal', emoji: '🇵🇹', saves: 6 }
]

const EXPERIENCES = [
  { 
    id: 'surfing', 
    label: 'Surfing', 
    subtitle: 'Ocean rush & waves',
    icon: Waves,
    gradient: 'from-blue-500 to-cyan-400'
  },
  { 
    id: 'food-wine', 
    label: 'Food & Wine', 
    subtitle: 'Street food, chef tables, wine tastings',
    icon: Wine,
    gradient: 'from-red-500 to-orange-400'
  },
  { 
    id: 'city-hopping', 
    label: 'City Hopping', 
    subtitle: 'Explore urban neighborhoods',
    icon: MapIcon,
    gradient: 'from-purple-500 to-pink-400'
  },
  { 
    id: 'hiking', 
    label: 'Hiking', 
    subtitle: 'Trails & views',
    icon: Mountain,
    gradient: 'from-green-500 to-emerald-400'
  },
  { 
    id: 'wellness', 
    label: 'Wellness/Retreats', 
    subtitle: 'Yoga, spa and quiet stays',
    icon: Sparkles,
    gradient: 'from-pink-500 to-rose-400'
  },
  { 
    id: 'photography', 
    label: 'Photography', 
    subtitle: 'Picture-perfect moments & viewpoints',
    icon: Camera,
    gradient: 'from-amber-500 to-yellow-400'
  }
]

const IMPORT_PLATFORMS = [
  { name: 'Instagram', icon: Instagram, color: 'bg-gradient-to-br from-purple-600 to-pink-500' },
  { name: 'YouTube', icon: Camera, color: 'bg-red-600' },
  { name: 'WhatsApp', icon: Share2, color: 'bg-green-600' },
  { name: 'Pinterest', icon: Heart, color: 'bg-red-500' },
  { name: 'Google Blogs', icon: Globe, color: 'bg-blue-500' },
  { name: 'Reddit', icon: Share2, color: 'bg-orange-600' }
]

export const OnboardingFlowRedesign: React.FC = () => {
  const navigate = useNavigate()
  const [step, setStep] = useState<OnboardingStep>('landing')
  const [profile, setProfile] = useState<UserProfile>({
    instagramHandle: null,
    visitedCountries: [],
    experiences: [],
    passportData: null
  })
  
  const [igHandle, setIgHandle] = useState('')
  const [showIgInfo, setShowIgInfo] = useState(false)
  const [igConnected, setIgConnected] = useState(false)
  const [igSavesCount, setIgSavesCount] = useState(0)
  const [showSkipModal, setShowSkipModal] = useState(false)
  const [countrySearch, setCountrySearch] = useState('')
  const [showPassportFlip, setShowPassportFlip] = useState(false)

  // Trigger passport animation when reaching that step
  useEffect(() => {
    if (step === 'passport-reveal') {
      setShowPassportFlip(false)
      setTimeout(() => setShowPassportFlip(true), 500)
    }
  }, [step])

  // Screen A: Landing
  const renderLanding = () => (
    <div className="min-h-screen relative overflow-hidden flex flex-col items-center justify-center p-6" style={{ backgroundColor: '#0B0B0E' }}>
      {/* Globe Background */}
      <div className="absolute inset-0 flex items-center justify-center opacity-10">
        <Globe size={500} className="text-gray-400 animate-spin-slow" style={{ animationDuration: '120s' }} />
      </div>

      {/* Film grain overlay */}
      <div className="absolute inset-0 opacity-5 bg-noise"></div>

      <div className="relative z-10 text-center max-w-2xl animate-fade-in">
        <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight" style={{ color: '#FFD15C', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
          Let's shape your travel story
        </h1>
        <p className="text-lg md:text-xl text-gray-400 mb-12 leading-relaxed max-w-xl mx-auto">
          Send us the reels, links and screenshots you've saved — we'll organize them into one place and build your trip from what you already love.
        </p>
        
        <button
          onClick={() => setStep('instagram')}
          className="px-12 py-4 text-lg font-semibold rounded-full transition-all duration-300 hover:scale-105 shadow-2xl"
          style={{ 
            backgroundColor: '#FFD15C',
            color: '#0B0B0E',
            boxShadow: '0 8px 32px rgba(255, 209, 92, 0.3)'
          }}
        >
          Begin
        </button>
      </div>
    </div>
  )

  // Screen B: Instagram Connect
  const renderInstagram = () => (
    <div className="min-h-screen p-6 flex flex-col" style={{ backgroundColor: '#0B0B0E' }}>
      <div className="max-w-2xl mx-auto w-full flex-1 flex flex-col justify-center animate-fade-in">
        {/* Platform Icons Row */}
        <div className="flex items-center justify-center gap-4 mb-12">
          {IMPORT_PLATFORMS.map((platform) => (
            <div
              key={platform.name}
              className="w-10 h-10 rounded-full flex items-center justify-center opacity-40 hover:opacity-100 transition-opacity cursor-pointer"
              style={{ backgroundColor: '#18181B' }}
              title={`Send inspirations from ${platform.name}`}
            >
              <platform.icon size={20} className="text-gray-400" />
            </div>
          ))}
        </div>

        <h2 className="text-4xl font-bold text-white mb-4">Link your Instagram handle</h2>
        
        {/* Why IG Info Box */}
        <button
          onClick={() => setShowIgInfo(!showIgInfo)}
          className="flex items-center gap-2 text-sm mb-6 group"
          style={{ color: '#FFD15C' }}
        >
          <Info size={16} />
          <span className="group-hover:underline">Why link Instagram?</span>
        </button>

        {showIgInfo && (
          <div className="mb-8 p-6 rounded-2xl backdrop-blur-xl border animate-slide-up" style={{ backgroundColor: 'rgba(24, 24, 27, 0.6)', borderColor: 'rgba(255, 209, 92, 0.2)' }}>
            <p className="text-gray-300 leading-relaxed text-sm">
              Verso scans the Instagram content you choose to share (reels, saved posts, creator links) so we can automatically find, tag and organize the trips and places you've saved. You control what we access — we never post on your behalf. This makes your travel vault searchable and bookable.
            </p>
          </div>
        )}

        {/* Input */}
        <div className="mb-6">
          <label className="block text-sm text-gray-400 mb-3">Instagram handle (optional but recommended)</label>
          <div className="relative">
            <Instagram size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              value={igHandle}
              onChange={(e) => setIgHandle(e.target.value)}
              placeholder="@your_handle"
              className="w-full pl-12 pr-4 py-4 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 transition-all"
              style={{ 
                backgroundColor: 'rgba(24, 24, 27, 0.8)',
                borderColor: igConnected ? '#FFD15C' : 'rgba(255, 255, 255, 0.1)',
                border: '1px solid',
                ringColor: '#FFD15C'
              }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-2">
            We'll only read public posts or content you explicitly allow via Instagram. You can disconnect later in Settings.
          </p>
        </div>

        {/* Success Chip */}
        {igConnected && (
          <div className="mb-6 p-4 rounded-xl flex items-center gap-3 animate-slide-in" style={{ backgroundColor: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(34, 197, 94, 0.3)' }}>
            <Check size={20} className="text-green-400" />
            <span className="text-green-400 text-sm font-medium">Found {igSavesCount} saved reels</span>
          </div>
        )}

        {/* CTAs */}
        <div className="flex flex-col gap-3">
          <button
            onClick={() => {
              setIgConnected(true)
              setIgSavesCount(18)
              setProfile({ ...profile, instagramHandle: igHandle })
              setTimeout(() => setStep('import-options'), 1500)
            }}
            disabled={!igHandle}
            className="w-full py-4 rounded-xl font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:scale-[1.02]"
            style={{ backgroundColor: '#FFD15C', color: '#0B0B0E' }}
          >
            Connect IG
          </button>
          <button
            onClick={() => setShowSkipModal(true)}
            className="w-full py-4 text-gray-400 hover:text-white transition-colors"
          >
            Skip for now
          </button>
        </div>

        {/* Skip Modal */}
        {showSkipModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-6 animate-fade-in">
            <div className="max-w-md w-full p-8 rounded-3xl" style={{ backgroundColor: '#18181B' }}>
              <h3 className="text-2xl font-bold text-white mb-4">Skip Instagram?</h3>
              <p className="text-gray-400 mb-6 leading-relaxed">
                Skipping means we can't auto-organize your IG reels — you can always add them later.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowSkipModal(false)
                    setStep('import-options')
                  }}
                  className="flex-1 py-3 rounded-xl border border-gray-700 text-white hover:bg-gray-800 transition-colors"
                >
                  Skip anyway
                </button>
                <button
                  onClick={() => setShowSkipModal(false)}
                  className="flex-1 py-3 rounded-xl font-semibold"
                  style={{ backgroundColor: '#FFD15C', color: '#0B0B0E' }}
                >
                  Connect now
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )

  // Screen C: Import Options
  const renderImportOptions = () => (
    <div className="min-h-screen p-6 flex flex-col" style={{ backgroundColor: '#0B0B0E' }}>
      <div className="max-w-4xl mx-auto w-full flex-1 flex flex-col justify-center animate-fade-in">
        <h2 className="text-4xl font-bold text-white mb-3 text-center">Bring inspiration from anywhere</h2>
        <p className="text-gray-400 text-center mb-12">
          Tip: use your phone's share sheet to send content directly to Verso from any app.
        </p>

        {/* Scrollable Cards */}
        <div className="flex gap-4 overflow-x-auto pb-6 scrollbar-hide mb-12">
          {IMPORT_PLATFORMS.map((platform) => (
            <div
              key={platform.name}
              className="flex-shrink-0 w-64 p-6 rounded-2xl backdrop-blur-xl border cursor-pointer hover:scale-[1.02] transition-transform"
              style={{ backgroundColor: 'rgba(24, 24, 27, 0.6)', borderColor: 'rgba(255, 255, 255, 0.1)' }}
            >
              <div className={`w-12 h-12 rounded-full ${platform.color} flex items-center justify-center mb-4`}>
                <platform.icon size={24} className="text-white" />
              </div>
              <h3 className="text-white font-semibold mb-2">{platform.name}</h3>
              <p className="text-gray-400 text-sm mb-4">Send us reels, links or screenshots</p>
              <button className="text-sm font-medium" style={{ color: '#FFD15C' }}>
                How to send →
              </button>
            </div>
          ))}
        </div>

        <div className="text-center">
          <button
            onClick={() => setStep('countries')}
            className="px-8 py-4 rounded-xl font-semibold hover:scale-[1.02] transition-all"
            style={{ backgroundColor: '#FFD15C', color: '#0B0B0E' }}
          >
            Continue
          </button>
          <button
            onClick={() => setStep('countries')}
            className="block mx-auto mt-4 text-gray-400 hover:text-white text-sm"
          >
            I'll do it later
          </button>
        </div>
      </div>
    </div>
  )

  // Screen D: Countries
  const renderCountries = () => {
    const filteredCountries = COUNTRIES.filter(c => 
      c.name.toLowerCase().includes(countrySearch.toLowerCase())
    )
    const selectedCount = profile.visitedCountries.length

    return (
      <div className="min-h-screen p-6 flex flex-col" style={{ backgroundColor: '#0B0B0E' }}>
        <div className="max-w-2xl mx-auto w-full flex-1 flex flex-col justify-center animate-fade-in">
          <h2 className="text-4xl font-bold text-white mb-3">Where have you been?</h2>
          <p className="text-gray-400 mb-8 leading-relaxed">
            Pick a few countries you've visited — this helps Verso prioritize local tips and avoid repeating suggestions.
          </p>

          {/* Search Input */}
          <input
            type="text"
            value={countrySearch}
            onChange={(e) => setCountrySearch(e.target.value)}
            placeholder="Search countries — e.g., Japan, France, India"
            className="w-full px-4 py-4 mb-6 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 transition-all"
            style={{ 
              backgroundColor: 'rgba(24, 24, 27, 0.8)',
              borderColor: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid'
            }}
          />

          {/* Counter */}
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-400 text-sm">
              {selectedCount} / 12 selected
            </span>
          </div>

          {/* Country Chips */}
          <div className="flex flex-wrap gap-3 mb-8 max-h-96 overflow-y-auto">
            {filteredCountries.map((country) => {
              const isSelected = profile.visitedCountries.includes(country.name)
              return (
                <button
                  key={country.name}
                  onClick={() => {
                    if (isSelected) {
                      setProfile({
                        ...profile,
                        visitedCountries: profile.visitedCountries.filter(c => c !== country.name)
                      })
                    } else if (selectedCount < 12) {
                      setProfile({
                        ...profile,
                        visitedCountries: [...profile.visitedCountries, country.name]
                      })
                    }
                  }}
                  className={`px-4 py-3 rounded-xl border transition-all ${
                    isSelected ? 'scale-105' : 'hover:scale-105'
                  }`}
                  style={{
                    backgroundColor: isSelected ? 'rgba(255, 209, 92, 0.2)' : 'rgba(24, 24, 27, 0.6)',
                    borderColor: isSelected ? '#FFD15C' : 'rgba(255, 255, 255, 0.1)',
                    color: isSelected ? '#FFD15C' : '#fff'
                  }}
                >
                  <span className="mr-2">{country.emoji}</span>
                  {country.name}
                </button>
              )
            })}
          </div>

          <button
            onClick={() => setStep('experiences')}
            className="w-full py-4 rounded-xl font-semibold hover:scale-[1.02] transition-all"
            style={{ backgroundColor: '#FFD15C', color: '#0B0B0E' }}
          >
            Next
          </button>
        </div>
      </div>
    )
  }

  // Screen E: Experiences
  const renderExperiences = () => {
    const selectedExps = profile.experiences
    const topMatches = selectedExps.slice(0, 3).join(' · ')

    return (
      <div className="min-h-screen p-6 flex flex-col" style={{ backgroundColor: '#0B0B0E' }}>
        <div className="max-w-4xl mx-auto w-full flex-1 flex flex-col justify-center animate-fade-in">
          <h2 className="text-4xl font-bold text-white mb-3 text-center">What experiences do you love?</h2>
          <p className="text-gray-400 text-center mb-12 leading-relaxed max-w-2xl mx-auto">
            Tell Verso what lights you up — we'll tailor your feed and trip ideas like a personalized playlist.
          </p>

          {/* Experience Grid */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            {EXPERIENCES.map((exp) => {
              const isLiked = selectedExps.includes(exp.id)
              const Icon = exp.icon

              return (
                <button
                  key={exp.id}
                  onClick={() => {
                    if (isLiked) {
                      setProfile({
                        ...profile,
                        experiences: selectedExps.filter(e => e !== exp.id)
                      })
                    } else {
                      setProfile({
                        ...profile,
                        experiences: [...selectedExps, exp.id]
                      })
                      // Confetti animation trigger
                    }
                  }}
                  className={`p-6 rounded-2xl backdrop-blur-xl border transition-all relative overflow-hidden ${
                    isLiked ? 'scale-105' : 'hover:scale-105'
                  }`}
                  style={{
                    backgroundColor: isLiked ? 'rgba(255, 209, 92, 0.1)' : 'rgba(24, 24, 27, 0.6)',
                    borderColor: isLiked ? '#FFD15C' : 'rgba(255, 255, 255, 0.1)'
                  }}
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${exp.gradient} flex items-center justify-center mb-4`}>
                    <Icon size={24} className="text-white" />
                  </div>
                  <h3 className="text-white font-semibold mb-1 text-left">{exp.label}</h3>
                  <p className="text-gray-400 text-sm text-left">{exp.subtitle}</p>
                  
                  {isLiked && (
                    <Heart size={20} className="absolute top-4 right-4 fill-current" style={{ color: '#FFD15C' }} />
                  )}
                </button>
              )
            })}
          </div>

          {/* Taste Graph */}
          {selectedExps.length > 0 && (
            <div className="mb-8 p-4 rounded-xl backdrop-blur-xl border" style={{ backgroundColor: 'rgba(24, 24, 27, 0.6)', borderColor: 'rgba(255, 209, 92, 0.2)' }}>
              <p className="text-sm text-gray-400 mb-2">Your top matches:</p>
              <p className="text-white font-medium">{topMatches || 'Select experiences to see matches'}</p>
            </div>
          )}

          <div className="flex flex-col gap-3">
            <button
              onClick={() => {
                // Create passport data
                const passportCountries = profile.visitedCountries.slice(0, 5).map(name => {
                  const country = COUNTRIES.find(c => c.name === name)
                  return {
                    name,
                    emoji: country?.emoji || '🌍',
                    saves: country?.saves || 0
                  }
                })
                
                setProfile({
                  ...profile,
                  passportData: {
                    countries: passportCountries,
                    createdAt: new Date().toISOString()
                  }
                })
                
                setStep('passport-reveal')
              }}
              disabled={selectedExps.length === 0}
              className="w-full py-4 rounded-xl font-semibold hover:scale-[1.02] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ backgroundColor: '#FFD15C', color: '#0B0B0E' }}
            >
              Complete
            </button>
            <button className="text-sm" style={{ color: '#FFD15C' }}>
              Refine suggestions
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Screen G: Passport Reveal
  const renderPassportReveal = () => {
    React.useEffect(() => {
      setTimeout(() => setShowPassportFlip(true), 500)
    }, [])

    return (
      <div className="min-h-screen p-6 flex flex-col items-center justify-center" style={{ backgroundColor: '#0B0B0E' }}>
        <div className={`max-w-md w-full transition-all duration-700 ${showPassportFlip ? 'animate-flip' : 'opacity-0 scale-75'}`}>
          {/* Passport Card */}
          <div className="relative">
            <div className="aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl" style={{ backgroundColor: '#8B0000', border: '3px solid #FFD15C' }}>
              {/* Front Cover */}
              <div className="h-full flex flex-col items-center justify-center p-8 relative">
                <div className="absolute inset-0 opacity-10 bg-pattern"></div>
                <Globe size={80} className="text-yellow-100 mb-6" />
                <h1 className="text-3xl font-bold text-white text-center mb-2" style={{ fontFamily: 'serif' }}>
                  TRAVEL PASSPORT
                </h1>
                <p className="text-yellow-100 text-sm">A living record of your inspirations</p>
                
                <div className="mt-8 text-center">
                  <div className="w-20 h-20 bg-white/20 rounded-full mx-auto mb-3"></div>
                  <p className="text-white font-semibold">Traveler</p>
                </div>

                {/* Stamps Preview */}
                <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-2">
                  {profile.passportData?.countries.slice(0, 5).map((country, i) => (
                    <div key={i} className="w-10 h-10 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center text-xl border border-white/50">
                      {country.emoji}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Interior Pages (visible after flip) */}
            {showPassportFlip && (
              <div className="mt-8 p-6 rounded-2xl backdrop-blur-xl border animate-fade-in" style={{ backgroundColor: 'rgba(24, 24, 27, 0.8)', borderColor: 'rgba(255, 209, 92, 0.2)' }}>
                <h3 className="text-xl font-bold text-white mb-6">Your Travel Stamps</h3>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {profile.passportData?.countries.map((country, i) => (
                    <div key={i} className="p-4 rounded-xl border" style={{ backgroundColor: 'rgba(139, 0, 0, 0.1)', borderColor: 'rgba(255, 209, 92, 0.3)' }}>
                      <div className="text-4xl mb-2">{country.emoji}</div>
                      <p className="text-white font-semibold text-sm">{country.name}</p>
                      <p className="text-gray-400 text-xs">{country.saves} saved inspirations</p>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col gap-3">
                  <button
                    onClick={() => {
                      // Save to localStorage
                      localStorage.setItem('versoPassport', JSON.stringify(profile.passportData))
                      navigate('/')
                    }}
                    className="w-full py-4 rounded-xl font-semibold hover:scale-[1.02] transition-all"
                    style={{ backgroundColor: '#FFD15C', color: '#0B0B0E' }}
                  >
                    Open in profile
                  </button>
                  <button className="w-full py-4 rounded-xl border border-gray-700 text-white hover:bg-gray-800 transition-colors flex items-center justify-center gap-2">
                    <Share2 size={18} />
                    Share this passport
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  // Render current step
  const renderStep = () => {
    switch (step) {
      case 'landing':
        return renderLanding()
      case 'instagram':
        return renderInstagram()
      case 'import-options':
        return renderImportOptions()
      case 'countries':
        return renderCountries()
      case 'experiences':
        return renderExperiences()
      case 'passport-reveal':
        return renderPassportReveal()
      default:
        return renderLanding()
    }
  }

  return <div className="min-h-screen">{renderStep()}</div>
}

// Add custom animations to index.css
