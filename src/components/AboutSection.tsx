import { motion } from "framer-motion";
import { Heart, Sparkles, Clock } from "lucide-react";
import logo from "@/assets/logo.png";

const values = [
  { icon: Heart, title: "Feito com Amor", desc: "Cada receita carrega carinho e dedicação em cada detalhe" },
  { icon: Sparkles, title: "Ingredientes Premium", desc: "Selecionamos os melhores ingredientes para um sabor inesquecível" },
  { icon: Clock, title: "Pontualidade", desc: "Compromisso com prazos para que sua festa seja perfeita" },
];

const AboutSection = () => {
  return (
    <section id="sobre" className="py-20 px-4 bg-secondary">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-6 text-foreground">
              Nossa História
            </h2>
            <p className="text-muted-foreground font-body leading-relaxed mb-4">
              A <strong className="text-foreground">Lado Doce Gourmet</strong> nasceu da paixão por transformar momentos 
              especiais em lembranças doces e inesquecíveis. Em Paraopeba, no coração de Minas Gerais, 
              cada receita é pensada com carinho para levar alegria à sua mesa.
            </p>
            <p className="text-muted-foreground font-body leading-relaxed mb-8">
              Acreditamos que um doce feito à mão carrega uma energia única — é afeto em forma de 
              sabor. Por isso, trabalhamos somente por encomenda, garantindo frescor e qualidade 
              em cada mordida.
            </p>

            <div className="space-y-4">
              {values.map((v, i) => (
                <motion.div
                  key={v.title}
                  className="flex items-start gap-4"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <div className="p-2 rounded-lg bg-primary/10 text-primary shrink-0">
                    <v.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-display font-semibold text-foreground text-sm">{v.title}</h4>
                    <p className="font-body text-muted-foreground text-sm">{v.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            className="flex justify-center"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <div className="relative">
              <div className="w-72 h-72 md:w-80 md:h-80 rounded-full overflow-hidden border-4 border-primary/20 shadow-2xl">
                <img src={logo} alt="Lado Doce Gourmet" className="w-full h-full object-cover" />
              </div>
              <div className="absolute -bottom-4 -right-4 bg-primary text-primary-foreground px-5 py-2 rounded-full font-body font-bold text-sm shadow-lg">
                🍫 Desde 2020
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
