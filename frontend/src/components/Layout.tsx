import React from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { Compass, MapPin } from 'lucide-react'

export const Layout: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()

  const isActivePath = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/')
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Main Content */}
      <div className="flex-1 overflow-auto pb-16">
        <Outlet />
      </div>

      {/* Bottom Navigation - Original Style */}
      <div className="fixed bottom-0 left-0 right-0 bg-black border-t border-gray-800 px-4 py-2">
        <div className="flex items-center justify-around max-w-md mx-auto">
          <button
            onClick={() => navigate('/')}
            className={`flex flex-col items-center py-2 px-4 transition-colors ${
              location.pathname === '/'
                ? 'text-yellow-200' 
                : 'text-gray-400'
            }`}
          >
            <Compass size={24} />
            <span className="text-xs mt-1 font-medium">Explore</span>
          </button>
          
          <button
            onClick={() => navigate('/trip')}
            className={`flex flex-col items-center py-2 px-4 transition-colors ${
              isActivePath('/trip')
                ? 'text-yellow-200' 
                : 'text-gray-400'
            }`}
          >
            <MapPin size={24} />
            <span className="text-xs mt-1 font-medium">Your Trip</span>
          </button>
        </div>
      </div>
    </div>
  )
}