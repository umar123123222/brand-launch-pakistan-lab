
import { Card, CardContent } from "@/components/ui/card";

const CaseStudy = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Our Success Story:
            <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent"> Elyscents</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            From concept to 500+ daily orders - see how we built a thriving perfume empire and how we can do the same for you.
          </p>
        </div>
        
        <div className="max-w-6xl mx-auto">
          <Card className="bg-gradient-to-br from-purple-600 to-indigo-600 text-white border-0 overflow-hidden">
            <CardContent className="p-12">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                  <h3 className="text-3xl font-bold mb-6">Elyscents: A Pakistani Success Story</h3>
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
                      <div className="text-4xl font-bold text-yellow-400 mb-2">1M+</div>
                      <div className="text-purple-200">Monthly Revenue</div>
                    </div>
                    <div className="text-center">
                      <div className="text-4xl font-bold text-yellow-400 mb-2">50k+</div>
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
                    <img 
                      src="/placeholder.svg" 
                      alt="Elyscents Success"
                      className="w-full h-64 object-cover rounded-lg mb-6"
                    />
                    <div className="text-center">
                      <h4 className="text-xl font-semibold mb-2">From Startup to Market Leader</h4>
                      <p className="text-purple-200">
                        The exact blueprint we used for Elyscents is now available for your brand.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default CaseStudy;
