import { Play, Pause, Clock, Headphones } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { Link } from 'react-router-dom';
import { useState, useRef } from 'react';

interface HeroBannerProps {
  latestEpisode?: {
    id: string;
    title: string;
    description?: string | null;
    podcast_title?: string;
    audio_url: string | null;
    thumbnail: string | null;
    duration?: number | null;
  };
}

function formatDuration(seconds: number | null | undefined): string {
  if (!seconds) return '3:00';
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
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
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background Image with gradient overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=1920&h=1080&fit=crop&q=80')`
        }}
      />
      
      {/* Multiple gradient overlays for depth */}
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/95 to-background/60" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/50" />
      
      {/* Decorative orange glow */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[150px] animate-float" />
      
      {/* Content */}
      <div className="container relative z-10 mx-auto px-4 py-20 pt-32">
        <div className="max-w-3xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 text-primary text-sm font-medium mb-8 animate-slide-up">
            <Headphones className="w-4 h-4" />
            <span>mycreativelab Podcast</span>
          </div>
          
          {/* Main heading with gradient text */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold mb-6 animate-slide-up-delay-1 leading-tight">
            <span className="text-gradient">Content is</span>
            <br />
            <span className="text-foreground">King</span>
          </h1>
          
          {/* Description */}
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mb-10 animate-slide-up-delay-2 leading-relaxed">
            Creating digital solutions for the <span className="text-primary font-medium">film and media industry</span>. 
            Daily Hollywood news, insights, and creative collaborations.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-start gap-4 animate-slide-up-delay-3">
            {user ? (
              <Button 
                size="lg" 
                className="bg-gradient-orange hover:shadow-glow text-primary-foreground px-10 py-7 rounded-full text-lg font-semibold transition-all duration-300"
                asChild
              >
                <Link to="/podcasts" className="flex items-center gap-3">
                  <Play className="w-6 h-6" />
                  Browse Episodes
                </Link>
              </Button>
            ) : (
              <Button 
                size="lg" 
                className="bg-gradient-orange hover:shadow-glow text-primary-foreground px-10 py-7 rounded-full text-lg font-semibold transition-all duration-300"
                asChild
              >
                <Link to="/auth" className="flex items-center gap-3">
                  <Play className="w-6 h-6" />
                  Start Listening
                </Link>
              </Button>
            )}
            
            <Button 
              size="lg"
              variant="outline"
              className="border-border/50 hover:border-primary/50 hover:bg-primary/5 px-10 py-7 rounded-full text-lg font-semibold transition-all duration-300"
              asChild
            >
              <Link to="/about">Learn More</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Latest Episode Player Bar - Castopress style */}
      {latestEpisode && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-r from-card via-card to-card/95 border-t border-border/30">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-6 py-5">
              {/* Orange accent label */}
              <span className="hidden md:block text-primary text-xs font-bold uppercase tracking-widest">
                Latest Episode
              </span>
              
              {/* Thumbnail with orange border */}
              <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 border-2 border-primary/30 shadow-glow-sm">
                <img 
                  src={latestEpisode.thumbnail || 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=100&h=100&fit=crop'} 
                  alt={latestEpisode.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
              </div>
              
              {/* Episode Info */}
              <div className="flex-1 min-w-0">
                <h3 className="text-foreground font-display font-bold text-lg truncate">
                  {latestEpisode.title}
                </h3>
                <p className="text-muted-foreground text-sm truncate mt-1">
                  {latestEpisode.description || 'Latest episode from mycreativelab'}
                </p>
                <div className="flex items-center gap-3 mt-2">
                  <span className="flex items-center gap-1 text-primary text-xs">
                    <Clock className="w-3 h-3" />
                    {formatDuration(latestEpisode.duration)}
                  </span>
                </div>
              </div>
              
              {/* Play Button with orange glow */}
              {user ? (
                <button 
                  onClick={handlePlay}
                  className="w-16 h-16 bg-gradient-orange rounded-full flex items-center justify-center play-button flex-shrink-0"
                >
                  {isPlaying ? (
                    <Pause className="w-7 h-7 text-primary-foreground" />
                  ) : (
                    <Play className="w-7 h-7 text-primary-foreground ml-1" />
                  )}
                </button>
              ) : (
                <Button 
                  asChild
                  className="bg-gradient-orange hover:shadow-glow text-primary-foreground rounded-full px-6"
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
