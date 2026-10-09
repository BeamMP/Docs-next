---
description: "Создание UI-приложения BeamNG.drive: четыре необходимых файла, полный пример на HTML, JavaScript, Lua, CSS и JSON, а также функции, которые предоставляет игра."
---
# UI-приложения (HTML)

Чтобы создать UI-приложение, нужно знать фреймворк AngularJS. Его документация — [руководство AngularJS](https://docs.angularjs.org/guide).

## Структура файлов

Для работы UI-приложения нужны четыре важных файла:
- app.js | Содержит основной код UI-приложения [документация по Javascript](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
- app.html | Код, который отображает ваше приложение [документация по HTML](https://developer.mozilla.org/en-US/docs/Web/HTML)
- app.json | Содержит информацию об UI-приложении
- app.png | Файл изображения, который показывается в селекторе приложений

### Стилизация приложения
Мы рекомендуем стилизовать приложение с помощью тега ``<style>``. Файл .css тоже подойдёт, но вы не сможете видеть изменения в реальном времени.

## Пример

Этот пример написал DanielW. Благодарим его.

ui\modules\apps\ExampleApp\app.html
```html
<div style="width: 100%; height: 100%;" class="bngApp">
    <link type="text/css" rel="stylesheet" href="/ui/modules/apps/ExampleApp/app.css" />

    <div id="exampleAppContainer">
        <span>Gear: <span>{{ gearName }}</span></span>

        <div layout="row" layout-align="center center">
            <md-input-container flex>
                <label>Input</label>
                <input ng-model="message" ng-keydown="sendMessage($event)">
            </md-input-container>

            <md-button md-no-ink class="md-warn" ng-disabled="!message" ng-click="sendMessage()">Send</md-button>
        </div>

        <span style="display: block">Messages:</span>

        <!-- Scroll Area -->
        <ul bng-nav-scroll style="margin: 0; padding: 0; overflow-y: auto; width: 100%; height: 100%; background-color: #37373740;">

            <!-- Iterate over the messages and display them -->
            <li ng-repeat="message in messages track by $index" style="display: flex; align-items: center; height: 35px;">
                <span style="padding: 0 0.2em; width: 100%;">{{ message }}</span>
        
                <!-- Button to delete the message, this calls the `deleteMessage` function in `app.js` -->
                <md-button md-no-ink class="md-icon-button md-warn" ng-click="deleteMessage($index)">
                    <md-icon class="material-icons">delete</md-icon>
                </md-button>
            </li>
        </ul>        
    </div>
</div>
```
Здесь вы видите тег ``<span>``, который показывает передачу вашего транспорта, поле ввода, с помощью которого сообщение отправляется в функцию ``sendMessage()`` в Javascript, и повторяющийся тег ``<li>``, использующий <b>ng-repeat</b> для переменной ``messages`` из Javascript

ui\modules\apps\ExampleApp\app.js
```js
angular.module('beamng.apps')
.directive('exampleApp', [function() {
    return {
        templateUrl: '/ui/modules/apps/ExampleApp/app.html',
        replace: true,
        restrict: 'EA',
        scope: true,

        controller: ['$scope', function($scope) {
            $scope.gearName = '0'
            $scope.message  = ''
            $scope.messages = []

            // Setup the streams we want. For now, we only want the engine information. You can add more, you'll just have to look around to find the different streams
            let steamList = ['engineInfo']
            StreamsManager.add(steamList)

            $scope.$on('destroy', function() {
                StreamsManager.remove(steamList)
            })

            // Do I even need to put this comment here explaining what this function does?
            // Well, I have done it for a lot of other things when they weren't needed. I'll leave this one be...
            $scope.$on('streamsUpdate', function(event, streams) {
                if (!streams.engineInfo) // Early return... You probably noticed that without this useless comment though
                    return;

                // `lua/vehicle/controller/vehicleController.lua:538` (or use console.log)
                let gear = streams.engineInfo[5]

                // Update the gear name in HTML if needed
                if ($scope.gearName !== gear)
                    $scope.gearName = gear
            })

            $scope.sendMessage = function(event) {
                if (event && event.key !== 'Enter')
                    return

                if ($scope.message == '')
                    return

                // Forward the message to the Lua extension to modify it
                bngApi.engineLua('extensions.exampleMod.modifyMessage("' + $scope.message + '")')
                $scope.message = ''
            }

            $scope.deleteMessage = function(idx) {
                $scope.messages.splice(idx, 1)
            }

            // The `modifyMessage` function will call this hook with the modified data
            $scope.$on('MessageReady', function(_, modifiedMessage) {
                $scope.messages.push(modifiedMessage)
            });
        }]
    }
}])
```
Обратите внимание на использование <b>$scope</b>. Это очень важно: переменные и функции нужно определять внутри <b>$scope</b>, чтобы иметь к ним доступ из <b>Html</b> внутри любого тега <b>ng-*</b>.
Так, в этом примере после выполнения функции ``sendMessage()`` из <b>Html</b> сообщение отправляется в lua-файл, расположенный в каталоге extensions мода, и в этом lua-файле выполняется функция ``modifyMessage()``.

Пример того, как может выглядеть сторона lua:
```lua
local function modifyMessage(message)
    message = message .. " [Modified!]"
    guihooks.trigger('MessageReady', message)
end
```
^ Это упрощённая версия lua, чтобы показать только саму функцию

Главное здесь — использование <b>guihooks.trigger</b>, которая запускает событие AngularJS, определённое с помощью ``$scope.$on()``. Как видно в самом низу файла Javascript, событие называется MessageReady. Его выполняет функция <b>guihooks.trigger</b> с полезной нагрузкой в виде сообщения, после чего оно добавляется в переменную ``$scope.messages`` и отображается тегом li с <b>ng-repeat</b> в файле <b>Html</b>

Полный lua-файл приведён ниже

lua\ge\extensions\exampleMod.lua
```lua
local M = {}

--[[
    This is the entry point of our extension, this is what the game loads from our `modScript.lua`.
    In the modScript file, you can load more extensions and put them in the same directory as this file.

    In this file, we will communicate with the following:
      1. Our vehicle extension. That extension tells this extension when to send it data, and we send it. Take a look at `vehicle/extensions/auto/exampleVehicleExtension.lua`
      2. Input. Take a look at `core/input/actions/myActions.json`. When the bounded key is pressed, it will call `onActionKeyDown` (a function we export below)
]]

-- Game Function Hooks
--------------------------------------------
local function onExtensionLoaded()
    log('D', "onExtensionLoaded", "Called")
end

local function onExtensionUnloaded()
    log('D', "onExtensionUnloaded", "Called")
end

-- Custom Functions
--------------------------------------------
local function onActionKeyDown()
    log('D', "onActionKeyDown", "Pressed!")
end

local function onVehicleExtensionLoaded(vehID)
    log('D', "onVehicleExtensionLoaded", "Sending some data to the vehicle")

    local veh = be:getObjectByID(vehID) -- If you don't have the ID, you can also use `be:getPlayerVehicle(0)` to get the current vehicle.
    if not veh then return end -- The usual error checking

    local data = {
        ["name"] = "Daniel W"
    }

    veh:queueLuaCommand("extensions.exampleVehicleExtension.onDataReceived('" .. jsonEncode(data) .. "')")
end

local function modifyMessage(message)
    message = message .. " [Modified!]"
    guihooks.trigger('MessageReady', message)
end

-- Export Interface
--------------------------------------------
M.onExtensionLoaded        = onExtensionLoaded
M.onExtensionUnloaded      = onExtensionUnloaded

M.onActionKeyDown          = onActionKeyDown
M.onVehicleExtensionLoaded = onVehicleExtensionLoaded
M.modifyMessage            = modifyMessage

--[[ Other functions could include:
      - onPreRender(dtReal, dtSim, dtRaw)
      - onUpdate(dtReal, dtSim, dtRaw)
      - onClientPreStartMission(levelPath)
      - onClientPostStartMission(levelPath)

    To find all of these, search the following in `BeamNG.Drive/lua`: `extensions.hook(`
--]]

return M
```
Обратите внимание: очень важно возвращать переменную M (модуль) с нужными функциями внутри!
Например, без строки ``M.modifyMessage = modifyMessage`` функция ``bngApi.engineLua('extensions.exampleMod.modifyMessage("' + $scope.message + '")')`` не сможет найти функцию modifyMessage()


ui\modules\apps\ExampleApp\app.css
```css
#exampleAppContainer {
    width: 100%;
    height: 100%;

    display: flex;
    flex-direction: column;
    align-items: center;
    align-content: center;
}

#exampleAppContainer > * {
    margin: 0;
    padding: 0;
}
```
ui\modules\apps\ExampleApp\app.json
```json
{
  "domElement": "<example-app></example-app>",
  "name": "Example App",
  "types": [
    "ui.apps.categories.debug"
  ],
  "description": "example-app",
  "css": {
    "left": "0px",
    "height": "auto",
    "width": "270px",
    "min-width": "200px",
    "min-height": "90px",
    "top": "0px"
  },
  "author": "Daniel W",
  "version": "0.1",
  "directive": "exampleApp"
}
```
Директива должна совпадать с директивой в файле <b>Javascript</b>

## Функции JavaScript, которые BeamNG предоставляет для UI-приложений
```js
bngApi.engineLua("lua_path.function()")
```
Удобно для запуска функции lua с аргументами или без них

## Функции Lua, которые BeamNG предоставляет для UI-приложений
```lua
guihooks.trigger("EventName", Payload)
```
Полезной нагрузкой могут быть данные любого типа, но лучше использовать массив / объект или строку, чтобы данные не потерялись.

<b>ВАЖНО</b> : иногда имя события, которое вы используете, уже занято чем-то внутри игры и вызывает проблемы. Поэтому, например, если ваше приложение называется Nickel, хорошей практикой будет называть каждое своё событие Angular как NKEventName вместо EventName
