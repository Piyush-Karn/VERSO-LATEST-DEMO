// ============================================================================
// MOCK DATA FOR ALL 5 VAULT TYPES
// ============================================================================

export interface City {
  id: string
  name: string
  image: string
  inspirationsCount: number
}

export interface Experience {
  id: string
  title: string
  image: string
  category: string
  saved: boolean
}

export interface Neighbourhood {
  id: string
  name: string
  vibe: string
}

export interface Gem {
  id: string
  name: string
  image: string
  neighbourhood: string
  category: string
  distance: string
  visited: boolean
}

export interface FoodCategory {
  id: string
  name: string
  count: number
  emoji: string
}

export interface FoodItem {
  id: string
  name: string
  image: string
  category: string
  mood: string
  priceRange: string
}

export interface AdventureSpot {
  id: string
  name: string
  image: string
  skillLevel: 'Beginner' | 'Intermediate' | 'Advanced'
  metadata: string
  season: string
}

export interface DreamBoard {
  id: string
  title: string
  images: string[]
  theme: string
  vibe: string
}

// ============================================================================
// TRIPS MOCK DATA
// ============================================================================
export const TRIPS_MOCK = {
  id: '1',
  name: 'Southeast Asia Adventure',
  type: 'trips' as const,
  countryEmoji: '🌏',
  duration: '14 days',
  bestMonth: 'November - February',
  description: 'Explore the vibrant cities, temples, and beaches across Thailand, Vietnam, and Cambodia.',
  saved: 32,
  people: 3,
  heroImage: '',
  cities: [
    {
      id: 'c1',
      name: 'Bangkok',
      image: '',
      inspirationsCount: 12
    },
    {
      id: 'c2',
      name: 'Chiang Mai',
      image: '',
      inspirationsCount: 8
    },
    {
      id: 'c3',
      name: 'Hanoi',
      image: '',
      inspirationsCount: 7
    },
    {
      id: 'c4',
      name: 'Siem Reap',
      image: '',
      inspirationsCount: 5
    }
  ] as City[],
  experiences: [
    {
      id: 'e1',
      title: 'Sunrise at Angkor Wat',
      image: '',
      category: 'Heritage',
      saved: true
    },
    {
      id: 'e2',
      title: 'Floating Markets Tour',
      image: '',
      category: 'Cultural',
      saved: true
    },
    {
      id: 'e3',
      title: 'Night Market Food Crawl',
      image: '',
      category: 'Food',\n      saved: false\n    },\n    {\n      id: 'e4',\n      title: 'Thai Cooking Class',\n      image: '',\n      category: 'Experience',\n      saved: true\n    }\n  ] as Experience[]\n}\n\n// ============================================================================\n// CITY GEMS MOCK DATA\n// ============================================================================\nexport const CITY_GEMS_MOCK = {\n  id: '2',\n  name: 'Mumbai Hidden Cafés',\n  type: 'city_gems' as const,\n  countryEmoji: '🇮🇳',\n  description: 'Discover quiet corners and hidden gems across Mumbai\\'s neighbourhoods.',\n  saved: 24,\n  people: 1,\n  heroImage: '',\n  neighbourhoods: [\n    { id: 'n1', name: 'Bandra West', vibe: 'Trendy & Artsy' },\n    { id: 'n2', name: 'Colaba', vibe: 'Historic Charm' },\n    { id: 'n3', name: 'Khar', vibe: 'Quiet Corners' },\n    { id: 'n4', name: 'Lower Parel', vibe: 'Modern & Hip' }\n  ] as Neighbourhood[],\n  gems: [\n    {\n      id: 'g1',\n      name: 'The Pantry',\n      image: '',\n      neighbourhood: 'Bandra West',\n      category: 'Café',\n      distance: '1.2 km',\n      visited: false\n    },\n    {\n      id: 'g2',\n      name: 'Theobroma',\n      image: '',\n      neighbourhood: 'Colaba',\n      category: 'Bakery',\n      distance: '2.5 km',\n      visited: true\n    },\n    {\n      id: 'g3',\n      name: 'Prithvi Café',\n      image: '',\n      neighbourhood: 'Bandra West',\n      category: 'Café',\n      distance: '1.8 km',\n      visited: false\n    },\n    {\n      id: 'g4',\n      name: 'Candies',\n      image: '',\n      neighbourhood: 'Bandra West',\n      category: 'Café',\n      distance: '1.5 km',\n      visited: false\n    }\n  ] as Gem[]\n}\n\n// ============================================================================\n// FOOD & DRINK MOCK DATA\n// ============================================================================\nexport const FOOD_DRINK_MOCK = {\n  id: '3',\n  name: 'Japan Food Crawl',\n  type: 'food_drink' as const,\n  countryEmoji: '🇯🇵',\n  description: 'From hidden ramen shops to Michelin-starred sushi, explore Tokyo\\'s culinary landscape.',\n  saved: 18,\n  people: 2,\n  heroImage: '',\n  cuisines: ['Ramen', 'Sushi', 'Izakaya', 'Street Food', 'Dessert'],\n  categories: [\n    { id: 'cat1', name: 'Ramen Spots', count: 6, emoji: '🍜' },\n    { id: 'cat2', name: 'Sushi Bars', count: 4, emoji: '🍣' },\n    { id: 'cat3', name: 'Street Food', count: 5, emoji: '🍢' },\n    { id: 'cat4', name: 'Late-Night Eats', count: 3, emoji: '🌙' }\n  ] as FoodCategory[],\n  items: [\n    {\n      id: 'f1',\n      name: 'Ichiran Ramen',\n      image: '',\n      category: 'Ramen',\n      mood: 'Solo friendly',\n      priceRange: '¥¥'\n    },\n    {\n      id: 'f2',\n      name: 'Tsukiji Outer Market',\n      image: '',\n      category: 'Street Food',\n      mood: 'Morning vibes',\n      priceRange: '¥'\n    },\n    {\n      id: 'f3',\n      name: 'Sushi Saito',\n      image: '',\n      category: 'Sushi',\n      mood: 'Special occasion',\n      priceRange: '¥¥¥¥'\n    },\n    {\n      id: 'f4',\n      name: 'Omoide Yokocho',\n      image: '',\n      category: 'Izakaya',\n      mood: 'Late-night',\n      priceRange: '¥¥'\n    }\n  ] as FoodItem[]\n}\n\n// ============================================================================\n// ADVENTURES MOCK DATA\n// ============================================================================\nexport const ADVENTURES_MOCK = {\n  id: '4',\n  name: 'Maldives Scuba & Dive',\n  type: 'adventures' as const,\n  countryEmoji: '🏝️',\n  description: 'Explore vibrant coral reefs, manta rays, and underwater caves in crystal-clear waters.',\n  saved: 15,\n  people: 2,\n  heroImage: '',\n  skillLevels: ['Beginner', 'Intermediate', 'Advanced'],\n  seasons: [\n    { id: 's1', name: 'Dry Season', months: 'Nov - Apr', description: 'Best visibility' },\n    { id: 's2', name: 'Wet Season', months: 'May - Oct', description: 'Manta season' }\n  ],\n  spots: [\n    {\n      id: 'sp1',\n      name: 'HP Reef',\n      image: '',\n      skillLevel: 'Intermediate' as const,\n      metadata: 'Depth 20-30m · Visibility 25m',\n      season: 'Year-round'\n    },\n    {\n      id: 'sp2',\n      name: 'Manta Point',\n      image: '',\n      skillLevel: 'Beginner' as const,\n      metadata: 'Depth 5-15m · Visibility 20m',\n      season: 'May - Nov'\n    },\n    {\n      id: 'sp3',\n      name: 'Shark Point',\n      image: '',\n      skillLevel: 'Advanced' as const,\n      metadata: 'Depth 25-40m · Strong currents',\n      season: 'Dec - Apr'\n    }\n  ] as AdventureSpot[],\n  gearChecklist: [\n    { id: 'gear1', item: 'Dive computer', checked: true },\n    { id: 'gear2', item: 'Underwater camera', checked: false },\n    { id: 'gear3', item: 'Dive light', checked: true },\n    { id: 'gear4', item: 'SMB & reel', checked: false }\n  ]\n}\n\n// ============================================================================\n// WISHLISTS MOCK DATA\n// ============================================================================\nexport const WISHLISTS_MOCK = {\n  id: '5',\n  name: 'European Summer Dreams',\n  type: 'wishlists' as const,\n  countryEmoji: '✨',\n  description: 'Sun-drenched coastlines, cobblestone villages, and golden hour magic across Europe.',\n  saved: 28,\n  people: 1,\n  heroImage: '',\n  themes: ['Beach', 'Village', 'Culture', 'Photography'],\n  dreamBoards: [\n    {\n      id: 'db1',\n      title: 'Santorini Sunset',\n      images: ['', '', ''],\n      theme: 'Beach',\n      vibe: 'Dreamy sunset over white-washed houses'\n    },\n    {\n      id: 'db2',\n      title: 'Cinque Terre Colors',\n      images: ['', '', ''],\n      theme: 'Village',\n      vibe: 'Pastel villages perched on cliffsides'\n    },\n    {\n      id: 'db3',\n      title: 'Amalfi Coast Drive',\n      images: ['', '', ''],\n      theme: 'Photography',\n      vibe: 'Winding coastal roads and lemon groves'\n    }\n  ] as DreamBoard[],\n  timeline: [\n    { id: 't1', date: 'Added 2 weeks ago', text: 'Saved Positano cliffside villa' },\n    { id: 't2', date: 'Added 1 month ago', text: 'Bookmarked Dubrovnik old town' },\n    { id: 't3', date: 'Added 2 months ago', text: 'Added Greek island hopping route' }\n  ]\n}\n