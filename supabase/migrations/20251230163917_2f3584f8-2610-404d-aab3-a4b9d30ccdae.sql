-- Drop the restrictive policy and create a permissive one
DROP POLICY IF EXISTS "Authenticated users can view episodes" ON public.episodes;

CREATE POLICY "Anyone can view episodes" 
ON public.episodes 
FOR SELECT 
USING (true);