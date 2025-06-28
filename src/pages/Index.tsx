
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Products from "@/components/Products";
import CaseStudy from "@/components/CaseStudy";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
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
      <Contact />
      <Footer />
    </div>
  );
};

export default Index;
