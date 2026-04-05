import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock } from "lucide-react";
import { toast } from "sonner";
import { ThemeToggle } from "@/components/ThemeToggle";

import { supabase, supabaseEnvStatus } from "@/lib/supabase";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const isAdminUser = async (userId: string) => {
    const { data, error } = await supabase
      .from("admin_profiles")
      .select("id")
      .eq("user_id", userId)
      .maybeSingle();

    if (error) throw error;
    return Boolean(data);
  };

  useEffect(() => {
    if (!supabase) return;

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) navigate("/admin/dashboard");
    });
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!supabase) {
      toast.error(
        `Supabase não está configurado. Verifique as variáveis de ambiente. status: URL=${supabaseEnvStatus.supabaseUrl} publishable=${supabaseEnvStatus.supabasePublishableKey} anon=${supabaseEnvStatus.supabaseAnonKey}`
      );
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw new Error("Credenciais inválidas");

      const userId = data.user?.id ?? data.session?.user?.id;
      if (!userId) throw new Error("Não foi possível iniciar a sessão");

      const adminAllowed = await isAdminUser(userId);
      if (!adminAllowed) {
        await supabase.auth.signOut();
        throw new Error("Acesso negado. Conta não cadastrada como administrador. Execute o SQL no Supabase para adicionar: INSERT INTO public.admin_profiles (user_id, role) SELECT id, 'admin' FROM auth.users WHERE email = 'SEU_EMAIL_AQUI';");
      }

      toast.success("Login realizado com sucesso!");
      navigate("/admin/dashboard");
    } catch (err: any) {
      toast.error(err.message || "Erro ao fazer login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary p-4 relative">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <Card className="w-full max-w-md bg-card shadow-lg">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-12 h-12 bg-pink-100 dark:bg-pink-900/40 rounded-full flex items-center justify-center shadow-sm">
            <Lock className="w-6 h-6 text-pink-600 dark:text-pink-400" />
          </div>
          <CardTitle className="text-2xl font-bold text-foreground">
            Área Administrativa
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-1 font-body">
            Entre com suas credenciais seguras
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seuemail@exemplo.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Sua senha secreta"
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-pink-600 hover:bg-pink-700 text-white font-semibold shadow-md"
              disabled={loading}
            >
              {loading ? "Entrando..." : "Entrar de forma segura"}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full shadow-sm"
              onClick={() => navigate("/")}
            >
              Voltar ao Site Inicial
            </Button>
            <div className="text-center pt-2">
              <p className="text-xs text-muted-foreground">
                Protegido por Supabase Auth
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;
