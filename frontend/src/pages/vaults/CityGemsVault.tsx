import React, { useState, useEffect } from 'react'
import { MapPin, Coffee } from 'lucide-react'
import { ParallaxHeader } from '../../design-system/components/ParallaxHeader'
import { PrimaryCTA } from '../../design-system/components/PrimaryCTA'
import { BottomSheet } from '../../design-system/components/BottomSheet'
import { DESIGN_TOKENS } from '../../design-system/tokens'
import { fetchPexelsImages } from '../../services/pexels'

export const CityGemsVault: React.FC = () => {
  const [tagSheetOpen, setTagSheetOpen] = useState(false)
  const [heroImage, setHeroImage] = useState('')
  const [gemImages, setGemImages] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedNeighborhood, setSelectedNeighborhood] = useState('Bandra West')

  useEffect(() => {
    const loadImages = async () => {
      const hero = await fetchPexelsImages('Mumbai cafe aesthetic', 1)
      if (hero.length > 0) setHeroImage(hero[0].src.large2x)

      const gems = await fetchPexelsImages('cafe interior cozy', 4)
      setGemImages(gems.map(p => p.src.large))
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
        title="Mumbai Hidden Cafés"
        subtitle="24 saved · 1 person"
        heroImage={heroImage}
        vaultType="city_gems"
        countryEmoji="🇮🇳"
        onTagEdit={() => setTagSheetOpen(true)}
        tagLabel="City Gems"
      />

      <div style={{ padding: `${DESIGN_TOKENS.grid.verticalRhythm.major}px ${DESIGN_TOKENS.grid.horizontalMargin}px` }}>
        {/* Neighbourhood Chips */}
        <section style={{ marginBottom: `${DESIGN_TOKENS.grid.verticalRhythm.major}px` }}>
          <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
            {['Bandra West', 'Colaba', 'Khar', 'Lower Parel'].map((n) => (
              <button key={n} onClick={() => setSelectedNeighborhood(n)} className="px-4 py-2 flex-shrink-0" style={{ background: selectedNeighborhood === n ? DESIGN_TOKENS.vaultColors.city_gems.background : 'rgba(255, 255, 255, 0.05)', border: `1px solid ${selectedNeighborhood === n ? DESIGN_TOKENS.vaultColors.city_gems.border : 'rgba(255, 255, 255, 0.1)'}`, color: selectedNeighborhood === n ? DESIGN_TOKENS.vaultColors.city_gems.accent : DESIGN_TOKENS.colors.textMuted, borderRadius: `${DESIGN_TOKENS.radius.chip}px`, fontSize: DESIGN_TOKENS.typography.tagChip.size, fontWeight: DESIGN_TOKENS.typography.tagChip.weight, cursor: 'pointer' }}>
                {n}
              </button>
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
              <MapPin size={20} color={DESIGN_TOKENS.vaultColors.city_gems.accent} />
              <span style={{ color: DESIGN_TOKENS.colors.textMuted }}>Interactive map with pins</span>
            </div>
          </div>
        </section>

        {/* Category Chips */}
        <section style={{ marginBottom: `${DESIGN_TOKENS.grid.verticalRhythm.major}px` }}>
          <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
            {['Pet-friendly', 'Outdoor', 'Quiet', 'Rooftop'].map((cat) => (
              <div key={cat} className="px-3 py-1.5 flex-shrink-0" style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', color: DESIGN_TOKENS.colors.textMuted, borderRadius: `${DESIGN_TOKENS.radius.chip}px`, fontSize: '13px' }}>
                {cat}
              </div>
            ))}
          </div>
        </section>

        {/* Local Gems Grid */}
        <section style={{ marginBottom: `${DESIGN_TOKENS.grid.verticalRhythm.major}px` }}>
          <h2 style={{ fontSize: DESIGN_TOKENS.typography.sectionHeader.size, fontWeight: DESIGN_TOKENS.typography.sectionHeader.weight, color: DESIGN_TOKENS.colors.textPrimary, marginBottom: `${DESIGN_TOKENS.grid.verticalRhythm.minor}px` }}>
            Local Gems
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { name: 'The Pantry', cat: 'Café', dist: '1.2 km' },
              { name: 'Theobroma', cat: 'Bakery', dist: '2.5 km' },
              { name: 'Prithvi Café', cat: 'Café', dist: '1.8 km' },
              { name: 'Candies', cat: 'Café', dist: '1.5 km' }
            ].map((gem, idx) => (
              <div key={gem.name} className="cursor-pointer transition-transform active:scale-98" style={{ background: DESIGN_TOKENS.colors.cardBackground, borderRadius: `${DESIGN_TOKENS.radius.card}px`, overflow: 'hidden', boxShadow: DESIGN_TOKENS.shadow.default }}>
                <div style={{ height: '120px', overflow: 'hidden' }}>
                  <img src={gemImages[idx]} alt={gem.name} className="w-full h-full object-cover" />
                </div>
                <div style={{ padding: '12px' }}>
                  <h3 style={{ fontSize: '15px', fontWeight: '600', color: DESIGN_TOKENS.colors.textPrimary, marginBottom: '4px' }}>{gem.name}</h3>
                  <p style={{ fontSize: '12px', color: DESIGN_TOKENS.colors.textMuted, marginBottom: '4px' }}>{gem.cat} · {gem.dist}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Route Builder Preview */}
        <section>
          <h2 style={{ fontSize: DESIGN_TOKENS.typography.sectionHeader.size, fontWeight: DESIGN_TOKENS.typography.sectionHeader.weight, color: DESIGN_TOKENS.colors.textPrimary, marginBottom: `${DESIGN_TOKENS.grid.verticalRhythm.minor}px` }}>
            Suggested Route
          </h2>
          <div className="p-4" style={{ background: DESIGN_TOKENS.colors.cardBackground, borderRadius: `${DESIGN_TOKENS.radius.card}px`, border: '1px solid rgba(255, 255, 255, 0.06)' }}>
            <p style={{ color: DESIGN_TOKENS.colors.textMuted, fontSize: '14px', marginBottom: '8px' }}>Suggested 3-stop café hop</p>
            <div className="flex items-center gap-2">
              <Coffee size={16} color={DESIGN_TOKENS.vaultColors.city_gems.accent} />
              <span style={{ color: DESIGN_TOKENS.colors.textPrimary, fontSize: '14px' }}>The Pantry → Prithvi Café → Candies</span>
            </div>
          </div>
        </section>
      </div>

      <PrimaryCTA label="Start Route" onClick={() => alert('Start Route')} />

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
