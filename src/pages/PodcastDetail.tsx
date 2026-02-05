import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { EpisodeCard } from '@/components/EpisodeCard';
import { AudioPlayer } from '@/components/AudioPlayer';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PlayingEpisode {
  id: string;
  title: string;
  thumbnail: string | null;
  audioUrl: string | null;
  podcastTitle?: string;
}

function PodcastDetailContent() {
  const { id } = useParams<{ id: string }>();
  const [playingEpisode, setPlayingEpisode] = useState<PlayingEpisode | null>(null);

  // Restore saved playback session on mount
  useEffect(() => {
    const saved = localStorage.getItem('podcast-playback-state');
    if (saved) {
      try {
        const state = JSON.parse(saved);
        setPlayingEpisode({
          id: state.episodeId,
          title: state.episodeTitle,
          thumbnail: state.thumbnail,
          audioUrl: state.audioUrl,
          podcastTitle: state.podcastTitle
        });
      } catch (e) {
        console.error('Failed to restore playback state');
      }
    }
  }, []);

  const { data: podcast, isLoading: podcastLoading } = useQuery({
    queryKey: ['podcast', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('podcasts')
        .select('*')
        .eq('id', id)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
  });

  const { data: episodes, isLoading: episodesLoading } = useQuery({
    queryKey: ['episodes', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('episodes')
        .select('*')
        .eq('podcast_id', id)
        .order('episode_number', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  const handlePlayEpisode = (episode: typeof episodes extends (infer T)[] ? T : never) => {
    setPlayingEpisode({
      id: episode.id,
      title: episode.title,
      thumbnail: episode.thumbnail,
      audioUrl: episode.audio_url,
      podcastTitle: podcast?.title,
    });
  };

  if (podcastLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!podcast) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-24 pb-12">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-2xl font-display font-bold text-foreground mb-4">
              Podcast not found
            </h1>
            <Button asChild>
              <Link to="/podcasts">Back to Podcasts</Link>
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 pb-32">
        <div className="container mx-auto px-4">
          {/* Back Button */}
          <Link 
            to="/podcasts" 
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Podcasts
          </Link>

          {/* Podcast Header */}
          <div className="flex flex-col md:flex-row gap-8 mb-12">
            <div className="w-full md:w-64 lg:w-80 flex-shrink-0">
              <img 
                src={podcast.cover_image || 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=400&h=400&fit=crop'}
                alt={podcast.title}
                className="w-full aspect-square object-cover rounded-2xl shadow-primary"
              />
            </div>
            <div className="flex-1">
              <span className="inline-block px-3 py-1 text-sm font-medium bg-secondary/20 text-secondary rounded-full mb-4 capitalize">
                {podcast.category}
              </span>
              <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4">
                {podcast.title}
              </h1>
              <p className="text-muted-foreground text-lg mb-6">
                {podcast.description || 'No description available'}
              </p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>{episodes?.length || 0} episodes</span>
              </div>
            </div>
          </div>

          {/* Episodes List */}
          <div>
            <h2 className="text-2xl font-display font-bold text-foreground mb-6">
              Episodes
            </h2>
            
            {episodesLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-24 rounded-xl bg-muted animate-pulse" />
                ))}
              </div>
            ) : episodes && episodes.length > 0 ? (
              <div className="space-y-4">
                {episodes.map((episode) => (
                  <EpisodeCard
                    key={episode.id}
                    id={episode.id}
                    title={episode.title}
                    description={episode.description}
                    duration={episode.duration}
                    episodeNumber={episode.episode_number}
                    thumbnail={episode.thumbnail}
                    isPlaying={playingEpisode?.id === episode.id}
                    onPlay={() => handlePlayEpisode(episode)}
                  />
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">
                No episodes available yet.
              </p>
            )}
          </div>
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

export default function PodcastDetail() {
  return (
    <ProtectedRoute>
      <PodcastDetailContent />
    </ProtectedRoute>
  );
}
