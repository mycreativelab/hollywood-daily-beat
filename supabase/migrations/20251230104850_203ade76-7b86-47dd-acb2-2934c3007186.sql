-- Create podcasts table
CREATE TABLE public.podcasts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  cover_image TEXT,
  category TEXT NOT NULL DEFAULT 'hollywood',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create episodes table
CREATE TABLE public.episodes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  podcast_id UUID REFERENCES public.podcasts(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  audio_url TEXT,
  duration INTEGER DEFAULT 0,
  episode_number INTEGER,
  thumbnail TEXT,
  published_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  display_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.podcasts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.episodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Podcasts policies: anyone authenticated can read
CREATE POLICY "Authenticated users can view podcasts"
ON public.podcasts
FOR SELECT
TO authenticated
USING (true);

-- Episodes policies: anyone authenticated can read
CREATE POLICY "Authenticated users can view episodes"
ON public.episodes
FOR SELECT
TO authenticated
USING (true);

-- Profiles policies
CREATE POLICY "Users can view all profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Users can insert their own profile"
ON public.profiles
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
ON public.profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_podcasts_updated_at
  BEFORE UPDATE ON public.podcasts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_episodes_updated_at
  BEFORE UPDATE ON public.episodes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (new.id, new.raw_user_meta_data ->> 'display_name');
  RETURN new;
END;
$$;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert sample podcasts
INSERT INTO public.podcasts (title, description, cover_image, category) VALUES
('Hollywood Daily', 'Your daily dose of Hollywood film news, reviews, and industry insights.', 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&h=400&fit=crop', 'hollywood'),
('Film Industry Insider', 'Behind the scenes of the biggest blockbusters and independent gems.', 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&h=400&fit=crop', 'hollywood'),
('Cinema Talk', 'Deep conversations with filmmakers, actors, and industry professionals.', 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=400&h=400&fit=crop', 'hollywood');

-- Insert sample episodes
INSERT INTO public.episodes (podcast_id, title, description, duration, episode_number, thumbnail) 
SELECT 
  p.id,
  'Episode ' || e.num || ': ' || 
  CASE e.num 
    WHEN 1 THEN 'Breaking Box Office Records'
    WHEN 2 THEN 'Oscar Predictions 2025'
    WHEN 3 THEN 'The Rise of Streaming'
    WHEN 4 THEN 'Director Spotlight'
    WHEN 5 THEN 'Summer Blockbusters Preview'
  END,
  'In this episode we discuss the latest trends and news from Hollywood.',
  (30 + (e.num * 5)) * 60,
  e.num,
  'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=300&h=300&fit=crop'
FROM public.podcasts p, generate_series(1, 5) as e(num)
WHERE p.title = 'Hollywood Daily';