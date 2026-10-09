---
description: "Risposte alle domande frequenti sui server BeamMP: configurazione, Linux, requisiti di sistema, giocatori che non riescono a entrare e segnalazione di bug o di una AuthKey compromessa."
---
# FAQ del server

Domande frequenti e problemi noti sulla gestione di un server BeamMP.

## Configurazione

### Come posso creare il mio server?

Trovi tutto ciò che ti serve in [Ospitare un server](/it/server-owners/host-a-server), oppure in [Configurazione del server su un VPS](/it/server-owners/setup-vps) se usi una società di hosting.

### Posso usare un server su Linux?

Sì. Offriamo i binari per molte distribuzioni Linux nella [pagina dell'ultima release](https://github.com/BeamMP/BeamMP-Server/releases/latest). Se non ce n'è uno per la tua distribuzione, puoi compilarlo dal codice sorgente su [GitHub](https://github.com/BeamMP/BeamMP-Server). Le [istruzioni di compilazione](https://github.com/BeamMP/BeamMP-Server#build-instructions) spiegano come fare.

### Quali sono i requisiti di sistema minimi?

| | Requisito |
|---|---|
| RAM | 50 MiB o più utilizzabili, escluso il sistema operativo |
| CPU | Più veloce di 1 GHz, preferibilmente multicore |
| OS | Windows o Linux (in teoria qualsiasi sistema POSIX) |
| GPU | Nessuna |
| Disco | 10 MiB più lo spazio per mod e plugin |
| Banda | 5–10 Mb/s in upload |

## I giocatori non riescono a entrare

### I giocatori esterni alla mia rete non riescono a entrare nel mio server ospitato da me

Se gli altri giocatori ricevono nel Launcher il codice di errore 10060, 10061 o 10038, controlla quanto segue. La guida completa è [Reindirizzamento delle porte](/it/server-owners/port-forwarding).

- Reindirizza la porta 30814, o la porta impostata in `ServerConfig.toml`, sia per TCP sia per UDP.
- Consenti a BeamMP di passare attraverso il Windows Firewall, sia per le connessioni in entrata sia per quelle in uscita. Disattivare il firewall di solito **non** funziona.
- Assicurati di non usare una VPN, perché può causare problemi.
- Assicurati che il server sia in esecuzione, senza errori né avvisi.

Mentre il server è in esecuzione, puoi verificare se la porta è reindirizzata con CheckBeamMP:

<form action="https://check.beammp.com/api/v2/beammp" method="get" target="_blank">
  <label for="ip">Indirizzo IP:</label>
  <input type="text" id="ip" name="ip"><br>
  <label for="port">Porta:</label>
  <input type="text" id="port" name="port"><br>
  <input type="submit" value="CheckBeamMP">
</form>

Alcuni provider Internet non forniscono un indirizzo IPv4 dedicato (CGNAT), quindi il port forwarding può non funzionare anche se il tuo router lo permette. Vedi [Verifica CGNAT](/it/server-owners/cgnat). Il port forwarding non è possibile su una connessione mobile (4G o 5G).

### Vedo il mio server nella lista, ma non riesco a entrarci io stesso

Se il server è in esecuzione sullo stesso computer del gioco, entra con **Direct Connect**, usando l'indirizzo IP `127.0.0.1` e la porta del tuo server.

Per entrare nel tuo server ospitato da te attraverso la lista dei server, il tuo router deve supportare il NAT loopback. Non molti router domestici lo fanno.

## Altre domande

<!--@include: ../_parts/faq-code-and-bugs.md-->

### La mia AuthKey è stata compromessa. Cosa devo fare?

Se pensi che una delle tue AuthKey sia compromessa, crea un ticket **Account Support** su [Discord](https://discord.gg/beammp).
