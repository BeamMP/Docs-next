---
description: "Créez un plugin BeamMP : l'organisation du dossier Resources, un exemple de Lua côté serveur, une extension Lua côté client et le modScript.lua qui la charge."
---
# Création de mods et de ressources

Cette page présente l'organisation des dossiers d'un plugin BeamMP, ainsi qu'un petit exemple fonctionnel de chaque fichier nécessaire. Pour les listes complètes des fonctions et des événements, consultez les [références de script](/fr/developers/beammp-scripting/).

## Structure des dossiers et bases des fichiers

La structure des dossiers et des fichiers ressemble à ceci :

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

- Le Lua côté serveur est le strict minimum. Pour ajouter des événements personnalisés, il faut aussi au moins un fichier Lua côté client et un `modScript.lua`.
- Le dossier `Server` contient un sous-dossier pour chaque plugin côté serveur. Il est recommandé d'avoir un fichier Lua principal et de placer les autres fichiers Lua dans des sous-dossiers. Ce n'est pas obligatoire : le serveur charge les fichiers Lua par ordre alphabétique s'il y en a plusieurs.
- Le dossier `Client` contient les fichiers zip envoyés à un client, qui les charge comme un mod. Tout autre fichier dans `Client` provoque une erreur au démarrage du serveur, et est sinon ignoré.
- BeamNG lit `modScript.lua`, qui indique au jeu quel plugin charger.

Vous pouvez télécharger un exemple : [examplePlugin.zip](/assets/content/ResourcesForExamplePlugin.zip).

## Lua côté serveur

Le plugin d'exemple contient d'autres exemples. Voici un exemple très simple qui affiche les identifiants d'un joueur :

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

`onPlayerAuth` s'exécute dès qu'un joueur veut rejoindre le serveur. Consultez [onPlayerAuth dans la référence de script](/fr/developers/beammp-scripting/server/latest#onplayerauth).

Un autre exemple utilise `onPlayerAuth` pour refuser les invités. Le message que vous renvoyez est affiché au joueur :

```lua
function onPlayerAuth(playerName, playerRole, isGuest, identifiers)
  if isGuest then
    return "No guests allowed, please use a BeamMP account"
  end
end
```

Vous trouverez d'autres fonctions utilisables côté serveur dans la [référence du serveur (dernière version)](/fr/developers/beammp-scripting/server/latest).

## Lua côté client

Le Lua côté client suit en grande partie les [extensions de BeamNG](https://documentation.beamng.com/modding/programming/extensions/). Cet exemple écrit une ligne dans le journal lorsque l'extension est chargée :

```lua
local M = {}

local function onExtensionLoaded()
  log("I", "examplePlugin", "examplePlugin loaded on client side")
end

M.onExtensionLoaded = onExtensionLoaded

return M
```

Pour en savoir plus sur l'affichage de messages depuis le Lua de BeamNG, consultez la [documentation de BeamNG sur les messages de débogage](https://documentation.beamng.com/modding/programming/debugging/#a-add-a-log). Pour les fonctions que BeamMP ajoute au client, consultez la [référence de script en jeu](/fr/developers/beammp-scripting/mod-in-game).

Lorsqu'un joueur quitte un serveur qui lui avait envoyé des mods, le jeu recharge son Lua. Votre extension est chargée de nouveau la prochaine fois que le joueur rejoint un serveur.

## modScript.lua

Un fichier `modScript.lua` ne contient généralement que deux lignes :

```lua
load('examplePlugin')
setExtensionUnloadMode('examplePlugin', 'manual')
```

Le mode de déchargement `'manual'` empêche le jeu de décharger l'extension de lui-même. N'utilisez pas `queueExtensionToLoad` : BeamMP affiche une erreur pour cette fonction.

Vous pouvez ajouter une ligne de journal pour voir dans les journaux quand BeamNG traite votre `modScript.lua` :

```lua
load('examplePlugin')
setExtensionUnloadMode('examplePlugin', 'manual')
log('I', 'modScript', "examplePlugin loaded")
```
