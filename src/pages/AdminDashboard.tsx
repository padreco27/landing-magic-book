import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { supabase, supabaseEnvStatus } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Pencil, Trash2, LogOut, Package, TrendingUp, AlertTriangle, Box } from "lucide-react";
import { toast } from "sonner";
import { ThemeToggle } from "@/components/ThemeToggle";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  category: string;
  image_url?: string;
  createdAt: string;
  updatedAt: string;
}

const emptyForm = { name: "", description: "", price: "", quantity: "", category: "" };

const AdminDashboard = () => {
  const navigate = useNavigate();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const isAdminUser = async (userId: string) => {
    const { data, error } = await supabase
      .from("admin_profiles")
      .select("id")
      .eq("user_id", userId)
      .maybeSingle();

    if (error) throw error;
    return Boolean(data);
  };

  const fetchProducts = async () => {
    if (!supabase) {
      setProducts([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.from("products").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      
      const mapped = (data || []).map(p => ({
        ...p,
        createdAt: p.created_at,
        updatedAt: p.updated_at
      }));
      setProducts(mapped as Product[]);
    } catch {
      toast.error("Erro ao carregar produtos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!supabase) {
      toast.error(
        `Supabase não está configurado. ${supabaseEnvStatus.usingFallback ? 'Usando configuração hardcoded temporária.' : 'Verifique as variáveis de ambiente.'} status: URL=${supabaseEnvStatus.supabaseUrl} publishable=${supabaseEnvStatus.supabasePublishableKey} anon=${supabaseEnvStatus.supabaseAnonKey}`
      );
      setLoading(false);
      navigate("/admin");
      return;
    }

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) {
        navigate("/admin");
        return;
      }

      try {
        const adminAllowed = await isAdminUser(session.user.id);
        if (!adminAllowed) {
          await supabase.auth.signOut();
          toast.error("Acesso negado. Conta sem permissão administrativa. Execute o SQL no Supabase para adicionar: INSERT INTO public.admin_profiles (user_id, role) SELECT id, 'admin' FROM auth.users WHERE email = 'SEU_EMAIL_AQUI';");
          navigate("/admin");
          return;
        }

        fetchProducts();
      } catch (err: any) {
        console.error(err);
        toast.error("Erro ao validar permissão administrativa");
        navigate("/admin");
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        navigate("/admin");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const openNew = () => {
    setEditing(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const openEdit = (p: Product) => {
    setEditing(p);
    setForm({
      name: p.name,
      description: p.description,
      price: String(p.price),
      quantity: String(p.quantity),
      category: p.category,
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.price) {
      toast.error("Nome e preço são obrigatórios");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        name: form.name,
        description: form.description,
        price: Number(form.price),
        quantity: Number(form.quantity) || 0,
        category: form.category || "Geral",
        updated_at: new Date().toISOString()
      };

      if (editing) {
        const { error } = await supabase.from("products").update(payload).eq("id", editing.id);
        if (error) throw error;
        toast.success("Produto atualizado!");
      } else {
        const { error } = await supabase.from("products").insert([payload]);
        if (error) throw error;
        toast.success("Produto adicionado!");
      }
      
      setDialogOpen(false);
      fetchProducts();
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Erro ao salvar produto");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const { error } = await supabase.from("products").delete().eq("id", deleteId);
      if (error) throw error;
      toast.success("Produto removido!");
      fetchProducts();
    } catch {
      toast.error("Erro ao remover produto");
    } finally {
      setDeleteId(null);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin");
  };

  const stats = useMemo(() => {
    return {
      total: products.length,
      lowStock: products.filter(p => p.quantity <= 5).length,
      stockValue: products.reduce((acc, p) => acc + (p.price * p.quantity), 0)
    };
  }, [products]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary">
        <p className="text-muted-foreground animate-pulse">Autenticando sessão segura...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary">
      <header className="bg-card shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Package className="w-6 h-6 text-pink-600 dark:text-pink-400" />
            <h1 className="text-xl font-bold text-foreground">Painel Administrativo</h1>
          </div>
          
          <div className="flex items-center gap-3">
            <ThemeToggle />
            
            <Button variant="outline" size="sm" onClick={() => navigate("/")} className="hidden sm:flex border-border">
              Site Público
            </Button>
            
            <Button variant="outline" size="sm" onClick={handleLogout} className="border-pink-200 text-pink-700 hover:bg-pink-50 dark:border-pink-900 dark:text-pink-300 dark:hover:bg-pink-900/30">
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* STATS SECTION */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-card shadow-md">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 rounded-lg flex items-center justify-center">
                <Box className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground font-medium">Total de Produtos</p>
                <h3 className="text-2xl font-bold text-foreground">{stats.total}</h3>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-card shadow-md">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground font-medium">Estoque Baixo (≤ 5)</p>
                <h3 className="text-2xl font-bold text-foreground">{stats.lowStock}</h3>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card shadow-md">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground font-medium">Valor em Estoque</p>
                <h3 className="text-2xl font-bold text-foreground">R$ {stats.stockValue.toFixed(2)}</h3>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* PRODUCTS SECTION */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground">Controle de Estoque</h2>
              <p className="text-muted-foreground">
                Gerencie seus doces, menus e orçamentos
              </p>
            </div>
            <Button onClick={openNew} className="bg-pink-600 hover:bg-pink-700 text-white shadow-sm">
              <Plus className="w-4 h-4 mr-2" />
              Novo Produto
            </Button>
          </div>
          
          <Card className="shadow-md">
            <CardContent className="p-0 border-none">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead>Preço</TableHead>
                    <TableHead>Quantidade</TableHead>
                    <TableHead className="w-24">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                        Nenhum produto cadastrado
                      </TableCell>
                    </TableRow>
                  ) : (
                    products.map((p) => (
                      <TableRow key={p.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="hidden sm:flex w-10 h-10 bg-pink-100 dark:bg-pink-900/30 items-center justify-center rounded-md">
                              <Package className="w-5 h-5 text-pink-400 dark:text-pink-600" />
                            </div>
                            <div>
                              <p className="font-medium text-foreground">{p.name}</p>
                              {p.description && (
                                <p className="text-xs text-muted-foreground line-clamp-1 max-w-[200px]">{p.description}</p>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{p.category}</TableCell>
                        <TableCell>R$ {p.price.toFixed(2)}</TableCell>
                        <TableCell>
                          <span className={p.quantity <= 5 ? "text-orange-500 font-semibold dark:text-orange-400" : ""}>
                            {p.quantity}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="icon" onClick={() => openEdit(p)} className="text-muted-foreground hover:text-foreground">
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => setDeleteId(p.id)} className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Dialogs */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editing ? "Editar Produto" : "Novo Produto"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Nome *</Label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Nome do produto"
              />
            </div>
            <div className="space-y-2">
              <Label>Descrição</Label>
              <Textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Detalhes para agradar o cliente"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Preço (R$) *</Label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  placeholder="0.00"
                />
              </div>
              <div className="space-y-2">
                <Label>Quantidade (Estoque)</Label>
                <Input
                  type="number"
                  min="0"
                  value={form.quantity}
                  onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                  placeholder="0"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Categoria</Label>
              <Input
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                placeholder="Ex: Bolos, Doces, Salgados"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={saving} className="bg-pink-600 hover:bg-pink-700 text-white">
              {saving ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja remover este produto? Esta ação não pode ser desfeita e ele será removido do site.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700 text-white">
              Remover
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminDashboard;
