---
description: "创建 BeamMP 插件：Resources 文件夹的布局、服务器端 Lua 示例、客户端 Lua 扩展，以及用来加载它的 modScript.lua。"
---
# 模组与资源制作

本页介绍 BeamMP 插件的文件夹布局，以及它所需的每个文件的一个可运行的小示例。完整的函数和事件列表，请参阅[脚本参考](/zh/developers/beammp-scripting/)。

## 文件夹结构和文件基础

文件夹和文件结构如下所示：
```
Resources/
├─ Client/
│  └─ examplePlugin.zip/
│     ├─ scripts/
│     │  └─ modScript.lua
│     └─ lua/
│        └─ ge/
│           └─ extensions/
│              └─ examplePlugin.lua
└─ Server/
   └─ examplePlugin/
      ├─ examplePlugin.lua
      └─ further_lua/
         └─ further.lua
```
- 服务器端 Lua 是最低限度的要求。如果你想添加自定义事件，还至少需要一个客户端 Lua 文件和一个 `modScript.lua`。
- `Server` 文件夹中，每个服务器端插件对应一个子文件夹。比较好的做法是只有一个主 Lua 文件，并把其他 Lua 文件放在子文件夹中。这并不是强制要求：如果有多个 Lua 文件，服务器会按字母顺序加载它们。
- `Client` 文件夹存放会发送给客户端的 zip 文件，客户端会把它们作为模组加载。`Client` 中的任何其他文件都会在服务器启动时导致错误，除此之外会被忽略。
- BeamNG 会读取 `modScript.lua`，它告诉游戏要加载哪个插件。

你可以下载一个示例：[examplePlugin.zip](/assets/content/ResourcesForExamplePlugin.zip)。

## 服务器端 Lua

示例插件中还有更多示例。下面是一个非常基础的示例，它会打印玩家的标识信息：
```lua
function onInit() --runs when plugin is loaded

	MP.RegisterEvent("onPlayerAuth", "onPlayerAuth") --Provided by BeamMP

	print("examplePlugin loaded")
end

--A player has authenticated and is requesting to join
--The player's name (string), forum role (string), guest account (bool), identifiers (table -> ip, beammp)
function onPlayerAuth(player_name, role, isGuest, identifiers)
	local ip = identifiers.ip
	local beammp = identifiers.beammp or "N/A"
	print("onPlayerAuth: player_name: " .. player_name .. " | role: " .. role .. " | isGuest: " .. tostring(isGuest) .. " | identifiers: ip: " .. ip .. " - beammp: " .. beammp)
end
```
`onPlayerAuth` 会在玩家想要加入时立即运行。请参阅[脚本参考中的 onPlayerAuth](/zh/developers/beammp-scripting/server/latest#onplayerauth)。

另一个示例使用 `onPlayerAuth` 来拒绝访客。你返回的消息会显示给玩家：
```lua
function onPlayerAuth(playerName, playerRole, isGuest, identifiers)
  if isGuest then
    return "No guests allowed, please use a BeamMP account"
  end
end
```
你可以在服务器上使用的更多函数，请参阅[最新版服务器参考](/zh/developers/beammp-scripting/server/latest)。

## 客户端 Lua

客户端 Lua 在很大程度上遵循 [BeamNG 扩展](https://documentation.beamng.com/modding/programming/extensions/)。下面的示例会在控制台中打印一条信息，表示插件已加载：
```lua
local M = {}

if extensions.isExtensionLoaded("examplePlugin") then
  log("E", "examplePlugin", "examplePlugin loaded on client side")
  return
end

return M
```
要进一步了解如何在 BeamNG Lua 中打印输出，请参阅 [BeamNG 关于调试输出的文档](https://documentation.beamng.com/modding/programming/debugging/#a-add-a-log)。

## modScript.lua

`modScript.lua` 通常只有两行：
```lua
load('examplePlugin')
setExtensionUnloadMode('examplePlugin', 'manual')
```
你可以添加一行日志，以便在日志中看到 BeamNG 何时处理了你的 `modScript.lua`：
```lua
load('examplePlugin')
setExtensionUnloadMode('examplePlugin', 'manual')
log('I', 'modScript', "examplePlugin loaded")
```
