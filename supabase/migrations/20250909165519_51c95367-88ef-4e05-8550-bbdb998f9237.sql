-- Fix the problematic column name with space in front_leads table
ALTER TABLE public.front_leads 
RENAME COLUMN "product _category" TO "product_category";