::: warning Ce site est en cours de construction !
Ce site est actuellement en cours de développement.

Vous pensez pouvoir contribuer ? Cliquez simplement sur l'icône en forme de crayon située à droite de la page !

Vous pouvez également contribuer à n'importe quelle autre page.
:::

# Référence de script serveur
## Serveur version 3.X

### Introduction {#how-to-start-writing-a-plugin}

La version v3.0.0 de BeamMP-Server apporte des changements radicaux au fonctionnement du système de plugins Lua. Il est impossible d'utiliser l'ancien Lua avec un nouveau serveur ; vous devrez donc migrer.

Le système de plugins du serveur utilise [Lua 5.3](https://www.lua.org/manual/5.3/). Cette section explique comment commencer à écrire des plugins, présente quelques concepts de base et vous guide dans la création de votre premier plugin. **Il est recommandé de lire cette section même si vous connaissez le système antérieur à la v3.0.0, car plusieurs éléments ont changé radicalement**.

Pour un guide de migration depuis le Lua antérieur à la v3.0.0, rendez-vous à la section [« Migrer depuis l'ancien Lua »](#migrating-from-old-lua).


### Structure des dossiers

Contrairement aux mods, les plugins serveur se trouvent (par défaut) dans `Resources/Server`, tandis que les mods, qui sont écrits pour BeamNG.drive et envoyés aux clients, se trouvent dans `Resources/Client`. Chaque plugin doit avoir son propre sous-dossier dans `Resources/Server` ; par exemple, pour un plugin nommé « MyPlugin », la structure serait :
```
Resources
└── Server
    ├── MyPlugin
    │   └── main.lua
    └── SomeOtherPlugin
        └── ...
```
Nous affichons ici un autre plugin, appelé « SomeOtherPlugin », pour illustrer le fait que votre dossier `Resources/Server` peut contenir plusieurs dossiers de plugins différents. Nous continuerons à utiliser cette structure de dossiers comme exemple tout au long de ce guide.

Vous remarquerez aussi le fichier `main.lua`. Vous pouvez avoir autant de fichiers Lua `.lua` que vous le souhaitez. Tous les fichiers Lua situés dans le dossier principal de votre plugin sont chargés dans l'*ordre alphabétique* (ainsi, `aaa.lua` est exécuté avant `bbb.lua`).


### Fichiers Lua

Chaque fichier Lua `.lua` du dossier du plugin est chargé au démarrage du serveur. Cela signifie que les instructions situées en dehors des fonctions sont évaluées (« exécutées ») immédiatement.

Les fichiers Lua situés dans des sous-dossiers sont ignorés, mais peuvent être importés avec `require()`.

Par exemple, notre `main.lua` ressemble à ceci :
```lua
function PrintMyName()
	print("I'm 'My Plugin'!")
end

print("What's up!")
```
Lorsque le serveur démarre et que `main.lua` est chargé, il exécute `print("What's up!")` *immédiatement*, mais n'*appelle* **PAS** encore la fonction `PrintMyName` (puisqu'elle n'a pas été appelée) !

### Événements {#events}

Un événement est par exemple « un joueur est en train de rejoindre le serveur », « un joueur a envoyé un message dans le chat », « un joueur a fait apparaître un véhicule ».

Vous pouvez annuler des événements (s'ils sont annulables) en renvoyant `1` depuis le gestionnaire.

En Lua, vous voudrez généralement réagir à certains de ces événements. Pour cela, vous pouvez enregistrer un « gestionnaire » (handler). Il s'agit d'une fonction appelée lorsqu'un événement se produit, et à laquelle sont transmis des arguments.

Exemple :
```lua
function MyChatMessageHandler(sender_id, sender_name, message)
	-- censoring only the exact message 'darn'
	if message == "darn" then
		-- cancel the event by returning 1
		return 1
	else
		return 0
	end
end

MP.RegisterEvent("onChatMessage", "MyChatMessageHandler")
```
Ceci garantit que tout message strictement égal à « darn » ne sera pas envoyé et n'apparaîtra pas dans le chat (notez que pour un véritable filtre de grossièretés, vous voudriez vérifier si le message *contient* « darn », et non s'il *est* « darn »). Annuler un événement l'empêche de se produire : par exemple, un message du chat ne sera montré à personne d'autre, un véhicule n'apparaîtra pas, etc.

### Événements personnalisés {#custom-events}

Vous pouvez vous abonner à n'importe quel événement, par exemple :
```lua
MP.RegisterEvent("MyCoolCustomEvent", "MyHandler")
```
Vous pouvez ensuite déclencher ces événements personnalisés :
```lua
-- call all event handlers to this in ALL plugins
MP.TriggerGlobalEvent("MyCoolCustomEvent")
-- call all event handlers to this in THIS plugin
MP.TriggerLocalEvent("MyCoolCustomEvent")
```
Vous pouvez faire beaucoup plus avec les événements, mais ces possibilités seront détaillées plus bas dans la référence de l'API.

### Minuteurs d'événements (« threads »)

Le Lua antérieur à la v3.0.0 avait un concept de « threads » qui s'exécutaient X fois par seconde. Cette appellation était légèrement trompeuse, car ils étaient synchrones.

Le Lua de la v3.0.0 propose à la place des « minuteurs d'événements » (Event Timers). Ce sont des minuteurs qui s'exécutent à l'intérieur du serveur et qui, une fois écoulés, déclenchent un événement (de façon globale). Ceci est également synchrone. Attention : le deuxième argument est un intervalle en millisecondes.

Exemple :
```lua
local seconds = 0

function CountSeconds()
	seconds = seconds + 1
end

-- create a custom event called 'EverySecond'
-- and register the handler function 'CountSeconds' to it
MP.RegisterEvent("EverySecond", "CountSeconds")

-- create a timer for this event, which will fire every 1000ms (1s)
MP.CreateEventTimer("EverySecond", 1000)
```
Cela provoquera l'appel de « CountSeconds » chaque seconde. Vous pouvez aussi annuler des minuteurs d'événements avec `MP.CancelEventTimer` (voir la référence de l'API).

Depuis la console du serveur, vous pouvez exécuter `status` pour voir combien de minuteurs d'événements sont actuellement en cours, ainsi que des informations sur les gestionnaires d'événements en attente. Cette commande affichera davantage d'informations à l'avenir.

### Débogage

Le Lua est difficile à déboguer. Malheureusement, il n'existe pas de débogueur de niveau industriel comme `gdb` pour le Lua embarqué.

En général, vous pouvez bien sûr simplement afficher avec `print()` les valeurs que vous souhaitez inspecter, à tout moment. 

Dans la v3.0.0, le serveur permet d'injecter un interpréteur dans un plugin puis d'y exécuter du Lua en temps réel. C'est ce qui se rapproche le plus d'un débogueur.

En supposant que vous ayez le plugin ci-dessus, que nous avons appelé `MyPlugin`, vous pouvez entrer dans son état Lua ainsi :
```
> lua MyPlugin
```
La casse est importante ici, veillez donc à la saisir correctement. 
La sortie ressemble à ceci
```
lua @MyPlugin> 
```
Comme vous pouvez le voir, nous sommes passés à l'état Lua de `MyPlugin`. À partir de maintenant et jusqu'à ce que nous saisissions `exit()` (`:exit` depuis la v3.1.0), nous serons dans `MyPlugin` et pourrons y exécuter du Lua. 

Par exemple, si nous avons une variable globale `MyValue`, nous pouvons afficher sa valeur ainsi :
```
lua @MyPlugin> print(MyValue)
```
Vous pouvez appeler des fonctions ici et faire tout ce que vous vous attendez à pouvoir faire.

Depuis la v3.1.0 : vous pouvez appuyer sur TAB pour compléter automatiquement les fonctions et les variables.

ATTENTION : malheureusement, si l'état Lua est actuellement occupé à exécuter d'autres instructions (comme une boucle `while`), la console peut se bloquer complètement jusqu'à la fin de ce travail ; soyez donc très prudent lorsque vous basculez vers des états susceptibles d'attendre qu'un événement se produise.

Vous pouvez en outre exécuter `status` dans la console normale (`> `), qui vous affichera des statistiques sur Lua, entre autres.

### Commandes personnalisées

Pour implémenter des commandes personnalisées pour la console du serveur, vous pouvez utiliser l'événement `onConsoleInput`. 
Cela peut être utile lorsque vous voulez donner au propriétaire du serveur un moyen de signaler quelque chose à votre plugin, ou d'afficher l'état interne de façon personnalisée.

Voici un exemple :
```lua
function handleConsoleInput(cmd)
    local delim = cmd:find(' ')
    if delim then
        local message = cmd:sub(delim+1)
        if cmd:sub(1, delim-1) == "print" then
            return message
        end
    end
end

MP.RegisterEvent("onConsoleInput", "handleConsoleInput")
```
Cela vous permettra de faire ce qui suit dans la console du serveur :
```
> print hello, world
hello, world
```
Nous avons implémenté notre propre `print`. Pour vous exercer, essayez de construire une fonction comme `say`, qui envoie un message de chat à tous les joueurs, ou même à un joueur en particulier (avec `MP.SendChatMessage`).

**Attention :** pour vos propres plugins, il est généralement recommandé de les placer dans un « espace de noms » (namespace). Dans notre exemple, le `print` d'un plugin nommé `mystuff` pourrait s'appeler `mystuff.print`, `ms.print` ou similaire.

### Référence de l'API

Format de la documentation : `function_name(arg_name: arg_type, arg_name: arg_type) -> return_types`

### Fonctions intégrées

#### `print(...)`, `printRaw(...)`

Affiche le message dans la console du serveur, précédé de `[DATE TIME] [LUA]`. Si vous ne voulez pas de ce préfixe, vous pouvez utiliser `printRaw(...)`.

Exemple :
```lua
local name = "John Doe"
print("Hello, I'm", name, "and I'm", 32)
```
Elle accepte autant d'arguments de types arbitraires que vous le souhaitez. Elle affichera même volontiers des tables !

Elle se comporte comme le `print` de l'interpréteur Lua, et place donc des tabulations entre les arguments.

#### `exit()`

Arrête proprement le serveur. Déclenche l'événement `onShutdown`.

### Fonctions MP

#### `MP.CreateTimer() -> Timer`

Crée un objet minuteur, qui permet de mesurer la durée d'une opération / le temps écoulé. Il démarre dès sa création et peut être réinitialisé/redémarré avec `mytimer:Start()`.

Vous pouvez obtenir le temps écoulé actuel, en secondes, avec `mytimer:GetCurrent()`.

Exemple :
```lua
local mytimer = MP.CreateTimer()
-- do stuff here that needs to be timed
print(mytimer:GetCurrent()) -- print how much time elapsed
```
Les minuteurs n'ont pas besoin d'être arrêtés (et ne peuvent pas l'être) ; ils n'ont aucun coût supplémentaire.

#### `MP.GetOSName() -> string`

Renvoie le nom du système d'exploitation actuel : `Windows`, `Linux` ou `Other`.

#### `MP.GetServerVersion() -> number,number,number`

Renvoie la version actuelle du serveur au format majeure, mineure, correctif. Par exemple, la version v3.0.0 renverrait `3, 0, 0`.

Exemple :
```lua
local major, minor, patch = MP.GetServerVersion()
print(major, minor, patch)
```
Sortie :
```
2	4	0
```
#### `MP.RegisterEvent(event_name: string, function_name: string)`

Mémorise la fonction nommée `Function Name` comme gestionnaire de l'événement nommé `Event Name`.

Vous pouvez enregistrer autant de gestionnaires que vous le souhaitez pour un même événement.

Pour la liste des événements fournis par le serveur, voir [ici](#events-1).

Si l'événement portant ce nom n'existe pas, il est créé ; RegisterEvent ne peut donc pas échouer. Cela permet de créer des événements personnalisés. Voir [Événements personnalisés](#custom-events) et [Événements](#events) pour en savoir plus.

Exemple :
```lua
function ChatHandler(player_id, player_name, msg)
    if msg == "hello" then
        print("Hello World!")
        return 0
    end
end

MP.RegisterEvent("onChatMessage", "ChatHandler")
```
#### `MP.CreateEventTimer(event_name: string, interval_ms: number, [strategy: number (since v3.0.2)])`

Démarre un minuteur à l'intérieur du serveur qui déclenche l'événement `event_name` toutes les `interval_ms` millisecondes.

Les minuteurs d'événements peuvent être annulés avec `MP.CancelEventTimer`.

Les intervalles inférieurs à 25 ms sont déconseillés, car plusieurs intervalles de ce type ne seront probablement pas traités à temps de manière fiable. Même s'il est possible de démarrer plusieurs minuteurs sur un même événement, il est conseillé de créer le moins de minuteurs d'événements possible. Par exemple, si vous avez besoin d'un événement toutes les demi-secondes et d'un autre toutes les secondes, envisagez de ne créer que celui de la demi-seconde et de déclencher la fonction « toutes les secondes » une fois sur deux.

Vous pouvez aussi utiliser `MP.CreateTimer` pour créer un minuteur et mesurer le temps écoulé depuis le dernier appel de l'événement, afin de limiter le nombre de minuteurs d'événements, même si ce n'est pas forcément recommandé, car cela augmente considérablement la complexité du code.

**Depuis la 3.0.2 :**

Un `CallStrategy` optionnel peut être fourni comme troisième argument. Il peut s'agir de :

- `MP.CallStrategy.BestEffort` (par défaut) : tente de déclencher votre événement à l'intervalle indiqué, mais refuse de mettre des gestionnaires en file d'attente si un gestionnaire met trop de temps.
- `MP.CallStrategy.Precise` : met les gestionnaires d'événements en file d'attente à l'intervalle exact indiqué. Peut entraîner le remplissage de la file si le gestionnaire met plus de temps que l'intervalle. À n'utiliser que si vous avez BESOIN de l'intervalle exact.

#### `MP.CancelEventTimer(event_name: string)`

Annule tous les minuteurs de l'événement nommé `event_name`. Dans certains cas, le minuteur peut se déclencher une dernière fois avant d'être annulé, en raison de la nature de la programmation asynchrone.

#### `MP.TriggerLocalEvent(event_name: string, ...) -> table`

Déclencheur d'événement synchrone local au plugin.

Déclenche un événement localement, ce qui entraîne l'appel de tous les gestionnaires de cet événement *dans l'état Lua actuel* (en général le plugin actuel, sauf si l'état a été partagé via PluginConfig.toml).

Vous pouvez passer des arguments à cette fonction (`...`) ; ils sont copiés et transmis à tous les gestionnaires comme arguments de fonction.

Cet appel est synchrone et ne retourne qu'une fois que tous les gestionnaires d'événements ont terminé.

La valeur renvoyée est une table contenant tous les résultats. Si un gestionnaire a renvoyé une valeur, elle figurera dans cette table, sans annotation ni nom. Cela permet de « collecter » des éléments, ou d'enregistrer des sous-gestionnaires pour des événements annulables. Il s'agit en pratique d'un tableau.

Exemple :
```lua
local Results = MP.TriggerLocalEvent("MyEvent")
print(Results)
```
#### `MP.TriggerGlobalEvent(event_name: string, ...) -> table`

Déclencheur d'événement asynchrone global.

Déclenche un événement globalement, ce qui entraîne l'appel de tous les gestionnaires de cet événement *dans tous les plugins* (y compris *ce* plugin).

Vous pouvez passer des arguments à cette fonction (`...`) ; ils sont copiés et transmis à tous les gestionnaires comme arguments de fonction.

Cet appel est asynchrone et renvoie un objet de type « future ». Les gestionnaires locaux (ceux du même plugin que l'appelant) s'exécutent de façon synchrone et immédiate. 

La table renvoyée comporte deux fonctions :

- `IsDone() -> boolean` indique si tous les gestionnaires ont terminé. Vous pouvez attendre que cette valeur soit vraie en la vérifiant dans une boucle et en appelant `MP.Sleep` pour une courte durée.
- `GetResults() -> table` renvoie une table sans annotation ni nom contenant toutes les valeurs renvoyées par tous les gestionnaires. Il s'agit en pratique d'un tableau.

Veillez à les appeler avec la syntaxe `Obj:Function()` (`:`, et NON `.`).

Exemple :
```lua
local Future = MP.TriggerGlobalEvent("MyEvent")
-- wait until handlers finished
while not Future:IsDone() do
	MP.Sleep(100) -- sleep 100 ms
end
local Results = Future:GetResults()
print(Results)
```
Sachez qu'un gestionnaire enregistré sur « MyEvent » ici, et qui ne retourne jamais, pourrait bloquer votre plugin. Vous voudrez probablement mesurer la durée d'attente et cesser d'attendre au bout de quelques secondes.

#### `MP.Sleep(time_ms: number)`

Attend pendant une durée indiquée en millisecondes.

Cela ne cède pas l'exécution de l'état Lua : rien ne s'exécutera dans cet état pendant la pause. 

ATTENTION : ne faites PAS de pause de plus de 500 ms si vous avez des gestionnaires d'événements enregistrés, sauf si vous savez *exactement* ce que vous faites. Cette fonction est prévue pour des pauses de 1 à 100 ms, afin d'attendre des résultats ou similaire. Un état Lua bloqué (en pause) peut ralentir considérablement tout le serveur si l'on n'y prend pas garde.

#### `MP.SendChatMessage(player_id: number, message: string)`

Envoie un message de chat que seul le joueur indiqué peut voir (ou tout le monde si l'ID est `-1`).
En jeu, il n'apparaîtra pas comme un message privé.

Vous pouvez l'utiliser, par exemple, pour expliquer à un joueur *pourquoi* vous avez annulé l'apparition de son véhicule, son message de chat ou autre, ou pour afficher des informations sur votre serveur.

Exemple :
```lua
function ChatHandler(player_id, player_name, msg)
    if string.match(msg, "darn") then
        MP.SendChatMessage(player_id, "Please do not use profanity.") -- If the player sends a message containing "darn", notify the player and cancel the message
        return 1
    else
        return 0
    end
end

MP.RegisterEvent("onChatMessage", "ChatHandler")
```
Exemple 2 :
```lua
function ChatHandler(player_id, player_name, msg)
    if msg == "hello" then
        MP.SendChatMessage(-1, "Hello World!") -- If the player sends the exact message "hello", announce to the entire server "Hello World!"
        return 0
    end
end
```
#### `MP.TriggerClientEvent(player_id: number, event_name: string, data: string) -> boolean`
*jusqu'à la v3.1.0*

#### `MP.TriggerClientEvent(player_id: number, event_name: string, data: string) -> boolean,string`
*depuis la v3.1.0*

#### `MP.TriggerClientEventJson(player_id: number, event_name: string, data: table) -> boolean,string`
*depuis la v3.1.0*

Appelle l'événement indiqué avec les données fournies sur le client précisé (-1 pour une diffusion à tous). Cet événement peut ensuite être géré dans un mod Lua côté client ; consultez la documentation « Client Scripting » à ce sujet.

Renvoie `true` si le message a pu être envoyé (pour `id = -1`, c'est-à-dire une diffusion, c'est toujours `true`), et `false` si le joueur portant cet ID n'existe pas ou est déconnecté mais possède encore un ID (problème connu).

Si `false` est renvoyé, il est inutile de réessayer cet événement, et il ne faut pas s'attendre à une réponse (si l'on en attendait une).

Depuis la v3.1.0, la seconde valeur de retour contient un message d'erreur si la fonction a échoué. Toujours depuis cette version, la variante `*Json` de la fonction prend une table comme argument de données et la convertit en JSON. Il s'agit simplement d'un raccourci pour `MP.TriggerClientEvent(..., Util.JsonEncode(mytable))`.

#### `MP.GetPlayerCount() -> number`

Renvoie le nombre de joueurs actuellement présents sur le serveur.

#### `MP.GetPositionRaw(pid: number, vid: number) -> table,string`

Renvoie la position actuelle du véhicule `vid` (identifiant du véhicule) du joueur `pid` (identifiant du joueur), ainsi qu'une chaîne d'erreur si une erreur s'est produite.

La table est décodée à partir d'un paquet de position ; elle contient donc diverses données, dont la position et la rotation (c'est pourquoi cette fonction porte le suffixe « Raw »).

Exemple :
```lua
local player_id = 4
local vehicle_id = 0

local raw_pos, error = MP.GetPositionRaw(player_id, vehicle_id)

if error == "" then
    print(raw_pos)
else
    print(error)
end
```
Sortie :
```json
 {
    tim: 49.824, // Time since spawn
    rvel: { // Rotational velocity
            1: -1.33564e-05,
            2: -9.16553e-06,
            3: 8.33364e-07,
    }, 
    vel: { // Velocity
            1: -4.29755e-06,
            2: -5.79335e-06,
            3: 4.95236e-06,
    },
    pos: { // Position
            1: 269.979,
            2: -759.068,
            3: 46.554,
    },
    ping: 0.0125, // Vehicle latency
    rot: { // Rotation
            1: -0.00559953,
            2: 0.00894832,
            3: 0.772266,
            4: 0.635212,
    },
}
```
Exemple 2 :
```lua
local player_id = 4
local vehicle_id = 0

local raw_pos, error = MP.GetPositionRaw(player_id, vehicle_id)
if error = "" then
    local x, y, z = table.unpack(raw_pos["pos"])

    print("X:", x)
    print("Y:", y)
    print("Z:", z)
else
    print(error)
end
```
Sortie :
```
X: -603.459
Y: -175.078
Z: 26.9505
```
#### `MP.IsPlayerConnected(player_id: number) -> boolean`

Indique si le joueur est connecté et si le serveur a reçu un paquet UDP de sa part.

Exemple :
```lua
local player_id = 8
print(MP.IsPlayerConnected(player_id)) -- Check if player with ID 8 is properly connected.
```
Sortie :
```lua
true
```
#### `MP.GetPlayerName(player_id: number) -> string`

Récupère le nom d'affichage du joueur.

Exemple :
```lua
local player_id = 4
print(MP.GetPlayerName(player_id)) -- Get the name of the player with ID 4
```
Sortie :
```
ilovebeammp2004
```
#### `MP.RemoveVehicle(player_id: number, vehicle_id: number)`

Supprime le véhicule indiqué du joueur indiqué.

Exemple :
```lua
local player_id = 3
local player_vehicles = MP.GetPlayerVehicles(player_id)

-- Loop over all of player 3's vehicles and delete them
for vehicle_id, vehicle_data in pairs(player_vehicles) do
      MP.RemoveVehicle(player_id, vehicle_id)
end
```
#### `MP.GetPlayerVehicles(player_id: number) -> table`

Renvoie une table de tous les véhicules que possède actuellement le joueur. Chaque entrée de la table associe un ID de véhicule à ses données (actuellement une chaîne JSON brute).

Exemple :
```lua
local player_id = 3
local player_vehicles = MP.GetPlayerVehicles(player_id)

for vehicle_id, vehicle_data in pairs(player_vehicles) do
    local start = string.find(vehicle_data, "{")
    local formattedVehicleData = string.sub(vehicle_data, start, -1)
    print(Util.JsonDecode(formattedVehicleData))
end
```
Sortie :
```json
{
    pid: 0,
    pro: "0",
    rot: {
            1: 0,
             2: 0,
            3: 0.776866,
            4: 0.629665,
    },
    jbm: "miramar",
    vcf: {
            parts: {
                    miramar_exhaust: "miramar_exhaust",
                    miramar_shock_R: "miramar_shock_R",
                    miramar_taillight: "miramar_taillight",
                    miramar_door_RL: "miramar_door_RL"
                    // ... continue
            },
            paints: {
                    1: {
                            roughness: 1,
                            metallic: 0,
                            clearcoat: 1,
                            baseColor: {
                                    1: 0.85,
                                    2: 0.84,
                                    3: 0.8,
                                    4: 1.2,
                            },
                            clearcoatRoughness: 0.09,
                    } // ... continue
            },
            partConfigFilename: "vehicles/miramar/base_M.pc",
            vars: {},
            mainPartName: "miramar",
    },
    pos: {
            1: 283.669,
            2: -754.332,
            3: 48.2151,
    },
    vid: 64822,
    ign: 0,
}
```
#### `MP.GetPlayers() -> table`

Renvoie une table de tous les joueurs connectés. Cette table associe les IDs aux noms, comme ceci :  
```json
{
	0: "LionKor",
	1: "JohnDoe"
}
```
#### `MP.IsPlayerGuest(player_id: number) -> boolean`

Indique si le joueur est un invité. Un invité est quelqu'un qui ne s'est pas connecté à un compte et a choisi de jouer en tant qu'invité. Son nom est généralement `guest` suivi d'un long nombre.

Comme les invités sont anonymes, vous voudrez peut-être leur interdire de rejoindre le serveur ; dans ce cas, il est recommandé d'utiliser plutôt l'argument `is_guest` de [`onPlayerAuth`](#onplayerauth).

#### `MP.DropPlayer(player_id: number, [reason: string])`

Expulse le joueur portant l'ID indiqué. Le paramètre reason est facultatif.
```lua
function ChatHandler(player_id, player_name, message)
    if string.match(message, "darn") then
        MP.DropPlayer(player_id, "Profanity is not allowed")
        return 1
    else
        return 0
    end
end 
```
#### `MP.GetStateMemoryUsage() -> number`

Renvoie l'utilisation mémoire de l'état Lua actuel, en octets.

#### `MP.GetLuaMemoryUsage() -> number` 

Renvoie l'utilisation mémoire de tous les états Lua combinés, en octets.

#### `MP.GetPlayerIdentifiers(player_id: number) -> table`

Renvoie une table contenant des informations sur le joueur, telles que son ID sur le forum BeamMP, son adresse IP et l'ID de son compte Discord. L'ID Discord n'est renvoyé que si l'utilisateur l'a lié à son compte du forum.

Vous pouvez trouver l'ID d'un utilisateur sur le forum en vous rendant sur `https://forum.beammp.com/u/USERNAME.json` et en cherchant `"user": {"id": 123456}`. Un ID BeamMP est unique à chaque joueur et, contrairement au nom d'utilisateur, ne peut pas être modifié.

Exemple :
```lua
local player_id = 5
print(MP.GetPlayerIdentifiers(player_id))
```
Sortie :
```json
{
    ip: "127.0.0.1",
    discord: "12345678987654321",
    beammp: "1234567",
}
```
*Jusqu'à la v3.1.0, le champ `ip` est incorrect et ne fonctionnera pas comme prévu. Corrigé dans la v3.1.0.*

#### `MP.Set(setting: number, ...)`

Modifie temporairement un paramètre de ServerConfig. La table `MP.Settings` est utile pour cela.

Exemple :
```lua
MP.Set(MP.Settings.Debug, true) -- Turns on debug mode
```
#### `MP.Settings -> table`

Table associant les ID de paramètres à leur nom. Utilisée avec `MP.Set` pour modifier les paramètres de ServerConfig. 

Exemple :
```lua
print(MP.Settings)
```
Sortie :
```json
{
    MaxPlayers: 3,
    Debug: 0,
    Name: 5,
    Description: 6,
    MaxCars: 2,
    Private: 1,
    Map: 4,
}
```
### Fonctions Util

#### `Util.Json*`

Depuis BeamMP-Server `v3.1.0`.

Il s'agit d'une bibliothèque JSON intégrée, généralement bien plus rapide que n'importe quelle bibliothèque JSON Lua. En coulisses, c'est la bibliothèque C++ `nlohmann::json` qui est utilisée ; elle est conforme à la spécification JSON, couverte à 100 % par des tests unitaires et soumise en continu à du fuzzing.

#### `Util.JsonEncode(table: table) -> string`

Encode une table Lua en chaîne JSON, de façon récursive (les tables imbriquées dans d'autres tables fonctionnent comme prévu). Tous les types primitifs sont respectés ; les fonctions, userdata et éléments similaires sont ignorés.

Le JSON obtenu est minifié et peut être mis en forme lisible avec `Util.JsonPrettify`.

Exemple : 
```lua
local player = {
	name = "Lion",
	age = 69,
	skills = { "skill A", "skill B" }
}
local json = Util.JsonEncode(player)
```
Donne : 
```json
{"name":"Lion","age":69,"skills":["skill A","skill B"]}
```
#### `Util.JsonDecode(json: string) -> table`

Décode du JSON en table Lua. Renvoie `nil` en cas d'échec et affiche une erreur.

Exemple :
```lua
local json = "{\"message\":\"OK\",\"code\":200}"
local tbl = Util.JsonDecode(json)
```
Donne :
```lua
{
	message = "OK",
	code = 200,
}
```
#### `Util.JsonPrettify(json: string) -> string`

Ajoute de l'indentation et des retours à la ligne au JSON pour le rendre plus lisible par des humains.

Exemple :
```
local myjson = Util.JsonEncode({ name="Lion", age = 69, skills = { "skill A", "skill B" } })

print(Util.JsonPrettify(myjson))
```
Donne :
```json
{
    "age": 69.0,
    "name": "Lion",
    "skills": [
        "skill A",
        "skill B"
    ]
}
```
#### `Util.JsonMinify(json: string) -> string`

Supprime l'indentation, les retours à la ligne et tout autre espace. Inutile, sauf si vous avez appelé `Util.JsonPrettify`, car toutes les sorties de `Util.Json*` sont déjà minifiées.

Exemple :
```lua
local pretty = Util.JsonPrettify(Util.JsonEncode({ name="Lion", age = 69, skills = { "skill A", "skill B" } }))

print(Util.JsonMinify(pretty))
```
Donne :
```json
{"age":69.0,"name":"Lion","skills":["skill A","skill B"]}
```
#### `Util.JsonFlatten(json: string) -> string`

Crée un objet JSON dont les clés sont aplaties en pointeurs JSON, conformément à la RFC 6901. Vous pouvez restaurer l'original avec `Util.JsonUnflatten()`. Pour que cela fonctionne, toutes les valeurs doivent être des primitives.

Exemple :
```lua
local json = Util.JsonEncode({ name="Lion", age = 69, skills = { "skill A", "skill B" } })
print("normal: " ..json)
print("flattened: " .. Util.JsonFlatten(json))
print("flattened pretty: " .. Util.JsonPrettify(Util.JsonFlatten(json)))

```
Donne : 
```json
normal: {"age":69.0,"name":"Lion","skills":["skill A","skill B"]}
flattened: {"/age":69.0,"/name":"Lion","/skills/0":"skill A","/skills/1":"skill B"}
flattened pretty: {
    "/age": 69.0,
    "/name": "Lion",
    "/skills/0": "skill A",
    "/skills/1": "skill B"
}
```
#### `Util.JsonUnflatten(json: string) -> string`

Restaure l'imbrication arbitraire d'une valeur JSON qui a été aplatie auparavant avec la fonction `Util.JsonFlatten()`. 

#### `Util.JsonDiff(a: string, b: string) -> string`

Crée un diff JSON conformément à la RFC 6902 (http://jsonpatch.com/). Ce diff peut ensuite être appliqué comme un correctif via `Util.JsonDiffApply()`. Renvoie le diff.

#### `Util.JsonDiffApply(base: string, diff: string) -> string`

Applique le `diff` JSON à `base` comme un correctif JSON (RFC 6902, http://jsonpatch.com/). Renvoie le résultat.

### `Util.Random*`

Depuis BeamMP-Server `v3.1.0`.

#### `Util.Random() -> float`

Renvoie un nombre à virgule flottante compris entre 0 et 1.

Exemple :
```lua
local rand = Util.Random()
print("rand: " .. rand)
```
Donne : 
```lua
rand: 0.135477
```
#### `Util.RandomIntRange(min: int, max: int) -> int`

Renvoie un entier compris entre min et max.

Exemple :
```lua
local randInt = Util.RandomIntRange(1, 100)
print("randInt: " .. randInt)
```
Donne : 
```lua
randInt:  69
```
#### `Util.RandomRange(min: number, max: number) -> float`

Renvoie un nombre à virgule flottante compris entre min et max.

Exemple :
```lua
local randFloat = Util.RandomRange(1, 1000)
print("randFloat: " .. randFloat)
```
Donne : 
```lua
randFloat: 420.6969
```
#### `Util.LogInfo(params: ...)` et autres (depuis la v3.3.0)
```lua
Util.LogInfo("Hello, World!")
Util.LogWarn("Cool warning")
Util.LogError("Oh no!")
Util.LogDebug("hi")
```
produit
```
[19/04/24 11:06:50.142] [Test] [INFO] Hello, World!    
[19/04/24 11:06:50.142] [Test] [WARN] Cool warning    
[19/04/24 11:06:50.142] [Test] [ERROR] Oh no!
[19/04/24 11:06:50.142] [Test] [DEBUG] hi
```
Prend en charge exactement la même mise en forme / le même affichage des données que `print()`.

#### `Util.DebugExecutionTime() -> table`

Lorsque du code Lua s'exécute dans le serveur, l'exécution de chaque gestionnaire d'événements est chronométrée. Le minimum, le maximum, la moyenne et l'écart-type de ces durées d'exécution sont calculés et renvoyés dans une table par cette fonction. Le calcul se fait de manière incrémentale : à chaque exécution d'un gestionnaire d'événements, le minimum, le maximum, la moyenne et l'écart-type sont mis à jour. Ainsi, `Util.DebugExecutionTime()` ne prend généralement pas un temps significatif à s'exécuter (moins de 0,25 ms).

Elle renvoie une table comme celle-ci :
```lua
[[table: 0x7af6d400aca0]]: {
	printStuff: [[table: 0x7af6d400be60]]: {
		mean: 0.250433,
		n: 76,
		max: 0.074475,
		stdev: 0.109405,
		min: 0.449274,
	},
	onInit: [[table: 0x7af6d400b130]]: {
		mean: 0.033095,
		n: 1,
		max: 0.033095,
		stdev: 0,
		min: 0.033095,
	},
}	
```
Pour chaque *gestionnaire* d'événement, elle renvoie les données suivantes :

- `n` : nombre de fois où l'événement a été déclenché et où un gestionnaire a été appelé
- `mean` : moyenne de toutes les durées d'exécution, en ms
- `max` : la durée d'exécution la plus longue, en ms
- `min` : la durée d'exécution la plus courte, en ms
- `stdev` : l'écart-type de toutes les moyennes de durées d'exécution, en ms

Voici une fonction que vous pouvez utiliser pour afficher ces données de façon lisible :
```lua
function printDebugExecutionTime()
    local stats = Util.DebugExecutionTime()
    local pretty = "DebugExecutionTime:\n"
    local longest = 0
    for name, t in pairs(stats) do
        if #name > longest then
            longest = #name
        end
    end
    for name, t in pairs(stats) do
        pretty = pretty .. string.format("%" .. longest + 1 .. "s: %12f +/- %12f (min: %12f, max: %12f) (called %d time(s))\n", name, t.mean, t.stdev, t.min, t.max, t.n)
    end
    print(pretty)
end
```
Vous pouvez l'appeler ainsi pour déboguer votre code s'il est lent :
```lua
-- event to print the debug times
MP.RegisterEvent("printStuff", "printDebugExecutionTime")
-- run every 5000 ms = 5 seconds (or 10, or 60, whatever makes sense for you
MP.CreateEventTimer("printStuff", 5000)
```
### Fonctions FS

Les fonctions `FS` sont des fonctions de système de **f**ichiers (**f**ile**s**ystem), qui visent à faire mieux que les capacités Lua par défaut.

Veuillez toujours utiliser `/` comme séparateur lorsque vous indiquez des chemins, car il est multiplateforme (Windows, Linux, macOS, ...).

#### `FS.CreateDirectory(path: string) -> bool,string`


Crée le dossier indiqué, ainsi que tous ses dossiers parents s'ils n'existent pas. Le comportement est à peu près équivalent à la commande Linux courante `mkdir -p`.

En cas de succès, renvoie `true` et `""`. Si la création du dossier échoue, renvoie `false` et un message d'erreur (`string`).

Exemple :
```lua
local success, error_message = FS.CreateDirectory("data/mystuff/somefolder")

if not success then
	print("failed to create directory: " .. error_message)
else
	-- do something with the directory
end

-- Be careful not to do this! This will ALWAYS be true!
if error_message then
	-- ...
end
```
#### `FS.Remove(path: string) -> bool,string`

Supprime le fichier ou dossier indiqué.

Renvoie `true` si une erreur s'est produite, avec un message d'erreur dans la seconde valeur de retour.

Exemple :
```lua
local error, error_message = FS.Remove("myfile.txt")

if error then
	print("failed to delete myfile: " .. error_message)
end
```
#### `FS.Rename(pathA: string, pathB: string) -> bool,string`

Renomme (ou déplace) `pathA` en `pathB`.

Renvoie `true` si une erreur s'est produite, avec un message d'erreur dans la seconde valeur de retour.

#### `FS.Copy(pathA: string, pathB: string) -> bool,string`

Copie `pathA` vers `pathB`.

Renvoie `true` si une erreur s'est produite, avec un message d'erreur dans la seconde valeur de retour.

#### `FS.GetFilename(path: string) -> string`

Renvoie la dernière partie d'un chemin, qui correspond généralement au nom du fichier.
Voici quelques exemples d'entrées et de sorties :
```lua
input -> output

"my/path/a.txt" 	-> "a.txt"
"somefile.txt" 		-> "somefile.txt"
"/awesome/path" 	-> "path"
```
#### `FS.GetExtension(path: string) -> string`


Renvoie l'extension du fichier, ou une chaîne vide s'il n'y en a pas.
Voici quelques exemples d'entrées et de sorties
```lua
input -> output

"myfile.txt" 					-> ".txt"
"somefile." 					-> "."
"/awesome/path" 				-> ""
"/awesome/path/file.zip.txt"	-> ".txt"
"myexe.exe" 					-> ".exe"
```
#### `FS.GetParentFolder(path: string) -> string`

Renvoie le chemin du dossier parent, c'est-à-dire le dossier qui contient un fichier ou un dossier.
Voici quelques exemples d'entrées et de sorties :
```lua
input -> output

"/var/tmp/example.txt" 		-> "/var/tmp"
"/"							-> "/"
"mydir/a/b/c.txt"			-> "mydir/a/b"
```
#### `FS.Exists(path: string) -> bool`

Renvoie `true` si le chemin existe, `false` sinon.

#### `FS.IsDirectory(path: string) -> bool`

Renvoie `true` si le chemin indiqué est un dossier, `false` sinon. Notez que `false` n'implique PAS que le chemin soit un fichier (voir `FS.IsFile()`).

#### `FS.IsFile(path: string) -> bool`

Renvoie `true` si le chemin indiqué est un fichier ordinaire (pas un lien symbolique, un lien physique, un périphérique bloc, etc.), `false` sinon. Notez que `false` n'implique PAS que le chemin soit un dossier (voir `FS.IsDirectory()`).

#### `FS.ListDirectories(path: string) -> table`

Renvoie une table de tous les dossiers présents dans le chemin indiqué.

Exemple :
```lua
print(FS.ListDirectories("Resources"))
```
Donne : 
```lua
{
    1: "Client",
    2: "Server"
}
```
#### `FS.ListFiles(path: string) -> table`

Renvoie une table de tous les fichiers présents dans le chemin indiqué.

Exemple :
```lua
print(FS.ListFiles("Resources/Server/examplePlugin"))
```
Donne : 
```lua
{
    1: "example.json",
    2: "example.lua"
}
```
#### `FS.ConcatPaths(...) -> string`

Additionne (concatène) tous les arguments avec le séparateur de chemin préféré du système.

Exemple :
```lua  
FS.ConcatPaths("a", "b", "/c/d/e/", "/f/", "g", "h.txt")
```
donne
```
a/b/c/d/e/f/g/h.txt
```
Résout également `..`, s'il apparaît à un endroit quelconque du chemin. Cette fonction est plus sûre que la concaténation de chaînes en Lua et respecte les séparateurs de la plateforme.

Veuillez toujours utiliser `/` comme séparateur lorsque vous indiquez des chemins, car il est multiplateforme (Windows, Linux, macOS, ...).

### Événements {#events-1}

#### Explication

- Arguments : liste des arguments transmis aux gestionnaires de cet événement
- Annulable : indique si l'événement peut être annulé. S'il peut l'être, un gestionnaire peut le faire en renvoyant `1`, comme `return 1`.

#### Résumé des événements

L'arrivée d'un joueur déclenche les événements suivants, dans cet ordre :

1. `onPlayerAuth`
2. `onPlayerConnecting`
3. `onPlayerJoining`
4. `onPlayerJoin`

#### Événements système

##### `onInit`

Arguments : AUCUN
Annulable : NON

Déclenché juste après l'initialisation de tous les fichiers du plugin.

##### `onConsoleInput`

Arguments : `input: string`
Annulable : NON

Déclenché lorsque la console BeamMP reçoit une saisie.

##### `onShutdown`

Arguments : AUCUN
Annulable : NON

Déclenché à l'arrêt du serveur. Actuellement, cela se produit après l'expulsion de tous les joueurs.

#### Événements liés au jeu

##### `onPlayerAuth`

Arguments : `player_name: string`, `player_role: string`, `is_guest: bool`, `identifiers: table -> beammp, ip`
Annulable : OUI

Premier événement déclenché lorsqu'un joueur souhaite rejoindre le serveur. Un joueur peut se voir refuser l'accès en renvoyant `1` ou un motif (`string`) depuis la fonction de gestion.
```lua
function myPlayerAuthorizer(name, role, is_guest, identifiers)
	return "Sorry, you cannot join at this time."
end
MP.RegisterEvent("onPlayerAuth", "myPlayerAuthorizer")
```
##### `onPlayerConnecting`

Arguments : `player_id: number`
Annulable : NON

Déclenché lorsqu'un joueur commence à se connecter, après `onPlayerAuth`.

##### `onPlayerJoining`

Arguments : `player_id: number`
Annulable : NON

Déclenché lorsqu'un joueur a fini de charger tous les mods, après `onPlayerConnecting`.

##### `onPlayerDisconnect`

Arguments : `player_id: number`
Annulable : NON

Déclenché lorsqu'un joueur se déconnecte.

##### `onChatMessage`

Arguments : `player_id: number`, `player_name: string`, `message: string`
Annulable : OUI

Déclenché lorsqu'un joueur envoie un message dans le chat. S'il est annulé, le message ne sera montré à personne, pas même au joueur qui l'a envoyé.

##### `onVehicleSpawn`

Arguments : `player_id: number`, `vehicle_id: number`, `data: string`
Annulable : OUI

Déclenché lorsqu'un joueur fait apparaître un nouveau véhicule. Notez que les changements/remplacements de véhicule déclenchent plutôt [`onVehicleEdited`](#onvehicleedited). L'argument `data` contient la configuration de la voiture ainsi que ses données de position/rotation, sous forme de chaîne JSON.

<details>

<summary>Exemple de valeur de <code>data</code></summary>

La chaîne de données commence par un identifiant unique du véhicule, composé de l'ID du joueur, d'un tiret, puis de l'ID du véhicule. Elle est suivie d'un objet JSON contenant des informations sur la configuration et le positionnement du véhicule.
```
0-0: {
    "abs": "realistic",
    "ign": 3,
    "jbm": "van",
    "pid": 0,
    "pos": [
        907.93902587891,
        773.50201416016,
        238.87800598145
    ],
    "pro": "0",
    "rot": [
        0,
        0,
        0.99999994039536,
        0
    ],
    "vcf": {
        "licenseName": "H30 9VV",
        "mainPartName": "van",
        "mainPartPath": "/van",
        "model": "van",
        "paints": [
            {
                "baseColor": [
                    0.21999999880791,
                    0.37000000476837003,
                    0.33000001311302,
                    1.2000000476837
                ],
                "clearcoat": 0,
                "clearcoatRoughness": 0,
                "metallic": 0,
                "roughness": 0.070000000298023
            },
            {
                "baseColor": [
                    0.62300002574921,
                    0.62300002574921,
                    0.62300002574921,
                    1.2000000476837
                ],
                "clearcoat": 0.80000001192093,
                "clearcoatRoughness": 0.070000000298023,
                "metallic": 0.80000001192093,
                "roughness": 0.64999997615814
            },
            {
                "baseColor": [
                    0.21999999880791,
                    0.37000000476837003,
                    0.33000001311302,
                    1.2000000476837
                ],
                "clearcoat": 0,
                "clearcoatRoughness": 0,
                "metallic": 0,
                "roughness": 0.070000000298023
            }
        ],
        "partConfigFilename": "vehicles/van/h15_xt_passenger.pc",
        "parts": {
            "brakepad_F": "brakepad_F_premium",
            "brakepad_R": "brakepad_R_premium",
            "gps": "",
            "licenseplate_design_2_1": "",
            "linelock": "",
            "load_seat_FR": "",
            "n2o_system": "",
            "paint_design": "van_skin_twotone",
            "pickup_engine_v8_ecu": "pickup_engine_v8_ecu",
            "pickup_engine_v8_internals": "pickup_engine_v8_internals",
            "pickup_enginemounts": "pickup_enginemounts",
            "pickup_oilpan_v8": "pickup_oilpan_v8",
            "pickup_reversewarn": "",
            "pickup_sparetire": "pickup_sparetire_5l",
            "pickup_towhitch": "",
            "skin_glass": "van_skin_glass_tint",
            "skin_interior": "van_skin_interior_black",
            "soundscape_horn": "soundscape_horn_115",
            "tire_F_16x7_alt": "tire_F_225_75_16_alt_standard",
            "tire_R_16x7_alt": "tire_R_225_75_16_alt_standard",
            "van_ABS": "van_ABS",
            "van_ESC": "",
            "van_ac": "van_ac",
            "van_body": "van_body_passenger",
            "van_brake_F": "van_brake_F",
            "van_brake_R": "van_brake_R_drum",
            "van_bumper_F": "van_bumper_F_altb",
            "van_bumper_F_lip": "",
            "van_bumper_R": "van_bumper_R_altb",
            "van_bumper_accessory_F": "",
            "van_bumpersignal_FL": "van_bumpersignal_FL",
            "van_bumpersignal_FR": "van_bumpersignal_FR",
            "van_coilover_IFS": "van_coilover_IFS",
            "van_converter": "van_converter",
            "van_differential_F": "",
            "van_differential_R": "van_differential_R",
            "van_door_FL": "van_door_FL",
            "van_door_FR": "van_door_FR",
            "van_doordetent_FL": "van_doordetent_FL",
            "van_doordetent_FR": "van_doordetent_FR",
            "van_doordetent_RL": "van_doordetent_RL",
            "van_doordetent_RR": "van_doordetent_RR",
            "van_doorglass_L": "van_doorglass_L",
            "van_doorglass_R": "van_doorglass_R",
            "van_doorpanel_FL": "van_doorpanel_FL",
            "van_doorpanel_FR": "van_doorpanel_FR",
            "van_driveshaft_R": "van_driveshaft_R",
            "van_engine": "van_engine_v8_4.5",
            "van_exhaust_v8": "van_exhaust_v8",
            "van_fascia_F": "van_fascia_F_high",
            "van_fender_L": "van_fender_L",
            "van_fender_R": "van_fender_R",
            "van_fenderflare_FL": "",
            "van_fenderflare_FR": "",
            "van_fenderflare_RL": "",
            "van_fenderflare_RR_sidedoor": "",
            "van_finaldrive_R": "van_finaldrive_R_355",
            "van_frame": "van_frame",
            "van_fueltank": "van_fueltank",
            "van_header": "van_exhmanifold",
            "van_headlight_L_high": "van_headlight_L_high",
            "van_headlight_R_high": "van_headlight_R_high",
            "van_hood": "van_hood",
            "van_hub_F": "van_hub_F_5",
            "van_hub_R": "van_hub_R_5",
            "van_intake_v8": "van_intake_v8",
            "van_intcarpet_roof": "van_intcarpet_roof",
            "van_interior": "van_interior",
            "van_lettering_doors_F": "van_lettering_doors_F_h15",
            "van_lettering_reardoor_L": "van_lettering_gavril_reardoor_L",
            "van_lettering_reardoor_R": "van_lettering_h15_xt_reardoor_R",
            "van_licenseplate_F": "van_licenseplate_F",
            "van_licenseplate_R": "van_licenseplate_R",
            "van_lightbar": "",
            "van_mirror_L": "van_mirror_L",
            "van_mirror_R": "van_mirror_R",
            "van_mod": "",
            "van_muffler": "van_muffler",
            "van_power_steering": "",
            "van_radiator": "van_radiator",
            "van_radio": "van_radio",
            "van_reardoor_L": "van_reardoor_L",
            "van_reardoor_R": "van_reardoor_R",
            "van_reardoorglass_L": "van_reardoorglass_L",
            "van_reardoorglass_R": "van_reardoorglass_R",
            "van_reardoorpanel_L": "van_reardoorpanel_L",
            "van_reardoorpanel_R": "van_reardoorpanel_R",
            "van_rollcage": "",
            "van_roof": "van_roof",
            "van_roof_accessory": "",
            "van_runningboard": "",
            "van_seat_1R": "van_seat_1R",
            "van_seat_2R": "van_seat_2R",
            "van_seat_3R": "van_seat_3R",
            "van_seat_FL": "van_seat_FL",
            "van_seat_FR": "van_seat_FR",
            "van_shifter": "van_shifter_A",
            "van_shock_R": "van_shock_R",
            "van_sidedoor_FR": "van_sidedoor_FR_alt",
            "van_sidedoor_RR": "van_sidedoor_RR_alt",
            "van_sidedoorglass_FR": "van_sidedoorglass_FR",
            "van_sidedoorglass_RR": "van_sidedoorglass_RR",
            "van_sidedoorpanel_FR": "van_sidedoorpanel_FR",
            "van_sidedoorpanel_RR": "van_sidedoorpanel_RR",
            "van_sideglass_FL": "van_sideglass_FL",
            "van_sideglass_ML": "van_sideglass_ML",
            "van_sideglass_RL": "van_sideglass_RL",
            "van_sideglass_RR": "van_sideglass_RR",
            "van_snorkel": "",
            "van_spring_R": "van_spring_R",
            "van_steer": "van_steer",
            "van_steering": "van_steering",
            "van_suspension_F": "van_IFS",
            "van_suspension_R": "van_axle_R",
            "van_swaybar_F": "van_swaybar_F",
            "van_swaybar_R": "",
            "van_taillight_L": "van_taillight_L",
            "van_taillight_R": "van_taillight_R",
            "van_taillightguard_L": "",
            "van_taillightguard_R": "",
            "van_transfer_case": "van_transfer_case_RWD",
            "van_transmission": "van_transmission_4A",
            "van_tubs": "van_tubs",
            "van_valance_F": "van_valance_F",
            "van_wheeldata_F": "van_wheeldata_F",
            "van_wheeldata_R": "van_wheeldata_R",
            "van_windshield": "van_windshield",
            "wheel_F_5": "wheel_25a_16x7_5_F",
            "wheel_R_5": "wheel_25a_16x7_5_R"
        },
        "vars": {}
    },
    "vid": 29339
}
```
</details>

##### `onVehicleEdited`

Arguments : `player_id: number`, `vehicle_id: number`, `data: string`
Annulable : OUI

Déclenché lorsqu'un joueur modifie ou remplace son véhicule. L'argument `data` contient la configuration mise à jour de la voiture, sous forme de chaîne JSON, mais n'inclut **pas** les données de position ni de rotation. Vous pouvez utiliser [MP.GetPositionRaw](#mpgetpositionrawpid-number-vid-number-tablestring) pour obtenir la position et la rotation.

<details>

<summary>Exemple de valeur de <code>data</code></summary>

La chaîne de données commence par un identifiant unique du véhicule, composé de l'ID du joueur, d'un tiret, puis de l'ID du véhicule. Elle est suivie d'un objet JSON contenant des informations sur la configuration du véhicule.
```
0-0: {
  "abs": "realistic",
  "ign": 3,
  "jbm": "van",
  "pid": 0,
  "pro": "0",
  "vcf": {
    "licenseName": "P60 1EP",
    "mainPartName": "van",
    "mainPartPath": "/van",
    "model": "van",
    "paints": [
      {
        "baseColor": [
          0.40000000596046,
          0.050000000745058,
          0.050000000745058,
          1.2000000476837
        ],
        "clearcoat": 0,
        "clearcoatRoughness": 0,
        "metallic": 0,
        "roughness": 0.070000000298023
      },
      {
        "baseColor": [
          0.40000000596046,
          0.050000000745058,
          0.050000000745058,
          1.2000000476837
        ],
        "clearcoat": 0,
        "clearcoatRoughness": 0,
        "metallic": 0,
        "roughness": 0.070000000298023
      },
      {
        "baseColor": [
          0.40000000596046,
          0.050000000745058,
          0.050000000745058,
          1.2000000476837
        ],
        "clearcoat": 0,
        "clearcoatRoughness": 0,
        "metallic": 0,
        "roughness": 0.070000000298023
      }
    ],
    "partConfigFilename": "vehicles/van/h15_passenger.pc",
    "parts": {
      "brakepad_F": "brakepad_F_premium",
      "brakepad_R": "brakepad_R_premium",
      "gps": "",
      "hubcap_F_16": "hubcap_09c_F_altd",
      "hubcap_R_16": "hubcap_09c_R_altd",
      "licenseplate_design_2_1": "",
      "linelock": "",
      "load_seat_FR": "",
      "n2o_system": "",
      "paint_design": "",
      "pickup_engine_v8_ecu": "pickup_engine_v8_ecu_late",
      "pickup_engine_v8_internals": "pickup_engine_v8_internals",
      "pickup_enginemounts": "pickup_enginemounts",
      "pickup_oilpan_v8": "pickup_oilpan_v8",
      "pickup_reversewarn": "",
      "pickup_sparetire": "pickup_sparetire_6l",
      "pickup_towhitch": "",
      "skin_glass": "",
      "skin_interior": "van_skin_interior_ivory",
      "soundscape_horn": "soundscape_horn_115",
      "tire_F_16x7_alt": "tire_F_225_75_16_alt_standard",
      "tire_R_16x7_alt": "tire_R_225_75_16_alt_standard",
      "trimring_F_16x7": "",
      "trimring_R_16x7": "",
      "van_ABS": "van_ABS",
      "van_ac": "van_ac",
      "van_body": "van_body_passenger",
      "van_brake_F": "van_brake_F",
      "van_brake_R": "van_brake_R",
      "van_bumper_accessory_F_late": "",
      "van_bumper_F": "van_bumper_F_late_alt",
      "van_bumper_F_lip_late": "",
      "van_bumper_R": "van_bumper_R_late_alt",
      "van_coilover_IFS": "van_coilover_IFS",
      "van_converter": "van_converter",
      "van_differential_F": "",
      "van_differential_R": "van_differential_R",
      "van_door_FL": "van_door_FL",
      "van_door_FR": "van_door_FR",
      "van_doordetent_FL": "van_doordetent_FL",
      "van_doordetent_FR": "van_doordetent_FR",
      "van_doordetent_RL": "van_doordetent_RL",
      "van_doordetent_RR": "van_doordetent_RR",
      "van_doorglass_L": "van_doorglass_L",
      "van_doorglass_R": "van_doorglass_R",
      "van_doorpanel_FL": "van_doorpanel_FL",
      "van_doorpanel_FR": "van_doorpanel_FR",
      "van_driveshaft_R": "van_driveshaft_R",
      "van_engine": "van_engine_v8_4.5",
      "van_ESC": "van_ESC",
      "van_exhaust_v8": "van_exhaust_v8",
      "van_fascia_F": "van_fascia_F_late",
      "van_fender_L": "van_fender_L",
      "van_fender_R": "van_fender_R",
      "van_fenderflare_FL": "",
      "van_fenderflare_FR": "",
      "van_fenderflare_RL": "",
      "van_fenderflare_RR_sidedoor": "",
      "van_finaldrive_R": "van_finaldrive_R_355",
      "van_frame": "van_frame",
      "van_fueltank": "van_fueltank",
      "van_grille_F_late": "van_grille_F_late",
      "van_header": "van_exhmanifold",
      "van_headlight_L_late": "van_headlight_L_late",
      "van_headlight_R_late": "van_headlight_R_late",
      "van_hood": "van_hood_late",
      "van_hub_F": "van_hub_F_6",
      "van_hub_R": "van_hub_R_6",
      "van_intake_v8": "van_intake_v8_late",
      "van_intcarpet_roof": "van_intcarpet_roof",
      "van_interior": "van_interior",
      "van_lettering_doors_F": "van_lettering_doors_F_h15",
      "van_lettering_reardoor_L": "van_lettering_gavril_reardoor_L",
      "van_lettering_reardoor_R": "van_lettering_h15_reardoor_R",
      "van_licenseplate_F_late": "van_licenseplate_F_late",
      "van_licenseplate_R_late": "van_licenseplate_R_late",
      "van_lightbar": "",
      "van_mirror_L": "van_mirror_L",
      "van_mirror_R": "van_mirror_R",
      "van_mod": "",
      "van_muffler": "van_muffler",
      "van_power_steering": "",
      "van_radiator": "van_radiator",
      "van_radio": "van_radio",
      "van_reardoor_L": "van_reardoor_L",
      "van_reardoor_R": "van_reardoor_R",
      "van_reardoorglass_L": "van_reardoorglass_L",
      "van_reardoorglass_R": "van_reardoorglass_R",
      "van_reardoorpanel_L": "van_reardoorpanel_L",
      "van_reardoorpanel_R": "van_reardoorpanel_R",
      "van_rollcage": "",
      "van_roof": "van_roof",
      "van_roof_accessory": "",
      "van_runningboard": "",
      "van_seat_1R": "van_seat_1R",
      "van_seat_2R": "van_seat_2R",
      "van_seat_3R": "van_seat_3R",
      "van_seat_FL": "van_seat_FL",
      "van_seat_FR": "van_seat_FR",
      "van_shifter": "van_shifter_A",
      "van_shock_R": "van_shock_R",
      "van_sidedoor_FR": "van_sidedoor_FR_alt",
      "van_sidedoor_RR": "van_sidedoor_RR_alt",
      "van_sidedoorglass_FR": "van_sidedoorglass_FR",
      "van_sidedoorglass_RR": "van_sidedoorglass_RR",
      "van_sidedoorpanel_FR": "van_sidedoorpanel_FR",
      "van_sidedoorpanel_RR": "van_sidedoorpanel_RR",
      "van_sideglass_FL": "van_sideglass_FL",
      "van_sideglass_ML": "van_sideglass_ML",
      "van_sideglass_RL": "van_sideglass_RL",
      "van_sideglass_RR": "van_sideglass_RR",
      "van_snorkel": "",
      "van_spring_R": "van_spring_R",
      "van_steer": "van_steer_facelift",
      "van_steering": "van_steering",
      "van_suspension_F": "van_IFS",
      "van_suspension_R": "van_axle_R",
      "van_swaybar_F": "van_swaybar_F",
      "van_swaybar_R": "",
      "van_taillight_L": "van_taillight_L",
      "van_taillight_R": "van_taillight_R",
      "van_taillightguard_L": "",
      "van_taillightguard_R": "",
      "van_transfer_case": "van_transfer_case_RWD",
      "van_transmission": "van_transmission_4A",
      "van_tubs": "van_tubs",
      "van_valance_F": "van_valance_F_late",
      "van_wheeldata_F": "van_wheeldata_F",
      "van_wheeldata_R": "van_wheeldata_R",
      "van_windshield": "van_windshield",
      "wheel_F_6": "steelwheel_02b_16x7_F",
      "wheel_R_6": "steelwheel_02b_16x7_R"
    },
    "vars": {}
  }
}
```
</details>

##### `onVehicleDeleted`

Arguments : `player_id: number`, `vehicle_id: number`
Annulable : NON

Déclenché lorsqu'un joueur supprime son véhicule.

##### `onVehicleReset`

Arguments : `player_id: number`, `vehicle_id: number`, `data: string`
Annulable : NON

Déclenché lorsqu'un joueur réinitialise son véhicule. `data` contient la position et la rotation mises à jour de la voiture, mais n'inclut **pas** la configuration du véhicule. Vous pouvez utiliser [MP.GetPlayerVehicles](#mpgetplayervehiclesplayer_id-number-table) pour obtenir la configuration du véhicule.

##### `onFileChanged`

*depuis la v3.1.0*

Arguments : `path: string`
Annulable : NON

Déclenché lorsqu'un fichier change dans le dossier `Resources/Server` *ou dans l'un de ses sous-dossiers*. 

Toute modification d'un fichier du dossier `Resources/Server/<plugin>` (et non d'un de ses sous-dossiers) provoque un rechargement de l'état Lua ainsi qu'un événement `onFileChanged`.

Tout fichier situé dans un sous-dossier de `Resources/Server/<plugin>`, comme `Resources/Server/<plugin>/lua/stuff.lua`, ne provoquera pas de rechargement de l'état et ne déclenchera qu'un événement `onFileChanged`. Vous pouvez ainsi le recharger vous-même de la bonne manière (ou ne pas le recharger).

Cela s'applique à tous les fichiers, pas seulement aux fichiers `.lua`.

Le `path` est relatif à la racine du serveur, par exemple `Resources/Server/myplugin/myfile.txt`. Vous pouvez ensuite traiter cette chaîne avec la famille de fonctions `FS.*`, par exemple pour en extraire le nom ou l'extension (`FS.GetExtension(...)`, `FS.GetFilename(...)`, ...).

Remarque : les fichiers ajoutés après le démarrage du serveur ne sont *pas* suivis à partir de la v3.1.0.

### Migrer depuis l'ancien Lua {#migrating-from-old-lua}

Voici un bref récapitulatif des étapes de base pour migrer de l'ancien Lua vers le nouveau.

#### Comprendre le fonctionnement du nouveau Lua

Pour cela, veuillez lire attentivement la section [« Introduction »](#how-to-start-writing-a-plugin) et toutes ses sous-sections.
C'est nécessaire pour réaliser correctement les étapes suivantes.

#### Rechercher et remplacer

Tout d'abord, vous devez rechercher et remplacer toutes les fonctions MP. Le remplacement doit ajouter `MP.` devant toutes les fonctions MP, sauf `print()`.

Exemple :
```lua
local players = GetPlayers()
print(#players)
```
devient
```lua
local players = MP.GetPlayers()
print(#players) -- note how print() doesn't change
```
#### Adieu les threads, bonjour les minuteurs d'événements !

Comme expliqué dans l'introduction, les threads sont des minuteurs d'événements. Remplacez tout appel à `CreateThread` par un appel à `CreateEventTimer`. Examinez attentivement le rythme de votre ancien CreateThread (le nombre était X fois par seconde) et déterminez la valeur de délai du minuteur d'événements correspondante (en millisecondes). Gardez aussi à l'esprit qu'il prend un nom d'événement au lieu d'un nom de fonction : vous devrez donc également enregistrer un événement.

Exemple :
```lua
CreateThread("myFunction", 2) -- calls "myFunction" twice per second
```
devient
```lua
MP.RegisterEvent("myEvent", "myFunction") -- registering our event for the timer
MP.CreateEventTimer("myEvent", 500) -- 500 milliseconds = 2 times per second
```
Si vous avez beaucoup de minuteurs d'événements, il est judicieux de voir si vous pouvez les regrouper, par exemple en créant un événement « chaque minute » auquel vous enregistrez plusieurs fonctions devant être appelées chaque minute, plutôt que d'avoir plusieurs minuteurs d'événements. Chaque minuteur d'événements coûte un peu de temps au serveur pour se déclencher.

#### Fini l'appel implicite d'événements

Vous devez enregistrer tous vos événements. Vous ne pouvez pas vous fier aux noms de fonctions. Dans l'ancien Lua, ce point n'était pas clair, mais dans le nouveau Lua il est généralement imposé. Un bon modèle est : 
```lua
MP.RegisterEvent("onChatMessage", "chatMessageHandler")
-- or 
MP.RegisterEvent("onChatMessage", "handleChatMessage")
```
C'est un meilleur modèle que de donner au gestionnaire le même nom que l'événement, ce qui est trompeur et source de confusion.
