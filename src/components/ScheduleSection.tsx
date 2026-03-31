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

  const handleCreateStoreCalendarEvent = async () => {
    if (!form.name || !form.date || !form.time || !form.product) {
      toast.error("Preencha nome, data, horário e produto.");
      return;
    }
    try {
      const res = await fetch("/api/calendar/event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || "Erro ao criar evento");
      }
      const data = await res.json();
      toast.success("Evento criado no calendário da loja");
      if (data?.htmlLink) {
        window.location.href = data.htmlLink;
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Falha ao criar evento";
      toast.error(message);
    }
  };

  const handleAddToGoogleCalendar = () => {
    if (!form.name || !form.date || !form.time || !form.product) {
      toast.error("Preencha nome, data, horário e produto.");
      return;
    }
    const [year, month, day] = form.date.split("-").map((v) => parseInt(v, 10));
    const [hour, minute] = form.time.split(":").map((v) => parseInt(v, 10));
    if (!year || !month || !day || hour === undefined || minute === undefined) {
      toast.error("Data ou horário inválidos.");
      return;
    }
    const start = new Date(year, month - 1, day, hour, minute, 0);
    const end = new Date(start.getTime() + 60 * 60 * 1000);
    const pad = (n: number) => String(n).padStart(2, "0");
    const fmt = (d: Date) =>
      `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T${pad(d.getHours())}${pad(d.getMinutes())}00`;
    const dates = `${fmt(start)}/${fmt(end)}`;
    const title = encodeURIComponent(`Encomenda: ${form.product}`);
    const details = encodeURIComponent(
      `Nome: ${form.name}\nProduto: ${form.product}\nObservações: ${form.notes || "-"}\nAgendado via site`
    );
    const ctz = encodeURIComponent("America/Sao_Paulo");
    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&dates=${dates}&ctz=${ctz}`;
    window.location.href = url;
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
          <div className="grid gap-3 sm:grid-cols-2">
            <button
              type="submit"
              className="w-full py-3 bg-primary text-primary-foreground rounded-full font-body font-bold hover:opacity-90 transition-opacity shadow-md text-lg"
            >
              📱 Agendar via WhatsApp
            </button>
            <button
              type="button"
              onClick={handleAddToGoogleCalendar}
              className="w-full py-3 bg-emerald-600 text-white rounded-full font-body font-bold hover:opacity-90 transition-opacity shadow-md text-lg"
            >
              🗓️ Adicionar ao Google Calendar
            </button>
            <button
              type="button"
              onClick={handleCreateStoreCalendarEvent}
              className="w-full py-3 bg-amber-600 text-white rounded-full font-body font-bold hover:opacity-90 transition-opacity shadow-md text-lg sm:col-span-2"
            >
              🏪 Criar evento no calendário da loja
            </button>
          </div>
        </motion.form>
      </div>
    </section>
  );
};

export default ScheduleSection;
