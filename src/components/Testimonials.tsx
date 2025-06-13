
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

const Testimonials = () => {
  const testimonials = [
    {
      video: "/placeholder.svg",
      name: "Ahmed Khan",
      brand: "Aromatic Dreams",
      description: "From 0 to 300 orders/day"
    },
    {
      video: "/placeholder.svg", 
      name: "Sarah Ahmed",
      brand: "Beard Kings",
      description: "Rs 500k monthly revenue"
    },
    {
      video: "/placeholder.svg",
      name: "Hassan Ali",
      brand: "Natural Relief",
      description: "Scaled to 5 cities in Pakistan"
    }
  ];

  return (
    <section className="py-20 bg-navy">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Success Stories from
            <span className="text-orange"> Real Clients</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            See how our clients built thriving e-commerce brands with our proven system.
          </p>
        </div>
        
        <div className="max-w-5xl mx-auto">
          <Carousel className="w-full">
            <CarouselContent>
              {testimonials.map((testimonial, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                  <div className="p-4">
                    {/* Phone Mockup */}
                    <div className="relative mx-auto w-64 h-96 bg-gray-800 rounded-3xl p-2 shadow-2xl">
                      <div className="bg-black rounded-2xl w-full h-full overflow-hidden relative">
                        {/* Notch */}
                        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-gray-800 rounded-b-2xl z-10"></div>
                        
                        {/* Video Content */}
                        <div className="w-full h-full bg-gradient-to-b from-gray-900 to-gray-800 flex flex-col items-center justify-center p-6">
                          <div className="w-16 h-16 bg-orange rounded-full mb-4 flex items-center justify-center">
                            <span className="text-white text-2xl">▶</span>
                          </div>
                          <h3 className="text-white font-semibold text-center mb-2">{testimonial.name}</h3>
                          <p className="text-orange text-sm text-center mb-2">{testimonial.brand}</p>
                          <p className="text-gray-400 text-xs text-center">{testimonial.description}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="bg-white/10 border-white/20 hover:bg-white/20" />
            <CarouselNext className="bg-white/10 border-white/20 hover:bg-white/20" />
          </Carousel>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
