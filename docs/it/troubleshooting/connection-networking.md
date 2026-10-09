---
description: "Risolvi i problemi di connessione a BeamMP: trova l'indirizzo IP del tuo server, verifica con CheckBeamMP che la porta sia aperta e controlla se sei dietro un CGNAT."
---
# Problemi di connessione / rete

Usa questa pagina quando tu o i tuoi giocatori non riuscite a connettervi a un server BeamMP.

## Trova l'indirizzo IP del tuo server

### Un server presso un'azienda di hosting

L'indirizzo IP è riportato nell'interfaccia di gestione del server dell'azienda di hosting. Puoi trovare l'indirizzo IP dei tuoi server anche sul sito [Keymaster](https://keymaster.beammp.com/login).

### Un server a casa

Apri [whatsmyip.org](https://whatsmyip.org) in un browser. Mostra l'indirizzo IPv4 pubblico con cui sei visibile da Internet.

`127.0.0.1` è l'indirizzo localhost. Solo tu puoi usarlo, e solo se il server è in esecuzione sullo stesso computer del gioco.

## Verifica che la tua porta sia aperta

Se hai ancora problemi di connessione con un server ospitato a casa, controlla il [reindirizzamento delle porte](/it/server-owners/port-forwarding), poi provalo con CheckBeamMP mentre il server è in esecuzione:

<form action="https://check.beammp.com/api/v2/beammp" method="get" target="_blank">
  <label for="ip">Indirizzo IP:</label>
  <input type="text" id="ip" name="ip"><br>
  <label for="port">Porta:</label>
  <input type="text" id="port" name="port"><br>
  <input type="submit" value="CheckBeamMP">
</form>

## Verifica la presenza di CGNAT

Alcuni provider Internet rendono difficile reindirizzare le porte. [Verifica la presenza di CGNAT](/it/server-owners/cgnat) per scoprire se puoi ospitare un server a casa.

## Altri problemi di connessione

- Il Launcher mostra i codici di errore 10060 o 10061: consulta i [Codici di errore](/it/troubleshooting/error-codes).
- Il Launcher non si connette al gioco: consulta [Cambiare la porta del Launcher](/it/troubleshooting/launcher-port).
- Un firewall o un antivirus potrebbe bloccare BeamMP: consulta [Esclusioni Defender / Firewall](/it/troubleshooting/defender-exclusions).
