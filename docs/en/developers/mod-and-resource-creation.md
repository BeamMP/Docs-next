---
description: "Create a BeamMP plugin: the Resources folder layout, a server-side Lua example, a client-side Lua extension and the modScript.lua that loads it."
---
# Mod & Resource Creation

This page shows the folder layout of a BeamMP plugin, and a small working example of each file it needs. For the full lists of functions and events, see the [scripting references](/en/developers/beammp-scripting/).

## Folder structure and file basics

The folder and file structure looks like this:

```
Resources/
├─ Client/
│  └─ examplePlugin.zip/
│     ├─ scripts/
│     │  └─ modScript.lua
│     └─ lua/
│        └─ ge/
│           └─ extensions/
│              └─ examplePlugin.lua
└─ Server/
   └─ examplePlugin/
      ├─ examplePlugin.lua
      └─ further_lua/
         └─ further.lua
```

- The server-side Lua is the bare minimum. To add custom events, you also need at least a client-side Lua file and a `modScript.lua`.
- The `Server` folder holds one subfolder for each server-side plugin. It is good practice to have one main Lua file and put further Lua files in subfolders. You do not have to: the server loads Lua files in alphabetical order if there are several.
- The `Client` folder holds the zip files that are sent to a client, which loads them as a mod. Any other file in `Client` causes an error when the server starts, and is otherwise ignored.
- BeamNG reads `modScript.lua`, which tells the game which plugin to load.

You can download an example: [examplePlugin.zip](/assets/content/ResourcesForExamplePlugin.zip).

## Server-side Lua

The example plugin has more examples. This is a very basic one that prints a player's identifiers:

```lua
function onInit() --runs when plugin is loaded

	MP.RegisterEvent("onPlayerAuth", "onPlayerAuth") --Provided by BeamMP

	print("examplePlugin loaded")
end

--A player has authenticated and is requesting to join
--The player's name (string), forum role (string), guest account (bool), identifiers (table -> ip, beammp)
function onPlayerAuth(player_name, role, isGuest, identifiers)
	local ip = identifiers.ip
	local beammp = identifiers.beammp or "N/A"
	print("onPlayerAuth: player_name: " .. player_name .. " | role: " .. role .. " | isGuest: " .. tostring(isGuest) .. " | identifiers: ip: " .. ip .. " - beammp: " .. beammp)
end
```

`onPlayerAuth` runs as soon as a player wants to join. See [onPlayerAuth in the scripting reference](/en/developers/beammp-scripting/server/latest#onplayerauth).

Another example uses `onPlayerAuth` to deny guests. The message you return is shown to the player:

```lua
function onPlayerAuth(playerName, playerRole, isGuest, identifiers)
  if isGuest then
    return "No guests allowed, please use a BeamMP account"
  end
end
```

More functions you can use on the server are in the [latest server reference](/en/developers/beammp-scripting/server/latest).

## Client-side Lua

Client-side Lua largely follows [BeamNG extensions](https://documentation.beamng.com/modding/programming/extensions/). This example prints to the console that the plugin was loaded:

```lua
local M = {}

if extensions.isExtensionLoaded("examplePlugin") then
  log("E", "examplePlugin", "examplePlugin loaded on client side")
  return
end

return M
```

To learn more about printing from BeamNG Lua, see the [BeamNG documentation on debug prints](https://documentation.beamng.com/modding/programming/debugging/#a-add-a-log).

## modScript.lua

A `modScript.lua` usually has only two lines:

```lua
load('examplePlugin')
setExtensionUnloadMode('examplePlugin', 'manual')
```

You can add a log line to see in the logs when BeamNG processes your `modScript.lua`:

```lua
load('examplePlugin')
setExtensionUnloadMode('examplePlugin', 'manual')
log('I', 'modScript', "examplePlugin loaded")
```
