---
description: "Crea un'app UI per BeamNG.drive: i quattro file necessari, un esempio completo con HTML, JavaScript, Lua, CSS e JSON, e le funzioni fornite dal gioco."
---
# App UI (HTML)

Per creare un'app UI servono alcune conoscenze del framework AngularJS. La sua documentazione è la [guida di AngularJS](https://docs.angularjs.org/guide).

## Struttura dei file

Un'app UI ha bisogno di quattro file importanti per funzionare:
- app.js | Contiene il codice principale usato dall'app UI [Documentazione JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
- app.html | Il codice che mostra la tua app [Documentazione HTML](https://developer.mozilla.org/en-US/docs/Web/HTML)
- app.json | Contiene le informazioni dell'app UI
- app.png | Il file immagine mostrato nel selettore delle app

### Dare stile alla tua app
Consigliamo di usare il tag ``<style>`` per dare stile alla tua app. Funziona anche un file .css, ma non potrai vedere le modifiche in tempo reale.

## Esempio

Questo esempio è di DanielW. Lo ringraziamo.

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
Qui puoi vedere un tag ``<span>`` che mostra la marcia del tuo veicolo, un input usato per inviare un messaggio alla funzione ``sendMessage()`` nel JavaScript e un tag ``<li>`` ripetuto che usa <b>ng-repeat</b> sulla variabile ``messages`` presente nel JavaScript

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
Nota l'uso di <b>$scope</b>. È molto importante, perché devi definire le tue variabili e funzioni dentro <b>$scope</b> per potervi accedere dall'<b>Html</b> all'interno di qualsiasi tag <b>ng-*</b>.
Quindi, in questo esempio, dopo che la funzione ``sendMessage()`` viene eseguita dall'<b>Html</b>, il messaggio viene inviato a un file lua che si trova nella cartella extensions della mod, e viene eseguita la funzione ``modifyMessage()`` all'interno di quel file lua.

Un esempio di come potrebbe essere il lato lua:
```lua
local function modifyMessage(message)
    message = message .. " [Modified!]"
    guihooks.trigger('MessageReady', message)
end
```
^ Questa è una versione semplificata del lua, solo per mostrare la funzione

Il punto centrale qui è l'uso di <b>guihooks.trigger</b>, che scatena un evento AngularJS definito con ``$scope.$on()``. Come puoi vedere in fondo al file JavaScript, l'evento si chiama MessageReady e viene eseguito dalla funzione <b>guihooks.trigger</b> con il messaggio come payload, che poi viene inserito nella variabile ``$scope.messages`` per essere mostrato dal tag li che usa <b>ng-repeat</b> nel file <b>Html</b>

Il file lua completo è subito qui sotto

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
Nota che è molto importante restituire la variabile M (il modulo) con le funzioni necessarie al suo interno!
Per esempio, senza la riga ``M.modifyMessage = modifyMessage``, la funzione ``bngApi.engineLua('extensions.exampleMod.modifyMessage("' + $scope.message + '")')`` non riuscirà a trovare la funzione modifyMessage()


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
La directive deve essere la stessa del file <b>JavaScript</b>

## Funzioni JavaScript fornite da BeamNG per le app UI
```js
bngApi.engineLua("lua_path.function()")
```
Utile per eseguire una funzione lua con o senza argomenti

## Funzioni Lua fornite da BeamNG per le app UI
```lua
guihooks.trigger("EventName", Payload)
```
Il payload può essere di qualsiasi tipo, ma è meglio tenerlo come Array / Object o come stringa, per non perderlo.

<b>IMPORTANTE</b> : a volte può capitare che il nome dell'evento che usi sia già usato internamente da qualcos'altro e causi problemi. Per esempio, se la tua app si chiama Nickel, è una buona pratica dare a ogni tuo evento Angular un nome come NKEventName invece di EventName
