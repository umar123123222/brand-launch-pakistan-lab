
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const Pricing = () => {
  return (
    <section className="py-20 bg-navy">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
            Simple, Transparent
            <span className="text-orange"> Pricing</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Everything you need to launch your brand for one fixed price. No hidden costs, no surprises.
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <Card className="bg-white/5 backdrop-blur-lg border-gray-700 text-white relative overflow-hidden">
            <Badge className="absolute top-6 right-6 bg-orange text-white font-semibold">
              Most Popular
            </Badge>
            
            <CardHeader className="text-center pb-8">
              <CardTitle className="text-3xl font-bold mb-4 text-white">Complete Brand Launch Package</CardTitle>
              <div className="text-6xl font-bold mb-4">
                <span className="text-orange">
                  Rs 350k
                </span>
              </div>
              <p className="text-xl text-gray-400">Rs 250k Service Fee + Rs 100k Product Cost</p>
            </CardHeader>
            
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div>
                  <h4 className="text-xl font-semibold mb-4 text-orange">Service Package (Rs 250k)</h4>
                  <ul className="space-y-3">
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-orange rounded-full mr-3"></span>
                      Complete branding & label design
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-orange rounded-full mr-3"></span>
                      Professional packaging design
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-orange rounded-full mr-3"></span>
                      Shopify store setup & optimization
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-orange rounded-full mr-3"></span>
                      Social media account setup
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-orange rounded-full mr-3"></span>
                      Professional product photography
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-orange rounded-full mr-3"></span>
                      Video advertisement creation
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="text-xl font-semibold mb-4 text-orange">Product Package (Rs 100k)</h4>
                  <ul className="space-y-3">
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-orange rounded-full mr-3"></span>
                      100 premium perfume units
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-orange rounded-full mr-3"></span>
                      High-quality formulations
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-orange rounded-full mr-3"></span>
                      Professional packaging included
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-orange rounded-full mr-3"></span>
                      Ready-to-sell products
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-orange rounded-full mr-3"></span>
                      Quality assurance testing
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-orange rounded-full mr-3"></span>
                      Proven market formulas
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="text-center">
                <Button size="lg" className="bg-orange hover:bg-orange/90 text-white px-12 py-4 text-lg font-semibold rounded-full transition-all duration-300 transform hover:scale-105">
                  Chat on WhatsApp →
                </Button>
                <p className="text-sm text-gray-400 mt-4">
                  Join the ranks of successful brands like Elyscents
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
