import React, { useState, useEffect } from 'react';
import { store } from './services/store';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { NotificationDrawer } from './components/notifications/NotificationDrawer';
import { RailSaarthiDrawer } from './components/assistant/RailSaarthiDrawer';
import { ToastContainer, toast } from './components/common/Toast';
import { ConfirmationModal } from './components/common/ConfirmationModal';
import { AccessDenied } from './components/common/AccessDenied';

// Pages
import { LoginPage } from './pages/LoginPage';
import { ControlDashboard } from './pages/dashboards/ControlDashboard';
import { EngineeringDashboard } from './pages/dashboards/EngineeringDashboard';
import { TrdDashboard } from './pages/dashboards/TrdDashboard';
import { SntDashboard } from './pages/dashboards/SntDashboard';
import { SeniorReviewerDashboard } from './pages/dashboards/SeniorReviewerDashboard';
import { AdminDashboard } from './pages/dashboards/AdminDashboard';
import { RequestInboxPage } from './pages/requests/RequestInboxPage';
import { NewRequestWizard } from './pages/requests/NewRequestWizard';
import { RequestDetailPage } from './pages/requests/RequestDetailPage';
import { PuneDivisionMapPage } from './pages/map/PuneDivisionMapPage';
import { AssetRegisterPage } from './pages/assets/AssetRegisterPage';
import { AIPriorityWorkbenchPage } from './pages/ai/AIPriorityWorkbenchPage';
import { BlockPlanningWorkspacePage } from './pages/blocks/BlockPlanningWorkspacePage';
import { WeeklyPlanPage } from './pages/blocks/WeeklyPlanPage';
import { MonthlyPlanPage } from './pages/blocks/MonthlyPlanPage';
import { WeatherIntelligencePage } from './pages/weather/WeatherIntelligencePage';
import { WhatIfSimulatorPage } from './pages/simulator/WhatIfSimulatorPage';
import { AnalyticsReportsPage } from './pages/analytics/AnalyticsReportsPage';
import { DataIntegrationPage } from './pages/integration/DataIntegrationPage';
import { AuditLogPage } from './pages/audit/AuditLogPage';
import { NotificationsPage } from './pages/notifications/NotificationsPage';

import { Bot, Sparkles } from 'lucide-react';

export const App: React.FC = () => {
  const [stateVersion, setStateVersion] = useState(0);
  const [currentPath, setCurrentPath] = useState<string>('/');
  const [selectedRequestId, setSelectedRequestId] = useState<string>('');
  const [isNotifDrawerOpen, setIsNotifDrawerOpen] = useState<boolean>(false);
  const [isRailSaarthiOpen, setIsRailSaarthiOpen] = useState<boolean>(false);
  const [showResetModal, setShowResetModal] = useState<boolean>(false);

  // Subscribe to central reactive store
  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      setStateVersion(v => v + 1);
    });
    return unsubscribe;
  }, []);

  const state = store.getState();
  const currentUser = state.currentUser;

  // If no user is authenticated, redirect to Login
  if (!currentUser || currentPath === '/login') {
    return (
      <>
        <LoginPage onLoginSuccess={() => setCurrentPath('/')} />
        <ToastContainer />
      </>
    );
  }

  const role = currentUser.role;

  // Navigation helper
  const handleNavigate = (path: string) => {
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectRequest = (reqId: string) => {
    setSelectedRequestId(reqId);
    setCurrentPath(`/requests/${reqId}`);
  };

  // RBAC Route Evaluator
  const renderCurrentPage = () => {
    // 1. Dashboards
    if (currentPath === '/') {
      switch (role) {
        case 'CONTROL_OFFICE':
          return <ControlDashboard onNavigate={handleNavigate} />;
        case 'ENGINEERING':
          return <EngineeringDashboard onNavigate={handleNavigate} />;
        case 'TRD':
          return <TrdDashboard onNavigate={handleNavigate} />;
        case 'S_AND_T':
          return <SntDashboard onNavigate={handleNavigate} />;
        case 'SENIOR_REVIEWER':
          return <SeniorReviewerDashboard onNavigate={handleNavigate} />;
        case 'ADMIN':
          return <AdminDashboard onNavigate={handleNavigate} />;
      }
    }

    // 2. Request Routes
    if (currentPath === '/requests') {
      return <RequestInboxPage onNavigate={handleNavigate} onSelectRequest={handleSelectRequest} />;
    }

    if (currentPath === '/requests/new') {
      return <NewRequestWizard onNavigate={handleNavigate} />;
    }

    if (currentPath.startsWith('/requests/')) {
      const reqId = currentPath.split('/')[2] || selectedRequestId || state.requests[0]?.id;
      return <RequestDetailPage requestId={reqId} onNavigate={handleNavigate} />;
    }

    // 3. Map
    if (currentPath === '/map') {
      return <PuneDivisionMapPage onNavigate={handleNavigate} />;
    }

    // 4. Asset & Task Register
    if (currentPath === '/tasks') {
      return <AssetRegisterPage onNavigate={handleNavigate} />;
    }

    // 5. AI Priority Workbench
    if (currentPath === '/ai-workbench') {
      return <AIPriorityWorkbenchPage onNavigate={handleNavigate} />;
    }

    // 6. Block Planning Workspace
    if (currentPath === '/blocks/planning') {
      return <BlockPlanningWorkspacePage onNavigate={handleNavigate} />;
    }

    // 7. Weekly Plan
    if (currentPath === '/blocks/weekly') {
      return <WeeklyPlanPage onNavigate={handleNavigate} />;
    }

    // 8. Monthly Plan
    if (currentPath === '/blocks/monthly') {
      return <MonthlyPlanPage onNavigate={handleNavigate} />;
    }

    // 9. Weather Intelligence
    if (currentPath === '/weather') {
      return <WeatherIntelligencePage onNavigate={handleNavigate} />;
    }

    // 10. What-if Simulator
    if (currentPath === '/simulator') {
      return <WhatIfSimulatorPage />;
    }

    // 11. Analytics
    if (currentPath === '/analytics') {
      return <AnalyticsReportsPage />;
    }

    // 12. Data Integration (Admin only check)
    if (currentPath === '/data-integration') {
      if (role !== 'ADMIN' && role !== 'CONTROL_OFFICE') {
        return <AccessDenied onGoHome={() => handleNavigate('/')} requiredRole="ADMIN" />;
      }
      return <DataIntegrationPage />;
    }

    // 13. Audit Log
    if (currentPath === '/audit') {
      return <AuditLogPage />;
    }

    // 14. Notifications
    if (currentPath === '/notifications') {
      return <NotificationsPage onNavigate={handleNavigate} />;
    }

    // Fallback default
    return <ControlDashboard onNavigate={handleNavigate} />;
  };

  const handleConfirmReset = () => {
    store.resetToDemoData();
    setShowResetModal(false);
    toast.success('Reset Complete', 'Synthetic operational data restored to initial demo seeds.');
    handleNavigate('/');
  };

  return (
    <div className="min-h-screen bg-rail-bg flex text-rail-text font-sans">
      {/* Sidebar Navigation */}
      <Sidebar
        currentPath={currentPath}
        onNavigate={handleNavigate}
        onResetDemoModal={() => setShowResetModal(true)}
      />

      {/* Main Workspace Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          currentPath={currentPath}
          onNavigate={handleNavigate}
          onOpenNotifications={() => setIsNotifDrawerOpen(true)}
          onOpenRailSaarthi={() => setIsRailSaarthiOpen(true)}
        />

        {/* Page Content */}
        <main className="flex-1 pb-16">
          {renderCurrentPage()}
        </main>
      </div>

      {/* Floating RailSaarthi AI Trigger Button (Bottom Right) */}
      <button
        onClick={() => setIsRailSaarthiOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 px-4 py-3 rounded-full bg-gradient-to-r from-[#20C6B7] to-[#38BDF8] text-white font-extrabold text-xs shadow-2xl shadow-cyan-950/60 hover:scale-105 transition-all animate-bounce"
        title="RailSaarthi AI Assistant"
      >
        <Bot className="w-5 h-5" />
        <span className="hidden sm:inline">Ask RailSaarthi</span>
      </button>

      {/* Slide-out Drawers */}
      <NotificationDrawer
        isOpen={isNotifDrawerOpen}
        onClose={() => setIsNotifDrawerOpen(false)}
        onNavigate={handleNavigate}
      />

      <RailSaarthiDrawer
        isOpen={isRailSaarthiOpen}
        onClose={() => setIsRailSaarthiOpen(false)}
        onNavigate={handleNavigate}
        currentPath={currentPath}
      />

      {/* Confirmation Modal for Reset */}
      <ConfirmationModal
        isOpen={showResetModal}
        title="Reset Demo Operational Database"
        description="Are you sure you want to reset all records to the original Pune Division synthetic dataset? This will restore all default tasks, requests, weather alerts, and candidate blocks."
        confirmLabel="Reset Database Now"
        type="danger"
        onConfirm={handleConfirmReset}
        onCancel={() => setShowResetModal(false)}
      />

      {/* Global Toast Container */}
      <ToastContainer />
    </div>
  );
};
