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
import { 
  formatPakistanTime, 
  formatPakistanDateTime, 
  createPakistanTimeSlot, 
  isWithinPakistanBusinessHours,
  toPakistanTime 
} from "@/lib/timezone";

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

  // Get available agent count (excluding SuperAdmins)
  const getAgentCapacity = async (): Promise<number> => {
    try {
      const { data: agents, error } = await supabase
        .from('user_profiles')
        .select('role')
        .in('role', ['Admin', 'SalesAgent']);

      if (error) {
        console.error('Error fetching agents:', error);
        return 3; // Fallback capacity
      }

      return agents?.length || 3;
    } catch (error) {
      console.error('Error getting agent capacity:', error);
      return 3; // Fallback capacity
    }
  };

  // Load slots for selected date using the new edge function
  const loadSlotsForDate = async (date: Date) => {
    if (!date) return;
    
    try {
      const dateString = date.toISOString().split('T')[0];
      const response = await fetch(
        `https://bsqtjhjqytuncpvbnuwp.supabase.co/functions/v1/get-slot-availability?date=${dateString}&startHour=${businessHours.start}&endHour=${businessHours.end}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.error) {
        console.warn('No slots available:', data.error);
        setAvailableSlots([]);
        return;
      }

      // Map the slots to our TimeSlot interface
      const slots: TimeSlot[] = data.slots.map((slot: any) => ({
        time: slot.time,
        datetime: new Date(slot.datetime),
        available: slot.available,
        capacity: slot.capacity,
        booked: slot.booked
      }));

      setAvailableSlots(slots);
    } catch (error) {
      console.error('Error fetching slot availability:', error);
      // Fallback to empty slots
      setAvailableSlots([]);
    }
  };

  useEffect(() => {
    const initializeSchedule = async () => {
      await fetchScheduleData();
      await getNext3WorkingDays();
    };
    initializeSchedule();
  }, []);

  useEffect(() => {
    if (selectedDate) {
      loadSlotsForDate(selectedDate);
      
      // Set up auto-refresh every 30 seconds when a date is selected
      const interval = setInterval(() => {
        if (!loading) { // Don't refresh if currently booking
          loadSlotsForDate(selectedDate);
        }
      }, 30000);

      return () => clearInterval(interval);
    } else {
      setAvailableSlots([]);
    }
  }, [selectedDate, businessHours]);

  // Add real-time slot refresh when user becomes active again
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && selectedDate && !loading) {
        loadSlotsForDate(selectedDate);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [selectedDate, loading]);

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

    if (!selectedSlot) {
      toast({
        title: "Please select a time slot",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    try {
      console.log('Creating atomic booking...');
      
      // Use the atomic booking edge function
      const response = await fetch('https://bsqtjhjqytuncpvbnuwp.supabase.co/functions/v1/create-booking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          whatsappNumber: formData.whatsappNumber,
          categories: formData.categories,
          businessTimeline: formData.businessTimeline,
          investmentReady: formData.investmentReady === "Yes",
          seenElyscents: formData.seenElyscents === "Yes",
          bookingDatetime: selectedSlot.datetime.toISOString()
        })
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        // Handle specific error codes
        if (result.error_code === 'CAPACITY_EXCEEDED') {
          toast({
            title: "Time slot no longer available",
            description: "This slot was just booked by someone else. Please select another time.",
            variant: "destructive"
          });
          
          // Refresh availability for current date
          if (selectedDate) {
            await loadSlotsForDate(selectedDate);
          }
          setSelectedSlot(null);
          return;
        }
        
        if (result.error_code === 'DUPLICATE_BOOKING') {
          toast({
            title: "Duplicate booking detected",
            description: "You already have a booking for this time slot.",
            variant: "destructive"
          });
          return;
        }

        throw new Error(result.error || 'Booking failed');
      }

      console.log('Booking created successfully:', result);

      // Handle funnel mapping if needed
      const funnelApplicationId = localStorage.getItem('funnel_application_id');
      if (funnelApplicationId && result.booking_id) {
        try {
          const { error: mappingError } = await supabase
            .from('lead_client_mapping')
            .insert({
              lead_type: 'booking',
              lead_id: result.booking_id,
              client_id: funnelApplicationId
            });
          
          if (mappingError) {
            console.error('Mapping error:', mappingError);
          }
          
          localStorage.removeItem('funnel_application_id');
        } catch (mappingError) {
          console.error('Error creating mapping:', mappingError);
          // Don't fail the booking for mapping errors
        }
      }
      
      toast({
        title: "Booking confirmed!",
        description: "Redirecting you to confirmation page..."
      });

      // Redirect to thank you page with booking details
      navigate('/book-consultation/thank-you', {
        state: {
          bookingTime: selectedSlot.datetime,
          fullName: formData.fullName
        }
      });
      
    } catch (error) {
      console.error('Booking error:', error);
      toast({
        title: "Booking failed",
        description: "An error occurred while creating your booking. Please try again.",
        variant: "destructive"  
      });
    } finally {
      setLoading(false);
    }
  };

  // Get the next 3 working days (excluding Sundays and holidays)
  const [availableBookingDates, setAvailableBookingDates] = useState<Date[]>([]);

  const getNext3WorkingDays = async () => {
    const workingDays: Date[] = [];
    const today = startOfDay(new Date());
    let currentDate = addDays(today, 1); // Start from tomorrow
    let daysChecked = 0;
    const maxDaysToCheck = 14; // Prevent infinite loops
    
    // Fetch holidays once
    const { data: holidays } = await supabase
      .from('holidays')
      .select('date');
    
    const holidayDates = holidays?.map(h => h.date) || [];

    while (workingDays.length < 3 && daysChecked < maxDaysToCheck) {
      const dateString = currentDate.toISOString().split('T')[0];
      const isHoliday = holidayDates.includes(dateString);
      const isSundayDate = isSunday(currentDate);
      
      // If it's not Sunday and not a holiday, it's a working day
      if (!isSundayDate && !isHoliday) {
        workingDays.push(new Date(currentDate));
      }
      
      currentDate = addDays(currentDate, 1);
      daysChecked++;
    }
    
    setAvailableBookingDates(workingDays);
    return workingDays;
  };

  // Check if date is available for booking (must be one of the 3 working days)
  const isDateAvailable = (date: Date) => {
    return availableBookingDates.some(availableDate => 
      isSameDay(date, availableDate)
    );
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
                   <div className="flex items-center justify-between">
                     <h3 className="text-white text-xl font-bold flex items-center gap-2">
                       <CalendarDays className="h-5 w-5" />
                       Select Date & Time for Your Call
                     </h3>
                     {selectedDate && (
                       <button
                         type="button"
                         onClick={() => loadSlotsForDate(selectedDate)}
                         disabled={loading}
                         className="flex items-center gap-2 px-3 py-2 text-sm text-white/80 hover:text-white border border-white/20 hover:border-white/40 rounded-lg transition-colors disabled:opacity-50"
                       >
                         <div className={`w-4 h-4 border-2 border-white/20 border-t-white rounded-full ${loading ? 'animate-spin' : ''}`}></div>
                         Refresh
                       </button>
                     )}
                   </div>
                  <p className="text-sm text-gray-300 mt-1">All times shown in Pakistan Time (PKT)</p>
                  
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
                                 disabled={!slot.available || loading}
                                 onClick={() => setSelectedSlot(slot)}
                                 className={`relative p-4 rounded-xl border-2 text-sm font-semibold transition-all duration-200 transform hover:scale-105 ${
                                   selectedSlot?.datetime.getTime() === slot.datetime.getTime()
                                     ? 'bg-white text-purple-900 border-white shadow-lg shadow-white/20'
                                     : slot.available && !loading
                                     ? 'bg-white/10 text-white border-white/30 hover:bg-white/20 hover:border-white/50'
                                     : 'bg-gray-500/10 text-gray-400 border-gray-500/20 cursor-not-allowed opacity-50'
                                 }`}
                               >
                                 <div className="text-base">{slot.time}</div>
                                 {!slot.available ? (
                                   <div className="text-xs mt-1 text-red-300">Full</div>
                                 ) : slot.capacity > 1 && (
                                   <div className="text-xs mt-1 opacity-75">
                                     {slot.capacity - slot.booked} left
                                   </div>
                                 )}
                                 {loading && (
                                   <div className="absolute inset-0 bg-black/20 rounded-xl flex items-center justify-center">
                                     <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                                   </div>
                                 )}
                                 {selectedSlot?.datetime.getTime() === slot.datetime.getTime() && !loading && (
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