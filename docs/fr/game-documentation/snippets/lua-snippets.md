---
description: "Extraits Lua BeamNG.drive prêts à l'emploi : dessiner un marqueur, détecter des véhicules, et afficher des notifications, messages, affichages flash, boîtes de confirmation et popups de tutoriel."
---
# Extraits de code Lua

Des extraits pour BeamNG.drive que vous pouvez copier et adapter.

## Monde

### Dessiner un marqueur et détecter des véhicules

Dessiner des marqueurs sur la carte peut être un excellent moyen d'indiquer au joueur qu'une interaction est possible à cet endroit.

Dessiner un marqueur est relativement simple. Voici un exemple basé sur le marqueur utilisé pour les lignes de bus :
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
Voici un exemple de marqueur personnalisé provenant de [BeamNG-FuelStations](https://github.com/BeamMP/BeamNG-FuelStations/tree/master) :
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
## Interface utilisateur

### Notifications toast, en haut à droite de l'écran

<figure class="image image_resized" style="width:75%">

  ![image](https://github.com/StanleyDudek/Docs/assets/49531350/c8a87842-b95a-4eca-84dc-93072ecc9158)

</figure>
```lua
--guihooks.trigger('toastrMsg', {type, title, msg, config = {timeOut}}) 
guihooks.trigger('toastrMsg', {type = "info", title = "Info Message:", msg = "Info Message Text Here", config = {timeOut = 5000}}) 
guihooks.trigger('toastrMsg', {type = "warning", title = "Warning Message:", msg = "Warning Message Text Here", config = {timeOut = 5000}}) 
guihooks.trigger('toastrMsg', {type = "error", title = "Error Message:", msg = "Error Message Text Here", config = {timeOut = 5000}}) 
```
### Notifications de message, en haut à gauche par défaut dans l'application Messages

Cela nécessite l'application UI « Messages » ou « Messages & Tasks ». Les icônes se trouvent dans `ui\ui-vue\src\assets\fonts\bngIcons\svg\`

<figure class="image image_resized" style="width:75%">

  ![image](https://github.com/StanleyDudek/Docs/assets/49531350/6baef813-50cb-43c3-9c59-0de550b014b6)

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
### Affichage flash au centre, grand ou petit

<figure class="image image_resized" style="width:75%">

  ![image](https://github.com/StanleyDudek/Docs/assets/49531350/d0cf754f-83f8-4d15-9159-27350da127de)

</figure>

<figure class="image image_resized" style="width:75%">

  ![image](https://github.com/StanleyDudek/Docs/assets/49531350/1df6fc9b-756f-484e-b8d9-5df346dc4c26)

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
### Affichage permanent de taille moyenne au centre

Cela nécessite l'application UI « Race Realtime Display ».

<figure class="image image_resized" style="width:75%">

  ![image](https://github.com/StanleyDudek/Docs/assets/49531350/6290e018-6b3d-4674-98f2-34282a723258)

</figure>
```lua
--guihooks.trigger('ScenarioRealtimeDisplay', {msg = msg} ) -- requires Race Realtime Display ui app
guihooks.trigger('ScenarioRealtimeDisplay', {msg = "Message Text Here"} )
--these messages persist, clear with a blank string
--if you are running live data, this is a good one to update rapidly (think timers, distance calcs, et cetera)
guihooks.trigger('ScenarioRealtimeDisplay', {msg = ""} )
```
### Boîte de confirmation

ConfirmationDialog est une fenêtre contextuelle simple, avec jusqu'à deux boutons.
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

  ![Exemple de ConfirmationDialog](../../../assets/content/ConfirmationDialog.png)

</figure>

Les deux champs d'un bouton doivent être des chaînes de caractères pour que le bouton soit affiché.

Si le bouton Okay est fourni, l'action *OK / Action principale* équivaut à appuyer sur le bouton Okay.

Si le bouton Cancel est fourni, l'action *Menu* équivaut à appuyer sur le bouton Cancel.

Le HTML est pris en charge et peut servir, par exemple, à ajouter des images ou des icônes.

Plusieurs boîtes peuvent être affichées en même temps ; elles s'affichent alors l'une après l'autre.

::: bug
Ne fournir aucun bouton empêche le joueur de quitter la boîte de dialogue sans utiliser la console.
:::

::: bug
Les éléments SDF de l'application UI Minimap restent visibles tant qu'une ConfirmationDialog est active.

Vous pouvez contourner le problème avec `#!lua guihooks.trigger('ShowApps', false)`, qui masque les applications UI.
:::

<figure class="image image_resized" style="width:75%">

  ![ConfirmationDialog utilisée pour un système d'expulsion en cas d'inactivité](../../../assets/content/ConfirmationDialog_Example.png)

</figure>

### introPopupTutorial

introPopupTutorial est une fenêtre contextuelle très personnalisable, définie en grande partie par du HTML intégré. Il est courant de la charger depuis un fichier HTML indépendant situé dans `/gameplay/tutorials/pages/*/content.html`.
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

  ![L'extrait introPopupTutorial affiché dans BeamNG.drive](../../../assets/content/introPopupTutorial.png)

</figure>

`flavour` détermine les boutons affichés. Il existe quatre variantes :

* `withLogbook`
    * Boutons : Career Logbook, Okay
* `onlyOk`
    * Boutons : Okay
* `onlyLogbook`
    * Boutons : Career Logbook
* `noButtons`
    * Aucun bouton

::: warning
Avec la variante noButtons, si le contenu de la page ne contient aucun JavaScript supplémentaire pour fermer la fenêtre, le joueur reste bloqué. Dans cette variante, les pages ne sont pas regroupées dans une seule fenêtre. Son utilisation n'est pas recommandée.
:::

Si plusieurs pages sont fournies, ou si le hook est déclenché plusieurs fois, les pages sont regroupées dans la même fenêtre. Si le hook est déclenché alors qu'un introPopup est actif, ou qu'un autre type d'introPopup a déjà été déclenché, il est affiché dans une fenêtre séparée après la fermeture de la fenêtre existante.

### introPopupCareer

introPopupCareer est une fenêtre contextuelle facile à utiliser mais très flexible, qui permet d'intégrer du HTML si nécessaire.

La variante (flavour) détermine les boutons affichés et le rapport d'aspect par défaut de l'image. Il existe quatre variantes :

* `default`
  * Rapport d'aspect par défaut de l'image : 16x9
  * Boutons : Later, Okay
* `welcome`
  * Rapport d'aspect par défaut de l'image : 16x9
  * Boutons : Career Logbook, Okay
* `branch-info`
  * Rapport d'aspect par défaut de l'image : 16x9
  * Boutons : Career Logbook, Okay
* `garage`
  * Boutons : Later, Okay
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

  ![L'extrait introPopupCareer affiché dans BeamNG.drive](../../../assets/content/introPopupCareer.png)

</figure>

Si plusieurs pages sont fournies, ou si le hook est déclenché plusieurs fois, les pages sont regroupées dans la même fenêtre. Si le hook est déclenché alors qu'un introPopup est actif, ou qu'un autre type d'introPopup a déjà été déclenché, il est affiché dans une fenêtre séparée après la fermeture de la fenêtre existante.

::: bug
Le flou d'arrière-plan a une hauteur minimale : les fenêtres au contenu court ont donc un excès de flou sous leur fenêtre. Il existe deux solutions de contournement principales :

* Répéter `\n` et terminer par `#!html <div />` jusqu'à ce que la fenêtre couvre le flou
* Utiliser un chemin `image` vide ou manquant et ajuster le rapport d'aspect jusqu'à ce que la fenêtre couvre le flou
:::

### introPopupMission

introPopupMission est presque identique à introPopupCareer, mais il faut définir les boutons au lieu de choisir un préréglage.

Les styles de bouton se combinent sous la forme *bng-button-*`style`. Les styles de bouton intégrés sont :

* `main` - orange
* `secondary` - cyan
* `attention` - rouge
* `white` - blanc
* `link`  - translucide
* `outline` - contour orange
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

  ![L'extrait introPopupMission affiché dans BeamNG.drive](../../../assets/content/introPopupMission.png)

</figure>

Si plusieurs pages sont fournies, ou si le hook est déclenché plusieurs fois, les pages sont regroupées dans la même fenêtre. Si le hook est déclenché alors qu'un introPopup est actif, ou qu'un autre type d'introPopup a déjà été déclenché, il est affiché dans une fenêtre séparée après la fermeture de la fenêtre existante.

::: bug
Le flou d'arrière-plan a une hauteur minimale : les fenêtres au contenu court ont donc un excès de flou sous leur fenêtre. Il existe deux solutions de contournement principales :

* Répéter `\n` et terminer par `#!html <div />` jusqu'à ce que la fenêtre couvre le flou
* Utiliser un chemin `image` vide ou manquant et ajuster le rapport d'aspect jusqu'à ce que la fenêtre couvre le flou
:::

### Dialogue

Dialogue est utilisé dans la campagne *A Rocky Start* pour afficher des informations sur une mission. C'est une fenêtre contextuelle centrée, alignée verticalement, avec une mise en page spécifique. Elle ne prend pas en charge le HTML intégré.
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

  ![L'extrait Dialogue affiché dans BeamNG.drive](../../../assets/content/Dialogue.png)

</figure>

Un seul Dialogue peut être affiché à la fois. Tout Dialogue existant est remplacé.

::: info
`#!lua ui_missionInfo.closeDialogue()` doit être utilisé pour fermer un dialogue.

Appelez cette fonction dès qu'un bouton est pressé.
:::
