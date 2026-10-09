---
description: "Готовые фрагменты Lua для BeamNG.drive: отрисовка маркера, обнаружение транспорта, а также всплывающие уведомления, сообщения, вспышки, диалоги подтверждения и обучающие окна."
---
# Фрагменты кода Lua

Фрагменты для BeamNG.drive, которые вы можете копировать и адаптировать.

## Мир

### Отрисовка маркера и обнаружение транспорта

Маркеры на карте — один из лучших способов показать пользователю, что в этом месте можно с чем-то взаимодействовать.

Нарисовать маркер довольно просто. Вот пример того, как отрисовывается маркер маршрута автобуса:
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
Вот пример пользовательского маркера из [BeamNG-FuelStations](https://github.com/BeamMP/BeamNG-FuelStations/tree/master):
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
## Пользовательский интерфейс

### Всплывающие уведомления (toast), в правом верхнем углу экрана

<figure class="image image_resized" style="width:75%">

  ![изображение](https://github.com/StanleyDudek/Docs/assets/49531350/c8a87842-b95a-4eca-84dc-93072ecc9158)

</figure>
```lua
--guihooks.trigger('toastrMsg', {type, title, msg, config = {timeOut}}) 
guihooks.trigger('toastrMsg', {type = "info", title = "Info Message:", msg = "Info Message Text Here", config = {timeOut = 5000}}) 
guihooks.trigger('toastrMsg', {type = "warning", title = "Warning Message:", msg = "Warning Message Text Here", config = {timeOut = 5000}}) 
guihooks.trigger('toastrMsg', {type = "error", title = "Error Message:", msg = "Error Message Text Here", config = {timeOut = 5000}}) 
```
### Уведомления-сообщения, по умолчанию в левом верхнем углу экрана в приложении Messages

Для этого нужно UI-приложение «Messages» или «Messages & Tasks». Значки находятся в `ui\ui-vue\src\assets\fonts\bngIcons\svg\`

<figure class="image image_resized" style="width:75%">

  ![изображение](https://github.com/StanleyDudek/Docs/assets/49531350/6baef813-50cb-43c3-9c59-0de550b014b6)

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
### Вспышка по центру экрана, крупная или мелкая

<figure class="image image_resized" style="width:75%">

  ![изображение](https://github.com/StanleyDudek/Docs/assets/49531350/d0cf754f-83f8-4d15-9159-27350da127de)

</figure>

<figure class="image image_resized" style="width:75%">

  ![изображение](https://github.com/StanleyDudek/Docs/assets/49531350/1df6fc9b-756f-484e-b8d9-5df346dc4c26)

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
### Постоянное окно среднего размера по центру экрана

Для этого нужно UI-приложение «Race Realtime Display».

<figure class="image image_resized" style="width:75%">

  ![изображение](https://github.com/StanleyDudek/Docs/assets/49531350/6290e018-6b3d-4674-98f2-34282a723258)

</figure>
```lua
--guihooks.trigger('ScenarioRealtimeDisplay', {msg = msg} ) -- requires Race Realtime Display ui app
guihooks.trigger('ScenarioRealtimeDisplay', {msg = "Message Text Here"} )
--these messages persist, clear with a blank string
--if you are running live data, this is a good one to update rapidly (think timers, distance calcs, et cetera)
guihooks.trigger('ScenarioRealtimeDisplay', {msg = ""} )
```
### Диалог подтверждения

ConfirmationDialog — простое всплывающее окно не более чем с двумя кнопками.
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

  ![Пример ConfirmationDialog](../../../assets/content/ConfirmationDialog.png)

</figure>

Чтобы кнопка появилась, оба её поля должны быть строками.

Если задана кнопка Okay, нажатие действия *OK / Primary action* равносильно нажатию кнопки Okay.

Если задана кнопка Cancel, нажатие действия *Menu* равносильно нажатию кнопки Cancel.

Поддерживается HTML, с его помощью можно, например, добавлять изображения и значки.

Можно показать сразу несколько диалогов: они отображаются по очереди.

::: bug
Если не задать ни одной кнопки, игрок не сможет закрыть диалог без использования консоли.
:::

::: bug
Элементы SDF UI-приложения Minimap остаются видимыми, пока активен ConfirmationDialog.

В качестве обходного решения можно скрыть UI-приложения с помощью `#!lua guihooks.trigger('ShowApps', false)`.
:::

<figure class="image image_resized" style="width:75%">

  ![ConfirmationDialog, используемый в системе исключения за неактивность](../../../assets/content/ConfirmationDialog_Example.png)

</figure>

### introPopupTutorial

introPopupTutorial — это гибко настраиваемое всплывающее окно, которое в основном определяется встроенным HTML. Обычно его загружают из отдельного HTML-файла, расположенного в `/gameplay/tutorials/pages/*/content.html`.
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

  ![Фрагмент introPopupTutorial в BeamNG.drive](../../../assets/content/introPopupTutorial.png)

</figure>

`flavour` определяет, какие кнопки отображаются. Существует четыре варианта:

* `withLogbook`
    * Кнопки: Career Logbook, Okay
* `onlyOk`
    * Кнопки: Okay
* `onlyLogbook`
    * Кнопки: Career Logbook
* `noButtons`
    * Без кнопок

::: warning
Если использовать вариант noButtons и не добавить в содержимое страницы дополнительный JavaScript для закрытия окна, игра зависнет без возможности продолжить. В этом варианте страницы не объединяются в одно окно. Использовать этот вариант не рекомендуется.
:::

Если передано несколько страниц или хук запускается несколько раз, страницы объединяются в одно окно. Если хук запускается, пока активно окно introPopup, или когда уже был запущен другой тип introPopup, оно отображается в отдельном окне после закрытия существующего.

### introPopupCareer

introPopupCareer — простое в использовании, но гибкое всплывающее окно, которое при необходимости поддерживает встроенный HTML.

Варианты (flavour) определяют, какие кнопки отображаются и каково соотношение сторон изображения по умолчанию. Существует четыре варианта:

* `default`
  * Соотношение сторон изображения по умолчанию: 16x9
  * Кнопки: Later, Okay
* `welcome`
  * Соотношение сторон изображения по умолчанию: 16x9
  * Кнопки: Career Logbook, Okay
* `branch-info`
  * Соотношение сторон изображения по умолчанию: 16x9
  * Кнопки: Career Logbook, Okay
* `garage`
  * Кнопки: Later, Okay
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

  ![Фрагмент introPopupCareer в BeamNG.drive](../../../assets/content/introPopupCareer.png)

</figure>

Если передано несколько страниц или хук запускается несколько раз, страницы объединяются в одно окно. Если хук запускается, пока активно окно introPopup, или когда уже был запущен другой тип introPopup, оно отображается в отдельном окне после закрытия существующего.

::: bug
У размытия фона есть минимальная высота, поэтому у всплывающих окон с коротким содержимым под окном остаётся лишнее размытие. Есть два основных обходных решения:

* Повторять `\n` и закончить `#!html <div />`, пока окно не закроет размытие
* Использовать пустой или отсутствующий путь `image` и подбирать соотношение сторон, пока окно не закроет размытие
:::

### introPopupMission

introPopupMission почти идентично introPopupCareer, но кнопки нужно определять самостоятельно, а не выбирать готовый набор.

Стили кнопок составляются как *bng-button-*`style`. Встроенные стили кнопок:

* `main` — оранжевая
* `secondary` — голубая
* `attention` — красная
* `white` — белая
* `link`  — полупрозрачная
* `outline` — с оранжевым контуром
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

  ![Фрагмент introPopupMission в BeamNG.drive](../../../assets/content/introPopupMission.png)

</figure>

Если передано несколько страниц или хук запускается несколько раз, страницы объединяются в одно окно. Если хук запускается, пока активно окно introPopup, или когда уже был запущен другой тип introPopup, оно отображается в отдельном окне после закрытия существующего.

::: bug
У размытия фона есть минимальная высота, поэтому у всплывающих окон с коротким содержимым под окном остаётся лишнее размытие. Есть два основных обходных решения:

* Повторять `\n` и закончить `#!html <div />`, пока окно не закроет размытие
* Использовать пустой или отсутствующий путь `image` и подбирать соотношение сторон, пока окно не закроет размытие
:::

### Dialogue

Dialogue используется в кампании *A Rocky Start* для показа информации о миссии. Это вертикально выровненное всплывающее окно по центру экрана с определённой раскладкой. Встроенный HTML оно не поддерживает.
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

  ![Фрагмент Dialogue в BeamNG.drive](../../../assets/content/Dialogue.png)

</figure>

Одновременно можно показывать только один Dialogue. Любой существующий Dialogue заменяется новым.

::: info
Чтобы закрыть диалог, нужно использовать `#!lua ui_missionInfo.closeDialogue()`.

Обязательно вызывайте эту функцию при нажатии любой кнопки.
:::
