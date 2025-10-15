import React from 'react'
import { X, Calendar, Users, Heart } from 'lucide-react'

interface FilterModalProps {
  isOpen: boolean
  onClose: () => void
  type: 'month' | 'travel_companion'
  currentValue?: string
  onSelect: (value: string) => void
}

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

const TRAVEL_COMPANIONS = [
  { value: 'solo', label: 'Solo Travel', icon: '🧳', description: 'Exploring on your own' },
  { value: 'couple', label: 'Couple', icon: '💑', description: 'Romantic getaway' },
  { value: 'family', label: 'Family', icon: '👨‍👩‍👧‍👦', description: 'With kids and loved ones' },
  { value: 'friends', label: 'Friends', icon: '👯', description: 'Group adventure' }
]

export const FilterModal: React.FC<FilterModalProps> = ({
  isOpen,
  onClose,
  type,
  currentValue,
  onSelect
}) => {
  if (!isOpen) return null

  return (
    <div 
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="bg-gray-900 rounded-t-3xl w-full max-w-2xl max-h-[70vh] overflow-y-auto animate-slide-up border-t border-gray-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle bar */}
        <div className="sticky top-0 bg-gray-900 pt-3 pb-2 px-6 border-b border-gray-800 z-10">
          <div className="w-12 h-1.5 bg-gray-700 rounded-full mx-auto mb-4" />
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              {type === 'month' ? (
                <>
                  <Calendar size={20} className="text-yellow-200" />
                  When to travel
                </>
              ) : (
                <>
                  <Users size={20} className="text-yellow-200" />
                  Traveling with
                </>
              )}
            </h2>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-800 rounded-full transition-colors"
            >
              <X size={20} className="text-gray-400" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {type === 'month' ? (
            <div className="grid grid-cols-3 gap-3">
              {MONTHS.map((month) => (
                <button
                  key={month}
                  onClick={() => {
                    onSelect(month)
                    onClose()
                  }}
                  className={`p-4 rounded-xl text-center transition-all ${
                    currentValue === month
                      ? 'bg-yellow-200 text-black font-semibold scale-105'
                      : 'bg-gray-800 text-white hover:bg-gray-750 border border-gray-700'
                  }`}
                >
                  {month}
                </button>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {TRAVEL_COMPANIONS.map((companion) => (
                <button
                  key={companion.value}
                  onClick={() => {
                    onSelect(companion.value)
                    onClose()
                  }}
                  className={`w-full p-4 rounded-xl text-left transition-all flex items-center gap-4 ${
                    currentValue === companion.value
                      ? 'bg-yellow-200 text-black scale-[1.02]'
                      : 'bg-gray-800 text-white hover:bg-gray-750 border border-gray-700'
                  }`}
                >
                  <span className="text-3xl">{companion.icon}</span>
                  <div className="flex-1">
                    <p className={`font-semibold ${currentValue === companion.value ? 'text-black' : 'text-white'}`}>
                      {companion.label}
                    </p>
                    <p className={`text-sm ${currentValue === companion.value ? 'text-gray-700' : 'text-gray-400'}`}>
                      {companion.description}
                    </p>
                  </div>
                  {currentValue === companion.value && (
                    <Heart size={20} className="text-red-500 fill-red-500" />
                  )}
                </button>
              ))}
            </div>
          )}

          {/* Clear filter */}
          {currentValue && (
            <button
              onClick={() => {
                onSelect('')
                onClose()
              }}
              className="w-full mt-4 py-3 rounded-full border-2 border-gray-700 text-gray-400 hover:border-gray-600 hover:text-gray-300 transition-colors"
            >
              Clear filter
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
