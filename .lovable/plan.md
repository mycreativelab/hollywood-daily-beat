

# SLACK_CLIENT_ID Secret Aktualisierung

## Übersicht

Das Supabase Secret `SLACK_CLIENT_ID` muss auf den korrekten Wert aktualisiert werden, damit die Edge Function `slack-auth` die OAuth-Authentifizierung erfolgreich durchführen kann.

## Aktuelle Situation

| Komponente | Aktueller Wert | Korrekter Wert |
|------------|----------------|----------------|
| Frontend (`SlackConnectButton.tsx`) | `10449077755315.10459082290148` | ✅ Bereits korrekt |
| Frontend (`SlackBanner.tsx`) | `10449077755315.10459082290148` | ✅ Bereits korrekt |
| Backend Secret (`SLACK_CLIENT_ID`) | `1044907775315...` (fehlt eine 5) | ❌ Muss aktualisiert werden |

## Geplante Änderung

**Secret-Update:**
- Name: `SLACK_CLIENT_ID`
- Neuer Wert: `10449077755315.10459082290148`

## Auswirkung

Nach der Aktualisierung wird die Edge Function `slack-auth` die korrekte Client ID beim Token-Austausch mit Slack verwenden und der `invalid_client_id` Fehler wird behoben.

