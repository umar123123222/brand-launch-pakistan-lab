

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PhoneInput } from "@/components/ui/phone-input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Calendar, Clock, Users, TrendingUp } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Seminar = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    age: "",
    currentWork: "",
    workDetails: "",
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setForm(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate required fields
      if (!form.name || !form.email || !form.phone || !form.age || !form.currentWork) {
        toast({
          title: "Missing Information",
          description: "Please fill in all required fields.",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      // Validate age is a number
      const ageNumber = parseInt(form.age);
      if (isNaN(ageNumber) || ageNumber < 16 || ageNumber > 80) {
        toast({
          title: "Invalid Age",
          description: "Please enter a valid age between 16 and 80.",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      console.log("Submitting seminar registration...");
      console.log("Supabase URL:", "https://bsqtjhjqytuncpvbnuwp.supabase.co");
      console.log("Form data:", {
        name: form.name,
        email: form.email,
        phone: form.phone,
        age: ageNumber,
        current_work: form.currentWork,
        work_details: form.workDetails || null,
      });

      const { data, error } = await supabase.from("seminar_registrations").insert([
        {
          name: form.name,
          email: form.email,
          phone: form.phone,
          age: ageNumber,
          current_work: form.currentWork,
          work_details: form.workDetails || null,
        },
      ]);

      if (error) {
        console.error("Supabase error:", error);
        throw error;
      }

      console.log("Registration successful:", data);

      toast({
        title: "Registration Successful!",
        description: "Thank you for registering. We will contact you to confirm your slot.",
      });

      // Reset form
      setForm({
        name: "",
        email: "",
        phone: "",
        age: "",
        currentWork: "",
        workDetails: "",
      });
    } catch (error: any) {
      console.error("Registration error:", error);
      console.error("Error name:", error.name);
      console.error("Error message:", error.message);
      
      // More specific error handling
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        toast({
          title: "Connection Error",
          description: "Unable to connect to the server. Please check your internet connection and try again.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Registration Failed",
          description: error.message || "An unexpected error occurred. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = form.name && form.email && form.phone && form.age && form.currentWork;

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-purple-50 via-white to-indigo-50">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Free Weekly
              <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                {" "}E-commerce Seminar
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed">
              Learn how to build a profitable e-commerce business in Pakistan and discover our proven private label system
            </p>
            <div className="flex flex-wrap justify-center gap-6 mb-8">
              <div className="flex items-center bg-white rounded-full px-4 py-2 shadow-md">
                <Calendar className="w-5 h-5 text-purple-600 mr-2" />
                <span className="font-medium">Every Wednesday & Saturday</span>
              </div>
              <div className="flex items-center bg-white rounded-full px-4 py-2 shadow-md">
                <Clock className="w-5 h-5 text-purple-600 mr-2" />
                <span className="font-medium">3:00 PM Sharp</span>
              </div>
              <div className="flex items-center bg-white rounded-full px-4 py-2 shadow-md">
                <Users className="w-5 h-5 text-purple-600 mr-2" />
                <span className="font-medium">Limited Seats</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What You'll Learn Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
              What You'll Learn in This 
              <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                {" "}Free Seminar
              </span>
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-6 rounded-2xl border border-yellow-200">
                <TrendingUp className="w-10 h-10 text-orange-600 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-3">E-commerce Business Fundamentals</h3>
                <ul className="text-gray-600 space-y-2">
                  <li>• How to identify profitable product niches</li>
                  <li>• Pakistani market analysis and opportunities</li>
                  <li>• Setting up your online store effectively</li>
                  <li>• Digital marketing strategies that work</li>
                </ul>
              </div>
              
              <div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-6 rounded-2xl border border-purple-200">
                <Users className="w-10 h-10 text-purple-600 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-3">Our Private Label Success System</h3>
                <ul className="text-gray-600 space-y-2">
                  <li>• Complete brand launch strategy</li>
                  <li>• From product to 500+ daily orders</li>
                  <li>• Proven case studies and results</li>
                  <li>• How we can help your brand succeed</li>
                </ul>
              </div>
            </div>

            <div className="text-center bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-2xl border border-green-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                🎯 Special Bonus: Live Q&A Session
              </h3>
              <p className="text-gray-600">
                Get your business questions answered directly by our e-commerce experts who have generated millions in revenue
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Registration Form Section */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mx-auto">
            <Card className="shadow-2xl border-0">
              <CardHeader className="text-center bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-t-lg">
                <CardTitle className="text-2xl md:text-3xl font-bold">
                  Register for Free Seminar
                </CardTitle>
                <p className="text-purple-100 mt-2">
                  Limited seats available - Secure your spot now!
                </p>
              </CardHeader>
              <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <Input
                        type="text"
                        value={form.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        placeholder="Enter your full name"
                        className="h-12"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Age *
                      </label>
                      <Input
                        type="number"
                        min="16"
                        max="80"
                        value={form.age}
                        onChange={(e) => handleInputChange("age", e.target.value)}
                        placeholder="Your age"
                        className="h-12"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <Input
                        type="email"
                        value={form.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        placeholder="your.email@example.com"
                        className="h-12"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number *
                      </label>
                      <PhoneInput
                        id="phone"
                        value={form.phone}
                        onChange={(value) => handleInputChange("phone", value)}
                        className="bg-gray-900/50 border-gray-600 text-white placeholder:text-gray-400"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Current Work Status *
                    </label>
                    <Select value={form.currentWork} onValueChange={(value) => handleInputChange("currentWork", value)}>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Select your current work status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="job">Job</SelectItem>
                        <SelectItem value="business">Business</SelectItem>
                        <SelectItem value="student">Student</SelectItem>
                        <SelectItem value="unemployed">Unemployed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {form.currentWork && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {form.currentWork === "job" && "Company Name"}
                        {form.currentWork === "business" && "Business Type/Name"}
                        {form.currentWork === "student" && "University/Institution"}
                        {form.currentWork === "unemployed" && "Previous Experience (Optional)"}
                      </label>
                      <Input
                        type="text"
                        value={form.workDetails}
                        onChange={(e) => handleInputChange("workDetails", e.target.value)}
                        placeholder={
                          form.currentWork === "job" ? "Enter company name" :
                          form.currentWork === "business" ? "Enter business details" :
                          form.currentWork === "student" ? "Enter university name" :
                          "Enter previous work experience"
                        }
                        className="h-12"
                      />
                    </div>
                  )}

                  <Button
                    type="submit"
                    disabled={loading || !isFormValid}
                    className="w-full h-12 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold text-lg"
                  >
                    {loading ? "Registering..." : "Register for Free Seminar"}
                  </Button>

                  <div className="text-center text-sm text-gray-600 bg-blue-50 p-4 rounded-lg">
                    <strong>Important:</strong> Each registrant will be contacted by our team to confirm if your registration is approved. 
                    Due to limited seats, confirmation is based on availability and profile suitability.
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Seminar;

