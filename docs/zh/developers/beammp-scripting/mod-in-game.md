---
description: "BeamMP 游戏内（客户端）Lua 函数：TriggerServerEvent、TriggerClientEvent 和 AddEventHandler，并附有解析聊天消息的示例。"
---
# 游戏内模组脚本参考

BeamMP 也允许你编写客户端插件。有几个函数可以让你与其他多人模式模组交流，也可以通过服务器与其他玩家交流。要设置插件，请参阅[模组与资源制作](/zh/developers/mod-and-resource-creation)。

## 函数

| 函数 | 作用 |
|---|---|
| `TriggerServerEvent("eventName", "data")` | 在服务器的 Lua 环境中触发一个事件。两个参数都是字符串 |
| `TriggerClientEvent("eventName", "data")` | 在本地 Lua 环境中触发一个事件。两个参数都是字符串。适合用于插件之间的通信 |
| `AddEventHandler("eventName", Function)` | 添加 `Function`，当在本地或从服务器收到 `eventName` 时调用。`Function` 会得到一个参数：包含事件数据的字符串 |

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
    local message = string.sub(msg, i+1, -1)  -- Do whatever you want to with the message
    print("sender: " .. sender)
    print("message: ".. message)
end

AddEventHandler("ChatMessageReceived", chatReceived) -- Add our event handler to the list managed by BeamMP
```
