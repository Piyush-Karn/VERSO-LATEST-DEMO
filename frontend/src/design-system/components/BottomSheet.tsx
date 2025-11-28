import React, { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import { DESIGN_TOKENS } from '../tokens'

interface BottomSheetProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  height?: number // 0-1 representing percentage
}

export const BottomSheet: React.FC<BottomSheetProps> = ({
  isOpen,
  onClose,
  title,
  children,
  height = DESIGN_TOKENS.motion.bottomSheet.snapPoints[0]
}) => {
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  if (!isOpen && !isAnimating) return null

  const sheetHeight = `${height * 100}vh`

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 transition-opacity"
        style={{
          background: 'rgba(0, 0, 0, 0.6)',
          opacity: isOpen ? 1 : 0,
          transitionDuration: `${DESIGN_TOKENS.motion.bottomSheet.duration}ms`,
          transitionTimingFunction: DESIGN_TOKENS.motion.bottomSheet.easing
        }}
        onClick={onClose}
      />

      {/* Sheet */}
      <div
        className="fixed bottom-0 left-0 right-0 z-50 flex flex-col"
        style={{
          height: sheetHeight,
          maxHeight: sheetHeight,
          background: DESIGN_TOKENS.colors.cardBackground,
          borderTopLeftRadius: `${DESIGN_TOKENS.radius.card}px`,
          borderTopRightRadius: `${DESIGN_TOKENS.radius.card}px`,
          boxShadow: '0 -4px 40px rgba(0, 0, 0, 0.3)',
          transform: isOpen ? 'translateY(0)' : 'translateY(100%)',
          transition: `transform ${DESIGN_TOKENS.motion.bottomSheet.duration}ms ${DESIGN_TOKENS.motion.bottomSheet.easing}`,
          overflowY: 'auto'
        }}
        onTransitionEnd={() => {
          if (!isOpen) setIsAnimating(false)
        }}
      >
        {/* Handle Bar */}
        <div className="flex items-center justify-center py-3">
          <div
            style={{
              width: '40px',
              height: '4px',
              background: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '2px'
            }}
          />
        </div>

        {/* Header */}
        {title && (
          <div
            className="flex items-center justify-between px-6 pb-4"
            style={{
              borderBottom: '1px solid rgba(255, 255, 255, 0.06)'
            }}
          >
            <h3
              style={{
                fontSize: '20px',
                fontWeight: '600',
                color: DESIGN_TOKENS.colors.textPrimary
              }}
            >
              {title}
            </h3>
            <button
              onClick={onClose}
              className="flex items-center justify-center transition-opacity active:opacity-60"
              style={{
                width: '32px',
                height: '32px',
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '50%',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              <X size={18} color={DESIGN_TOKENS.colors.textPrimary} />
            </button>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto" style={{ padding: '20px 24px' }}>
          {children}
        </div>
      </div>
    </>
  )
}
