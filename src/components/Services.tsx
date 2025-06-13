
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const Services = () => {
  const services = [
    {
      title: "Product Development",
      description: "Premium quality perfumes, beard oils, and pain relief oils sourced and formulated to perfection.",
      features: ["Quality Sourcing", "Formula Optimization", "Compliance Testing"]
    },
    {
      title: "Branding & Design",
      description: "Complete visual identity including label design, packaging, and brand guidelines.",
      features: ["Logo Design", "Label Design", "Box Packaging", "Brand Guidelines"]
    },
    {
      title: "E-commerce Setup",
      description: "Professional Shopify store setup optimized for conversions and user experience.",
      features: ["Shopify Store", "Payment Integration", "SEO Optimization", "Mobile Responsive"]
    },
    {
      title: "Content Creation",
      description: "Professional product photography and video advertisements to showcase your products.",
      features: ["Product Photography", "Video Ads", "Social Media Content", "Lifestyle Shoots"]
    },
    {
      title: "Digital Marketing",
      description: "Complete social media setup and marketing strategy to reach your target audience.",
      features: ["Social Media Setup", "Content Strategy", "Ad Campaigns", "Influencer Outreach"]
    },
    {
      title: "Ongoing Support",
      description: "Continuous support and guidance to help you scale from launch to 500+ daily orders.",
      features: ["Business Mentoring", "Scale Strategy", "Performance Analytics", "24/7 Support"]
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Everything You Need to
            <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent"> Succeed</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our comprehensive service package covers every aspect of launching and scaling your e-commerce brand.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Card key={index} className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-0 bg-white">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors">
                  {service.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  {service.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {service.features.map((feature, idx) => (
                    <Badge key={idx} variant="secondary" className="bg-purple-100 text-purple-700 hover:bg-purple-200">
                      {feature}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
