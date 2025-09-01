
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Legal from "./pages/Legal";
import About from "./pages/About";
import Privacy from "./pages/Privacy";
import FunnelStep1 from "./pages/FunnelStep1";
import FunnelStep2 from "./pages/FunnelStep2";
import ThankYou from "./pages/ThankYou";
import BookConsultation from "./pages/BookConsultation";
import BookConsultationThankYou from "./pages/BookConsultationThankYou";
import Dashboard from "./pages/Dashboard";
import ClientView from "./pages/ClientView";
import HireUs from "./pages/HireUs";
import PrivateLabel from "./pages/PrivateLabel";
import Checkout from "./pages/Checkout";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="/about" element={<About />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/legal" element={<Legal />} />
          <Route path="/funnel/step1" element={<FunnelStep1 />} />
          <Route path="/funnel/step2" element={<FunnelStep2 />} />
          <Route path="/thank-you" element={<ThankYou />} />
          <Route path="/book-consultation" element={<BookConsultation />} />
          <Route path="/book-consultation/thank-you" element={<BookConsultationThankYou />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/client/:brandId" element={<ClientView />} />
          <Route path="/hire-us" element={<HireUs />} />
          <Route path="/private-label" element={<PrivateLabel />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
