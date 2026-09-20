import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext.js';
import { AppLayout } from './components/layout/AppLayout.js';
import { LandingPage } from './pages/LandingPage.js';
import { DemoPage } from './pages/DemoPage.js';
import { LoginPage, RegisterPage } from './pages/LoginPage.js';
import { DashboardPage } from './pages/DashboardPage.js';
import { PoliciesPage, PolicyDetailPage } from './pages/PoliciesPage.js';
import { InspectionsPage } from './pages/InspectionsPage.js';
import { NewInspectionPage } from './pages/NewInspectionPage.js';
import { FindingsPage, FindingDetailPage } from './pages/FindingsPage.js';
import { ActionsPage, ActionDetailPage } from './pages/ActionsPage.js';
import { AnalyticsPage } from './pages/AnalyticsPage.js';
import { AuditLogPage } from './pages/AuditLogPage.js';
import { SettingsPage } from './pages/SettingsPage.js';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/demo" element={<DemoPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Authenticated Dashboard & Operational Routes */}
          <Route
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/policies" element={<PoliciesPage />} />
            <Route path="/policies/:id" element={<PolicyDetailPage />} />
            <Route path="/inspections" element={<InspectionsPage />} />
            <Route path="/inspections/new" element={<NewInspectionPage />} />
            <Route path="/findings" element={<FindingsPage />} />
            <Route path="/findings/:id" element={<FindingDetailPage />} />
            <Route path="/actions" element={<ActionsPage />} />
            <Route path="/actions/:id" element={<ActionDetailPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/audit-log" element={<AuditLogPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};
