
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Products = () => {
  const products = [
    {
      title: "Premium Perfumes",
      description: "Launch your own fragrance line with our proven perfume formulations. Following Elyscents' success model.",
      image: "/lovable-uploads/ddae2a1d-da08-4405-bb49-6736d7f35a26.png",
      stats: "500+ daily orders achieved",
      price: "100 units @ Rs 1,000 each"
    },
    {
      title: "Beard Care Oils",
      description: "Tap into the growing men's grooming market with premium beard oils and care products.",
      image: "/placeholder.svg",
      stats: "High-margin products",
      price: "Custom formulations available"
    },
    {
      title: "Pain Relief Oils",
      description: "Natural pain relief solutions with traditional and modern formulations for wellness market.",
      image: "/placeholder.svg",
      stats: "Growing wellness market",
      price: "Therapeutic grade quality"
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
              <div className="relative overflow-hidden">
                <img 
                  src={product.image} 
                  alt={product.title}
                  className="w-full h-64 object-contain object-center bg-gradient-to-br from-gray-50 to-gray-100 p-4 group-hover:scale-110 transition-transform duration-500"
                />
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
