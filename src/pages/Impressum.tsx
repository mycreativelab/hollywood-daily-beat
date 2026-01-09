import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

const Impressum = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-20">
        <div className="max-w-3xl mx-auto">
          <h1 className="font-display text-4xl font-bold text-foreground mb-8">Impressum</h1>
          
          <div className="prose prose-invert max-w-none space-y-8">
            <section>
              <h2 className="font-display text-2xl font-semibold text-foreground mb-4">Angaben gemäß § 5 TMG</h2>
              <p className="text-muted-foreground">
                mycreativelab<br />
                Max Mustermann<br />
                Musterstraße 123<br />
                12345 Musterstadt<br />
                Deutschland
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl font-semibold text-foreground mb-4">Kontakt</h2>
              <p className="text-muted-foreground">
                E-Mail: hello@mycreativelab.de
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl font-semibold text-foreground mb-4">Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV</h2>
              <p className="text-muted-foreground">
                Max Mustermann<br />
                Musterstraße 123<br />
                12345 Musterstadt
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl font-semibold text-foreground mb-4">EU-Streitschlichtung</h2>
              <p className="text-muted-foreground">
                Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:{' '}
                <a 
                  href="https://ec.europa.eu/consumers/odr/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  https://ec.europa.eu/consumers/odr/
                </a>
                <br />
                Unsere E-Mail-Adresse finden Sie oben im Impressum.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl font-semibold text-foreground mb-4">Verbraucherstreitbeilegung/Universalschlichtungsstelle</h2>
              <p className="text-muted-foreground">
                Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer 
                Verbraucherschlichtungsstelle teilzunehmen.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl font-semibold text-foreground mb-4">Haftung für Inhalte</h2>
              <p className="text-muted-foreground">
                Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten nach den 
                allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht 
                unter der Verpflichtung, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen 
                zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.
              </p>
              <p className="text-muted-foreground mt-4">
                Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den allgemeinen 
                Gesetzen bleiben hiervon unberührt. Eine diesbezügliche Haftung ist jedoch erst ab dem Zeitpunkt 
                der Kenntnis einer konkreten Rechtsverletzung möglich. Bei Bekanntwerden von entsprechenden 
                Rechtsverletzungen werden wir diese Inhalte umgehend entfernen.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl font-semibold text-foreground mb-4">Haftung für Links</h2>
              <p className="text-muted-foreground">
                Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. 
                Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der 
                verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich. Die verlinkten 
                Seiten wurden zum Zeitpunkt der Verlinkung auf mögliche Rechtsverstöße überprüft. Rechtswidrige Inhalte 
                waren zum Zeitpunkt der Verlinkung nicht erkennbar.
              </p>
              <p className="text-muted-foreground mt-4">
                Eine permanente inhaltliche Kontrolle der verlinkten Seiten ist jedoch ohne konkrete Anhaltspunkte 
                einer Rechtsverletzung nicht zumutbar. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige 
                Links umgehend entfernen.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl font-semibold text-foreground mb-4">Urheberrecht</h2>
              <p className="text-muted-foreground">
                Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen 
                Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der 
                Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers. 
                Downloads und Kopien dieser Seite sind nur für den privaten, nicht kommerziellen Gebrauch gestattet.
              </p>
              <p className="text-muted-foreground mt-4">
                Soweit die Inhalte auf dieser Seite nicht vom Betreiber erstellt wurden, werden die Urheberrechte Dritter 
                beachtet. Insbesondere werden Inhalte Dritter als solche gekennzeichnet. Sollten Sie trotzdem auf eine 
                Urheberrechtsverletzung aufmerksam werden, bitten wir um einen entsprechenden Hinweis. Bei Bekanntwerden 
                von Rechtsverletzungen werden wir derartige Inhalte umgehend entfernen.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Impressum;
