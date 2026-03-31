import { motion } from "framer-motion";
import { useState } from "react";
import img1 from "@/assets/instagram/imgi_28_503323229_1053078972846067_7423997360229693187_n.jpg";
import img2 from "@/assets/instagram/imgi_29_503611200_1511498769814232_4905489789673070905_n.jpg";
import img3 from "@/assets/instagram/imgi_24_504563003_693493286910064_3148865833511427933_n.jpg";
import img4 from "@/assets/instagram/imgi_20_542245137_18363017206159379_5416424997447875745_n.jpg";
import img5 from "@/assets/instagram/imgi_26_505483050_2223716784750357_7486484373818195671_n.jpg";
import img6 from "@/assets/instagram/imgi_27_503873928_699020322774057_2186961996005862800_n.jpg";

const galleryItems = [
  { src: img1, alt: "Doce artesanal", label: "Artesanal" },
  { src: img2, alt: "Doce gourmet", label: "Gourmet" },
  { src: img3, alt: "Bolo decorado", label: "Bolo Decorado" },
  { src: img4, alt: "Delícia Lado Doce", label: "Delícia" },
  { src: img5, alt: "Kit Festa", label: "Kit Festa" },
  { src: img6, alt: "Encomenda especial", label: "Encomenda" },
];

const GallerySection = () => {
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <section id="galeria" className="py-20 px-4 bg-background">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          className="text-3xl md:text-4xl font-display font-bold text-center mb-4 text-foreground"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          Nossos Trabalhos
        </motion.h2>
        <p className="text-center text-muted-foreground mb-12 font-body max-w-lg mx-auto">
          Cada criação é única — feita com amor e atenção aos detalhes
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {galleryItems.map((item, i) => (
            <motion.div
              key={i}
              className="relative overflow-hidden rounded-xl cursor-pointer group aspect-square"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              onClick={() => setSelected(i)}
            >
              <img
                src={item.src}
                alt={item.alt}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/40 transition-colors duration-300 flex items-end justify-center pb-4">
                <span className="text-primary-foreground font-body font-bold text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-primary/80 px-3 py-1 rounded-full">
                  {item.label}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {selected !== null && (
        <motion.div
          className="fixed inset-0 z-50 bg-foreground/90 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setSelected(null)}
        >
          <motion.img
            src={galleryItems[selected].src}
            alt={galleryItems[selected].alt}
            className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
          />
          <button
            onClick={() => setSelected(null)}
            className="absolute top-6 right-6 text-primary-foreground text-3xl font-bold hover:opacity-70"
          >
            ✕
          </button>
        </motion.div>
      )}
    </section>
  );
};

export default GallerySection;
