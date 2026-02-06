import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';

export default function SlackCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const [details, setDetails] = useState<{ teamName?: string; channel?: string }>({});

  useEffect(() => {
    const code = searchParams.get('code');
    const error = searchParams.get('error');
    const state = searchParams.get('state'); // User-ID aus state Parameter

    if (error) {
      setStatus('error');
      setMessage('Slack-Autorisierung wurde abgebrochen.');
      return;
    }

    if (!code) {
      setStatus('error');
      setMessage('Kein Autorisierungscode erhalten.');
      return;
    }

    if (!state) {
      setStatus('error');
      setMessage('Fehlende User-Identifikation.');
      return;
    }

    // Exchange code for webhook - direkter fetch ohne Auth-Header
    const exchangeCode = async () => {
      try {
        const redirectUri = `${window.location.origin}/slack/callback`;
        
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

        const data = await response.json();

        if (!response.ok) {
          console.error('Edge function error:', data);
          setStatus('error');
          setMessage(data?.error || 'Verbindung fehlgeschlagen.');
          return;
        }

        if (data?.success) {
          setStatus('success');
          setMessage('Slack erfolgreich verbunden!');
          setDetails({
            teamName: data.team_name,
            channel: data.channel
          });
        } else {
          setStatus('error');
          setMessage(data?.error || 'Unbekannter Fehler');
        }
      } catch (err) {
        console.error('Unexpected error:', err);
        setStatus('error');
        setMessage('Ein unerwarteter Fehler ist aufgetreten.');
      }
    };

    exchangeCode();
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20 pb-16">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto text-center">
            {status === 'loading' && (
              <>
                <Loader2 className="w-16 h-16 mx-auto text-primary animate-spin mb-6" />
                <h1 className="text-2xl font-bold mb-2">Verbinde mit Slack...</h1>
                <p className="text-muted-foreground">Bitte warten Sie einen Moment.</p>
              </>
            )}

            {status === 'success' && (
              <>
                <CheckCircle className="w-16 h-16 mx-auto text-primary mb-6" />
                <h1 className="text-2xl font-bold mb-2">{message}</h1>
                {details.teamName && (
                  <p className="text-muted-foreground mb-2">
                    Workspace: <span className="font-medium">{details.teamName}</span>
                  </p>
                )}
                {details.channel && (
                  <p className="text-muted-foreground mb-6">
                    Channel: <span className="font-medium">{details.channel}</span>
                  </p>
                )}
                <p className="text-muted-foreground mb-6">
                  Du erhältst jetzt Benachrichtigungen über neue Podcast-Folgen.
                </p>
                <Button onClick={() => navigate('/')}>
                  Zurück zur Startseite
                </Button>
              </>
            )}

            {status === 'error' && (
              <>
                <XCircle className="w-16 h-16 mx-auto text-destructive mb-6" />
                <h1 className="text-2xl font-bold mb-2">Verbindung fehlgeschlagen</h1>
                <p className="text-muted-foreground mb-6">{message}</p>
                <div className="flex gap-4 justify-center">
                  <Button variant="outline" onClick={() => navigate('/')}>
                    Zurück zur Startseite
                  </Button>
                  <Button onClick={() => window.location.href = '/'}>
                    Erneut versuchen
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
