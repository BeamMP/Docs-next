---
description: "Riferimento sul server BeamMP: la cartella Resources, variabili d'ambiente, argomenti da riga di comando, comandi della console e limiti del backend."
---
# Manuale del server

Questa pagina è il riferimento su come si comporta il server BeamMP. Per configurarne uno, vedi [Ospitare un server](/it/server-owners/host-a-server). Per le impostazioni di `ServerConfig.toml`, vedi [Configurazione del server](/it/server-owners/configuration).

## Cosa influenza il server

Il server è influenzato dallo stato di questi parametri esterni:

- La cartella `Resources`
- L'ambiente (le variabili d'ambiente del processo)
- Gli argomenti da riga di comando
- Il file `ServerConfig.toml`
- La directory di lavoro

## Cartella Resources

All'avvio il server crea la cartella `Resources`, con le sottocartelle `Client` e `Server`.

- `Server` contiene cartelle, ciascuna con almeno un file `.lua`. Ogni cartella è un "plugin". Il server carica i plugin in ordine alfabetico, senza distinguere tra maiuscole e minuscole, e salta tutto ciò che si trova in `Server` e non è una cartella. I file `.lua` al livello principale di un plugin vengono ricaricati a caldo quando cambiano. Per scrivere plugin, vedi il [Riferimento scripting del server](/it/developers/beammp-scripting/server/latest).
- `Client` contiene file `.zip`, che i giocatori scaricano quando entrano. Il server li legge all'avvio e ignora con un avviso qualsiasi file che non sia un `.zip`. Per rilevare mod aggiunte, modificate o rimosse mentre il server è in esecuzione, usa il [comando della console](#console-commands) `reloadmods`.

Il server tiene inoltre in `Client` un file chiamato `mods.json`. Contiene l'hash SHA-256 di ogni mod e l'indicazione se la mod è protetta, così il server non calcola di nuovo l'hash di una mod che non è cambiata. Il server riscrive il file quando serve. Non modificarlo.

## Variabili d'ambiente

### Impostazioni generali {#general-settings}

Dalla release del server v3.2.0, il server accetta variabili d'ambiente che **sostituiscono** le impostazioni di `ServerConfig.toml`. Ogni impostazione ne ha una. I nomi delle impostazioni sono in PascalCase. La variabile è il nome in TUTTE_MAIUSCOLE, con un trattino basso all'inizio di ogni nuova parola e il prefisso `BEAMMP_`. Per esempio, `MaxPlayers` diventa `MAX_PLAYERS` e, con il prefisso, `BEAMMP_MAX_PLAYERS`. Esistono queste variabili ("Da" indica la prima release del server che legge ciascuna di esse):

| Variabile | Impostazione | Da |
|---|---|---|
| `BEAMMP_DEBUG` | `Debug` | v3.2.0 |
| `BEAMMP_PRIVATE` | `Private` | v3.2.0 |
| `BEAMMP_PORT` | `Port` | v3.2.0 |
| `BEAMMP_MAX_CARS` | `MaxCars` | v3.2.0 |
| `BEAMMP_MAX_PLAYERS` | `MaxPlayers` | v3.2.0 |
| `BEAMMP_MAP` | `Map` | v3.2.0 |
| `BEAMMP_NAME` | `Name` | v3.2.0 |
| `BEAMMP_DESCRIPTION` | `Description` | v3.2.0 |
| `BEAMMP_TAGS` | `Tags` | v3.2.0 |
| `BEAMMP_RESOURCE_FOLDER` | `ResourceFolder` | v3.2.0 |
| `BEAMMP_AUTH_KEY` | `AuthKey` | v3.2.0 |
| `BEAMMP_LOG_CHAT` | `LogChat` | v3.2.0 |
| `BEAMMP_ALLOW_GUESTS` | `AllowGuests` | v3.5.0 |
| `BEAMMP_INFORMATION_PACKET` | `InformationPacket` | v3.7.0 |
| `BEAMMP_IM_SCARED_OF_UPDATES` | `ImScaredOfUpdates` (la sezione `[Misc]`) | v3.8.2 |
| `BEAMMP_UPDATE_REMINDER_TIME` | `UpdateReminderTime` (la sezione `[Misc]`) | v3.8.2 |
| `BEAMMP_IP` | `IP` | v3.8.3 |

Per le impostazioni che sono stringhe o numeri, il valore è una stringa, per esempio `BEAMMP_NAME="Cool Server"`, `BEAMMP_NAME=Server1` o `BEAMMP_PORT=12345`.

Per le impostazioni vero o falso (attivo o disattivo), il valore `true` o `1` significa attivo. Qualsiasi altro valore significa disattivo.

Una variabile vuota o non impostata viene ignorata. Quando si avvia, il server riscrive in `ServerConfig.toml` i valori che finisce per usare, compresi questi, a meno che sia impostata `BEAMMP_PROVIDER_DISABLE_CONFIG`.

### Impostazioni del provider {#provider-settings}

Queste variabili permettono ai provider di hosting, e a chi gestisce molti server, di sostituire le impostazioni specifiche del provider.

#### `BEAMMP_PROVIDER_PORT_ENV` (da v3.3.0 a v3.4.1 e da v3.7.2)

Se impostata su una stringa non vuota, indica il nome di un'altra variabile da cui leggere la porta, al posto di `BEAMMP_PORT`. I server dalla v3.5.0 alla v3.7.1 non la leggono. Per esempio, Pterodactyl può esporre la porta come `SERVER_PORT`. Potresti impostare `BEAMMP_PORT=${SERVER_PORT}`, ma è più semplice impostare `BEAMMP_PROVIDER_PORT_ENV="SERVER_PORT"`: il server leggerà la sua porta dalla variabile `SERVER_PORT`.

#### `BEAMMP_PROVIDER_IP_ENV` (da v3.8.4)

Se impostata su una stringa non vuota, indica il nome di un'altra variabile da cui leggere l'indirizzo IP, al posto di `BEAMMP_IP`. Funziona come `BEAMMP_PROVIDER_PORT_ENV`.

#### `BEAMMP_PROVIDER_DISABLE_CONFIG` (da v3.3.0)

Se impostata su `1` o `true`, `ServerConfig.toml` **non viene generato** e, se esiste, **non viene letto**. Devi impostare `BEAMMP_AUTH_KEY` perché il server funzioni.

#### `BEAMMP_PROVIDER_UPDATE_MESSAGE` (da v3.2.2)

Se impostata su una stringa non vuota, sostituisce l'intero messaggio di aggiornamento, che per impostazione predefinita inizia con "NEW VERSION IS OUT! Please update to the new…".

Il tuo messaggio **deve** contenere `{}` in qualche punto. Il server lo sostituisce con il numero della nuova versione. Per esempio:

```sh
BEAMMP_PROVIDER_UPDATE_MESSAGE="NEW VERSION of the BeamMP-Server has been released: {}! Please follow the update guide here: https://example.com/update-guide"
```

Questo produce un messaggio di aggiornamento come:

```text
NEW VERSION of the BeamMP-Server has been released: v5.0.2! Please follow the update guide here: https://example.com/update-guide
```

Spiega chiaramente agli utenti che devono aggiornare e come farlo.

#### `BEAMMP_PROVIDER_DISABLE_MP_SET` (da v3.9.2)

Se impostata su `1` o `true`, i plugin Lua non possono modificare le impostazioni del server con `MP.Set`. Un plugin che ci prova riceve un errore che indica che la chiamata è stata bloccata dal provider del tuo server.

#### `BEAMMP_MAX_CONCURRENT_CONNECTIONS` (da v3.9.4)

Imposta il numero massimo di connessioni che il server accetta contemporaneamente da un singolo indirizzo IP. È un numero intero da 1 a 128 e il valore predefinito è 10. Un valore fuori intervallo, o che non è un numero, viene ignorato con un avviso. Il server accetta inoltre al massimo 128 connessioni contemporanee in totale, un limite che non puoi cambiare. Il comando `status` mostra entrambi i limiti.

## Argomenti da riga di comando

Avvia il server con `--help` per vederli: `./BeamMP-Server --help`. Gli argomenti sono:

| Argomento | Cosa fa |
|---|---|
| `--help` | Mostra l'aiuto ed esce |
| `--version` | Stampa la versione del server ed esce |
| `--port=1234` | Imposta la porta TCP e UDP su cui il server resta in ascolto. Ha la precedenza sull'ambiente e su `ServerConfig.toml` |
| `--config=/path/to/ServerConfig.toml` | Il percorso, assoluto o relativo, del file di configurazione del server, compreso il nome del file. Metti tra virgolette un percorso con spazi |
| `--working-directory=/path/to/folder` | Imposta la directory di lavoro del server. Tutti i percorsi, compreso quello in `--config`, sono relativi a essa |

Per esempio, `BeamMP-Server --config=../MyWestCoastServerConfig.toml` avvia il server con il file di configurazione che si trova una cartella più in alto.

## Comandi della console {#console-commands}

Digita questi comandi nella console del server. Premi `Tab` per completare un comando.

| Comando | Cosa fa |
|---|---|
| `help` | Mostra i comandi |
| `exit` | Spegne il server |
| `kick <name> [reason]` | Espelle un giocatore, con un motivo facoltativo. Il nome corrisponde all'inizio del nome di un giocatore, senza distinguere tra maiuscole e minuscole. Senza un motivo, il giocatore vede "Kicked by server console" |
| `list` | Elenca tutti i giocatori, con il loro ID e il numero di veicoli |
| `say <message>` | Invia il messaggio a tutti i giocatori in chat |
| `lua [state id]` | Passa alla console Lua, facoltativamente nello stato con quell'id. Vedi [Debug](/it/developers/beammp-scripting/server/latest#debugging) |
| `settings [command]` | Imposta o legge le impostazioni del server. Esegui `settings help` per saperne di più. Vedi [Comando settings](#settings-command) |
| `status` | Mostra come sta andando il server: giocatori, veicoli, uptime, stati Lua, timer e gestori di eventi, i limiti di connessione e lo stato di ogni parte del server |
| `clear` | Pulisce la finestra della console |
| `version` | Mostra la piattaforma, la versione del server e le versioni di Lua e OpenSSL |
| `protectmod <name> <value>` | Imposta se una mod è protetta. Il nome è il nome del file della mod, compreso `.zip`. Il valore è `true` o `false` |
| `reloadmods` | Ricarica tutte le mod dalla cartella `Resources/Client` |
| `nettest` | Chiede al servizio di verifica del server BeamMP se i giocatori possono raggiungere il tuo server sulla sua porta e stampa la risposta. `help` non lo elenca. Da v3.8.5 |

Un plugin può aggiungere comandi propri con l'evento `onConsoleInput`. Vedi [Comandi personalizzati](/it/developers/beammp-scripting/server/latest#custom-commands).

### Comando settings {#settings-command}

`settings` ha quattro sottocomandi:

- `settings list` elenca le impostazioni e i loro valori.
- `settings get <category> <setting>` stampa un valore, per esempio `settings get General MaxPlayers`.
- `settings set <category> <setting> <value>` modifica un valore, per esempio `settings set General MaxPlayers 12`. Metti tra virgolette un valore con spazi.
- `settings help` mostra questi sottocomandi.

Una modifica dura finché il server non si ferma. Non viene scritta in `ServerConfig.toml`. In `General` puoi modificare `Description`, `Tags`, `MaxPlayers`, `Name`, `Map`, `MaxCars`, `Debug`, `AllowGuests` e `InformationPacket`, mentre in `Misc` puoi modificare `ImScaredOfUpdates` e `UpdateReminderTime`. `Private`, `IP`, `Port`, `LogChat` e `ResourceFolder` possono essere letti ma non modificati. `AuthKey` non può essere né letta né modificata.

## ServerConfig.toml

Il server genera questo file al primo avvio. I commenti all'interno del file spiegano brevemente ogni impostazione e il server riscrive il file a ogni avvio. Vedi [Configurazione del server](/it/server-owners/configuration).

Se `AuthKey` è vuota, il server stampa un errore e si chiude dopo 10 secondi. Succede anche se il file contiene un errore, come una virgoletta mancante.

## Directory di lavoro

La directory di lavoro del server, e non la posizione dell'eseguibile del server, decide dove vengono generati `ServerConfig.toml`, i file di log e la cartella `Resources`.

## Limiti

Il backend di BeamMP applica questi limiti ai server:

- Name: 250 caratteri
- Description: 1000 caratteri
- Map: 100 caratteri
- Tags: 100 caratteri

Il server stesso applica questi limiti:

- Versione del Launcher: un giocatore il cui Launcher è precedente alla 2.7.0 viene rifiutato e vede un messaggio che indica la versione richiesta.
- Messaggi in chat: un messaggio più lungo di 500 byte, o vuoto, viene scartato.
- Connessioni: al massimo 10 contemporanee dallo stesso indirizzo IP per impostazione predefinita e 128 in totale. Vedi `BEAMMP_MAX_CONCURRENT_CONNECTIONS`.
