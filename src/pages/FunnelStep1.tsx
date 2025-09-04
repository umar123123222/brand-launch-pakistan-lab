import { useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import YoutubeLite from "@/components/YoutubeLite";
import Footer from "@/components/Footer";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PhoneInput } from "@/components/ui/phone-input";

const FunnelStep1 = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !email.trim() || !mobileNumber.trim()) {
      toast({
        title: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    if (!email.includes("@")) {
      toast({
        title: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from("consultations")
        .insert([{ 
          name: name.trim(),
          email: email.trim(),
          phone: mobileNumber.trim()
        }]);

      if (error) throw error;
      
      toast({
        title: "Success!",
        description: "Application submitted successfully!",
      });

      // Redirect to thank you page
      navigate("/thank-you");
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Something went wrong",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
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
            <div className="relative mb-12">
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
                  <div>✅ Full 1-on-1 Guidance Till You Launch</div>
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
                    Starting with the same proven system, Elyscents has grown into Pakistan's 
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

            {/* Package Options Section */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 mb-12">
              <h2 className="text-3xl font-bold text-white mb-6">
                💼 Choose Your Brand Launch Package
              </h2>
              <p className="text-xl text-gray-200 mb-8">
                Select the package that fits your budget and goals:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Starter Package */}
                <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg p-6 border border-white/20">
                  <h3 className="text-2xl font-bold text-yellow-400 mb-4">Starter Package</h3>
                  <div className="space-y-3 text-white">
                    <p className="text-lg"><strong>Service Charges:</strong> Rs. 250,000</p>
                    <p className="text-lg"><strong>Product Cost:</strong> Rs. 100,000</p>
                    <p className="text-sm text-yellow-300">100 perfumes @ Rs. 1,000 each</p>
                    <p className="text-sm text-gray-200 mt-4">Perfect for testing the market with lower investment</p>
                  </div>
                </div>

                {/* Growth Package */}
                <div className="bg-gradient-to-br from-green-600 to-teal-600 rounded-lg p-6 border border-white/20">
                  <h3 className="text-2xl font-bold text-yellow-400 mb-4">Growth Package</h3>
                  <div className="space-y-3 text-white">
                    <p className="text-lg"><strong>Service Charges:</strong> Rs. 0</p>
                    <p className="text-lg"><strong>MOQ:</strong> 1,000 pieces</p>
                    <p className="text-sm text-yellow-300">No service charges - pay only for products</p>
                    <p className="text-sm text-gray-200 mt-4">Best value for serious entrepreneurs</p>
                  </div>
                </div>
              </div>
            </div>

            {/* FORM SECTION - Below package options */}
            <div className="max-w-2xl mx-auto mb-12 bg-gradient-to-br from-yellow-400/20 to-orange-500/20 backdrop-blur-lg rounded-3xl p-8 border-2 border-yellow-400/30 shadow-2xl">
              <div className="text-center mb-8">
                <div className="text-4xl mb-4">🚀</div>
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                  Get Started - Book Your Free Strategy Call
                </h2>
                <p className="text-lg text-yellow-200 font-medium">
                  Launching 20-30 brands every month
                </p>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <input
                    type="text"
                    placeholder="Your Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-6 py-4 rounded-xl border border-gray-300 focus:ring-4 focus:ring-yellow-500/50 focus:border-yellow-500 text-gray-900 text-lg font-medium shadow-lg"
                    required
                  />
                </div>
                
                <div>
                  <input
                    type="email"
                    placeholder="Your Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-6 py-4 rounded-xl border border-gray-300 focus:ring-4 focus:ring-yellow-500/50 focus:border-yellow-500 text-gray-900 text-lg font-medium shadow-lg"
                    required
                  />
                </div>

                <div>
                  <PhoneInput
                    value={mobileNumber}
                    onChange={setMobileNumber}
                    required
                    className="w-full px-6 py-4 rounded-xl border border-gray-300 focus:ring-4 focus:ring-yellow-500/50 focus:border-yellow-500 text-gray-900 text-lg font-medium shadow-lg"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black font-bold py-6 px-8 rounded-xl text-xl transition-all duration-300 transform hover:scale-105 shadow-2xl"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black"></div>
                      Submitting...
                    </div>
                  ) : (
                    "🎯 Get My Free Strategy Call"
                  )}
                </Button>
                
                <p className="text-sm text-yellow-200 text-center mt-4">
                  ✅ No spam, ever. Your information is 100% secure.
                </p>
              </form>
            </div>

            {/* Pricing Table */}
            <div className="mt-16 mb-12">
              <h2 className="text-3xl font-bold text-white mb-8">Transparent Pricing - No Hidden Charges</h2>
              
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 relative">
                <div className="overflow-x-auto">
                  <Table className="w-full">
                    <TableHeader>
                      <TableRow className="border-white/20">
                        <TableHead className="text-white font-bold text-center">What's Included</TableHead>
                        <TableHead className="text-blue-400 font-bold text-center">Starter Package</TableHead>
                        <TableHead className="text-green-400 font-bold text-center">Growth Package</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow className="border-white/20">
                        <TableCell className="text-gray-200 font-medium text-center">Service Charges</TableCell>
                        <TableCell className="text-center text-white">Rs. 250,000</TableCell>
                        <TableCell className="text-center text-white">Rs. 0</TableCell>
                      </TableRow>
                      <TableRow className="border-white/20">
                        <TableCell className="text-gray-200 font-medium text-center">MOQ (Perfume)</TableCell>
                        <TableCell className="text-center text-white">100 pieces</TableCell>
                        <TableCell className="text-center text-white">1,000 pieces</TableCell>
                      </TableRow>
                      <TableRow className="border-white/20">
                        <TableCell className="text-gray-200 font-medium text-center">Product Cost (Perfume)</TableCell>
                        <TableCell className="text-center text-white">Rs. 1,000 each</TableCell>
                        <TableCell className="text-center text-white">Variable pricing</TableCell>
                      </TableRow>
                      <TableRow className="border-white/20">
                        <TableCell className="text-gray-200 font-medium text-center">Logo, Branding, Packaging Design</TableCell>
                        <TableCell className="text-center text-green-400">✅</TableCell>
                        <TableCell className="text-center text-green-400">✅</TableCell>
                      </TableRow>
                      <TableRow className="border-white/20">
                        <TableCell className="text-gray-200 font-medium text-center">Label + Box Printing</TableCell>
                        <TableCell className="text-center text-green-400">✅</TableCell>
                        <TableCell className="text-center text-green-400">✅</TableCell>
                      </TableRow>
                      <TableRow className="border-white/20">
                        <TableCell className="text-gray-200 font-medium text-center">Shopify Store (Professional Setup)</TableCell>
                        <TableCell className="text-center text-green-400">✅</TableCell>
                        <TableCell className="text-center text-green-400">✅</TableCell>
                      </TableRow>
                      <TableRow className="border-white/20">
                        <TableCell className="text-gray-200 font-medium text-center">Website Content + Product Shoot</TableCell>
                        <TableCell className="text-center text-green-400">✅</TableCell>
                        <TableCell className="text-center text-green-400">✅</TableCell>
                      </TableRow>
                      <TableRow className="border-white/20">
                        <TableCell className="text-gray-200 font-medium text-center">One Video Ad (Launch Focused)</TableCell>
                        <TableCell className="text-center text-green-400">✅</TableCell>
                        <TableCell className="text-center text-green-400">✅</TableCell>
                      </TableRow>
                      <TableRow className="border-white/20">
                        <TableCell className="text-gray-200 font-medium text-center">Social Media Handles Setup</TableCell>
                        <TableCell className="text-center text-green-400">✅</TableCell>
                        <TableCell className="text-center text-green-400">✅</TableCell>
                      </TableRow>
                      <TableRow className="border-white/20">
                        <TableCell className="text-gray-200 font-medium text-center">Facebook BM, Ad Account, Pixel</TableCell>
                        <TableCell className="text-center text-green-400">✅</TableCell>
                        <TableCell className="text-center text-green-400">✅</TableCell>
                      </TableRow>
                      <TableRow className="border-white/20">
                        <TableCell className="text-gray-200 font-medium text-center">Courier + COD Integration</TableCell>
                        <TableCell className="text-center text-green-400">✅</TableCell>
                        <TableCell className="text-center text-green-400">✅</TableCell>
                      </TableRow>
                      <TableRow className="border-white/20">
                        <TableCell className="text-gray-200 font-medium text-center">1-on-1 Brand Strategy Support</TableCell>
                        <TableCell className="text-center text-green-400">✅</TableCell>
                        <TableCell className="text-center text-green-400">✅</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>

            {/* Emotional Copy Below Table */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 mb-8">
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
              
              {/* Call to Action Button */}
              <div className="w-full max-w-md mx-auto px-4">
                <Button
                  onClick={() => {
                    const formSection = document.querySelector('form');
                    if (formSection) {
                      formSection.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-bold py-4 px-6 rounded-lg text-base sm:text-lg transition-all duration-300 transform hover:scale-105 text-center"
                >
                  Fill the Form to Book Your Free Call
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default FunnelStep1;
