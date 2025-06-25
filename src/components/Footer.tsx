
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-[#1a0d2e] py-12">
      <div className="max-w-[1200px] mx-auto px-6">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-white font-bold text-lg">Elevate51</h3>
            <p className="text-gray-300 text-sm">
              We handle product development, packaging, and setup—so you can focus on growing your brand.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-white font-semibold">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-gray-300 hover:text-purple-300 text-sm transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-300 hover:text-purple-300 text-sm transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/legal" className="text-gray-300 hover:text-purple-300 text-sm transition-colors">
                  Legal
                </Link>
              </li>
              <li>
                <Link to="/seminar" className="text-gray-300 hover:text-purple-300 text-sm transition-colors">
                  Free Seminar
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h4 className="text-white font-semibold">Services</h4>
            <ul className="space-y-2">
              <li>
                <a href="#services" className="text-gray-300 hover:text-purple-300 text-sm transition-colors">
                  Brand Development
                </a>
              </li>
              <li>
                <a href="#products" className="text-gray-300 hover:text-purple-300 text-sm transition-colors">
                  Product Creation
                </a>
              </li>
              <li>
                <a href="#pricing" className="text-gray-300 hover:text-purple-300 text-sm transition-colors">
                  Pricing
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-white font-semibold">Contact</h4>
            <div className="space-y-2">
              <p className="text-gray-300 text-sm">
                <span className="font-medium">Email:</span><br />
                <a href="mailto:askelevate51@gmail.com" className="hover:text-purple-300 transition-colors">
                  askelevate51@gmail.com
                </a>
              </p>
              <p className="text-gray-300 text-sm">
                <span className="font-medium">WhatsApp:</span><br />
                <a href="https://wa.me/923148860546" className="hover:text-purple-300 transition-colors">
                  03148860546
                </a>
              </p>
              <p className="text-gray-300 text-sm">
                <span className="font-medium">Office:</span><br />
                A316, Block 2 Gulshan Iqbal Karachi
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 pt-6 flex flex-col sm:flex-row justify-between items-center text-white text-sm">
          <div className="mb-2 sm:mb-0">
            © 2025 Elevate51. All rights reserved.
          </div>
          <div className="flex items-center">
            ❤️ Powered by IDMPakistan
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
