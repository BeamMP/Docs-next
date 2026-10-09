---
description: "Antworten auf häufige Fragen zu BeamMP-Servern: Einrichtung, Linux, Systemanforderungen, Spieler, die nicht beitreten können, und das Melden von Bugs oder eines kompromittierten AuthKeys."
---
# Server FAQ

Häufige Fragen und bekannte Probleme rund um den Betrieb eines BeamMP-Servers.

## Einrichtung

### Wie kann ich meinen eigenen Server einrichten?

Alles, was du brauchst, findest du unter [Einen Server hosten](/de/server-owners/host-a-server), oder unter [Server-Einrichtung auf einem VPS](/de/server-owners/setup-vps), wenn du einen Hosting-Anbieter nutzt.

### Kann ich einen Server unter Linux betreiben?

Ja. Wir stellen Binärdateien für viele Linux-Distributionen auf der [Seite der neuesten Version](https://github.com/BeamMP/BeamMP-Server/releases/latest) bereit. Gibt es keine für deine Distribution, kannst du den Server aus dem Quellcode auf [GitHub](https://github.com/BeamMP/BeamMP-Server) selbst erstellen. Wie das geht, erklären die [Build-Anweisungen](https://github.com/BeamMP/BeamMP-Server#build-instructions).

### Was sind die Mindestanforderungen an das System?

| | Anforderung |
|---|---|
| RAM | 50 MiB oder mehr nutzbar, ohne das Betriebssystem |
| CPU | Schneller als 1 GHz, am besten mit mehreren Kernen |
| Betriebssystem | Windows oder Linux (theoretisch jedes POSIX-System) |
| GPU | Keine |
| Festplatte | 10 MiB plus Mods und Plugins |
| Bandbreite | 5–10 Mb/s Upload |

## Spieler können nicht beitreten

### Spieler außerhalb meines Netzwerks können meinem selbst gehosteten Server nicht beitreten

Wenn andere Spieler in ihrem Launcher den Fehlercode 10060, 10061 oder 10038 erhalten, prüfe Folgendes. Die vollständige Anleitung ist [Portweiterleitung](/de/server-owners/port-forwarding).

- Leite Port 30814 oder den Port, den du in der `ServerConfig.toml` gesetzt hast, weiter, und zwar für TCP und UDP.
- Erlaube BeamMP durch die Windows-Firewall, für eingehende und ausgehende Verbindungen. Die Firewall auszuschalten hilft normalerweise **nicht**.
- Stelle sicher, dass du kein VPN verwendest. Es kann Probleme verursachen.
- Stelle sicher, dass der Server ohne Fehler oder Warnungen läuft.

Während der Server läuft, kannst du mit CheckBeamMP testen, ob der Port weitergeleitet ist:

<form action="https://check.beammp.com/api/v2/beammp" method="get" target="_blank">
  <label for="ip">IP address:</label>
  <input type="text" id="ip" name="ip"><br>
  <label for="port">Port:</label>
  <input type="text" id="port" name="port"><br>
  <input type="submit" value="CheckBeamMP">
</form>

Manche Internetanbieter vergeben keine dedizierte IPv4-Adresse (CGNAT), daher funktioniert die Portweiterleitung eventuell nicht, auch wenn dein Router sie anbietet. Siehe [Auf CGNAT prüfen](/de/server-owners/cgnat). Über eine Mobilfunkverbindung (4G oder 5G) ist keine Portweiterleitung möglich.

### Ich sehe meinen Server in der Liste, kann ihm aber selbst nicht beitreten

Wenn der Server auf demselben Computer wie das Spiel läuft, tritt mit **Direct Connect** bei, mit der IP-Adresse `127.0.0.1` und dem Port deines Servers.

Um deinem eigenen, selbst gehosteten Server über die Serverliste beizutreten, muss dein Router NAT-Loopback unterstützen. Nicht viele Heimrouter tun das.

## Weitere Fragen

<!--@include: ../_parts/faq-code-and-bugs.md-->

### Mein AuthKey wurde kompromittiert. Was soll ich tun?

Wenn du glaubst, dass einer deiner AuthKeys kompromittiert wurde, erstelle ein **Account Support**-Ticket auf [Discord](https://discord.gg/beammp).
