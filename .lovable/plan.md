
# Playback Speed Button hinzufügen

## Übersicht
Ein Geschwindigkeitsregler wird zum AudioPlayer hinzugefügt, mit dem zwischen 0.5x, 1x, 1.5x und 2x Wiedergabegeschwindigkeit gewechselt werden kann.

## Änderungen

### src/components/AudioPlayer.tsx

**1. Neuen State hinzufügen (nach Zeile 24):**
```typescript
const [playbackRate, setPlaybackRate] = useState(1);
```

**2. useEffect für playbackRate (nach Zeile 40):**
```typescript
useEffect(() => {
  if (audioRef.current) {
    audioRef.current.playbackRate = playbackRate;
  }
}, [playbackRate]);
```

**3. Cycle-Funktion für Geschwindigkeit:**
```typescript
const cyclePlaybackRate = () => {
  const rates = [0.5, 1, 1.5, 2];
  const currentIndex = rates.indexOf(playbackRate);
  const nextIndex = (currentIndex + 1) % rates.length;
  setPlaybackRate(rates[nextIndex]);
};
```

**4. Speed-Button im UI (zwischen Volume und Error-Button, ca. Zeile 211):**
```typescript
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
```

## Erwartetes Ergebnis

Der AudioPlayer zeigt einen Button mit der aktuellen Geschwindigkeit (z.B. "1x"). Bei jedem Klick wechselt die Geschwindigkeit:
- 0.5x → 1x → 1.5x → 2x → 0.5x (zyklisch)

**Layout:**
```
[Thumbnail] [Title]  [⏮] [▶] [⏭]  [0:00 ━━━━━━━ 20:00]  [🔊 ━━] [1x] [✕]
```
