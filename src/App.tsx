import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { AppLayout } from "@/components/layout/AppLayout";
import { AIChatPanel } from "@/components/AIChatPanel";
import { AIModeOverlay } from "@/components/AIModeOverlay";

import LoginPage from "./pages/Login";
import DashboardPage from "./pages/Dashboard";
import ShipmentsPage from "./pages/Shipments";
import NewShipmentPage from "./pages/shipments/NewShipment";
import ConsolPage from "./pages/Consol";
import NewConsolPage from "./pages/consol/NewConsol";
import DocumentsPage from "./pages/Documents";
import BillingPage from "./pages/Billing";
import ReportsPage from "./pages/Reports";
import SettingsPage from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route element={<AppLayout />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/shipments" element={<ShipmentsPage />} />
              <Route path="/shipments/new" element={<NewShipmentPage />} />
              <Route path="/consol" element={<ConsolPage />} />
              <Route path="/consol/new" element={<NewConsolPage />} />
              <Route path="/documents" element={<DocumentsPage />} />
              <Route path="/billing" element={<BillingPage />} />
              <Route path="/reports" element={<ReportsPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
          <AIChatPanel />
          <AIModeOverlay />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
