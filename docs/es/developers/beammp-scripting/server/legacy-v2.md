::: warning ¡Este sitio está en construcción!
Se está trabajando activamente en este sitio. 

¿Crees que podrías ayudar? ¡Hazlo haciendo clic en la página con un lápiz de la derecha!

Esto se puede hacer en cualquier página.
:::

# Referencia de scripting del servidor
## Servidor versión 2.X
::: warning
La versión 2.X del servidor de BeamMP ya no recibe soporte. Esta documentación se ofrece únicamente como referencia.
Actualiza a la última versión para tener mantenimiento y soporte.
:::
---

> Este es el scripting de la versión 2.x. Consúltalo solo si tu servidor es antiguo/está desactualizado (versión 2.x.x). Para ver la documentación más reciente, consulta [aquí](https://docs.beammp.com/scripting/server/latest-server-reference).
{.is-warning}

### Notas

Para obtener el resultado de una función en la consola del servidor, tienes que envolverla en una instrucción `print()`.
Por ejemplo:
`print(GetPlayerName(0))` devolverá el nombre del primer jugador de tu servidor.

`<PlayersServerID>` empieza en 0.

### Lista de funciones disponibles para scripting

#### GetPlayerName(playersServerID)
Devuelve el nombre de Discord del jugador como cadena de texto
  ```lua
  function onPlayerJoin(playerID)
  	local name = GetPlayerName(playerID)
  	-- Do something
  end
  ```
#### GetPlayerDiscordID(playersServerID)
Devuelve el nombre de Discord del jugador como cadena de texto
  ```lua
  function onPlayerJoin(playerID)
  	local name = GetPlayerDiscordID(playerID)
  	-- Do something
  end
  ```
#### GetPlayerHWID(playersServerID)
Devuelve el ID de Discord del jugador como cadena de texto
  ```lua
  function onPlayerJoin(playerID)
  	local name = GetPlayerHWID(playerID)
  	-- Do something
  end
  ```
#### GetPlayerVehicles(playersServerID)
Devuelve los vehículos del jugador como objeto/array
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
Cierra la conexión de un jugador concreto. Básicamente, lo expulsa
  ```lua
  function onVehicleSpawn(playerID, vehicleID, vehicleData)
  	-- Do something	
  	DropPlayer(playerID)
  end
  ```
#### SendChatMessage(playersServerID, message)
Envía un mensaje por la red al usuario especificado. Usa -1 para enviarlo a todos
  ```lua
  function onPlayerJoin(playerID)
  	SendChatMessage(-1, "Someone just joined!")
  end
  ```
#### CancelEvent() -- OBSOLETA
  Cancela que el evento ocurra. Esto podría desaparecer pronto. Usa `return 1` para cancelar el evento.
  
#### onInit()
Si se declara en un archivo Lua, se llamará una vez que C++ haya terminado de cargar correctamente el archivo Lua actual
  ```lua
  function onInit()
  	print("Server ready")
  end
  ```
#### exit()
Cerrará el servidor
  ```lua
  function onInit()
  	print("Server Ready. But who needs a server which is running")
  	exit() -- Stops the server
  end
  ```
#### CreateThread(functionName, callInterval)
Ejecutará la función en un hilo dedicado y se ejecutará callInterval veces por segundo. 
1 = Se ejecutará cada segundo.
  ```lua
  function yourFunction()
   	for i = 1,10 do
  		SendChatMessage(-1, "Countdown: "..i)
  		Sleep(1000)
  	end
  end
  CreateThread("yourFunction", 30)
  ```
EJEMPLO OBSOLETO
Ejecutará la función en un hilo dedicado
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
Dejará de intentar llamar a la función de hilo del script actual
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
Pausará la ejecución durante el tiempo especificado (advertencia: hacerlo pausará todo el servidor si no has creado un hilo)
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
Devolverá cuántos jugadores están conectados
  ```lua
  function onPlayerJoin(playerID)
  	SendChatMessage(playerID, "You are the "..GetPlayerCount().."th player!"
  end
  ```
#### RemoveVehicle(playerServerID, VehicleID)
Eliminará un vehículo
  ```lua
  function onVehicleSpawn(playerID, vehicleID, vehicleData)
  	if --[[ Vehicle data equal something it shouldn't be ]] then
  		RemoveVehicle(playerID, vehicleIID)
  	end
  end
  ```
#### GetPlayers()
Devolverá una tabla de IDs con nombres
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
Registrará esa función para el evento especificado. Ambos deben ser cadenas de texto
  ```lua
    function anyEvent()
  		-- Do something
 		end
  	RegisterEvent("onAnyEventHappen", "anyEvent")
  	-- Do something
  	TriggerLocalEvent("onAnyEventHappen")
  ```
#### TriggerLocalEvent(eventName)
Llamará a todas las funciones registradas en la misma carpeta de plugin.
  ```lua
    function anyEvent()
  		-- Do something
 		end
  	RegisterEvent("onAnyEventHappen", "anyEvent")
  	-- Do something
  	TriggerLocalEvent("onAnyEventHappen")
  ```
#### TriggerGlobalEvent(eventName)
Llamará a todas las funciones registradas con este nombre de evento.
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
Llamará a ese evento con los datos indicados en el cliente especificado (-1 para enviarlo a todos)
  ```lua
    function onPlayerJoin(playerServerID)
       TriggerClientEvent(playerServerID, "anyEvent", "You just joined the server")
    end
  	RegisterEvent("onAnyEventHappen", "anyEvent")
  ```
#### Set(configID, newValue)
establecerá un ajuste de configuración con el nuevo valor especificado (tabla a continuación)|
  ```lua
    function onChatMessage(playerID, senderName, message)
      if playerID == adminPlayer then
        if message == --[[ anything ]] then
          Set(3, 10)
        end
      end
    end
  ```
#### Lista de ajustes de configuración disponibles para el comando `Set()`
> Ten en cuenta que estos no se guardarán en el archivo de configuración.

|ID de configuración|Nombre|Solo aceptará|
|---|---|---|
|`0`|Ajuste de depuración (Debug)|true o false|
|`1`|Ajuste de privado (Private)|true o false|
|`2`|Máximo de coches por jugador|número|
|`3`|Máximo de jugadores|número|
|`4`|Mapa|cadena de texto|
|`5`|Nombre|cadena de texto|
|`6`|Descripción|cadena de texto|
|cualquier otro ID provocará una advertencia en la consola|

### Lista de eventos disponibles para scripting
#### Eventos predeterminados
Ejemplo de cómo usar un evento:
```lua
	function onInit()
  	RegisterEvent("onPlayerJoin", "onPlayerJoin")
  end
  
  function onPlayerJoin(playerServerID)
  	-- Do something
  end
```
Si no quieres invitados en tu servidor:
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
|Evento|Parámetros|Descripción|
|---|---|---|
|`onPlayerAuth`|El nombre del jugador, su rol en el foro, cuenta de invitado (bool)|Un jugador se ha autenticado y solicita unirse|
|`onPlayerConnecting`|El ID del jugador|Un jugador se está cargando (antes de cargar el mapa)|
|`onPlayerJoining`|El ID del jugador|Un jugador está cargando el mapa y se unirá en breve|
|`onPlayerJoin`|El ID del jugador|Un jugador se ha unido y ha terminado de cargar|
|`onPlayerDisconnect`|El ID del jugador|Un jugador se ha desconectado|
|`onChatMessage`|El ID y el nombre del remitente, y el mensaje del chat|Se ha enviado un mensaje de chat. Útil para crear un sistema de comandos|
|`onVehicleSpawn`|El ID del jugador, el ID del vehículo y los datos del vehículo|Se llama cuando alguien genera un vehículo|
|`onVehicleEdited`|El ID del jugador, el ID del vehículo y los datos del vehículo|Se llama cuando alguien edita un vehículo o reemplaza el que ya tenía|
|`onVehicleDeleted`|El ID del jugador y el ID del vehículo|Se llama cuando alguien elimina un vehículo suyo|

#### Eventos personalizados
También se pueden crear eventos personalizados para tu propio uso. Se hace de forma muy similar a como se hacen los predeterminados.

Ejemplo de cómo usar un evento personalizado:
```lua
	function onInit()
  	RegisterEvent("myCustomEvent", "myCustomEvent")
  end
  
  function myCustomEvent(playerServerID, customData)
  	-- Do something
  end
```
Después se puede llamar desde el lado del cliente o del servidor usando las funciones respectivas.

### Jugadores

Cuando un jugador se conecta a tu servidor, se le asigna un serverID que empieza en 0 y va aumentando. Los serverIDs se reutilizan: si un jugador se va y vuelve a entrar, no se le asignará un nuevo serverID, sino que simplemente recibirá otro de los disponibles. Cuando el servidor se reinicia, los serverIDs se restablecen.

#### Identificadores estáticos

Los jugadores de BeamMP tienen 3 identificadores estáticos que se pueden obtener a partir de su serverID: su nombre, su discordID y su ID de hardware o HWID (aunque este último no está implementado, actuaremos como si lo estuviera). Cada uno de los tres tipos de ID tiene sus propios orígenes y puntos fuertes y débiles a la hora de usarlo para identificar a un jugador.

| TIPO DE ID | VENTAJAS                        | INCONVENIENTES | FUNCIÓN PARA OBTENERLO |
|-----------|---------------------------------|----------------|:--------------------:|
| name      | fácil de obtener, directo       | no es seguro   | GetPlayerName()      |
| discordID | bastante seguro                 | poco práctico  | GetPlayerDiscordID() |
| HWID      | extremadamente seguro           | difícil de obtener | GetPlayerHWID()  |

### Vehículos

Los vehículos en BeamMP tienen 3 atributos a los que presta atención el servidor: el serverID del propietario, el vehicleID del vehículo y sus datos. El serverID del propietario es sencillo: es el serverID. Además, cada vehículo tiene un ID; los IDs de vehículo no son únicos: dos vehículos pueden tener el mismo ID, siempre que pertenezcan a propietarios distintos. A diferencia de los serverIDs, los vehicleIDs se reutilizan. Por ejemplo, si tengo 4 vehículos, sus IDs son 0, 1, 2 y 3; si elimino el vehículo con vehicleID 2, tendré 0, 1 y 3, y cuando genere un nuevo vehículo, este ocupará el ID 2. Por último, el último atributo de los vehículos son los datos (data); contienen un vehículo, nombre, piezas y otros datos, como indica su nombre. Los datos se almacenan como una cadena JSON sin procesar, por lo que necesitarás una biblioteca JSON; también puedes recorrer la cadena manualmente y extraer la información que necesites.
