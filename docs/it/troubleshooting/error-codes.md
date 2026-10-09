---
description: "Cosa significano i codici di errore e i messaggi nella finestra del Launcher di BeamMP, come 10060 o Launcher Update failed, e come risolvere ciascuno."
---
# Codici di errore

Questa pagina elenca i codici di errore e i messaggi che il Launcher può mostrare e cosa fare in ciascun caso. Per gli errori nella finestra di un server, consulta i [codici di errore del server](/it/server-owners/error-codes).


| Codice | Descrizione | Possibile soluzione |
|---|---|---|
| 10048 | Qualcos'altro sta già usando la porta del Launcher | Assicurati di avere in esecuzione UNA SOLA istanza di BeamMP-Launcher alla volta. Prova a riavviare il PC. |
| 10038 / 10060 / 10061 | Nessun server ha risposto all'IP e / o alla porta indicati | Se sei il proprietario del server, controlla il reindirizzamento delle porte e / o le regole del firewall descritti in [Ospitare un server](/it/server-owners/host-a-server). Se non sei il proprietario del server, scegli un altro server oppure contatta il proprietario, se lo conosci. |
| 10054 | Connessione reimpostata dal peer | Il server a cui ti stai connettendo è andato offline. |
| Failed to find the game please launch it. Report this if the issue persists code 3. | Il Launcher non è riuscito a trovare le informazioni del gioco (cartella del gioco, cartella del profilo, versione ecc.) nella voce del registro di sistema | Avvia il gioco almeno una volta, così i valori nel registro vengono creati. |
| Failed to find the game please launch it. Report this if the issue persists code 4. | Il Launcher non è riuscito a leggere le informazioni del gioco (cartella del gioco, cartella del profilo, versione ecc.) nella voce del registro di sistema | È molto probabile che questo errore compaia a chi usa **copie piratate** del gioco. Se hai acquistato il gioco, avvialo almeno una volta, così i valori nel registro vengono creati. |
| Failed to Launch the game! launcher closing soon | Il Launcher non è riuscito a trovare l'eseguibile del gioco | Avvia il gioco almeno una volta prima di eseguire di nuovo il Launcher. |
| Game Closed! launcher closing soon | Il gioco è stato chiuso | Questo messaggio compare quando il gioco viene chiuso o quando non è riuscito ad avviarsi. |
| Launcher Update failed! | Il Launcher non è riuscito a scaricare una nuova versione | Controlla la tua connessione a Internet e le regole del firewall / antivirus, in modo che il Launcher non venga bloccato. |
| Logger file init failed | Il Launcher non ha il permesso di creare file | Esegui il Launcher come amministratore. |
| Please close the game and try again | Il gioco è già aperto e il Launcher non può svuotare la cartella `multiplayer/mods` | Chiudi il gioco e riprova. |
| Please launch the game at least once | Il Launcher ha tentato di modificare la cartella del gioco, ma non ci è riuscito | Avvia il gioco almeno una volta prima di eseguire di nuovo il Launcher. |
| Primary Servers Offline! Sorry for the inconvenience! | Il Launcher non è riuscito a controllare la presenza di un aggiornamento | Controlla la tua connessione a Internet e le regole del firewall. Se da parte tua non ci sono problemi, consulta il [canale BeamMP updates](<https://discord.com/channels/601558901657305098/697596153943949352>) sul nostro Discord. |
| Sorry Backend System Outage! Don't worry it will back on soon! | Il backend di BeamMP non ha risposto | Controlla la tua connessione a Internet e le regole del firewall. Se da parte tua non ci sono problemi, consulta il [canale BeamMP updates](<https://discord.com/channels/601558901657305098/697596153943949352>) sul nostro Discord. |
| Stuck on updating | Il Launcher è bloccato sull'aggiornamento e non passa al passaggio successivo | Esegui il Launcher come amministratore e controlla le regole del tuo antivirus, in modo che il Launcher non venga bloccato. |

Se il Launcher si chiude subito, controlla il file `Launcher.log` nella cartella in cui hai installato BeamMP.
