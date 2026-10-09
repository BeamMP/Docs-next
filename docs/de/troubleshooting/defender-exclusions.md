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
4. Wähle **Programm**, um eine Regel für ein Programm zu erstellen.
5. Gib den vollständigen Pfad zu `BeamMP-Launcher.exe` ein. Standardmäßig ist das `%appdata%\BeamMP-Launcher\BeamMP-Launcher.exe`, ohne Anführungszeichen.
6. Wähle, die Verbindung zuzulassen.
7. Gib der Regel einen Namen, zum Beispiel „BeamMP-Launcher“, und speichere sie.
8. Starte deinen Computer neu.

## Dem Server den Zugriff durch die Firewall erlauben

1. Öffne **Windows Defender Firewall mit erweiterter Sicherheit**.
2. Klicke auf **Eingehende Regeln**.
3. Klicke oben rechts auf **Neue Regel**.
4. Wähle **Port**, um eine Regel für einen Port zu erstellen.
5. Gib denselben Port ein wie in deiner `ServerConfig.toml`.
6. Gib den vollständigen Pfad zu `BeamMP-Server.exe` ein. Das ist der Ort, an den du die Datei nach dem Download gelegt hast.
7. Wähle, die Verbindung zuzulassen.
8. Gib der Regel einen Namen, zum Beispiel „BeamMP-Server“, und speichere sie.
9. Starte deinen Computer neu.

## Eine Virenschutz-Ausnahme hinzufügen

Das gilt für den Launcher und den Server.

1. Öffne die App **Windows-Sicherheit**.
2. Klicke auf **Viren- & Bedrohungsschutz**.
3. Klicke unter **Einstellungen für Viren- & Bedrohungsschutz** auf **Einstellungen verwalten**.
4. Scrolle nach unten zu **Ausschlüsse**.
5. Klicke auf **Ausschlüsse hinzufügen oder entfernen**, dann auf **Ausschluss hinzufügen** und wähle **Prozess**.
6. Gib `BeamMP-Launcher.exe` oder `BeamMP-Server.exe` ein und speichere es.
7. Starte deinen Computer neu.

## Immer noch Probleme?

Eröffne einen Thread im [Forum](https://forum.beammp.com) oder frag im Kanal `#support` auf dem [Discord-Server](https://discord.gg/beammp).
