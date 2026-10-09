---
description: "Riferimento al sistema di plugin del server BeamMP, versione 3: come si caricano i plugin, eventi e funzioni del server e come migrare dal vecchio Lua."
---
# Riferimento allo scripting del server (versione 3.X)

## Introduzione {#introduction}

La release v3.0.0 di BeamMP-Server introduce cambiamenti drastici nel funzionamento del sistema di plugin Lua. Non è possibile usare il vecchio Lua con un nuovo server, quindi dovrai fare la migrazione.

Il sistema di plugin del server usa [Lua 5.3](https://www.lua.org/manual/5.3/). Questa sezione spiega come iniziare a scrivere plugin, insegna alcuni concetti di base e ti guida al tuo primo plugin. **Ti consigliamo di leggerla anche se conosci il sistema precedente alla v3.0.0, perché alcune cose sono cambiate in modo drastico**.

Per una guida alla migrazione dal Lua precedente alla v3.0.0, vai alla sezione ["Migrare dal vecchio Lua"](#migrating-from-old-lua).


## Struttura delle cartelle

I plugin del server, a differenza delle mod, si trovano (per impostazione predefinita) in `Resources/Server`, mentre le mod, che sono scritte per BeamNG.drive e vengono inviate ai client, si trovano in `Resources/Client`. Ogni plugin deve avere una propria sottocartella in `Resources/Server`: per esempio, per un plugin chiamato "MyPlugin" la struttura sarebbe:
```
Resources
└── Server
    ├── MyPlugin
    │   └── main.lua
    └── SomeOtherPlugin
        └── ...
```
Qui mostriamo anche un altro plugin chiamato "SomeOtherPlugin", per illustrare come la tua cartella `Resources/Server` possa contenere più cartelle di plugin diversi. Useremo questa struttura come esempio in tutta la guida.

Noterai anche il file `main.lua`. Puoi avere tutti i file Lua `.lua` che vuoi. Tutti i file Lua nella cartella principale del tuo plugin vengono caricati in *ordine alfabetico* (quindi `aaa.lua` viene eseguito prima di `bbb.lua`).


## File Lua

Ogni file Lua `.lua` nella cartella del plugin viene caricato all'avvio del server. Questo significa che le istruzioni al di fuori delle funzioni vengono valutate ("eseguite") subito.

I file Lua nelle sottocartelle vengono ignorati, ma si possono caricare con `require()`.

Per esempio, il nostro `main.lua` è fatto così:
```lua
function PrintMyName()
	print("I'm 'My Plugin'!")
end

print("What's up!")
```
Quando il server si avvia e `main.lua` viene caricato, eseguirà `print("What's up!")` *subito*, ma **NON** *chiamerà* ancora la funzione `PrintMyName` (perché non è stata chiamata)!

## Eventi {#events}

Un evento è qualcosa come "un giocatore si sta unendo", "un giocatore ha inviato un messaggio in chat", "un giocatore ha fatto comparire un veicolo".

Puoi annullare gli eventi (se sono annullabili) restituendo `1` dall'handler.

In Lua, di solito vuoi reagire ad alcuni di questi eventi. Per farlo puoi registrare un "handler" (gestore). È una funzione che viene chiamata quando si verifica un evento e riceve alcuni argomenti.

Esempio:
```lua
function MyChatMessageHandler(sender_id, sender_name, message)
	-- censoring only the exact message 'darn'
	if message == "darn" then
		-- cancel the event by returning 1
		return 1
	else
		return 0
	end
end

MP.RegisterEvent("onChatMessage", "MyChatMessageHandler")
```
In questo modo ci si assicura che qualsiasi messaggio esattamente uguale a "darn" non venga inviato e non compaia in chat (nota che per un vero filtro delle parolacce dovresti controllare se il messaggio *contiene* "darn", non se *è* "darn"). Annullare un evento fa sì che non avvenga: per esempio un messaggio in chat non viene mostrato a nessun altro, un veicolo non viene fatto comparire, e così via.

## Eventi personalizzati {#custom-events}

Puoi registrarti a qualsiasi evento vuoi, per esempio:
```lua
MP.RegisterEvent("MyCoolCustomEvent", "MyHandler")
```
Poi puoi scatenare quegli eventi personalizzati:
```lua
-- call all event handlers to this in ALL plugins
MP.TriggerGlobalEvent("MyCoolCustomEvent")
-- call all event handlers to this in THIS plugin
MP.TriggerLocalEvent("MyCoolCustomEvent")
```
Con gli eventi si può fare molto di più, ma queste possibilità sono trattate in dettaglio più avanti nel riferimento API.

## Timer di evento ("thread") {#event-timers-threads}

Il Lua precedente alla v3.0.0 aveva il concetto di "thread" che vengono eseguiti X volte al secondo. Questo nome era un po' fuorviante, perché erano sincroni.

Il Lua della v3.0.0 ha invece i "timer di evento". Sono timer che girano dentro il server e, quando scadono, scatenano un evento (a livello globale). Anche questo è sincrono. Tieni presente che il secondo argomento è un intervallo in millisecondi.

Esempio:
```lua
local seconds = 0

function CountSeconds()
	seconds = seconds + 1
end

-- create a custom event called 'EverySecond'
-- and register the handler function 'CountSeconds' to it
MP.RegisterEvent("EverySecond", "CountSeconds")

-- create a timer for this event, which will fire every 1000ms (1s)
MP.CreateEventTimer("EverySecond", 1000)
```
Questo farà sì che "CountSeconds" venga chiamato ogni secondo. Puoi anche annullare i timer di evento con `MP.CancelEventTimer` (vedi il riferimento API).

Dalla console del server puoi eseguire `status` per vedere quanti timer di evento sono attualmente in esecuzione, oltre a informazioni sugli handler di eventi in attesa. In futuro questo comando mostrerà più informazioni.

## Debug

Il Lua è difficile da sottoporre a debug. Purtroppo per il Lua incorporato non esiste un debugger di livello professionale come `gdb`.

In generale, puoi ovviamente usare `print()` per stampare in qualsiasi momento i valori che vuoi ispezionare. 

Nella v3.0.0 il server offre un modo per iniettare un interprete in un plugin e poi eseguire Lua al suo interno in tempo reale. È la cosa più vicina a un debugger che abbiamo.

Supponendo di avere il plugin di prima, che abbiamo chiamato `MyPlugin`, puoi entrare nel suo stato Lua così:
```
> lua MyPlugin
```
Qui le maiuscole contano, quindi fai attenzione a scriverlo correttamente. 
L'output è simile a questo
```
lua @MyPlugin> 
```
Come puoi vedere, siamo passati allo stato Lua di `MyPlugin`. Da ora fino a quando non inseriremo `exit()` (dalla v3.1.0 `:exit`), saremo in `MyPlugin` e potremo eseguire Lua al suo interno. 

Per esempio, se abbiamo una variabile globale chiamata `MyValue`, possiamo stampare il suo valore così:
```
lua @MyPlugin> print(MyValue)
```
Qui puoi chiamare funzioni e fare tutto ciò che ti aspetteresti di poter fare.

Dalla v3.1.0: puoi premere TAB per completare automaticamente funzioni e variabili.

ATTENZIONE: purtroppo, se lo stato Lua è occupato a eseguire altro codice (come un ciclo `while`), la console può bloccarsi completamente finché non termina quel lavoro, quindi fai molta attenzione a passare a stati che potrebbero essere in attesa di qualcosa.

Inoltre, puoi eseguire `status` nella console normale (`> `), che ti mostrerà alcune statistiche su Lua, tra le altre cose.

## Comandi personalizzati

Per implementare comandi personalizzati per la console del server si può usare l'evento `onConsoleInput`. 
Può essere utile quando vuoi offrire al proprietario del server un modo per segnalare qualcosa al tuo plugin, o per mostrare lo stato interno in modo personalizzato.

Ecco un esempio:
```lua
function handleConsoleInput(cmd)
    local delim = cmd:find(' ')
    if delim then
        local message = cmd:sub(delim+1)
        if cmd:sub(1, delim-1) == "print" then
            return message
        end
    end
end

MP.RegisterEvent("onConsoleInput", "handleConsoleInput")
```
Questo ti permetterà di fare quanto segue nella console del server:
```
> print hello, world
hello, world
```
Abbiamo implementato un nostro `print`. Come esercizio, prova a costruire una funzione come `say`, che invii un messaggio in chat a tutti i giocatori, o anche a un giocatore specifico (con `MP.SendChatMessage`).

**Attenzione:** per i tuoi plugin, in generale è consigliato dar loro un "namespace". Il nostro esempio `print`, in un plugin chiamato `mystuff`, potrebbe chiamarsi `mystuff.print` o `ms.print` o simili.

## Riferimento API

Formato della documentazione: `function_name(arg_name: arg_type, arg_name: arg_type) -> return_types`

## Funzioni integrate

### `print(...)`, `printRaw(...)`

Stampa il messaggio nella console del server, con il prefisso `[DATE TIME] [LUA]`. Se non vuoi questo prefisso, puoi usare `printRaw(...)`.

Esempio:
```lua
local name = "John Doe"
print("Hello, I'm", name, "and I'm", 32)
```
Accetta quanti argomenti di tipo arbitrario vuoi. Stampa volentieri anche le tabelle!

Si comporta come il `print` dell'interprete Lua, quindi inserisce tabulazioni tra gli argomenti.

### `exit()`

Arresta il server in modo ordinato. Provoca l'attivazione dell'evento `onShutdown`.

## Funzioni MP

### `MP.CreateTimer() -> Timer`

Crea un oggetto timer, che si può usare per tenere traccia di quanto è durata una cosa / quanto tempo è trascorso. Parte appena creato e si può azzerare/riavviare con `mytimer:Start()`.

Puoi ottenere il tempo trascorso attuale, in secondi, con `mytimer:GetCurrent()`.

Esempio:
```lua
local mytimer = MP.CreateTimer()
-- do stuff here that needs to be timed
print(mytimer:GetCurrent()) -- print how much time elapsed
```
I timer non hanno bisogno di essere fermati (e non possono esserlo), e non hanno overhead.

### `MP.GetOSName() -> string`

Restituisce il nome del sistema operativo attuale: `Windows`, `Linux` oppure `Other`.

### `MP.GetServerVersion() -> number,number,number`

Restituisce la versione attuale del server nel formato major, minor, patch. Per esempio, la versione v3.0.0 restituirebbe `3, 0, 0`.

Esempio:
```lua
local major, minor, patch = MP.GetServerVersion()
print(major, minor, patch)
```
Output:
```
2	4	0
```
### `MP.RegisterEvent(event_name: string, function_name: string)`

Memorizza la funzione di nome `Function Name` come handler dell'evento di nome `Event Name`.

Puoi registrare a un evento quanti handler vuoi.

Per un elenco degli eventi forniti dal server, vedi [qui](#events-1).

Se l'evento con quel nome non esiste, viene creato, quindi RegisterEvent non può fallire. Si può usare per creare eventi personalizzati. Vedi [Eventi personalizzati](#custom-events) ed [Eventi](#events) per saperne di più.

Esempio:
```lua
function ChatHandler(player_id, player_name, msg)
    if msg == "hello" then
        print("Hello World!")
        return 0
    end
end

MP.RegisterEvent("onChatMessage", "ChatHandler")
```
### `MP.CreateEventTimer(event_name: string, interval_ms: number, [strategy: number (since v3.0.2)])`

Avvia un timer all'interno del server che scatena l'evento `event_name` ogni `interval_ms` millisecondi.

I timer di evento si possono annullare con `MP.CancelEventTimer`.

Gli intervalli <25 ms sono sconsigliati, perché più intervalli di questo tipo molto probabilmente non verrebbero serviti in tempo in modo affidabile. Anche se si possono avviare più timer sullo stesso evento, si consiglia di creare il minor numero possibile di timer di evento. Per esempio, se ti serve un evento che gira ogni mezzo secondo e uno che gira ogni secondo, valuta di creare solo quello da mezzo secondo e di far partire la funzione da un secondo ogni due attivazioni.

Puoi anche usare `MP.CreateTimer` per creare un timer e misurare il tempo trascorso dall'ultima chiamata dell'evento, in modo da ridurre al minimo i timer di evento, anche se non è necessariamente consigliato perché aumenta notevolmente la complessità del codice.

**Dalla 3.0.2:**

Come terzo argomento si può fornire una `CallStrategy` facoltativa. Può essere una di queste:

- `MP.CallStrategy.BestEffort` (predefinita): cerca di far scattare il tuo evento all'intervallo specificato, ma rifiuta di mettere in coda gli handler se un handler impiega troppo tempo.
- `MP.CallStrategy.Precise`: mette in coda gli handler dell'evento esattamente all'intervallo specificato. Può far riempire la coda se l'handler impiega più dell'intervallo. Usala solo se ti serve ESATTAMENTE quell'intervallo.

### `MP.CancelEventTimer(event_name: string)`

Annulla tutti i timer sull'evento di nome `event_name`. In alcuni casi il timer potrebbe scattare ancora una volta prima di essere annullato, per la natura della programmazione asincrona.

### `MP.TriggerLocalEvent(event_name: string, ...) -> table`

Attivatore di eventi sincrono, locale al plugin.

Scatena un evento in locale, il che provoca la chiamata di tutti gli handler di quell'evento *nello stato Lua corrente* (di solito il plugin corrente, a meno che lo stato non sia stato condiviso tramite PluginConfig.toml).

Puoi passare a questa funzione degli argomenti (`...`), che vengono copiati e inviati a tutti gli handler come argomenti della funzione.

Questa chiamata è sincrona e restituisce il controllo quando tutti gli handler dell'evento hanno finito.

Il valore restituito è una tabella con tutti i risultati. Se un handler ha restituito un valore, sarà in questa tabella, senza annotazioni e senza nome. Si può usare per "raccogliere" dati, o per registrare sotto-handler di eventi che possono essere annullati. In pratica è un array.

Esempio:
```lua
local Results = MP.TriggerLocalEvent("MyEvent")
print(Results)
```
### `MP.TriggerGlobalEvent(event_name: string, ...) -> table`

Attivatore di eventi globale e asincrono.

Scatena un evento a livello globale, il che provoca la chiamata di tutti gli handler di quell'evento *in tutti i plugin* (compreso *questo* plugin).

Puoi passare a questa funzione degli argomenti (`...`), che vengono copiati e inviati a tutti gli handler come argomenti della funzione.

Questa chiamata è asincrona e restituisce un oggetto simile a un future. Gli handler locali (gli handler nello stesso plugin di chi chiama) vengono eseguiti in modo sincrono e immediato. 

La tabella restituita ha due funzioni:

- `IsDone() -> boolean` ti dice se tutti gli handler hanno finito. Puoi aspettare che diventi vero controllandola e usando `MP.Sleep` per una breve pausa in un ciclo.
- `GetResults() -> table` restituisce una tabella senza annotazioni e senza nome con tutti i valori restituiti da tutti gli handler. In pratica è un array.

Assicurati di chiamarle con la sintassi `Obj:Function()` (`:`, NON `.`).

Esempio:
```lua
local Future = MP.TriggerGlobalEvent("MyEvent")
-- wait until handlers finished
while not Future:IsDone() do
	MP.Sleep(100) -- sleep 100 ms
end
local Results = Future:GetResults()
print(Results)
```
Tieni presente che un handler registrato a "MyEvent" qui che non restituisce mai il controllo potrebbe bloccare il tuo plugin. Probabilmente ti conviene tenere traccia di quanto hai aspettato e smettere di aspettare dopo qualche secondo.

### `MP.Sleep(time_ms: number)`

Attende per un periodo di tempo, specificato in millisecondi.

Questo non cede l'esecuzione dello stato Lua e, durante la pausa, nello stato non verrà eseguito nulla. 

ATTENZIONE: NON fare pause di >500 ms se hai handler di eventi registrati, a meno che tu non sappia *esattamente* cosa stai facendo. È pensata per pause di 1-100 ms, per aspettare dei risultati o simili. Uno stato Lua bloccato (in pausa) può rallentare drasticamente l'intero server, se non stai attento.

### `MP.SendChatMessage(player_id: number, message: string)`

Invia un messaggio in chat che può vedere solo il giocatore specificato (o tutti, se l'ID è `-1`).
Nel gioco, non apparirà come un messaggio diretto.

Puoi usarla, per esempio, per dire a un giocatore *perché* hai annullato la comparsa del suo veicolo, il suo messaggio in chat o simili, oppure per mostrare alcune informazioni sul tuo server.

Esempio:
```lua
function ChatHandler(player_id, player_name, msg)
    if string.match(msg, "darn") then
        MP.SendChatMessage(player_id, "Please do not use profanity.") -- If the player sends a message containing "darn", notify the player and cancel the message
        return 1
    else
        return 0
    end
end

MP.RegisterEvent("onChatMessage", "ChatHandler")
```
Esempio 2:
```lua
function ChatHandler(player_id, player_name, msg)
    if msg == "hello" then
        MP.SendChatMessage(-1, "Hello World!") -- If the player sends the exact message "hello", announce to the entire server "Hello World!"
        return 0
    end
end
```
### `MP.TriggerClientEvent(player_id: number, event_name: string, data: string) -> boolean`
*fino alla v3.1.0*

### `MP.TriggerClientEvent(player_id: number, event_name: string, data: string) -> boolean,string`
*dalla v3.1.0*

### `MP.TriggerClientEventJson(player_id: number, event_name: string, data: table) -> boolean,string`
*dalla v3.1.0*

Chiamerà l'evento indicato con i dati indicati sul client specificato (-1 per inviarlo a tutti). Questo evento può poi essere gestito in una mod Lua lato client; vedi la documentazione "Client Scripting".

Restituirà `true` se è riuscita a inviare il messaggio (per `id = -1`, cioè per l'invio a tutti, è sempre `true`) e `false` se il giocatore con quell'ID non esiste o si è disconnesso ma ha ancora un ID (è un problema noto).

Se viene restituito `false`, non ha senso ritentare questo evento, e non bisogna aspettarsi una risposta (se ne era attesa una).

Dalla v3.1.0, il secondo valore restituito contiene un messaggio di errore se la funzione è fallita. Sempre da questa versione, la versione `*Json` della funzione accetta una tabella come argomento dei dati e la converte in json. È semplicemente una scorciatoia per `MP.TriggerClientEvent(..., Util.JsonEncode(mytable))`.

### `MP.GetPlayerCount() -> number`

Restituisce il numero di giocatori attualmente nel server.

### `MP.GetPositionRaw(pid: number, vid: number) -> table,string`

Restituisce la posizione attuale del veicolo `vid` (ID del veicolo) del giocatore `pid` (ID del giocatore), e una stringa di errore se si è verificato un errore.

La tabella è decodificata da un pacchetto di posizione, quindi contiene una varietà di dati tra cui posizione e rotazione (per questo la funzione ha il suffisso "Raw").

Esempio:
```lua
local player_id = 4
local vehicle_id = 0

local raw_pos, error = MP.GetPositionRaw(player_id, vehicle_id)

if error == "" then
    print(raw_pos)
else
    print(error)
end
```
Output:
```json
 {
    tim: 49.824, // Time since spawn
    rvel: { // Rotational velocity
            1: -1.33564e-05,
            2: -9.16553e-06,
            3: 8.33364e-07,
    }, 
    vel: { // Velocity
            1: -4.29755e-06,
            2: -5.79335e-06,
            3: 4.95236e-06,
    },
    pos: { // Position
            1: 269.979,
            2: -759.068,
            3: 46.554,
    },
    ping: 0.0125, // Vehicle latency
    rot: { // Rotation
            1: -0.00559953,
            2: 0.00894832,
            3: 0.772266,
            4: 0.635212,
    },
}
```
Esempio 2:
```lua
local player_id = 4
local vehicle_id = 0

local raw_pos, error = MP.GetPositionRaw(player_id, vehicle_id)
if error = "" then
    local x, y, z = table.unpack(raw_pos["pos"])

    print("X:", x)
    print("Y:", y)
    print("Z:", z)
else
    print(error)
end
```
Output:
```
X: -603.459
Y: -175.078
Z: 26.9505
```
### `MP.IsPlayerConnected(player_id: number) -> boolean`

Indica se il giocatore è connesso e se il server ha ricevuto un pacchetto UDP da lui.

Esempio:
```lua
local player_id = 8
print(MP.IsPlayerConnected(player_id)) -- Check if player with ID 8 is properly connected.
```
Output:
```lua
true
```
### `MP.GetPlayerName(player_id: number) -> string`

Ottiene il nome visualizzato del giocatore.

Esempio:
```lua
local player_id = 4
print(MP.GetPlayerName(player_id)) -- Get the name of the player with ID 4
```
Output:
```
ilovebeammp2004
```
### `MP.RemoveVehicle(player_id: number, vehicle_id: number)`

Rimuove il veicolo specificato del giocatore specificato.

Esempio:
```lua
local player_id = 3
local player_vehicles = MP.GetPlayerVehicles(player_id)

-- Loop over all of player 3's vehicles and delete them
for vehicle_id, vehicle_data in pairs(player_vehicles) do
      MP.RemoveVehicle(player_id, vehicle_id)
end
```
### `MP.GetPlayerVehicles(player_id: number) -> table`

Restituisce una tabella con tutti i veicoli che il giocatore ha al momento. Ogni voce della tabella associa un ID di veicolo ai dati del veicolo (che al momento sono una stringa json grezza).

Esempio:
```lua
local player_id = 3
local player_vehicles = MP.GetPlayerVehicles(player_id)

for vehicle_id, vehicle_data in pairs(player_vehicles) do
    local start = string.find(vehicle_data, "{")
    local formattedVehicleData = string.sub(vehicle_data, start, -1)
    print(Util.JsonDecode(formattedVehicleData))
end
```
Output:
```json
{
    pid: 0,
    pro: "0",
    rot: {
            1: 0,
             2: 0,
            3: 0.776866,
            4: 0.629665,
    },
    jbm: "miramar",
    vcf: {
            parts: {
                    miramar_exhaust: "miramar_exhaust",
                    miramar_shock_R: "miramar_shock_R",
                    miramar_taillight: "miramar_taillight",
                    miramar_door_RL: "miramar_door_RL"
                    // ... continue
            },
            paints: {
                    1: {
                            roughness: 1,
                            metallic: 0,
                            clearcoat: 1,
                            baseColor: {
                                    1: 0.85,
                                    2: 0.84,
                                    3: 0.8,
                                    4: 1.2,
                            },
                            clearcoatRoughness: 0.09,
                    } // ... continue
            },
            partConfigFilename: "vehicles/miramar/base_M.pc",
            vars: {},
            mainPartName: "miramar",
    },
    pos: {
            1: 283.669,
            2: -754.332,
            3: 48.2151,
    },
    vid: 64822,
    ign: 0,
}
```
### `MP.GetPlayers() -> table`

Restituisce una tabella con tutti i giocatori connessi. Questa tabella associa gli ID ai nomi, così:  
```json
{
	0: "LionKor",
	1: "JohnDoe"
}
```
### `MP.IsPlayerGuest(player_id: number) -> boolean`

Indica se il giocatore è un ospite. Un ospite è qualcuno che non ha effettuato l'accesso e ha scelto di giocare come ospite. Il suo nome di solito è `guest` seguito da un lungo numero.

Poiché gli ospiti sono anonimi, potresti voler impedire loro di entrare; in tal caso si consiglia di usare invece l'argomento `is_guest` di [`onPlayerAuth`](#onplayerauth).

### `MP.DropPlayer(player_id: number, [reason: string])`

Espelle (kick) il giocatore con l'ID specificato. Il parametro reason è facoltativo.
```lua
function ChatHandler(player_id, player_name, message)
    if string.match(message, "darn") then
        MP.DropPlayer(player_id, "Profanity is not allowed")
        return 1
    else
        return 0
    end
end 
```
### `MP.GetStateMemoryUsage() -> number`

Restituisce l'uso di memoria dello stato Lua corrente, in byte.

### `MP.GetLuaMemoryUsage() -> number` 

Restituisce l'uso di memoria di tutti gli stati Lua combinati, in byte.

### `MP.GetPlayerIdentifiers(player_id: number) -> table`

Restituisce una tabella con informazioni sul giocatore, come l'ID del forum BeamMP, l'indirizzo IP e l'ID dell'account Discord. L'ID Discord viene restituito solo se l'utente lo ha collegato al proprio account del forum.

Puoi trovare l'ID forum di un utente andando su `https://forum.beammp.com/u/USERNAME.json` e cercando `"user": {"id": 123456}`. Un ID BeamMP è unico per il giocatore e, a differenza del nome utente, non può essere cambiato.

Esempio:
```lua
local player_id = 5
print(MP.GetPlayerIdentifiers(player_id))
```
Output:
```json
{
    ip: "127.0.0.1",
    discord: "12345678987654321",
    beammp: "1234567",
}
```
*Fino alla v3.1.0 il campo `ip` è errato e non funziona come previsto. Corretto nella v3.1.0.*

### `MP.Set(setting: number, ...)`

Imposta temporaneamente un'impostazione di ServerConfig. Per questo è utile la tabella `MP.Settings`.

Esempio:
```lua
MP.Set(MP.Settings.Debug, true) -- Turns on debug mode
```
### `MP.Settings -> table`

Tabella che associa gli ID delle impostazioni ai nomi. Si usa con `MP.Set` per cambiare le impostazioni di ServerConfig. 

Esempio:
```lua
print(MP.Settings)
```
Output:
```json
{
    MaxPlayers: 3,
    Debug: 0,
    Name: 5,
    Description: 6,
    MaxCars: 2,
    Private: 1,
    Map: 4,
}
```
## Funzioni Util

### `Util.Json*`

Dalla versione `v3.1.0` di BeamMP-Server.

È una libreria JSON integrata, di solito molto più veloce di qualsiasi libreria JSON per Lua. Dietro le quinte viene usata la libreria `nlohmann::json` di C++, conforme a JSON, con unit test a copertura completa e sottoposta continuamente a fuzzing.

### `Util.JsonEncode(table: table) -> string`

Codifica una tabella Lua in una stringa JSON, in modo ricorsivo (le tabelle dentro le tabelle dentro le tabelle ... funzionano come previsto). Tutti i tipi primitivi vengono rispettati; funzioni, userdata e simili vengono ignorati.

Il JSON risultante è minificato e si può formattare in modo leggibile con `Util.JsonPrettify`.

Esempio: 
```lua
local player = {
	name = "Lion",
	age = 69,
	skills = { "skill A", "skill B" }
}
local json = Util.JsonEncode(player)
```
Risultato: 
```json
{"name":"Lion","age":69,"skills":["skill A","skill B"]}
```
### `Util.JsonDecode(json: string) -> table`

Decodifica un JSON in una tabella Lua. Restituirà `nil` se fallisce e stamperà un errore.

Esempio:
```lua
local json = "{\"message\":\"OK\",\"code\":200}"
local tbl = Util.JsonDecode(json)
```
Risultato:
```lua
{
	message = "OK",
	code = 200,
}
```
### `Util.JsonPrettify(json: string) -> string`

Aggiunge indentazione e a capo al json per renderlo più leggibile per le persone.

Esempio:
```
local myjson = Util.JsonEncode({ name="Lion", age = 69, skills = { "skill A", "skill B" } })

print(Util.JsonPrettify(myjson))
```
Risultato:
```json
{
    "age": 69.0,
    "name": "Lion",
    "skills": [
        "skill A",
        "skill B"
    ]
}
```
### `Util.JsonMinify(json: string) -> string`

Rimuove indentazione, a capo e qualsiasi altro spazio vuoto. Non serve, a meno che tu non abbia chiamato `Util.JsonPrettify`, dato che tutto l'output di `Util.Json*` è già minificato.

Esempio:
```lua
local pretty = Util.JsonPrettify(Util.JsonEncode({ name="Lion", age = 69, skills = { "skill A", "skill B" } }))

print(Util.JsonMinify(pretty))
```
Risultato:
```json
{"age":69.0,"name":"Lion","skills":["skill A","skill B"]}
```
### `Util.JsonFlatten(json: string) -> string`

Crea un oggetto JSON le cui chiavi sono appiattite in puntatori JSON, secondo la RFC 6901. Puoi ripristinare l'originale con `Util.JsonUnflatten()`. Perché funzioni, tutti i valori devono essere primitivi.

Esempio:
```lua
local json = Util.JsonEncode({ name="Lion", age = 69, skills = { "skill A", "skill B" } })
print("normal: " ..json)
print("flattened: " .. Util.JsonFlatten(json))
print("flattened pretty: " .. Util.JsonPrettify(Util.JsonFlatten(json)))

```
Risultato: 
```json
normal: {"age":69.0,"name":"Lion","skills":["skill A","skill B"]}
flattened: {"/age":69.0,"/name":"Lion","/skills/0":"skill A","/skills/1":"skill B"}
flattened pretty: {
    "/age": 69.0,
    "/name": "Lion",
    "/skills/0": "skill A",
    "/skills/1": "skill B"
}
```
### `Util.JsonUnflatten(json: string) -> string`

Ripristina l'annidamento arbitrario di un valore JSON che era stato appiattito in precedenza con la funzione `Util.JsonFlatten()`. 

### `Util.JsonDiff(a: string, b: string) -> string`

Crea un diff JSON secondo la RFC 6902 (http://jsonpatch.com/). Questo diff può poi essere applicato come patch con `Util.JsonDiffApply()`. Restituisce il diff.

### `Util.JsonDiffApply(base: string, diff: string) -> string`

Applica il `diff` JSON a `base` come patch JSON (RFC 6902, http://jsonpatch.com/). Restituisce il risultato.

## `Util.Random*`

Dalla versione `v3.1.0` di BeamMP-Server.

### `Util.Random() -> float`

Restituisce un float tra 0 e 1.

Esempio:
```lua
local rand = Util.Random()
print("rand: " .. rand)
```
Risultato: 
```lua
rand: 0.135477
```
### `Util.RandomIntRange(min: int, max: int) -> int`

Restituisce un intero tra min e max.

Esempio:
```lua
local randInt = Util.RandomIntRange(1, 100)
print("randInt: " .. randInt)
```
Risultato: 
```lua
randInt:  69
```
### `Util.RandomRange(min: number, max: number) -> float`

Restituisce un float tra min e max.

Esempio:
```lua
local randFloat = Util.RandomRange(1, 1000)
print("randFloat: " .. randFloat)
```
Risultato: 
```lua
randFloat: 420.6969
```
### `Util.LogInfo(params: ...)` e simili (dalla v3.3.0)
```lua
Util.LogInfo("Hello, World!")
Util.LogWarn("Cool warning")
Util.LogError("Oh no!")
Util.LogDebug("hi")
```
produce
```
[19/04/24 11:06:50.142] [Test] [INFO] Hello, World!    
[19/04/24 11:06:50.142] [Test] [WARN] Cool warning    
[19/04/24 11:06:50.142] [Test] [ERROR] Oh no!
[19/04/24 11:06:50.142] [Test] [DEBUG] hi
```
Supporta esattamente la stessa stampa / lo stesso dump dei dati di `print()`.

### `Util.DebugExecutionTime() -> table`

Quando il codice Lua gira nel server, l'esecuzione di ogni handler di evento viene cronometrata. Il minimo, il massimo, la media e la deviazione standard di questi tempi di esecuzione vengono calcolati e restituiti in una tabella da questa funzione. Il calcolo avviene in modo incrementale, quindi ogni volta che un handler di evento viene eseguito, minimo, massimo, media e deviazione standard vengono aggiornati. In questo modo `Util.DebugExecutionTime()` di solito non richiede un tempo significativo per essere eseguita (meno di 0,25 ms).

Restituisce una tabella come questa:
```lua
[[table: 0x7af6d400aca0]]: {
	printStuff: [[table: 0x7af6d400be60]]: {
		mean: 0.250433,
		n: 76,
		max: 0.074475,
		stdev: 0.109405,
		min: 0.449274,
	},
	onInit: [[table: 0x7af6d400b130]]: {
		mean: 0.033095,
		n: 1,
		max: 0.033095,
		stdev: 0,
		min: 0.033095,
	},
}	
```
Per ogni *handler*, restituisce i seguenti dati:

- `n`: numero di volte in cui l'evento è stato scatenato e un handler è stato chiamato
- `mean`: media di tutti i tempi di esecuzione, in ms
- `max`: il tempo di esecuzione più lungo, in ms
- `min`: il tempo di esecuzione più breve, in ms
- `stdev`: la deviazione standard di tutte le medie dei tempi di esecuzione, in ms

Ecco una funzione che puoi usare per stampare questi dati in modo leggibile:
```lua
function printDebugExecutionTime()
    local stats = Util.DebugExecutionTime()
    local pretty = "DebugExecutionTime:\n"
    local longest = 0
    for name, t in pairs(stats) do
        if #name > longest then
            longest = #name
        end
    end
    for name, t in pairs(stats) do
        pretty = pretty .. string.format("%" .. longest + 1 .. "s: %12f +/- %12f (min: %12f, max: %12f) (called %d time(s))\n", name, t.mean, t.stdev, t.min, t.max, t.n)
    end
    print(pretty)
end
```
Puoi chiamarla così per fare il debug del tuo codice se è lento:
```lua
-- event to print the debug times
MP.RegisterEvent("printStuff", "printDebugExecutionTime")
-- run every 5000 ms = 5 seconds (or 10, or 60, whatever makes sense for you
MP.CreateEventTimer("printStuff", 5000)
```
## Funzioni FS

Le funzioni `FS` sono funzioni per il **f**ile**s**ystem, pensate per essere migliori delle funzionalità predefinite di Lua.

Usa sempre `/` come separatore quando specifichi i percorsi, perché è multipiattaforma (windows, linux, macos, ...).

### `FS.CreateDirectory(path: string) -> bool,string`


Crea la cartella specificata e tutte le cartelle superiori se non esistono. Il comportamento è all'incirca equivalente al comune comando linux `mkdir -p`.

In caso di successo restituisce `true` e `""`. Se la creazione della cartella fallisce, restituisce `false` e un messaggio di errore (`string`).

Esempio:
```lua
local success, error_message = FS.CreateDirectory("data/mystuff/somefolder")

if not success then
	print("failed to create directory: " .. error_message)
else
	-- do something with the directory
end

-- Be careful not to do this! This will ALWAYS be true!
if error_message then
	-- ...
end
```
### `FS.Remove(path: string) -> bool,string`

Rimuove il file o la cartella specificati.

Restituisce `true` se si è verificato un errore, con un messaggio di errore nel secondo valore restituito.

Esempio:
```lua
local error, error_message = FS.Remove("myfile.txt")

if error then
	print("failed to delete myfile: " .. error_message)
end
```
### `FS.Rename(pathA: string, pathB: string) -> bool,string`

Rinomina (o sposta) `pathA` in `pathB`.

Restituisce `true` se si è verificato un errore, con un messaggio di errore nel secondo valore restituito.

### `FS.Copy(pathA: string, pathB: string) -> bool,string`

Copia `pathA` in `pathB`.

Restituisce `true` se si è verificato un errore, con un messaggio di errore nel secondo valore restituito.

### `FS.GetFilename(path: string) -> string`

Restituisce l'ultima parte di un percorso, che di solito è il nome del file.
Ecco alcuni esempi di input e output:
```lua
input -> output

"my/path/a.txt" 	-> "a.txt"
"somefile.txt" 		-> "somefile.txt"
"/awesome/path" 	-> "path"
```
### `FS.GetExtension(path: string) -> string`


Restituisce l'estensione del file, o una stringa vuota se non esiste alcuna estensione.
Ecco alcuni esempi di input e output
```lua
input -> output

"myfile.txt" 					-> ".txt"
"somefile." 					-> "."
"/awesome/path" 				-> ""
"/awesome/path/file.zip.txt"	-> ".txt"
"myexe.exe" 					-> ".exe"
```
### `FS.GetParentFolder(path: string) -> string`

Restituisce il percorso della cartella superiore, cioè la cartella che contiene un file o una cartella.
Ecco alcuni esempi di input e output:
```lua
input -> output

"/var/tmp/example.txt" 		-> "/var/tmp"
"/"							-> "/"
"mydir/a/b/c.txt"			-> "mydir/a/b"
```
### `FS.Exists(path: string) -> bool`

Restituisce `true` se il percorso esiste, `false` se non esiste.

### `FS.IsDirectory(path: string) -> bool`

Restituisce `true` se il percorso specificato è una cartella, `false` se non lo è. Nota che `false` NON implica che il percorso sia un file (vedi `FS.IsFile()`).

### `FS.IsFile(path: string) -> bool`

Restituisce `true` se il percorso specificato è un file normale (non un symlink, hardlink, dispositivo a blocchi, ecc.), `false` se non lo è. Nota che `false` NON implica che il percorso sia una cartella (vedi `FS.IsDirectory()`).

### `FS.ListDirectories(path: string) -> table`

Restituisce una tabella con tutte le cartelle presenti nel percorso indicato.

Esempio:
```lua
print(FS.ListDirectories("Resources"))
```
Risultato: 
```lua
{
    1: "Client",
    2: "Server"
}
```
### `FS.ListFiles(path: string) -> table`

Restituisce una tabella con tutti i file presenti nel percorso indicato.

Esempio:
```lua
print(FS.ListFiles("Resources/Server/examplePlugin"))
```
Risultato: 
```lua
{
    1: "example.json",
    2: "example.lua"
}
```
### `FS.ConcatPaths(...) -> string`

Somma (concatena) tutti gli argomenti usando il separatore di percorso preferito dal sistema.

Esempio:
```lua  
FS.ConcatPaths("a", "b", "/c/d/e/", "/f/", "g", "h.txt")
```
risulta in
```
a/b/c/d/e/f/g/h.txt
```
Risolve anche `..`, se è presente in un punto qualsiasi del percorso. Questa funzione è più sicura della concatenazione di stringhe in lua e rispetta i separatori della piattaforma.

Usa sempre `/` come separatore quando specifichi i percorsi, perché è multipiattaforma (windows, linux, macos, ...).

## Eventi {#events-1}

### Spiegazione

- Argomenti: l'elenco degli argomenti passati agli handler di questo evento
- Annullabile: indica se l'evento può essere annullato. Se può essere annullato, un handler può farlo restituendo `1`, ad esempio `return 1`.

### Riepilogo degli eventi

L'ingresso di un giocatore scatena i seguenti eventi, in quest'ordine:

1. `onPlayerAuth`
2. `onPlayerConnecting`
3. `onPlayerJoining`
4. `onPlayerJoin`

### Eventi di sistema

#### `onInit`

Argomenti: NESSUNO
Annullabile: NO

Scatenato subito dopo che tutti i file del plugin sono stati inizializzati.

#### `onConsoleInput`

Argomenti: `input: string`
Annullabile: NO

Scatenato quando la console di BeamMP riceve un input.

#### `onShutdown`

Argomenti: NESSUNO
Annullabile: NO

Scatenato quando il server si arresta. Al momento avviene dopo che tutti i giocatori sono stati espulsi.

### Eventi legati al gioco

#### `onPlayerAuth`

Argomenti: `player_name: string`, `player_role: string`, `is_guest: bool`, `identifiers: table -> beammp, ip`
Annullabile: SÌ

Il primo evento scatenato quando un giocatore vuole entrare. Si può impedire a un giocatore di entrare restituendo `1` o un motivo (`string`) dalla funzione handler.
```lua
function myPlayerAuthorizer(name, role, is_guest, identifiers)
	return "Sorry, you cannot join at this time."
end
MP.RegisterEvent("onPlayerAuth", "myPlayerAuthorizer")
```
#### `onPlayerConnecting`

Argomenti: `player_id: number`
Annullabile: NO

Scatenato quando un giocatore inizia a connettersi, dopo `onPlayerAuth`.

#### `onPlayerJoining`

Argomenti: `player_id: number`
Annullabile: NO

Scatenato quando un giocatore ha finito di caricare tutte le mod, dopo `onPlayerConnecting`.

#### `onPlayerDisconnect`

Argomenti: `player_id: number`
Annullabile: NO

Scatenato quando un giocatore si disconnette.

#### `onChatMessage`

Argomenti: `player_id: number`, `player_name: string`, `message: string`
Annullabile: SÌ

Scatenato quando un giocatore invia un messaggio in chat. Se viene annullato, il messaggio non viene mostrato a nessuno, nemmeno al giocatore che lo ha inviato.

#### `onVehicleSpawn`

Argomenti: `player_id: number`, `vehicle_id: number`, `data: string`
Annullabile: SÌ

Scatenato quando un giocatore fa comparire un nuovo veicolo. Nota che gli scambi/le sostituzioni di veicolo scatenano invece [`onVehicleEdited`](#onvehicleedited). L'argomento `data` contiene, come stringa json, la configurazione del veicolo e i suoi dati di posizione e rotazione.

<details>

<summary>Esempio di valore di <code>data</code></summary>

La stringa data inizia con un identificatore univoco del veicolo, composto dall'ID del giocatore, un trattino e poi l'ID del veicolo. Segue un oggetto JSON con le informazioni sulla configurazione e sul posizionamento del veicolo.
```
0-0: {
    "abs": "realistic",
    "ign": 3,
    "jbm": "van",
    "pid": 0,
    "pos": [
        907.93902587891,
        773.50201416016,
        238.87800598145
    ],
    "pro": "0",
    "rot": [
        0,
        0,
        0.99999994039536,
        0
    ],
    "vcf": {
        "licenseName": "H30 9VV",
        "mainPartName": "van",
        "mainPartPath": "/van",
        "model": "van",
        "paints": [
            {
                "baseColor": [
                    0.21999999880791,
                    0.37000000476837003,
                    0.33000001311302,
                    1.2000000476837
                ],
                "clearcoat": 0,
                "clearcoatRoughness": 0,
                "metallic": 0,
                "roughness": 0.070000000298023
            },
            {
                "baseColor": [
                    0.62300002574921,
                    0.62300002574921,
                    0.62300002574921,
                    1.2000000476837
                ],
                "clearcoat": 0.80000001192093,
                "clearcoatRoughness": 0.070000000298023,
                "metallic": 0.80000001192093,
                "roughness": 0.64999997615814
            },
            {
                "baseColor": [
                    0.21999999880791,
                    0.37000000476837003,
                    0.33000001311302,
                    1.2000000476837
                ],
                "clearcoat": 0,
                "clearcoatRoughness": 0,
                "metallic": 0,
                "roughness": 0.070000000298023
            }
        ],
        "partConfigFilename": "vehicles/van/h15_xt_passenger.pc",
        "parts": {
            "brakepad_F": "brakepad_F_premium",
            "brakepad_R": "brakepad_R_premium",
            "gps": "",
            "licenseplate_design_2_1": "",
            "linelock": "",
            "load_seat_FR": "",
            "n2o_system": "",
            "paint_design": "van_skin_twotone",
            "pickup_engine_v8_ecu": "pickup_engine_v8_ecu",
            "pickup_engine_v8_internals": "pickup_engine_v8_internals",
            "pickup_enginemounts": "pickup_enginemounts",
            "pickup_oilpan_v8": "pickup_oilpan_v8",
            "pickup_reversewarn": "",
            "pickup_sparetire": "pickup_sparetire_5l",
            "pickup_towhitch": "",
            "skin_glass": "van_skin_glass_tint",
            "skin_interior": "van_skin_interior_black",
            "soundscape_horn": "soundscape_horn_115",
            "tire_F_16x7_alt": "tire_F_225_75_16_alt_standard",
            "tire_R_16x7_alt": "tire_R_225_75_16_alt_standard",
            "van_ABS": "van_ABS",
            "van_ESC": "",
            "van_ac": "van_ac",
            "van_body": "van_body_passenger",
            "van_brake_F": "van_brake_F",
            "van_brake_R": "van_brake_R_drum",
            "van_bumper_F": "van_bumper_F_altb",
            "van_bumper_F_lip": "",
            "van_bumper_R": "van_bumper_R_altb",
            "van_bumper_accessory_F": "",
            "van_bumpersignal_FL": "van_bumpersignal_FL",
            "van_bumpersignal_FR": "van_bumpersignal_FR",
            "van_coilover_IFS": "van_coilover_IFS",
            "van_converter": "van_converter",
            "van_differential_F": "",
            "van_differential_R": "van_differential_R",
            "van_door_FL": "van_door_FL",
            "van_door_FR": "van_door_FR",
            "van_doordetent_FL": "van_doordetent_FL",
            "van_doordetent_FR": "van_doordetent_FR",
            "van_doordetent_RL": "van_doordetent_RL",
            "van_doordetent_RR": "van_doordetent_RR",
            "van_doorglass_L": "van_doorglass_L",
            "van_doorglass_R": "van_doorglass_R",
            "van_doorpanel_FL": "van_doorpanel_FL",
            "van_doorpanel_FR": "van_doorpanel_FR",
            "van_driveshaft_R": "van_driveshaft_R",
            "van_engine": "van_engine_v8_4.5",
            "van_exhaust_v8": "van_exhaust_v8",
            "van_fascia_F": "van_fascia_F_high",
            "van_fender_L": "van_fender_L",
            "van_fender_R": "van_fender_R",
            "van_fenderflare_FL": "",
            "van_fenderflare_FR": "",
            "van_fenderflare_RL": "",
            "van_fenderflare_RR_sidedoor": "",
            "van_finaldrive_R": "van_finaldrive_R_355",
            "van_frame": "van_frame",
            "van_fueltank": "van_fueltank",
            "van_header": "van_exhmanifold",
            "van_headlight_L_high": "van_headlight_L_high",
            "van_headlight_R_high": "van_headlight_R_high",
            "van_hood": "van_hood",
            "van_hub_F": "van_hub_F_5",
            "van_hub_R": "van_hub_R_5",
            "van_intake_v8": "van_intake_v8",
            "van_intcarpet_roof": "van_intcarpet_roof",
            "van_interior": "van_interior",
            "van_lettering_doors_F": "van_lettering_doors_F_h15",
            "van_lettering_reardoor_L": "van_lettering_gavril_reardoor_L",
            "van_lettering_reardoor_R": "van_lettering_h15_xt_reardoor_R",
            "van_licenseplate_F": "van_licenseplate_F",
            "van_licenseplate_R": "van_licenseplate_R",
            "van_lightbar": "",
            "van_mirror_L": "van_mirror_L",
            "van_mirror_R": "van_mirror_R",
            "van_mod": "",
            "van_muffler": "van_muffler",
            "van_power_steering": "",
            "van_radiator": "van_radiator",
            "van_radio": "van_radio",
            "van_reardoor_L": "van_reardoor_L",
            "van_reardoor_R": "van_reardoor_R",
            "van_reardoorglass_L": "van_reardoorglass_L",
            "van_reardoorglass_R": "van_reardoorglass_R",
            "van_reardoorpanel_L": "van_reardoorpanel_L",
            "van_reardoorpanel_R": "van_reardoorpanel_R",
            "van_rollcage": "",
            "van_roof": "van_roof",
            "van_roof_accessory": "",
            "van_runningboard": "",
            "van_seat_1R": "van_seat_1R",
            "van_seat_2R": "van_seat_2R",
            "van_seat_3R": "van_seat_3R",
            "van_seat_FL": "van_seat_FL",
            "van_seat_FR": "van_seat_FR",
            "van_shifter": "van_shifter_A",
            "van_shock_R": "van_shock_R",
            "van_sidedoor_FR": "van_sidedoor_FR_alt",
            "van_sidedoor_RR": "van_sidedoor_RR_alt",
            "van_sidedoorglass_FR": "van_sidedoorglass_FR",
            "van_sidedoorglass_RR": "van_sidedoorglass_RR",
            "van_sidedoorpanel_FR": "van_sidedoorpanel_FR",
            "van_sidedoorpanel_RR": "van_sidedoorpanel_RR",
            "van_sideglass_FL": "van_sideglass_FL",
            "van_sideglass_ML": "van_sideglass_ML",
            "van_sideglass_RL": "van_sideglass_RL",
            "van_sideglass_RR": "van_sideglass_RR",
            "van_snorkel": "",
            "van_spring_R": "van_spring_R",
            "van_steer": "van_steer",
            "van_steering": "van_steering",
            "van_suspension_F": "van_IFS",
            "van_suspension_R": "van_axle_R",
            "van_swaybar_F": "van_swaybar_F",
            "van_swaybar_R": "",
            "van_taillight_L": "van_taillight_L",
            "van_taillight_R": "van_taillight_R",
            "van_taillightguard_L": "",
            "van_taillightguard_R": "",
            "van_transfer_case": "van_transfer_case_RWD",
            "van_transmission": "van_transmission_4A",
            "van_tubs": "van_tubs",
            "van_valance_F": "van_valance_F",
            "van_wheeldata_F": "van_wheeldata_F",
            "van_wheeldata_R": "van_wheeldata_R",
            "van_windshield": "van_windshield",
            "wheel_F_5": "wheel_25a_16x7_5_F",
            "wheel_R_5": "wheel_25a_16x7_5_R"
        },
        "vars": {}
    },
    "vid": 29339
}
```
</details>

#### `onVehicleEdited`

Argomenti: `player_id: number`, `vehicle_id: number`, `data: string`
Annullabile: SÌ

Scatenato quando un giocatore modifica o sostituisce il proprio veicolo. L'argomento `data` contiene, come stringa json, la configurazione aggiornata del veicolo, ma **non** include i dati di posizione o rotazione. Puoi usare [MP.GetPositionRaw](#mp-getpositionraw-pid-number-vid-number-table-string) per ottenere i dati di posizione e rotazione.

<details>

<summary>Esempio di valore di <code>data</code></summary>

La stringa data inizia con un identificatore univoco del veicolo, composto dall'ID del giocatore, un trattino e poi l'ID del veicolo. Segue un oggetto JSON con le informazioni sulla configurazione del veicolo.
```
0-0: {
  "abs": "realistic",
  "ign": 3,
  "jbm": "van",
  "pid": 0,
  "pro": "0",
  "vcf": {
    "licenseName": "P60 1EP",
    "mainPartName": "van",
    "mainPartPath": "/van",
    "model": "van",
    "paints": [
      {
        "baseColor": [
          0.40000000596046,
          0.050000000745058,
          0.050000000745058,
          1.2000000476837
        ],
        "clearcoat": 0,
        "clearcoatRoughness": 0,
        "metallic": 0,
        "roughness": 0.070000000298023
      },
      {
        "baseColor": [
          0.40000000596046,
          0.050000000745058,
          0.050000000745058,
          1.2000000476837
        ],
        "clearcoat": 0,
        "clearcoatRoughness": 0,
        "metallic": 0,
        "roughness": 0.070000000298023
      },
      {
        "baseColor": [
          0.40000000596046,
          0.050000000745058,
          0.050000000745058,
          1.2000000476837
        ],
        "clearcoat": 0,
        "clearcoatRoughness": 0,
        "metallic": 0,
        "roughness": 0.070000000298023
      }
    ],
    "partConfigFilename": "vehicles/van/h15_passenger.pc",
    "parts": {
      "brakepad_F": "brakepad_F_premium",
      "brakepad_R": "brakepad_R_premium",
      "gps": "",
      "hubcap_F_16": "hubcap_09c_F_altd",
      "hubcap_R_16": "hubcap_09c_R_altd",
      "licenseplate_design_2_1": "",
      "linelock": "",
      "load_seat_FR": "",
      "n2o_system": "",
      "paint_design": "",
      "pickup_engine_v8_ecu": "pickup_engine_v8_ecu_late",
      "pickup_engine_v8_internals": "pickup_engine_v8_internals",
      "pickup_enginemounts": "pickup_enginemounts",
      "pickup_oilpan_v8": "pickup_oilpan_v8",
      "pickup_reversewarn": "",
      "pickup_sparetire": "pickup_sparetire_6l",
      "pickup_towhitch": "",
      "skin_glass": "",
      "skin_interior": "van_skin_interior_ivory",
      "soundscape_horn": "soundscape_horn_115",
      "tire_F_16x7_alt": "tire_F_225_75_16_alt_standard",
      "tire_R_16x7_alt": "tire_R_225_75_16_alt_standard",
      "trimring_F_16x7": "",
      "trimring_R_16x7": "",
      "van_ABS": "van_ABS",
      "van_ac": "van_ac",
      "van_body": "van_body_passenger",
      "van_brake_F": "van_brake_F",
      "van_brake_R": "van_brake_R",
      "van_bumper_accessory_F_late": "",
      "van_bumper_F": "van_bumper_F_late_alt",
      "van_bumper_F_lip_late": "",
      "van_bumper_R": "van_bumper_R_late_alt",
      "van_coilover_IFS": "van_coilover_IFS",
      "van_converter": "van_converter",
      "van_differential_F": "",
      "van_differential_R": "van_differential_R",
      "van_door_FL": "van_door_FL",
      "van_door_FR": "van_door_FR",
      "van_doordetent_FL": "van_doordetent_FL",
      "van_doordetent_FR": "van_doordetent_FR",
      "van_doordetent_RL": "van_doordetent_RL",
      "van_doordetent_RR": "van_doordetent_RR",
      "van_doorglass_L": "van_doorglass_L",
      "van_doorglass_R": "van_doorglass_R",
      "van_doorpanel_FL": "van_doorpanel_FL",
      "van_doorpanel_FR": "van_doorpanel_FR",
      "van_driveshaft_R": "van_driveshaft_R",
      "van_engine": "van_engine_v8_4.5",
      "van_ESC": "van_ESC",
      "van_exhaust_v8": "van_exhaust_v8",
      "van_fascia_F": "van_fascia_F_late",
      "van_fender_L": "van_fender_L",
      "van_fender_R": "van_fender_R",
      "van_fenderflare_FL": "",
      "van_fenderflare_FR": "",
      "van_fenderflare_RL": "",
      "van_fenderflare_RR_sidedoor": "",
      "van_finaldrive_R": "van_finaldrive_R_355",
      "van_frame": "van_frame",
      "van_fueltank": "van_fueltank",
      "van_grille_F_late": "van_grille_F_late",
      "van_header": "van_exhmanifold",
      "van_headlight_L_late": "van_headlight_L_late",
      "van_headlight_R_late": "van_headlight_R_late",
      "van_hood": "van_hood_late",
      "van_hub_F": "van_hub_F_6",
      "van_hub_R": "van_hub_R_6",
      "van_intake_v8": "van_intake_v8_late",
      "van_intcarpet_roof": "van_intcarpet_roof",
      "van_interior": "van_interior",
      "van_lettering_doors_F": "van_lettering_doors_F_h15",
      "van_lettering_reardoor_L": "van_lettering_gavril_reardoor_L",
      "van_lettering_reardoor_R": "van_lettering_h15_reardoor_R",
      "van_licenseplate_F_late": "van_licenseplate_F_late",
      "van_licenseplate_R_late": "van_licenseplate_R_late",
      "van_lightbar": "",
      "van_mirror_L": "van_mirror_L",
      "van_mirror_R": "van_mirror_R",
      "van_mod": "",
      "van_muffler": "van_muffler",
      "van_power_steering": "",
      "van_radiator": "van_radiator",
      "van_radio": "van_radio",
      "van_reardoor_L": "van_reardoor_L",
      "van_reardoor_R": "van_reardoor_R",
      "van_reardoorglass_L": "van_reardoorglass_L",
      "van_reardoorglass_R": "van_reardoorglass_R",
      "van_reardoorpanel_L": "van_reardoorpanel_L",
      "van_reardoorpanel_R": "van_reardoorpanel_R",
      "van_rollcage": "",
      "van_roof": "van_roof",
      "van_roof_accessory": "",
      "van_runningboard": "",
      "van_seat_1R": "van_seat_1R",
      "van_seat_2R": "van_seat_2R",
      "van_seat_3R": "van_seat_3R",
      "van_seat_FL": "van_seat_FL",
      "van_seat_FR": "van_seat_FR",
      "van_shifter": "van_shifter_A",
      "van_shock_R": "van_shock_R",
      "van_sidedoor_FR": "van_sidedoor_FR_alt",
      "van_sidedoor_RR": "van_sidedoor_RR_alt",
      "van_sidedoorglass_FR": "van_sidedoorglass_FR",
      "van_sidedoorglass_RR": "van_sidedoorglass_RR",
      "van_sidedoorpanel_FR": "van_sidedoorpanel_FR",
      "van_sidedoorpanel_RR": "van_sidedoorpanel_RR",
      "van_sideglass_FL": "van_sideglass_FL",
      "van_sideglass_ML": "van_sideglass_ML",
      "van_sideglass_RL": "van_sideglass_RL",
      "van_sideglass_RR": "van_sideglass_RR",
      "van_snorkel": "",
      "van_spring_R": "van_spring_R",
      "van_steer": "van_steer_facelift",
      "van_steering": "van_steering",
      "van_suspension_F": "van_IFS",
      "van_suspension_R": "van_axle_R",
      "van_swaybar_F": "van_swaybar_F",
      "van_swaybar_R": "",
      "van_taillight_L": "van_taillight_L",
      "van_taillight_R": "van_taillight_R",
      "van_taillightguard_L": "",
      "van_taillightguard_R": "",
      "van_transfer_case": "van_transfer_case_RWD",
      "van_transmission": "van_transmission_4A",
      "van_tubs": "van_tubs",
      "van_valance_F": "van_valance_F_late",
      "van_wheeldata_F": "van_wheeldata_F",
      "van_wheeldata_R": "van_wheeldata_R",
      "van_windshield": "van_windshield",
      "wheel_F_6": "steelwheel_02b_16x7_F",
      "wheel_R_6": "steelwheel_02b_16x7_R"
    },
    "vars": {}
  }
}
```
</details>

#### `onVehicleDeleted`

Argomenti: `player_id: number`, `vehicle_id: number`
Annullabile: NO

Scatenato quando un giocatore elimina il proprio veicolo.

#### `onVehicleReset`

Argomenti: `player_id: number`, `vehicle_id: number`, `data: string`
Annullabile: NO

Scatenato quando un giocatore reimposta il proprio veicolo. `data` contiene la posizione e la rotazione aggiornate del veicolo, ma **non** include la sua configurazione. Puoi usare [MP.GetPlayerVehicles](#mp-getplayervehicles-player-id-number-table) per ottenere la configurazione del veicolo.

#### `onFileChanged`

*dalla v3.1.0*

Argomenti: `path: string`
Annullabile: NO

Scatenato se un file cambia nella cartella `Resources/Server` *o in una qualsiasi sua sottocartella*. 

Qualsiasi modifica a un file nella cartella `Resources/Server/<plugin>` (non in una sua sottocartella) provoca un ricaricamento dello stato Lua e un evento `onFileChanged`.

Qualsiasi file nelle sottocartelle di `Resources/Server/<plugin>`, come `Resources/Server/<plugin>/lua/stuff.lua`, non provoca un ricaricamento dello stato e scatena solo un evento `onFileChanged`. In questo modo puoi ricaricarlo tu stesso nel modo corretto (o non ricaricarlo).

Questo vale per tutti i file, non solo per i file `.lua`.

Il `path` è relativo alla radice del server, per esempio `Resources/Server/myplugin/myfile.txt`. Puoi elaborare ulteriormente questa stringa con la famiglia di funzioni `FS.*`, ad esempio per estrarre il nome o l'estensione (`FS.GetExtension(...)`, `FS.GetFilename(...)`, ...).

Nota: dalla v3.1.0, i file aggiunti dopo l'avvio del server *non* vengono tracciati.

## Migrare dal vecchio Lua {#migrating-from-old-lua}

Questa è una breve panoramica dei passaggi di base per migrare dal vecchio al nuovo lua.

### Capire come funziona il nuovo lua

Per questo, leggi con attenzione la sezione ["Introduzione"](#introduction) e tutte le sue sottosezioni.
È necessario per eseguire correttamente i passaggi successivi.

### Cerca e sostituisci

Per prima cosa, dovresti cercare e sostituire tutte le funzioni MP. La sostituzione deve aggiungere `MP.` davanti a tutte le funzioni MP, tranne `print()`.

Esempio:
```lua
local players = GetPlayers()
print(#players)
```
diventa
```lua
local players = MP.GetPlayers()
print(#players) -- note how print() doesn't change
```
### Addio thread, benvenuti timer di evento!

Come spiegato nell'introduzione, i thread sono timer di evento. Sostituisci ogni chiamata a `CreateThread` con una chiamata a `CreateEventTimer`. Controlla con attenzione la temporizzazione del tuo vecchio CreateThread (il numero era X volte al secondo) e pensa a quale valore di timeout, in millisecondi, corrisponde per il timer di evento. Tieni presente anche che, invece del nome di una funzione, accetta il nome di un evento, quindi dovrai registrare anche un evento.

Esempio:
```lua
CreateThread("myFunction", 2) -- calls "myFunction" twice per second
```
diventa
```lua
MP.RegisterEvent("myEvent", "myFunction") -- registering our event for the timer
MP.CreateEventTimer("myEvent", 500) -- 500 milliseconds = 2 times per second
```
Se hai molti timer di evento, ha senso vedere se puoi combinarli, ad esempio creando un evento "ogni minuto" e registrandovi più funzioni che devono essere chiamate ogni minuto, invece di avere più timer di evento. Ogni timer di evento costa al server un po' di tempo per scattare.

### Niente più chiamate implicite degli eventi

Devi registrare tutti i tuoi eventi. Non puoi fare affidamento sui nomi delle funzioni. Nel vecchio lua questo non era chiaro, ma nel nuovo lua viene di solito imposto. Un buon schema è: 
```lua
MP.RegisterEvent("onChatMessage", "chatMessageHandler")
-- or 
MP.RegisterEvent("onChatMessage", "handleChatMessage")
```
