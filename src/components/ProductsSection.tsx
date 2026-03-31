import { motion } from "framer-motion";
import cakeImg from "@/assets/instagram/imgi_29_503611200_1511498769814232_4905489789673070905_n.jpg";
import brigadeirosImg from "@/assets/instagram/imgi_20_542245137_18363017206159379_5416424997447875745_n.jpg";
import cupcakesImg from "@/assets/instagram/imgi_30_439864236_18304731517159379_1689220520165347747_n.jpg";

const products = [
  { name: "Bolos Decorados", description: "Bolos artesanais personalizados para todas as ocasiões", image: cakeImg },
  { name: "Brigadeiros Gourmet", description: "Variedade de sabores irresistíveis com ingredientes premium", image: brigadeirosImg },
  { name: "Cupcakes & Docinhos", description: "Docinhos finos para festas, eventos e presentes especiais", image: cupcakesImg },
];

const ProductsSection = () => {
  return (
    <section id="produtos" className="py-20 px-4 bg-secondary">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          className="text-3xl md:text-4xl font-display font-bold text-center mb-4 text-foreground"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          Nossas Delícias
        </motion.h2>
        <p className="text-center text-muted-foreground mb-12 font-body max-w-lg mx-auto">
          Cada doce é preparado com carinho e ingredientes selecionados
        </p>

        <div className="grid md:grid-cols-3 gap-8">
          {products.map((product, i) => (
            <motion.div
              key={product.name}
              className="bg-card rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow group"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
            >
              <div className="overflow-hidden h-56">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-display font-semibold mb-2 text-foreground">{product.name}</h3>
                <p className="text-muted-foreground font-body text-sm">{product.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductsSection;
