---
description: "制作 BeamNG.drive 图形界面应用程序：它需要的四个文件、包含 HTML、JavaScript、Lua、CSS 和 JSON 的完整示例，以及游戏提供的函数。"
---
# 图形界面应用程序（HTML）

要制作图形界面应用程序，你需要对 AngularJS 框架有一定了解。它的文档是 [AngularJS 指南](https://docs.angularjs.org/guide)。

## 文件结构

一个图形界面应用程序需要四个重要的文件才能工作：
- app.js | 包含图形界面应用程序所用的主要代码 [Javascript 文档](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
- app.html | 用于显示你的应用的代码 [HTML 文档](https://developer.mozilla.org/en-US/docs/Web/HTML)
- app.json | 包含图形界面应用程序的信息
- app.png | 显示在应用选择器中的图像文件

### 为你的应用设置样式
我们建议使用 ``<style>`` 标签来设置应用的样式。使用 .css 文件也可以，但你将无法实时看到修改效果。

## 示例

这个示例由 DanielW 提供，感谢他。

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
在这里，你可以看到一个显示车辆当前挡位的 ``<span>`` 标签、一个用来把消息发送给 Javascript 中 ``sendMessage()`` 函数的输入框，以及一个在 Javascript 中的 ``messages`` 变量上使用 <b>ng-repeat</b> 的重复 ``<li>`` 标签。

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
请注意 <b>$scope</b> 的用法，这一点非常重要，因为你需要在 <b>$scope</b> 中定义变量和函数，才能在 <b>Html</b> 里任何 <b>ng-*</b> 标签内访问它们。
所以在这个示例中，``sendMessage()`` 函数从 <b>Html</b> 中执行后，会把消息发送给模组 extensions 目录中的一个 lua 文件，并执行该 lua 文件里的 ``modifyMessage()`` 函数。

下面是 lua 一侧大致的样子：
```lua
local function modifyMessage(message)
    message = message .. " [Modified!]"
    guihooks.trigger('MessageReady', message)
end
```
^ 这是 lua 的简化版本，只是为了展示这个函数

这里的重点是 <b>guihooks.trigger</b> 的用法：它会触发一个由 ``$scope.$on()`` 定义的 AngularJS 事件。正如你在 Javascript 文件最底部看到的，这个事件名为 MessageReady，会由 <b>guihooks.trigger</b> 函数连同消息内容一起触发，然后被推入 ``$scope.messages`` 变量，再由 <b>Html</b> 文件中使用 <b>ng-repeat</b> 的 li 标签显示出来。

完整的 lua 文件如下

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
请注意，务必要返回包含所需函数的 M（模块）变量！
例如，如果没有 ``M.modifyMessage = modifyMessage`` 这一行，``bngApi.engineLua('extensions.exampleMod.modifyMessage("' + $scope.message + '")')`` 函数就找不到 modifyMessage() 函数。


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
这里的 directive 必须与 <b>Javascript</b> 文件中的一致。

## BeamNG 为图形界面应用程序提供的 JavaScript 函数
```js
bngApi.engineLua("lua_path.function()")
```
可用于运行带参数或不带参数的 lua 函数。

## BeamNG 为图形界面应用程序提供的 Lua 函数
```lua
guihooks.trigger("EventName", Payload)
```
载荷可以是任意类型，但最好使用数组 / 对象或字符串，以免丢失。

<b>重要</b>：有时你使用的事件名可能已经被其他内部功能占用，从而引发问题。例如，如果你的应用名为 Nickel，一个好的做法是把你所有的 Angular 事件命名为 NKEventName，而不是 EventName。
