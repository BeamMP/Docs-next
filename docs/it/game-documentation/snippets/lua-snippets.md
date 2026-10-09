---
description: "Snippet Lua per BeamNG.drive pronti all'uso: disegna un marcatore, rileva i veicoli e mostra notifiche toast, messaggi, flash, dialoghi di conferma e popup tutorial."
---
# Snippet di codice Lua

Snippet per BeamNG.drive che puoi copiare e adattare.

## Mondo

### Disegnare un marcatore e rilevare i veicoli

Disegnare dei marcatori sulla mappa è uno dei modi migliori per indicare all'utente che in quel punto è possibile compiere una qualche interazione.

Disegnare un marcatore è abbastanza semplice. Ecco un esempio di come viene disegnato il marcatore del percorso dell'autobus:
```lua
  local function createBusMarker(markerName)
    local marker =  createObject('TSStatic')
    marker:setField('shapeName', 0, "art/shapes/interface/position_marker.dae")
    marker:setPosition(vec3(0, 0, 0))
    marker.scale = vec3(1, 1, 1)
    marker:setField('rotation', 0, '1 0 0 0')
    marker.useInstanceRenderData = true
    marker:setField('instanceColor', 0, '1 1 1 0')
    marker:setField('collisionType', 0, "Collision Mesh")
    marker:setField('decalType', 0, "Collision Mesh")
    marker:setField('playAmbient', 0, "1")
    marker:setField('allowPlayerStep', 0, "1")
    marker:setField('canSave', 0, "0")
    marker:setField('canSaveDynamicFields', 0, "1")
    marker:setField('renderNormals', 0, "0")
    marker:setField('meshCulling', 0, "0")
    marker:setField('originSort', 0, "0")
    marker:setField('forceDetail', 0, "-1")
    marker.canSave = false
    marker:registerObject(markerName)
    scenetree.MissionGroup:addObject(marker)
    return marker
  end

  -- this can then be called in a loop to setup your markers. 
  -- NOTE: You should only do this once as part of your setup and not called on each frame.
  if #markers == 0 then
    for k,v in pairs(nameMarkers) do
      local mk = scenetree.findObject(v)
      if mk == nil then
        log('I', logTag,'Creating marker '..tostring(v))
        mk = createBusMarker(v)
        ScenarioObjectsGroup:addObject(mk.obj)
      end
      table.insert(markers, mk)
    end
  end
```
Ecco un esempio di marcatore personalizzato da [BeamNG-FuelStations](https://github.com/BeamMP/BeamNG-FuelStations/tree/master):
```lua
  local stations = [
    { "location": [ -778.813,  485.973, 23.46 ], "type":"gas" },
    { "location": [  617.164, -192.107, 53.2  ], "type":"ev"  },
  ]

  local function IsEntityInsideArea(pos1, pos2, radius)
    return pos1:distance(pos2) < radius
  end

  local onUpdate = function (dt)
    for k, spot in pairs(stations) do -- loop through all spots on the current map
      local bottomPos = vec3(spot.location[1], spot.location[2], spot.location[3])
      local topPos = bottomPos + vec3(0,0,2) -- offset vec to get top position (2m tall)

      local spotInRange = false -- is this spot in range? used for color
      local spotCompatible = false -- is this spot compatible?

      if activeVeh then -- we have a car and its ours (if in mp)
        local vehPos = activeVeh:getPosition()

        spotInRange = IsEntityInsideArea(vec3(vehPos.x, vehPos.y,vehPos.z), bottomPos, 1.5)

        spotCompatible = activeFuelType == "any" or spot.type == "any" or activeFuelType == spot.type
      end

      local spotColor = (spotInRange and spotCompatible) and activeColorMap[spot.type] or inactiveColorMap[spot.type] or ColorF(1,1,1,0.5)

      debugDrawer:drawCylinder(bottomPos:toPoint3F(), topPos:toPoint3F(), 1, spotColor) --bottom, top, radius, color
    end
  end
```
## Interfaccia utente

### Notifiche toast, in alto a destra dello schermo

<figure class="image image_resized" style="width:75%">

  ![immagine](https://github.com/StanleyDudek/Docs/assets/49531350/c8a87842-b95a-4eca-84dc-93072ecc9158)

</figure>
```lua
--guihooks.trigger('toastrMsg', {type, title, msg, config = {timeOut}}) 
guihooks.trigger('toastrMsg', {type = "info", title = "Info Message:", msg = "Info Message Text Here", config = {timeOut = 5000}}) 
guihooks.trigger('toastrMsg', {type = "warning", title = "Warning Message:", msg = "Warning Message Text Here", config = {timeOut = 5000}}) 
guihooks.trigger('toastrMsg', {type = "error", title = "Error Message:", msg = "Error Message Text Here", config = {timeOut = 5000}}) 
```
### Notifiche di messaggio, in alto a sinistra per impostazione predefinita nell'app Messages

Richiede l'app UI "Messages" o "Messages & Tasks". Le icone si trovano in `ui\ui-vue\src\assets\fonts\bngIcons\svg\`

<figure class="image image_resized" style="width:75%">

  ![immagine](https://github.com/StanleyDudek/Docs/assets/49531350/6baef813-50cb-43c3-9c59-0de550b014b6)

</figure>
```lua
--guihooks.trigger('Message', {msg, ttl, category, icon})
--ui_message(msg, ttl, category, icon)
guihooks.trigger('Message', {msg = "Message Text Here", ttl = 5.0, category = "arrow_upward", icon = "arrow_upward"}) 
guihooks.trigger('Message', {msg = "Message Text Here", ttl = 5.0, category = "arrow_downward", icon = "arrow_downward"}) 
guihooks.trigger('Message', {msg = "Message Text Here", ttl = 5.0, category = "flag", icon = "flag"}) 
guihooks.trigger('Message', {msg = "Message Text Here", ttl = 5.0, category = "check", icon = "check"}) 
guihooks.trigger('Message', {msg = "Message Text Here", ttl = 5.0, category = "check_circle", icon = "check_circle"}) 
guihooks.trigger('Message', {msg = "Message Text Here", ttl = 5.0, category = "warning", icon = "warning"}) 
guihooks.trigger('Message', {msg = "Message Text Here", ttl = 5.0, category = "error", icon = "error"}) 
guihooks.trigger('Message', {msg = "Message Text Here", ttl = 5.0, category = "directions_car", icon = "directions_car"}) 
guihooks.trigger('Message', {msg = "Message Text Here", ttl = 5.0, category = "star", icon = "star"}) 
guihooks.trigger('Message', {msg = "Message Text Here", ttl = 5.0, category = "timeline", icon = "timeline"}) 
guihooks.trigger('Message', {msg = "Message Text Here", ttl = 5.0, category = "save", icon = "save"}) 
guihooks.trigger('Message', {msg = "Message Text Here", ttl = 5.0, category = "settings", icon = "settings"}) 
```
### Flash al centro, grande o piccolo

<figure class="image image_resized" style="width:75%">

  ![immagine](https://github.com/StanleyDudek/Docs/assets/49531350/d0cf754f-83f8-4d15-9159-27350da127de)

</figure>

<figure class="image image_resized" style="width:75%">

  ![immagine](https://github.com/StanleyDudek/Docs/assets/49531350/1df6fc9b-756f-484e-b8d9-5df346dc4c26)

</figure>
```lua
--guihooks.trigger('ScenarioFlashMessage', {{msg, ttl, sound, big}} ) -- requires RaceCountdown ui app
guihooks.trigger('ScenarioFlashMessage', {{"Message", 5.0, 0, true}} ) 
guihooks.trigger('ScenarioFlashMessage', {{"Message Text Here", 5.0, 0, false}} ) 

--countdown example, when all executed at once, the items are queued and will follow eachother after the previous ttl expires
guihooks.trigger('ScenarioFlashMessage', {{"3", 1.0, "Engine.Audio.playOnce('AudioGui', 'event:UI_Countdown1')", true}}) 
guihooks.trigger('ScenarioFlashMessage', {{"2", 1.0, "Engine.Audio.playOnce('AudioGui', 'event:UI_Countdown2')", true}}) 
guihooks.trigger('ScenarioFlashMessage', {{"1", 1.0, "Engine.Audio.playOnce('AudioGui', 'event:UI_Countdown3')", true}}) 
guihooks.trigger('ScenarioFlashMessage', {{"GO!", 3.0, "Engine.Audio.playOnce('AudioGui', 'event:UI_CountdownGo')", true}}) 

--another sound example
guihooks.trigger('ScenarioFlashMessage', {{"Teleported!", 3.0, "Engine.Audio.playOnce('AudioGui', 'event:UI_Checkpoint')", false}}) 
```
### Visualizzazione persistente al centro, di dimensioni medie

Richiede l'app UI "Race Realtime Display".

<figure class="image image_resized" style="width:75%">

  ![immagine](https://github.com/StanleyDudek/Docs/assets/49531350/6290e018-6b3d-4674-98f2-34282a723258)

</figure>
```lua
--guihooks.trigger('ScenarioRealtimeDisplay', {msg = msg} ) -- requires Race Realtime Display ui app
guihooks.trigger('ScenarioRealtimeDisplay', {msg = "Message Text Here"} )
--these messages persist, clear with a blank string
--if you are running live data, this is a good one to update rapidly (think timers, distance calcs, et cetera)
guihooks.trigger('ScenarioRealtimeDisplay', {msg = ""} )
```
### Dialogo di conferma

ConfirmationDialog è un semplice popup con al massimo due pulsanti.
```lua
-- Open a ConfirmationDialog with a title, body text, and up to two buttons
guihooks.trigger("ConfirmationDialogOpen",
    "Example Title",
    "Example Body Text",
    "Okay",
    "", --gelua. empty string
    "Cancel",
    "" --gelua
)

-- Close any open ConfirmationDialog with the provided title
guihooks.trigger("ConfirmationDialogClose", "Example Title")
```
<figure class="image image_resized" style="width:75%">

  ![Esempio di ConfirmationDialog](../../../assets/content/ConfirmationDialog.png)

</figure>

Entrambi i campi di un pulsante devono essere stringhe, altrimenti il pulsante non compare.

Se è presente il pulsante Okay, premere l'azione *OK / Primary action* equivale a premere il pulsante Okay.

Se è presente il pulsante Cancel, premere l'azione *Menu* equivale a premere il pulsante Cancel.

L'HTML è supportato e si può usare, ad esempio, per aggiungere immagini o icone.

Se ne possono mostrare più di uno contemporaneamente: vengono visualizzati in sequenza.

::: bug
Se non fornisci alcun pulsante, il giocatore non può uscire dal dialogo senza usare la console.
:::

::: bug
Le parti SDF dell'app UI Minimap restano visibili mentre un ConfirmationDialog è attivo.

Come soluzione di ripiego si può usare `#!lua guihooks.trigger('ShowApps', false)` per nascondere le app UI.
:::

<figure class="image image_resized" style="width:75%">

  ![ConfirmationDialog usato per un sistema di kick per inattività](../../../assets/content/ConfirmationDialog_Example.png)

</figure>

### introPopupTutorial

introPopupTutorial è un popup molto personalizzabile, definito in gran parte con HTML incorporato. Di norma lo si carica da un file HTML a sé stante, collocato in `/gameplay/tutorials/pages/*/content.html`.
```lua
guihooks.trigger("introPopupTutorial", {
    {
        content = readFile("/gameplay/tutorials/pages/template/content.html"):gsub("\r\n",""),
        flavour = "onlyOk"
    }
})

guihooks.trigger("introPopupClose")
```
<figure class="image image_resized" style="width:75%">

  ![Lo snippet introPopupTutorial mostrato in BeamNG.drive](../../../assets/content/introPopupTutorial.png)

</figure>

`flavour` controlla quali pulsanti vengono mostrati. Esistono quattro flavour:

* `withLogbook`
    * Pulsanti: Career Logbook, Okay
* `onlyOk`
    * Pulsanti: Okay
* `onlyLogbook`
    * Pulsanti: Career Logbook
* `noButtons`
    * Non mostra alcun pulsante

::: warning
Se usi il flavour noButtons e nel contenuto della pagina non c'è JavaScript aggiuntivo per chiudere il popup, il gioco si blocca (softlock). In questo flavour le pagine non vengono unite in un unico popup. Non è consigliato usare questo flavour.
:::

Se vengono fornite più pagine, oppure l'hook viene scatenato più volte, le pagine vengono unite nello stesso popup. Se l'hook viene scatenato mentre un introPopup è attivo, o quando è già stato scatenato un introPopup di tipo diverso, viene mostrato in un popup separato dopo la chiusura di quello esistente.

### introPopupCareer

introPopupCareer è un popup facile da usare ma flessibile, che supporta l'HTML incorporato, se serve.

I flavour controllano quali pulsanti vengono mostrati e le proporzioni predefinite dell'immagine. Esistono quattro flavour:

* `default`
  * Proporzioni predefinite dell'immagine: 16x9
  * Pulsanti: Later, Okay
* `welcome`
  * Proporzioni predefinite dell'immagine: 16x9
  * Pulsanti: Career Logbook, Okay
* `branch-info`
  * Proporzioni predefinite dell'immagine: 16x9
  * Pulsanti: Career Logbook, Okay
* `garage`
  * Pulsanti: Later, Okay
```lua
guihooks.trigger("introPopupCareer", {
    {
        title   = "Example title",
        text    = "Example text",
        image   = "/gameplay/tutorials/pages/template/image.jpg",
        ratio   = "16x9",
        flavour = "default"
    }
})

guihooks.trigger("introPopupClose")
```
<figure class="image image_resized" style="width:75%">

  ![Lo snippet introPopupCareer mostrato in BeamNG.drive](../../../assets/content/introPopupCareer.png)

</figure>

Se vengono fornite più pagine, oppure l'hook viene scatenato più volte, le pagine vengono unite nello stesso popup. Se l'hook viene scatenato mentre un introPopup è attivo, o quando è già stato scatenato un introPopup di tipo diverso, viene mostrato in un popup separato dopo la chiusura di quello esistente.

::: bug
La sfocatura dello sfondo ha un'altezza minima, quindi i popup con poco contenuto mostrano una sfocatura in eccesso sotto la loro finestra. Esistono due soluzioni di ripiego principali:

* Ripeti `\n` e termina con `#!html <div />` finché la finestra non copre la sfocatura
* Usa un percorso `image` vuoto o mancante e regola le proporzioni finché la finestra non copre la sfocatura
:::

### introPopupMission

introPopupMission è quasi identico a introPopupCareer, ma i pulsanti vanno definiti invece di scegliere un preset.

Gli stili dei pulsanti si compongono come *bng-button-*`style`. Gli stili di pulsante integrati sono:

* `main` - arancione
* `secondary` - ciano
* `attention` - rosso
* `white` - bianco
* `link`  - traslucido
* `outline` - contorno arancione
```lua
guihooks.trigger('introPopupMission', {
    title   = "introPopupMission title",
    text    = "introPopupMission description",
    image   = "/gameplay/tutorials/pages/template/image.jpg",
    ratio   = "16x9",
    buttons = {
        { default=true,  class="main",      label="main button",      clickLua="" },
        { default=false, class="secondary", label="secondary button", clickLua="" },
        { default=false, class="attention", label="attention button", clickLua="" },
        { default=false, class="white",     label="white button",     clickLua="" },
        { default=false, class="link",      label="link button",      clickLua="" },
        { default=false, class="outline",   label="outline button",   clickLua="" }
    }
})

guihooks.trigger("introPopupClose")
```
<figure class="image image_resized" style="width:75%">

  ![Lo snippet introPopupMission mostrato in BeamNG.drive](../../../assets/content/introPopupMission.png)

</figure>

Se vengono fornite più pagine, oppure l'hook viene scatenato più volte, le pagine vengono unite nello stesso popup. Se l'hook viene scatenato mentre un introPopup è attivo, o quando è già stato scatenato un introPopup di tipo diverso, viene mostrato in un popup separato dopo la chiusura di quello esistente.

::: bug
La sfocatura dello sfondo ha un'altezza minima, quindi i popup con poco contenuto mostrano una sfocatura in eccesso sotto la loro finestra. Esistono due soluzioni di ripiego principali:

* Ripeti `\n` e termina con `#!html <div />` finché la finestra non copre la sfocatura
* Usa un percorso `image` vuoto o mancante e regola le proporzioni finché la finestra non copre la sfocatura
:::

### Dialogue

Dialogue viene usato nella campagna *A Rocky Start* per mostrare informazioni su una missione. È un popup centrato, allineato verticalmente, con un layout specifico. Non supporta l'HTML incorporato.
```lua
ui_missionInfo.openDialogue({
    title    = "Dialogue title",
    type     = "Custom", -- isn't actually displayed
    typeName = "typeName",
    data     = {
        {label = "objective",  value = "reward"}
        -- add more...
    },
    buttons  = {
        {action = "accept", text = "Accept",  cmd = ""},
        {action = 'decline',text = "Decline", cmd = ""}
        -- add more...
    }
})

ui_missionInfo.closeDialogue()
```
<figure class="image image_resized" style="width:75%">

  ![Lo snippet Dialogue mostrato in BeamNG.drive](../../../assets/content/Dialogue.png)

</figure>

Si può mostrare un solo Dialogue alla volta. Qualsiasi Dialogue esistente viene sostituito.

::: info
Per chiudere un dialogo si deve usare `#!lua ui_missionInfo.closeDialogue()`.

Assicurati di chiamare questa funzione quando viene premuto un qualsiasi pulsante.
:::
