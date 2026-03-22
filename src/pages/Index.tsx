import Header from "@/components/landing/Header";
import HeroSection from "@/components/landing/HeroSection";
import ServiceCategories from "@/components/landing/ServiceCategories";
import HowItWorks from "@/components/landing/HowItWorks";
import Footer from "@/components/landing/Footer";

const Index = () => (
  <div className="min-h-screen">
    <Header />
    <HeroSection />
    <ServiceCategories />
    <HowItWorks />
    <Footer />
  </div>
);

export default Index;
