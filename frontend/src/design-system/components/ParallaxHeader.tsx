import React, { useState, useEffect } from 'react'
import { ChevronLeft, ChevronDown } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { DESIGN_TOKENS, VaultType } from '../tokens'

interface ParallaxHeaderProps {
  title: string
  subtitle: string
  heroImage: string
  vaultType: VaultType
  countryEmoji?: string
  onTagEdit: () => void
  tagLabel: string
}

export const ParallaxHeader: React.FC<ParallaxHeaderProps> = ({
  title,
  subtitle,
  heroImage,
  vaultType,
  countryEmoji,
  onTagEdit,
  tagLabel
}) => {
  const navigate = useNavigate()
  const [scrollY, setScrollY] = useState(0)
  const [isCollapsed, setIsCollapsed] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      setScrollY(currentScrollY)
      setIsCollapsed(currentScrollY > DESIGN_TOKENS.dimensions.collapseScrollThreshold)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const vaultColor = DESIGN_TOKENS.vaultColors[vaultType]
  const parallaxOffset = scrollY * DESIGN_TOKENS.motion.parallaxSpeed
  const heroHeight = Math.max(
    DESIGN_TOKENS.dimensions.heroHeightMin,
    DESIGN_TOKENS.dimensions.heroHeightMax - scrollY
  )
  const titleOpacity = Math.max(0, 1 - (scrollY / DESIGN_TOKENS.dimensions.collapseScrollThreshold))

  return (
    <div className="sticky top-0 z-50">
      {/* Hero Image with Parallax */}
      <div
        className="relative overflow-hidden"
        style={{
          height: `${heroHeight}px`,
          transition: `height ${DESIGN_TOKENS.motion.headerCollapse.duration}ms ${DESIGN_TOKENS.motion.headerCollapse.easing}`
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            transform: `translateY(-${parallaxOffset}px)`,
            transition: 'transform 0.1s linear'
          }}
        >
          <img
            src={heroImage}
            alt={title}
            className="w-full h-full object-cover"
            style={{
              filter: 'contrast(1.05)',
              minHeight: '360px'
            }}
          />
          {/* Vignette */}
          <div
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(ellipse at center, transparent 30%, rgba(0, 0, 0, 0.3) 100%)'
            }}
          />
          {/* Bottom Gradient */}
          <div
            className="absolute inset-x-0 bottom-0 h-32"
            style={{
              background: 'linear-gradient(to top, rgba(11, 11, 11, 0.9) 0%, transparent 100%)'
            }}
          />
        </div>

        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-6 flex items-center justify-center"
          style={{
            width: '40px',
            height: '40px',
            background: 'rgba(0, 0, 0, 0.4)',
            backdropFilter: 'blur(12px)',
            borderRadius: '50%',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}
        >
          <ChevronLeft size={24} color={DESIGN_TOKENS.colors.textPrimary} />
        </button>

        {/* Tag Chip (Top Right) */}
        <button
          onClick={onTagEdit}
          className="absolute top-4 right-6 flex items-center gap-1.5 px-3 py-2 transition-all active:scale-95"
          style={{
            background: vaultColor.background,
            backdropFilter: 'blur(12px)',
            border: `1px solid ${vaultColor.border}`,
            borderRadius: `${DESIGN_TOKENS.radius.chip}px`,
            fontSize: DESIGN_TOKENS.typography.tagChip.size,
            fontWeight: DESIGN_TOKENS.typography.tagChip.weight,
            color: vaultColor.accent
          }}
        >
          <span>{tagLabel}</span>
          <ChevronDown size={12} />
        </button>
      </div>

      {/* Header Info Bar */}
      <div
        className="relative"
        style={{
          background: DESIGN_TOKENS.colors.background,
          borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
          padding: isCollapsed ? '12px 24px' : '16px 24px',
          transition: `padding ${DESIGN_TOKENS.motion.headerCollapse.duration}ms ${DESIGN_TOKENS.motion.headerCollapse.easing}`
        }}
      >
        <div
          style={{
            opacity: titleOpacity,
            transition: `opacity ${DESIGN_TOKENS.motion.headerCollapse.duration}ms ${DESIGN_TOKENS.motion.headerCollapse.easing}`
          }}
        >
          <h1
            style={{
              fontSize: DESIGN_TOKENS.typography.h1.size,
              fontWeight: DESIGN_TOKENS.typography.h1.weight,
              lineHeight: DESIGN_TOKENS.typography.h1.lineHeight,
              color: DESIGN_TOKENS.colors.textPrimary,
              marginBottom: '4px'
            }}
          >
            {countryEmoji && <span className="mr-2">{countryEmoji}</span>}
            {title}
          </h1>
          <p
            style={{
              fontSize: DESIGN_TOKENS.typography.bodyRegular.size,
              fontWeight: DESIGN_TOKENS.typography.bodyRegular.weight,
              color: DESIGN_TOKENS.colors.textMuted,
              opacity: DESIGN_TOKENS.typography.metadata.opacity
            }}
          >
            {subtitle}
          </p>
        </div>

        {/* Collapsed State Title */}
        {isCollapsed && (
          <div
            className="absolute inset-x-0 top-0 flex items-center justify-center"
            style={{
              height: '100%',
              opacity: 1 - titleOpacity,
              pointerEvents: 'none'
            }}
          >
            <span
              style={{
                fontSize: '18px',
                fontWeight: '600',
                color: DESIGN_TOKENS.colors.textPrimary
              }}
            >
              {title}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
