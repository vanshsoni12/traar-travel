import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Sidebar from './components/layout/Sidebar';
import TopHeader from './components/layout/TopHeader';
import ViewDetailsModal from './components/common/ViewDetailsModal';
import CompareModal from './components/common/CompareModal';
import ReportModal from './components/common/ReportModal';
import WayToModal from './components/common/WayToModal';
import ExportEstimateModal from './components/common/ExportEstimateModal';
import Toast from './components/common/Toast';

import HomePage from './pages/HomePage';
import DestinationOverviewPage from './pages/DestinationOverviewPage';
import StaysPage from './pages/StaysPage';
import FoodPage from './pages/FoodPage';
import PlacesToVisitPage from './pages/PlacesToVisitPage';
import NearbyTripsPage from './pages/NearbyTripsPage';
import MyTripPage from './pages/MyTripPage';
import ProviderDashboardPage from './pages/ProviderDashboardPage';
import AddServicePage from './pages/AddServicePage';
import HelpBoothPage from './pages/HelpBoothPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import FavouritesPage from './pages/FavouritesPage';

function MainLayout() {
  const { activePage } = useApp();

  const renderActivePage = () => {
    switch (activePage) {
      case 'home':
        return <HomePage />;
      case 'destination':
        return <DestinationOverviewPage />;
      case 'stays':
        return <StaysPage />;
      case 'food':
        return <FoodPage />;
      case 'places':
        return <PlacesToVisitPage />;
      case 'nearby':
        return <NearbyTripsPage />;
      case 'trip':
        return <MyTripPage />;
      case 'favourites':
        return <FavouritesPage />;
      case 'dashboard':
        return <ProviderDashboardPage />;
      case 'add-service':
        return <AddServicePage />;
      case 'help':
        return <HelpBoothPage />;
      case 'admin':
        return <AdminDashboardPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans antialiased text-slate-800">
      {/* Fixed Sidebar */}
      <Sidebar />

      {/* Main Content Area offset by Sidebar width on desktop (w-[235px]) */}
      <div className="flex-1 lg:pl-[235px] flex flex-col min-w-0 transition-all">
        {/* Top Header */}
        <TopHeader />

        {/* Dynamic Page Content */}
        <main className="flex-1 px-4 sm:px-8 py-6 max-w-7xl w-full mx-auto">
          {renderActivePage()}
        </main>
      </div>

      {/* Global Application Modals */}
      <ViewDetailsModal />
      <CompareModal />
      <ReportModal />
      <WayToModal />
      <ExportEstimateModal />
      <Toast />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
