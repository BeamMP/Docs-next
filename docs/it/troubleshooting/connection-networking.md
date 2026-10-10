---
description: "Risolvi i problemi di connessione a BeamMP: trova l'indirizzo IP del tuo server, verifica con CheckBeamMP che la porta sia aperta e controlla se sei dietro un CGNAT."
---
# Problemi di connessione / rete

Usa questa pagina quando tu o i tuoi giocatori non riuscite a connettervi a un server BeamMP.

## Trova l'indirizzo IP del tuo server

### Un server presso un'azienda di hosting

L'indirizzo IP è riportato nell'interfaccia di gestione del server dell'azienda di hosting.

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

## Porte e indirizzi usati dal Launcher

Se usi un firewall restrittivo o un proxy, consenti al Launcher queste connessioni:

| Porta | Protocollo | Collega | Usata per |
|---|---|---|---|
| `4444` | TCP | Il gioco al Launcher, sul tuo computer | La lista dei server, l'accesso e le richieste di ingresso. Si imposta con `Port` in `Launcher.cfg` |
| `4445` (`Port` + 1) | TCP | Il gioco al Launcher, sul tuo computer | I dati di gioco mentre sei in un server |
| Una porta libera scelta all'avvio | TCP (HTTP) | Il gioco al Launcher, su `127.0.0.1` | Le richieste a `backend.beammp.com` e `forum.beammp.com` per i menu in gioco |
| La porta del server (`30814`, a meno che il proprietario l'abbia cambiata) | TCP e UDP | Il Launcher al server | Entrare, scaricare le mod e giocare |
| `443` | HTTPS | Il Launcher a `backend.beammp.com`, `auth.beammp.com` e `forum.beammp.com` | Gli aggiornamenti, la lista dei server e l'accesso |

Non devi reindirizzare `4444` e `4445`. Servono solo al gioco e al Launcher sullo stesso computer. La porta del server deve essere raggiungibile sia con TCP sia con UDP.

## Altri problemi di connessione

- Il Launcher mostra i codici di errore 10060 o 10061, oppure su Linux `Error code: 110` o `111`: consulta i [Codici di errore](/it/troubleshooting/error-codes).
- Il Launcher non si connette al gioco: consulta [Cambiare la porta del Launcher](/it/troubleshooting/launcher-port).
- Un firewall o un antivirus potrebbe bloccare BeamMP: consulta [Esclusioni Defender / Firewall](/it/troubleshooting/defender-exclusions).
