import { useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import YoutubeLite from "@/components/YoutubeLite";
import Footer from "@/components/Footer";
import { ChevronLeft, ChevronRight, Info, MessageCircle, Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

type MOQOption = {
  quantity: number;
  price: number;
  label: string;
  description?: string;
};

type Fragrance = {
  id: string;
  name: string;
  image: string;
};

type AddOnService = {
  id: string;
  name: string;
  price: number;
  description: string;
};

const FunnelStep1 = () => {
  const [showBrandBuilder, setShowBrandBuilder] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedMOQ, setSelectedMOQ] = useState<MOQOption | null>(null);
  const [selectedFragrances, setSelectedFragrances] = useState<string[]>([]);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const moqOptions: MOQOption[] = [
    { quantity: 100, price: 100000, label: "100 perfumes", description: "Perfect for testing the market" },
    { quantity: 200, price: 200000, label: "200 perfumes", description: "Great for small launches" },
    { quantity: 500, price: 500000, label: "500 perfumes", description: "Best for serious entrepreneurs" },
    { quantity: 1000, price: 1000000, label: "1000 perfumes", description: "Includes Free Branding Services" },
  ];

  const fragrances: Fragrance[] = [
    { id: "royal-oud", name: "Royal Oud", image: "/lovable-uploads/d1f314f0-16c6-47b1-8062-2dbe6fe39df4.png" },
    { id: "salsa-spirit", name: "Salsa Spirit", image: "/lovable-uploads/b6d365eb-70f9-498a-b1f8-5e2e83fa4067.png" },
    { id: "wild-essence", name: "Wild Essence", image: "/lovable-uploads/ea03fbff-1637-4bfc-b4b3-196df9c940be.png" },
    { id: "deep-calm", name: "Deep Calm", image: "/lovable-uploads/345687bf-1320-4212-86a1-45286f1ee5c0.png" },
    { id: "rosy-blossom", name: "Rosy Blossom", image: "/lovable-uploads/545193a6-63bf-438d-8757-590817be6702.png" },
  ];

  const addOnServices: AddOnService[] = [
    { id: "logo-design", name: "Logo Design", price: 20000, description: "Professional brand identity design" },
    { id: "packaging-design", name: "Premium Packaging Design + Sourcing", price: 20000, description: "Complete packaging solution" },
    { id: "shopify-store", name: "Shopify Store with Content", price: 50000, description: "Fully built ecommerce store" },
    { id: "social-media", name: "Social Media Handle Setup", price: 15000, description: "Professional social profiles" },
    { id: "ad-account", name: "Ad Account & Pixel Setup", price: 15000, description: "Facebook & Instagram advertising setup" },
    { id: "photoshoot", name: "Professional Product Photoshoot", price: 25000, description: "High-quality product images" },
    { id: "video-ad", name: "Video Ad Creation (Script + Shoot + Edit)", price: 45000, description: "Professional marketing video" },
    { id: "courier-setup", name: "Courier Account Setup + Delivery/Return Guidance", price: 10000, description: "Complete logistics solution" },
    { id: "fbr-registration", name: "FBR Registration (NTN)", price: 15000, description: "Legal business registration" },
    { id: "trademark", name: "Logo Trademark Registration", price: 15000, description: "Protect your brand legally" },
    { id: "training", name: "1-Month Training on Running & Scaling Brand", price: 40000, description: "Personal mentorship program" },
    { id: "fast-delivery", name: "Fast Delivery (30 Days instead of 60)", price: 25000, description: "Rush your order" },
  ];

  const calculateTotal = () => {
    let total = selectedMOQ?.price || 0;
    
    if (selectedMOQ?.quantity === 1000) {
      // Free services for 1000 quantity
      return total;
    }
    
    selectedServices.forEach(serviceId => {
      const service = addOnServices.find(s => s.id === serviceId);
      if (service) total += service.price;
    });
    
    return total;
  };

  const getServicePrice = (serviceId: string) => {
    if (selectedMOQ?.quantity === 1000) return 0;
    const service = addOnServices.find(s => s.id === serviceId);
    return service?.price || 0;
  };

  const handleFragranceToggle = (fragranceId: string) => {
    setSelectedFragrances(prev => 
      prev.includes(fragranceId) 
        ? prev.filter(id => id !== fragranceId)
        : [...prev, fragranceId]
    );
  };

  const handleServiceToggle = (serviceId: string) => {
    setSelectedServices(prev => 
      prev.includes(serviceId) 
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const handleWhatsAppHelp = () => {
    window.open('https://wa.me/923148860546?text=Hi, I need help choosing my perfume brand package', '_blank');
  };

  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      const selectedFragranceNames = selectedFragrances.map(id => 
        fragrances.find(f => f.id === id)?.name
      ).filter(Boolean);
      
      const selectedServiceNames = selectedServices.map(id => 
        addOnServices.find(s => s.id === id)?.name
      ).filter(Boolean);

      const orderDetails = {
        moq: selectedMOQ,
        fragrances: selectedFragranceNames,
        services: selectedServiceNames,
        total: calculateTotal(),
        timestamp: new Date().toISOString()
      };

      const { error } = await supabase
        .from("full_applications")
        .insert([{ 
          email: "brand-builder@elevate51.com",
          phone: "Brand Builder Order",
          city: "Online",
          has_business: "Brand Builder",
          category: "Perfume",
          motivation: JSON.stringify(orderDetails),
          build_support: "Yes",
          investment_range: `Rs. ${calculateTotal().toLocaleString()}`
        }]);

      if (error) throw error;
      
      navigate("/thank-you");
    } catch (error) {
      console.error("Error submitting order:", error);
      toast({
        title: "Something went wrong",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const canProceedFromStep = (step: number) => {
    switch (step) {
      case 1: return selectedMOQ !== null;
      case 2: return selectedFragrances.length > 0;
      case 3: return true; // Services are optional
      default: return true;
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900">
        <div className="container mx-auto px-6 py-12">
          <div className="max-w-4xl mx-auto text-center">
            {/* Updated Headline */}
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-8 leading-tight">
              Become a Brand Owner in 40 Days — 
              <span className="block mt-2 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                Even Without a Product
              </span>
            </h1>

            {/* Updated Subheadline */}
            <p className="text-xl text-gray-200 mb-8 max-w-3xl mx-auto">
              We help beginners launch their own perfume, beard oil, skincare, or health brands — with packaging, store, design, and ads — all done-for-you.
            </p>

            {/* Video - Keep exactly as is */}
            <div className="relative mb-6">
              <div className="w-full max-w-3xl mx-auto">
                <YoutubeLite
                  videoId="nTqJnVJilK4"
                  alt="Watch how we help launch product brands"
                />
              </div>
            </div>

            {/* New Section: What We'll Do For You */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 mb-12">
              <h2 className="text-3xl font-bold text-white mb-6">
                🟣 What We'll Do For You – In Just 40 Days
              </h2>
              <p className="text-xl text-gray-200 mb-6">
                We don't just help you design a logo or give you a course — we build your entire brand from scratch, ready to sell.
              </p>
              
              <div className="text-left max-w-2xl mx-auto">
                <p className="text-lg font-semibold text-white mb-4">Here's what's included:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-gray-200">
                  <div>✅ Custom Brand Name & Logo</div>
                  <div>✅ Premium Packaging & Label Design</div>
                  <div>✅ Product Bottles with Printing</div>
                  <div>✅ Shopify Store (Fully Built for You)</div>
                  <div>✅ Product Photography + 1 Launch Ad Video</div>
                  <div>✅ Social Media Account Setup</div>
                  <div>✅ Facebook Ad Manager + Pixel Integration</div>
                  <div>✅ COD Courier + Payment Setup</div>
                  <div>✅ FBR NTN & Govt Trademark Registration</div>
                  <div>✅ Full 1-on-1 Guidance Till You Launch</div>
                </div>
                
                <div className="bg-yellow-500/20 rounded-lg p-4 mt-6 border border-yellow-500/30">
                  <p className="text-yellow-200 font-medium">
                    📦 Start with as low as 100 units of product, or go big with 1,000 units and 0 service charges
                  </p>
                </div>
              </div>
            </div>

            {/* Elyscents Success Story Section */}
            <div className="bg-gradient-to-br from-purple-600 to-indigo-600 text-white rounded-2xl p-8 border border-white/20 mb-12">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                  <h3 className="text-3xl font-bold mb-6">
                    <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                      Our Success Story: Elyscents
                    </span>
                  </h3>
                  <p className="text-lg mb-6 leading-relaxed text-purple-100">
                    Starting with the same Rs 350k investment package, Elyscents has grown into Pakistan's 
                    leading online perfume brand, consistently achieving 500+ orders daily and generating 
                    millions in revenue.
                  </p>
                  
                  <div className="grid grid-cols-2 gap-6 mb-8">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-yellow-400 mb-2">500+</div>
                      <div className="text-purple-200">Daily Orders</div>
                    </div>
                    <div className="text-center">
                      <div className="text-4xl font-bold text-yellow-400 mb-2">5 Crore+</div>
                      <div className="text-purple-200">Monthly Revenue</div>
                    </div>
                    <div className="text-center">
                      <div className="text-4xl font-bold text-yellow-400 mb-2">150k+</div>
                      <div className="text-purple-200">Happy Customers</div>
                    </div>
                    <div className="text-center">
                      <div className="text-4xl font-bold text-yellow-400 mb-2">2 Years</div>
                      <div className="text-purple-200">To Success</div>
                    </div>
                  </div>
                  
                  <blockquote className="text-lg italic text-purple-100 border-l-4 border-yellow-400 pl-6">
                    "The same proven system that built Elyscents can build your brand. 
                    We know what works because we've done it ourselves."
                  </blockquote>
                </div>
                
                <div className="relative">
                  <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8">
                    <img alt="Elyscents Success" className="w-full h-auto object-contain rounded-lg mb-6" src="/lovable-uploads/d6f10d6b-e8dd-46fe-9eb2-ee755fada5c8.png" />
                    <div className="text-center">
                      <h4 className="text-xl font-semibold mb-2">From Startup to Market Leader</h4>
                      <p className="text-purple-200">
                        The exact blueprint we used for Elyscents is now available for your brand.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Two Ways to Start Section - Above Form */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 mb-12">
              <h2 className="text-3xl font-bold text-white mb-6">
                💼 Two Ways to Start Your Brand
              </h2>
              <p className="text-xl text-gray-200 mb-6">
                Pick the plan that matches your goal and investment:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-white/10 rounded-lg p-6 border border-white/20">
                  <h3 className="text-xl font-bold text-yellow-400 mb-2">Starter Plan</h3>
                  <p className="text-gray-200 mb-2">Low MOQ, Rs. 250k service fee</p>
                  <p className="text-sm text-yellow-300 font-semibold">Minimum investment required: 350k</p>
                </div>
                <div className="bg-white/10 rounded-lg p-6 border border-white/20">
                  <h3 className="text-xl font-bold text-green-400 mb-2">Growth Plan</h3>
                  <p className="text-gray-200 mb-2">High MOQ, Rs. 0 service fee</p>
                  <p className="text-sm text-green-300 font-semibold">Minimum investment required: 1,000,000</p>
                </div>
              </div>
              
              <p className="text-gray-200">
                No matter which plan you choose, you'll get everything needed to launch like a pro.
              </p>
            </div>

            {/* Brand Builder CTA */}
            {!showBrandBuilder ? (
              <div className="max-w-2xl mx-auto">
                <h2 className="text-2xl md:text-3xl font-semibold text-white mb-8">
                  Start Building Your Perfume Brand
                </h2>
                
                <Button
                  onClick={() => setShowBrandBuilder(true)}
                  className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black font-bold py-6 px-8 rounded-lg text-xl transition-all duration-300 transform hover:scale-105"
                >
                  🎨 Customize Your Brand & Start Now
                </Button>
                
                <p className="text-gray-300 text-center mt-4">
                  Interactive brand builder with live pricing
                </p>
              </div>
            ) : (
              /* Brand Builder Interface */
              <div className="max-w-7xl mx-auto">
                <div className="flex flex-col lg:flex-row gap-8">
                  {/* Main Content */}
                  <div className="flex-1">
                    {/* Progress Steps */}
                    <div className="flex items-center justify-center mb-8">
                      {[1, 2, 3, 4].map((step) => (
                        <div key={step} className="flex items-center">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                            step === currentStep ? 'bg-yellow-500 text-black' :
                            step < currentStep ? 'bg-green-500 text-white' :
                            'bg-white/20 text-gray-300'
                          }`}>
                            {step < currentStep ? <Check className="w-5 h-5" /> : step}
                          </div>
                          {step < 4 && (
                            <div className={`w-16 h-1 mx-2 ${
                              step < currentStep ? 'bg-green-500' : 'bg-white/20'
                            }`} />
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Step Content */}
                    <Card className="bg-white/10 backdrop-blur-lg border-white/20">
                      <CardHeader>
                        <CardTitle className="text-white text-2xl">
                          {currentStep === 1 && "Step 1: Select Your MOQ"}
                          {currentStep === 2 && "Step 2: Select Your Fragrances"}
                          {currentStep === 3 && "Step 3: Choose Add-On Services"}
                          {currentStep === 4 && "Step 4: Summary & Confirmation"}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        {/* Step 1: MOQ Selection */}
                        {currentStep === 1 && (
                          <RadioGroup 
                            value={selectedMOQ?.quantity.toString() || ""} 
                            onValueChange={(value) => {
                              const moq = moqOptions.find(m => m.quantity === parseInt(value));
                              setSelectedMOQ(moq || null);
                            }}
                            className="space-y-4"
                          >
                            {moqOptions.map((option) => (
                              <div key={option.quantity} className="flex items-center space-x-3 p-4 bg-white/5 rounded-lg">
                                <RadioGroupItem value={option.quantity.toString()} id={option.quantity.toString()} />
                                <Label htmlFor={option.quantity.toString()} className="flex-1 cursor-pointer">
                                  <div className="flex justify-between items-center">
                                    <div>
                                      <div className="text-white font-semibold">{option.label}</div>
                                      <div className="text-gray-300 text-sm">{option.description}</div>
                                    </div>
                                    <div className="text-yellow-400 font-bold">
                                      Rs. {option.price.toLocaleString()}
                                      {option.quantity === 1000 && (
                                        <div className="text-green-400 text-xs">+ Free Branding Services</div>
                                      )}
                                    </div>
                                  </div>
                                </Label>
                              </div>
                            ))}
                          </RadioGroup>
                        )}

                        {/* Step 2: Fragrance Selection */}
                        {currentStep === 2 && (
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {fragrances.map((fragrance) => (
                              <div 
                                key={fragrance.id} 
                                className={`p-4 rounded-lg border cursor-pointer transition-all ${
                                  selectedFragrances.includes(fragrance.id)
                                    ? 'border-yellow-400 bg-yellow-400/10'
                                    : 'border-white/20 bg-white/5 hover:border-white/40'
                                }`}
                                onClick={() => handleFragranceToggle(fragrance.id)}
                              >
                                <div className="relative mb-3">
                                  <img 
                                    src={fragrance.image} 
                                    alt={fragrance.name}
                                    className="w-full h-48 object-cover rounded-lg"
                                  />
                                  {selectedFragrances.includes(fragrance.id) && (
                                    <div className="absolute top-2 right-2 bg-yellow-400 text-black rounded-full p-1">
                                      <Check className="w-4 h-4" />
                                    </div>
                                  )}
                                </div>
                                <h3 className="text-white font-semibold text-center">{fragrance.name}</h3>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Step 3: Services Selection */}
                        {currentStep === 3 && (
                          <div className="space-y-4">
                            {selectedMOQ?.quantity === 1000 && (
                              <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4 mb-6">
                                <h3 className="text-green-400 font-bold mb-2">🎉 Congratulations!</h3>
                                <p className="text-green-200">
                                  You've selected 1000 perfumes, so all the services below are included FREE!
                                </p>
                              </div>
                            )}
                            
                            {addOnServices.map((service) => (
                              <div key={service.id} className="flex items-start space-x-3 p-4 bg-white/5 rounded-lg">
                                <Checkbox
                                  id={service.id}
                                  checked={selectedServices.includes(service.id)}
                                  onCheckedChange={() => handleServiceToggle(service.id)}
                                />
                                <div className="flex-1">
                                  <Label htmlFor={service.id} className="cursor-pointer">
                                    <div className="flex justify-between items-start">
                                      <div>
                                        <div className="text-white font-semibold">{service.name}</div>
                                        <div className="text-gray-300 text-sm">{service.description}</div>
                                      </div>
                                      <div className="text-yellow-400 font-bold">
                                        {getServicePrice(service.id) === 0 ? 'FREE' : `Rs. ${getServicePrice(service.id).toLocaleString()}`}
                                      </div>
                                    </div>
                                  </Label>
                                </div>
                                <Info className="w-4 h-4 text-gray-400 mt-1" />
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Step 4: Summary */}
                        {currentStep === 4 && (
                          <div className="space-y-6">
                            <div className="bg-white/5 rounded-lg p-6">
                              <h3 className="text-white font-bold text-xl mb-4">Order Summary</h3>
                              
                              <div className="space-y-3">
                                <div className="flex justify-between">
                                  <span className="text-gray-300">MOQ Selected:</span>
                                  <span className="text-white">{selectedMOQ?.label}</span>
                                </div>
                                
                                <div className="flex justify-between">
                                  <span className="text-gray-300">Selected Fragrances:</span>
                                  <div className="text-right">
                                    {selectedFragrances.map(id => {
                                      const fragrance = fragrances.find(f => f.id === id);
                                      return (
                                        <div key={id} className="text-white">{fragrance?.name}</div>
                                      );
                                    })}
                                  </div>
                                </div>
                                
                                {selectedServices.length > 0 && (
                                  <div className="flex justify-between">
                                    <span className="text-gray-300">Add-on Services:</span>
                                    <div className="text-right">
                                      {selectedServices.map(id => {
                                        const service = addOnServices.find(s => s.id === id);
                                        return (
                                          <div key={id} className="text-white text-sm">
                                            {service?.name} - {getServicePrice(id) === 0 ? 'FREE' : `Rs. ${getServicePrice(id).toLocaleString()}`}
                                          </div>
                                        );
                                      })}
                                    </div>
                                  </div>
                                )}
                                
                                <div className="border-t border-white/20 pt-3 flex justify-between text-xl font-bold">
                                  <span className="text-white">Total Amount:</span>
                                  <span className="text-yellow-400">Rs. {calculateTotal().toLocaleString()}</span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-4">
                              <p className="text-yellow-200 font-bold text-center">
                                ✅ I want to build my perfume brand with Elevate51
                              </p>
                            </div>
                            
                            <Button
                              onClick={handleFinalSubmit}
                              disabled={isSubmitting}
                              className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-bold py-4 px-8 rounded-lg text-lg"
                            >
                              {isSubmitting ? "Processing..." : "Yes, Proceed"}
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    {/* Navigation Buttons */}
                    <div className="flex justify-between mt-8">
                      <Button
                        onClick={prevStep}
                        disabled={currentStep === 1}
                        variant="outline"
                        className="flex items-center gap-2"
                      >
                        <ChevronLeft className="w-4 h-4" /> Previous
                      </Button>
                      
                      {currentStep < 4 ? (
                        <Button
                          onClick={nextStep}
                          disabled={!canProceedFromStep(currentStep)}
                          className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-black"
                        >
                          Next <ChevronRight className="w-4 h-4" />
                        </Button>
                      ) : null}
                    </div>
                  </div>

                  {/* Price Calculator Sidebar */}
                  <div className="lg:w-80">
                    <div className="sticky top-4">
                      <Card className="bg-white/10 backdrop-blur-lg border-white/20">
                        <CardHeader>
                          <CardTitle className="text-white text-lg">Live Price Calculator</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="flex justify-between">
                            <span className="text-gray-300">MOQ:</span>
                            <span className="text-white">
                              {selectedMOQ ? `Rs. ${selectedMOQ.price.toLocaleString()}` : 'Rs. 0'}
                            </span>
                          </div>
                          
                          {selectedServices.length > 0 && (
                            <div className="space-y-2">
                              <div className="text-gray-300 text-sm">Services:</div>
                              {selectedServices.map(id => {
                                const service = addOnServices.find(s => s.id === id);
                                const price = getServicePrice(id);
                                return (
                                  <div key={id} className="flex justify-between text-sm">
                                    <span className="text-gray-400">{service?.name.substring(0, 20)}...</span>
                                    <span className="text-white">
                                      {price === 0 ? 'FREE' : `Rs. ${price.toLocaleString()}`}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                          
                          <div className="border-t border-white/20 pt-4 flex justify-between text-xl font-bold">
                            <span className="text-white">Total:</span>
                            <span className="text-yellow-400">Rs. {calculateTotal().toLocaleString()}</span>
                          </div>
                          
                          {selectedMOQ?.quantity === 1000 && (
                            <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-3">
                              <p className="text-green-400 text-sm font-medium">
                                🎉 Free Branding Services Included!
                              </p>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* WhatsApp Help Button */}
            <Button
              onClick={handleWhatsAppHelp}
              className="fixed bottom-6 right-6 bg-green-500 hover:bg-green-600 text-white rounded-full p-4 shadow-lg z-50 flex items-center gap-2"
            >
              <MessageCircle className="w-5 h-5" />
              <span className="hidden sm:inline">Need help choosing? Chat with our team</span>
              <span className="sm:hidden">Help</span>
            </Button>

            {/* Emotional Copy */}
            {!showBrandBuilder && (
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 mb-8 mt-16">
                <p className="text-xl text-gray-200 leading-relaxed">
                  You're not just launching a product — you're stepping into a new identity: <span className="text-yellow-400 font-bold">Brand Owner</span>.
                </p>
                <p className="text-lg text-gray-200 mt-4">
                  We've helped dozens of people start profitable ecommerce brands — without any marketing background, design skills, or warehouse.
                </p>
                <p className="text-lg text-gray-200 mt-4">
                  Your vision + our team = fully launched business in 40-60 days.
                </p>
                <p className="text-lg text-red-300 font-semibold mt-4 mb-6">
                  Limited to 20 clients per month only.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default FunnelStep1;
