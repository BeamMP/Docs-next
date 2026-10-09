---
description: "Verbindungsprobleme mit BeamMP beheben: die IP-Adresse deines Servers finden, mit CheckBeamMP testen, ob dein Port offen ist, und prüfen, ob du hinter CGNAT sitzt."
---
# Verbindungs-/Netzwerkprobleme

Nutze diese Seite, wenn du oder deine Spieler sich nicht mit einem BeamMP-Server verbinden können.

## Die IP-Adresse deines Servers finden

### Ein Server bei einem Hosting-Anbieter

Die IP-Adresse wird in der Server-Verwaltungsoberfläche des Hosting-Anbieters angezeigt. Du findest die IP-Adresse deiner Server auch auf der Website [Keymaster](https://keymaster.beammp.com/login).

### Ein Server zu Hause

Öffne [whatsmyip.org](https://whatsmyip.org) in einem Browser. Dort siehst du die öffentliche IPv4-Adresse, die das Internet von dir sieht.

`127.0.0.1` ist die Localhost-Adresse. Nur du kannst sie verwenden, und nur, wenn der Server auf demselben Computer wie das Spiel läuft.

## Testen, ob dein Port offen ist

Wenn du bei einem zu Hause gehosteten Server weiterhin Verbindungsprobleme hast, prüfe deine [Portweiterleitung](/de/server-owners/port-forwarding) und teste sie dann mit CheckBeamMP, während der Server läuft:

<form action="https://check.beammp.com/api/v2/beammp" method="get" target="_blank">
  <label for="ip">IP-Adresse:</label>
  <input type="text" id="ip" name="ip"><br>
  <label for="port">Port:</label>
  <input type="text" id="port" name="port"><br>
  <input type="submit" value="CheckBeamMP">
</form>

## Auf CGNAT prüfen

Bei manchen Internetanbietern ist es schwierig, Ports weiterzuleiten. [Prüfe auf CGNAT](/de/server-owners/cgnat), um herauszufinden, ob du zu Hause einen Server hosten kannst.

## Weitere Verbindungsprobleme

- Der Launcher zeigt die Fehlercodes 10060 oder 10061: siehe [Fehlercodes](/de/troubleshooting/error-codes).
- Der Launcher verbindet sich nicht mit dem Spiel: siehe [Ändern des Launcher-Ports](/de/troubleshooting/launcher-port).
- Eine Firewall oder ein Virenschutz blockiert möglicherweise BeamMP: siehe [Defender-/Firewall-Ausnahmen](/de/troubleshooting/defender-exclusions).
