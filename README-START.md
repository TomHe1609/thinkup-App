# ThinkUp.learn – Glass UI 2.0

**Stand: 17. November 2026** · Update für das bestehende Repository `TomHe1609/thinkup-App`.

Dieses Paket ist ein **tatsächlich verwendbares Styling-Update** für die veröffentlichte mobile App, keine neue App und kein frei erfundener Prototyp. Es hält die vier bestehenden Menüpunkte **Lernpfad · Lernkarten · Fehlertraining · Fortschritt**, die echte M01–M09-Struktur, den **geschwungenen Pfad mit runden Lernstations-Buttons**, Quizlogik, Fehlertraining, Übungskarten, Tagesrunde, Prüfungsmodus, Fortschritt und lokale Speicherstände bei.

## Was ändert sich?

- Deutlich modernere matte Glasflächen (Frosted Glass), dezente Schatten und feine Lichtkanten.
- Zurückhaltendere Farbakzente, besser lesbare Systemschrift und klarere Abstände.
- Konsistentes Styling für Lernpfad, Lerntexte, Quiz, Karten, Statistik, weitere Trainingstools und Einstellungsdialog.
- Alle **sechs bisherigen Farbwelten** bleiben in **hell und dunkel** wählbar (Lila, Petrol, Blau, Apricot, Waldgrün, Rosé).
- Die beiden Übungsdatensätze, in denen noch der Beispielname „Tom“ vorkommt, erhalten eine neutrale Formulierung („Eine Person …“); Fragen-IDs, Optionen und Lösungen bleiben gleich. Die App verwendet ohnehin keinen persönlichen Begrüßungstext.
- Kein TikTok-Modus, kein Podcast und keine neuen App-Funktionen.

## Installation (empfohlen)

1. Das Repository `https://github.com/TomHe1609/thinkup-App` lokal klonen oder herunterladen und entpacken.
2. Dieses ZIP entpacken. Im Terminal im entpackten Update-Ordner ausführen:

   ```bash
   python apply_update.py /Pfad/zum/thinkup-App
   ```

   Unter Windows funktioniert häufig `py apply_update.py "C:\\Pfad\\zu\\thinkup-App"`.

3. Der Installer erstellt eine Sicherung **neben** dem Repository und aktualisiert nur fünf Dateien: `ui-glass.css` (neu), `learning-support.css`, `sw.js`, `index.html` und `data-m01-m09.json`. In den letzten beiden ändert er lediglich die zwei neutralisierten Übungsformulierungen.
4. Vor dem Veröffentlichen Tests ausführen:

   ```bash
   npm test
   npm run test:browser
   ```

5. Änderungen prüfen, committen und nach `main` hochladen. GitHub Pages veröffentlicht bei diesem Repository aus `main`.
6. Die Seite auf Mobilgeräten vollständig neu laden; der aktualisierte Service-Worker-Cache heißt `thinkup-applied-quizzes-v23-glass-v2`.

**Ohne Python:** `ui-glass.css`, `learning-support.css` und `sw.js` aus diesem Paket ins Wurzelverzeichnis des GitHub-Repositories kopieren (vorhandene Dateien ersetzen). Der Look ist dadurch aktiv und offline nutzbar. Die zwei optionalen Namensänderungen in den bestehenden Übungsdaten müssten dann separat erfolgen.

## Technische Grenzen der Prüfung

- Die gelieferten CSS-Regeln wurden geparst, `sw.js` wurde syntaktisch geprüft und mobile statische UI-Vorschauen im Chromium bei 390 px Breite auf horizontales Überlaufen geprüft.
- Die statischen Vorschauen zeigen die tatsächliche **App-Struktur** mit teilweise beispielhaften Lernständen. Sie sind kein vollständiger Live-Funktionstest.
- Die komplette `npm test`- und `npm run test:browser`-Suite lässt sich nur im vollständigen Repository ausführen; hier lag nicht der gesamte Quellbaum lokal vor.
- Ein direkter GitHub-Push war über die verbundene Integration nicht möglich (GitHub meldete **403 – Resource not accessible by integration**). Daher bleibt die Live-App unverändert, bis dieses Paket übernommen wird.

## Sicherheit und Wiederherstellung

Das Update ändert keine lokalen Speicherschlüssel, keine Fortschrittslogik, keine Bewertungslogik und keine Fragen-IDs. Für den Rückweg die gesicherten Dateien wiederherstellen und `ui-glass.css` löschen; danach den GitHub-Stand erneut veröffentlichen.
