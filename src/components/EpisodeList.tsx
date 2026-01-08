import { Play, Clock, Calendar } from 'lucide-react';
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
  podcast_title?: string;
  audio_url?: string | null;
}

interface EpisodeListProps {
  episodes: Episode[];
  isLoading?: boolean;
  maxSlots?: number;
  onPlay?: (episode: { id: string; title: string; thumbnail: string | null; audioUrl: string | null; podcastTitle?: string }) => void;
}

function formatDuration(seconds: number | null): string {
  if (!seconds) return '0 min';
  const hours = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  if (hours > 0) {
    return `${hours}h ${mins}m`;
  }
  return `${mins} min`;
}

function extractEpisodeNumber(title: string): string {
  const match = title.match(/Episode\s*(\d+)/i);
  return match ? match[1].padStart(2, '0') : '01';
}

function extractDate(title: string): string | null {
  const match = title.match(/(\d{2})\.(\d{2})\.(\d{2,4})/);
  return match ? match[0] : null;
}

interface EpisodeCardProps {
  episode: Episode;
  onPlay?: (episode: { id: string; title: string; thumbnail: string | null; audioUrl: string | null; podcastTitle?: string }) => void;
}

function EpisodeCard({ episode, onPlay }: EpisodeCardProps) {
  const { user } = useAuth();
  
  const handlePlay = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      window.location.href = '/auth';
      return;
    }
    if (onPlay) {
      onPlay({
        id: episode.id,
        title: episode.title,
        thumbnail: episode.thumbnail,
        audioUrl: episode.audio_url || null,
        podcastTitle: episode.podcast_title
      });
    }
  };
  
  return (
    <Link 
      to={user ? `/podcasts/${episode.podcast_id}` : '/auth'}
      className="group block"
    >
      {/* Card with blurred gradient background and text */}
      <div className="relative aspect-square rounded-lg overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
        {/* Blurred gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-background to-primary/20 backdrop-blur-sm" />
        <div className="absolute inset-0 bg-background/40" />
        
        {/* Podcast name and episode title as centered text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center p-3 text-center">
          {/* Podcast Name - larger */}
          <span className="text-primary font-display font-bold text-xs uppercase tracking-wider mb-1 line-clamp-1">
            {episode.podcast_title || 'Podcast'}
          </span>
          
          {/* Episode Number - separate */}
          <h3 className="text-foreground font-display font-medium text-[11px] leading-tight line-clamp-1 mb-2">
            Episode {extractEpisodeNumber(episode.title)}
          </h3>
          
          {/* Play Button */}
          <button 
            onClick={handlePlay}
            className="w-8 h-8 bg-primary rounded-full flex items-center justify-center shadow-md transition-transform duration-300 group-hover:scale-110"
          >
            <Play className="w-3.5 h-3.5 text-primary-foreground ml-0.5" />
          </button>
        </div>
        
        {/* Date badge - bottom left */}
        {extractDate(episode.title) && (
          <div className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 rounded bg-background/80 backdrop-blur-sm flex items-center gap-1">
            <Calendar className="w-2.5 h-2.5 text-muted-foreground" />
            <span className="text-muted-foreground text-[10px] font-medium">{extractDate(episode.title)}</span>
          </div>
        )}
        
        {/* Duration badge - bottom right */}
        <div className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 rounded bg-background/80 backdrop-blur-sm flex items-center gap-1">
          <Clock className="w-2.5 h-2.5 text-muted-foreground" />
          <span className="text-muted-foreground text-[10px] font-medium">{formatDuration(episode.duration)}</span>
        </div>
      </div>
    </Link>
  );
}

function PlaceholderCard() {
  return (
    <div className="block">
      {/* Placeholder card with dashed border */}
      <div className="relative aspect-square rounded-lg overflow-hidden border-2 border-dashed border-muted-foreground/30">
        {/* Blurred gray background */}
        <div className="absolute inset-0 bg-gradient-to-br from-muted/50 via-background to-muted/30 backdrop-blur-sm" />
        
        {/* Placeholder text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center p-3 text-center">
          <span className="text-muted-foreground font-display text-xs leading-tight">
            More episodes<br />are upcoming
          </span>
        </div>
      </div>
    </div>
  );
}

export function EpisodeList({ episodes, isLoading, maxSlots = 6, onPlay }: EpisodeListProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
        {Array.from({ length: maxSlots }).map((_, i) => (
          <div key={i} className="aspect-square rounded-lg bg-card animate-pulse" />
        ))}
      </div>
    );
  }

  // Create array of slots - episodes first, then placeholders
  const slots = Array.from({ length: maxSlots }).map((_, index) => {
    if (index < episodes.length) {
      return { type: 'episode' as const, episode: episodes[index] };
    }
    return { type: 'placeholder' as const };
  });

  return (
    <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
      {slots.map((slot, index) => (
        slot.type === 'episode' ? (
          <EpisodeCard key={slot.episode.id} episode={slot.episode} onPlay={onPlay} />
        ) : (
          <PlaceholderCard key={`placeholder-${index}`} />
        )
      ))}
    </div>
  );
}
