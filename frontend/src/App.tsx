import React, { useState } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { LandingPage } from './pages/LandingPage';
import { DashboardOverview } from './pages/DashboardOverview';
import { ExpenseAnalyzer } from './pages/ExpenseAnalyzer';
import { InvoiceFraudDetector } from './pages/InvoiceFraudDetector';
import { CashFlowPredictor } from './pages/CashFlowPredictor';
import { ProfitLeakageDetector } from './pages/ProfitLeakageDetector';
import { FinancialAnalyticsBI } from './pages/FinancialAnalyticsBI';
import { RiskManagement } from './pages/RiskManagement';
import { ProcurementOptimization } from './pages/ProcurementOptimization';
import { ClientManagement } from './pages/ClientManagement';
import { AssistantChat } from './pages/AssistantChat';
import { ReportsSettings } from './pages/ReportsSettings';

export const App: React.FC = () => {
  // Default to the redesigned homepage
  const [viewMode, setViewMode] = useState<'landing' | 'dashboard'>('landing');
  const [currentView, setCurrentView] = useState<string>('overview');

  if (viewMode === 'landing') {
    return (
      <LandingPage
        onLaunchDashboard={() => {
          setViewMode('dashboard');
          setCurrentView('overview');
        }}
      />
    );
  }

  const renderView = () => {
    switch (currentView) {
      case 'overview':
        return <DashboardOverview onNavigate={setCurrentView} />;
      case 'expenses':
        return <ExpenseAnalyzer />;
      case 'invoices':
        return <InvoiceFraudDetector />;
      case 'cashflow':
        return <CashFlowPredictor />;
      case 'leakage':
        return <ProfitLeakageDetector />;
      case 'analytics':
        return <FinancialAnalyticsBI />;
      case 'risks':
        return <RiskManagement />;
      case 'procurement':
        return <ProcurementOptimization />;
      case 'clients':
        return <ClientManagement />;
      case 'assistant':
        return <AssistantChat />;
      case 'reports':
        return <ReportsSettings />;
      default:
        return <DashboardOverview onNavigate={setCurrentView} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F7FA] text-[#15151B] flex flex-col font-sans selection:bg-[#EDE7FF] selection:text-[#6D45CF]">
      <Header
        currentView={currentView}
        onNavigate={setCurrentView}
        onToggleLanding={() => setViewMode('landing')}
      />

      <div className="flex-1 flex overflow-hidden">
        <Sidebar currentView={currentView} onNavigate={setCurrentView} />

        <main className="flex-1 overflow-y-auto p-6 lg:p-8 max-w-[1600px] mx-auto w-full">
          {renderView()}
        </main>
      </div>
    </div>
  );
};

export default App;
