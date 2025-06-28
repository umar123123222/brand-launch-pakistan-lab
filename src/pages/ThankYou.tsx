
import { useEffect } from "react";
import Footer from "@/components/Footer";

// Declare fbq as a global variable to avoid TypeScript errors
declare global {
  interface Window {
    fbq: any;
  }
}

const ThankYou = () => {
  useEffect(() => {
    // Track page view for analytics/Facebook Pixel
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', 'Lead');
    }
  }, []);

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 flex items-center justify-center">
        <div className="max-w-2xl mx-auto text-center px-6">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
            <div className="text-6xl mb-6">✅</div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Application Received!
            </h1>
            <p className="text-xl text-gray-200 mb-6">
              Your application has been received. Our team will reach out to you on WhatsApp within 24 hours if shortlisted.
            </p>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-6 border border-white/30">
              <p className="text-white text-lg mb-2 font-medium">
                You can also reach us directly on WhatsApp:
              </p>
              <a
                href="https://wa.me/923148860546"
                className="text-2xl font-bold text-green-400 hover:text-green-300 transition-colors inline-flex items-center gap-2"
                target="_blank"
                rel="noopener noreferrer"
              >
                📱 03148860546
              </a>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ThankYou;
