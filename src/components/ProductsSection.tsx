import { motion } from "framer-motion";
import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/lib/supabase";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";
import fallbackImg from "@/assets/instagram/imgi_29_503611200_1511498769814232_4905489789673070905_n.jpg";

interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  quantity: number;
  image_url?: string;
}

const ProductsSection = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>("Todos");
  const { addItem } = useCart();

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

  const categories = useMemo(() => {
    const cats = new Set(products.map(p => p.category).filter(Boolean));
    return ["Todos", ...Array.from(cats)];
  }, [products]);

  const filteredProducts = activeCategory === "Todos" 
    ? products 
    : products.filter(p => p.category === activeCategory);

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
        <p className="text-center text-muted-foreground mb-8 font-body max-w-lg mx-auto">
          Cada doce é preparado com carinho e ingredientes selecionados
        </p>

        {!loading && categories.length > 1 && (
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {categories.map(cat => (
              <Button 
                key={cat} 
                variant={activeCategory === cat ? "default" : "outline"}
                className={activeCategory === cat ? "bg-pink-600 hover:bg-pink-700 text-white" : "border-pink-200 text-pink-700 hover:bg-pink-50 dark:border-pink-900/50 dark:text-pink-400 dark:hover:bg-pink-900/30"}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </Button>
            ))}
          </div>
        )}

        {loading ? (
          <div className="text-center text-muted-foreground">Carregando catálogo...</div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center text-muted-foreground">Nenhum produto cadastrado nesta categoria.</div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {filteredProducts.map((product, i) => (
              <motion.div
                key={product.id}
                className="bg-card rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow group flex flex-col"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: (i % 3) * 0.15 }}
              >
                <div className="overflow-hidden h-56 shrink-0">
                  <img
                    src={product.image_url || fallbackImg}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-display font-semibold text-foreground line-clamp-2">{product.name}</h3>
                    <span className="font-semibold text-pink-600 whitespace-nowrap ml-4">R$ {product.price.toFixed(2)}</span>
                  </div>
                  <p className="text-muted-foreground font-body text-sm mb-6 flex-1">{product.description}</p>
                  
                  <Button 
                    className="w-full bg-pink-100 text-pink-700 hover:bg-pink-200 dark:bg-pink-900/40 dark:text-pink-300 dark:hover:bg-pink-900/60 mt-auto shadow-sm" 
                    onClick={() => addItem(product)}
                    disabled={product.quantity === 0}
                  >
                    <ShoppingBag className="w-4 h-4 mr-2" />
                    {product.quantity > 0 ? "Adicionar à Sacola" : "Esgotado"}
                  </Button>
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
