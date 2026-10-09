---
description: "Referenz für das Plugin-System des BeamMP-Servers, Version 3: wie Plugins geladen werden, welche Events und Funktionen der Server bereitstellt und wie du vom alten Lua migrierst."
---
# Server-Scripting-Referenz (Version 3.X)

## Einführung {#introduction}

BeamMP-Server v3.0.0 ändert die Funktionsweise des Lua-Plugin-Systems grundlegend. Altes Lua lässt sich nicht mit einem neuen Server verwenden, du musst also migrieren.

Das Plugin-System des Servers verwendet [Lua 5.3](https://www.lua.org/manual/5.3/). Dieser Abschnitt beschreibt, wie du mit dem Schreiben von Plugins beginnst, vermittelt einige grundlegende Konzepte und führt dich durch dein erstes Plugin. **Du solltest diesen Abschnitt auch dann lesen, wenn du das System vor v3.0.0 kennst, da sich einiges grundlegend geändert hat**.

Eine Migrationsanleitung für Lua vor v3.0.0 findest du im Abschnitt ["Migration vom alten Lua"](#migrating-from-old-lua).


## Verzeichnisstruktur

Server-Plugins befinden sich im Gegensatz zu Mods (standardmäßig) in `Resources/Server`, während Mods, die für BeamNG.drive geschrieben sind und an die Clients gesendet werden, in `Resources/Client` liegen. Jedes Plugin muss einen eigenen Unterordner in `Resources/Server` haben. Für ein Plugin namens „MyPlugin“ sähe die Struktur zum Beispiel so aus:
```
Resources
└── Server
    ├── MyPlugin
    │   └── main.lua
    └── SomeOtherPlugin
        └── ...
```
Hier zeigen wir außerdem ein weiteres Plugin namens „SomeOtherPlugin“, um zu veranschaulichen, dass dein Ordner `Resources/Server` mehrere verschiedene Plugin-Ordner enthalten kann. Diese Verzeichnisstruktur verwenden wir in dieser Anleitung durchgehend als Beispiel.

Dir fällt auch die `main.lua` auf. Du kannst beliebig viele Lua-Dateien (`.lua`) haben. Alle Lua-Dateien im Hauptverzeichnis deines Plugins werden in *alphabetischer Reihenfolge* geladen (`aaa.lua` wird also vor `bbb.lua` ausgeführt).


## Lua-Dateien

Jede Lua-Datei (`.lua`) im Ordner des Plugins wird beim Start des Servers geladen. Das bedeutet, dass Anweisungen außerhalb von Funktionen sofort ausgewertet („ausgeführt“) werden.

Lua-Dateien in Unterordnern werden ignoriert, können aber mit `require()` eingebunden werden.

Unsere `main.lua` sieht zum Beispiel so aus:
```lua
function PrintMyName()
	print("I'm 'My Plugin'!")
end

print("What's up!")
```
Wenn der Server startet und die `main.lua` geladen wird, führt er `print("What's up!")` *sofort* aus, ruft die Funktion `PrintMyName` aber **NICHT** auf (denn sie wurde nicht aufgerufen)!

## Events {#events}

Ein Event ist zum Beispiel „ein Spieler tritt bei“, „ein Spieler hat eine Chatnachricht gesendet“ oder „ein Spieler hat ein Fahrzeug gespawnt“.

Du kannst Events abbrechen (sofern sie abbrechbar sind), indem du im Handler `1` zurückgibst.

In Lua möchtest du meist auf einige dieser Events reagieren. Dafür kannst du einen „Handler“ registrieren. Das ist eine Funktion, die aufgerufen wird, wenn ein Event eintritt, und der einige Argumente übergeben werden.

Beispiel:
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
Damit wird sichergestellt, dass jede Nachricht, die genau „darn“ lautet, nicht gesendet wird und nicht im Chat erscheint (beachte, dass du bei einem echten Schimpfwortfilter prüfen würdest, ob die Nachricht „darn“ *enthält*, nicht ob sie „darn“ *ist*). Das Abbrechen eines Events führt dazu, dass es nicht stattfindet, zum Beispiel dass eine Chatnachricht niemand anderem angezeigt wird oder dass ein Fahrzeug nicht gespawnt wird usw.

## Benutzerdefinierte Events {#custom-events}

Du kannst dich für jedes beliebige Event registrieren, zum Beispiel:
```lua
MP.RegisterEvent("MyCoolCustomEvent", "MyHandler")
```
Diese benutzerdefinierten Events kannst du dann auslösen:
```lua
-- call all event handlers to this in ALL plugins
MP.TriggerGlobalEvent("MyCoolCustomEvent")
-- call all event handlers to this in THIS plugin
MP.TriggerLocalEvent("MyCoolCustomEvent")
```
Mit Events kannst du noch viel mehr machen, diese Möglichkeiten werden weiter unten in der API-Referenz ausführlich behandelt.

## Event-Timer („Threads“)

Lua vor v3.0.0 kannte das Konzept von „Threads“, die X-mal pro Sekunde ausgeführt werden. Diese Bezeichnung war etwas irreführend, da sie synchron waren.

Lua ab v3.0.0 hat stattdessen „Event-Timer“. Das sind Timer, die im Server laufen und, sobald sie ablaufen, ein Event (global) auslösen. Auch das geschieht synchron. Beachte, dass das zweite Argument ein Intervall in Millisekunden ist.

Beispiel:
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
Dadurch wird „CountSeconds“ jede Sekunde aufgerufen. Du kannst Event-Timer auch mit `MP.CancelEventTimer` abbrechen (siehe API-Referenz).

In der Serverkonsole kannst du `status` ausführen, um zu sehen, wie viele Event-Timer aktuell laufen und welche Event-Handler warten. Dieser Befehl wird in Zukunft mehr Informationen anzeigen.

## Debugging

Lua lässt sich nur schwer debuggen. Einen professionellen Debugger wie `gdb` gibt es für eingebettetes Lua leider nicht.

Im Allgemeinen kannst du natürlich jederzeit die Werte, die du untersuchen möchtest, einfach mit `print()` ausgeben. 

Ab v3.0.0 bietet der Server die Möglichkeit, einen Interpreter in ein Plugin einzuschleusen und darin anschließend in Echtzeit Lua auszuführen. Das ist das, was einem Debugger am nächsten kommt.

Angenommen, du hast das obige Plugin namens `MyPlugin`, dann kannst du so in dessen Lua-State wechseln:
```
> lua MyPlugin
```
Die Groß- und Kleinschreibung ist hier wichtig, achte also auf die korrekte Eingabe. 
Die Ausgabe sieht etwa so aus:
```
lua @MyPlugin> 
```
Wie du siehst, haben wir in den Lua-State von `MyPlugin` gewechselt. Ab jetzt, bis wir `exit()` (ab v3.1.0 `:exit`) eingeben, befinden wir uns in `MyPlugin` und können dort Lua ausführen. 

Wenn wir zum Beispiel eine globale Variable namens `MyValue` haben, können wir ihren Wert so ausgeben:
```
lua @MyPlugin> print(MyValue)
```
Du kannst hier Funktionen aufrufen und alles tun, was du erwartest.

Ab v3.1.0: Du kannst mit TAB Funktionen und Variablen automatisch vervollständigen.

WARNUNG: Wenn der Lua-State gerade anderen Code ausführt (etwa eine `while`-Schleife), kann das leider die Konsole vollständig blockieren, bis diese Arbeit erledigt ist. Sei deshalb sehr vorsichtig beim Wechsel in States, die möglicherweise auf etwas warten.

Außerdem kannst du in der normalen Konsole (`> `) `status` ausführen, was dir unter anderem einige Statistiken zu Lua anzeigt.

## Benutzerdefinierte Befehle

Um eigene Befehle für die Serverkonsole zu implementieren, kann das Event `onConsoleInput` verwendet werden. 
Das ist nützlich, wenn du dem Serverbetreiber eine Möglichkeit geben möchtest, deinem Plugin etwas zu signalisieren, oder wenn du den internen Zustand auf eigene Weise anzeigen möchtest.

Hier ein Beispiel:
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
Damit kannst du in der Serverkonsole Folgendes tun:
```
> print hello, world
hello, world
```
Wir haben unser eigenes `print` implementiert. Versuche als Übung, eine Funktion wie `say` zu bauen, die eine Chatnachricht an alle Spieler oder sogar an einen bestimmten Spieler sendet (mit `MP.SendChatMessage`).

**Achtung:** Für deine eigenen Plugins wird generell empfohlen, einen „Namespace“ zu verwenden. Unser `print`-Beispiel könnte in einem Plugin namens `mystuff` `mystuff.print` oder `ms.print` oder ähnlich heißen.

## API-Referenz

Dokumentationsformat: `function_name(arg_name: arg_type, arg_name: arg_type) -> return_types`

## Integrierte Funktionen

### `print(...)`, `printRaw(...)`

Gibt die Nachricht in der Serverkonsole aus, mit dem Präfix `[DATE TIME] [LUA]`. Wenn du dieses Präfix nicht möchtest, kannst du `printRaw(...)` verwenden.

Beispiel:
```lua
local name = "John Doe"
print("Hello, I'm", name, "and I'm", 32)
```
Die Funktion akzeptiert beliebig viele Argumente beliebiger Typen. Sie gibt bereitwillig auch Tabellen aus!

Sie verhält sich wie das `print` des Lua-Interpreters und setzt daher Tabulatoren zwischen die Argumente.

### `exit()`

Fährt den Server ordnungsgemäß herunter. Löst das Event `onShutdown` aus.

## MP-Funktionen

### `MP.CreateTimer() -> Timer`

Erstellt ein Timer-Objekt, mit dem du messen kannst, wie lange etwas gedauert hat bzw. wie viel Zeit vergangen ist. Es startet sofort nach dem Erstellen und kann mit `mytimer:Start()` zurückgesetzt bzw. neu gestartet werden.

Die aktuell verstrichene Zeit in Sekunden erhältst du mit `mytimer:GetCurrent()`.

Beispiel:
```lua
local mytimer = MP.CreateTimer()
-- do stuff here that needs to be timed
print(mytimer:GetCurrent()) -- print how much time elapsed
```
Timer müssen nicht gestoppt werden (und lassen sich auch nicht stoppen), sie verursachen keinen Overhead.

### `MP.GetOSName() -> string`

Gibt den Namen des aktuellen Betriebssystems zurück, entweder `Windows`, `Linux` oder `Other`.

### `MP.GetServerVersion() -> number,number,number`

Gibt die aktuelle Serverversion im Format Major, Minor, Patch zurück. Für Version v3.0.0 würde zum Beispiel `3, 0, 0` zurückgegeben.

Beispiel:
```lua
local major, minor, patch = MP.GetServerVersion()
print(major, minor, patch)
```
Ausgabe:
```
2	4	0
```
### `MP.RegisterEvent(event_name: string, function_name: string)`

Merkt sich die Funktion mit dem Namen `Function Name` als Event-Handler für das Event mit dem Namen `Event Name`.

Du kannst einem Event beliebig viele Handler zuweisen.

Eine Liste der vom Server bereitgestellten Events findest du [hier](#events-1).

Wenn das Event mit diesem Namen nicht existiert, wird es erstellt, weshalb RegisterEvent nicht fehlschlagen kann. Auf diese Weise lassen sich benutzerdefinierte Events erstellen. Mehr dazu unter [Benutzerdefinierte Events](#custom-events) und [Events](#events).

Beispiel:
```lua
function ChatHandler(player_id, player_name, msg)
    if msg == "hello" then
        print("Hello World!")
        return 0
    end
end

MP.RegisterEvent("onChatMessage", "ChatHandler")
```
### `MP.CreateEventTimer(event_name: string, interval_ms: number, [strategy: number (since v3.0.2)])`

Startet im Server einen Timer, der das Event `event_name` alle `interval_ms` Millisekunden auslöst.

Event-Timer können mit `MP.CancelEventTimer` abgebrochen werden.

Intervalle von <25 ms werden nicht empfohlen, da mehrere solcher Intervalle wahrscheinlich nicht zuverlässig rechtzeitig bedient werden können. Du kannst zwar mehrere Timer für dasselbe Event starten, es wird aber empfohlen, so wenige Event-Timer wie möglich zu erstellen. Wenn du zum Beispiel ein Event brauchst, das jede halbe Sekunde ausgeführt wird, und eines, das jede Sekunde ausgeführt wird, erstelle am besten nur das Halbsekunden-Event und führe die Funktion für die Sekunde bei jedem zweiten Auslösen aus.

Du kannst auch `MP.CreateTimer` verwenden, um einen Timer zu erstellen und die seit dem letzten Event-Aufruf vergangene Zeit zu messen und so die Anzahl der Event-Timer zu minimieren. Das wird jedoch nicht unbedingt empfohlen, da es die Komplexität des Codes erheblich erhöht.

**Seit 3.0.2:**

Als drittes Argument kann optional eine `CallStrategy` übergeben werden. Diese kann Folgendes sein:

- `MP.CallStrategy.BestEffort` (Standard): Versucht, dein Event im angegebenen Intervall auszulösen, weigert sich aber, Handler in die Warteschlange zu stellen, wenn ein Handler zu lange braucht.
- `MP.CallStrategy.Precise`: Stellt Event-Handler genau im angegebenen Intervall in die Warteschlange. Kann dazu führen, dass die Warteschlange voll läuft, wenn der Handler länger als das Intervall braucht. Verwende dies nur, wenn du das exakte Intervall WIRKLICH brauchst.

### `MP.CancelEventTimer(event_name: string)`

Bricht alle Timer des Events mit dem Namen `event_name` ab. In manchen Fällen kann der Timer aufgrund der Natur der asynchronen Programmierung vor dem Abbruch noch ein weiteres Mal auslösen.

### `MP.TriggerLocalEvent(event_name: string, ...) -> table`

Pluginlokaler, synchroner Event-Auslöser.

Löst ein Event lokal aus, wodurch alle Handler dieses Events *im aktuellen Lua-State* (normalerweise das aktuelle Plugin, sofern der State nicht über PluginConfig.toml geteilt wurde) aufgerufen werden.

Du kannst dieser Funktion Argumente (`...`) übergeben, die kopiert und als Funktionsargumente an alle Handler gesendet werden.

Dieser Aufruf ist synchron und kehrt zurück, sobald alle Event-Handler fertig sind.

Der zurückgegebene Wert ist eine Tabelle mit allen Ergebnissen. Hat ein Handler einen Wert zurückgegeben, steht dieser ohne Anmerkung und ohne Namen in dieser Tabelle. So lassen sich Dinge „einsammeln“ oder Unter-Handler für abbrechbare Events registrieren. Praktisch ist das ein Array.

Beispiel:
```lua
local Results = MP.TriggerLocalEvent("MyEvent")
print(Results)
```
### `MP.TriggerGlobalEvent(event_name: string, ...) -> table`

Globaler, asynchroner Event-Auslöser.

Löst ein Event global aus, wodurch alle Handler dieses Events *in allen Plugins* (einschließlich *dieses* Plugins) aufgerufen werden.

Du kannst dieser Funktion Argumente (`...`) übergeben, die kopiert und als Funktionsargumente an alle Handler gesendet werden.

Dieser Aufruf ist asynchron und gibt ein Future-ähnliches Objekt zurück. Lokale Handler (Handler im selben Plugin wie der Aufrufer) laufen synchron und sofort. 

Die zurückgegebene Tabelle hat zwei Funktionen:

- `IsDone() -> boolean` gibt an, ob alle Handler fertig sind. Du kannst warten, bis dies true ist, indem du es in einer Schleife abfragst und dazwischen kurz mit `MP.Sleep` wartest.
- `GetResults() -> table` gibt eine Tabelle ohne Anmerkungen und Namen mit allen Rückgabewerten aller Handler zurück. Praktisch ist das ein Array.

Rufe diese unbedingt mit der Syntax `Obj:Function()` auf (`:`, NICHT `.`).

Beispiel:
```lua
local Future = MP.TriggerGlobalEvent("MyEvent")
-- wait until handlers finished
while not Future:IsDone() do
	MP.Sleep(100) -- sleep 100 ms
end
local Results = Future:GetResults()
print(Results)
```
Beachte, dass ein Handler, der sich hier für „MyEvent“ registriert und nie zurückkehrt, dein Plugin blockieren könnte. Du solltest wahrscheinlich im Blick behalten, wie lange du schon wartest, und nach ein paar Sekunden aufhören zu warten.

### `MP.Sleep(time_ms: number)`

Wartet die angegebene Zeit in Millisekunden.

Dies gibt die Ausführung des Lua-States nicht frei, und solange gewartet wird, wird im State nichts ausgeführt. 

WARNUNG: Warte NICHT länger als 500 ms, wenn du Event-Handler registriert hast, es sei denn, du weißt *genau*, was du tust. Die Funktion ist dafür gedacht, 1-100 ms zu warten, um auf Ergebnisse oder Ähnliches zu warten. Ein blockierter (wartender) Lua-State kann den gesamten Server drastisch verlangsamen, wenn man nicht vorsichtig ist.

### `MP.SendChatMessage(player_id: number, message: string)`

Sendet eine Chatnachricht, die nur der angegebene Spieler sehen kann (oder alle, wenn die ID `-1` ist).
Im Spiel erscheint sie nicht als direkt adressierte Nachricht.

Du kannst dies zum Beispiel nutzen, um einem Spieler mitzuteilen, *warum* du sein Fahrzeug-Spawning, seine Chatnachricht oder Ähnliches abgebrochen hast, oder um einige Informationen über deinen Server anzuzeigen.

Beispiel:
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
Beispiel 2:
```lua
function ChatHandler(player_id, player_name, msg)
    if msg == "hello" then
        MP.SendChatMessage(-1, "Hello World!") -- If the player sends the exact message "hello", announce to the entire server "Hello World!"
        return 0
    end
end
```
### `MP.TriggerClientEvent(player_id: number, event_name: string, data: string) -> boolean`
*bis v3.1.0*

### `MP.TriggerClientEvent(player_id: number, event_name: string, data: string) -> boolean,string`
*seit v3.1.0*

### `MP.TriggerClientEventJson(player_id: number, event_name: string, data: table) -> boolean,string`
*seit v3.1.0*

Ruft das angegebene Event mit den angegebenen Daten auf dem angegebenen Client auf (-1 für Broadcast). Dieses Event kann dann in einem clientseitigen Lua-Mod verarbeitet werden, siehe dazu die Dokumentation zum „Client-Scripting“.

Gibt `true` zurück, wenn die Nachricht gesendet werden konnte (bei `id = -1`, also Broadcasts, ist es immer `true`), und `false`, wenn der Spieler mit dieser ID nicht existiert oder die Verbindung getrennt hat, aber noch eine ID besitzt (dies ist ein bekanntes Problem).

Wenn `false` zurückgegeben wird, ist es sinnlos, dieses Event erneut zu senden, und eine Antwort (falls eine erwartet wurde) sollte nicht erwartet werden.

Seit v3.1.0 enthält der zweite Rückgabewert eine Fehlermeldung, falls die Funktion fehlgeschlagen ist. Ebenfalls seit dieser Version nimmt die `*Json`-Variante der Funktion als Datenargument eine Tabelle entgegen und wandelt sie in JSON um. Dies ist lediglich eine Kurzform für `MP.TriggerClientEvent(..., Util.JsonEncode(mytable))`.

### `MP.GetPlayerCount() -> number`

Gibt die Anzahl der Spieler zurück, die sich aktuell auf dem Server befinden.

### `MP.GetPositionRaw(pid: number, vid: number) -> table,string`

Gibt die aktuelle Position des Fahrzeugs `vid` (Fahrzeug-ID) des Spielers `pid` (Spieler-ID) zurück sowie einen Fehlerstring, falls ein Fehler aufgetreten ist.

Die Tabelle wird aus einem Positionspaket dekodiert und enthält daher verschiedene Daten, darunter Position und Rotation (deshalb trägt die Funktion den Zusatz „Raw“).

Beispiel:
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
Ausgabe:
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
Beispiel 2:
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
Ausgabe:
```
X: -603.459
Y: -175.078
Z: 26.9505
```
### `MP.IsPlayerConnected(player_id: number) -> boolean`

Gibt an, ob der Spieler verbunden ist und der Server ein UDP-Paket von ihm erhalten hat.

Beispiel:
```lua
local player_id = 8
print(MP.IsPlayerConnected(player_id)) -- Check if player with ID 8 is properly connected.
```
Ausgabe:
```lua
true
```
### `MP.GetPlayerName(player_id: number) -> string`

Gibt den Anzeigenamen des Spielers zurück.

Beispiel:
```lua
local player_id = 4
print(MP.GetPlayerName(player_id)) -- Get the name of the player with ID 4
```
Ausgabe:
```
ilovebeammp2004
```
### `MP.RemoveVehicle(player_id: number, vehicle_id: number)`

Entfernt das angegebene Fahrzeug des angegebenen Spielers.

Beispiel:
```lua
local player_id = 3
local player_vehicles = MP.GetPlayerVehicles(player_id)

-- Loop over all of player 3's vehicles and delete them
for vehicle_id, vehicle_data in pairs(player_vehicles) do
      MP.RemoveVehicle(player_id, vehicle_id)
end
```
### `MP.GetPlayerVehicles(player_id: number) -> table`

Gibt eine Tabelle mit allen Fahrzeugen zurück, die der Spieler aktuell hat. Jeder Eintrag der Tabelle ordnet eine Fahrzeug-ID den Fahrzeugdaten zu (aktuell ein roher JSON-String).

Beispiel:
```lua
local player_id = 3
local player_vehicles = MP.GetPlayerVehicles(player_id)

for vehicle_id, vehicle_data in pairs(player_vehicles) do
    local start = string.find(vehicle_data, "{")
    local formattedVehicleData = string.sub(vehicle_data, start, -1)
    print(Util.JsonDecode(formattedVehicleData))
end
```
Ausgabe:
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
### `MP.GetPlayers() -> table`

Gibt eine Tabelle aller verbundenen Spieler zurück. Diese Tabelle ordnet IDs Namen zu, etwa so:  
```json
{
	0: "LionKor",
	1: "JohnDoe"
}
```
### `MP.IsPlayerGuest(player_id: number) -> boolean`

Gibt an, ob der Spieler ein Gast ist. Ein Gast ist jemand, der sich nicht angemeldet hat und stattdessen als Gast spielen wollte. Sein Name lautet normalerweise `guest` gefolgt von einer langen Zahl.

Da Gäste anonym sind, möchtest du ihnen den Beitritt vielleicht verbieten. In diesem Fall wird empfohlen, stattdessen das Argument `is_guest` von [`onPlayerAuth`](#onplayerauth) zu verwenden.

### `MP.DropPlayer(player_id: number, [reason: string])`

Kickt den Spieler mit der angegebenen ID. Der Parameter reason ist optional.
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
### `MP.GetStateMemoryUsage() -> number`

Gibt den Speicherverbrauch des aktuellen Lua-States in Bytes zurück.

### `MP.GetLuaMemoryUsage() -> number` 

Gibt den Speicherverbrauch aller Lua-States zusammen in Bytes zurück.

### `MP.GetPlayerIdentifiers(player_id: number) -> table`

Gibt eine Tabelle mit Informationen über den Spieler zurück, etwa die BeamMP-Forum-ID, die IP-Adresse und die Discord-Konto-ID. Die Discord-ID wird nur zurückgegeben, wenn der Benutzer sie mit seinem Forenkonto verknüpft hat.

Die Forum-ID eines Benutzers findest du, indem du `https://forum.beammp.com/u/USERNAME.json` aufrufst und nach `"user": {"id": 123456}` suchst. Eine BeamMP-ID ist für jeden Spieler einzigartig und lässt sich im Gegensatz zum Benutzernamen nicht ändern.

Beispiel:
```lua
local player_id = 5
print(MP.GetPlayerIdentifiers(player_id))
```
Ausgabe:
```json
{
    ip: "127.0.0.1",
    discord: "12345678987654321",
    beammp: "1234567",
}
```
*Bis v3.1.0 ist das Feld `ip` fehlerhaft und funktioniert nicht wie vorgesehen. Behoben in v3.1.0.*

### `MP.Set(setting: number, ...)`

Setzt eine ServerConfig-Einstellung vorübergehend. Dafür ist die Tabelle `MP.Settings` nützlich.

Beispiel:
```lua
MP.Set(MP.Settings.Debug, true) -- Turns on debug mode
```
### `MP.Settings -> table`

Tabelle, die Einstellungs-IDs den Namen zuordnet. Wird zusammen mit `MP.Set` verwendet, um ServerConfig-Einstellungen zu ändern. 

Beispiel:
```lua
print(MP.Settings)
```
Ausgabe:
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
## Util-Funktionen

### `Util.Json*`

Seit BeamMP-Server `v3.1.0`.

Dies ist eine integrierte JSON-Bibliothek, die normalerweise deutlich schneller ist als jede Lua-JSON-Bibliothek. Im Hintergrund wird die C++-Bibliothek `nlohmann::json` verwendet, die JSON-konform ist, durch Unit-Tests vollständig abgedeckt ist und laufend per Fuzzing getestet wird.

### `Util.JsonEncode(table: table) -> string`

Kodiert eine Lua-Tabelle rekursiv in einen JSON-String (Tabellen in Tabellen in Tabellen ... funktionieren wie erwartet). Alle primitiven Typen werden berücksichtigt, Funktionen, Userdata und Ähnliches werden ignoriert.

Das resultierende JSON ist minifiziert und kann mit `Util.JsonPrettify` formatiert (pretty-printed) werden.

Beispiel: 
```lua
local player = {
	name = "Lion",
	age = 69,
	skills = { "skill A", "skill B" }
}
local json = Util.JsonEncode(player)
```
Ergebnis: 
```json
{"name":"Lion","age":69,"skills":["skill A","skill B"]}
```
### `Util.JsonDecode(json: string) -> table`

Dekodiert JSON in eine Lua-Tabelle. Gibt `nil` zurück und gibt einen Fehler aus, falls dies fehlgeschlagen ist.

Beispiel:
```lua
local json = "{\"message\":\"OK\",\"code\":200}"
local tbl = Util.JsonDecode(json)
```
Ergebnis:
```lua
{
	message = "OK",
	code = 200,
}
```
### `Util.JsonPrettify(json: string) -> string`

Fügt dem JSON Einrückungen und Zeilenumbrüche hinzu, damit es für Menschen besser lesbar ist.

Beispiel:
```
local myjson = Util.JsonEncode({ name="Lion", age = 69, skills = { "skill A", "skill B" } })

print(Util.JsonPrettify(myjson))
```
Ergebnis:
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
### `Util.JsonMinify(json: string) -> string`

Entfernt Einrückungen, Zeilenumbrüche und sonstige Leerzeichen. Nur nötig, wenn du `Util.JsonPrettify` aufgerufen hast, da jede Ausgabe von `Util.Json*` bereits minifiziert ist.

Beispiel:
```lua
local pretty = Util.JsonPrettify(Util.JsonEncode({ name="Lion", age = 69, skills = { "skill A", "skill B" } }))

print(Util.JsonMinify(pretty))
```
Ergebnis:
```json
{"age":69.0,"name":"Lion","skills":["skill A","skill B"]}
```
### `Util.JsonFlatten(json: string) -> string`

Erstellt ein JSON-Objekt, dessen Schlüssel gemäß RFC 6901 zu JSON-Pointern abgeflacht werden. Das Original lässt sich mit `Util.JsonUnflatten()` wiederherstellen. Damit das funktioniert, müssen alle Werte primitiv sein.

Beispiel:
```lua
local json = Util.JsonEncode({ name="Lion", age = 69, skills = { "skill A", "skill B" } })
print("normal: " ..json)
print("flattened: " .. Util.JsonFlatten(json))
print("flattened pretty: " .. Util.JsonPrettify(Util.JsonFlatten(json)))

```
Ergebnis: 
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
### `Util.JsonUnflatten(json: string) -> string`

Stellt die beliebige Verschachtelung eines JSON-Werts wieder her, der zuvor mit der Funktion `Util.JsonFlatten()` abgeflacht wurde. 

### `Util.JsonDiff(a: string, b: string) -> string`

Erstellt einen JSON-Diff gemäß RFC 6902 (http://jsonpatch.com/). Dieser Diff kann anschließend mit `Util.JsonDiffApply()` als Patch angewendet werden. Gibt den Diff zurück.

### `Util.JsonDiffApply(base: string, diff: string) -> string`

Wendet den JSON-`diff` als JSON-Patch (RFC 6902, http://jsonpatch.com/) auf `base` an. Gibt das Ergebnis zurück.

## `Util.Random*`

Seit BeamMP-Server `v3.1.0`.

### `Util.Random() -> float`

Gibt eine Gleitkommazahl zwischen 0 und 1 zurück.

Beispiel:
```lua
local rand = Util.Random()
print("rand: " .. rand)
```
Ergebnis: 
```lua
rand: 0.135477
```
### `Util.RandomIntRange(min: int, max: int) -> int`

Gibt eine Ganzzahl zwischen min und max zurück.

Beispiel:
```lua
local randInt = Util.RandomIntRange(1, 100)
print("randInt: " .. randInt)
```
Ergebnis: 
```lua
randInt:  69
```
### `Util.RandomRange(min: number, max: number) -> float`

Gibt eine Gleitkommazahl zwischen min und max zurück.

Beispiel:
```lua
local randFloat = Util.RandomRange(1, 1000)
print("randFloat: " .. randFloat)
```
Ergebnis: 
```lua
randFloat: 420.6969
```
### `Util.LogInfo(params: ...)` u. a. (seit v3.3.0)
```lua
Util.LogInfo("Hello, World!")
Util.LogWarn("Cool warning")
Util.LogError("Oh no!")
Util.LogDebug("hi")
```
erzeugt
```
[19/04/24 11:06:50.142] [Test] [INFO] Hello, World!    
[19/04/24 11:06:50.142] [Test] [WARN] Cool warning    
[19/04/24 11:06:50.142] [Test] [ERROR] Oh no!
[19/04/24 11:06:50.142] [Test] [DEBUG] hi
```
Unterstützt genau dieselbe Ausgabe bzw. Darstellung von Daten wie `print()`.

### `Util.DebugExecutionTime() -> table`

Wenn Lua-Code im Server ausgeführt wird, wird die Ausführung jedes Event-Handlers gemessen. Minimum, Maximum, Durchschnitt (Mittelwert) und Standardabweichung dieser Ausführungszeiten werden berechnet und von dieser Funktion in einer Tabelle zurückgegeben. Die Berechnung erfolgt inkrementell, sodass bei jeder Ausführung eines Event-Handlers Minimum, Maximum, Durchschnitt und Standardabweichung aktualisiert werden. Dadurch benötigt `Util.DebugExecutionTime()` normalerweise keine nennenswerte Zeit zur Ausführung (unter 0,25 ms).

Sie gibt eine Tabelle wie diese zurück:
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
Pro Event-*Handler* werden folgende Daten zurückgegeben:

- `n`: Wie oft das Event ausgelöst und ein Handler aufgerufen wurde
- `mean`: Durchschnitt/Mittelwert aller Ausführungszeiten in ms
- `max`: Die längste Ausführungszeit in ms
- `min`: Die kürzeste Ausführungszeit in ms
- `stdev`: Die Standardabweichung aller durchschnittlichen Ausführungszeiten in ms

Hier ist eine Funktion, mit der du diese Daten formatiert ausgeben kannst:
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
Du kannst sie so aufrufen, um deinen Code zu debuggen, wenn er langsam ist:
```lua
-- event to print the debug times
MP.RegisterEvent("printStuff", "printDebugExecutionTime")
-- run every 5000 ms = 5 seconds (or 10, or 60, whatever makes sense for you
MP.CreateEventTimer("printStuff", 5000)
```
## FS-Funktionen

`FS`-Funktionen sind **F**ile**s**ystem-Funktionen (Dateisystem-Funktionen), die besser sein sollen als die Standardfähigkeiten von Lua.

Verwende als Trennzeichen in Pfaden bitte immer `/`, da dies plattformübergreifend funktioniert (Windows, Linux, macOS, ...).

### `FS.CreateDirectory(path: string) -> bool,string`


Erstellt das angegebene Verzeichnis sowie alle übergeordneten Verzeichnisse, falls sie nicht existieren. Das Verhalten entspricht in etwa dem gängigen Linux-Befehl `mkdir -p`.

Bei Erfolg werden `true` und `""` zurückgegeben. Schlägt das Erstellen des Verzeichnisses fehl, werden `false` und eine Fehlermeldung (`string`) zurückgegeben.

Beispiel:
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
### `FS.Remove(path: string) -> bool,string`

Entfernt die angegebene Datei oder den angegebenen Ordner.

Gibt `true` zurück, wenn ein Fehler aufgetreten ist, mit einer Fehlermeldung im zweiten Rückgabewert.

Beispiel:
```lua
local error, error_message = FS.Remove("myfile.txt")

if error then
	print("failed to delete myfile: " .. error_message)
end
```
### `FS.Rename(pathA: string, pathB: string) -> bool,string`

Benennt `pathA` in `pathB` um (oder verschiebt es).

Gibt `true` zurück, wenn ein Fehler aufgetreten ist, mit einer Fehlermeldung im zweiten Rückgabewert.

### `FS.Copy(pathA: string, pathB: string) -> bool,string`

Kopiert `pathA` nach `pathB`.

Gibt `true` zurück, wenn ein Fehler aufgetreten ist, mit einer Fehlermeldung im zweiten Rückgabewert.

### `FS.GetFilename(path: string) -> string`

Gibt den letzten Teil eines Pfades zurück, das ist normalerweise der Dateiname.
Hier einige Beispiele für Eingaben und Ausgaben:
```lua
input -> output

"my/path/a.txt" 	-> "a.txt"
"somefile.txt" 		-> "somefile.txt"
"/awesome/path" 	-> "path"
```
### `FS.GetExtension(path: string) -> string`


Gibt die Erweiterung der Datei zurück oder einen leeren String, wenn keine Erweiterung existiert.
Hier einige Beispiele für Eingaben und Ausgaben
```lua
input -> output

"myfile.txt" 					-> ".txt"
"somefile." 					-> "."
"/awesome/path" 				-> ""
"/awesome/path/file.zip.txt"	-> ".txt"
"myexe.exe" 					-> ".exe"
```
### `FS.GetParentFolder(path: string) -> string`

Gibt den Pfad zum übergeordneten Verzeichnis zurück, also dem Ordner, in dem eine Datei oder ein Ordner liegt.
Hier einige Beispiele für Eingaben und Ausgaben:
```lua
input -> output

"/var/tmp/example.txt" 		-> "/var/tmp"
"/"							-> "/"
"mydir/a/b/c.txt"			-> "mydir/a/b"
```
### `FS.Exists(path: string) -> bool`

Gibt `true` zurück, wenn der Pfad existiert, und `false`, wenn nicht.

### `FS.IsDirectory(path: string) -> bool`

Gibt `true` zurück, wenn der angegebene Pfad ein Verzeichnis ist, und `false`, wenn nicht. Beachte, dass `false` NICHT bedeutet, dass der Pfad eine Datei ist (siehe `FS.IsFile()`).

### `FS.IsFile(path: string) -> bool`

Gibt `true` zurück, wenn der angegebene Pfad eine reguläre Datei ist (kein Symlink, Hardlink, Blockgerät usw.), und `false`, wenn nicht. Beachte, dass `false` NICHT bedeutet, dass der Pfad ein Verzeichnis ist (siehe `FS.IsDirectory()`).

### `FS.ListDirectories(path: string) -> table`

Gibt eine Tabelle aller Verzeichnisse im angegebenen Pfad zurück.

Beispiel:
```lua
print(FS.ListDirectories("Resources"))
```
Ergebnis: 
```lua
{
    1: "Client",
    2: "Server"
}
```
### `FS.ListFiles(path: string) -> table`

Gibt eine Tabelle aller Dateien im angegebenen Pfad zurück.

Beispiel:
```lua
print(FS.ListFiles("Resources/Server/examplePlugin"))
```
Ergebnis: 
```lua
{
    1: "example.json",
    2: "example.lua"
}
```
### `FS.ConcatPaths(...) -> string`

Fügt alle Argumente mit dem vom System bevorzugten Pfadtrennzeichen aneinander (konkateniert sie).

Beispiel:
```lua  
FS.ConcatPaths("a", "b", "/c/d/e/", "/f/", "g", "h.txt")
```
ergibt
```
a/b/c/d/e/f/g/h.txt
```
Löst außerdem `..` auf, falls es an irgendeiner Stelle im Pfad vorkommt. Diese Funktion ist sicherer als das Zusammenfügen von Strings in Lua und berücksichtigt die Trennzeichen der jeweiligen Plattform.

Verwende als Trennzeichen in Pfaden bitte immer `/`, da dies plattformübergreifend funktioniert (Windows, Linux, macOS, ...).

## Events {#events-1}

### Erklärung

- Arguments: Liste der Argumente, die den Handlern dieses Events übergeben werden
- Cancellable: Ob das Event abgebrochen werden kann. Ist das möglich, kann ein Handler es abbrechen, indem er `1` zurückgibt, also `return 1`.

### Übersicht der Events

Wenn ein Spieler beitritt, werden die folgenden Events in dieser Reihenfolge ausgelöst:

1. `onPlayerAuth`
2. `onPlayerConnecting`
3. `onPlayerJoining`
4. `onPlayerJoin`

### System-Events

#### `onInit`

Arguments: NONE
Cancellable: NO

Wird ausgelöst, sobald alle Dateien des Plugins initialisiert wurden.

#### `onConsoleInput`

Arguments: `input: string`
Cancellable: NO

Wird ausgelöst, wenn die BeamMP-Konsole eine Eingabe erhält.

#### `onShutdown`

Arguments: NONE
Cancellable: NO

Wird ausgelöst, wenn der Server herunterfährt. Dies geschieht derzeit, nachdem alle Spieler gekickt wurden.

### Spielbezogene Events

#### `onPlayerAuth`

Arguments: `player_name: string`, `player_role: string`, `is_guest: bool`, `identifiers: table -> beammp, ip`
Cancellable: YES

Das erste Event, das ausgelöst wird, wenn ein Spieler beitreten möchte. Einem Spieler kann der Beitritt verweigert werden, indem der Handler `1` oder einen Grund (`string`) zurückgibt.
```lua
function myPlayerAuthorizer(name, role, is_guest, identifiers)
	return "Sorry, you cannot join at this time."
end
MP.RegisterEvent("onPlayerAuth", "myPlayerAuthorizer")
```
#### `onPlayerConnecting`

Arguments: `player_id: number`
Cancellable: NO

Wird ausgelöst, wenn ein Spieler beginnt, sich zu verbinden, nach `onPlayerAuth`.

#### `onPlayerJoining`

Arguments: `player_id: number`
Cancellable: NO

Wird ausgelöst, wenn ein Spieler alle Mods fertig geladen hat, nach `onPlayerConnecting`.

#### `onPlayerDisconnect`

Arguments: `player_id: number`
Cancellable: NO

Wird ausgelöst, wenn ein Spieler die Verbindung trennt.

#### `onChatMessage`

Arguments: `player_id: number`, `player_name: string`, `message: string`
Cancellable: YES

Wird ausgelöst, wenn ein Spieler eine Chatnachricht sendet. Wird es abgebrochen, wird die Chatnachricht niemandem angezeigt, nicht einmal dem Spieler, der sie gesendet hat.

#### `onVehicleSpawn`

Arguments: `player_id: number`, `vehicle_id: number`, `data: string`
Cancellable: YES

Wird ausgelöst, wenn ein Spieler ein neues Fahrzeug spawnt. Beachte, dass Fahrzeugwechsel/-ersetzungen stattdessen [`onVehicleEdited`](#onvehicleedited) auslösen. Das Argument `data` enthält die Konfiguration des Fahrzeugs sowie Positions- und Rotationsdaten als JSON-String.

<details>

<summary>Beispielwert für <code>data</code></summary>

Der Daten-String beginnt mit einer eindeutigen Fahrzeugkennung, bestehend aus der Spieler-ID, einem Bindestrich und der Fahrzeug-ID. Darauf folgt ein JSON-Objekt mit Informationen zur Konfiguration und Positionierung des Fahrzeugs.
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

#### `onVehicleEdited`

Arguments: `player_id: number`, `vehicle_id: number`, `data: string`
Cancellable: YES

Wird ausgelöst, wenn ein Spieler sein Fahrzeug bearbeitet oder ersetzt. Das Argument `data` enthält die aktualisierte Konfiguration des Fahrzeugs als JSON-String, enthält aber **keine** Positions- oder Rotationsdaten. Mit [MP.GetPositionRaw](#mp-getpositionraw-pid-number-vid-number-table-string) kannst du Positions- und Rotationsdaten abrufen.

<details>

<summary>Beispielwert für <code>data</code></summary>

Der Daten-String beginnt mit einer eindeutigen Fahrzeugkennung, bestehend aus der Spieler-ID, einem Bindestrich und der Fahrzeug-ID. Darauf folgt ein JSON-Objekt mit Informationen zur Konfiguration des Fahrzeugs.
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

#### `onVehicleDeleted`

Arguments: `player_id: number`, `vehicle_id: number`
Cancellable: NO

Wird ausgelöst, wenn ein Spieler sein Fahrzeug löscht.

#### `onVehicleReset`

Arguments: `player_id: number`, `vehicle_id: number`, `data: string`
Cancellable: NO

Wird ausgelöst, wenn ein Spieler sein Fahrzeug zurücksetzt. `data` enthält die aktualisierte Position und Rotation des Fahrzeugs, aber **nicht** dessen Konfiguration. Mit [MP.GetPlayerVehicles](#mp-getplayervehicles-player-id-number-table) kannst du die Konfiguration des Fahrzeugs abrufen.

#### `onFileChanged`

*seit v3.1.0*

Arguments: `path: string`
Cancellable: NO

Wird ausgelöst, wenn sich eine Datei im Verzeichnis `Resources/Server` *oder einem seiner Unterverzeichnisse* ändert. 

Jede Dateiänderung im Verzeichnis `Resources/Server/<plugin>` (nicht in einem Unterordner davon) löst ein Neuladen des Lua-States und ein `onFileChanged`-Event aus.

Jede Datei in Unterordnern von `Resources/Server/<plugin>`, etwa `Resources/Server/<plugin>/lua/stuff.lua`, löst kein Neuladen des States aus, sondern nur ein `onFileChanged`-Event. So kannst du sie selbst auf die richtige Weise neu laden (oder eben nicht).

Das gilt für alle Dateien, nicht nur für `.lua`-Dateien.

Der `path` ist relativ zum Stammverzeichnis des Servers, zum Beispiel `Resources/Server/myplugin/myfile.txt`. Diesen String kannst du mit der Funktionsfamilie `FS.*` weiterverarbeiten, etwa um den Namen oder die Erweiterung zu extrahieren (`FS.GetExtension(...)`, `FS.GetFilename(...)`, ...).

Hinweis: Dateien, die nach dem Start des Servers hinzugefügt werden, werden ab v3.1.0 *nicht* überwacht.

## Migration vom alten Lua {#migrating-from-old-lua}

Dies ist eine kurze Übersicht der grundlegenden Schritte für die Migration vom alten zum neuen Lua.

### Verstehe, wie das neue Lua funktioniert

Lies dazu bitte den Abschnitt ["Einführung"](#introduction) und alle seine Unterabschnitte sorgfältig durch.
Das ist nötig, um die nächsten Schritte richtig auszuführen.

### Suchen & Ersetzen

Zuerst solltest du alle MP-Funktionen per Suchen & Ersetzen anpassen. Dabei sollte allen MP-Funktionen außer `print()` ein `MP.` vorangestellt werden.

Beispiel:
```lua
local players = GetPlayers()
print(#players)
```
wird zu
```lua
local players = MP.GetPlayers()
print(#players) -- note how print() doesn't change
```
### Auf Wiedersehen Threads, hallo Event-Timer!

Wie in der Einführung besprochen, sind Threads Event-Timer. Ersetze jeden Aufruf von `CreateThread` durch einen Aufruf von `CreateEventTimer`. Prüfe sorgfältig, welches Timing dein alter CreateThread hatte (die Zahl bedeutete X pro Sekunde), und überlege, welcher Timeout-Wert dafür beim Event-Timer passt (dieser wird in Millisekunden angegeben). Beachte außerdem, dass statt eines Funktionsnamens ein Eventname übergeben wird, du musst also auch ein Event registrieren.

Beispiel:
```lua
CreateThread("myFunction", 2) -- calls "myFunction" twice per second
```
wird zu
```lua
MP.RegisterEvent("myEvent", "myFunction") -- registering our event for the timer
MP.CreateEventTimer("myEvent", 500) -- 500 milliseconds = 2 times per second
```
Wenn du viele Event-Timer hast, lohnt es sich zu prüfen, ob du sie zusammenlegen kannst, zum Beispiel indem du ein „Jede Minute“-Event erstellst und mehrere Funktionen dafür registrierst, die jede Minute aufgerufen werden müssen, anstatt mehrere Event-Timer zu haben. Jeder Event-Timer kostet den Server beim Auslösen ein wenig Zeit.

### Kein implizites Aufrufen von Events mehr

Du musst alle deine Events registrieren. Du kannst dich nicht auf Funktionsnamen verlassen. Im alten Lua war das unklar, im neuen Lua wird es in der Regel erzwungen. Ein gutes Muster ist: 
```lua
MP.RegisterEvent("onChatMessage", "chatMessageHandler")
-- or 
MP.RegisterEvent("onChatMessage", "handleChatMessage")
```
Dieses Muster ist besser, als den Handler genauso zu nennen wie das Event, was irreführend und verwirrend ist.
