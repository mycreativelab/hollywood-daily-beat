import { useState } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { PodcastCard } from '@/components/PodcastCard';
import { AudioPlayer } from '@/components/AudioPlayer';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface PlayingEpisode {
  id: string;
  title: string;
  thumbnail: string | null;
  audioUrl: string | null;
  podcastTitle?: string;
}

function PodcastsContent() {
  const [searchQuery, setSearchQuery] = useState('');
  const [playingEpisode, setPlayingEpisode] = useState<PlayingEpisode | null>(null);

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
              All Podcasts
            </h1>
            <p className="text-muted-foreground max-w-2xl">
              Explore our collection of podcasts covering Hollywood news, film reviews, and creative content.
            </p>
          </div>

          {/* Search */}
          <div className="relative max-w-md mb-8">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search podcasts..."
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
                  coverImage={podcast.cover_image}
                  category={podcast.category}
                  episodeCount={(podcast.episodes as any)?.[0]?.count || 0}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No podcasts found matching your search.</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
      
      <AudioPlayer 
        episode={playingEpisode} 
        onClose={() => setPlayingEpisode(null)} 
      />
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
