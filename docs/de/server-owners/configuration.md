---
description: "Alle Einstellungen der ServerConfig.toml eines BeamMP-Servers, die Pfade der Standardkarten, wie du den Servernamen einfärbst und formatierst, und die Liste der Server-Tags."
---
# Server-Konfiguration

Die Einstellungen eines BeamMP-Servers, wie du ihn benennst und mit Tags versiehst, und die Pfade der Standardkarten. Zum Installieren eines Servers siehe [Einen Server hosten](/de/server-owners/host-a-server). Zum Lesen der Logdatei oder zum Aktualisieren des Servers siehe [Server Wartung](/de/server-owners/maintenance).

## Die ServerConfig-Datei

Die Server-Konfiguration, eine Datei namens `ServerConfig.toml`, verwendet das [TOML-Format](https://toml.io/en/).

::: info Alte Konfigurationsdatei
Die alte Server-Konfigurationsdatei hieß `Server.cfg`. Sie wird nicht mehr verwendet, und der Server warnt, wenn sie noch vorhanden ist. Die beiden Formate sind **nicht** kompatibel.
:::

Die Konfiguration hat zwei Abschnitte, `[General]` und `[Misc]`. Die Standardwerte sind die der Server-Version 3.9.4.

### Der Abschnitt `[General]`

| Schlüssel | Standard | Wert | Was er bewirkt |
|---|---|---|---|
| Port | `30814` | 1024-65535 | Der Netzwerkport, auf dem der Server erreichbar ist. (Muss eindeutig sein und darf nicht von einem anderen Dienst auf demselben Host verwendet werden.) |
| AuthKey | leer | AuthKey-Format `xxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`, wobei alle x alphanumerische Zeichen (Zahlen und Buchstaben) sind | Wird verwendet, um einen öffentlichen Server gegenüber dem Backend zu identifizieren. |
| AllowGuests | `true` | true/false | Ob Gäste dem Server beitreten dürfen. |
| LogChat | `true` | true/false | Wenn aktiviert (true), werden Chatnachrichten in der Datei server.log protokolliert. |
| Debug | `false` | true/false | Wenn aktiviert (true), werden mehr Meldungen im Log angezeigt und mehr Informationen bereitgestellt. Aktiviere das, wenn Probleme auftreten. Dadurch wird die Logdatei drastisch größer. |
| IP | `"::"` | Eine lokale IP-Adresse einer der Netzwerkschnittstellen des Hosts | Der Server bindet sich an diese IP-Adresse. Es ist **nicht** deine öffentliche IP. Nutze sie, wenn dein Rechner mehrere Netzwerkschnittstellen hat. Du musst sie nicht ändern, damit der Server funktioniert. |
| Private | `true` | true/false | Wenn aktiviert (true), wird dein Server nicht in der Serverliste angezeigt. Jeder mit der richtigen IP und dem richtigen Port kann sich trotzdem verbinden. |
| InformationPacket | `true` | true/false | Wenn aktiviert (true), erlaubt der Server nicht authentifizierten Clients, dieselben Informationen wie in der Serverliste zu erhalten, aber direkt über den Server. |
| Name | `"BeamMP Server"` | Beliebiger „Text“ | Wird als Name / Titel deines Servers in der Serverliste angezeigt. Mit Sonderzeichen kannst du ihn mit Farben und Stilen formatieren. |
| Tags | `"Freeroam"` | Siehe die Liste der erlaubten Tags weiter unten. | Tags für die Suche, z. B. Police, Racing usw. |
| MaxCars | `1` | Eine beliebige Zahl ≥ 1 | Die maximale Anzahl an Fahrzeugen pro Spieler. Jedes weitere Fahrzeug, das ein Spieler zu spawnen versucht, wird sofort gelöscht. |
| MaxPlayers | `8` | Eine beliebige Zahl ≥ 1 | Die maximale Anzahl an Spielern pro Server. Das wirkt sich nicht auf die Anzahl der Fahrzeuge aus. |
| Map | `"/levels/gridmap_v2/info.json"` | Ein gültiger Kartenpfad, etwa `/levels/gridmap_v2/info.json` | Die Karte, die dein Server hostet. Sie muss entweder standardmäßig installiert sein (eine Liste findest du unten) oder als Server-Mod. |
| Description | `"BeamMP Default Description"` | Beliebiger „Text“ | Wird als Beschreibung des Servers in der Serverliste angezeigt (wenn der Server öffentlich ist). Mit Sonderzeichen kannst du sie mit Farben und Stilen formatieren. |
| ResourceFolder | `"Resources"` | Ein gültiger Ordnerpfad, etwa "D:\Server\BeamMP\Resources" | Nützlich, um den Server und den Resources-Ordner getrennt zu speichern. |

### Der Abschnitt `[Misc]`

| Schlüssel | Standard | Wert | Was er bewirkt |
|---|---|---|---|
| ImScaredOfUpdates | `true` | true/false | Wenn aktiviert (`true`), wird die regelmäßige Meldung ausgeblendet, die dich darauf hinweist, dass eine neue Server-Version erschienen ist. Der Server aktualisiert sich nicht selbst: siehe [Server Wartung](/de/server-owners/maintenance#updating-the-server). |
| UpdateReminderTime | `"30s"` | Eine Zahl mit angehängtem `s`, `min`, `h` oder `d`, zum Beispiel `30s` | Wie oft die Update-Erinnerung im Terminal ausgegeben wird. `30d` bedeutet alle 30 Tage, `0.5min` alle halbe Minute. |

Plugins können eigene Abschnitte verwenden, etwa `[MyMod]`.

Den AuthKey **musst** du selbst setzen. Er ist standardmäßig leer. Trage den AuthKey ein, den du beim [Installieren des Servers](/de/server-owners/host-a-server) erhalten hast. Gib ihn niemandem weiter und verwische ihn in Screenshots vollständig.

### Die Namen aller Standardkarten {#all-vanilla-maps-names}

Hier sind alle Standardkarten:

- /levels/gridmap_v2/info.json
- /levels/johnson_valley/info.json
- /levels/automation_test_track/info.json
- /levels/east_coast_usa/info.json
- /levels/hirochi_raceway/info.json
- /levels/italy/info.json
- /levels/jungle_rock_island/info.json
- /levels/industrial/info.json
- /levels/small_island/info.json
- /levels/smallgrid/info.json
- /levels/utah/info.json
- /levels/west_coast_usa/info.json
- /levels/driver_training/info.json
- /levels/derby/info.json

### Das Aussehen deines Servernamens anpassen {#customize-the-look-of-your-server-name}

Setze diese Sonderzeichen vor deinen Text, dann wird der Effekt auf diesen Text in der Serverliste angewendet:

| Wert  | Beschreibung                |
|:-----:|-----------------------------|
| `^r`  | Zurücksetzen                |
| `^p`  | Zeilenumbruch (nur Beschreibungen) |
| `^n`  | Unterstrichen               |
| `^l`  | Fett                        |
| `^m`  | Durchgestrichen             |
| `^o`  | Kursiv                      |
| `^0`  | Schwarz                     |
| `^1`  | Blau                        |
| `^2`  | Grün                        |
| `^3`  | Hellblau                    |
| `^4`  | Rot                         |
| `^5`  | Pink                        |
| `^6`  | Orange                      |
| `^7`  | Grau                        |
| `^8`  | Dunkelgrau                  |
| `^9`  | Helles Violett              |
| `^a`  | Hellgrün                    |
| `^b`  | Hellblau                    |
| `^c`  | Dunkles Orange              |
| `^d`  | Helles Pink                 |
| `^e`  | Gelb                        |
| `^f`  | Weiß                        |

### Die Tags deines Servers anpassen

Mit Tags können Leute gezielt nach einer bestimmten Art von Server suchen. Deine ServerConfig.toml wird mit dem Freeroam-Tag `Tags = "Freeroam"` erzeugt.

Du kannst mehrere Tags durch Kommas getrennt angeben, `Tags = "Events,Offroad,lang:english"`. Groß- und Kleinschreibung spielt keine Rolle.

Du kannst aus der folgenden Liste wählen:

::: tabs

== Alter/Inhalt

- `Mature/18+`

== Spielarten

- `Freeroam`
- `Roleplay`
- `Economy`
- `Traffic`
- `Challenge`
- `Drift`

== Rennkategorien

- `Racing`
- `Racing:NASCAR`
- `Racing:Track`
- `Racing:Drag`
- `Racing:Rally`
- `Touge`

== Offroad

- `Offroad`
- `Crawling`
- `Rally`
- `Dakar`

== Zerstörungs-Events

- `Derby`
- `Arena`

== Wetter- und Tageszeitbedingungen

- `Snow/Ice`
- `Rain`
- `Night`
- `Weather`

== Spielmodi

- `Gamemode`
- `Gamemode:Racing`
- `Gamemode:Rally`
- `Gamemode:Drag`
- `Gamemode:Derby`
- `Gamemode:Infection`
- `Gamemode:Cops-Robbers`
- `Gamemode:Delivery`
- `Gamemode:Sumo`

== Community und Events

- `Scenarios`
- `Events`
- `Leaderboard`

== Mods

- `Modded`
- `Mod:BeamPaint`
- `Mod:BeamJoy`
- `Mod:CEI`

== Sprachen

- `Lang:English`
- `Lang:Russian`
- `Lang:French`
- `Lang:Spanish`
- `Lang:Portuguese`
- `Lang:German`
- `Lang:Polish`
- `Lang:Arabic`

== Sonstiges

- `Vanilla`
- `Moderated`

:::


Fehlt ein Tag in dieser Liste, kannst du [hier](https://forum.beammp.com/t/introducing-server-tags/1320081) beantragen, dass er hinzugefügt wird.
