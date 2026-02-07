

# Slack-Benachrichtigung bei neuen Episoden

## Problem

Die `add-episode` Edge Function speichert neue Episoden in der Datenbank, ruft aber **nicht** die `notify-slack` Function auf. Deshalb erhalten Slack-Abonnenten keine Benachrichtigungen.

## Lösungsansatz

Nach dem erfolgreichen Einfügen einer Episode wird automatisch die `notify-slack` Function aufgerufen.

## Technische Umsetzung

### Änderung in `supabase/functions/add-episode/index.ts`

Nach dem erfolgreichen Insert (ca. Zeile 278) wird folgender Code hinzugefügt:

```text
┌─────────────────────────────────────────────────────────────┐
│  Episode erfolgreich erstellt                                │
│                    ↓                                         │
│  Podcast-Titel aus Datenbank abrufen (für Benachrichtigung) │
│                    ↓                                         │
│  notify-slack Function aufrufen mit:                         │
│  - episode_title: Titel der neuen Episode                    │
│  - podcast_title: Name des Podcasts                          │
│  - episode_url: Link zur Episode (optional)                  │
│                    ↓                                         │
│  Erfolgsantwort zurückgeben                                  │
└─────────────────────────────────────────────────────────────┘
```

### Code-Änderungen

1. **Podcast-Titel abrufen**: Nach dem Erstellen der Episode wird der zugehörige Podcast-Titel aus der `podcasts`-Tabelle geholt.

2. **notify-slack aufrufen**: Die Function wird mit den Episode-Details aufgerufen:
   - `episode_title`: Titel der neuen Episode
   - `podcast_title`: Name des Podcasts
   - `episode_url`: URL zur Podcast-Detail-Seite (z.B. `https://[domain]/podcasts/[podcast_id]`)

3. **Fehlerbehandlung**: Fehler bei der Benachrichtigung werden geloggt, blockieren aber nicht die Erfolgsantwort (die Episode ist bereits gespeichert).

### Beispiel-Code

```typescript
// Nach erfolgreichem Insert (Zeile 278)
// Podcast-Titel für die Benachrichtigung holen
const { data: podcast } = await supabase
  .from('podcasts')
  .select('title')
  .eq('id', body.podcast_id)
  .single();

// Slack-Benachrichtigung senden (async, non-blocking)
if (podcast) {
  try {
    const notifyResponse = await fetch(
      `${supabaseUrl}/functions/v1/notify-slack`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseServiceKey}`,
        },
        body: JSON.stringify({
          episode_title: normalizedTitle,
          podcast_title: podcast.title,
          episode_url: `https://[your-domain]/podcasts/${body.podcast_id}`,
        }),
      }
    );
    console.log('Slack notification sent:', await notifyResponse.json());
  } catch (notifyError) {
    console.error('Failed to send Slack notification:', notifyError);
    // Fehler wird geloggt, aber nicht weitergegeben
  }
}
```

## Vorteile

- Automatische Benachrichtigung bei jedem neuen Episode-Upload
- Kein manueller Eingriff erforderlich
- Fehler bei der Benachrichtigung blockieren nicht den Upload-Prozess

## Zu beachten

- Die Episode-URL muss auf die korrekte Domain zeigen (wird aus den Projekteinstellungen ermittelt)
- Die `notify-slack` Function muss deployed sein (bereits der Fall)

