-- Cria a tabela de perfis de administrador vinculada ao Supabase Auth
create table if not exists public.admin_profiles (
  id uuid default gen_random_uuid() primary key,
  user_id uuid not null unique references auth.users(id),
  role text not null default 'admin',
  created_at timestamp with time zone default timezone('utc', now()) not null
);

-- (IMPORTANTE) Execute este comando MANUALMENTE no Supabase SQL Editor para adicionar administradores:
-- INSERT INTO public.admin_profiles (user_id, role)
-- SELECT id, 'admin' FROM auth.users WHERE email = 'SEU_EMAIL_AQUI';
-- Substitua 'SEU_EMAIL_AQUI' pelo email do usuário que deve ser administrador

-- Habilita Row Level Security em produtos para obrigar autenticação/role de administrador
alter table public.products enable row level security;

-- Remove policies existentes se houver
drop policy if exists "Admins can manage products" on public.products;
drop policy if exists "Allow all actions on products" on public.products;

create policy "Admins can manage products" on public.products
  for all
  using (
    exists (
      select 1 from public.admin_profiles
      where user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.admin_profiles
      where user_id = auth.uid()
    )
  );

-- Habilita RLS em admin_profiles para permitir somente acesso próprio
alter table public.admin_profiles enable row level security;

-- Remove policies existentes se houver
drop policy if exists "Admins can read own profile" on public.admin_profiles;
drop policy if exists "Admins can manage own profile" on public.admin_profiles;
drop policy if exists "Admins can delete own profile" on public.admin_profiles;
drop policy if exists "Allow all actions on admin_users" on public.admin_users;

create policy "Admins can read own profile" on public.admin_profiles
  for select
  using (auth.uid() = user_id);

create policy "Admins can manage own profile" on public.admin_profiles
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Admins can delete own profile" on public.admin_profiles
  for delete
  using (auth.uid() = user_id);
