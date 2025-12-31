import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Clock, LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export default function PendingApproval() {
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
          <Clock className="w-10 h-10 text-primary" />
        </div>
        
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-foreground">
            Freigabe ausstehend
          </h1>
          <p className="text-muted-foreground">
            Dein Konto wurde erstellt und wartet auf Freigabe durch einen Administrator. 
            Du erhältst Zugang sobald dein Konto freigeschaltet wurde.
          </p>
        </div>

        <div className="pt-4">
          <Button 
            variant="outline" 
            onClick={handleSignOut}
            className="gap-2"
          >
            <LogOut className="w-4 h-4" />
            Abmelden
          </Button>
        </div>
      </div>
    </div>
  );
}
