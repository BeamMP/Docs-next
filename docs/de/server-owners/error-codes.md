---
description: "Was die Fehlercodes im Fenster des BeamMP-Servers bedeuten, etwa 10048 und 10060, und was du jeweils dagegen tun kannst."
---
# Server-Fehlercodes

Diese Seite listet die Fehlercodes auf, die der Server anzeigen kann, und was du jeweils tun kannst.


| Code  | Beschreibung                               | Mögliche Lösung                                                                                                       |
|-------|--------------------------------------------|-----------------------------------------------------------------------------------------------------------------------|
| 10022 | Es gibt ein Problem beim Binden an den Port | Prüfe, ob der Port des Servers bereits von einem anderen Dienst verwendet wird. Falls ja, nimm einen anderen.        |
| 10048 | Adresse bereits in Verwendung              | Ein anderer BeamMP-Server oder ein anderes Programm läuft auf diesem Port. Nimm einen anderen.                        |
| 10051 | Netzwerk nicht erreichbar                  | Fehlerhafte Portweiterleitung oder ähnliche Probleme. Prüfe, ob alles richtig eingerichtet ist.                       |
| 10052 | Netzwerkverbindung zurückgesetzt           | Tritt auf, wenn das Netzwerk die Verbindung verliert, während eine Verbindung aufgebaut wird. Versuche den Verbindungsaufbau erneut. |
| 10053 | Verbindung abgebrochen                     | Verursacht durch eine Zeitüberschreitung oder einen Netzwerkfehler. Versuche den Verbindungsaufbau erneut.            |
| 10054 | Verbindung vom Peer zurückgesetzt          | Ein Client hat die Verbindung zu deinem Server getrennt.                                                              |
| 10060 | Zeitüberschreitung der Verbindung          | Es gibt ein Problem mit deiner Portweiterleitung. Siehe die [Schritte zur Portweiterleitung](/de/server-owners/host-a-server#forward-the-port). |
| 10061 | Verbindung abgelehnt                       | Es gibt ein Problem mit deiner Portweiterleitung. Siehe die [Schritte zur Portweiterleitung](/de/server-owners/host-a-server#forward-the-port). |
| 10064 | Host ist außer Betrieb                     | Unwahrscheinlicher Fehler. Er bedeutet, dass der Host nicht läuft, weil er entweder heruntergefahren wurde oder die Ports geschlossen wurden. |
| 10065 | Host nicht erreichbar                      | Kein Internet oder fehlerhafte Portweiterleitung. Siehe die [Schritte zur Portweiterleitung](/de/server-owners/host-a-server#forward-the-port). |

Für einen Code, der nicht in dieser Liste steht, siehe die [Windows-Sockets-Fehlercodes](https://learn.microsoft.com/en-us/windows/win32/winsock/windows-sockets-error-codes-2), wenn du dich ein wenig mit Netzwerken und Sockets auskennst.
