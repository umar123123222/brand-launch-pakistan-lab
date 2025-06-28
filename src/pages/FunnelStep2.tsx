
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import Footer from "@/components/Footer";

const FunnelStep2 = () => {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [hasBusiness, setHasBusiness] = useState("");
  const [category, setCategory] = useState("");
  const [investmentRange, setInvestmentRange] = useState("");
  const [motivation, setMotivation] = useState("");
  const [buildSupport, setBuildSupport] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Get email from localStorage
    const storedEmail = localStorage.getItem("funnel_email");
    if (storedEmail) {
      setEmail(storedEmail);
    } else {
      // Redirect to step 1 if no email found
      navigate("/funnel/step1");
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!phone.trim() || !city.trim() || !hasBusiness || !category || !investmentRange || !motivation.trim() || !buildSupport) {
      toast({
        title: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from("full_applications")
        .insert([{
          email,
          phone: phone.trim(),
          city: city.trim(),
          has_business: hasBusiness,
          category,
          investment_range: investmentRange,
          motivation: motivation.trim(),
          build_support: buildSupport
        }]);

      if (error) throw error;

      // Clear stored email
      localStorage.removeItem("funnel_email");
      
      setIsSubmitted(true);
    } catch (error) {
      console.error("Error submitting application:", error);
      toast({
        title: "Something went wrong",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
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
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900">
        <div className="container mx-auto px-6 py-12">
          <div className="max-w-2xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Thanks for your interest—just a few more details to see if we're a good fit.
              </h1>
              <p className="text-lg text-gray-200">
                We only accept a limited number of brand launches per month. Please fill this form seriously.
              </p>
            </div>

            {/* Form */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Phone */}
                <div>
                  <label className="block text-white font-medium mb-2">Phone Number *</label>
                  <input
                    type="tel"
                    placeholder="03XX XXXXXXX"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
                    required
                  />
                </div>

                {/* City */}
                <div>
                  <label className="block text-white font-medium mb-2">City *</label>
                  <input
                    type="text"
                    placeholder="Your city"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
                    required
                  />
                </div>

                {/* Has Business */}
                <div>
                  <label className="block text-white font-medium mb-2">Do you already have a business? *</label>
                  <select
                    value={hasBusiness}
                    onChange={(e) => setHasBusiness(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
                    required
                  >
                    <option value="">Select an option</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                    <option value="Planning Stage">Planning Stage</option>
                  </select>
                </div>

                {/* Category */}
                <div>
                  <label className="block text-white font-medium mb-2">Which category are you most interested in? *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
                    required
                  >
                    <option value="">Select a category</option>
                    <option value="Perfume">Perfume</option>
                    <option value="Skincare">Skincare</option>
                    <option value="Beard Oil">Beard Oil</option>
                    <option value="Pain Relief">Pain Relief</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* Investment Range */}
                <div>
                  <label className="block text-white font-medium mb-2">How much can you invest in your brand launch? *</label>
                  <select
                    value={investmentRange}
                    onChange={(e) => setInvestmentRange(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
                    required
                  >
                    <option value="">Select investment range</option>
                    <option value="Below 100k">Below 100k</option>
                    <option value="100–200k">100–200k</option>
                    <option value="250k+">250k+</option>
                    <option value="I don't know yet">I don't know yet</option>
                  </select>
                </div>

                {/* Motivation */}
                <div>
                  <label className="block text-white font-medium mb-2">Why do you want to launch your own brand now? *</label>
                  <Textarea
                    placeholder="Tell us about your motivation and goals..."
                    value={motivation}
                    onChange={(e) => setMotivation(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 min-h-[100px]"
                    required
                  />
                </div>

                {/* Build Support */}
                <div>
                  <label className="block text-white font-medium mb-2">Do you want our team to fully build and launch your brand? *</label>
                  <select
                    value={buildSupport}
                    onChange={(e) => setBuildSupport(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
                    required
                  >
                    <option value="">Select an option</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                    <option value="I'm not sure">I'm not sure</option>
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
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default FunnelStep2;
