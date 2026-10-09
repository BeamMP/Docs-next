---
description: "Was die Fehlercodes und Meldungen im Fenster des BeamMP-Launchers bedeuten, etwa 10060 oder Launcher Update failed, und wie du sie behebst."
---
# Fehlercodes

Diese Seite listet die Fehlercodes und Meldungen auf, die der Launcher anzeigen kann, und was du jeweils tun kannst. Für Fehler im Fenster eines Servers siehe die [Server-Fehlercodes](/de/server-owners/error-codes).


| Code | Beschreibung | Mögliche Lösung |
|---|---|---|
| 10048 | Der Launcher-Port wird bereits von etwas anderem verwendet | Stelle sicher, dass immer nur EINE Instanz des BeamMP-Launchers läuft. Versuche, deinen PC neu zu starten. |
| 10038 / 10060 / 10061 | Auf dieser IP und/oder diesem Port hat kein Server geantwortet | Wenn du der Serverbetreiber bist, prüfe die Portweiterleitung und/oder die Firewall-Regeln, die du unter [Einen Server hosten](/de/server-owners/host-a-server) findest. Wenn du nicht der Serverbetreiber bist, wähle einen anderen Server oder kontaktiere den Betreiber, falls er bekannt ist. |
| 10054 | Connection reset by peer | Der Server, mit dem du dich verbindest, ist offline gegangen. |
| Failed to find the game please launch it. Report this if the issue persists code 3. | Der Launcher konnte die Informationen des Spiels (Spielverzeichnis, Profilverzeichnis, Version usw.) im Registrierungseintrag nicht finden | Starte das Spiel mindestens einmal, damit die Registrierungswerte erstellt werden. |
| Failed to find the game please launch it. Report this if the issue persists code 4. | Der Launcher konnte die Informationen des Spiels (Spielverzeichnis, Profilverzeichnis, Version usw.) im Registrierungseintrag nicht lesen | Dieser Fehler tritt am ehesten bei Nutzern mit **Raubkopien** des Spiels auf. Wenn du das Spiel gekauft hast, starte es mindestens einmal, damit die Registrierungswerte erstellt werden. |
| Failed to Launch the game! launcher closing soon | Der Launcher konnte die ausführbare Datei des Spiels nicht finden | Starte das Spiel mindestens einmal, bevor du den Launcher erneut ausführst. |
| Game Closed! launcher closing soon | Das Spiel wurde geschlossen | Diese Meldung erscheint, wenn das Spiel geschlossen wird oder nicht gestartet werden konnte. |
| Launcher Update failed! | Der Launcher konnte keine neue Version herunterladen | Prüfe deine Internetverbindung sowie deine Firewall- und Virenschutz-Regeln, damit der Launcher nicht blockiert wird. |
| Logger file init failed | Der Launcher kann keine Dateien erstellen | Führe den Launcher als Administrator aus. |
| Please close the game and try again | Das Spiel ist bereits geöffnet und der Launcher kann den Ordner `multiplayer/mods` nicht leeren | Schließe das Spiel und versuche es erneut. |
| Please launch the game at least once | Der Launcher hat versucht, das Verzeichnis des Spiels zu ändern, und ist daran gescheitert | Starte das Spiel mindestens einmal, bevor du den Launcher erneut ausführst. |
| Primary Servers Offline! Sorry for the inconvenience! | Der Launcher konnte nicht nach einem Update suchen | Prüfe deine Internetverbindung und deine Firewall-Regeln. Wenn bei dir alles in Ordnung ist, schau bitte im [BeamMP-Updates-Kanal](<https://discord.com/channels/601558901657305098/697596153943949352>) auf unserem Discord nach. |
| Sorry Backend System Outage! Don't worry it will back on soon! | Das BeamMP-Backend hat nicht geantwortet | Prüfe deine Internetverbindung und deine Firewall-Regeln. Wenn bei dir alles in Ordnung ist, schau bitte im [BeamMP-Updates-Kanal](<https://discord.com/channels/601558901657305098/697596153943949352>) auf unserem Discord nach. |
| Stuck on updating | Der Launcher hängt beim Aktualisieren fest und geht nicht zum nächsten Schritt über | Führe den Launcher als Administrator aus und prüfe deine Virenschutz-Regeln, damit der Launcher nicht blockiert wird. |

Wenn sich der Launcher sofort schließt, sieh dir die Datei `Launcher.log` in dem Ordner an, in dem du BeamMP installiert hast.
