# thinkup.learn – Version 1.2.0 · M01–M09

App: https://tomhe1609.github.io/thinkup-App/

Repository: https://github.com/TomHe1609/thinkup-App

## Inhaltliche Überarbeitung

Alle 211 bisherigen Quizfragen wurden neu formuliert und die 67 Freitextaufgaben in automatisch ausgewertete Single-Choice-Fragen umgewandelt. Der Fragenbestand enthält jetzt **278 Fragen in 67 Lektionen**. Jede Frage besitzt vier Antwortmöglichkeiten, genau eine richtige Lösung, eine Begründung und zwei freiwillige Hinweise. Fallentscheidungen, Fehleranalyse, Abwägungen und Rechenwege ersetzen weitgehend reine Begriffserkennung. Es handelt sich um eigene Trainingsfragen, keine offiziellen Prüfungsaufgaben.

| Modul | Lektionen | Quizfragen |
|---|---:|---:|
| M01 · Lern- und Arbeitsmethodik | 3 | 12 |
| M02 · Analysieren und Planen der Softwarearchitektur | 13 | 62 |
| M03 · Entwickeln von Softwarearchitekturen | 11 | 44 |
| M04 · Produktqualität | 6 | 24 |
| M05 · Dokumentation | 6 | 24 |
| M06 · Übergabe und Einführung | 6 | 24 |
| M07 · Evaluation und Verbesserung | 6 | 24 |
| M08 · Organisatorische und rechtliche Vorgaben | 8 | 32 |
| M09 · Projektunterstützung und Koordination | 8 | 32 |

Jede Lektion behält ihre vorhandene Einführung, Begriffserklärungen und Beispiele und ergänzt einen Abschnitt zum Herleiten von Entscheidungen und Vermeiden typischer Fehler. Insgesamt kommen rund 6.000 erklärende Wörter hinzu. M02/2.9 vertieft Kardinalitäten, zusammengesetzte Schlüssel, Normalisierung und historische Preise. Ergänzende Primärquellen stehen direkt an den betreffenden Lektionen. Die Inhalte der rechtlichen Abschnitte dienen dem Lernen; konkrete Fälle benötigen ihren jeweiligen Vertrags- und Anwendungskontext.

Die 521 bereitgestellten Kurskarten mit eigenen Antworten bleiben unverändert. Die 211 zusätzlichen Übungskarten werden an die überarbeiteten Quizfragen angeglichen; ihre Kennungen bleiben erhalten. Insgesamt sind weiterhin 732 Karten vorhanden. Die 255 lokalen Begriffsdefinitionen, 20 ergänzenden Begriffe und 275 individuellen Begriffsbeispiele bleiben erhalten.

## Lernablauf und Bewertung

Eine Lektion öffnet zuerst den Lerntext. Anschließend startet ihr Quiz mit drei Fragen plus einer abschließenden Transferfrage. M02/2.9 hat einen Vorrat von 14 Fragen; eine Runde enthält daraus fünf wechselnde Fragen plus die Transferfrage. Offene Fehler haben bei der Auswahl Vorrang. Eine Antwort muss ausgewählt und ausdrücklich geprüft werden; erst danach erscheinen Lösung und Begründung. Ab 60 Prozent wird die direkte Folgelektion freigeschaltet. Jede erstmalig richtige Aufgabenkennung vergibt weiterhin zehn XP.

Lektionsquiz, Fehlertraining, Tagesrunde und Prüfungsmodus verwenden denselben überarbeiteten Fragenbestand einschließlich der umgewandelten Praxisfragen. Die frühere gesonderte Freitext-Praxisseite entfällt. Auch die Miniübung nach einer falschen Antwort verwendet jetzt vier auswählbare Antworten aus einer anderen Frage derselben Lektion. Sie beeinflusst weder XP noch das Ergebnis der ursprünglichen Frage.

„Lerntext nachlesen“ und die anklickbaren Begriffserklärungen funktionieren während des Quiz weiter und erhalten die Auswahl. Zwei freiwillige Hilfen zeigen zuerst einen Denkansatz und danach passende Prüfschritte. Im Prüfungsmodus bleiben Lösungen und Lernhilfen bis zur Abgabe verborgen.

Lernkarten mit Wiederholungsterminen, Suche, Favoriten, Lesepositionen, Tagesrunden und Prüfungshistorie bleiben verfügbar. Die sechs Farbwelten jeweils in Hell und Dunkel und der bestehende Lernpfad bleiben erhalten.

## Vorhandene Lernstände und Updates

Der lokale Schlüssel `skillyr_learn_m01_m05_preview_v1` bleibt bestehen. Abschlüsse, XP, Versuche, Aufgabenkennungen, Kartenbewertungen, Favoriten und Lesepositionen bleiben gültig. Auch frühere Freitexte und historische Bewertungen werden für alte Sicherungen weiter eingelesen und exportiert. Die App versendet keine Lernantworten an einen KI-Dienst.

Neue und alte Quizfragen behalten ihre Kennungen, damit bereits verdiente XP nicht erneut vergeben werden. Historische Abschlüsse werden nicht nachträglich aberkannt. Beim Beantworten einer umgewandelten Praxisfrage kann deren bisherige Einschätzung aktualisiert werden; ein gespeicherter Freitext wird dabei nicht gelöscht.

Laufende Tages- und Prüfungsrunden tragen nun `contentRevision: 2`. Runden ohne passende Inhaltsversion werden bei der Übernahme neu begonnen, da gespeicherte Antwortindizes sonst auf geänderte Optionen zeigen könnten. Bereits verdiente XP, abgeschlossene Lektionen und die Prüfungshistorie bleiben dabei erhalten. Neue Runden derselben Inhaltsversion lassen sich weiterhin nach Neuladen fortsetzen.

Sicherungsexporte bleiben bei Schema 4 und der Kennung `thinkup-learn-m01-m09`. Frühere `skillyr-learn-m01-m09`-, M01–M05- und M02-Sicherungen werden weiterhin unterstützt. Ein Import oder Zurücksetzen verlangt wie bisher eine ausdrückliche Bestätigung im Produkt.

Der Service Worker verwendet `skillyr-m02-test::thinkup-applied-quizzes-v21`. Er aktualisiert die App samt Lerntexten und Hilfen für Offline-Nutzung und entfernt ausschließlich alte eigene Caches. Fremde App-Caches und das Repository `TomHe1609/It-lernquiz` bleiben unberührt.

## Aufbau und Veröffentlichung

GitHub Pages veröffentlicht den Hauptbranch `main` aus dem Repository-Stamm. `index.html` enthält dieselben eingebetteten Daten wie `data-m01-m09.json`. Die historischen Kompatibilitätsdateien `data-m01-m05.json` und `data-m02.json` bleiben unverändert; die aktuelle App verwendet sie nicht als Quizquelle.

`study-features.js` enthält Tagesrunde, Prüfung, Such- und Wiederholungswerkzeuge. `learning-support-data.js` enthält Glossar und Hinweise; `learning-support.js` deren Anzeige und Begriffserkennung. `glossary-examples.js` bewahrt die individuellen Beispiele. Alle benötigten Dateien stehen im Offline-Cache.

Die eigene Trainingsfassung und die vom Nutzer freigegebenen Kurskarten enthalten keine Original-Rückseiten oder Kursfolien. Private Arbeitsdateien und Zugangsdaten gehören nicht in die Veröffentlichung.

## Prüfungen

```text
npm test
npm run test:browser
```

Die Inhalts- und Logiktests prüfen Kennungen, Aufgabenformate, Erklärungen, eingebettete Daten, Lernhilfen, Sicherungskompatibilität und Antwortversionen. Die Browserprüfungen verwenden einen lokalen Server und ein frisches Profil; persönliche Browserdaten werden nicht verändert. Sie prüfen alle 67 Lektionszugänge, komplette Runden, Freischaltung und XP, Miniquiz, Tagesrunde, Prüfungen, Import/Export, Farbschemata, kleine Bildschirme und Offline-Updates.

Für vorhandenes Chrome kann `TEST_BROWSER_CHANNEL=chrome` gesetzt werden. `PLAYWRIGHT_MODULE` erlaubt einen vorhandenen Playwright-Pfad, `TEST_OUTPUT_DIR` einen eigenen Ergebnisordner. Standardausgaben liegen im ignorierten Verzeichnis `test-results/`.
