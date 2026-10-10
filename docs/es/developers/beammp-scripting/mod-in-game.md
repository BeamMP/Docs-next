---
description: "Las funciones de Lua de BeamMP en el juego (cliente): eventos y manejadores, eventos del chat, escuchas de teclas, hooks de extensiones y funciones para etiquetas de nombre, roles y lista de jugadores."
---
# Referencia de scripting del mod (en el juego)

BeamMP también permite escribir plugins del lado del cliente. Unas pocas funciones te permiten comunicarte con otros mods multijugador y con otros jugadores a través del servidor. Para configurar un plugin, consulta [Creación de Mods y Recursos](/es/developers/mod-and-resource-creation). Esta página se ha comprobado con BeamMP 4.22.5.

## Funciones de eventos

| Función | Qué hace |
|---|---|
| `TriggerServerEvent("eventName", "data")` | Activa un evento en el entorno de Lua del servidor. Ambos parámetros son cadenas de texto. El servidor necesita un manejador para el evento, registrado con `MP.RegisterEvent` |
| `TriggerClientEvent("eventName", "data")` | Activa un evento en el entorno de Lua local. Ambos parámetros son cadenas de texto. Útil para la comunicación entre plugins |
| `AddEventHandler("eventName", Function, "name")` | Añade `Function` para que se llame cuando se reciba `eventName`, ya sea de forma local o desde el servidor. `Function` recibe un parámetro: una cadena de texto con los datos del evento. `name` es opcional, consulta más abajo |
| `RemoveEventHandler("eventName", "name")` | Elimina un manejador añadido con `AddEventHandler`. `name` es opcional, consulta más abajo |

- El nombre de un evento no puede contener dos puntos (`:`). Los datos sí pueden.
- Un manejador pertenece al archivo que llamó a `AddEventHandler`. Si el mismo archivo añade un manejador para un evento que ya tiene uno, el nuevo manejador sustituye al anterior. Para mantener varios manejadores de un mismo evento en un archivo, dale a cada uno un `name` distinto. Usa el mismo `name` con `RemoveEventHandler`.
- Si un manejador produce un error, BeamMP registra el error y continúa con los demás manejadores.
- `AddEventHandler` solo existe mientras BeamMP está cargado. Si tu mod también se ejecuta en el modo de un jugador, escribe `if AddEventHandler then ... end`.

Para la parte del servidor de estos eventos, consulta la [referencia de scripting del servidor](/es/developers/beammp-scripting/server/latest).

## Eventos que activa BeamMP

| Evento | Cuándo | Datos |
|---|---|---|
| `ChatMessageReceived` | Llega un mensaje de chat | `Sender: message`, una cadena de texto sin la etiqueta de rol del remitente |
| `ChatMessageSent` | Envías un mensaje de chat | `C:Sender: message`, donde `Sender` es tu nombre |

## Ejemplo: leer los mensajes del chat

Para leer el chat, usa el evento integrado `ChatMessageReceived`:

```lua
local function chatReceived(msg) -- Receive event with parameters
    print("chat received: "..msg)
    local i = string.find(msg, ":") -- Find where our first ':' is, used to separate the sender and message
    if i == nil then
        print("error parsing message: separator could not be found!")
        return -- Could not find separator, cancel function
    end
    print("index of separator: "..tostring(i))
    local sender = string.sub(msg, 1, i-1) -- Substring our input to separate its 2 parts
    local message = string.sub(msg, i+2, -1)  -- Skip the ':' and the space after it. Do whatever you want to with the message
    print("sender: " .. sender)
    print("message: ".. message)
end

AddEventHandler("ChatMessageReceived", chatReceived) -- Add our event handler to the list managed by BeamMP
```

## Escuchas de teclas

| Función | Qué hace |
|---|---|
| `onKeyPressed("NUMPAD1", Function)` | Llama a `Function` cuando se pulsa la tecla |
| `onKeyReleased("NUMPAD1", Function)` | Llama a `Function` cuando se suelta la tecla |
| `addKeyEventListener("NUMPAD1", Function, "down")` | Llama a `Function` cuando cambia el estado de la tecla. El último parámetro es `"down"`, `"up"` o `"both"`, y `"both"` es el valor predeterminado |
| `getKeyState("NUMPAD1")` | Devuelve `true` mientras la tecla se mantiene pulsada y `false` en caso contrario |

`Function` recibe un parámetro: `true` si se pulsó la tecla y `false` si se soltó.

## Hooks de extensiones

BeamMP llama a estos hooks en cada extensión cargada que los defina:

| Hook | Cuándo |
|---|---|
| `onBeamMPLauncherConnected` | El juego se ha conectado al Launcher |
| `onBeamMPPostJoin` | El mapa del servidor se ha cargado como parte de la unión |
| `onBeamMPServerLeave` | Sales del servidor |

## Etiquetas de nombre, roles y la lista de jugadores

Estas funciones están en la extensión `MPVehicleGE`. Los ID de jugador son números, y el ID de un vehículo tiene la forma `playerID-vehicleID`, como `"0-1"`.

| Función | Qué hace |
|---|---|
| `MPVehicleGE.getPlayers()` | Devuelve la tabla de todos los jugadores conocidos, con el ID de jugador como clave |
| `MPVehicleGE.getVehicles()` | Devuelve la tabla de todos los vehículos multijugador, con el ID del vehículo como clave |
| `MPVehicleGE.getPlayerByName("name")` | Devuelve la tabla del jugador y el ID de jugador, o `nil` si no existe ese jugador |
| `MPVehicleGE.isOwn(gameVehicleID)` | Devuelve `true` si el vehículo del juego con ese número te pertenece |
| `MPVehicleGE.setPlayerNickPrefix("name", "source", "text")` | Añade `text` antes de la etiqueta de nombre de un jugador. Usa un `source` distinto para cada prefijo que quieras conservar |
| `MPVehicleGE.setPlayerNickSuffix("name", "source", "text")` | Añade `text` después de la etiqueta de nombre de un jugador. Usa un `source` distinto para cada sufijo que quieras conservar |
| `MPVehicleGE.hideNicknames(true)` | Hace que BeamMP deje de dibujar las etiquetas de nombre. Con `false` se vuelven a dibujar |
| `MPVehicleGE.setPlayerRole(playerID, "tag", "shorttag", red, green, blue)` | Da un rol personalizado a un jugador. La etiqueta y la etiqueta corta son texto que BeamMP muestra entre corchetes, y el color de fondo son tres números de 0 a 255. Devuelve `false` y un mensaje de error si algún argumento no es válido |
| `MPVehicleGE.clearPlayerRole(playerID)` | Elimina el rol personalizado de un jugador |
| `MPVehicleGE.setVehicleRole("playerID-vehicleID", "tag", "shorttag", red, green, blue)` | Da un rol personalizado a un solo vehículo |
| `MPVehicleGE.clearVehicleRole("playerID-vehicleID")` | Elimina el rol personalizado de un vehículo |
| `MPVehicleGE.applyQueuedEvents()` | Carga todos los cambios de vehículos en cola |

Para añadir un botón al menú contextual (clic derecho) de la lista de jugadores, añade una función a la tabla que devuelve `UI.getCustomPlayerlistButtons()`. La clave es el texto del botón. La función recibe el nombre y el ID del jugador:

```lua
local buttons = UI.getCustomPlayerlistButtons()
buttons["Say hello"] = function(name, id)
  print("Hello, " .. name .. " (ID " .. tostring(id) .. ")")
end
```
