import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Layout } from './components/Layout'
import { ExplorePageCinematic } from './pages/ExplorePageCinematic'
import { CountryOverviewPage } from './pages/CountryOverviewPage'
import { VaultViewPage } from './pages/VaultViewPage'
import { CollectionsHomePage } from './pages/CollectionsHomePage'
import { VaultDetailPage } from './pages/VaultDetailPage'
import { CityFeedView } from './pages/CityFeedView'
import { TripPageSimple } from './pages/TripPageSimple'
import { TripHomePage } from './pages/TripHomePage'
import { QuestionnaireStepByStep } from './pages/QuestionnaireStepByStep'
import { ItineraryPage } from './pages/ItineraryPage'
import { InterestsPage } from './pages/InterestsPage'
import { AddPage } from './pages/AddPage'
import { QRCodePage } from './pages/QRCodePage'
import { NeighborhoodDetailPage } from './pages/NeighborhoodDetailPage'
import { NeighborhoodsHomePage } from './pages/NeighborhoodsHomePage'
import { CityDetailPage } from './pages/CityDetailPage'
import { TripPlanningPage } from './pages/TripPlanningPage'
import { TripCompanionFlow } from './pages/TripCompanionFlow'
import { TripCompanionFlowPhase1 } from './pages/TripCompanionFlowPhase1'
import { DynamicTripSummary } from './pages/DynamicTripSummary'
import { CityExplorationPage } from './pages/CityExplorationPage'
import { OnboardingFlowRedesign } from './pages/OnboardingFlowRedesign'
import { CinematicItinerary } from './pages/CinematicItinerary'
import { VersoItinerary } from './pages/VersoItinerary'
import { TripsVaultPremium } from './pages/vaults/TripsVaultPremium'
import { CityGemsVault } from './pages/vaults/CityGemsVault'
import { FoodDrinkVault } from './pages/vaults/FoodDrinkVault'
import { AdventuresVault } from './pages/vaults/AdventuresVault'
import { WishlistsVault } from './pages/vaults/WishlistsVault'
import { TripPlanningQuestionnaire } from './pages/TripPlanningQuestionnaire'

// Simple Ask Verso placeholder
const AskVersoPage = () => (
  <div className="flex-1 bg-black text-white min-h-screen flex items-center justify-center p-4">
    <div className="text-center max-w-md">
      <div className="text-6xl mb-4">✨</div>
      <h1 className="text-3xl font-bold mb-4">Ask Verso</h1>
      <p className="text-gray-400 mb-6">
        Your AI travel companion is coming soon. Ask anything about your trips, get recommendations, and plan seamlessly.
      </p>
      <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
        <p className="text-sm text-gray-500">Example questions:</p>
        <ul className="text-left text-sm text-gray-400 mt-2 space-y-1">
          <li>• "Plan a 5-day trip to Tokyo"</li>
          <li>• "Best cafés in Bali for remote work"</li>
          <li>• "When should I visit Italy?"</li>
        </ul>
      </div>
    </div>
  </div>
)

function App() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Routes>
        {/* Main Layout Routes */}
        <Route path="/" element={<Layout />}>
          <Route index element={<ExplorePageCinematic />} />
          <Route path="country/:countryName" element={<CountryOverviewPage />} />
          <Route path="collections" element={<CollectionsHomePage />} />
          <Route path="vault" element={<CollectionsHomePage />} />
          <Route path="vault/:vaultId" element={<VaultDetailPage />} />
          <Route path="vault/:vaultId/city/:cityName" element={<CityFeedView />} />
          <Route path="vault/:vaultId/category/:categoryName" element={<CityFeedView />} />
          <Route path="city/:country/:cityName" element={<CityDetailPage />} />
          <Route path="neighbourhoods/:city" element={<NeighborhoodsHomePage />} />
          <Route path="neighborhood/:city/:neighborhoodId" element={<NeighborhoodDetailPage />} />
          <Route path="trip" element={<TripHomePage />} />
          <Route path="trip/:tripId" element={<TripPlanningPage />} />
          <Route path="trip/questionnaire" element={<QuestionnaireStepByStep />} />
          <Route path="trip/create" element={<TripCompanionFlowPhase1 />} />
          <Route path="trip/summary/:summaryId" element={<DynamicTripSummary />} />
          <Route path="trip/city/:cityId" element={<CityExplorationPage />} />
          <Route path="onboarding" element={<OnboardingFlowRedesign />} />
          <Route path="itinerary/:tripId" element={<CinematicItinerary />} />
          {/* Legacy route - redirect to unified trip planning page */}
          <Route path="trip/itinerary" element={<Navigate to="/trip/1" replace />} />
          {/* Vault Interior Pages */}
          <Route path="vault/1" element={<FoodDrinkVault />} />
          <Route path="vault/2" element={<CityGemsVault />} />
          <Route path="vault/3" element={<TripsVaultPremium />} />
          <Route path="vault/4" element={<AdventuresVault />} />
          <Route path="vault/5" element={<WishlistsVault />} />
          <Route path="ask-verso" element={<AskVersoPage />} />
          <Route path="organize/interests" element={<InterestsPage />} />
          <Route path="add" element={<AddPage />} />
        </Route>

        {/* QR Code Page (outside Layout) */}
        <Route path="/qr" element={<QRCodePage />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}

export default App