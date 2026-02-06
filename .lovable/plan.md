

# Fix: Slack Client ID im Frontend einfügen

## Änderung

Die Slack Client ID wird direkt in `src/components/SlackConnectButton.tsx` als Konstante definiert:

```typescript
// Zeile 7 ändern von:
const SLACK_CLIENT_ID = import.meta.env.VITE_SLACK_CLIENT_ID;

// zu:
const SLACK_CLIENT_ID = '1044907775315.10459082290148';
```

## Warum das sicher ist
- Die Client ID ist ein öffentlicher Wert (wie eine Google OAuth Client ID)
- Sie identifiziert nur deine App, enthält keine Geheimnisse
- Das Client Secret bleibt sicher als Backend-Secret gespeichert

## Nach der Implementierung
Nach dieser Änderung sollte der "Mit Slack verbinden" Button funktionieren und dich zum Slack OAuth-Flow weiterleiten.

