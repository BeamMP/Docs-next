---
description: "Eine Entwicklungsumgebung für den BeamMP-Mod einrichten: ein entpackter Mods-Ordner, Entwicklermodus und Einstellungen des Launchers, den Launcher erstellen, ein geklontes Repository, ein lokaler Server und wie du beiträgst."
---
# Entwicklungsumgebung einrichten

Diese Seite zeigt, wie du deinen Computer einrichtest, um am BeamMP-Mod zu arbeiten, und wie du einen lokalen Server startest. Wie Mod, Launcher und Server zusammenspielen, erfährst du unter [Entwickler](/de/developers/).

## Was du brauchst

- BeamNG.drive, lokal installiert.
- BeamMP, lokal installiert: mindestens der Launcher, und auch der Server, wenn du damit testen möchtest.
- Git, lokal installiert, und ein GitHub-Konto.
- Ein Code-Editor, zum Beispiel VSCode oder Notepad++.

## Einen entpackten Ordner für BeamNG verwenden

Um effizient an Mods zu arbeiten, verwende einen Ordner `unpacked`, statt nach jeder Änderung ein Zip zu packen.

1. Öffne den Ordner `mods` im BeamNG-Benutzerordner. Unter Windows ist das `%LocalAppData%\BeamNG\BeamNG.drive\current\mods`. Der Launcher zeigt beim Start in der Zeile `Game user path:` an, welchen Ordner er verwendet.
2. Erstelle in `mods` einen Ordner namens `unpacked`.

Mehr zum Benutzerordner steht in der [BeamNG-Dokumentation](https://documentation.beamng.com/support/userfolder/).

## Den Entwicklermodus im Launcher aktivieren {#turn-on-dev-mode-in-the-launcher}

Starte den Launcher mit `--dev`. Der Entwicklermodus gibt Debug-Meldungen aus, lädt den BeamMP-Mod nicht herunter, startet BeamNG.drive nicht und aktualisiert den Launcher nicht. Wenn du nur einen Teil davon willst, verwende die einzelnen Optionen unten.

Ohne `--no-download` lädt der Launcher den veröffentlichten BeamMP-Mod nach `mods/multiplayer` herunter. Außerdem löscht er `mods/unpacked/beammp`, es sei denn, dieser Ordner enthält einen Ordner `.git`. Verwende `--no-download`, damit der veröffentlichte Mod nicht neben deinem läuft.

| Argument | Was es macht |
|---|---|
| `--help`, `-h` oder `/?` | Gibt diese Liste der Argumente aus und beendet sich |
| `--port <port>` oder `-p <port>` | Ändert den Listen-Port, standardmäßig `4444`, auf `<port>`. Der Launcher nutzt außerdem `<port>` + 1. Er muss auch im Spiel eingestellt werden. Ersetzt `Port` in `Launcher.cfg` |
| `--verbose` oder `-v` | Ausführlicher Modus: gibt Debug-Meldungen im Fenster aus. Sie werden immer in `Launcher.log` geschrieben |
| `--no-download` | Überspringt das Herunterladen und Installieren des BeamMP-Mods |
| `--no-update` | Überspringt das Anwenden von Launcher-Updates, du musst also von Hand aktualisieren |
| `--no-launch` | Überspringt das Starten des Spiels, du musst es also selbst starten |
| `--dev` | Entwicklermodus: dasselbe wie `--verbose --no-download --no-launch --no-update` |
| `--user-path <path>` | Nur unter Windows. Pfad zum BeamNG.drive-Benutzerordner, also dem Ordner, der `current` enthält |
| `--game <args...>` oder `-- <args...>` | Übergibt alle Argumente danach an das Spiel |

### Die Einstellungsdatei des Launchers

Der Launcher liest `Launcher.cfg` aus dem Ordner, in dem er läuft. Fehlt die Datei, erstellt der Launcher sie mit den ersten drei Einstellungen. Die Kommandozeilenoptionen ersetzen die passenden Einstellungen.

| Einstellung | Standard | Was sie macht |
|---|---|---|
| `"Port"` | `4444` | Der Port, mit dem sich das Spiel verbindet. Siehe [Ändern des Launcher-Ports](/de/troubleshooting/launcher-port) |
| `"Build"` | `"Default"` | Der Build, den der Launcher beim BeamMP-Backend anfragt, wenn er nach Updates für Launcher und Mod sucht. Lass es auf `Default` |
| `"CachingDirectory"` | `"./Resources"` | Der Ordner, in dem der Launcher heruntergeladene Server-Mods ablegt |
| `"Dev"` | nicht gesetzt | `true` entspricht `--dev` |
| `"DeleteDuplicateMods"` | `false` | `true` bewirkt, dass der Launcher ältere zwischengespeicherte Versionen eines Mods löscht, wenn ein Server eine neuere sendet |

### Mod-Cache

Wenn du einem Server beitrittst, lädt der Launcher jeden Mod, den der Server auflistet, in den Ordner `CachingDirectory` herunter. Ein Mod wird als `<name>-<first 8 characters of its SHA-256 hash>.zip` gespeichert. Der Launcher verwendet eine zwischengespeicherte Datei wieder, wenn ihr Hash übereinstimmt, und vermerkt die letzte Verwendung jeder Datei in `mods.json` im selben Ordner. Danach kopiert er den Mod nach `mods/multiplayer` im Benutzerordner des Spiels, unter Linux mit kleingeschriebenem Dateinamen.

Bei jedem Start löscht der Launcher alles in `mods/multiplayer` außer `beammp.zip`. Lege dort keine eigenen Dateien ab.

## Den Launcher erstellen {#build-the-launcher}

Du musst den Launcher nur dann erstellen, wenn du am Launcher selbst arbeitest. Die `README.md` des Launchers enthält keine Build-Schritte.

Unter Windows brauchst du Visual Studio mit der Workload „Desktopentwicklung mit C++“ (MSVC), CMake und [vcpkg](https://github.com/microsoft/vcpkg). Die Bibliotheken in `vcpkg.json` sind `cpp-httplib`, `nlohmann-json`, `zlib`, `openssl` und `curl`. Der Launcher verwendet die statische C++-Laufzeit, nutze also das Triplet `x64-windows-static`. Führe im Hauptverzeichnis des Projekts Folgendes aus. Ändere `C:/vcpkg` auf den Ort, an dem du `vcpkg` installiert hast:

```bash
cmake . -B bin -DCMAKE_BUILD_TYPE=Release -DCMAKE_TOOLCHAIN_FILE=C:/vcpkg/scripts/buildsystems/vcpkg.cmake -DVCPKG_TARGET_TRIPLET=x64-windows-static
cmake --build bin --parallel --config Release
```

Das Programm ist `bin/Release/BeamMP-Launcher.exe`. Unter Windows ersetzt sich der Launcher selbst durch die offizielle signierte Version, sobald es eine neuere gibt. Starte deinen eigenen Build daher mit `--no-update`.

Für Linux folge der Anleitung [Den Launcher erstellen](/de/get-started/install-beammp#build-the-launcher). Der Launcher lässt sich unter macOS nicht erstellen.

## Das BeamMP-Repository in den Ordner unpacked klonen

Du kannst die Mod-Dateien von Hand aus unserem GitHub-Repository kopieren, aber ein Versionsverwaltungssystem wie Git ist deutlich besser.

1. Erstelle einen Fork von [BeamMP/BeamMP](https://github.com/BeamMP/BeamMP).
2. Klone ihn direkt in den Ordner `unpacked`. Führe in PowerShell oder CMD, in diesem Ordner geöffnet, Folgendes aus:

   ```bash
   git clone https://github.com/yourName/BeamMP
   ```

3. Lösche im Benutzerordner `mods/multiplayer/beammp.zip`, falls sie existiert. Ein normaler Start des Launchers lädt sie herunter, und `--no-download` entfernt sie nicht. Stelle sicher, dass `mods/unpacked/beammp` existiert.
4. Probiere den Entwicklermodus aus. Starte den Launcher mit `--dev` und dann BeamNG manuell. Stelle im Spiel sicher, dass BeamMP der einzige aktive Mod ist. Du kannst BeamMP wie gewohnt verwenden.

Mit einem Code-Editor kannst du den Code jetzt direkt im Ordner `unpacked` ändern. Lade Lua im Spiel mit `Ctrl` + `L` neu und drücke zusätzlich `F5`, wenn du die Oberfläche geändert hast.

## Einen lokalen Server einrichten

Ein lokaler Server hilft dir bei der Arbeit an BeamMP. Folge der Anleitung [Einen Server hosten](/de/server-owners/host-a-server) und lasse die ersten beiden Schritte (Portweiterleitung und den AuthKey) weg, wenn du dich nur lokal verbindest.

Setze den Server in der `ServerConfig.toml` auf privat und verwende eine beliebige Zeichenfolge als `AuthKey`.

## Deine Änderungen beisteuern

Wenn du mit deinen Änderungen zufrieden bist, committe sie mit Git. Auf der Website [Git-SCM](https://git-scm.com/doc) findest du Tutorials und Dokumentation. Wenn deine Änderungen committet und in deinen Fork gepusht sind, kannst du einen Pull Request erstellen.

Das Repository des BeamMP-Mods hat eine Datei `CONTRIBUTING.md` mit dem Code-Format, dem Format von Commit-Nachrichten und der allgemeinen Entwicklungspraxis. Das Launcher-Repository hat eine Datei `.clang-format` für den Code-Stil, und seine Pull-Request-Vorlage verlangt von dir die Bestätigung, dass du den gesamten Code selbst geschrieben hast und verstehst. Die `README.md` eines Repositorys kann die Build-Schritte für kompilierte Projekte enthalten.

Wenn du auf Probleme stößt, frag im Kanal `#scripting` auf unserem [Discord-Server](https://discord.gg/beammp).
