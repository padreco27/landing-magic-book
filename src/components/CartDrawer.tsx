import { ShoppingBag, X, Plus, Minus, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCart } from "@/contexts/CartContext";

export function CartDrawer() {
  const { items, removeItem, updateQuantity, total } = useCart();

  const handleCheckout = () => {
    if (items.length === 0) return;
    
    let text = "Olá! Gostaria de fazer o seguinte pedido:\n\n";
    items.forEach(item => {
      text += `${item.quantity}x ${item.name} - R$ ${(item.price * item.quantity).toFixed(2)}\n`;
    });
    text += `\n*Total: R$ ${total.toFixed(2)}*`;
    
    const encodedText = encodeURIComponent(text);
    window.open(`https://wa.me/5531996851692?text=${encodedText}`, "_blank");
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="relative shadow-sm rounded-full w-10 h-10 border-pink-200 hover:bg-pink-50 dark:border-pink-900 dark:hover:bg-pink-900/30">
          <ShoppingBag className="w-5 h-5 text-pink-600 dark:text-pink-400" />
          {items.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-pink-600 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center animate-in zoom-in">
              {items.reduce((acc, item) => acc + item.quantity, 0)}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md flex flex-col pt-10">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2 text-pink-600 dark:text-pink-400">
            <ShoppingBag className="w-5 h-5" />
            Minha Sacola
          </SheetTitle>
        </SheetHeader>
        
        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground gap-4">
            <ShoppingBag className="w-16 h-16 opacity-20" />
            <p>Sua sacola está vazia</p>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 -mx-6 px-6 my-4">
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4 items-center bg-pink-50/50 dark:bg-pink-950/20 p-3 rounded-lg border border-pink-100 dark:border-pink-900/50">
                    {item.image_url ? (
                      <img src={item.image_url} alt={item.name} className="w-16 h-16 object-cover rounded-md" />
                    ) : (
                      <div className="w-16 h-16 bg-pink-100 dark:bg-pink-900/50 rounded-md flex items-center justify-center">
                        <ShoppingBag className="w-6 h-6 text-pink-300 dark:text-pink-700" />
                      </div>
                    )}
                    <div className="flex-1">
                      <h4 className="font-medium text-sm line-clamp-1">{item.name}</h4>
                      <p className="text-pink-600 dark:text-pink-400 font-semibold text-sm">R$ {item.price.toFixed(2)}</p>
                      
                      <div className="flex items-center gap-2 mt-2">
                        <Button variant="outline" size="icon" className="w-6 h-6 rounded-full" onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                          <Minus className="w-3 h-3" />
                        </Button>
                        <span className="text-sm font-medium w-4 text-center">{item.quantity}</span>
                        <Button variant="outline" size="icon" className="w-6 h-6 rounded-full" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                          <Plus className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30" onClick={() => removeItem(item.id)}>
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </ScrollArea>
            
            <div className="border-t dark:border-border pt-4 pb-2 space-y-4">
              <div className="flex justify-between items-center text-lg font-bold">
                <span>Total</span>
                <span className="text-pink-600 dark:text-pink-400">R$ {total.toFixed(2)}</span>
              </div>
              <Button className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white flex items-center gap-2 h-12 text-lg font-semibold" onClick={handleCheckout}>
                <Send className="w-5 h-5" />
                Pedir pelo WhatsApp
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
