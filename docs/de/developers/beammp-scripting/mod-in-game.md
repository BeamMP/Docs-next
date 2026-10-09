::: warning Diese Seite befindet sich im Aufbau!
An dieser Seite wird aktiv gearbeitet.

Du möchtest helfen? Dann klicke bitte rechts auf das Symbol mit dem Blatt und dem Stift!

Das ist auf jeder Seite möglich.
:::

# Mod-/Im-Spiel-Scripting-Referenz

Mit BeamMP kannst du auch eigene clientseitige Plugins erstellen. Wir stellen dir einige Funktionen zur Verfügung, mit denen du über den Server mit anderen Multiplayer-Mods und anderen Spielern kommunizieren kannst.

# Funktionen

Liste der verfügbaren Funktionen für das Scripting:

| Funktion                                  | Hinweise                                                                                                                                                                                |
|-------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `TriggerServerEvent("eventName", "data")` | Löst ein Event in der Server-Lua-Umgebung aus, beide Parameter sind Strings.                                                                                                            |
| `TriggerClientEvent("eventName", "data")` | Löst ein Event in der lokalen Lua-Umgebung aus, beide Parameter sind Strings. Gut geeignet für die Kommunikation zwischen Plugins.                                                      |
| `AddEventHandler("eventName", Function)`  | Fügt den 2. Parameter der Tabelle hinzu, damit er aufgerufen wird, wenn `eventName` empfangen wird (lokal oder vom Server). `Function` erhält 1 Parameter, einen String mit den Event-Daten. |

# Code-Snippets

Um zum Beispiel den Chat auszuwerten, verwende das mitgelieferte Event `ChatMessageIncluded` wie folgt:
```lua
local function chatReceived(msg) -- Receive event with parameters
    print("chat received: "..msg)
    local i = string.find(s, ":") -- Find where our first ':' is, used to separate the sender and message
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
