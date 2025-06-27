
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import YoutubeLite from "@/components/YoutubeLite";

const FunnelStep1 = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !email.trim()) {
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
        .from("front_leads")
        .insert([{ name: name.trim(), email: email.trim() }]);

      if (error) throw error;

      // Store email in localStorage for step 2
      localStorage.setItem("funnel_email", email.trim());
      
      toast({
        title: "Success!",
        description: "Taking you to step 2...",
      });

      // Redirect to step 2
      navigate("/funnel/step2");
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
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900">
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto text-center">
          {/* Headline */}
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-8 leading-tight">
            Launch Your Own Perfume, Skincare, or Beard Oil Brand in 40 Days – 
            <span className="block mt-2 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
              Even Without a Product
            </span>
          </h1>

          {/* Video */}
          <div className="relative mb-6">
            <div className="w-full max-w-3xl mx-auto">
              <YoutubeLite
                videoId="Io5mji-ECcw"
                alt="Watch how we help launch product brands"
              />
            </div>
          </div>

          {/* Subtext */}
          <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
            Watch how I helped 20+ people launch their own product brand in just weeks—real results, real products.
          </p>

          {/* Call-to-Action Text */}
          <p className="text-2xl md:text-3xl font-semibold text-white mb-8">
            Want us to build your brand for you? Apply for a FREE call
          </p>

          {/* Form */}
          <div className="max-w-md mx-auto">
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

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black font-bold py-4 px-8 rounded-lg text-lg transition-all duration-300 transform hover:scale-105"
              >
                {isSubmitting ? "Please wait..." : "Continue to Step 2"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FunnelStep1;
