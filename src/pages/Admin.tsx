import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Check, X, ArrowLeft, Users, Shield } from 'lucide-react';
import { Header } from '@/components/Header';

interface UserWithProfile {
  id: string;
  user_id: string;
  display_name: string | null;
  is_approved: boolean;
  created_at: string;
  email?: string;
}

export default function Admin() {
  const { user } = useAuth();
  const { isAdmin, loading: profileLoading } = useUserProfile();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [users, setUsers] = useState<UserWithProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!profileLoading && !isAdmin) {
      navigate('/podcasts');
    }
  }, [isAdmin, profileLoading, navigate]);

  useEffect(() => {
    if (isAdmin) {
      fetchUsers();
    }
  }, [isAdmin]);

  const fetchUsers = async () => {
    setLoading(true);
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
      </main>
    </div>
  );
}
