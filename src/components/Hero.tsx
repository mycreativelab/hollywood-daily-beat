import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Play, Headphones } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export function Hero() {
  const { user } = useAuth();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-muted via-background to-muted/50" />
      <div className="absolute top-20 right-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute bottom-20 left-20 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse-slow" />
      
      <div className="container relative z-10 mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8 animate-slide-up">
            <Headphones className="w-4 h-4" />
            <span>Daily Hollywood Film News</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-display font-bold mb-6 animate-slide-up-delay-1">
            Your Creative
            <span className="text-gradient block mt-2">Podcast Hub</span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-slide-up-delay-2">
            Stay updated with the latest Hollywood film news, exclusive interviews, 
            and behind-the-scenes content. New episodes daily.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up-delay-3">
            {user ? (
              <Button 
                asChild
                size="lg" 
                className="bg-gradient-hero hover:opacity-90 transition-opacity shadow-glow px-8"
              >
                <Link to="/podcasts" className="flex items-center gap-2">
                  <Play className="w-5 h-5" />
                  Browse Episodes
                </Link>
              </Button>
            ) : (
              <>
                <Button 
                  asChild
                  size="lg" 
                  className="bg-gradient-hero hover:opacity-90 transition-opacity shadow-glow px-8"
                >
                  <Link to="/auth" className="flex items-center gap-2">
                    <Play className="w-5 h-5" />
                    Start Listening
                  </Link>
                </Button>
                <Button 
                  asChild
                  variant="outline" 
                  size="lg"
                  className="border-border hover:bg-muted"
                >
                  <Link to="/about">Learn More</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Decorative floating elements */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-muted-foreground/30 rounded-full flex items-start justify-center p-2">
          <div className="w-1 h-2 bg-muted-foreground/50 rounded-full" />
        </div>
      </div>
    </section>
  );
}
