import { Header } from '@/components/Header';
import { HeroBanner } from '@/components/HeroBanner';
import { EpisodeList } from '@/components/EpisodeList';
import { Footer } from '@/components/Footer';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAudio, PlayingEpisode } from '@/contexts/AudioContext';

const Index = () => {
  const { t } = useLanguage();
  const { setPlayingEpisode, setIsPlaying } = useAudio();

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
        podcast_title: data.podcasts?.title,
        published_at: data.published_at
      };
    },
  });

  // Fetch recent episodes with podcast info
  const { data: recentEpisodes, isLoading } = useQuery({
    queryKey: ['recent-episodes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('episodes')
        .select('*, podcasts(title)')
        .order('published_at', { ascending: false })
        .limit(6);
      
      if (error) throw error;
      return data.map(episode => ({
        ...episode,
        podcast_title: episode.podcasts?.title || 'Podcast'
      }));
    },
  });

  const handlePlayEpisode = (episode: PlayingEpisode) => {
    setPlayingEpisode(episode);
    setIsPlaying(true);
  };

  const handlePlayFromHero = () => {
    if (latestEpisode) {
      setPlayingEpisode({
        id: latestEpisode.id,
        title: latestEpisode.title,
        thumbnail: latestEpisode.thumbnail,
        audioUrl: latestEpisode.audio_url,
        podcastTitle: latestEpisode.podcast_title
      });
      setIsPlaying(true);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroBanner latestEpisode={latestEpisode} onPlay={handlePlayFromHero} />
      
      {/* Recent Episodes Section */}
      <section className="py-24 relative">
        {/* Decorative gradient */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
        
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-16">
            <div>
              <span className="text-primary text-sm font-bold uppercase tracking-widest mb-4 block">{t.episodes.allEpisodes}</span>
              <h2 className="text-4xl md:text-5xl font-display font-bold text-foreground">
                {t.episodes.recentEpisodes}
              </h2>
            </div>
          </div>
          
          <EpisodeList 
            episodes={recentEpisodes || []} 
            isLoading={isLoading} 
            onPlay={handlePlayEpisode}
          />
        </div>
      </section>

      {/* About Section with orange accent */}
      <section className="py-24 relative overflow-hidden">
        {/* Orange glow decoration */}
        <div className="absolute -top-1/2 -right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[150px]" />
        
        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center">
            <span className="text-primary text-sm font-bold uppercase tracking-widest mb-4 block">{t.footer.aboutUs}</span>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-8">
              <span className="text-gradient">mycreativelab</span>
            </h2>
            <p className="text-xl md:text-2xl text-muted-foreground mb-12 leading-relaxed">
              {t.footer.description}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <div className="px-6 py-3 bg-primary/10 border border-primary/30 rounded-full">
                <span className="text-primary font-semibold">{t.nav.podcasts}</span>
              </div>
              <div className="px-6 py-3 bg-muted rounded-full border border-border/50">
                <span className="text-foreground font-medium">Film Production</span>
              </div>
              <div className="px-6 py-3 bg-muted rounded-full border border-border/50">
                <span className="text-foreground font-medium">Digital Media</span>
              </div>
              <div className="px-6 py-3 bg-muted rounded-full border border-border/50">
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
