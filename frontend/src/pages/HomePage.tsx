import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchCountries, type CountrySummary } from '../api/client'
import { getCachedImage } from '../services/imageCache'
import { seedIfNeeded } from '../demo/seed'
import { THUMB_JAPAN, THUMB_BALI, THUMB_GOA } from '../assets/imagesBase64'

const staticThumb: Record<string, string> = { Japan: THUMB_JAPAN, Bali: THUMB_BALI, Goa: THUMB_GOA }

const queryForCountry = (c: string) => {
  if (c === 'Bali') return 'Bali turquoise beach aerial'
  if (c === 'Japan') return 'Japan mountain lake sunrise'
  if (c === 'Goa') return 'Goa beach sunset palm trees'
  return `${c} travel landscape`
}

export const HomePage: React.FC = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [countries, setCountries] = useState<CountrySummary[]>([])
  const [thumbs, setThumbs] = useState<Record<string, string>>({})
  const [picked, setPicked] = useState<string | null>(null)
  const tries = useRef(0)
  const polling = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    seedIfNeeded()
    const run = async () => {
      try {
        setLoading(true)
        const data = await fetchCountries()
        setCountries(data)
        if (data.length === 0 && tries.current < 10) {
          tries.current += 1
          polling.current = setTimeout(run, 2000)
        } else {
          const results = await Promise.all(
            data.map(async (c) => ({ key: c.country, val: await getCachedImage(queryForCountry(c.country)) }))
          )
          const next: Record<string, string> = {}
          results.forEach((r) => { if (r.val) next[r.key] = r.val })
          setThumbs(next)
        }
      } catch (e: any) {
        setError(e?.message || 'Failed to load')
      } finally {
        setLoading(false)
      }
    }
    run()
    return () => { if (polling.current) clearTimeout(polling.current) }
  }, [])

  const countryNames = useMemo(() => countries.map((c) => c.country), [countries])

  const onPick = (c: string) => setPicked(c)
  const onNavigate = () => { if (picked) navigate(`/organize/${encodeURIComponent(picked)}?focus=1`) }
  const onCardPress = (c: string) => onPick(c)

  return (
    <div className="flex-1 bg-black text-white min-h-screen">
      {/* Header */}
      <div className="pt-6 px-4 pb-2">
        <h1 className="text-white text-xl font-semibold">Hello, Explorer</h1>
        <p className="text-gray-400 mt-1">
          {countries.reduce((a, c) => a + c.count, 0)} Collections saved across {countries.length} Countries
        </p>
        <div className="flex gap-2 mt-2">
          <button 
            onClick={() => navigate('/organize/interests')} 
            className="border border-gray-700 rounded-full px-3 py-1.5 text-xs text-gray-300"
          >
            Your Interests
          </button>
          {picked && (
            <button 
              onClick={() => setPicked(null)} 
              className="border border-gray-700 rounded-full px-3 py-1.5 text-xs text-gray-300"
            >
              Back to all
            </button>
          )}
        </div>
      </div>

      {/* Map Placeholder - Original Style */}
      <div className="flex justify-center py-2">
        <div className="w-80 h-40 bg-gray-900 rounded-lg border border-gray-800 overflow-hidden relative">
          {/* SVG Map Placeholder */}
          <svg width="100%" height="100%" viewBox="0 0 320 160" className="text-gray-600">
            {/* Simple world map outline */}
            <path d="M50,80 Q80,60 120,70 Q160,50 200,65 Q240,55 280,70 L280,120 Q240,110 200,115 Q160,125 120,115 Q80,105 50,110 Z" 
                  fill="none" stroke="currentColor" strokeWidth="1" opacity="0.3"/>
            {/* Country pins */}
            {countryNames.map((country, i) => (
              <circle key={country} 
                     cx={80 + i * 60} 
                     cy={80} 
                     r="3" 
                     fill="#e6e1d9" 
                     className={`cursor-pointer ${picked === country ? 'fill-yellow-400' : ''}`}
                     onClick={() => onPick(country)}
              />
            ))}
          </svg>
          {picked && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <span className="text-gray-300 text-sm">Focused on {picked}</span>
            </div>
          )}
        </div>
      </div>

      {loading ? (
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600 mx-auto"></div>
            <p className="text-gray-400 text-xs mt-3 text-center">
              If this is your first load, we are priming demo content. This can take ~20–40s.
            </p>
          </div>
        </div>
      ) : error ? (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-red-400">{error}</p>
        </div>
      ) : (
        <div className="flex-1 px-4">
          <h2 className="text-gray-300 text-base mb-2">Your Collections</h2>
          <div className="space-y-3 pb-20">
            {countries.map((c) => {
              const base64 = thumbs[c.country] || staticThumb[c.country] || THUMB_JAPAN
              const dim = picked && c.country !== picked
              return (
                <div
                  key={c.country}
                  className={`transition-opacity duration-300 ${dim ? 'opacity-35' : 'opacity-100'}`}
                >
                  <button
                    onClick={() => onCardPress(c.country)}
                    className="w-full flex items-center bg-gray-900 rounded-2xl p-3 gap-3 border border-gray-800"
                  >
                    {base64 ? (
                      <img 
                        src={base64.startsWith('data:') ? base64 : `data:image/jpeg;base64,${base64}`}
                        alt={c.country}
                        className="w-20 h-20 rounded-xl object-cover bg-gray-800"
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-xl bg-gray-800 animate-pulse" />
                    )}
                    <div className="flex-1 text-left">
                      <h3 className={`text-lg font-semibold ${dim ? 'text-gray-600' : 'text-white'}`}>
                        {c.country}
                      </h3>
                      <p className={`mt-1 ${dim ? 'text-gray-700' : 'text-gray-400'}`}>
                        {c.count} Inspirations
                      </p>
                    </div>
                    <span className={`text-2xl ${dim ? 'text-gray-700' : 'text-gray-400'}`}>›</span>
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {picked ? (
        <div className="fixed bottom-20 left-4 right-4">
          <button 
            onClick={onNavigate}
            className="w-full bg-yellow-200 hover:bg-yellow-100 text-black font-bold py-4 rounded-full transition-colors"
          >
            Take me to {picked}
          </button>
        </div>
      ) : (
        <button 
          onClick={() => navigate('/add')}
          className="fixed bottom-24 right-4 w-14 h-14 bg-yellow-200 hover:bg-yellow-100 rounded-full flex items-center justify-center text-black text-2xl font-semibold shadow-lg transition-colors"
        >
          +
        </button>
      )}
    </div>
  )
}