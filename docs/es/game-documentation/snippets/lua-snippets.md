::: warning ¡Este sitio está en construcción!
Se está trabajando activamente en este sitio. 

¿Crees que podrías ayudar? ¡Hazlo haciendo clic en la página con un lápiz de la derecha!

Esto se puede hacer en cualquier página.
:::
    
# Fragmentos de código Lua de BeamNG.drive

## Mundo

### Dibujar un marcador y detectar vehículos

Dibujar marcadores en el mapa puede ser una de las mejores formas de indicar al usuario que hay algún tipo de interacción que puede realizar allí.

Dibujar un marcador es bastante sencillo. Este es un ejemplo de cómo se dibuja el marcador de la ruta del autobús:
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
Este es un ejemplo de marcador personalizado de [BeamNG-FuelStations](https://github.com/BeamMP/BeamNG-FuelStations/tree/master):
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
## Interfaz de usuario

### Notificaciones emergentes (toast), en la parte superior derecha de la pantalla

<figure class="image image_resized" style="width:75%">

  ![imagen](https://github.com/StanleyDudek/Docs/assets/49531350/c8a87842-b95a-4eca-84dc-93072ecc9158)

</figure>
```lua
--guihooks.trigger('toastrMsg', {type, title, msg, config = {timeOut}}) 
guihooks.trigger('toastrMsg', {type = "info", title = "Info Message:", msg = "Info Message Text Here", config = {timeOut = 5000}}) 
guihooks.trigger('toastrMsg', {type = "warning", title = "Warning Message:", msg = "Warning Message Text Here", config = {timeOut = 5000}}) 
guihooks.trigger('toastrMsg', {type = "error", title = "Error Message:", msg = "Error Message Text Here", config = {timeOut = 5000}}) 
```
### Notificaciones de mensajes, en la parte superior izquierda de la pantalla por defecto, en la app Messages

Requiere la aplicación de IU 'Messages' o 'Messages & Tasks'. Los iconos se encuentran en `ui\ui-vue\src\assets\fonts\bngIcons\svg\`

<figure class="image image_resized" style="width:75%">

  ![imagen](https://github.com/StanleyDudek/Docs/assets/49531350/6baef813-50cb-43c3-9c59-0de550b014b6)

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
### Destello grande o pequeño en el centro de la pantalla

<figure class="image image_resized" style="width:75%">

  ![imagen](https://github.com/StanleyDudek/Docs/assets/49531350/d0cf754f-83f8-4d15-9159-27350da127de)

</figure>

<figure class="image image_resized" style="width:75%">

  ![imagen](https://github.com/StanleyDudek/Docs/assets/49531350/1df6fc9b-756f-484e-b8d9-5df346dc4c26)

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
### Indicador persistente de tamaño medio en el centro

Requiere la aplicación de IU 'Race Realtime Display'.

<figure class="image image_resized" style="width:75%">

  ![imagen](https://github.com/StanleyDudek/Docs/assets/49531350/6290e018-6b3d-4674-98f2-34282a723258)

</figure>
```lua
--guihooks.trigger('ScenarioRealtimeDisplay', {msg = msg} ) -- requires Race Realtime Display ui app
guihooks.trigger('ScenarioRealtimeDisplay', {msg = "Message Text Here"} )
--these messages persist, clear with a blank string
--if you are running live data, this is a good one to update rapidly (think timers, distance calcs, et cetera)
guihooks.trigger('ScenarioRealtimeDisplay', {msg = ""} )
```
### Cuadro de diálogo de confirmación

ConfirmationDialog es una ventana emergente sencilla con hasta dos botones.
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

  ![Ejemplo de un ConfirmationDialog](../../../assets/content/ConfirmationDialog.png)

</figure>

Ambos campos de un botón deben ser cadenas de texto para que el botón aparezca.

Si se proporciona el botón Okay, pulsar la acción *OK / Primary action* equivale a pulsar el botón Okay.

Si se proporciona el botón Cancel, pulsar la acción *Menu* equivale a pulsar el botón Cancel.

Se admite HTML, que puede usarse para añadir imágenes o iconos, por ejemplo.

Se pueden mostrar varios a la vez; se muestran de forma secuencial.

::: bug
Si no se proporciona ningún botón, el jugador no puede salir del diálogo sin usar la consola.
:::

::: bug
Las partes SDF de la aplicación de IU Minimap permanecen visibles mientras hay un ConfirmationDialog activo.

Como solución provisional se puede usar `#!lua guihooks.trigger('ShowApps', false)` para ocultar las aplicaciones de IU.
:::

<figure class="image image_resized" style="width:75%">

  ![ConfirmationDialog usado en un sistema de expulsión por inactividad](../../../assets/content/ConfirmationDialog_Example.png)

</figure>

### introPopupTutorial

introPopupTutorial es una ventana emergente muy personalizable que se define en gran parte con HTML incrustado. Lo habitual es cargarla desde un archivo HTML independiente ubicado en `/gameplay/tutorials/pages/*/content.html`.
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

  ![El fragmento introPopupTutorial mostrado en BeamNG.drive](../../../assets/content/introPopupTutorial.png)

</figure>

`flavour` controla qué botones se muestran. Existen cuatro variantes:

* `withLogbook`
    * Botones: Career Logbook, Okay
* `onlyOk`
    * Botones: Okay
* `onlyLogbook`
    * Botones: Career Logbook
* `noButtons`
    * No muestra ningún botón

::: warning
Al usar la variante noButtons en la página, si no se incluye JavaScript adicional en el contenido de la página para cerrar la ventana emergente, el juego queda bloqueado (softlock). En esta variante, las páginas no se combinan en una sola ventana emergente. No se recomienda usar esta variante.
:::

Si se proporcionan varias páginas, o si el hook se activa varias veces, las páginas se combinan en la misma ventana emergente. Si el hook se activa mientras hay un introPopup activo, o cuando ya se ha activado un tipo diferente de introPopup, se muestra en una ventana emergente aparte después de cerrar la existente.

### introPopupCareer

introPopupCareer es una ventana emergente fácil de usar pero abierta, que admite incrustar HTML si es necesario.

Las variantes (flavours) controlan qué botones se muestran y la relación de aspecto predeterminada de la imagen. Existen cuatro variantes:

* `default`
  * Relación de aspecto predeterminada de la imagen: 16x9
  * Botones: Later, Okay
* `welcome`
  * Relación de aspecto predeterminada de la imagen: 16x9
  * Botones: Career Logbook, Okay
* `branch-info`
  * Relación de aspecto predeterminada de la imagen: 16x9
  * Botones: Career Logbook, Okay
* `garage`
  * Botones: Later, Okay
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

  ![El fragmento introPopupCareer mostrado en BeamNG.drive](../../../assets/content/introPopupCareer.png)

</figure>

Si se proporcionan varias páginas, o si el hook se activa varias veces, las páginas se combinan en la misma ventana emergente. Si el hook se activa mientras hay un introPopup activo, o cuando ya se ha activado un tipo diferente de introPopup, se muestra en una ventana emergente aparte después de cerrar la existente.

::: bug
El desenfoque del fondo tiene una altura mínima, lo que provoca que las ventanas emergentes con poco contenido tengan un exceso de desenfoque debajo de su ventana. Existen dos soluciones provisionales principales:

* Repetir `\n` y terminar con `#!html <div />` hasta que la ventana cubra el desenfoque
* Usar una ruta de `image` vacía o inexistente y ajustar la relación de aspecto hasta que la ventana cubra el desenfoque
:::

### introPopupMission

introPopupMission es casi idéntica a introPopupCareer, pero requiere definir los botones en lugar de elegir un preajuste de botones.

Los estilos de botón se combinan como *bng-button-*`style`. Los estilos de botón integrados son:

* `main` - naranja
* `secondary` - cian
* `attention` - rojo
* `white` - blanco
* `link`  - translúcido
* `outline` - contorno naranja
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

  ![El fragmento introPopupMission mostrado en BeamNG.drive](../../../assets/content/introPopupMission.png)

</figure>

Si se proporcionan varias páginas, o si el hook se activa varias veces, las páginas se combinan en la misma ventana emergente. Si el hook se activa mientras hay un introPopup activo, o cuando ya se ha activado un tipo diferente de introPopup, se muestra en una ventana emergente aparte después de cerrar la existente.

::: bug
El desenfoque del fondo tiene una altura mínima, lo que provoca que las ventanas emergentes con poco contenido tengan un exceso de desenfoque debajo de su ventana. Existen dos soluciones provisionales principales:

* Repetir `\n` y terminar con `#!html <div />` hasta que la ventana cubra el desenfoque
* Usar una ruta de `image` vacía o inexistente y ajustar la relación de aspecto hasta que la ventana cubra el desenfoque
:::

### Dialogue

Dialogue se usa en la campaña *A Rocky Start* para mostrar información sobre una misión. Es una ventana emergente centrada y alineada verticalmente, con un diseño específico. No admite HTML incrustado.
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

  ![El fragmento Dialogue mostrado en BeamNG.drive](../../../assets/content/Dialogue.png)

</figure>

Solo se puede mostrar un Dialogue a la vez. Cualquier Dialogue existente se sobrescribe.

::: info
Hay que usar `#!lua ui_missionInfo.closeDialogue()` para cerrar un diálogo.

Asegúrate de llamar a esta función cuando se pulse cualquier botón.
:::
