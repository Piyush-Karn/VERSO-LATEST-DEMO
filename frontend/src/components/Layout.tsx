import React from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { Compass, MapPin, Sparkles, FolderHeart } from 'lucide-react'

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

      {/* Bottom Navigation - 4 Tabs */}
      <div className="fixed bottom-0 left-0 right-0 bg-black border-t border-gray-800 px-2 py-2 z-[100]">
        <div className="flex items-center justify-around max-w-md mx-auto">
          <button
            onClick={() => navigate('/')}
            className={`flex flex-col items-center py-2 px-2 transition-colors ${
              location.pathname === '/'
                ? 'text-yellow-200' 
                : 'text-gray-400'
            }`}
          >
            <Compass size={22} />
            <span className="text-xs mt-1 font-medium">Explore</span>
          </button>
          
          <button
            onClick={() => navigate('/collections')}
            className={`flex flex-col items-center py-2 px-2 transition-colors ${
              isActivePath('/collections')
                ? 'text-yellow-200' 
                : 'text-gray-400'
            }`}
          >
            <FolderHeart size={22} />
            <span className="text-xs mt-1 font-medium">Collections</span>
          </button>

          <button
            onClick={() => navigate('/trip')}
            className={`flex flex-col items-center py-2 px-2 transition-colors ${
              isActivePath('/trip')
                ? 'text-yellow-200' 
                : 'text-gray-400'
            }`}
          >
            <MapPin size={22} />
            <span className="text-xs mt-1 font-medium">Your Trip</span>
          </button>

          <button
            onClick={() => navigate('/ask-verso')}
            className={`flex flex-col items-center py-2 px-2 transition-colors ${
              isActivePath('/ask-verso')
                ? 'text-yellow-200' 
                : 'text-gray-400'
            }`}
          >
            <Sparkles size={22} />
            <span className="text-xs mt-1 font-medium">Ask Verso</span>
          </button>
        </div>
      </div>
    </div>
  )
}