---
description: "The BeamMP in-game (client-side) Lua functions: events and handlers, chat events, key listeners, extension hooks, and functions for nametags, roles and the player list."
---
# Mod (In-Game) Scripting Reference

BeamMP lets you write client-side plugins too. A few functions let you talk to other multiplayer mods, and to other players through the server. To set up a plugin, see [Mod & Resource Creation](/en/developers/mod-and-resource-creation). This page is checked against BeamMP 4.22.5.

## Event functions

| Function | What it does |
|---|---|
| `TriggerServerEvent("eventName", "data")` | Triggers an event in the server's Lua environment. Both parameters are strings. The server needs a handler for the event, registered with `MP.RegisterEvent` |
| `TriggerClientEvent("eventName", "data")` | Triggers an event in the local Lua environment. Both parameters are strings. Good for communication between plugins |
| `AddEventHandler("eventName", Function, "name")` | Adds `Function` to be called when `eventName` is received, either locally or from the server. `Function` gets one parameter: a string with the event data. `name` is optional, see below |
| `RemoveEventHandler("eventName", "name")` | Removes a handler that `AddEventHandler` added. `name` is optional, see below |

- An event name cannot contain a colon (`:`). The data can.
- A handler belongs to the file that called `AddEventHandler`. If the same file adds a handler for an event it already handles, the new handler replaces the old one. To keep several handlers for one event in one file, give each a different `name`. Use the same `name` with `RemoveEventHandler`.
- If a handler raises an error, BeamMP logs the error and carries on with the other handlers.
- `AddEventHandler` exists only while BeamMP is loaded. If your mod also runs in single player, write `if AddEventHandler then ... end`.

For the server side of these events, see the [server scripting reference](/en/developers/beammp-scripting/server/latest).

## Events BeamMP triggers

| Event | When | Data |
|---|---|---|
| `ChatMessageReceived` | A chat message arrives | `Sender: message`, a string without the sender's role tag |
| `ChatMessageSent` | You send a chat message | `C:Sender: message`, where `Sender` is your name |

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
    local message = string.sub(msg, i+2, -1)  -- Skip the ':' and the space after it. Do whatever you want to with the message
    print("sender: " .. sender)
    print("message: ".. message)
end

AddEventHandler("ChatMessageReceived", chatReceived) -- Add our event handler to the list managed by BeamMP
```

## Key listeners

| Function | What it does |
|---|---|
| `onKeyPressed("NUMPAD1", Function)` | Calls `Function` when the key is pressed |
| `onKeyReleased("NUMPAD1", Function)` | Calls `Function` when the key is released |
| `addKeyEventListener("NUMPAD1", Function, "down")` | Calls `Function` when the key changes. The last parameter is `"down"`, `"up"` or `"both"`, and `"both"` is the default |
| `getKeyState("NUMPAD1")` | Returns `true` while the key is held down, and `false` otherwise |

`Function` gets one parameter: `true` when the key was pressed and `false` when it was released.

## Extension hooks

BeamMP calls these hooks on every loaded extension that defines them:

| Hook | When |
|---|---|
| `onBeamMPLauncherConnected` | The game has connected to the Launcher |
| `onBeamMPPostJoin` | The map of the server has loaded as part of joining |
| `onBeamMPServerLeave` | You leave the server |

## Nametags, roles and the player list

These functions are in the `MPVehicleGE` extension. Player IDs are numbers, and a vehicle ID has the form `playerID-vehicleID`, such as `"0-1"`.

| Function | What it does |
|---|---|
| `MPVehicleGE.getPlayers()` | Returns the table of all known players, with the player ID as the key |
| `MPVehicleGE.getVehicles()` | Returns the table of all multiplayer vehicles, with the vehicle ID as the key |
| `MPVehicleGE.getPlayerByName("name")` | Returns the player table and the player ID, or `nil` if there is no such player |
| `MPVehicleGE.isOwn(gameVehicleID)` | Returns `true` if the game vehicle with that number belongs to you |
| `MPVehicleGE.setPlayerNickPrefix("name", "source", "text")` | Adds `text` before a player's nametag. Use a different `source` for each prefix you want to keep |
| `MPVehicleGE.setPlayerNickSuffix("name", "source", "text")` | Adds `text` after a player's nametag. Use a different `source` for each suffix you want to keep |
| `MPVehicleGE.hideNicknames(true)` | Stops BeamMP drawing nametags. `false` draws them again |
| `MPVehicleGE.setPlayerRole(playerID, "tag", "shorttag", red, green, blue)` | Gives a player a custom role. The tag and short tag are text that BeamMP shows in square brackets, and the background colour is three numbers from 0 to 255. Returns `false` and an error message if an argument is invalid |
| `MPVehicleGE.clearPlayerRole(playerID)` | Removes the custom role of a player |
| `MPVehicleGE.setVehicleRole("playerID-vehicleID", "tag", "shorttag", red, green, blue)` | Gives one vehicle a custom role |
| `MPVehicleGE.clearVehicleRole("playerID-vehicleID")` | Removes the custom role of a vehicle |
| `MPVehicleGE.applyQueuedEvents()` | Loads all queued vehicle changes |

To add a button to the right-click menu of the player list, add a function to the table that `UI.getCustomPlayerlistButtons()` returns. The key is the text of the button. The function gets the player's name and ID:

```lua
local buttons = UI.getCustomPlayerlistButtons()
buttons["Say hello"] = function(name, id)
  print("Hello, " .. name .. " (ID " .. tostring(id) .. ")")
end
```
