import React, { useState, useEffect } from 'react'
import { MapPin, Users, Calendar, Sun, Cloud, CloudRain, X, TrendingUp } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { ParallaxHeader } from '../../design-system/components/ParallaxHeader'
import { PrimaryCTA } from '../../design-system/components/PrimaryCTA'
import { BottomSheet } from '../../design-system/components/BottomSheet'
import { DESIGN_TOKENS } from '../../design-system/tokens'
import { fetchPexelsImages } from '../../services/pexels'

// Weather data types
type WeatherType = 'sunny' | 'cloudy' | 'rain' | 'mixed'

interface WeatherDay {
  day: number
  type: WeatherType
  temp?: string
}

interface CityWeather {
  last10Days: WeatherDay[]
  bestMonths: string
  next10Days: Array<{ date: string; temp: string; type: WeatherType; icon: string }>
  next30Trend: string
}

const weatherColors = {
  sunny: '#FFD15C',
  cloudy: '#9CA3AF',
  rain: '#60A5FA',
  mixed: 'linear-gradient(90deg, #FFD15C 50%, #60A5FA 50%)'
}

export const TripsVaultPremium: React.FC = () => {
  const navigate = useNavigate()
  const [tagSheetOpen, setTagSheetOpen] = useState(false)
  const [weatherSheetOpen, setWeatherSheetOpen] = useState(false)
  const [selectedCityWeather, setSelectedCityWeather] = useState<CityWeather | null>(null)
  const [heroImage, setHeroImage] = useState('')
  const [cityImages, setCityImages] = useState<string[]>([])
  const [experienceImages, setExperienceImages] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadImages = async () => {
      const hero = await fetchPexelsImages('Southeast Asia travel landscape sunset', 1)
      if (hero.length > 0) setHeroImage(hero[0].src.large2x)

      const cities = await fetchPexelsImages('Asian cities Bangkok Chiang Mai skyline', 4)
      setCityImages(cities.map(p => p.src.large))

      const experiences = await fetchPexelsImages('temple food market asia', 5)
      setExperienceImages(experiences.map(p => p.src.large))

      setLoading(false)
    }
    loadImages()
  }, [])

  const cities = [
    {
      name: 'Bangkok',
      inspirations: 12,
      weather: {
        last10Days: [
          { day: 1, type: 'sunny' as WeatherType },
          { day: 2, type: 'sunny' as WeatherType },
          { day: 3, type: 'cloudy' as WeatherType },
          { day: 4, type: 'rain' as WeatherType },
          { day: 5, type: 'sunny' as WeatherType },
          { day: 6, type: 'sunny' as WeatherType },
          { day: 7, type: 'mixed' as WeatherType },
          { day: 8, type: 'cloudy' as WeatherType },
          { day: 9, type: 'sunny' as WeatherType },
          { day: 10, type: 'sunny' as WeatherType }
        ],
        bestMonths: 'Nov–Feb',
        next10Days: [
          { date: 'Today', temp: '28–34°C', type: 'sunny' as WeatherType, icon: '☀️' },
          { date: 'Tomorrow', temp: '27–33°C', type: 'sunny' as WeatherType, icon: '☀️' },
          { date: 'Thu', temp: '26–32°C', type: 'cloudy' as WeatherType, icon: '☁️' },
          { date: 'Fri', temp: '25–31°C', type: 'rain' as WeatherType, icon: '🌧️' },
          { date: 'Sat', temp: '27–33°C', type: 'sunny' as WeatherType, icon: '☀️' }
        ],
        next30Trend: 'Generally warm with occasional rain. Best season approaching in November.'
      }
    },
    {
      name: 'Chiang Mai',
      inspirations: 8,
      weather: {
        last10Days: [
          { day: 1, type: 'sunny' as WeatherType },
          { day: 2, type: 'cloudy' as WeatherType },
          { day: 3, type: 'cloudy' as WeatherType },
          { day: 4, type: 'sunny' as WeatherType },
          { day: 5, type: 'sunny' as WeatherType },
          { day: 6, type: 'rain' as WeatherType },
          { day: 7, type: 'sunny' as WeatherType },
          { day: 8, type: 'sunny' as WeatherType },
          { day: 9, type: 'cloudy' as WeatherType },
          { day: 10, type: 'sunny' as WeatherType }
        ],
        bestMonths: 'Nov–Feb',
        next10Days: [
          { date: 'Today', temp: '22–30°C', type: 'sunny' as WeatherType, icon: '☀️' },
          { date: 'Tomorrow', temp: '21–29°C', type: 'cloudy' as WeatherType, icon: '☁️' }
        ],
        next30Trend: 'Cooler mountain climate. Dry season begins mid-November.'
      }
    },
    {
      name: 'Hanoi',
      inspirations: 7,
      weather: {
        last10Days: Array(10).fill(null).map((_, i) => ({ day: i + 1, type: (i % 3 === 0 ? 'sunny' : i % 3 === 1 ? 'cloudy' : 'rain') as WeatherType })),
        bestMonths: 'Oct–Apr',
        next10Days: [],
        next30Trend: 'Transitioning to cooler, drier weather.'
      }
    },
    {
      name: 'Siem Reap',
      inspirations: 5,
      weather: {
        last10Days: Array(10).fill(null).map((_, i) => ({ day: i + 1, type: (i < 5 ? 'sunny' : 'cloudy') as WeatherType })),
        bestMonths: 'Nov–Mar',
        next10Days: [],
        next30Trend: 'Dry season starting soon.'
      }
    }
  ]

  const marqueeExperiences = [
    { title: 'Angkor Wat Sunrise', category: 'Heritage' },
    { title: 'Floating Markets', category: 'Cultural' },
    { title: 'Night Food Crawl', category: 'Food' },
    { title: 'Thai Cooking Class', category: 'Experience' },
    { title: 'Temple Hopping', category: 'Heritage' }
  ]

  const thingsToDo = [
    { title: 'Ramen Spots', count: 6, seasonal: 'Year-round' },
    { title: 'Temple Tours', count: 8, seasonal: 'Best: Nov–Feb' },
    { title: 'Street Food', count: 12, seasonal: 'Year-round' }
  ]

  const handleWeatherTap = (cityWeather: CityWeather) => {
    setSelectedCityWeather(cityWeather)
    setWeatherSheetOpen(true)
  }

  const handlePlanTrip = () => {
    // Navigate to questionnaire
    navigate('/onboarding')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: DESIGN_TOKENS.colors.background }}>
        <div style={{ color: DESIGN_TOKENS.colors.textMuted }}>Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ background: DESIGN_TOKENS.colors.background, paddingBottom: '100px' }}>
      {/* Parallax Header */}
      <ParallaxHeader
        title="Southeast Asia Adventure"
        subtitle="32 saved · 3 people"
        heroImage={heroImage}
        vaultType="trips"
        countryEmoji="🌏"
        onTagEdit={() => setTagSheetOpen(true)}
        tagLabel="Trips"
      />

      <div style={{ padding: `${DESIGN_TOKENS.grid.verticalRhythm.major}px ${DESIGN_TOKENS.grid.horizontalMargin}px` }}>
        {/* Marquee Experiences Bar */}
        <section style={{ marginBottom: `${DESIGN_TOKENS.grid.verticalRhythm.major}px` }}>
          <h2 style={{ fontSize: DESIGN_TOKENS.typography.sectionHeader.size, fontWeight: DESIGN_TOKENS.typography.sectionHeader.weight, color: DESIGN_TOKENS.colors.textPrimary, marginBottom: `${DESIGN_TOKENS.grid.verticalRhythm.minor}px` }}>
            Marquee Experiences
          </h2>
          <div className="flex gap-3 overflow-x-auto pb-2 hide-scrollbar">
            {marqueeExperiences.map((exp, idx) => (
              <div key={idx} className="flex-shrink-0 cursor-pointer transition-transform active:scale-98" style={{ width: '170px' }}>
                <div style={{ background: DESIGN_TOKENS.colors.cardBackground, borderRadius: `${DESIGN_TOKENS.radius.card}px`, overflow: 'hidden', boxShadow: DESIGN_TOKENS.shadow.default }}>
                  <div style={{ height: '120px', overflow: 'hidden' }}>
                    <img src={experienceImages[idx]} alt={exp.title} className="w-full h-full object-cover" />
                  </div>
                  <div style={{ padding: '12px' }}>
                    <h3 style={{ fontSize: '14px', fontWeight: '600', color: DESIGN_TOKENS.colors.textPrimary, marginBottom: '4px' }}>{exp.title}</h3>
                    <p style={{ fontSize: '12px', color: DESIGN_TOKENS.colors.textMuted, opacity: '0.7' }}>{exp.category}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Cities Section - PREMIUM CARDS WITH WEATHER */}
        <section style={{ marginBottom: `${DESIGN_TOKENS.grid.verticalRhythm.major}px` }}>
          <h2 style={{ fontSize: DESIGN_TOKENS.typography.sectionHeader.size, fontWeight: DESIGN_TOKENS.typography.sectionHeader.weight, color: DESIGN_TOKENS.colors.textPrimary, marginBottom: `${DESIGN_TOKENS.grid.verticalRhythm.minor}px` }}>
            Cities
          </h2>
          <div className="space-y-4">
            {cities.map((city, idx) => (
              <div key={city.name} className="cursor-pointer transition-transform active:scale-98" style={{ background: DESIGN_TOKENS.colors.cardBackground, borderRadius: `${DESIGN_TOKENS.radius.card}px`, overflow: 'hidden', boxShadow: DESIGN_TOKENS.shadow.default }}>
                {/* Large City Image - 70% of card */}
                <div className="relative" style={{ height: '240px', overflow: 'hidden' }}>
                  <img src={cityImages[idx]} alt={city.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(15, 17, 18, 0.9) 0%, transparent 60%)' }} />
                  
                  {/* Best to Visit Pill */}
                  <div className="absolute top-3 right-3 px-3 py-1.5" style={{ background: 'rgba(255, 209, 92, 0.15)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255, 209, 92, 0.3)', borderRadius: '20px', fontSize: '12px', fontWeight: '500', color: DESIGN_TOKENS.colors.accentGold }}>
                    Best: {city.weather.bestMonths}
                  </div>

                  {/* City Title Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <h3 style={{ fontSize: '22px', fontWeight: '700', color: DESIGN_TOKENS.colors.textPrimary, marginBottom: '4px' }}>
                      {city.name}
                    </h3>
                    <p style={{ fontSize: '14px', color: DESIGN_TOKENS.colors.textMuted, opacity: '0.8', marginBottom: '12px' }}>
                      Curated from {city.inspirations} saved inspirations
                    </p>

                    {/* Weather Strip */}
                    <div onClick={(e) => { e.stopPropagation(); handleWeatherTap(city.weather); }} className="cursor-pointer">
                      <div className="flex items-center gap-2 mb-2">
                        <span style={{ fontSize: '11px', color: DESIGN_TOKENS.colors.textMuted, opacity: '0.7' }}>Last 10 days</span>
                      </div>
                      <div className="flex gap-1.5">
                        {city.weather.last10Days.map((day, dayIdx) => (
                          <div key={dayIdx} style={{ width: '24px', height: '6px', borderRadius: '3px', background: day.type === 'mixed' ? weatherColors.mixed : weatherColors[day.type], transition: 'transform 0.2s' }} className="hover:scale-110" />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Things To Do - RESTORED EARLIER UI */}
        <section style={{ marginBottom: `${DESIGN_TOKENS.grid.verticalRhythm.major}px` }}>
          <h2 style={{ fontSize: DESIGN_TOKENS.typography.sectionHeader.size, fontWeight: DESIGN_TOKENS.typography.sectionHeader.weight, color: DESIGN_TOKENS.colors.textPrimary, marginBottom: `${DESIGN_TOKENS.grid.verticalRhythm.minor}px` }}>
            Things to Do
          </h2>
          <div className="space-y-3">
            {thingsToDo.map((item, idx) => (
              <div key={item.title} className="cursor-pointer transition-transform active:scale-98" style={{ background: DESIGN_TOKENS.colors.cardBackground, borderRadius: `${DESIGN_TOKENS.radius.card}px`, overflow: 'hidden', boxShadow: DESIGN_TOKENS.shadow.default }}>
                <div className="flex gap-3">
                  {/* 2-image collage */}
                  <div className="flex-shrink-0" style={{ width: '140px' }}>
                    <div className="grid grid-cols-2 gap-1" style={{ height: '100px' }}>
                      <div style={{ overflow: 'hidden', borderRadius: '8px' }}>
                        <img src={experienceImages[idx]} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div style={{ overflow: 'hidden', borderRadius: '8px' }}>
                        <img src={experienceImages[idx + 1] || experienceImages[0]} alt="" className="w-full h-full object-cover" />
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 py-3 pr-4">
                    <h3 style={{ fontSize: '16px', fontWeight: '600', color: DESIGN_TOKENS.colors.textPrimary, marginBottom: '4px' }}>{item.title}</h3>
                    <p style={{ fontSize: '13px', color: DESIGN_TOKENS.colors.textMuted, marginBottom: '6px' }}>{item.count} experiences saved</p>
                    <div className="px-2 py-1 inline-block" style={{ background: 'rgba(255, 209, 92, 0.12)', borderRadius: '6px', fontSize: '11px', color: DESIGN_TOKENS.colors.accentGold }}>
                      {item.seasonal}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Mini Map */}
        <section>
          <h2 style={{ fontSize: DESIGN_TOKENS.typography.sectionHeader.size, fontWeight: DESIGN_TOKENS.typography.sectionHeader.weight, color: DESIGN_TOKENS.colors.textPrimary, marginBottom: `${DESIGN_TOKENS.grid.verticalRhythm.minor}px` }}>
            Map Preview
          </h2>
          <div className="flex items-center justify-center" style={{ height: '120px', background: DESIGN_TOKENS.colors.cardBackground, borderRadius: `${DESIGN_TOKENS.radius.card}px`, border: '1px solid rgba(255, 255, 255, 0.06)' }}>
            <div className="flex items-center gap-2">
              <MapPin size={18} color={DESIGN_TOKENS.vaultColors.trips.accent} />
              <span style={{ color: DESIGN_TOKENS.colors.textMuted, fontSize: '14px' }}>Interactive map with 4 cities</span>
            </div>
          </div>
        </section>
      </div>

      {/* Primary CTA - RESTORED */}
      <PrimaryCTA label="◉ Plan Your Trip to Southeast Asia" onClick={handlePlanTrip} />

      {/* Weather Bottom Sheet */}
      <BottomSheet isOpen={weatherSheetOpen} onClose={() => setWeatherSheetOpen(false)} title="Weather Forecast">
        {selectedCityWeather && (
          <div>
            {/* Next 10 Days */}
            <div className="mb-6">
              <h3 style={{ fontSize: '15px', fontWeight: '600', color: DESIGN_TOKENS.colors.textPrimary, marginBottom: '12px' }}>Next 10 Days</h3>
              <div className="space-y-3">
                {selectedCityWeather.next10Days.map((day, idx) => (
                  <div key={idx} className="flex items-center justify-between py-2 px-3" style={{ background: 'rgba(255, 255, 255, 0.03)', borderRadius: '8px' }}>
                    <div className="flex items-center gap-3">
                      <span style={{ fontSize: '24px' }}>{day.icon}</span>
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: '500', color: DESIGN_TOKENS.colors.textPrimary }}>{day.date}</div>
                        <div style={{ fontSize: '12px', color: DESIGN_TOKENS.colors.textMuted }}>{day.temp}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Next 30 Days Trend */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp size={16} color={DESIGN_TOKENS.colors.accentGold} />
                <h3 style={{ fontSize: '15px', fontWeight: '600', color: DESIGN_TOKENS.colors.textPrimary }}>30-Day Trend</h3>
              </div>
              <p style={{ fontSize: '14px', color: DESIGN_TOKENS.colors.textMuted, lineHeight: '1.5', marginBottom: '8px' }}>
                {selectedCityWeather.next30Trend}
              </p>
              <p style={{ fontSize: '12px', color: DESIGN_TOKENS.colors.textMuted, opacity: '0.6', fontStyle: 'italic' }}>
                Note: Forecast accuracy decreases beyond 10 days
              </p>
            </div>
          </div>
        )}
      </BottomSheet>

      {/* Tag Edit Bottom Sheet */}
      <BottomSheet isOpen={tagSheetOpen} onClose={() => setTagSheetOpen(false)} title="Change Vault Type">
        <div className="grid grid-cols-2 gap-3">
          {['Trips', 'City Gems', 'Food & Drink', 'Adventures', 'Wishlists'].map((type) => (
            <button key={type} className="p-4 text-left" style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: `${DESIGN_TOKENS.radius.card}px`, color: DESIGN_TOKENS.colors.textPrimary, cursor: 'pointer' }}>
              {type}
            </button>
          ))}
        </div>
      </BottomSheet>

      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .active\\:scale-98:active { transform: scale(0.98); }
      `}</style>
    </div>
  )
}
