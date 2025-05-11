
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from '@/context/AuthContext';
import { MeetingProvider } from '@/context/MeetingContext';
import Layout from "@/pages/Layout";
import ProtectedRoute from "@/components/ProtectedRoute";

// Pages
import LandingPage from "./pages/LandingPage";
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
                <Routes>
                  {/* Landing page as the root route */}
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/auth" element={<AuthPage />} />
                  
                  {/* Protected dashboard routes inside Layout */}
                  <Route 
                    path="/dashboard" 
                    element={
                      <ProtectedRoute>
                        <Layout>
                          <Dashboard />
                        </Layout>
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/meeting" 
                    element={
                      <ProtectedRoute>
                        <Layout>
                          <MeetingPage />
                        </Layout>
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/summaries" 
                    element={
                      <ProtectedRoute>
                        <Layout>
                          <SummariesPage />
                        </Layout>
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/logbook" 
                    element={
                      <ProtectedRoute>
                        <Layout>
                          <LogbookPage />
                        </Layout>
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/tasks" 
                    element={
                      <ProtectedRoute>
                        <Layout>
                          <TasksPage />
                        </Layout>
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/decisions" 
                    element={
                      <ProtectedRoute>
                        <Layout>
                          <DecisionsPage />
                        </Layout>
                      </ProtectedRoute>
                    } 
                  />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </TooltipProvider>
          </MeetingProvider>
        </AuthProvider>
      </QueryClientProvider>
    </React.StrictMode>
  );
}

export default App;
