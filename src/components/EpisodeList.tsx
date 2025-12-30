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

// Unsplash images for episodes
const episodeImages = [
  'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=600&h=450&fit=crop&q=80', // Film production
  'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=600&h=450&fit=crop&q=80', // Cinema
  'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600&h=450&fit=crop&q=80', // Movie theater
  'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=600&h=450&fit=crop&q=80', // Film strip
  'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=600&h=450&fit=crop&q=80', // Director chair
  'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=600&h=450&fit=crop&q=80', // Film camera
];

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
          className="group relative aspect-[4/3] rounded-2xl overflow-hidden bg-card shadow-card hover:shadow-glow transition-all duration-500"
        >
          {/* Background Image */}
          <img 
            src={episode.thumbnail || episodeImages[index % episodeImages.length]} 
            alt={episode.title}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 episode-overlay" />
          
          {/* Orange accent line at top */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-orange opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Play Button - centered */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 bg-primary/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-75 group-hover:scale-100 shadow-glow">
              <Play className="w-7 h-7 text-primary-foreground ml-1" />
            </div>
          </div>
          
          {/* Content */}
          <div className="absolute inset-0 p-6 flex flex-col justify-end">
            {/* Episode Number Badge */}
            <span className="inline-flex self-start px-3 py-1 rounded-full bg-primary/20 border border-primary/40 text-primary text-xs font-bold uppercase tracking-wide mb-3">
              Episode {String(episode.episode_number || index + 1).padStart(2, '0')}
            </span>
            
            {/* Title */}
            <h3 className="text-foreground font-display font-bold text-xl mb-2 line-clamp-2 group-hover:text-primary transition-colors duration-300">
              {episode.title}
            </h3>
            
            {/* Description */}
            <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
              {episode.description || 'Listen to this exciting episode...'}
            </p>
            
            {/* Duration */}
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-sm flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                {formatDuration(episode.duration)}
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
