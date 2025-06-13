
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
    <section className="py-20 bg-navy">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Everything You Need to
            <span className="text-orange"> Succeed</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Our comprehensive service package covers every aspect of launching and scaling your e-commerce brand.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Card key={index} className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-gray-700 bg-white/5 backdrop-blur-lg">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-white group-hover:text-orange transition-colors">
                  {service.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400 mb-4 leading-relaxed">
                  {service.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {service.features.map((feature, idx) => (
                    <Badge key={idx} variant="secondary" className="bg-orange/20 text-orange hover:bg-orange/30">
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
