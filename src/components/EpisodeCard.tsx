import { Play, Pause, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface EpisodeCardProps {
  id: string;
  title: string;
  description: string | null;
  duration: number | null;
  episodeNumber: number | null;
  thumbnail: string | null;
  isPlaying?: boolean;
  onPlay?: () => void;
}

function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes} min`;
}

export function EpisodeCard({ 
  title, 
  description, 
  duration, 
  episodeNumber, 
  thumbnail,
  isPlaying = false,
  onPlay 
}: EpisodeCardProps) {
  return (
    <Card className="group overflow-hidden border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-primary bg-card">
      <CardContent className="p-4">
        <div className="flex gap-4">
          <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden">
            <img 
              src={thumbnail || 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=200&h=200&fit=crop'} 
              alt={title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-foreground/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Button 
                size="icon" 
                variant="ghost" 
                className="w-10 h-10 rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={onPlay}
              >
                {isPlaying ? (
                  <Pause className="w-4 h-4" />
                ) : (
                  <Play className="w-4 h-4 ml-0.5" />
                )}
              </Button>
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              {episodeNumber && (
                <span className="text-xs font-medium text-primary">
                  EP {episodeNumber}
                </span>
              )}
              {duration && (
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  {formatDuration(duration)}
                </span>
              )}
            </div>
            <h4 className="font-display font-medium text-foreground group-hover:text-primary transition-colors line-clamp-1">
              {title}
            </h4>
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
              {description || 'No description available'}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
