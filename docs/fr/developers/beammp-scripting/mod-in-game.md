---
description: "Les fonctions Lua en jeu (côté client) de BeamMP : événements et gestionnaires, événements du chat, écouteurs de touches, hooks d'extension, et fonctions pour les noms affichés, les rôles et la liste des joueurs."
---
# Référence de script du mod (en jeu)

BeamMP vous permet aussi d'écrire des plugins côté client. Quelques fonctions permettent de communiquer avec d'autres mods multijoueurs, et avec les autres joueurs via le serveur. Pour configurer un plugin, consultez [Création de mods et de ressources](/fr/developers/mod-and-resource-creation). Cette page a été vérifiée avec BeamMP 4.22.5.

## Fonctions d'événements

| Fonction | Ce qu'elle fait |
|---|---|
| `TriggerServerEvent("eventName", "data")` | Déclenche un événement dans l'environnement Lua du serveur. Les deux paramètres sont des chaînes de caractères. Le serveur doit avoir un gestionnaire pour cet événement, enregistré avec `MP.RegisterEvent` |
| `TriggerClientEvent("eventName", "data")` | Déclenche un événement dans l'environnement Lua local. Les deux paramètres sont des chaînes de caractères. Utile pour la communication entre plugins |
| `AddEventHandler("eventName", Function, "name")` | Ajoute `Function` pour qu'elle soit appelée lorsque `eventName` est reçu, localement ou depuis le serveur. `Function` reçoit un paramètre : une chaîne de caractères contenant les données de l'événement. `name` est facultatif, voir ci-dessous |
| `RemoveEventHandler("eventName", "name")` | Supprime un gestionnaire ajouté par `AddEventHandler`. `name` est facultatif, voir ci-dessous |

- Un nom d'événement ne peut pas contenir de deux-points (`:`). Les données, elles, peuvent en contenir.
- Un gestionnaire appartient au fichier qui a appelé `AddEventHandler`. Si le même fichier ajoute un gestionnaire pour un événement qu'il gère déjà, le nouveau gestionnaire remplace l'ancien. Pour garder plusieurs gestionnaires pour un même événement dans un seul fichier, donnez à chacun un `name` différent. Utilisez le même `name` avec `RemoveEventHandler`.
- Si un gestionnaire provoque une erreur, BeamMP l'enregistre dans le journal et continue avec les autres gestionnaires.
- `AddEventHandler` n'existe que lorsque BeamMP est chargé. Si votre mod fonctionne aussi en solo, écrivez `if AddEventHandler then ... end`.

Pour le côté serveur de ces événements, consultez la [référence de script du serveur](/fr/developers/beammp-scripting/server/latest).

## Événements déclenchés par BeamMP

| Événement | Quand | Données |
|---|---|---|
| `ChatMessageReceived` | Un message du chat arrive | `Sender: message`, une chaîne de caractères sans l'étiquette de rôle de l'expéditeur |
| `ChatMessageSent` | Vous envoyez un message dans le chat | `C:Sender: message`, où `Sender` est votre nom |

## Exemple : lire les messages du chat

Pour lire le chat, utilisez l'événement intégré `ChatMessageReceived` :

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

## Écouteurs de touches

| Fonction | Ce qu'elle fait |
|---|---|
| `onKeyPressed("NUMPAD1", Function)` | Appelle `Function` lorsque la touche est enfoncée |
| `onKeyReleased("NUMPAD1", Function)` | Appelle `Function` lorsque la touche est relâchée |
| `addKeyEventListener("NUMPAD1", Function, "down")` | Appelle `Function` lorsque l'état de la touche change. Le dernier paramètre est `"down"`, `"up"` ou `"both"`, et `"both"` est la valeur par défaut |
| `getKeyState("NUMPAD1")` | Renvoie `true` tant que la touche est maintenue enfoncée, et `false` sinon |

`Function` reçoit un paramètre : `true` si la touche a été enfoncée et `false` si elle a été relâchée.

## Hooks d'extension

BeamMP appelle ces hooks sur chaque extension chargée qui les définit :

| Hook | Quand |
|---|---|
| `onBeamMPLauncherConnected` | Le jeu s'est connecté au lanceur |
| `onBeamMPPostJoin` | La carte du serveur est chargée lors de la connexion |
| `onBeamMPServerLeave` | Vous quittez le serveur |

## Noms affichés, rôles et liste des joueurs

Ces fonctions se trouvent dans l'extension `MPVehicleGE`. Les ID de joueur sont des nombres, et un ID de véhicule a la forme `playerID-vehicleID`, par exemple `"0-1"`.

| Fonction | Ce qu'elle fait |
|---|---|
| `MPVehicleGE.getPlayers()` | Renvoie la table de tous les joueurs connus, avec l'ID du joueur comme clé |
| `MPVehicleGE.getVehicles()` | Renvoie la table de tous les véhicules multijoueurs, avec l'ID du véhicule comme clé |
| `MPVehicleGE.getPlayerByName("name")` | Renvoie la table du joueur et l'ID du joueur, ou `nil` si ce joueur n'existe pas |
| `MPVehicleGE.isOwn(gameVehicleID)` | Renvoie `true` si le véhicule du jeu portant ce numéro vous appartient |
| `MPVehicleGE.setPlayerNickPrefix("name", "source", "text")` | Ajoute `text` avant le nom affiché d'un joueur. Utilisez un `source` différent pour chaque préfixe que vous voulez conserver |
| `MPVehicleGE.setPlayerNickSuffix("name", "source", "text")` | Ajoute `text` après le nom affiché d'un joueur. Utilisez un `source` différent pour chaque suffixe que vous voulez conserver |
| `MPVehicleGE.hideNicknames(true)` | Empêche BeamMP d'afficher les noms des joueurs. `false` les affiche de nouveau |
| `MPVehicleGE.setPlayerRole(playerID, "tag", "shorttag", red, green, blue)` | Donne un rôle personnalisé à un joueur. L'étiquette et l'étiquette courte sont des textes que BeamMP affiche entre crochets, et la couleur d'arrière-plan est composée de trois nombres de 0 à 255. Renvoie `false` et un message d'erreur si un argument n'est pas valide |
| `MPVehicleGE.clearPlayerRole(playerID)` | Supprime le rôle personnalisé d'un joueur |
| `MPVehicleGE.setVehicleRole("playerID-vehicleID", "tag", "shorttag", red, green, blue)` | Donne un rôle personnalisé à un seul véhicule |
| `MPVehicleGE.clearVehicleRole("playerID-vehicleID")` | Supprime le rôle personnalisé d'un véhicule |
| `MPVehicleGE.applyQueuedEvents()` | Charge toutes les modifications de véhicules en attente |

Pour ajouter un bouton au menu contextuel (clic droit) de la liste des joueurs, ajoutez une fonction à la table que renvoie `UI.getCustomPlayerlistButtons()`. La clé est le texte du bouton. La fonction reçoit le nom et l'ID du joueur :

```lua
local buttons = UI.getCustomPlayerlistButtons()
buttons["Say hello"] = function(name, id)
  print("Hello, " .. name .. " (ID " .. tostring(id) .. ")")
end
```
