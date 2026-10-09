# Multiplayer-Mods erstellen

## Ordnerstruktur und Grundlagen zu Dateien

Die grundlegende Ordner- und Dateistruktur muss so aussehen:
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
Die serverseitige Lua-Datei ist das absolute Minimum. Wenn du eigene Events hinzufügen möchtest, brauchst du außerdem mindestens eine clientseitige Lua-Datei sowie eine modscript.lua.

Der Ordner Server muss Unterordner enthalten, und zwar einen für jeden serverseitigen Mod.
Es ist empfehlenswert, nur eine einzige Haupt-Lua-Datei zu haben und weitere Lua-Dateien in Unterordner zu legen.
Das ist jedoch nicht zwingend erforderlich: Gibt es mehrere Lua-Dateien, lädt der Server sie in alphabetischer Reihenfolge.

Der Ordner Client enthält die Zip-Dateien, die an einen Client gesendet werden, der sie dann als Mod lädt.
Alle anderen Dateien im Ordner Client verursachen beim Serverstart einen Fehler, werden aber ansonsten vom Server ignoriert.
Die modScript.lua wird von BeamNG gelesen und teilt dem Spiel mit, welches Plugin geladen werden soll.

::: example
[Lade die examplePlugin.zip herunter](../../../../assets/content/ResourcesForExamplePlugin.zip)
:::

## Serverseitiges Lua

Im examplePlugin gibt es weitere Beispiele, aber hier ist ein sehr einfaches, das die Kennungen eines Spielers ausgibt:
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
`onPlayerAuth` wird ausgelöst, sobald ein Spieler beitreten möchte. Siehe dazu auch [onPlayerAuth in der Scripting-Referenz](/de/developers/beammp-scripting/server/latest#onplayerauth)

Ein weiteres Beispiel mit onPlayerAuth: Hier wird Gästen der Beitritt zum Server verweigert, indem dem Client eine Nachricht zurückgesendet wird, die dann dem Spieler angezeigt wird:
```lua
function onPlayerAuth(playerName, playerRole, isGuest, identifiers)
  if isGuest then
    return "No guests allowed, please use a BeamMP account"
  end
end
```
Weitere Informationen zu den von BeamMP bereitgestellten serverseitigen Funktionen findest du in der [aktuellen Server-Referenz](/de/developers/beammp-scripting/server/latest)

## Clientseitiges Lua

Dies orientiert sich weitgehend an den [BeamNG-Erweiterungen](https://documentation.beamng.com/modding/programming/extensions/)
```lua
local M = {}

if extensions.isExtensionLoaded("examplePlugin") then
  log("E", "examplePlugin", "examplePlugin loaded on client side")
  return
end

return M
```
Gibt in der Konsole aus, dass das examplePlugin geladen wurde

Weitere Informationen findest du in der [BeamNG-Dokumentation zu Debug-Ausgaben](https://documentation.beamng.com/modding/programming/debugging/#a-add-a-log)

## modScript.lua

Enthält normalerweise nur zwei Zeilen
```lua
load('examplePlugin')
setExtensionUnloadMode('examplePlugin', 'manual')
```
Du kannst eine Log-Ausgabe hinzufügen, wenn du in den Logs sehen möchtest, wann dein modScript von BeamNG verarbeitet wird
```lua
load('examplePlugin')
setExtensionUnloadMode('examplePlugin', 'manual')
log('I', 'modScript', "examplePlugin loaded")
```
