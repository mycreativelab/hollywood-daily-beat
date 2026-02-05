
# Globaler AudioPlayer + Datenschutz-Update

## Problem
Aktuell hat jede Seite (Index, Podcasts, PodcastDetail) ihren eigenen `playingEpisode` State. Beim Seitenwechsel wird die Komponente unmounted und der State geht verloren.

## Lösung

### Teil 1: Globaler Audio-Kontext

**1. Neuer AudioContext (src/contexts/AudioContext.tsx):**
```typescript
interface AudioContextType {
  playingEpisode: PlayingEpisode | null;
  setPlayingEpisode: (episode: PlayingEpisode | null) => void;
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
}
```

Der Context speichert:
- Die aktuelle Episode
- Den Play/Pause-Status

**2. App.tsx anpassen:**
- AudioProvider um alle Routes wrappen
- AudioPlayer einmal global rendern (außerhalb der Routes)

```
<AudioProvider>
  <Routes>...</Routes>
  <AudioPlayer />  ← Hier, außerhalb der Routes
</AudioProvider>
```

**3. Seiten anpassen (Index, Podcasts, PodcastDetail):**
- Lokalen `playingEpisode` State entfernen
- Stattdessen `useAudio()` Hook verwenden
- AudioPlayer aus den Seiten entfernen

### Teil 2: Datenschutz aktualisieren

**src/pages/Datenschutz.tsx:**
- Personendaten ändern zu:
  - Clemens Szczesny
  - Karlstraße 9
  - 71638 Ludwigsburg
  - hello@mycreativelab.de
- Stand aktualisieren zu: Februar 2025

## Technische Details

**AudioContext speichert isPlaying-Status:**
Der Play/Pause-Zustand wird im Context gehalten, sodass beim Seitenwechsel:
- Audio weiterspielt wenn es lief
- Audio pausiert bleibt wenn es pausiert war

**localStorage-Wiederherstellung:**
Erfolgt einmalig beim App-Mount im AudioProvider, nicht mehr in jeder Seite.
