import React, { useState, useEffect } from 'react'
import { MapPin, Users } from 'lucide-react'
import { ParallaxHeader } from '../../design-system/components/ParallaxHeader'
import { PrimaryCTA } from '../../design-system/components/PrimaryCTA'
import { BottomSheet } from '../../design-system/components/BottomSheet'
import { DESIGN_TOKENS } from '../../design-system/tokens'
import { fetchPexelsImages } from '../../services/pexels'

export const TripsVault: React.FC = () => {
  const [tagSheetOpen, setTagSheetOpen] = useState(false)
  const [heroImage, setHeroImage] = useState('')
  const [cityImages, setCityImages] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadImages = async () => {
      const hero = await fetchPexelsImages('Southeast Asia travel Bangkok temple', 1)
      if (hero.length > 0) setHeroImage(hero[0].src.large2x)

      const cities = await fetchPexelsImages('Asian cities skyline', 4)
      setCityImages(cities.map(p => p.src.large))
      setLoading(false)
    }
    loadImages()
  }, [])

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: DESIGN_TOKENS.colors.background }}>
      <div style={{ color: DESIGN_TOKENS.colors.textMuted }}>Loading...</div>
    </div>
  )

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

      <div style={{ padding: `${DESIGN_TOKENS.grid.verticalRhythm.major}px ${DESIGN_TOKENS.grid.horizontalMargin}px` }}>
        {/* Trip Overview */}
        <section style={{ marginBottom: `${DESIGN_TOKENS.grid.verticalRhythm.major}px` }}>
          <div className="p-5" style={{ background: DESIGN_TOKENS.colors.cardBackground, borderRadius: `${DESIGN_TOKENS.radius.card}px`, border: '1px solid rgba(255, 255, 255, 0.06)' }}>
            <div className="flex items-center gap-3 mb-3">
              <div className="px-3 py-1.5" style={{ background: DESIGN_TOKENS.vaultColors.trips.background, color: DESIGN_TOKENS.vaultColors.trips.accent, borderRadius: `${DESIGN_TOKENS.radius.chip}px`, fontSize: DESIGN_TOKENS.typography.tagChip.size, fontWeight: DESIGN_TOKENS.typography.tagChip.weight }}>
                14 days
              </div>
              <div className="px-3 py-1.5" style={{ background: 'rgba(255, 255, 255, 0.05)', color: DESIGN_TOKENS.colors.textMuted, borderRadius: `${DESIGN_TOKENS.radius.chip}px`, fontSize: DESIGN_TOKENS.typography.tagChip.size }}>
                Best: Nov - Feb
              </div>
            </div>
            <p style={{ fontSize: DESIGN_TOKENS.typography.bodyRegular.size, lineHeight: DESIGN_TOKENS.typography.bodyRegular.lineHeight, color: DESIGN_TOKENS.colors.textMuted }}>
              Explore vibrant cities, ancient temples, and beaches across Thailand, Vietnam, and Cambodia.
            </p>
          </div>
        </section>

        {/* Cities */}
        <section style={{ marginBottom: `${DESIGN_TOKENS.grid.verticalRhythm.major}px` }}>
          <h2 style={{ fontSize: DESIGN_TOKENS.typography.sectionHeader.size, fontWeight: DESIGN_TOKENS.typography.sectionHeader.weight, color: DESIGN_TOKENS.colors.textPrimary, marginBottom: `${DESIGN_TOKENS.grid.verticalRhythm.minor}px` }}>
            Cities
          </h2>
          <div className="flex gap-4 overflow-x-auto pb-2 hide-scrollbar">
            {['Bangkok', 'Chiang Mai', 'Hanoi', 'Siem Reap'].map((city, idx) => (
              <div key={city} className="flex-shrink-0 cursor-pointer transition-transform active:scale-98" style={{ width: '240px' }}>
                <div style={{ background: DESIGN_TOKENS.colors.cardBackground, borderRadius: `${DESIGN_TOKENS.radius.card}px`, overflow: 'hidden', boxShadow: DESIGN_TOKENS.shadow.default }}>
                  <div style={{ height: '140px', overflow: 'hidden' }}>
                    <img src={cityImages[idx]} alt={city} className="w-full h-full object-cover" />
                  </div>
                  <div style={{ padding: '14px' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: '600', color: DESIGN_TOKENS.colors.textPrimary, marginBottom: '6px' }}>{city}</h3>
                    <p style={{ fontSize: '13px', color: DESIGN_TOKENS.colors.textMuted, opacity: '0.7' }}>Curated from {8 + idx * 2} saved inspirations</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Things to Do */}
        <section style={{ marginBottom: `${DESIGN_TOKENS.grid.verticalRhythm.major}px` }}>
          <h2 style={{ fontSize: DESIGN_TOKENS.typography.sectionHeader.size, fontWeight: DESIGN_TOKENS.typography.sectionHeader.weight, color: DESIGN_TOKENS.colors.textPrimary, marginBottom: `${DESIGN_TOKENS.grid.verticalRhythm.minor}px` }}>
            Things to Do
          </h2>
          <div className="space-y-3">
            {[
              { title: 'Sunrise at Angkor Wat', category: 'Heritage', saved: true },
              { title: 'Floating Markets Tour', category: 'Cultural', saved: true },
              { title: 'Night Market Food Crawl', category: 'Food', saved: false },
              { title: 'Thai Cooking Class', category: 'Experience', saved: true }
            ].map((exp) => (
              <div key={exp.title} className="flex gap-4 cursor-pointer transition-transform active:scale-98" style={{ background: DESIGN_TOKENS.colors.cardBackground, borderRadius: `${DESIGN_TOKENS.radius.card}px`, border: '1px solid rgba(255, 255, 255, 0.06)', padding: '14px', boxShadow: DESIGN_TOKENS.shadow.default }}>
                <div className="flex-1">
                  <h3 style={{ fontSize: DESIGN_TOKENS.typography.bodyEmphasis.size, fontWeight: DESIGN_TOKENS.typography.bodyEmphasis.weight, color: DESIGN_TOKENS.colors.textPrimary, marginBottom: '4px' }}>
                    {exp.title}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1" style={{ background: 'rgba(255, 255, 255, 0.05)', color: DESIGN_TOKENS.colors.textMuted, borderRadius: `${DESIGN_TOKENS.radius.chip}px`, fontSize: '12px' }}>
                      {exp.category}
                    </span>
                    {exp.saved && <span style={{ fontSize: '12px', color: DESIGN_TOKENS.vaultColors.trips.accent }}>✓ Saved</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Map Preview */}
        <section style={{ marginBottom: `${DESIGN_TOKENS.grid.verticalRhythm.major}px` }}>
          <h2 style={{ fontSize: DESIGN_TOKENS.typography.sectionHeader.size, fontWeight: DESIGN_TOKENS.typography.sectionHeader.weight, color: DESIGN_TOKENS.colors.textPrimary, marginBottom: `${DESIGN_TOKENS.grid.verticalRhythm.minor}px` }}>
            Map Preview
          </h2>
          <div className="flex items-center justify-center" style={{ height: '180px', background: DESIGN_TOKENS.colors.cardBackground, borderRadius: `${DESIGN_TOKENS.radius.card}px`, border: '1px solid rgba(255, 255, 255, 0.06)' }}>
            <div className="flex items-center gap-2">
              <MapPin size={20} color={DESIGN_TOKENS.vaultColors.trips.accent} />
              <span style={{ color: DESIGN_TOKENS.colors.textMuted }}>Map with 4 cities</span>
            </div>
          </div>
        </section>

        {/* Social Snippets */}
        <section>
          <h2 style={{ fontSize: DESIGN_TOKENS.typography.sectionHeader.size, fontWeight: DESIGN_TOKENS.typography.sectionHeader.weight, color: DESIGN_TOKENS.colors.textPrimary, marginBottom: `${DESIGN_TOKENS.grid.verticalRhythm.minor}px` }}>
            Friends Activity
          </h2>
          <div className="p-4" style={{ background: DESIGN_TOKENS.colors.cardBackground, borderRadius: `${DESIGN_TOKENS.radius.card}px`, border: '1px solid rgba(255, 255, 255, 0.06)' }}>
            <div className="flex items-center gap-3">
              <Users size={20} color={DESIGN_TOKENS.colors.textMuted} />
              <span style={{ color: DESIGN_TOKENS.colors.textMuted, fontSize: '14px' }}>2 friends visited Bangkok recently</span>
            </div>
          </div>
        </section>
      </div>

      <PrimaryCTA label="Plan Your Trip to Southeast Asia" onClick={() => alert('Plan Trip')} />

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
