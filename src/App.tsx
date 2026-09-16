import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { LandingPage } from './pages/LandingPage';
import { AuthPage } from './pages/AuthPage';
import { DashboardPage } from './pages/DashboardPage';
import { SeatLayoutPage } from './pages/SeatLayoutPage';
import { PassengerManagementPage } from './pages/PassengerManagementPage';
import { CameraConnectionPage } from './pages/CameraConnectionPage';
import { AIDetectionPage } from './pages/AIDetectionPage';
import { DriverDrowsinessPage } from './pages/DriverDrowsinessPage';
import { QRVerificationPage } from './pages/QRVerificationPage';
import { MultiLayerVerificationPage } from './pages/MultiLayerVerificationPage';
import { BoardingTimelinePage } from './pages/BoardingTimelinePage';
import { AlertCenterPage } from './pages/AlertCenterPage';
import { DriverDashboardPage } from './pages/DriverDashboardPage';
import { ConductorDashboardPage } from './pages/ConductorDashboardPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { NotificationCenterPage } from './pages/NotificationCenterPage';
import { FutureIntegrationPage } from './pages/FutureIntegrationPage';
import { SettingsPage } from './pages/SettingsPage';

const MainLayout: React.FC = () => {
  const { currentPage } = useApp();

  const renderPage = () => {
    switch (currentPage) {
      case 'landing':
        return <LandingPage />;
      case 'auth':
        return <AuthPage />;
      case 'dashboard':
        return <DashboardPage />;
      case 'seats':
        return <SeatLayoutPage />;
      case 'passengers':
        return <PassengerManagementPage />;
      case 'camera':
        return <CameraConnectionPage />;
      case 'ai-detection':
        return <AIDetectionPage />;
      case 'driver-drowsiness':
        return <DriverDrowsinessPage />;
      case 'qr-scanner':
        return <QRVerificationPage />;
      case 'multi-layer':
        return <MultiLayerVerificationPage />;
      case 'timeline':
        return <BoardingTimelinePage />;
      case 'alert-center':
        return <AlertCenterPage />;
      case 'driver-hud':
        return <DriverDashboardPage />;
      case 'conductor-app':
        return <ConductorDashboardPage />;
      case 'analytics':
        return <AnalyticsPage />;
      case 'notifications':
        return <NotificationCenterPage />;
      case 'future-hardware':
        return <FutureIntegrationPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <DashboardPage />;
    }
  };

  const isFullWidthPage = currentPage === 'landing' || currentPage === 'driver-hud';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950">
      <Navbar />

      <div className="flex-1 flex overflow-hidden">
        {!isFullWidthPage && <Sidebar />}
        
        <main className="flex-1 overflow-y-auto min-h-[calc(100vh-4rem)]">
          {renderPage()}
        </main>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
