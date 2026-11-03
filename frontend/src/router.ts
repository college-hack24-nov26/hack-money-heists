/**
 * Centralized Route Configuration and Browser History Manager for ARTHIQ
 * Provides direct URL navigation, back/forward support, and refresh persistence.
 */

export interface RouteDefinition {
  path: string;
  viewMode: 'landing' | 'dashboard' | 'login' | 'register' | 'forgot-password' | 'reset-password' | 'mfa' | 'unauthorized';
  viewId: string;
  title: string;
  requiresAuth?: boolean;
}

export const PLATFORM_ROUTES: Record<string, RouteDefinition> = {
  // Public & Auth Routes
  '/': { path: '/', viewMode: 'landing', viewId: 'landing', title: 'ARTHIQ — AI-Powered Financial Intelligence' },
  '/login': { path: '/login', viewMode: 'login', viewId: 'login', title: 'Login — ARTHIQ Platform' },
  '/register': { path: '/register', viewMode: 'register', viewId: 'register', title: 'Register — ARTHIQ Platform' },
  '/forgot-password': { path: '/forgot-password', viewMode: 'forgot-password', viewId: 'forgot-password', title: 'Reset Password — ARTHIQ' },
  '/reset-password': { path: '/reset-password', viewMode: 'reset-password', viewId: 'reset-password', title: 'Set New Password — ARTHIQ' },

  // Core 8 Financial Modules (Standard Specified Routes)
  '/platform/expense-analyzer': {
    path: '/platform/expense-analyzer',
    viewMode: 'dashboard',
    viewId: 'expenses',
    title: 'Smart Expense Analyzer — ARTHIQ'
  },
  '/platform/invoice-forensics': {
    path: '/platform/invoice-forensics',
    viewMode: 'dashboard',
    viewId: 'invoices',
    title: 'Invoice Fraud Forensics — ARTHIQ'
  },
  '/platform/cash-flow': {
    path: '/platform/cash-flow',
    viewMode: 'dashboard',
    viewId: 'cashflow',
    title: 'SME Cash Flow Prediction — ARTHIQ'
  },
  '/platform/profit-leakage': {
    path: '/platform/profit-leakage',
    viewMode: 'dashboard',
    viewId: 'leakage',
    title: 'Profit Leakage Detector (PLD) — ARTHIQ'
  },
  '/platform/analytics': {
    path: '/platform/analytics',
    viewMode: 'dashboard',
    viewId: 'analytics',
    title: 'Financial Analytics & BI — ARTHIQ'
  },
  '/platform/receivables': {
    path: '/platform/receivables',
    viewMode: 'dashboard',
    viewId: 'clients',
    title: 'Client & Receivable Isolation — ARTHIQ'
  },
  '/platform/risk-radar': {
    path: '/platform/risk-radar',
    viewMode: 'dashboard',
    viewId: 'risks',
    title: 'Financial Risk Radar — ARTHIQ'
  },
  '/platform/ai-assistant': {
    path: '/platform/ai-assistant',
    viewMode: 'dashboard',
    viewId: 'assistant',
    title: 'ARTHIQ AI Financial Analyst'
  },

  // Additional Dashboard Workspaces
  '/platform': {
    path: '/platform',
    viewMode: 'dashboard',
    viewId: 'overview',
    title: 'Executive Financial Dashboard — ARTHIQ'
  },
  '/platform/overview': {
    path: '/platform/overview',
    viewMode: 'dashboard',
    viewId: 'overview',
    title: 'Executive Financial Dashboard — ARTHIQ'
  },
  '/platform/procurement': {
    path: '/platform/procurement',
    viewMode: 'dashboard',
    viewId: 'procurement',
    title: 'Procurement Cost Optimization — ARTHIQ'
  },
  '/platform/graphs': {
    path: '/platform/graphs',
    viewMode: 'dashboard',
    viewId: 'graphs',
    title: 'Dynamic Financial Knowledge Graph — ARTHIQ'
  },
  '/platform/reports': {
    path: '/platform/reports',
    viewMode: 'dashboard',
    viewId: 'reports',
    title: 'Audit & Financial Reports — ARTHIQ'
  },
  '/platform/security': {
    path: '/platform/security',
    viewMode: 'dashboard',
    viewId: 'security',
    title: 'Enterprise Security Center — ARTHIQ'
  }
};

// Aliases for quick mapping by viewId
export const VIEW_ID_TO_PATH: Record<string, string> = {
  overview: '/platform/overview',
  expenses: '/platform/expense-analyzer',
  invoices: '/platform/invoice-forensics',
  cashflow: '/platform/cash-flow',
  leakage: '/platform/profit-leakage',
  analytics: '/platform/analytics',
  clients: '/platform/receivables',
  risks: '/platform/risk-radar',
  assistant: '/platform/ai-assistant',
  procurement: '/platform/procurement',
  graphs: '/platform/graphs',
  reports: '/platform/reports',
  security: '/platform/security'
};

/**
 * Resolves current pathname from window.location
 */
export function resolveCurrentRoute(): RouteDefinition {
  const currentPath = window.location.pathname.toLowerCase().replace(/\/$/, '') || '/';
  
  if (PLATFORM_ROUTES[currentPath]) {
    return PLATFORM_ROUTES[currentPath];
  }

  // Prefix matching for /platform/...
  for (const [routePath, def] of Object.entries(PLATFORM_ROUTES)) {
    if (routePath !== '/' && currentPath.startsWith(routePath)) {
      return def;
    }
  }

  // Default to landing
  return PLATFORM_ROUTES['/'];
}

/**
 * Changes browser URL without full page reload and dispatches popstate
 */
export function navigateTo(path: string): void {
  if (window.location.pathname !== path) {
    window.history.pushState({}, '', path);
    window.dispatchEvent(new PopStateEvent('popstate'));
  }
  
  const def = PLATFORM_ROUTES[path] || resolveCurrentRoute();
  if (def?.title) {
    document.title = def.title;
  }
}

