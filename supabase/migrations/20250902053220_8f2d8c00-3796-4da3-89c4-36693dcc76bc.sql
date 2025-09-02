-- Update RLS policies to allow public access for checkout flow

-- Update categories table policy to allow public SELECT
DROP POLICY IF EXISTS "categories_select" ON public.categories;
CREATE POLICY "categories_select" ON public.categories
FOR SELECT USING (true);

-- Update products table policy to allow public SELECT
DROP POLICY IF EXISTS "products_select" ON public.products;
CREATE POLICY "products_select" ON public.products
FOR SELECT USING (true);

-- Update packaging table policy to allow public SELECT
DROP POLICY IF EXISTS "packaging_select" ON public.packaging;
CREATE POLICY "packaging_select" ON public.packaging
FOR SELECT USING (true);