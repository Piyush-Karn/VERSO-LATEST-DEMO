const PEXELS_API_KEY = import.meta.env.VITE_PEXELS_KEY

export interface PexelsPhoto {
  id: number
  width: number
  height: number
  url: string
  photographer: string
  photographer_url: string
  src: {
    original: string
    large2x: string
    large: string
    medium: string
    small: string
    portrait: string
    landscape: string
    tiny: string
  }
}

export async function fetchPexelsImages(query: string, perPage: number = 5): Promise<PexelsPhoto[]> {
  try {
    const response = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=${perPage}`,
      {
        headers: {
          Authorization: PEXELS_API_KEY,
        },
      }
    )

    if (!response.ok) {
      console.error('Pexels API error:', response.statusText)
      return []
    }

    const data = await response.json()
    return data.photos || []
  } catch (error) {
    console.error('Error fetching Pexels images:', error)
    return []
  }
}
