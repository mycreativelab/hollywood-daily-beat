import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

const Datenschutz = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-20">
        <div className="max-w-3xl mx-auto">
          <h1 className="font-display text-4xl font-bold text-foreground mb-8">Datenschutzerklärung</h1>
          
          <div className="prose prose-invert max-w-none space-y-8">
            <section>
              <h2 className="font-display text-2xl font-semibold text-foreground mb-4">1. Datenschutz auf einen Blick</h2>
              
              <h3 className="font-display text-xl font-semibold text-foreground mb-3 mt-6">Allgemeine Hinweise</h3>
              <p className="text-muted-foreground">
                Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen Daten 
                passiert, wenn Sie diese Website besuchen. Personenbezogene Daten sind alle Daten, mit denen Sie 
                persönlich identifiziert werden können. Ausführliche Informationen zum Thema Datenschutz entnehmen 
                Sie unserer unter diesem Text aufgeführten Datenschutzerklärung.
              </p>

              <h3 className="font-display text-xl font-semibold text-foreground mb-3 mt-6">Datenerfassung auf dieser Website</h3>
              <p className="text-muted-foreground">
                <strong className="text-foreground">Wer ist verantwortlich für die Datenerfassung auf dieser Website?</strong><br />
                Die Datenverarbeitung auf dieser Website erfolgt durch den Websitebetreiber. Dessen Kontaktdaten 
                können Sie dem Impressum dieser Website entnehmen.
              </p>
              <p className="text-muted-foreground mt-4">
                <strong className="text-foreground">Wie erfassen wir Ihre Daten?</strong><br />
                Ihre Daten werden zum einen dadurch erhoben, dass Sie uns diese mitteilen. Hierbei kann es sich z.B. 
                um Daten handeln, die Sie in ein Kontaktformular eingeben. Andere Daten werden automatisch oder nach 
                Ihrer Einwilligung beim Besuch der Website durch unsere IT-Systeme erfasst. Das sind vor allem technische 
                Daten (z.B. Internetbrowser, Betriebssystem oder Uhrzeit des Seitenaufrufs).
              </p>
              <p className="text-muted-foreground mt-4">
                <strong className="text-foreground">Wofür nutzen wir Ihre Daten?</strong><br />
                Ein Teil der Daten wird erhoben, um eine fehlerfreie Bereitstellung der Website zu gewährleisten. 
                Andere Daten können zur Analyse Ihres Nutzerverhaltens verwendet werden.
              </p>
              <p className="text-muted-foreground mt-4">
                <strong className="text-foreground">Welche Rechte haben Sie bezüglich Ihrer Daten?</strong><br />
                Sie haben jederzeit das Recht, unentgeltlich Auskunft über Herkunft, Empfänger und Zweck Ihrer 
                gespeicherten personenbezogenen Daten zu erhalten. Sie haben außerdem ein Recht, die Berichtigung 
                oder Löschung dieser Daten zu verlangen. Wenn Sie eine Einwilligung zur Datenverarbeitung erteilt 
                haben, können Sie diese Einwilligung jederzeit für die Zukunft widerrufen. Außerdem haben Sie das Recht, 
                unter bestimmten Umständen die Einschränkung der Verarbeitung Ihrer personenbezogenen Daten zu verlangen.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl font-semibold text-foreground mb-4">2. Hosting</h2>
              <p className="text-muted-foreground">
                Wir hosten die Inhalte unserer Website bei folgendem Anbieter:
              </p>
              <h3 className="font-display text-xl font-semibold text-foreground mb-3 mt-6">Externes Hosting</h3>
              <p className="text-muted-foreground">
                Diese Website wird extern gehostet. Die personenbezogenen Daten, die auf dieser Website erfasst werden, 
                werden auf den Servern des Hosters gespeichert. Hierbei kann es sich v.a. um IP-Adressen, Kontaktanfragen, 
                Meta- und Kommunikationsdaten, Vertragsdaten, Kontaktdaten, Namen, Websitezugriffe und sonstige Daten, 
                die über eine Website generiert werden, handeln.
              </p>
              <p className="text-muted-foreground mt-4">
                Das externe Hosting erfolgt zum Zwecke der Vertragserfüllung gegenüber unseren potenziellen und 
                bestehenden Kunden (Art. 6 Abs. 1 lit. b DSGVO) und im Interesse einer sicheren, schnellen und 
                effizienten Bereitstellung unseres Online-Angebots durch einen professionellen Anbieter (Art. 6 Abs. 1 lit. f DSGVO).
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl font-semibold text-foreground mb-4">3. Allgemeine Hinweise und Pflichtinformationen</h2>
              
              <h3 className="font-display text-xl font-semibold text-foreground mb-3 mt-6">Datenschutz</h3>
              <p className="text-muted-foreground">
                Die Betreiber dieser Seiten nehmen den Schutz Ihrer persönlichen Daten sehr ernst. Wir behandeln Ihre 
                personenbezogenen Daten vertraulich und entsprechend den gesetzlichen Datenschutzvorschriften sowie 
                dieser Datenschutzerklärung.
              </p>

              <h3 className="font-display text-xl font-semibold text-foreground mb-3 mt-6">Hinweis zur verantwortlichen Stelle</h3>
              <p className="text-muted-foreground">
                Die verantwortliche Stelle für die Datenverarbeitung auf dieser Website ist:<br /><br />
                mycreativelab<br />
                Max Mustermann<br />
                Musterstraße 123<br />
                12345 Musterstadt<br /><br />
                E-Mail: hello@mycreativelab.com
              </p>
              <p className="text-muted-foreground mt-4">
                Verantwortliche Stelle ist die natürliche oder juristische Person, die allein oder gemeinsam mit anderen 
                über die Zwecke und Mittel der Verarbeitung von personenbezogenen Daten entscheidet.
              </p>

              <h3 className="font-display text-xl font-semibold text-foreground mb-3 mt-6">Speicherdauer</h3>
              <p className="text-muted-foreground">
                Soweit innerhalb dieser Datenschutzerklärung keine speziellere Speicherdauer genannt wurde, verbleiben 
                Ihre personenbezogenen Daten bei uns, bis der Zweck für die Datenverarbeitung entfällt. Wenn Sie ein 
                berechtigtes Löschersuchen geltend machen oder eine Einwilligung zur Datenverarbeitung widerrufen, 
                werden Ihre Daten gelöscht, sofern wir keine anderen rechtlich zulässigen Gründe für die Speicherung 
                Ihrer personenbezogenen Daten haben.
              </p>

              <h3 className="font-display text-xl font-semibold text-foreground mb-3 mt-6">Widerruf Ihrer Einwilligung zur Datenverarbeitung</h3>
              <p className="text-muted-foreground">
                Viele Datenverarbeitungsvorgänge sind nur mit Ihrer ausdrücklichen Einwilligung möglich. Sie können eine 
                bereits erteilte Einwilligung jederzeit widerrufen. Die Rechtmäßigkeit der bis zum Widerruf erfolgten 
                Datenverarbeitung bleibt vom Widerruf unberührt.
              </p>

              <h3 className="font-display text-xl font-semibold text-foreground mb-3 mt-6">Recht auf Datenübertragbarkeit</h3>
              <p className="text-muted-foreground">
                Sie haben das Recht, Daten, die wir auf Grundlage Ihrer Einwilligung oder in Erfüllung eines Vertrags 
                automatisiert verarbeiten, an sich oder an einen Dritten in einem gängigen, maschinenlesbaren Format 
                aushändigen zu lassen. Sofern Sie die direkte Übertragung der Daten an einen anderen Verantwortlichen 
                verlangen, erfolgt dies nur, soweit es technisch machbar ist.
              </p>

              <h3 className="font-display text-xl font-semibold text-foreground mb-3 mt-6">Auskunft, Löschung und Berichtigung</h3>
              <p className="text-muted-foreground">
                Sie haben im Rahmen der geltenden gesetzlichen Bestimmungen jederzeit das Recht auf unentgeltliche 
                Auskunft über Ihre gespeicherten personenbezogenen Daten, deren Herkunft und Empfänger und den Zweck 
                der Datenverarbeitung und ggf. ein Recht auf Berichtigung oder Löschung dieser Daten.
              </p>

              <h3 className="font-display text-xl font-semibold text-foreground mb-3 mt-6">Recht auf Einschränkung der Verarbeitung</h3>
              <p className="text-muted-foreground">
                Sie haben das Recht, die Einschränkung der Verarbeitung Ihrer personenbezogenen Daten zu verlangen.
              </p>

              <h3 className="font-display text-xl font-semibold text-foreground mb-3 mt-6">Beschwerderecht bei der zuständigen Aufsichtsbehörde</h3>
              <p className="text-muted-foreground">
                Im Falle von Verstößen gegen die DSGVO steht den Betroffenen ein Beschwerderecht bei einer 
                Aufsichtsbehörde zu.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl font-semibold text-foreground mb-4">4. Datenerfassung auf dieser Website</h2>
              
              <h3 className="font-display text-xl font-semibold text-foreground mb-3 mt-6">Server-Log-Dateien</h3>
              <p className="text-muted-foreground">
                Der Provider der Seiten erhebt und speichert automatisch Informationen in so genannten Server-Log-Dateien, 
                die Ihr Browser automatisch an uns übermittelt. Dies sind:
              </p>
              <ul className="text-muted-foreground list-disc list-inside mt-2 space-y-1">
                <li>Browsertyp und Browserversion</li>
                <li>verwendetes Betriebssystem</li>
                <li>Referrer URL</li>
                <li>Hostname des zugreifenden Rechners</li>
                <li>Uhrzeit der Serveranfrage</li>
                <li>IP-Adresse</li>
              </ul>
              <p className="text-muted-foreground mt-4">
                Eine Zusammenführung dieser Daten mit anderen Datenquellen wird nicht vorgenommen. Die Erfassung dieser 
                Daten erfolgt auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO.
              </p>

              <h3 className="font-display text-xl font-semibold text-foreground mb-3 mt-6">Anfrage per E-Mail</h3>
              <p className="text-muted-foreground">
                Wenn Sie uns per E-Mail kontaktieren, wird Ihre Anfrage inklusive aller daraus hervorgehenden 
                personenbezogenen Daten (Name, Anfrage) zum Zwecke der Bearbeitung Ihres Anliegens bei uns gespeichert 
                und verarbeitet. Diese Daten geben wir nicht ohne Ihre Einwilligung weiter.
              </p>
              <p className="text-muted-foreground mt-4">
                Die Verarbeitung dieser Daten erfolgt auf Grundlage von Art. 6 Abs. 1 lit. b DSGVO, sofern Ihre Anfrage 
                mit der Erfüllung eines Vertrags zusammenhängt oder zur Durchführung vorvertraglicher Maßnahmen 
                erforderlich ist. In allen übrigen Fällen beruht die Verarbeitung auf unserem berechtigten Interesse 
                an der effektiven Bearbeitung der an uns gerichteten Anfragen (Art. 6 Abs. 1 lit. f DSGVO).
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl font-semibold text-foreground mb-4">5. Audio-Streaming</h2>
              <p className="text-muted-foreground">
                Auf unserer Website bieten wir Podcasts zum Streaming an. Die Audio-Dateien werden von externen 
                Servern geladen. Beim Abspielen eines Podcasts wird Ihre IP-Adresse an den jeweiligen Server übermittelt. 
                Dies ist technisch notwendig, um die Audio-Inhalte an Ihr Endgerät zu übertragen.
              </p>
              <p className="text-muted-foreground mt-4">
                Die Nutzung erfolgt auf Grundlage unseres berechtigten Interesses an der Bereitstellung unserer 
                Podcast-Inhalte (Art. 6 Abs. 1 lit. f DSGVO).
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl font-semibold text-foreground mb-4">6. Benutzerkonten</h2>
              <p className="text-muted-foreground">
                Auf unserer Website haben Sie die Möglichkeit, ein Benutzerkonto anzulegen. Dabei werden die von Ihnen 
                angegebenen Daten (z.B. E-Mail-Adresse, Name) gespeichert. Diese Daten werden für die Verwaltung Ihres 
                Kontos und zur Bereitstellung unserer Dienste verwendet.
              </p>
              <p className="text-muted-foreground mt-4">
                Die Verarbeitung erfolgt auf Grundlage Ihrer Einwilligung (Art. 6 Abs. 1 lit. a DSGVO) sowie zur 
                Vertragserfüllung (Art. 6 Abs. 1 lit. b DSGVO). Sie können Ihr Benutzerkonto jederzeit löschen lassen.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl font-semibold text-foreground mb-4">7. Änderungen dieser Datenschutzerklärung</h2>
              <p className="text-muted-foreground">
                Wir behalten uns vor, diese Datenschutzerklärung anzupassen, damit sie stets den aktuellen rechtlichen 
                Anforderungen entspricht oder um Änderungen unserer Leistungen in der Datenschutzerklärung umzusetzen. 
                Für Ihren erneuten Besuch gilt dann die neue Datenschutzerklärung.
              </p>
            </section>

            <p className="text-muted-foreground text-sm mt-12 pt-8 border-t border-border/30">
              Stand: Januar 2025
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Datenschutz;
