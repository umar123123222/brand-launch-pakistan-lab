import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Footer from "@/components/Footer";

const BookConsultationThankYou = () => {
  const location = useLocation();
  const { bookingTime, fullName } = location.state || {};

  useEffect(() => {
    // Track page view for analytics if needed
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', 'Lead');
    }
  }, []);

  const formatBookingTime = (datetime: string) => {
    const date = new Date(datetime);
    return {
      date: date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        month: 'long', 
        day: 'numeric',
        year: 'numeric'
      }),
      time: date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      })
    };
  };

  const booking = bookingTime ? formatBookingTime(bookingTime) : null;

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
            
            {/* Booking Details */}
            {booking && (
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-6 border border-white/30 mb-8">
                <h3 className="text-white text-lg font-semibold mb-4">Your Booking Details</h3>
                <div className="space-y-2 text-gray-200">
                  {fullName && (
                    <p className="text-lg">
                      <strong>Name:</strong> {fullName}
                    </p>
                  )}
                  <p className="text-lg">
                    <strong>Date:</strong> {booking.date}
                  </p>
                  <p className="text-lg">
                    <strong>Time:</strong> {booking.time}
                  </p>
                </div>
              </div>
            )}

            {/* Reminder */}
            <div className="bg-blue-500/20 backdrop-blur-sm rounded-lg p-6 border border-blue-500/30 mb-6">
              <h4 className="font-medium text-white mb-2 flex items-center justify-center gap-2">
                📱 Important Reminder
              </h4>
              <p className="text-sm text-gray-200">
                Please be available at the selected time — we'll message you 10 minutes before the call begins.
              </p>
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
                  src="/lovable-uploads/d45b5583-4570-41f6-ad91d0122b964.png" 
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