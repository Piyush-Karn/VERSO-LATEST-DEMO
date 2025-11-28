import React, { useState, useEffect } from 'react'
import { CheckSquare } from 'lucide-react'
import { ParallaxHeader } from '../../design-system/components/ParallaxHeader'
import { PrimaryCTA } from '../../design-system/components/PrimaryCTA'
import { BottomSheet } from '../../design-system/components/BottomSheet'
import { DESIGN_TOKENS } from '../../design-system/tokens'
import { fetchPexelsImages } from '../../services/pexels'

export const AdventuresVault: React.FC = () => {
  const [tagSheetOpen, setTagSheetOpen] = useState(false)
  const [heroImage, setHeroImage] = useState('')
  const [spotImages, setSpotImages] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedSkill, setSelectedSkill] = useState('All')

  useEffect(() => {
    const loadImages = async () => {
      const hero = await fetchPexelsImages('scuba diving underwater coral', 1)
      if (hero.length > 0) setHeroImage(hero[0].src.large2x)

      const spots = await fetchPexelsImages('underwater diving', 3)
      setSpotImages(spots.map(p => p.src.large))
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
        title="Maldives Scuba & Dive"
        subtitle="15 saved · 2 people"
        heroImage={heroImage}
        vaultType="adventures"
        countryEmoji="🏝️"
        onTagEdit={() => setTagSheetOpen(true)}
        tagLabel="Adventures"
      />

      <div style={{ padding: `${DESIGN_TOKENS.grid.verticalRhythm.major}px ${DESIGN_TOKENS.grid.horizontalMargin}px` }}>
        {/* Skill Level Cards */}
        <section style={{ marginBottom: `${DESIGN_TOKENS.grid.verticalRhythm.major}px` }}>
          <h2 style={{ fontSize: DESIGN_TOKENS.typography.sectionHeader.size, fontWeight: DESIGN_TOKENS.typography.sectionHeader.weight, color: DESIGN_TOKENS.colors.textPrimary, marginBottom: `${DESIGN_TOKENS.grid.verticalRhythm.minor}px` }}>
            Skill Level
          </h2>
          <div className="flex gap-3 overflow-x-auto pb-2 hide-scrollbar">
            {['All', 'Beginner', 'Intermediate', 'Advanced'].map((skill) => (
              <button key={skill} onClick={() => setSelectedSkill(skill)} className="px-4 py-2 flex-shrink-0" style={{ background: selectedSkill === skill ? DESIGN_TOKENS.vaultColors.adventures.background : 'rgba(255, 255, 255, 0.05)', border: `1px solid ${selectedSkill === skill ? DESIGN_TOKENS.vaultColors.adventures.border : 'rgba(255, 255, 255, 0.1)'}`, color: selectedSkill === skill ? DESIGN_TOKENS.vaultColors.adventures.accent : DESIGN_TOKENS.colors.textMuted, borderRadius: `${DESIGN_TOKENS.radius.chip}px`, fontSize: DESIGN_TOKENS.typography.tagChip.size, fontWeight: DESIGN_TOKENS.typography.tagChip.weight, cursor: 'pointer' }}>
                {skill}
              </button>
            ))}
          </div>
        </section>

        {/* Season Cards */}
        <section style={{ marginBottom: `${DESIGN_TOKENS.grid.verticalRhythm.major}px` }}>
          <h2 style={{ fontSize: DESIGN_TOKENS.typography.sectionHeader.size, fontWeight: DESIGN_TOKENS.typography.sectionHeader.weight, color: DESIGN_TOKENS.colors.textPrimary, marginBottom: `${DESIGN_TOKENS.grid.verticalRhythm.minor}px` }}>
            Best Season
          </h2>
          <div className="space-y-3">
            {[
              { name: 'Dry Season', months: 'Nov - Apr', desc: 'Best visibility' },
              { name: 'Wet Season', months: 'May - Oct', desc: 'Manta season' }
            ].map((s) => (
              <div key={s.name} className="p-4 cursor-pointer transition-transform active:scale-98" style={{ background: DESIGN_TOKENS.colors.cardBackground, borderRadius: `${DESIGN_TOKENS.radius.card}px`, border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '600', color: DESIGN_TOKENS.colors.textPrimary, marginBottom: '4px' }}>{s.name}</h3>
                <p style={{ fontSize: '13px', color: DESIGN_TOKENS.colors.textMuted, marginBottom: '2px' }}>{s.months}</p>
                <p style={{ fontSize: '13px', color: DESIGN_TOKENS.vaultColors.adventures.accent }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Premier Spots */}
        <section style={{ marginBottom: `${DESIGN_TOKENS.grid.verticalRhythm.major}px` }}>
          <h2 style={{ fontSize: DESIGN_TOKENS.typography.sectionHeader.size, fontWeight: DESIGN_TOKENS.typography.sectionHeader.weight, color: DESIGN_TOKENS.colors.textPrimary, marginBottom: `${DESIGN_TOKENS.grid.verticalRhythm.minor}px` }}>
            Premier Spots
          </h2>
          <div className="space-y-3">
            {[
              { name: 'HP Reef', level: 'Intermediate', meta: 'Depth 20-30m · Visibility 25m' },
              { name: 'Manta Point', level: 'Beginner', meta: 'Depth 5-15m · Visibility 20m' },
              { name: 'Shark Point', level: 'Advanced', meta: 'Depth 25-40m · Strong currents' }
            ].map((spot, idx) => (
              <div key={spot.name} className="cursor-pointer transition-transform active:scale-98" style={{ background: DESIGN_TOKENS.colors.cardBackground, borderRadius: `${DESIGN_TOKENS.radius.card}px`, overflow: 'hidden', boxShadow: DESIGN_TOKENS.shadow.default }}>
                <div style={{ height: '160px', overflow: 'hidden' }}>
                  <img src={spotImages[idx]} alt={spot.name} className="w-full h-full object-cover" />
                </div>
                <div style={{ padding: '14px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: '600', color: DESIGN_TOKENS.colors.textPrimary, marginBottom: '6px' }}>{spot.name}</h3>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-1" style={{ background: DESIGN_TOKENS.vaultColors.adventures.background, color: DESIGN_TOKENS.vaultColors.adventures.accent, borderRadius: `${DESIGN_TOKENS.radius.chip}px`, fontSize: '12px', fontWeight: '600' }}>
                      {spot.level}
                    </span>
                  </div>
                  <p style={{ fontSize: '13px', color: DESIGN_TOKENS.colors.textMuted }}>{spot.meta}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Gear Checklist */}
        <section>
          <h2 style={{ fontSize: DESIGN_TOKENS.typography.sectionHeader.size, fontWeight: DESIGN_TOKENS.typography.sectionHeader.weight, color: DESIGN_TOKENS.colors.textPrimary, marginBottom: `${DESIGN_TOKENS.grid.verticalRhythm.minor}px` }}>
            Gear Checklist
          </h2>
          <div className="p-4" style={{ background: DESIGN_TOKENS.colors.cardBackground, borderRadius: `${DESIGN_TOKENS.radius.card}px`, border: '1px solid rgba(255, 255, 255, 0.06)' }}>
            {['Dive computer', 'Underwater camera', 'Dive light', 'SMB & reel'].map((item, idx) => (
              <div key={item} className="flex items-center gap-3 py-2" style={{ borderBottom: idx < 3 ? '1px solid rgba(255, 255, 255, 0.06)' : 'none' }}>
                <CheckSquare size={18} color={idx % 2 === 0 ? DESIGN_TOKENS.vaultColors.adventures.accent : DESIGN_TOKENS.colors.textMuted} />
                <span style={{ fontSize: '14px', color: DESIGN_TOKENS.colors.textPrimary }}>{item}</span>
              </div>
            ))}
          </div>
        </section>
      </div>

      <PrimaryCTA label="Start Adventure Log" onClick={() => alert('Start Log')} />

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
