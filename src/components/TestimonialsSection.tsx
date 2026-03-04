import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Ana Carolina",
    text: "O bolo de aniversário da minha filha ficou lindo e delicioso! Todos os convidados elogiaram. Super recomendo!",
    rating: 5,
  },
  {
    name: "Mariana Silva",
    text: "Os brigadeiros gourmet são os melhores que já provei! Perfeitos para o meu casamento. Qualidade impecável!",
    rating: 5,
  },
  {
    name: "Juliana Costa",
    text: "Encomendei cupcakes para o chá de bebê e superou todas as expectativas. Lindo, saboroso e entregue no prazo!",
    rating: 5,
  },
];

const TestimonialsSection = () => {
  return (
    <section className="py-20 px-4 bg-secondary">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          className="text-3xl md:text-4xl font-display font-bold text-center mb-4 text-foreground"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          O que dizem nossos clientes
        </motion.h2>
        <p className="text-center text-muted-foreground mb-12 font-body max-w-lg mx-auto">
          A satisfação de quem já provou nossas delícias
        </p>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              className="bg-card p-8 rounded-2xl shadow-lg border border-border relative"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
            >
              <div className="text-5xl text-primary/30 font-display absolute top-4 left-6">"</div>
              <div className="flex gap-1 mb-4 mt-2">
                {Array.from({ length: t.rating }).map((_, s) => (
                  <Star key={s} className="w-4 h-4 fill-accent text-accent" />
                ))}
              </div>
              <p className="text-muted-foreground font-body text-sm mb-6 italic leading-relaxed">
                {t.text}
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-display font-bold text-lg">
                  {t.name[0]}
                </div>
                <span className="font-body font-bold text-foreground text-sm">{t.name}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
