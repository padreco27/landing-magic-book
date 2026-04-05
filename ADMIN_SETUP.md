# Como Adicionar Administradores no Supabase

## Passo 1: Execute o SQL Base
Execute o arquivo `supabase_auth_admin.sql` no **Supabase SQL Editor** (Dashboard > SQL Editor).

**Nota**: O SQL agora remove automaticamente policies existentes, então pode ser executado múltiplas vezes sem erro.

## Passo 2: Adicione Administradores
Para cada usuário que deve ser administrador, execute este comando no SQL Editor:

```sql
INSERT INTO public.admin_profiles (user_id, role)
SELECT id, 'admin'
FROM auth.users
WHERE email = 'EMAIL_DO_ADMIN_AQUI';
```

**Substitua `'EMAIL_DO_ADMIN_AQUI'` pelo email real do usuário.**

## Exemplo:
Se o email do admin for `admin@empresa.com`:

```sql
INSERT INTO public.admin_profiles (user_id, role)
SELECT id, 'admin'
FROM auth.users
WHERE email = 'admin@empresa.com';
```

## Verificação
Após executar, o usuário poderá fazer login em `/admin` com suas credenciais do Supabase Auth.

## Remoção de Administradores
Para remover permissões:

```sql
DELETE FROM public.admin_profiles
WHERE user_id IN (
  SELECT id FROM auth.users WHERE email = 'EMAIL_A_REMOVER'
);
```

## Troubleshooting
- Se receber erro "policy already exists", execute novamente o `supabase_auth_admin.sql` - ele remove as policies antigas automaticamente
- Certifique-se de que o usuário existe no Supabase Auth antes de tentar adicioná-lo como admin