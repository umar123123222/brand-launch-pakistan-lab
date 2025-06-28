
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import Footer from "@/components/Footer";

const ThankYou = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Track page view for analytics/Facebook Pixel
    if (typeof fbq !== 'undefined') {
      fbq('track', 'Lead');
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
            <Button
              onClick={() => navigate("/")}
              className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black font-bold py-3 px-6 rounded-lg"
            >
              Back to Homepage
            </Button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ThankYou;
