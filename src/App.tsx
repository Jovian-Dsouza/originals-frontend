import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { usePrivy } from "@privy-io/react-auth";
import { GuidedTour } from "./components/GuidedTour";
import { TourDebugButton } from "./components/TourDebugButton";
import Onboarding from "./pages/Onboarding";
import PostFeed from "./pages/PostFeed";
import CollabFeed from "./pages/CollabFeed";
import Contracts from "./pages/Contracts";
import Profile from "./pages/Profile";
import CreateCollab from "./pages/CreateCollab";
import CreateContent from "./pages/CreateContent";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { ready, authenticated } = usePrivy();
  
  if (!ready) {
    return <div>Loading...</div>;
  }
  
  if (!authenticated) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <GuidedTour />
        {/* <TourDebugButton /> */}
        <Routes>
          <Route path="/" element={<Onboarding />} />
          <Route path="/feed" element={<ProtectedRoute><PostFeed /></ProtectedRoute>} />
          <Route path="/collab" element={<ProtectedRoute><CollabFeed /></ProtectedRoute>} />
          <Route path="/contracts" element={<ProtectedRoute><Contracts /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/create-collab" element={<ProtectedRoute><CreateCollab /></ProtectedRoute>} />
          <Route path="/create-content" element={<ProtectedRoute><CreateContent /></ProtectedRoute>} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
