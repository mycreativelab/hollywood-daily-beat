import { Header } from '@/components/Header';
import { HeroBanner } from '@/components/HeroBanner';
import { EpisodeList } from '@/components/EpisodeList';
import { Footer } from '@/components/Footer';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const Index = () => {
  // Fetch latest episode for hero banner
  const { data: latestEpisode } = useQuery({
    queryKey: ['latest-episode'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('episodes')
        .select('*, podcasts(title)')
        .order('published_at', { ascending: false })
        .limit(1)
        .single();
      
      if (error) throw error;
      return {
        ...data,
        podcast_title: data.podcasts?.title
      };
    },
  });

  // Fetch recent episodes
  const { data: recentEpisodes, isLoading } = useQuery({
    queryKey: ['recent-episodes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('episodes')
        .select('*')
        .order('published_at', { ascending: false })
        .limit(6);
      
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroBanner latestEpisode={latestEpisode} />
      
      {/* Recent Episodes Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-2">
                Recent Episodes
              </h2>
              <p className="text-muted-foreground">
                Catch up on the latest Hollywood news and updates
              </p>
            </div>
          </div>
          
          <EpisodeList episodes={recentEpisodes || []} isLoading={isLoading} />
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-6">
              About <span className="text-secondary">mycreativelab</span>
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              We create <span className="text-primary font-medium">digital solutions</span> for the film and media industry. 
              From podcasts to production tools, we collaborate on any kind of digital work that brings your creative vision to life.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <div className="px-6 py-3 bg-muted rounded-full">
                <span className="text-foreground font-medium">Podcasts</span>
              </div>
              <div className="px-6 py-3 bg-muted rounded-full">
                <span className="text-foreground font-medium">Film Production</span>
              </div>
              <div className="px-6 py-3 bg-muted rounded-full">
                <span className="text-foreground font-medium">Digital Media</span>
              </div>
              <div className="px-6 py-3 bg-muted rounded-full">
                <span className="text-foreground font-medium">Creative Consulting</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
