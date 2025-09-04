-- Add name field and make Step 2 fields nullable for partial records
ALTER TABLE public.full_applications 
ADD COLUMN name text;

-- Make Step 2 specific fields nullable so Step 1 can create partial records
ALTER TABLE public.full_applications 
ALTER COLUMN city DROP NOT NULL,
ALTER COLUMN has_business DROP NOT NULL,
ALTER COLUMN category DROP NOT NULL,
ALTER COLUMN investment_range DROP NOT NULL,
ALTER COLUMN motivation DROP NOT NULL,
ALTER COLUMN build_support DROP NOT NULL;