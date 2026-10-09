---
description: "Crea un plugin de BeamMP: la estructura de la carpeta Resources, Lua del lado del servidor, una extensión de Lua del cliente y el modScript.lua que la carga."
---
# Creación de Mods y Recursos

Esta página muestra la estructura de carpetas de un plugin de BeamMP y un pequeño ejemplo funcional de cada archivo que necesita. Para ver las listas completas de funciones y eventos, consulta las [referencias de scripting](/es/developers/beammp-scripting/).

## Estructura de carpetas y conceptos básicos de los archivos

La estructura de carpetas y archivos tiene este aspecto:
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
- El Lua del lado del servidor es lo mínimo imprescindible. Para añadir eventos personalizados, necesitas además al menos un archivo de Lua del lado del cliente y un `modScript.lua`.
- La carpeta `Server` contiene una subcarpeta por cada plugin del lado del servidor. Es una buena práctica tener un archivo principal de Lua y poner los demás archivos de Lua en subcarpetas. No es obligatorio: si hay varios, el servidor carga los archivos de Lua por orden alfabético.
- La carpeta `Client` contiene los archivos zip que se envían a un cliente, que los carga como un mod. Cualquier otro archivo en `Client` provoca un error al iniciar el servidor y, por lo demás, se ignora.
- BeamNG lee `modScript.lua`, que le indica al juego qué plugin cargar.

Puedes descargar un ejemplo: [examplePlugin.zip](/assets/content/ResourcesForExamplePlugin.zip).

## Lua del lado del servidor

El plugin de ejemplo tiene más ejemplos. Este es uno muy básico que muestra los identificadores de un jugador:
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
`onPlayerAuth` se ejecuta en cuanto un jugador quiere unirse. Consulta [onPlayerAuth en la referencia de scripting](/es/developers/beammp-scripting/server/latest#onplayerauth).

Otro ejemplo usa `onPlayerAuth` para denegar el acceso a los invitados. El mensaje que devuelvas se muestra al jugador:
```lua
function onPlayerAuth(playerName, playerRole, isGuest, identifiers)
  if isGuest then
    return "No guests allowed, please use a BeamMP account"
  end
end
```
Encontrarás más funciones que puedes usar en el servidor en la [referencia del servidor más reciente](/es/developers/beammp-scripting/server/latest).

## Lua del lado del cliente

El Lua del lado del cliente sigue en gran medida las [extensiones de BeamNG](https://documentation.beamng.com/modding/programming/extensions/). Este ejemplo imprime en la consola que se cargó el plugin:
```lua
local M = {}

if extensions.isExtensionLoaded("examplePlugin") then
  log("E", "examplePlugin", "examplePlugin loaded on client side")
  return
end

return M
```
Para saber más sobre cómo imprimir mensajes desde el Lua de BeamNG, consulta la [documentación de BeamNG sobre mensajes de depuración](https://documentation.beamng.com/modding/programming/debugging/#a-add-a-log).

## modScript.lua

Un `modScript.lua` suele tener solo dos líneas:
```lua
load('examplePlugin')
setExtensionUnloadMode('examplePlugin', 'manual')
```
Puedes añadir una línea de registro para ver en los logs cuándo BeamNG procesa tu `modScript.lua`:
```lua
load('examplePlugin')
setExtensionUnloadMode('examplePlugin', 'manual')
log('I', 'modScript', "examplePlugin loaded")
```
