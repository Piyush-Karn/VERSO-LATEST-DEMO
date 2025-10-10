import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Heart } from 'lucide-react'

// Mock liked items data
const mockLikedItems = [
  {
    id: '1',
    title: 'Fushimi Inari Shrine',
    location: 'Kyoto, Japan',
    category: 'Temple',
    image: '/placeholder-temple.jpg'
  },
  {
    id: '2',
    title: 'Seminyak Beach Club',
    location: 'Bali, Indonesia',
    category: 'Beach',
    image: '/placeholder-beach.jpg'
  },
  {
    id: '3',
    title: 'Arambol Beach Cafe',
    location: 'Goa, India',
    category: 'Cafe',
    image: '/placeholder-cafe.jpg'
  }
]

export const InterestsPage: React.FC = () => {
  const navigate = useNavigate()
  const [likedItems, setLikedItems] = useState(mockLikedItems)

  const handleRemoveLike = (id: string) => {
    setLikedItems(prev => prev.filter(item => item.id !== id))
  }

  return (
    <div className="flex-1 bg-black text-white min-h-screen">
      {/* Header */}
      <div className="flex items-center gap-4 p-4 border-b border-gray-800">
        <button onClick={() => navigate(-1)} className="p-2">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-bold">Your Interests</h1>
      </div>

      <div className="p-4">
        <p className="text-gray-400 mb-6">
          Items you've liked from your collections
        </p>

        {likedItems.length === 0 ? (
          <div className="text-center py-12">
            <Heart className="mx-auto mb-4 text-gray-600" size={48} />
            <h2 className="text-lg font-semibold mb-2">No interests yet</h2>
            <p className="text-gray-400 mb-6">Start exploring and like items to see them here</p>
            <button
              onClick={() => navigate('/')}
              className="bg-yellow-200 text-black px-6 py-3 rounded-full font-medium"
            >
              Explore Collections
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {likedItems.map((item) => (
              <div key={item.id} className="bg-gray-900 rounded-xl p-4 border border-gray-800">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{item.title}</h3>
                    <p className="text-gray-400 text-sm">{item.location}</p>
                    <span className="inline-block mt-2 px-2 py-1 bg-gray-800 text-xs rounded-full">
                      {item.category}
                    </span>
                  </div>
                  <button
                    onClick={() => handleRemoveLike(item.id)}
                    className="p-2 ml-4"
                  >
                    <Heart className="text-red-400 fill-current" size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}