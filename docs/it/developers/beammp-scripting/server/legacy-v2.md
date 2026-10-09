::: warning Questo sito è in costruzione!
Questo sito è in fase di sviluppo attivo. 

Pensi di poter aiutare? Fallo cliccando sull'icona della matita nella pagina a destra!

Si può fare su qualsiasi pagina.
:::

# Riferimento allo scripting del server
## Server versione 2.X
::: warning
La versione 2.X del server BeamMP non è più supportata. Questa documentazione è fornita solo come riferimento.
Aggiorna all'ultima versione per ricevere manutenzione e supporto.
:::
---

> Questo è lo scripting della 2.x. Consultalo solo se il tuo server è vecchio/obsoleto (versione 2.x.x). Per la documentazione più recente guarda [qui](https://docs.beammp.com/scripting/server/latest-server-reference).
{.is-warning}

### Note

Per ottenere l'output di una funzione nella console del server devi racchiuderla in un'istruzione `print()`.
Ad esempio:
`print(GetPlayerName(0))` restituirà il nome del primo giocatore del tuo server.

`<PlayersServerID>` parte da 0.

### Elenco delle funzioni disponibili per lo scripting

#### GetPlayerName(playersServerID)
Restituisce il nome Discord del giocatore come stringa
  ```lua
  function onPlayerJoin(playerID)
  	local name = GetPlayerName(playerID)
  	-- Do something
  end
  ```
#### GetPlayerDiscordID(playersServerID)
Restituisce il nome Discord del giocatore come stringa
  ```lua
  function onPlayerJoin(playerID)
  	local name = GetPlayerDiscordID(playerID)
  	-- Do something
  end
  ```
#### GetPlayerHWID(playersServerID)
Restituisce l'ID Discord del giocatore come stringa
  ```lua
  function onPlayerJoin(playerID)
  	local name = GetPlayerHWID(playerID)
  	-- Do something
  end
  ```
#### GetPlayerVehicles(playersServerID)
Restituisce i veicoli del giocatore come oggetto/array
  ```lua
  function onChatMessage(playerID, senderName, message)
  	local vehicleList = GetPlayerVehicles(playerID)
  	for vehicleID, vehicleData in pairs(vehicleList) do
    	-- Do something
      -- Could also be used to check how many vehicles a player have
  	end
  end
  ```
#### DropPlayer(playersServerID)
Interrompe la connessione di un giocatore specifico. In sostanza, lo espelle (kick)
  ```lua
  function onVehicleSpawn(playerID, vehicleID, vehicleData)
  	-- Do something	
  	DropPlayer(playerID)
  end
  ```
#### SendChatMessage(playersServerID, message)
Invia un messaggio in rete all'utente specificato. Usa -1 per tutti
  ```lua
  function onPlayerJoin(playerID)
  	SendChatMessage(-1, "Someone just joined!")
  end
  ```
#### CancelEvent() -- OBSOLETO
  Annulla l'evento impedendo che si verifichi. Potrebbe essere rimossa a breve. Usa `return 1` per annullare l'evento.
  
#### onInit()
Se dichiarata in un file Lua, viene chiamata una volta che il C++ ha terminato con successo di caricare il file Lua corrente
  ```lua
  function onInit()
  	print("Server ready")
  end
  ```
#### exit()
Chiude il server
  ```lua
  function onInit()
  	print("Server Ready. But who needs a server which is running")
  	exit() -- Stops the server
  end
  ```
#### CreateThread(functionName, callInterval)
Esegue la funzione su un thread dedicato, e verrà eseguita callInterval volte al secondo. 
1 = verrà eseguita ogni secondo.
  ```lua
  function yourFunction()
   	for i = 1,10 do
  		SendChatMessage(-1, "Countdown: "..i)
  		Sleep(1000)
  	end
  end
  CreateThread("yourFunction", 30)
  ```
ESEMPIO OBSOLETO
Esegue la funzione su un thread dedicato
  ```lua
  function yourFunction()
   	for i = 1,10 do
  		SendChatMessage(-1, "Countdown: "..i)
  		Sleep(1000)
  	end
  end
  CreateThread("yourFunction", 30)
  ```
#### StopThread(functionName)
Smette di provare a chiamare la funzione del thread dello script corrente
  ```lua
  function yourFunction()
  	delayExpired = false
  	Sleep(10000)
  	delayExpired = true
  end
  CreateThread("yourFunction", 30)
  -- Do something
  if not delayExpired then
  	StopThread("yourFunction")
  else
  	-- Do something
  end
  
  ```
#### Sleep(millisecs) - OBSOLETA
Mette in pausa l'esecuzione per il tempo specificato (attenzione: se non hai creato un thread, questo metterà in pausa l'intero server)
  ```lua
  function countdown()
   	for i = 1,10 do
  		SendChatMessage(-1, "Countdown: "..i)
  		Sleep(1000)
  	end
  end
  CreateThread("countdown", 10)
  ```
#### GetPlayerCount()
Restituisce quanti giocatori sono connessi
  ```lua
  function onPlayerJoin(playerID)
  	SendChatMessage(playerID, "You are the "..GetPlayerCount().."th player!"
  end
  ```
#### RemoveVehicle(playerServerID, VehicleID)
Rimuove un veicolo (despawn)
  ```lua
  function onVehicleSpawn(playerID, vehicleID, vehicleData)
  	if --[[ Vehicle data equal something it shouldn't be ]] then
  		RemoveVehicle(playerID, vehicleIID)
  	end
  end
  ```
#### GetPlayers()
Restituisce una tabella di ID con i relativi nomi
  ```lua
  local function onPlayerJoin(joinedPlayerID)
  	local players = GetPlayers()
  	for playerID, playerName in pairs(players) do
  		if playerID == joinedPlayerID then
  			-- Do something
  		end
  	end
  end
  ```
#### RegisterEvent(eventName, functionName)
Registra quella funzione per l'evento specificato. Entrambi devono essere stringhe
  ```lua
    function anyEvent()
  		-- Do something
 		end
  	RegisterEvent("onAnyEventHappen", "anyEvent")
  	-- Do something
  	TriggerLocalEvent("onAnyEventHappen")
  ```
#### TriggerLocalEvent(eventName)
Chiama tutte le funzioni registrate nella stessa cartella del plugin.
  ```lua
    function anyEvent()
  		-- Do something
 		end
  	RegisterEvent("onAnyEventHappen", "anyEvent")
  	-- Do something
  	TriggerLocalEvent("onAnyEventHappen")
  ```
#### TriggerGlobalEvent(eventName)
Chiama tutte le funzioni registrate con questo nome di evento.
  ```lua
  	-- File A
    function anyEvent()
  		-- Do something
 		end
  	RegisterEvent("onAnyEventHappen", "anyEvent")
  ```
  ```lua
 		-- File B
  	TriggerGlobalEvent("onAnyEventHappen")
  ```
#### TriggerClientEvent(playerServerID, eventName, data)
Chiama quell'evento con i dati forniti sul client specificato (-1 per inviarlo a tutti)
  ```lua
    function onPlayerJoin(playerServerID)
       TriggerClientEvent(playerServerID, "anyEvent", "You just joined the server")
    end
  	RegisterEvent("onAnyEventHappen", "anyEvent")
  ```
#### Set(configID, newValue)
Imposta un'impostazione di configurazione al nuovo valore specificato (vedi la tabella qui sotto)
  ```lua
    function onChatMessage(playerID, senderName, message)
      if playerID == adminPlayer then
        if message == --[[ anything ]] then
          Set(3, 10)
        end
      end
    end
  ```
#### Elenco delle impostazioni di configurazione disponibili per il comando `Set()`
> Nota che queste non vengono salvate nel file di configurazione.

|ID configurazione|Nome|Accetta solo|
|---|---|---|
|`0`|Impostazione di debug|true o false|
|`1`|Impostazione di privacy (server privato)|true o false|
|`2`|Numero massimo di auto per giocatore|numero|
|`3`|Numero massimo di giocatori|numero|
|`4`|Mappa|stringa|
|`5`|Nome|stringa|
|`6`|Descrizione|stringa|
|qualsiasi altro ID provocherà un avviso in console|

### Elenco degli eventi disponibili per lo scripting
#### Eventi predefiniti
Esempio di come usare un evento:
```lua
	function onInit()
  	RegisterEvent("onPlayerJoin", "onPlayerJoin")
  end
  
  function onPlayerJoin(playerServerID)
  	-- Do something
  end
```
Se non vuoi ospiti (guest) sul tuo server:
```lua
	function onInit()
		print("noGuests Ready")
		RegisterEvent("onPlayerAuth","onPlayerAuth")
	end

	function onPlayerAuth(name, role, isGuest)
		if isGuest then
			return "You must be signed in to join this server!"
		end
	end
```
|Evento|Parametri|Descrizione|
|---|---|---|
|`onPlayerAuth`|Il nome del giocatore, il ruolo sul forum, account ospite (bool)|Un giocatore si è autenticato e chiede di entrare|
|`onPlayerConnecting`|L'ID del giocatore|Un giocatore sta caricando (prima del caricamento della mappa)|
|`onPlayerJoining`|L'ID del giocatore|Un giocatore sta caricando la mappa e a breve entrerà|
|`onPlayerJoin`|L'ID del giocatore|Un giocatore è entrato e ha completato il caricamento|
|`onPlayerDisconnect`|L'ID del giocatore|Un giocatore si è disconnesso|
|`onChatMessage`|L'ID del mittente, il nome e il messaggio di chat|È stato inviato un messaggio in chat. Utile per creare un sistema di comandi|
|`onVehicleSpawn`|L'ID del giocatore, l'ID del veicolo e i dati del veicolo|Viene chiamato quando qualcuno fa comparire un veicolo|
|`onVehicleEdited`|L'ID del giocatore, l'ID del veicolo e i dati del veicolo|Viene chiamato quando qualcuno modifica un veicolo o sostituisce quello esistente|
|`onVehicleDeleted`|L'ID del giocatore e l'ID del veicolo|Viene chiamato quando qualcuno elimina un veicolo di sua proprietà|

#### Eventi personalizzati
È possibile creare anche eventi personalizzati per uso proprio. Si fa in modo molto simile a quelli predefiniti.

Esempio di come usare un evento personalizzato:
```lua
	function onInit()
  	RegisterEvent("myCustomEvent", "myCustomEvent")
  end
  
  function myCustomEvent(playerServerID, customData)
  	-- Do something
  end
```
Può poi essere chiamato dal lato client o dal lato server con le rispettive funzioni.

### Giocatori

Quando un giocatore si connette al tuo server, gli viene assegnato un serverID che parte da 0 e continua in ordine crescente. I serverID vengono riutilizzati: se un giocatore esce e rientra, non gli verrà assegnato un nuovo serverID, ma semplicemente un altro di quelli disponibili. Quando il server si riavvia, i serverID vengono azzerati.

#### Identificatori statici

I giocatori in BeamMP hanno 3 identificatori statici, ottenibili partendo dal loro serverID: il nome, il discordID e l'ID hardware o HWID (anche se quest'ultimo non è implementato, faremo finta che lo sia). Ciascuno dei tre tipi di ID ha le proprie origini e i propri punti di forza/debolezza quando lo si usa per identificare un giocatore.

| TIPO DI ID | PRO                              | CONTRO           |  FUNZIONE PER OTTENERLO |
|-----------|---------------------------------|----------------|:--------------------:|
| name      | facile da ottenere, immediato   | non sicuro     | GetPlayerName()      |
| discordID | abbastanza sicuro               | scomodo        | GetPlayerDiscordID() |
| HWID      | estremamente sicuro             | difficile da ottenere | GetPlayerHWID() |

### Veicoli

I veicoli in BeamMP hanno 3 attributi di cui il server tiene conto: il serverID del proprietario, il vehicleID del veicolo e i suoi dati. Il serverID del proprietario è immediato: è il suo serverID. Ogni veicolo ha anche un ID, ma i vehicleID non sono univoci a livello globale: due veicoli possono avere lo stesso ID, purché appartengano a proprietari diversi. A differenza dei serverID, i vehicleID vengono riutilizzati: ad esempio, se ho 4 veicoli, i loro ID sono 0, 1, 2 e 3; se elimino il veicolo con vehicleID 2, mi restano 0, 1 e 3, e quando faccio comparire un nuovo veicolo, questo prenderà l'ID 2. Infine, l'ultimo attributo dei veicoli sono i dati (data), che contengono un veicolo, il nome, le parti e altre informazioni, come suggerisce il nome. I dati sono memorizzati come stringa JSON grezza, quindi ti servirà una libreria JSON oppure, in alternativa, puoi scorrere manualmente la stringa ed estrarre le informazioni che ti servono.
