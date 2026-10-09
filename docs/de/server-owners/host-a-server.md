---
description: "Hoste einen BeamMP-Server zu Hause: Port weiterleiten, den Server durch die Firewall lassen, AuthKey holen, installieren, konfigurieren, Mods hinzufügen und Spieler einladen."
---
# Einen Server hosten

Diese Anleitung behandelt das Hosten eines BeamMP-Servers zu Hause, auf deinem eigenen Windows- oder Linux-Computer. Wenn du einen Hosting-Anbieter oder einen VPS mit Verwaltungsoberfläche nutzt, folge stattdessen der Anleitung [Server-Einrichtung auf einem VPS](/de/server-owners/setup-vps). Ein Server zu Hause ist kostenlos. Ein VPS ist einfacher und sicherer.

## Bevor du anfängst

Server sind ein wesentlicher Teil von BeamMP: Die Spieler verbinden sich über den Server miteinander. Du kannst einen privaten Server erstellen, dem nur Leute beitreten können, die du einlädst, oder einen öffentlichen Server, der in der offiziellen Serverliste erscheint.

Lies die [LICENSE](https://raw.githubusercontent.com/BeamMP/BeamMP-Server/master/LICENSE) des Servers, bevor du ihn verwendest.

Der Server unterstützt nur IPv4. Wenn du nicht weißt, welche du hast, sieh dir die IP-Adresse an, die [whatsmyip.org](https://www.whatsmyip.org/) anzeigt. Enthält sie Doppelpunkte, ist es IPv6. Finde dann heraus, ob du auch eine IPv4 hast, indem du deinen Internetanbieter oder jemanden fragst, der sich mit Netzwerken auskennt. IPv6-Unterstützung ist geplant.

Wenn Probleme auftreten, frag im [Forum](https://forum.beammp.com) oder im Kanal `#support` auf dem [Discord-Server](https://discord.gg/beammp). [Server-Konfiguration](/de/server-owners/configuration) beschreibt die Einstellungen des Servers genauer.

## Den Port weiterleiten {#forward-the-port}

Spieler außerhalb deines Zuhauses können deinem zu Hause gehosteten Server nur beitreten, wenn du auf deinem Router einen Port weiterleitest. Überspringe diesen Schritt, wenn du einen VPS oder einen Rootserver nutzt oder wenn alle, die spielen, in deinem eigenen Zuhause (deinem lokalen Netzwerk) sind.

::: danger Portweiterleitung ist ein Risiko
Mit der Portweiterleitung erklärst du dich mit den Risiken einverstanden, Ports in deinem Heimnetzwerk für die Öffentlichkeit zu öffnen. Du verzichtest daher auf das Recht, BeamMP für jegliche Schäden haftbar zu machen, die dir oder deinem Haushalt entstehen könnten.

Wir übernehmen keine Verantwortung für Inhalte auf extern verlinkten Diensten oder Websites.
:::

Beim Hosting über einen unserer Partnerdienste entfällt dieses Risiko. Um selbst einen Port weiterzuleiten, folge der [Anleitung zur Portweiterleitung](/de/server-owners/port-forwarding).

## Hosting-Partner {#partnered-hosting-services}

Diese Dienste sind kostenpflichtig:

<!--@include: ./_parts/partners.md-->

## Den Server durch die Firewall lassen {#allow-the-server-through-your-firewall}

Je nach Einrichtung musst du den BeamMP-Server durch deine Firewall lassen. Das ist unter Windows der Fall, wo das Ausschalten der Firewall normalerweise **nicht** funktioniert, und auf vielen vorinstallierten Linux-Servern.

Erlaube den BeamMP-Server in der Firewall für **eingehende und ausgehende Verbindungen** und für **TCP und UDP**. Wenn deine Firewall stattdessen nach einem Port fragt, nimm den Port, den du weitergeleitet hast, normalerweise 30814.

Eine ausführliche Anleitung findest du unter [Defender- / Firewall-Ausnahmen](/de/troubleshooting/defender-exclusions).

<!--@include: ./_parts/authkey.md-->

## Den Server installieren

Der BeamMP-Server ist für Windows und Linux verfügbar.

### Unter Windows installieren

Leite zuerst deinen Port weiter. Ohne ihn kann niemand außerhalb deines Zuhauses beitreten.

1. Installiere die [Visual C++ Redistributables](https://aka.ms/vs/17/release/vc_redist.x64.exe). Der Server braucht sie, um zu laufen.
2. Lade den Server von [beammp.com](https://www.beammp.com/) herunter. Du erhältst eine ausführbare Datei mit einem Namen wie `BeamMP-Server.exe`.
3. Lege irgendwo einen Ordner an und kopiere `BeamMP-Server.exe` hinein. Hier lebt dein Server.
4. Starte den Server einmal mit einem Doppelklick. Er erzeugt die Dateien, die er braucht. Wenn Text erscheint, schließe ihn. Jetzt hast du neben `BeamMP-Server.exe` eine Datei `ServerConfig.toml`.
5. Optional: Für schnellen Zugriff später kannst du eine Desktop-Verknüpfung erstellen, mit **Rechtsklick** > **Senden an** > **Desktop (Verknüpfung erstellen)**.

### Unter Linux installieren

#### Unser Build verwenden (empfohlen)

Das funktioniert auf jeder Distribution, für die wir Binärdateien bereitstellen. Sie sind auf der [Seite der neuesten Version](https://github.com/BeamMP/BeamMP-Server/releases/latest) aufgelistet. Für eine andere Distribution oder Architektur siehe [Aus dem Quellcode erstellen](#build-from-source).

1. Installiere die Abhängigkeiten, die unter [runtime dependencies](https://github.com/BeamMP/BeamMP-Server#runtime-dependencies) aufgelistet sind.
2. Gehe auf [beammp.com](https://beammp.com/) und klicke auf **Download Server**. Du gelangst zur GitHub-Release-Seite des Servers.
3. Lade die Version für deine Distribution herunter. In dieser Anleitung heißt sie `BeamMP-Server-xxx`, wobei `xxx` die Version für deine Distribution ist.
4. Lege irgendwo einen Ordner an und kopiere `BeamMP-Server-xxx` hinein. Die anderen heruntergeladenen Dateien kannst du vorerst ignorieren. Hier lebt dein Server.
5. Öffne ein Terminal in diesem Ordner und führe `chmod +x BeamMP-Server-xxx` aus, damit du die Berechtigung zum Ausführen hast.
6. Starte den Server einmal mit `./BeamMP-Server-xxx`. Er erzeugt die Dateien, die er braucht. Wenn Text erscheint, schließe ihn. Jetzt hast du neben `BeamMP-Server-xxx` eine Datei `ServerConfig.toml`.
7. Optional, aber dringend empfohlen: Lege einen Benutzer namens `beammpserver` (oder ähnlich) an und starte den Server nur mit diesem Benutzer. Führe den Server nicht als root, mit `sudo` oder als dein persönlicher Benutzer aus.

#### Aus dem Quellcode erstellen {#build-from-source}

Andere Distributionen funktionieren wahrscheinlich auch, werden aber nicht offiziell unterstützt. Um den Server selbst zu erstellen, lade den Quellcode von [GitHub](https://github.com/BeamMP/BeamMP-Server) herunter und folge den [Build-Anweisungen](https://github.com/BeamMP/BeamMP-Server#build-instructions). Führe den Server am Ende einmal mit `./BeamMP-Server` aus.

## Den Server konfigurieren {#configure-the-server}

Als du den Server einmal gestartet hast, hat er einige Dateien erzeugt und wahrscheinlich ein oder zwei Fehler ausgegeben. Das ist zu erwarten, denn er ist noch nicht konfiguriert. Dein Ordner enthält jetzt diese Dateien:

![Der Server-Ordner mit ServerConfig.toml, Server.log und BeamMP-Server.exe](../../assets/content/after-running-once.png)

Es sind `ServerConfig.toml`, `Server.log` und `BeamMP-Server.exe`. Je nach deinen Einstellungen siehst du die Endungen `.toml`, `.log` und `.exe` eventuell nicht.

Öffne `ServerConfig.toml` in einem Texteditor wie dem Editor (Notepad): **Rechtsklick** > **Öffnen mit…**, dann wähle den Editor. Eine Beispielkonfiguration:
```toml
[General]
Port = 30814
AuthKey = "auth-key"
AllowGuests = false
LogChat = false
Debug = false
IP = "::"
Private = true
InformationPacket = true
Name = "Test Server"
Tags = "Freeroam,Modded,Racing,Police"
MaxCars = 2
MaxPlayers = 10
Map = "/levels/ks_nord/info.json"
Description = "Total Random Beam MP Server"
ResourceFolder = "Resources"
```
Diese Datei verwendet das TOML-Format. [Server-Konfiguration](/de/server-owners/configuration) beschreibt jede Einstellung.

1. Setze `AuthKey` auf den Schlüssel, den du kopiert hast. Füge ihn zwischen den Anführungszeichen ein. Für den Beispielschlüssel sieht es so aus:
   ```toml
   AuthKey = '3173a2e-6az0-4542-a3p0-ddqq5ff95558'
   ```
2. Setze `Name`, den Namen deines Servers in der Serverliste. Du kannst ihn mit Farben und mehr formatieren: siehe [Das Aussehen deines Servernamens anpassen](/de/server-owners/configuration#customize-the-look-of-your-server-name).
3. Wenn du einen anderen Port als 30814 gewählt hast, setze ihn in `Port`.
4. Solange `Private = true` gilt, erscheint dein Server nicht in der Serverliste. Um ihn aufzulisten, setze `Private = false`.

### Prüfen, ob er startet

Starte den Server erneut und achte auf Meldungen mit `[ERROR]` oder `[WARN]`. Der Server sollte jetzt geöffnet bleiben. Füge dann Mods hinzu, wenn du welche möchtest, und lies nach, wie man beitritt.

## Mods hinzufügen

Fahrzeug-Mods und Karten-Mods werden unterschiedlich installiert, aber beide kommen in den Ordner `Resources/Client` deines Servers. Lege die `.zip`-Datei des Mods in diesen Ordner.

::: warning
Mods können mit BeamNG, BeamMP oder anderen Mods inkompatibel sein oder werden. Wenn du Probleme hast, entferne nach und nach Mods. Wenn du nach dem Hinzufügen von Mods beim Beitreten eine Meldung „done“ oder „start“ erhältst, hast du wahrscheinlich einen inkompatiblen oder defekten Mod hinzugefügt. Wenn du Client-Mods installiert hast, lies unter [Mod-Sicherheit](/de/players/mod-safety), wie du sie aus deinem Spiel entfernst.
:::

### Fahrzeug- und andere Mods

Lege die `.zip`-Datei des Mods in `Resources/Client`. Jeder, der beitritt, lädt sie automatisch herunter.

### Karten

Die Standardkarten funktionieren, ohne dass du etwas installieren musst. Setze `Map` in der `ServerConfig.toml` auf einen der [Pfade der Standardkarten](/de/server-owners/configuration#all-vanilla-maps-names).

Für eine Karte als Mod:

1. Lege die `.zip`-Datei der Karte in `Resources/Client`.
2. Öffne die `.zip`-Datei, ohne sie zu entpacken, und öffne dann ihren Ordner `levels`. Er enthält einen Ordner, der nach der Karte benannt ist, zum Beispiel `myawesomedriftmap2021`. Notiere dir den Namen genau so, wie er geschrieben ist.
3. In der `ServerConfig.toml` sieht `Map` aus wie `/levels/MAPNAME/info.json`, wobei `MAPNAME` wahrscheinlich etwas wie `gridmap_v2` ist. Ersetze `MAPNAME` durch den Ordnernamen aus Schritt 2. Der Wert muss auf `/info.json` enden. Für dieses Beispiel:
   ```toml
   Map = '/levels/myawesomedriftmap2021/info.json'
   ```
Wenn jemand beitritt, wird die Karte automatisch heruntergeladen und funktioniert.

Wenn es nicht funktioniert, installiere die Karte im Einzelspieler von BeamNG.drive und betrete sie. Öffne die Konsole mit der Taste `~` (Tilde). Bei einer Nicht-US-Tastatur suchst du die Aktion **Toggle System Console** unter **Options** > **Controls** > **Bindings**, im Abschnitt **General Debug**. Führe `print(getMissionFilename())` aus. Es zeigt den Namen an, den du verwenden musst.

### Mods vor dem Download schützen

Du kannst geschützte oder eingeschränkte Inhalte hosten, ohne sie weiterzuverbreiten. Das eignet sich für „bezahlte Mods“ oder für Mod-Ersteller, die den Zugang zu neuen Arbeiten begrenzen möchten.

Um einen Mod zu schützen, führe dies in der Server-Konsole aus:
```text
protectmod <filename with .zip> <true/false>
```
Spieler, die einem Server mit geschützten Mods beitreten, müssen die Datei selbst besorgen, zum Beispiel vom Ersteller oder von einer Plattform wie Patreon, und in den Resources-Ordner ihres Launchers legen. Der Launcher teilt ihnen mit, wenn eine Datei fehlt, und das Spiel zeigt eine Benachrichtigung mit der fehlenden Datei und der Lösung an.

## Spieler beitreten lassen

### Deinem eigenen Server beitreten

Ob privat oder öffentlich: Wie du beitrittst, hängt davon ab, wo der Server läuft:

- **Auf demselben Computer wie das Spiel:** Nutze Direct Connect. Klicke links neben der Serverliste auf den Tab **Direct Connect**, lass die Standardangaben (`127.0.0.1` und deinen Port) stehen und klicke auf **Connect**.
- **Auf einem anderen Computer in deinem lokalen Netzwerk:** Nutze Direct Connect mit der lokalen IP-Adresse dieses Computers.
- **Außerhalb deines Zuhauses, zum Beispiel auf einem VPS:** Nutze Direct Connect mit der öffentlichen IP-Adresse dieses Rechners.

### Privater Server

Gib anderen Spielern die öffentliche IP-Adresse deines Servers. Überlege gut, an wen du sie weitergibst. Zum Beitreten öffnen sie in BeamMP den Tab **Direct Connect** und geben deine IP-Adresse und deinen Port ein.

### Öffentlicher Server

Andere Spieler finden ihn in der Serverliste: Sie geben seinen Namen ein und klicken auf **Connect**. Der Name ist der aus deiner `ServerConfig.toml`. Wenn sie ihn nicht finden, sollen sie die Suchfilter ausschalten und die Karte auf **Any** setzen. Auch die Website [Keymaster](https://keymaster.beammp.com/) zeigt die IP-Adresse deines Servers an.

### „Connection Failed!“

Wenn du oder ein Freund „Connection Failed!“ erhaltet, sieh im Launcher-Fenster nach Codes wie 10060, 10061 oder 10030. Sie bedeuten eines von zwei Dingen: Du liegst hinter einer CGNAT-IPv4-Adresse, oder bei [Den Port weiterleiten](#forward-the-port) oder [Den Server durch die Firewall lassen](#allow-the-server-through-your-firewall) ist etwas schiefgegangen.

Um auf CGNAT zu prüfen, suche die WAN-IP-Adresse auf der Seite deines Routers und vergleiche sie mit deiner [öffentlichen IP](https://www.whatsmyip.org/). Wenn sie gleich sind, liegst du nicht hinter einem CGNAT. Siehe [Auf CGNAT prüfen](/de/server-owners/cgnat). IPv6 wird noch nicht unterstützt.

## Prüfen, ob Spieler deinen Server erreichen können

Gib die öffentliche IPv4-Adresse und den Port deines Servers ein und klicke dann auf **CheckBeamMP**:

<form action="https://check.beammp.com/api/v2/beammp" method="get" target="_blank">
  <label for="ip">IP address:</label>
  <input type="text" id="ip" name="ip"><br>
  <label for="port">Port:</label>
  <input type="text" id="port" name="port"><br>
  <input type="submit" value="CheckBeamMP">
</form>

## Ein VPN verwenden

BeamMP unterstützt keine VPNs wie RadminVPN oder Hamachi, weil sie oft Probleme verursachen. Eines davon ist, dass UDP-Verkehr nicht weitergeleitet wird. Um das zu beheben, siehe [Den Port weiterleiten](#forward-the-port).

::: question Aber es hat doch früher funktioniert. Warum jetzt nicht mehr?
Die Entwickler dieser Anwendungen aktualisieren ihre Software und nehmen Änderungen vor, auf die BeamMP keinen Einfluss hat. Es liegt an ihnen, bestimmte Anwendungsfälle wie einen BeamMP-Server zu unterstützen.
:::

## Immer noch Probleme?

Eröffne einen Thread im [Forum](https://forum.beammp.com) oder erstelle im Kanal `#support` auf dem [Discord-Server](https://discord.gg/beammp) ein **Server Support Ticket**.
