---
description: "Referenz zum BeamMP-Server: was er aus seiner Umgebung liest, der Resources-Ordner, Umgebungsvariablen, Kommandozeilenargumente und Limits des Backends."
---
# Server Handbuch

Diese Seite ist die Referenz dafür, wie sich der BeamMP-Server verhält. Zum Einrichten siehe [Einen Server hosten](/de/server-owners/host-a-server). Für die Einstellungen in der `ServerConfig.toml` siehe [Server-Konfiguration](/de/server-owners/configuration).

## Was den Server beeinflusst

Der Server wird vom Zustand dieser externen Parameter beeinflusst:

- Der Ordner `Resources`
- Die Umgebung (Umgebungsvariablen des Prozesses)
- Die Kommandozeilenargumente
- Die Datei `ServerConfig.toml`
- Das Arbeitsverzeichnis

## Resources-Ordner

Der Server erstellt beim Start den Ordner `Resources` mit den Unterordnern `Client` und `Server`.

- `Server` enthält Ordner, die jeweils mindestens eine `.lua`-Datei enthalten. Jeder dieser Ordner ist ein „Plugin“. `.lua`-Dateien auf oberster Ebene eines Plugins werden bei Änderungen neu geladen.
- `Client` enthält nur `.zip`-Dateien. Sie werden beim Start des Servers geladen, und es wird angenommen, dass sie sich während des Betriebs nicht ändern.

## Umgebungsvariablen

### Allgemeine Einstellungen

Seit Server-Release v3.2.0 akzeptiert der Server Umgebungsvariablen, die die Einstellungen in der `ServerConfig.toml` **überschreiben**. Jede Einstellung hat eine. Die Namen der Einstellungen sind in PascalCase geschrieben. Die Variable ist der Name in GROSSBUCHSTABEN, mit einem Unterstrich am Beginn jedes neuen Wortes, und mit dem Präfix `BEAMMP_`. Aus `MaxPlayers` wird zum Beispiel `MAX_PLAYERS`, und mit dem Präfix `BEAMMP_MAX_PLAYERS`. Diese Variablen gibt es („Since“ ist das erste Server-Release, das die jeweilige Variable liest):

| Variable | Setting | Since |
|---|---|---|
| `BEAMMP_DEBUG` | `Debug` | v3.2.0 |
| `BEAMMP_PRIVATE` | `Private` | v3.2.0 |
| `BEAMMP_PORT` | `Port` | v3.2.0 |
| `BEAMMP_MAX_CARS` | `MaxCars` | v3.2.0 |
| `BEAMMP_MAX_PLAYERS` | `MaxPlayers` | v3.2.0 |
| `BEAMMP_MAP` | `Map` | v3.2.0 |
| `BEAMMP_NAME` | `Name` | v3.2.0 |
| `BEAMMP_DESCRIPTION` | `Description` | v3.2.0 |
| `BEAMMP_TAGS` | `Tags` | v3.2.0 |
| `BEAMMP_RESOURCE_FOLDER` | `ResourceFolder` | v3.2.0 |
| `BEAMMP_AUTH_KEY` | `AuthKey` | v3.2.0 |
| `BEAMMP_LOG_CHAT` | `LogChat` | v3.2.0 |
| `BEAMMP_ALLOW_GUESTS` | `AllowGuests` | v3.5.0 |
| `BEAMMP_INFORMATION_PACKET` | `InformationPacket` | v3.7.0 |
| `BEAMMP_IM_SCARED_OF_UPDATES` | `ImScaredOfUpdates` (der Abschnitt `[Misc]`) | v3.8.2 |
| `BEAMMP_UPDATE_REMINDER_TIME` | `UpdateReminderTime` (der Abschnitt `[Misc]`) | v3.8.2 |
| `BEAMMP_IP` | `IP` | v3.8.3 |

Bei Einstellungen, die Zeichenfolgen oder Zahlen sind, ist der Wert eine Zeichenfolge, zum Beispiel `BEAMMP_NAME="Cool Server"`, `BEAMMP_NAME=Server1` oder `BEAMMP_PORT=12345`.

Bei Einstellungen, die wahr oder falsch (an oder aus) sind, bedeutet der Wert `true` oder `1` an. Jeder andere Wert bedeutet aus.

### Anbietereinstellungen

Diese Variablen erlauben Hosting-Anbietern und allen, die viele Server betreiben, anbieterspezifische Einstellungen zu überschreiben.

#### `BEAMMP_PROVIDER_PORT_ENV` (seit v3.3.0)

Wenn die Variable auf eine nicht leere Zeichenfolge gesetzt ist, nennt sie eine andere Variable, aus der der Port gelesen wird, statt aus `BEAMMP_PORT`. Pterodactyl stellt den Port zum Beispiel möglicherweise als `SERVER_PORT` bereit. Du könntest `BEAMMP_PORT=${SERVER_PORT}` setzen, einfacher ist aber `BEAMMP_PROVIDER_PORT_ENV="SERVER_PORT"`, dann liest der Server seinen Port aus der Variable `SERVER_PORT`.

#### `BEAMMP_PROVIDER_IP_ENV` (seit v3.8.4)

Wenn die Variable auf eine nicht leere Zeichenfolge gesetzt ist, nennt sie eine andere Variable, aus der die IP-Adresse gelesen wird, statt aus `BEAMMP_IP`. Sie funktioniert wie `BEAMMP_PROVIDER_PORT_ENV`.

#### `BEAMMP_PROVIDER_DISABLE_CONFIG` (seit v3.3.0)

Wenn der Wert `1` oder `true` ist, wird die `ServerConfig.toml` **nicht generiert** und, falls sie existiert, **nicht gelesen**. Damit der Server funktioniert, musst du `BEAMMP_AUTH_KEY` setzen.

#### `BEAMMP_PROVIDER_UPDATE_MESSAGE` (seit v3.2.2)

Wenn die Variable auf eine nicht leere Zeichenfolge gesetzt ist, ersetzt sie die gesamte Update-Meldung, die standardmäßig mit „NEW VERSION IS OUT! Please update to the new…“ beginnt.

Deine Meldung **muss** irgendwo `{}` enthalten. Der Server ersetzt es durch die neue Versionsnummer. Zum Beispiel:
```sh
BEAMMP_PROVIDER_UPDATE_MESSAGE="NEW VERSION of the BeamMP-Server has been released: {}! Please follow the update guide here: https://example.com/update-guide"
```
Das ergibt eine Update-Meldung wie:
```text
NEW VERSION of the BeamMP-Server has been released: v5.0.2! Please follow the update guide here: https://example.com/update-guide
```
Mach den Nutzern deutlich, dass sie aktualisieren sollen, und erkläre, wie.

#### `BEAMMP_PROVIDER_DISABLE_MP_SET` (seit v3.9.2)

Wenn der Wert `1` oder `true` ist, können Lua-Plugins Servereinstellungen nicht mit `MP.Set` ändern. Ein Plugin, das es versucht, erhält einen Fehler, dass der Aufruf von deinem Server-Anbieter blockiert wurde.

#### `BEAMMP_MAX_CONCURRENT_CONNECTIONS` (seit v3.9.2)

Legt die maximale Anzahl an Verbindungen fest, die der Server gleichzeitig bearbeitet. Es ist eine ganze Zahl von 1 bis 128, der Standardwert ist 10. Ein Wert außerhalb des Bereichs oder keine Zahl wird mit einer Warnung ignoriert.

## Kommandozeilenargumente

Starte den Server mit `--help`, um sie anzuzeigen: `./BeamMP-Server --help`. Die Argumente sind:

| Argument | Was es bewirkt |
|---|---|
| `--help` | Zeigt die Hilfe an und beendet das Programm |
| `--version` | Gibt die Server-Version aus und beendet das Programm |
| `--port=1234` | Legt den TCP- und UDP-Port fest, auf dem der Server lauscht. Er überschreibt die Umgebung und die `ServerConfig.toml` |
| `--config=/path/to/ServerConfig.toml` | Der absolute oder relative Pfad zur Konfigurationsdatei des Servers, einschließlich des Dateinamens. Setze einen Pfad mit Leerzeichen in Anführungszeichen |
| `--working-directory=/path/to/folder` | Legt das Arbeitsverzeichnis des Servers fest. Jeder Pfad, auch der in `--config`, ist relativ dazu |

Zum Beispiel startet `BeamMP-Server --config=../MyWestCoastServerConfig.toml` den Server mit der Konfigurationsdatei einen Ordner darüber.

## Konsolenbefehle

Gib diese in der Server-Konsole ein:

| Befehl | Was er bewirkt |
|---|---|
| `help` | Zeigt die Befehle an |
| `exit` | Fährt den Server herunter |
| `kick <name> [reason]` | Wirft einen Spieler hinaus, optional mit Begründung |
| `list` | Listet alle Spieler und Informationen zu ihnen auf |
| `say <message>` | Sendet die Nachricht im Chat an alle Spieler |
| `lua [state id]` | Wechselt zu Lua, optional in den State mit dieser ID |
| `settings [command]` | Setzt oder liest Servereinstellungen. Führe `settings help` für mehr aus |
| `status` | Zeigt an, wie es dem Server geht |
| `clear` | Leert das Konsolenfenster |
| `version` | Zeigt die Server-Version an |
| `protectmod <name> <value>` | Legt fest, ob ein Mod geschützt ist. Der Wert ist `true` oder `false` |
| `reloadmods` | Lädt alle Mods aus dem Ordner `Resources/Client` neu |

## ServerConfig.toml

Der Server generiert diese Datei beim ersten Start. Die Kommentare in der Datei sind die aktuellste Erklärung jeder Einstellung.

## Arbeitsverzeichnis

Das Arbeitsverzeichnis des Servers, nicht der Speicherort der ausführbaren Datei des Servers, bestimmt, wo `ServerConfig.toml`, die Logdateien und der Ordner `Resources` erzeugt werden.

## Limits

Das BeamMP-Backend erzwingt diese Limits für Server:

- Name: 250 Zeichen
- Beschreibung: 1000 Zeichen
- Karte: 100 Zeichen
- Tags: 100 Zeichen
