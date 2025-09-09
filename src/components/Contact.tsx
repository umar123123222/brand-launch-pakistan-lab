
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PhoneInput } from "@/components/ui/phone-input";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Sparkles } from "lucide-react";

const Contact = () => {
  const { toast } = useToast();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    category: "",
    vision: "",
  });
  const [loading, setLoading] = useState(false);

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!form.name.trim() || !form.email.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in your name and email.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase
        .from("front_leads")
        .insert([{
          name: form.name.trim(),
          email: form.email.trim(),
          phone_number: form.phone.trim() || null,
          product_category: form.category.trim() || null,
          message: form.vision.trim() || null,
        }]);

      if (error) {
        console.error("Database error:", error);
        toast({
          title: "Submission Failed", 
          description: "There was an issue saving your information. Please try again.",
          variant: "destructive",
        });
        return;
      }

      // Success
      toast({
        title: "Success!",
        description: "Thank you! We will contact you soon.",
      });
      
      // Reset form
      setForm({
        name: "",
        email: "",
        phone: "",
        category: "",
        vision: "",
      });

    } catch (error: any) {
      console.error("Unexpected error:", error);
      toast({
        title: "Connection Error",
        description: "Please check your internet connection and try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Ready to Build Your
            <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              {" "}
              Brand Empire?
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Let's discuss your vision and create the next Pakistani e-commerce success story together.
          </p>
        </div>

        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Main prominent consultation card */}
          <Card className="relative shadow-2xl border-0 bg-gradient-to-br from-purple-600 via-purple-700 to-purple-800 p-[2px] overflow-visible animate-fade-in">
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 flex justify-center items-center w-16 h-16 bg-white rounded-full shadow-md border-4 border-yellow-400 z-10">
              <Sparkles className="text-yellow-500 w-8 h-8" />
            </div>
            <div className="rounded-3xl bg-gradient-to-br from-purple-600 via-purple-700 to-purple-800 backdrop-blur-[2px] shadow-xl px-6 pt-10 pb-8">
              <CardHeader>
                <CardTitle className="text-2xl md:text-3xl font-extrabold text-center text-transparent bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-400 bg-clip-text animate-fade-in">
                  Book Your Brand Launch Consultation –{" "}
                  <span className="underline decoration-wavy decoration-yellow-400">Limited Slots!</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      name="name"
                      placeholder="Your Name"
                      className="h-12 bg-purple-700/50 border-purple-500 text-white placeholder-white/70 focus:border-white focus:ring-white"
                      value={form.name}
                      onChange={onChange}
                      required
                    />
                    <Input
                      name="email"
                      type="email"
                      placeholder="Your Email"
                      className="h-12 bg-purple-700/50 border-purple-500 text-white placeholder-white/70 focus:border-white focus:ring-white"
                      value={form.email}
                      onChange={onChange}
                      required
                    />
                  </div>
                  <PhoneInput
                    name="phone"
                    className="h-12 bg-purple-700/50 border-purple-500 text-white placeholder-white/70 focus:border-white focus:ring-white"
                    value={form.phone}
                    onChange={(value) => setForm({...form, phone: value})}
                    required
                  />
                  <Input
                    name="category"
                    placeholder="Preferred Product Category"
                    className="h-12 bg-purple-700/50 border-purple-500 text-white placeholder-white/70 focus:border-white focus:ring-white"
                    value={form.category}
                    onChange={onChange}
                  />
                  <Textarea
                    name="vision"
                    placeholder="Tell us about your brand vision and goals..."
                    className="min-h-32 bg-purple-700/50 border-purple-500 text-white placeholder-white/70 focus:border-white focus:ring-white resize-none"
                    value={form.vision}
                    onChange={onChange}
                  />
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full h-12 bg-gradient-to-r from-yellow-500 via-orange-500 to-pink-500 hover:from-yellow-600 hover:to-pink-600 text-zinc-900 font-semibold rounded-lg transition-all duration-300 shadow-md text-lg"
                  >
                    {loading ? "Submitting..." : "Book My Consultation"}
                  </Button>
                  <div className="text-sm text-center text-white/80 mt-2">
                    <span className="font-semibold text-orange-300 animate-pulse">Full confidentiality – No charges to apply</span>
                  </div>
                </form>
              </CardContent>
            </div>
          </Card>

          {/* Why Choose Us and Contact Info cards remain */}
          <div className="space-y-8">
            <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Why Choose Us?</h3>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></span>
                    Proven track record with Elyscents (500+ daily orders)
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></span>
                    Complete turnkey solution - no hidden costs
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></span>
                    Pakistan market expertise
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></span>
                    Brand Creation + Brand Success training included
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Contact Information</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900">Phone</h4>
                    <p className="text-gray-600">03148860546</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Email</h4>
                    <p className="text-gray-600">askelevate51@gmail.com</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Office</h4>
                    <p className="text-gray-600">A316, Block 2 Gulshan Iqbal Karachi</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
