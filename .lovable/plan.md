
# Fortschrittsanzeige für Episoden

## Übersicht
Jede Episode-Karte erhält eine dünne Fortschrittsleiste, die anzeigt, wie viel bereits gehört wurde. Der Balken ist schwarz/dunkel und füllt sich mit Orange entsprechend dem Fortschritt.

## Lösung

### 1. Neue localStorage-Struktur für alle Episoden

Zusätzlich zum bestehenden `podcast-playback-state` speichern wir den Fortschritt aller Episoden:

```typescript
// Key: "episode-progress"
// Wert: { [episodeId]: { currentTime: number, duration: number } }
{
  "abc-123": { currentTime: 150, duration: 1800 },  // 8.3% gehört
  "def-456": { currentTime: 900, duration: 900 },   // 100% gehört
  "ghi-789": { currentTime: 450, duration: 1200 }   // 37.5% gehört
}
```

### 2. Änderungen an src/components/AudioPlayer.tsx

**Neue Logik zum Speichern des Fortschritts pro Episode:**
```typescript
// Im useEffect für currentTime/episode
useEffect(() => {
  if (episode && currentTime > 0 && duration > 0) {
    // Bestehende Logik für podcast-playback-state...
    
    // NEU: Fortschritt für diese Episode speichern
    const progressData = JSON.parse(
      localStorage.getItem('episode-progress') || '{}'
    );
    progressData[episode.id] = { currentTime, duration };
    localStorage.setItem('episode-progress', JSON.stringify(progressData));
  }
}, [currentTime, duration, episode]);
```

### 3. Änderungen an src/components/EpisodeList.tsx

**3a. Hook für Fortschrittsdaten laden:**
```typescript
import { useState, useEffect } from 'react';

// In EpisodeCard Komponente
const [progress, setProgress] = useState(0);

useEffect(() => {
  const progressData = JSON.parse(
    localStorage.getItem('episode-progress') || '{}'
  );
  const episodeProgress = progressData[episode.id];
  if (episodeProgress && episodeProgress.duration > 0) {
    setProgress((episodeProgress.currentTime / episodeProgress.duration) * 100);
  }
}, [episode.id]);
```

**3b. Fortschrittsbalken UI (nach dem Play-Button, ca. Zeile 131):**
```typescript
{/* Progress bar - shows listening progress */}
{progress > 0 && (
  <div className="absolute bottom-0 left-0 right-0 h-1 bg-muted/50">
    <div 
      className="h-full bg-primary transition-all duration-300"
      style={{ width: `${Math.min(progress, 100)}%` }}
    />
  </div>
)}
```

## Visuelles Ergebnis

```
┌─────────────────────┐
│                     │
│   Hollywood Daily   │
│     Do. 05.02.      │
│         ▶          │
│                     │
│ EP 05        12min  │
├─────────────────────┤  ← Dünner Fortschrittsbalken
│████████░░░░░░░░░░░░│  ← Orange = gehört, Grau = noch nicht
└─────────────────────┘
```

- **0% gehört**: Kein Balken sichtbar
- **Teilweise gehört**: Orangefarbener Fortschritt
- **100% gehört**: Vollständig orange

## Technische Details

- Höhe des Balkens: 4px (`h-1`)
- Hintergrund: `bg-muted/50` (dunkler, halbtransparenter Balken)
- Fortschritt: `bg-primary` (Orange)
- Position: Am unteren Rand der Karte
- Balken erscheint nur wenn `progress > 0`
