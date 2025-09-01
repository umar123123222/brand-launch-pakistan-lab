
import { useState, useEffect } from "react";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { PhoneInput } from "@/components/ui/phone-input";
import { Calendar } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

// Declare fbq as a global variable to avoid TypeScript errors
declare global {
  interface Window {
    fbq: any;
  }
}

interface TimeSlot {
  time: string;
  datetime: Date;
  available: boolean;
}

const ThankYou = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    whatsappNumber: "",
    businessTimeline: "",
    investmentReady: "",
    seenElyscents: "",
    categories: [] as string[]
  });
  
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Track page view for analytics/Facebook Pixel
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', 'Lead');
    }
  }, []);

  // Generate time slots for next 3 business days (excluding Sundays)
  const generateTimeSlots = () => {
    const slots: TimeSlot[] = [];
    const today = new Date();
    let validDaysFound = 0;
    let dayOffset = 1;

    while (validDaysFound < 3) {
      const currentDate = new Date(today);
      currentDate.setDate(today.getDate() + dayOffset);
      
      // Skip Sundays (0 = Sunday)
      if (currentDate.getDay() !== 0) {
        // Generate slots from 9 AM to 5 PM (30-minute intervals)
        for (let hour = 9; hour < 17; hour++) {
          for (let minute = 0; minute < 60; minute += 30) {
            const slotTime = new Date(currentDate);
            slotTime.setHours(hour, minute, 0, 0);
            
            const timeString = slotTime.toLocaleTimeString('en-US', {
              hour: 'numeric',
              minute: '2-digit',
              hour12: true
            });
            
            slots.push({
              time: timeString,
              datetime: new Date(slotTime),
              available: true
            });
          }
        }
        validDaysFound++;
      }
      dayOffset++;
    }
    
    return slots;
  };

  // Check slot availability from database
  const checkSlotAvailability = async (slots: TimeSlot[]) => {
    try {
      const { data: bookedSlots, error } = await supabase
        .from('bookings')
        .select('booking_datetime')
        .eq('status', 'confirmed');

      if (error) {
        console.error('Error fetching bookings:', error);
        return slots;
      }

      const bookedTimes = new Set(
        bookedSlots?.map(booking => new Date(booking.booking_datetime).getTime())
      );

      return slots.map(slot => ({
        ...slot,
        available: !bookedTimes.has(slot.datetime.getTime())
      }));
    } catch (error) {
      console.error('Error checking availability:', error);
      return slots;
    }
  };

  useEffect(() => {
    const initializeSlots = async () => {
      const generatedSlots = generateTimeSlots();
      const availableSlots = await checkSlotAvailability(generatedSlots);
      setAvailableSlots(availableSlots);
    };

    initializeSlots();
  }, []);

  const handleCategoryChange = (category: string, checked: boolean) => {
    if (checked) {
      setFormData(prev => ({
        ...prev,
        categories: [...prev.categories, category]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        categories: prev.categories.filter(c => c !== category)
      }));
    }
  };

  const isFormValid = () => {
    return (
      formData.fullName &&
      formData.email &&
      formData.whatsappNumber &&
      formData.businessTimeline &&
      formData.investmentReady &&
      formData.seenElyscents &&
      formData.categories.length > 0 &&
      selectedSlot &&
      formData.investmentReady === "Yes"
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isFormValid()) {
      toast({
        title: "Please fill all required fields",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    try {
      const { error } = await supabase
        .from('bookings')
        .insert({
          full_name: formData.fullName,
          email: formData.email,
          whatsapp_number: formData.whatsappNumber,
          business_timeline: formData.businessTimeline,
          investment_ready: formData.investmentReady === "Yes",
          seen_elyscents: formData.seenElyscents === "Yes",
          categories: formData.categories,
          booking_datetime: selectedSlot!.datetime.toISOString()
        });

      if (error) {
        toast({
          title: "Booking failed",
          description: "Please try again or contact support.",
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Booking confirmed!",
        description: "Redirecting you to confirmation page..."
      });

      // Redirect to thank you page with booking details
      navigate('/book-consultation/thank-you', {
        state: {
          bookingTime: selectedSlot!.datetime,
          fullName: formData.fullName
        }
      });
      
    } catch (error) {
      console.error('Booking error:', error);
      toast({
        title: "Something went wrong",
        description: "Please try again later.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const groupSlotsByDate = (slots: TimeSlot[]) => {
    const grouped: { [key: string]: TimeSlot[] } = {};
    
    slots.forEach(slot => {
      const dateKey = slot.datetime.toDateString();
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(slot);
    });
    
    return grouped;
  };

  const groupedSlots = groupSlotsByDate(availableSlots);

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900">
        <div className="container mx-auto px-6 py-12">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="text-6xl mb-6">✅</div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              You're Almost Done – Book Your Free 1-on-1 AI Brand Strategy Call
            </h1>
            <p className="text-xl text-gray-200 max-w-3xl mx-auto">
              Meet 1-1 with our Expert Ecommerce specialist to see how you can launch a successful Ecommerce business in Pakistan.
            </p>
          </div>

          <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Personal Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="fullName" className="text-white">Full Name *</Label>
                  <Input
                    id="fullName"
                    value={formData.fullName}
                    onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                    className="mt-2 bg-white/20 border-white/30 text-white placeholder-white/60"
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="email" className="text-white">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="mt-2 bg-white/20 border-white/30 text-white placeholder-white/60"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="whatsapp" className="text-white">WhatsApp Number *</Label>
                <PhoneInput
                  id="whatsapp"
                  value={formData.whatsappNumber}
                  onChange={(value) => setFormData(prev => ({ ...prev, whatsappNumber: value }))}
                  className="mt-2 bg-white/20 border-white/30 text-white placeholder-white/60"
                  required
                />
              </div>

              {/* Qualification Questions */}
              <div className="space-y-6">
                <div>
                  <Label className="text-white text-lg font-medium">How soon are you willing to open your Ecommerce business? *</Label>
                  <RadioGroup 
                    value={formData.businessTimeline} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, businessTimeline: value }))}
                    className="mt-3"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Now" id="now" className="border-white text-white" />
                      <Label htmlFor="now" className="text-white">Now</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Later" id="later" className="border-white text-white" />
                      <Label htmlFor="later" className="text-white">Later</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Never" id="never" className="border-white text-white" />
                      <Label htmlFor="never" className="text-white">Never</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label className="text-white text-lg font-medium">Do you have investment ready to launch your brand? *</Label>
                  <RadioGroup 
                    value={formData.investmentReady} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, investmentReady: value }))}
                    className="mt-3"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Yes" id="invest-yes" className="border-white text-white" />
                      <Label htmlFor="invest-yes" className="text-white">Yes</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="No" id="invest-no" className="border-white text-white" />
                      <Label htmlFor="invest-no" className="text-white">No</Label>
                    </div>
                  </RadioGroup>
                  
                  {formData.investmentReady === "No" && (
                    <div className="mt-4 p-4 bg-red-500/20 border border-red-500/30 rounded-lg">
                      <p className="text-white text-sm">
                        Thanks for your interest. Elevate51 brand launches require investment. We'll keep you posted when no-investment offers are available.
                      </p>
                    </div>
                  )}
                </div>

                <div>
                  <Label className="text-white text-lg font-medium">Have you seen Elyscents.pk perfume brand? *</Label>
                  <RadioGroup 
                    value={formData.seenElyscents} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, seenElyscents: value }))}
                    className="mt-3"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Yes" id="ely-yes" className="border-white text-white" />
                      <Label htmlFor="ely-yes" className="text-white">Yes</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="No" id="ely-no" className="border-white text-white" />
                      <Label htmlFor="ely-no" className="text-white">No</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label className="text-white text-lg font-medium">What category are you interested in? *</Label>
                  <div className="mt-3 space-y-3">
                    {['Perfume', 'Beard Oil', 'Pain Relief oils'].map((category) => (
                      <div key={category} className="flex items-center space-x-2">
                        <Checkbox
                          id={category.toLowerCase().replace(' ', '-')}
                          checked={formData.categories.includes(category)}
                          onCheckedChange={(checked) => handleCategoryChange(category, checked as boolean)}
                          className="border-white data-[state=checked]:bg-white data-[state=checked]:text-purple-900"
                        />
                        <Label htmlFor={category.toLowerCase().replace(' ', '-')} className="text-white">
                          {category}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Calendar Booking Section */}
              {formData.investmentReady === "Yes" && (
                <div className="space-y-6">
                  <h3 className="text-white text-xl font-bold flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Select Your Preferred Time Slot
                  </h3>
                  
                  <div className="space-y-6">
                    {Object.entries(groupedSlots).map(([date, slots]) => (
                      <div key={date} className="space-y-3">
                        <h4 className="text-white font-medium text-lg">
                          {new Date(date).toLocaleDateString('en-US', { 
                            weekday: 'long', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </h4>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                          {slots.map((slot, index) => (
                            <button
                              key={index}
                              type="button"
                              disabled={!slot.available}
                              onClick={() => setSelectedSlot(slot)}
                              className={`p-3 rounded-lg border text-sm font-medium transition-all ${
                                selectedSlot?.datetime.getTime() === slot.datetime.getTime()
                                  ? 'bg-white text-purple-900 border-white'
                                  : slot.available
                                  ? 'bg-white/10 text-white border-white/30 hover:bg-white/20'
                                  : 'bg-gray-500/20 text-gray-400 border-gray-500/30 cursor-not-allowed'
                              }`}
                            >
                              {slot.time}
                              {!slot.available && (
                                <div className="text-xs mt-1">Booked</div>
                              )}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <div className="pt-6">
                <Button
                  type="submit"
                  disabled={!isFormValid() || loading}
                  className="w-full bg-white text-purple-900 hover:bg-gray-100 font-bold py-4 text-lg"
                >
                  {loading ? "Confirming..." : "Confirm Booking & Lock My Slot"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ThankYou;
