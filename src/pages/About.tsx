import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Mic2, Users, Globe, Heart } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function About() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 pb-12">
        {/* Hero */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-6xl font-display font-bold text-foreground mb-6">
                {t.about.aboutUs} <span className="text-gradient">mycreativelab</span>
              </h1>
              <p className="text-xl text-muted-foreground">
                {t.about.aboutDescription}
              </p>
            </div>
          </div>
        </section>

        {/* Mission */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                  <h2 className="text-3xl font-display font-bold text-foreground mb-4">
                    {t.about.mission}
                  </h2>
                  <p className="text-muted-foreground mb-4">
                    {t.about.missionText}
                  </p>
                </div>
                <div className="flex justify-center">
                  <div className="w-48 h-48 bg-gradient-hero rounded-3xl flex items-center justify-center shadow-glow animate-float">
                    <Mic2 className="w-24 h-24 text-primary-foreground" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="text-center p-6">
                <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-2xl flex items-center justify-center">
                  <Users className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-display font-semibold text-foreground mb-2">{t.about.dailyContent}</h3>
                <p className="text-muted-foreground text-sm">
                  {t.about.dailyContentText}
                </p>
              </div>
              
              <div className="text-center p-6">
                <div className="w-16 h-16 mx-auto mb-4 bg-secondary/20 rounded-2xl flex items-center justify-center">
                  <Globe className="w-8 h-8 text-secondary" />
                </div>
                <h3 className="font-display font-semibold text-foreground mb-2">{t.about.expertInsights}</h3>
                <p className="text-muted-foreground text-sm">
                  {t.about.expertInsightsText}
                </p>
              </div>
              
              <div className="text-center p-6">
                <div className="w-16 h-16 mx-auto mb-4 bg-accent/20 rounded-2xl flex items-center justify-center">
                  <Heart className="w-8 h-8 text-accent" />
                </div>
                <h3 className="font-display font-semibold text-foreground mb-2">{t.about.creativeStories}</h3>
                <p className="text-muted-foreground text-sm">
                  {t.about.creativeStoriesText}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Future */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-3xl font-display font-bold text-foreground mb-4">
                {t.about.comingSoon}
              </h2>
              <p className="text-muted-foreground mb-6">
                {t.about.newChannels}
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <span className="px-4 py-2 bg-card border border-border rounded-full text-sm font-medium">
                  🇩🇪 German Film News
                </span>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
