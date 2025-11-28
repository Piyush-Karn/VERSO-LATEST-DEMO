import React, { useState, useEffect } from 'react'
import { Sparkles } from 'lucide-react'
import { ParallaxHeader } from '../../design-system/components/ParallaxHeader'
import { PrimaryCTA } from '../../design-system/components/PrimaryCTA'
import { BottomSheet } from '../../design-system/components/BottomSheet'
import { DESIGN_TOKENS } from '../../design-system/tokens'
import { fetchPexelsImages } from '../../services/pexels'

export const WishlistsVault: React.FC = () => {
  const [tagSheetOpen, setTagSheetOpen] = useState(false)
  const [heroImage, setHeroImage] = useState('')
  const [dreamImages, setDreamImages] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadImages = async () => {
      const hero = await fetchPexelsImages('Santorini Greece sunset', 1)
      if (hero.length > 0) setHeroImage(hero[0].src.large2x)

      const dreams = await fetchPexelsImages('European coastal villages', 6)
      setDreamImages(dreams.map(p => p.src.large))
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
        title="European Summer Dreams"
        subtitle="28 saved · 1 person"
        heroImage={heroImage}
        vaultType="wishlists"
        countryEmoji="✨"
        onTagEdit={() => setTagSheetOpen(true)}
        tagLabel="Wishlists"
      />

      <div style={{ padding: `${DESIGN_TOKENS.grid.verticalRhythm.major}px ${DESIGN_TOKENS.grid.horizontalMargin}px` }}>
        {/* Dream Collage Hero */}
        <section style={{ marginBottom: `${DESIGN_TOKENS.grid.verticalRhythm.major}px` }}>
          <h2 style={{ fontSize: DESIGN_TOKENS.typography.sectionHeader.size, fontWeight: DESIGN_TOKENS.typography.sectionHeader.weight, color: DESIGN_TOKENS.colors.textPrimary, marginBottom: `${DESIGN_TOKENS.grid.verticalRhythm.minor}px` }}>
            Dream Destinations
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2" style={{ height: '200px', borderRadius: `${DESIGN_TOKENS.radius.card}px`, overflow: 'hidden' }}>
              <img src={dreamImages[0]} alt="Dream 1" className="w-full h-full object-cover" />
            </div>
            {dreamImages.slice(1, 3).map((img, idx) => (
              <div key={idx} style={{ height: '140px', borderRadius: `${DESIGN_TOKENS.radius.card}px`, overflow: 'hidden' }}>
                <img src={img} alt={`Dream ${idx + 2}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </section>

        {/* Theme Chips */}
        <section style={{ marginBottom: `${DESIGN_TOKENS.grid.verticalRhythm.major}px` }}>
          <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
            {['Beach', 'Village', 'Culture', 'Photography'].map((theme) => (
              <div key={theme} className="px-4 py-2 flex-shrink-0" style={{ background: DESIGN_TOKENS.vaultColors.wishlists.background, border: `1px solid ${DESIGN_TOKENS.vaultColors.wishlists.border}`, color: DESIGN_TOKENS.vaultColors.wishlists.accent, borderRadius: `${DESIGN_TOKENS.radius.chip}px`, fontSize: DESIGN_TOKENS.typography.tagChip.size, fontWeight: DESIGN_TOKENS.typography.tagChip.weight }}>
                {theme}
              </div>
            ))}
          </div>
        </section>

        {/* Dream Boards Grid */}
        <section style={{ marginBottom: `${DESIGN_TOKENS.grid.verticalRhythm.major}px` }}>
          <h2 style={{ fontSize: DESIGN_TOKENS.typography.sectionHeader.size, fontWeight: DESIGN_TOKENS.typography.sectionHeader.weight, color: DESIGN_TOKENS.colors.textPrimary, marginBottom: `${DESIGN_TOKENS.grid.verticalRhythm.minor}px` }}>
            Dream Boards
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { title: 'Santorini Sunset', vibe: 'Dreamy sunset over white-washed houses' },
              { title: 'Cinque Terre Colors', vibe: 'Pastel villages perched on cliffsides' },
              { title: 'Amalfi Coast Drive', vibe: 'Winding coastal roads and lemon groves' }
            ].map((board, idx) => (
              <div key={board.title} className="cursor-pointer transition-transform active:scale-98" style={{ background: DESIGN_TOKENS.colors.cardBackground, borderRadius: `${DESIGN_TOKENS.radius.card}px`, overflow: 'hidden', boxShadow: DESIGN_TOKENS.shadow.default, gridColumn: idx === 0 ? 'span 2' : 'span 1' }}>
                <div style={{ height: idx === 0 ? '180px' : '140px', overflow: 'hidden' }}>
                  <img src={dreamImages[idx + 3]} alt={board.title} className="w-full h-full object-cover" />
                </div>
                <div style={{ padding: '12px' }}>
                  <h3 style={{ fontSize: '15px', fontWeight: '600', color: DESIGN_TOKENS.colors.textPrimary, marginBottom: '4px' }}>{board.title}</h3>
                  <p style={{ fontSize: '12px', color: DESIGN_TOKENS.colors.textMuted, lineHeight: '1.4' }}>{board.vibe}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Timeline */}
        <section>
          <h2 style={{ fontSize: DESIGN_TOKENS.typography.sectionHeader.size, fontWeight: DESIGN_TOKENS.typography.sectionHeader.weight, color: DESIGN_TOKENS.colors.textPrimary, marginBottom: `${DESIGN_TOKENS.grid.verticalRhythm.minor}px` }}>
            Timeline
          </h2>
          <div className="flex gap-3 overflow-x-auto pb-2 hide-scrollbar">
            {[
              { date: 'Added 2 weeks ago', text: 'Saved Positano cliffside villa' },
              { date: 'Added 1 month ago', text: 'Bookmarked Dubrovnik old town' },
              { date: 'Added 2 months ago', text: 'Added Greek island hopping route' }
            ].map((item) => (
              <div key={item.text} className="flex-shrink-0 p-3" style={{ width: '200px', background: DESIGN_TOKENS.colors.cardBackground, borderRadius: `${DESIGN_TOKENS.radius.card}px`, border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles size={14} color={DESIGN_TOKENS.vaultColors.wishlists.accent} />
                  <span style={{ fontSize: '11px', color: DESIGN_TOKENS.colors.textMuted }}>{item.date}</span>
                </div>
                <p style={{ fontSize: '13px', color: DESIGN_TOKENS.colors.textPrimary, lineHeight: '1.4' }}>{item.text}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <PrimaryCTA label="Save for Later ✨" onClick={() => alert('Saved!')} />

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
