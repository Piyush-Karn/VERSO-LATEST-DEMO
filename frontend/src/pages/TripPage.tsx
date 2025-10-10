import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchCountries, type CountrySummary } from '../api/client'
import { getCachedImage } from '../services/imageCache'
import { THUMB_JAPAN, THUMB_BALI, THUMB_GOA } from '../assets/imagesBase64'

const staticThumb: Record<string, string> = { Japan: THUMB_JAPAN, Bali: THUMB_BALI, Goa: THUMB_GOA }

const queryForCountry = (c: string) => {
  if (c === 'Bali') return 'Bali turquoise beach aerial'
  if (c === 'Japan') return 'Japan mountain lake sunrise'
  if (c === 'Goa') return 'Goa beach sunset palm trees'
  return `${c} travel landscape`
}

export const TripPage: React.FC = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [countries, setCountries] = useState<CountrySummary[]>([])
  const [thumbs, setThumbs] = useState<Record<string, string>>({})
  const [showContributors, setShowContributors] = useState(false)
  const [selectedCountry, setSelectedCountry] = useState<string>('')

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        const data = await fetchCountries()
        setCountries(data)
        
        const results = await Promise.all(
          data.map(async (c) => ({ key: c.country, val: await getCachedImage(queryForCountry(c.country)) }))
        )
        const next: Record<string, string> = {}
        results.forEach((r) => { if (r.val) next[r.key] = r.val })
        setThumbs(next)
      } catch (error) {
        console.error('Failed to load trip data:', error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const handleCountrySelect = (country: string) => {
    navigate(`/trip/questionnaire?country=${encodeURIComponent(country)}`)
  }

  return (
    <div className="flex-1 bg-black text-white min-h-screen">
      {/* Collections Prompt */}
      <div className="p-4 pt-6">
        <h1 className="text-xl font-semibold mb-2">Ready to plan?</h1>
        <p className="text-gray-400 mb-6">
          Choose a collection below to build your trip from your saved inspirations
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600"></div>
        </div>
      ) : (
        <div className="px-4 space-y-4 pb-20">
          {countries.map((c) => {
            const base64 = thumbs[c.country] || staticThumb[c.country] || THUMB_JAPAN
            return (
              <div key={c.country} className="relative bg-gray-900 rounded-2xl overflow-hidden border border-gray-800">
                {base64 && (
                  <div className="relative h-32 overflow-hidden">
                    <img 
                      src={base64.startsWith('data:') ? base64 : `data:image/jpeg;base64,${base64}`}
                      alt={c.country}
                      className="w-full h-full object-cover opacity-60"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
                  </div>
                )}
                
                <div className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h2 className="text-lg font-semibold text-white">{c.country}</h2>
                      <p className="text-gray-400 text-sm">{c.count} inspirations</p>
                    </div>
                    <button 
                      onClick={() => {
                        setSelectedCountry(c.country)
                        setShowContributors(true)
                      }}
                      className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center text-sm border border-gray-700"
                    >
                      👥
                    </button>
                  </div>
                  
                  <div className="flex gap-3">
                    <button 
                      onClick={() => navigate('/')}
                      className="flex-1 bg-gray-800 text-white font-medium py-2.5 rounded-lg border border-gray-700 text-sm"
                    >
                      Review Collection
                    </button>
                    <button 
                      onClick={() => handleCountrySelect(c.country)}
                      className="flex-1 bg-yellow-200 text-black font-semibold py-2.5 rounded-lg flex items-center justify-center gap-2 text-sm"
                    >
                      <span>✈️</span>
                      Plan Trip
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Contributors Modal */}
      {showContributors && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end z-50">
          <div className="w-full bg-gray-900 rounded-t-2xl p-6 border-t border-gray-700">
            <div className="w-12 h-1 bg-gray-600 rounded-full mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-4">Contributors to {selectedCountry}</h3>
            
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                  A
                </div>
                <div>
                  <p className="text-white font-medium">Alex</p>
                  <p className="text-gray-400 text-sm">5 inspirations</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                  S
                </div>
                <div>
                  <p className="text-white font-medium">Sarah</p>
                  <p className="text-gray-400 text-sm">3 inspirations</p>
                </div>
              </div>
            </div>
            
            <button 
              onClick={() => setShowContributors(false)}
              className="w-full bg-gray-800 text-white py-3 rounded-lg border border-gray-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}