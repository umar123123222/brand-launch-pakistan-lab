
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 text-white">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            About <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">Elevate51</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto">
            We're passionate about helping Pakistani entrepreneurs launch successful e-commerce brands with our proven turnkey solutions.
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Our Story</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
              <div>
                <h3 className="text-2xl font-bold mb-4 text-purple-600">From Vision to Reality</h3>
                <p className="text-gray-600 mb-4">
                  Elevate51 was born from the success of Elyscents, our flagship brand that achieved over 500 daily orders. 
                  We realized that many aspiring entrepreneurs in Pakistan had great ideas but lacked the resources and 
                  expertise to bring their vision to life.
                </p>
                <p className="text-gray-600">
                  That's when we decided to share our proven system and help others build their own successful e-commerce empires.
                </p>
              </div>
              
              <Card className="bg-gradient-to-br from-yellow-50 to-orange-50">
                <CardContent className="p-8">
                  <h4 className="text-xl font-bold mb-4">Our Achievement</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Brands Launched</span>
                      <span className="text-2xl font-bold text-purple-600">16+</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Daily Orders (Elyscents)</span>
                      <span className="text-2xl font-bold text-purple-600">500+</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Success Rate</span>
                      <span className="text-2xl font-bold text-purple-600">100%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Our Mission */}
            <div className="text-center mb-16">
              <h3 className="text-2xl font-bold mb-6 text-purple-600">Our Mission</h3>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                To empower Pakistani entrepreneurs by providing complete turnkey e-commerce solutions. 
                We handle product development, packaging, and setup—so you can focus on growing your brand 
                and building your business empire.
              </p>
            </div>

            {/* Our Team */}
            <div className="text-center mb-16">
              <h3 className="text-2xl font-bold mb-6 text-purple-600">Our Expert Team</h3>
              <p className="text-gray-600 mb-8">
                Our team combines years of e-commerce experience with deep knowledge of the Pakistani market. 
                We're backed by IDMPakistan and powered by the success of Elyscents.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <Card>
                  <CardContent className="p-6 text-center">
                    <h4 className="font-bold mb-2">Product Development</h4>
                    <p className="text-gray-600 text-sm">Expert product creators who understand market trends and consumer preferences</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 text-center">
                    <h4 className="font-bold mb-2">Brand Strategy</h4>
                    <p className="text-gray-600 text-sm">Brand strategists who create compelling brand stories and market positioning</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 text-center">
                    <h4 className="font-bold mb-2">Technical Setup</h4>
                    <p className="text-gray-600 text-sm">Technical experts who handle all the complex setup and optimization</p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Call to Action */}
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-4">Ready to Build Your Brand?</h3>
              <p className="text-gray-600 mb-8">
                Join the entrepreneurs who have successfully launched their brands with our proven system.
              </p>
              <Link to="/#contact">
                <Button size="lg" className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 px-8 py-4 text-lg font-semibold rounded-full transition-all duration-300 transform hover:scale-105 text-zinc-900">
                  Start Your Brand Journey
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
