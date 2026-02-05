import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface PlayingEpisode {
  id: string;
  title: string;
  thumbnail: string | null;
  audioUrl: string | null;
  podcastTitle?: string;
}

interface AudioContextType {
  playingEpisode: PlayingEpisode | null;
  setPlayingEpisode: (episode: PlayingEpisode | null) => void;
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export function AudioProvider({ children }: { children: ReactNode }) {
  const [playingEpisode, setPlayingEpisode] = useState<PlayingEpisode | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Restore saved playback session on mount (once globally)
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
        // Don't auto-play on restore - let user decide
        setIsPlaying(false);
      } catch (e) {
        console.error('Failed to restore playback state');
      }
    }
  }, []);

  return (
    <AudioContext.Provider value={{ playingEpisode, setPlayingEpisode, isPlaying, setIsPlaying }}>
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio() {
  const context = useContext(AudioContext);
  if (context === undefined) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
}
