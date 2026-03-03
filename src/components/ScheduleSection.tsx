import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";

const ScheduleSection = () => {
  const [form, setForm] = useState({ name: "", date: "", time: "", product: "", notes: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const message = encodeURIComponent(
      `Olá! Gostaria de agendar uma encomenda.\n\nNome: ${form.name}\nData: ${form.date}\nHorário: ${form.time}\nProduto: ${form.product}\nObservações: ${form.notes}`
    );
    window.open(`https://wa.me/5531987903945?text=${message}`, "_blank");
    toast.success("Redirecionando para o WhatsApp!");
  };

  return (
    <section id="agendamento" className="py-20 px-4 bg-secondary">
      <div className="max-w-2xl mx-auto">
        <motion.h2
          className="text-3xl md:text-4xl font-display font-bold text-center mb-4 text-foreground"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          Agendar Encomenda
        </motion.h2>
        <p className="text-center text-muted-foreground mb-10 font-body">
          Escolha a data e garanta seus doces no dia perfeito
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
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-body font-bold text-foreground mb-1">Data</label>
              <input
                type="date"
                required
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="w-full px-4 py-3 rounded-lg bg-secondary border border-border text-foreground font-body focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label className="block text-sm font-body font-bold text-foreground mb-1">Horário de retirada</label>
              <input
                type="time"
                required
                value={form.time}
                onChange={(e) => setForm({ ...form, time: e.target.value })}
                className="w-full px-4 py-3 rounded-lg bg-secondary border border-border text-foreground font-body focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
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
            <label className="block text-sm font-body font-bold text-foreground mb-1">Observações</label>
            <textarea
              maxLength={500}
              rows={3}
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              className="w-full px-4 py-3 rounded-lg bg-secondary border border-border text-foreground font-body focus:outline-none focus:ring-2 focus:ring-ring resize-none"
              placeholder="Tema, sabor, quantidade..."
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-primary text-primary-foreground rounded-full font-body font-bold hover:opacity-90 transition-opacity shadow-md text-lg"
          >
            📅 Agendar via WhatsApp
          </button>
        </motion.form>
      </div>
    </section>
  );
};

export default ScheduleSection;
