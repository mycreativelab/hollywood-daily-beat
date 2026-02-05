import { useState } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { PodcastCard } from '@/components/PodcastCard';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/contexts/LanguageContext';

// Import podcast cover images
import hollywoodWeeklyCover from '@/assets/hollywood-weekly-cover.jpg';
import hollywoodDailyCover from '@/assets/hollywood-daily-cover.jpg';
import regulatoryUpdateCover from '@/assets/regulatory-update-cover.jpg';

// Map podcast titles to their cover images
const podcastCoverMap: Record<string, string> = {
  'Hollywood Weekly': hollywoodWeeklyCover,
  'Hollywood Daily': hollywoodDailyCover,
  'Regulatory Update': regulatoryUpdateCover,
};

function PodcastsContent() {
  const [searchQuery, setSearchQuery] = useState('');
  const { t } = useLanguage();

  const { data: podcasts, isLoading } = useQuery({
    queryKey: ['podcasts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('podcasts')
        .select(`
          *,
          episodes(count)
        `);
      
      if (error) throw error;
      return data;
    },
  });

  const filteredPodcasts = podcasts?.filter(podcast =>
    podcast.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    podcast.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    podcast.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 pb-32">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4">
              {t.episodes.allEpisodes}
            </h1>
            <p className="text-muted-foreground max-w-2xl">
              {t.hero.description}
            </p>
          </div>

          {/* Search */}
          <div className="relative max-w-md mb-8">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder={t.episodes.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Podcasts Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="aspect-square rounded-2xl bg-muted animate-pulse" />
              ))}
            </div>
          ) : filteredPodcasts && filteredPodcasts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredPodcasts.map((podcast) => (
                <PodcastCard
                  key={podcast.id}
                  id={podcast.id}
                  title={podcast.title}
                  description={podcast.description}
                  coverImage={podcastCoverMap[podcast.title] || podcast.cover_image}
                  category={podcast.category}
                  episodeCount={(podcast.episodes as any)?.[0]?.count || 0}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">{t.episodes.noPodcastsFound}</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function Podcasts() {
  return (
    <ProtectedRoute>
      <PodcastsContent />
    </ProtectedRoute>
  );
}
