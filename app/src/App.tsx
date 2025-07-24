import { Toaster } from "~/components/ui/toaster";
import { Toaster as Sonner } from "~/components/ui/sonner";
import { TooltipProvider } from "~/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { useEffect } from "react";
import Index from "~/pages/Index";
import { LoginPage } from "~/pages/LoginPage";
import { RegisterPage } from "~/pages/RegisterPage";
import { DashboardPage } from "~/pages/DashboardPage";
import { SettlementDetailsPage } from "~/pages/SettlementDetailsPage";
import { ExpenseDetailsPage } from "~/pages/ExpenseDetailsPage";
import { JoinSettlement } from "~/pages/JoinSettlement";
import NotFoundPage from "~/pages/NotFoundPage";
import { useAuthStore } from "~/stores/authStore";
import { SettlementCreatePage } from "~/pages/SettlementCreatePage";
import { SettlementEditPage } from "~/pages/SettlementEditPage";
import { ExpenseCreatePage } from "./pages/ExpenseCreatePage";
import { ExpenseEditPage } from "~/pages/ExpenseEditPage";

const queryClient = new QueryClient();

function ProtectedRoute() {
  const { isAuthenticated, isInitialized } = useAuthStore();

  // Show loading while auth is being initialized
  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto">
            <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
          </div>
          <div className="text-lg font-medium text-foreground">Loading...</div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated)
    return <Navigate to="/login" replace />;

  return <Outlet />;
}

function AppContent() {
  const { initializeAuth } = useAuthStore();

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Index />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/settlements/create" element={<SettlementCreatePage />} />
          <Route path="/settlements/join" element={<JoinSettlement />} />
          <Route path="/settlements/:settlementId" element={<SettlementDetailsPage />} />
          <Route path="/settlements/:settlementId/edit" element={<SettlementEditPage />} />
          <Route path="/settlements/:settlementId/expenses/create" element={<ExpenseCreatePage />} />
          <Route path="/settlements/:settlementId/expenses/:expenseId" element={<ExpenseDetailsPage />} />
          <Route path="/settlements/:settlementId/expenses/:expenseId/edit" element={<ExpenseEditPage />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AppContent />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
