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

// Unsplash images for episodes (square format)
const episodeImages = [
  'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=600&h=600&fit=crop&q=80', // Podcast microphone
  'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=600&h=600&fit=crop&q=80', // Recording studio
  'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=600&h=600&fit=crop&q=80', // Film production
  'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=600&h=600&fit=crop&q=80', // Cinema
  'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600&h=600&fit=crop&q=80', // Movie theater
  'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=600&h=600&fit=crop&q=80', // Film strip
];

function formatDuration(seconds: number | null): string {
  if (!seconds) return '0 min';
  const hours = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  if (hours > 0) {
    return `${hours}h ${mins}m`;
  }
  return `${mins} min`;
}

export function EpisodeList({ episodes, isLoading }: EpisodeListProps) {
  const { user } = useAuth();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="aspect-[4/3] rounded-2xl bg-card animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {episodes.map((episode, index) => (
        <Link 
          key={episode.id} 
          to={user ? `/podcasts/${episode.podcast_id}` : '/auth'}
          className="group block"
        >
          {/* Square Image Container */}
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-card shadow-card hover:shadow-glow transition-all duration-500">
            <img 
              src={episode.thumbnail || episodeImages[index % episodeImages.length]} 
              alt={episode.title}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            
            {/* Subtle gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
            
            {/* Play Button - Always visible */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center shadow-glow transition-transform duration-300 group-hover:scale-110">
                <Play className="w-7 h-7 text-primary-foreground ml-1" />
              </div>
            </div>
            
            {/* Duration badge */}
            <div className="absolute bottom-4 right-4 px-3 py-1 rounded-full bg-background/80 backdrop-blur-sm text-foreground text-sm font-medium">
              {formatDuration(episode.duration)}
            </div>
          </div>
          
          {/* Title below image */}
          <h3 className="text-foreground font-display font-semibold text-lg mt-4 line-clamp-2 group-hover:text-primary transition-colors duration-300">
            {episode.title}
          </h3>
        </Link>
      ))}
    </div>
  );
}
