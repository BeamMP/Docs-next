---
description: "Ausnahmen in der Windows Defender Firewall und im Virenschutz erstellen, damit Launcher und Server von BeamMP nicht blockiert werden: erst Firewall-Regeln, dann eine Virenschutz-Ausnahme."
---
# Defender-/Firewall-Ausnahmen

Diese Anleitung zeigt, wie du in der Windows Defender Firewall und im Virenschutz Ausnahmen für den BeamMP-Launcher und den Server erstellst.

Bevor du die Firewall änderst, stelle sicher, dass dein Netzwerk in den Windows-Netzwerkeinstellungen auf **Privat** gesetzt ist, falls du dich in einem privaten Netzwerk befindest.

::: danger Ausnahmen sind ein Risiko
Wenn du Ausnahmen erstellst, verstehst du die Risiken, die entstehen, wenn du Programme auf deinem Computer zulässt und Ports in deinem Heimnetzwerk für die Öffentlichkeit öffnest. Du verzichtest daher darauf, BeamMP für jegliche Schäden verantwortlich zu machen, die dir oder deinem Haushalt entstehen könnten.

Für Inhalte auf extern verlinkten Diensten oder Websites übernehmen wir keine Verantwortung.
:::

## Dem Launcher den Zugriff durch die Firewall erlauben

1. Öffne **Windows Defender Firewall mit erweiterter Sicherheit**.
2. Klicke auf **Eingehende Regeln**.
3. Klicke oben rechts auf **Neue Regel**.
4. Wähle **Programm** und klicke auf **Weiter**.
5. Wähle **Dieser Programmpfad** und gib den vollständigen Pfad zu `BeamMP-Launcher.exe` ein. Standardmäßig ist das `%appdata%\BeamMP-Launcher\BeamMP-Launcher.exe`, ohne Anführungszeichen.
6. Wähle **Verbindung zulassen**.
7. Lass die markierten Netzwerktypen unverändert und klicke auf **Weiter**.
8. Gib der Regel einen Namen, zum Beispiel „BeamMP-Launcher“, und klicke auf **Fertig stellen**.

## Dem Server den Zugriff durch die Firewall erlauben

Der Server braucht eine Regel für das Programm und eine Regel für seinen Port. Spieler verbinden sich mit derselben Portnummer über TCP und über UDP, deshalb braucht der Port für jedes Protokoll eine Regel.

1. Erstelle eine Regel für das Programm wie in den Schritten oben, aber mit dem vollständigen Pfad zu `BeamMP-Server.exe`. Das ist der Ort, an den du die Datei nach dem Download gelegt hast. Nenne sie „BeamMP-Server“.
2. Klicke erneut auf **Neue Regel**.
3. Wähle **Port** und klicke auf **Weiter**.
4. Wähle **TCP** und **Bestimmte lokale Ports** und gib denselben Port ein wie bei `Port` in deiner `ServerConfig.toml`. Standardmäßig ist das `30814`.
5. Wähle **Verbindung zulassen**, lass die markierten Netzwerktypen unverändert und gib der Regel einen Namen, zum Beispiel „BeamMP-Server TCP“.
6. Wiederhole die Schritte 2 bis 5 mit **UDP** und nenne die Regel „BeamMP-Server UDP“.

Eine Firewall-Regel gilt, sobald du sie speicherst. Starte danach den Launcher oder den Server neu.

## Eine Virenschutz-Ausnahme hinzufügen

Das gilt für den Launcher und den Server.

1. Öffne die App **Windows-Sicherheit**.
2. Klicke auf **Viren- & Bedrohungsschutz**.
3. Klicke unter **Einstellungen für Viren- & Bedrohungsschutz** auf **Einstellungen verwalten**.
4. Scrolle nach unten zu **Ausschlüsse** und klicke auf **Ausschlüsse hinzufügen oder entfernen**.
5. Klicke auf **Ausschluss hinzufügen**, wähle **Datei** und wähle `BeamMP-Launcher.exe` oder `BeamMP-Server.exe`. So wird das Programm selbst nicht gescannt oder entfernt.
6. Klicke erneut auf **Ausschluss hinzufügen**, wähle **Prozess** und gib den vollständigen Pfad zum selben Programm ein. So werden die Dateien, die das Programm öffnet, nicht gescannt.

Eine Ausnahme gilt für den Echtzeitschutz. Ein geplanter oder manueller Scan kann eine ausgeschlossene Datei trotzdem scannen.

## Immer noch Probleme?

Eröffne einen Thread im [Forum](https://forum.beammp.com) oder frag im Kanal `#support` auf dem [Discord-Server](https://discord.gg/beammp).
