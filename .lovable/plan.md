

# Fix: VITE_SLACK_CLIENT_ID im Frontend verfügbar machen

## Problem
Die `VITE_SLACK_CLIENT_ID` ist als Backend-Secret gespeichert, aber Frontend-Umgebungsvariablen mit dem `VITE_` Prefix müssen in der `.env` Datei stehen, damit Vite sie zur Build-Zeit einbinden kann.

## Lösung
Da die Slack Client ID ein **öffentlicher Wert** ist (vergleichbar mit einer Google OAuth Client ID), kann sie sicher direkt im Code gespeichert werden. Dies ist die empfohlene Lösung für Lovable-Projekte.

## Technische Umsetzung

### Änderung in `src/components/SlackConnectButton.tsx`

Die Client ID wird direkt als Konstante im Code definiert:

```typescript
// Vorher:
const SLACK_CLIENT_ID = import.meta.env.VITE_SLACK_CLIENT_ID;

// Nachher:
const SLACK_CLIENT_ID = '8806754295024.8754127476533'; // Deine Slack App Client ID
```

**Hinweis:** Du musst mir deine Slack Client ID mitteilen, damit ich sie einfügen kann. Du findest sie unter:
- https://api.slack.com/apps → Deine App auswählen → **Basic Information** → **App Credentials** → **Client ID**

## Warum das sicher ist
- Die Client ID ist **kein Geheimnis** - sie identifiziert nur deine App
- Sie ist sowieso im Browser-Code sichtbar, wenn der OAuth-Flow startet
- Nur das **Client Secret** muss geheim bleiben (das ist bereits als Backend-Secret gespeichert)

## Nächste Schritte nach Genehmigung
1. Du teilst mir deine Slack Client ID mit
2. Ich aktualisiere die `SlackConnectButton.tsx` Komponente

