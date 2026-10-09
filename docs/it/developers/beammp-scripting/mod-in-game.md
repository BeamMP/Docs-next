---
description: "Le funzioni Lua in gioco (lato client) di BeamMP: TriggerServerEvent, TriggerClientEvent e AddEventHandler, con un esempio che analizza i messaggi della chat."
---
# Riferimento allo scripting della mod (in gioco)

BeamMP ti permette di scrivere anche plugin lato client. Alcune funzioni ti permettono di comunicare con altre mod multigiocatore e con gli altri giocatori tramite il server. Per configurare un plugin, consulta [Creazione di Mod e Risorse](/it/developers/mod-and-resource-creation).

## Funzioni

| Funzione | Cosa fa |
|---|---|
| `TriggerServerEvent("eventName", "data")` | Scatena un evento nell'ambiente Lua del server. Entrambi i parametri sono stringhe |
| `TriggerClientEvent("eventName", "data")` | Scatena un evento nell'ambiente Lua locale. Entrambi i parametri sono stringhe. Utile per la comunicazione tra plugin |
| `AddEventHandler("eventName", Function)` | Aggiunge `Function` per essere chiamata quando viene ricevuto `eventName`, in locale o dal server. `Function` riceve un parametro: una stringa con i dati dell'evento |

## Esempio: leggere i messaggi della chat

Per leggere la chat, usa l'evento integrato `ChatMessageReceived`:
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
