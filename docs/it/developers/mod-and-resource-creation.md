---
description: "Crea un plugin per BeamMP: la struttura della cartella Resources, un esempio di Lua lato server, un'estensione Lua lato client e il modScript.lua che la carica."
---
# Creazione di Mod e Risorse

Questa pagina mostra la struttura delle cartelle di un plugin BeamMP e un piccolo esempio funzionante di ciascun file necessario. Per gli elenchi completi di funzioni ed eventi, consulta i [riferimenti allo scripting](/it/developers/beammp-scripting/).

## Struttura delle cartelle e nozioni di base sui file

La struttura di cartelle e file è questa:
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
- Il Lua lato server è il minimo indispensabile. Per aggiungere eventi personalizzati ti servono anche almeno un file Lua lato client e un `modScript.lua`.
- La cartella `Server` contiene una sottocartella per ogni plugin lato server. È buona prassi avere un file Lua principale e mettere gli altri file Lua in sottocartelle. Non sei obbligato: se ce ne sono diversi, il server carica i file Lua in ordine alfabetico.
- La cartella `Client` contiene i file zip che vengono inviati a un client, che li carica come mod. Qualsiasi altro file in `Client` causa un errore all'avvio del server e viene altrimenti ignorato.
- BeamNG legge `modScript.lua`, che indica al gioco quale plugin caricare.

Puoi scaricare un esempio: [examplePlugin.zip](/assets/content/ResourcesForExamplePlugin.zip).

## Lua lato server

Il plugin di esempio contiene altri esempi. Questo è molto semplice e stampa gli identificatori di un giocatore:
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
`onPlayerAuth` viene eseguito non appena un giocatore vuole entrare. Consulta [onPlayerAuth nel riferimento allo scripting](/it/developers/beammp-scripting/server/latest#onplayerauth).

Un altro esempio usa `onPlayerAuth` per rifiutare gli ospiti. Il messaggio che restituisci viene mostrato al giocatore:
```lua
function onPlayerAuth(playerName, playerRole, isGuest, identifiers)
  if isGuest then
    return "No guests allowed, please use a BeamMP account"
  end
end
```
Altre funzioni che puoi usare sul server si trovano nel [riferimento più recente del server](/it/developers/beammp-scripting/server/latest).

## Lua lato client

Il Lua lato client segue in gran parte le [estensioni di BeamNG](https://documentation.beamng.com/modding/programming/extensions/). Questo esempio stampa nella console che il plugin è stato caricato:
```lua
local M = {}

if extensions.isExtensionLoaded("examplePlugin") then
  log("E", "examplePlugin", "examplePlugin loaded on client side")
  return
end

return M
```
Per saperne di più sulla stampa dal Lua di BeamNG, consulta la [documentazione di BeamNG sulle stampe di debug](https://documentation.beamng.com/modding/programming/debugging/#a-add-a-log).

## modScript.lua

Un `modScript.lua` di solito ha solo due righe:
```lua
load('examplePlugin')
setExtensionUnloadMode('examplePlugin', 'manual')
```
Puoi aggiungere una riga di log per vedere nei log quando BeamNG elabora il tuo `modScript.lua`:
```lua
load('examplePlugin')
setExtensionUnloadMode('examplePlugin', 'manual')
log('I', 'modScript', "examplePlugin loaded")
```
