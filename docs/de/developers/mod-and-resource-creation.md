---
description: "Ein BeamMP-Plugin erstellen: die Ordnerstruktur von Resources, ein serverseitiges Lua-Beispiel, eine clientseitige Lua-Erweiterung und die modScript.lua, die sie lädt."
---
# Mod- & Ressourcenerstellung

Diese Seite zeigt die Ordnerstruktur eines BeamMP-Plugins und ein kleines, funktionierendes Beispiel für jede Datei, die es braucht. Die vollständigen Listen der Funktionen und Events findest du in den [Scripting-Referenzen](/de/developers/beammp-scripting/).

## Ordnerstruktur und Grundlagen zu den Dateien

Die Ordner- und Dateistruktur sieht so aus:

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

- Das serverseitige Lua ist das absolute Minimum. Um eigene Events hinzuzufügen, brauchst du außerdem mindestens eine clientseitige Lua-Datei und eine `modScript.lua`.
- Der Ordner `Server` enthält für jedes serverseitige Plugin einen eigenen Unterordner. Es ist empfehlenswert, eine Haupt-Lua-Datei zu haben und weitere Lua-Dateien in Unterordnern abzulegen. Das ist aber nicht zwingend: Der Server lädt Lua-Dateien in alphabetischer Reihenfolge, wenn es mehrere gibt.
- Der Ordner `Client` enthält die Zip-Dateien, die an einen Client gesendet werden, der sie als Mod lädt. Jede andere Datei in `Client` verursacht beim Start des Servers einen Fehler und wird ansonsten ignoriert.
- BeamNG liest `modScript.lua`, die dem Spiel mitteilt, welches Plugin geladen werden soll.

Du kannst ein Beispiel herunterladen: [examplePlugin.zip](/assets/content/ResourcesForExamplePlugin.zip).

## Serverseitiges Lua

Das Beispiel-Plugin enthält weitere Beispiele. Dies ist ein ganz einfaches, das die Kennungen eines Spielers ausgibt:

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

`onPlayerAuth` wird ausgeführt, sobald ein Spieler beitreten möchte. Siehe [onPlayerAuth in der Scripting-Referenz](/de/developers/beammp-scripting/server/latest#onplayerauth).

Ein weiteres Beispiel nutzt `onPlayerAuth`, um Gäste abzulehnen. Die Nachricht, die du zurückgibst, wird dem Spieler angezeigt:

```lua
function onPlayerAuth(playerName, playerRole, isGuest, identifiers)
  if isGuest then
    return "No guests allowed, please use a BeamMP account"
  end
end
```

Weitere Funktionen, die du auf dem Server nutzen kannst, stehen in der [Referenz für den aktuellen Server](/de/developers/beammp-scripting/server/latest).

## Clientseitiges Lua

Clientseitiges Lua folgt weitgehend den [BeamNG-Erweiterungen](https://documentation.beamng.com/modding/programming/extensions/). Dieses Beispiel schreibt eine Zeile ins Log, wenn die Erweiterung geladen wird:

```lua
local M = {}

local function onExtensionLoaded()
  log("I", "examplePlugin", "examplePlugin loaded on client side")
end

M.onExtensionLoaded = onExtensionLoaded

return M
```

Mehr zum Ausgeben von Text aus BeamNG-Lua steht in der [BeamNG-Dokumentation zu Debug-Ausgaben](https://documentation.beamng.com/modding/programming/debugging/#a-add-a-log). Die Funktionen, die BeamMP dem Client hinzufügt, findest du in der [Scripting-Referenz für den Mod im Spiel](/de/developers/beammp-scripting/mod-in-game).

Wenn ein Spieler einen Server verlässt, der Mods gesendet hat, lädt das Spiel sein Lua neu. Deine Erweiterung wird beim nächsten Beitritt des Spielers wieder geladen.

## modScript.lua

Eine `modScript.lua` hat meist nur zwei Zeilen:

```lua
load('examplePlugin')
setExtensionUnloadMode('examplePlugin', 'manual')
```

Der Entlade-Modus `'manual'` verhindert, dass das Spiel die Erweiterung von selbst entlädt. Verwende nicht `queueExtensionToLoad`: BeamMP zeigt dafür einen Fehler an.

Du kannst eine Log-Zeile hinzufügen, um in den Logs zu sehen, wann BeamNG deine `modScript.lua` verarbeitet:

```lua
load('examplePlugin')
setExtensionUnloadMode('examplePlugin', 'manual')
log('I', 'modScript', "examplePlugin loaded")
```
