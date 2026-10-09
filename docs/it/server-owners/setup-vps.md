---
description: "Configura un server BeamMP su un VPS o nel pannello di gestione di una società di hosting: ottieni una AuthKey, compila i campi del pannello, aggiungi mod e fai entrare i giocatori."
---
# Configurazione del server su un VPS

Questa guida è per un server su un VPS, o presso una società di hosting, che dispone di un pannello di gestione. Per ospitare a casa, segui invece [Ospitare un server](/it/server-owners/host-a-server).

Ospitare su un VPS non richiede modifiche al firewall né al port forwarding sul tuo router.

## Prima di iniziare

I server sono una parte fondamentale di BeamMP: i giocatori si connettono tra loro attraverso il server. Puoi creare un server privato, al quale possono entrare solo le persone che inviti, oppure un server pubblico, che compare nella lista ufficiale dei server.

Leggi la [LICENSE](https://raw.githubusercontent.com/BeamMP/BeamMP-Server/master/LICENSE) del server prima di usarlo.

Se hai problemi, chiedi sul [forum](https://forum.beammp.com) o nel canale `#support` del [server Discord](https://discord.gg/beammp). [Configurazione del server](/it/server-owners/configuration) approfondisce le impostazioni del server.

Se non hai ancora scelto un VPS, dai un'occhiata ai nostri servizi di hosting partner. Sono a pagamento.

::: details Servizi di hosting partner
<!--@include: ./_parts/partners.md-->
:::

## Preparare il VPS

Assicurati che la pagina di gestione del tuo server sia raggiungibile. Quando hai verificato che il server è pronto per l'uso, continua.

<!--@include: ./_parts/authkey.md-->

## Compilare i campi del pannello

Il pannello di hosting ha alcuni campi da compilare. I campi contrassegnati con `*` sono obbligatori.

1. Incolla la tua AuthKey nel campo **Authkey**.
2. Dai al tuo server un nome e una descrizione. Puoi formattarli con colori e altro: vedi [Personalizza l'aspetto del nome del tuo server](/it/server-owners/configuration#customize-the-look-of-your-server-name).

::: warning
Non puoi modificare `ServerConfig.toml` direttamente nel file manager. È voluto, così la società di hosting può far rispettare dei limiti, come il numero di giocatori.
:::

### Verifica che si avvii

Avvia il server e cerca eventuali messaggi `[ERROR]` o `[WARN]`. Il server ora dovrebbe restare attivo. Poi aggiungi le mod, se le vuoi, e scopri come entrare.

## Aggiungere mod

Puoi aggiungere le mod con il file manager del pannello. Le mod di veicoli e quelle di mappe si installano in modo diverso, ma vanno entrambe nella cartella `Resources/Client` del tuo server. Metti il file `.zip` della mod in quella cartella.

::: warning
Le mod possono essere, o diventare, incompatibili con BeamNG, BeamMP o altre mod. Se hai problemi, inizia a rimuovere le mod. Se, dopo aver aggiunto delle mod, ricevi un messaggio "done" o "start" quando provi a entrare, probabilmente hai aggiunto una mod incompatibile o difettosa. Se hai delle mod client installate, vedi [Sicurezza mod](/it/players/mod-safety) per rimuoverle dal tuo gioco.
:::

### Mod di veicoli e altre mod

Metti il file `.zip` della mod in `Resources/Client`. Chiunque entri la scarica automaticamente.

### Mappe

Le mappe vanilla funzionano senza installare nulla. Imposta il campo **Map** nel pannello di gestione su uno dei [percorsi delle mappe vanilla](/it/server-owners/configuration#all-vanilla-maps-names).

Per una mappa moddata:

1. Metti il file `.zip` della mappa in `Resources/Client`.
2. Apri il file `.zip` senza estrarlo, poi apri la sua cartella `levels`. Contiene una cartella con il nome della mappa, per esempio `myawesomedriftmap2021`. Annota il nome esattamente come è scritto.
3. Nel pannello di gestione, il campo **Map** ha la forma `/levels/MAPNAME/info.json`, dove `MAPNAME` è probabilmente qualcosa come `gridmap_v2`. Sostituisci `MAPNAME` con il nome della cartella del punto 2. Deve terminare con `/info.json`. Per questo esempio: `/levels/myawesomedriftmap2021/info.json`.

Quando qualcuno entra, la mappa viene scaricata automaticamente e funziona.

Se non funziona, installa la mappa in BeamNG.drive in singleplayer ed entraci. Apri la console con il tasto `~` (tilde). Su una tastiera non americana, trova l'azione **Toggle System Console** in **Options** > **Controls** > **Bindings**, nella sezione **General Debug**. Esegui `print(getMissionFilename())`. Mostra il nome da usare.

## Fare entrare i giocatori

I giocatori possono usare la connessione diretta all'indirizzo IP pubblico e alla porta del server, che trovi entrambi nel pannello di gestione. Puoi trovare l'indirizzo IP anche sul sito [Keymaster](https://keymaster.beammp.com/).

Per un server pubblico, i giocatori possono invece aprire la lista dei server, digitare il nome del server e cliccare su **Connect**. Il nome è quello che hai impostato. Se non lo trovano, di' loro di disattivare i filtri di ricerca e di impostare la mappa su **Any**.

Se tu o un amico ricevete "Connection Failed!", guarda nella finestra del Launcher i codici come 10060, 10061 o 10030. Significano che il server non è raggiungibile, oppure che l'indirizzo IP e la porta inseriti nel client sono sbagliati. IPv6 non è ancora supportato.

## Hai ancora problemi?

Apri una discussione sul [forum](https://forum.beammp.com), oppure apri un **Server Support Ticket** nel canale `#support` del [server Discord](https://discord.gg/beammp).
