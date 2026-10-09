---
description: "Las funciones de Lua de BeamMP en el juego (cliente): TriggerServerEvent, TriggerClientEvent y AddEventHandler, con un ejemplo que analiza mensajes del chat."
---
# Referencia de scripting del mod (en el juego)

BeamMP también permite escribir plugins del lado del cliente. Unas pocas funciones te permiten comunicarte con otros mods multijugador y con otros jugadores a través del servidor. Para configurar un plugin, consulta [Creación de Mods y Recursos](/es/developers/mod-and-resource-creation).

## Funciones

| Función | Qué hace |
|---|---|
| `TriggerServerEvent("eventName", "data")` | Activa un evento en el entorno de Lua del servidor. Ambos parámetros son cadenas de texto |
| `TriggerClientEvent("eventName", "data")` | Activa un evento en el entorno de Lua local. Ambos parámetros son cadenas de texto. Útil para la comunicación entre plugins |
| `AddEventHandler("eventName", Function)` | Añade `Function` para que se llame cuando se reciba `eventName`, ya sea de forma local o desde el servidor. `Function` recibe un parámetro: una cadena de texto con los datos del evento |

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
    local message = string.sub(msg, i+1, -1)  -- Do whatever you want to with the message
    print("sender: " .. sender)
    print("message: ".. message)
end

AddEventHandler("ChatMessageReceived", chatReceived) -- Add our event handler to the list managed by BeamMP
```
