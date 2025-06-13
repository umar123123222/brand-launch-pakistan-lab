
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const Pricing = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 text-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Simple, Transparent
            <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent"> Pricing</span>
          </h2>
          <p className="text-xl text-gray-200 max-w-3xl mx-auto">
            Everything you need to launch your brand for one fixed price. No hidden costs, no surprises.
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <Card className="bg-white/10 backdrop-blur-lg border-white/20 text-white relative overflow-hidden">
            <Badge className="absolute top-4 right-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-semibold z-10">
              Most Popular
            </Badge>
            
            <CardHeader className="text-center pb-8">
              <CardTitle className="text-3xl font-bold mb-4">Complete Brand Launch Package</CardTitle>
              <div className="text-6xl font-bold mb-4">
                <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                  Rs 350k
                </span>
              </div>
              <p className="text-xl text-gray-300">Rs 250k Service Fee + Rs 100k Product Cost</p>
            </CardHeader>
            
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div>
                  <h4 className="text-xl font-semibold mb-4 text-yellow-400">Service Package (Rs 250k)</h4>
                  <ul className="space-y-3">
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-green-400 rounded-full mr-3"></span>
                      Complete branding & label design
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-green-400 rounded-full mr-3"></span>
                      Professional packaging design
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-green-400 rounded-full mr-3"></span>
                      Shopify store setup & optimization
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-green-400 rounded-full mr-3"></span>
                      Social media account setup
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-green-400 rounded-full mr-3"></span>
                      Professional product photography
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-green-400 rounded-full mr-3"></span>
                      Video advertisement creation
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="text-xl font-semibold mb-4 text-yellow-400">Product Package (Rs 100k)</h4>
                  <ul className="space-y-3">
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-green-400 rounded-full mr-3"></span>
                      100 premium perfume units
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-green-400 rounded-full mr-3"></span>
                      High-quality formulations
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-green-400 rounded-full mr-3"></span>
                      Professional packaging included
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-green-400 rounded-full mr-3"></span>
                      Ready-to-sell products
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-green-400 rounded-full mr-3"></span>
                      Quality assurance testing
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-green-400 rounded-full mr-3"></span>
                      Proven market formulas
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="text-center">
                <Button size="lg" className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white px-12 py-4 text-lg font-semibold rounded-full transition-all duration-300 transform hover:scale-105">
                  Get Started Today
                </Button>
                <p className="text-sm text-gray-300 mt-4">
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
