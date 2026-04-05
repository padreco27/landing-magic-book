-- Adiciona a coluna de imagem à tabela de produtos existente
ALTER TABLE public.products
ADD COLUMN image_url text;

-- (Atenção) Não se esqueça de criar o Storage Bucket no Supabase com o nome "product-images"
-- e marcar ele como *Public*.
