import React, { useState, useEffect } from 'react'
import { ParallaxHeader } from '../../design-system/components/ParallaxHeader'
import { PrimaryCTA } from '../../design-system/components/PrimaryCTA'
import { BottomSheet } from '../../design-system/components/BottomSheet'
import { DESIGN_TOKENS } from '../../design-system/tokens'
import { fetchPexelsImages } from '../../services/pexels'

export const FoodDrinkVault: React.FC = () => {
  const [tagSheetOpen, setTagSheetOpen] = useState(false)
  const [heroImage, setHeroImage] = useState('')
  const [foodImages, setFoodImages] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCuisines, setSelectedCuisines] = useState<string[]>(['Ramen'])

  useEffect(() => {
    const loadImages = async () => {
      const hero = await fetchPexelsImages('Japanese ramen restaurant', 1)
      if (hero.length > 0) setHeroImage(hero[0].src.large2x)

      const food = await fetchPexelsImages('Japanese food', 4)
      setFoodImages(food.map(p => p.src.large))
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
        title="Japan Food Crawl"
        subtitle="18 saved · 2 people"
        heroImage={heroImage}
        vaultType="food_drink"
        countryEmoji="🇯🇵"
        onTagEdit={() => setTagSheetOpen(true)}
        tagLabel="Food & Drink"
      />

      <div style={{ padding: `${DESIGN_TOKENS.grid.verticalRhythm.major}px ${DESIGN_TOKENS.grid.horizontalMargin}px` }}>
        {/* Cuisine Filters */}
        <section style={{ marginBottom: `${DESIGN_TOKENS.grid.verticalRhythm.major}px` }}>
          <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
            {['Ramen', 'Sushi', 'Izakaya', 'Street Food', 'Dessert'].map((c) => (
              <button key={c} onClick={() => setSelectedCuisines(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c])} className="px-4 py-2 flex-shrink-0" style={{ background: selectedCuisines.includes(c) ? DESIGN_TOKENS.vaultColors.food_drink.background : 'rgba(255, 255, 255, 0.05)', border: `1px solid ${selectedCuisines.includes(c) ? DESIGN_TOKENS.vaultColors.food_drink.border : 'rgba(255, 255, 255, 0.1)'}`, color: selectedCuisines.includes(c) ? DESIGN_TOKENS.vaultColors.food_drink.accent : DESIGN_TOKENS.colors.textMuted, borderRadius: `${DESIGN_TOKENS.radius.chip}px`, fontSize: DESIGN_TOKENS.typography.tagChip.size, fontWeight: DESIGN_TOKENS.typography.tagChip.weight, cursor: 'pointer' }}>
                {c}
              </button>
            ))}
          </div>
        </section>

        {/* Mood Cards */}
        <section style={{ marginBottom: `${DESIGN_TOKENS.grid.verticalRhythm.major}px` }}>
          <h2 style={{ fontSize: DESIGN_TOKENS.typography.sectionHeader.size, fontWeight: DESIGN_TOKENS.typography.sectionHeader.weight, color: DESIGN_TOKENS.colors.textPrimary, marginBottom: `${DESIGN_TOKENS.grid.verticalRhythm.minor}px` }}>
            By Mood
          </h2>
          <div className="space-y-3">
            {[
              { mood: 'Cheap Eats', emoji: '🍜', desc: 'Budget-friendly spots under ¥1000' },
              { mood: 'Late-night', emoji: '🌙', desc: 'Open past midnight' },
              { mood: 'Hidden Gems', emoji: '✨', desc: 'Off the beaten path' }
            ].map((m) => (
              <div key={m.mood} className="p-4 cursor-pointer transition-transform active:scale-98" style={{ background: DESIGN_TOKENS.colors.cardBackground, borderRadius: `${DESIGN_TOKENS.radius.card}px`, border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                <div className="flex items-center gap-3">
                  <span style={{ fontSize: '24px' }}>{m.emoji}</span>
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: '600', color: DESIGN_TOKENS.colors.textPrimary, marginBottom: '2px' }}>{m.mood}</h3>
                    <p style={{ fontSize: '13px', color: DESIGN_TOKENS.colors.textMuted }}>{m.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Category Walls */}
        <section style={{ marginBottom: `${DESIGN_TOKENS.grid.verticalRhythm.major}px` }}>
          <h2 style={{ fontSize: DESIGN_TOKENS.typography.sectionHeader.size, fontWeight: DESIGN_TOKENS.typography.sectionHeader.weight, color: DESIGN_TOKENS.colors.textPrimary, marginBottom: `${DESIGN_TOKENS.grid.verticalRhythm.minor}px` }}>
            Categories
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { name: 'Ramen Spots', count: 6, emoji: '🍜' },
              { name: 'Sushi Bars', count: 4, emoji: '🍣' },
              { name: 'Street Food', count: 5, emoji: '🍢' },
              { name: 'Late-Night Eats', count: 3, emoji: '🌙' }
            ].map((cat, idx) => (
              <div key={cat.name} className="cursor-pointer transition-transform active:scale-98" style={{ background: DESIGN_TOKENS.colors.cardBackground, borderRadius: `${DESIGN_TOKENS.radius.card}px`, overflow: 'hidden', boxShadow: DESIGN_TOKENS.shadow.default }}>
                <div style={{ height: '100px', overflow: 'hidden' }}>
                  <img src={foodImages[idx]} alt={cat.name} className="w-full h-full object-cover" />
                </div>
                <div style={{ padding: '12px' }}>
                  <div className="flex items-center justify-between">
                    <h3 style={{ fontSize: '15px', fontWeight: '600', color: DESIGN_TOKENS.colors.textPrimary }}>{cat.name}</h3>
                    <span style={{ fontSize: '20px' }}>{cat.emoji}</span>
                  </div>
                  <p style={{ fontSize: '12px', color: DESIGN_TOKENS.colors.textMuted, marginTop: '4px' }}>{cat.count} places</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <PrimaryCTA label="Build My Food Trail 🍣" onClick={() => alert('Build Trail')} />

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
