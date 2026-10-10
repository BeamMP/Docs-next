---
description: "Referencia del sistema de plugins del servidor de BeamMP, versión 3: cómo se cargan los plugins, los eventos y funciones del servidor, y cómo migrar desde el Lua antiguo."
---
# Referencia de scripting del servidor (versión 3.X)

## Introducción {#introduction}

La versión v3.0.0 de BeamMP-Server introduce cambios drásticos en el funcionamiento del sistema de plugins de Lua. No hay forma de usar el Lua antiguo con un servidor nuevo, así que tendrás que migrar.

El sistema de plugins del servidor usa [Lua 5.3](https://www.lua.org/manual/5.3/). Esta sección explica cómo empezar a escribir plugins, enseña algunos conceptos básicos y te guía en tu primer plugin. **Se recomienda leer esta sección incluso si conoces el sistema anterior a la v3.0.0, ya que algunas cosas han cambiado drásticamente**.

Para una guía de migración desde el Lua anterior a la v3.0.0, ve a la sección ["Migración desde el Lua antiguo"](#migrating-from-old-lua).


## Estructura de directorios {#directory-structure}

Los plugins del servidor, a diferencia de los mods, se ubican (por defecto) en `Resources/Server`, mientras que los mods, que se escriben para BeamNG.drive y se envían a los clientes, están en `Resources/Client`. Cada plugin debe tener su propia subcarpeta en `Resources/Server`; por ejemplo, para un plugin llamado "MyPlugin", la estructura sería:

```
Resources
└── Server
    ├── MyPlugin
    │   └── main.lua
    └── SomeOtherPlugin
        └── ...
```

Aquí también mostramos otro plugin llamado "SomeOtherPlugin", para ilustrar que tu carpeta `Resources/Server` puede tener varias carpetas de plugins distintas. Seguiremos usando esta estructura de directorios como ejemplo a lo largo de esta guía.

También te habrás fijado en `main.lua`. Puedes tener tantos archivos Lua `.lua` como quieras. Todos los archivos Lua del directorio principal de tu plugin se cargan en *orden alfabético*, sin distinguir mayúsculas de minúsculas (así que `aaa.lua` se ejecuta antes que `bbb.lua`).

Las propias carpetas de los plugins también se cargan en orden alfabético, sin distinguir mayúsculas de minúsculas. Todo lo que haya en `Resources/Server` y no sea una carpeta se omite, y el servidor registra un error por ello.


## Archivos Lua {#lua-files}

Cada archivo Lua `.lua` de la carpeta del plugin se carga al iniciar el servidor. Esto significa que las instrucciones que están fuera de las funciones se evalúan ("se ejecutan") inmediatamente.

Los archivos Lua de las subcarpetas se ignoran, pero se pueden cargar con `require()`. Antes de `onInit`, el servidor añade la carpeta del plugin y su subcarpeta `lua` a `package.path`, de modo que `require("helpers")` encuentra `helpers.lua` en cualquiera de las dos. Añade la carpeta del plugin y su subcarpeta `lib` a `package.cpath` para los archivos `.so` (archivos `.dll` en Windows).

Por ejemplo, nuestro `main.lua` tiene este aspecto:

```lua
function PrintMyName()
	print("I'm 'My Plugin'!")
end

print("What's up!")
```

Cuando el servidor se inicia y se carga `main.lua`, ejecutará `print("What's up!")` *inmediatamente*, pero **NO** *llamará* todavía a la función `PrintMyName` (¡porque no se ha llamado!).

## Compartir un estado de Lua {#sharing-a-lua-state}

Cada plugin se ejecuta en su propio estado de Lua, que lleva el nombre de su carpeta. Para que varios plugins compartan un mismo estado, de modo que vean las variables globales y los manejadores de eventos de los demás, añade un archivo llamado `PluginConfig.toml` a cada una de esas carpetas de plugins:

```toml
LuaStateID = "MySharedState"
```

Todos los plugins con el mismo `LuaStateID` se ejecutan en el mismo estado. Un valor vacío se ignora y el plugin conserva su propio estado. El nombre del estado es también lo que le pasas al comando de consola `lua` (consulta [Depuración](#debugging)).

## Eventos {#events}

Un evento es algo como "un jugador se está uniendo", "un jugador ha enviado un mensaje de chat", "un jugador ha generado un vehículo".

Puedes cancelar eventos (si son cancelables) devolviendo `1` desde el manejador (handler).

En Lua, normalmente querrás reaccionar a algunos de ellos. Para ello, puedes registrar un "handler" (manejador). Es una función que se llama cuando ocurre un evento y que recibe algunos argumentos.

Ejemplo:

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

Esto garantiza que cualquier mensaje que sea exactamente igual a "darn" no se enviará y no aparecerá en el chat (ten en cuenta que, para un filtro de palabrotas de verdad, querrías comprobar si el mensaje *contiene* "darn", no si *es* "darn"). Cancelar un evento hace que no ocurra: por ejemplo, que un mensaje de chat no se muestre a nadie más, que un vehículo no se genere, etc.

## Eventos personalizados {#custom-events}

Puedes registrarte en cualquier evento que quieras, por ejemplo:

```lua
MP.RegisterEvent("MyCoolCustomEvent", "MyHandler")
```

Después puedes activar esos eventos personalizados:

```lua
-- call all event handlers to this in ALL plugins
MP.TriggerGlobalEvent("MyCoolCustomEvent")
-- call all event handlers to this in THIS plugin
MP.TriggerLocalEvent("MyCoolCustomEvent")
```

### Eventos del juego {#events-from-the-game}

Un plugin del lado del cliente puede activar un evento en el servidor con `TriggerServerEvent("eventName", "data")` (consulta [Mod (En el Juego)](/es/developers/beammp-scripting/mod-in-game)). Registra un manejador para ese nombre como con cualquier otro evento. El manejador recibe el ID del jugador que lo envió y la cadena de datos:

```lua
function MyHandler(player_id, data)
	print(MP.GetPlayerName(player_id) .. " sent: " .. data)
end

MP.RegisterEvent("MyClientEvent", "MyHandler")
```

Desde la v3.9.0, el servidor ignora un evento del cliente que tenga el nombre de uno de los eventos propios del servidor, como `onChatMessage`, para que un jugador no pueda falsificarlos. Para enviar un evento en el sentido contrario, usa [`MP.TriggerClientEvent`](#mp-triggerclientevent-player-id-number-event-name-string-data-string-boolean).

Puedes hacer mucho más con los eventos, pero esas posibilidades se tratan en detalle más abajo, en la referencia de la API.

## Temporizadores de eventos ("hilos") {#event-timers-threads}

El Lua anterior a la v3.0.0 tenía un concepto de "hilos" (threads) que se ejecutan X veces por segundo. Este nombre era algo engañoso, ya que eran síncronos.

En su lugar, el Lua de la v3.0.0 tiene "temporizadores de eventos". Son temporizadores que se ejecutan dentro del servidor y que, cuando se agota su tiempo, activan un evento (de forma global). Esto también es síncrono. Ten en cuenta que el segundo argumento es un intervalo en milisegundos.

Ejemplo:

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

Esto hará que se llame a "CountSeconds" cada segundo. También puedes cancelar temporizadores de eventos con `MP.CancelEventTimer` (consulta la referencia de la API).

Desde la consola del servidor, puedes ejecutar `status` para ver cuántos temporizadores de eventos se están ejecutando, cuántos manejadores de eventos hay registrados y cuántos estados de Lua existen.

## Depuración {#debugging}

Depurar Lua es difícil. Lamentablemente, no existe un depurador de nivel profesional como `gdb` para Lua embebido.

En general, por supuesto, puedes usar simplemente `print()` para mostrar en cualquier momento los valores que quieras inspeccionar. 

En la v3.0.0, el servidor ofrece una forma de inyectar un intérprete en un plugin y ejecutar Lua dentro de él en tiempo real. Es lo más parecido a un depurador que tenemos.

Suponiendo que tienes el plugin anterior, al que llamamos `MyPlugin`, puedes entrar en su estado de Lua así:

```
> lua MyPlugin
```

Aquí importan las mayúsculas y minúsculas, así que ten cuidado de escribirlo correctamente. 
La salida es algo como
```
lua @MyPlugin> 
```
Como puedes ver, hemos cambiado al estado de Lua de `MyPlugin`. A partir de ahora, hasta que introduzcamos `:exit`, estaremos en `MyPlugin` y podremos ejecutar Lua ahí. No uses `exit()` para esto: apaga el servidor.

Los comandos que empiezan por `:` son para el propio depurador. Todo lo demás se ejecuta como Lua. Los comandos son:

- `:exit` se desconecta del estado de Lua.
- `:help` muestra los comandos.
- `:events` lista los eventos y los manejadores registrados en este estado.
- `:queued` lista las funciones que esperan para ejecutarse en este estado.

Si escribes `lua` sin un nombre, te conectas a un estado propio de la consola, que no tiene ningún plugin.

Por ejemplo, si tenemos una variable global llamada `MyValue`, podemos mostrar su valor así:

```
lua @MyPlugin> print(MyValue)
```

Aquí puedes llamar a funciones y hacer todo lo que esperarías poder hacer.

Puedes pulsar TAB para autocompletar funciones y variables. Esto requiere la v3.1.0 o posterior.

ADVERTENCIA: Lamentablemente, si el estado de Lua está ocupado ejecutando otro código (como un bucle `while`), esto puede bloquear por completo la consola hasta que termine ese trabajo, así que ten mucho cuidado al cambiar a estados que puedan estar esperando a que ocurra algo.

Además, puedes ejecutar `status` en la consola normal (`> `), que te mostrará algunas estadísticas sobre Lua, entre otras cosas.

## Comandos personalizados {#custom-commands}

Para implementar comandos personalizados en la consola del servidor, se puede usar el evento `onConsoleInput`. 
Esto puede resultar útil cuando quieres añadir una forma de que el propietario del servidor envíe una señal a tu plugin, o para mostrar el estado interno de una manera personalizada.

Este es un ejemplo:

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

El manejador recibe la línea completa que se escribió. Si devuelve un valor, la consola lo imprime. Si ningún manejador devuelve un valor y la línea no es un comando integrado, la consola imprime "Unknown command". El servidor también activa este evento para los comandos integrados, como `list`, de modo que un plugin pueda reaccionar a ellos.

Esto te permitirá hacer lo siguiente en la consola del servidor:

```
> print hello, world
hello, world
```

Hemos implementado nuestro propio `print`. Como ejercicio, intenta crear una función como `say`, que envíe un mensaje de chat a todos los jugadores, o incluso a un jugador concreto (con `MP.SendChatMessage`).

**Precaución:** Para tus propios plugins, en general se recomienda ponerles un "espacio de nombres" (namespace). Nuestro ejemplo de `print`, en un plugin llamado `mystuff`, podría llamarse `mystuff.print`, `ms.print` o algo similar.

## Referencia de la API {#api-reference}

Formato de la documentación: `function_name(arg_name: arg_type, arg_name: arg_type) -> return_types`

## Funciones integradas {#builtin-functions}

### `print(...)`, `printRaw(...)`

Imprime el mensaje en la consola del servidor, con el prefijo `[DATE TIME] [LUA]`. Si no quieres este prefijo, puedes usar `printRaw(...)`.

Ejemplo:

```lua
local name = "John Doe"
print("Hello, I'm", name, "and I'm", 32)
```

Puede recibir tantos argumentos de tipos arbitrarios como quieras. ¡También volcará tablas sin problema!

Se comporta como el `print` del intérprete de Lua, por lo que pondrá tabulaciones entre los argumentos.

### `exit()`

Apaga el servidor de forma ordenada. Provoca que se active el evento `onShutdown`.

## Funciones MP {#mp-functions}

### `MP.CreateTimer() -> Timer`

Crea un objeto temporizador, que se puede usar para llevar la cuenta de cuánto tardó algo o cuánto tiempo ha transcurrido. Empieza a contar al crearse y se puede reiniciar con `mytimer:Start()`.

Puedes obtener el tiempo transcurrido actual en segundos con `mytimer:GetCurrent()`.

Ejemplo:

```lua
local mytimer = MP.CreateTimer()
-- do stuff here that needs to be timed
print(mytimer:GetCurrent()) -- print how much time elapsed
```

Los temporizadores no necesitan detenerse (y no se pueden detener); no tienen sobrecarga.

### `MP.GetOSName() -> string`

Devuelve el nombre del sistema operativo actual: `Windows`, `Linux` u `Other`.

### `MP.GetServerVersion() -> number,number,number`

Devuelve la versión actual del servidor en formato mayor, menor, parche. Por ejemplo, la versión v3.0.0 devolvería `3, 0, 0`.

Ejemplo:

```lua
local major, minor, patch = MP.GetServerVersion()
print(major, minor, patch)
```
Salida para el servidor v3.9.4:
```
3	9	4
```

### `MP.RegisterEvent(event_name: string, function_name: string)`

Recuerda la función con el nombre `Function Name` como manejador del evento con el nombre `Event Name`.

Puedes registrar tantos manejadores para un evento como quieras.

Para ver la lista de eventos que proporciona el servidor, consulta [aquí](#events-1).

Si el evento con ese nombre no existe, se crea, por lo que RegisterEvent no puede fallar. Esto se puede usar para crear eventos personalizados. Consulta [Eventos personalizados](#custom-events) y [Eventos](#events) para más información.

Ejemplo:

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

Inicia dentro del servidor un temporizador que activa el evento `event_name` cada `interval_ms` milisegundos.

Los temporizadores de eventos se pueden cancelar con `MP.CancelEventTimer`.

No se recomiendan intervalos <25 ms, ya que es probable que varios de ellos no se atiendan a tiempo de forma fiable. Aunque se pueden iniciar varios temporizadores sobre el mismo evento, se recomienda crear el menor número posible de temporizadores de eventos. Por ejemplo, si necesitas un evento que se ejecute cada medio segundo y otro que se ejecute cada segundo, considera crear solo el de medio segundo y ejecutar la función de cada segundo en uno de cada dos disparos.

También puedes usar `MP.CreateTimer` para crear un temporizador y medir el tiempo transcurrido desde la última llamada al evento, con el fin de minimizar los temporizadores de eventos, aunque esto no es necesariamente recomendable, ya que aumenta bastante la complejidad del código.

**Desde la v3.0.2:**

Se puede proporcionar como tercer argumento un `CallStrategy` opcional. Puede ser uno de estos:

- `MP.CallStrategy.BestEffort` (predeterminado): intentará que tu evento se active en el intervalo especificado, pero se negará a poner manejadores en cola si un manejador tarda demasiado.
- `MP.CallStrategy.Precise`: pondrá en cola los manejadores de eventos en el intervalo exacto especificado. Puede provocar que la cola se llene si el manejador tarda más que el intervalo. Úsalo solo si NECESITAS el intervalo exacto.

### `MP.CancelEventTimer(event_name: string)`

Cancela todos los temporizadores del evento con el nombre `event_name` que se crearon en el estado de Lua actual. En algunas ocasiones, el temporizador puede activarse una vez más antes de cancelarse, debido a la naturaleza de la programación asíncrona.

### `MP.TriggerLocalEvent(event_name: string, ...) -> table`

Activador de eventos síncrono local al plugin.

Activa un evento localmente, lo que provoca que se llame a todos los manejadores de ese evento *en el estado de Lua actual* (normalmente el plugin actual, a menos que el estado se haya compartido mediante PluginConfig.toml).

Puedes pasar argumentos a esta función (`...`), que se copian y se envían a todos los manejadores como argumentos de función.

Esta llamada es síncrona y devolverá el control cuando todos los manejadores de eventos hayan terminado.

El valor devuelto es una tabla con todos los resultados. Si un manejador devolvió un valor, estará en esta tabla, sin anotaciones y sin nombre. Se puede usar para "recopilar" cosas o para registrar submanejadores de eventos que se pueden cancelar. En la práctica es un array.

Ejemplo:

```lua
local Results = MP.TriggerLocalEvent("MyEvent")
print(Results)
```

### `MP.TriggerGlobalEvent(event_name: string, ...) -> table`

Activador de eventos global asíncrono.

Activa un evento globalmente, lo que provoca que se llame a todos los manejadores de ese evento *en todos los plugins* (incluido *este* plugin).

Puedes pasar argumentos a esta función (`...`), que se copian y se envían a todos los manejadores como argumentos de función.

Esta llamada es asíncrona y devuelve un objeto similar a un future. Los manejadores locales (los del mismo plugin que el que llama) se ejecutan de forma síncrona e inmediata. 

La tabla devuelta tiene dos funciones:

- `IsDone() -> boolean` te indica si todos los manejadores han terminado. Puedes esperar hasta que sea true comprobándolo y usando `MP.Sleep` un poco dentro de un bucle.
- `GetResults() -> table` devuelve una tabla sin anotaciones y sin nombre con todos los valores devueltos por todos los manejadores. En la práctica es un array.

Asegúrate de llamar a estas funciones con la sintaxis `Obj:Function()` (`:`, NO `.`).

Ejemplo:

```lua
local Future = MP.TriggerGlobalEvent("MyEvent")
-- wait until handlers finished
while not Future:IsDone() do
	MP.Sleep(100) -- sleep 100 ms
end
local Results = Future:GetResults()
print(Results)
```

Ten en cuenta que un manejador que se registre en "MyEvent" aquí y nunca devuelva el control podría bloquear tu plugin. Lo más probable es que quieras llevar la cuenta de cuánto has esperado y dejar de esperar tras unos segundos.

### `MP.Sleep(time_ms: number)`

Espera durante un tiempo, especificado en milisegundos.

Esto no cede la ejecución del estado de Lua y no se ejecutará nada en el estado mientras esté en espera. 

ADVERTENCIA: NO esperes más de 500 ms si tienes manejadores de eventos registrados, a menos que sepas *exactamente* lo que estás haciendo. Está pensado para esperar entre 1 y 100 ms, por ejemplo para aguardar resultados. Un estado de Lua bloqueado (en espera) puede ralentizar drásticamente todo el servidor si no se tiene cuidado.

### `MP.SendChatMessage(player_id: number, message: string, [log_chat: boolean])`

Envía un mensaje de chat que solo puede ver el jugador especificado (o todos, si el ID es `-1`).
En el juego, no aparecerá como un mensaje dirigido.

Desde la v3.9.2, el tercer argumento opcional `log_chat` decide si el mensaje se escribe en el registro del servidor. Es `true` si lo omites. Incluso así, el registro solo contiene el chat mientras el ajuste `LogChat` está activado. El mensaje no se envía a un jugador que no ha terminado de unirse.

Puedes usarlo, por ejemplo, para decirle a un jugador *por qué* has cancelado la generación de su vehículo, su mensaje de chat o algo similar, o para mostrar información sobre tu servidor.

Ejemplo:
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
Ejemplo 2:
```lua
function ChatHandler(player_id, player_name, msg)
    if msg == "hello" then
        MP.SendChatMessage(-1, "Hello World!") -- If the player sends the exact message "hello", announce to the entire server "Hello World!"
        return 0
    end
end
```

### `MP.TriggerClientEvent(player_id: number, event_name: string, data: string) -> boolean`
*hasta la v3.1.0*

### `MP.TriggerClientEvent(player_id: number, event_name: string, data: string) -> boolean,string`
*desde la v3.1.0*

### `MP.TriggerClientEventJson(player_id: number, event_name: string, data: table) -> boolean,string`
*desde la v3.1.0*

Llamará al evento indicado con los datos indicados en el cliente especificado (-1 para difundirlo a todos). Después, este evento puede ser gestionado en un mod Lua del lado del cliente; consulta para ello la documentación de "Client Scripting".

Devolverá `true` si pudo enviar el mensaje (para `id = -1`, es decir, difusiones, siempre es `true`), y `false` si el jugador con ese ID no existe o está desconectado pero aún conserva un ID (es un problema conocido).

Si se devuelve `false`, no tiene sentido reintentar este evento, y no se debe esperar una respuesta (si se esperaba alguna).

Desde la v3.1.0, el segundo valor devuelto contiene un mensaje de error si la función falló. También desde esta versión, la variante `*Json` de la función recibe una tabla como argumento de datos y la convierte a json. Es simplemente una forma abreviada de `MP.TriggerClientEvent(..., Util.JsonEncode(mytable))`.

El mensaje de error es `Invalid Player ID` si no existe ese jugador, o `Player hasn't joined yet` si el jugador todavía está descargando mods. Desde la v3.8.3, el servidor no envía eventos a un jugador que todavía está descargando.

### `MP.SendNotification(player_id: number, message: string, [icon: string], [category: string])`

*desde la v3.6.0*

Muestra una notificación en el juego del jugador especificado (o de todos, si el ID es `-1`). Si omites `icon`, la notificación no tiene icono. Si omites `category`, es igual que `message`. Omitir el icono funciona desde la v3.7.2. La función recibe de dos a cuatro argumentos y registra un error con cualquier otra cantidad. No devuelve nada. Un jugador que no ha terminado de unirse no recibe la notificación.

Ejemplo:
```lua
MP.SendNotification(-1, "The race starts in one minute")
```

### `MP.ConfirmationDialog(player_id: number, title: string, body: string, buttons: table, interaction_id: string, [warning: boolean, report_to_server: boolean, report_to_extensions: boolean]) -> boolean,string`

*desde la v3.8.5*

Muestra una ventana de diálogo con botones en el juego del jugador especificado (o de todos, si el ID es `-1`). Indica los cinco primeros argumentos o los ocho. Con cinco argumentos, la función no devuelve nada. Con ocho, devuelve `true`, o `false` y un mensaje de error como `Player is not synced yet` o `Invalid Player ID`.

- `buttons` es una tabla de tablas. Cada una tiene un `label` (el texto del botón), una `key` (el nombre del evento que se activa en el servidor cuando se pulsa el botón) y, para un botón como máximo, `isCancel = true`. El botón con `isCancel` cuenta como pulsado cuando el jugador cierra el diálogo con `Esc`. Si ningún botón tiene `isCancel`, el jugador solo puede cerrar el diálogo con uno de los botones.
- `interaction_id` se pasa al evento `key` como sus datos, para que puedas saber a qué diálogo pertenecía un botón cuando hay varios diálogos abiertos.
- `warning` (por defecto `false`) marca el diálogo como una advertencia.
- `report_to_server` (por defecto `true`) y `report_to_extensions` (por defecto `true`) deciden dónde se notifica la pulsación del botón.

La pulsación del botón llega como un evento del juego: el manejador recibe el ID del jugador y el `interaction_id`.

Ejemplo:
```lua
function onChatMessage(player_id, player_name, message)
    if message == "/rules" then
        MP.ConfirmationDialog(player_id, "Rules", "Do not ram other players.",
            { { label = "OK", key = "rulesOK", isCancel = true } }, "rules")
        return 1
    end
end

function rulesOK(player_id, interaction_id)
    MP.SendChatMessage(-1, MP.GetPlayerName(player_id) .. " read the rules")
end

MP.RegisterEvent("onChatMessage", "onChatMessage")
MP.RegisterEvent("rulesOK", "rulesOK")
```

### `MP.GetPlayerCount() -> number`

Devuelve la cantidad de jugadores que hay actualmente en el servidor.

### `MP.GetPositionRaw(pid: number, vid: number) -> table,string`

Devuelve la posición actual del vehículo `vid` (ID de vehículo) del jugador `pid` (ID de jugador), y una cadena de error si se produjo algún error.

La tabla se decodifica a partir de un paquete de posición, por lo que contiene diversos datos, entre ellos la posición y la rotación (por eso esta función lleva el sufijo "Raw").

Ejemplo:
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
Salida:
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
Ejemplo 2:
```lua
local player_id = 4
local vehicle_id = 0

local raw_pos, error = MP.GetPositionRaw(player_id, vehicle_id)
if error == "" then
    local x, y, z = table.unpack(raw_pos["pos"])

    print("X:", x)
    print("Y:", y)
    print("Z:", z)
else
    print(error)
end
```
Salida:
```
X: -603.459
Y: -175.078
Z: 26.9505
```

### `MP.IsPlayerConnected(player_id: number) -> boolean`

Indica si el jugador está conectado y si el servidor ha recibido un paquete UDP suyo.

Ejemplo:
```lua
local player_id = 8
print(MP.IsPlayerConnected(player_id)) -- Check if player with ID 8 is properly connected.
```
Salida:
```lua
true
```

### `MP.GetPlayerName(player_id: number) -> string`

Obtiene el nombre visible del jugador. Devuelve una cadena vacía si no hay ningún jugador con ese ID.

Ejemplo:
```lua
local player_id = 4
print(MP.GetPlayerName(player_id)) -- Get the name of the player with ID 4
```
Salida:
```
ilovebeammp2004
```

### `MP.GetPlayerIDByName(name: string) -> number`

Devuelve el ID del jugador cuyo nombre visible es exactamente `name`, respetando las mayúsculas y minúsculas. Devuelve `-1` si no hay ningún jugador así.

Ejemplo:
```lua
local player_id = MP.GetPlayerIDByName("ilovebeammp2004")
if player_id ~= -1 then
    MP.SendChatMessage(player_id, "Hello!")
end
```

### `MP.GetPlayerRole(player_id: number) -> string`

*desde la v3.6.0*

Devuelve el rol del jugador, tal como lo informa el backend de BeamMP cuando el jugador se une, por ejemplo `USER`. Devuelve `nil` si no hay ningún jugador con ese ID. Es el mismo valor que el argumento `player_role` de [`onPlayerAuth`](#onplayerauth).

### `MP.RemoveVehicle(player_id: number, vehicle_id: number) -> boolean,string`

Elimina el vehículo especificado del jugador especificado. Activa [`onVehicleDeleted`](#onvehicledeleted).

Devuelve `true` si eliminó el vehículo. Si no lo hizo, devuelve `false` y un mensaje de error: `Vehicle does not exist` o `Invalid Player ID`.

Ejemplo:
```lua
local player_id = 3
local player_vehicles = MP.GetPlayerVehicles(player_id)

-- Loop over all of player 3's vehicles and delete them
for vehicle_id, vehicle_data in pairs(player_vehicles) do
      MP.RemoveVehicle(player_id, vehicle_id)
end
```

### `MP.GetPlayerVehicles(player_id: number) -> table`

Devuelve una tabla con todos los vehículos que tiene el jugador. Cada entrada de la tabla asocia un ID de vehículo con los datos del vehículo, que son una cadena sin procesar con el formato `role:name:player_id-vehicle_id:json`. Devuelve `nil` si el jugador no existe o no tiene vehículos.

Ejemplo:
```lua
local player_id = 3
local player_vehicles = MP.GetPlayerVehicles(player_id)

for vehicle_id, vehicle_data in pairs(player_vehicles) do
    local start = string.find(vehicle_data, "{")
    local formattedVehicleData = string.sub(vehicle_data, start, -1)
    print(Util.JsonDecode(formattedVehicleData))
end
```
Salida:
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

Devuelve una tabla con todos los jugadores conectados. Esta tabla asocia IDs con nombres, así:  
```json
{
	0: "LionKor",
	1: "JohnDoe"
}
```

### `MP.IsPlayerGuest(player_id: number) -> boolean`

Indica si el jugador es un invitado. Un invitado es alguien que no inició sesión y eligió jugar como invitado. Su nombre suele ser `guest` seguido de un número largo.

Como los invitados son anónimos, puede que quieras impedirles unirse; en ese caso se recomienda usar en su lugar el argumento `is_guest` de [`onPlayerAuth`](#onplayerauth).

### `MP.DropPlayer(player_id: number, [reason: string]) -> boolean,string`

Expulsa al jugador con el ID especificado. El parámetro reason es opcional. Si se omite, el jugador ve `No reason`.

Devuelve `true`, o `false` y `Player does not exist` si no hay ningún jugador con ese ID.

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

Devuelve el uso de memoria del estado de Lua actual, en bytes.

### `MP.GetLuaMemoryUsage() -> number` 

Devuelve el uso de memoria de todos los estados de Lua combinados, en bytes.

### `MP.GetPlayerIdentifiers(player_id: number) -> table`

Devuelve una tabla con información sobre el jugador, como el ID del foro de BeamMP, la dirección IP y el ID de la cuenta de Discord. El ID de Discord solo se devolverá si el usuario lo tiene vinculado a su cuenta del foro.

Puedes encontrar el ID del foro de un usuario yendo a `https://forum.beammp.com/u/USERNAME.json` y buscando `"user": {"id": 123456}`. El ID de BeamMP es único para cada jugador y, a diferencia del nombre de usuario, no se puede cambiar. Devuelve `nil` si el jugador no existe.

Ejemplo:

```lua
local player_id = 5
print(MP.GetPlayerIdentifiers(player_id))
```
Salida:
```json
{
    ip: "127.0.0.1",
    discord: "12345678987654321",
    beammp: "1234567",
}
```

*Hasta la v3.1.0 el campo `ip` es incorrecto y no funcionará como se espera. Corregido en la v3.1.0.*

### `MP.Set(setting: number, value)`

Establece temporalmente un ajuste de ServerConfig: el cambio dura hasta que el servidor se detiene y no se escribe en `ServerConfig.toml`. Como primer argumento, usa un valor de la tabla `MP.Settings`. El tipo de `value` depende del ajuste:

- `MP.Settings.Debug`, `MP.Settings.Private` y `MP.Settings.InformationPacket` reciben un booleano.
- `MP.Settings.MaxCars` y `MP.Settings.MaxPlayers` reciben un entero.
- `MP.Settings.Map`, `MP.Settings.Name` y `MP.Settings.Description` reciben una cadena.

Un valor del tipo equivocado registra un error, y un ajuste desconocido registra una advertencia. Ninguno de los dos cambia nada. Un proveedor de servidores puede desactivar esta función; consulta `BEAMMP_PROVIDER_DISABLE_MP_SET` en el [Manual del Servidor](/es/server-owners/manual#provider-settings). Entonces cada llamada registra un error y no cambia nada.

Ejemplo:
```lua
MP.Set(MP.Settings.Debug, true) -- Turns on debug mode
```

### `MP.Get(setting: number) -> boolean | number | string`

*desde la v3.6.0*

Devuelve el valor actual de un ajuste de ServerConfig. Como argumento, usa un valor de la tabla `MP.Settings`. El tipo del resultado es el tipo que `MP.Set` recibe para ese ajuste. Para un ajuste desconocido, registra una advertencia y devuelve `0`.

Ejemplo:
```lua
print(MP.Get(MP.Settings.MaxPlayers))
```

### `MP.Settings -> table`

Tabla que asocia los nombres de los ajustes con sus IDs. Se usa con `MP.Set` y `MP.Get` para cambiar y leer los ajustes de ServerConfig. `InformationPacket` existe desde la v3.7.0.

Ejemplo:
```lua
print(MP.Settings)
```
Salida:
```json
{
    Debug: 0,
    Private: 1,
    MaxCars: 2,
    MaxPlayers: 3,
    Map: 4,
    Name: 5,
    Description: 6,
    InformationPacket: 7,
}
```

### `MP.GetServerTimeMS() -> number`

### `MP.GetServerTime() -> number`

*desde la v3.9.4*

Devuelven la lectura del reloj propio del servidor. El servidor también envía esta lectura al juego de un jugador cuando el juego le pide la hora. `MP.GetServerTimeMS()` la devuelve en milisegundos y `MP.GetServerTime()` en segundos, con decimales. El reloj no muestra la fecha ni la hora del día, y empieza con un valor distinto cada vez que el servidor se inicia. Úsalo para medir cuánto tiempo pasó entre dos momentos, no para saber qué hora es.

Ejemplo:
```lua
local start = MP.GetServerTimeMS()
-- do something
print("took " .. (MP.GetServerTimeMS() - start) .. " ms")
```
## Funciones Util {#util-functions}

### `Util.Json*`

Desde BeamMP-Server `v3.1.0`.

Es una biblioteca JSON integrada, que suele ser mucho más rápida que cualquier biblioteca JSON de Lua. Por debajo se usa la biblioteca `nlohmann::json` de C++, que cumple el estándar JSON, tiene pruebas unitarias de cobertura completa y se somete continuamente a fuzzing.

### `Util.JsonEncode(table: table) -> string`

Codifica una tabla de Lua como una cadena JSON, de forma recursiva (las tablas dentro de tablas dentro de tablas... funcionan como se espera). Se respetan todos los tipos primitivos; las funciones, los userdata y similares se ignoran.

El JSON resultante está minificado y se puede formatear para que sea legible con `Util.JsonPrettify`.

Ejemplo: 
```lua
local player = {
	name = "Lion",
	age = 69,
	skills = { "skill A", "skill B" }
}
local json = Util.JsonEncode(player)
```

Resultado: 
```json
{"name":"Lion","age":69,"skills":["skill A","skill B"]}
```

### `Util.JsonDecode(json: string) -> table`

Decodifica JSON en una tabla de Lua. Devolverá `nil` si falla, e imprimirá un error.

Ejemplo:
```lua
local json = "{\"message\":\"OK\",\"code\":200}"
local tbl = Util.JsonDecode(json)
```

Resultado:
```lua
{
	message = "OK",
	code = 200,
}
```

### `Util.JsonPrettify(json: string) -> string`

Añade sangría y saltos de línea al json para que sea más legible para las personas.

Ejemplo:
```
local myjson = Util.JsonEncode({ name="Lion", age = 69, skills = { "skill A", "skill B" } })

print(Util.JsonPrettify(myjson))
```

Resultado:
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

Elimina la sangría, los saltos de línea y cualquier otro espacio en blanco. No es necesario salvo que hayas llamado a `Util.JsonPrettify`, ya que toda la salida de `Util.Json*` ya está minificada.

Ejemplo:
```lua
local pretty = Util.JsonPrettify(Util.JsonEncode({ name="Lion", age = 69, skills = { "skill A", "skill B" } }))

print(Util.JsonMinify(pretty))
```

Resultado:
```json
{"age":69.0,"name":"Lion","skills":["skill A","skill B"]}
```

### `Util.JsonFlatten(json: string) -> string`

Crea un objeto JSON cuyas claves se aplanan a punteros JSON, según la RFC 6901. Puedes restaurar el original con `Util.JsonUnflatten()`. Para que funcione, todos los valores deben ser primitivos.

Ejemplo:
```lua
local json = Util.JsonEncode({ name="Lion", age = 69, skills = { "skill A", "skill B" } })
print("normal: " ..json)
print("flattened: " .. Util.JsonFlatten(json))
print("flattened pretty: " .. Util.JsonPrettify(Util.JsonFlatten(json)))

```

Resultado: 
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

Restaura el anidamiento arbitrario de un valor JSON que se había aplanado antes con la función `Util.JsonFlatten()`. 

### `Util.JsonDiff(a: string, b: string) -> string`

Crea un diff JSON según la RFC 6902 (http://jsonpatch.com/). Devuelve el diff.

## `Util.Random*`

Desde BeamMP-Server `v3.1.0`.

### `Util.Random() -> float`

Devuelve un número decimal (float) entre 0 y 1.

Ejemplo:
```lua
local rand = Util.Random()
print("rand: " .. rand)
```

Resultado: 
```lua
rand: 0.135477
```

### `Util.RandomIntRange(min: int, max: int) -> int`

Devuelve un entero entre min y max.

Ejemplo:
```lua
local randInt = Util.RandomIntRange(1, 100)
print("randInt: " .. randInt)
```

Resultado: 
```lua
randInt:  69
```

### `Util.RandomRange(min: number, max: number) -> float`

Devuelve un número decimal (float) entre min y max.

Ejemplo:
```lua
local randFloat = Util.RandomRange(1, 1000)
print("randFloat: " .. randFloat)
```

Resultado: 
```lua
randFloat: 420.6969
```

### `Util.LogInfo(params: ...)` y similares (desde la v3.3.0)

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

`[Test]` es el nombre del estado de Lua, que es el nombre del plugin a menos que el plugin comparta un estado (consulta [Compartir un estado de Lua](#sharing-a-lua-state)). `Util.LogDebug` solo imprime mientras el ajuste `Debug` está activado.

Admite exactamente la misma impresión / volcado de datos que `print()`.

### `Util.DebugExecutionTime() -> table`

Cuando el código Lua se ejecuta en el servidor, se mide el tiempo de ejecución de cada manejador de eventos. Se calculan el mínimo, el máximo, la media y la desviación estándar de esos tiempos de ejecución, y esta función los devuelve en una tabla. El cálculo se hace de forma incremental, de modo que cada vez que se ejecuta un manejador de eventos se actualizan el mínimo, el máximo, la media y la desviación estándar. Así, `Util.DebugExecutionTime()` no suele tardar un tiempo significativo en ejecutarse (menos de 0,25 ms).

Devuelve una tabla como esta:
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
Por cada *manejador* de eventos, devuelve los siguientes datos:

- `n`: cantidad de veces que se activó el evento y se llamó a un manejador
- `mean`: promedio/media de todos los tiempos de ejecución, en ms
- `max`: el tiempo de ejecución más largo, en ms
- `min`: el tiempo de ejecución más corto, en ms
- `stdev`: la desviación estándar de todos los promedios de tiempo de ejecución, en ms

Esta es una función que puedes usar para mostrar estos datos con buen formato:

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

Puedes llamarla así para depurar tu código si va lento:

```lua
-- event to print the debug times
MP.RegisterEvent("printStuff", "printDebugExecutionTime")
-- run every 5000 ms = 5 seconds (or 10, or 60, whatever makes sense for you
MP.CreateEventTimer("printStuff", 5000)
```

### `Util.DebugStartProfile(name: string)`

### `Util.DebugStopProfile(name: string)`

Desde BeamMP-Server `v3.4.0`.

Mide el tiempo de cualquier parte de tu código, no solo de un manejador de eventos completo. `Util.DebugStartProfile` inicia una medición con el nombre indicado, y `Util.DebugStopProfile` la termina y suma el tiempo a las estadísticas de ese nombre. Las estadísticas aparecen en la tabla que devuelve `Util.DebugExecutionTime()`, junto a los manejadores de eventos. Llamar a `Util.DebugStopProfile` con un nombre que no se inició registra un error.

Ejemplo:
```lua
Util.DebugStartProfile("mySlowPart")
-- do something slow
Util.DebugStopProfile("mySlowPart")
print(Util.DebugExecutionTime()["mySlowPart"].mean)
```

## Funciones FS {#fs-functions}

Las funciones `FS` son funciones del **s**istema de **a**rchivos (**f**ile**s**ystem), que buscan mejorar las capacidades predeterminadas de Lua.

Usa siempre `/` como separador al especificar rutas, ya que es multiplataforma (Windows, Linux, macOS, ...).

### `FS.CreateDirectory(path: string) -> bool,string`


Crea el directorio especificado, y los directorios superiores si no existen. Su comportamiento equivale aproximadamente al comando habitual de Linux `mkdir -p`.

Si tiene éxito, devuelve `true` y `""`. Si falla la creación del directorio, se devuelve `false` y un mensaje de error (`string`).

Ejemplo:
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

Elimina el archivo especificado o la carpeta vacía especificada. Una carpeta que tiene archivos dentro no se elimina.

Devuelve `true` si lo consiguió, o si no había nada que eliminar. Si falló, devuelve `false` y un mensaje de error.

Ejemplo:
```lua
local success, error_message = FS.Remove("myfile.txt")

if not success then
	print("failed to delete myfile: " .. error_message)
end
```

### `FS.Rename(pathA: string, pathB: string) -> bool,string`

Cambia el nombre de `pathA` (o lo mueve) a `pathB`.

Devuelve `true` si lo consiguió. Si falló, devuelve `false` y un mensaje de error.

### `FS.Copy(pathA: string, pathB: string) -> bool,string`

Copia `pathA` en `pathB`. Una carpeta se copia con todo lo que contiene.

Devuelve `true` si lo consiguió. Si falló, devuelve `false` y un mensaje de error.

### `FS.GetFilename(path: string) -> string`

Devuelve la última parte de una ruta, que normalmente es el nombre del archivo.
Estos son algunos ejemplos de entradas y salidas:

```lua
input -> output

"my/path/a.txt" 	-> "a.txt"
"somefile.txt" 		-> "somefile.txt"
"/awesome/path" 	-> "path"
```

### `FS.GetExtension(path: string) -> string`


Devuelve la extensión del archivo, o una cadena vacía si no tiene extensión.
Estos son algunos ejemplos de entradas y salidas

```lua
input -> output

"myfile.txt" 					-> ".txt"
"somefile." 					-> "."
"/awesome/path" 				-> ""
"/awesome/path/file.zip.txt"	-> ".txt"
"myexe.exe" 					-> ".exe"
```


### `FS.GetParentFolder(path: string) -> string`

Devuelve la ruta del directorio superior, es decir, la carpeta que contiene un archivo o una carpeta.
Estos son algunos ejemplos de entradas y salidas:

```lua
input -> output

"/var/tmp/example.txt" 		-> "/var/tmp"
"/"							-> "/"
"mydir/a/b/c.txt"			-> "mydir/a/b"
```


### `FS.Exists(path: string) -> bool`

Devuelve `true` si la ruta existe y `false` si no existe.

### `FS.IsDirectory(path: string) -> bool`

Devuelve `true` si la ruta especificada es un directorio y `false` si no lo es. Ten en cuenta que `false` NO implica que la ruta sea un archivo (consulta `FS.IsFile()`).

### `FS.IsFile(path: string) -> bool`

Devuelve `true` si la ruta especificada es un archivo normal (no un enlace simbólico, un enlace duro, un dispositivo de bloques, etc.) y `false` si no lo es. Ten en cuenta que `false` NO implica que la ruta sea un directorio (consulta `FS.IsDirectory()`).

### `FS.ListDirectories(path: string) -> table`

Devuelve una tabla con todos los directorios de la ruta indicada. Devuelve `nil` si la ruta no existe.

Ejemplo:
```lua
print(FS.ListDirectories("Resources"))
```
Resultado: 
```lua
{
    1: "Client",
    2: "Server"
}
```

### `FS.ListFiles(path: string) -> table`

Devuelve una tabla con todos los archivos de la ruta indicada. Devuelve `nil` si la ruta no existe.

Ejemplo:
```lua
print(FS.ListFiles("Resources/Server/examplePlugin"))
```
Resultado: 
```lua
{
    1: "example.json",
    2: "example.lua"
}
```

### `FS.ConcatPaths(...) -> string`

Une (concatena) todos los argumentos con el separador de rutas preferido del sistema.

Ejemplo:
```lua  
FS.ConcatPaths("a", "b", "/c/d/e/", "/f/", "g", "h.txt")
```
da como resultado
```
a/b/c/d/e/f/g/h.txt
```

También resuelve `..`, si aparece en algún punto de la ruta. Esta función es más segura que concatenar cadenas en Lua, y respeta los separadores de la plataforma.

Usa siempre `/` como separador al especificar rutas, ya que es multiplataforma (Windows, Linux, macOS, ...).

## Eventos {#events-1}

### Explicación

- Arguments: lista de argumentos que reciben los manejadores de este evento
- Cancellable: indica si el evento se puede cancelar. Si se puede cancelar, un manejador puede hacerlo devolviendo `1`, como en `return 1`.

### Resumen de eventos

Cuando un jugador se une, se activan los siguientes eventos en este orden:

1. `onPlayerAuth`
2. `postPlayerAuth` (también si se rechazó al jugador)
3. `onPlayerConnecting`
4. `onPlayerJoining`
5. `onPlayerJoin`

Los eventos cuyo nombre empieza por `post` te informan del resultado del evento del mismo nombre, una vez que ha ocurrido. No se pueden cancelar.

### Eventos del sistema

#### `onInit`

Arguments: NONE
Cancellable: NO

Se activa justo después de que se inicialicen todos los archivos del plugin. El servidor espera hasta 5 segundos a los manejadores. También se vuelve a activar para un plugin cuando se recarga en caliente uno de sus archivos `.lua`.

#### `onConsoleInput`

Arguments: `input: string`
Cancellable: NO

Se activa cuando la consola de BeamMP recibe una entrada. El argumento es la línea completa que se escribió. Consulta [Comandos personalizados](#custom-commands).

#### `onShutdown`

Arguments: NONE
Cancellable: NO

Se activa cuando el servidor se apaga, después de expulsar a todos los jugadores. El servidor espera hasta 5 segundos a los manejadores.

### Eventos relacionados con el juego

#### `onPlayerAuth`

Arguments: `player_name: string`, `player_role: string`, `is_guest: bool`, `identifiers: table -> beammp, ip`
Cancellable: YES

Es el primer evento que se activa cuando un jugador quiere unirse. Se puede impedir que un jugador se una devolviendo `1` o un motivo (`string`) desde la función manejadora. El motivo devuelto se muestra al jugador. Con `1`, el jugador ve "you are not allowed on the server!".

Desde la v3.6.0, un manejador puede devolver `2` para dejar que el jugador se una aunque el servidor esté lleno (`MaxPlayers`). Esto no anula el rechazo de otro manejador, y no permite entrar a un invitado en un servidor donde `AllowGuests` es `false`.

```lua
function myPlayerAuthorizer(name, role, is_guest, identifiers)
	return "Sorry, you cannot join at this time."
end
MP.RegisterEvent("onPlayerAuth", "myPlayerAuthorizer")
```

#### `postPlayerAuth`

*desde la v3.5.0*

Arguments: `denied: bool`, `reason: string`, `player_name: string`, `player_role: string`, `is_guest: bool`, `identifiers: table -> beammp, ip`
Cancellable: NO

Se activa justo después de `onPlayerAuth`, tanto si se permitió unirse al jugador como si no. `denied` es `true` si se rechazó al jugador. `reason` es el texto que se muestra al jugador, o una cadena vacía si no hay ninguno.

#### `onPlayerConnecting`

Arguments: `player_id: number`
Cancellable: NO

Se activa cuando un jugador empieza a conectarse, después de `onPlayerAuth`. El jugador recibe su ID antes de este evento. El jugador todavía no ha descargado los mods.

#### `onPlayerJoining`

Arguments: `player_id: number`
Cancellable: NO

Se activa cuando un jugador ha terminado de cargar todos los mods, después de `onPlayerConnecting`.

#### `onPlayerJoin`

Arguments: `player_id: number`
Cancellable: NO

Se activa después de `onPlayerJoining`, cuando el juego del jugador informa de que se ha unido. Entonces el servidor empieza a enviarle al jugador los vehículos que ya existen.

#### `onPlayerDisconnect`

Arguments: `player_id: number`
Cancellable: NO

Se activa cuando un jugador se desconecta. Llega después de que se haya activado [`onVehicleDeleted`](#onvehicledeleted) para cada uno de los vehículos del jugador.

#### `onChatMessage`

Arguments: `player_id: number`, `player_name: string`, `message: string`
Cancellable: YES

Se activa cuando un jugador envía un mensaje de chat. Si se cancela, el mensaje de chat no se mostrará a nadie, ni siquiera al jugador que lo envió. El servidor descarta un mensaje vacío, y uno de más de 500 bytes (desde la v3.9.1), antes de activar este evento.

#### `postChatMessage`

*desde la v3.5.0*

Arguments: `accepted: bool`, `player_id: number`, `player_name: string`, `message: string`
Cancellable: NO

Se activa después de `onChatMessage`. `accepted` es `false` si un manejador canceló el mensaje.

#### `onVehicleSpawn`

Arguments: `player_id: number`, `vehicle_id: number`, `data: string`
Cancellable: YES

Se activa cuando un jugador genera un vehículo nuevo. Ten en cuenta que los cambios o sustituciones de vehículo activan en su lugar [`onVehicleEdited`](#onvehicleedited). El argumento `data` contiene, como cadena json, la configuración del coche y los datos de posición y rotación del vehículo. Además, un vehículo no se genera si el jugador ya tiene `MaxCars` vehículos. El unicycle no cuenta.

#### `postVehicleSpawn`

*desde la v3.5.0*

Arguments: `spawned: bool`, `player_id: number`, `vehicle_id: number`, `data: string`
Cancellable: NO

Se activa después de `onVehicleSpawn`. `spawned` es `false` si un manejador canceló la generación, o si el vehículo se rechazó por otro motivo, como que el jugador ya tenga `MaxCars` vehículos. `data` es lo mismo que en `onVehicleSpawn`.

<details>

<summary>Valor de ejemplo de <code>data</code></summary>

La cadena de datos empieza con el rol y el nombre del jugador, y después un identificador único del vehículo, que es el ID del jugador, un guion y después el ID del vehículo. A continuación hay un objeto JSON con información sobre la configuración y la posición del vehículo. Las partes se separan con `:`, así que la cadena tiene el aspecto `role:name:player_id-vehicle_id:{...}`. En el ejemplo de abajo se omiten el rol y el nombre.

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

Arguments: `player_id: number`, `vehicle_id: number`, `data: string`
Cancellable: YES

Se activa cuando un jugador edita o sustituye su vehículo. El argumento `data` contiene, como cadena json, la configuración actualizada del coche, pero **no** incluye datos de posición ni de rotación. Puedes usar [MP.GetPositionRaw](#mp-getpositionraw-pid-number-vid-number-table-string) para obtener los datos de posición y rotación.

<details>

<summary>Valor de ejemplo de <code>data</code></summary>

La cadena de datos empieza con un identificador único del vehículo, que es el ID del jugador, un guion y después el ID del vehículo. A continuación hay un objeto JSON con información sobre la configuración del vehículo.

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

#### `postVehicleEdited`

*desde la v3.5.0*

Arguments: `allowed: bool`, `player_id: number`, `vehicle_id: number`, `data: string`
Cancellable: NO

Se activa después de `onVehicleEdited`. `allowed` es `false` si un manejador canceló la edición. Entonces el servidor elimina el vehículo. `data` es lo mismo que en `onVehicleEdited`.

#### `onVehicleDeleted`

Arguments: `player_id: number`, `vehicle_id: number`
Cancellable: NO

Se activa cuando un jugador elimina su vehículo. También se activa cuando `MP.RemoveVehicle` elimina un vehículo, cuando se cancela una generación o una edición y el vehículo se elimina, y, desde la v3.5.0, por cada vehículo de un jugador que se desconecta.

#### `onVehicleReset`

Arguments: `player_id: number`, `vehicle_id: number`, `data: string`
Cancellable: NO

Se activa cuando un jugador restablece su vehículo. `data` es la posición y rotación actualizadas del coche, pero **no** incluye la configuración del vehículo. Puedes usar [MP.GetPlayerVehicles](#mp-getplayervehicles-player-id-number-table) para obtener la configuración del vehículo.

#### `onVehiclePaintChanged`

*desde la v3.7.0*

Arguments: `player_id: number`, `vehicle_id: number`, `data: string`
Cancellable: NO

Se activa cuando un jugador cambia la pintura de su vehículo. `data` es una cadena json con las nuevas pinturas del vehículo, que es un array. El servidor guarda las nuevas pinturas en los datos del vehículo, así que [MP.GetPlayerVehicles](#mp-getplayervehicles-player-id-number-table) las devuelve a partir de entonces.

#### `onFileChanged`

*desde la v3.1.0*

Arguments: `path: string`
Cancellable: NO

Se activa si cambia un archivo en el directorio `Resources/Server` *o en cualquiera de sus subdirectorios*. El servidor comprueba si hay cambios cada 3 segundos.

Un cambio en un archivo `.lua` del directorio `Resources/Server/<plugin>` (no en una subcarpeta suya) hace que el servidor vuelva a ejecutar ese archivo en el estado de Lua del plugin, después active `onInit` para ese plugin y a continuación active `onFileChanged`. El estado en sí se conserva, así que sus variables globales siguen ahí y los manejadores que registraste antes siguen registrados.

Un cambio en cualquier otro archivo de `Resources/Server/<plugin>`, o en cualquier archivo de una subcarpeta, como `Resources/Server/<plugin>/lua/stuff.lua`, no ejecuta nada y solo activa `onFileChanged`. Así puedes recargarlo tú mismo de la forma correcta (o no recargarlo).

Esto se aplica a todos los archivos, no solo a los `.lua`.

La `path` es relativa a la raíz del servidor, por ejemplo `Resources/Server/myplugin/myfile.txt`. Puedes seguir procesando esta cadena con la familia de funciones `FS.*`, por ejemplo para extraer el nombre o la extensión (`FS.GetExtension(...)`, `FS.GetFilename(...)`, ...).

Nota: los archivos añadidos después de iniciar el servidor *no* se rastrean.

## Migración desde el Lua antiguo {#migrating-from-old-lua}

Este es un breve resumen de los pasos básicos para migrar del Lua antiguo al nuevo.

### Entender cómo funciona el Lua nuevo

Para ello, lee con atención la sección ["Introducción"](#introduction) y todas sus subsecciones.
Es necesario para hacer bien los siguientes pasos.

### Buscar y reemplazar

Primero, debes buscar y reemplazar todas las funciones MP. La sustitución debe añadir `MP.` delante de todas las funciones MP, excepto `print()`.

Ejemplo:

```lua
local players = GetPlayers()
print(#players)
```
se convierte en

```lua
local players = MP.GetPlayers()
print(#players) -- note how print() doesn't change
```

### ¡Adiós hilos, hola temporizadores de eventos!

Como se explicó en la introducción, los hilos son temporizadores de eventos. Sustituye cada llamada a `CreateThread` por una llamada a `CreateEventTimer`. Revisa con cuidado el intervalo que tenía tu antiguo CreateThread (el número era X por segundo) y piensa cuál es el valor de tiempo de espera del temporizador de eventos para ello (que está en milisegundos). Ten en cuenta también que, en lugar de un nombre de función, recibe un nombre de evento, así que tendrás que registrar también un evento.

Ejemplo:

```lua
CreateThread("myFunction", 2) -- calls "myFunction" twice per second
```
se convierte en

```lua
MP.RegisterEvent("myEvent", "myFunction") -- registering our event for the timer
MP.CreateEventTimer("myEvent", 500) -- 500 milliseconds = 2 times per second
```

Si tienes muchos temporizadores de eventos, tiene sentido ver si puedes combinarlos; por ejemplo, creando un evento "cada minuto" y registrándole varias funciones que deban llamarse cada minuto, en lugar de tener varios temporizadores de eventos. Cada temporizador de eventos le cuesta un poco de tiempo al servidor para activarse.

### Se acabó la llamada implícita de eventos

Tienes que registrar todos tus eventos. No puedes depender de los nombres de las funciones. En el Lua antiguo esto no estaba claro, pero en el Lua nuevo normalmente se exige. Un buen patrón es: 

```lua
MP.RegisterEvent("onChatMessage", "chatMessageHandler")
-- or 
MP.RegisterEvent("onChatMessage", "handleChatMessage")
```

Es un patrón mejor que llamar al manejador igual que al evento, lo cual es engañoso y confuso.
