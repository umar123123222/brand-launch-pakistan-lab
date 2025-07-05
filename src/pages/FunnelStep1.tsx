import { useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import YoutubeLite from "@/components/YoutubeLite";
import Footer from "@/components/Footer";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";

const FunnelStep1 = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [city, setCity] = useState("");
  const [hasBusiness, setHasBusiness] = useState("");
  const [category, setCategory] = useState("");
  const [motivation, setMotivation] = useState("");
  const [buildSupport, setBuildSupport] = useState("");
  const [preferredPlan, setPreferredPlan] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !email.trim() || !whatsappNumber.trim() || !city.trim() || !hasBusiness || !category || !motivation.trim() || !buildSupport || !preferredPlan) {
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
        .from("full_applications")
        .insert([{ 
          email: email.trim(),
          phone: whatsappNumber.trim(),
          city: city.trim(),
          has_business: hasBusiness,
          category: category,
          motivation: motivation.trim(),
          build_support: buildSupport,
          investment_range: preferredPlan
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
                  <p className="text-gray-200">Low MOQ, Rs. 250k service fee</p>
                </div>
                <div className="bg-white/10 rounded-lg p-6 border border-white/20">
                  <h3 className="text-xl font-bold text-green-400 mb-2">Growth Plan</h3>
                  <p className="text-gray-200">High MOQ, Rs. 0 service fee</p>
                </div>
              </div>
              
              <p className="text-gray-200">
                No matter which plan you choose, you'll get everything needed to launch like a pro.
              </p>
            </div>

            {/* Updated Form */}
            <div className="max-w-2xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-semibold text-white mb-8">
                Apply for Your Brand Launch
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <input
                    type="text"
                    placeholder="Your Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 text-lg"
                    required
                  />
                </div>
                
                <div>
                  <input
                    type="email"
                    placeholder="Your Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 text-lg"
                    required
                  />
                </div>

                <div>
                  <input
                    type="tel"
                    placeholder="WhatsApp Number"
                    value={whatsappNumber}
                    onChange={(e) => setWhatsappNumber(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 text-lg"
                    required
                  />
                </div>

                <div>
                  <input
                    type="text"
                    placeholder="Your City"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 text-lg"
                    required
                  />
                </div>

                <div>
                  <select
                    value={hasBusiness}
                    onChange={(e) => setHasBusiness(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 text-lg"
                    required
                  >
                    <option value="">Do you already have a business?</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </div>

                <div>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 text-lg"
                    required
                  >
                    <option value="">Which category are you most interested in?</option>
                    <option value="Perfume">Perfume</option>
                    <option value="Beard Oil">Beard Oil</option>
                    <option value="Pain Relief">Pain Relief</option>
                    <option value="Others">Others</option>
                  </select>
                </div>

                <div>
                  <Textarea
                    placeholder="Why do you want to launch your own brand now?"
                    value={motivation}
                    onChange={(e) => setMotivation(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 text-lg min-h-[100px]"
                    required
                  />
                </div>

                <div>
                  <select
                    value={buildSupport}
                    onChange={(e) => setBuildSupport(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 text-lg"
                    required
                  >
                    <option value="">Do you want our team to fully build and launch your brand?</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                    <option value="Need to understand more">Need to understand more</option>
                  </select>
                </div>

                <div>
                  <select
                    value={preferredPlan}
                    onChange={(e) => setPreferredPlan(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 text-lg"
                    required
                  >
                    <option value="">Preferred Plan?</option>
                    <option value="Starter Plan">Starter Plan</option>
                    <option value="Growth Plan">Growth Plan</option>
                  </select>
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black font-bold py-4 px-8 rounded-lg text-lg transition-all duration-300 transform hover:scale-105"
                >
                  {isSubmitting ? "Submitting Application..." : "Submit Application"}
                </Button>
              </form>
            </div>

            {/* Pricing Table */}
            <div className="mt-16 mb-12">
              <h2 className="text-3xl font-bold text-white mb-8">FRONT</h2>
              
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 overflow-x-auto">
                <Table className="w-full">
                  <TableHeader>
                    <TableRow className="border-white/20">
                      <TableHead className="text-white font-bold text-left">Feature</TableHead>
                      <TableHead className="text-yellow-400 font-bold text-center">Starter Plan (Recommended)</TableHead>
                      <TableHead className="text-green-400 font-bold text-center">Growth Plan</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow className="border-white/20">
                      <TableCell className="text-gray-200 font-medium">Service Charges</TableCell>
                      <TableCell className="text-center text-white">Rs. 250,000</TableCell>
                      <TableCell className="text-center text-white">Rs. 0</TableCell>
                    </TableRow>
                    <TableRow className="border-white/20">
                      <TableCell className="text-gray-200 font-medium">MOQ (Perfume)</TableCell>
                      <TableCell className="text-center text-white">100 pieces</TableCell>
                      <TableCell className="text-center text-white">1,000 pieces</TableCell>
                    </TableRow>
                    <TableRow className="border-white/20">
                      <TableCell className="text-gray-200 font-medium">MOQ (Beard Oil / Pain Relief Oil)</TableCell>
                      <TableCell className="text-center text-white">300 pieces</TableCell>
                      <TableCell className="text-center text-white">3,000 pieces</TableCell>
                    </TableRow>
                    <TableRow className="border-white/20">
                      <TableCell className="text-gray-200 font-medium">Average Product Cost (Perfume)</TableCell>
                      <TableCell className="text-center text-white">Rs. 1,000</TableCell>
                      <TableCell className="text-center text-white">Rs. 1,000</TableCell>
                    </TableRow>
                    <TableRow className="border-white/20">
                      <TableCell className="text-gray-200 font-medium">Average Product Cost (Beard Oil/Pain relief)</TableCell>
                      <TableCell className="text-center text-white">Rs. 400 (+/- 50)</TableCell>
                      <TableCell className="text-center text-white">Rs. 400 (+/- 50)</TableCell>
                    </TableRow>
                    <TableRow className="border-white/20">
                      <TableCell className="text-gray-200 font-medium">Logo, Branding, Packaging Design</TableCell>
                      <TableCell className="text-center text-green-400">✅</TableCell>
                      <TableCell className="text-center text-green-400">✅</TableCell>
                    </TableRow>
                    <TableRow className="border-white/20">
                      <TableCell className="text-gray-200 font-medium">Label + Box Printing</TableCell>
                      <TableCell className="text-center text-green-400">✅</TableCell>
                      <TableCell className="text-center text-green-400">✅</TableCell>
                    </TableRow>
                    <TableRow className="border-white/20">
                      <TableCell className="text-gray-200 font-medium">Shopify Store (Professional Setup)</TableCell>
                      <TableCell className="text-center text-green-400">✅</TableCell>
                      <TableCell className="text-center text-green-400">✅</TableCell>
                    </TableRow>
                    <TableRow className="border-white/20">
                      <TableCell className="text-gray-200 font-medium">Website Content + Product Shoot</TableCell>
                      <TableCell className="text-center text-green-400">✅</TableCell>
                      <TableCell className="text-center text-green-400">✅</TableCell>
                    </TableRow>
                    <TableRow className="border-white/20">
                      <TableCell className="text-gray-200 font-medium">One Video Ad (Launch Focused)</TableCell>
                      <TableCell className="text-center text-green-400">✅</TableCell>
                      <TableCell className="text-center text-green-400">✅</TableCell>
                    </TableRow>
                    <TableRow className="border-white/20">
                      <TableCell className="text-gray-200 font-medium">Social Media Handles Setup</TableCell>
                      <TableCell className="text-center text-green-400">✅</TableCell>
                      <TableCell className="text-center text-green-400">✅</TableCell>
                    </TableRow>
                    <TableRow className="border-white/20">
                      <TableCell className="text-gray-200 font-medium">Facebook BM, Ad Account, Pixel</TableCell>
                      <TableCell className="text-center text-green-400">✅</TableCell>
                      <TableCell className="text-center text-green-400">✅</TableCell>
                    </TableRow>
                    <TableRow className="border-white/20">
                      <TableCell className="text-gray-200 font-medium">Courier + COD Integration</TableCell>
                      <TableCell className="text-center text-green-400">✅</TableCell>
                      <TableCell className="text-center text-green-400">✅</TableCell>
                    </TableRow>
                    <TableRow className="border-white/20">
                      <TableCell className="text-gray-200 font-medium">FBR NTN & Trademark Filing</TableCell>
                      <TableCell className="text-center text-green-400">✅</TableCell>
                      <TableCell className="text-center text-green-400">✅</TableCell>
                    </TableRow>
                    <TableRow className="border-white/20">
                      <TableCell className="text-gray-200 font-medium">1-on-1 Brand Strategy Support</TableCell>
                      <TableCell className="text-center text-green-400">✅</TableCell>
                      <TableCell className="text-center text-green-400">✅</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* Emotional Copy Below Table */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 mb-12">
              <p className="text-xl text-gray-200 leading-relaxed">
                You're not just launching a product — you're stepping into a new identity: <span className="text-yellow-400 font-bold">Brand Owner</span>.
              </p>
              <p className="text-lg text-gray-200 mt-4">
                We've helped dozens of people start profitable ecommerce brands — without any marketing background, design skills, or warehouse.
              </p>
              <p className="text-lg text-gray-200 mt-4">
                Your vision + our team = fully launched business in 40-60 days.
              </p>
              <p className="text-lg text-red-300 font-semibold mt-4">
                Limited to 20 clients per month only.
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default FunnelStep1;
