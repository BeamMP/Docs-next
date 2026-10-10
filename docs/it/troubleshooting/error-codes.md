---
description: "Cosa significano i codici di errore e i messaggi nella finestra del Launcher di BeamMP, come 10060, 10048 o Failed to find the game, e come risolvere ciascuno."
---
# Codici di errore

Questa pagina elenca i codici di errore e i messaggi che il Launcher può mostrare e cosa fare in ciascun caso. I messaggi sono quelli del Launcher v2.8.1. Per gli errori nella finestra di un server, consulta i [codici di errore del server](/it/server-owners/error-codes).

Il Launcher scrive inoltre tutto ciò che mostra in `Launcher.log`, nella cartella che contiene il Launcher. Il file parte vuoto a ogni avvio del Launcher, quindi contiene solo l'ultima esecuzione. Se il Launcher si chiude subito, leggi quel file.

## Codici di rete

Il numero dopo `error:` o `Error code:` è un codice socket di Windows. Su Linux è invece il numero di errore del sistema.

| Windows (Linux) | Descrizione | Possibile soluzione |
|---|---|---|
| 10048 (98) | `bind failed with error`: qualcos'altro sta già usando la porta del Launcher o quella successiva. Le porte predefinite sono `4444` e `4445` | Esegui un solo Launcher alla volta e riavvia il PC. Se un altro programma usa le porte, [cambia la porta del Launcher](/it/troubleshooting/launcher-port). Su Linux succede anche quando entri in un secondo server: chiudi il gioco e il Launcher, poi avviali di nuovo |
| 10060, 10061 (110, 111) | `Client: connect failed! Error code`: nessun server ha risposto all'indirizzo IP e alla porta indicati | Se sei il proprietario del server, controlla il reindirizzamento delle porte e le regole del firewall descritti in [Ospitare un server](/it/server-owners/host-a-server). Se non lo sei, scegli un altro server oppure contatta il proprietario |
| 10054 (104) | La connessione è stata reimpostata dall'altra parte | Il server a cui eri connesso è andato offline o si è riavviato. Riprova più tardi |
| 10038 | `(Game) send failed with error`: il Launcher ha provato a inviare dati al gioco dopo che il gioco si era disconnesso. Lo mostra il Launcher v2.8.0 | Aggiorna all'ultima versione del Launcher |
| `DNS lookup failed! on` seguito da un nome | Il Launcher non è riuscito a trovare l'indirizzo del nome del server che hai digitato | Controlla il nome. Usa invece l'indirizzo IP del server |

## Avvio del gioco

| Messaggio | Descrizione | Possibile soluzione |
|---|---|---|
| `Failed to find the game please launch it. Report this if the issue persists code 3` | Windows. `%LocalAppData%\BeamNG\BeamNG.Drive.ini` esiste, ma il Launcher non riesce a leggerlo | Avvia BeamNG.drive una volta, così scrive di nuovo il file |
| `... code 4` | Windows. `installPath` in `BeamNG.Drive.ini` punta a una cartella che non esiste | Avvia BeamNG.drive una volta dalla sua cartella attuale, oppure correggi `installPath` nel file |
| `... code 5` | Windows. `BeamNG.Drive.ini` non ha `installPath` | Avvia BeamNG.drive una volta |
| `... code 6` | Windows. Non c'è nessun `BeamNG.Drive.ini` e la chiave di registro `HKEY_CURRENT_USER\Software\BeamNG\BeamNG.drive` non ha il valore `rootpath` | Avvia BeamNG.drive una volta |
| `... code 7` | Windows. Non c'è nessun `BeamNG.Drive.ini` e la chiave di registro `HKEY_CURRENT_USER\Software\BeamNG\BeamNG.drive` non esiste | Avvia BeamNG.drive una volta |
| `Unsupported Steam installation.` | Linux. Nessuna delle cartelle di Steam che il Launcher conosce contiene una cartella `steamapps` | Vedi [Prima di iniziare](/it/get-started/install-beammp#before-you-start) per le cartelle. Crea un link dalla tua a una di esse |
| `libraryfolders.vdf is missing.` | Linux. La cartella di Steam non ha il file `libraryfolders.vdf` | Avvia Steam una volta, poi riprova |
| `The game directory was not found.` | Linux. BeamNG.drive non si trova in nessuna libreria di Steam elencata in `libraryfolders.vdf` | Installa BeamNG.drive tramite Steam |
| `Failed to Launch the game! launcher closing soon` | Il Launcher non è riuscito ad avviare `BeamNG.drive.exe` (Windows) o `BinLinux/BeamNG.drive.x64` (Linux) nella cartella del gioco. Su Windows seguono il codice di errore e il testo di Windows | Verifica i file del gioco in Steam e avvia il gioco una volta prima di avviare il Launcher |
| `Game Closed! launcher closing soon` | Il gioco è terminato. Il Launcher si chiude 5 secondi dopo | Normale quando chiudi il gioco. Se il gioco si è chiuso da solo, avvia di nuovo il Launcher |
| `We were unable to clean the multiplayer mods folder! Is the game still running or do you have something open in that folder?` | All'avvio il Launcher svuota la cartella `mods/multiplayer` nella cartella utente del gioco e non ci è riuscito | Chiudi il gioco e qualsiasi programma che usa quella cartella, poi avvia di nuovo il Launcher |

## I file del Launcher

| Messaggio | Descrizione | Possibile soluzione |
|---|---|---|
| `logger file init failed!` | Il Launcher non riesce a creare `Launcher.log` nella sua cartella | Sposta il Launcher in una cartella in cui puoi scrivere |
| `Config failed to parse make sure it's valid JSON!` | `Launcher.cfg` non è un JSON valido. Il Launcher si chiude | Correggi il file oppure eliminalo. Il Launcher ne crea uno nuovo con le impostazioni predefinite |
| `Failed to open Launcher.cfg!`, `Failed to write config on disk!` | Il Launcher non riesce a leggere o creare `Launcher.cfg` nella cartella da cui viene eseguito | Eseguilo da una cartella in cui puoi scrivere |
| `Failed to create caching directory` | Il Launcher non riesce a creare la cartella della cache delle mod, che è `Resources` a meno che tu non imposti `CachingDirectory` in `Launcher.cfg` | Imposta `CachingDirectory` su una cartella in cui puoi scrivere |
| `Exception in main()` | Un errore fatale. Il Launcher si chiude dopo 5 secondi | Leggi il testo che segue e chiedi sul [forum](https://forum.beammp.com) o sul [server Discord](https://discord.gg/beammp) |

## Aggiornamenti e server BeamMP

| Messaggio | Descrizione | Possibile soluzione |
|---|---|---|
| `Failed to download the launcher update! Please try manually updating it` | Windows. Il Launcher non è riuscito a scaricare il proprio aggiornamento | Vedi [Problemi aggiornamento Launcher](/it/troubleshooting/launcher-update) |
| `The authenticity of the updated launcher could not be verified, it was corrupted or tampered with.` | Windows. L'aggiornamento scaricato non ha una firma valida, quindi il Launcher l'ha eliminato | Scarica il Launcher dalla [pagina delle release su GitHub](https://github.com/BeamMP/BeamMP-Launcher/releases/latest), come in [Problemi aggiornamento Launcher](/it/troubleshooting/launcher-update) |
| `Auto update is NOT implemented for the Linux version.` | Linux. Esiste un Launcher più recente | Ricompila il Launcher: vedi [Aggiorna il Launcher su Linux](/it/get-started/install-beammp#update-the-launcher-on-linux) |
| `GET to ... failed` oppure `POST to ... failed`, poi `Curl error` | Il Launcher non è riuscito a raggiungere un server BeamMP. Il testo che segue indica il motivo, come un timeout o un errore di certificato | Controlla la tua connessione a Internet e le regole del firewall. Se da parte tua non ci sono problemi, consulta il [canale BeamMP updates](<https://discord.com/channels/601558901657305098/697596153943949352>) sul nostro Discord |
| `Invalid hash from backend, skipping update check.` | Il backend di BeamMP non ha dato una risposta valida. Il Launcher salta il controllo e prosegue | Controlla la tua connessione a Internet e le regole del firewall |
| `Failed to communicate with the auth system!` | Il server di accesso non ha risposto | Controlla la tua connessione a Internet e le regole del firewall, poi riprova |
| `Invalid answer from authentication servers, please try again later!` | Il server di accesso ha dato una risposta che il Launcher non riesce a leggere | Riprova più tardi |

## Mod

| Messaggio | Descrizione | Possibile soluzione |
|---|---|---|
| `Mod '...' is protected and therefore must be placed in the Resources/Caching folder manually here:` seguito da un percorso | Il server usa una mod protetta, che il Launcher non scarica | Procurati il file dal suo creatore e mettilo nella cartella indicata dal messaggio, mantenendo il nome del file |
| `Server cannot find` seguito da un nome di file | Il server non ha il file della mod che ha elencato | Avvisa il proprietario del server |
| `Failed to write or download the entire file ... (hash mismatch)` | Il file della mod non è stato scaricato correttamente | Entra di nuovo. Il Launcher ricontrolla il file e lo scarica di nuovo |
| `Failed copy to the mods folder!` | Il Launcher non è riuscito a copiare una mod nella cartella `mods/multiplayer` del gioco | Chiudi il gioco e qualsiasi programma che usa quella cartella, poi entra di nuovo |
