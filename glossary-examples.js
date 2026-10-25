/* One concrete, independently authored example for each glossary entry and lesson. */
const GlossaryExamples={
 local:{
  '1.1':{
   'SQ3R':'Du überfliegst ein Kapitel über Schlüssel und fragst: „Wie findet eine Bestellung ihren Kunden?“ Nach dem Lesen zeichnest du die Verbindung ohne Vorlage. Beim anschließenden Abgleich bemerkst du einen fehlenden Fremdschlüssel.',
   'Spaced Repetition':'Am Montag erklärst du fünf Datenbankbegriffe ohne Unterlagen. Am Mittwoch gelingt dir einer davon noch nicht; ihn übst du früher erneut. Die vier sicheren Begriffe überprüfst du erst in der folgenden Woche.',
   'Cornell-Notizen':'Rechts notierst du, wie Kunde und Bestellung verbunden werden. Links schreibst du die Frage „Warum reicht der Kundenname nicht als Schlüssel?“. Beim Wiederholen deckst du die rechte Spalte ab und beantwortest die Frage selbst.'
  },
  '1.2':{
   'ALPEN':'Für einen Lernabend planst du 20 Minuten Lesen, 15 Minuten Üben und 10 Minuten Wiederholen. Von 60 Minuten bleiben 15 als Reserve. Nach einer Unterbrechung verschiebst du eine Zusatzaufgabe und prüfst am Ende, was geschafft ist.',
   'Eisenhower-Matrix':'Eine Abgabe endet heute und wird sofort bearbeitet. Das Lernen für die Prüfung in vier Wochen ist ebenfalls wichtig, bekommt aber feste Termine im Kalender. Eine unwichtige Benachrichtigung unterbricht diese Lernzeit nicht.',
   'Tuckman-Phasen':'Eine neue Lerngruppe streitet darüber, wer die Präsentation erstellt. Sie klärt Zuständigkeiten und vereinbart Regeln für Rückmeldungen. Danach verteilt sie die Arbeit verlässlicher und kann gemeinsam üben.',
   'Pomodoro':'Du stellst für eine SQL-Aufgabe einen Timer auf 25 Minuten und schaltest Benachrichtigungen aus. Danach machst du fünf Minuten Pause. Im nächsten Arbeitsabschnitt bearbeitest du die nächste Abfrage statt nebenbei Nachrichten zu lesen.'
  },
  '1.3':{
   'Lernziel':'Vor der Einheit schreibst du: „Ich kann zwei Tabellen über einen Fremdschlüssel verbinden und die Verbindung erklären.“ Danach zeichnest du Kunde und Bestellung ohne Vorlage. Die richtige Zeichnung zeigt dir, ob du dein Ziel erreicht hast.',
   'Aktives Abrufen':'Du schließt den Lerntext und notierst aus dem Gedächtnis drei Unterschiede zwischen Primär- und Fremdschlüssel. Erst anschließend öffnest du die Erklärung wieder. Einen vergessenen Unterschied ergänzt du in einer anderen Farbe.',
   'Transfer':'Du hast gelernt, dass eine Kundin mehrere Bestellungen haben kann. Nun modellierst du selbst eine Bibliothek: Ein Mitglied hat mehrere Ausleihvorgänge. Du überträgst das Prinzip auf neue Objekte, statt die Kundentabelle nur abzuschreiben.'
  },
  '2.0':{
   'Altsystem':'Vor dem Wechsel werden 12.000 Artikel aus dem bisherigen Lagerprogramm exportiert. Dabei fällt auf, dass alte Artikelnummern führende Nullen enthalten. Der Import muss diese erhalten, damit vorhandene Etiketten weiter zugeordnet werden können.',
   'Batch-Abgleich':'Um 10 Uhr werden acht Kartons entnommen. Das Verkaufssystem zeigt sie bis zum nächtlichen Abgleich weiterhin als verfügbar. Erst um 2 Uhr werden die gesammelten Lagerbewegungen übertragen und der Bestand dort angepasst.',
   'Key-User':'Eine erfahrene Lagerkraft testet den neuen Buchungsdialog mit einer beschädigten Lieferung. Sie bemerkt, dass Teilmengen nicht erfasst werden können. Das Team ergänzt diesen zuvor übersehenen Ausnahmefall.',
   'Medienbruch':'Eine Mitarbeiterin schreibt 18 Kartons auf einen Papierzettel. Später tippt ein Kollege versehentlich 81 in die Anwendung. Beim Wechsel vom Zettel zur digitalen Erfassung ist ein zusätzlicher Übertragungsfehler entstanden.'
  },
  '2.1':{
   'Bedarf':'Die Lagerleitung fordert zunächst Tablets. Im Gespräch wird klar, dass Buchungen derzeit erst zwei Stunden nach der Warenannahme sichtbar werden. Das eigentliche Ziel ist eine frühere Bestandserfassung; welches Gerät dafür passt, wird danach geprüft.',
   'Stakeholder':'Für eine Scanner-App werden Lagerkräfte, Einkauf und IT-Betrieb eingeladen. Der Einkauf benötigt aktuelle Bestände, der Betrieb muss die Geräte betreuen. Beide können Anforderungen beitragen, obwohl sie nicht alle selbst am Wareneingang arbeiten.',
   'Persona':'Nach fünf Gesprächen fasst das Team typische Beobachtungen als Persona „Nora, Schichtkraft im Wareneingang“ zusammen. Nora trägt Handschuhe und hat wenig Zeit pro Buchung. Deshalb wird ein Entwurf mit großen Bedienflächen getestet.'
  },
  '2.2':{
   'IST-Analyse':'Das Projektteam begleitet eine Lieferung vom Tor bis zur Einlagerung und misst die Wartezeiten. Es entdeckt, dass Lieferscheine oft auf eine Unterschrift warten. Diese Beobachtung wird im Ablaufmodell festgehalten, bevor eine Lösung vorgeschlagen wird.',
   'Funktionale Anforderung':'Eine Lagerkraft soll eine Lieferung auswählen und eine beschädigte Teilmenge erfassen können. Im Test werden von 20 gelieferten Kartons drei als beschädigt gespeichert. Die Buchung zeigt danach 17 unbeschädigte und drei beschädigte Kartons.',
   'Qualitätsanforderung':'Die Bestandsanzeige soll bei 50 gleichzeitig aktiven Personen in mindestens 95 von 100 Messungen binnen zwei Sekunden antworten. Ein Lasttest prüft genau diese Bedingung. Eine bloße Aussage wie „Die Anzeige ist schnell“ reicht dafür nicht.',
   'Offene Frage':'Im Interview fragst du: „Was passiert, wenn mehr Ware ankommt als auf dem Lieferschein steht?“ Die Lagerkraft beschreibt Rückfragen und Zwischenlagerung. Eine Frage wie „Ist der Ablauf einfach?“ hätte diese Details kaum sichtbar gemacht.'
  },
  '2.3':{
   'Lastenheft':'Der Auftraggeber hält fest: „Mengenabweichungen müssen bei der Warenannahme dokumentiert und später ausgewertet werden können.“ Er nennt die betroffenen Rollen und Ziele. Welche Datenbank oder Programmiersprache verwendet wird, legt er damit noch nicht fest.',
   'Pflichtenheft':'Der Anbieter beschreibt zur Mengenabweichung einen Dialog mit Sollmenge, Istmenge und Begründung. Die Speicherung erfolgt mit Zeitstempel und Benutzerkennung. Damit konkretisiert er, wie er die vereinbarte Funktion umsetzen will.',
   'User Story':'„Als Lagerkraft möchte ich eine Mengenabweichung direkt bei der Annahme melden, damit der Einkauf ohne zusätzliche Zettel informiert wird.“ Im Gespräch klärt das Team anschließend, welche Angaben und Benachrichtigungen dafür erforderlich sind.',
   'Akzeptanzkriterium':'Für eine Lieferung sind 20 Stück angekündigt. Gibt die Lagerkraft 18 ein und speichert eine Begründung, muss danach eine Abweichung von minus zwei Stück sichtbar sein. Ein Test kann genau dieses erwartete Ergebnis prüfen.',
   'Traceability':'Anforderung A-17 zur Mengenabweichung verweist auf Interview I-3, Umsetzungsticket U-42 und Test T-11. Wird A-17 geändert, findet das Team über diese Verbindungen die betroffene Funktion und den erneut auszuführenden Test.'
  },
  '2.4':{
   'MoSCoW':'Für den ersten Lagerstart ist eine korrekte Bestandsbuchung unverzichtbar. Ein Sammelimport ist wichtig, eine frei wählbare Diagrammfarbe optional. Eine zusätzliche Smartphone-App wird ausdrücklich aus dieser Auslieferung herausgenommen.',
   'Kano-Modell':'Eine Termin-App verhindert Doppelbuchungen; Nutzende erwarten das selbstverständlich. Kürzere Antwortzeiten verbessern ihre Zufriedenheit schrittweise. Ein überraschend hilfreicher Vorschlag für freie Alternativtermine kann zusätzlich begeistern.',
   'Nutzwertanalyse':'Bedienbarkeit zählt zu 60 Prozent, Betriebskosten zu 40 Prozent. Produkt A erhält dafür vier und zwei Punkte: 0,6 × 4 + 0,4 × 2 = 3,2. Produkt B erreicht mit drei und vier Punkten 3,4 und liegt bei diesen Annahmen vorn.'
  },
  '2.5':{
   'Standardsoftware':'Ein Verein richtet ein vorhandenes Buchhaltungsprodukt ein und übernimmt seinen Kontenrahmen. Er konfiguriert Belegarten und importiert Anfangsbestände. Die grundlegenden Buchungsfunktionen muss er nicht selbst entwickeln.',
   'Individualsoftware':'Ein Labor benötigt einen Ablauf für speziell gekennzeichnete Proben, den vorhandene Produkte nicht abdecken. Ein Team entwickelt dafür eine Anwendung. Auch spätere Änderungen am Probenablauf müssen von diesem Team oder einem vereinbarten Dienstleister gepflegt werden.',
   'TCO':'Ein Produkt kostet anfangs 2.000 Euro. Für Einführung fallen weitere 1.000 Euro und für drei Betriebsjahre jeweils 600 Euro an. Im betrachteten Zeitraum ergeben diese Posten bereits 4.800 Euro; weitere erwartete Kosten werden gesondert ergänzt.',
   'PoC und MVP':'Zuerst testet das Team, ob der vorhandene Scanner zuverlässig Barcodes an eine Web-Anwendung übergibt: der PoC. Danach erprobt eine kleine Lagergruppe eine nutzbare Version nur für einfache Wareneingänge: das MVP liefert Rückmeldungen zum tatsächlichen Nutzen.'
  },
  '2.6':{
   'arc42':'Für eine Lager-API beschreibt das Team zunächst ihre Nachbarsysteme, danach zentrale Bausteine und den Ablauf einer Buchung. In weiteren Abschnitten hält es Verteilung und Risiken fest. Neue Teammitglieder finden diese Informationen dadurch an vereinbarten Stellen.',
   'C4-Kontext':'Auf einer Skizze steht das Lagerportal in der Mitte. Außen liegen Lagerkräfte, Einkaufssystem und Versanddienst. Pfeile zeigen, wer welche Informationen austauscht; einzelne Klassen oder Tabellen werden hier noch nicht eingezeichnet.',
   'C4-Container':'Die nächste Skizze zeigt Browser-Oberfläche, API-Anwendung und Datenbank als getrennte Bestandteile des Portals. Ein Pfeil führt von der Oberfläche zur API. Diese Sicht funktioniert auch dann, wenn keine dieser Anwendungen in Docker betrieben wird.',
   'ADR':'Das Team hält unter „ADR-03“ fest, weshalb es für Lagerbuchungen eine relationale Datenbank wählt. Es dokumentiert benötigte Transaktionen, die betrachtete Alternative und zusätzlichen Betriebsaufwand. Ein späteres Team kann die Entscheidung anhand dieser Gründe neu prüfen.'
  },
  '2.7':{
   'Prototyp':'Drei klickbare Bildschirmbilder simulieren die Warenannahme, ohne echte Daten zu speichern. Eine Lagerkraft findet den Abschlussknopf nicht. Das Team verändert die Anordnung, bevor es die eigentliche Speicherung entwickelt.',
   'Usability-Test':'Eine Testperson erhält die Aufgabe, eine beschädigte Teilmenge zu melden. Ohne Hilfestellung sucht sie mehrfach im falschen Menü. Die Beobachtung führt zu einem neuen Einstieg direkt in der Lieferungsansicht.',
   'Native und Web':'Auf zwei vorhandenen Scannern prüft das Team denselben Ablauf einmal im Browser und einmal in einer installierten App. Dabei funktioniert der benötigte Gerätesensor nur in einer Variante. Dieser gemessene Unterschied fließt in die Plattformwahl ein.',
   'SaaS':'Eine Firma nutzt einen vom Anbieter betriebenen Online-Terminplaner. Der Anbieter spielt Anwendungsupdates ein. Die Firma richtet selbst ihre Mitarbeiterrollen ein und prüft, welche Kundendaten sie in diesem Dienst verarbeiten darf.'
  },
  '2.8':{
   'Grob-Design':'Auf einem Blatt zeichnet das Team Oberfläche, Buchungsdienst und Datenhaltung. Es legt fest, dass die Oberfläche nicht direkt auf die Datenbank zugreift. Einzelne Methoden und ihre Parameter werden erst später festgelegt.',
   'Fein-Design':'Für die Funktion bucheWareneingang werden Lieferungs-ID, Menge, Rückgabewert und Fehlerfälle beschrieben. Ein Ablauf legt fest, wann die Mengengrenze geprüft und wann gespeichert wird. Darauf kann die Implementierung aufbauen.',
   'Kohäsion':'Ein Preisbaustein enthält Rundungsregeln, Rabattberechnung und die zugehörigen Tests. Das Versenden von E-Mails wird in einem anderen Baustein erledigt. Eine Änderung am Rabatt lässt sich dadurch an einer fachlich zusammengehörenden Stelle bearbeiten.',
   'Kopplung':'Die Lagerbuchung ruft einen Benachrichtigungsdienst über eine kleine Schnittstelle auf. Als der E-Mail-Anbieter wechselt, wird nur dessen Adapter angepasst. Die fachliche Berechnung der gebuchten Menge bleibt unverändert.',
   'Sequenzdiagramm':'Für eine Bestandsabfrage zeichnest du Client, API und Datenbank nebeneinander. Die Nachrichten verlaufen zeitlich nach unten: Anfrage, Datenbankabfrage, Datenbankantwort, API-Antwort. So fällt auf, wenn ein benötigter Aufruf im Ablauf fehlt.'
  },
  '2.9':{
   'Entität und Attribut':'Die Kundin mit kunde_id 42 heißt „Mira König“ und wohnt in Bonn. Die Kundin ist das einzelne Objekt. name und ort sind Eigenschaften dieses Objekts; „Mira König“ und „Bonn“ sind ihre konkreten Werte.',
   'Kandidatenschlüssel':'In einer Kursteilnahme darf jede Person pro Kurs nur einmal vorkommen. Das Paar person_id und kurs_id identifiziert eine Teilnahme. Lässt du einen Teil weg, werden mehrere Teilnahmen möglich; deshalb wird das vollständige Paar benötigt.',
   'Primärschlüssel':'Zwei Kunden heißen „Alex Weber“. Die Datensätze erhalten kunde_id 42 und 57. Eine Namensänderung betrifft nur den Namen; über die unveränderte kunde_id bleibt jeder Kunde weiterhin eindeutig ansprechbar.',
   'Fremdschlüssel':'Bestellung B730 enthält kunde_id = 42 und gehört damit zu Kundin 42. Für kunde_id = 999 gibt es keinen Kundendatensatz. Die eingerichtete Fremdschlüsselregel weist eine solche neue Bestellung mit ungültigem Verweis zurück.',
   'Funktionale Abhängigkeit X → Y':'Im Modell gehört zu artikel_id A7 immer die Bezeichnung „Schraube M6“. Zwei Zeilen mit A7 und unterschiedlichen Bezeichnungen würden die vereinbarte Regel verletzen. Unterschiedliche Artikel dürfen trotzdem denselben Namen tragen.',
   'Nichtschlüsselattribut':'Eine Bestellposition wird im Beispiel allein durch bestellung_id und artikel_id identifiziert. menge gehört zu keinem Kandidatenschlüssel. Wird die Menge von 3 auf 5 geändert, bleibt es dieselbe eindeutig bezeichnete Bestellposition.'
  },
  '2.10':{
   'Migration':'In einer Probeübernahme werden 8.000 Lieferungen aus dem alten System importiert. Das Team vergleicht Anzahl und Mengen mit dem Ausgangsbestand und findet 12 fehlerhafte Datumswerte. Erst nach deren Klärung wird die endgültige Übernahme geplant.',
   'ETL':'Eine CSV-Datei enthält das Datum 31.12.2026 und einen Preis mit Dezimalkomma. Das Importprogramm liest die Datei, wandelt beide Formate passend zum Zielsystem um und schreibt die geprüften Datensätze anschließend in die neue Tabelle.',
   'Parallelbetrieb':'Zwei Wochen lang werden definierte Testbuchungen im alten und im neuen Lagerprogramm nachvollzogen. Jeden Abend vergleicht das Team die Summen und klärt Abweichungen. Ein vereinbarter Erfassungsweg verhindert dabei doppelte produktive Buchungen.',
   'Korrektive Wartung':'Nach dem Start zeigt sich, dass ein Export bei einer leeren Ergebnisliste abstürzt. Das Team korrigiert den Fehler und ergänzt einen Test für null Zeilen. Die Funktion bekommt dabei keinen neuen fachlichen Leistungsumfang.'
  },
  '2.11':{
   'Operator':'Die Aufgabe lautet zunächst „Nennen Sie zwei Risiken“: Du gibst zwei kurze Punkte an. Bei „Begründen Sie eine Gegenmaßnahme“ ergänzt du dagegen, welches Risiko die Maßnahme wie verringert. Die zweite Antwort benötigt den erklärten Zusammenhang.',
   'Bewertungskriterium':'Zwei Scannerlösungen werden darauf geprüft, ob Buchungen 15 Minuten ohne Netz erfasst und danach korrekt übertragen werden können. Beide durchlaufen denselben Test. „Offlinefähigkeit“ erhält dadurch einen nachvollziehbaren Maßstab statt einer bloßen Produktbehauptung.',
   'Lebenszyklus':'Bei der Auswahl einer Anwendung prüft das Team auch, wie Daten später exportiert werden können. Ein günstiges Produkt verlangt für die Ablösung eine teure Sonderentwicklung. Diese spätere Folge wird bereits in der heutigen Auswahl berücksichtigt.'
  },
  '2.12':{
   'Leitfaden':'Für das Wareneingangsinterview stehen Fragen zu Normalfall, beschädigter Ware und Netzausfall bereit. Als die Lagerkraft von nächtlichen Sonderlieferungen erzählt, fragt die Interviewerin gezielt nach. Der Leitfaden strukturiert, verhindert aber keine sinnvollen Rückfragen.',
   'Quelle':'Neben Anforderung A-23 steht „Interview mit Schichtleitung, 12. Oktober, Abschnitt Mengenprüfung“. Als die Regel später unklar ist, kann das Team bei der genannten Person mit dem ursprünglichen Gesprächskontext nachfragen.',
   'Validierung einer Anforderung':'Das Team liest der Lagerkraft vor: „Bestandsänderungen sind innerhalb von fünf Sekunden sichtbar.“ Sie erklärt, dass das bei Netzausfall nicht gelten kann. Gemeinsam werden Online-Bedingung und erkennbarer Offline-Status genauer beschrieben.'
  },
  '3.1':{
   'API-Vertrag':'Für POST /wareneingaenge werden lieferung_id und menge als Pflichtfelder vereinbart. Bei Erfolg kommt eine Kennung zurück, bei einer negativen Menge eine definierte Fehlermeldung. Oberfläche und Server können gezielt gegen dieselben Fälle getestet werden.',
   'Contract-First':'Vor der Programmierung stimmen zwei Teams die Felder einer Reservierungsanfrage und ihre Antworten ab. Das Frontend nutzt zunächst einen passenden Testserver. Als die echte API fertig ist, müssen Feldnamen und Fehlerformate nicht nachträglich erraten werden.',
   'POST und 201':'Ein Client sendet POST /termine mit einer gültigen neuen Buchung. Der Server legt Termin 84 an und antwortet mit 201 Created sowie einem Verweis auf /termine/84. Die anschließende Abfrage des vorhandenen Termins erfolgt getrennt.',
   'Validierungsfehler':'Eine Anfrage versucht, einen Wareneingang mit menge = -4 zu speichern. Die API antwortet nach ihrem Vertrag mit Status 400 und dem Hinweis, dass eine positive Menge erforderlich ist. Es wird kein ungültiger Wareneingang angelegt.'
  },
  '3.2':{
   'Middleware':'Eine zentrale Verarbeitung prüft vor jedem geschützten API-Aufruf die Anmeldung. Fehlt sie, erhält der Client eine passende Ablehnung, bevor die Buchungsfunktion ausgeführt wird. Der gleiche Anmeldeschritt muss nicht in jedem Endpunkt neu geschrieben werden.',
   'Unit-Test':'Die Funktion berechneRestmenge erhält 10 als Sollmenge und 3 als bereits gebuchte Menge. Der Test erwartet 7 und benötigt dafür weder Webserver noch echte Datenbank. Ein Fehler in der Rechnung wird isoliert sichtbar.',
   'Stub':'Für einen Liefertermin-Test liefert ein ersetzter Kalenderdienst immer den 15. Juni zurück. So hängt der Test nicht vom heutigen Datum oder einem externen Dienst ab. Das Team kann den gewünschten Terminfall wiederholt prüfen.',
   'Mock':'Nach einer Buchung soll genau eine Benachrichtigung versendet werden. Der Test prüft mit einem Mock, ob sendeNachricht einmal mit der richtigen Lieferungs-ID aufgerufen wurde. Ein doppelter Versand lässt den Test fehlschlagen.',
   'Integrationstest':'Eine Test-API speichert einen Wareneingang in einer echten Testdatenbank und liest ihn anschließend wieder aus. Der Test erkennt dabei einen falsch konfigurierten Spaltennamen, obwohl die einzelnen Berechnungsfunktionen für sich bestanden hatten.'
  },
  '3.3':{
   'Constraint':'Für artikelnummer gilt eine UNIQUE-Regel. Nach dem Einfügen von A-17 weist die Datenbank einen zweiten Datensatz mit derselben Artikelnummer zurück. Ein Programmierfehler kann dadurch nicht unbemerkt eine doppelte Artikelnummer speichern.',
   'Transaktion':'Eine Umbuchung soll fünf Stück von Lager A abziehen und Lager B gutschreiben. Der zweite Schritt schlägt fehl. Werden beide Änderungen in einer korrekt behandelten Transaktion ausgeführt, wird auch der erste Schritt zurückgenommen.',
   'ACID':'Bei einer Zahlung werden Belastung und Gutschrift gemeinsam geprüft. Ein Abbruch darf keine halbe Buchung hinterlassen, parallele Vorgänge dürfen die vereinbarten Regeln nicht verletzen und eine bestätigte Buchung muss nach einem gesicherten Neustart erhalten bleiben.',
   'Ausführungsplan':'Eine Suche nach artikelnummer braucht auffällig lange. Der angezeigte Plan sieht das Durchlesen aller Artikelzeilen vor. Das Team prüft daraufhin, ob ein geeigneter Index die konkrete Suchbedingung unterstützen würde.',
   'Least Privilege':'Das Konto der Bestandsanzeige darf Artikel und Mengen lesen. Ein Versuch, darüber eine Tabelle zu löschen, wird von der Datenbank abgewiesen. Für diese reine Anzeige werden keine Verwaltungsrechte benötigt.'
  },
  '3.4':{
   'Repository':'Die Fachlogik ruft findeOffeneLieferungen() auf. Nur das Lieferungs-Repository enthält die passende SQL-Abfrage. Als eine Spalte umbenannt wird, wird dieser Datenzugriff angepasst; der Aufruf der Fachlogik bleibt gleich.',
   'DTO':'Die Kundentabelle enthält Name, interne Risikobewertung und technische Änderungsdaten. Eine öffentliche API-Antwort überträgt nur kunde_id und name. Das eigens festgelegte DTO verhindert, dass interne Spalten automatisch mit ausgegeben werden.',
   'Migration':'Änderung 014 ergänzt die zunächst optionale Spalte lieferhinweis. Eine spätere Änderung füllt vereinbarte Standardwerte und setzt erst danach die neue Pflichtregel. Jede Umgebung führt diese versionierten Schritte in derselben Reihenfolge aus.',
   'N+1-Problem':'Eine Abfrage lädt 20 Bestellungen. Danach lädt die Anwendung für jede Bestellung einzeln den Kunden nach: insgesamt 21 Abfragen. Mit einer passenden gemeinsamen Abfrage wird der zusätzliche Zugriff pro Bestellung vermieden.',
   'Connection Pool':'Eine API hält bis zu zehn vorbereitete Datenbankverbindungen bereit. Eine Anfrage leiht eine Verbindung aus und gibt sie danach zurück. Die nächste Anfrage kann diese nutzen, statt jedes Mal eine neue Verbindung aufzubauen.'
  },
  '3.5':{
   'SRP':'Eine Klasse berechnet Rechnungsbeträge und gestaltet zugleich PDF-Seiten. Das Team trennt die PDF-Ausgabe in einen eigenen Baustein. Ein neues Seitenlayout erfordert danach keine Änderung an der Steuerberechnung.',
   'SOLID':'Eine Versandfunktion hängt von einer kleinen Schnittstelle Tarif ab. Standard- und Expressversand erfüllen denselben vereinbarten Vertrag. Ein neuer Tarif wird ergänzt, ohne die bestehende Auftragsverarbeitung um weitere anbieterabhängige Sonderfälle zu erweitern.',
   'TDD':'Zuerst schreibt die Entwicklerin einen Test: Eine negative Buchungsmenge soll abgelehnt werden. Der Test schlägt zunächst fehl. Sie ergänzt die Prüfung, bringt den Test zum Bestehen und verbessert danach die Struktur bei weiterhin bestandenen Tests.',
   'Given–When–Then':'Gegeben ist ein Restbestand von zehn Stück. Wenn drei Stück gebucht werden, dann muss der Restbestand sieben betragen. Das Beispiel benennt damit Ausgangslage, Handlung und beobachtbares Ergebnis getrennt.'
  },
  '3.6':{
   'Strategy':'Für Kunde A wird Versand nach Gewicht berechnet, für Kunde B pauschal. Beide Tarifklassen besitzen berechnePreis(). Der Auftragsablauf wählt den passenden Tarif und kann weiterarbeiten, ohne dessen Rechenschritte selbst zu enthalten.',
   'Observer':'Die Bestandsanzeige und ein Warnungsdienst abonnieren Änderungen eines Lagerbestands. Nach einer Buchung werden beide benachrichtigt. Eine später ergänzte Anzeige kann ebenfalls abonnieren, ohne die fachliche Buchungsrechnung umzuschreiben.',
   'Factory':'Die Anwendung erhält den Formatwunsch CSV oder PDF. Eine ExporterFactory erzeugt dazu einen passenden Exporter mit allen benötigten Einstellungen. Der aufrufende Ablauf muss diese unterschiedliche Objekterzeugung nicht selbst zusammensetzen.',
   'Klassendiagramm':'Eine Zeichnung zeigt Bestellung mit bestellnummer und Position mit menge. Die Beziehung trägt an der Positionsseite 1..n. Das Team erkennt daran, dass eine Bestellung in diesem Modell mindestens eine Position haben soll.',
   'Sequenzdiagramm':'Beim Zurücksetzen eines Passworts sendet die Oberfläche eine Anfrage an die API, diese beauftragt den E-Mail-Dienst und meldet den Abschluss zurück. Die gezeichnete Nachrichtenfolge zeigt, an welcher Stelle der externe Dienst beteiligt ist.'
  },
  '3.7':{
   'Branch und Commit':'Auf einem eigenen Branch ändert eine Entwicklerin die Mengenprüfung. Ein Commit hält die neue Prüfung samt Test als zusammengehörigen Schritt fest. Erst nach dem Review wird diese Änderung in den gemeinsamen Entwicklungsstand übernommen.',
   'Rebase':'Ein privater Branch enthält zwei Änderungen auf einem älteren Hauptstand. Beim Rebase werden sie auf den neueren Hauptstand gesetzt und erhalten neue Commit-Kennungen. Wer bereits auf den alten Kennungen aufbaut, müsste seine Arbeit damit abstimmen.',
   'CI':'Eine Entwicklerin übernimmt eine kleine Änderung in den gemeinsamen Stand. Die Pipeline baut die Anwendung und führt automatisch die Tests aus. Ein fehlerhafter Import fällt dadurch direkt bei der Integration auf.',
   'Continuous Delivery':'Nach bestandenen Tests erzeugt die Pipeline ein geprüftes Release-Paket. Es kann ausgeliefert werden, bleibt aber bis zur ausdrücklichen Freigabe außerhalb der Produktion. Die fachlich verantwortliche Person bestimmt den endgültigen Auslieferungszeitpunkt.',
   'Continuous Deployment':'Ein kleiner Fehlerfix besteht Tests und die vereinbarten Freigaberegeln der Pipeline. Danach wird er automatisch produktiv bereitgestellt. Eine zusätzliche manuelle Entscheidung zwischen bestandener Pipeline und Auslieferung gibt es in diesem Ablauf nicht.'
  },
  '3.8':{
   'SemVer':'Aus Version 2.3.1 wird bei einer kompatiblen Korrektur 2.3.2. Ein zusätzliches kompatibles API-Feld führt zu 2.4.0. Entfällt dagegen ein bisher zugesagtes Pflichtverhalten für bestehende Clients, wird eine neue Hauptversion vorgesehen.',
   'Release Notes':'Version 2.4 führt einen neuen Export ein und benennt ein Konfigurationsfeld um. Die Release Notes beschreiben beides sowie die nötige Anpassung. Der Betrieb kann dadurch vor dem Update die betroffene Einstellung prüfen.',
   'Blue-Green Deployment':'Blau bedient die produktiven Anfragen. Die neue Version wird in Grün installiert und geprüft. Danach wird der Verkehr auf Grün umgeschaltet; für einen Rückweg müssen unter anderem die inzwischen veränderten Daten weiterhin berücksichtigt werden.',
   'Rollback':'Nach einem Update scheitern Buchungen. Das Team stoppt neue Zugriffe, prüft seit dem Update geschriebene Daten und führt den vorbereiteten Rückweg aus. Anschließend testet es eine Buchung, bevor der Betrieb wieder freigegeben wird.'
  },
  '3.9':{
   'Authentifizierung':'Mira meldet sich mit ihrem Konto und dem vorgesehenen zweiten Faktor an. Erst nach erfolgreicher Prüfung kennt das Portal ihre Identität. Ob Mira danach eine fremde Rechnung sehen darf, ist damit noch nicht entschieden.',
   'Autorisierung':'Mira ist bereits angemeldet und ruft Rechnung 730 auf. Die API prüft zusätzlich, ob diese Rechnung zu ihrem Kundenkonto gehört. Weil sie einem anderen Kunden gehört, wird der Zugriff trotz gültiger Anmeldung abgelehnt.',
   'Parametrisierte Abfrage':'Ein Kunde heißt O’Neill. Die Suchfunktion übergibt den Namen als gebundenen Wert an eine feste Abfrage. Das enthaltene Anführungszeichen bleibt Bestandteil des Namens und verändert nicht den Aufbau der SQL-Anweisung.',
   'Passwort-Hashing':'Zwei Personen wählen dasselbe Passwort. Durch unterschiedliche zufällige Salts entstehen trotzdem unterschiedliche gespeicherte Prüfdaten. Bei der Anmeldung wird das eingegebene Passwort geprüft; sein Klartext wird nicht aus der Datenbank zurückgelesen.',
   'Secret':'Eine Schnittstelle braucht einen API-Schlüssel. Der Betrieb hinterlegt ihn geschützt auf dem Server; die Browser-App ruft nur den eigenen Server auf. In den öffentlich herunterladbaren JavaScript-Dateien ist der Schlüssel dadurch nicht enthalten.'
  },
  '3.10':{
   'Vertikaler Ausschnitt':'Eine erste Version erlaubt genau einen einfachen Wareneingang: Eingabe im Browser, fachliche Mengenprüfung, Speicherung und anschließende Anzeige. Obwohl viele Sonderfälle noch fehlen, wird bereits ein vollständiger Weg durch alle beteiligten Schichten erprobt.',
   'Checkpoint':'Am Freitag demonstriert das Team, dass eine gültige Lieferung gespeichert und eine negative Menge abgewiesen wird. Beide Nachweise sind vorab vereinbart. Die Beteiligten entscheiden anhand dieses Ergebnisses über den nächsten Arbeitsschritt.',
   'Traceability':'Für Anforderung A-8 „Nur zuständige Rollen dürfen buchen“ verknüpft das Team Entwurf E-2, Implementierung I-14 und Tests T-5 sowie T-6. Nach einer Rollenänderung lässt sich gezielt prüfen, welche Nachweise erneut benötigt werden.'
  },
  '3.11':{
   'Nennen':'Bei „Nennen Sie zwei Schutzmaßnahmen“ antwortest du knapp mit „Mehrfaktor-Anmeldung“ und „regelmäßiger Rechteprüfung“. Eine längere Begründung schreibst du erst, wenn sie zusätzlich verlangt wird. So bleibt Zeit für weitere Teilaufgaben.',
   'Erläutern und Begründen':'Du schreibst nicht nur „Transaktionen verwenden“. Du erklärst, dass Abzug und Gutschrift einer Umbuchung zusammengehören, und begründest damit den Schutz vor einer halben Buchung. Die Maßnahme ist dadurch fachlich nachvollziehbar.',
   'Fallbezug':'Im Fall arbeiten fünf Lagerkräfte mit häufigen Netzausfällen. Deine Empfehlung berücksichtigt deshalb die Offline-Erfassung und einen kontrollierten späteren Abgleich. Eine Aussage nur zur maximalen Serverleistung würde diese konkrete Schwierigkeit verfehlen.',
   'Gegenmaßnahme':'Als Risiko ist die doppelte Buchung derselben Lieferposition benannt. Das Team führt eine passende Eindeutigkeitsregel und einen Test mit wiederholter Anfrage ein. Die Wirkung wird gezielt am zuvor beschriebenen Fehlerfall überprüft.'
  },
  '4.1':{
   'Qualitätsziel':'Die Terminübersicht soll bei 30 gleichzeitigen Nutzenden in 95 Prozent der Messungen innerhalb von zwei Sekunden erscheinen. Im vereinbarten Lasttest werden die Antwortzeiten erfasst. Das Team vergleicht die Ergebnisse mit genau diesem Zielwert.',
   'Konstruktive QS':'Bevor neue API-Endpunkte entstehen, vereinbart das Team ein einheitliches Schema für Eingabeprüfungen. Eine Vorlage enthält die vorgesehenen Prüfungen bereits. So wird verhindert, dass jeder Endpunkt grundlegende Regeln neu und möglicherweise unvollständig umsetzt.',
   'Analytische QS':'Eine fertige Preisberechnung wird mit Mengen von 0, 1 und 20 geprüft. Ein Test entdeckt, dass bei null Stück trotzdem Versandkosten entstehen. Die Untersuchung macht einen vorhandenen Fehler sichtbar, den das Team anschließend korrigiert.'
  },
  '4.2':{
   'Testplan':'Für das nächste Release werden Rollenprüfung und Datenimport als Risikoschwerpunkte festgelegt. Lea übernimmt die API-Tests in der Testumgebung. Vor der Freigabe müssen die vereinbarten Kernfälle bestanden und offene schwere Befunde geklärt sein.',
   'Nachverfolgbarkeitsmatrix':'Die Zeile zu Anforderung A-12 enthält die Tests T-31 und T-32 samt Ergebnissen. Für A-13 ist noch kein Test eingetragen. In der Übersicht wird diese Prüflücke sichtbar, bevor das Team Vollständigkeit behauptet.',
   'Teststufe':'Zuerst prüft ein isolierter Test die Rabattformel. Danach wird das Zusammenspiel von API und Datenbank untersucht. Abschließend führt eine Fachanwenderin eine komplette Buchung im Gesamtsystem durch; jeder Schritt betrachtet einen anderen Umfang.'
  },
  '4.3':{
   'Äquivalenzklasse':'Für ein Mengenfeld sind ganze Zahlen von 1 bis 20 erlaubt. Die Werte 4 und 12 sollen beide normal angenommen werden. Null und 25 gehören zu anderen Bereichen, in denen die Anwendung jeweils eine Ablehnung liefern muss.',
   'Grenzwertanalyse':'Ein Mengenfeld erlaubt 1 bis 20. Du prüfst 0, 1, 2 sowie 19, 20 und 21. Dadurch fällt auf, dass die Anwendung versehentlich auch 21 annimmt, obwohl normale Werte wie 8 korrekt funktionieren.',
   'Entscheidungstabelle':'Ein Rabatt gilt nur für Mitglieder ab 100 Euro Bestellwert. Du notierst die vier Kombinationen aus Mitglied ja/nein und Schwelle erreicht ja/nein. Nur in einer Zeile wird ein Rabatt erwartet; die anderen drei prüfen seine Ablehnung.',
   'Black Box und White Box':'Ein Test prüft eine Rabattfunktion allein anhand ihrer Eingaben und erwarteten Preise. Zusätzlich liest eine Entwicklerin die Verzweigungen im Code und ergänzt einen Fall für einen bisher unbetretenen Zweig. Die beiden Blickwinkel finden unterschiedliche Lücken.'
  },
  '4.4':{
   'Synthetische Testdaten':'Das Team erzeugt erfundene Kunden mit einer leeren Anschrift, sehr langem Namen und doppelter Kundennummer. Jeder Datensatz prüft einen bekannten Sonderfall. Dafür werden keine echten Kundendaten aus dem Produktivsystem kopiert.',
   'Regressionstest':'Eine Änderung ergänzt einen neuen Rabatt. Danach laufen die bereits vorhandenen Tests für Versandkosten und Rundung erneut. Ein alter Versandfall schlägt fehl und zeigt, dass die Änderung unbeabsichtigt bestehendes Verhalten beeinflusst hat.',
   'Testpyramide':'Für eine Buchungsfunktion gibt es 40 schnelle Tests einzelner Regeln, acht Tests mit der Datenbank und drei vollständige Browserabläufe. Viele Fehler werden früh eingegrenzt, während die wenigen Gesamtabläufe zusätzlich den gemeinsamen Weg prüfen.',
   'Reproduzierbarkeit':'Vor jedem Test wird dieselbe Lieferung mit zehn offenen Stück neu angelegt. Nach einer Buchung von drei Stück werden sieben erwartet. Weil Datenbestand und Anwendungsversion feststehen, kann eine Kollegin einen gemeldeten Fehler unter denselben Bedingungen nachstellen.'
  },
  '4.5':{
   'Soll und Ist':'Ein Export ohne Treffer soll eine leere Datei mit Spaltenüberschriften erzeugen. Tatsächlich erscheint eine Fehlermeldung und es gibt keine Datei. Im Bericht stehen diese beiden Beobachtungen getrennt, damit die Abweichung eindeutig erkennbar ist.',
   'Schweregrad':'Ein Fehler zeigt eine falsche Hintergrundfarbe; ein anderer verändert gespeicherte Rechnungsbeträge. Das Team bewertet die Folgen des zweiten Fehlers wesentlich schwerer. Diese Bewertung beschreibt zunächst den Schaden, noch nicht allein die komplette Bearbeitungsreihenfolge.',
   'Priorität':'Ein falscher Kontaktname wird in einer morgen versendeten Kundeninformation angezeigt. Das Team vereinbart seine Korrektur noch heute, während ein seltener Darstellungsfehler mit Umgehung später bearbeitet wird. Der konkrete Termin beeinflusst die Reihenfolge.',
   'Triage':'Im kurzen Befundtermin erkennt das Team, dass zwei Meldungen denselben Exportfehler beschreiben. Es führt sie zusammen, klärt die Auswirkungen und weist die Korrektur einer Verantwortlichen zu. Eine unklare dritte Meldung geht mit Rückfragen zurück.'
  },
  '4.6':{
   'Codeabdeckung':'Der Test führt alle Zeilen einer Rabattfunktion aus, prüft den berechneten Preis aber nicht. Auch eine falsche Formel kann so unbemerkt bleiben. Das Team ergänzt konkrete erwartete Beträge, statt die hohe Abdeckungszahl als Fehlerfreiheitsbeweis zu behandeln.',
   'Testbericht':'Für Version 2.6 wurden 48 Fälle in Umgebung T2 ausgeführt. Zwei Importfälle sind fehlgeschlagen, ein Lasttest ist noch offen. Diese Angaben erlauben eine begründete Freigabeentscheidung, während „46 Tests bestanden“ allein wichtige Risiken verschweigen würde.',
   'Wirksamkeitsprüfung':'Nach der Einführung früher API-Tests zählt das Team vier Wochen lang, wie viele Integrationsfehler erst vor der Freigabe auftreten. Es vergleicht den Wert mit einer ähnlich ausgelasteten Vorperiode. Erst dieser Vergleich zeigt, ob die Maßnahme geholfen hat.'
  },
  '5.1':{
   'Tutorial':'Eine neue Mitarbeiterin legt in einem Übungsportal Schritt für Schritt ihren ersten Testtermin an. Die Anleitung liefert Beispieldaten und zeigt das erwartete Ergebnis. Am Ende hat sie einen vollständigen ersten Ablauf selbst erfolgreich ausgeführt.',
   'Anleitung':'Ein erfahrener Anwender möchte alle Termine eines Monats als CSV exportieren. Er folgt einer kurzen Folge aus Zeitraum wählen, Export starten und Datei prüfen. Er muss dafür nicht zuerst einen vollständigen Einführungskurs durcharbeiten.',
   'Referenz':'Eine Entwicklerin sucht die erlaubte Länge des API-Felds betreff. Sie findet in einer Feldübersicht den Typ string, die Höchstlänge 80 und die Pflichtfeldangabe. Diese Information lässt sich gezielt nachschlagen, ohne einen Beispielablauf komplett zu lesen.',
   'Erklärung':'Ein Text erläutert, weshalb eine Terminreservierung zunächst vorläufig und erst nach Bestätigung verbindlich gespeichert wird. Er beschreibt mögliche Abbrüche und konkurrierende Zugriffe. Dadurch versteht das Team die Entwurfsentscheidung, statt nur ihre Klickfolge zu kennen.'
  },
  '5.2':{
   'Docs-as-Code':'Mit einem neuen API-Feld ändert die Entwicklerin auch dessen Beschreibung im Repository. Der gemeinsame Änderungsvorschlag enthält Code, Tests und Dokumentation. Eine automatische Linkprüfung und ein Review prüfen die Beschreibung vor der Veröffentlichung.',
   'Review':'Ein Kollege liest die geänderte Exportanleitung und findet eine fehlende Voraussetzung: Die Rolle Bericht muss zugewiesen sein. Nach seiner Rückmeldung wird diese Angabe ergänzt. Die Änderung wird dadurch vor der Veröffentlichung nutzbarer.',
   'ADR':'In ADR-07 hält das Team fest, warum es die Bedienoberfläche gemeinsam mit dem Server ausliefert. Es nennt einfache Versionsabstimmung als Vorteil und eingeschränkte getrennte Releases als Nachteil. Beide Folgen bleiben später nachvollziehbar.'
  },
  '5.3':{
   'Codekommentar':'Im Code werden Preise bewusst erst nach dem Summieren gerundet. Der Kommentar nennt die dazu vereinbarte fachliche Regel. Eine spätere Entwicklerin ändert die Reihenfolge deshalb nicht versehentlich nur aus optischen Gründen.',
   'API-Beschreibung':'Bei POST /reservierungen erklärt die Beschreibung die Felder termin_id und kunde_id, nötige Rechte und erwartete Antworten. Sie enthält auch einen belegten Termin als Fehlerbeispiel. Ein anderes Team kann diese Fälle in seinem Client korrekt behandeln.',
   'Prozessdokumentation':'Eine Störungsbeschreibung legt fest: Support nimmt den Fall auf, Betrieb prüft die Überwachung und bei Datenverlust entscheidet die Einsatzleitung über weitere Schritte. Die Übergaben benennen jeweils benötigte Informationen und zuständige Rollen.'
  },
  '5.4':{
   'Voraussetzung':'Zum Ändern eines Termins braucht eine Mitarbeiterin die Rolle Terminverwaltung und einen vorhandenen Termin. Die Anleitung nennt beides vor dem ersten Schritt. Wer die Rolle nicht hat, erkennt deshalb früh, warum der Bearbeiten-Knopf fehlt.',
   'Handlungsschritt':'In der Anleitung steht: „Wähle den Termin vom 12. Mai und klicke auf Verschieben.“ Die Anwenderin kann diese konkrete Aktion unmittelbar ausführen. Eine unklare Formulierung wie „Termin entsprechend bearbeiten“ hätte die nächste Handlung offengelassen.',
   'Erwartetes Ergebnis':'Nach Speichern soll der Termin in der Übersicht am neuen Datum erscheinen. Die Anleitung nennt genau diese Rückmeldung. Bleibt der Termin am alten Datum, erkennt die Anwenderin, dass die Änderung noch nicht erfolgreich übernommen wurde.',
   'Versionsbezug':'Ein Screenshot für Version 3.0 zeigt den neuen Menüpunkt Buchungen. Ein Team nutzt noch Version 2.8, in der er Termine heißt. Durch die angegebene Version findet es die passende Anleitung und meldet keinen vermeintlich fehlenden Menüpunkt.'
  },
  '5.5':{
   'Lernziel':'Nach der zehnminütigen Übung soll jede Person eine Doppelbuchung erkennen und eine zulässige Alternative auswählen können. Im Übungsportal wird anschließend genau so ein Fall gestellt. Die korrekte selbstständige Bearbeitung zeigt, ob das Ziel erreicht wurde.',
   'Multiplikator':'Lea schult zuerst zwei erfahrene Teammitglieder. Diese erhalten zusätzlich typische Rückfragen, Übungsfälle und Hinweise zur Erklärung schwieriger Stellen. Danach können sie die übrigen Schichten eigenständig in den neuen Ablauf einführen.',
   'Wissenssammlung':'Der Support hält den Fehler „Export ohne Berechtigung“ mit Ursache, Prüfschritten und Lösung in einem auffindbaren Eintrag fest. Eine verantwortliche Person prüft ihn nach jedem betroffenen Release. Der nächste Supportfall muss dadurch nicht von vorn untersucht werden.'
  },
  '5.6':{
   'Fachreview':'Eine Lagerfachkraft liest die Anleitung zur Stornierung und bemerkt, dass bestätigte Lieferungen anders behandelt werden müssen als Entwürfe. Sie korrigiert diese fachliche Lücke. Die Prüfung richtet sich hier auf den Inhalt, nicht nur auf Rechtschreibung.',
   'Anwendungstest einer Anleitung':'Eine neue Kollegin versucht den CSV-Export nur mithilfe der Anleitung. Sie stockt, weil der Schritt zur Auswahl des Zeitraums fehlt. Die beobachtete Unterbrechung zeigt einen konkreten Verbesserungsbedarf im beschriebenen Ablauf.',
   'Automatisierte Dokumentationsprüfung':'Beim Erstellen der Hilfeseiten prüft die Pipeline alle internen Links. Nach einer Umbenennung meldet sie einen nicht mehr vorhandenen Abschnitt. Das Team korrigiert den Verweis, bevor Nutzende auf eine leere Seite gelangen.'
  },
  '6.1':{
   'Abnahmekriterium':'Für die Terminbuchung ist vereinbart: Zwei gleichzeitige Anfragen dürfen denselben Platz nicht beide verbindlich erhalten. Im Abnahmetest erhält eine Anfrage die Buchung, die andere eine passende Ablehnung. Dieses Ergebnis wird mit dem vereinbarten Kriterium verglichen.',
   'Testnachweis':'Zu Test A-18 werden Version 3.2, Anfangsdaten, ausgeführte Schritte und die gespeicherte Buchungsnummer dokumentiert. Bei einer Rückfrage lässt sich nachvollziehen, welche Fassung tatsächlich geprüft wurde und welches Ergebnis dabei entstand.',
   'Prüfverantwortung':'Vor dem Abnahmetermin wird vereinbart: Der Fachbereich führt die Buchungsfälle aus, das Testteam dokumentiert die Befunde und die benannte Auftraggeberrolle trifft die Abnahmeentscheidung. Ein offener Befund hat dadurch einen klaren Bearbeitungsweg.'
  },
  '6.2':{
   'Mangel':'Vereinbart war ein PDF-Export mit allen Rechnungspositionen. In der gelieferten Fassung fehlen die letzten beiden Positionen. Das Team dokumentiert vereinbarten Umfang, betroffene Version und Abweichung und klärt deren Bedeutung im konkreten Vertrag.',
   'Abnahmeprotokoll':'Beim Termin werden Buchung und Suche erfolgreich geprüft; beim PDF-Export wird eine falsche Summe festgestellt. Das Protokoll hält diese Ergebnisse, den offenen Punkt, Verantwortliche und die getroffene Entscheidung nachvollziehbar fest.',
   'Nachprüfung':'Nach der PDF-Korrektur wird derselbe Fall mit zwei Positionen zu 99 und 1 Euro erneut exportiert. Jetzt muss die Summe 100 Euro betragen. Zusätzlich wird eine mehrseitige Rechnung geprüft, damit die Korrektur nicht nur den einen Fall abdeckt.'
  },
  '6.3':{
   'Release-Paket':'Für Version 3.3 gehören Anwendungsdateien, Datenbankänderung 019, Installationsschritte und passende Release Notes zusammen. Vor der Übergabe wird ihr Versionsbezug geprüft. Der Betrieb erhält so keine neue Anwendung mit einer versehentlich alten Datenbankanleitung.',
   'Runbook':'Nach einem Alarm öffnet der Bereitschaftsdienst die Anleitung „Buchungs-API antwortet nicht“. Sie nennt zuerst Statusprüfung und Protokollsuche, dann den freigegebenen Neustartweg und die anschließende Testbuchung. Auch eine Vertretung kann den Ablauf nachvollziehen.',
   'Support-Transition':'Vor Projektende bearbeitet der künftige Support zwei Übungsstörungen gemeinsam mit dem Entwicklungsteam. Bekannte Probleme und Eskalationskontakte werden übergeben. Nach dem Start weiß der Support, welche Fälle er selbst löst und wann er weitergibt.'
  },
  '6.4':{
   'Pilot':'Zunächst nutzt nur Niederlassung Nord das neue Portal. Zwei Wochen lang werden fehlgeschlagene Buchungen und Supportfragen gesammelt. Erst nach Bewertung der vereinbarten Kriterien entscheidet die Projektleitung über die Ausweitung.',
   'Big Bang':'Alle fünf Niederlassungen wechseln am Samstag zu einem vereinbarten Zeitpunkt auf das neue Portal. Schulung, Datenübernahme und Bereitschaftsdienst müssen bis dahin gemeinsam vorbereitet sein. Es gibt keine vorherige produktive Einführung je einzelner Niederlassung.',
   'Stufenweiser Roll-out':'In Woche eins startet Standort Nord, danach folgen Süd und West. Ein am ersten Standort entdeckter Bedienfehler wird vor dem nächsten Schritt korrigiert. Das spätere Vorgehen nutzt dadurch konkrete Erfahrungen aus der vorherigen Stufe.',
   'Parallelbetrieb':'Während der Einführung berechnet das alte System Berichte weiter, während das neue System dieselben vereinbarten Daten verarbeitet. Das Team vergleicht die Ergebnisse täglich. Ein festgelegter führender Datenbestand verhindert widersprüchliche Bearbeitungen.'
  },
  '6.5':{
   'Go/No-Go':'Vor dem Start werden Testergebnisse, offene Befunde und Bereitschaftsdienst gemeinsam geprüft. Ein vereinbartes Kernkriterium ist nicht erfüllt. Die entscheidungsbefugte Person verschiebt den Start, statt die Regel erst unter Zeitdruck passend umzudeuten.',
   'Rückfallplan':'Treten nach dem Portalstart länger als fünf Minuten die vereinbarten kritischen Buchungsfehler auf, entscheidet die Einsatzleitung über den Rückweg. Der Plan nennt Zugriffsstopp, Umgang mit neuen Daten, Rückkehrschritte und eine anschließende Funktionsprüfung.',
   'Monitoring':'Nach der Einführung zeigt eine Anzeige neben Serverzustand auch erfolgreiche und fehlgeschlagene Buchungen. Obwohl die Server erreichbar sind, steigt die Zahl abgewiesener Buchungen stark. Das fachliche Signal löst eine gezielte Untersuchung aus.',
   'Schwellenwert':'Für den Start ist vereinbart, dass mehr als fünf Prozent fehlgeschlagene Buchungen innerhalb von zehn Minuten einen Alarm auslösen. Bei sieben Prozent prüft der Bereitschaftsdienst den Fehler. Eine einzelne gelegentliche Ablehnung hätte diesen vereinbarten Auslöser noch nicht erreicht.'
  },
  '6.6':{
   'Schulungsbedarf':'Das Supportteam kann normale Termine buchen, kennt aber den Umgang mit einem Buchungskonflikt noch nicht. Im neuen Betrieb muss es diesen Fall selbst lösen. Die Schulung konzentriert sich deshalb gezielt auf diese festgestellte Fähigkeitslücke.',
   'Lernziel':'Nach der Supportübung soll jede Person einen Konfliktfall richtig einordnen, die vorgesehenen Daten prüfen und bei Bedarf an den Betrieb weitergeben. Ein neuer Übungsfall ohne Hilfestellung zeigt anschließend, ob diese Handlung bereits gelingt.',
   'Kirkpatrick':'Nach einer Schulung werden Rückmeldungen gesammelt und eine Übungsaufgabe geprüft. Zwei Wochen später wird beobachtet, ob die neue Routine im Alltag genutzt wird. Ob dadurch auch weniger Störungen entstehen, wird nochmals getrennt ausgewertet.'
  },
  '7.1':{
   'Baseline':'Vor einer Prozessänderung misst das Team vier Wochen lang: Zwischen fertiger Entwicklung und Review vergehen im Median 18 Stunden. Messbeginn, Zeitraum und Datenquelle werden festgehalten. Nach der Änderung kann genau dieser Ausgangswert sinnvoll verglichen werden.',
   'Kennzahl':'Für die Review-Wartezeit wird festgelegt: Start ist die Meldung „bereit zum Review“, Ende der erste fachliche Review-Beitrag. Aus allen Fällen einer Woche wird der Median gebildet. Eine andere Definition würde möglicherweise andere Zahlen liefern.',
   'PDCA':'Das Team plant eine feste tägliche Review-Zeit und erprobt sie zwei Wochen lang. Danach vergleicht es Wartezeit und Nacharbeit mit dem Ausgangszustand. Weil die Wartezeit sinkt, ohne dass Nacharbeit steigt, übernimmt es die Regel und prüft später erneut.'
  },
  '7.2':{
   '5 Why':'Ein Alarm wurde nicht bearbeitet. Beim Nachfragen zeigt sich: Er ging an ein altes Postfach, dessen Zuständigkeit beim Teamwechsel nicht aktualisiert wurde. Die Untersuchung führt zu einem überprüften Übergabeprozess statt nur zur Aufforderung, künftig besser aufzupassen.',
   'Ishikawa':'Zu häufigen Exportfehlern sammelt das Team mögliche Ursachen in Zweigen für Daten, Werkzeuge, Abläufe und Wissen. Ein veraltetes Dateiformat steht im Werkzeugzweig. Die Sammlung ist zunächst eine Hypothesenliste; anschließend werden die Ursachen mit Daten geprüft.',
   'Lessons Learned':'Nach einer verzögerten Einführung hält das Team fest, dass die Supportübergabe zu spät begann. Für das nächste Projekt wird vor dem Pilot ein gemeinsamer Störungsübungs-Termin eingeplant. Die Erfahrung führt damit zu einer konkreten Änderung des Vorgehens.'
  },
  '7.3':{
   'Nutzen-Aufwand-Matrix':'Vier Verbesserungsideen werden eingeordnet. Eine klarere Fehlermeldung verspricht viel Nutzen bei kleinem Aufwand; ein kompletter Systemwechsel wäre aufwendig. Das Team untersucht zuerst die kleine aussichtsreiche Änderung, statt beide Vorschläge gleich zu behandeln.',
   'Must':'Eine neue Abrechnungsfunktion darf ohne korrekte Berechnung der vereinbarten Beträge nicht starten. Das Team markiert diese Anforderung als unverzichtbar und begründet die Auswirkung ihres Fehlens. Ein zusätzliches Diagramm erhält diese Einstufung nicht.',
   'Alternative':'Eine langsame Suche könnte durch gezielte Abfrageverbesserung oder einen aufwendigen Produktwechsel beschleunigt werden. Das Team vergleicht beide Wege am gleichen Ziel. Auch ein begründeter Aufschub mit vorläufiger Umgehung wird als eigene Möglichkeit betrachtet.'
  },
  '7.4':{
   'Ausführungsplan':'Die Terminliste benötigt nur Einträge der nächsten Woche. Der Plan zeigt trotzdem das Lesen vieler alter Datensätze vor der Filterung. Das Team untersucht diese Stelle, statt zunächst die gesamte Tabellenstruktur ohne Messung zu verändern.',
   'EXPLAIN ANALYZE':'In einer geeigneten Testkopie wird eine SELECT-Abfrage mit EXPLAIN ANALYZE ausgeführt. Die Ausgabe enthält gemessene Zeiten und tatsächlich verarbeitete Zeilen. Das Team vergleicht diese Beobachtungen mit der Planung; die Abfrage wurde dabei wirklich ausgeführt.',
   'Index':'Eine Suche filtert regelmäßig nach kundennummer. Nach dem Anlegen eines passenden Index muss die gemessene Abfrage nicht mehr alle Kundenzeilen durchsehen. Das Team prüft auch Speicherverbrauch und zusätzlichen Aufwand beim Einfügen neuer Kunden.',
   'Denormalisierung':'Eine Übersicht speichert die Anzahl offener Termine zusätzlich zu den einzelnen Terminen. Beim Anlegen oder Absagen muss diese Anzahl mit aktualisiert werden. Ein Vergleich mit den Einzelterminen deckt auf, wenn die zusätzliche Zahl einmal veraltet ist.'
  },
  '7.5':{
   'Wertstrom':'Eine kleine Änderung wird eine Stunde entwickelt, wartet zwei Tage auf Review und einen weiteren Tag auf Auslieferung. Das Team zeichnet auch diese Übergaben ein. Es erkennt, dass schnelleres Programmieren allein den größten Zeitverlust nicht beseitigt.',
   'Durchlaufzeit':'Ein Änderungswunsch wird am Montag um 9 Uhr verbindlich angenommen und am Donnerstag um 9 Uhr nutzbar bereitgestellt. Zwischen den vereinbarten Messpunkten liegen 72 Stunden. Darin sind auch Wartezeiten enthalten, nicht nur aktive Bearbeitungsstunden.',
   'DORA-Metriken':'Ein Team liefert häufiger aus, muss aber gleichzeitig mehr Änderungen unmittelbar reparieren. Es betrachtet Lieferhäufigkeit und Instabilität gemeinsam und untersucht die Ursachen. Aus einer einzelnen hohen Lieferzahl wird keine Rangliste einzelner Entwickler erstellt.'
  },
  '7.6':{
   'ADR':'Vor einem Jahr entschied sich das Team gegen Offline-Erfassung, weil alle Standorte stabile Netze hatten. Der ADR enthält diese Annahme ausdrücklich. Nach einer neuen mobilen Nutzung lässt sich erkennen, welcher Teil der damaligen Begründung nicht mehr gilt.',
   'Maßnahmenverfolgung':'Aus einer Nachbereitung entsteht die Aufgabe „Alarmempfänger prüfen“, verantwortlich ist Nora, Termin ist Freitag. Die Liste zeigt zunächst „in Arbeit“, später den Prüfnachweis und den Abschluss. Beim Folgetermin wird zusätzlich eine Probealarmierung ausgewertet.',
   'Prüfanlass':'Ein Portal wurde für 50 gleichzeitige Nutzende geplant. Eine neue Niederlassung erhöht die erwartete Nutzung auf 300. Das Team prüft deshalb die bisherigen Lastannahmen und Architekturentscheidungen erneut, auch wenn aktuell noch keine Störung gemeldet wurde.'
  },
  '8.1':{
   'Personenbezogene Daten':'In einem Export steht nur die Kennung K-42. Eine zugängliche Kundentabelle ordnet sie aber eindeutig Mira König zu. Das Entfernen des sichtbaren Namens macht diese Daten deshalb nicht automatisch anonym.',
   'Zweckbindung':'Ein Portal erfasst eine Telefonnummer, um einen gewünschten Rückruf zu ermöglichen. Später möchte ein anderes Team die Nummern für Werbung nutzen. Diese zusätzliche Nutzung wird gesondert geprüft und nicht einfach aus dem Rückrufzweck abgeleitet.',
   'Datenminimierung':'Für eine Termin-Erinnerung reichen im Beispiel Terminbezug und Kontaktadresse. Das Team entfernt die bislang verpflichtende Frage nach dem Lieblingssport, weil sie für die Erinnerung nicht gebraucht wird. Das Formular sammelt danach weniger unnötige Angaben.',
   'Rechtsgrundlage':'Ein Unternehmen klärt mit der zuständigen Stelle, auf welcher Grundlage es Lieferdaten für einen vereinbarten Auftrag verarbeitet. Eine zusätzliche Newsletter-Nutzung wird separat bewertet. Ein gemeinsames Formular ersetzt diese Prüfung der unterschiedlichen Zwecke nicht.'
  },
  '8.2':{
   'Verantwortlicher':'Eine Praxis entscheidet, dass ein Terminportal für ihre Patiententermine eingesetzt wird und welche Angaben dafür benötigt werden. Sie legt Zweck und wesentliche Gestaltung fest. Der bloße Einkauf einer technischen Dienstleistung gibt diese Verantwortung nicht automatisch ab.',
   'Auftragsverarbeiter':'Ein Hostingdienst speichert vereinbarte Portal-Daten nach den Weisungen des Kunden und nutzt sie im Beispiel nicht für eigene Zwecke. Die Beteiligten klären Rollen und erforderliche Vereinbarungen. Eigene Entscheidungen über neue Nutzungszwecke wären gesondert zu bewerten.',
   'Betroffenenrechte':'Eine Kundin meldet, dass ihre Anschrift im Portal falsch ist. Nach angemessener Zuordnungsprüfung wird ihr Berichtigungsanliegen an die zuständige Stelle geleitet. Bearbeitung und Rückmeldung werden nachvollziehbar dokumentiert.',
   'DSFA':'Ein geplanter Dienst soll Bewegungsmuster von Beschäftigten dauerhaft auswerten. Vor dem Start werden mögliche Folgen, Notwendigkeit und Schutzmaßnahmen mit der zuständigen Datenschutzstelle untersucht. Dabei wird geklärt, ob eine Datenschutz-Folgenabschätzung erforderlich ist und wie sie durchgeführt wird.'
  },
  '8.3':{
   'Vertraulichkeit':'Im Portal darf eine Sachbearbeiterin nur die Kundenvorgänge ihres Zuständigkeitsbereichs lesen. Ein Test mit einem fremden Vorgang wird abgewiesen. So wird geprüft, ob nicht berechtigte Personen die Informationen tatsächlich nicht erhalten.',
   'Integrität':'Eine Exportdatei wird übertragen und anschließend mit einem dafür vorgesehenen Prüfverfahren kontrolliert. Eine unerwartete Veränderung fällt auf und die Datei wird nicht ungeprüft verarbeitet. Die Kontrolle betrifft die Unversehrtheit der Daten, nicht allein ihre Erreichbarkeit.',
   'Verfügbarkeit':'Der erste Portalserver fällt aus. Der vorbereitete Ersatzweg hält die Buchungsfunktion im vereinbarten Umfang erreichbar. Ein anschließender Test prüft, ob Nutzende wirklich buchen können, statt nur einen laufenden Ersatzserver nachzuweisen.',
   'ISMS':'Die IT-Leitung führt ein Risikoregister für das Portal, benennt Verantwortliche und lässt Maßnahmen regelmäßig prüfen. Nach einer Störung werden die Regeln angepasst. Informationssicherheit wird dadurch als fortlaufender organisierter Prozess behandelt.',
   'ISO/IEC 27001 und IT-Grundschutz':'Eine Organisation legt Verantwortlichkeiten und Prüfungen für ihr Sicherheitsmanagement fest. Für konkrete Schutzmaßnahmen zieht sie passende IT-Grundschutz-Bausteine heran. Bei der späteren Prüfung werden tatsächliche Nachweise betrachtet; ein Zertifikat allein ersetzt keine getestete Wiederherstellung.'
  },
  '8.4':{
   'Technische Maßnahme':'Die Portalverwaltung verlangt neben dem Passwort einen zweiten Anmeldefaktor. Im Test reicht ein bekannt gewordenes Passwort allein nicht für die Anmeldung. Die technische Anmeldefunktion setzt damit einen zusätzlichen Schutzmechanismus um.',
   'Organisatorische Maßnahme':'Beim Austritt eines Mitarbeiters löst die Personalstelle einen festgelegten Ablauf aus. Die benannte IT-Rolle entzieht die Zugänge und dokumentiert den Abschluss. Der Prozess verhindert, dass ehemalige Beschäftigte wegen unklarer Zuständigkeit weiterberechtigt bleiben.',
   'Least Privilege':'Eine neue Supportkraft soll Termine ansehen, aber keine Benutzerrechte vergeben. Sie bekommt nur die dafür vorgesehene Rolle. Ein Test zeigt, dass die Terminansicht funktioniert und die Rechteverwaltung für dieses Konto gesperrt bleibt.',
   'Restore-Test':'Eine Sicherung vom Vortag wird in eine getrennte Testumgebung zurückgespielt. Das Team prüft die erwarteten Datensätze und führt eine Testbuchung aus. Erst damit ist gezeigt, dass diese Sicherung nicht nur vorhanden, sondern praktisch nutzbar ist.'
  },
  '8.5':{
   'Vertrauensgrenze':'Ein Browser sendet menge = -10 an die interne Buchungs-API. Die API prüft den Wert selbst und verlässt sich nicht auf die ausgeblendete Minustaste in der Oberfläche. Die externe Eingabe überschreitet hier eine Grenze, an der Annahmen neu geprüft werden müssen.',
   'STRIDE':'Im Bedrohungsmodell betrachtet das Team, ob jemand eine fremde Identität vortäuschen oder Buchungsbeträge verändern könnte. Es ordnet die Szenarien Spoofing und Tampering zu. Für jedes Szenario werden anschließend passende Prüfungen und Schutzmaßnahmen abgeleitet.',
   'Restrisiko':'Nach einem Wiederherstellungstest kann das Portal einen Serverausfall innerhalb von 30 Minuten überbrücken. Eine Unterbrechung in dieser Zeit bleibt trotzdem möglich. Die zuständige Rolle bewertet diesen verbleibenden Teil und legt weitere Beobachtung oder Maßnahmen fest.',
   'Risikobehandlung':'Eine ungenutzte öffentliche Schnittstelle wird vollständig abgeschaltet, statt nur durch zusätzliche Prüfungen abgesichert zu werden. Für eine weiter benötigte Schnittstelle werden dagegen Rechteprüfungen ergänzt. Die beiden Entscheidungen behandeln Risiken auf unterschiedliche Weise.'
  },
  '8.6':{
   'IT-Governance':'Für Änderungen am Portal sind Entscheidungsrollen festgelegt: Der Fachbereich bestimmt den Nutzen, die IT bewertet Technik und die benannte Leitung genehmigt das Vorhaben. Ein neues Projekt folgt diesem Weg, statt allein durch einen einzelnen Produktkauf gestartet zu werden.',
   'IT-Compliance':'Eine verbindliche Vorgabe verlangt eine quartalsweise Prüfung administrativer Rechte. Das Unternehmen plant die Termine, führt die Prüfungen aus und hält die Ergebnisse fest. Im Audit kann es so mehr als eine bloße Absichtserklärung vorlegen.',
   'Audit':'Eine Prüferin untersucht für das letzte Quartal die vereinbarte Rechteprüfung. Sie vergleicht die Vorgabe mit tatsächlichen Prüfprotokollen und ausgewählten Konten. Fehlende Belege werden als Befund festgehalten und zur Bearbeitung weitergegeben.',
   'Kontrollnachweis':'Das Prüfprotokoll vom 30. Juni nennt geprüfte Administrationskonten, die verantwortliche Person und zwei entfernte Berechtigungen. Es belegt eine durchgeführte Kontrolle. Eine leere Vorlage ohne Datum oder Ergebnis würde diese Durchführung nicht zeigen.'
  },
  '8.7':{
   'Werkvertrag':'Im Beispiel wird ein funktionsfähiger Export mit ausdrücklich beschriebenen Feldern vereinbart. Bei der Prüfung wird untersucht, ob dieses zugesagte Ergebnis erreicht wurde. Die bloße Zahl aufgewendeter Programmierstunden beantwortet diese Frage noch nicht.',
   'Dienstvertrag':'Ein Vertrag sieht acht Stunden fachliche Beratung zu einer bestehenden Anwendung vor. Die Beraterin führt die vereinbarten Workshops durch und dokumentiert die geleistete Tätigkeit. Ein bestimmter späterer Verkaufserfolg ist in diesem Beispiel nicht zugesagt.',
   'Change Request':'Kurz vor dem Release wird ein weiteres Exportformat gewünscht. Das Team erfasst den Wunsch, schätzt Zusatzaufwand und Terminfolgen und legt Optionen vor. Erst nach der vereinbarten Entscheidung wird der zusätzliche Umfang in die Planung aufgenommen.',
   'Leistungsumfang':'Für die erste Fassung sind Terminbuchung und CSV-Export vereinbart; eine mobile App ist ausdrücklich ausgenommen. Bei der Übergabe werden die vereinbarten Teile geprüft. Der später geäußerte App-Wunsch wird als möglicher Zusatz gesondert behandelt.'
  },
  '8.8':{
   'Abhängigkeit':'Das Portal verwendet eine fremde Bibliothek zur PDF-Erstellung. Eine neue Bibliotheksfassung verändert einen benötigten Aufruf. Die Anwendung muss diese externe Änderung berücksichtigen, obwohl der eigene Fachcode für Rechnungen unverändert geblieben ist.',
   'Komponentenverzeichnis':'Ein Eintrag nennt die PDF-Bibliothek, ihre eingesetzte Version, Bezugsquelle, Lizenz und verantwortliche Rolle. Als eine Sicherheitsmeldung eintrifft, findet das Team die betroffenen Anwendungen. Ohne diese Übersicht müsste es zunächst mühsam nach dem tatsächlichen Einsatz suchen.',
   'Betroffenheitsprüfung':'Eine Meldung betrifft Versionen 1.4 bis 1.6 einer Bibliothek. Das Team prüft eingesetzte Version, betroffene Funktion und Nutzung im Portal. Es dokumentiert das Ergebnis, statt die Meldung allein wegen des gleichen Produktnamens als zutreffend zu behandeln.',
   'Regressionstest':'Nach einem Sicherheitsupdate der PDF-Bibliothek laufen die bisherigen Exportfälle erneut: leere Rechnung, mehrere Seiten und Sonderzeichen. Dabei fällt ein neuer Zeilenumbruchfehler auf. Die Sicherheitskorrektur wird dadurch nicht mit ungeprüft verändertem Altverhalten ausgeliefert.'
  },
  '9.1':{
   'Teilprojektziel':'Bis zum 15. November sollen alle sechs Supportkräfte einen Buchungskonflikt im Übungsportal selbstständig korrekt bearbeiten. Eine praktische Abschlussübung liefert den Nachweis. Das Teilprojekt Schulung hat damit einen konkreten Beitrag und einen überprüfbaren Termin.',
   'Projektstrukturplan':'Das Portalprojekt wird in Anwendung, Datenübernahme, Betriebsvorbereitung und Schulung zerlegt. Unter Schulung stehen Unterlagen, Übungen und Durchführung als Arbeitspakete. Die Übersicht zeigt den Umfang; deren genaue Termine werden separat geplant.',
   'RACI':'Für die Schulungsunterlagen schreibt Lea als Responsible, Ben trägt als Accountable die abschließende Ergebnisverantwortung. Eine Fachkraft wird Consulted, die Teamleitung Informed. Dadurch ist klar, wer arbeitet, wer verantwortet und wer auf welchem Weg beteiligt wird.'
  },
  '9.2':{
   'Iterativ':'Ein Team zeigt zunächst einen einfachen Buchungsablauf. Testpersonen entdecken eine unklare Terminauswahl. Im nächsten Durchgang wird diese verbessert und erneut ausprobiert, bevor weitere Sonderfunktionen hinzukommen.',
   'Kanban':'Auf dem Board stehen die Spalten Bereit, In Arbeit und Prüfung. Für In Arbeit gilt ein Limit von drei Aufgaben. Ist die Spalte voll, hilft das Team zunächst beim Fertigstellen, statt immer weitere Aufgaben gleichzeitig zu beginnen.',
   'Definition of Done':'Eine Funktion ist programmiert, aber ihre vereinbarten Integrationstests fehlen noch. Nach der gemeinsamen Definition of Done ist sie deshalb noch nicht fertig. Das Team erledigt die offenen Qualitätsarbeiten, bevor es sie als abgeschlossenes Increment behandelt.',
   'Definition of Ready':'Ein Team vereinbart für seine Planung, dass Ziel, offene Fragen und erkennbare Abhängigkeiten einer Aufgabe besprochen sein sollen. Eine unklare Aufgabe wird zunächst gemeinsam geschärft. Das ist diese zusätzliche Teamvereinbarung, kein vorgeschriebenes Scrum-Artefakt.'
  },
  '9.3':{
   'Stakeholder':'Ein neuer Portal-Roll-out betrifft auch den Bereitschaftsdienst, der nicht zum Projektteam gehört. Er wird in die Startplanung einbezogen und fordert aktuelle Hilfewege. Seine Beteiligung verbessert die spätere Unterstützung bei Störungen.',
   'Kommunikationsplan':'Eine Tabelle legt fest: Die Leitung erhält freitags einen Statusbericht, der Betrieb vor jeder Auslieferung die Betriebsänderungen und Nutzende eine Woche vor dem Start eine kurze Anleitung. Zu jeder Nachricht sind Kanal und Absender benannt.',
   'Eskalationsweg':'Bei einem ungelösten Terminproblem spricht das Team zuerst mit der Teilprojektleitung. Reicht deren Entscheidungsspielraum nicht, geht eine Vorlage an die Projektleitung. So bleibt das Problem nicht in einer endlosen Folge gleichberechtigter Rückfragen hängen.'
  },
  '9.4':{
   'Risiko':'Der Lieferant könnte den benötigten Scanner erst nach dem geplanten Testtermin liefern. Noch ist die Lieferung nicht verspätet. Das Team bewertet mögliche Folgen und reserviert vorsorglich ein geeignetes Ersatzgerät.',
   'Issue':'Der vereinbarte Scanner ist am heutigen Testtag tatsächlich nicht angekommen. Die Tests können so nicht starten. Das Team behandelt nun das eingetretene Problem mit Verantwortlichem und Entscheidung über einen Ersatzablauf.',
   'Risikoregister':'Ein Eintrag beschreibt eine mögliche verspätete Schnittstelle, ihre Terminwirkung und die verantwortliche Person. Als Maßnahme wird ein Testdouble mit Termin vereinbart. Im nächsten Statusgespräch wird geprüft, ob sich Eintrittswahrscheinlichkeit oder Maßnahmenstand geändert haben.',
   'Eskalation':'Eine externe Schnittstelle verzögert den Test voraussichtlich um zwei Wochen. Die Teilprojektleitung legt der Projektleitung zwei Optionen mit Kosten- und Terminfolgen vor und nennt den nötigen Entscheidungstermin. Die Meldung ist damit konkret entscheidbar.'
  },
  '9.5':{
   'Netzplan':'Die Aufgaben A, B und C werden mit Dauer und Pfeilen gezeichnet: A braucht zwei Tage, danach folgen B mit vier und C mit drei Tagen parallel. Die Skizze macht sichtbar, dass B und C erst nach A beginnen können.',
   'Ende-Anfang-Beziehung':'Der Importtest benötigt die fertig eingerichtete Testdatenbank. Endet deren Einrichtung am Mittwoch, kann der Test bei sofortiger Verfügbarkeit erst danach starten. Ein früher geplanter Testbeginn wäre mit dieser Abhängigkeit nicht möglich.',
   'Kritischer Pfad':'A dauert zwei Tage. Danach folgen parallel B mit fünf und C mit drei Tagen; D benötigt beide und dauert zwei Tage. A–B–D braucht neun, A–C–D sieben Tage. Im einfachen Modell bestimmt der längere Weg den frühesten Abschluss.',
   'Gesamtpuffer':'Im Netzplan dauern die Wege A–B–D neun und A–C–D sieben Tage. C kann im einfachen Modell um zwei Tage verzögert werden, ohne das Ende von Tag neun zu verschieben. Eine größere Verzögerung würde schließlich auch den Projektabschluss treffen.'
  },
  '9.6':{
   'Aufwand':'Für das Überarbeiten einer Anleitung werden sechs Personenstunden geschätzt. Zwei geeignete Personen könnten teilbare Arbeit gemeinsam bearbeiten; der Umfang bleibt insgesamt sechs Personenstunden. Damit ist noch nicht gesagt, an welchem Kalendertag die Anleitung fertig wird.',
   'Kapazität':'Eine Entwicklerin hat diese Woche 30 Arbeitsstunden. Nach Support und festen Terminen bleiben 18 Stunden für das Projekt. Die Planung setzt deshalb nicht die gesamten 30 Stunden als verfügbare Entwicklungsleistung an.',
   'PERT-Schätzung':'Für eine Aufgabe werden zwei Tage optimistisch, fünf wahrscheinlich und acht pessimistisch geschätzt. Der gewichtete Wert lautet (2 + 4 × 5 + 8) / 6 = 5 Tage. Die Zahl bleibt eine Schätzung unter den genannten Annahmen.',
   'Dauer':'Ein Arbeitspaket benötigt acht Stunden konzentrierte Arbeit. Die zuständige Person kann täglich zwei Stunden dafür einsetzen. Ohne weitere Wartezeiten verteilt sich die Bearbeitung dadurch auf vier Arbeitstage statt auf einen einzigen Tag.'
  },
  '9.7':{
   'PV':'Bis Freitag sollten laut Plan vier gleich bewertete Arbeitspakete zu je 1.000 Euro fertig sein. Der geplante Leistungswert zum Freitag beträgt damit 4.000 Euro. Ob tatsächlich schon alle Pakete fertig sind, wird an dieser Stelle noch nicht bewertet.',
   'EV':'Von den vier gleich bewerteten Arbeitspaketen sind am Freitag nur drei nach den vereinbarten Regeln fertig. Ihr budgetierter Wert beträgt zusammen 3.000 Euro. Dieser erreichte Leistungswert ist unabhängig davon, wie viel Geld bisher tatsächlich ausgegeben wurde.',
   'AC':'Für die bisherige Projektarbeit wurden 2.600 Euro Personalaufwand und 1.150 Euro externe Leistungen erfasst. Die tatsächlich angefallenen Kosten betragen damit 3.750 Euro. Ob dieser Betrag gut oder schlecht zum Leistungsstand passt, braucht einen gesonderten Vergleich.',
   'CPI':'Der erreichte Leistungswert beträgt 3.000 Euro, die tatsächlichen Kosten 3.750 Euro. CPI = 3.000 / 3.750 = 0,8. Für jeden ausgegebenen Euro wurden hier nur 0,80 Euro budgetierter Leistungswert erreicht; das Team untersucht die Kostenabweichung.',
   'SPI':'Zum Stichtag waren 4.000 Euro Leistungswert geplant, erreicht wurden 3.000 Euro. SPI = 3.000 / 4.000 = 0,75. Der erreichte Leistungswert liegt unter dem Plan; daraus lassen sich ohne weitere Planung keine festen Verspätungstage ableiten.'
  },
  '9.8':{
   'Roll-out-Koordination':'Für den Portalstart werden Datenübernahme, Informationsversand und Supportbereitschaft zeitlich abgestimmt. Die Einführungsleitung bestätigt, dass alle drei bereit sind. Der Start erfolgt nicht schon deshalb, weil allein die neue Software installiert wurde.',
   'Wissenstransfer':'Eine Projektentwicklerin bearbeitet einen Störungsfall gemeinsam mit einer Supportkraft. Danach löst die Supportkraft einen ähnlichen Fall selbst und erklärt ihre Schritte. So wird sichtbar, dass Wissen in der neuen Rolle tatsächlich angewendet werden kann.',
   'Sicherheitsunterweisung':'Im Training erhält die Gruppe eine nachgestellte verdächtige E-Mail ohne echte Schadfunktion. Sie übt, den Anhang nicht zu öffnen und die Nachricht über den vereinbarten Meldeweg weiterzugeben. Danach werden Erkennungsmerkmale und richtige Schritte besprochen.',
   'Wirksamkeitskontrolle':'Vier Wochen nach dem Roll-out werden Supportfälle mit falsch weitergegebenen Buchungskonflikten ausgewertet. Die Werte werden mit einer vergleichbaren Ausgangsphase betrachtet. Das Team prüft damit, ob Schulung und Hilfewege die beabsichtigte Verbesserung erreicht haben.'
  },
 },
 common:{
  'API':'Die Terminoberfläche fordert freie Plätze beim Server an und erhält drei Termin-Kennungen als Antwort. Nach der Auswahl sendet sie eine Buchungsanfrage. Sie nutzt dabei vereinbarte Schnittstellen, statt selbst in der Datenbank nach freien Plätzen zu suchen.',
  'SQL':'Eine Artikeltabelle enthält A7 mit Bestand 12 und B2 mit Bestand 0. Die Abfrage SELECT artikel_id FROM artikel WHERE bestand < 5 liefert hier B2. Die Datenbank filtert die Zeilen nach der angegebenen Bedingung.',
  'REST':'Ein Client fragt mit GET /termine/17 einen Termin ab. Für eine vollständige vereinbarte Aktualisierung sendet er eine passende Darstellung mit PUT an dieselbe Ressourcenadresse. Die benötigten Anfragedaten stehen jeweils im Aufruf; die URL bezeichnet die Ressource.',
  'Normalisierung':'In 30 Auftragszeilen steht derselbe Kundenname. Das Team legt die Kundenangaben einmal unter kunde_id ab und lässt die Aufträge darauf verweisen. Bei einer Namensänderung wird nun ein Kundendatensatz geändert, statt 30 einzelne Auftragszeilen nachzupflegen.',
  'Redundanz':'Eine Kontaktadresse steht sowohl in der Kundenliste als auch in einer manuell geführten Versandliste. Nach einem Umzug wird nur die Kundenliste aktualisiert. Eine Sendung geht deshalb noch an die alte Adresse der zweiten Liste.',
  'Kardinalität':'Mitglied M1 hat aktuell keine Ausleihe, M2 hat drei. Beide Fälle sind in diesem Bibliotheksmodell erlaubt. An der Beziehung vom Mitglied zu seinen Ausleihen wird deshalb 0..n notiert; jede Ausleihe verweist dagegen auf genau ein Mitglied.',
  '1NF':'Ein Telefonfeld enthält die beiden getrennt zu verwaltenden Nummern „111, 222“. Für das Ändern nur einer Nummer müsste eine Liste im Feld zerlegt werden. Stattdessen bekommt jede Nummer eine eigene Zeile mit der zugehörigen Personenkennung.',
  '2NF':'In Teilnahme(person_id, kurs_id, kurstitel) steht „Datenbanken“ bei vielen Personen immer wieder zum gleichen Kurs. Der Titel hängt bereits von kurs_id allein ab. Kurs und Kurstitel werden deshalb getrennt von den einzelnen Teilnahmen gespeichert.',
  '3NF':'In Mitarbeiter(mitarbeiter_id, abteilungs_id, abteilungsname) wiederholt sich „Einkauf“ bei allen Beschäftigten derselben Abteilung. Das Team speichert den Abteilungsnamen unter abteilungs_id in einer eigenen Tabelle. Eine Umbenennung wird danach an einer Stelle gepflegt.',
  'Entität':'Im Geräteverzeichnis ist der konkrete Scanner S-17 mit Seriennummer, Modell und Standort erfasst. Zieht genau dieser Scanner in ein anderes Lager um, wird sein Standort geändert. Es bleibt dasselbe unterscheidbare Gerät im Verzeichnis.',
  'Attribut':'Der Datensatz für Scanner S-17 enthält das Feld standort mit dem Wert „Halle B“. Beim Umzug wird der Wert in „Halle C“ geändert. standort ist dabei die beschriebene Eigenschaft; die beiden Hallennamen sind konkrete Werte dieser Eigenschaft.',
  'Primärschlüssel':'Zwei Lieferungen kommen am selben Datum an und haben denselben Lieferanten. Die Datensätze erhalten lieferung_id 730 und 731. Über diese eindeutigen Kennungen kann eine Buchung auch dann die richtige Lieferung auswählen, wenn Datum und Lieferant übereinstimmen.',
  'Fremdschlüssel':'Ausleihe L-8 speichert mitglied_id M-9. Weil M-9 in der Mitgliedertabelle vorhanden ist, kann die Zuordnung hergestellt werden. Eine weitere Ausleihe mit einer unbekannten Mitgliedskennung wird durch die eingerichtete Fremdschlüsselregel abgelehnt.',
  'Kandidatenschlüssel':'Im Geräteverzeichnis sind sowohl geraet_id als auch inventarnummer jeweils eindeutig und verpflichtend vergeben. Jede Kennung allein reicht zum Identifizieren eines Geräts. Das Team wählt geraet_id als Primärschlüssel; inventarnummer bleibt eine weitere minimale eindeutige Kennung.',
  'Funktionale Abhängigkeit':'Im vereinbarten Modell gehört zur Artikelnummer A-17 genau eine aktuelle Artikelbezeichnung. Tragen zwei Zeilen zu A-17 widersprüchliche Bezeichnungen, ist die Regel verletzt. Der Bezeichnung „Kabel“ dürfen dagegen mehrere verschiedene Artikelnummern zugeordnet sein.',
  'm:n-Beziehung':'Person P-1 besucht die Kurse K-2 und K-3. In K-2 nimmt außerdem P-4 teil. Die Tabelle Teilnahme enthält dafür die Paare (P-1, K-2), (P-1, K-3) und (P-4, K-2), sodass jede einzelne Zuordnung gespeichert ist.',
  '1:n-Beziehung':'Kundin K-4 besitzt die Bestellungen B-10 und B-11. Beide Bestellungen speichern K-4 als zugehörige Kundenkennung. Jede Bestellung gehört in diesem Modell nur einem Kunden, während derselbe Kunde weitere Bestellungen haben kann.',
  '1:1-Beziehung':'Person P-7 hat in diesem Modell genau eine aktive Zugangskarte Z-12. Z-12 darf gleichzeitig keiner anderen Person zugewiesen sein. Beim Ersatz der Karte muss die alte Zuordnung beendet werden, damit diese vereinbarte Eindeutigkeit erhalten bleibt.',
  'Stakeholder':'Eine Schule führt eine Stundenplan-App ein. Lehrkräfte brauchen verständliche Änderungsmeldungen, das Sekretariat muss Vertretungen pflegen und der Betrieb betreut die Anmeldung. Die unterschiedlichen Anliegen dieser beteiligten Gruppen werden vor der Einführung berücksichtigt.',
  'Transaktion':'Bei einer Platzumbuchung wird zunächst der alte Platz freigegeben und dann der neue belegt. Scheitert die zweite Änderung, wird die erste innerhalb der korrekt behandelten gemeinsamen Transaktion zurückgenommen. Die Person verliert dadurch nicht versehentlich ihre bisherige Reservierung.'
 }
};
if(typeof module!=='undefined'&&module.exports)module.exports=GlossaryExamples;
