import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import BookService from "./pages/BookService.tsx";
import Auth from "./pages/Auth.tsx";
import AdminDashboard from "./pages/AdminDashboard.tsx";
import PartnerDashboard from "./pages/PartnerDashboard.tsx";
import CustomerDashboard from "./pages/CustomerDashboard.tsx";
import Payment from "./pages/Payment.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/book" element={<ProtectedRoute requireRole="user"><BookService /></ProtectedRoute>} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/admin" element={<ProtectedRoute requireAdmin><AdminDashboard /></ProtectedRoute>} />
                <Route path="/partner" element={<ProtectedRoute requireRole="partner"><PartnerDashboard /></ProtectedRoute>} />
                <Route path="/dashboard" element={<ProtectedRoute requireRole="user"><CustomerDashboard /></ProtectedRoute>} />
                <Route path="/payment" element={<ProtectedRoute requireRole="user"><Payment /></ProtectedRoute>} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
