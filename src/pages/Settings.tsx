import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Bell, CheckCircle, Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const SLACK_CLIENT_ID = '10449077755315.10459082290148';

export default function Settings() {
  const { user, loading: authLoading } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [slackConnection, setSlackConnection] = useState<{
    channel: string | null;
    team_name: string | null;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDisconnecting, setIsDisconnecting] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!user) return;

    const fetchSlackConnection = async () => {
      const { data } = await supabase
        .from('slack_subscribers')
        .select('channel, team_name')
        .eq('user_id', user.id)
        .maybeSingle();
      
      setSlackConnection(data);
      setIsLoading(false);
    };

    fetchSlackConnection();
  }, [user]);

  const handleDisconnect = async () => {
    if (!user) return;
    
    setIsDisconnecting(true);
    
    const { error } = await supabase
      .from('slack_subscribers')
      .delete()
      .eq('user_id', user.id);

    if (error) {
      toast({
        title: t.slack.disconnectError,
        variant: 'destructive',
      });
    } else {
      setSlackConnection(null);
      toast({
        title: t.slack.disconnected,
      });
    }
    
    setIsDisconnecting(false);
  };

  const getSlackUrl = () => {
    const redirectUri = encodeURIComponent(`${window.location.origin}/slack/callback`);
    const state = encodeURIComponent(user?.id || '');
    return `https://slack.com/oauth/v2/authorize?client_id=${SLACK_CLIENT_ID}&scope=incoming-webhook&redirect_uri=${redirectUri}&state=${state}`;
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 pt-28 pb-16">
        <div className="container mx-auto px-4 max-w-2xl">
          <h1 className="text-3xl font-display font-bold mb-8">{t.settings.title}</h1>
          
          {/* Notifications Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Bell className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <CardTitle>{t.settings.notifications}</CardTitle>
                  <CardDescription>{t.settings.notificationsDescription}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{t.settings.loading}</span>
                </div>
              ) : slackConnection ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-medium">
                      {t.slack.connected}
                      {slackConnection.channel && ` (${slackConnection.channel})`}
                    </span>
                  </div>
                  {slackConnection.team_name && (
                    <p className="text-sm text-muted-foreground">
                      {t.slack.workspace}: {slackConnection.team_name}
                    </p>
                  )}
                  <Button
                    variant="outline"
                    onClick={handleDisconnect}
                    disabled={isDisconnecting}
                    className="text-destructive hover:text-destructive"
                  >
                    {isDisconnecting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        {t.slack.disconnecting}
                      </>
                    ) : (
                      t.slack.disconnect
                    )}
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-muted-foreground">
                    {t.slack.notConnectedDescription}
                  </p>
                  <a
                    href={getSlackUrl()}
                    className="inline-block hover:opacity-90 transition-opacity"
                  >
                    <img
                      alt="Add to Slack"
                      height="40"
                      width="139"
                      src="https://platform.slack-edge.com/img/add_to_slack.png"
                      srcSet="https://platform.slack-edge.com/img/add_to_slack.png 1x, https://platform.slack-edge.com/img/add_to_slack@2x.png 2x"
                    />
                  </a>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
