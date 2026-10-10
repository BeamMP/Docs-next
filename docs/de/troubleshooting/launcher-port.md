---
description: "Den Port des BeamMP-Launchers von Hand ändern, wenn sich der Launcher nicht mit dem Spiel verbindet: Port in den BeamNG-Optionen und in der Datei Launcher.cfg setzen."
---
# Ändern des Launcher-Ports

Der Launcher verbindet sich nicht mit dem Spiel? Diese Anleitung zeigt dir, wie du den Port des Launchers von Hand änderst. Der Port muss im Spiel und im Launcher derselbe sein.

Der Standardport ist `4444`. Der Launcher verwendet diesen Port und den nächsten, `4445`, auf deinem eigenen Computer. Beide nutzen TCP, und beide müssen frei sein. Wenn ein anderes Programm einen von ihnen verwendet, zeigt der Launcher `bind failed with error` an, wie unter [Fehlercodes](/de/troubleshooting/error-codes) aufgeführt.

1. Starte BeamNG.drive.
2. Gehe im Hauptmenü zu **Optionen** und dann zu **BeamMP**.
3. Öffne die Gruppe **Erweitert**.
4. Ändere bei **Launcher port** die Zahl auf eine andere, zum Beispiel `4567`.
5. Schließe BeamNG.drive.
6. Klicke mit der rechten Maustaste auf die Verknüpfung des BeamMP-Launchers und wähle **Dateispeicherort öffnen**.
7. Öffne `Launcher.cfg` in einem Texteditor.
8. Ändere die Zahl in `"Port": 4444,` auf den Port, den du im Spiel eingestellt hast, in diesem Beispiel `4567`.
9. Speichere die Datei und schließe den Editor. Achte darauf, dass die Datei gültiges JSON bleibt: Wenn der Launcher sie nicht lesen kann, zeigt er `Config failed to parse make sure it's valid JSON!` an und schließt sich.
10. Starte den Launcher.

Wenn er sich immer noch nicht verbindet, probiere einen anderen Port. Verwende eine Zahl von 1024 bis 65534, weil der Launcher auch die nächste Zahl verwendet.

::: tip
Du kannst den Port auch setzen, ohne `Launcher.cfg` zu bearbeiten. Starte den Launcher mit `--port 4567`. Die Kommandozeilenoption ersetzt den Wert in `Launcher.cfg`. Die weiteren Optionen findest du unter [Entwicklungsumgebung einrichten](/de/developers/dev-environment-setup#turn-on-dev-mode-in-the-launcher).
:::

## Immer noch Probleme?

Erstelle ein Support-Ticket auf unserem [Discord-Server](https://discord.gg/BeamMP).
