import React from 'react'
import { X, MapPin, Calendar, Heart, Users, Plane, Train, CheckCircle, Clock, AlertCircle } from 'lucide-react'

interface TripBottomSheetProps {
  isOpen: boolean
  onClose: () => void
  type: 'days' | 'cities' | 'saved' | 'people' | 'flight' | 'train' | 'visa'
  data?: any
}

export const TripBottomSheet: React.FC<TripBottomSheetProps> = ({
  isOpen,
  onClose,
  type,
  data
}) => {
  if (!isOpen) return null

  const renderContent = () => {
    switch (type) {
      case 'days':
        return (
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">8 days</h2>
            <p className="text-gray-400 mb-6">Crafted for your rhythm</p>
            
            <div className="space-y-4">
              {data?.cities?.map((city: any, idx: number) => (
                <div key={city.city_id} className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-white font-semibold">{city.city_name}</h3>
                    <span className="text-yellow-200 text-sm">{city.days} days</span>
                  </div>
                  <div className="relative pt-2">
                    <div className="overflow-hidden h-2 text-xs flex rounded-full bg-gray-700">
                      <div 
                        style={{ width: `${(city.days / 8) * 100}%` }}
                        className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-yellow-200 transition-all duration-1000"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )

      case 'cities':
        return (
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">3 cities</h2>
            <p className="text-gray-400 mb-6">Tokyo · Kyoto · Osaka</p>
            
            <div className="space-y-3">
              {data?.cities?.map((city: any) => (
                <div key={city.city_id} className="bg-gray-800/50 rounded-xl p-4 border border-gray-700 flex items-center gap-3">
                  <MapPin size={20} className="text-yellow-200" />
                  <div className="flex-1">
                    <p className="text-white font-semibold">{city.city_name}</p>
                    <p className="text-gray-400 text-sm">{city.vibe}</p>
                  </div>
                  <button className="text-gray-400 hover:text-white text-sm">
                    Edit
                  </button>
                </div>
              ))}
            </div>
            
            <button className="w-full mt-4 bg-yellow-200 hover:bg-yellow-300 text-black font-semibold py-3 rounded-full transition-colors">
              Add another city
            </button>
          </div>
        )

      case 'saved':
        return (
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">12 saved</h2>
            <p className="text-gray-400 mb-6">Your inspirations so far</p>
            
            <div className="flex gap-2 mb-6">
              {['All', 'Activities', 'Cafés', 'Stays'].map(filter => (
                <button 
                  key={filter}
                  className="px-4 py-2 bg-gray-800 hover:bg-gray-750 text-white text-sm rounded-full border border-gray-700 transition-colors"
                >
                  {filter}
                </button>
              ))}
            </div>
            
            <div className="space-y-3">
              <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-medium">6 Activities</p>
                    <p className="text-gray-400 text-sm">Temples, walks, experiences</p>
                  </div>
                  <Heart size={20} className="text-red-400 fill-red-400" />
                </div>
              </div>
              <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-medium">4 Cafés</p>
                    <p className="text-gray-400 text-sm">Coffee shops, restaurants</p>
                  </div>
                  <Heart size={20} className="text-red-400 fill-red-400" />
                </div>
              </div>
              <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-medium">2 Stays</p>
                    <p className="text-gray-400 text-sm">Hotels, accommodations</p>
                  </div>
                  <Heart size={20} className="text-red-400 fill-red-400" />
                </div>
              </div>
            </div>
          </div>
        )

      case 'people':
        return (
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">2 travelers</h2>
            <p className="text-gray-400 mb-6">Who's joining this adventure</p>
            
            <div className="space-y-3 mb-6">
              <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700 flex items-center gap-3">
                <div className="w-12 h-12 bg-yellow-200 rounded-full flex items-center justify-center text-black font-bold">
                  JD
                </div>
                <div className="flex-1">
                  <p className="text-white font-semibold">John Doe</p>
                  <p className="text-gray-400 text-sm">Trip organizer</p>
                </div>
              </div>
              <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700 flex items-center gap-3">
                <div className="w-12 h-12 bg-purple-400 rounded-full flex items-center justify-center text-white font-bold">
                  AS
                </div>
                <div className="flex-1">
                  <p className="text-white font-semibold">Alex Smith</p>
                  <p className="text-gray-400 text-sm">Co-traveler</p>
                </div>
              </div>
            </div>
            
            <button className="w-full bg-yellow-200 hover:bg-yellow-300 text-black font-semibold py-3 rounded-full transition-colors">
              Invite to plan with you
            </button>
          </div>
        )

      case 'flight':
        return (
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Your Flight</h2>
            <p className="text-gray-400 mb-6">Home → Tokyo</p>
            
            <div className="space-y-4">
              <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
                <div className="flex items-center gap-3 mb-3">
                  <Plane size={20} className="text-yellow-200" />
                  <p className="text-white font-semibold">Japan Airlines JL5</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-400 text-xs mb-1">Departure</p>
                    <p className="text-white text-sm">SFO · 11:00 AM</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs mb-1">Arrival</p>
                    <p className="text-white text-sm">NRT · 2:00 PM (+1)</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs mb-1">Duration</p>
                    <p className="text-white text-sm">11h 00m</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs mb-1">Status</p>
                    <p className="text-green-400 text-sm flex items-center gap-1">
                      <CheckCircle size={14} />
                      Confirmed
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-blue-900/20 border border-blue-500/30 rounded-xl p-4">
                <p className="text-blue-300 text-sm">
                  ✈️ Your flight allows online check-in in 4 hours
                </p>
              </div>
            </div>
            
            <button className="w-full mt-4 bg-yellow-200 hover:bg-yellow-300 text-black font-semibold py-3 rounded-full transition-colors">
              Check-in via Airline
            </button>
          </div>
        )

      case 'train':
        return (
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Your Train</h2>
            <p className="text-gray-400 mb-6">Tokyo → Kyoto</p>
            
            <div className="space-y-4">
              <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
                <div className="flex items-center gap-3 mb-3">
                  <Train size={20} className="text-yellow-200" />
                  <p className="text-white font-semibold">Nozomi Shinkansen</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-400 text-xs mb-1">Departure</p>
                    <p className="text-white text-sm">Tokyo · 9:00 AM</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs mb-1">Arrival</p>
                    <p className="text-white text-sm">Kyoto · 11:15 AM</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs mb-1">Duration</p>
                    <p className="text-white text-sm">2h 15m</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs mb-1">Seat</p>
                    <p className="text-white text-sm">Car 5, 12A</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-purple-900/20 border border-purple-500/30 rounded-xl p-4">
                <p className="text-purple-300 text-sm">
                  🗻 Expect views of Mt. Fuji on the right side
                </p>
              </div>
            </div>
            
            <button className="w-full mt-4 bg-yellow-200 hover:bg-yellow-300 text-black font-semibold py-3 rounded-full transition-colors">
              Show QR Ticket
            </button>
          </div>
        )

      case 'visa':
        return (
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Visa & Entry</h2>
            <p className="text-gray-400 mb-6">Japan requirements</p>
            
            <div className="space-y-3 mb-6">
              <div className="bg-green-900/20 border border-green-500/30 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <CheckCircle size={24} className="text-green-400" />
                  <div>
                    <p className="text-white font-semibold">Visa-free entry</p>
                    <p className="text-gray-400 text-sm">US passport holders can stay up to 90 days</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
                <p className="text-white font-medium mb-2">Entry requirements:</p>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li className="flex items-start gap-2">
                    <span>✓</span>
                    <span>Valid passport (6+ months validity)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>✓</span>
                    <span>Return flight ticket</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>✓</span>
                    <span>Proof of accommodation</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <button className="w-full bg-yellow-200 hover:bg-yellow-300 text-black font-semibold py-3 rounded-full transition-colors">
              Everything's ready ✓
            </button>
          </div>
        )

      default:
        return null
    }
  }

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
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 p-2 hover:bg-gray-800 rounded-full transition-colors"
          >
            <X size={20} className="text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {renderContent()}
        </div>
      </div>
    </div>
  )
}
