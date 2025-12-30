import { Play, Pause, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { Link } from 'react-router-dom';
import { useState, useRef } from 'react';

interface HeroBannerProps {
  latestEpisode?: {
    id: string;
    title: string;
    podcast_title?: string;
    audio_url: string | null;
    thumbnail: string | null;
  };
}

export function HeroBanner({ latestEpisode }: HeroBannerProps) {
  const { user } = useAuth();
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const handlePlay = () => {
    if (!user) return;
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=1920&h=1080&fit=crop')`
        }}
      />
      
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-background/40" />
      
      {/* Content */}
      <div className="container relative z-10 mx-auto px-4 py-20 pt-32">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 text-primary text-sm font-medium mb-6 animate-slide-up">
            <Volume2 className="w-4 h-4" />
            <span>mycreativelab Podcast</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-display font-bold mb-6 animate-slide-up-delay-1">
            <span className="text-secondary">Content is</span>
            <br />
            <span className="text-foreground">King</span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-xl mb-8 animate-slide-up-delay-2">
            Creating digital solutions for the <span className="text-secondary font-medium">film and media industry</span>. 
            The Podcast is one of our services — daily Hollywood news and insights.
          </p>
          
          <div className="flex flex-col sm:flex-row items-start gap-4 animate-slide-up-delay-3">
            {user ? (
              <Button 
                size="lg" 
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 rounded-full"
                asChild
              >
                <Link to="/podcasts" className="flex items-center gap-2">
                  <Play className="w-5 h-5" />
                  Browse Episodes
                </Link>
              </Button>
            ) : (
              <Button 
                size="lg" 
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 rounded-full"
                asChild
              >
                <Link to="/auth" className="flex items-center gap-2">
                  <Play className="w-5 h-5" />
                  Start Listening
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Latest Episode Player Bar */}
      {latestEpisode && (
        <div className="absolute bottom-0 left-0 right-0 bg-primary">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-4 py-4">
              {/* Thumbnail */}
              <div className="hidden sm:block w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                <img 
                  src={latestEpisode.thumbnail || 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=100&h=100&fit=crop'} 
                  alt={latestEpisode.title}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Episode Info */}
              <div className="flex-1 min-w-0">
                <p className="text-primary-foreground/80 text-sm">Latest Episode</p>
                <h3 className="text-primary-foreground font-semibold truncate">
                  {latestEpisode.title}
                </h3>
              </div>
              
              {/* Play Button */}
              {user ? (
                <button 
                  onClick={handlePlay}
                  className="w-14 h-14 bg-background rounded-full flex items-center justify-center hover:scale-105 transition-transform flex-shrink-0"
                >
                  {isPlaying ? (
                    <Pause className="w-6 h-6 text-primary" />
                  ) : (
                    <Play className="w-6 h-6 text-primary ml-1" />
                  )}
                </button>
              ) : (
                <Button 
                  asChild
                  variant="secondary"
                  className="rounded-full"
                >
                  <Link to="/auth">Sign in to Play</Link>
                </Button>
              )}
            </div>
          </div>
          
          {latestEpisode.audio_url && (
            <audio ref={audioRef} src={latestEpisode.audio_url} />
          )}
        </div>
      )}
    </section>
  );
}
