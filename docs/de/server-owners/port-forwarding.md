---
description: "Leite den BeamMP-Port auf deinem Heimrouter Schritt für Schritt weiter: statische IP festlegen, im Router anmelden, die Regel erstellen und mit CheckBeamMP testen."
---
# Portweiterleitung

::: danger HAFTUNGSAUSSCHLUSS:
**Portweiterleitung ist ein Risiko**.

Mit der Portweiterleitung erklärst du dich mit den Risiken einverstanden, Ports in deinem Heimnetzwerk für die Öffentlichkeit zu öffnen, und verzichtest daher auf das Recht, BeamMP für **jegliche** Schäden haftbar zu machen, die dir oder deinem Haushalt entstehen könnten.

Wir übernehmen keine Verantwortung für Inhalte auf extern verlinkten Diensten oder Websites.

<u>**Wenn du diese Anleitung nicht verstehst, nutze bitte einen unserer Partner.**</u>
:::

::: warning
Stelle bitte sicher, dass dein Router kein reines 4G/5G-Gerät ist. Wenn es ein Hybridgerät ist, wähle später in Abschnitt 3 dieser Anleitung unbedingt den Adapter, der per Kabel verbunden ist!
:::

## Was du tun wirst

Das Erstellen einer Portweiterleitungsregel umfasst einige detaillierte Netzwerkbegriffe. Halte dich bereit, dir beim Durchgehen des Vorgangs ein paar Notizen zu machen.

Diese Anleitung besteht aus 4 großen Schritten.

## Kurzanleitung

1. **Weise deinem Computer oder deinen Geräten eine statische IP-Adresse zu**

   Das ist nötig, damit sich die IP deines Geräts nicht ändert und die Portweiterleitungsregel nicht ungültig wird.

   [Informationen zu deinem Router ansehen](https://portforward.com/router.htm#1)

2. **Melde dich bei deinem Router an**

   Das geht normalerweise, indem du die IP des „Standardgateways“ suchst, die du erhältst, wenn du `ipconfig` in einer Eingabeaufforderung ausführst, und sie in die Adressleiste eines Webbrowsers eingibst.

3. **Leite Ports an deinen Computer weiter**

   Suche den Bereich für die Portweiterleitung in der Weboberfläche deines Routers. Die meisten Router führen ihn unter Netzwerk, Erweitert oder LAN auf.

4. **Teste, ob dein Port richtig weitergeleitet wird**

   Nutze ein Tool wie CheckBeamMP, um zu testen, ob die Regel funktioniert.

   <form action="https://check.beammp.com/api/v2/beammp" method="get" target="_blank">
    <label for="ip">IP address:</label>
    <input type="text" id="ip" name="ip"><br>
    <label for="port">Port:</label>
    <input type="text" id="port" name="port"><br>
    <input type="submit" value="CheckBeamMP">
   </form>

## Ausführliche Anleitung

### Eine statische IP-Adresse zuweisen

#### Methode 1: Eine DHCP-Reservierung verwenden

Eine andere Möglichkeit, in deinem lokalen Netzwerk eine statische IP-Adresse festzulegen, ist die DHCP-Reservierung deines Routers. Nicht alle Router haben diese Funktion, daher ist das für dich vielleicht keine Option. Suche im Internet mit dem Modell deines Routers nach einer Anleitung. 

Wenn du das geschafft hast, springe zu [Bei deinem Router anmelden](#log-in-to-your-router)

#### Methode 2: Eine statische IP in Windows festlegen

##### Deine aktuelle IP-Adresse, das Gateway und die DNS-Server herausfinden

Bevor wir eine statische IP-Adresse festlegen können, müssen wir deine aktuellen Netzwerkeinstellungen kennen. 
Du wirst sie dir aufschreiben wollen, also halte ein Notizfenster bereit. 
Für diesen Schritt verwenden wir die Eingabeaufforderung.

Öffne eine Eingabeaufforderung. Die 3 wichtigsten Wege sind:

- Windows-Taste, dann „cmd“ eintippen und Enter drücken, sobald „Eingabeaufforderung“ markiert ist.


<figure class="image image_resized" style="width:62%;">

![Das Windows-Startmenü mit markierter Eingabeaufforderung](../../assets/content/win11-open-cmd.png)

</figure>

Führe in der Eingabeaufforderung den folgenden Befehl aus:
```
ipconfig /all
```
Du siehst eine Menge Daten.
Wenn du virtuelle oder mehrere Netzwerkadapter hast, siehst du noch mehr Daten. 
Viele virtuelle Adapter sind üblich, wenn du Hyper-V oder Docker installiert hast.

<figure class="image image_resized" style="width:62%;">

![Eingabeaufforderung mit der Ausgabe von ipconfig, bei der IPv4-Adresse, Subnetzmaske, Standardgateway und DNS-Server markiert sind](../../assets/content/win11-command-prompt-ipconfig-highlighted.png)

</figure>

Empfohlen wird eine kabelgebundene Netzwerkverbindung für den Computer, auf dem dieser Server läuft, es funktioniert aber auch per WLAN.
Du musst in dieser Liste einen Adapter mit aktiver Internetverbindung finden. Scrolle durch die Liste und suche einen, dem ein Standardgateway zugewiesen ist. 
Viele der virtuellen Adapter haben kein Standardgateway. 

Unten stehen Beispiele für lokale IPv4-Adressen, von denen mindestens einer der Adapter eine haben sollte.
Du musst dir die Informationen deines Adapters notieren.

- 192.168.x.x
- 10.x.x.x.
- 172.16.x.x - 172.31.x.x

Subnetzmaske (höchstwahrscheinlich 255.255.255.0)
</br>
Standardgateway (höchstwahrscheinlich 192.168.0.1 oder 192.168.1.1)

::: info Bitte beachte
BeamMP unterstützt derzeit kein IPv6 zum Hosten eines Servers. 
:::

##### Die Adaptereinstellungen ändern

Jetzt müssen wir die Einstellungen deines Netzwerkadapters ändern, damit dein PC die IP-Konfiguration behält, die er gerade hat. Am schnellsten gelangst du so zu den Einstellungen für dein Netzwerk:

- Tippe einmal auf die Windows-Taste
- Tippe „Netzwerkverbindungen“, bis „Netzwerkverbindungen anzeigen“ erscheint
- Drücke die Enter-Taste


<figure class="image image_resized" style="width:62%;">

![Das Windows-Startmenü mit Netzwerkverbindungen anzeigen](../../assets/content/win11-start-menu-view-network-connections.png)

</figure>

Du siehst jetzt eine Liste der Netzwerkverbindungen deines Computers. 
Wenn Hyper-V oder Docker installiert ist, können es viele sein. 
Suche nach Adaptern, die nicht „Hyper-V“ heißen.

<figure class="image image_resized" style="width:62%;">

![Das Fenster Netzwerkverbindungen mit dem Ethernet-Adapter](../../assets/content/win11-network-connections.png)

</figure>


Klicke mit der rechten Maustaste auf deinen Adapter und wähle Eigenschaften. Wenn `Internetprotokoll, Version 4 (TCP/IPv4)` nicht angehakt ist, ist das der falsche Adapter. Wähle einen anderen.

<figure class="image image_resized" style="width:62%;">

![Das Fenster mit den Ethernet-Eigenschaften, in dem der IPv4-Eintrag markiert ist](../../assets/content/win11-ethernet-properties-highlighted.png)

</figure>

Doppelklicke auf `Internetprotokoll, Version 4 (TCP/IPv4)`. Ändere `IP-Adresse automatisch beziehen` auf `Folgende IP-Adresse verwenden`.

Trage IP-Adresse, Subnetzmaske, Standardgateway und bevorzugten DNS-Server mit den Angaben aus der Eingabeaufforderung (ipconfig /all) ein.

Alternativ kannst du statt deiner DNS-Server die von CloudFlare oder Google verwenden:

- CloudFlare-DNS: 1.1.1.1, 1.0.0.1
- Google-DNS: 8.8.8.8, 8.8.4.4


<figure class="image image_resized" style="width:62%;">

![Das Fenster mit den IPv4-Eigenschaften, in dem IP-Adresse, Subnetzmaske, Standardgateway und DNS-Server eingetragen sind](../../assets/content/win11-network-settings-static-ip.png)

</figure>

Klicke auf OK, dann noch einmal auf OK, und dein Adapter ist jetzt von DHCP auf statisch umgestellt. Surfe im Web, um sicherzugehen, dass du noch eine Internetverbindung hast. Wenn nicht, stelle deine Einstellungen wieder auf „IP-Adresse automatisch beziehen“ zurück und probiere die nächste Methode.

### Bei deinem Router anmelden {#log-in-to-your-router}

Jetzt, da dein Gerät eine statische IP-Adresse hat, kannst du den Port für BeamMP weiterleiten!

Zuerst müssen wir uns bei deinem Router anmelden. Eine der Einstellungen, die du dir vorhin aufgeschrieben hast, ist dein Standardgateway. Das ist die IP-Adresse deines Routers.

Die meisten Router nutzen zur Verwaltung eine lokal gehostete Webseite. So rufst du das Menü und die Einstellungen deines Routers auf:

- Öffne einen Webbrowser. Firefox, Chrome oder Edge sollten gut funktionieren.
- Gib in die Adressleiste die IP-Adresse deines Standardgateways ein, etwa 192.168.0.1 oder 192.168.1.1, und drücke Enter

Du solltest jetzt den Anmeldebildschirm deines Routers sehen. Nicht alle Router verlangen eine Anmeldung, aber die meisten. Du musst Benutzernamen und Passwort deines Routers kennen. Wenn du dich noch nie angemeldet hast, sind Benutzername und Passwort höchstwahrscheinlich noch die Werkseinstellungen oder stehen in manchen Fällen auf einem Aufkleber auf deinem Router.

Einige der häufigsten Werkseinstellungen für Benutzername und Passwort sind hier aufgelistet:

| Benutzername | Passwort  |
| ------------ | --------- |
| admin        | admin     |
| admin        | password  |
| {leer}       | admin     |
| {leer}       | password  |

Probiere verschiedene Kombinationen aus admin, password und leeren Eingaben aus. *Wo „leer“ steht, versuche, das Feld leer zu lassen.* 

### Die Weiterleitungsregeln erstellen

#### Den Bereich für die Weiterleitung finden

Suche den Bereich für die Portweiterleitung in der Weboberfläche deines Routers. Klicke dich durch deinen Router, indem du auf die Tabs oder Links oben oder links auf jeder Seite klickst. Die meisten Router führen den Bereich für die Portweiterleitung unter Netzwerk, Erweitert oder LAN auf. Diese Stichwörter helfen dir bei der Suche:

- Port Forwarding
- Forwarding
- Port Range Forwarding
- Virtual Servers
- Apps & Gaming
- Advanced Setup/Settings
- NAT

#### Die Angaben eintragen

Sobald du den Bereich für die Portweiterleitung deines Routers gefunden hast, kannst du die nötigen Informationen eintragen.
Dein Router hat eine Stelle, an der du die weiterzuleitenden Ports und die Ziel-IP-Adresse eingibst, auf die diese Ports zeigen sollen. Wenn dein Router interne und externe Ports auflistet, wähle für beide dieselben. 

BeamMP benötigt sowohl den UDP- als auch den TCP-Port 30814 (es sei denn, du hast ihn in deiner [ServerConfig.toml](/de/server-owners/host-a-server#configure-the-server) geändert). 

::: info Hinweis
Der Standard-**Port** ist **30814**, du kannst aber jede andere Zahl größer als 1024 und kleiner als 65535 wählen. Wenn es nicht 30814 ist, musst du dir aber merken, was du gewählt hast. Du musst sowohl **TCP** als auch **UDP** weiterleiten.
</br>
Es wird empfohlen, beim Standardport zu bleiben, da er sehr unwahrscheinlich von einem anderen Dienst auf deinem PC verwendet wird.
</br>
Wenn du jedoch mehrere Server auf einem Rechner hostest, braucht jeder Server einen eigenen Port. Zum Beispiel Server 1: 30814, Server 2: 30815.
:::

Bei manchen Routern musst du 2 Regeln erstellen, eine für UDP und eine für TCP, während andere beides mit einer einzigen Regel erlauben!

Die meisten Router haben eine Schaltfläche zum Speichern, und manche Router brauchen einen Neustart, damit die Änderungen wirksam werden.

### Den Port testen

Es gibt mehrere Wege, die Verbindung zu testen.

Wir empfehlen unser Tool **CheckBeamMP**, da es auf BeamMP-spezifische Probleme und Protokolle prüft.

<form action="https://check.beammp.com/api/v2/beammp" method="get" target="_blank">
  <label for="ip">IP address:</label>
  <input type="text" id="ip" name="ip"><br>
  <label for="port">Port:</label>
  <input type="text" id="port" name="port"><br>
  <input type="submit" value="CheckBeamMP">
</form>

Dafür brauchst du deine öffentliche IPv4-Adresse, die du wiederum auf mehrere Arten herausfinden kannst. Der Hauptweg ist die Website [whatsmyip.org](https://whatsmyip.org/). Sie zeigt einfach deine öffentliche IP-Adresse an. Du suchst eine IP-Adresse im Format xxx.xxx.xxx.xxx

Rufe den folgenden Link auf und ersetze „IP“ durch deine tatsächliche IPv4-Adresse und „Port“ durch den Port deines Servers. Achte darauf, keine Leerzeichen zu lassen.
https://check.beammp.com/api/v2/beammp/ip/port

::: success status: ok
Wenn du die obige Ausgabe erhältst, kannst du jetzt deinem Server beitreten!
Es gibt 2 Wege beizutreten: entweder direkt mit den Angaben, die du in CheckBeamMP eingegeben hast, oder, wenn dein Server auf „öffentlich“ gestellt ist, über die Serverliste.
Da du einen Server vor Ort hostest, nutze 127.0.0.1 (localhost), wenn der Server auf demselben PC läuft, auf dem du spielst, oder die LAN-IPv4 des lokalen Rechners, auf dem der Server läuft.
:::

::: failure status: error
Wenn die Verbindung komplett fehlschlägt, nutzt dein Internetanbieter möglicherweise CGNAT (Carrier Grade Network Address Translation). Weitere Details findest du unter [Auf CGNAT prüfen](/de/server-owners/cgnat),
  oder eröffne ein Server-Support-Ticket auf unserem [Discord-Server](https://discord.gg/beammp) im Kanal `#support`, und eines unserer Teammitglieder kümmert sich um dein Ticket!
  Wenn nur TCP funktioniert und UDP fehlschlägt, prüfe die Firewall- und Portweiterleitungsregeln noch einmal.
:::
