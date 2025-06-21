
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";

const Header = () => {
  const handleScrollToContact = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const section = document.getElementById("contact");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-lg border-b border-gray-200">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex flex-col items-start justify-center">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Elevate51
            </h1>
            <span className="mt-1 text-xs sm:text-sm font-medium flex items-center gap-1 bg-gradient-to-r from-pink-500 via-indigo-500 to-purple-600 bg-clip-text text-transparent animate-fade-in select-none">
              <Heart
                className="mr-1 animate-heartbeat"
                size={14}
                strokeWidth={2.5}
                color="#ff3e84"
                fill="#ff3e84"
                aria-label="heart"
              />
              Powered by <span className="ml-1 font-semibold">IDMPakistan</span>
            </span>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            <a href="#services" className="text-gray-700 hover:text-purple-600 transition-colors">Services</a>
            <a href="#products" className="text-gray-700 hover:text-purple-600 transition-colors">Products</a>
            <a href="#success" className="text-gray-700 hover:text-purple-600 transition-colors">Success Story</a>
            <a href="#pricing" className="text-gray-700 hover:text-purple-600 transition-colors">Pricing</a>
            <a href="/seminar" className="text-gray-700 hover:text-purple-600 transition-colors">Free Seminar</a>
            <a href="/legal" className="text-gray-700 hover:text-purple-600 transition-colors">Legal</a>
          </nav>

          <Button
            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
            onClick={handleScrollToContact}
          >
            Get Started
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
