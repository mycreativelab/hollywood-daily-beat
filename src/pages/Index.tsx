import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { Footer } from '@/components/Footer';
import { PodcastCard } from '@/components/PodcastCard';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Headphones, Star, TrendingUp } from 'lucide-react';

const Index = () => {
  const { data: podcasts, isLoading } = useQuery({
    queryKey: ['featured-podcasts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('podcasts')
        .select('*')
        .limit(3);
      
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
      
      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
              Why Choose <span className="text-gradient">mycreativelab</span>?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Get exclusive access to the best Hollywood content, curated just for you.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-card border border-border/50 text-center hover:border-primary/30 transition-colors hover:shadow-primary">
              <div className="w-14 h-14 mx-auto mb-4 bg-gradient-hero rounded-2xl flex items-center justify-center">
                <Headphones className="w-7 h-7 text-primary-foreground" />
              </div>
              <h3 className="font-display font-semibold text-foreground mb-2">Daily Episodes</h3>
              <p className="text-muted-foreground text-sm">
                Fresh content every day covering the latest Hollywood news and updates.
              </p>
            </div>
            
            <div className="p-6 rounded-2xl bg-card border border-border/50 text-center hover:border-primary/30 transition-colors hover:shadow-primary">
              <div className="w-14 h-14 mx-auto mb-4 bg-gradient-accent rounded-2xl flex items-center justify-center">
                <Star className="w-7 h-7 text-accent-foreground" />
              </div>
              <h3 className="font-display font-semibold text-foreground mb-2">Exclusive Interviews</h3>
              <p className="text-muted-foreground text-sm">
                Hear from industry insiders, filmmakers, and celebrities.
              </p>
            </div>
            
            <div className="p-6 rounded-2xl bg-card border border-border/50 text-center hover:border-primary/30 transition-colors hover:shadow-primary">
              <div className="w-14 h-14 mx-auto mb-4 bg-secondary rounded-2xl flex items-center justify-center">
                <TrendingUp className="w-7 h-7 text-secondary-foreground" />
              </div>
              <h3 className="font-display font-semibold text-foreground mb-2">Trending Topics</h3>
              <p className="text-muted-foreground text-sm">
                Stay ahead with breaking news and viral movie discussions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Podcasts Preview */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
              Featured Podcasts
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Sign in to unlock all episodes and start listening.
            </p>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="aspect-square rounded-2xl bg-muted animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {podcasts?.map((podcast) => (
                <PodcastCard
                  key={podcast.id}
                  id={podcast.id}
                  title={podcast.title}
                  description={podcast.description}
                  coverImage={podcast.cover_image}
                  category={podcast.category}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
