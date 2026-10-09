---
description: "Den Port des BeamMP-Launchers von Hand ändern, wenn sich der Launcher nicht mit dem Spiel verbindet: Port in den BeamNG-Optionen und in der Datei launcher.cfg setzen."
---
# Ändern des Launcher-Ports

Der Launcher verbindet sich nicht mit dem Spiel? Diese Anleitung zeigt dir, wie du den Port des Launchers von Hand änderst. Der Port muss im Spiel und im Launcher derselbe sein.

1. Starte BeamNG.drive.
2. Gehe im Hauptmenü zu **Optionen** und dann zu **Multiplayer**.
3. Aktiviere **Show advanced options**.
4. Scrolle ganz nach unten.
5. Ändere bei **Launcher port** die Zahl auf eine andere, zum Beispiel `4567`.
6. Schließe BeamNG.drive.
7. Klicke mit der rechten Maustaste auf die Verknüpfung des BeamMP-Launchers und wähle **Dateispeicherort öffnen**.
8. Öffne `launcher.cfg` in einem Texteditor.
9. Ändere die Zahl in `"Port": 4444,` auf den Port, den du im Spiel eingestellt hast, in diesem Beispiel `4567`.
10. Speichere die Datei und schließe den Editor.
11. Starte den Launcher.

Wenn er sich immer noch nicht verbindet, probiere einen anderen Port. Jede Zahl von etwa 2000 bis 65535 ist ein gültiger Port.

## Immer noch Probleme?

Erstelle ein Support-Ticket auf unserem [Discord-Server](https://discord.gg/BeamMP).
