
import { useState } from "react";
import { ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";

const YOUTUBE_VIDEO_ID = "MFyveO9shfg";

const Hero = () => {
  const [showVideo, setShowVideo] = useState(false);

  const handleScrollToContact = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const section = document.getElementById('contact');
    if (section) {
      section.scrollIntoView({
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 flex items-center justify-center text-white overflow-hidden pt-32">
      {/* Lightweight Background Pattern */}
      <div className="absolute inset-0 pointer-events-none select-none" aria-hidden="true">
        <div className="absolute top-20 left-20 w-56 h-56 bg-gradient-to-r from-yellow-400 to-pink-400 rounded-full blur-xl opacity-20 transition-all duration-500"></div>
        <div className="absolute bottom-20 right-20 w-60 h-60 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full blur-xl opacity-20 transition-all duration-500"></div>
      </div>
      
      <div className="container mx-auto px-6 text-center relative z-10">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
          <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent block">
            We Build Your E-commerce Brand.
          </span>
          <span className="block mt-1">
            You Collect <span className="text-yellow-400">Revenue</span> and <span className="text-orange-400">Sales</span>
          </span>
        </h1>
        <p className="text-xl md:text-2xl mb-3 text-gray-200 max-w-3xl mx-auto leading-relaxed">
          Product, packaging, Shopify, product shoot and video ads 100% done. You keep the sales.
        </p>
        
        {/* Optimized Embed: YouTube Lazy Load */}
        <div className="flex justify-center mb-8">
          <div className="w-full max-w-2xl aspect-video rounded-xl overflow-hidden shadow-lg border-2 border-yellow-400 mx-auto bg-black">
            {!showVideo ? (
              <button
                type="button"
                className="w-full h-full relative group"
                aria-label="Play video"
                onClick={() => setShowVideo(true)}
                tabIndex={0}
                style={{ outline: "none" }}
              >
                <img
                  src={`https://img.youtube.com/vi/${YOUTUBE_VIDEO_ID}/hqdefault.jpg`}
                  alt="YouTube video thumbnail"
                  className="object-cover w-full h-full transition-opacity duration-200 group-hover:opacity-80 lazyload"
                  loading="lazy"
                  decoding="async"
                />
                <span className="absolute inset-0 flex items-center justify-center">
                  <span className="bg-white/90 rounded-full p-4 md:p-6 shadow-lg transition-transform transform group-hover:scale-110">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="#ea4335">
                      <circle cx="12" cy="12" r="12" fill="#fff" />
                      <polygon points="10,8 17,12 10,16" fill="#ea4335" />
                    </svg>
                  </span>
                </span>
              </button>
            ) : (
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${YOUTUBE_VIDEO_ID}?autoplay=1&rel=0`}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
                loading="lazy"
                style={{ display: "block" }}
              ></iframe>
            )}
          </div>
        </div>

        {/* Attribution line */}
        <div className="flex justify-center mb-8">
          <span
            className="text-base sm:text-lg font-medium bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent tracking-normal text-center flex items-center gap-1"
            style={{ letterSpacing: "normal" }}
          >
            <span role="img" aria-label="heart">❤️</span>
            Powered by
            <span className="font-semibold ml-1 mr-1">IDMPakistan</span>
            &
            <span className="font-semibold ml-1">Elyscents</span>
          </span>
        </div>
        <div className="flex justify-center mb-12">
          <Button size="lg" className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 px-8 py-4 text-lg font-semibold rounded-full transition-all duration-300 transform hover:scale-105 text-zinc-900" onClick={handleScrollToContact}>
            Schedule Free Consultation Call
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-16">
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
      
      {/* Scroll to explore indicator */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 opacity-80">
        <span className="text-sm text-gray-200 bg-gray-900/50 px-5 py-2 rounded-full shadow-md animate-fade-in">
          Scroll to explore <span className="ml-1 align-baseline text-lg">↓</span>
        </span>
      </div>
    </section>
  );
};

export default Hero;
