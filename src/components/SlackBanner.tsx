import { useState, useEffect } from 'react';
import { X, Bell } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';

const SLACK_CLIENT_ID = '10449077755315.10459082290148';
const STORAGE_KEY = 'slack-banner-dismissed';

export function SlackBanner() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [isDismissed, setIsDismissed] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check localStorage for dismissed state
    const dismissed = localStorage.getItem(STORAGE_KEY);
    setIsDismissed(dismissed === 'true');
  }, []);

  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    // Check if user has Slack connection
    const checkConnection = async () => {
      const { data } = await supabase
        .from('slack_subscribers')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();
      
      setIsConnected(!!data);
      setIsLoading(false);
    };

    checkConnection();
  }, [user]);

  const handleDismiss = () => {
    localStorage.setItem(STORAGE_KEY, 'true');
    setIsDismissed(true);
  };

  const getSlackUrl = () => {
    const redirectUri = encodeURIComponent(`${window.location.origin}/slack/callback`);
    const state = encodeURIComponent(user?.id || '');
    return `https://slack.com/oauth/v2/authorize?client_id=${SLACK_CLIENT_ID}&scope=incoming-webhook&redirect_uri=${redirectUri}&state=${state}`;
  };

  // Don't show banner if: not logged in, already connected, dismissed, or loading
  if (!user || isConnected || isDismissed || isLoading) {
    return null;
  }

  return (
    <div className="fixed top-20 left-0 right-0 z-40 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 border-b border-primary/20 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1">
            <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
              <Bell className="w-4 h-4 text-primary" />
            </div>
            <p className="text-sm text-foreground/80">
              {t.slack.bannerText}
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <a
              href={getSlackUrl()}
              className="flex-shrink-0 hover:opacity-90 transition-opacity"
            >
              <img
                alt="Add to Slack"
                height="40"
                width="139"
                src="https://platform.slack-edge.com/img/add_to_slack.png"
                srcSet="https://platform.slack-edge.com/img/add_to_slack.png 1x, https://platform.slack-edge.com/img/add_to_slack@2x.png 2x"
              />
            </a>
            
            <button
              onClick={handleDismiss}
              className="p-1.5 rounded-full hover:bg-foreground/10 transition-colors text-muted-foreground hover:text-foreground"
              aria-label="Banner schließen"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
