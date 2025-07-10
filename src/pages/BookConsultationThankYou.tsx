import { useEffect } from "react";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";

const BookConsultationThankYou = () => {
  useEffect(() => {
    // Track page view for analytics if needed
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', 'Lead');
    }
  }, []);

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 flex items-center justify-center">
        <div className="max-w-4xl mx-auto text-center px-6">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
            <div className="text-6xl mb-6">✅</div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Your Strategy Call is Confirmed!
            </h1>
            <p className="text-xl text-gray-200 mb-8">
              Thank you for booking your call with Elevate51. Our team will reach out to you on WhatsApp shortly before the meeting to confirm details.
            </p>
            
            {/* Elyscents Success Block */}
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-6 border border-white/30 mb-8">
              <h3 className="text-white text-lg font-semibold mb-4">About Our Success Story</h3>
              <div className="space-y-4 text-gray-200">
                <div className="flex items-center justify-center mb-4">
                  <img 
                    src="/lovable-uploads/d45b5583-4570-41f6-ad16-84cf447f0423.png" 
                    alt="Elyscents Logo" 
                    className="h-16 w-auto"
                  />
                </div>
                
                <p className="text-sm leading-relaxed">
                  <strong>Elyscents</strong> - Our flagship success story generating 500+ daily orders and 5 Crore+ monthly revenue in the perfume industry.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">500+</div>
                    <div className="text-sm text-gray-300">Daily Orders</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">5 Crore+</div>
                    <div className="text-sm text-gray-300">Monthly Revenue</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">2 Years</div>
                    <div className="text-sm text-gray-300">Market Leader</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Reminder */}
            <div className="bg-blue-500/20 backdrop-blur-sm rounded-lg p-6 border border-blue-500/30 mb-6">
              <h4 className="font-medium text-white mb-2 flex items-center justify-center gap-2">
                📱 Important Reminder
              </h4>
              <p className="text-sm text-gray-200">
                Please be available at the selected time — we'll message you 10 minutes before the call begins.
              </p>
            </div>

            {/* WhatsApp Contact Button */}
            <div className="mb-8">
              <Button 
                asChild
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-8 rounded-lg text-lg transition-all duration-300 transform hover:scale-105"
              >
                <a 
                  href="https://wa.me/923148860546" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2"
                >
                  💬 Chat with Our Team on WhatsApp
                </a>
              </Button>
            </div>

            {/* Additional Company Info */}
            <div className="border-t border-white/20 pt-6 mt-6">
              <div className="flex items-center justify-center space-x-6 mb-4">
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
              
              <div className="text-sm text-gray-300">
                <p className="mb-2">
                  <strong>IDM Pakistan</strong> - Our parent company with proven track record in digital marketing and e-commerce solutions across Pakistan.
                </p>
                
                <div className="mt-4">
                  <h4 className="font-medium text-white mb-2">Our Office Location</h4>
                  <p>
                    📍 IDM Pakistan Headquarters<br />
                    A316 block 2 Gulshan Iqbal, Karachi.<br />
                    <span className="text-xs text-gray-400">Registered and Operating Since 2017</span>
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

export default BookConsultationThankYou;