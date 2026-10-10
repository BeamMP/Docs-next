---
description: "Tutte le impostazioni di ServerConfig.toml per un server BeamMP, i percorsi delle mappe vanilla, come colorare e formattare il nome del server e l'elenco dei tag."
---
# Configurazione del server

Le impostazioni di un server BeamMP, come dargli un nome e dei tag e i percorsi delle mappe vanilla. Per installare un server, vedi [Ospitare un server](/it/server-owners/host-a-server). Per leggere il log o aggiornare il server, vedi [Manutenzione del server](/it/server-owners/maintenance).

## Il file ServerConfig

La configurazione del server, un file chiamato `ServerConfig.toml`, usa il [formato TOML](https://toml.io/en/).

::: info Vecchio file di configurazione
Il vecchio file di configurazione del server si chiamava `Server.cfg`. Non viene più usato e il server avvisa se è ancora presente. I due formati **non** sono compatibili.
:::

La configurazione ha due sezioni, `[General]` e `[Misc]`. I valori predefiniti sono quelli della versione 3.9.4 del server.

### La sezione `[General]` {#the-general-section}

| Chiave | Predefinito | Valore | Cosa fa |
|---|---|---|---|
| Port | `30814` | 1024-65535 | La porta di rete su cui il server sarà raggiungibile. Il server la usa sia per TCP sia per UDP. (Deve essere univoca e non essere usata da un altro servizio sullo stesso host). |
| AuthKey | vuoto | Formato AuthKey `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx` dove tutte le x sono caratteri alfanumerici (numeri e lettere) | Serve a identificare un server pubblico con il backend. All'avvio il server avvisa se la chiave non è lunga 36 caratteri. |
| AllowGuests | `true` | true/false | Indica se gli ospiti possono entrare nel server. Se è disabilitato (`false`), un ospite che prova a entrare viene rifiutato. |
| LogChat | `true` | true/false | Se abilitato (true), i messaggi della chat vengono registrati nella console e nel file `Server.log`. |
| Debug | `false` | true/false | Se abilitato (true), mostra più messaggi nel log e fornisce più informazioni. Abilitalo se incontri problemi. Abilitarlo aumenta drasticamente la dimensione del file di log. |
| IP | `"::"` | Un indirizzo IP locale di una delle interfacce di rete dell'host | Il server si collega a questo indirizzo IP. **Non** è il tuo IP pubblico. Usalo se la tua macchina ha più interfacce di rete. Non serve cambiarlo perché il server funzioni. Il valore predefinito `"::"` accetta connessioni su tutte le interfacce. |
| Private | `true` | true/false | Se abilitato (true), il tuo server non viene mostrato nella lista dei server. Chiunque abbia l'IP e la porta giusti può comunque connettersi. |
| InformationPacket | `true` | true/false | Se abilitato (true), il server permette ai client non autenticati di ottenere le stesse informazioni della lista dei server, ma direttamente dal server. |
| Name | `"BeamMP Server"` | Qualsiasi "testo" | Mostrato come nome / titolo del tuo server nella lista dei server. Puoi usare caratteri speciali per formattarlo con colori e stili. |
| Tags | `"Freeroam"` | Vedi l'elenco dei tag consentiti più sotto. | Tag per la ricerca, ad es. Police, Racing ecc. |
| MaxCars | `1` | Qualsiasi numero ≥ 1 | Il numero massimo di veicoli per giocatore. Ogni veicolo aggiuntivo che un giocatore prova a far apparire viene eliminato subito. Il monociclo (a piedi) non conta. |
| MaxPlayers | `8` | Qualsiasi numero ≥ 1 | Il numero massimo di giocatori per server. Non influisce sul numero di veicoli. Quando il server è pieno, un giocatore che prova a entrare viene rifiutato con "Server full!", a meno che un plugin non lo faccia entrare (vedi `onPlayerAuth` nel [riferimento allo scripting](/it/developers/beammp-scripting/server/latest#onplayerauth)). |
| Map | `"/levels/gridmap_v2/info.json"` | Un percorso di mappa valido, come `/levels/gridmap_v2/info.json` | La mappa che il tuo server ospiterà. Deve essere installata di default (un elenco si trova più sotto) o come mod del server. |
| Description | `"BeamMP Default Description"` | Qualsiasi "testo" | Mostrata come descrizione del server nella lista dei server (se il server è pubblico). Puoi usare caratteri speciali per formattarla con colori e stili. |
| ResourceFolder | `"Resources"` | Un percorso di cartella valido, come "D:\Server\BeamMP\Resources" | Utile per conservare il server e la cartella delle risorse in posti separati. |

### La sezione `[Misc]` {#the-misc-section}

| Chiave | Predefinito | Valore | Cosa fa |
|---|---|---|---|
| ImScaredOfUpdates | `true` | true/false | Se abilitato (`true`), nasconde il messaggio periodico che ti avvisa che è uscita una nuova versione del server. Il server non si aggiorna da solo: vedi [Manutenzione del server](/it/server-owners/maintenance#updating-the-server). |
| UpdateReminderTime | `"30s"` | Un numero con `s`, `min`, `h` o `d` in coda, per esempio `30s` | Ogni quanto viene stampato nel terminale il promemoria di aggiornamento. `30d` significa ogni 30 giorni, `0.5min` ogni mezzo minuto. |

::: warning Il server riscrive questo file
Ogni volta che si avvia, il server riscrive `ServerConfig.toml` con i valori attuali delle sole impostazioni `[General]` e `[Misc]`. I commenti che hai aggiunto e le sezioni aggiunte dai plugin, come `[MyMod]`, vengono rimossi. Anche i valori impostati con le [variabili d'ambiente](/it/server-owners/manual#general-settings) vengono scritti nel file, a meno che sia impostata `BEAMMP_PROVIDER_DISABLE_CONFIG`.
:::

**Devi** impostare tu la AuthKey. Per impostazione predefinita è vuota. Inserisci la AuthKey che hai ottenuto durante l'[installazione del server](/it/server-owners/host-a-server). Non condividerla con nessuno e offuscala completamente negli screenshot.

### Tutti i nomi delle mappe vanilla {#all-vanilla-maps-names}

Ecco tutte le mappe vanilla:

- /levels/gridmap_v2/info.json
- /levels/johnson_valley/info.json
- /levels/automation_test_track/info.json
- /levels/east_coast_usa/info.json
- /levels/hirochi_raceway/info.json
- /levels/italy/info.json
- /levels/jungle_rock_island/info.json
- /levels/industrial/info.json
- /levels/small_island/info.json
- /levels/smallgrid/info.json
- /levels/utah/info.json
- /levels/west_coast_usa/info.json
- /levels/driver_training/info.json
- /levels/derby/info.json

### Personalizza l'aspetto del nome del tuo server {#customize-the-look-of-your-server-name}

Usa questi simboli speciali prima del testo per applicargli un effetto nella lista dei server:

| Valore | Descrizione                 |
|:-----:|-----------------------------|
| `^r`  | Reset                       |
| `^p`  | A capo (solo per le descrizioni) |
| `^n`  | Sottolineato                |
| `^l`  | Grassetto                   |
| `^m`  | Barrato                     |
| `^o`  | Corsivo                     |
| `^0`  | Nero                        |
| `^1`  | Blu                         |
| `^2`  | Verde                       |
| `^3`  | Azzurro                     |
| `^4`  | Rosso                       |
| `^5`  | Rosa                        |
| `^6`  | Arancione                   |
| `^7`  | Grigio                      |
| `^8`  | Grigio scuro                |
| `^9`  | Viola chiaro                |
| `^a`  | Verde chiaro                |
| `^b`  | Azzurro chiaro              |
| `^c`  | Arancione scuro             |
| `^d`  | Rosa chiaro                 |
| `^e`  | Giallo                      |
| `^f`  | Bianco                      |

### Personalizza i tag del tuo server

I tag permettono alle persone di cercare un tipo specifico di server. Il tuo serverConfig.toml verrà generato con il tag freeroam `Tags = "Freeroam"`.

Puoi aggiungere più tag separati da virgola `Tags = "Events,Offroad,lang:english"`; non distinguono tra maiuscole e minuscole.

Puoi scegliere dal seguente elenco:

::: tabs

== Età/Contenuti

- `Mature/18+`

== Tipi di gameplay

- `Freeroam`
- `Roleplay`
- `Economy`
- `Traffic`
- `Challenge`
- `Drift`

== Categorie di gare

- `Racing`
- `Racing:NASCAR`
- `Racing:Track`
- `Racing:Drag`
- `Racing:Rally`
- `Touge`

== Fuoristrada

- `Offroad`
- `Crawling`
- `Rally`
- `Dakar`

== Eventi di distruzione

- `Derby`
- `Arena`

== Condizioni meteo e orario

- `Snow/Ice`
- `Rain`
- `Night`
- `Weather`

== Modalità di gioco

- `Gamemode`
- `Gamemode:Racing`
- `Gamemode:Rally`
- `Gamemode:Drag`
- `Gamemode:Derby`
- `Gamemode:Infection`
- `Gamemode:Cops-Robbers`
- `Gamemode:Delivery`
- `Gamemode:Sumo`

== Community ed eventi

- `Scenarios`
- `Events`
- `Leaderboard`

== Mod

- `Modded`
- `Mod:BeamPaint`
- `Mod:BeamJoy`
- `Mod:CEI`

== Lingue

- `Lang:English`
- `Lang:Russian`
- `Lang:French`
- `Lang:Spanish`
- `Lang:Portuguese`
- `Lang:German`
- `Lang:Polish`
- `Lang:Arabic`

== Altro

- `Vanilla`
- `Moderated`

:::


Se un tag manca da questo elenco, puoi richiederne l'aggiunta [qui](https://forum.beammp.com/t/introducing-server-tags/1320081)
