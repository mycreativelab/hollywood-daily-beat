
# Wiedergabeposition speichern

## Übersicht
Die aktuelle Wiedergabeposition wird in localStorage gespeichert, sodass beim Neuladen der Seite oder späteren Besuchen automatisch an der letzten Position fortgesetzt wird.

## Gespeicherte Daten

Im localStorage unter dem Key `podcast-playback-state`:
```typescript
{
  episodeId: string;
  currentTime: number;
  episodeTitle: string;
  thumbnail: string | null;
  audioUrl: string | null;
  podcastTitle?: string;
}
```

## Änderungen

### src/components/AudioPlayer.tsx

**1. Position bei Änderungen speichern:**
```typescript
// Speichert Position alle 5 Sekunden und bei Pause/Close
useEffect(() => {
  if (episode && currentTime > 0) {
    const state = {
      episodeId: episode.id,
      currentTime,
      episodeTitle: episode.title,
      thumbnail: episode.thumbnail,
      audioUrl: episode.audioUrl,
      podcastTitle: episode.podcastTitle
    };
    localStorage.setItem('podcast-playback-state', JSON.stringify(state));
  }
}, [currentTime, episode]);
```

**2. Position beim Laden einer Episode wiederherstellen:**
```typescript
// Im useEffect für episode?.id
useEffect(() => {
  if (episode && audioRef.current) {
    setHasError(false);
    
    // Gespeicherte Position laden
    const saved = localStorage.getItem('podcast-playback-state');
    if (saved) {
      const state = JSON.parse(saved);
      if (state.episodeId === episode.id && state.currentTime > 0) {
        audioRef.current.currentTime = state.currentTime;
      }
    }
    
    setIsPlaying(true);
    audioRef.current.play().catch(() => setIsPlaying(false));
  }
}, [episode?.id]);
```

**3. Position bei Ende löschen:**
```typescript
// Im onEnded Handler
onEnded={() => {
  setIsPlaying(false);
  localStorage.removeItem('podcast-playback-state');
}}
```

### Parent-Komponenten (Index.tsx, PodcastDetail.tsx, Podcasts.tsx)

**Gespeicherten State beim Laden der Seite wiederherstellen:**
```typescript
// Beim Mount prüfen ob eine Session gespeichert ist
useEffect(() => {
  const saved = localStorage.getItem('podcast-playback-state');
  if (saved) {
    const state = JSON.parse(saved);
    setPlayingEpisode({
      id: state.episodeId,
      title: state.episodeTitle,
      thumbnail: state.thumbnail,
      audioUrl: state.audioUrl,
      podcastTitle: state.podcastTitle
    });
  }
}, []);
```

## Erwartetes Verhalten

1. **Beim Abspielen**: Position wird alle paar Sekunden gespeichert
2. **Beim Neuladen**: AudioPlayer öffnet sich automatisch mit der letzten Episode
3. **Beim Fortsetzen**: Audio startet an der gespeicherten Position
4. **Am Ende**: Gespeicherte Position wird gelöscht

## Technische Details

- Speicherung erfolgt über `localStorage` (bleibt auch nach Schließen des Browsers)
- Position wird nur gespeichert wenn `currentTime > 0`
- Bei Episode-Ende wird der gespeicherte State gelöscht
- Die Wiederherstellung erfolgt in `handleLoadedMetadata` um sicherzustellen, dass das Audio geladen ist
