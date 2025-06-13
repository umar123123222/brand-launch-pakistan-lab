
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Products from "@/components/Products";
import CaseStudy from "@/components/CaseStudy";
import Testimonials from "@/components/Testimonials";
import Pricing from "@/components/Pricing";
import Contact from "@/components/Contact";

const Index = () => {
  return (
    <div className="min-h-screen bg-navy">
      <Header />
      <Hero />
      <div id="services">
        <Services />
      </div>
      <div id="products">
        <Products />
      </div>
      <div id="success">
        <CaseStudy />
      </div>
      <Testimonials />
      <div id="pricing">
        <Pricing />
      </div>
      <Contact />
    </div>
  );
};

export default Index;
