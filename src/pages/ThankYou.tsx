
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
            <p className="text-xl text-gray-200 mb-8">
              Your application has been received. Our team will reach out to you on WhatsApp within 24 hours if shortlisted.
            </p>
            
            {/* Trust Building Section */}
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-6 border border-white/30 mb-6">
              <h3 className="text-white text-lg font-semibold mb-4">About Our Company</h3>
              <div className="space-y-4 text-gray-200">
                <div className="flex items-center justify-center space-x-4">
                  <img 
                    src="/lovable-uploads/4a30fe7c-aeab-4011-88f6-d91d0122b964.png" 
                    alt="IDM Pakistan Logo" 
                    className="h-12 w-auto"
                  />
                  <img 
                    src="/lovable-uploads/d45b5583-4570-41f6-ad16-84cf447f0423.png" 
                    alt="Elyscents Logo" 
                    className="h-12 w-auto"
                  />
                </div>
                
                <p className="text-sm leading-relaxed">
                  <strong>IDM Pakistan</strong> - Our parent company with proven track record in digital marketing and e-commerce solutions across Pakistan.
                </p>
                
                <p className="text-sm leading-relaxed">
                  <strong>Elyscents</strong> - Our flagship success story generating 500+ daily orders and 5 Crore+ monthly revenue in the perfume industry.
                </p>
                
                <div className="border-t border-white/20 pt-4 mt-4">
                  <h4 className="font-medium text-white mb-2">Our Office Location</h4>
                  <p className="text-sm">
                    📍 IDM Pakistan Headquarters<br />
                    A316 block 2 Gulshan Iqbal, Karachi.<br />
                    <span className="text-xs text-gray-300">Registered and Operating Since 2017</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ThankYou;
