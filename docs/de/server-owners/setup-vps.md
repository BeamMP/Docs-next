---
description: "Richte einen BeamMP-Server auf einem VPS oder in der Verwaltungsoberfläche eines Hosting-Anbieters ein: AuthKey holen, Felder ausfüllen, Mods hinzufügen, Spieler beitreten lassen."
---
# Server-Einrichtung auf einem VPS

Diese Anleitung ist für einen Server auf einem VPS oder bei einem Hosting-Anbieter, der eine Verwaltungsoberfläche hat. Wenn du stattdessen zu Hause hosten möchtest, folge der Anleitung [Einen Server hosten](/de/server-owners/host-a-server).

Beim Hosting auf einem VPS musst du weder an der Firewall noch an der Portweiterleitung deines Routers etwas ändern.

## Bevor du anfängst

Server sind ein wesentlicher Teil von BeamMP: Die Spieler verbinden sich über den Server miteinander. Du kannst einen privaten Server erstellen, dem nur Leute beitreten können, die du einlädst, oder einen öffentlichen Server, der in der offiziellen Serverliste erscheint.

Lies die [LICENSE](https://raw.githubusercontent.com/BeamMP/BeamMP-Server/master/LICENSE) des Servers, bevor du ihn verwendest.

Wenn Probleme auftreten, frag im [Forum](https://forum.beammp.com) oder im Kanal `#support` auf dem [Discord-Server](https://discord.gg/beammp). [Server-Konfiguration](/de/server-owners/configuration) beschreibt die Einstellungen des Servers genauer.

Wenn du noch keinen VPS ausgewählt hast, sieh dir unsere Hosting-Partner an. Sie sind kostenpflichtig.

::: details Hosting-Partner
<!--@include: ./_parts/partners.md-->
:::

## Den VPS einrichten

Stelle sicher, dass die Verwaltungsseite deines Servers erreichbar ist. Wenn du geprüft hast, dass der Server betriebsbereit ist, mach weiter.

<!--@include: ./_parts/authkey.md-->

## Die Felder der Oberfläche ausfüllen

Die Hosting-Oberfläche hat einige Felder zum Ausfüllen. Mit `*` markierte Felder sind Pflichtfelder.

1. Füge deinen AuthKey in das Feld **Authkey** ein.
2. Gib deinem Server einen Namen und eine Beschreibung. Du kannst sie mit Farben und mehr formatieren: siehe [Das Aussehen deines Servernamens anpassen](/de/server-owners/configuration#customize-the-look-of-your-server-name).

::: warning
Du kannst die `ServerConfig.toml` nicht direkt im Dateimanager bearbeiten. Das ist Absicht, damit der Hosting-Anbieter Limits wie die Spielerzahl durchsetzen kann.
:::

### Prüfen, ob er startet

Starte deinen Server und achte auf Meldungen mit `[ERROR]` oder `[WARN]`. Der Server sollte jetzt laufen bleiben. Füge dann Mods hinzu, wenn du welche möchtest, und lies nach, wie man beitritt.

## Mods hinzufügen

Du kannst Mods über den Dateimanager der Oberfläche hinzufügen. Fahrzeug-Mods und Karten-Mods werden unterschiedlich installiert, aber beide kommen in den Ordner `Resources/Client` deines Servers. Lege die `.zip`-Datei des Mods in diesen Ordner.

::: warning
Mods können mit BeamNG, BeamMP oder anderen Mods inkompatibel sein oder werden. Wenn du Probleme hast, entferne nach und nach Mods. Wenn du nach dem Hinzufügen von Mods beim Beitreten eine Meldung „done“ oder „start“ erhältst, hast du wahrscheinlich einen inkompatiblen oder defekten Mod hinzugefügt. Wenn du Client-Mods installiert hast, lies unter [Mod-Sicherheit](/de/players/mod-safety), wie du sie aus deinem Spiel entfernst.
:::

### Fahrzeug- und andere Mods

Lege die `.zip`-Datei des Mods in `Resources/Client`. Jeder, der beitritt, lädt sie automatisch herunter.

### Karten

Die Standardkarten funktionieren, ohne dass du etwas installieren musst. Setze das Feld **Map** in der Verwaltungsoberfläche auf einen der [Pfade der Standardkarten](/de/server-owners/configuration#all-vanilla-maps-names).

Für eine Karte als Mod:

1. Lege die `.zip`-Datei der Karte in `Resources/Client`.
2. Öffne die `.zip`-Datei, ohne sie zu entpacken, und öffne dann ihren Ordner `levels`. Er enthält einen Ordner, der nach der Karte benannt ist, zum Beispiel `myawesomedriftmap2021`. Notiere dir den Namen genau so, wie er geschrieben ist.
3. In der Verwaltungsoberfläche sieht das Feld **Map** aus wie `/levels/MAPNAME/info.json`, wobei `MAPNAME` wahrscheinlich etwas wie `gridmap_v2` ist. Ersetze `MAPNAME` durch den Ordnernamen aus Schritt 2. Der Wert muss auf `/info.json` enden. Für dieses Beispiel: `/levels/myawesomedriftmap2021/info.json`.

Wenn jemand beitritt, wird die Karte automatisch heruntergeladen und funktioniert.

Wenn es nicht funktioniert, installiere die Karte im Einzelspieler von BeamNG.drive und betrete sie. Öffne die Konsole mit der Taste `~` (Tilde). Bei einer Nicht-US-Tastatur suchst du die Aktion **Systemkonsole umschalten** unter **Optionen** > **Bedienelemente** > **Tastenbelegungen**, im Abschnitt **Allgemeines Debugging**. Führe `print(getMissionFilename())` aus. Es zeigt den Namen an, den du verwenden musst.

## Spieler beitreten lassen

Spieler können per Direct Connect mit der öffentlichen IP-Adresse und dem Port des Servers beitreten, beides findest du in der Verwaltungsoberfläche.

Bei einem öffentlichen Server können Spieler stattdessen die Serverliste öffnen, den Namen des Servers eingeben und auf **Connect** klicken. Der Name ist der, den du festgelegt hast. Wenn sie ihn nicht finden, sollen sie die Suchfilter ausschalten und die Karte auf **Any** setzen.

Wenn du oder ein Freund „Connection Failed!“ erhaltet, sieh im Launcher-Fenster nach Codes wie 10060, 10061 oder 10030. Sie bedeuten, dass der Server nicht erreichbar ist oder dass die im Client eingegebene IP-Adresse und der Port falsch sind. IPv6 wird noch nicht unterstützt.

## Immer noch Probleme?

Eröffne einen Thread im [Forum](https://forum.beammp.com) oder erstelle im Kanal `#support` auf dem [Discord-Server](https://discord.gg/beammp) ein **Server Support Ticket**.
