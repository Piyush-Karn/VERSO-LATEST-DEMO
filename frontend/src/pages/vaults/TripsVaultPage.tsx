import React, { useState, useEffect } from 'react'
import { MapPin, Users } from 'lucide-react'
import { ParallaxHeader } from '../../design-system/components/ParallaxHeader'
import { PrimaryCTA } from '../../design-system/components/PrimaryCTA'
import { BottomSheet } from '../../design-system/components/BottomSheet'
import { VaultCard } from '../../design-system/components/VaultCard'
import { DESIGN_TOKENS } from '../../design-system/tokens'
import { TRIPS_MOCK, City, Experience } from '../../data/vaultMockData'
import { fetchPexelsImages } from '../../services/pexels'

export const TripsVaultPage: React.FC = () => {
  const [tagBottomSheetOpen, setTagBottomSheetOpen] = useState(false)
  const [cityBottomSheetOpen, setCityBottomSheetOpen] = useState(false)
  const [experienceBottomSheetOpen, setExperienceBottomSheetOpen] = useState(false)
  const [selectedCity, setSelectedCity] = useState<City | null>(null)
  const [selectedExperience, setSelectedExperience] = useState<Experience | null>(null)
  const [images, setImages] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadImages = async () => {
      const imageMap: Record<string, string> = {}
      
      // Hero image
      const heroPhotos = await fetchPexelsImages('Southeast Asia travel', 1)
      if (heroPhotos.length > 0) {
        imageMap['hero'] = heroPhotos[0].src.large2x
        TRIPS_MOCK.heroImage = heroPhotos[0].src.large2x
      }

      // City images
      for (const city of TRIPS_MOCK.cities) {
        const photos = await fetchPexelsImages(`${city.name} city`, 1)
        if (photos.length > 0) {
          city.image = photos[0].src.large
          imageMap[city.id] = photos[0].src.large
        }
      }

      // Experience images
      for (const exp of TRIPS_MOCK.experiences) {
        const photos = await fetchPexelsImages(exp.title, 1)
        if (photos.length > 0) {
          exp.image = photos[0].src.large
          imageMap[exp.id] = photos[0].src.large
        }
      }

      setImages(imageMap)
      setLoading(false)
    }

    loadImages()
  }, [])

  const handleCityClick = (city: City) => {
    setSelectedCity(city)
    setCityBottomSheetOpen(true)
  }

  const handleExperienceClick = (exp: Experience) => {
    setSelectedExperience(exp)
    setExperienceBottomSheetOpen(true)
  }

  const handlePlanTrip = () => {
    alert('Plan Trip CTA clicked - would open trip planning flow')
  }

  if (loading) {
    return (
      <div 
        className=\"min-h-screen flex items-center justify-center\"
        style={{ background: DESIGN_TOKENS.colors.background }}
      >
        <div style={{ color: DESIGN_TOKENS.colors.textMuted }}>Loading...</div>
      </div>
    )
  }

  return (
    <div 
      className=\"min-h-screen\"
      style={{ 
        background: DESIGN_TOKENS.colors.background,
        paddingBottom: '100px'
      }}
    >
      {/* Parallax Header */}
      <ParallaxHeader
        title={TRIPS_MOCK.name}
        subtitle={`${TRIPS_MOCK.saved} saved · ${TRIPS_MOCK.people} ${TRIPS_MOCK.people === 1 ? 'person' : 'people'}`}
        heroImage={TRIPS_MOCK.heroImage}
        vaultType=\"trips\"
        countryEmoji={TRIPS_MOCK.countryEmoji}
        onTagEdit={() => setTagBottomSheetOpen(true)}
        tagLabel=\"Trips\"
      />

      {/* Main Content */}
      <div 
        style={{ 
          padding: `${DESIGN_TOKENS.grid.verticalRhythm.major}px ${DESIGN_TOKENS.grid.horizontalMargin}px`
        }}
      >
        {/* Trip Overview */}
        <section style={{ marginBottom: `${DESIGN_TOKENS.grid.verticalRhythm.major}px` }}>
          <div
            className=\"p-5\"
            style={{
              background: DESIGN_TOKENS.colors.cardBackground,
              borderRadius: `${DESIGN_TOKENS.radius.card}px`,
              border: '1px solid rgba(255, 255, 255, 0.06)'
            }}
          >
            <div className=\"flex items-center gap-4 mb-3\">
              <div
                className=\"px-3 py-1.5\"
                style={{
                  background: DESIGN_TOKENS.vaultColors.trips.background,
                  color: DESIGN_TOKENS.vaultColors.trips.accent,
                  borderRadius: `${DESIGN_TOKENS.radius.chip}px`,
                  fontSize: DESIGN_TOKENS.typography.tagChip.size,
                  fontWeight: DESIGN_TOKENS.typography.tagChip.weight
                }}
              >
                {TRIPS_MOCK.duration}
              </div>
              <div
                className=\"px-3 py-1.5\"
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  color: DESIGN_TOKENS.colors.textMuted,
                  borderRadius: `${DESIGN_TOKENS.radius.chip}px`,
                  fontSize: DESIGN_TOKENS.typography.tagChip.size
                }}
              >
                Best: {TRIPS_MOCK.bestMonth}
              </div>
            </div>
            <p
              style={{
                fontSize: DESIGN_TOKENS.typography.bodyRegular.size,
                lineHeight: DESIGN_TOKENS.typography.bodyRegular.lineHeight,
                color: DESIGN_TOKENS.colors.textMuted
              }}
            >
              {TRIPS_MOCK.description}
            </p>
          </div>
        </section>

        {/* Cities Section */}
        <section style={{ marginBottom: `${DESIGN_TOKENS.grid.verticalRhythm.major}px` }}>
          <h2
            style={{
              fontSize: DESIGN_TOKENS.typography.sectionHeader.size,
              fontWeight: DESIGN_TOKENS.typography.sectionHeader.weight,
              color: DESIGN_TOKENS.colors.textPrimary,
              marginBottom: `${DESIGN_TOKENS.grid.verticalRhythm.minor}px`
            }}
          >
            Cities
          </h2>
          <div className=\"flex gap-4 overflow-x-auto pb-2 hide-scrollbar\">
            {TRIPS_MOCK.cities.map((city) => (
              <div
                key={city.id}
                className=\"flex-shrink-0 cursor-pointer transition-transform active:scale-98\"
                style={{ width: '240px' }}
                onClick={() => handleCityClick(city)}
              >
                <VaultCard
                  title={city.name}
                  image={city.image}
                  metadata={`Curated from ${city.inspirationsCount} saved inspirations`}
                  tagLabel={city.name}
                  tagColor={DESIGN_TOKENS.vaultColors.trips.accent}
                  tagBackground={DESIGN_TOKENS.vaultColors.trips.background}
                />
              </div>
            ))}
          </div>
        </section>

        {/* Things to Do */}
        <section style={{ marginBottom: `${DESIGN_TOKENS.grid.verticalRhythm.major}px` }}>
          <h2
            style={{
              fontSize: DESIGN_TOKENS.typography.sectionHeader.size,
              fontWeight: DESIGN_TOKENS.typography.sectionHeader.weight,
              color: DESIGN_TOKENS.colors.textPrimary,
              marginBottom: `${DESIGN_TOKENS.grid.verticalRhythm.minor}px`
            }}
          >
            Things to Do
          </h2>
          <div className=\"space-y-3\">
            {TRIPS_MOCK.experiences.map((exp) => (
              <div
                key={exp.id}
                className=\"cursor-pointer transition-transform active:scale-98\"
                onClick={() => handleExperienceClick(exp)}
              >
                <div
                  className=\"flex gap-4\"
                  style={{
                    background: DESIGN_TOKENS.colors.cardBackground,
                    borderRadius: `${DESIGN_TOKENS.radius.card}px`,
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                    padding: '14px',
                    boxShadow: DESIGN_TOKENS.shadow.default
                  }}
                >
                  <div
                    className=\"relative overflow-hidden flex-shrink-0\"
                    style={{
                      width: '80px',
                      height: '80px',
                      borderRadius: `${DESIGN_TOKENS.radius.thumbnail}px`
                    }}
                  >
                    <img
                      src={exp.image}
                      alt={exp.title}
                      className=\"w-full h-full object-cover\"
                    />
                  </div>
                  <div className=\"flex-1 min-w-0\">
                    <h3
                      style={{
                        fontSize: DESIGN_TOKENS.typography.bodyEmphasis.size,
                        fontWeight: DESIGN_TOKENS.typography.bodyEmphasis.weight,
                        color: DESIGN_TOKENS.colors.textPrimary,
                        marginBottom: '4px'
                      }}
                    >
                      {exp.title}
                    </h3>
                    <div className=\"flex items-center gap-2\">
                      <span
                        className=\"px-2 py-1\"
                        style={{
                          background: 'rgba(255, 255, 255, 0.05)',
                          color: DESIGN_TOKENS.colors.textMuted,
                          borderRadius: `${DESIGN_TOKENS.radius.chip}px`,
                          fontSize: '12px'
                        }}
                      >
                        {exp.category}
                      </span>
                      {exp.saved && (
                        <span
                          style={{
                            fontSize: '12px',
                            color: DESIGN_TOKENS.vaultColors.trips.accent
                          }}
                        >
                          ✓ Saved
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Mini Map Preview */}
        <section style={{ marginBottom: `${DESIGN_TOKENS.grid.verticalRhythm.major}px` }}>
          <h2
            style={{
              fontSize: DESIGN_TOKENS.typography.sectionHeader.size,
              fontWeight: DESIGN_TOKENS.typography.sectionHeader.weight,
              color: DESIGN_TOKENS.colors.textPrimary,
              marginBottom: `${DESIGN_TOKENS.grid.verticalRhythm.minor}px`
            }}
          >
            Map Preview
          </h2>
          <div
            className=\"flex items-center justify-center\"
            style={{
              height: '180px',
              background: DESIGN_TOKENS.colors.cardBackground,
              borderRadius: `${DESIGN_TOKENS.radius.card}px`,
              border: '1px solid rgba(255, 255, 255, 0.06)'
            }}
          >
            <div className=\"flex items-center gap-2\">
              <MapPin size={20} color={DESIGN_TOKENS.vaultColors.trips.accent} />
              <span style={{ color: DESIGN_TOKENS.colors.textMuted }}>
                Map with {TRIPS_MOCK.cities.length} cities
              </span>
            </div>
          </div>
        </section>

        {/* Social Snippets */}
        <section>
          <h2
            style={{
              fontSize: DESIGN_TOKENS.typography.sectionHeader.size,
              fontWeight: DESIGN_TOKENS.typography.sectionHeader.weight,
              color: DESIGN_TOKENS.colors.textPrimary,
              marginBottom: `${DESIGN_TOKENS.grid.verticalRhythm.minor}px`
            }}
          >
            Friends Activity
          </h2>
          <div
            className=\"p-4\"
            style={{
              background: DESIGN_TOKENS.colors.cardBackground,
              borderRadius: `${DESIGN_TOKENS.radius.card}px`,
              border: '1px solid rgba(255, 255, 255, 0.06)'
            }}
          >
            <div className=\"flex items-center gap-3\">
              <Users size={20} color={DESIGN_TOKENS.colors.textMuted} />
              <span style={{ color: DESIGN_TOKENS.colors.textMuted, fontSize: '14px' }}>
                2 friends visited Bangkok recently
              </span>
            </div>
          </div>
        </section>
      </div>

      {/* Primary CTA */}
      <PrimaryCTA
        label={`Plan Your Trip to ${TRIPS_MOCK.name}`}
        onClick={handlePlanTrip}
      />

      {/* Bottom Sheets */}
      <BottomSheet
        isOpen={cityBottomSheetOpen}
        onClose={() => setCityBottomSheetOpen(false)}
        title={selectedCity?.name}
      >
        <div>
          <p style={{ color: DESIGN_TOKENS.colors.textMuted, marginBottom: '16px' }}>
            Curated from {selectedCity?.inspirationsCount} saved inspirations
          </p>
          <div
            style={{
              background: DESIGN_TOKENS.vaultColors.trips.background,
              padding: '16px',
              borderRadius: `${DESIGN_TOKENS.radius.card}px`,
              color: DESIGN_TOKENS.colors.textPrimary
            }}
          >
            City summary and key highlights would appear here
          </div>
        </div>
      </BottomSheet>

      <BottomSheet
        isOpen={experienceBottomSheetOpen}
        onClose={() => setExperienceBottomSheetOpen(false)}
        title={selectedExperience?.title}
      >
        <div>
          <div className=\"flex gap-2 mb-4\">
            <span
              className=\"px-3 py-1.5\"
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: `${DESIGN_TOKENS.radius.chip}px`,
                fontSize: '13px',
                color: DESIGN_TOKENS.colors.textPrimary
              }}
            >
              {selectedExperience?.category}
            </span>
          </div>
          <p style={{ color: DESIGN_TOKENS.colors.textMuted }}>
            Experience details, booking info, and user notes would appear here
          </p>
        </div>
      </BottomSheet>

      <BottomSheet
        isOpen={tagBottomSheetOpen}
        onClose={() => setTagBottomSheetOpen(false)}
        title=\"Change Vault Type\"
      >
        <div className=\"grid grid-cols-2 gap-3\">
          {['Trips', 'City Gems', 'Food & Drink', 'Adventures', 'Wishlists'].map((type) => (
            <button
              key={type}
              className=\"p-4 text-left transition-all active:scale-98\"
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: `${DESIGN_TOKENS.radius.card}px`,
                color: DESIGN_TOKENS.colors.textPrimary,
                cursor: 'pointer'
              }}
              onClick={() => setTagBottomSheetOpen(false)}
            >
              {type}
            </button>
          ))}
        </div>
      </BottomSheet>

      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .active\\:scale-98:active {
          transform: scale(0.98);
        }
      `}</style>
    </div>
  )
}
