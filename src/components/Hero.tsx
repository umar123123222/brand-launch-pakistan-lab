import { ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
const Hero = () => {
  const handleScrollToContact = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const section = document.getElementById('contact');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 flex items-center justify-center text-white overflow-hidden pt-16">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-yellow-400 to-pink-400 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-6 text-center relative z-10">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
          Launch Your
          <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent block">
            E-commerce Empire
          </span>
          in Pakistan
        </h1>
        <p className="text-xl md:text-2xl mb-3 text-gray-200 max-w-3xl mx-auto leading-relaxed">
          We create Profitable Brands in 40 to 60 days... Guaranteed!
        </p>
        <div
          className="flex justify-center mb-8"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent text-base sm:text-lg font-semibold shadow-md select-none animate-fade-in">
            <span role="img" aria-label="heart" className="mr-1">❤️</span>
            Powered by
            <span className="mx-1 font-bold">IDMPakistan</span>
            &amp;
            <span className="ml-1 font-bold">Elyscents</span>
          </span>
        </div>
        <div className="flex justify-center mb-12">
          <Button
            size="lg"
            className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 px-8 py-4 text-lg font-semibold rounded-full transition-all duration-300 transform hover:scale-105 text-zinc-900"
            onClick={handleScrollToContact}
          >
            Schedule Free Consultation Call
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="text-4xl font-bold text-yellow-400 mb-2">16+</div>
            <div className="text-gray-300">Brands Launched Yet</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-yellow-400 mb-2">Rs 350k</div>
            <div className="text-gray-300">Complete Package</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-yellow-400 mb-2">100%</div>
            <div className="text-gray-300">Turnkey Solution</div>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <ArrowDown className="w-6 h-6 text-white" />
      </div>
    </section>
  );
};
export default Hero;
