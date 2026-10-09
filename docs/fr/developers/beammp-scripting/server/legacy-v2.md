::: warning Ce site est en cours de construction !
Ce site est actuellement en cours de développement.

Vous pensez pouvoir contribuer ? Cliquez simplement sur l'icône en forme de crayon située à droite de la page !

Vous pouvez également contribuer à n'importe quelle autre page.
:::

# Référence de script serveur
## Serveur version 2.X
::: warning
La version 2.X du serveur BeamMP n'est plus prise en charge. Cette documentation est fournie à titre de référence uniquement.
Veuillez passer à la dernière version pour bénéficier de la maintenance et du support.
:::
---

> Ceci concerne le scripting 2.x. Ne vous y référez que si votre serveur est ancien/obsolète (version 2.x.x). Pour la dernière documentation, consultez [ce lien](https://docs.beammp.com/scripting/server/latest-server-reference).
{.is-warning}

### Remarques

Pour obtenir le résultat d'une fonction dans la console du serveur, vous devez l'encadrer d'une instruction `print()`.
Par exemple :
`print(GetPlayerName(0))` renverra le nom du premier joueur de votre serveur.

`<PlayersServerID>` commence à 0.

### Liste des fonctions disponibles pour le scripting

#### GetPlayerName(playersServerID)
Renvoie le nom Discord du joueur sous forme de chaîne de caractères
  ```lua
  function onPlayerJoin(playerID)
  	local name = GetPlayerName(playerID)
  	-- Do something
  end
  ```
#### GetPlayerDiscordID(playersServerID)
Renvoie le nom Discord du joueur sous forme de chaîne de caractères
  ```lua
  function onPlayerJoin(playerID)
  	local name = GetPlayerDiscordID(playerID)
  	-- Do something
  end
  ```
#### GetPlayerHWID(playersServerID)
Renvoie l'ID Discord du joueur sous forme de chaîne de caractères
  ```lua
  function onPlayerJoin(playerID)
  	local name = GetPlayerHWID(playerID)
  	-- Do something
  end
  ```
#### GetPlayerVehicles(playersServerID)
Renvoie les véhicules du joueur sous forme d'objet/tableau
  ```lua
  function onChatMessage(playerID, senderName, message)
  	local vehicleList = GetPlayerVehicles(playerID)
  	for vehicleID, vehicleData in pairs(vehicleList) do
    	-- Do something
      -- Could also be used to check how many vehicles a player have
  	end
  end
  ```
#### DropPlayer(playersServerID)
Coupe la connexion d'un joueur donné, ce qui revient à l'expulser
  ```lua
  function onVehicleSpawn(playerID, vehicleID, vehicleData)
  	-- Do something	
  	DropPlayer(playerID)
  end
  ```
#### SendChatMessage(playersServerID, message)
Envoie un message sur le réseau à l'utilisateur indiqué. Utilisez -1 pour tout le monde
  ```lua
  function onPlayerJoin(playerID)
  	SendChatMessage(-1, "Someone just joined!")
  end
  ```
#### CancelEvent() -- OBSOLÈTE
  Annule l'événement. Cette fonction pourrait bientôt disparaître. Utilisez `return 1` pour annuler l'événement.
  
#### onInit()
Si elle est déclarée dans un fichier Lua, elle sera appelée une fois que le C++ a fini de charger le fichier Lua en cours
  ```lua
  function onInit()
  	print("Server ready")
  end
  ```
#### exit()
Ferme le serveur
  ```lua
  function onInit()
  	print("Server Ready. But who needs a server which is running")
  	exit() -- Stops the server
  end
  ```
#### CreateThread(functionName, callInterval)
Exécute la fonction sur un thread dédié, à raison de callInterval fois par seconde. 
1 = elle s'exécutera toutes les secondes.
  ```lua
  function yourFunction()
   	for i = 1,10 do
  		SendChatMessage(-1, "Countdown: "..i)
  		Sleep(1000)
  	end
  end
  CreateThread("yourFunction", 30)
  ```
EXEMPLE OBSOLÈTE
Exécute la fonction sur un thread dédié
  ```lua
  function yourFunction()
   	for i = 1,10 do
  		SendChatMessage(-1, "Countdown: "..i)
  		Sleep(1000)
  	end
  end
  CreateThread("yourFunction", 30)
  ```
#### StopThread(functionName)
Cesse d'appeler la fonction de thread du script en cours
  ```lua
  function yourFunction()
  	delayExpired = false
  	Sleep(10000)
  	delayExpired = true
  end
  CreateThread("yourFunction", 30)
  -- Do something
  if not delayExpired then
  	StopThread("yourFunction")
  else
  	-- Do something
  end
  
  ```
#### Sleep(millisecs) - OBSOLÈTE
Met l'exécution en pause pour la durée indiquée (attention : si vous n'avez pas créé de thread, cela met en pause le serveur tout entier)
  ```lua
  function countdown()
   	for i = 1,10 do
  		SendChatMessage(-1, "Countdown: "..i)
  		Sleep(1000)
  	end
  end
  CreateThread("countdown", 10)
  ```
#### GetPlayerCount()
Renvoie le nombre de joueurs connectés
  ```lua
  function onPlayerJoin(playerID)
  	SendChatMessage(playerID, "You are the "..GetPlayerCount().."th player!"
  end
  ```
#### RemoveVehicle(playerServerID, VehicleID)
Supprime un véhicule
  ```lua
  function onVehicleSpawn(playerID, vehicleID, vehicleData)
  	if --[[ Vehicle data equal something it shouldn't be ]] then
  		RemoveVehicle(playerID, vehicleIID)
  	end
  end
  ```
#### GetPlayers()
Renvoie une table d'IDs associés à des noms
  ```lua
  local function onPlayerJoin(joinedPlayerID)
  	local players = GetPlayers()
  	for playerID, playerName in pairs(players) do
  		if playerID == joinedPlayerID then
  			-- Do something
  		end
  	end
  end
  ```
#### RegisterEvent(eventName, functionName)
Enregistre cette fonction pour l'événement indiqué. Les deux doivent être des chaînes de caractères
  ```lua
    function anyEvent()
  		-- Do something
 		end
  	RegisterEvent("onAnyEventHappen", "anyEvent")
  	-- Do something
  	TriggerLocalEvent("onAnyEventHappen")
  ```
#### TriggerLocalEvent(eventName)
Appelle toutes les fonctions enregistrées dans le même dossier de plugin.
  ```lua
    function anyEvent()
  		-- Do something
 		end
  	RegisterEvent("onAnyEventHappen", "anyEvent")
  	-- Do something
  	TriggerLocalEvent("onAnyEventHappen")
  ```
#### TriggerGlobalEvent(eventName)
Appelle toutes les fonctions enregistrées avec ce nom d'événement.
  ```lua
  	-- File A
    function anyEvent()
  		-- Do something
 		end
  	RegisterEvent("onAnyEventHappen", "anyEvent")
  ```
  ```lua
 		-- File B
  	TriggerGlobalEvent("onAnyEventHappen")
  ```
#### TriggerClientEvent(playerServerID, eventName, data)
Appelle cet événement avec les données fournies sur le client indiqué (-1 pour une diffusion à tous)
  ```lua
    function onPlayerJoin(playerServerID)
       TriggerClientEvent(playerServerID, "anyEvent", "You just joined the server")
    end
  	RegisterEvent("onAnyEventHappen", "anyEvent")
  ```
#### Set(configID, newValue)
Définit un paramètre de configuration à la nouvelle valeur indiquée (voir le tableau ci-dessous)
  ```lua
    function onChatMessage(playerID, senderName, message)
      if playerID == adminPlayer then
        if message == --[[ anything ]] then
          Set(3, 10)
        end
      end
    end
  ```
#### Liste des paramètres de configuration disponibles pour la commande `Set()`
> Notez qu'ils ne sont pas enregistrés dans le fichier de configuration.

|ID de configuration|Nom|N'accepte que|
|---|---|---|
|`0`|Paramètre de débogage|true ou false|
|`1`|Paramètre de serveur privé|true ou false|
|`2`|Nombre maximal de voitures par joueur|nombre|
|`3`|Nombre maximal de joueurs|nombre|
|`4`|Carte|chaîne de caractères|
|`5`|Nom|chaîne de caractères|
|`6`|Description|chaîne de caractères|
|tout autre ID provoquera un avertissement dans la console|

### Liste des événements disponibles pour le scripting
#### Événements par défaut
Exemple d'utilisation d'un événement :
```lua
	function onInit()
  	RegisterEvent("onPlayerJoin", "onPlayerJoin")
  end
  
  function onPlayerJoin(playerServerID)
  	-- Do something
  end
```
Si vous ne voulez pas d'invités sur votre serveur :
```lua
	function onInit()
		print("noGuests Ready")
		RegisterEvent("onPlayerAuth","onPlayerAuth")
	end

	function onPlayerAuth(name, role, isGuest)
		if isGuest then
			return "You must be signed in to join this server!"
		end
	end
```
|Événement|Paramètres|Description|
|---|---|---|
|`onPlayerAuth`|Le nom du joueur, son rôle sur le forum, compte invité (booléen)|Un joueur s'est authentifié et demande à rejoindre le serveur|
|`onPlayerConnecting`|L'ID du joueur|Un joueur est en cours de chargement (avant le chargement de la carte)|
|`onPlayerJoining`|L'ID du joueur|Un joueur charge la carte et va bientôt rejoindre le serveur|
|`onPlayerJoin`|L'ID du joueur|Un joueur a rejoint le serveur et a fini de charger|
|`onPlayerDisconnect`|L'ID du joueur|Un joueur s'est déconnecté|
|`onChatMessage`|L'ID de l'expéditeur, son nom et le message du chat|Un message a été envoyé dans le chat. Pratique pour créer un système de commandes|
|`onVehicleSpawn`|L'ID du joueur, l'ID du véhicule et les données du véhicule|Appelé lorsqu'un joueur fait apparaître un véhicule|
|`onVehicleEdited`|L'ID du joueur, l'ID du véhicule et les données du véhicule|Appelé lorsqu'un joueur modifie un véhicule ou remplace celui qu'il possède déjà|
|`onVehicleDeleted`|L'ID du joueur et l'ID du véhicule|Appelé lorsqu'un joueur supprime un véhicule qui lui appartient|

#### Événements personnalisés
Vous pouvez aussi créer des événements personnalisés pour votre propre usage. La procédure est très similaire à celle des événements par défaut.

Exemple d'utilisation d'un événement personnalisé :
```lua
	function onInit()
  	RegisterEvent("myCustomEvent", "myCustomEvent")
  end
  
  function myCustomEvent(playerServerID, customData)
  	-- Do something
  end
```
Il peut ensuite être appelé côté client ou côté serveur, à l'aide des fonctions correspondantes.

### Joueurs

Lorsqu'un joueur se connecte à votre serveur, un serverID lui est attribué, en commençant à 0 et en continuant vers le haut. Les serverID sont réutilisés : si un joueur part puis revient, il ne recevra pas un nouveau serverID, mais simplement un autre serverID disponible. Au redémarrage du serveur, les serverID sont réinitialisés.

#### Identifiants statiques

Les joueurs de BeamMP possèdent 3 identifiants statiques, que l'on peut obtenir à partir de leur serverID : leur nom, leur discordID et leur identifiant matériel ou HWID (bien que ce dernier ne soit pas implémenté, nous ferons comme s'il l'était). Chacun de ces trois types d'ID a ses propres origines, ainsi que ses forces et faiblesses pour l'identification des joueurs.

| TYPE D'ID | AVANTAGES                       | INCONVÉNIENTS  |  FONCTION POUR L'OBTENIR  |
|-----------|---------------------------------|----------------|:--------------------:|
| name      | facile à obtenir, direct        | pas sécurisé   | GetPlayerName()      |
| discordID | assez sécurisé                  | peu pratique   | GetPlayerDiscordID() |
| HWID      | extrêmement sécurisé            | difficile à obtenir | GetPlayerHWID()      |

### Véhicules

Les véhicules dans BeamMP ont 3 attributs dont le serveur tient compte : le serverID du propriétaire, le vehicleID du véhicule et ses données. Le serverID du propriétaire est simple : c'est son serverID. Chaque véhicule possède aussi un ID, mais les vehicleID ne sont pas uniques à un véhicule : deux véhicules peuvent avoir le même ID s'ils appartiennent à des propriétaires différents. Contrairement aux serverID, les vehicleID sont réutilisés. Par exemple, si j'ai 4 véhicules, leurs IDs sont 0, 1, 2 et 3 ; si je supprime le véhicule dont le vehicleID est 2, il me restera 0, 1 et 3, et lorsque je ferai apparaître un nouveau véhicule, il prendra l'ID 2. Enfin, le dernier attribut des véhicules est data : comme son nom l'indique, il contient les données du véhicule (nom, pièces, etc.). Ces données sont stockées sous forme de chaîne JSON brute ; vous aurez donc besoin d'une bibliothèque JSON, ou alors vous pouvez parcourir manuellement la chaîne pour en extraire les informations dont vous avez besoin.
