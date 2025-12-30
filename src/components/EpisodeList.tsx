import { Play } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

interface Episode {
  id: string;
  title: string;
  description: string | null;
  thumbnail: string | null;
  duration: number | null;
  episode_number: number | null;
  published_at: string | null;
  podcast_id: string;
}

interface EpisodeListProps {
  episodes: Episode[];
  isLoading?: boolean;
}

function formatDuration(seconds: number | null): string {
  if (!seconds) return '00:00';
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export function EpisodeList({ episodes, isLoading }: EpisodeListProps) {
  const { user } = useAuth();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="aspect-[4/3] rounded-2xl bg-muted animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {episodes.map((episode, index) => (
        <Link 
          key={episode.id} 
          to={user ? `/podcasts/${episode.podcast_id}` : '/auth'}
          className="group relative aspect-[4/3] rounded-2xl overflow-hidden bg-card"
        >
          {/* Background Image */}
          <img 
            src={episode.thumbnail || `https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=600&h=450&fit=crop&q=80`} 
            alt={episode.title}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent opacity-80" />
          
          {/* Content */}
          <div className="absolute inset-0 p-6 flex flex-col justify-end">
            <span className="text-primary text-sm font-medium mb-2">
              Episode {String(episode.episode_number || index + 1).padStart(2, '0')}
            </span>
            <h3 className="text-foreground font-display font-semibold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
              {episode.title}
            </h3>
            <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
              {episode.description || 'Listen to this exciting episode...'}
            </p>
            
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-sm">
                {formatDuration(episode.duration)}
              </span>
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                <Play className="w-4 h-4 text-primary-foreground ml-0.5" />
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
