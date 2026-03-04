import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Qual a antecedência mínima para encomendas?",
    answer: "Recomendamos no mínimo 5 dias úteis para bolos decorados e 3 dias para brigadeiros e docinhos. Em datas comemorativas, sugerimos encomendar com ainda mais antecedência.",
  },
  {
    question: "Vocês fazem entregas?",
    answer: "No momento não realizamos entregas. A retirada dos produtos é feita em nosso endereço na Av. Francisco Simões, 259 — Paraopeba/MG. Combine o horário de retirada pelo WhatsApp!",
  },
  {
    question: "Quais sabores de brigadeiro estão disponíveis?",
    answer: "Temos mais de 15 sabores, incluindo tradicional, Ninho, Oreo, pistache, maracujá, churros, Nutella e muitos outros. Novos sabores são adicionados frequentemente!",
  },
  {
    question: "Posso personalizar o tema do bolo?",
    answer: "Com certeza! Trabalhamos com temas personalizados para aniversários, casamentos, chás de bebê e qualquer outra celebração. Envie suas ideias e referências pelo WhatsApp.",
  },
  {
    question: "Vocês trabalham com opções sem lactose ou sem glúten?",
    answer: "Sim, temos algumas opções adaptadas. Consulte-nos para verificar disponibilidade e valores para receitas especiais.",
  },
];

const FAQSection = () => {
  return (
    <section id="faq" className="py-20 px-4 bg-background">
      <div className="max-w-3xl mx-auto">
        <motion.h2
          className="text-3xl md:text-4xl font-display font-bold text-center mb-4 text-foreground"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          Perguntas Frequentes
        </motion.h2>
        <p className="text-center text-muted-foreground mb-12 font-body max-w-lg mx-auto">
          Tire suas dúvidas sobre nossos produtos e serviços
        </p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, i) => (
              <AccordionItem
                key={i}
                value={`item-${i}`}
                className="bg-card border border-border rounded-xl px-6 overflow-hidden"
              >
                <AccordionTrigger className="font-body font-bold text-foreground text-left hover:no-underline py-5">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="font-body text-muted-foreground pb-5 leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQSection;
