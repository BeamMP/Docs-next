---
description: "Die clientseitigen Lua-Funktionen von BeamMP im Spiel: TriggerServerEvent, TriggerClientEvent und AddEventHandler, mit einem Beispiel, das Chat-Nachrichten auswertet."
---
# Scripting-Referenz: Mod (Im Spiel)

Mit BeamMP kannst du auch clientseitige Plugins schreiben. Einige Funktionen lassen dich mit anderen Multiplayer-Mods und über den Server mit anderen Spielern kommunizieren. Wie du ein Plugin einrichtest, steht unter [Mod- & Ressourcenerstellung](/de/developers/mod-and-resource-creation).

## Funktionen

| Funktion | Was sie macht |
|---|---|
| `TriggerServerEvent("eventName", "data")` | Löst ein Event in der Lua-Umgebung des Servers aus. Beide Parameter sind Strings |
| `TriggerClientEvent("eventName", "data")` | Löst ein Event in der lokalen Lua-Umgebung aus. Beide Parameter sind Strings. Gut für die Kommunikation zwischen Plugins |
| `AddEventHandler("eventName", Function)` | Fügt `Function` hinzu, damit sie aufgerufen wird, wenn `eventName` empfangen wird, entweder lokal oder vom Server. `Function` erhält einen Parameter: einen String mit den Event-Daten |

## Beispiel: Chat-Nachrichten lesen

Um den Chat zu lesen, nutze das eingebaute Event `ChatMessageReceived`:
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
