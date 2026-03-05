

# Bessere Fehlermeldung bei Backend-Schlafmodus

## Problem
Wenn das Backend im Schlafmodus ist, schlägt der Login mit "Failed to fetch" fehl. Der Nutzer bekommt nur eine generische Fehlermeldung und weiß nicht, dass er kurz warten und es erneut versuchen soll.

## Lösung
In der `Auth.tsx` Login-Logik den `catch`-Block erweitern: Wenn der Fehler "Failed to fetch" oder "NetworkError" enthält, eine spezifische Toast-Nachricht anzeigen:

**Titel:** "Server wird gestartet"  
**Beschreibung:** "Die Verbindung konnte nicht hergestellt werden. Bitte versuche es in 20 Sekunden erneut."

## Änderung

**Datei:** `src/pages/Auth.tsx` (im `catch`-Block, ca. Zeile 93-99)

```typescript
} catch (err) {
  const message = err instanceof Error ? err.message : '';
  if (message.includes('Failed to fetch') || message.includes('NetworkError')) {
    toast({
      title: 'Server wird gestartet',
      description: 'Die Verbindung konnte nicht hergestellt werden. Bitte versuche es in 20 Sekunden erneut.',
      variant: 'destructive',
    });
  } else {
    toast({
      title: 'Error',
      description: 'An unexpected error occurred. Please try again.',
      variant: 'destructive',
    });
  }
}
```

Zusätzlich den gleichen Check in den `signIn`-Fehlerfall einbauen (ca. Zeile 65), da der Supabase-Client den "Failed to fetch"-Fehler auch als `error` im Response zurückgeben kann.

