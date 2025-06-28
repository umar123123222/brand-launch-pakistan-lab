
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Heart, Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  const handleScrollToContact = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsMenuOpen(false); // Close mobile menu when clicking Get Started
    if (isHomePage) {
      const section = document.getElementById("contact");
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      // If not on home page, navigate to home first then scroll
      window.location.href = "/#contact";
    }
  };

  const handleNavClick = () => {
    setIsMenuOpen(false); // Close mobile menu when clicking nav links
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-lg border-b border-gray-200">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex flex-col items-start justify-center">
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
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="/#services" className="text-gray-700 hover:text-purple-600 transition-colors">Services</a>
            <a href="/#products" className="text-gray-700 hover:text-purple-600 transition-colors">Products</a>
            <a href="/#success" className="text-gray-700 hover:text-purple-600 transition-colors">Success Story</a>
            <Link to="/funnel/step1" className="text-gray-700 hover:text-purple-600 transition-colors">Free Mini Course</Link>
            <Link to="/about" className="text-gray-700 hover:text-purple-600 transition-colors">About Us</Link>
            <Link to="/legal" className="text-gray-700 hover:text-purple-600 transition-colors">Legal</Link>
          </nav>

          {/* Desktop Get Started Button */}
          <Button
            className="hidden md:flex bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
            onClick={handleScrollToContact}
          >
            Get Started
          </Button>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-gray-700 hover:text-purple-600 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 bg-white/95 backdrop-blur-lg">
            <nav className="flex flex-col space-y-4">
              <a 
                href="/#services" 
                className="text-gray-700 hover:text-purple-600 transition-colors px-2 py-1"
                onClick={handleNavClick}
              >
                Services
              </a>
              <a 
                href="/#products" 
                className="text-gray-700 hover:text-purple-600 transition-colors px-2 py-1"
                onClick={handleNavClick}
              >
                Products
              </a>
              <a 
                href="/#success" 
                className="text-gray-700 hover:text-purple-600 transition-colors px-2 py-1"
                onClick={handleNavClick}
              >
                Success Story
              </a>
              <Link 
                to="/funnel/step1" 
                className="text-gray-700 hover:text-purple-600 transition-colors px-2 py-1"
                onClick={handleNavClick}
              >
                Free Mini Course
              </Link>
              <Link 
                to="/about" 
                className="text-gray-700 hover:text-purple-600 transition-colors px-2 py-1"
                onClick={handleNavClick}
              >
                About Us
              </Link>
              <Link 
                to="/legal" 
                className="text-gray-700 hover:text-purple-600 transition-colors px-2 py-1"
                onClick={handleNavClick}
              >
                Legal
              </Link>
              <Button
                className="mx-2 mt-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
                onClick={handleScrollToContact}
              >
                Get Started
              </Button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
