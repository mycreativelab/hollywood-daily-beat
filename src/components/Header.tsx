import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X, Mic2, Shield } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useUserProfile } from '@/hooks/useUserProfile';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const { profile, isAdmin } = useUserProfile();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo with orange accent */}
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-orange rounded-lg flex items-center justify-center shadow-glow-sm">
              <Mic2 className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-xl text-foreground">
              mycreativelab
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors font-medium uppercase text-sm tracking-wider">
              Home
            </Link>
            <Link to="/podcasts" className="text-muted-foreground hover:text-foreground transition-colors font-medium uppercase text-sm tracking-wider">
              Podcasts
            </Link>
            <Link to="/about" className="text-muted-foreground hover:text-foreground transition-colors font-medium uppercase text-sm tracking-wider">
              About
            </Link>
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <>
                {isAdmin && (
                  <Button
                    variant="ghost"
                    size="icon"
                    asChild
                    className="text-primary"
                  >
                    <Link to="/admin">
                      <Shield className="w-5 h-5" />
                    </Link>
                  </Button>
                )}
                <span className="text-sm text-muted-foreground">
                  {profile?.display_name || user.email}
                </span>
                <Button 
                  variant="outline" 
                  onClick={handleSignOut}
                  className="border-primary text-primary hover:bg-primary hover:text-primary-foreground rounded-full"
                >
                  Sign Out
                </Button>
              </>
            ) : (
              <Button 
                asChild
                className="bg-gradient-orange hover:shadow-glow text-primary-foreground rounded-full px-6"
              >
                <Link to="/auth">Subscribe</Link>
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-foreground"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border/50">
            <nav className="flex flex-col gap-4">
              <Link 
                to="/" 
                className="text-muted-foreground hover:text-foreground transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/podcasts" 
                className="text-muted-foreground hover:text-foreground transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Podcasts
              </Link>
              <Link 
                to="/about" 
                className="text-muted-foreground hover:text-foreground transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              {user ? (
                <>
                  <span className="text-sm text-muted-foreground py-2">
                    Hallo, {profile?.display_name || user.email}
                  </span>
                  {isAdmin && (
                    <Link 
                      to="/admin" 
                      className="flex items-center gap-2 text-primary py-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Shield className="w-4 h-4" />
                      Admin
                    </Link>
                  )}
                  <Button
                    variant="outline" 
                    onClick={() => {
                      handleSignOut();
                      setIsMenuOpen(false);
                    }}
                    className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                  >
                    Sign Out
                  </Button>
                </>
              ) : (
                <Button 
                  asChild
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  <Link to="/auth" onClick={() => setIsMenuOpen(false)}>Subscribe</Link>
                </Button>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
