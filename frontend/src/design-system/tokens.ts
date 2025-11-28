// ============================================================================
// VERSO DESIGN SYSTEM TOKENS
// Version: 1.0
// All measurements in pixels unless specified
// ============================================================================

export const DESIGN_TOKENS = {
  // ============================================================================
  // GRID & SPACING
  // ============================================================================
  grid: {
    horizontalMargin: 24,
    contentWidth: 'calc(100vw - 48px)',
    verticalRhythm: {
      major: 20, // Between major sections
      minor: 12  // Between minor elements
    }
  },

  // ============================================================================
  // CORNER RADIUS
  // ============================================================================
  radius: {
    card: 16,
    thumbnail: 8,
    chip: 8,
    pill: 26
  },

  // ============================================================================
  // SHADOW & ELEVATION
  // ============================================================================
  shadow: {
    default: '0 4px 20px rgba(0, 0, 0, 0.16)',
    pill: '0 6px 24px rgba(0, 0, 0, 0.2)'
  },

  // ============================================================================
  // TYPOGRAPHY
  // ============================================================================
  typography: {
    h1: {
      size: '26px',
      weight: '700',
      lineHeight: '1.2'
    },
    sectionHeader: {
      size: '17px',
      weight: '600',
      lineHeight: '1.3'
    },
    bodyEmphasis: {
      size: '16px',
      weight: '600',
      lineHeight: '1.4'
    },
    bodyRegular: {
      size: '15px',
      weight: '400',
      lineHeight: '1.4'
    },
    metadata: {
      size: '13px',
      weight: '400',
      lineHeight: '1.3',
      opacity: '0.7'
    },
    tagChip: {
      size: '13px',
      weight: '600',
      lineHeight: '1.2'
    }
  },

  // ============================================================================
  // COLORS
  // ============================================================================
  colors: {
    // Neutrals
    textPrimary: '#FFFFFF',
    textMuted: '#BDBDBD',
    background: '#0B0B0B',
    cardBackground: '#0F1112',
    
    // Primary
    accentGold: '#F4D479',
    
    // Vault Types
    tripsBlue: '#3B82F6',
    cityGemsGold: '#D6AD60',
    foodRose: '#D97A8E',
    adventuresGreen: '#5DAE70',
    wishlistsAmber: '#C2702E',
    
    // Special
    creatorPurple: '#7D5FBF',
    liveRed: '#F56565'
  },

  // ============================================================================
  // VAULT ACCENT COLORS
  // ============================================================================
  vaultColors: {
    trips: {
      accent: '#3B82F6',
      background: 'rgba(59, 130, 246, 0.12)',
      border: 'rgba(59, 130, 246, 0.2)'
    },
    city_gems: {
      accent: '#D6AD60',
      background: 'rgba(214, 173, 96, 0.12)',
      border: 'rgba(214, 173, 96, 0.2)'
    },
    food_drink: {
      accent: '#D97A8E',
      background: 'rgba(217, 122, 142, 0.12)',
      border: 'rgba(217, 122, 142, 0.2)'
    },
    adventures: {
      accent: '#5DAE70',
      background: 'rgba(93, 174, 112, 0.12)',
      border: 'rgba(93, 174, 112, 0.2)'
    },
    wishlists: {
      accent: '#C2702E',
      background: 'rgba(194, 112, 46, 0.12)',
      border: 'rgba(194, 112, 46, 0.2)'
    }
  },

  // ============================================================================
  // MOTION
  // ============================================================================
  motion: {
    parallaxSpeed: 0.6,
    headerCollapse: {
      duration: 300,
      easing: 'cubic-bezier(0.22, 0.9, 0.18, 1)'
    },
    cardScale: {
      duration: 140,
      easing: 'ease-out',
      scale: 0.98
    },
    bottomSheet: {
      duration: 320,
      easing: 'cubic-bezier(0.22, 0.9, 0.18, 1)',
      snapPoints: [0.6, 1.0]
    },
    sectionExpand: {
      duration: 240,
      translateY: 12
    },
    chipPress: {
      duration: 160
    },
    swipeThreshold: 0.4, // 40% of card width
    swipeAction: {
      duration: 220
    }
  },

  // ============================================================================
  // DIMENSIONS
  // ============================================================================
  dimensions: {
    heroHeightMax: 260,
    heroHeightMin: 128,
    collapseScrollThreshold: 120,
    ctaPillHeight: 52,
    ctaBottomMargin: 20,
    minTouchTarget: 44,
    avatarSize: 28,
    avatarOverlap: -8
  }
} as const

// ============================================================================
// TYPE HELPERS
// ============================================================================
export type VaultType = 'trips' | 'city_gems' | 'food_drink' | 'adventures' | 'wishlists'
