---
description: "Les fonctions Lua en jeu (côté client) de BeamMP : TriggerServerEvent, TriggerClientEvent et AddEventHandler, avec un exemple qui analyse les messages du chat."
---
# Référence de script du mod (en jeu)

BeamMP vous permet aussi d'écrire des plugins côté client. Quelques fonctions permettent de communiquer avec d'autres mods multijoueurs, et avec les autres joueurs via le serveur. Pour configurer un plugin, consultez [Création de mods et de ressources](/fr/developers/mod-and-resource-creation).

## Fonctions

| Fonction | Ce qu'elle fait |
|---|---|
| `TriggerServerEvent("eventName", "data")` | Déclenche un événement dans l'environnement Lua du serveur. Les deux paramètres sont des chaînes de caractères |
| `TriggerClientEvent("eventName", "data")` | Déclenche un événement dans l'environnement Lua local. Les deux paramètres sont des chaînes de caractères. Utile pour la communication entre plugins |
| `AddEventHandler("eventName", Function)` | Ajoute `Function` pour qu'elle soit appelée lorsque `eventName` est reçu, localement ou depuis le serveur. `Function` reçoit un paramètre : une chaîne de caractères contenant les données de l'événement |

## Exemple : lire les messages du chat

Pour lire le chat, utilisez l'événement intégré `ChatMessageReceived` :
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
