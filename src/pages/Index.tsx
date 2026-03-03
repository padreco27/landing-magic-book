import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ProductsSection from "@/components/ProductsSection";
import BudgetForm from "@/components/BudgetForm";
import ScheduleSection from "@/components/ScheduleSection";
import ContactFooter from "@/components/ContactFooter";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <ProductsSection />
      <BudgetForm />
      <ScheduleSection />
      <ContactFooter />
    </div>
  );
};

export default Index;
