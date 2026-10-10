---
description: "Cosa vedi e puoi fare in BeamMP: elenco dei server, barra della sessione, elenco dei giocatori, nametag, chat, veicoli degli altri, coda degli eventi e veicoli instabili."
---
# Nozioni base di gameplay

Questa pagina spiega cosa cambia in BeamNG.drive quando giochi su un server BeamMP. Le impostazioni che stanno dietro a ogni funzione sono in [Impostazioni multigiocatore](/it/players/multiplayer-settings).

## L'elenco dei server

Dopo l'accesso, il menu BeamMP si apre sull'elenco dei server. I pulsanti a sinistra scelgono cosa mostra l'elenco:

- **Public Servers**: tutti i server. I server ufficiali sono elencati per primi.
- **Official Servers**, **Featured Servers** e **Partner Servers**: solo i server con quello stato.
- **Favorites**: i server che hai aggiunto con **Add Favorite**.
- **Recent**: gli ultimi 50 server a cui ti sei connesso, dal più recente. **Clear Recents** svuota l'elenco.
- **Direct Connect**: connettiti a un server tramite il suo indirizzo.

Per trovare un server:

- Scrivi nella casella di ricerca per cercare tra i nomi dei server.
- Clicca sull'intestazione di una colonna (**Location**, **Title**, **Map** o **Players**) per ordinare. Cliccala di nuovo per invertire l'ordine.
- Usa **Search Filters** per restringere l'elenco in base al numero di giocatori (**Empty only**, **Not empty**, **Not full**, oppure un minimo e un massimo con **Advanced Player Count**), a **Total Mod Size**, ai tag, alle versioni dei server, alle posizioni dei server e alle mappe. Con **Match all filters** attivato, un server deve avere tutti i tag che selezioni. **Reset Filters** li azzera.
- Clicca su **Refresh** per ricaricare l'elenco.

Clicca su un server per vederne i dettagli: il proprietario, la mappa, la descrizione, i tag, i giocatori presenti e le sue mod con il relativo **Total Filesize:**. **Connect** entra nel server. **Add Favorite** e **Remove Favorite** modificano i tuoi preferiti.

In **Direct Connect**, inserisci **Server IP** e **Server Port**, oppure clicca su **Paste from Clipboard** per incollare un indirizzo nella forma `ip:porta`. Se li lasci vuoti, BeamMP usa `127.0.0.1` e la porta `30814`. **Connect** entra nel server e **Save as Favorite** lo aggiunge ai tuoi preferiti.

Mentre ti connetti, **Connecting to server…** mostra l'avanzamento, compreso ogni mod che viene scaricata. Clicca su **Cancel** per interrompere. Se il server ha delle mod, vedi prima l'avviso sulla sicurezza delle mod, descritto in [Sicurezza mod](/it/players/mod-safety#the-mod-security-warning).

## La barra della sessione

In una sessione, l'app HUD **BeamMP Session** in alto sullo schermo mostra il nome del server, il numero di **Players**, il tuo **Ping** in ms e un pulsante **Leave**. **Leave** ti disconnette e ti riporta al menu principale. Il pulsante **Events queued** compare quando ci sono modifiche in attesa di essere caricate, come descritto in [La coda degli eventi](#the-event-queue).

Anche il menu di pausa ha una scheda **BeamMP**. **Player List** mostra tutti i giocatori con il loro ping e i pulsanti per copiare un nome e aprire il profilo del giocatore. **Server Details** mostra le informazioni del server. L'indirizzo del server resta nascosto finché non clicchi su **Reveal**.

Se il server ti rimuove, un messaggio mostra il motivo, con **Return to menu** e **Continue offline**.

## L'elenco dei giocatori

L'app HUD **BeamMP Player List** mostra il nome e il ping di ogni giocatore. Resta nascosta finché non clicchi sul suo pulsante a freccia (**<** o **>**), e lo stesso pulsante la nasconde di nuovo. **↔** e **↕** spostano l'elenco di lato e in alto o in basso all'interno del suo riquadro. Se **Show the player ID's** è attivata, ha anche una colonna con l'ID di ogni giocatore. Un giocatore con modifiche in coda viene evidenziato quando **Highlight queued players** è attivata.

Un tag del ruolo segue il nome quando il giocatore ha un ruolo, ad esempio `[EA]`. I tag dei ruoli sono descritti in [Nametag](#nametags).

Cliccando su un nome si esegue l'azione scelta in **Playerlist left click action**. Quella predefinita è **Queue events**. Un clic destro su un nome apre un menu con queste azioni:

- **Copy name**
- **Delete all vehicles**: elimina i veicoli del giocatore nel tuo gioco.
- **Queue events**
- **Switch camera to**: osserva il giocatore in modalità spettatore.
- **Open profile**: apre il profilo del giocatore sul forum.
- **Queue deleted vehicles**: riporta i veicoli di quel giocatore che hai eliminato.

Le mod possono aggiungere a questo menu pulsanti propri.

## Nametag {#nametags}

Ogni giocatore ha un nametag sopra il proprio veicolo. Porta il tag del ruolo e, facoltativamente, la distanza e i nomi dei giocatori che stanno osservando il veicolo. Puoi nascondere i nametag, farli sfumare con la distanza e mostrare la distanza. L'azione **Player Nametags** li nasconde e li mostra tutti.

Il tag dipende dal ruolo dell'account BeamMP del giocatore:

| Tag | Tag breve |
|---|---|
| `[Early Access]` | `[EA]` |
| `[Contributor]` | `[CO]` |
| `[Content Creator]` | `[CC]` |
| `[Events Team]` | `[Events]` |
| `[Support]` | `[Staff]` |
| `[BeamMP Staff]` | `[Staff]` |
| `[Moderator]` | `[Mod]` |
| `[Admin]` | `[Adm]` |
| `[BeamMP Dev]` | `[Dev]` |
| `[BeamNG Developer]`, `[BeamNG Staff]`, `[BeamNG Affiliate]` | `[BNG]` |

I giocatori senza ruolo non hanno nessun tag. Un server può anche dare a un giocatore o a un veicolo un tag proprio.

## Chat

Per impostazione predefinita la chat si trova nell'app HUD **BeamMP Chat**. Scrivi nella casella e invia con **Send**. Un messaggio può avere fino a 500 caratteri. Premi `↑` nella casella per richiamare il tuo ultimo messaggio. I messaggi svaniscono dopo qualche secondo e ricompaiono quando muovi il mouse sulla chat. **↔** e **↕** spostano la chat.

Con **New chat menu** attivata, la chat si trova in una finestra separata che puoi trascinare fuori dal gioco. Per le sue impostazioni vedi [La finestra della chat](/it/players/multiplayer-settings#the-chat-window).

## I veicoli degli altri giocatori

- I veicoli degli altri giocatori compaiono nel tuo gioco e le modifiche alle loro parti vengono sincronizzate con te. Le modifiche alle tue parti vengono inviate automaticamente agli altri giocatori, circa 15 secondi dopo la tua ultima modifica, quando **Enable automatic part sync** è attivata.
- Passando da un veicolo all'altro si possono saltare i veicoli degli altri giocatori. Attiva **Disable switching to other players vehicles** per farlo. Gli unicycle degli altri giocatori vengono sempre saltati.
- Se passi dal tuo unicycle al veicolo di un altro giocatore, la camera va sulla vista del passeggero.
- Un veicolo che non è ancora comparso per te appare come una sfera colorata, chiamata blob. Vedi [Blob](/it/players/multiplayer-settings#blobs).
- Se un giocatore fa comparire un veicolo che usa una mod che non hai, BeamMP lo salta e mostra un messaggio. Il veicolo resta un blob.
- Con **Show Player names on license plates** attivata, la targa mostra il nome del giocatore a cui appartiene il veicolo.
- Per proteggere la tua creazione, attiva **Enable Config Cloning Protection**. Gli altri giocatori non possono più clonare né salvare il tuo veicolo. Vedono **Vehicle Clone Error** o **Vehicle Save Error**.

## La coda degli eventi {#the-event-queue}

Quando un altro giocatore fa comparire o modifica un veicolo, il tuo gioco può mettere la modifica in coda invece di caricarla subito, così un caricamento non interrompe la tua guida. Un messaggio ti dice che una modifica è in coda e nella barra della sessione compare il pulsante **Events queued**. Mostra il numero di comparse in attesa, poi il numero di modifiche in attesa, ad esempio `2|1`.

Le modifiche in coda vengono caricate quando:

- clicchi su **Events queued**.
- premi il tasto che hai assegnato a **Queue Events**.
- clicchi sul nome di un giocatore, oppure selezioni **Queue events** nel suo menu. Questo carica solo le modifiche di quel giocatore.

Vengono caricate anche automaticamente quando hai guidato piano abbastanza a lungo, e subito se non hai un veicolo. Vedi [le impostazioni della coda degli eventi](/it/players/multiplayer-settings#event-queue).

## Veicoli instabili

In una sessione le instabilità della fisica non mettono in pausa il gioco. BeamMP reimposta invece la fisica del veicolo instabile. Questo vale per qualsiasi veicolo della sessione, il tuo o quello di un altro giocatore.

Se lo stesso veicolo continua a diventare instabile, BeamMP lo disattiva per un momento e mostra un avviso, poi lo riattiva. Un veicolo che continua a diventare instabile dopo questo viene eliminato, e un messaggio lo segnala. Per riavere il veicolo di un altro giocatore, clicca con il tasto destro sul giocatore nell'elenco dei giocatori e seleziona **Queue deleted vehicles**.

## Azioni dei tasti

Nelle impostazioni dei controlli, la categoria **BeamMP** ha queste azioni. Assegnale ai tasti che preferisci:

| Azione | Cosa fa |
|---|---|
| **Bring to Front** | Mostra di nuovo la finestra della chat dopo che è sfumata |
| **Player Nametags** | Mostra o nasconde tutti i nametag dei giocatori |
| **Queue Events** | Carica tutte le modifiche in coda |
| **Toggle Chat** | Mostra o nasconde la finestra della chat |

## Server con mod

Quando ti connetti a un server che ha delle mod, BeamMP mostra prima un avviso sulla sicurezza delle mod. Leggi [Sicurezza mod](/it/players/mod-safety) prima di accettarlo.
