import React, { useState, useEffect } from 'react';
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
import { SecurityCenter } from './pages/SecurityCenter';
import { DynamicGraphEngine } from './components/DynamicGraphEngine';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { ForgotPassword } from './pages/ForgotPassword';
import { ResetPassword } from './pages/ResetPassword';
import { MfaVerification } from './pages/MfaVerification';
import { Unauthorized } from './pages/Unauthorized';

export type ViewMode =
  | 'landing'
  | 'dashboard'
  | 'login'
  | 'register'
  | 'forgot-password'
  | 'reset-password'
  | 'mfa'
  | 'unauthorized';

export interface EnterpriseUser {
  id: string;
  name: string;
  email: string;
  role: string;
  organizationId: string;
}

export const App: React.FC = () => {
  // Navigation & View States
  const [viewMode, setViewMode] = useState<ViewMode>('landing');
  const [currentView, setCurrentView] = useState<string>('overview');
  const [assistantInitialQuery, setAssistantInitialQuery] = useState<string | null>(null);

  // Enterprise Auth States
  const [user, setUser] = useState<EnterpriseUser | null>(() => {
    try {
      const stored = localStorage.getItem('arthiq_user') || sessionStorage.getItem('arthiq_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('arthiq_auth_token') || sessionStorage.getItem('arthiq_auth_token');
  });

  // MFA & Recovery Challenges
  const [mfaChallenge, setMfaChallenge] = useState<{ challengeId: string; email: string } | null>(null);
  const [resetToken, setResetToken] = useState<string | null>(null);
  const [unauthorizedDetails, setUnauthorizedDetails] = useState<{ requiredRole: string; userRole: string }>({
    requiredRole: 'Super Admin',
    userRole: 'Employee'
  });

  // Verify Active Session on Mount
  useEffect(() => {
    if (token) {
      fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => {
          if (data.status === 'success' && data.user) {
            setUser(data.user);
          }
        })
        .catch(() => {
          // Keep offline state gracefully
        });
    }
  }, [token]);

  // Auth Handlers
  const handleLoginSuccess = (authenticatedUser: EnterpriseUser, authToken: string) => {
    setUser(authenticatedUser);
    setToken(authToken);
    setMfaChallenge(null);
    setViewMode('dashboard');
    setCurrentView('overview');
  };

  const handleLogout = async () => {
    if (token) {
      try {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` }
        });
      } catch (e) {
        // Continue cleanup
      }
    }
    localStorage.removeItem('arthiq_auth_token');
    localStorage.removeItem('arthiq_user');
    sessionStorage.removeItem('arthiq_auth_token');
    sessionStorage.removeItem('arthiq_user');
    setUser(null);
    setToken(null);
    setViewMode('landing');
  };

  const handleMfaRequired = (challengeId: string, email: string) => {
    setMfaChallenge({ challengeId, email });
    setViewMode('mfa');
  };

  const handleAskQuestionFromShowcase = (question: string) => {
    setAssistantInitialQuery(question);
    setViewMode('dashboard');
    setCurrentView('assistant');
  };

  const handleLaunchModuleFromShowcase = (moduleId: string) => {
    setViewMode('dashboard');
    setCurrentView(moduleId);
  };

  const handleNavigateWithRbac = (targetView: string) => {
    const userRole = user?.role || 'Super Admin';
    const securityRoles = ['Super Admin', 'Company Admin', 'Read-Only Auditor', 'Finance Manager'];

    if (targetView === 'security' && !securityRoles.includes(userRole)) {
      setUnauthorizedDetails({
        requiredRole: 'Super Admin / Company Admin / Auditor',
        userRole
      });
      setViewMode('unauthorized');
      return;
    }

    setCurrentView(targetView);
  };

  // 1. Dedicated Authentication Views
  if (viewMode === 'login') {
    return (
      <Login
        onLoginSuccess={handleLoginSuccess}
        onNavigateToRegister={() => setViewMode('register')}
        onNavigateToForgotPassword={() => setViewMode('forgot-password')}
        onMfaRequired={handleMfaRequired}
        onBackToHome={() => setViewMode('landing')}
      />
    );
  }

  if (viewMode === 'register') {
    return (
      <Register
        onRegisterSuccess={handleLoginSuccess}
        onNavigateToLogin={() => setViewMode('login')}
        onBackToHome={() => setViewMode('landing')}
      />
    );
  }

  if (viewMode === 'forgot-password') {
    return (
      <ForgotPassword
        onNavigateToLogin={() => setViewMode('login')}
        onNavigateToResetPassword={(tok) => {
          if (tok) setResetToken(tok);
          setViewMode('reset-password');
        }}
        onBackToHome={() => setViewMode('landing')}
      />
    );
  }

  if (viewMode === 'reset-password') {
    return (
      <ResetPassword
        initialToken={resetToken || ''}
        onResetSuccess={() => setViewMode('login')}
        onNavigateToLogin={() => setViewMode('login')}
        onBackToHome={() => setViewMode('landing')}
      />
    );
  }

  if (viewMode === 'mfa' && mfaChallenge) {
    return (
      <MfaVerification
        challengeId={mfaChallenge.challengeId}
        email={mfaChallenge.email}
        onVerifySuccess={handleLoginSuccess}
        onBackToLogin={() => setViewMode('login')}
      />
    );
  }

  if (viewMode === 'unauthorized') {
    return (
      <Unauthorized
        requiredRole={unauthorizedDetails.requiredRole}
        userRole={unauthorizedDetails.userRole}
        onNavigateHome={() => setViewMode('landing')}
        onNavigateDashboard={() => {
          setViewMode('dashboard');
          setCurrentView('overview');
        }}
        onSwitchAccount={() => setViewMode('login')}
      />
    );
  }

  // 2. Landing Page
  if (viewMode === 'landing') {
    return (
      <LandingPage
        onLaunchDashboard={() => {
          setViewMode('dashboard');
          setCurrentView('overview');
        }}
        onLoginClick={() => setViewMode('login')}
        onAskQuestion={handleAskQuestionFromShowcase}
        onLaunchModule={handleLaunchModuleFromShowcase}
      />
    );
  }

  // 3. Authenticated Dashboard Views
  const renderView = () => {
    switch (currentView) {
      case 'overview':
        return <DashboardOverview onNavigate={handleNavigateWithRbac} />;
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
        return (
          <AssistantChat
            initialQuery={assistantInitialQuery}
            onQueryHandled={() => setAssistantInitialQuery(null)}
          />
        );
      case 'graphs':
        return <DynamicGraphEngine />;
      case 'reports':
        return <ReportsSettings />;
      case 'security':
        return <SecurityCenter />;
      default:
        return <DashboardOverview onNavigate={handleNavigateWithRbac} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-black flex flex-col font-sans selection:bg-[#EDE7FF] selection:text-[#6D45CF]">
      <Header
        currentView={currentView}
        onNavigate={handleNavigateWithRbac}
        onToggleLanding={() => setViewMode('landing')}
        user={user}
        onLogout={handleLogout}
      />

      <div className="flex-1 flex overflow-hidden">
        <Sidebar
          currentView={currentView}
          onNavigate={handleNavigateWithRbac}
          userRole={user?.role || 'Super Admin'}
        />

        <main className="flex-1 overflow-y-auto p-6 lg:p-8 max-w-[1600px] mx-auto w-full">
          {renderView()}
        </main>
      </div>
    </div>
  );
};

export default App;
