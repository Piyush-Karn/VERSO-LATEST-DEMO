import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, Calendar, MapPin, Check } from 'lucide-react'
import { DESIGN_TOKENS } from '../design-system/tokens'

interface TripData {
  start_date?: string
  end_date?: string
  dates_flexible: boolean
  flex_window_days?: number
  duration?: string
  traveling_with: string[]
  trip_style: string[]
  flight_preference?: string
  stay_preferences: string[]
  dietary_needs: string[]
  dietary_notes?: string
  start_city?: string
  end_city?: string
  special_requests: string[]
  special_notes?: string
}

export const TripPlanningQuestionnaire: React.FC = () => {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  
  const [tripData, setTripData] = useState<TripData>({
    dates_flexible: false,
    traveling_with: [],
    trip_style: [],
    stay_preferences: [],
    dietary_needs: [],
    special_requests: []
  })

  const totalSteps = tripData.dates_flexible ? 11 : 10

  const updateData = (updates: Partial<TripData>) => {
    setTripData(prev => ({ ...prev, ...updates }))
  }

  const handleNext = () => {
    // Skip duration screen if dates are specific
    if (currentStep === 2 && !tripData.dates_flexible) {
      setCurrentStep(4)
    } else if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep === 1) {
      navigate(-1)
    } else if (currentStep === 4 && !tripData.dates_flexible) {
      setCurrentStep(2)
    } else {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Save to localStorage
    const existingTrips = JSON.parse(localStorage.getItem('userTrips') || '[]')
    const newTrip = {
      id: Date.now().toString(),
      ...tripData,
      created_at: new Date().toISOString(),
      vault_name: 'Southeast Asia Adventure'
    }
    localStorage.setItem('userTrips', JSON.stringify([newTrip, ...existingTrips]))
    
    setShowSuccess(true)
    
    // Wait for animation then redirect
    setTimeout(() => {
      navigate('/trip/home')
    }, 1800)
  }

  const renderProgress = () => (
    <div className="flex items-center justify-center gap-2 py-4">
      {Array.from({ length: totalSteps }).map((_, idx) => (
        <div
          key={idx}
          style={{
            width: idx + 1 === currentStep ? '24px' : '6px',
            height: '6px',
            borderRadius: '3px',
            background: idx + 1 <= currentStep ? DESIGN_TOKENS.colors.accentGold : 'rgba(255, 255, 255, 0.2)',
            transition: 'all 300ms ease'
          }}
        />
      ))}
    </div>
  )

  const renderScreen = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="flex flex-col items-center justify-center" style={{ minHeight: '60vh' }}>
            <h1 style={{ fontSize: '32px', fontWeight: '700', color: DESIGN_TOKENS.colors.textPrimary, marginBottom: '16px', textAlign: 'center' }}>
              Plan your trip
            </h1>
            <p style={{ fontSize: '17px', color: DESIGN_TOKENS.colors.textMuted, textAlign: 'center', maxWidth: '300px' }}>
              Answer a few quick questions — takes under 2 minutes.
            </p>
          </div>
        )

      case 2:
        return (
          <div>
            <h2 style={{ fontSize: '24px', fontWeight: '700', color: DESIGN_TOKENS.colors.textPrimary, marginBottom: '24px' }}>
              When are you traveling?
            </h2>
            <div className="space-y-4">
              <div className="flex gap-3">
                <input
                  type="date"
                  value={tripData.start_date || ''}
                  onChange={(e) => updateData({ start_date: e.target.value })}
                  disabled={tripData.dates_flexible}
                  style={{ flex: 1, padding: '14px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '12px', color: DESIGN_TOKENS.colors.textPrimary, fontSize: '15px' }}
                />
                <input
                  type="date"
                  value={tripData.end_date || ''}
                  onChange={(e) => updateData({ end_date: e.target.value })}
                  disabled={tripData.dates_flexible}
                  style={{ flex: 1, padding: '14px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '12px', color: DESIGN_TOKENS.colors.textPrimary, fontSize: '15px' }}
                />
              </div>
              <button
                onClick={() => updateData({ dates_flexible: !tripData.dates_flexible })}
                style={{ width: '100%', padding: '14px', background: tripData.dates_flexible ? DESIGN_TOKENS.vaultColors.trips.background : 'rgba(255, 255, 255, 0.05)', border: `1px solid ${tripData.dates_flexible ? DESIGN_TOKENS.vaultColors.trips.border : 'rgba(255, 255, 255, 0.1)'}`, borderRadius: '12px', color: tripData.dates_flexible ? DESIGN_TOKENS.vaultColors.trips.accent : DESIGN_TOKENS.colors.textPrimary, fontSize: '15px', fontWeight: '500' }}
              >
                Dates flexible
              </button>
              {tripData.dates_flexible && (
                <select
                  value={tripData.flex_window_days || 7}
                  onChange={(e) => updateData({ flex_window_days: Number(e.target.value) })}
                  style={{ width: '100%', padding: '14px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '12px', color: DESIGN_TOKENS.colors.textPrimary, fontSize: '15px' }}
                >
                  <option value={3}>±3 days</option>
                  <option value={7}>±7 days</option>
                  <option value={14}>±14 days</option>
                </select>
              )}
            </div>
          </div>
        )

      case 3:
        return (
          <div>
            <h2 style={{ fontSize: '24px', fontWeight: '700', color: DESIGN_TOKENS.colors.textPrimary, marginBottom: '24px' }}>
              How long is this trip?
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {['Weekend (1–3 days)', 'Short break (4–7 days)', '1–2 weeks', '2+ weeks', 'Not sure'].map((option) => (
                <button
                  key={option}
                  onClick={() => updateData({ duration: option })}
                  style={{ padding: '16px', background: tripData.duration === option ? DESIGN_TOKENS.vaultColors.trips.background : 'rgba(255, 255, 255, 0.05)', border: `1px solid ${tripData.duration === option ? DESIGN_TOKENS.vaultColors.trips.border : 'rgba(255, 255, 255, 0.1)'}`, borderRadius: '12px', color: tripData.duration === option ? DESIGN_TOKENS.vaultColors.trips.accent : DESIGN_TOKENS.colors.textPrimary, fontSize: '15px', fontWeight: '500', textAlign: 'center', cursor: 'pointer', gridColumn: option === 'Not sure' ? 'span 2' : 'span 1' }}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        )

      case 4:
        return (
          <div>
            <h2 style={{ fontSize: '24px', fontWeight: '700', color: DESIGN_TOKENS.colors.textPrimary, marginBottom: '24px' }}>
              Who are you traveling with?
            </h2>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Solo', emoji: '🧍' },
                { label: 'Partner', emoji: '👫' },
                { label: 'Friends', emoji: '🧑‍🤝‍🧑' },
                { label: 'Family', emoji: '👨‍👩‍👧' },
                { label: 'Kids', emoji: '👶' },
                { label: 'Pet', emoji: '🐾' }
              ].map((option) => {
                const isSelected = tripData.traveling_with.includes(option.label)
                return (
                  <button
                    key={option.label}
                    onClick={() => {
                      const updated = isSelected
                        ? tripData.traveling_with.filter(t => t !== option.label)
                        : [...tripData.traveling_with, option.label]
                      updateData({ traveling_with: updated })
                    }}
                    style={{ padding: '20px 12px', background: isSelected ? DESIGN_TOKENS.vaultColors.trips.background : 'rgba(255, 255, 255, 0.05)', border: `1px solid ${isSelected ? DESIGN_TOKENS.vaultColors.trips.border : 'rgba(255, 255, 255, 0.1)'}`, borderRadius: '12px', color: isSelected ? DESIGN_TOKENS.vaultColors.trips.accent : DESIGN_TOKENS.colors.textPrimary, fontSize: '13px', fontWeight: '500', textAlign: 'center', cursor: 'pointer' }}
                  >
                    <div style={{ fontSize: '28px', marginBottom: '8px' }}>{option.emoji}</div>
                    {option.label}
                  </button>
                )
              })}
            </div>
          </div>
        )

      case 5:
        return (
          <div>
            <h2 style={{ fontSize: '24px', fontWeight: '700', color: DESIGN_TOKENS.colors.textPrimary, marginBottom: '24px' }}>
              What's the vibe of this trip?
            </h2>
            <div className="flex flex-wrap gap-3">
              {['Relaxed', 'Adventure', 'Food & Drink', 'Culture', 'Romance', 'Workcation'].map((option) => {
                const isSelected = tripData.trip_style.includes(option)
                return (
                  <button
                    key={option}
                    onClick={() => {
                      const updated = isSelected
                        ? tripData.trip_style.filter(t => t !== option)
                        : [...tripData.trip_style, option]
                      updateData({ trip_style: updated })
                    }}
                    style={{ padding: '14px 20px', background: isSelected ? DESIGN_TOKENS.vaultColors.trips.background : 'rgba(255, 255, 255, 0.05)', border: `1px solid ${isSelected ? DESIGN_TOKENS.vaultColors.trips.border : 'rgba(255, 255, 255, 0.1)'}`, borderRadius: '20px', color: isSelected ? DESIGN_TOKENS.vaultColors.trips.accent : DESIGN_TOKENS.colors.textPrimary, fontSize: '15px', fontWeight: '500', cursor: 'pointer' }}
                  >
                    {option}
                  </button>
                )
              })}
            </div>
          </div>
        )

      case 6:
        return (
          <div>
            <h2 style={{ fontSize: '24px', fontWeight: '700', color: DESIGN_TOKENS.colors.textPrimary, marginBottom: '24px' }}>
              Your flight preference
            </h2>
            <div className="space-y-3">
              {['Economy', 'Flexible dates / balanced', 'Direct flights only', 'Premium / Business'].map((option) => (
                <button
                  key={option}
                  onClick={() => updateData({ flight_preference: option })}
                  style={{ width: '100%', padding: '16px', background: tripData.flight_preference === option ? DESIGN_TOKENS.vaultColors.trips.background : 'rgba(255, 255, 255, 0.05)', border: `1px solid ${tripData.flight_preference === option ? DESIGN_TOKENS.vaultColors.trips.border : 'rgba(255, 255, 255, 0.1)'}`, borderRadius: '12px', color: tripData.flight_preference === option ? DESIGN_TOKENS.vaultColors.trips.accent : DESIGN_TOKENS.colors.textPrimary, fontSize: '15px', fontWeight: '500', textAlign: 'left', cursor: 'pointer' }}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        )

      case 7:
        return (
          <div>
            <h2 style={{ fontSize: '24px', fontWeight: '700', color: DESIGN_TOKENS.colors.textPrimary, marginBottom: '24px' }}>
              Preferred type of stays
            </h2>
            <div className="flex flex-wrap gap-3">
              {['Budget hotels', 'Boutique hotels', 'Apartments', 'Luxury stays', 'Homestays'].map((option) => {
                const isSelected = tripData.stay_preferences.includes(option)
                return (
                  <button
                    key={option}
                    onClick={() => {
                      const updated = isSelected
                        ? tripData.stay_preferences.filter(t => t !== option)
                        : [...tripData.stay_preferences, option]
                      updateData({ stay_preferences: updated })
                    }}
                    style={{ padding: '14px 20px', background: isSelected ? DESIGN_TOKENS.vaultColors.trips.background : 'rgba(255, 255, 255, 0.05)', border: `1px solid ${isSelected ? DESIGN_TOKENS.vaultColors.trips.border : 'rgba(255, 255, 255, 0.1)'}`, borderRadius: '20px', color: isSelected ? DESIGN_TOKENS.vaultColors.trips.accent : DESIGN_TOKENS.colors.textPrimary, fontSize: '15px', fontWeight: '500', cursor: 'pointer' }}
                  >
                    {option}
                  </button>
                )
              })}
            </div>
          </div>
        )

      case 8:
        return (
          <div>
            <h2 style={{ fontSize: '24px', fontWeight: '700', color: DESIGN_TOKENS.colors.textPrimary, marginBottom: '24px' }}>
              Any dietary or accessibility needs?
            </h2>
            <div className="flex flex-wrap gap-3 mb-4">
              {['Vegetarian', 'Vegan', 'Halal', 'Gluten-free', 'Nut allergy', 'No Restrictions'].map((option) => {
                const isSelected = tripData.dietary_needs.includes(option)
                return (
                  <button
                    key={option}
                    onClick={() => {
                      const updated = isSelected
                        ? tripData.dietary_needs.filter(t => t !== option)
                        : [...tripData.dietary_needs, option]
                      updateData({ dietary_needs: updated })
                    }}
                    style={{ padding: '14px 20px', background: isSelected ? DESIGN_TOKENS.vaultColors.trips.background : 'rgba(255, 255, 255, 0.05)', border: `1px solid ${isSelected ? DESIGN_TOKENS.vaultColors.trips.border : 'rgba(255, 255, 255, 0.1)'}`, borderRadius: '20px', color: isSelected ? DESIGN_TOKENS.vaultColors.trips.accent : DESIGN_TOKENS.colors.textPrimary, fontSize: '15px', fontWeight: '500', cursor: 'pointer' }}
                  >
                    {option}
                  </button>
                )
              })}
            </div>
            <textarea
              placeholder="Anything else?"
              value={tripData.dietary_notes || ''}
              onChange={(e) => updateData({ dietary_notes: e.target.value })}
              style={{ width: '100%', padding: '14px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '12px', color: DESIGN_TOKENS.colors.textPrimary, fontSize: '15px', minHeight: '80px', resize: 'vertical' }}
            />
          </div>
        )

      case 9:
        return (
          <div>
            <h2 style={{ fontSize: '24px', fontWeight: '700', color: DESIGN_TOKENS.colors.textPrimary, marginBottom: '24px' }}>
              Where are you starting and ending?
            </h2>
            <div className="space-y-4">
              <div>
                <label style={{ display: 'block', fontSize: '14px', color: DESIGN_TOKENS.colors.textMuted, marginBottom: '8px' }}>Start city</label>
                <select
                  value={tripData.start_city || ''}
                  onChange={(e) => updateData({ start_city: e.target.value })}
                  style={{ width: '100%', padding: '14px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '12px', color: DESIGN_TOKENS.colors.textPrimary, fontSize: '15px' }}
                >
                  <option value="">Select city</option>
                  <option value="Bangkok">Bangkok</option>
                  <option value="Chiang Mai">Chiang Mai</option>
                  <option value="Hanoi">Hanoi</option>
                  <option value="Siem Reap">Siem Reap</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '14px', color: DESIGN_TOKENS.colors.textMuted, marginBottom: '8px' }}>End city (optional)</label>
                <select
                  value={tripData.end_city || tripData.start_city || ''}
                  onChange={(e) => updateData({ end_city: e.target.value })}
                  style={{ width: '100%', padding: '14px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '12px', color: DESIGN_TOKENS.colors.textPrimary, fontSize: '15px' }}
                >
                  <option value="">Same as start</option>
                  <option value="Bangkok">Bangkok</option>
                  <option value="Chiang Mai">Chiang Mai</option>
                  <option value="Hanoi">Hanoi</option>
                  <option value="Siem Reap">Siem Reap</option>
                </select>
              </div>
            </div>
          </div>
        )

      case 10:
        return (
          <div>
            <h2 style={{ fontSize: '24px', fontWeight: '700', color: DESIGN_TOKENS.colors.textPrimary, marginBottom: '24px' }}>
              Any special requests?
            </h2>
            <div className="flex flex-wrap gap-3 mb-4">
              {['Slow pace', 'Max sightseeing', 'Local guide', 'Restaurant reservations', 'Relaxation days'].map((option) => {
                const isSelected = tripData.special_requests.includes(option)
                return (
                  <button
                    key={option}
                    onClick={() => {
                      const updated = isSelected
                        ? tripData.special_requests.filter(t => t !== option)
                        : [...tripData.special_requests, option]
                      updateData({ special_requests: updated })
                    }}
                    style={{ padding: '14px 20px', background: isSelected ? DESIGN_TOKENS.vaultColors.trips.background : 'rgba(255, 255, 255, 0.05)', border: `1px solid ${isSelected ? DESIGN_TOKENS.vaultColors.trips.border : 'rgba(255, 255, 255, 0.1)'}`, borderRadius: '20px', color: isSelected ? DESIGN_TOKENS.vaultColors.trips.accent : DESIGN_TOKENS.colors.textPrimary, fontSize: '15px', fontWeight: '500', cursor: 'pointer' }}
                  >
                    {option}
                  </button>
                )
              })}
            </div>
            <textarea
              placeholder="Notes (optional)"
              value={tripData.special_notes || ''}
              onChange={(e) => updateData({ special_notes: e.target.value })}
              style={{ width: '100%', padding: '14px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '12px', color: DESIGN_TOKENS.colors.textPrimary, fontSize: '15px', minHeight: '80px', resize: 'vertical' }}
            />
          </div>
        )

      case 11:
        return (
          <div>
            <h2 style={{ fontSize: '24px', fontWeight: '700', color: DESIGN_TOKENS.colors.textPrimary, marginBottom: '24px' }}>
              Ready to plan?
            </h2>
            <div style={{ background: 'rgba(255, 255, 255, 0.03)', borderRadius: '16px', padding: '20px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <div className="space-y-3" style={{ fontSize: '14px', color: DESIGN_TOKENS.colors.textMuted }}>
                {tripData.start_date && <div><strong style={{ color: DESIGN_TOKENS.colors.textPrimary }}>Dates:</strong> {tripData.start_date} to {tripData.end_date}</div>}
                {tripData.dates_flexible && <div><strong style={{ color: DESIGN_TOKENS.colors.textPrimary }}>Flexibility:</strong> ±{tripData.flex_window_days} days</div>}
                {tripData.duration && <div><strong style={{ color: DESIGN_TOKENS.colors.textPrimary }}>Duration:</strong> {tripData.duration}</div>}
                {tripData.traveling_with.length > 0 && <div><strong style={{ color: DESIGN_TOKENS.colors.textPrimary }}>Traveling with:</strong> {tripData.traveling_with.join(', ')}</div>}
                {tripData.trip_style.length > 0 && <div><strong style={{ color: DESIGN_TOKENS.colors.textPrimary }}>Vibe:</strong> {tripData.trip_style.join(', ')}</div>}
                {tripData.start_city && <div><strong style={{ color: DESIGN_TOKENS.colors.textPrimary }}>Route:</strong> {tripData.start_city} → {tripData.end_city || tripData.start_city}</div>}
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  if (showSuccess) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center" style={{ background: DESIGN_TOKENS.colors.background }}>
        <div className="text-center">
          <div style={{ fontSize: '64px', marginBottom: '24px', animation: 'scaleIn 420ms cubic-bezier(0.34, 1.56, 0.64, 1)' }}>
            📍
          </div>
          <h2 style={{ fontSize: '24px', fontWeight: '700', color: DESIGN_TOKENS.colors.textPrimary, marginBottom: '12px', animation: 'fadeIn 300ms ease-in 200ms both' }}>
            Nice — building your trip!
          </h2>
          <div style={{ display: 'inline-block', width: '40px', height: '40px', border: '3px solid rgba(255, 255, 255, 0.1)', borderTop: `3px solid ${DESIGN_TOKENS.colors.accentGold}`, borderRadius: '50%', animation: 'spin 700ms linear infinite' }} />
        </div>
        <style>{`
          @keyframes scaleIn {
            0% { transform: scale(0); }
            50% { transform: scale(1.1); }
            100% { transform: scale(1); }
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ background: DESIGN_TOKENS.colors.background, paddingBottom: '120px' }}>
      {/* Header */}
      <div className="sticky top-0 z-10" style={{ background: DESIGN_TOKENS.colors.background, borderBottom: '1px solid rgba(255, 255, 255, 0.06)', padding: '16px 24px' }}>
        <div className="flex items-center justify-between">
          <button onClick={handleBack} style={{ background: 'none', border: 'none', padding: '8px', cursor: 'pointer' }}>
            <ChevronLeft size={24} color={DESIGN_TOKENS.colors.textPrimary} />
          </button>
          <span style={{ fontSize: '13px', color: DESIGN_TOKENS.colors.textMuted }}>{currentStep} of {totalSteps}</span>
        </div>
      </div>

      {/* Progress Dots */}
      {renderProgress()}

      {/* Content */}
      <div style={{ padding: '24px', maxWidth: '500px', margin: '0 auto' }}>
        {renderScreen()}
      </div>

      {/* CTA */}
      <div className="fixed bottom-0 left-0 right-0" style={{ padding: '0 24px 32px', background: `linear-gradient(to top, ${DESIGN_TOKENS.colors.background} 70%, transparent)`, zIndex: 999 }}>
        <button
          onClick={currentStep === totalSteps ? handleSubmit : handleNext}
          disabled={isSubmitting}
          style={{ width: '100%', height: '52px', background: DESIGN_TOKENS.colors.accentGold, color: '#000', borderRadius: '26px', fontSize: '16px', fontWeight: '600', border: 'none', boxShadow: DESIGN_TOKENS.shadow.pill, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
        >
          {isSubmitting ? (
            <div style={{ width: '20px', height: '20px', border: '2px solid rgba(0, 0, 0, 0.2)', borderTop: '2px solid #000', borderRadius: '50%', animation: 'spin 600ms linear infinite' }} />
          ) : currentStep === totalSteps ? (
            'Create Trip'
          ) : (
            'Continue'
          )}
        </button>
      </div>
    </div>
  )
}
