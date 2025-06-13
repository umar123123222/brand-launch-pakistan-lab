
import { Button } from "@/components/ui/button";

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-navy/90 backdrop-blur-lg border-b border-gray-700">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-white">
              BrandLaunch
            </h1>
          </div>
          
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#services" className="text-gray-300 hover:text-orange transition-colors">Services</a>
            <a href="#products" className="text-gray-300 hover:text-orange transition-colors">Products</a>
            <a href="#success" className="text-gray-300 hover:text-orange transition-colors">Success Story</a>
            <a href="#pricing" className="text-gray-300 hover:text-orange transition-colors">Pricing</a>
          </nav>
          
          <Button className="bg-orange hover:bg-orange/90 text-white font-bold">
            Chat on WhatsApp →
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
