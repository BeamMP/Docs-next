---
description: "Referenz zum BeamMP-Server: der Resources-Ordner, Umgebungsvariablen, Kommandozeilenargumente, Konsolenbefehle und Limits des Backends."
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

- `Server` enthält Ordner, die jeweils mindestens eine `.lua`-Datei enthalten. Jeder dieser Ordner ist ein „Plugin“. Der Server lädt die Plugins in alphabetischer Reihenfolge, ohne Beachtung der Groß- und Kleinschreibung, und überspringt alles in `Server`, was kein Ordner ist. `.lua`-Dateien auf oberster Ebene eines Plugins werden bei Änderungen neu geladen. Wie du Plugins schreibst, steht in der [Server-Scripting-Referenz](/de/developers/beammp-scripting/server/latest).
- `Client` enthält `.zip`-Dateien, die Spieler beim Beitreten herunterladen. Der Server liest sie beim Start und ignoriert jede Datei, die keine `.zip` ist, mit einer Warnung. Um hinzugefügte, geänderte oder entfernte Mods zu übernehmen, während der Server läuft, nutze den [Konsolenbefehl](#console-commands) `reloadmods`.

Der Server legt in `Client` außerdem eine Datei namens `mods.json` an. Sie speichert den SHA-256-Hash jedes Mods und ob der Mod geschützt ist, damit der Server einen unveränderten Mod nicht erneut hasht. Der Server schreibt die Datei bei Bedarf neu. Bearbeite sie nicht.

## Umgebungsvariablen

### Allgemeine Einstellungen {#general-settings}

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

Eine Variable, die leer oder nicht gesetzt ist, wird ignoriert. Die Werte, die der Server am Ende verwendet, auch diese, schreibt er beim Start zurück in die `ServerConfig.toml`, es sei denn, `BEAMMP_PROVIDER_DISABLE_CONFIG` ist gesetzt.

### Anbietereinstellungen {#provider-settings}

Diese Variablen erlauben Hosting-Anbietern und allen, die viele Server betreiben, anbieterspezifische Einstellungen zu überschreiben.

#### `BEAMMP_PROVIDER_PORT_ENV` (v3.3.0 bis v3.4.1 und seit v3.7.2)

Wenn die Variable auf eine nicht leere Zeichenfolge gesetzt ist, nennt sie eine andere Variable, aus der der Port gelesen wird, statt aus `BEAMMP_PORT`. Server von v3.5.0 bis v3.7.1 lesen sie nicht. Pterodactyl stellt den Port zum Beispiel möglicherweise als `SERVER_PORT` bereit. Du könntest `BEAMMP_PORT=${SERVER_PORT}` setzen, einfacher ist aber `BEAMMP_PROVIDER_PORT_ENV="SERVER_PORT"`, dann liest der Server seinen Port aus der Variable `SERVER_PORT`.

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

#### `BEAMMP_MAX_CONCURRENT_CONNECTIONS` (seit v3.9.4)

Legt die maximale Anzahl an Verbindungen fest, die der Server gleichzeitig von einer IP-Adresse akzeptiert. Es ist eine ganze Zahl von 1 bis 128, der Standardwert ist 10. Ein Wert außerhalb des Bereichs oder keine Zahl wird mit einer Warnung ignoriert. Insgesamt akzeptiert der Server außerdem höchstens 128 Verbindungen gleichzeitig, das kannst du nicht ändern. Der Befehl `status` zeigt beide Limits an.

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

## Konsolenbefehle {#console-commands}

Gib diese in der Server-Konsole ein. Drücke `Tab`, um einen Befehl zu vervollständigen.

| Befehl | Was er bewirkt |
|---|---|
| `help` | Zeigt die Befehle an |
| `exit` | Fährt den Server herunter |
| `kick <name> [reason]` | Wirft einen Spieler hinaus, optional mit Begründung. Der Name wird mit dem Anfang des Spielernamens abgeglichen, ohne Beachtung der Groß- und Kleinschreibung. Ohne Begründung sieht der Spieler „Kicked by server console“ |
| `list` | Listet alle Spieler mit ihrer ID und der Anzahl ihrer Fahrzeuge auf |
| `say <message>` | Sendet die Nachricht im Chat an alle Spieler |
| `lua [state id]` | Wechselt zur Lua-Konsole, optional in den State mit dieser ID. Siehe [Debugging](/de/developers/beammp-scripting/server/latest#debugging) |
| `settings [command]` | Setzt oder liest Servereinstellungen. Führe `settings help` für mehr aus. Siehe [Befehl settings](#settings-command) |
| `status` | Zeigt an, wie es dem Server geht: Spieler, Fahrzeuge, Laufzeit, Lua-States, Event-Timer und -Handler, die Verbindungslimits und den Zustand jedes Teils des Servers |
| `clear` | Leert das Konsolenfenster |
| `version` | Zeigt die Plattform, die Server-Version sowie die Lua- und OpenSSL-Version an |
| `protectmod <name> <value>` | Legt fest, ob ein Mod geschützt ist. Der Name ist der Dateiname des Mods einschließlich `.zip`. Der Wert ist `true` oder `false` |
| `reloadmods` | Lädt alle Mods aus dem Ordner `Resources/Client` neu |
| `nettest` | Fragt beim BeamMP-Prüfdienst für Server nach, ob Spieler deinen Server über seinen Port erreichen können, und gibt die Antwort aus. `help` listet ihn nicht auf. Seit v3.8.5 |

Ein Plugin kann mit dem Event `onConsoleInput` eigene Befehle hinzufügen. Siehe [Benutzerdefinierte Befehle](/de/developers/beammp-scripting/server/latest#custom-commands).

### Befehl settings {#settings-command}

`settings` hat vier Unterbefehle:

- `settings list` listet die Einstellungen und ihre Werte auf.
- `settings get <category> <setting>` gibt einen Wert aus, zum Beispiel `settings get General MaxPlayers`.
- `settings set <category> <setting> <value>` ändert einen Wert, zum Beispiel `settings set General MaxPlayers 12`. Setze einen Wert mit Leerzeichen in Anführungszeichen.
- `settings help` zeigt diese Unterbefehle an.

Eine Änderung gilt, bis der Server stoppt. Sie wird nicht in die `ServerConfig.toml` geschrieben. In `General` kannst du `Description`, `Tags`, `MaxPlayers`, `Name`, `Map`, `MaxCars`, `Debug`, `AllowGuests` und `InformationPacket` ändern, in `Misc` `ImScaredOfUpdates` und `UpdateReminderTime`. `Private`, `IP`, `Port`, `LogChat` und `ResourceFolder` können gelesen, aber nicht geändert werden. `AuthKey` kann weder gelesen noch geändert werden.

## ServerConfig.toml

Der Server generiert diese Datei beim ersten Start. Die Kommentare in der Datei erklären jede Einstellung kurz, und der Server schreibt die Datei bei jedem Start neu. Siehe [Server-Konfiguration](/de/server-owners/configuration).

Wenn `AuthKey` leer ist, gibt der Server einen Fehler aus und schließt sich nach 10 Sekunden. Das passiert auch, wenn die Datei einen Fehler enthält, etwa ein fehlendes Anführungszeichen.

## Arbeitsverzeichnis

Das Arbeitsverzeichnis des Servers, nicht der Speicherort der ausführbaren Datei des Servers, bestimmt, wo `ServerConfig.toml`, die Logdateien und der Ordner `Resources` erzeugt werden.

## Limits

Das BeamMP-Backend erzwingt diese Limits für Server:

- Name: 250 Zeichen
- Beschreibung: 1000 Zeichen
- Karte: 100 Zeichen
- Tags: 100 Zeichen

Der Server selbst erzwingt diese:

- Launcher-Version: Ein Spieler, dessen Launcher älter als 2.7.0 ist, wird abgewiesen und sieht eine Meldung, die die erforderliche Version nennt.
- Chatnachrichten: Eine Nachricht, die länger als 500 Bytes oder leer ist, wird verworfen.
- Verbindungen: Standardmäßig höchstens 10 gleichzeitig von einer IP-Adresse und insgesamt 128. Siehe `BEAMMP_MAX_CONCURRENT_CONNECTIONS`.
