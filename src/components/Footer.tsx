import { Link } from 'react-router-dom';
import { Mic2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-card border-t border-border/30 py-20 relative overflow-hidden">
      {/* Decorative gradient */}
      <div className="absolute -bottom-1/2 -left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[150px]" />
      
      <div className="container mx-auto px-4 relative">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-orange rounded-lg flex items-center justify-center shadow-glow-sm">
                <Mic2 className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="font-display font-bold text-2xl text-foreground">
                mycreativelab
              </span>
            </Link>
            <p className="text-muted-foreground max-w-sm leading-relaxed">
              {t.footer.description}
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="font-display font-semibold text-foreground mb-4">{t.footer.navigation}</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">
                  {t.nav.home}
                </Link>
              </li>
              <li>
                <Link to="/podcasts" className="text-muted-foreground hover:text-primary transition-colors">
                  {t.nav.podcasts}
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-muted-foreground hover:text-primary transition-colors">
                  {t.footer.aboutUs}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-display font-semibold text-foreground mb-4">{t.footer.contact}</h3>
            <ul className="space-y-3">
              <li>
                <a href="mailto:hello@mycreativelab.de" className="text-muted-foreground hover:text-primary transition-colors">
                  hello@mycreativelab.de
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border/30 mt-16 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} mycreativelab. {t.footer.allRightsReserved}
          </p>
          <div className="flex gap-6">
            <Link to="/datenschutz" className="text-muted-foreground hover:text-primary text-sm transition-colors">
              Datenschutz
            </Link>
            <Link to="/impressum" className="text-muted-foreground hover:text-primary text-sm transition-colors">
              Impressum
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
