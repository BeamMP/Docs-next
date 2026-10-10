---
description: "Tutte le impostazioni multigiocatore di BeamMP spiegate: generali, coda degli eventi, unicycle predefinito, blob, nametag e porta del Launcher."
---
# Impostazioni multigiocatore

Queste sono le impostazioni della pagina delle impostazioni multigiocatore di BeamMP. Ognuna è una voce richiudibile: aprila per vedere cosa fa quando è attivata e quando è disattivata. Se sei alle prime armi, parti da [Impostazioni multigiocatore iniziali](/it/get-started/multiplayer-settings-quickstart). I titoli delle voci sono i nomi inglesi che vedi nel gioco, perché BeamMP non ha ancora una traduzione italiana.

## Generali

::: details Show advanced options
Se attivata, vedi tutte le impostazioni multigiocatore
Se disattivata, vedi solo le impostazioni multigiocatore di base
:::

::: details Enable config cloning protection
Se attivata, la configurazione del tuo veicolo in gioco è protetta e gli altri giocatori non possono salvarla

Se disattivata, la configurazione del tuo veicolo in gioco può essere salvata dagli altri giocatori
:::

:::: details Disable pausing caused by instabilities
Se attivata, le instabilità della fisica non mettono in pausa il gioco

Se disattivata, le instabilità della fisica mettono in pausa il gioco

::: note
Si consiglia di lasciarla disattivata, perché instabilità ripetute possono mandare in crash il gioco
:::
::::

::: details Use simplified vehicles when available
Se attivata, il gioco sostituisce i veicoli degli altri giocatori con le loro versioni semplificate (quelle del traffico controllato dall'IA), se disponibili

Se disattivata, il gioco usa i modelli di veicolo originali
:::

:::: details New chat menu
Se attivata, la chat di gioco viene mostrata in una finestra [IMGUI](https://github.com/ocornut/imgui) che può essere trascinata fuori dal gioco, ad esempio su un altro monitor

Se disattivata, la chat di gioco viene mostrata nell'app UI

::: note
Trascinare le finestre IMGUI fuori dalla finestra principale del gioco può causare problemi di prestazioni e può far sì che i programmi di registrazione dello schermo registrino la finestra della chat invece di quella principale del gioco
:::
::::

::: details Enable vehicle position smoothing
Se attivata, BeamMP usa un algoritmo per rendere regolari gli intervalli degli aggiornamenti di posizione dei veicoli. Può essere utile tra giocatori con ping alto o quando la connessione perde molti pacchetti

Se disattivata, BeamMP aggiorna la posizione dei veicoli man mano che la riceve
:::

::: details Skip the mod security warning popups
Se attivata, il popup sulla sicurezza delle mod non viene mostrato quando provi a connetterti a un server con mod

Se disattivata, il popup sulla sicurezza delle mod viene mostrato ogni volta che ti connetti a un server con mod
:::

::: details Enable player vehicle update/edit queuing
Se attivata, le comparse e le modifiche dei veicoli degli altri giocatori vengono messe in una coda. Per i dettagli vedi la sezione [Coda degli eventi](#event-queue)

Se disattivata, le comparse e le modifiche dei veicoli degli altri giocatori vengono caricate subito dal gioco
:::

::: details Enable automatic part sync
Se attivata, le parti dei tuoi veicoli vengono sincronizzate automaticamente con gli altri giocatori dopo qualche secondo

Se disattivata, devi cliccare il pulsante di sincronizzazione delle parti nel selettore delle parti per inviare la sincronizzazione agli altri giocatori
:::

::: details Disable switching to other players' vehicles
Se attivata, passando da un veicolo all'altro con `Tab` i veicoli degli altri giocatori vengono saltati

Se disattivata, passando da un veicolo all'altro con `Tab` si scorrono tutti i veicoli presenti
:::

:::: details Fade out vehicles as they get closer
Se attivata, gli altri veicoli sfumano fino a scomparire man mano che si avvicinano

Se disattivata, gli altri veicoli restano completamente visibili a qualsiasi distanza

::: note
Questo riguarda solo la mesh 3D visibile di un veicolo, non la sua mesh fisica di nodi e travi (node-beam-mesh). Per disattivare anche la fisica, devi attivare `Simplified collision physics` nelle impostazioni di Gameplay
:::
::::

::: details Show the player IDs
Se attivata, l'elenco dei giocatori in gioco ha una colonna in più con l'ID di ogni giocatore. Utile per lo sviluppo o la moderazione

Se disattivata, l'elenco dei giocatori in gioco mostra solo le colonne del nome e del ping
:::

::: details Allow the serverlist to refresh ingame
Se attivata, l'elenco dei server si aggiorna a intervalli regolari mentre giochi. Questo può causare picchi di lag

Se disattivata, l'elenco dei server si aggiorna solo quando apri il menu principale
:::

## Coda degli eventi {#event-queue}

::: details Highlight queued players
Se attivata, i giocatori con un evento in coda vengono evidenziati nell'elenco dei giocatori in gioco

Se disattivata, i giocatori non vengono evidenziati singolarmente
:::

::: details Apply vehicle changes with
Se impostata su `Left mouse button`, cliccando con il tasto sinistro del mouse sul nome di un giocatore nell'elenco dei giocatori si caricano gli eventi in coda. Cliccando con il tasto destro si osserva quel giocatore in modalità spettatore

Se impostata su `Right mouse button`, cliccando con il tasto destro del mouse sul nome di un giocatore nell'elenco dei giocatori si caricano gli eventi in coda. Cliccando con il tasto sinistro si osserva quel giocatore in modalità spettatore
:::

::: details Automatically apply queued vehicle changes
Se attivata, gli eventi in coda vengono caricati automaticamente quando sei rimasto sotto la soglia di velocità per il tempo impostato come timeout

Se disattivata, gli eventi in coda vengono caricati solo manualmente, cliccando sul pulsante `Events` in alto sullo schermo oppure sul nome di un giocatore nell'elenco dei giocatori
:::

::: details Queue apply speed threshold
Questa impostazione definisce la soglia di velocità per il caricamento automatico della coda degli eventi. Il tuo veicolo deve essere più lento di questa soglia per un tempo superiore a `Queue apply timeout` perché gli eventi in coda vengano caricati
:::

::: details Queue apply timeout
Questa impostazione definisce il ritardo per il caricamento automatico della coda degli eventi. Il tuo veicolo deve restare più lento di `Queue apply speed threshold` per questo tempo perché gli eventi in coda vengano caricati
:::

::: details Skip queue if spectating others
Se attivata, un evento viene caricato subito se stai osservando un altro giocatore in modalità spettatore

Se disattivata, un evento viene messo in coda proprio come quando sei concentrato sul tuo veicolo
:::

::: details Don't queue Unicycles (Snowmen/Beamlings)
Se attivata, un evento che riguarda un pupazzo di neve/Beamling viene caricato subito

Se disattivata, i pupazzi di neve/Beamling vengono messi in coda come gli altri veicoli
:::

## Unicycle predefinito

::: details Default Unicycle config
Questa impostazione definisce la variante di unicycle da caricare per impostazione predefinita. Puoi scegliere tra le configurazioni già pronte e le tue, se hai salvato configurazioni personalizzate dell'unicycle
:::

::: details Automatically save your last used Unicycle
Se attivata, l'ultimo unicycle che hai usato viene salvato automaticamente e ricaricato quando lo fai comparire di nuovo

Se disattivata, ogni volta compare la tua configurazione predefinita dell'unicycle
:::

## Blob

::: details Enable blobs for unspawned vehicles
Se attivata, al posto di un veicolo non ancora comparso vedi una sfera segnaposto, o blob

Se disattivata, un veicolo non ancora comparso è invisibile
:::

:::: details Tune colors
::: details Visible
Se attivata, viene disegnato un blob con il colore indicato sotto

Se disattivata, non viene disegnato nessun blob per la funzione indicata
:::

::: details RGB HEX values
Queued vehicle: il colore che un blob usa se un veicolo è in coda per la comparsa. Valore predefinito #FF6400

Illegal vehicle: il colore che un blob usa se un veicolo non è valido, ad esempio a causa di una mod caricata a parte (sideloaded). Valore predefinito #000000

Deleted vehicle: il colore che un blob usa se un veicolo è stato eliminato dall'utente. Valore predefinito #333333
:::
::::

## Nametag

::: details Hide player nametags
Se attivata, i nametag dei giocatori non vengono disegnati

Se disattivata, i nametag dei giocatori vengono disegnati in base alla posizione relativa dei loro veicoli
:::

::: details Show distance from other players
Se attivata, il nametag è preceduto dalla distanza dal rispettivo veicolo

Se disattivata, nel nametag non viene mostrata nessuna distanza aggiuntiva
:::

::: details Fade nametags in/out
Se attivata, un nametag compare o scompare gradualmente in base a `Fade distance` e `Invert nametag fade direction`

Se disattivata, un nametag viene disegnato con l'opacità standard a qualsiasi distanza dal rispettivo veicolo
:::

:::: details Fade distance/Invert nametag fade direction
::: details Fade out
I nametag diventano meno visibili man mano che un giocatore si allontana

`Fade distance` definisce la distanza alla quale un nametag viene disegnato con l'opacità minima
:::

::: details Fade in
I nametag diventano più visibili man mano che un giocatore si allontana

`Fade distance` definisce la distanza alla quale un nametag viene disegnato con l'opacità massima
:::
::::

::: details Don't fully hide nametags
Se attivata, un nametag non può diventare del tutto invisibile: mantiene un'opacità minima a qualsiasi distanza

Se disattivata, i nametag possono diventare completamente invisibili
:::

::: details Shorten nametag and role tags
Se attivata, `Nametag length limit` tronca i nametag e i ruoli al numero di caratteri impostato

Se disattivata, i nametag e i tag dei ruoli vengono mostrati per intero
:::

::: details Show spectators' nametag under vehicle nametags
Se attivata, il nome di uno spettatore viene aggiunto sotto il nametag di un giocatore

Se disattivata, nessun nome di spettatore viene aggiunto ai nametag
:::

::: details Same color for spectator nametags
Se attivata, il nome di uno spettatore è sempre circondato da uno sfondo grigio

Se disattivata, il nome di uno spettatore è circondato da uno sfondo colorato che riflette il ruolo dello spettatore
:::

## Altre impostazioni

:::: details Show network activity in the console
Se attivata, l'attività di rete di BeamMP viene mostrata nella console

Se disattivata, nella console non viene mostrata nessun'altra attività di rete

::: danger
Fai attenzione con questa impostazione, perché tutto l'output della console viene scritto anche nei file di log

Con questa impostazione attiva possono crescere di centinaia di MB in pochi minuti
:::
::::

:::: details Launcher port
Questa impostazione definisce la porta usata per comunicare con il Launcher

Va cambiata solo se la porta standard 4444 non può essere usata

Non dimenticare di cambiarla anche lato Launcher, modificando `Launcher.cfg`

::: tip
La porta indicata è solo la prima di due: la seconda porta usata è quella immediatamente successiva, cioè porta + 1

La prima porta trasporta i pacchetti di rete principali, la seconda i pacchetti di rete del gioco, entrambe tramite TCP
:::
::::
