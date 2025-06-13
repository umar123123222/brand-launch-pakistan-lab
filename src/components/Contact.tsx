
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const Contact = () => {
  return (
    <section className="py-20 bg-gray-900">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Build Your
            <span className="text-orange"> Brand Empire?</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Let's discuss your vision and create the next Pakistani e-commerce success story together.
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
          <Card className="shadow-xl border-gray-700 bg-white/5 backdrop-blur-lg">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-white">Start Your Consultation</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input placeholder="Your Name" className="h-12 bg-white/10 border-gray-600 text-white placeholder:text-gray-400" />
                  <Input placeholder="Your Email" type="email" className="h-12 bg-white/10 border-gray-600 text-white placeholder:text-gray-400" />
                </div>
                <Input placeholder="Your Phone Number" className="h-12 bg-white/10 border-gray-600 text-white placeholder:text-gray-400" />
                <Input placeholder="Preferred Product Category" className="h-12 bg-white/10 border-gray-600 text-white placeholder:text-gray-400" />
                <Textarea 
                  placeholder="Tell us about your brand vision and goals..." 
                  className="min-h-32 bg-white/10 border-gray-600 text-white placeholder:text-gray-400" 
                />
                <Button className="w-full h-12 bg-orange hover:bg-orange/90 text-white font-semibold rounded-lg transition-all duration-300">
                  Chat on WhatsApp →
                </Button>
              </form>
            </CardContent>
          </Card>
          
          <div className="space-y-8">
            <Card className="bg-orange/10 border-orange/30">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-white mb-4">Why Choose Us?</h3>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-orange rounded-full mr-3"></span>
                    <span className="text-gray-300">Proven track record with Elyscents (500+ daily orders)</span>
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-orange rounded-full mr-3"></span>
                    <span className="text-gray-300">Complete turnkey solution - no hidden costs</span>
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-orange rounded-full mr-3"></span>
                    <span className="text-gray-300">Pakistan market expertise</span>
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-orange rounded-full mr-3"></span>
                    <span className="text-gray-300">Ongoing support until you reach 500+ orders</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card className="bg-white/5 border-gray-700">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-white mb-4">Contact Information</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-white">Phone</h4>
                    <p className="text-gray-400">+92-XXX-XXXXXXX</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">Email</h4>
                    <p className="text-gray-400">hello@yourbusiness.com</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">Office</h4>
                    <p className="text-gray-400">Karachi, Pakistan</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Footer */}
        <footer className="mt-20 pt-8 border-t border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-white text-sm mb-4 md:mb-0">
              BrandLaunch
            </div>
            <div className="text-gray-400 text-xs">
              Powered by IDMPakistan
            </div>
          </div>
        </footer>
      </div>
    </section>
  );
};

export default Contact;
