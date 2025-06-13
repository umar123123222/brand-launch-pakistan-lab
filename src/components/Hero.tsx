
import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <section className="relative min-h-screen bg-navy flex items-center justify-center text-white overflow-hidden">
      {/* Parallax Perfume Bottles Background */}
      <div className="absolute inset-0 opacity-30">
        <div className="w-full h-full bg-gradient-to-r from-navy/80 to-transparent absolute z-10"></div>
        <img 
          src="/placeholder.svg" 
          alt="Stacked perfume bottles under dramatic lighting"
          className="w-full h-full object-cover animate-parallax"
        />
      </div>
      
      <div className="container mx-auto px-6 text-center relative z-20">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight text-white">
          Launch Your Brand
          <span className="block text-orange">
            in 30 Days—Guaranteed
          </span>
        </h1>
        
        <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto leading-relaxed">
          We turn your vision into a thriving e-commerce brand. From product creation to 500+ daily orders - 
          just like our success story Elyscents.
        </p>
        
        <div className="mb-8">
          <Button size="lg" className="bg-orange hover:bg-orange/90 text-white px-8 py-4 text-lg font-bold rounded-full transition-all duration-300 transform hover:scale-105">
            Chat on WhatsApp →
          </Button>
        </div>
        
        {/* Reassurance Strip */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center text-sm uppercase tracking-wide text-orange font-medium">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-orange rounded-full"></span>
            42 brands launched
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-orange rounded-full"></span>
            Avg profit Rs 14,800/unit
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-orange rounded-full"></span>
            28-day rollout
          </div>
        </div>
        
        {/* Process Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto mt-16">
          <div className="group cursor-pointer">
            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
              <div className="w-12 h-12 bg-orange/20 rounded-full flex items-center justify-center mb-4 mx-auto">
                <div className="w-6 h-6 border-2 border-orange rounded-full"></div>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Ideate</h3>
              <p className="text-gray-400 text-sm">Brand concept & market research</p>
            </div>
          </div>
          
          <div className="group cursor-pointer">
            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
              <div className="w-12 h-12 bg-orange/20 rounded-full flex items-center justify-center mb-4 mx-auto">
                <div className="w-6 h-6 border-2 border-orange rounded-sm"></div>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Manufacture</h3>
              <p className="text-gray-400 text-sm">Product formulation & packaging</p>
            </div>
          </div>
          
          <div className="group cursor-pointer">
            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
              <div className="w-12 h-12 bg-orange/20 rounded-full flex items-center justify-center mb-4 mx-auto">
                <div className="w-6 h-6 border-2 border-orange rounded-full border-dashed"></div>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Market</h3>
              <p className="text-gray-400 text-sm">Launch & scale to 500+ orders</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Floating WhatsApp Widget */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button className="bg-green-500 hover:bg-green-600 text-white w-14 h-14 rounded-full shadow-lg">
          <span className="text-2xl">💬</span>
        </Button>
      </div>
    </section>
  );
};

export default Hero;
