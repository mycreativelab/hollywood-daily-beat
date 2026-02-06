import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AudioProvider } from "@/contexts/AudioContext";
import { CookieBanner } from "@/components/CookieBanner";
import { GlobalAudioPlayer } from "@/components/GlobalAudioPlayer";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Podcasts from "./pages/Podcasts";
import PodcastDetail from "./pages/PodcastDetail";
import About from "./pages/About";
import Admin from "./pages/Admin";
import PendingApproval from "./pages/PendingApproval";
import Impressum from "./pages/Impressum";
import Datenschutz from "./pages/Datenschutz";
import SlackCallback from "./pages/SlackCallback";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <AuthProvider>
        <AudioProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/podcasts" element={<Podcasts />} />
                <Route path="/podcasts/:id" element={<PodcastDetail />} />
                <Route path="/about" element={<About />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/pending-approval" element={<PendingApproval />} />
                <Route path="/impressum" element={<Impressum />} />
                <Route path="/datenschutz" element={<Datenschutz />} />
                <Route path="/slack/callback" element={<SlackCallback />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
              <CookieBanner />
              <GlobalAudioPlayer />
            </BrowserRouter>
          </TooltipProvider>
        </AudioProvider>
      </AuthProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
