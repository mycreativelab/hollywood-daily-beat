

# Slack Benachrichtigungen für neue Podcast-Folgen

## Übersicht
Eingeloggte User können sich mit ihrem Slack-Workspace verbinden, um Benachrichtigungen über neue Podcast-Folgen zu erhalten. Der OAuth-Flow wird sicher über eine Edge Function abgewickelt.

## Architektur

```text
User klickt "Mit Slack verbinden"
        ↓
Weiterleitung zu Slack OAuth
        ↓
User autorisiert in Slack
        ↓
Slack leitet zurück mit ?code=...
        ↓
Frontend ruft Edge Function auf
        ↓
Edge Function tauscht Code gegen Webhook
        ↓
Webhook wird in DB gespeichert
        ↓
Bei neuer Episode: Nachricht an alle Webhooks
```

## Benötigte Secrets

Die folgenden Werte müssen als Secrets konfiguriert werden:
- **SLACK_CLIENT_ID** - Von deiner Slack App
- **SLACK_CLIENT_SECRET** - Von deiner Slack App

## Datenbankänderungen

### Neue Tabelle: slack_subscribers

```sql
CREATE TABLE public.slack_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  webhook_url TEXT NOT NULL,
  team_id TEXT NOT NULL,
  team_name TEXT,
  channel TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, team_id)
);

ALTER TABLE public.slack_subscribers ENABLE ROW LEVEL SECURITY;

-- User kann nur seine eigenen Subscriptions sehen
CREATE POLICY "Users can view own subscriptions"
  ON public.slack_subscribers FOR SELECT
  USING (auth.uid() = user_id);

-- User kann eigene Subscriptions erstellen
CREATE POLICY "Users can insert own subscriptions"
  ON public.slack_subscribers FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- User kann eigene Subscriptions löschen
CREATE POLICY "Users can delete own subscriptions"
  ON public.slack_subscribers FOR DELETE
  USING (auth.uid() = user_id);
```

## Neue Edge Function: slack-auth

**Pfad:** `supabase/functions/slack-auth/index.ts`

Diese Function:
1. Empfängt den `code` vom Frontend
2. Validiert den eingeloggten User (JWT)
3. Tauscht den Code bei Slack gegen einen Webhook
4. Speichert den Webhook in der Datenbank

```typescript
// Kernlogik
const slackResponse = await fetch('https://slack.com/api/oauth.v2.access', {
  method: 'POST',
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  body: new URLSearchParams({
    client_id: SLACK_CLIENT_ID,
    client_secret: SLACK_CLIENT_SECRET,
    code: code,
    redirect_uri: redirectUri
  })
});
```

## Neue Edge Function: notify-slack

**Pfad:** `supabase/functions/notify-slack/index.ts`

Diese Function wird aufgerufen, wenn eine neue Episode erstellt wird:
1. Lädt alle Webhook-URLs aus `slack_subscribers`
2. Sendet Nachricht an jeden Webhook

## Frontend-Änderungen

### 1. Neue Seite: src/pages/SlackCallback.tsx

Fängt den Redirect von Slack ab und ruft die Edge Function auf:
- Zeigt Ladezustand während OAuth-Austausch
- Zeigt Erfolgsmeldung nach Verbindung
- Fehlerbehandlung bei Problemen

### 2. Neue Komponente: src/components/SlackConnectButton.tsx

Ein Button, den eingeloggte User klicken können:
- Leitet zu Slack OAuth weiter
- Zeigt Status ob bereits verbunden

### 3. Anpassung von Index.tsx oder Header

Button zum Verbinden mit Slack einfügen.

### 4. Neue Route in App.tsx

```typescript
<Route path="/slack/callback" element={<SlackCallback />} />
```

## Slack App Konfiguration

In deiner Slack App muss folgende Redirect URI eingetragen werden:

**Redirect URI:** `https://id-preview--57878666-5b3f-4ee9-8717-4421e0d22401.lovable.app/slack/callback`

(Nach dem Veröffentlichen die Published URL verwenden)

Unter "OAuth & Permissions" → "Scopes" brauchst du:
- `incoming-webhook` (Bot Token Scope)

## Ablauf für User

1. User ist eingeloggt
2. User klickt "Mit Slack verbinden"
3. User wird zu Slack weitergeleitet
4. User wählt Channel und autorisiert
5. User wird zurückgeleitet, sieht "Erfolgreich verbunden"
6. Bei neuen Episoden erhält der Channel eine Nachricht

## Nächste Schritte nach Genehmigung

1. Ich werde dich nach SLACK_CLIENT_ID und SLACK_CLIENT_SECRET fragen
2. Datenbank-Tabelle erstellen
3. Edge Functions implementieren
4. Frontend-Komponenten erstellen

