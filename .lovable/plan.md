

# Datumsformat sprachabhängig anpassen

## Übersicht
Das Datumsformat wird je nach Sprache unterschiedlich angezeigt:
- **Englisch**: `Tue. 13th Jan` (Wochentag + Ordinalzahl + Monat)
- **Deutsch**: `Di. 13.01.` (Wochentag + Tag.Monat.)

## Änderungen

### 1. EpisodeList.tsx - formatPublishedDate erweitern

**Neue Hilfsfunktion für Ordinalzahlen (Englisch):**
```typescript
function getOrdinalSuffix(day: number): string {
  if (day > 3 && day < 21) return 'th';
  switch (day % 10) {
    case 1: return 'st';
    case 2: return 'nd';
    case 3: return 'rd';
    default: return 'th';
  }
}
```

**formatPublishedDate mit Sprach-Parameter:**
```typescript
function formatPublishedDate(publishedAt: string | null, language: 'en' | 'de'): string {
  if (!publishedAt) return '';
  const date = new Date(publishedAt);
  
  if (language === 'de') {
    // Deutsch: Di. 13.01.
    const days = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];
    const day = days[date.getDay()];
    const dayNum = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    return `${day}. ${dayNum}.${month}.`;
  } else {
    // Englisch: Tue. 13th Jan
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const day = days[date.getDay()];
    const dayNum = date.getDate();
    const suffix = getOrdinalSuffix(dayNum);
    const month = months[date.getMonth()];
    return `${day}. ${dayNum}${suffix} ${month}`;
  }
}
```

### 2. EpisodeCard mit useLanguage Hook

**Import hinzufügen:**
```typescript
import { useLanguage } from '@/contexts/LanguageContext';
```

**In EpisodeCard-Komponente:**
```typescript
function EpisodeCard({ episode, onPlay }: EpisodeCardProps) {
  const { user } = useAuth();
  const { language } = useLanguage();
  
  // ...
  
  <h3 className="...">
    {formatPublishedDate(episode.published_at, language)}
  </h3>
}
```

### 3. HeroBanner.tsx - Gleiche Änderung

Die `formatPublishedDate`-Funktion auch dort mit Sprachunterstützung aktualisieren und `useLanguage` verwenden.

### 4. Erwartete Ergebnisse

**Englisch:**
```
HOLLYWOOD DAILY
Tue. 13th Jan
[Play]
[EP 04]  [20 min]
```

**Deutsch:**
```
HOLLYWOOD DAILY
Di. 13.01.
[Play]
[EP 04]  [20 min]
```

