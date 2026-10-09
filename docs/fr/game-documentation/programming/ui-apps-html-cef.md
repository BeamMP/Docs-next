---
description: "Créez une application UI pour BeamNG.drive : les quatre fichiers nécessaires, un exemple complet en HTML, JavaScript, Lua, CSS et JSON, et les fonctions fournies par le jeu."
---
# Applications UI (HTML)

Pour créer une application UI, vous avez besoin de quelques connaissances du framework AngularJS. Sa documentation est le [guide AngularJS](https://docs.angularjs.org/guide).

## Structure des fichiers

Une application UI a besoin de quatre fichiers importants pour fonctionner :
- app.js | Contient le code principal utilisé par l'application UI [documentation Javascript](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
- app.html | Le code qui affiche votre application [documentation HTML](https://developer.mozilla.org/en-US/docs/Web/HTML)
- app.json | Contient les informations de l'application UI
- app.png | Le fichier image affiché dans le sélecteur d'applications

### Mettre en forme votre application
Nous recommandons d'utiliser la balise ``<style>`` pour mettre en forme votre application. Un fichier .css fonctionne aussi, mais vous ne pourrez pas voir les modifications en temps réel.

## Exemple

Cet exemple est de DanielW. Merci à lui.

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
Vous pouvez voir ici une balise ``<span>`` qui affiche le rapport engagé de votre véhicule, un champ de saisie servant à envoyer un message à la fonction ``sendMessage()`` du Javascript, et une balise ``<li>`` répétée grâce à <b>ng-repeat</b> sur la variable ``messages`` située dans le Javascript.

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
Notez l'utilisation de <b>$scope</b>. C'est très important, car vous devez définir vos variables et vos fonctions dans <b>$scope</b> pour pouvoir y accéder depuis le <b>HTML</b>, dans n'importe quelle balise <b>ng-*</b>.
Ainsi, dans cet exemple, une fois la fonction ``sendMessage()`` exécutée depuis le <b>HTML</b>, le message est envoyé à un fichier Lua situé dans le dossier des extensions du mod, et la fonction ``modifyMessage()`` de ce fichier Lua est exécutée.

Voici un exemple de ce à quoi pourrait ressembler le côté Lua :
```lua
local function modifyMessage(message)
    message = message .. " [Modified!]"
    guihooks.trigger('MessageReady', message)
end
```
^ Il s'agit d'une version simplifiée du Lua, pour montrer uniquement la fonction.

L'élément important ici est l'utilisation de <b>guihooks.trigger</b>, qui déclenche un événement AngularJS défini avec ``$scope.$on()``. Comme vous pouvez le voir tout en bas du fichier Javascript, l'événement s'appelle MessageReady. Il est exécuté par la fonction <b>guihooks.trigger</b> avec le message en charge utile, puis ajouté à la variable ``$scope.messages`` pour être affiché par la balise li utilisant <b>ng-repeat</b> dans le fichier <b>HTML</b>.

Le fichier Lua complet se trouve juste en dessous.

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
Notez qu'il est très important de renvoyer la variable M (le module) avec les fonctions nécessaires à l'intérieur !
Par exemple, sans la ligne ``M.modifyMessage = modifyMessage``, la fonction ``bngApi.engineLua('extensions.exampleMod.modifyMessage("' + $scope.message + '")')`` ne pourra pas trouver la fonction modifyMessage().


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
La directive doit être identique à celle du fichier <b>Javascript</b>.

## Fonctions JavaScript fournies par BeamNG pour les applications UI
```js
bngApi.engineLua("lua_path.function()")
```
Utile pour exécuter une fonction Lua, avec ou sans arguments.

## Fonctions Lua fournies par BeamNG pour les applications UI
```lua
guihooks.trigger("EventName", Payload)
```
La charge utile peut être de n'importe quel type, mais il vaut mieux la garder sous forme de tableau / objet ou de chaîne de caractères pour ne pas la perdre.

<b>IMPORTANT</b> : il arrive que le nom d'événement que vous utilisez soit déjà utilisé en interne par autre chose et cause des problèmes. Par exemple, si votre application s'appelle Nickel, il est recommandé de préfixer chacun de vos événements Angular, par exemple NKEventName au lieu de EventName.

