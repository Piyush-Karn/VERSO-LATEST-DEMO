import React from 'react'
import { DESIGN_TOKENS } from '../tokens'

interface VaultCardProps {
  title: string
  image: string
  metadata?: string
  tagLabel?: string
  tagColor?: string
  tagBackground?: string
  avatars?: string[]
  onClick?: () => void
}

export const VaultCard: React.FC<VaultCardProps> = ({
  title,
  image,
  metadata,
  tagLabel,
  tagColor,
  tagBackground,
  avatars,
  onClick
}) => {
  return (
    <div
      onClick={onClick}
      className="cursor-pointer transition-transform active:scale-98"
      style={{
        background: DESIGN_TOKENS.colors.cardBackground,
        borderRadius: `${DESIGN_TOKENS.radius.card}px`,
        overflow: 'hidden',
        boxShadow: DESIGN_TOKENS.shadow.default,
        transitionDuration: `${DESIGN_TOKENS.motion.cardScale.duration}ms`,
        transitionTimingFunction: DESIGN_TOKENS.motion.cardScale.easing
      }}
    >
      {/* Hero Image */}
      <div
        className="relative overflow-hidden"
        style={{ height: '180px' }}
      >
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover"
          style={{ filter: 'contrast(1.05)' }}
        />
        {/* Vignette */}
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0, 0, 0, 0.2) 100%)'
          }}
        />
      </div>

      {/* Content */}
      <div style={{ padding: '18px' }}>
        <h3
          style={{
            fontSize: '18px',
            fontWeight: '600',
            lineHeight: '1.3',
            color: DESIGN_TOKENS.colors.textPrimary,
            marginBottom: '8px',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}
        >
          {title}
        </h3>

        {metadata && (
          <p
            style={{
              fontSize: DESIGN_TOKENS.typography.metadata.size,
              fontWeight: DESIGN_TOKENS.typography.metadata.weight,
              color: DESIGN_TOKENS.colors.textMuted,
              opacity: DESIGN_TOKENS.typography.metadata.opacity,
              marginBottom: '12px'
            }}
          >
            {metadata}
          </p>
        )}

        <div className="flex items-center justify-between">
          {tagLabel && (
            <div
              className="px-3 py-1.5"
              style={{
                background: tagBackground || 'rgba(255, 255, 255, 0.1)',
                color: tagColor || DESIGN_TOKENS.colors.textPrimary,
                borderRadius: `${DESIGN_TOKENS.radius.chip}px`,
                fontSize: DESIGN_TOKENS.typography.tagChip.size,
                fontWeight: DESIGN_TOKENS.typography.tagChip.weight
              }}
            >
              {tagLabel}
            </div>
          )}

          {avatars && avatars.length > 0 && (
            <div className="flex items-center" style={{ marginLeft: 'auto' }}>
              {avatars.slice(0, 3).map((avatar, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-center"
                  style={{
                    width: `${DESIGN_TOKENS.dimensions.avatarSize}px`,
                    height: `${DESIGN_TOKENS.dimensions.avatarSize}px`,
                    borderRadius: '50%',
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '2px solid ' + DESIGN_TOKENS.colors.cardBackground,
                    marginLeft: idx > 0 ? `${DESIGN_TOKENS.dimensions.avatarOverlap}px` : '0',
                    fontSize: '14px'
                  }}
                >
                  {avatar}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
