::: warning Diese Seite befindet sich im Aufbau!
An dieser Seite wird aktiv gearbeitet.

Du möchtest helfen? Dann klicke bitte rechts auf das Symbol mit dem Blatt und dem Stift!

Das ist auf jeder Seite möglich.
:::

# Server-Scripting-Referenz
## Server-Version 2.X
::: warning
Die BeamMP-Server-Version 2.X wird nicht mehr unterstützt. Diese Dokumentation dient nur noch als Referenz.
Bitte aktualisiere auf die neueste Version, um Wartung und Support zu erhalten.
:::
---

> Dies ist das Scripting für 2.x. Verwende es nur, wenn dein Server alt bzw. veraltet ist (Version 2.x.x). Die aktuelle Dokumentation findest du [hier](https://docs.beammp.com/scripting/server/latest-server-reference).
{.is-warning}

### Hinweise

Um die Ausgabe einer Funktion in der Serverkonsole zu sehen, musst du sie in eine `print()`-Anweisung einschließen.
Zum Beispiel:
`print(GetPlayerName(0))` gibt den Namen des ersten Spielers deines Servers zurück.

`<PlayersServerID>` beginnt bei 0.

### Liste der verfügbaren Funktionen für das Scripting

#### GetPlayerName(playersServerID)
Gibt den Discord-Namen des Spielers als String zurück
  ```lua
  function onPlayerJoin(playerID)
  	local name = GetPlayerName(playerID)
  	-- Do something
  end
  ```
#### GetPlayerDiscordID(playersServerID)
Gibt den Discord-Namen des Spielers als String zurück
  ```lua
  function onPlayerJoin(playerID)
  	local name = GetPlayerDiscordID(playerID)
  	-- Do something
  end
  ```
#### GetPlayerHWID(playersServerID)
Gibt die Discord-ID des Spielers als String zurück
  ```lua
  function onPlayerJoin(playerID)
  	local name = GetPlayerHWID(playerID)
  	-- Do something
  end
  ```
#### GetPlayerVehicles(playersServerID)
Gibt die Fahrzeuge des Spielers als Objekt/Array zurück
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
Trennt die Verbindung eines bestimmten Spielers. Im Grunde ein Kick
  ```lua
  function onVehicleSpawn(playerID, vehicleID, vehicleData)
  	-- Do something	
  	DropPlayer(playerID)
  end
  ```
#### SendChatMessage(playersServerID, message)
Sendet eine Nachricht über das Netzwerk an den angegebenen Benutzer. Verwende -1 für alle
  ```lua
  function onPlayerJoin(playerID)
  	SendChatMessage(-1, "Someone just joined!")
  end
  ```
#### CancelEvent() -- VERALTET
  Verhindert, dass das Event stattfindet. Dies wird möglicherweise bald entfernt. Verwende stattdessen `return 1`, um das Event abzubrechen.
  
#### onInit()
Wenn sie in einer Lua-Datei deklariert ist, wird sie einmal aufgerufen, sobald C++ das Laden der aktuellen Lua-Datei erfolgreich abgeschlossen hat
  ```lua
  function onInit()
  	print("Server ready")
  end
  ```
#### exit()
Beendet den Server
  ```lua
  function onInit()
  	print("Server Ready. But who needs a server which is running")
  	exit() -- Stops the server
  end
  ```
#### CreateThread(functionName, callInterval)
Führt die Funktion in einem eigenen Thread aus, und zwar callInterval-mal pro Sekunde. 
1 = Sie wird jede Sekunde ausgeführt.
  ```lua
  function yourFunction()
   	for i = 1,10 do
  		SendChatMessage(-1, "Countdown: "..i)
  		Sleep(1000)
  	end
  end
  CreateThread("yourFunction", 30)
  ```
VERALTETES BEISPIEL
Führt die Funktion in einem eigenen Thread aus
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
Beendet den Aufruf der Thread-Funktion des aktuellen Skripts
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
#### Sleep(millisecs) - VERALTET
Pausiert die Ausführung für die angegebene Zeitspanne (Achtung: Wenn du keinen Thread erstellt hast, wird dadurch der gesamte Server pausiert)
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
Gibt zurück, wie viele Spieler verbunden sind
  ```lua
  function onPlayerJoin(playerID)
  	SendChatMessage(playerID, "You are the "..GetPlayerCount().."th player!"
  end
  ```
#### RemoveVehicle(playerServerID, VehicleID)
Entfernt ein Fahrzeug aus der Welt
  ```lua
  function onVehicleSpawn(playerID, vehicleID, vehicleData)
  	if --[[ Vehicle data equal something it shouldn't be ]] then
  		RemoveVehicle(playerID, vehicleIID)
  	end
  end
  ```
#### GetPlayers()
Gibt eine Tabelle mit IDs und Namen zurück
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
Registriert diese Funktion für das angegebene Event. Beides müssen Strings sein
  ```lua
    function anyEvent()
  		-- Do something
 		end
  	RegisterEvent("onAnyEventHappen", "anyEvent")
  	-- Do something
  	TriggerLocalEvent("onAnyEventHappen")
  ```
#### TriggerLocalEvent(eventName)
Ruft jede registrierte Funktion im selben Plugin-Ordner auf.
  ```lua
    function anyEvent()
  		-- Do something
 		end
  	RegisterEvent("onAnyEventHappen", "anyEvent")
  	-- Do something
  	TriggerLocalEvent("onAnyEventHappen")
  ```
#### TriggerGlobalEvent(eventName)
Ruft jede mit diesem Eventnamen registrierte Funktion auf.
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
Ruft dieses Event mit den angegebenen Daten auf dem angegebenen Client auf (-1 für Broadcast)
  ```lua
    function onPlayerJoin(playerServerID)
       TriggerClientEvent(playerServerID, "anyEvent", "You just joined the server")
    end
  	RegisterEvent("onAnyEventHappen", "anyEvent")
  ```
#### Set(configID, newValue)
Setzt eine Konfigurationseinstellung auf den neuen angegebenen Wert (Tabelle siehe unten)
  ```lua
    function onChatMessage(playerID, senderName, message)
      if playerID == adminPlayer then
        if message == --[[ anything ]] then
          Set(3, 10)
        end
      end
    end
  ```
#### Liste der verfügbaren Konfigurationseinstellungen für den Befehl `Set()`
> Beachte, dass diese nicht in der Konfigurationsdatei gespeichert werden.

|Config-ID|Name|Akzeptiert nur|
|---|---|---|
|`0`|Debug-Einstellung|true oder false|
|`1`|Private-Einstellung|true oder false|
|`2`|Max. Fahrzeuge pro Spieler|Zahl|
|`3`|Max. Spieler|Zahl|
|`4`|Karte|String|
|`5`|Name|String|
|`6`|Beschreibung|String|
|jede andere ID führt zu einer Warnung in der Konsole|

### Liste der verfügbaren Events für das Scripting
#### Standard-Events
Beispiel für die Verwendung eines Events:
```lua
	function onInit()
  	RegisterEvent("onPlayerJoin", "onPlayerJoin")
  end
  
  function onPlayerJoin(playerServerID)
  	-- Do something
  end
```
Wenn du keine Gäste auf deinem Server haben möchtest:
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
|Event|Parameter|Beschreibung|
|---|---|---|
|`onPlayerAuth`|Name des Spielers, Forenrolle, Gastkonto (bool)|Ein Spieler wurde authentifiziert und möchte beitreten|
|`onPlayerConnecting`|ID des Spielers|Ein Spieler lädt (vor dem Laden der Karte)|
|`onPlayerJoining`|ID des Spielers|Ein Spieler lädt die Karte und wird in Kürze beitreten|
|`onPlayerJoin`|ID des Spielers|Ein Spieler ist beigetreten und hat fertig geladen|
|`onPlayerDisconnect`|ID des Spielers|Ein Spieler hat die Verbindung getrennt|
|`onChatMessage`|ID und Name des Absenders sowie die Chatnachricht|Eine Chatnachricht wurde gesendet. Gut geeignet für ein Befehlssystem|
|`onVehicleSpawn`|ID des Spielers, Fahrzeug-ID und Fahrzeugdaten|Wird aufgerufen, wenn jemand ein Fahrzeug spawnt|
|`onVehicleEdited`|ID des Spielers, Fahrzeug-ID und Fahrzeugdaten|Wird aufgerufen, wenn jemand ein Fahrzeug bearbeitet oder sein bestehendes ersetzt|
|`onVehicleDeleted`|ID des Spielers und Fahrzeug-ID|Wird aufgerufen, wenn jemand ein Fahrzeug löscht, das ihm gehört|

#### Benutzerdefinierte Events
Du kannst auch eigene Events für deine Zwecke erstellen. Das funktioniert fast genauso wie bei den Standard-Events.

Beispiel für die Verwendung eines benutzerdefinierten Events:
```lua
	function onInit()
  	RegisterEvent("myCustomEvent", "myCustomEvent")
  end
  
  function myCustomEvent(playerServerID, customData)
  	-- Do something
  end
```
Dieses Event kann dann entweder clientseitig oder serverseitig mit den jeweiligen Funktionen aufgerufen werden.

### Spieler

Wenn sich ein Spieler mit deinem Server verbindet, wird ihm eine serverID zugewiesen, die bei 0 beginnt und aufwärts zählt. serverIDs werden wiederverwendet: Verlässt ein Spieler den Server und tritt erneut bei, erhält er keine neue, fortlaufende serverID, sondern einfach eine andere freie. Wenn der Server neu gestartet wird, werden die serverIDs zurückgesetzt.

#### Statische Kennungen

Spieler in BeamMP haben 3 statische Kennungen, die über ihre serverID abgerufen werden können: ihren Namen, ihre discordID und ihre Hardware-ID bzw. HWID. (Letztere ist zwar nicht implementiert, wir tun aber so, als wäre sie es.) Jede der drei Kennungsarten hat ihre eigene Herkunft sowie eigene Stärken und Schwächen, wenn man sie zur Identifizierung von Spielern verwendet.

| ID-TYP    | VORTEILE                        | NACHTEILE      |  FUNKTION ZUM ABRUFEN |
|-----------|---------------------------------|----------------|:--------------------:|
| name      | einfach zu erhalten, unkompliziert | nicht sicher | GetPlayerName()      |
| discordID | ziemlich sicher                 | umständlich    | GetPlayerDiscordID() |
| HWID      | extrem sicher                   | schwer zu erhalten | GetPlayerHWID()  |

### Fahrzeuge

Fahrzeuge in BeamMP haben 3 Attribute, auf die der Server achtet: die serverID des Besitzers, die vehicleID des Fahrzeugs und seine Daten. Die serverID des Besitzers ist selbsterklärend. Jedes Fahrzeug hat außerdem eine ID, doch vehicleIDs sind nicht eindeutig für das Fahrzeug: Zwei Fahrzeuge können dieselbe ID haben, sofern sie unterschiedlichen Besitzern gehören. Anders als serverIDs werden vehicleIDs wiederverwendet. Hat jemand zum Beispiel 4 Fahrzeuge mit den IDs 0, 1, 2 und 3 und löscht das Fahrzeug mit der vehicleID 2, bleiben 0, 1 und 3 übrig; wenn danach ein neues Fahrzeug gespawnt wird, belegt es die ID 2. Das letzte Attribut von Fahrzeugen sind schließlich die Daten (data). Sie enthalten, wie der Name schon sagt, das Fahrzeug, den Namen, die Teile und weitere Daten. Die Daten werden als roher JSON-String gespeichert, du brauchst also eine JSON-Bibliothek; alternativ kannst du den String manuell durchgehen und die benötigten Informationen herausholen.
