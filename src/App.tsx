
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from '@/context/AuthContext';
import { MeetingProvider } from '@/context/MeetingContext';
import Layout from "@/pages/Layout";
import ProtectedRoute from "@/components/ProtectedRoute";

// Pages
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import AuthPage from "./pages/AuthPage";
import MeetingPage from "./pages/MeetingPage";
import SummariesPage from "./pages/SummariesPage";
import LogbookPage from "./pages/LogbookPage";
import TasksPage from "./pages/TasksPage";
import DecisionsPage from "./pages/DecisionsPage";
import NotFound from "./pages/NotFound";

// Create a new QueryClient instance inside the component
function App() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: 1,
        refetchOnWindowFocus: false,
      },
    },
  });

  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <MeetingProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Layout>
                  <Routes>
                    <Route 
                      path="/" 
                      element={
                        <ProtectedRoute>
                          <Dashboard />
                        </ProtectedRoute>
                      } 
                    />
                    <Route path="/auth" element={<AuthPage />} />
                    <Route 
                      path="/meeting" 
                      element={
                        <ProtectedRoute>
                          <MeetingPage />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/summaries" 
                      element={
                        <ProtectedRoute>
                          <SummariesPage />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/logbook" 
                      element={
                        <ProtectedRoute>
                          <LogbookPage />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/tasks" 
                      element={
                        <ProtectedRoute>
                          <TasksPage />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/decisions" 
                      element={
                        <ProtectedRoute>
                          <DecisionsPage />
                        </ProtectedRoute>
                      } 
                    />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Layout>
              </BrowserRouter>
            </TooltipProvider>
          </MeetingProvider>
        </AuthProvider>
      </QueryClientProvider>
    </React.StrictMode>
  );
}

export default App;
