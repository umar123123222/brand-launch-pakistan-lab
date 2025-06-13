
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Products = () => {
  const products = [
    {
      title: "Premium Perfumes",
      description: "Launch your own fragrance line with our proven perfume formulations. Following Elyscents' success model.",
      image: "/placeholder.svg",
      stats: "500+ daily orders achieved",
      price: "100 units @ Rs 1,000 each",
      mockup: "50ml perfume bottle"
    },
    {
      title: "Beard Care Oils",
      description: "Tap into the growing men's grooming market with premium beard oils and care products.",
      image: "/placeholder.svg",
      stats: "High-margin products",
      price: "Custom formulations available",
      mockup: "30ml beard oil bottle"
    },
    {
      title: "Pain Relief Oils",
      description: "Natural pain relief solutions with traditional and modern formulations for wellness market.",
      image: "/placeholder.svg",
      stats: "Growing wellness market",
      price: "Therapeutic grade quality",
      mockup: "30ml pain relief oil bottle"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Product Categories We
            <span className="bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent"> Specialize In</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose from our proven product categories, each with market-tested formulations and packaging solutions.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {products.map((product, index) => (
            <Card key={index} className="group overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:scale-105 border-0">
              <div className="relative overflow-hidden h-64 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                {/* Bottle Mockup */}
                <div className="relative z-10 text-center">
                  <div className="w-20 h-32 mx-auto mb-4 bg-gradient-to-b from-white to-gray-100 rounded-lg shadow-lg border border-gray-300 flex flex-col items-center justify-between p-2">
                    {/* Bottle Cap */}
                    <div className={`w-6 h-4 rounded-t-full ${
                      index === 0 ? 'bg-gold-400' : 
                      index === 1 ? 'bg-amber-600' : 
                      'bg-green-600'
                    } shadow-sm`}></div>
                    
                    {/* Bottle Body */}
                    <div className="flex-1 w-full bg-gradient-to-b from-transparent to-gray-50 rounded border border-gray-200 relative">
                      {/* Label */}
                      <div className={`absolute inset-x-1 top-2 bottom-2 rounded ${
                        index === 0 ? 'bg-purple-100 border-purple-200' : 
                        index === 1 ? 'bg-amber-50 border-amber-200' : 
                        'bg-green-50 border-green-200'
                      } border flex items-center justify-center`}>
                        <div className="text-xs font-semibold text-gray-700 text-center leading-tight">
                          {product.mockup}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Product Type Label */}
                  <div className={`text-sm font-medium px-3 py-1 rounded-full ${
                    index === 0 ? 'bg-purple-100 text-purple-700' : 
                    index === 1 ? 'bg-amber-100 text-amber-700' : 
                    'bg-green-100 text-green-700'
                  }`}>
                    {product.mockup}
                  </div>
                </div>
                
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className={`absolute top-4 right-4 w-16 h-16 rounded-full blur-xl ${
                    index === 0 ? 'bg-purple-400' : 
                    index === 1 ? 'bg-amber-400' : 
                    'bg-green-400'
                  }`}></div>
                  <div className={`absolute bottom-4 left-4 w-12 h-12 rounded-full blur-xl ${
                    index === 0 ? 'bg-pink-400' : 
                    index === 1 ? 'bg-orange-400' : 
                    'bg-teal-400'
                  }`}></div>
                </div>
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors">
                  {product.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  {product.description}
                </p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-green-600">{product.stats}</span>
                  </div>
                  <div className="text-sm text-gray-500">{product.price}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Products;
