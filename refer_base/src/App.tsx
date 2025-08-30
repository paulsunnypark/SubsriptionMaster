import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth";
import { ThemeProvider } from "./components/theme-provider";
import { AppLayout } from "./components/layout/app-layout";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import Subscriptions from "./pages/Subscriptions";
import Ingest from "./pages/Ingest";
import Alerts from "./pages/Alerts";
import Savings from "./pages/Savings";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="system" storageKey="subwatch-ui-theme">
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <AppLayout><Dashboard /></AppLayout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/subscriptions" 
                element={
                  <ProtectedRoute>
                    <AppLayout><Subscriptions /></AppLayout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/ingest" 
                element={
                  <ProtectedRoute>
                    <AppLayout><Ingest /></AppLayout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/alerts" 
                element={
                  <ProtectedRoute>
                    <AppLayout><Alerts /></AppLayout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/savings" 
                element={
                  <ProtectedRoute>
                    <AppLayout><Savings /></AppLayout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/settings" 
                element={
                  <ProtectedRoute>
                    <AppLayout><Settings /></AppLayout>
                  </ProtectedRoute>
                } 
              />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
