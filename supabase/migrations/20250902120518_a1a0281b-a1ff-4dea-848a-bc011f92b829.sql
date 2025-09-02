-- Add CNIC fields to clients table
ALTER TABLE public.clients 
ADD COLUMN cnic_number text,
ADD COLUMN cnic_front_image text,
ADD COLUMN cnic_back_image text;

-- Create storage bucket for CNIC documents if it doesn't exist
INSERT INTO storage.buckets (id, name, public) 
VALUES ('cnic-documents', 'cnic-documents', false)
ON CONFLICT (id) DO NOTHING;

-- Create RLS policies for CNIC documents storage
CREATE POLICY "Authenticated users can upload CNIC documents" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'cnic-documents' AND auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can view CNIC documents" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'cnic-documents' AND auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update CNIC documents" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'cnic-documents' AND auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete CNIC documents" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'cnic-documents' AND auth.uid() IS NOT NULL);