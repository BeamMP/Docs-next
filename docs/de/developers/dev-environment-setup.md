---
description: "Eine Entwicklungsumgebung für den BeamMP-Mod einrichten: ein entpackter Mods-Ordner, der Entwicklermodus des Launchers, ein geklontes Repository, ein lokaler Server und wie du beiträgst."
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

1. Öffne den BeamNG-Benutzerordner unter `%appdata%/Local/BeamNG.drive/0.xx/mods`, wobei `xx` die neueste BeamNG-Version ist.
2. Erstelle in `mods` einen Ordner namens `unpacked`.

Mehr zum Benutzerordner steht in der [BeamNG-Dokumentation](https://documentation.beamng.com/support/userfolder/).

## Den Entwicklermodus im Launcher aktivieren

Die automatische Aktualisierung würde deinen lokalen Git-Klon löschen, schalte sie daher mit `--no-download` aus. Wenn der Launcher außerdem BeamNG nicht starten soll und du Debug-Ausgaben sehen möchtest, verwende `--dev`.

| Argument | Was es macht |
|---|---|
| `--help` oder `-h` | Gibt diese Liste der Argumente aus |
| `--port <port>` oder `-p` | Ändert den Standard-Listen-Port auf `<port>`. Er muss auch im Spiel eingestellt werden |
| `--verbose` oder `-v` | Ausführlicher Modus: gibt Debug-Meldungen aus |
| `--no-download` | Überspringt das Herunterladen und Installieren des BeamMP-Lua-Mods |
| `--no-update` | Überspringt das Anwenden von Launcher-Updates, du musst also von Hand aktualisieren |
| `--no-launch` | Überspringt das Starten des Spiels, du musst es also selbst starten |
| `--dev` | Entwicklermodus: dasselbe wie `--verbose --no-download --no-launch --no-update` |
| `--user-path <path>` | Pfad zum BeamNG.drive-Benutzerordner |
| `--game <args...>` oder `-- <args...>` | Übergibt Argumente an das Spiel |

## Das BeamMP-Repository in den Ordner unpacked klonen

Du kannst die Mod-Dateien von Hand aus unserem GitHub-Repository kopieren, aber ein Versionsverwaltungssystem wie Git ist deutlich besser.

1. Erstelle einen Fork von [BeamMP/BeamMP](https://github.com/BeamMP/BeamMP).
2. Klone ihn direkt in den Ordner `unpacked`. Führe in PowerShell oder CMD, in diesem Ordner geöffnet, Folgendes aus:
   ```bash
   git clone https://github.com/yourName/BeamMP
   ```
3. Stelle im Benutzerordner sicher, dass in `mods` kein Ordner `multiplayer` mehr übrig ist und dass es jetzt `unpacked/beammp` gibt.
4. Probiere den Entwicklermodus aus. Starte den Launcher und dann BeamNG manuell. Stelle im Spiel sicher, dass BeamMP der einzige aktive Mod ist. Du kannst BeamMP wie gewohnt verwenden.

Mit einem Code-Editor kannst du den Code jetzt direkt im Ordner `unpacked` ändern. Lade Lua im Spiel mit `Ctrl` + `L` neu und drücke zusätzlich `F5`, wenn du die Oberfläche geändert hast.

## Einen lokalen Server einrichten

Ein lokaler Server hilft dir bei der Arbeit an BeamMP. Folge der Anleitung [Einen Server hosten](/de/server-owners/host-a-server) und lasse die ersten beiden Schritte (Portweiterleitung und den AuthKey) weg, wenn du dich nur lokal verbindest.

Setze den Server in der `ServerConfig.toml` auf privat und verwende eine beliebige Zeichenfolge als `AuthKey`.

## Deine Änderungen beisteuern

Wenn du mit deinen Änderungen zufrieden bist, committe sie mit Git. Auf der Website [Git-SCM](https://git-scm.com/doc) findest du Tutorials und Dokumentation. Wenn deine Änderungen committet und in deinen Fork gepusht sind, kannst du einen Pull Request erstellen.

Für das Code-Format, das Format von Commit-Nachrichten und allgemeine Entwicklungspraxis siehe die Datei `CONTRIBUTING.md` in jedem Repository. Die `README.md` in jedem Repository enthält meist die Build-Schritte für kompilierte Projekte.

Wenn du auf Probleme stößt, frag im Kanal `#scripting` auf unserem [Discord-Server](https://discord.gg/beammp).
