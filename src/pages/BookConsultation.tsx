import { useState, useEffect } from "react";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { PhoneInput } from "@/components/ui/phone-input";
import { Calendar } from "@/components/ui/calendar";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { format, addDays, startOfDay, isSunday, isSameDay } from "date-fns";

interface TimeSlot {
  time: string;
  datetime: Date;
  available: boolean;
  capacity: number;
  booked: number;
}


const BookConsultation = () => {
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
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(false);
  const [businessHours, setBusinessHours] = useState({ start: 9, end: 17 });

  // Fetch company settings for business hours
  const fetchScheduleData = async () => {
    try {
      // Fetch company settings for business hours
      const { data: settings, error: settingsError } = await supabase
        .from('company_settings')
        .select('*')
        .limit(1);

      if (settingsError) {
        console.error('Error fetching company settings:', settingsError);
      } else if (settings && settings.length > 0) {
        // Use company settings for business hours
        setBusinessHours({ start: 9, end: 17 }); // Default for now
      }
    } catch (error) {
      console.error('Error fetching schedule data:', error);
    }
  };

  // Generate time slots for a specific date
  const generateTimeSlotsForDate = async (date: Date): Promise<TimeSlot[]> => {
    const slots: TimeSlot[] = [];
    const dayOfWeek = date.getDay();
    
    // Skip Sundays
    if (dayOfWeek === 0) {
      return slots;
    }

    // TODO: Check for holidays when database types are updated
    // For now, assume no holidays
    
    let availableHours = { start: businessHours.start, end: businessHours.end };
    let agentCount = 4; // Default capacity - multiple agents can handle bookings

    // Generate 1-hour slots
    for (let hour = availableHours.start; hour < availableHours.end; hour++) {
      const slotTime = new Date(date);
      slotTime.setHours(hour, 0, 0, 0);
      
      const timeString = slotTime.toLocaleTimeString('en-US', {
        hour: 'numeric',
        hour12: true
      });
      
      slots.push({
        time: timeString,
        datetime: new Date(slotTime),
        available: true,
        capacity: agentCount,
        booked: 0
      });
    }
    
    return slots;
  };

  // Check slot availability and capacity
  const checkSlotAvailability = async (slots: TimeSlot[]) => {
    try {
      if (slots.length === 0) return slots;

      const slotTimes = slots.map(slot => slot.datetime.toISOString());
      
      const { data: bookedSlots, error } = await supabase
        .from('bookings')
        .select('booking_datetime')
        .eq('status', 'confirmed')
        .in('booking_datetime', slotTimes);

      if (error) {
        console.error('Error fetching bookings:', error);
        return slots;
      }

      // Count bookings per time slot
      const bookingCounts = new Map<string, number>();
      bookedSlots?.forEach(booking => {
        const timeKey = new Date(booking.booking_datetime).getTime().toString();
        bookingCounts.set(timeKey, (bookingCounts.get(timeKey) || 0) + 1);
      });

      return slots.map(slot => {
        const timeKey = slot.datetime.getTime().toString();
        const bookedCount = bookingCounts.get(timeKey) || 0;
        
        return {
          ...slot,
          booked: bookedCount,
          available: bookedCount < slot.capacity
        };
      });
    } catch (error) {
      console.error('Error checking availability:', error);
      return slots;
    }
  };

  // Load slots for selected date
  const loadSlotsForDate = async (date: Date) => {
    const slots = await generateTimeSlotsForDate(date);
    const slotsWithAvailability = await checkSlotAvailability(slots);
    setAvailableSlots(slotsWithAvailability);
  };

  useEffect(() => {
    fetchScheduleData();
  }, []);

  useEffect(() => {
    if (selectedDate) {
      loadSlotsForDate(selectedDate);
    } else {
      setAvailableSlots([]);
    }
  }, [selectedDate]);

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
      // Check if user came from funnel
      const funnelApplicationId = localStorage.getItem('funnel_application_id');
      
      // First create the booking
      console.log('Attempting to create booking with data:', {
        full_name: formData.fullName,
        email: formData.email,
        whatsapp_number: formData.whatsappNumber,
        business_timeline: formData.businessTimeline,
        investment_ready: formData.investmentReady === "Yes",
        seen_elyscents: formData.seenElyscents === "Yes",
        categories: formData.categories,
        booking_datetime: selectedSlot!.datetime.toISOString()
      });

      const { data: booking, error: bookingError } = await supabase
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
        })
        .select()
        .single();

      if (bookingError) {
        console.error('Booking error details:', {
          error: bookingError,
          code: bookingError.code,
          message: bookingError.message,
          details: bookingError.details,
          hint: bookingError.hint
        });
        toast({
          title: "Booking failed",
          description: bookingError.message || "Please try again or contact support.",
          variant: "destructive"
        });
        return;
      }

      console.log('Booking created successfully:', booking);

      // If user came from funnel, create the mapping
      if (funnelApplicationId && booking) {
        const { error: mappingError } = await supabase
          .from('lead_client_mapping')
          .insert({
            lead_type: 'booking',
            lead_id: booking.id,
            client_id: funnelApplicationId
          });
        
        if (mappingError) {
          console.error('Mapping error:', mappingError);
          // Don't fail the booking for mapping errors, just log
        }
        
        // Clear the funnel application ID since booking is complete
        localStorage.removeItem('funnel_application_id');
      }

      // TODO: Agent assignment will be implemented when database types are updated
      // For now, booking is created successfully without specific agent assignment
      
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

  // Check if date is available for booking (tomorrow onwards, no Sundays)
  const isDateAvailable = (date: Date) => {
    const today = startOfDay(new Date());
    const tomorrow = addDays(today, 1);
    
    return date >= tomorrow && !isSunday(date);
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900">
        <div className="container mx-auto px-6 py-12">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Book Your 1-on-1 Brand Strategy Call
            </h1>
            <p className="text-xl text-gray-200 max-w-3xl mx-auto">
              Get personalized guidance from the Elevate51 team and discover how to launch your ecommerce brand in 30–60 days.
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
                    className="mt-2 bg-blue-100 border-blue-200 text-black placeholder-gray-500"
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
                    className="mt-2 bg-blue-100 border-blue-200 text-black placeholder-gray-500"
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
                  className="mt-2 bg-blue-100 border-blue-200 text-black placeholder-gray-500"
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

              {/* Enhanced Calendar Booking Section */}
              {formData.investmentReady === "Yes" && (
                <div className="space-y-6">
                  <h3 className="text-white text-xl font-bold flex items-center gap-2">
                    <CalendarDays className="h-5 w-5" />
                    Select Date & Time for Your Call
                  </h3>
                  
                  <div className="bg-white/5 rounded-xl p-6 space-y-6">
                    {/* Enhanced Calendar */}
                    <div className="flex justify-center">
                      <div className="bg-white/10 rounded-xl border border-white/20 p-6 w-full max-w-md">
                        <Calendar
                          mode="single"
                          selected={selectedDate}
                          onSelect={setSelectedDate}
                          disabled={(date) => !isDateAvailable(date)}
                          className="w-full"
                          classNames={{
                            months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0 w-full",
                            month: "space-y-4 w-full",
                            caption: "flex justify-center pt-1 relative items-center mb-4",
                            caption_label: "text-white text-xl font-semibold",
                            nav: "space-x-1 flex items-center",
                            nav_button: "h-8 w-8 bg-white/10 text-white hover:bg-white/20 border border-white/20 rounded-md transition-colors",
                            nav_button_previous: "absolute left-1",
                            nav_button_next: "absolute right-1",
                            table: "w-full border-collapse space-y-1",
                            head_row: "flex w-full",
                            head_cell: "text-white/70 rounded-md w-full font-medium text-sm py-2 text-center",
                            row: "flex w-full mt-2",
                            cell: "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 w-full",
                            day: "h-10 w-full p-0 font-normal text-white hover:bg-white/20 rounded-md transition-colors aria-selected:bg-white aria-selected:text-purple-900 aria-selected:font-semibold",
                            day_selected: "bg-white text-purple-900 hover:bg-white hover:text-purple-900 focus:bg-white focus:text-purple-900 font-semibold",
                            day_today: "bg-white/20 text-white font-semibold",
                            day_outside: "text-white/30 opacity-50",
                            day_disabled: "text-white/20 opacity-30 cursor-not-allowed",
                            day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
                            day_hidden: "invisible",
                          }}
                        />
                      </div>
                    </div>

                    {/* Enhanced Time Slots */}
                    {selectedDate && (
                      <div className="space-y-6">
                        <div className="text-center">
                          <h4 className="text-white font-semibold text-lg mb-2">
                            Available times for {format(selectedDate, 'EEEE, MMMM d')}
                          </h4>
                          <div className="w-16 h-0.5 bg-white/30 mx-auto"></div>
                        </div>
                        
                        {availableSlots.length === 0 ? (
                          <div className="text-center py-12">
                            <div className="bg-white/5 rounded-xl p-8 border border-white/10">
                              <p className="text-white/70 text-lg">
                                {isSunday(selectedDate) 
                                  ? "We're closed on Sundays. Please select another day."
                                  : "No available time slots for this date."
                                }
                              </p>
                            </div>
                          </div>
                        ) : (
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
                            {availableSlots.map((slot, index) => (
                              <button
                                key={index}
                                type="button"
                                disabled={!slot.available}
                                onClick={() => setSelectedSlot(slot)}
                                className={`relative p-4 rounded-xl border-2 text-sm font-semibold transition-all duration-200 transform hover:scale-105 ${
                                  selectedSlot?.datetime.getTime() === slot.datetime.getTime()
                                    ? 'bg-white text-purple-900 border-white shadow-lg shadow-white/20'
                                    : slot.available
                                    ? 'bg-white/10 text-white border-white/30 hover:bg-white/20 hover:border-white/50'
                                    : 'bg-gray-500/10 text-gray-400 border-gray-500/20 cursor-not-allowed opacity-50'
                                }`}
                              >
                                <div className="text-base">{slot.time}</div>
                                {!slot.available ? (
                                  <div className="text-xs mt-1 text-red-300">Booked</div>
                                ) : slot.capacity > 1 && slot.booked > 0 && (
                                  <div className="text-xs mt-1 opacity-75">
                                    {slot.capacity - slot.booked} left
                                  </div>
                                )}
                                {selectedSlot?.datetime.getTime() === slot.datetime.getTime() && (
                                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full"></div>
                                )}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {selectedSlot && (
                      <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-xl p-6 border border-green-500/30 shadow-lg">
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-2 mb-2">
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                            <span className="text-green-400 font-semibold text-sm uppercase tracking-wide">Selected</span>
                          </div>
                          <p className="text-white text-lg font-medium">
                            {format(selectedSlot.datetime, 'EEEE, MMMM d')} at <span className="font-bold">{selectedSlot.time}</span>
                          </p>
                          <p className="text-white/70 text-sm mt-1">
                            Your consultation slot is reserved
                          </p>
                        </div>
                      </div>
                    )}
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

export default BookConsultation;