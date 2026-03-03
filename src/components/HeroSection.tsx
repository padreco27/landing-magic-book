import { motion } from "framer-motion";
import heroImage from "@/assets/hero-sweets.jpg";
import logo from "@/assets/logo.png";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <img src={heroImage} alt="Doces gourmet" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-foreground/60 via-foreground/40 to-background" />
      </div>

      <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
        <motion.img
          src={logo}
          alt="Lado Doce Gourmet"
          className="w-40 h-40 mx-auto mb-6 rounded-full shadow-xl border-4 border-card"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", duration: 1 }}
        />
        <motion.h1
          className="text-4xl md:text-6xl font-display font-bold text-primary-foreground mb-4 drop-shadow-lg"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          Lado Doce Gourmet
        </motion.h1>
        <motion.p
          className="text-lg md:text-xl text-primary-foreground/90 mb-2 font-body"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          Confeitaria Afetiva
        </motion.p>
        <motion.p
          className="text-primary-foreground/80 mb-8 font-body"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          🍫 Bolos, docinhos e delícias — somente por encomenda!
        </motion.p>
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          <a
            href="#orcamento"
            className="px-8 py-3 bg-primary text-primary-foreground rounded-full font-body font-bold hover:opacity-90 transition-opacity shadow-lg"
          >
            Solicitar Orçamento
          </a>
          <a
            href="#agendamento"
            className="px-8 py-3 bg-card/90 text-foreground rounded-full font-body font-bold hover:bg-card transition-colors shadow-lg"
          >
            Agendar Encomenda
          </a>
        </motion.div>
      </div>

      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        <svg className="w-6 h-6 text-primary-foreground/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </motion.div>
    </section>
  );
};

export default HeroSection;
