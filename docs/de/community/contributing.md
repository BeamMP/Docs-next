---
description: "Hilf mit, die BeamMP-Dokumentation zu verbessern: eine Seite auf GitHub bearbeiten, Änderungen lokal ansehen, den Styleguide befolgen und was nach einem Pull Request passiert."
---
# Mitwirken

Du kannst helfen, diese Dokumentation zu verbessern, indem du einen Fehler behebst, etwas Fehlendes ergänzt oder eine Seite schreibst. Diese Seite zeigt dir, wie.

## Bevor du schreibst

Lies den [Styleguide](https://github.com/__repo__/blob/main/STYLE_GUIDE.md). Er beschreibt, wie eine Seite zu lesen sein soll, wann welche Box verwendet wird und wie man Bilder und Links schreibt.

Die englischen Seiten sind die Vorlage. Ändere die englische Seite, dann ziehen die anderen Sprachen nach. Wenn du beim Übersetzen helfen möchtest, siehe [Übersetzen](#translating).

## Eine Seite auf GitHub bearbeiten

Das ist der schnellste Weg für Rechtschreibung, Grammatik und kleine Ergänzungen. Du brauchst dafür etwas Wissen über Markdown.

1. Klicke unten auf der Seite, die du ändern möchtest, auf **Edit this page**.
2. Forke das Projekt in dein eigenes GitHub-Konto.
3. Nimm deine Änderungen vor.
4. Committe sie in deinen Fork.
5. Eröffne einen Pull Request gegen [@repo@](https://github.com/__repo__).

## Änderungen lokal ansehen

Bei größeren Änderungen siehst du dir die Vorschau beim Schreiben an.

1. Forke das Projekt und klone deinen Fork.
2. Installiere [Node.js](https://nodejs.org) 22 oder neuer und führe dann `npm install` aus.
3. Führe `npm run dev` aus und öffne die Adresse, die ausgegeben wird. Die Seite aktualisiert sich, während du bearbeitest.
4. Nimm deine Änderungen vor und führe dann `npm test` und `npm run check` aus. Die Prüfung findet tote Links, nicht geschlossene Boxen, fehlende Bilder und Seiten, die nicht dargestellt werden.
5. Committe in deinen Fork und eröffne einen Pull Request.

## Was danach passiert

Ein Mitglied des BeamMP-Mod-Teams prüft deinen Pull Request und genehmigt ihn entweder oder bittet um Änderungen. Wenn du die Änderungen vorgenommen hast, prüfen wir ihn erneut. Sobald er zusammengeführt ist, wird er automatisch bereitgestellt.

## Übersetzen {#translating}

Englisch ist die Vorlage. Die anderen Sprachen haben dieselben Seiten unter denselben Pfaden, eine Änderung beginnt also auf der englischen Seite.

1. Führe `npm run check:translations` aus. Es listet die Übersetzungen auf, die veraltet sind, weil sich ihre englische Seite geändert hat.
2. Aktualisiere jede davon anhand der englischen Seite. Behalte Überschriften, Boxen, Bilder und Links bei und übersetze weder Code noch Befehle, Dateinamen oder Einstellungsschlüssel.
3. Halte die Aktualisierung fest: `npm run check:translations -- --record de/players/faq.md`.

Für die Einstellungen und Schaltflächen des Mods verwenden Französisch und Chinesisch die genauen Bezeichnungen aus den Übersetzungsdateien des Mods. Deutsch, Spanisch, Italienisch und Russisch behalten die englischen Bezeichnungen, weil das Spiel dort Englisch anzeigt. Die vollständigen Regeln stehen in der [README](https://github.com/__repo__#translations).
