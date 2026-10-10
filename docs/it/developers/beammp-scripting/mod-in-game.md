---
description: "Le funzioni Lua in gioco (lato client) di BeamMP: eventi e gestori, eventi della chat, ascolto dei tasti, hook delle estensioni e funzioni per nametag, ruoli e lista giocatori."
---
# Riferimento allo scripting della mod (in gioco)

BeamMP ti permette di scrivere anche plugin lato client. Alcune funzioni ti permettono di comunicare con altre mod multigiocatore e con gli altri giocatori tramite il server. Per configurare un plugin, consulta [Creazione di Mod e Risorse](/it/developers/mod-and-resource-creation). Questa pagina è stata verificata con BeamMP 4.22.5.

## Funzioni per gli eventi

| Funzione | Cosa fa |
|---|---|
| `TriggerServerEvent("eventName", "data")` | Scatena un evento nell'ambiente Lua del server. Entrambi i parametri sono stringhe. Il server ha bisogno di un gestore per l'evento, registrato con `MP.RegisterEvent` |
| `TriggerClientEvent("eventName", "data")` | Scatena un evento nell'ambiente Lua locale. Entrambi i parametri sono stringhe. Utile per la comunicazione tra plugin |
| `AddEventHandler("eventName", Function, "name")` | Aggiunge `Function` per essere chiamata quando viene ricevuto `eventName`, in locale o dal server. `Function` riceve un parametro: una stringa con i dati dell'evento. `name` è facoltativo, vedi sotto |
| `RemoveEventHandler("eventName", "name")` | Rimuove un gestore aggiunto con `AddEventHandler`. `name` è facoltativo, vedi sotto |

- Il nome di un evento non può contenere i due punti (`:`). I dati invece possono contenerli.
- Un gestore appartiene al file che ha chiamato `AddEventHandler`. Se lo stesso file aggiunge un gestore per un evento che gestisce già, il nuovo gestore sostituisce quello vecchio. Per tenere più gestori per lo stesso evento nello stesso file, dai a ciascuno un `name` diverso. Usa lo stesso `name` con `RemoveEventHandler`.
- Se un gestore genera un errore, BeamMP registra l'errore nel log e continua con gli altri gestori.
- `AddEventHandler` esiste solo mentre BeamMP è caricato. Se la tua mod gira anche in single player, scrivi `if AddEventHandler then ... end`.

Per il lato server di questi eventi, consulta il [riferimento allo scripting del server](/it/developers/beammp-scripting/server/latest).

## Eventi scatenati da BeamMP

| Evento | Quando | Dati |
|---|---|---|
| `ChatMessageReceived` | Arriva un messaggio in chat | `Sender: message`, una stringa senza il tag del ruolo del mittente |
| `ChatMessageSent` | Invii un messaggio in chat | `C:Sender: message`, dove `Sender` è il tuo nome |

## Esempio: leggere i messaggi della chat

Per leggere la chat, usa l'evento integrato `ChatMessageReceived`:

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

## Ascolto dei tasti

| Funzione | Cosa fa |
|---|---|
| `onKeyPressed("NUMPAD1", Function)` | Chiama `Function` quando il tasto viene premuto |
| `onKeyReleased("NUMPAD1", Function)` | Chiama `Function` quando il tasto viene rilasciato |
| `addKeyEventListener("NUMPAD1", Function, "down")` | Chiama `Function` quando lo stato del tasto cambia. L'ultimo parametro è `"down"`, `"up"` oppure `"both"`, e `"both"` è il valore predefinito |
| `getKeyState("NUMPAD1")` | Restituisce `true` finché il tasto è tenuto premuto, e `false` altrimenti |

`Function` riceve un parametro: `true` se il tasto è stato premuto e `false` se è stato rilasciato.

## Hook delle estensioni

BeamMP chiama questi hook su ogni estensione caricata che li definisce:

| Hook | Quando |
|---|---|
| `onBeamMPLauncherConnected` | Il gioco si è connesso al Launcher |
| `onBeamMPPostJoin` | La mappa del server è stata caricata durante l'accesso |
| `onBeamMPServerLeave` | Esci dal server |

## Nametag, ruoli e lista giocatori

Queste funzioni si trovano nell'estensione `MPVehicleGE`. Gli ID dei giocatori sono numeri, e l'ID di un veicolo ha la forma `playerID-vehicleID`, ad esempio `"0-1"`.

| Funzione | Cosa fa |
|---|---|
| `MPVehicleGE.getPlayers()` | Restituisce la tabella di tutti i giocatori noti, con l'ID del giocatore come chiave |
| `MPVehicleGE.getVehicles()` | Restituisce la tabella di tutti i veicoli multigiocatore, con l'ID del veicolo come chiave |
| `MPVehicleGE.getPlayerByName("name")` | Restituisce la tabella del giocatore e l'ID del giocatore, oppure `nil` se il giocatore non esiste |
| `MPVehicleGE.isOwn(gameVehicleID)` | Restituisce `true` se il veicolo di gioco con quel numero ti appartiene |
| `MPVehicleGE.setPlayerNickPrefix("name", "source", "text")` | Aggiunge `text` prima del nametag di un giocatore. Usa un `source` diverso per ogni prefisso che vuoi mantenere |
| `MPVehicleGE.setPlayerNickSuffix("name", "source", "text")` | Aggiunge `text` dopo il nametag di un giocatore. Usa un `source` diverso per ogni suffisso che vuoi mantenere |
| `MPVehicleGE.hideNicknames(true)` | Impedisce a BeamMP di disegnare i nametag. Con `false` vengono disegnati di nuovo |
| `MPVehicleGE.setPlayerRole(playerID, "tag", "shorttag", red, green, blue)` | Assegna a un giocatore un ruolo personalizzato. Il tag e il tag breve sono testi che BeamMP mostra tra parentesi quadre, e il colore di sfondo è composto da tre numeri da 0 a 255. Restituisce `false` e un messaggio di errore se un argomento non è valido |
| `MPVehicleGE.clearPlayerRole(playerID)` | Rimuove il ruolo personalizzato di un giocatore |
| `MPVehicleGE.setVehicleRole("playerID-vehicleID", "tag", "shorttag", red, green, blue)` | Assegna a un singolo veicolo un ruolo personalizzato |
| `MPVehicleGE.clearVehicleRole("playerID-vehicleID")` | Rimuove il ruolo personalizzato di un veicolo |
| `MPVehicleGE.applyQueuedEvents()` | Carica tutte le modifiche ai veicoli in coda |

Per aggiungere un pulsante al menu del tasto destro della lista giocatori, aggiungi una funzione alla tabella restituita da `UI.getCustomPlayerlistButtons()`. La chiave è il testo del pulsante. La funzione riceve il nome e l'ID del giocatore:

```lua
local buttons = UI.getCustomPlayerlistButtons()
buttons["Say hello"] = function(name, id)
  print("Hello, " .. name .. " (ID " .. tostring(id) .. ")")
end
```
