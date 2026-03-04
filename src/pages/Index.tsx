import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import ProductsSection from "@/components/ProductsSection";
import GallerySection from "@/components/GallerySection";
import TestimonialsSection from "@/components/TestimonialsSection";
import BudgetForm from "@/components/BudgetForm";
import ScheduleSection from "@/components/ScheduleSection";
import FAQSection from "@/components/FAQSection";
import ContactFooter from "@/components/ContactFooter";
import WhatsAppButton from "@/components/WhatsAppButton";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <AboutSection />
      <ProductsSection />
      <GallerySection />
      <TestimonialsSection />
      <BudgetForm />
      <ScheduleSection />
      <FAQSection />
      <ContactFooter />
      <WhatsAppButton />
    </div>
  );
};

export default Index;
