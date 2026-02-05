import { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, X, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';
import { useAudio } from '@/contexts/AudioContext';

export function GlobalAudioPlayer() {
  const { playingEpisode, setPlayingEpisode, isPlaying, setIsPlaying } = useAudio();
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const audioRef = useRef<HTMLAudioElement>(null);
  const { toast } = useToast();

  // Save position to localStorage
  useEffect(() => {
    if (playingEpisode && currentTime > 0) {
      const state = {
        episodeId: playingEpisode.id,
        currentTime,
        episodeTitle: playingEpisode.title,
        thumbnail: playingEpisode.thumbnail,
        audioUrl: playingEpisode.audioUrl,
        podcastTitle: playingEpisode.podcastTitle
      };
      localStorage.setItem('podcast-playback-state', JSON.stringify(state));
      
      // Save progress for this episode (for progress bars on cards)
      if (duration > 0) {
        const progressData = JSON.parse(
          localStorage.getItem('episode-progress') || '{}'
        );
        progressData[playingEpisode.id] = { currentTime, duration };
        localStorage.setItem('episode-progress', JSON.stringify(progressData));
      }
    }
  }, [currentTime, duration, playingEpisode]);

  // Load episode and restore position
  useEffect(() => {
    if (playingEpisode && audioRef.current) {
      setHasError(false);
      
      // Restore saved position if same episode
      const saved = localStorage.getItem('podcast-playback-state');
      if (saved) {
        try {
          const state = JSON.parse(saved);
          if (state.episodeId === playingEpisode.id && state.currentTime > 0) {
            audioRef.current.currentTime = state.currentTime;
          }
        } catch (e) {
          console.error('Failed to parse saved playback state');
        }
      }
      
      // Only auto-play when a NEW episode is selected (not on restore)
      if (isPlaying) {
        audioRef.current.play().catch(() => setIsPlaying(false));
      }
    }
  }, [playingEpisode?.id]);

  // Sync play/pause state with audio element
  useEffect(() => {
    if (audioRef.current && playingEpisode) {
      if (isPlaying) {
        audioRef.current.play().catch(() => setIsPlaying(false));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, playingEpisode]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackRate;
    }
  }, [playbackRate]);

  const cyclePlaybackRate = () => {
    const rates = [0.5, 1, 1.5, 2];
    const currentIndex = rates.indexOf(playbackRate);
    const nextIndex = (currentIndex + 1) % rates.length;
    setPlaybackRate(rates[nextIndex]);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleSeek = (value: number[]) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value[0];
      setCurrentTime(value[0]);
    }
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const skip = (seconds: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime += seconds;
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleClose = () => {
    setPlayingEpisode(null);
    setIsPlaying(false);
  };

  if (!playingEpisode) return null;

  const encodedAudioUrl = playingEpisode.audioUrl || undefined;

  const handleAudioError = () => {
    setHasError(true);
    setIsPlaying(false);
    const errorCode = audioRef.current?.error?.code;
    console.error('Audio error:', {
      code: errorCode,
      message: audioRef.current?.error?.message,
      url: playingEpisode.audioUrl
    });
    toast({
      title: 'Audio kann nicht geladen werden',
      description: 'Der Audio-Link ist nicht öffentlich zugänglich. Bitte im Admin-Bereich einen gültigen Share-Link hinterlegen.',
      variant: 'destructive',
    });
  };

  const openAudioInNewTab = () => {
    if (playingEpisode.audioUrl) {
      window.open(playingEpisode.audioUrl, '_blank');
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 glass border-t border-border">
      <audio
        ref={audioRef}
        src={encodedAudioUrl}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => {
          setIsPlaying(false);
          localStorage.removeItem('podcast-playback-state');
        }}
        onError={handleAudioError}
      />
      
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center gap-4">
          {/* Episode Info */}
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <img 
              src={playingEpisode.thumbnail || 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=100&h=100&fit=crop'}
              alt={playingEpisode.title}
              className="w-12 h-12 rounded-lg object-cover"
            />
            <div className="min-w-0">
              <p className="font-medium text-sm text-foreground truncate">
                {playingEpisode.title}
              </p>
              {playingEpisode.podcastTitle && (
                <p className="text-xs text-muted-foreground truncate">
                  {playingEpisode.podcastTitle}
                </p>
              )}
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-muted-foreground hover:text-foreground"
              onClick={() => skip(-15)}
            >
              <SkipBack className="w-5 h-5" />
            </Button>
            <Button 
              size="icon"
              className="w-10 h-10 bg-gradient-hero hover:opacity-90 shadow-primary"
              onClick={togglePlay}
            >
              {isPlaying ? (
                <Pause className="w-5 h-5" />
              ) : (
                <Play className="w-5 h-5 ml-0.5" />
              )}
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-muted-foreground hover:text-foreground"
              onClick={() => skip(15)}
            >
              <SkipForward className="w-5 h-5" />
            </Button>
          </div>

          {/* Progress */}
          <div className="hidden md:flex items-center gap-3 flex-1 max-w-md">
            <span className="text-xs text-muted-foreground w-10 text-right">
              {formatTime(currentTime)}
            </span>
            <Slider
              value={[currentTime]}
              max={duration || 100}
              step={1}
              onValueChange={handleSeek}
              className="flex-1"
            />
            <span className="text-xs text-muted-foreground w-10">
              {formatTime(duration)}
            </span>
          </div>

          {/* Volume */}
          <div className="hidden lg:flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon"
              className="text-muted-foreground hover:text-foreground"
              onClick={() => setIsMuted(!isMuted)}
            >
              {isMuted ? (
                <VolumeX className="w-5 h-5" />
              ) : (
                <Volume2 className="w-5 h-5" />
              )}
            </Button>
            <Slider
              value={[isMuted ? 0 : volume * 100]}
              max={100}
              step={1}
              onValueChange={(value) => setVolume(value[0] / 100)}
              className="w-24"
            />
          </div>

          {/* Playback Speed */}
          <Button 
            variant="ghost" 
            size="sm"
            className="text-muted-foreground hover:text-foreground min-w-[3rem] text-xs font-medium"
            onClick={cyclePlaybackRate}
            title="Wiedergabegeschwindigkeit"
          >
            {playbackRate}x
          </Button>

          {/* Error indicator + Open in new tab */}
          {hasError && (
            <Button 
              variant="ghost" 
              size="icon"
              className="text-destructive hover:text-destructive"
              onClick={openAudioInNewTab}
              title="Audio in neuem Tab öffnen"
            >
              <ExternalLink className="w-5 h-5" />
            </Button>
          )}

          {/* Close */}
          <Button 
            variant="ghost" 
            size="icon"
            className="text-muted-foreground hover:text-foreground"
            onClick={handleClose}
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
