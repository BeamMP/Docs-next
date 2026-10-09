---
description: "The BeamMP in-game (client-side) Lua functions: TriggerServerEvent, TriggerClientEvent and AddEventHandler, with an example that parses chat messages."
---
# Mod (In-Game) Scripting Reference

BeamMP lets you write client-side plugins too. A few functions let you talk to other multiplayer mods, and to other players through the server. To set up a plugin, see [Mod & Resource Creation](/en/developers/mod-and-resource-creation).

## Functions

| Function | What it does |
|---|---|
| `TriggerServerEvent("eventName", "data")` | Triggers an event in the server's Lua environment. Both parameters are strings |
| `TriggerClientEvent("eventName", "data")` | Triggers an event in the local Lua environment. Both parameters are strings. Good for communication between plugins |
| `AddEventHandler("eventName", Function)` | Adds `Function` to be called when `eventName` is received, either locally or from the server. `Function` gets one parameter: a string with the event data |

## Example: read chat messages

To read the chat, use the built-in `ChatMessageReceived` event:

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
