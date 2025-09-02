-- Enable real-time updates for categories table
ALTER TABLE public.categories REPLICA IDENTITY FULL;

-- Add categories table to the realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.categories;