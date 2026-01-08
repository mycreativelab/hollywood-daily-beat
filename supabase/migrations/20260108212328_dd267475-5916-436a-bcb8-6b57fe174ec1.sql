-- Create storage bucket for podcast covers
INSERT INTO storage.buckets (id, name, public) 
VALUES ('podcast-covers', 'podcast-covers', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public read access to podcast covers
CREATE POLICY "Public can view podcast covers" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'podcast-covers');