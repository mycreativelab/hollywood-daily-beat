
# Slack Integration UI - Professionelle Finalisierung

## Übersicht

Ich werde die Slack-Integration mit einem globalen Banner, einer neuen Einstellungsseite und den gewünschten Metadaten implementieren.

## Geplante Änderungen

### 1. Neues SlackBanner Component

**Datei:** `src/components/SlackBanner.tsx`

- Erscheint direkt unter dem Header (fixed, unterhalb der 80px Header-Höhe)
- Verwendet den offiziellen "Add to Slack"-Button mit dem korrekten Bild
- Dynamische `redirect_uri` auf Basis von `window.location.origin`
- State-Parameter mit User-ID für sichere Zuordnung
- "X"-Button zum Schließen mit LocalStorage-Persistenz (`slack-banner-dismissed`)
- Zeigt das Banner nur für eingeloggte User ohne Slack-Verbindung
- Zweisprachig (DE/EN)

### 2. Neue Settings-Seite

**Datei:** `src/pages/Settings.tsx`

- Neue Route `/settings` für Benutzereinstellungen
- Abschnitt "Benachrichtigungen" mit:
  - Wenn nicht verbunden: Erklärungstext + "Add to Slack"-Button
  - Wenn verbunden: Grüner Status mit Channel-Info + "Trennen"-Button
- Disconnect-Logik löscht Eintrag aus `slack_subscribers`
- Protected Route - nur für eingeloggte User

### 3. App.tsx Anpassungen

- Neue Route `/settings` hinzufügen
- `SlackBanner` global einbinden (unterhalb Routes, ähnlich wie CookieBanner)

### 4. Header-Navigation

- Link zur Settings-Seite für eingeloggte User hinzufügen (mit Settings-Icon)
- SlackConnectButton aus Header entfernen (wird jetzt über Banner/Settings abgewickelt)

### 5. Translations erweitern

**Datei:** `src/translations/index.ts`

Neue Übersetzungen für:
- Banner-Text: "Verpasse keine Episode! Erhalte automatische Updates direkt in deinen Slack-Channel."
- Settings-Beschriftungen
- Benachrichtigungen-Sektion

### 6. Meta-Tag hinzufügen

**Datei:** `index.html`

```html
<meta name="slack-app-id" content="A0ADH2E8J4C">
```

## Technische Details

### SlackBanner Logik

```text
┌─────────────────────────────────────────────────────────────────┐
│  Header (fixed, h-20, z-50)                                     │
├─────────────────────────────────────────────────────────────────┤
│  SlackBanner (fixed, top-20, z-40)                              │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ 🔔 Verpasse keine Episode!...    [Add to Slack]    [X]    │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

### Anzeigebedingungen SlackBanner:

1. User ist eingeloggt
2. User hat keine Slack-Verbindung
3. Banner wurde nicht dismissed (LocalStorage)

### Settings-Seite Struktur:

```text
┌─────────────────────────────────────────────────────────────────┐
│  Einstellungen                                                  │
├─────────────────────────────────────────────────────────────────┤
│  Benachrichtigungen                                             │
│  ──────────────────────────────────────────────────────────     │
│  Erhalte automatische Updates zu neuen Episoden.                │
│                                                                 │
│  Status: ✅ Mit Slack verbunden (#general)                      │
│  [Verbindung trennen]                                           │
│                                                                 │
│  --- ODER ---                                                   │
│                                                                 │
│  Status: Nicht verbunden                                        │
│  [Add to Slack Button]                                          │
└─────────────────────────────────────────────────────────────────┘
```

### OAuth-URL Format:

```
https://slack.com/oauth/v2/authorize
  ?client_id=10449077755315.10459082290148
  &scope=incoming-webhook
  &redirect_uri={window.location.origin}/slack/callback
  &state={user.id}
```

## Dateien-Übersicht

| Datei | Aktion |
|-------|--------|
| `index.html` | Meta-Tag hinzufügen |
| `src/components/SlackBanner.tsx` | Neu erstellen |
| `src/pages/Settings.tsx` | Neu erstellen |
| `src/translations/index.ts` | Neue Übersetzungen |
| `src/App.tsx` | Route + SlackBanner hinzufügen |
| `src/components/Header.tsx` | Settings-Link hinzufügen, SlackConnectButton entfernen |

## Sicherheit

- State-Parameter mit User-ID wird weiterhin verwendet
- Banner und Settings nur für eingeloggte User sichtbar
- Disconnect löscht nur eigene Einträge (RLS-Policy bereits vorhanden)
