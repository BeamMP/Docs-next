---
description: "Was die Fehlercodes und Meldungen im Fenster des BeamMP-Launchers bedeuten, etwa 10060, 10048 oder Failed to find the game, und wie du sie behebst."
---
# Fehlercodes

Diese Seite listet die Fehlercodes und Meldungen auf, die der Launcher anzeigen kann, und was du jeweils tun kannst. Die Meldungen stammen aus Launcher v2.8.1. Für Fehler im Fenster eines Servers siehe die [Server-Fehlercodes](/de/server-owners/error-codes).

Der Launcher schreibt alles, was er anzeigt, auch in die Datei `Launcher.log` in dem Ordner, in dem der Launcher liegt. Die Datei ist bei jedem Start des Launchers zunächst leer und enthält deshalb nur den letzten Durchlauf. Wenn sich der Launcher sofort schließt, sieh dir diese Datei an.

## Netzwerkcodes

Die Zahl nach `error:` oder `Error code:` ist ein Windows-Socket-Code. Unter Linux ist es stattdessen die Fehlernummer des Systems.

| Windows (Linux) | Beschreibung | Mögliche Lösung |
|---|---|---|
| 10048 (98) | `bind failed with error`: Der Launcher-Port oder der nächste wird bereits von etwas anderem verwendet. Die Standardports sind `4444` und `4445` | Führe immer nur einen Launcher gleichzeitig aus und starte deinen PC neu. Wenn ein anderes Programm die Ports verwendet, [ändere den Launcher-Port](/de/troubleshooting/launcher-port). Unter Linux passiert das auch, wenn du einem zweiten Server beitrittst: Schließe das Spiel und den Launcher und starte sie erneut |
| 10060, 10061 (110, 111) | `Client: connect failed! Error code`: Auf dieser IP-Adresse und diesem Port hat kein Server geantwortet | Wenn du der Serverbetreiber bist, prüfe die Portweiterleitung und die Firewall-Regeln unter [Einen Server hosten](/de/server-owners/host-a-server). Wenn nicht, wähle einen anderen Server oder kontaktiere den Betreiber |
| 10054 (104) | Die Verbindung wurde von der Gegenseite zurückgesetzt | Der Server, mit dem du verbunden warst, ist offline gegangen oder wurde neu gestartet. Versuche es später erneut |
| 10038 | `(Game) send failed with error`: Der Launcher wollte an das Spiel senden, nachdem das Spiel die Verbindung getrennt hatte. Launcher v2.8.0 zeigt das an | Aktualisiere auf den neuesten Launcher |
| `DNS lookup failed! on` gefolgt von einem Namen | Der Launcher konnte die Adresse des eingegebenen Servernamens nicht finden | Prüfe den Namen. Verwende stattdessen die IP-Adresse des Servers |

## Das Spiel starten

| Meldung | Beschreibung | Mögliche Lösung |
|---|---|---|
| `Failed to find the game please launch it. Report this if the issue persists code 3` | Windows. `%LocalAppData%\BeamNG\BeamNG.Drive.ini` existiert, aber der Launcher kann sie nicht lesen | Starte BeamNG.drive einmal, damit die Datei neu geschrieben wird |
| `... code 4` | Windows. `installPath` in `BeamNG.Drive.ini` verweist auf einen Ordner, der nicht existiert | Starte BeamNG.drive einmal aus seinem aktuellen Ordner oder korrigiere `installPath` in der Datei |
| `... code 5` | Windows. `BeamNG.Drive.ini` enthält kein `installPath` | Starte BeamNG.drive einmal |
| `... code 6` | Windows. Es gibt keine `BeamNG.Drive.ini`, und der Registrierungsschlüssel `HKEY_CURRENT_USER\Software\BeamNG\BeamNG.drive` hat keinen Wert `rootpath` | Starte BeamNG.drive einmal |
| `... code 7` | Windows. Es gibt keine `BeamNG.Drive.ini`, und der Registrierungsschlüssel `HKEY_CURRENT_USER\Software\BeamNG\BeamNG.drive` existiert nicht | Starte BeamNG.drive einmal |
| `Unsupported Steam installation.` | Linux. In keinem der Steam-Ordner, die der Launcher kennt, gibt es einen Ordner `steamapps` | Die Ordner findest du unter [Bevor du anfängst](/de/get-started/install-beammp#before-you-start). Verknüpfe deinen mit einem von ihnen |
| `libraryfolders.vdf is missing.` | Linux. Der Steam-Ordner enthält keine Datei `libraryfolders.vdf` | Starte Steam einmal und versuche es dann erneut |
| `The game directory was not found.` | Linux. BeamNG.drive befindet sich in keiner Steam-Bibliothek, die `libraryfolders.vdf` auflistet | Installiere BeamNG.drive über Steam |
| `Failed to Launch the game! launcher closing soon` | Der Launcher konnte `BeamNG.drive.exe` (Windows) oder `BinLinux/BeamNG.drive.x64` (Linux) im Spielordner nicht starten. Unter Windows folgen der Windows-Fehlercode und -Text | Überprüfe die Spieldateien in Steam und starte das Spiel einmal, bevor du den Launcher startest |
| `Game Closed! launcher closing soon` | Das Spiel wurde beendet. Der Launcher schließt sich 5 Sekunden später | Normal, wenn du das Spiel schließt. Wenn sich das Spiel von selbst geschlossen hat, starte den Launcher erneut |
| `We were unable to clean the multiplayer mods folder! Is the game still running or do you have something open in that folder?` | Der Launcher leert beim Start den Ordner `mods/multiplayer` im Benutzerordner des Spiels und konnte das nicht | Schließe das Spiel und alle Programme, die diesen Ordner verwenden, und starte den Launcher dann erneut |

## Die eigenen Dateien des Launchers

| Meldung | Beschreibung | Mögliche Lösung |
|---|---|---|
| `logger file init failed!` | Der Launcher kann in seinem Ordner keine `Launcher.log` erstellen | Verschiebe den Launcher in einen Ordner, in den du schreiben kannst |
| `Config failed to parse make sure it's valid JSON!` | `Launcher.cfg` ist kein gültiges JSON. Der Launcher schließt sich | Korrigiere die Datei oder lösche sie. Der Launcher erstellt dann eine neue mit den Standardeinstellungen |
| `Failed to open Launcher.cfg!`, `Failed to write config on disk!` | Der Launcher kann `Launcher.cfg` in dem Ordner, aus dem er läuft, nicht lesen oder erstellen | Führe ihn aus einem Ordner aus, in den du schreiben kannst |
| `Failed to create caching directory` | Der Launcher kann den Mod-Cache-Ordner nicht erstellen. Das ist `Resources`, sofern du in `Launcher.cfg` nicht `CachingDirectory` gesetzt hast | Setze `CachingDirectory` auf einen Ordner, in den du schreiben kannst |
| `Exception in main()` | Ein schwerwiegender Fehler. Der Launcher schließt sich nach 5 Sekunden | Lies den Text danach und frag im [Forum](https://forum.beammp.com) oder auf dem [Discord-Server](https://discord.gg/beammp) nach |

## Updates und die BeamMP-Server

| Meldung | Beschreibung | Mögliche Lösung |
|---|---|---|
| `Failed to download the launcher update! Please try manually updating it` | Windows. Der Launcher konnte sein Update nicht herunterladen | Siehe [Probleme beim Launcher-Update](/de/troubleshooting/launcher-update) |
| `The authenticity of the updated launcher could not be verified, it was corrupted or tampered with.` | Windows. Das heruntergeladene Update hat keine gültige Signatur, deshalb hat der Launcher es gelöscht | Lade den Launcher von der [GitHub-Release-Seite](https://github.com/BeamMP/BeamMP-Launcher/releases/latest) herunter, wie unter [Probleme beim Launcher-Update](/de/troubleshooting/launcher-update) beschrieben |
| `Auto update is NOT implemented for the Linux version.` | Linux. Es gibt einen neueren Launcher | Erstelle den Launcher neu: siehe [Den Launcher unter Linux aktualisieren](/de/get-started/install-beammp#update-the-launcher-on-linux) |
| `GET to ... failed` oder `POST to ... failed`, dann `Curl error` | Der Launcher konnte einen BeamMP-Server nicht erreichen. Der Text danach nennt den Grund, etwa eine Zeitüberschreitung oder einen Zertifikatsfehler | Prüfe deine Internetverbindung und deine Firewall-Regeln. Wenn bei dir alles in Ordnung ist, schau im [BeamMP-Updates-Kanal](<https://discord.com/channels/601558901657305098/697596153943949352>) auf unserem Discord nach |
| `Invalid hash from backend, skipping update check.` | Das BeamMP-Backend hat keine gültige Antwort geliefert. Der Launcher überspringt die Prüfung und macht weiter | Prüfe deine Internetverbindung und deine Firewall-Regeln |
| `Failed to communicate with the auth system!` | Der Anmeldeserver hat nicht geantwortet | Prüfe deine Internetverbindung und deine Firewall-Regeln und versuche es dann erneut |
| `Invalid answer from authentication servers, please try again later!` | Der Anmeldeserver hat eine Antwort geliefert, die der Launcher nicht lesen kann | Versuche es später erneut |

## Mods

| Meldung | Beschreibung | Mögliche Lösung |
|---|---|---|
| `Mod '...' is protected and therefore must be placed in the Resources/Caching folder manually here:` gefolgt von einem Pfad | Der Server verwendet einen geschützten Mod, den der Launcher nicht herunterlädt | Besorge dir die Datei beim Ersteller und lege sie unter ihrem Dateinamen in den Ordner, den die Meldung anzeigt |
| `Server cannot find` gefolgt von einem Dateinamen | Dem Server fehlt die Mod-Datei, die er aufgelistet hat | Sag dem Serverbetreiber Bescheid |
| `Failed to write or download the entire file ... (hash mismatch)` | Die Mod-Datei wurde nicht korrekt heruntergeladen | Tritt erneut bei. Der Launcher prüft die Datei erneut und lädt sie noch einmal herunter |
| `Failed copy to the mods folder!` | Der Launcher konnte einen Mod nicht in den Ordner `mods/multiplayer` des Spiels kopieren | Schließe das Spiel und alle Programme, die diesen Ordner verwenden, und tritt dann erneut bei |
