import { MapPin, Phone, Instagram } from "lucide-react";

const ContactFooter = () => {
  return (
    <footer id="contato" className="py-16 px-4 bg-foreground text-primary-foreground">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-2xl md:text-3xl font-display font-bold mb-8">Fale com a gente</h2>

        <div className="grid sm:grid-cols-3 gap-8 mb-10">
          <a
            href="https://wa.me/5531987903945"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <Phone className="w-6 h-6" />
            <span className="font-body text-sm">(31) 98790-3945</span>
          </a>
          <a
            href="https://instagram.com/ladodocegourmet"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <Instagram className="w-6 h-6" />
            <span className="font-body text-sm">@ladodocegourmet</span>
          </a>
          <div className="flex flex-col items-center gap-2">
            <MapPin className="w-6 h-6" />
            <span className="font-body text-sm">Av. Francisco Simões, 259<br />Paraopeba/MG</span>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 pt-6">
          <p className="font-body text-xs text-primary-foreground/60">
            © 2026 Lado Doce Gourmet — Confeitaria Afetiva. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default ContactFooter;
