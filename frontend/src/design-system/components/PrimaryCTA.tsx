import React from 'react'
import { DESIGN_TOKENS } from '../tokens'

interface PrimaryCTAProps {
  label: string
  onClick: () => void
  icon?: React.ReactNode
}

export const PrimaryCTA: React.FC<PrimaryCTAProps> = ({ label, onClick, icon }) => {
  return (
    <div
      className="fixed bottom-0 left-0 right-0 flex items-center justify-center"
      style={{
        padding: `0 ${DESIGN_TOKENS.grid.horizontalMargin}px`,
        paddingBottom: '90px',
        pointerEvents: 'none',
        zIndex: 999
      }}
    >
      <button
        onClick={onClick}
        className="w-full flex items-center justify-center gap-2 transition-all active:scale-98"
        style={{
          height: `${DESIGN_TOKENS.dimensions.ctaPillHeight}px`,
          background: DESIGN_TOKENS.colors.accentGold,
          color: '#000',
          borderRadius: `${DESIGN_TOKENS.radius.pill}px`,
          fontSize: '16px',
          fontWeight: '600',
          border: 'none',
          boxShadow: DESIGN_TOKENS.shadow.pill,
          pointerEvents: 'auto',
          cursor: 'pointer'
        }}
      >
        {icon}
        <span>{label}</span>
      </button>
    </div>
  )
}
