---
description: "Crea una aplicación de IU para BeamNG.drive: los cuatro archivos que necesita, un ejemplo completo con HTML, JavaScript, Lua, CSS y JSON, y las funciones que ofrece el juego."
---
# Aplicaciones de IU (HTML)

Para crear una aplicación de IU necesitas algunos conocimientos del framework AngularJS. Su documentación es la [guía de AngularJS](https://docs.angularjs.org/guide).

## Estructura de archivos

Una aplicación de IU necesita cuatro archivos importantes para funcionar:
- app.js | Contiene el código principal que usa la aplicación de IU [Documentación de Javascript](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
- app.html | El código que muestra tu aplicación [Documentación de HTML](https://developer.mozilla.org/en-US/docs/Web/HTML)
- app.json | Contiene la información de la aplicación de IU
- app.png | El archivo de imagen que aparece en el selector de aplicaciones

### Estilos de tu aplicación
Recomendamos usar la etiqueta ``<style>`` para dar estilo a tu aplicación. Un archivo .css también funciona, pero no podrás ver los cambios en tiempo real.

## Ejemplo

Este ejemplo es de DanielW. Gracias a él.

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
Aquí puedes ver una etiqueta ``<span>`` que muestra la marcha de tu vehículo, un campo de entrada que se usa para enviar un mensaje a la función ``sendMessage()`` del Javascript y una etiqueta ``<li>`` repetida que usa <b>ng-repeat</b> sobre la variable ``messages`` ubicada en el Javascript

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
Fíjate en el uso de <b>$scope</b>. Es muy importante, porque tendrás que definir tus variables y funciones dentro de <b>$scope</b> para poder acceder a ellas desde el <b>Html</b>, dentro de cualquier etiqueta <b>ng-*</b>.
Así, en este ejemplo, después de que la función ``sendMessage()`` se ejecute desde el <b>Html</b>, enviará el mensaje a un archivo lua ubicado en el directorio extensions del mod y ejecutará la función ``modifyMessage()`` dentro de ese archivo lua.

Un ejemplo de cómo podría verse la parte de lua:
```lua
local function modifyMessage(message)
    message = message .. " [Modified!]"
    guihooks.trigger('MessageReady', message)
end
```
^ Esta es una versión simplificada del lua, solo para mostrar la función

Lo principal aquí es el uso de <b>guihooks.trigger</b>, que dispara un evento de AngularJS definido con ``$scope.$on()``. Como puedes ver al final del archivo Javascript, el evento se llama MessageReady y lo ejecutará la función <b>guihooks.trigger</b> con el contenido del mensaje (payload); después se añadirá a la variable ``$scope.messages`` para que la etiqueta li lo muestre mediante <b>ng-repeat</b> en el archivo <b>Html</b>

El archivo lua completo está justo debajo

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
¡Ten en cuenta que es muy importante devolver la variable M (el módulo) con las funciones necesarias dentro!
Por ejemplo, sin la línea ``M.modifyMessage = modifyMessage``, la función ``bngApi.engineLua('extensions.exampleMod.modifyMessage("' + $scope.message + '")')`` no podrá encontrar la función modifyMessage()


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
La directiva debe ser la misma que en el archivo <b>Javascript</b>

## Funciones de JavaScript que ofrece BeamNG para las aplicaciones de IU
```js
bngApi.engineLua("lua_path.function()")
```
Útil para ejecutar una función lua con o sin argumentos

## Funciones de Lua que ofrece BeamNG para las aplicaciones de IU
```lua
guihooks.trigger("EventName", Payload)
```
El payload puede ser de cualquier tipo, pero es mejor mantenerlo como un Array / Objeto o una cadena de texto para que no se pierda.

<b>IMPORTANTE</b> : A veces puede ocurrir que el nombre de evento que uses ya lo utilice internamente otra cosa y cause problemas. Por ejemplo, si tu aplicación se llama Nickel, es una buena práctica nombrar todos tus eventos de Angular como NKEventName en lugar de EventName

