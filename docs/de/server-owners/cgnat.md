---
description: "Finde heraus, ob dein Internetanschluss hinter CGNAT liegt, was Spieler am Beitritt zu einem zu Hause gehosteten BeamMP-Server hindert, auch wenn Ports weitergeleitet sind."
---
# Auf CGNAT prüfen

Deine Firewall-Ausnahmen und Portweiterleitungsregeln sind richtig eingerichtet, und trotzdem kann niemand deinem zu Hause gehosteten Server beitreten? Dann liegst du möglicherweise hinter einem CGNAT.

Wenn du einen Hosting-Dienst nutzt und Verbindungsprobleme hast, wende dich an ihn. Wenn du einen VPS möchtest oder nicht zu Hause hosten kannst, sieh dir die [Hosting-Partner](/de/server-owners/host-a-server#partnered-hosting-services) an.

## Was ist CGNAT?

Carrier-grade NAT (CGNAT) ist eine Technik, die manche Internetanbieter einsetzen und die es schwierig macht, Ports zu dir nach Hause weiterzuleiten. Eine ausführliche Erklärung, was es ist und warum es beim Hosting zu Hause ein Problem darstellt, findest du unter [Carrier-grade NAT auf Wikipedia](https://en.wikipedia.org/wiki/Carrier-grade_NAT).

## Auf CGNAT prüfen

### Methode 1: Die Route verfolgen

1. Öffne die Eingabeaufforderung und führe aus:
   ```text
   tracert -4 beammp.com
   ```
   Es wird eine Reihe von Netzwerk-Hops aufgelistet. Warte, bis der Vorgang abgeschlossen ist. Das kann bis zu 30 Hops dauern.
2. Der erste Hop ist dein Router, Modem oder Gateway und unterscheidet sich von Gerät zu Gerät. Sieh dir die ersten IP-Adressen danach an.
3. Wenn nach dem ersten Hop mehrere Adressen zwischen `100.64.x.x` und `100.127.x.x` oder Adressen, die mit `10.` beginnen, erscheinen, liegst du sehr wahrscheinlich hinter einem CGNAT.

Die offiziellen Bereiche für lokale Netzwerke sind `10.0.0.x`, `192.168.x.x` und `172.16.x.x`.

### Methode 2: IP-Adressen vergleichen

Suche die WAN-IP-Adresse in der Oberfläche deines Routers und vergleiche sie mit der Adresse, die [whatsmyip.org](https://whatsmyip.org) anzeigt. Wenn sie **nicht** gleich sind, liegst du hinter einem CGNAT.

## Wenn du hinter einem CGNAT liegst

Ruf deinen Internetanbieter (ISP) an und bitte um Hilfe. Je nach Anbieter bieten sie möglicherweise keine dedizierten dynamischen IP-Adressen an. Eine statische IP ist nicht nötig.

::: warning
Internetanbieter bieten eine dedizierte IP-Adresse eventuell nur als **kostenpflichtige Option** an. Vergleiche den Preis mit unseren Hosting-Partnern: Sie könnten günstiger sein.
:::

Dies ist ein Beispiel für ein Netzwerk, das nicht hinter einem CGNAT liegt:

![Ein Netzwerkdiagramm einer Verbindung, die nicht hinter einem CGNAT liegt](https://github.com/user-attachments/assets/fee21a50-cbb0-4322-9c26-d9f04f88ae37)
