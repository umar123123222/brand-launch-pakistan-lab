import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PhoneInput } from "@/components/ui/phone-input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const PrivateLabel = () => {
  const { toast } = useToast();
  const [configuration, setConfiguration] = useState({
    oil: "",
    concentration: "",
    bottle: "",
    packaging: "",
    moq: 100,
  });
  
  const [costs, setCosts] = useState({
    juiceCost: 0,
    bottleCost: 0,
    packagingCost: 0,
    discount: 0,
    perUnitCost: 0,
    totalCost: 0,
  });

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    whatsapp: "",
    brandName: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // Sample data - in real app would come from database
  const oils = [
    { name: "Oud Royal", image: "/lovable-uploads/4a30fe7c-aeab-4011-88f6-d91d0122b964.png" },
    { name: "Fresh Citrus", image: "/lovable-uploads/53cc11bc-4d55-42c9-a34c-07be86220d1a.png" },
    { name: "Vanilla Musk", image: "/lovable-uploads/856ba223-c451-4be0-b915-f524b0311c0e.png" },
    { name: "Rose Garden", image: "/lovable-uploads/cdef5520-38aa-405b-bc29-373b2ba78c28.png" }
  ];

  const bottles = [
    { name: "Classic 50ml", price: 220, image: "/lovable-uploads/d45b5583-4570-41f6-ad16-84cf447f0423.png" },
    { name: "Premium 50ml", price: 280, image: "/lovable-uploads/d6f10d6b-e8dd-46fe-9eb2-ee755fada5c8.png" },
    { name: "Luxury 50ml", price: 300, image: "/lovable-uploads/ddae2a1d-da08-4405-bb49-6736d7f35a26.png" }
  ];

  const packagings = [
    { name: "Minimal Box", price: 200 },
    { name: "Premium Box", price: 250 },
    { name: "Luxury Box", price: 350 }
  ];

  const concentrations = [
    { name: "25% Concentration", price: 600 },
    { name: "20% Concentration", price: 500 },
    { name: "16% Concentration", price: 450 }
  ];

  // Calculate costs whenever configuration changes
  const updateCosts = (newConfig = configuration) => {
    const concentrationPrice = concentrations.find(c => c.name === newConfig.concentration)?.price || 0;
    const bottlePrice = bottles.find(b => b.name === newConfig.bottle)?.price || 0;
    const packagingPrice = packagings.find(p => p.name === newConfig.packaging)?.price || 0;
    
    const juiceCost = concentrationPrice * newConfig.moq;
    const bottleCostTotal = bottlePrice * newConfig.moq;
    const packagingCostTotal = packagingPrice * newConfig.moq;
    
    let discountPercent = 0;
    if (newConfig.moq >= 1000) discountPercent = 15;
    else if (newConfig.moq >= 500) discountPercent = 10;
    
    const subtotal = juiceCost + bottleCostTotal + packagingCostTotal;
    const discountAmount = (subtotal * discountPercent) / 100;
    const totalCost = subtotal - discountAmount;
    const perUnitCost = totalCost / newConfig.moq;
    
    setCosts({
      juiceCost,
      bottleCost: bottleCostTotal,
      packagingCost: packagingCostTotal,
      discount: discountAmount,
      perUnitCost,
      totalCost,
    });
  };

  const handleConfigChange = (field: string, value: string | number) => {
    const newConfig = { ...configuration, [field]: value };
    setConfiguration(newConfig);
    updateCosts(newConfig);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.whatsapp || !formData.brandName) {
      toast({
        title: "Please fill all fields",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("supplier_leads").insert({
        name: formData.name,
        email: formData.email,
        whatsapp: formData.whatsapp,
        brand_name: formData.brandName,
        selected_oil: configuration.oil,
        concentration: configuration.concentration,
        selected_bottle: configuration.bottle,
        selected_packaging: configuration.packaging,
        moq: configuration.moq,
        estimated_per_unit_cost: costs.perUnitCost,
        estimated_total_cost: costs.totalCost,
      });

      if (error) throw error;

      toast({
        title: "Configuration Saved!",
        description: "Our team will contact you within 24 hours.",
      });
      
      setShowModal(false);
      setFormData({ name: "", email: "", whatsapp: "", brandName: "" });
      
    } catch (error) {
      toast({
        title: "Error saving configuration",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const scrollToConfigurator = () => {
    document.getElementById('configurator')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToSuccessStory = () => {
    document.getElementById('success-story')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="relative min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 flex items-center justify-center text-white overflow-hidden pt-32">
        {/* Background Pattern */}
        <div className="absolute inset-0 pointer-events-none select-none" aria-hidden="true">
          <div className="absolute top-20 left-20 w-56 h-56 bg-gradient-to-r from-yellow-400 to-pink-400 rounded-full blur-xl opacity-20"></div>
          <div className="absolute bottom-20 right-20 w-60 h-60 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full blur-xl opacity-20"></div>
        </div>
        
        <div className="container mx-auto px-6 text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent block">
              Launch Your Perfume Brand
            </span>
            <span className="block mt-1">in 30 Days</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-200 max-w-3xl mx-auto leading-relaxed">
            Premium oils, custom packaging, and full private label manufacturing — from concept to delivery.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 px-8 py-4 text-lg font-semibold rounded-full text-zinc-900"
              onClick={scrollToConfigurator}
            >
              Start Configuring
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-purple-900 px-8 py-4 text-lg font-semibold rounded-full"
              onClick={scrollToSuccessStory}
            >
              See Elyscents Success Story
            </Button>
          </div>
        </div>
      </section>

      {/* Elyscents Success Story */}
      <section id="success-story" className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              How We Scaled
              <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent"> Elyscents.pk</span>
              <br />to 600+ Orders Per Day
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Elyscents started exactly where you are today — with a small private label dream. In less than a year, 
              we scaled to 600+ daily orders and 5–6 crore PKR monthly sales, powered by the same supply chain and 
              creative strategies you'll access here.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <Badge className="bg-yellow-100 text-yellow-800 text-2xl font-bold px-4 py-2 mb-2">600+</Badge>
                <p className="text-gray-600">Orders Daily</p>
              </div>
              <div className="text-center">
                <Badge className="bg-green-100 text-green-800 text-2xl font-bold px-4 py-2 mb-2">5.5 Crore PKR</Badge>
                <p className="text-gray-600">Monthly Revenue</p>
              </div>
              <div className="text-center">
                <Badge className="bg-purple-100 text-purple-800 text-2xl font-bold px-4 py-2 mb-2">15+</Badge>
                <p className="text-gray-600">Signature Oils</p>
              </div>
            </div>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-8 py-4 text-lg font-semibold rounded-full">
                  View Full Case Study
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Elyscents Growth Story</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <p>From zero to 600+ daily orders in 12 months:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Started with 5 signature fragrances</li>
                    <li>Scaled to 15+ unique formulations</li>
                    <li>Built loyal customer base through quality</li>
                    <li>Optimized supply chain for fast delivery</li>
                    <li>Leveraged social media marketing</li>
                  </ul>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </section>

      {/* Configurator */}
      <section id="configurator" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Configure Your
              <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent"> Perfect Perfume</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Select your preferred oils, bottles, and packaging to see live pricing and reserve your production slot.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-7xl mx-auto">
            {/* Configuration Steps */}
            <div className="space-y-8">
              {/* Step 1: Oil Selection */}
              <Card>
                <CardHeader>
                  <CardTitle>Step 1: Select Perfume Oil</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    {oils.map((oil) => (
                      <div
                        key={oil.name}
                        className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                          configuration.oil === oil.name 
                            ? 'border-purple-500 bg-purple-50' 
                            : 'border-gray-200 hover:border-purple-300'
                        }`}
                        onClick={() => handleConfigChange('oil', oil.name)}
                      >
                        <img src={oil.image} alt={oil.name} className="w-full h-24 object-cover rounded mb-2" />
                        <p className="text-center font-medium">{oil.name}</p>
                      </div>
                    ))}
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Concentration</Label>
                    <Select value={configuration.concentration} onValueChange={(value) => handleConfigChange('concentration', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose concentration" />
                      </SelectTrigger>
                      <SelectContent>
                        {concentrations.map((conc) => (
                          <SelectItem key={conc.name} value={conc.name}>
                            {conc.name} - Rs {conc.price} / 50ml juice
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Step 2: Bottle Selection */}
              <Card>
                <CardHeader>
                  <CardTitle>Step 2: Select Bottle Design</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4">
                    {bottles.map((bottle) => (
                      <div
                        key={bottle.name}
                        className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                          configuration.bottle === bottle.name 
                            ? 'border-purple-500 bg-purple-50' 
                            : 'border-gray-200 hover:border-purple-300'
                        }`}
                        onClick={() => handleConfigChange('bottle', bottle.name)}
                      >
                        <img src={bottle.image} alt={bottle.name} className="w-full h-24 object-cover rounded mb-2" />
                        <p className="text-center font-medium">{bottle.name}</p>
                        <p className="text-center text-sm text-gray-600">Rs {bottle.price}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Step 3: Packaging Selection */}
              <Card>
                <CardHeader>
                  <CardTitle>Step 3: Select Packaging</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {packagings.map((pkg) => (
                      <div
                        key={pkg.name}
                        className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                          configuration.packaging === pkg.name 
                            ? 'border-purple-500 bg-purple-50' 
                            : 'border-gray-200 hover:border-purple-300'
                        }`}
                        onClick={() => handleConfigChange('packaging', pkg.name)}
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{pkg.name}</span>
                          <span className="text-gray-600">Rs {pkg.price}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Step 4: MOQ Selection */}
              <Card>
                <CardHeader>
                  <CardTitle>Step 4: Select MOQ</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[100, 500, 1000].map((moq) => (
                      <div
                        key={moq}
                        className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                          configuration.moq === moq 
                            ? 'border-purple-500 bg-purple-50' 
                            : 'border-gray-200 hover:border-purple-300'
                        }`}
                        onClick={() => handleConfigChange('moq', moq)}
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{moq} units</span>
                          <span className="text-green-600">
                            {moq === 500 && '10% discount'}
                            {moq === 1000 && '15% discount'}
                            {moq === 100 && 'No discount'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Live Cost Calculator */}
            <div className="lg:sticky lg:top-8 lg:h-fit">
              <Card className="border-purple-200">
                <CardHeader>
                  <CardTitle className="text-2xl text-purple-700">Live Cost Calculator</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Perfume juice cost:</span>
                      <span>Rs {costs.juiceCost.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Bottle cost:</span>
                      <span>Rs {costs.bottleCost.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Packaging cost:</span>
                      <span>Rs {costs.packagingCost.toLocaleString()}</span>
                    </div>
                    {costs.discount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Discount:</span>
                        <span>-Rs {costs.discount.toLocaleString()}</span>
                      </div>
                    )}
                    <hr />
                    <div className="flex justify-between font-bold text-lg">
                      <span>Per-Unit Cost:</span>
                      <span>Rs {costs.perUnitCost.toFixed(0)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-xl text-purple-600">
                      <span>Total Project Cost:</span>
                      <span>Rs {costs.totalCost.toLocaleString()}</span>
                    </div>
                  </div>

                  <Dialog open={showModal} onOpenChange={setShowModal}>
                    <DialogTrigger asChild>
                      <Button 
                        className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white py-4 text-lg font-semibold"
                        disabled={!configuration.oil || !configuration.concentration || !configuration.bottle || !configuration.packaging}
                      >
                        Reserve My Production Slot
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Reserve Your Production Slot</DialogTitle>
                      </DialogHeader>
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                          <Label htmlFor="name">Full Name *</Label>
                          <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="email">Email *</Label>
                          <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="whatsapp">WhatsApp Number *</Label>
                          <PhoneInput
                            id="whatsapp"
                            value={formData.whatsapp}
                            onChange={(value) => setFormData({...formData, whatsapp: value})}
                            className="bg-white/10 border-white/20 text-white placeholder:text-white/70"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="brandName">Brand Name *</Label>
                          <Input
                            id="brandName"
                            value={formData.brandName}
                            onChange={(e) => setFormData({...formData, brandName: e.target.value})}
                            required
                          />
                        </div>
                        
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h4 className="font-semibold mb-2">Your Configuration:</h4>
                          <p>Oil: {configuration.oil}</p>
                          <p>Concentration: {configuration.concentration}</p>
                          <p>Bottle: {configuration.bottle}</p>
                          <p>Packaging: {configuration.packaging}</p>
                          <p>MOQ: {configuration.moq} units</p>
                          <p className="font-bold">Total: Rs {costs.totalCost.toLocaleString()}</p>
                        </div>
                        
                        <Button 
                          type="submit" 
                          className="w-full bg-gradient-to-r from-purple-600 to-indigo-600"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? "Saving..." : "Reserve Production Slot"}
                        </Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Production Timeline */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Production
              <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent"> Timeline</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Average fulfilment time: 7–14 working days after approval of samples.
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-purple-600 to-indigo-600"></div>
              
              {/* Timeline Steps */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {[
                  { day: "Day 0", title: "Submit Brand Brief", desc: "Provide your requirements" },
                  { day: "Day 7", title: "Receive Samples", desc: "Test and approve quality" },
                  { day: "Day 21", title: "Full Production", desc: "Manufacturing begins" },
                  { day: "Day 30", title: "Final Dispatch", desc: "Ready for launch" }
                ].map((step, index) => (
                  <div key={index} className="text-center relative">
                    <div className="bg-white border-4 border-purple-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 relative z-10">
                      <span className="text-purple-600 font-bold">{index + 1}</span>
                    </div>
                    <h3 className="font-bold text-lg mb-2">{step.day}</h3>
                    <h4 className="font-semibold text-purple-600 mb-1">{step.title}</h4>
                    <p className="text-gray-600 text-sm">{step.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Frequently Asked
              <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent"> Questions</span>
            </h2>
          </div>
          
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                q: "What's the minimum order quantity?",
                a: "100 units. Discounts available on 500+ and 1000+ units."
              },
              {
                q: "Can I customize bottles and boxes?",
                a: "Yes, we offer full customization including labels, embossing, and foiling."
              },
              {
                q: "Do you handle UAE & KSA private label brands too?",
                a: "Yes, we deliver across Pakistan, UAE, and Saudi Arabia."
              },
              {
                q: "What about quality guarantees?",
                a: "All products go through rigorous testing and we provide samples before full production."
              }
            ].map((faq, index) => (
              <Card key={index} className="border-l-4 border-l-purple-600">
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg mb-3 text-gray-900">{faq.q}</h3>
                  <p className="text-gray-600">{faq.a}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Your Brand. Our Manufacturing. 30 Days.
          </h2>
          <Button 
            size="lg" 
            className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold rounded-full"
            onClick={scrollToConfigurator}
          >
            Start Configuring Now
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default PrivateLabel;