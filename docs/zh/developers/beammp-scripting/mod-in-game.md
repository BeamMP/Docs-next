---
description: "BeamMP 游戏内（客户端）Lua 函数：事件与事件处理函数、聊天事件、按键监听、扩展钩子，以及用于昵称标签、角色和玩家列表的函数。"
---
# 游戏内模组脚本参考

BeamMP 也允许你编写客户端插件。有几个函数可以让你与其他多人模式模组交流，也可以通过服务器与其他玩家交流。要设置插件，请参阅[模组与资源制作](/zh/developers/mod-and-resource-creation)。本页内容已对照 BeamMP 4.22.5 核实。

## 事件函数

| 函数 | 作用 |
|---|---|
| `TriggerServerEvent("eventName", "data")` | 在服务器的 Lua 环境中触发一个事件。两个参数都是字符串。服务器需要有该事件的处理函数，并用 `MP.RegisterEvent` 注册 |
| `TriggerClientEvent("eventName", "data")` | 在本地 Lua 环境中触发一个事件。两个参数都是字符串。适合用于插件之间的通信 |
| `AddEventHandler("eventName", Function, "name")` | 添加 `Function`，当在本地或从服务器收到 `eventName` 时调用。`Function` 会得到一个参数：包含事件数据的字符串。`name` 是可选的，见下文 |
| `RemoveEventHandler("eventName", "name")` | 移除由 `AddEventHandler` 添加的处理函数。`name` 是可选的，见下文 |

- 事件名称不能包含冒号（`:`），数据可以包含。
- 处理函数属于调用 `AddEventHandler` 的那个文件。如果同一个文件为它已经处理的事件再次添加处理函数，新的处理函数会替换旧的。如果要在同一个文件中为一个事件保留多个处理函数，请给每个处理函数指定不同的 `name`。使用 `RemoveEventHandler` 时也要使用相同的 `name`。
- 如果某个处理函数抛出错误，BeamMP 会记录该错误，并继续执行其他处理函数。
- `AddEventHandler` 仅在 BeamMP 已加载时才存在。如果你的模组也会在单人模式下运行，请写成 `if AddEventHandler then ... end`。

关于这些事件在服务器端的内容，请参阅[服务器脚本参考](/zh/developers/beammp-scripting/server/latest)。

## BeamMP 触发的事件

| 事件 | 触发时机 | 数据 |
|---|---|---|
| `ChatMessageReceived` | 收到一条聊天消息 | `Sender: message`，一个不含发送者角色标签的字符串 |
| `ChatMessageSent` | 你发送一条聊天消息 | `C:Sender: message`，其中 `Sender` 是你的名字 |

## 示例：读取聊天消息

要读取聊天内容，请使用内置的 `ChatMessageReceived` 事件：

```lua
local function chatReceived(msg) -- Receive event with parameters
    print("chat received: "..msg)
    local i = string.find(msg, ":") -- Find where our first ':' is, used to separate the sender and message
    if i == nil then
        print("error parsing message: separator could not be found!")
        return -- Could not find separator, cancel function
    end
    print("index of separator: "..tostring(i))
    local sender = string.sub(msg, 1, i-1) -- Substring our input to separate its 2 parts
    local message = string.sub(msg, i+2, -1)  -- Skip the ':' and the space after it. Do whatever you want to with the message
    print("sender: " .. sender)
    print("message: ".. message)
end

AddEventHandler("ChatMessageReceived", chatReceived) -- Add our event handler to the list managed by BeamMP
```

## 按键监听

| 函数 | 作用 |
|---|---|
| `onKeyPressed("NUMPAD1", Function)` | 按下该按键时调用 `Function` |
| `onKeyReleased("NUMPAD1", Function)` | 松开该按键时调用 `Function` |
| `addKeyEventListener("NUMPAD1", Function, "down")` | 该按键状态改变时调用 `Function`。最后一个参数是 `"down"`、`"up"` 或 `"both"`，默认值为 `"both"` |
| `getKeyState("NUMPAD1")` | 按键被按住时返回 `true`，否则返回 `false` |

`Function` 会得到一个参数：按键被按下时为 `true`，被松开时为 `false`。

## 扩展钩子

BeamMP 会在每个已加载且定义了这些钩子的扩展上调用它们：

| 钩子 | 触发时机 |
|---|---|
| `onBeamMPLauncherConnected` | 游戏已连接到启动器 |
| `onBeamMPPostJoin` | 作为加入流程的一部分，服务器的地图已加载完成 |
| `onBeamMPServerLeave` | 你离开服务器 |

## 昵称标签、角色和玩家列表

这些函数位于 `MPVehicleGE` 扩展中。玩家 ID 是数字，车辆 ID 的格式为 `playerID-vehicleID`，例如 `"0-1"`。

| 函数 | 作用 |
|---|---|
| `MPVehicleGE.getPlayers()` | 返回包含所有已知玩家的表，以玩家 ID 为键 |
| `MPVehicleGE.getVehicles()` | 返回包含所有多人模式车辆的表，以车辆 ID 为键 |
| `MPVehicleGE.getPlayerByName("name")` | 返回该玩家的表和玩家 ID；如果没有这个玩家，则返回 `nil` |
| `MPVehicleGE.isOwn(gameVehicleID)` | 如果该编号对应的游戏车辆属于你，则返回 `true` |
| `MPVehicleGE.setPlayerNickPrefix("name", "source", "text")` | 在玩家的昵称标签前添加 `text`。每个想要保留的前缀都要使用不同的 `source` |
| `MPVehicleGE.setPlayerNickSuffix("name", "source", "text")` | 在玩家的昵称标签后添加 `text`。每个想要保留的后缀都要使用不同的 `source` |
| `MPVehicleGE.hideNicknames(true)` | 让 BeamMP 不再绘制昵称标签。`false` 则重新绘制 |
| `MPVehicleGE.setPlayerRole(playerID, "tag", "shorttag", red, green, blue)` | 为玩家设置自定义角色。标签和短标签是 BeamMP 显示在方括号中的文字，背景颜色由三个 0 到 255 的数字表示。如果某个参数无效，则返回 `false` 和一条错误消息 |
| `MPVehicleGE.clearPlayerRole(playerID)` | 移除玩家的自定义角色 |
| `MPVehicleGE.setVehicleRole("playerID-vehicleID", "tag", "shorttag", red, green, blue)` | 为单辆车辆设置自定义角色 |
| `MPVehicleGE.clearVehicleRole("playerID-vehicleID")` | 移除车辆的自定义角色 |
| `MPVehicleGE.applyQueuedEvents()` | 加载所有排队中的车辆变更 |

要在玩家列表的右键菜单中添加按钮，请向 `UI.getCustomPlayerlistButtons()` 返回的表中添加一个函数。键是按钮上显示的文字。该函数会得到玩家的名字和 ID：

```lua
local buttons = UI.getCustomPlayerlistButtons()
buttons["Say hello"] = function(name, id)
  print("Hello, " .. name .. " (ID " .. tostring(id) .. ")")
end
```
