import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';

export default function SlackCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { session, loading: authLoading } = useAuth();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const [details, setDetails] = useState<{ teamName?: string; channel?: string }>({});

  useEffect(() => {
    const code = searchParams.get('code');
    const error = searchParams.get('error');

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

    if (authLoading) return;

    if (!session) {
      setStatus('error');
      setMessage('Du musst eingeloggt sein, um Slack zu verbinden.');
      return;
    }

    // Exchange code for webhook
    const exchangeCode = async () => {
      try {
        const redirectUri = `${window.location.origin}/slack/callback`;
        
        const { data, error } = await supabase.functions.invoke('slack-auth', {
          body: { code, redirect_uri: redirectUri }
        });

        if (error) {
          console.error('Edge function error:', error);
          setStatus('error');
          setMessage(error.message || 'Verbindung fehlgeschlagen.');
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
  }, [searchParams, session, authLoading]);

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
