---
description: "Cosa significano i codici di errore nella finestra del server BeamMP, come 10048 e 10060, e cosa fare in ciascun caso."
---
# Codici errore server

Questa pagina elenca i codici di errore che il server può mostrare e cosa fare in ciascun caso.


| Codice | Descrizione                                | Possibile soluzione                                                                                                   |
|-------|--------------------------------------------|-----------------------------------------------------------------------------------------------------------------------|
| 10022 | Problema nell'associazione alla porta | Controlla se la porta del server è già in uso da un altro servizio e, in tal caso, usane un'altra.                      |
| 10048 | Indirizzo già in uso                     | Un altro server BeamMP o un altro programma usa già quella porta: usane un'altra.                                            |
| 10051 | Rete non raggiungibile                        | Port forwarding errato o problemi simili: verifica che sia tutto configurato correttamente.                                        |
| 10052 | Reset della rete                              | Succede se la rete perde la connessione mentre se ne sta stabilendo una. Riprova a connetterti.                |
| 10053 | Connessione interrotta                         | Causata da un timeout o da un errore di rete: riprova a connetterti.                                                             |
| 10054 | Connessione reimpostata dal peer                   | Un client si è disconnesso dal tuo server.                                                                           |
| 10060 | Timeout della connessione                       | C'è un problema con il tuo port forwarding: consulta i [passaggi per il port forwarding](/it/server-owners/host-a-server#forward-the-port). |
| 10061 | Connessione rifiutata                         | C'è un problema con il tuo port forwarding: consulta i [passaggi per il port forwarding](/it/server-owners/host-a-server#forward-the-port). |
| 10064 | Host inattivo                                  | Errore improbabile: significa che l'host è inattivo perché è spento oppure le porte sono state chiuse.                 |
| 10065 | Host non raggiungibile                         | Nessuna connessione a Internet o port forwarding errato: consulta i [passaggi per il port forwarding](/it/server-owners/host-a-server#forward-the-port).          |

Per un codice che non è in questo elenco, consulta i [codici di errore di Windows Sockets](https://learn.microsoft.com/en-us/windows/win32/winsock/windows-sockets-error-codes-2), se hai un po' di dimestichezza con il funzionamento di reti e socket.

