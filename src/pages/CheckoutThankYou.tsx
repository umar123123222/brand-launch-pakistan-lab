import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, User, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CheckoutThankYou = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Track conversion event for analytics
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', 'Purchase');
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900">
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-2xl mx-auto text-center">
          {/* Success Icon */}
          <div className="mb-8">
            <div className="w-24 h-24 mx-auto bg-green-500 rounded-full flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-white" />
            </div>
          </div>

          {/* Main Content */}
          <Card className="bg-white/10 backdrop-blur-lg border-white/20">
            <CardContent className="p-8">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Order Confirmed!
              </h1>
              
              <p className="text-xl text-gray-200 mb-8">
                Thank you for your order. We've received your request and our team is already working on it.
              </p>

              {/* Agent Contact Info */}
              <div className="bg-white/5 border border-white/20 rounded-lg p-6 mb-8">
                <div className="flex items-center justify-center mb-4">
                  <User className="w-8 h-8 text-yellow-400 mr-3" />
                  <h2 className="text-2xl font-semibold text-white">
                    Your Assigned Agent Will Contact You Soon
                  </h2>
                </div>
                
                <p className="text-gray-300 text-lg">
                  Our dedicated brand specialist will reach out to you within the next 24 hours to discuss your project details, timeline, and next steps.
                </p>
              </div>

              {/* What's Next */}
              <div className="text-left space-y-4 mb-8">
                <h3 className="text-xl font-semibold text-white mb-4">What happens next?</h3>
                <div className="space-y-3 text-gray-300">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-black">1</span>
                    </div>
                    <p>Your assigned agent will contact you via WhatsApp or phone within 24 hours</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-black">2</span>
                    </div>
                    <p>We'll discuss your brand vision, target market, and customization preferences</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-black">3</span>
                    </div>
                    <p>Our team will begin production and keep you updated throughout the process</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-black">4</span>
                    </div>
                    <p>Your products will be delivered according to the agreed timeline</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-center">
                <Button
                  onClick={() => navigate('/')}
                  variant="secondary"
                  className="flex items-center gap-2"
                >
                  <Home className="w-4 h-4" />
                  Return to Home
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Additional Info */}
          <div className="mt-8 text-center">
            <p className="text-gray-300">
              Questions? Contact us at{" "}
              <a href="mailto:support@elevate51.com" className="text-yellow-400 hover:text-yellow-300">
                support@elevate51.com
              </a>{" "}
              or{" "}
              <a href="https://wa.me/923001234567" className="text-yellow-400 hover:text-yellow-300" target="_blank" rel="noopener noreferrer">
                WhatsApp us
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutThankYou;