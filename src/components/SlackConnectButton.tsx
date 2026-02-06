import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { MessageSquare, Check, Loader2, X } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const SLACK_CLIENT_ID = '1044907775315.10459082290148';

interface SlackConnectButtonProps {
  className?: string;
}

export function SlackConnectButton({ className }: SlackConnectButtonProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [subscription, setSubscription] = useState<{ team_name?: string; channel?: string } | null>(null);

  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    checkConnection();
  }, [user]);

  const checkConnection = async () => {
    try {
      const { data, error } = await supabase
        .from('slack_subscribers')
        .select('team_name, channel')
        .eq('user_id', user!.id)
        .maybeSingle();

      if (error) {
        console.error('Error checking Slack connection:', error);
      } else if (data) {
        setIsConnected(true);
        setSubscription(data);
      }
    } catch (err) {
      console.error('Unexpected error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConnect = () => {
    if (!SLACK_CLIENT_ID) {
      toast({
        title: 'Konfigurationsfehler',
        description: 'Slack Client ID ist nicht konfiguriert.',
        variant: 'destructive'
      });
      return;
    }

    const redirectUri = encodeURIComponent(`${window.location.origin}/slack/callback`);
    const scope = encodeURIComponent('incoming-webhook');
    const state = encodeURIComponent(user!.id); // User-ID als state Parameter
    
    const slackAuthUrl = `https://slack.com/oauth/v2/authorize?client_id=${SLACK_CLIENT_ID}&scope=${scope}&redirect_uri=${redirectUri}&state=${state}`;
    
    window.location.href = slackAuthUrl;
  };

  const handleDisconnect = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('slack_subscribers')
        .delete()
        .eq('user_id', user.id);

      if (error) {
        toast({
          title: 'Fehler',
          description: 'Konnte Verbindung nicht trennen.',
          variant: 'destructive'
        });
      } else {
        setIsConnected(false);
        setSubscription(null);
        toast({
          title: 'Verbindung getrennt',
          description: 'Du erhältst keine Slack-Benachrichtigungen mehr.'
        });
      }
    } catch (err) {
      console.error('Error disconnecting:', err);
    }
  };

  if (!user) {
    return null;
  }

  if (isLoading) {
    return (
      <Button variant="outline" disabled className={className}>
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        Lade...
      </Button>
    );
  }

  if (isConnected) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Check className="w-4 h-4 text-primary" />
          <span>
            Slack verbunden
            {subscription?.channel && ` (#${subscription.channel})`}
          </span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDisconnect}
          className="text-muted-foreground hover:text-destructive"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
    );
  }

  return (
    <Button
      onClick={handleConnect}
      variant="outline"
      className={className}
    >
      <MessageSquare className="w-4 h-4 mr-2" />
      Mit Slack verbinden
    </Button>
  );
}
