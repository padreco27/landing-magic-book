import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
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
import { Plus, Pencil, Trash2, LogOut, Package, Users } from "lucide-react";
import { toast } from "sonner";

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

interface AdminUser {
  id: string;
  username: string;
  createdAt: string;
}

const emptyForm = { name: "", description: "", price: "", quantity: "", category: "" };

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"products" | "users">("products");

  // Products state
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  // Users state
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [userDialogOpen, setUserDialogOpen] = useState(false);
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null);
  const [userForm, setUserForm] = useState({ username: "", password: "" });
  const [userSaving, setUserSaving] = useState(false);

  const fetchProducts = async () => {
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
      if (activeTab === "products") setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase.from("admin_users").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      
      const mapped = (data || []).map(u => ({
        ...u,
        createdAt: u.created_at
      }));
      setUsers(mapped as AdminUser[]);
    } catch {
      toast.error("Erro ao carregar usuários");
    } finally {
      if (activeTab === "users") setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) {
      navigate("/admin");
      return;
    }
    setLoading(true);
    if (activeTab === "products") {
      fetchProducts();
    } else {
      fetchUsers();
    }
  }, [activeTab]);

  // Product Methods
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

  // User Methods
  const openNewUser = () => {
    setUserForm({ username: "", password: "" });
    setUserDialogOpen(true);
  };

  const handleUserSave = async () => {
    if (!userForm.username || !userForm.password) {
      toast.error("Usuário e senha são obrigatórios");
      return;
    }
    setUserSaving(true);
    try {
      const { error } = await supabase.from("admin_users").insert([{
        username: userForm.username,
        password: userForm.password
      }]);
      if (error) {
        if (error.code === "23505") throw new Error("Usuário já existe");
        throw error;
      }
      toast.success("Administrador adicionado!");
      setUserDialogOpen(false);
      fetchUsers();
    } catch (e: any) {
      toast.error(e.message || "Erro ao adicionar administrador");
    } finally {
      setUserSaving(false);
    }
  };

  const handleUserDelete = async () => {
    if (!deleteUserId) return;
    if (users.length <= 1) {
      toast.error("Não é possível excluir o único administrador do sistema.");
      setDeleteUserId(null);
      return;
    }
    try {
      const { error } = await supabase.from("admin_users").delete().eq("id", deleteUserId);
      if (error) throw error;
      toast.success("Administrador removido!");
      fetchUsers();
    } catch (e: any) {
      toast.error(e.message || "Erro ao remover administrador");
    } finally {
      setDeleteUserId(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    navigate("/admin");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-pink-100">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Package className="w-6 h-6 text-pink-600" />
            <h1 className="text-xl font-bold text-pink-800">Painel Administrativo</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex divide-x bg-pink-100/50 rounded-md overflow-hidden border border-pink-200">
              <button 
                className={`px-4 py-2 text-sm font-medium transition-colors ${activeTab === 'products' ? 'bg-pink-600 text-white' : 'text-pink-800 hover:bg-pink-200'}`}
                onClick={() => setActiveTab('products')}
              >
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4" />
                  Produtos
                </div>
              </button>
              <button 
                className={`px-4 py-2 text-sm font-medium transition-colors ${activeTab === 'users' ? 'bg-pink-600 text-white' : 'text-pink-800 hover:bg-pink-200'}`}
                onClick={() => setActiveTab('users')}
              >
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Administradores
                </div>
              </button>
            </div>

            <Button variant="outline" size="sm" onClick={() => navigate("/")} className="hidden sm:flex">
              Voltar ao Site
            </Button>
            
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === "products" ? (
          <>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Controle de Estoque</h2>
                <p className="text-muted-foreground">
                  {products.length} produto{products.length !== 1 ? "s" : ""} cadastrado{products.length !== 1 ? "s" : ""}
                </p>
              </div>
              <Button onClick={openNew} className="bg-pink-600 hover:bg-pink-700">
                <Plus className="w-4 h-4 mr-2" />
                Novo Produto
              </Button>
            </div>
            
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
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
                              {p.image_url ? (
                                <img src={p.image_url} alt={p.name} className="w-10 h-10 object-cover rounded-md" />
                              ) : (
                                <div className="w-10 h-10 bg-pink-100 flex items-center justify-center rounded-md">
                                  <Package className="w-5 h-5 text-pink-400" />
                                </div>
                              )}
                              <div>
                                <p className="font-medium">{p.name}</p>
                                {p.description && (
                                  <p className="text-xs text-muted-foreground line-clamp-1">{p.description}</p>
                                )}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{p.category}</TableCell>
                          <TableCell>R$ {p.price.toFixed(2)}</TableCell>
                          <TableCell>
                            <span className={p.quantity <= 5 ? "text-red-600 font-semibold" : ""}>
                              {p.quantity}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              <Button variant="ghost" size="icon" onClick={() => openEdit(p)}>
                                <Pencil className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => setDeleteId(p.id)}>
                                <Trash2 className="w-4 h-4 text-red-500" />
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
          </>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Administradores do Sistema</h2>
                <p className="text-muted-foreground">
                  {users.length} administrador{users.length !== 1 ? "es" : ""} cadastrado{users.length !== 1 ? "s" : ""}
                </p>
              </div>
              <Button onClick={openNewUser} className="bg-pink-600 hover:bg-pink-700">
                <Plus className="w-4 h-4 mr-2" />
                Novo Administrador
              </Button>
            </div>
            
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Usuário</TableHead>
                      <TableHead>Data de Criação</TableHead>
                      <TableHead className="w-24">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center text-muted-foreground py-8">
                          Nenhum administrador encontrado
                        </TableCell>
                      </TableRow>
                    ) : (
                      users.map((u) => (
                        <TableRow key={u.id}>
                          <TableCell>
                            <p className="font-medium">{u.username}</p>
                          </TableCell>
                          <TableCell>{new Date(u.createdAt).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              <Button variant="ghost" size="icon" onClick={() => setDeleteUserId(u.id)}>
                                <Trash2 className="w-4 h-4 text-red-500" />
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
          </>
        )}
      </main>

      {/* Product Dialogs */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
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
                placeholder="Descrição do produto"
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
                <Label>Quantidade</Label>
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
            <Button onClick={handleSave} disabled={saving} className="bg-pink-600 hover:bg-pink-700">
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
              Tem certeza que deseja remover este produto? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Remover
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* User Dialogs */}
      <Dialog open={userDialogOpen} onOpenChange={setUserDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Novo Administrador</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Usuário *</Label>
              <Input
                value={userForm.username}
                onChange={(e) => setUserForm({ ...userForm, username: e.target.value })}
                placeholder="Ex: admin"
              />
            </div>
            <div className="space-y-2">
              <Label>Senha *</Label>
              <Input
                type="password"
                value={userForm.password}
                onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                placeholder="Digite a senha"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setUserDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleUserSave} disabled={userSaving} className="bg-pink-600 hover:bg-pink-700">
              {userSaving ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteUserId} onOpenChange={() => setDeleteUserId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remover administrador</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja remover este administrador do sistema? Esta pessoa perderá acesso ao painel.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleUserDelete} className="bg-red-600 hover:bg-red-700">
              Remover
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  );
};

export default AdminDashboard;
