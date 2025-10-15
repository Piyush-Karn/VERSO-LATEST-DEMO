import React, { useEffect, useState } from 'react'
import QRCode from 'qrcode'

export const QRCodePage: React.FC = () => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('')
  
  // Get the app URL from environment
  const appUrl = window.location.origin
  
  useEffect(() => {
    // Generate QR code
    QRCode.toDataURL(appUrl, {
      width: 300,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    }).then(url => {
      setQrDataUrl(url)
    })
  }, [appUrl])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-8">
      <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-lg w-full text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Verso Travel App
        </h1>
        <p className="text-gray-600 mb-8">
          Scan this QR code with your mobile device to access the app
        </p>
        
        {qrDataUrl && (
          <div className="bg-white p-6 rounded-2xl border-4 border-gray-200 inline-block mb-6">
            <img src={qrDataUrl} alt="QR Code" className="w-full h-auto" />
          </div>
        )}
        
        <div className="bg-gray-100 rounded-xl p-4 mb-6">
          <p className="text-sm text-gray-500 mb-2">Or visit directly:</p>
          <a 
            href={appUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 font-mono text-sm break-all"
          >
            {appUrl}
          </a>
        </div>

        <div className="text-left space-y-3 text-sm text-gray-600">
          <p className="flex items-start gap-2">
            <span className="text-green-500 font-bold">✓</span>
            <span>Works on any mobile browser (Safari, Chrome, etc.)</span>
          </p>
          <p className="flex items-start gap-2">
            <span className="text-green-500 font-bold">✓</span>
            <span>Swipe navigation for activities and cafes</span>
          </p>
          <p className="flex items-start gap-2">
            <span className="text-green-500 font-bold">✓</span>
            <span>Desktop: Use arrow keys or mouse drag to navigate</span>
          </p>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <a
            href="/"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-full transition-all"
          >
            Launch App
          </a>
        </div>
      </div>
    </div>
  )
}
