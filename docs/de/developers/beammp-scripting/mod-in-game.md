---
description: "Die clientseitigen Lua-Funktionen von BeamMP im Spiel: Events und Handler, Chat-Events, Tastenabfragen, Extension-Hooks sowie Funktionen für Nametags, Rollen und die Spielerliste."
---
# Scripting-Referenz: Mod (Im Spiel)

Mit BeamMP kannst du auch clientseitige Plugins schreiben. Einige Funktionen lassen dich mit anderen Multiplayer-Mods und über den Server mit anderen Spielern kommunizieren. Wie du ein Plugin einrichtest, steht unter [Mod- & Ressourcenerstellung](/de/developers/mod-and-resource-creation). Diese Seite wurde anhand von BeamMP 4.22.5 geprüft.

## Event-Funktionen

| Funktion | Was sie macht |
|---|---|
| `TriggerServerEvent("eventName", "data")` | Löst ein Event in der Lua-Umgebung des Servers aus. Beide Parameter sind Strings. Der Server braucht einen Handler für das Event, der mit `MP.RegisterEvent` registriert wurde |
| `TriggerClientEvent("eventName", "data")` | Löst ein Event in der lokalen Lua-Umgebung aus. Beide Parameter sind Strings. Gut für die Kommunikation zwischen Plugins |
| `AddEventHandler("eventName", Function, "name")` | Fügt `Function` hinzu, damit sie aufgerufen wird, wenn `eventName` empfangen wird, entweder lokal oder vom Server. `Function` erhält einen Parameter: einen String mit den Event-Daten. `name` ist optional, siehe unten |
| `RemoveEventHandler("eventName", "name")` | Entfernt einen Handler, den `AddEventHandler` hinzugefügt hat. `name` ist optional, siehe unten |

- Ein Event-Name darf keinen Doppelpunkt (`:`) enthalten. Die Daten dürfen einen enthalten.
- Ein Handler gehört zu der Datei, die `AddEventHandler` aufgerufen hat. Fügt dieselbe Datei einen Handler für ein Event hinzu, das sie bereits behandelt, ersetzt der neue Handler den alten. Wenn du in einer Datei mehrere Handler für ein Event behalten willst, gib jedem einen anderen `name`. Verwende denselben `name` bei `RemoveEventHandler`.
- Wenn ein Handler einen Fehler auslöst, protokolliert BeamMP den Fehler und macht mit den anderen Handlern weiter.
- `AddEventHandler` gibt es nur, solange BeamMP geladen ist. Wenn dein Mod auch im Einzelspielermodus läuft, schreibe `if AddEventHandler then ... end`.

Die Serverseite dieser Events findest du in der [Server-Scripting-Referenz](/de/developers/beammp-scripting/server/latest).

## Events, die BeamMP auslöst

| Event | Wann | Daten |
|---|---|---|
| `ChatMessageReceived` | Eine Chat-Nachricht kommt an | `Sender: message`, ein String ohne das Rollen-Tag des Absenders |
| `ChatMessageSent` | Du sendest eine Chat-Nachricht | `C:Sender: message`, wobei `Sender` dein Name ist |

## Beispiel: Chat-Nachrichten lesen

Um den Chat zu lesen, nutze das eingebaute Event `ChatMessageReceived`:

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

## Tastenabfragen

| Funktion | Was sie macht |
|---|---|
| `onKeyPressed("NUMPAD1", Function)` | Ruft `Function` auf, wenn die Taste gedrückt wird |
| `onKeyReleased("NUMPAD1", Function)` | Ruft `Function` auf, wenn die Taste losgelassen wird |
| `addKeyEventListener("NUMPAD1", Function, "down")` | Ruft `Function` auf, wenn sich der Zustand der Taste ändert. Der letzte Parameter ist `"down"`, `"up"` oder `"both"`, und `"both"` ist der Standard |
| `getKeyState("NUMPAD1")` | Gibt `true` zurück, solange die Taste gehalten wird, sonst `false` |

`Function` erhält einen Parameter: `true`, wenn die Taste gedrückt wurde, und `false`, wenn sie losgelassen wurde.

## Extension-Hooks

BeamMP ruft diese Hooks bei jeder geladenen Extension auf, die sie definiert:

| Hook | Wann |
|---|---|
| `onBeamMPLauncherConnected` | Das Spiel hat sich mit dem Launcher verbunden |
| `onBeamMPPostJoin` | Die Karte des Servers wurde beim Beitreten geladen |
| `onBeamMPServerLeave` | Du verlässt den Server |

## Nametags, Rollen und die Spielerliste

Diese Funktionen befinden sich in der Extension `MPVehicleGE`. Spieler-IDs sind Zahlen, und eine Fahrzeug-ID hat die Form `playerID-vehicleID`, zum Beispiel `"0-1"`.

| Funktion | Was sie macht |
|---|---|
| `MPVehicleGE.getPlayers()` | Gibt die Tabelle aller bekannten Spieler zurück, mit der Spieler-ID als Schlüssel |
| `MPVehicleGE.getVehicles()` | Gibt die Tabelle aller Multiplayer-Fahrzeuge zurück, mit der Fahrzeug-ID als Schlüssel |
| `MPVehicleGE.getPlayerByName("name")` | Gibt die Spielertabelle und die Spieler-ID zurück, oder `nil`, wenn es keinen solchen Spieler gibt |
| `MPVehicleGE.isOwn(gameVehicleID)` | Gibt `true` zurück, wenn das Spielfahrzeug mit dieser Nummer dir gehört |
| `MPVehicleGE.setPlayerNickPrefix("name", "source", "text")` | Fügt `text` vor dem Nametag eines Spielers hinzu. Verwende für jedes Präfix, das du behalten willst, eine andere `source` |
| `MPVehicleGE.setPlayerNickSuffix("name", "source", "text")` | Fügt `text` nach dem Nametag eines Spielers hinzu. Verwende für jedes Suffix, das du behalten willst, eine andere `source` |
| `MPVehicleGE.hideNicknames(true)` | Verhindert, dass BeamMP Nametags zeichnet. Mit `false` werden sie wieder gezeichnet |
| `MPVehicleGE.setPlayerRole(playerID, "tag", "shorttag", red, green, blue)` | Gibt einem Spieler eine eigene Rolle. Tag und Kurz-Tag sind Text, den BeamMP in eckigen Klammern anzeigt, und die Hintergrundfarbe besteht aus drei Zahlen von 0 bis 255. Gibt `false` und eine Fehlermeldung zurück, wenn ein Argument ungültig ist |
| `MPVehicleGE.clearPlayerRole(playerID)` | Entfernt die eigene Rolle eines Spielers |
| `MPVehicleGE.setVehicleRole("playerID-vehicleID", "tag", "shorttag", red, green, blue)` | Gibt einem einzelnen Fahrzeug eine eigene Rolle |
| `MPVehicleGE.clearVehicleRole("playerID-vehicleID")` | Entfernt die eigene Rolle eines Fahrzeugs |
| `MPVehicleGE.applyQueuedEvents()` | Lädt alle in der Warteschlange stehenden Fahrzeugänderungen |

Um dem Rechtsklick-Menü der Spielerliste eine Schaltfläche hinzuzufügen, füge der Tabelle, die `UI.getCustomPlayerlistButtons()` zurückgibt, eine Funktion hinzu. Der Schlüssel ist der Text der Schaltfläche. Die Funktion erhält den Namen und die ID des Spielers:

```lua
local buttons = UI.getCustomPlayerlistButtons()
buttons["Say hello"] = function(name, id)
  print("Hello, " .. name .. " (ID " .. tostring(id) .. ")")
end
```
