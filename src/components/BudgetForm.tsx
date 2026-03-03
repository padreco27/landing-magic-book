import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";

const BudgetForm = () => {
  const [form, setForm] = useState({ name: "", phone: "", product: "", details: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const message = encodeURIComponent(
      `Olá! Gostaria de solicitar um orçamento.\n\nNome: ${form.name}\nProduto: ${form.product}\nDetalhes: ${form.details}`
    );
    window.open(`https://wa.me/5531987903945?text=${message}`, "_blank");
    toast.success("Redirecionando para o WhatsApp!");
  };

  return (
    <section id="orcamento" className="py-20 px-4 bg-background">
      <div className="max-w-2xl mx-auto">
        <motion.h2
          className="text-3xl md:text-4xl font-display font-bold text-center mb-4 text-foreground"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          Solicitar Orçamento
        </motion.h2>
        <p className="text-center text-muted-foreground mb-10 font-body">
          Preencha o formulário e entraremos em contato pelo WhatsApp
        </p>

        <motion.form
          onSubmit={handleSubmit}
          className="space-y-5 bg-card p-8 rounded-2xl shadow-lg border border-border"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div>
            <label className="block text-sm font-body font-bold text-foreground mb-1">Nome</label>
            <input
              type="text"
              required
              maxLength={100}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-4 py-3 rounded-lg bg-secondary border border-border text-foreground font-body focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Seu nome"
            />
          </div>
          <div>
            <label className="block text-sm font-body font-bold text-foreground mb-1">Telefone</label>
            <input
              type="tel"
              required
              maxLength={20}
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full px-4 py-3 rounded-lg bg-secondary border border-border text-foreground font-body focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="(31) 99999-9999"
            />
          </div>
          <div>
            <label className="block text-sm font-body font-bold text-foreground mb-1">Produto</label>
            <select
              required
              value={form.product}
              onChange={(e) => setForm({ ...form, product: e.target.value })}
              className="w-full px-4 py-3 rounded-lg bg-secondary border border-border text-foreground font-body focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">Selecione o produto</option>
              <option value="Bolo Decorado">Bolo Decorado</option>
              <option value="Brigadeiros Gourmet">Brigadeiros Gourmet</option>
              <option value="Cupcakes">Cupcakes</option>
              <option value="Kit Festa">Kit Festa</option>
              <option value="Outro">Outro</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-body font-bold text-foreground mb-1">Detalhes</label>
            <textarea
              required
              maxLength={500}
              rows={4}
              value={form.details}
              onChange={(e) => setForm({ ...form, details: e.target.value })}
              className="w-full px-4 py-3 rounded-lg bg-secondary border border-border text-foreground font-body focus:outline-none focus:ring-2 focus:ring-ring resize-none"
              placeholder="Descreva o que deseja (tema, quantidade, data do evento...)"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-primary text-primary-foreground rounded-full font-body font-bold hover:opacity-90 transition-opacity shadow-md text-lg"
          >
            💬 Enviar via WhatsApp
          </button>
        </motion.form>
      </div>
    </section>
  );
};

export default BudgetForm;
