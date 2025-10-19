import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <GuidedTour />
        <TourDebugButton />
        <Routes>
          <Route path="/" element={<Onboarding />} />
          <Route path="/feed" element={<PostFeed />} />
          <Route path="/collab" element={<CollabFeed />} />
          <Route path="/contracts" element={<Contracts />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/create-collab" element={<CreateCollab />} />
          <Route path="/create-content" element={<CreateContent />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
