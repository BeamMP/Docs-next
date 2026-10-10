---
description: "Tutte le impostazioni multigiocatore di BeamMP spiegate: generali, coda degli eventi, blob, interfaccia utente, nametag, giocatori, avanzate e finestra della chat."
---
# Impostazioni multigiocatore

Queste sono le impostazioni nella pagina **BeamMP** delle opzioni di BeamNG.drive, come in BeamMP 4.22 per BeamNG.drive 0.39. Per aprirle, clicca su **Options** e seleziona **BeamMP**. Tutte le impostazioni sono sempre visibili: non esiste un interruttore che nasconde quelle avanzate.

Ogni impostazione qui sotto è una voce richiudibile. Aprila per vedere il valore predefinito e cosa fa quando è attivata e quando è disattivata. I titoli seguono i gruppi della pagina: **General**, **Vehicle Update Queue**, **Blobs**, **User Interface**, **Players** e **Advanced**. I nomi delle impostazioni sono quelli inglesi che vedi nel gioco, perché BeamMP non ha una traduzione italiana. Se sei alle prime armi, parti da [Impostazioni multigiocatore iniziali](/it/get-started/multiplayer-settings-quickstart).

## Generali

::: details Enable Config Cloning Protection
Predefinito: disattivata.

Se attivata, gli altri giocatori non possono clonare né salvare i tuoi veicoli. Quando ci provano, vedono **Vehicle Clone Error** o **Vehicle Save Error**. Cambiare l'impostazione aggiorna anche i veicoli che hai già fatto comparire.

Se disattivata, gli altri giocatori possono clonare e salvare i tuoi veicoli.
:::

::: details Disable switching to other players vehicles
Predefinito: disattivata.

Se attivata, passando da un veicolo all'altro si saltano i veicoli degli altri giocatori finché ne hai uno tuo.

Se disattivata, passando da un veicolo all'altro si scorrono tutti i veicoli presenti.

Gli unicycle degli altri giocatori vengono sempre saltati, qualunque sia questa impostazione.
:::

::: details Automatically save your last used Unicycle
Predefinito: attivata.

Se attivata, BeamMP salva la configurazione del tuo unicycle quando lo elimini e la usa la prossima volta che fai comparire il tuo unicycle.

Se disattivata, la configurazione del tuo unicycle non viene salvata quando lo elimini.
:::

## Coda degli eventi {#event-queue}

Nel gioco questo gruppo si chiama **Vehicle Update Queue**. Quando un altro giocatore fa comparire o modifica un veicolo, BeamMP può tenere la modifica in una coda invece di caricarla subito, così un caricamento non interrompe la tua guida.

Finché le modifiche sono in attesa, un messaggio ti dice quante sono e la barra della sessione in alto sullo schermo mostra un pulsante **Events queued**. I due numeri sul pulsante sono le comparse in attesa e le modifiche in attesa, in questo ordine. Il pulsante compare solo quando qualcosa è in coda. Se non hai un veicolo, le modifiche in coda vengono caricate subito.

Le modifiche in coda vengono caricate quando:

- clicchi su **Events queued** in alto sullo schermo.
- premi il tasto assegnato a **Queue Events**. Assegnalo nella categoria **BeamMP** delle impostazioni dei controlli.
- clicchi sul nome di un giocatore mentre **Playerlist left click action** è impostata su **Queue events**. Questo carica solo le modifiche di quel giocatore. **Queue events** nel menu del clic destro del giocatore fa lo stesso.
- parte il caricamento automatico descritto più avanti.

::: details Enable player vehicle update/edit queuing
Predefinito: attivata.

Se attivata, le comparse e le modifiche dei veicoli degli altri giocatori restano nella coda finché una delle azioni sopra non le carica.

Se disattivata, le comparse e le modifiche dei veicoli degli altri giocatori vengono caricate subito.
:::

::: details Automatically apply queued vehicle changes
Predefinito: attivata. Mostrata solo quando la messa in coda è attivata.

Se attivata, le modifiche in coda vengono caricate quando il tuo veicolo è rimasto a una velocità pari o inferiore a **Queue apply speed threshold** per il tempo impostato in **Queue apply timeout**.

Se disattivata, le modifiche in coda vengono caricate solo quando le carichi tu.
:::

::: details Queue apply speed threshold
Predefinito: 2 m/s. Un cursore da 0 a 10 m/s. Mostrata solo quando il caricamento automatico è attivato.

Il tuo veicolo deve restare a questa velocità o a una inferiore per il tempo indicato in **Queue apply timeout** prima che le modifiche in coda vengano caricate.
:::

::: details Queue apply timeout
Predefinito: 3 s. Un cursore da 0 a 20 s. Mostrata solo quando il caricamento automatico è attivato.

Il tuo veicolo deve restare a **Queue apply speed threshold** o a una velocità inferiore per questo tempo prima che le modifiche in coda vengano caricate.
:::

::: details Enable automatic part sync
Predefinito: attivata.

Se attivata, una modifica che fai alle parti del tuo veicolo viene inviata agli altri giocatori circa 15 secondi dopo la tua ultima modifica.

Se disattivata, le modifiche alle tue parti non vengono inviate automaticamente.
:::

::: details Skip queue if spectating others
Predefinito: disattivata.

Se attivata, le modifiche in coda vengono caricate subito mentre il veicolo in cui ti trovi non è il tuo.

Se disattivata, le modifiche in coda restano in attesa nella coda, come quando guidi il tuo veicolo.
:::

::: details Don't queue Unicycles (Snowmen/Beamlings)
Predefinito: attivata.

Se attivata, le comparse e le modifiche degli unicycle degli altri giocatori vengono caricate subito.

Se disattivata, gli unicycle vengono messi in coda come gli altri veicoli.
:::

## Blob {#blobs}

Un blob è una sfera colorata che prende il posto di un veicolo che non è ancora comparso per te. Può avere uno di quattro colori:

- Il colore dei veicoli in coda: il veicolo è in attesa nella coda.
- Il colore dei veicoli non validi: il veicolo non può comparire, perché manca la sua mod.
- Il colore dei veicoli eliminati: hai eliminato il veicolo. Per riaverlo, clicca con il tasto destro sul suo proprietario nell'elenco dei giocatori e seleziona **Queue deleted vehicles**.
- Magenta: qualsiasi altro veicolo che non è ancora comparso. Non puoi cambiare questo colore.

::: details Enable blobs for unspawned vehicles
Predefinito: attivata.

Se attivata, vedi un blob al posto di ogni veicolo non ancora comparso.

Se disattivata, un veicolo non ancora comparso è invisibile.
:::

::: details Queued vehicle
Predefinito: mostrato, `#FF6400`.

La casella **Queued vehicle** attiva o disattiva il blob per i veicoli in coda. Il campo **HEX color value (ex: #FF6400)** ne imposta il colore.
:::

::: details Illegal vehicle
Predefinito: mostrato, `#000000`.

La casella **Illegal vehicle** attiva o disattiva il blob per i veicoli che non possono comparire. Il campo **HEX color value (ex: #FF6400)** ne imposta il colore.
:::

::: details Deleted vehicle
Predefinito: mostrato, `#333333`.

La casella **Deleted vehicle** attiva o disattiva il blob per i veicoli che hai eliminato. Il campo **HEX color value (ex: #FF6400)** ne imposta il colore.
:::

## Interfaccia utente

::: details Skip the mod security warning popup
Predefinito: disattivata.

Se attivata, l'avviso sulla sicurezza delle mod non viene mostrato quando ti connetti a un server con mod. Le mod vengono scaricate senza chiedere.

Se disattivata, l'avviso viene mostrato ogni volta che ti connetti a un server con mod. Vedi [Sicurezza mod](/it/players/mod-safety#the-mod-security-warning).
:::

::: details Allow the serverlist to refresh ingame
Predefinito: disattivata.

Se attivata, l'elenco dei server può essere aggiornato mentre sei in una sessione. Questo può causare picchi di lag.

Se disattivata, l'elenco dei server continua a mostrare quello di prima che entrassi nella sessione, finché non la lasci.
:::

::: details HUD App Style
Predefinito: **Old**. Le scelte sono **Old** e **Redesign**.

Questo imposta l'aspetto delle app HUD di BeamMP: la barra della sessione, l'elenco dei giocatori e la chat.
:::

:::: details New chat menu
Predefinito: disattivata.

Se attivata, la chat di gioco viene mostrata in una finestra [ImGui](https://github.com/ocornut/imgui) che puoi trascinare fuori dal gioco, ad esempio su un altro monitor. Vedi [La finestra della chat](#the-chat-window).

Se disattivata, la chat di gioco viene mostrata nell'app HUD **BeamMP Chat**.

::: warning
Trascinare una finestra ImGui fuori dalla finestra principale del gioco può causare problemi di prestazioni e può far sì che i programmi di registrazione dello schermo registrino la finestra della chat invece del gioco.
:::
::::

### Nametag {#nametags}

Le altre impostazioni dei nametag non sono disponibili finché **Hide player nametags** è attivata.

::: details Hide player nametags
Predefinito: disattivata.

Se attivata, non viene disegnato nessun nametag.

Se disattivata, il nametag di ogni giocatore viene disegnato sopra il suo veicolo. L'azione **Player Nametags** nelle impostazioni dei controlli nasconde e mostra tutti i nametag finché non riavvii il gioco.
:::

::: details Show distance from other players
Predefinito: attivata.

Se attivata, un nametag termina con la distanza dal veicolo quando questo è a più di 10 m. La distanza usa il sistema di unità del gioco.

Se disattivata, un nametag non mostra nessuna distanza.
:::

::: details Hide nametags behind objects
Predefinito: disattivata.

Se attivata, gli oggetti come gli edifici nascondono un nametag che si trova dietro di loro.

Se disattivata, i nametag vengono disegnati sopra a tutto.
:::

::: details Shorten nametag and role tags
Predefinito: disattivata.

Se attivata, i nomi lunghi vengono troncati a **Nametag length limit** e i tag dei ruoli usano la forma breve, ad esempio `[EA]` per `[Early Access]`.

Se disattivata, i nomi e i tag dei ruoli vengono mostrati per intero.
:::

::: details Nametag length limit
Predefinito: 32. Un cursore da 0 a 50. Disponibile finché **Shorten nametag and role tags** è attivata.

È il numero massimo di caratteri di un nome che viene mostrato. Un nome che supera il limite di più di tre caratteri viene troncato al limite e termina con `...`.
:::

::: details Show spectators' nametag under vehicle nametags
Predefinito: attivata.

Se attivata, i nomi dei giocatori che stanno osservando un veicolo vengono mostrati sotto il suo nametag.

Se disattivata, gli spettatori non vengono mostrati.
:::

::: details Same color for spectator nametags
Predefinito: disattivata. Disponibile finché **Show spectators' nametag under vehicle nametags** è attivata.

Se attivata, ogni nametag di spettatore ha lo stesso sfondo grigio.

Se disattivata, il nametag di uno spettatore ha uno sfondo che riflette il ruolo dello spettatore.
:::

::: details Fade nametags in/out
Predefinito: disattivata.

Se attivata, un nametag sfuma in base alla distanza dal suo veicolo, usando **Fade distance**. **Invert nametag fade direction** imposta in quale verso sfuma.

Se disattivata, un nametag viene disegnato con piena opacità a qualsiasi distanza.
:::

::: details Fade distance
Predefinito: 40 m. Un cursore da 0 a 1500 m. Disponibile finché **Fade nametags in/out** è attivata.

Un nametag è pienamente visibile accanto al veicolo e del tutto trasparente a questa distanza. Con **Invert nametag fade direction** attivata, succede il contrario.
:::

::: details Don't fully hide nametags
Predefinito: disattivata. Disponibile finché **Fade nametags in/out** è attivata.

Se attivata, un nametag mantiene un'opacità minima del 30 percento a qualsiasi distanza.

Se disattivata, un nametag può diventare del tutto trasparente.
:::

::: details Invert nametag fade direction
Predefinito: disattivata. Disponibile finché **Fade nametags in/out** è attivata.

Se attivata, i nametag sono trasparenti vicino al veicolo e diventano più visibili man mano che ci si allontana.

Se disattivata, i nametag sono visibili vicino al veicolo e sfumano man mano che ci si allontana.
:::

### Elenco dei giocatori

::: details Show the player ID's
Predefinito: attivata.

Se attivata, l'elenco dei giocatori ha una colonna in più con l'ID di ogni giocatore. L'ID è utile per lo staff del server.

Se disattivata, l'elenco dei giocatori mostra solo i nomi e il ping.
:::

::: details Highlight queued players
Predefinito: attivata.

Se attivata, un giocatore che ha modifiche in coda viene evidenziato nell'elenco dei giocatori.

Se disattivata, nessun giocatore viene evidenziato.
:::

::: details Playerlist left click action
Predefinito: **Queue events**.

Questo imposta cosa fa un clic sinistro sul nome di un giocatore nell'elenco dei giocatori. Le scelte sono:

- **Queue events**: carica le modifiche in coda di quel giocatore.
- **Switch camera to**: osserva il giocatore in modalità spettatore.
- **Open profile**: apre il profilo del giocatore sul forum.
- **Delete all vehicles**: elimina tutti i veicoli del giocatore nel tuo gioco.
- **Queue deleted vehicles**: rimette in coda i veicoli del giocatore che hai eliminato.
- **Copy name**: copia il nome del giocatore.

Un clic destro su un nome apre sempre un menu con tutte queste azioni.
:::

## Giocatori {#players}

::: details Show Player names on license plates
Predefinito: attivata.

Se attivata, la targa del veicolo di un altro giocatore mostra il nome di quel giocatore.

Se disattivata, BeamMP non cambia il testo della targa.
:::

:::: details Fade out vehicles as they get closer
Predefinito: disattivata.

Se attivata, i veicoli degli altri giocatori sfumano man mano che si avvicinano. Sono pienamente visibili a 20 m di distanza e del tutto trasparenti nella tua posizione. Funziona solo mentre i nametag sono mostrati.

Se disattivata, i veicoli degli altri giocatori restano pienamente visibili a qualsiasi distanza.

::: info
Questo cambia solo l'aspetto del veicolo, non la sua fisica. È pensata per essere usata con le collisioni disattivate. L'impostazione del gioco per questo si trova nelle opzioni **Gameplay**.
:::
::::

::: details Use simplified vehicles when available
Predefinito: disattivata.

Se attivata, i veicoli degli altri giocatori vengono sostituiti con le versioni semplificate del traffico di BeamNG.drive, per i veicoli che ne hanno una. Questo riduce la precisione delle collisioni e della grafica e migliora le prestazioni.

Se disattivata, il gioco usa i modelli di veicolo scelti dall'altro giocatore.
:::

## Avanzate

::: details Enable vehicle position smoothing
Predefinito: disattivata.

Se attivata, BeamMP rende più regolari i dati di posizione dei giocatori con una connessione instabile. Questo riduce i teletrasporti dei veicoli e il rubber banding.

Se disattivata, BeamMP aggiorna la posizione dei veicoli man mano che la riceve.
:::

:::: details Show network activity in the console
Predefinito: disattivata.

Se attivata, l'attività di rete di BeamMP viene mostrata nella console.

Se disattivata, la console non la mostra.

::: danger
L'output della console viene scritto anche nei file di log. Con questa impostazione attiva possono crescere di centinaia di megabyte in pochi minuti.
:::
::::

:::: details Launcher port
Predefinito: 4444.

Questa è la porta che il gioco usa per comunicare con il Launcher. Cambiala solo se la porta 4444 non può essere usata. Imposta `Port` in `Launcher.cfg` sullo stesso numero.

::: tip
La porta che inserisci è la prima di due. Il gioco usa anche la porta successiva: con 4444, è la 4445. La prima trasporta i pacchetti di rete principali e la seconda i pacchetti di rete del gioco.
:::
::::

## La finestra della chat {#the-chat-window}

Quando **New chat menu** è attivata, la chat è una finestra ImGui con le sue impostazioni. Clicca sull'icona a forma di ingranaggio nella barra del titolo della finestra per aprirle. Hanno due schede, ognuna con i pulsanti **Reset to default** e **Save**. Le impostazioni vengono salvate in `settings/BeamMP/chat.json`.

::: details Scheda General
**Inactive fade**: predefinito attivata. Se attivata, la finestra sfuma quando non la usi.

**Fade time**: predefinito 2,5 s, minimo 0,1 s. Quanto tempo la finestra aspetta prima di sfumare.

**Fade when collapsed**: predefinito disattivata. Se attivata, la finestra sfuma anche quando è ridotta.

**Show on message**: predefinito attivata. Se attivata, la finestra ricompare quando arriva un messaggio.

**Keep active on Enter**: predefinito attivata. Se attivata, il cursore resta nella casella del messaggio dopo che premi `Enter`.
:::

::: details Scheda Theming
Imposta i colori della finestra: **Window Background**, **Button Background**, **Button Hovered**, **Button Active**, **Text Color**, **Primary Color** e **Secondary Color**.
:::

Le azioni **Bring to Front** e **Toggle Chat** nelle impostazioni dei controlli fanno ricomparire la finestra dopo che è sfumata e la nascondono.
