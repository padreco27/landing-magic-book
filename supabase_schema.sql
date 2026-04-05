-- Tabela de Produtos
create table public.products (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text,
  price numeric not null,
  quantity integer default 0 not null,
  category text default 'Geral'::text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Tabela de Administradores
create table public.admin_users (
  id uuid default gen_random_uuid() primary key,
  username text unique not null,
  password text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Inserir o administrador padrão (senha recomendada a ser mudada depois)
insert into public.admin_users (username, password)
values ('admin', 'admin123')
on conflict do nothing;

-- Segurança: Habilitar o RLS (Row Level Security) e permitir acesso anônimo inicial
-- OBS: Em um ambiente de produção seria ideal proteger essas tabelas com Políticas (Policies)
-- exigindo autenticação do lado do Supabase, mas aqui vamos manter simples para a migração inicial.

alter table public.products enable row level security;
alter table public.admin_users enable row level security;

-- Política simples: permitir que qualquer pessoa veja e manipule dados (para fins de desenvolvimento local)
-- Ajuste essas políticas depois para liberar acesso apenas ao dashboard admin
create policy "Allow all actions on products" on public.products for all using (true) with check (true);
create policy "Allow all actions on admin_users" on public.admin_users for all using (true) with check (true);
