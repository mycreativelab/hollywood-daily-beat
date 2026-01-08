import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Check, X, ArrowLeft, Users, Shield, Music, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { Header } from '@/components/Header';

interface UserWithProfile {
  id: string;
  user_id: string;
  display_name: string | null;
  is_approved: boolean;
  created_at: string;
  email?: string;
}

interface Episode {
  id: string;
  title: string;
  audio_url: string | null;
  published_at: string | null;
  podcast: { title: string } | null;
}

interface ValidationResult {
  valid: boolean;
  error?: string;
  normalizedUrl?: string;
  contentType?: string;
}

export default function Admin() {
  const { user } = useAuth();
  const { isAdmin, loading: profileLoading } = useUserProfile();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [users, setUsers] = useState<UserWithProfile[]>([]);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loading, setLoading] = useState(true);
  const [audioUrls, setAudioUrls] = useState<Record<string, string>>({});
  const [validating, setValidating] = useState<Record<string, boolean>>({});
  const [validationResults, setValidationResults] = useState<Record<string, ValidationResult>>({});
  const [saving, setSaving] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!profileLoading && !isAdmin) {
      navigate('/podcasts');
    }
  }, [isAdmin, profileLoading, navigate]);

  useEffect(() => {
    if (isAdmin) {
      fetchUsers();
      fetchEpisodes();
    }
  }, [isAdmin]);

  const fetchUsers = async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching users:', error);
      toast({
        title: 'Fehler',
        description: 'Benutzer konnten nicht geladen werden.',
        variant: 'destructive',
      });
    } else {
      setUsers(data || []);
    }
  };

  const fetchEpisodes = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('episodes')
      .select('id, title, audio_url, published_at, podcast:podcasts(title)')
      .order('published_at', { ascending: false });

    if (error) {
      console.error('Error fetching episodes:', error);
    } else {
      setEpisodes(data || []);
      // Initialize audio URLs
      const urls: Record<string, string> = {};
      (data || []).forEach((ep) => {
        urls[ep.id] = ep.audio_url || '';
      });
      setAudioUrls(urls);
    }
    setLoading(false);
  };

  const handleApproval = async (userId: string, approve: boolean) => {
    const { error } = await supabase
      .from('profiles')
      .update({ is_approved: approve })
      .eq('user_id', userId);

    if (error) {
      toast({
        title: 'Fehler',
        description: `Benutzer konnte nicht ${approve ? 'freigegeben' : 'gesperrt'} werden.`,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Erfolg',
        description: `Benutzer wurde ${approve ? 'freigegeben' : 'gesperrt'}.`,
      });
      fetchUsers();
    }
  };

  const validateAudioUrl = async (episodeId: string) => {
    const url = audioUrls[episodeId];
    if (!url) {
      setValidationResults((prev) => ({
        ...prev,
        [episodeId]: { valid: false, error: 'URL ist leer' },
      }));
      return;
    }

    setValidating((prev) => ({ ...prev, [episodeId]: true }));
    setValidationResults((prev) => ({ ...prev, [episodeId]: undefined as any }));

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/validate-audio-url`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url }),
        }
      );
      const result = await response.json();
      setValidationResults((prev) => ({ ...prev, [episodeId]: result }));
    } catch (error) {
      setValidationResults((prev) => ({
        ...prev,
        [episodeId]: { valid: false, error: 'Validierung fehlgeschlagen' },
      }));
    } finally {
      setValidating((prev) => ({ ...prev, [episodeId]: false }));
    }
  };

  const saveAudioUrl = async (episodeId: string) => {
    const url = audioUrls[episodeId];
    if (!url) return;

    setSaving((prev) => ({ ...prev, [episodeId]: true }));

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-update-episode-audio`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session?.access_token}`,
          },
          body: JSON.stringify({ episodeId, audioUrl: url }),
        }
      );
      const result = await response.json();

      if (result.success) {
        toast({
          title: 'Gespeichert',
          description: 'Audio-URL wurde aktualisiert.',
        });
        setValidationResults((prev) => ({
          ...prev,
          [episodeId]: { valid: true, normalizedUrl: result.normalizedUrl },
        }));
        fetchEpisodes();
      } else {
        toast({
          title: 'Fehler',
          description: result.error || 'Speichern fehlgeschlagen',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Fehler',
        description: 'Speichern fehlgeschlagen',
        variant: 'destructive',
      });
    } finally {
      setSaving((prev) => ({ ...prev, [episodeId]: false }));
    }
  };

  if (profileLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  const pendingUsers = users.filter(u => !u.is_approved);
  const approvedUsers = users.filter(u => u.is_approved);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8 pt-24">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" onClick={() => navigate('/podcasts')}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-primary" />
            <h1 className="text-2xl font-bold">Admin-Bereich</h1>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Pending Users */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Ausstehende Freigaben ({pendingUsers.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {pendingUsers.length === 0 ? (
                <p className="text-muted-foreground text-sm">
                  Keine ausstehenden Freigaben.
                </p>
              ) : (
                <div className="space-y-3">
                  {pendingUsers.map((u) => (
                    <div
                      key={u.id}
                      className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                    >
                      <div>
                        <p className="font-medium">
                          {u.display_name || 'Unbekannt'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(u.created_at).toLocaleDateString('de-DE')}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="default"
                          onClick={() => handleApproval(u.user_id, true)}
                        >
                          <Check className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleApproval(u.user_id, false)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Approved Users */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-500" />
                Freigegebene Nutzer ({approvedUsers.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {approvedUsers.length === 0 ? (
                <p className="text-muted-foreground text-sm">
                  Noch keine freigegebenen Nutzer.
                </p>
              ) : (
                <div className="space-y-3">
                  {approvedUsers.map((u) => (
                    <div
                      key={u.id}
                      className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                    >
                      <div className="flex items-center gap-2">
                        <p className="font-medium">
                          {u.display_name || 'Unbekannt'}
                        </p>
                        <Badge variant="secondary" className="text-xs">
                          Aktiv
                        </Badge>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleApproval(u.user_id, false)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Episodes Section */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Music className="w-5 h-5" />
              Episoden Audio-Links ({episodes.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {episodes.length === 0 ? (
              <p className="text-muted-foreground text-sm">Keine Episoden vorhanden.</p>
            ) : (
              <div className="space-y-4">
                {episodes.map((ep) => {
                  const validation = validationResults[ep.id];
                  const isValidating = validating[ep.id];
                  const isSaving = saving[ep.id];

                  return (
                    <div key={ep.id} className="p-4 bg-muted/50 rounded-lg space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{ep.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {ep.podcast?.title} • {ep.published_at ? new Date(ep.published_at).toLocaleDateString('de-DE') : 'Kein Datum'}
                          </p>
                        </div>
                        {validation && (
                          <Badge variant={validation.valid ? 'default' : 'destructive'}>
                            {validation.valid ? (
                              <><CheckCircle className="w-3 h-3 mr-1" /> OK</>
                            ) : (
                              <><AlertCircle className="w-3 h-3 mr-1" /> Fehler</>
                            )}
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex gap-2">
                        <Input
                          value={audioUrls[ep.id] || ''}
                          onChange={(e) => setAudioUrls((prev) => ({ ...prev, [ep.id]: e.target.value }))}
                          placeholder="Share-Link zur MP3 (z.B. https://cloud.example.de/s/TOKEN/download)"
                          className="flex-1"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => validateAudioUrl(ep.id)}
                          disabled={isValidating}
                        >
                          {isValidating ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Prüfen'}
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => saveAudioUrl(ep.id)}
                          disabled={isSaving}
                        >
                          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Speichern'}
                        </Button>
                      </div>

                      {validation && !validation.valid && (
                        <p className="text-xs text-destructive">{validation.error}</p>
                      )}
                      {validation && validation.valid && validation.normalizedUrl && (
                        <p className="text-xs text-muted-foreground">Normalisierte URL: {validation.normalizedUrl}</p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
