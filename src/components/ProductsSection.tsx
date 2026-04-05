import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

import fallbackImg from "@/assets/instagram/imgi_29_503611200_1511498769814232_4905489789673070905_n.jpg";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url?: string;
}

const ProductsSection = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;
        setProducts(data || []);
      } catch (err) {
        console.error("Erro ao carregar produtos:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

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

        {loading ? (
          <div className="text-center text-muted-foreground">Carregando catálogo...</div>
        ) : products.length === 0 ? (
          <div className="text-center text-muted-foreground">Nenhum produto cadastrado no momento.</div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {products.map((product, i) => (
              <motion.div
                key={product.id}
                className="bg-card rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow group"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: (i % 3) * 0.15 }}
              >
                <div className="overflow-hidden h-56">
                  <img
                    src={product.image_url || fallbackImg}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-display font-semibold text-foreground">{product.name}</h3>
                    <span className="font-semibold text-pink-600">R$ {product.price.toFixed(2)}</span>
                  </div>
                  <p className="text-muted-foreground font-body text-sm mb-4">{product.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductsSection;
