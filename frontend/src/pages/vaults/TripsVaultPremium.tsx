import React, { useState, useEffect } from 'react'
import { MapPin, Filter, TrendingUp } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { ParallaxHeader } from '../../design-system/components/ParallaxHeader'
import { PrimaryCTA } from '../../design-system/components/PrimaryCTA'
import { BottomSheet } from '../../design-system/components/BottomSheet'
import { DESIGN_TOKENS } from '../../design-system/tokens'
import { fetchPexelsImages } from '../../services/pexels'

type TabType = 'cities' | 'things'

const weatherIcons = {
  sunny: '☀️',
  cloudy: '☁️',
  rain: '🌧️'
}

export const TripsVaultPremium: React.FC = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<TabType>('cities')
  const [tagSheetOpen, setTagSheetOpen] = useState(false)
  const [weatherSheetOpen, setWeatherSheetOpen] = useState(false)
  const [routeSheetOpen, setRouteSheetOpen] = useState(false)
  const [selectedRoute, setSelectedRoute] = useState<any>(null)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [selectedCityFilter, setSelectedCityFilter] = useState<string[]>(['All'])
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string[]>(['All'])
  const [heroImage, setHeroImage] = useState('')
  const [cityImages, setCityImages] = useState<string[]>([])
  const [routeImages, setRouteImages] = useState<string[]>([])
  const [highlightImages, setHighlightImages] = useState<string[]>([])
  const [experienceImages, setExperienceImages] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadImages = async () => {
      const hero = await fetchPexelsImages('Southeast Asia temple sunset travel', 1)
      if (hero.length > 0) setHeroImage(hero[0].src.large2x)

      const cities = await fetchPexelsImages('Bangkok Chiang Mai Hanoi Siem Reap', 4)
      setCityImages(cities.map(p => p.src.large))

      const routes = await fetchPexelsImages('Thailand Cambodia Vietnam route travel', 3)
      setRouteImages(routes.map(p => p.src.large))

      const highlights = await fetchPexelsImages('Angkor Wat temple food market asia', 5)
      setHighlightImages(highlights.map(p => p.src.large))

      const experiences = await fetchPexelsImages('Asian food culture heritage', 4)
      setExperienceImages(experiences.map(p => p.src.large))

      setLoading(false)
    }
    loadImages()
  }, [])

  const potentialRoutes = [
    {
      name: 'Thailand Essentials Route',
      cities: 'Bangkok → Ayutthaya → Chiang Mai → Phuket',
      transit: 'Mix of trains + domestic flight + road',
      description: 'Classic North–South loop covering temples, culture, and beaches'
    },
    {
      name: 'Vietnam Spine Route',
      cities: 'Hanoi → Da Nang → Hoi An → Ho Chi Minh City',
      transit: 'Domestic flights + coastal road transfers',
      description: 'Follows the length of Vietnam with scenic coastal routes'
    },
    {
      name: 'Cross-Border Thailand → Cambodia Trail',
      cities: 'Bangkok → Poipet → Siem Reap → Phnom Penh',
      transit: 'Road border crossing + buses',
      description: 'Popular backpacker route adding multi-country experience'
    }
  ]

  const cities = [
    { name: 'Bangkok', inspirations: 12, bestMonths: 'Nov–Feb', weather: ['sunny', 'sunny', 'cloudy', 'rain', 'sunny', 'sunny', 'cloudy'] },
    { name: 'Chiang Mai', inspirations: 8, bestMonths: 'Nov–Feb', weather: ['sunny', 'cloudy', 'sunny', 'sunny', 'rain', 'sunny', 'sunny'] },
    { name: 'Hanoi', inspirations: 7, bestMonths: 'Oct–Apr', weather: ['cloudy', 'rain', 'sunny', 'cloudy', 'rain', 'sunny', 'cloudy'] },
    { name: 'Siem Reap', inspirations: 5, bestMonths: 'Nov–Mar', weather: ['sunny', 'sunny', 'sunny', 'cloudy', 'sunny', 'sunny', 'rain'] }
  ]

  const highlights = [
    { title: 'Angkor Wat Sunrise', category: 'Heritage' },
    { title: 'Floating Markets', category: 'Cultural' },
    { title: 'Night Food Crawl', category: 'Food' },
    { title: 'Thai Cooking Class', category: 'Experience' },
    { title: 'Temple Hopping', category: 'Heritage' }
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

  const handleRouteClick = (route: any) => {
    setSelectedRoute(route)
    setRouteSheetOpen(true)
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
        {/* Tabs - INCREASED SPACING */}
        <div style={{ paddingTop: '24px', paddingBottom: '16px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <div className="flex items-center gap-12">
            <button onClick={() => setActiveTab('cities')} className="relative pb-3" style={{ background: 'none', border: 'none', fontSize: '17px', fontWeight: '600', color: activeTab === 'cities' ? DESIGN_TOKENS.colors.textPrimary : DESIGN_TOKENS.colors.textMuted, cursor: 'pointer', transition: 'color 180ms ease-out' }}>
              Cities
              {activeTab === 'cities' && (
                <div className="absolute bottom-0 left-0 right-0" style={{ height: '2px', background: DESIGN_TOKENS.colors.accentGold, borderRadius: '4px 4px 0 0' }} />
              )}
            </button>
            <button onClick={() => setActiveTab('things')} className="relative pb-3" style={{ background: 'none', border: 'none', fontSize: '17px', fontWeight: '600', color: activeTab === 'things' ? DESIGN_TOKENS.colors.textPrimary : DESIGN_TOKENS.colors.textMuted, cursor: 'pointer', transition: 'color 180ms ease-out' }}>
              Things to Do
              {activeTab === 'things' && (
                <div className="absolute bottom-0 left-0 right-0" style={{ height: '2px', background: DESIGN_TOKENS.colors.accentGold, borderRadius: '4px 4px 0 0' }} />
              )}
            </button>
          </div>
        </div>

        {/* Cities Tab */}
        {activeTab === 'cities' && (
          <>
            {/* Potential Routes */}
            <section style={{ marginTop: '24px', marginBottom: '24px' }}>
              <h2 style={{ fontSize: DESIGN_TOKENS.typography.sectionHeader.size, fontWeight: DESIGN_TOKENS.typography.sectionHeader.weight, color: DESIGN_TOKENS.colors.textPrimary, marginBottom: '16px' }}>
                Potential Routes
              </h2>
              <div className="flex gap-4 overflow-x-auto pb-2 hide-scrollbar">
                {potentialRoutes.map((route, idx) => (
                  <div key={idx} onClick={() => handleRouteClick(route)} className="flex-shrink-0 cursor-pointer transition-transform active:scale-98" style={{ width: '88%', maxWidth: '340px' }}>
                    <div style={{ background: DESIGN_TOKENS.colors.cardBackground, borderRadius: DESIGN_TOKENS.radius.card, overflow: 'hidden', boxShadow: DESIGN_TOKENS.shadow.default }}>
                      <div className="relative" style={{ height: '160px' }}>
                        <img src={routeImages[idx % routeImages.length]} alt={route.name} className="w-full h-full object-cover" style={{ opacity: 0.7 }} />
                        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(15, 17, 18, 0.9) 0%, transparent 60%)' }} />
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                          <h3 style={{ fontSize: '18px', fontWeight: '700', color: DESIGN_TOKENS.colors.textPrimary, marginBottom: '6px' }}>
                            {route.name}
                          </h3>
                          <p style={{ fontSize: '14px', color: DESIGN_TOKENS.colors.textPrimary, marginBottom: '4px', lineHeight: '1.3' }}>
                            {route.cities}
                          </p>
                          <p style={{ fontSize: '12px', color: DESIGN_TOKENS.colors.accentGold, opacity: 0.9 }}>
                            {route.transit}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Cities List */}
            <section style={{ marginBottom: '24px' }}>
              <h2 style={{ fontSize: DESIGN_TOKENS.typography.sectionHeader.size, fontWeight: DESIGN_TOKENS.typography.sectionHeader.weight, color: DESIGN_TOKENS.colors.textPrimary, marginBottom: '16px' }}>
                Cities
              </h2>
              <div className="space-y-4">
                {cities.map((city, idx) => (
                  <div key={city.name} className="cursor-pointer transition-transform active:scale-98" style={{ background: DESIGN_TOKENS.colors.cardBackground, borderRadius: DESIGN_TOKENS.radius.card, overflow: 'hidden', boxShadow: DESIGN_TOKENS.shadow.default }}>
                    <div className="relative" style={{ height: '280px' }}>
                      <img src={cityImages[idx]} alt={city.name} className="w-full h-full object-cover" />
                      <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(15, 17, 18, 0.95) 0%, transparent 50%)' }} />
                      
                      {/* Best to Visit Pill */}
                      <div className="absolute top-3 right-3 px-2.5 py-1" style={{ background: 'rgba(244, 212, 121, 0.15)', backdropFilter: 'blur(8px)', border: '1px solid rgba(244, 212, 121, 0.25)', borderRadius: '10px', fontSize: '12px', fontWeight: '500', color: '#F4D479' }}>
                        Best: {city.bestMonths}
                      </div>

                      <div className="absolute bottom-0 left-0 right-0 p-5">
                        <h3 style={{ fontSize: '24px', fontWeight: '700', color: DESIGN_TOKENS.colors.textPrimary, marginBottom: '4px' }}>
                          {city.name}
                        </h3>
                        <p style={{ fontSize: '14px', color: DESIGN_TOKENS.colors.textMuted, opacity: '0.7', marginBottom: '8px' }}>
                          Curated from {city.inspirations} saved inspirations
                        </p>

                        {/* Simple 7-Day Weather Icons */}
                        <div style={{ fontSize: '13px', color: DESIGN_TOKENS.colors.textMuted, opacity: '0.7' }}>
                          Last 7 days · {city.weather.map((w, i) => (
                            <span key={i} style={{ fontSize: '16px', marginLeft: i > 0 ? '4px' : '6px' }}>{weatherIcons[w as keyof typeof weatherIcons]}</span>
                          ))}
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
          <>
            {/* Highlights Horizontal Scroll */}
            <section style={{ marginTop: '24px', marginBottom: '24px' }}>
              <h2 style={{ fontSize: DESIGN_TOKENS.typography.sectionHeader.size, fontWeight: DESIGN_TOKENS.typography.sectionHeader.weight, color: DESIGN_TOKENS.colors.textPrimary, marginBottom: '16px' }}>
                Highlights
              </h2>
              <div className="flex gap-3 overflow-x-auto pb-2 hide-scrollbar">
                {highlights.map((highlight, idx) => (
                  <div key={highlight.title} className="flex-shrink-0 cursor-pointer transition-transform active:scale-98" style={{ width: '180px', background: DESIGN_TOKENS.colors.cardBackground, borderRadius: DESIGN_TOKENS.radius.card, overflow: 'hidden', boxShadow: DESIGN_TOKENS.shadow.default }}>
                    <div style={{ height: '140px', overflow: 'hidden' }}>
                      <img src={highlightImages[idx]} alt={highlight.title} className="w-full h-full object-cover" />
                    </div>
                    <div style={{ padding: '12px' }}>
                      <h3 style={{ fontSize: '14px', fontWeight: '600', color: DESIGN_TOKENS.colors.textPrimary, marginBottom: '4px', lineHeight: '1.3' }}>{highlight.title}</h3>
                      <p style={{ fontSize: '12px', color: DESIGN_TOKENS.colors.textMuted, opacity: '0.7' }}>{highlight.category}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Filters */}
            <div className="flex items-center justify-between mb-5">
              <h2 style={{ fontSize: DESIGN_TOKENS.typography.sectionHeader.size, fontWeight: DESIGN_TOKENS.typography.sectionHeader.weight, color: DESIGN_TOKENS.colors.textPrimary }}>
                All Experiences
              </h2>
              <button onClick={() => setFiltersOpen(true)} className="flex items-center gap-2 px-3 py-2" style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', color: DESIGN_TOKENS.colors.textPrimary, fontSize: '14px', cursor: 'pointer' }}>
                <Filter size={16} />
                <span>Filters</span>
              </button>
            </div>

            {/* Experience Categories */}
            <section>
              <div className="space-y-3">
                {experiences.filter(exp => 
                  (selectedCityFilter.includes('All') || exp.cities.some(c => selectedCityFilter.includes(c))) &&
                  (selectedTypeFilter.includes('All') || selectedTypeFilter.includes(exp.type))
                ).map((exp, idx) => (
                  <div key={exp.title} className="flex gap-3 cursor-pointer transition-transform active:scale-98" style={{ background: DESIGN_TOKENS.colors.cardBackground, borderRadius: DESIGN_TOKENS.radius.card, overflow: 'hidden', boxShadow: DESIGN_TOKENS.shadow.default, padding: '14px' }}>
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
          </>
        )}
      </div>

      {/* Primary CTA */}
      <PrimaryCTA label="◉ Plan Your Trip to Southeast Asia" onClick={handlePlanTrip} />

      {/* Route Bottom Sheet */}
      <BottomSheet isOpen={routeSheetOpen} onClose={() => setRouteSheetOpen(false)} title={selectedRoute?.name}>
        {selectedRoute && (
          <div>
            <div className="mb-4">
              <h3 style={{ fontSize: '15px', fontWeight: '600', color: DESIGN_TOKENS.colors.textPrimary, marginBottom: '8px' }}>Route</h3>
              <p style={{ fontSize: '16px', color: DESIGN_TOKENS.colors.textPrimary, lineHeight: '1.5' }}>
                {selectedRoute.cities}
              </p>
            </div>
            <div className="mb-4">
              <h3 style={{ fontSize: '15px', fontWeight: '600', color: DESIGN_TOKENS.colors.textPrimary, marginBottom: '8px' }}>Transit</h3>
              <p style={{ fontSize: '14px', color: DESIGN_TOKENS.colors.textMuted, lineHeight: '1.5' }}>
                {selectedRoute.transit}
              </p>
            </div>
            <div>
              <h3 style={{ fontSize: '15px', fontWeight: '600', color: DESIGN_TOKENS.colors.textPrimary, marginBottom: '8px' }}>About</h3>
              <p style={{ fontSize: '14px', color: DESIGN_TOKENS.colors.textMuted, lineHeight: '1.5' }}>
                {selectedRoute.description}
              </p>
            </div>
          </div>
        )}
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
