import React, { useState, useEffect } from 'react'
import { MapPin, Filter, TrendingUp, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { ParallaxHeader } from '../../design-system/components/ParallaxHeader'
import { PrimaryCTA } from '../../design-system/components/PrimaryCTA'
import { BottomSheet } from '../../design-system/components/BottomSheet'
import { DESIGN_TOKENS } from '../../design-system/tokens'
import { fetchPexelsImages } from '../../services/pexels'

type WeatherType = 'sunny' | 'cloudy' | 'rain'
type TabType = 'cities' | 'things'

const weatherColors = {
  sunny: '#F4D479',
  cloudy: '#BDBDBD',
  rain: '#6FB0F6'
}

const getWeatherEmoji = (days: WeatherType[]) => {
  const sunny = days.filter(d => d === 'sunny').length
  const rainy = days.filter(d => d === 'rain').length
  if (sunny > 6) return '☀️'
  if (rainy > 4) return '🌧️'
  return '☁️'
}

export const TripsVaultPremium: React.FC = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<TabType>('cities')
  const [tagSheetOpen, setTagSheetOpen] = useState(false)
  const [weatherSheetOpen, setWeatherSheetOpen] = useState(false)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [selectedCityFilter, setSelectedCityFilter] = useState<string[]>(['All'])
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string[]>(['All'])
  const [heroImage, setHeroImage] = useState('')
  const [cityImages, setCityImages] = useState<string[]>([])
  const [experienceImages, setExperienceImages] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadImages = async () => {
      const hero = await fetchPexelsImages('Southeast Asia travel temple sunset', 1)
      if (hero.length > 0) setHeroImage(hero[0].src.large2x)

      const cities = await fetchPexelsImages('Bangkok Chiang Mai Hanoi skyline', 4)
      setCityImages(cities.map(p => p.src.large))

      const experiences = await fetchPexelsImages('temple food market asia', 4)
      setExperienceImages(experiences.map(p => p.src.large))

      setLoading(false)
    }
    loadImages()
  }, [])

  const cities = [
    { name: 'Bangkok', inspirations: 12, bestMonths: 'Nov–Feb', weather: ['sunny', 'sunny', 'cloudy', 'rain', 'sunny', 'sunny', 'sunny', 'cloudy', 'sunny', 'sunny'] as WeatherType[] },
    { name: 'Chiang Mai', inspirations: 8, bestMonths: 'Nov–Feb', weather: ['sunny', 'cloudy', 'cloudy', 'sunny', 'sunny', 'rain', 'sunny', 'sunny', 'cloudy', 'sunny'] as WeatherType[] },
    { name: 'Hanoi', inspirations: 7, bestMonths: 'Oct–Apr', weather: ['sunny', 'cloudy', 'rain', 'sunny', 'cloudy', 'rain', 'sunny', 'cloudy', 'rain', 'sunny'] as WeatherType[] },
    { name: 'Siem Reap', inspirations: 5, bestMonths: 'Nov–Mar', weather: ['sunny', 'sunny', 'sunny', 'sunny', 'cloudy', 'cloudy', 'sunny', 'sunny', 'rain', 'sunny'] as WeatherType[] }
  ]

  const marqueeExperiences = [
    { title: 'Angkor Wat Sunrise', subtype: 'Heritage' },
    { title: 'Floating Markets', subtype: 'Cultural' },
    { title: 'Night Food Crawl', subtype: 'Food' },
    { title: 'Thai Cooking Class', subtype: 'Experience' },
    { title: 'Temple Hopping', subtype: 'Heritage' }
  ]

  const experiences = [
    { title: 'Ramen Spots', count: 6, type: 'Food', cities: ['Bangkok', 'Hanoi'] },
    { title: 'Temple Tours', count: 8, type: 'Cultural', cities: ['Siem Reap', 'Chiang Mai'] },
    { title: 'Street Food Markets', count: 12, type: 'Food', cities: ['Bangkok', 'Hanoi', 'Chiang Mai'] },
    { title: 'Heritage Sites', count: 5, type: 'Heritage', cities: ['Siem Reap'] }
  ]

  const handlePlanTrip = () => {
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
      <ParallaxHeader
        title="Southeast Asia Adventure"
        subtitle="32 saved · 3 people"
        heroImage={heroImage}
        vaultType="trips"
        countryEmoji="🌏"
        onTagEdit={() => setTagSheetOpen(true)}
        tagLabel="Trips"
      />

      <div style={{ padding: `0 ${DESIGN_TOKENS.grid.horizontalMargin}px` }}>
        {/* Marquee Experiences */}
        <section style={{ marginTop: `${DESIGN_TOKENS.grid.verticalRhythm.major}px`, marginBottom: `${DESIGN_TOKENS.grid.verticalRhythm.major}px` }}>
          <div className="flex gap-3 overflow-x-auto pb-2 hide-scrollbar">
            {marqueeExperiences.map((exp, idx) => (
              <div key={idx} className="flex-shrink-0 cursor-pointer transition-transform active:scale-98" style={{ width: '170px' }}>
                <div style={{ background: DESIGN_TOKENS.colors.cardBackground, borderRadius: '12px', overflow: 'hidden', boxShadow: DESIGN_TOKENS.shadow.default }}>
                  <div style={{ height: '140px', overflow: 'hidden' }}>
                    <img src={experienceImages[idx % experienceImages.length]} alt={exp.title} className="w-full h-full object-cover" />
                  </div>
                  <div style={{ padding: '12px' }}>
                    <h3 style={{ fontSize: '14px', fontWeight: '600', color: DESIGN_TOKENS.colors.textPrimary, marginBottom: '4px' }}>{exp.title}</h3>
                    <p style={{ fontSize: '13px', color: DESIGN_TOKENS.colors.textMuted, opacity: '0.7' }}>{exp.subtype}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Tabs */}
        <div className="flex items-center gap-8 mb-6" style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <button onClick={() => setActiveTab('cities')} className="relative pb-3" style={{ background: 'none', border: 'none', fontSize: '17px', fontWeight: '600', color: activeTab === 'cities' ? DESIGN_TOKENS.colors.textPrimary : DESIGN_TOKENS.colors.textMuted, cursor: 'pointer', transition: 'color 180ms ease-out' }}>
            Cities
            {activeTab === 'cities' && (
              <div className="absolute bottom-0 left-0 right-0" style={{ height: '2px', background: DESIGN_TOKENS.vaultColors.trips.accent, borderRadius: '2px 2px 0 0' }} />
            )}
          </button>
          <button onClick={() => setActiveTab('things')} className="relative pb-3" style={{ background: 'none', border: 'none', fontSize: '17px', fontWeight: '600', color: activeTab === 'things' ? DESIGN_TOKENS.colors.textPrimary : DESIGN_TOKENS.colors.textMuted, cursor: 'pointer', transition: 'color 180ms ease-out' }}>
            Things to Do
            {activeTab === 'things' && (
              <div className="absolute bottom-0 left-0 right-0" style={{ height: '2px', background: DESIGN_TOKENS.vaultColors.trips.accent, borderRadius: '2px 2px 0 0' }} />
            )}
          </button>
        </div>

        {/* Cities Tab */}
        {activeTab === 'cities' && (
          <>
            <section style={{ marginBottom: `${DESIGN_TOKENS.grid.verticalRhythm.major}px` }}>
              <div className="space-y-4">
                {cities.map((city, idx) => (
                  <div key={city.name} className="cursor-pointer transition-transform active:scale-98" style={{ background: DESIGN_TOKENS.colors.cardBackground, borderRadius: DESIGN_TOKENS.radius.card, overflow: 'hidden', boxShadow: DESIGN_TOKENS.shadow.default }}>
                    {/* Image Zone - 72% */}
                    <div className="relative" style={{ height: '280px' }}>
                      <img src={cityImages[idx]} alt={city.name} className="w-full h-full object-cover" />
                      <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(15, 17, 18, 0.95) 0%, transparent 50%)' }} />
                      
                      {/* Best to Visit Pill */}
                      <div className="absolute top-3 right-3 px-2.5 py-1" style={{ background: 'rgba(244, 212, 121, 0.15)', backdropFilter: 'blur(8px)', border: '1px solid rgba(244, 212, 121, 0.25)', borderRadius: '10px', fontSize: '12px', fontWeight: '500', color: '#F4D479' }}>
                        Best: {city.bestMonths}
                      </div>

                      {/* City Title & Weather */}
                      <div className="absolute bottom-0 left-0 right-0 p-5">
                        <h3 style={{ fontSize: '24px', fontWeight: '700', color: DESIGN_TOKENS.colors.textPrimary, marginBottom: '4px' }}>
                          {city.name}
                        </h3>
                        <p style={{ fontSize: '14px', color: DESIGN_TOKENS.colors.textMuted, opacity: '0.7', marginBottom: '12px' }}>
                          Curated from {city.inspirations} saved inspirations
                        </p>

                        {/* Weather Micro-Strip */}
                        <div onClick={(e) => { e.stopPropagation(); setWeatherSheetOpen(true); }} className="cursor-pointer inline-flex items-center gap-3">
                          <div>
                            <div style={{ fontSize: '11px', color: DESIGN_TOKENS.colors.textMuted, opacity: '0.7', marginBottom: '4px' }}>Last 10 days</div>
                            <div className="flex gap-1">
                              {city.weather.map((day, dayIdx) => (
                                <div key={dayIdx} style={{ width: '12px', height: '6px', borderRadius: '3px', background: weatherColors[day] }} />
                              ))}
                            </div>
                          </div>
                          <span style={{ fontSize: '20px' }}>{getWeatherEmoji(city.weather)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Map Preview */}
            <section>
              <div className="flex items-center justify-center cursor-pointer transition-transform active:scale-98" style={{ height: '120px', background: DESIGN_TOKENS.colors.cardBackground, borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                <div className="flex items-center gap-2">
                  <MapPin size={18} color={DESIGN_TOKENS.vaultColors.trips.accent} />
                  <span style={{ color: DESIGN_TOKENS.colors.textMuted, fontSize: '14px' }}>Interactive map with 4 cities</span>
                </div>
              </div>
            </section>
          </>
        )}

        {/* Things to Do Tab */}
        {activeTab === 'things' && (
          <section>
            <div className="flex items-center justify-between mb-5">
              <h2 style={{ fontSize: DESIGN_TOKENS.typography.sectionHeader.size, fontWeight: DESIGN_TOKENS.typography.sectionHeader.weight, color: DESIGN_TOKENS.colors.textPrimary }}>
                Things to Do
              </h2>
              <button onClick={() => setFiltersOpen(true)} className="flex items-center gap-2 px-3 py-2" style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', color: DESIGN_TOKENS.colors.textPrimary, fontSize: '14px', cursor: 'pointer' }}>
                <Filter size={16} />
                <span>Filters</span>
              </button>
            </div>

            <div className="space-y-3">
              {experiences.filter(exp => 
                (selectedCityFilter.includes('All') || exp.cities.some(c => selectedCityFilter.includes(c))) &&
                (selectedTypeFilter.includes('All') || selectedTypeFilter.includes(exp.type))
              ).map((exp, idx) => (
                <div key={exp.title} className="flex gap-3 cursor-pointer transition-transform active:scale-98" style={{ background: DESIGN_TOKENS.colors.cardBackground, borderRadius: DESIGN_TOKENS.radius.card, overflow: 'hidden', boxShadow: DESIGN_TOKENS.shadow.default, padding: '14px' }}>
                  {/* 2-image collage - 40% */}
                  <div className="flex-shrink-0" style={{ width: '40%' }}>
                    <div className="grid grid-cols-2 gap-1" style={{ height: '100px' }}>
                      <div style={{ overflow: 'hidden', borderRadius: '8px' }}>
                        <img src={experienceImages[idx % experienceImages.length]} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div style={{ overflow: 'hidden', borderRadius: '8px' }}>
                        <img src={experienceImages[(idx + 1) % experienceImages.length]} alt="" className="w-full h-full object-cover" />
                      </div>
                    </div>
                  </div>
                  {/* Text - 60% */}
                  <div className="flex-1">
                    <h3 style={{ fontSize: '18px', fontWeight: '600', color: DESIGN_TOKENS.colors.textPrimary, marginBottom: '4px' }}>{exp.title}</h3>
                    <p style={{ fontSize: '13px', color: DESIGN_TOKENS.colors.textMuted, marginBottom: '6px' }}>{exp.count} experiences saved</p>
                    <div className="px-2 py-1 inline-block" style={{ background: 'rgba(59, 130, 246, 0.12)', borderRadius: '6px', fontSize: '11px', color: DESIGN_TOKENS.vaultColors.trips.accent }}>
                      {exp.type}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Primary CTA */}
      <PrimaryCTA label="◉ Plan Your Trip to Southeast Asia" onClick={handlePlanTrip} />

      {/* Weather Bottom Sheet */}
      <BottomSheet isOpen={weatherSheetOpen} onClose={() => setWeatherSheetOpen(false)} title="Weather Forecast">
        <div>
          <div className="mb-6">
            <h3 style={{ fontSize: '15px', fontWeight: '600', color: DESIGN_TOKENS.colors.textPrimary, marginBottom: '12px' }}>Next 10 Days</h3>
            <div className="space-y-3">
              {['Today', 'Tomorrow', 'Sat', 'Sun', 'Mon'].map((day, idx) => (
                <div key={idx} className="flex items-center justify-between py-2 px-3" style={{ background: 'rgba(255, 255, 255, 0.03)', borderRadius: '8px' }}>
                  <div className="flex items-center gap-3">
                    <span style={{ fontSize: '20px' }}>{idx < 2 ? '☀️' : '☁️'}</span>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: '500', color: DESIGN_TOKENS.colors.textPrimary }}>{day}</div>
                      <div style={{ fontSize: '12px', color: DESIGN_TOKENS.colors.textMuted }}>{27 + idx}–{33 + idx}°C</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp size={16} color={DESIGN_TOKENS.colors.accentGold} />
              <h3 style={{ fontSize: '15px', fontWeight: '600', color: DESIGN_TOKENS.colors.textPrimary }}>30-Day Trend</h3>
            </div>
            <p style={{ fontSize: '14px', color: DESIGN_TOKENS.colors.textMuted, lineHeight: '1.5', marginBottom: '8px' }}>
              Generally warm with occasional rain. Best season approaching in November.
            </p>
            <p style={{ fontSize: '12px', color: DESIGN_TOKENS.colors.textMuted, opacity: '0.6', fontStyle: 'italic' }}>
              Note: Forecast accuracy decreases beyond 10 days
            </p>
          </div>
        </div>
      </BottomSheet>

      {/* Filters Bottom Sheet */}
      <BottomSheet isOpen={filtersOpen} onClose={() => setFiltersOpen(false)} title="Filters">
        <div>
          <div className="mb-6">
            <h3 style={{ fontSize: '15px', fontWeight: '600', color: DESIGN_TOKENS.colors.textPrimary, marginBottom: '12px' }}>Cities</h3>
            <div className="flex flex-wrap gap-2">
              {['All', 'Bangkok', 'Chiang Mai', 'Hanoi', 'Siem Reap'].map((city) => (
                <button key={city} onClick={() => setSelectedCityFilter(city === 'All' ? ['All'] : [city])} className="px-3 py-2" style={{ background: selectedCityFilter.includes(city) ? DESIGN_TOKENS.vaultColors.trips.background : 'rgba(255, 255, 255, 0.05)', border: `1px solid ${selectedCityFilter.includes(city) ? DESIGN_TOKENS.vaultColors.trips.border : 'rgba(255, 255, 255, 0.1)'}`, color: selectedCityFilter.includes(city) ? DESIGN_TOKENS.vaultColors.trips.accent : DESIGN_TOKENS.colors.textMuted, borderRadius: '8px', fontSize: '13px', cursor: 'pointer' }}>
                  {city}
                </button>
              ))}
            </div>
          </div>
          <div>
            <h3 style={{ fontSize: '15px', fontWeight: '600', color: DESIGN_TOKENS.colors.textPrimary, marginBottom: '12px' }}>Type</h3>
            <div className="flex flex-wrap gap-2">
              {['All', 'Food', 'Cultural', 'Heritage', 'Adventure'].map((type) => (
                <button key={type} onClick={() => setSelectedTypeFilter(type === 'All' ? ['All'] : [type])} className="px-3 py-2" style={{ background: selectedTypeFilter.includes(type) ? DESIGN_TOKENS.vaultColors.trips.background : 'rgba(255, 255, 255, 0.05)', border: `1px solid ${selectedTypeFilter.includes(type) ? DESIGN_TOKENS.vaultColors.trips.border : 'rgba(255, 255, 255, 0.1)'}`, color: selectedTypeFilter.includes(type) ? DESIGN_TOKENS.vaultColors.trips.accent : DESIGN_TOKENS.colors.textMuted, borderRadius: '8px', fontSize: '13px', cursor: 'pointer' }}>
                  {type}
                </button>
              ))}
            </div>
          </div>
        </div>
      </BottomSheet>

      {/* Tag Edit Bottom Sheet */}
      <BottomSheet isOpen={tagSheetOpen} onClose={() => setTagSheetOpen(false)} title="Change Vault Type">
        <div className="grid grid-cols-2 gap-3">
          {['Trips', 'City Gems', 'Food & Drink', 'Adventures', 'Wishlists'].map((type) => (
            <button key={type} className="p-4 text-left" style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: DESIGN_TOKENS.radius.card, color: DESIGN_TOKENS.colors.textPrimary, cursor: 'pointer' }}>
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
