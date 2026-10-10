---
description: "Den BeamMP-Launcher von Hand aktualisieren, wenn er sich nicht selbst aktualisieren kann oder einen leeren Bildschirm zeigt: unter Windows den neuesten Launcher laden, unter Linux neu erstellen."
---
# Probleme beim Launcher-Update

Der Launcher kann sich nicht aktualisieren oder zeigt einen leeren Bildschirm? Diese Anleitung zeigt dir, wie du ihn von Hand aktualisierst.

Unter Windows solltest du BeamMP bereits mit dem Installer von [unserer Website](https://beammp.com) installiert haben, bevor du dieser Anleitung folgst.

## So aktualisiert sich der Launcher

Unter Windows prüft der Launcher bei jedem Start bei `backend.beammp.com`, ob es eine neuere Version gibt. Falls ja, lädt er sie herunter, prüft ihre Signatur und behält die alte Datei als `BeamMP-Launcher.back` im selben Ordner. Danach startet er neu. Der Launcher überspringt die Prüfung, wenn du ihn mit `--no-update` oder `--dev` startest.

Wenn das Update fehlschlägt, zeigt der Launcher eine dieser Meldungen an:

- `Failed to download the launcher update! Please try manually updating it`
- `The authenticity of the updated launcher could not be verified, it was corrupted or tampered with.`

Prüfe deine Internetverbindung und deine Firewall oder deinen Virenschutz, wie unter [Defender-/Firewall-Ausnahmen](/de/troubleshooting/defender-exclusions) beschrieben. Aktualisiere den Launcher dann von Hand.

Unter Linux aktualisiert sich der Launcher nie selbst. Folge statt der Schritte unten der Anleitung [Den Launcher unter Linux aktualisieren](/de/get-started/install-beammp#update-the-launcher-on-linux).

## Einen neuen Launcher installieren

1. Lade den neuesten Launcher direkt von [GitHub](https://github.com/BeamMP/BeamMP-Launcher/releases/latest/download/BeamMP-Launcher.exe) herunter.
2. Schließe den Launcher.
3. Öffne den Ordner, der `BeamMP-Launcher.exe` enthält. Standardmäßig ist das `C:\Users\<username>\AppData\Roaming\BeamMP-Launcher`. Ersetze `<username>` durch deinen Windows-Benutzernamen. Wenn du BeamMP woanders installiert hast, zum Beispiel unter `D:\BeamMP-Launcher`, verwende diesen Ordner.
4. Ersetze den vorhandenen Launcher im Ordner BeamMP-Launcher durch den neuen.
5. Starte den Launcher wie gewohnt und prüfe, ob er funktioniert.

## Immer noch Probleme?

Erstelle ein Support-Ticket auf unserem [Discord-Server](https://discord.gg/BeamMP).
