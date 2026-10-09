---
description: "Fertige Lua-Snippets für BeamNG.drive: eine Markierung zeichnen, Fahrzeuge erkennen sowie Toast-, Nachrichten-, Einblendungs- und Bestätigungsdialoge und Tutorial-Popups anzeigen."
---
# Lua-Code-Snippets

Snippets für BeamNG.drive, die du kopieren und anpassen kannst.

## Welt

### Eine Markierung zeichnen und Fahrzeuge erkennen

Das Zeichnen von Markierungen auf der Karte ist eine der besten Möglichkeiten, dem Benutzer zu zeigen, dass er dort in irgendeiner Form interagieren kann.

Eine Markierung zu zeichnen ist ziemlich einfach. Hier ist ein Beispiel dafür, wie die Markierung der Buslinie gezeichnet wird:
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
Hier ist ein Beispiel für eine benutzerdefinierte Markierung aus [BeamNG-FuelStations](https://github.com/BeamMP/BeamNG-FuelStations/tree/master):
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
## Benutzeroberfläche

### Toast-Benachrichtigungen, oben rechts auf dem Bildschirm

<figure class="image image_resized" style="width:75%">

  ![Bild](https://github.com/StanleyDudek/Docs/assets/49531350/c8a87842-b95a-4eca-84dc-93072ecc9158)

</figure>
```lua
--guihooks.trigger('toastrMsg', {type, title, msg, config = {timeOut}}) 
guihooks.trigger('toastrMsg', {type = "info", title = "Info Message:", msg = "Info Message Text Here", config = {timeOut = 5000}}) 
guihooks.trigger('toastrMsg', {type = "warning", title = "Warning Message:", msg = "Warning Message Text Here", config = {timeOut = 5000}}) 
guihooks.trigger('toastrMsg', {type = "error", title = "Error Message:", msg = "Error Message Text Here", config = {timeOut = 5000}}) 
```
### Nachrichtenbenachrichtigungen, standardmäßig oben links auf dem Bildschirm in der Messages-App

Dafür wird die UI-App „Messages“ oder „Messages & Tasks“ benötigt. Symbole findest du unter `ui\ui-vue\src\assets\fonts\bngIcons\svg\`

<figure class="image image_resized" style="width:75%">

  ![Bild](https://github.com/StanleyDudek/Docs/assets/49531350/6baef813-50cb-43c3-9c59-0de550b014b6)

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
### Große oder kleine Einblendung in der Bildschirmmitte

<figure class="image image_resized" style="width:75%">

  ![Bild](https://github.com/StanleyDudek/Docs/assets/49531350/d0cf754f-83f8-4d15-9159-27350da127de)

</figure>

<figure class="image image_resized" style="width:75%">

  ![Bild](https://github.com/StanleyDudek/Docs/assets/49531350/1df6fc9b-756f-484e-b8d9-5df346dc4c26)

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
### Mittelgroße, dauerhafte Anzeige in der Bildschirmmitte

Dafür wird die UI-App „Race Realtime Display“ benötigt.

<figure class="image image_resized" style="width:75%">

  ![Bild](https://github.com/StanleyDudek/Docs/assets/49531350/6290e018-6b3d-4674-98f2-34282a723258)

</figure>
```lua
--guihooks.trigger('ScenarioRealtimeDisplay', {msg = msg} ) -- requires Race Realtime Display ui app
guihooks.trigger('ScenarioRealtimeDisplay', {msg = "Message Text Here"} )
--these messages persist, clear with a blank string
--if you are running live data, this is a good one to update rapidly (think timers, distance calcs, et cetera)
guihooks.trigger('ScenarioRealtimeDisplay', {msg = ""} )
```
### Bestätigungsdialog

ConfirmationDialog ist ein schlichtes Popup mit bis zu zwei Schaltflächen.
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

  ![Beispiel für einen ConfirmationDialog](../../../assets/content/ConfirmationDialog.png)

</figure>

Beide Felder einer Schaltfläche müssen Strings sein, damit die Schaltfläche angezeigt wird.

Wenn die Schaltfläche „Okay“ angegeben ist, entspricht das Auslösen der Aktion *OK / Primary action* dem Drücken der Schaltfläche „Okay“.

Wenn die Schaltfläche „Cancel“ angegeben ist, entspricht das Auslösen der Aktion *Menu* dem Drücken der Schaltfläche „Cancel“.

HTML wird unterstützt und kann zum Beispiel verwendet werden, um Bilder oder Symbole einzufügen.

Es können mehrere gleichzeitig angezeigt werden; sie erscheinen dann nacheinander.

::: bug
Wenn keine Schaltflächen angegeben werden, kann der Spieler den Dialog nur über die Konsole verlassen.
:::

::: bug
Die SDF-Teile der Minimap-UI-App bleiben sichtbar, solange ein ConfirmationDialog aktiv ist.

Als Notlösung kann `#!lua guihooks.trigger('ShowApps', false)` verwendet werden, um die UI-Apps auszublenden.
:::

<figure class="image image_resized" style="width:75%">

  ![ConfirmationDialog, verwendet für ein System zum Kicken inaktiver Spieler](../../../assets/content/ConfirmationDialog_Example.png)

</figure>

### introPopupTutorial

introPopupTutorial ist ein sehr gut anpassbares Popup, das größtenteils über eingebettetes HTML definiert wird. Üblicherweise wird es aus einer eigenständigen HTML-Datei unter `/gameplay/tutorials/pages/*/content.html` geladen.
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

  ![Das introPopupTutorial-Snippet in BeamNG.drive](../../../assets/content/introPopupTutorial.png)

</figure>

`flavour` legt fest, welche Schaltflächen angezeigt werden. Es gibt vier Varianten:

* `withLogbook`
    * Schaltflächen: Career Logbook, Okay
* `onlyOk`
    * Schaltflächen: Okay
* `onlyLogbook`
    * Schaltflächen: Career Logbook
* `noButtons`
    * Keine Schaltflächen

::: warning
Wenn die Variante noButtons verwendet wird und der Seiteninhalt kein zusätzliches JavaScript zum Schließen des Popups enthält, kommt es zu einem Softlock. In dieser Variante werden Seiten nicht zu einem Popup zusammengefasst. Die Verwendung dieser Variante wird nicht empfohlen.
:::

Wenn mehrere Seiten angegeben werden oder der Hook mehrmals ausgelöst wird, werden die Seiten im selben Popup zusammengefasst. Wird der Hook ausgelöst, während ein introPopup aktiv ist, oder wenn bereits ein anderer introPopup-Typ ausgelöst wurde, wird er in einem separaten Popup angezeigt, nachdem das bestehende Popup geschlossen wurde.

### introPopupCareer

introPopupCareer ist ein einfach zu verwendendes, aber flexibles Popup, das bei Bedarf eingebettetes HTML unterstützt.

Die Varianten legen fest, welche Schaltflächen angezeigt werden und welches Standard-Seitenverhältnis das Bild hat. Es gibt vier Varianten:

* `default`
  * Standard-Seitenverhältnis des Bildes: 16x9
  * Schaltflächen: Later, Okay
* `welcome`
  * Standard-Seitenverhältnis des Bildes: 16x9
  * Schaltflächen: Career Logbook, Okay
* `branch-info`
  * Standard-Seitenverhältnis des Bildes: 16x9
  * Schaltflächen: Career Logbook, Okay
* `garage`
  * Schaltflächen: Later, Okay
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

  ![Das introPopupCareer-Snippet in BeamNG.drive](../../../assets/content/introPopupCareer.png)

</figure>

Wenn mehrere Seiten angegeben werden oder der Hook mehrmals ausgelöst wird, werden die Seiten im selben Popup zusammengefasst. Wird der Hook ausgelöst, während ein introPopup aktiv ist, oder wenn bereits ein anderer introPopup-Typ ausgelöst wurde, wird er in einem separaten Popup angezeigt, nachdem das bestehende Popup geschlossen wurde.

::: bug
Die Hintergrundunschärfe hat eine Mindesthöhe, sodass bei Popups mit kurzem Inhalt unterhalb des Fensters überschüssige Unschärfe zu sehen ist. Es gibt zwei Hauptlösungen:

* `\n` wiederholen und mit `#!html <div />` abschließen, bis das Fenster die Unschärfe verdeckt
* Einen leeren oder fehlenden `image`-Pfad verwenden und das Seitenverhältnis anpassen, bis das Fenster die Unschärfe verdeckt
:::

### introPopupMission

introPopupMission ist fast identisch mit introPopupCareer, aber die Schaltflächen müssen definiert werden, anstatt eine Vorgabe dafür auszuwählen.

Schaltflächenstile werden zu *bng-button-*`style` zusammengesetzt. Die integrierten Schaltflächenstile sind:

* `main` - orange
* `secondary` - cyan
* `attention` - rot
* `white` - weiß
* `link`  - durchscheinend
* `outline` - orangefarbener Umriss
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

  ![Das introPopupMission-Snippet in BeamNG.drive](../../../assets/content/introPopupMission.png)

</figure>

Wenn mehrere Seiten angegeben werden oder der Hook mehrmals ausgelöst wird, werden die Seiten im selben Popup zusammengefasst. Wird der Hook ausgelöst, während ein introPopup aktiv ist, oder wenn bereits ein anderer introPopup-Typ ausgelöst wurde, wird er in einem separaten Popup angezeigt, nachdem das bestehende Popup geschlossen wurde.

::: bug
Die Hintergrundunschärfe hat eine Mindesthöhe, sodass bei Popups mit kurzem Inhalt unterhalb des Fensters überschüssige Unschärfe zu sehen ist. Es gibt zwei Hauptlösungen:

* `\n` wiederholen und mit `#!html <div />` abschließen, bis das Fenster die Unschärfe verdeckt
* Einen leeren oder fehlenden `image`-Pfad verwenden und das Seitenverhältnis anpassen, bis das Fenster die Unschärfe verdeckt
:::

### Dialogue

Dialogue wird in der Kampagne *A Rocky Start* verwendet, um Informationen zu einer Mission anzuzeigen. Es ist ein zentriertes, vertikal ausgerichtetes Popup mit einem festen Layout. Eingebettetes HTML wird nicht unterstützt.
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

  ![Das Dialogue-Snippet in BeamNG.drive](../../../assets/content/Dialogue.png)

</figure>

Es kann immer nur ein Dialogue gleichzeitig angezeigt werden. Ein bereits vorhandener Dialogue wird überschrieben.

::: info
Zum Schließen eines Dialogue muss `#!lua ui_missionInfo.closeDialogue()` verwendet werden.

Rufe diese Funktion unbedingt auf, sobald eine beliebige Schaltfläche gedrückt wird.
:::
