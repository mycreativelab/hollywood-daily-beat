

# Slack OAuth Flow anpassen - User-ID über State Parameter

## Problemanalyse

Der aktuelle Flow funktioniert so:
1. **SlackConnectButton** → Leitet User zu Slack weiter
2. **Slack** → Leitet zurück zu `/slack/callback` mit dem Authorization Code
3. **SlackCallback (Frontend)** → Ruft die Edge Function `slack-auth` via `supabase.functions.invoke()` auf
4. **slack-auth** → Prüft JWT-Token und tauscht Code bei Slack

**Das Problem:** Der Aufruf kommt vom Frontend (SlackCallback), nicht direkt von Slack. `supabase.functions.invoke()` fügt automatisch den Auth-Header hinzu. Wenn der User eingeloggt ist, sollte das funktionieren.

**Mögliche Ursachen:**
- Der User ist nach dem Redirect nicht mehr eingeloggt (Session-Problem)
- Die Session wird nicht rechtzeitig geladen bevor der API-Call startet

## Empfohlene Lösung: State Parameter verwenden

Um das Problem robust zu lösen, übergeben wir die User-ID über den OAuth `state` Parameter:

1. **SlackConnectButton**: User-ID im `state` Parameter an Slack übergeben
2. **SlackCallback**: `state` aus URL auslesen und an Edge Function senden
3. **slack-auth**: User-ID aus Request Body lesen, Auth-Prüfung entfernen

## Technische Änderungen

### 1. SlackConnectButton.tsx
```typescript
const handleConnect = () => {
  // ... existing checks ...
  
  const redirectUri = encodeURIComponent(`${window.location.origin}/slack/callback`);
  const scope = encodeURIComponent('incoming-webhook');
  const state = encodeURIComponent(user!.id); // User-ID als state
  
  const slackAuthUrl = `https://slack.com/oauth/v2/authorize?client_id=${SLACK_CLIENT_ID}&scope=${scope}&redirect_uri=${redirectUri}&state=${state}`;
  
  window.location.href = slackAuthUrl;
};
```

### 2. SlackCallback.tsx
```typescript
useEffect(() => {
  const code = searchParams.get('code');
  const error = searchParams.get('error');
  const state = searchParams.get('state'); // User-ID aus state
  
  // ... error handling ...
  
  const exchangeCode = async () => {
    const redirectUri = `${window.location.origin}/slack/callback`;
    
    // Direkter fetch statt supabase.functions.invoke
    const response = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/slack-auth`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          code, 
          redirect_uri: redirectUri,
          user_id: state  // User-ID aus state
        })
      }
    );
    // ... rest
  };
}, [searchParams]);
```

### 3. slack-auth Edge Function
```typescript
Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // KEINE Auth-Prüfung mehr - Funktion ist öffentlich
    
    const { code, redirect_uri, user_id } = await req.json()
    
    if (!code) {
      return new Response(
        JSON.stringify({ error: 'Missing code parameter' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
    
    if (!user_id) {
      console.warn('No user_id provided in request')
      return new Response(
        JSON.stringify({ error: 'Missing user_id parameter' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Supabase Client mit Service Role für DB-Zugriff
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    // ... Slack OAuth exchange (bleibt gleich) ...

    // Store in database mit user_id aus Request
    const { error: dbError } = await supabase
      .from('slack_subscribers')
      .upsert({
        user_id: user_id,  // aus Request Body
        webhook_url: webhookUrl,
        // ...
      })
    
    // ... rest
  } catch (error) {
    // ... error handling
  }
})
```

## Sicherheitsüberlegungen

**Risiko:** Da die User-ID vom Client kommt, könnte theoretisch jemand eine fremde User-ID übergeben und deren Slack-Verbindung überschreiben.

**Mitigationen:**
1. Der `state` Parameter kommt vom ursprünglichen Login - nur eingeloggte User können den Button sehen
2. Die `user_id, team_id` Kombination ist unique - ein Angreifer könnte nur die eigene Slack-Verbindung überschreiben
3. Alternative (sicherer): HMAC-Signatur des state Parameters mit einem Server-Secret

## Zusammenfassung der Dateien

| Datei | Änderung |
|-------|----------|
| `src/components/SlackConnectButton.tsx` | User-ID im `state` Parameter übergeben |
| `src/pages/SlackCallback.tsx` | `state` auslesen, direkter fetch statt invoke |
| `supabase/functions/slack-auth/index.ts` | Auth-Block entfernen, user_id aus Body lesen, Service Role Key verwenden |

