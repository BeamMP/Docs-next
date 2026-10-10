---
description: "BeamMP 服务器插件系统（第 3 版）的参考：插件如何加载、服务器提供的事件和函数，以及如何从旧版 Lua 迁移。"
---
# 服务器脚本参考（版本 3.X）

## 简介 {#introduction}

BeamMP-Server v3.0.0 版本对 Lua 插件系统的工作方式做了大幅改动。新版服务器无法使用旧版 Lua，所以你需要进行迁移。

服务器的插件系统使用 [Lua 5.3](https://www.lua.org/manual/5.3/)。本节详细介绍如何开始编写插件，讲解一些基本概念，并带你写出第一个插件。**即使你熟悉 v3.0.0 之前的系统，也建议你阅读本节，因为有一些地方发生了很大的变化**。

关于从 v3.0.0 之前的 Lua 迁移的指南，请前往[“从旧版 Lua 迁移”](#migrating-from-old-lua)一节。


## 目录结构

与模组不同，服务器插件（默认）位于 `Resources/Server`，而为 BeamNG.drive 编写、会发送给客户端的模组则位于 `Resources/Client`。每个插件必须在 `Resources/Server` 中有自己的子文件夹，例如一个名为“MyPlugin”的插件，其结构如下：

```
Resources
└── Server
    ├── MyPlugin
    │   └── main.lua
    └── SomeOtherPlugin
        └── ...
```

这里还展示了另一个名为“SomeOtherPlugin”的插件，用来说明 `Resources/Server` 文件夹中可以有多个不同的插件文件夹。在本指南中，我们会一直使用这个目录结构作为示例。

你也会注意到 `main.lua`。你可以拥有任意数量的 Lua `.lua` 文件。插件主目录中的所有 Lua 文件都会按*字母顺序*加载，并且忽略大小写（所以 `aaa.lua` 会先于 `bbb.lua` 运行）。

插件文件夹本身也按字母顺序加载，同样忽略大小写。`Resources/Server` 中任何不是文件夹的内容都会被跳过，服务器会为此记录一条错误。


## Lua 文件

插件文件夹中的每个 Lua `.lua` 文件都会在服务器启动时加载。这意味着函数之外的语句会被立即求值（“运行”）。

子文件夹中的 Lua 文件会被忽略，但可以用 `require()` 引入。在 `onInit` 之前，服务器会把插件文件夹及其 `lua` 子文件夹添加到 `package.path`，所以 `require("helpers")` 可以在这两处找到 `helpers.lua`。对于 `.so` 文件（Windows 上为 `.dll` 文件），服务器会把插件文件夹及其 `lib` 子文件夹添加到 `package.cpath`。

例如，我们的 `main.lua` 是这样的：

```lua
function PrintMyName()
	print("I'm 'My Plugin'!")
end

print("What's up!")
```

服务器启动并加载 `main.lua` 时，它会*立即*运行 `print("What's up!")`，但**不会** *调用* `PrintMyName` 函数（因为没有人调用它）！

## 共享 Lua 状态 {#sharing-a-lua-state}

每个插件都在它自己的 Lua 状态中运行，该状态以插件的文件夹命名。如果想让多个插件共享同一个状态，使它们能看到彼此的全局变量和事件处理程序，请在这些插件的文件夹中各添加一个名为 `PluginConfig.toml` 的文件：

```toml
LuaStateID = "MySharedState"
```

所有 `LuaStateID` 相同的插件都在同一个状态中运行。空值会被忽略，插件会继续使用它自己的状态。该状态的名称也就是你给 `lua` 控制台命令的名称（见[调试](#debugging)）。

## 事件 {#events}

事件指的是诸如“有玩家正在加入”“有玩家发送了聊天消息”“有玩家生成了车辆”之类的事情。

你可以通过在处理程序中返回 `1` 来取消事件（如果该事件可以取消）。

在 Lua 中，你通常会想对其中一些事件做出反应。为此，你可以注册一个“处理程序”。它是一个在事件发生时被调用的函数，并会收到一些参数。

示例：

```lua
function MyChatMessageHandler(sender_id, sender_name, message)
	-- censoring only the exact message 'darn'
	if message == "darn" then
		-- cancel the event by returning 1
		return 1
	else
		return 0
	end
end

MP.RegisterEvent("onChatMessage", "MyChatMessageHandler")
```

这样就能确保任何与“darn”完全相同的消息都不会被发送，也不会显示在聊天中（注意，真正的脏话过滤器需要检查消息是否*包含*“darn”，而不是消息*就是*“darn”）。取消事件会让该事件不再发生，例如聊天消息不会显示给其他任何人、车辆不会被生成，等等。

## 自定义事件 {#custom-events}

你可以注册任何你喜欢的事件，例如：

```lua
MP.RegisterEvent("MyCoolCustomEvent", "MyHandler")
```

然后你就可以触发这些自定义事件：

```lua
-- call all event handlers to this in ALL plugins
MP.TriggerGlobalEvent("MyCoolCustomEvent")
-- call all event handlers to this in THIS plugin
MP.TriggerLocalEvent("MyCoolCustomEvent")
```

### 来自游戏的事件

客户端插件可以用 `TriggerServerEvent("eventName", "data")` 在服务器上触发一个事件（见[游戏内模组](/zh/developers/beammp-scripting/mod-in-game)）。像注册其他事件一样，为这个名称注册一个处理程序。处理程序会收到发送该事件的玩家的 ID 和数据字符串：

```lua
function MyHandler(player_id, data)
	print(MP.GetPlayerName(player_id) .. " sent: " .. data)
end

MP.RegisterEvent("MyClientEvent", "MyHandler")
```

自 v3.9.0 起，如果客户端事件的名称与服务器自己的某个事件相同（例如 `onChatMessage`），服务器会忽略它，所以玩家无法伪造这些事件。要反方向发送事件，请使用 [`MP.TriggerClientEvent`](#mp-triggerclientevent-player-id-number-event-name-string-data-string-boolean)。

事件还有更多用法，这些可能性将在下面的 API 参考中详细介绍。

## 事件计时器（“线程”）

v3.0.0 之前的 Lua 有“线程”的概念，它们每秒运行 X 次。这个名称有些误导，因为它们其实是同步的。

v3.0.0 的 Lua 改为使用“事件计时器”。这是在服务器内部运行的计时器，计时结束后会（全局）触发一个事件。它同样是同步的。请注意，第二个参数是以毫秒为单位的间隔。

示例：

```lua
local seconds = 0

function CountSeconds()
	seconds = seconds + 1
end

-- create a custom event called 'EverySecond'
-- and register the handler function 'CountSeconds' to it
MP.RegisterEvent("EverySecond", "CountSeconds")

-- create a timer for this event, which will fire every 1000ms (1s)
MP.CreateEventTimer("EverySecond", 1000)
```

这会让“CountSeconds”每秒被调用一次。你也可以用 `MP.CancelEventTimer` 取消事件计时器（见 API 参考）。

在服务器的控制台中，你可以运行 `status`，查看当前有多少事件计时器正在运行、注册了多少事件处理程序，以及存在多少个 Lua 状态。

## 调试 {#debugging}

Lua 很难调试。很遗憾，嵌入式 Lua 没有像 `gdb` 这样的工业级调试器。

一般来说，你当然可以随时用 `print()` 输出想要检查的值。 

在 v3.0.0 中，服务器提供了一种方式，让你可以把一个解释器注入到插件中，然后在其中实时运行 Lua。这是我们目前最接近调试器的东西。

假设你有上面那个名为 `MyPlugin` 的插件，你可以像这样进入它的 Lua 状态：

```
> lua MyPlugin
```

这里大小写很重要，所以请小心确保输入正确。 
输出大致如下
```
lua @MyPlugin> 
```
可以看到，我们已经切换到了 `MyPlugin` 的 Lua 状态。从现在起，直到我们输入 `:exit`，我们都会停留在 `MyPlugin` 中，并可以在那里执行 Lua。请不要为此使用 `exit()`：它会关闭服务器。

以 `:` 开头的命令是给调试器本身用的，其他任何内容都会作为 Lua 运行。这些命令是：

- `:exit` 脱离该 Lua 状态。
- `:help` 显示这些命令。
- `:events` 列出在该状态中注册的事件和处理程序。
- `:queued` 列出在该状态中等待运行的函数。

不带名称输入 `lua` 时，会进入控制台自己的状态，其中没有任何插件。

例如，如果我们有一个名为 `MyValue` 的全局变量，就可以像这样输出它的值：

```
lua @MyPlugin> print(MyValue)
```

你可以在这里调用函数，做任何你期望能做的事情。

你可以按 TAB 键自动补全函数和变量。这需要 v3.1.0 或更高版本。

警告：很遗憾，如果该 Lua 状态当前正忙于执行其他代码（比如一个 `while` 循环），这可能会让控制台完全卡住，直到它完成这项工作，所以在切换到可能正在等待某件事发生的状态时要非常小心。

此外，你可以在常规控制台（`> `）中运行 `status`，它会显示一些关于 Lua 的统计信息，以及其他内容。

## 自定义命令 {#custom-commands}

要为服务器控制台实现自定义命令，可以使用事件 `onConsoleInput`。 
当你想为服务器所有者提供一种向你的插件发送信号的方式，或者想以自定义的方式显示内部状态时，这会很有用。

下面是一个示例：

```lua
function handleConsoleInput(cmd)
    local delim = cmd:find(' ')
    if delim then
        local message = cmd:sub(delim+1)
        if cmd:sub(1, delim-1) == "print" then
            return message
        end
    end
end

MP.RegisterEvent("onConsoleInput", "handleConsoleInput")
```

处理程序会收到输入的整行内容。如果它返回了一个值，控制台就会输出该值。如果没有任何处理程序返回值，并且该行也不是内置命令，控制台会输出“Unknown command”。对于内置命令（例如 `list`），服务器同样会触发这个事件，所以插件可以对它们做出反应。

这样你就可以在服务器的控制台中这样做：

```
> print hello, world
hello, world
```

我们实现了自己的 `print`。作为练习，你可以试着编写一个类似 `say` 的函数，它向所有玩家，甚至是某个特定玩家发送聊天消息（使用 `MP.SendChatMessage`）。

**注意：**对于你自己的插件，通常建议为它们设置“命名空间”。例如，我们的 `print` 示例在一个名为 `mystuff` 的插件中，可以叫作 `mystuff.print` 或 `ms.print` 之类的名称。

## API 参考

文档格式：`function_name(arg_name: arg_type, arg_name: arg_type) -> return_types`

## 内置函数

### `print(...)`, `printRaw(...)`

将消息输出到服务器控制台，并加上 `[DATE TIME] [LUA]` 前缀。如果你不想要这个前缀，可以使用 `printRaw(...)`。

示例：

```lua
local name = "John Doe"
print("Hello, I'm", name, "and I'm", 32)
```

它可以接受任意数量、任意类型的参数。它还能很轻松地输出表！

它的行为与 Lua 解释器的 `print` 一样，所以会在各个参数之间插入制表符。

### `exit()`

正常关闭服务器。会触发 `onShutdown` 事件。

## MP 函数

### `MP.CreateTimer() -> Timer`

创建一个计时器对象，可用来记录某件事花了多长时间 / 经过了多少时间。它在创建后立即开始计时，并且可以用 `mytimer:Start()` 重置 / 重新开始。

你可以用 `mytimer:GetCurrent()` 获取当前已经过的时间（以秒为单位）。

示例：

```lua
local mytimer = MP.CreateTimer()
-- do stuff here that needs to be timed
print(mytimer:GetCurrent()) -- print how much time elapsed
```

计时器不需要停止（也无法停止），它们没有额外开销。

### `MP.GetOSName() -> string`

返回当前操作系统的名称，为 `Windows`、`Linux` 或 `Other`。

### `MP.GetServerVersion() -> number,number,number`

以“主版本号、次版本号、补丁号”的格式返回当前服务器版本。例如，v3.0.0 版本会返回 `3, 0, 0`。

示例：

```lua
local major, minor, patch = MP.GetServerVersion()
print(major, minor, patch)
```
服务器 v3.9.4 的输出：
```
3	9	4
```

### `MP.RegisterEvent(event_name: string, function_name: string)`

记住名为 `Function Name` 的函数，将其作为名为 `Event Name` 的事件的处理程序。

你可以为一个事件注册任意多个处理程序。

服务器提供的事件列表，请参阅[这里](#events-1)。

如果该名称的事件不存在，就会创建它，因此 RegisterEvent 不会失败。这可以用来创建自定义事件。更多内容请参阅[自定义事件](#custom-events)和[事件](#events)。

示例：

```lua
function ChatHandler(player_id, player_name, msg)
    if msg == "hello" then
        print("Hello World!")
        return 0
    end
end

MP.RegisterEvent("onChatMessage", "ChatHandler")
```
### `MP.CreateEventTimer(event_name: string, interval_ms: number, [strategy: number (since v3.0.2)])`

在服务器内部启动一个计时器，每隔 `interval_ms` 毫秒触发一次事件 `event_name`。

事件计时器可以用 `MP.CancelEventTimer` 取消。

不建议使用小于 25 毫秒的间隔，因为多个这样的间隔很可能无法可靠地得到及时处理。虽然可以在同一个事件上启动多个计时器，但建议尽量少创建事件计时器。例如，如果你需要一个每半秒运行一次的事件和一个每秒运行一次的事件，可以考虑只创建每半秒的那个，并让每秒要运行的函数在每隔一次触发时再运行。

你也可以用 `MP.CreateTimer` 创建一个计时器，并测量自上次事件调用以来经过的时间，从而减少事件计时器的数量，不过并不一定推荐这样做，因为这会大大增加代码的复杂度。

**自 3.0.2 起：**

可以提供一个可选的 `CallStrategy` 作为第三个参数。它可以是以下两者之一：

- `MP.CallStrategy.BestEffort`（默认）：会尽量让你的事件按指定的间隔触发，但如果处理程序耗时过长，就会拒绝让处理程序排队。
- `MP.CallStrategy.Precise`：会严格按指定的间隔把事件处理程序加入队列。如果处理程序的耗时超过间隔，可能导致队列被填满。仅在你需要精确间隔时才使用。

### `MP.CancelEventTimer(event_name: string)`

取消在当前 Lua 状态中创建的、名为 `event_name` 的事件上的所有计时器。由于异步编程的特性，在某些情况下，计时器可能会在被取消之前再触发一次。

### `MP.TriggerLocalEvent(event_name: string, ...) -> table`

插件本地的同步事件触发器。

在本地触发一个事件，这会使该事件在*当前 Lua 状态*（通常就是当前插件，除非通过 PluginConfig.toml 共享了状态）中的所有处理程序被调用。

你可以向这个函数传递参数（`...`），这些参数会被复制并作为函数参数发送给所有处理程序。

这个调用是同步的，会在所有事件处理程序执行完毕后返回。

返回值是一个包含所有结果的表。如果某个处理程序返回了值，它就会出现在这个表中，没有注释，也没有名称。这可以用来“收集”信息，或者为可取消的事件注册子处理程序。它实际上就是一个数组。

示例：

```lua
local Results = MP.TriggerLocalEvent("MyEvent")
print(Results)
```

### `MP.TriggerGlobalEvent(event_name: string, ...) -> table`

全局异步事件触发器。

在全局范围内触发一个事件，这会使该事件在*所有插件*（包括*本*插件）中的所有处理程序被调用。

你可以向这个函数传递参数（`...`），这些参数会被复制并作为函数参数发送给所有处理程序。

这个调用是异步的，会返回一个类似 future 的对象。本地处理程序（与调用者位于同一个插件中的处理程序）会立即同步运行。 

返回的表有两个函数：

- `IsDone() -> boolean` 告诉你所有处理程序是否都已完成。你可以在循环中检查它，并用 `MP.Sleep` 稍作等待，直到它变为 true。
- `GetResults() -> table` 返回一个没有注释、没有名称的表，其中包含所有处理程序的所有返回值。它实际上就是一个数组。

请务必使用 `Obj:Function()` 的语法来调用它们（用 `:`，而不是 `.`）。

示例：

```lua
local Future = MP.TriggerGlobalEvent("MyEvent")
-- wait until handlers finished
while not Future:IsDone() do
	MP.Sleep(100) -- sleep 100 ms
end
local Results = Future:GetResults()
print(Results)
```

请注意，如果有一个注册到“MyEvent”的处理程序一直不返回，就可能让你的插件卡死。你很可能需要记录已经等待了多久，并在几秒之后停止等待。

### `MP.Sleep(time_ms: number)`

等待一段时间，以毫秒为单位。

这不会让出 Lua 状态的执行权，休眠期间该状态中不会执行任何内容。 

警告：如果你注册了事件处理程序，请不要休眠超过 500 毫秒，除非你清楚地知道自己在做什么。它的用途是休眠 1-100 毫秒，以等待结果之类的情形。一个被卡住（休眠中）的 Lua 状态，如果不小心，可能会大幅拖慢整个服务器。

### `MP.SendChatMessage(player_id: number, message: string, [log_chat: boolean])`

发送一条只有指定玩家能看到的聊天消息（如果 ID 为 `-1`，则所有人都能看到）。
在游戏中，它不会显示为定向消息。

自 v3.9.2 起，可选的第三个参数 `log_chat` 决定这条消息是否写入服务器日志。省略时它为 `true`。即便如此，也只有在 `LogChat` 设置开启时，日志中才会包含聊天内容。尚未完成加入的玩家不会收到这条消息。

你可以用它来告诉玩家你*为什么*取消了他们的车辆生成、聊天消息等，或者显示一些关于你的服务器的信息。

示例：
```lua
function ChatHandler(player_id, player_name, msg)
    if string.match(msg, "darn") then
        MP.SendChatMessage(player_id, "Please do not use profanity.") -- If the player sends a message containing "darn", notify the player and cancel the message
        return 1
    else
        return 0
    end
end

MP.RegisterEvent("onChatMessage", "ChatHandler")
```
示例 2：
```lua
function ChatHandler(player_id, player_name, msg)
    if msg == "hello" then
        MP.SendChatMessage(-1, "Hello World!") -- If the player sends the exact message "hello", announce to the entire server "Hello World!"
        return 0
    end
end
```

### `MP.TriggerClientEvent(player_id: number, event_name: string, data: string) -> boolean`
*至 v3.1.0 为止*

### `MP.TriggerClientEvent(player_id: number, event_name: string, data: string) -> boolean,string`
*自 v3.1.0 起*

### `MP.TriggerClientEventJson(player_id: number, event_name: string, data: table) -> boolean,string`
*自 v3.1.0 起*

在指定的客户端上，用给定的数据调用给定的事件（-1 表示广播）。然后可以在客户端的 Lua 模组中处理这个事件，请参阅“客户端脚本”文档了解相关内容。

如果能够发送这条消息，就会返回 `true`（对于 `id = -1`，也就是广播，始终为 `true`）；如果该 ID 的玩家不存在，或者已经断开连接但仍然保留着 ID（这是一个已知问题），则返回 `false`。

如果返回了 `false`，那么重试这个事件没有意义，也不应期待收到任何响应（如果原本期待有响应的话）。

自 v3.1.0 起，第二个返回值包含函数失败时的错误信息。同样自这个版本起，`*Json` 版本的函数接受一个表作为 data 参数，并将其转换为 json。这只是 `MP.TriggerClientEvent(..., Util.JsonEncode(mytable))` 的简写。

如果不存在该玩家，错误信息为 `Invalid Player ID`；如果该玩家仍在下载模组，则为 `Player hasn't joined yet`。自 v3.8.3 起，服务器不会向仍在下载的玩家发送事件。

### `MP.SendNotification(player_id: number, message: string, [icon: string], [category: string])`

*自 v3.6.0 起*

在指定玩家（如果 ID 为 `-1`，则为所有人）的游戏中显示一条通知。如果省略 `icon`，通知就没有图标。如果省略 `category`，则它与 `message` 相同。省略图标自 v3.7.2 起可用。该函数接受二到四个参数，参数数量为其他值时会记录一条错误。它不返回任何值。尚未完成加入的玩家不会收到通知。

示例：
```lua
MP.SendNotification(-1, "The race starts in one minute")
```

### `MP.ConfirmationDialog(player_id: number, title: string, body: string, buttons: table, interaction_id: string, [warning: boolean, report_to_server: boolean, report_to_extensions: boolean]) -> boolean,string`

*自 v3.8.5 起*

在指定玩家（如果 ID 为 `-1`，则为所有人）的游戏中显示一个带按钮的对话框窗口。你可以只给出前五个参数，也可以给出全部八个。给出五个参数时，函数不返回任何值。给出八个参数时，它会返回 `true`，或者返回 `false` 和一条错误信息，例如 `Player is not synced yet` 或 `Invalid Player ID`。

- `buttons` 是一个由表组成的表。其中每个表都有一个 `label`（按钮上的文字）、一个 `key`（按下该按钮时在服务器上触发的事件名称），并且最多只能有一个按钮带有 `isCancel = true`。当玩家用 `Esc` 关闭对话框时，带有 `isCancel` 的按钮会被视为已被按下。如果没有按钮带有 `isCancel`，玩家就只能通过其中一个按钮来关闭对话框。
- `interaction_id` 会作为数据传给 `key` 事件，这样在同时打开了多个对话框时，你可以分辨出某个按钮属于哪个对话框。
- `warning`（默认为 `false`）把该对话框标记为警告。
- `report_to_server`（默认为 `true`）和 `report_to_extensions`（默认为 `true`）决定按钮被按下的消息报告到哪里。

按钮被按下的消息会像来自游戏的事件一样到达：处理程序会收到玩家的 ID 和 `interaction_id`。

示例：
```lua
function onChatMessage(player_id, player_name, message)
    if message == "/rules" then
        MP.ConfirmationDialog(player_id, "Rules", "Do not ram other players.",
            { { label = "OK", key = "rulesOK", isCancel = true } }, "rules")
        return 1
    end
end

function rulesOK(player_id, interaction_id)
    MP.SendChatMessage(-1, MP.GetPlayerName(player_id) .. " read the rules")
end

MP.RegisterEvent("onChatMessage", "onChatMessage")
MP.RegisterEvent("rulesOK", "rulesOK")
```

### `MP.GetPlayerCount() -> number`

返回当前服务器中的玩家数量。

### `MP.GetPositionRaw(pid: number, vid: number) -> table,string`

返回玩家 `pid`（玩家 ID）的车辆 `vid`（车辆 ID）的当前位置；如果发生错误，还会返回一个错误字符串。

这个表是从位置数据包中解码出来的，因此包含各种数据，包括位置和旋转（这就是这个函数名带有“Raw”后缀的原因）。

示例：
```lua
local player_id = 4
local vehicle_id = 0

local raw_pos, error = MP.GetPositionRaw(player_id, vehicle_id)

if error == "" then
    print(raw_pos)
else
    print(error)
end
```
输出：
```json
 {
    tim: 49.824, // Time since spawn
    rvel: { // Rotational velocity
            1: -1.33564e-05,
            2: -9.16553e-06,
            3: 8.33364e-07,
    }, 
    vel: { // Velocity
            1: -4.29755e-06,
            2: -5.79335e-06,
            3: 4.95236e-06,
    },
    pos: { // Position
            1: 269.979,
            2: -759.068,
            3: 46.554,
    },
    ping: 0.0125, // Vehicle latency
    rot: { // Rotation
            1: -0.00559953,
            2: 0.00894832,
            3: 0.772266,
            4: 0.635212,
    },
}
```
示例 2：
```lua
local player_id = 4
local vehicle_id = 0

local raw_pos, error = MP.GetPositionRaw(player_id, vehicle_id)
if error == "" then
    local x, y, z = table.unpack(raw_pos["pos"])

    print("X:", x)
    print("Y:", y)
    print("Z:", z)
else
    print(error)
end
```
输出：
```
X: -603.459
Y: -175.078
Z: 26.9505
```

### `MP.IsPlayerConnected(player_id: number) -> boolean`

玩家是否已连接，并且服务器是否已收到来自该玩家的 UDP 数据包。

示例：
```lua
local player_id = 8
print(MP.IsPlayerConnected(player_id)) -- Check if player with ID 8 is properly connected.
```
输出：
```lua
true
```

### `MP.GetPlayerName(player_id: number) -> string`

获取玩家的显示名称。如果没有该 ID 的玩家，则返回空字符串。

示例：
```lua
local player_id = 4
print(MP.GetPlayerName(player_id)) -- Get the name of the player with ID 4
```
输出：
```
ilovebeammp2004
```

### `MP.GetPlayerIDByName(name: string) -> number`

返回显示名称与 `name` 完全一致（包括大小写）的玩家的 ID。如果没有这样的玩家，则返回 `-1`。

示例：
```lua
local player_id = MP.GetPlayerIDByName("ilovebeammp2004")
if player_id ~= -1 then
    MP.SendChatMessage(player_id, "Hello!")
end
```

### `MP.GetPlayerRole(player_id: number) -> string`

*自 v3.6.0 起*

返回该玩家的角色，即 BeamMP 后端在玩家加入时报告的角色，例如 `USER`。如果没有该 ID 的玩家，则返回 `nil`。它与 [`onPlayerAuth`](#onplayerauth) 的 `player_role` 参数是同一个值。

### `MP.RemoveVehicle(player_id: number, vehicle_id: number) -> boolean,string`

移除指定玩家的指定车辆。会触发 [`onVehicleDeleted`](#onvehicledeleted)。

如果成功移除了车辆，则返回 `true`。如果没有，则返回 `false` 和一条错误信息：`Vehicle does not exist` 或 `Invalid Player ID`。

示例：
```lua
local player_id = 3
local player_vehicles = MP.GetPlayerVehicles(player_id)

-- Loop over all of player 3's vehicles and delete them
for vehicle_id, vehicle_data in pairs(player_vehicles) do
      MP.RemoveVehicle(player_id, vehicle_id)
end
```

### `MP.GetPlayerVehicles(player_id: number) -> table`

返回一个表，包含该玩家拥有的所有车辆。表中的每一项都是从车辆 ID 到车辆数据的映射，车辆数据是格式为 `role:name:player_id-vehicle_id:json` 的原始字符串。如果该玩家不存在或没有车辆，则返回 `nil`。

示例：
```lua
local player_id = 3
local player_vehicles = MP.GetPlayerVehicles(player_id)

for vehicle_id, vehicle_data in pairs(player_vehicles) do
    local start = string.find(vehicle_data, "{")
    local formattedVehicleData = string.sub(vehicle_data, start, -1)
    print(Util.JsonDecode(formattedVehicleData))
end
```
输出：
```json
{
    pid: 0,
    pro: "0",
    rot: {
            1: 0,
             2: 0,
            3: 0.776866,
            4: 0.629665,
    },
    jbm: "miramar",
    vcf: {
            parts: {
                    miramar_exhaust: "miramar_exhaust",
                    miramar_shock_R: "miramar_shock_R",
                    miramar_taillight: "miramar_taillight",
                    miramar_door_RL: "miramar_door_RL"
                    // ... continue
            },
            paints: {
                    1: {
                            roughness: 1,
                            metallic: 0,
                            clearcoat: 1,
                            baseColor: {
                                    1: 0.85,
                                    2: 0.84,
                                    3: 0.8,
                                    4: 1.2,
                            },
                            clearcoatRoughness: 0.09,
                    } // ... continue
            },
            partConfigFilename: "vehicles/miramar/base_M.pc",
            vars: {},
            mainPartName: "miramar",
    },
    pos: {
            1: 283.669,
            2: -754.332,
            3: 48.2151,
    },
    vid: 64822,
    ign: 0,
}
```

### `MP.GetPlayers() -> table`

返回一个包含所有已连接玩家的表。这个表把 ID 映射到名称，如下所示：  
```json
{
	0: "LionKor",
	1: "JohnDoe"
}
```

### `MP.IsPlayerGuest(player_id: number) -> boolean`

玩家是否为访客。访客指的是没有登录、而是选择以访客身份游玩的人。他们的名称通常是 `guest` 后面跟着一长串数字。

由于访客是匿名的，你可能想禁止他们加入；如果是这样，建议改用 [`onPlayerAuth`](#onplayerauth) 的 `is_guest` 参数。

### `MP.DropPlayer(player_id: number, [reason: string]) -> boolean,string`

踢出指定 ID 的玩家。reason 参数是可选的。省略时，玩家会看到 `No reason`。

成功时返回 `true`；如果没有该 ID 的玩家，则返回 `false` 和 `Player does not exist`。

```lua
function ChatHandler(player_id, player_name, message)
    if string.match(message, "darn") then
        MP.DropPlayer(player_id, "Profanity is not allowed")
        return 1
    else
        return 0
    end
end 
```
### `MP.GetStateMemoryUsage() -> number`

返回当前 Lua 状态的内存占用，以字节为单位。

### `MP.GetLuaMemoryUsage() -> number` 

返回所有 Lua 状态合计的内存占用，以字节为单位。

### `MP.GetPlayerIdentifiers(player_id: number) -> table`

返回一个包含该玩家相关信息的表，例如 BeamMP 论坛 ID、IP 地址和 Discord 账号 ID。只有当用户把 Discord 关联到了自己的论坛账号时，才会返回 Discord ID。

你可以访问 `https://forum.beammp.com/u/USERNAME.json`，并查找 `"user": {"id": 123456}`，来找到用户的论坛 ID。BeamMP ID 对玩家来说是唯一的，并且与用户名不同，它无法更改。如果该玩家不存在，则返回 `nil`。

示例：

```lua
local player_id = 5
print(MP.GetPlayerIdentifiers(player_id))
```
输出：
```json
{
    ip: "127.0.0.1",
    discord: "12345678987654321",
    beammp: "1234567",
}
```

*在 v3.1.0 之前，`ip` 字段是不正确的，无法按预期工作。已在 v3.1.0 中修复。*

### `MP.Set(setting: number, value)`

临时设置一项 ServerConfig 设置：更改会持续到服务器停止为止，并且不会写入 `ServerConfig.toml`。第一个参数请使用 `MP.Settings` 表中的值。`value` 的类型取决于该设置：

- `MP.Settings.Debug`、`MP.Settings.Private` 和 `MP.Settings.InformationPacket` 接受布尔值。
- `MP.Settings.MaxCars` 和 `MP.Settings.MaxPlayers` 接受整数。
- `MP.Settings.Map`、`MP.Settings.Name` 和 `MP.Settings.Description` 接受字符串。

类型错误的值会记录一条错误，未知的设置会记录一条警告，两种情况都不会更改任何内容。服务商可以禁用这个函数，请参阅[服务器手册](/zh/server-owners/manual#provider-settings)中的 `BEAMMP_PROVIDER_DISABLE_MP_SET`。禁用后，每次调用都会记录一条错误，并且不会更改任何内容。

示例：
```lua
MP.Set(MP.Settings.Debug, true) -- Turns on debug mode
```

### `MP.Get(setting: number) -> boolean | number | string`

*自 v3.6.0 起*

返回一项 ServerConfig 设置的当前值。参数请使用 `MP.Settings` 表中的值。结果的类型就是 `MP.Set` 对该设置所接受的类型。对于未知的设置，它会记录一条警告并返回 `0`。

示例：
```lua
print(MP.Get(MP.Settings.MaxPlayers))
```

### `MP.Settings -> table`

把设置名称映射到 ID 的表。与 `MP.Set` 和 `MP.Get` 配合使用，用来更改和读取 ServerConfig 设置。`InformationPacket` 自 v3.7.0 起存在。

示例：
```lua
print(MP.Settings)
```
输出：
```json
{
    Debug: 0,
    Private: 1,
    MaxCars: 2,
    MaxPlayers: 3,
    Map: 4,
    Name: 5,
    Description: 6,
    InformationPacket: 7,
}
```

### `MP.GetServerTimeMS() -> number`

### `MP.GetServerTime() -> number`

*自 v3.9.4 起*

返回服务器自身时钟的读数。当游戏询问时间时，服务器也会把这个读数发送给玩家的游戏。`MP.GetServerTimeMS()` 以毫秒为单位返回，`MP.GetServerTime()` 以秒为单位返回，带小数。这个时钟不显示日期，也不显示一天中的时间，并且每次服务器启动时的起始值都不同。请用它来测量两个时刻之间经过了多少时间，而不是用来获知现在是什么时间。

示例：
```lua
local start = MP.GetServerTimeMS()
-- do something
print("took " .. (MP.GetServerTimeMS() - start) .. " ms")
```
## Util 函数

### `Util.Json*`

自 BeamMP-Server `v3.1.0` 起可用。

这是一个内置的 JSON 库，通常比任何 Lua JSON 库都快得多。它的底层使用 C++ 的 `nlohmann::json` 库，该库符合 JSON 规范，有完整覆盖的单元测试，并且一直在接受模糊测试。

### `Util.JsonEncode(table: table) -> string`

递归地把一个 Lua 表编码为 JSON 字符串（表中套表、再套表……都能正常处理）。所有基本类型都会被保留，函数、userdata 及类似类型会被忽略。

得到的 JSON 是压缩过的，可以使用 `Util.JsonPrettify` 进行美化输出。

示例： 
```lua
local player = {
	name = "Lion",
	age = 69,
	skills = { "skill A", "skill B" }
}
local json = Util.JsonEncode(player)
```

结果： 
```json
{"name":"Lion","age":69,"skills":["skill A","skill B"]}
```

### `Util.JsonDecode(json: string) -> table`

把 JSON 解码为 Lua 表。如果失败，会返回 `nil` 并输出一条错误信息。

示例：
```lua
local json = "{\"message\":\"OK\",\"code\":200}"
local tbl = Util.JsonDecode(json)
```

结果：
```lua
{
	message = "OK",
	code = 200,
}
```

### `Util.JsonPrettify(json: string) -> string`

为 json 添加缩进和换行，使其更便于人阅读。

示例：
```
local myjson = Util.JsonEncode({ name="Lion", age = 69, skills = { "skill A", "skill B" } })

print(Util.JsonPrettify(myjson))
```

结果：
```json
{
    "age": 69.0,
    "name": "Lion",
    "skills": [
        "skill A",
        "skill B"
    ]
}
```

### `Util.JsonMinify(json: string) -> string`

移除缩进、换行以及任何其他空白字符。除非你调用过 `Util.JsonPrettify`，否则没有必要使用，因为 `Util.Json*` 的所有输出本来就已经是压缩过的。

示例：
```lua
local pretty = Util.JsonPrettify(Util.JsonEncode({ name="Lion", age = 69, skills = { "skill A", "skill B" } }))

print(Util.JsonMinify(pretty))
```

结果：
```json
{"age":69.0,"name":"Lion","skills":["skill A","skill B"]}
```

### `Util.JsonFlatten(json: string) -> string`

创建一个 JSON 对象，其键按照 RFC 6901 被展平为 JSON 指针。你可以用 `Util.JsonUnflatten()` 还原出原始内容。要做到这一点，所有的值都必须是基本类型。

示例：
```lua
local json = Util.JsonEncode({ name="Lion", age = 69, skills = { "skill A", "skill B" } })
print("normal: " ..json)
print("flattened: " .. Util.JsonFlatten(json))
print("flattened pretty: " .. Util.JsonPrettify(Util.JsonFlatten(json)))

```

结果： 
```json
normal: {"age":69.0,"name":"Lion","skills":["skill A","skill B"]}
flattened: {"/age":69.0,"/name":"Lion","/skills/0":"skill A","/skills/1":"skill B"}
flattened pretty: {
    "/age": 69.0,
    "/name": "Lion",
    "/skills/0": "skill A",
    "/skills/1": "skill B"
}
```

### `Util.JsonUnflatten(json: string) -> string`

还原之前用 `Util.JsonFlatten()` 函数展平过的 JSON 值的任意嵌套结构。 

### `Util.JsonDiff(a: string, b: string) -> string`

按照 RFC 6902（http://jsonpatch.com/）创建一份 JSON 差异。返回这份差异。

## `Util.Random*`

自 BeamMP-Server `v3.1.0` 起可用。

### `Util.Random() -> float`

返回一个介于 0 和 1 之间的浮点数。

示例：
```lua
local rand = Util.Random()
print("rand: " .. rand)
```

结果： 
```lua
rand: 0.135477
```

### `Util.RandomIntRange(min: int, max: int) -> int`

返回一个介于 min 和 max 之间的整数。

示例：
```lua
local randInt = Util.RandomIntRange(1, 100)
print("randInt: " .. randInt)
```

结果： 
```lua
randInt:  69
```

### `Util.RandomRange(min: number, max: number) -> float`

返回一个介于 min 和 max 之间的浮点数。

示例：
```lua
local randFloat = Util.RandomRange(1, 1000)
print("randFloat: " .. randFloat)
```

结果： 
```lua
randFloat: 420.6969
```

### `Util.LogInfo(params: ...)` 等（自 v3.3.0 起）

```lua
Util.LogInfo("Hello, World!")
Util.LogWarn("Cool warning")
Util.LogError("Oh no!")
Util.LogDebug("hi")
```
会输出

```
[19/04/24 11:06:50.142] [Test] [INFO] Hello, World!    
[19/04/24 11:06:50.142] [Test] [WARN] Cool warning    
[19/04/24 11:06:50.142] [Test] [ERROR] Oh no!
[19/04/24 11:06:50.142] [Test] [DEBUG] hi
```

`[Test]` 是 Lua 状态的名称；除非插件共享了状态（见[共享 Lua 状态](#sharing-a-lua-state)），否则它就是插件的名称。`Util.LogDebug` 只有在 `Debug` 设置开启时才会输出。

支持与 `print()` 完全相同的数据输出 / 转储方式。

### `Util.DebugExecutionTime() -> table`

当 Lua 代码在服务器中运行时，每个事件处理程序的执行都会被计时。这些执行时间的最小值、最大值、平均值（均值）和标准差会被计算出来，并由这个函数以表的形式返回。计算是增量进行的，所以每当一个事件处理程序运行时，最小值、最大值、平均值和标准差都会随之更新。这样一来，`Util.DebugExecutionTime()` 通常不会花费太多时间来执行（不到 0.25 毫秒）。

它返回的表如下所示：
```lua
[[table: 0x7af6d400aca0]]: {
	printStuff: [[table: 0x7af6d400be60]]: {
		mean: 0.250433,
		n: 76,
		max: 0.074475,
		stdev: 0.109405,
		min: 0.449274,
	},
	onInit: [[table: 0x7af6d400b130]]: {
		mean: 0.033095,
		n: 1,
		max: 0.033095,
		stdev: 0,
		min: 0.033095,
	},
}	
```
对于每个事件*处理程序*，会返回以下数据：

- `n`：事件被触发并调用了处理程序的次数
- `mean`：所有执行时间的平均值（均值），单位为毫秒
- `max`：最长的执行时间，单位为毫秒
- `min`：最短的执行时间，单位为毫秒
- `stdev`：所有执行时间的标准差，单位为毫秒

下面是一个可用来美化输出这些数据的函数：

```lua
function printDebugExecutionTime()
    local stats = Util.DebugExecutionTime()
    local pretty = "DebugExecutionTime:\n"
    local longest = 0
    for name, t in pairs(stats) do
        if #name > longest then
            longest = #name
        end
    end
    for name, t in pairs(stats) do
        pretty = pretty .. string.format("%" .. longest + 1 .. "s: %12f +/- %12f (min: %12f, max: %12f) (called %d time(s))\n", name, t.mean, t.stdev, t.min, t.max, t.n)
    end
    print(pretty)
end
```

如果你的代码很慢，可以像这样调用它来调试：

```lua
-- event to print the debug times
MP.RegisterEvent("printStuff", "printDebugExecutionTime")
-- run every 5000 ms = 5 seconds (or 10, or 60, whatever makes sense for you
MP.CreateEventTimer("printStuff", 5000)
```

### `Util.DebugStartProfile(name: string)`

### `Util.DebugStopProfile(name: string)`

自 BeamMP-Server `v3.4.0` 起可用。

给你代码中的任意一部分计时，而不仅仅是整个事件处理程序。`Util.DebugStartProfile` 以给定的名称开始一次测量，`Util.DebugStopProfile` 则结束这次测量，并把耗时加入该名称的统计数据中。这些统计数据会与事件处理程序一起，出现在 `Util.DebugExecutionTime()` 返回的表中。用一个未曾开始的名称调用 `Util.DebugStopProfile` 会记录一条错误。

示例：
```lua
Util.DebugStartProfile("mySlowPart")
-- do something slow
Util.DebugStopProfile("mySlowPart")
print(Util.DebugExecutionTime()["mySlowPart"].mean)
```

## FS 函数

`FS` 函数是**文件系统**（**f**ile**s**ystem）函数，目标是比 Lua 默认的功能更好用。

指定路径时，请始终使用 `/` 作为分隔符，因为它是跨平台的（Windows、Linux、macOS 等）。

### `FS.CreateDirectory(path: string) -> bool,string`


创建指定的目录；如果上级目录不存在，也会一并创建。其行为大致相当于常见的 Linux 命令 `mkdir -p`。

如果成功，返回 `true` 和 `""`。如果创建目录失败，则返回 `false` 和一条错误信息（`string`）。

示例：
```lua
local success, error_message = FS.CreateDirectory("data/mystuff/somefolder")

if not success then
	print("failed to create directory: " .. error_message)
else
	-- do something with the directory
end

-- Be careful not to do this! This will ALWAYS be true!
if error_message then
	-- ...
end
```

### `FS.Remove(path: string) -> bool,string`

移除指定的文件或空文件夹。里面有文件的文件夹不会被移除。

如果成功，或者没有可移除的内容，则返回 `true`。如果失败，则返回 `false` 和一条错误信息。

示例：
```lua
local success, error_message = FS.Remove("myfile.txt")

if not success then
	print("failed to delete myfile: " .. error_message)
end
```

### `FS.Rename(pathA: string, pathB: string) -> bool,string`

把 `pathA` 重命名（或移动）为 `pathB`。

如果成功，则返回 `true`。如果失败，则返回 `false` 和一条错误信息。

### `FS.Copy(pathA: string, pathB: string) -> bool,string`

把 `pathA` 复制到 `pathB`。文件夹会连同其中的所有内容一起复制。

如果成功，则返回 `true`。如果失败，则返回 `false` 和一条错误信息。

### `FS.GetFilename(path: string) -> string`

返回路径的最后一部分，通常就是文件名。
下面是一些示例输入和输出：

```lua
input -> output

"my/path/a.txt" 	-> "a.txt"
"somefile.txt" 		-> "somefile.txt"
"/awesome/path" 	-> "path"
```

### `FS.GetExtension(path: string) -> string`


返回文件的扩展名；如果没有扩展名，则返回空字符串。
下面是一些示例输入和输出

```lua
input -> output

"myfile.txt" 					-> ".txt"
"somefile." 					-> "."
"/awesome/path" 				-> ""
"/awesome/path/file.zip.txt"	-> ".txt"
"myexe.exe" 					-> ".exe"
```


### `FS.GetParentFolder(path: string) -> string`

返回父目录的路径，也就是某个文件或文件夹所在的文件夹。
下面是一些示例输入和输出：

```lua
input -> output

"/var/tmp/example.txt" 		-> "/var/tmp"
"/"							-> "/"
"mydir/a/b/c.txt"			-> "mydir/a/b"
```


### `FS.Exists(path: string) -> bool`

如果该路径存在，返回 `true`；不存在则返回 `false`。

### `FS.IsDirectory(path: string) -> bool`

如果指定的路径是目录，返回 `true`；不是则返回 `false`。请注意，`false` 并不意味着该路径是文件（参见 `FS.IsFile()`）。

### `FS.IsFile(path: string) -> bool`

如果指定的路径是普通文件（不是符号链接、硬链接、块设备等），返回 `true`；不是则返回 `false`。请注意，`false` 并不意味着该路径是目录（参见 `FS.IsDirectory()`）。

### `FS.ListDirectories(path: string) -> table`

返回一个表，包含给定路径中的所有目录。如果该路径不存在，则返回 `nil`。

示例：
```lua
print(FS.ListDirectories("Resources"))
```
结果： 
```lua
{
    1: "Client",
    2: "Server"
}
```

### `FS.ListFiles(path: string) -> table`

返回一个表，包含给定路径中的所有文件。如果该路径不存在，则返回 `nil`。

示例：
```lua
print(FS.ListFiles("Resources/Server/examplePlugin"))
```
结果： 
```lua
{
    1: "example.json",
    2: "example.lua"
}
```

### `FS.ConcatPaths(...) -> string`

用系统首选的路径分隔符把所有参数拼接（连接）在一起。

示例：
```lua  
FS.ConcatPaths("a", "b", "/c/d/e/", "/f/", "g", "h.txt")
```
结果为
```
a/b/c/d/e/f/g/h.txt
```

如果路径中的任何位置存在 `..`，也会一并解析。这个函数比在 Lua 中拼接字符串更安全，并且会遵循当前平台的分隔符。

指定路径时，请始终使用 `/` 作为分隔符，因为它是跨平台的（Windows、Linux、macOS 等）。

## 事件 {#events-1}

### 说明

- 参数：传递给该事件处理程序的参数列表
- 可取消：该事件是否可以被取消。如果可以取消，处理程序可以通过返回 `1` 来取消它，例如 `return 1`。

### 事件概览

玩家加入时，会按以下顺序触发这些事件：

1. `onPlayerAuth`
2. `postPlayerAuth`（即使玩家被拒绝也会触发）
3. `onPlayerConnecting`
4. `onPlayerJoining`
5. `onPlayerJoin`

名称以 `post` 开头的事件，会在同名事件发生之后告诉你它的结果。你无法取消它们。

### 系统事件

#### `onInit`

参数：无
可取消：否

在插件中的所有文件都初始化完成后立即触发。服务器最多会等待处理程序 5 秒。当插件的某个 `.lua` 文件被热重载时，它也会为该插件再次触发。

#### `onConsoleInput`

参数：`input: string`
可取消：否

当 BeamMP 控制台收到输入时触发。参数是输入的整行内容。参见[自定义命令](#custom-commands)。

#### `onShutdown`

参数：无
可取消：否

服务器关闭时触发，位于所有玩家都被踢出之后。服务器最多会等待处理程序 5 秒。

### 游戏相关事件

#### `onPlayerAuth`

参数：`player_name: string`、`player_role: string`、`is_guest: bool`、`identifiers: table -> beammp, ip`
可取消：是

玩家想要加入时触发的第一个事件。可以通过在处理程序中返回 `1` 或一个原因（`string`）来拒绝该玩家加入。返回的原因会显示给玩家。返回 `1` 时，玩家会看到“you are not allowed on the server!”。

自 v3.6.0 起，处理程序可以返回 `2`，让玩家即使在服务器已满（`MaxPlayers`）时也能加入。这不会覆盖其他处理程序做出的拒绝，也不会让访客进入 `AllowGuests` 为 `false` 的服务器。

```lua
function myPlayerAuthorizer(name, role, is_guest, identifiers)
	return "Sorry, you cannot join at this time."
end
MP.RegisterEvent("onPlayerAuth", "myPlayerAuthorizer")
```

#### `postPlayerAuth`

*自 v3.5.0 起*

参数：`denied: bool`、`reason: string`、`player_name: string`、`player_role: string`、`is_guest: bool`、`identifiers: table -> beammp, ip`
可取消：否

在 `onPlayerAuth` 之后立即触发，无论该玩家是否被允许加入。如果玩家被拒绝，`denied` 为 `true`。`reason` 是显示给玩家的文字；如果没有，则为空字符串。

#### `onPlayerConnecting`

参数：`player_id: number`
可取消：否

玩家刚开始连接时触发，位于 `onPlayerAuth` 之后。玩家在这个事件之前就已获得自己的 ID。此时玩家还没有下载模组。

#### `onPlayerJoining`

参数：`player_id: number`
可取消：否

玩家加载完所有模组时触发，位于 `onPlayerConnecting` 之后。

#### `onPlayerJoin`

参数：`player_id: number`
可取消：否

在 `onPlayerJoining` 之后触发，此时玩家的游戏报告它已加入。随后服务器开始向该玩家发送已存在的车辆。

#### `onPlayerDisconnect`

参数：`player_id: number`
可取消：否

玩家断开连接时触发。它位于已为该玩家的每辆车触发 [`onVehicleDeleted`](#onvehicledeleted) 之后。

#### `onChatMessage`

参数：`player_id: number`、`player_name: string`、`message: string`
可取消：是

玩家发送聊天消息时触发。如果被取消，这条聊天消息不会显示给任何人，包括发送它的玩家本人。服务器会在触发这个事件之前丢弃空消息，以及长度超过 500 字节的消息（自 v3.9.1 起）。

#### `postChatMessage`

*自 v3.5.0 起*

参数：`accepted: bool`、`player_id: number`、`player_name: string`、`message: string`
可取消：否

在 `onChatMessage` 之后触发。如果有处理程序取消了这条消息，`accepted` 为 `false`。

#### `onVehicleSpawn`

参数：`player_id: number`、`vehicle_id: number`、`data: string`
可取消：是

玩家生成新车辆时触发。请注意，车辆的切换 / 替换会改为触发 [`onVehicleEdited`](#onvehicleedited)。`data` 参数以 json 字符串的形式，包含车辆的配置以及位置 / 旋转数据。如果玩家已经拥有 `MaxCars` 辆车，车辆同样不会生成。独轮车不计算在内。

#### `postVehicleSpawn`

*自 v3.5.0 起*

参数：`spawned: bool`、`player_id: number`、`vehicle_id: number`、`data: string`
可取消：否

在 `onVehicleSpawn` 之后触发。如果有处理程序取消了生成，或者车辆因其他原因被拒绝（例如玩家已经拥有 `MaxCars` 辆车），`spawned` 为 `false`。`data` 与 `onVehicleSpawn` 中的相同。

<details>

<summary>示例 <code>data</code> 值</summary>

data 字符串以玩家的角色和名称开头，后面是一个唯一的车辆标识符，它由玩家 ID、一个连字符和车辆 ID 组成。再后面跟着一个 JSON 对象，其中包含车辆的配置和位置信息。各部分以 `:` 分隔，所以这个字符串形如 `role:name:player_id-vehicle_id:{...}`。在下面的示例中，省略了角色和名称。

```
0-0: {
    "abs": "realistic",
    "ign": 3,
    "jbm": "van",
    "pid": 0,
    "pos": [
        907.93902587891,
        773.50201416016,
        238.87800598145
    ],
    "pro": "0",
    "rot": [
        0,
        0,
        0.99999994039536,
        0
    ],
    "vcf": {
        "licenseName": "H30 9VV",
        "mainPartName": "van",
        "mainPartPath": "/van",
        "model": "van",
        "paints": [
            {
                "baseColor": [
                    0.21999999880791,
                    0.37000000476837003,
                    0.33000001311302,
                    1.2000000476837
                ],
                "clearcoat": 0,
                "clearcoatRoughness": 0,
                "metallic": 0,
                "roughness": 0.070000000298023
            },
            {
                "baseColor": [
                    0.62300002574921,
                    0.62300002574921,
                    0.62300002574921,
                    1.2000000476837
                ],
                "clearcoat": 0.80000001192093,
                "clearcoatRoughness": 0.070000000298023,
                "metallic": 0.80000001192093,
                "roughness": 0.64999997615814
            },
            {
                "baseColor": [
                    0.21999999880791,
                    0.37000000476837003,
                    0.33000001311302,
                    1.2000000476837
                ],
                "clearcoat": 0,
                "clearcoatRoughness": 0,
                "metallic": 0,
                "roughness": 0.070000000298023
            }
        ],
        "partConfigFilename": "vehicles/van/h15_xt_passenger.pc",
        "parts": {
            "brakepad_F": "brakepad_F_premium",
            "brakepad_R": "brakepad_R_premium",
            "gps": "",
            "licenseplate_design_2_1": "",
            "linelock": "",
            "load_seat_FR": "",
            "n2o_system": "",
            "paint_design": "van_skin_twotone",
            "pickup_engine_v8_ecu": "pickup_engine_v8_ecu",
            "pickup_engine_v8_internals": "pickup_engine_v8_internals",
            "pickup_enginemounts": "pickup_enginemounts",
            "pickup_oilpan_v8": "pickup_oilpan_v8",
            "pickup_reversewarn": "",
            "pickup_sparetire": "pickup_sparetire_5l",
            "pickup_towhitch": "",
            "skin_glass": "van_skin_glass_tint",
            "skin_interior": "van_skin_interior_black",
            "soundscape_horn": "soundscape_horn_115",
            "tire_F_16x7_alt": "tire_F_225_75_16_alt_standard",
            "tire_R_16x7_alt": "tire_R_225_75_16_alt_standard",
            "van_ABS": "van_ABS",
            "van_ESC": "",
            "van_ac": "van_ac",
            "van_body": "van_body_passenger",
            "van_brake_F": "van_brake_F",
            "van_brake_R": "van_brake_R_drum",
            "van_bumper_F": "van_bumper_F_altb",
            "van_bumper_F_lip": "",
            "van_bumper_R": "van_bumper_R_altb",
            "van_bumper_accessory_F": "",
            "van_bumpersignal_FL": "van_bumpersignal_FL",
            "van_bumpersignal_FR": "van_bumpersignal_FR",
            "van_coilover_IFS": "van_coilover_IFS",
            "van_converter": "van_converter",
            "van_differential_F": "",
            "van_differential_R": "van_differential_R",
            "van_door_FL": "van_door_FL",
            "van_door_FR": "van_door_FR",
            "van_doordetent_FL": "van_doordetent_FL",
            "van_doordetent_FR": "van_doordetent_FR",
            "van_doordetent_RL": "van_doordetent_RL",
            "van_doordetent_RR": "van_doordetent_RR",
            "van_doorglass_L": "van_doorglass_L",
            "van_doorglass_R": "van_doorglass_R",
            "van_doorpanel_FL": "van_doorpanel_FL",
            "van_doorpanel_FR": "van_doorpanel_FR",
            "van_driveshaft_R": "van_driveshaft_R",
            "van_engine": "van_engine_v8_4.5",
            "van_exhaust_v8": "van_exhaust_v8",
            "van_fascia_F": "van_fascia_F_high",
            "van_fender_L": "van_fender_L",
            "van_fender_R": "van_fender_R",
            "van_fenderflare_FL": "",
            "van_fenderflare_FR": "",
            "van_fenderflare_RL": "",
            "van_fenderflare_RR_sidedoor": "",
            "van_finaldrive_R": "van_finaldrive_R_355",
            "van_frame": "van_frame",
            "van_fueltank": "van_fueltank",
            "van_header": "van_exhmanifold",
            "van_headlight_L_high": "van_headlight_L_high",
            "van_headlight_R_high": "van_headlight_R_high",
            "van_hood": "van_hood",
            "van_hub_F": "van_hub_F_5",
            "van_hub_R": "van_hub_R_5",
            "van_intake_v8": "van_intake_v8",
            "van_intcarpet_roof": "van_intcarpet_roof",
            "van_interior": "van_interior",
            "van_lettering_doors_F": "van_lettering_doors_F_h15",
            "van_lettering_reardoor_L": "van_lettering_gavril_reardoor_L",
            "van_lettering_reardoor_R": "van_lettering_h15_xt_reardoor_R",
            "van_licenseplate_F": "van_licenseplate_F",
            "van_licenseplate_R": "van_licenseplate_R",
            "van_lightbar": "",
            "van_mirror_L": "van_mirror_L",
            "van_mirror_R": "van_mirror_R",
            "van_mod": "",
            "van_muffler": "van_muffler",
            "van_power_steering": "",
            "van_radiator": "van_radiator",
            "van_radio": "van_radio",
            "van_reardoor_L": "van_reardoor_L",
            "van_reardoor_R": "van_reardoor_R",
            "van_reardoorglass_L": "van_reardoorglass_L",
            "van_reardoorglass_R": "van_reardoorglass_R",
            "van_reardoorpanel_L": "van_reardoorpanel_L",
            "van_reardoorpanel_R": "van_reardoorpanel_R",
            "van_rollcage": "",
            "van_roof": "van_roof",
            "van_roof_accessory": "",
            "van_runningboard": "",
            "van_seat_1R": "van_seat_1R",
            "van_seat_2R": "van_seat_2R",
            "van_seat_3R": "van_seat_3R",
            "van_seat_FL": "van_seat_FL",
            "van_seat_FR": "van_seat_FR",
            "van_shifter": "van_shifter_A",
            "van_shock_R": "van_shock_R",
            "van_sidedoor_FR": "van_sidedoor_FR_alt",
            "van_sidedoor_RR": "van_sidedoor_RR_alt",
            "van_sidedoorglass_FR": "van_sidedoorglass_FR",
            "van_sidedoorglass_RR": "van_sidedoorglass_RR",
            "van_sidedoorpanel_FR": "van_sidedoorpanel_FR",
            "van_sidedoorpanel_RR": "van_sidedoorpanel_RR",
            "van_sideglass_FL": "van_sideglass_FL",
            "van_sideglass_ML": "van_sideglass_ML",
            "van_sideglass_RL": "van_sideglass_RL",
            "van_sideglass_RR": "van_sideglass_RR",
            "van_snorkel": "",
            "van_spring_R": "van_spring_R",
            "van_steer": "van_steer",
            "van_steering": "van_steering",
            "van_suspension_F": "van_IFS",
            "van_suspension_R": "van_axle_R",
            "van_swaybar_F": "van_swaybar_F",
            "van_swaybar_R": "",
            "van_taillight_L": "van_taillight_L",
            "van_taillight_R": "van_taillight_R",
            "van_taillightguard_L": "",
            "van_taillightguard_R": "",
            "van_transfer_case": "van_transfer_case_RWD",
            "van_transmission": "van_transmission_4A",
            "van_tubs": "van_tubs",
            "van_valance_F": "van_valance_F",
            "van_wheeldata_F": "van_wheeldata_F",
            "van_wheeldata_R": "van_wheeldata_R",
            "van_windshield": "van_windshield",
            "wheel_F_5": "wheel_25a_16x7_5_F",
            "wheel_R_5": "wheel_25a_16x7_5_R"
        },
        "vars": {}
    },
    "vid": 29339
}
```

</details>

#### `onVehicleEdited`

参数：`player_id: number`、`vehicle_id: number`、`data: string`
可取消：是

玩家编辑或替换自己的车辆时触发。`data` 参数以 json 字符串的形式，包含车辆更新后的配置，但**不**包含位置或旋转数据。你可以使用 [MP.GetPositionRaw](#mp-getpositionraw-pid-number-vid-number-table-string) 来获取位置和旋转数据。

<details>

<summary>示例 <code>data</code> 值</summary>

data 字符串以一个唯一的车辆标识符开头，它由玩家 ID、一个连字符和车辆 ID 组成。后面跟着一个 JSON 对象，其中包含车辆配置的信息。

```
0-0: {
  "abs": "realistic",
  "ign": 3,
  "jbm": "van",
  "pid": 0,
  "pro": "0",
  "vcf": {
    "licenseName": "P60 1EP",
    "mainPartName": "van",
    "mainPartPath": "/van",
    "model": "van",
    "paints": [
      {
        "baseColor": [
          0.40000000596046,
          0.050000000745058,
          0.050000000745058,
          1.2000000476837
        ],
        "clearcoat": 0,
        "clearcoatRoughness": 0,
        "metallic": 0,
        "roughness": 0.070000000298023
      },
      {
        "baseColor": [
          0.40000000596046,
          0.050000000745058,
          0.050000000745058,
          1.2000000476837
        ],
        "clearcoat": 0,
        "clearcoatRoughness": 0,
        "metallic": 0,
        "roughness": 0.070000000298023
      },
      {
        "baseColor": [
          0.40000000596046,
          0.050000000745058,
          0.050000000745058,
          1.2000000476837
        ],
        "clearcoat": 0,
        "clearcoatRoughness": 0,
        "metallic": 0,
        "roughness": 0.070000000298023
      }
    ],
    "partConfigFilename": "vehicles/van/h15_passenger.pc",
    "parts": {
      "brakepad_F": "brakepad_F_premium",
      "brakepad_R": "brakepad_R_premium",
      "gps": "",
      "hubcap_F_16": "hubcap_09c_F_altd",
      "hubcap_R_16": "hubcap_09c_R_altd",
      "licenseplate_design_2_1": "",
      "linelock": "",
      "load_seat_FR": "",
      "n2o_system": "",
      "paint_design": "",
      "pickup_engine_v8_ecu": "pickup_engine_v8_ecu_late",
      "pickup_engine_v8_internals": "pickup_engine_v8_internals",
      "pickup_enginemounts": "pickup_enginemounts",
      "pickup_oilpan_v8": "pickup_oilpan_v8",
      "pickup_reversewarn": "",
      "pickup_sparetire": "pickup_sparetire_6l",
      "pickup_towhitch": "",
      "skin_glass": "",
      "skin_interior": "van_skin_interior_ivory",
      "soundscape_horn": "soundscape_horn_115",
      "tire_F_16x7_alt": "tire_F_225_75_16_alt_standard",
      "tire_R_16x7_alt": "tire_R_225_75_16_alt_standard",
      "trimring_F_16x7": "",
      "trimring_R_16x7": "",
      "van_ABS": "van_ABS",
      "van_ac": "van_ac",
      "van_body": "van_body_passenger",
      "van_brake_F": "van_brake_F",
      "van_brake_R": "van_brake_R",
      "van_bumper_accessory_F_late": "",
      "van_bumper_F": "van_bumper_F_late_alt",
      "van_bumper_F_lip_late": "",
      "van_bumper_R": "van_bumper_R_late_alt",
      "van_coilover_IFS": "van_coilover_IFS",
      "van_converter": "van_converter",
      "van_differential_F": "",
      "van_differential_R": "van_differential_R",
      "van_door_FL": "van_door_FL",
      "van_door_FR": "van_door_FR",
      "van_doordetent_FL": "van_doordetent_FL",
      "van_doordetent_FR": "van_doordetent_FR",
      "van_doordetent_RL": "van_doordetent_RL",
      "van_doordetent_RR": "van_doordetent_RR",
      "van_doorglass_L": "van_doorglass_L",
      "van_doorglass_R": "van_doorglass_R",
      "van_doorpanel_FL": "van_doorpanel_FL",
      "van_doorpanel_FR": "van_doorpanel_FR",
      "van_driveshaft_R": "van_driveshaft_R",
      "van_engine": "van_engine_v8_4.5",
      "van_ESC": "van_ESC",
      "van_exhaust_v8": "van_exhaust_v8",
      "van_fascia_F": "van_fascia_F_late",
      "van_fender_L": "van_fender_L",
      "van_fender_R": "van_fender_R",
      "van_fenderflare_FL": "",
      "van_fenderflare_FR": "",
      "van_fenderflare_RL": "",
      "van_fenderflare_RR_sidedoor": "",
      "van_finaldrive_R": "van_finaldrive_R_355",
      "van_frame": "van_frame",
      "van_fueltank": "van_fueltank",
      "van_grille_F_late": "van_grille_F_late",
      "van_header": "van_exhmanifold",
      "van_headlight_L_late": "van_headlight_L_late",
      "van_headlight_R_late": "van_headlight_R_late",
      "van_hood": "van_hood_late",
      "van_hub_F": "van_hub_F_6",
      "van_hub_R": "van_hub_R_6",
      "van_intake_v8": "van_intake_v8_late",
      "van_intcarpet_roof": "van_intcarpet_roof",
      "van_interior": "van_interior",
      "van_lettering_doors_F": "van_lettering_doors_F_h15",
      "van_lettering_reardoor_L": "van_lettering_gavril_reardoor_L",
      "van_lettering_reardoor_R": "van_lettering_h15_reardoor_R",
      "van_licenseplate_F_late": "van_licenseplate_F_late",
      "van_licenseplate_R_late": "van_licenseplate_R_late",
      "van_lightbar": "",
      "van_mirror_L": "van_mirror_L",
      "van_mirror_R": "van_mirror_R",
      "van_mod": "",
      "van_muffler": "van_muffler",
      "van_power_steering": "",
      "van_radiator": "van_radiator",
      "van_radio": "van_radio",
      "van_reardoor_L": "van_reardoor_L",
      "van_reardoor_R": "van_reardoor_R",
      "van_reardoorglass_L": "van_reardoorglass_L",
      "van_reardoorglass_R": "van_reardoorglass_R",
      "van_reardoorpanel_L": "van_reardoorpanel_L",
      "van_reardoorpanel_R": "van_reardoorpanel_R",
      "van_rollcage": "",
      "van_roof": "van_roof",
      "van_roof_accessory": "",
      "van_runningboard": "",
      "van_seat_1R": "van_seat_1R",
      "van_seat_2R": "van_seat_2R",
      "van_seat_3R": "van_seat_3R",
      "van_seat_FL": "van_seat_FL",
      "van_seat_FR": "van_seat_FR",
      "van_shifter": "van_shifter_A",
      "van_shock_R": "van_shock_R",
      "van_sidedoor_FR": "van_sidedoor_FR_alt",
      "van_sidedoor_RR": "van_sidedoor_RR_alt",
      "van_sidedoorglass_FR": "van_sidedoorglass_FR",
      "van_sidedoorglass_RR": "van_sidedoorglass_RR",
      "van_sidedoorpanel_FR": "van_sidedoorpanel_FR",
      "van_sidedoorpanel_RR": "van_sidedoorpanel_RR",
      "van_sideglass_FL": "van_sideglass_FL",
      "van_sideglass_ML": "van_sideglass_ML",
      "van_sideglass_RL": "van_sideglass_RL",
      "van_sideglass_RR": "van_sideglass_RR",
      "van_snorkel": "",
      "van_spring_R": "van_spring_R",
      "van_steer": "van_steer_facelift",
      "van_steering": "van_steering",
      "van_suspension_F": "van_IFS",
      "van_suspension_R": "van_axle_R",
      "van_swaybar_F": "van_swaybar_F",
      "van_swaybar_R": "",
      "van_taillight_L": "van_taillight_L",
      "van_taillight_R": "van_taillight_R",
      "van_taillightguard_L": "",
      "van_taillightguard_R": "",
      "van_transfer_case": "van_transfer_case_RWD",
      "van_transmission": "van_transmission_4A",
      "van_tubs": "van_tubs",
      "van_valance_F": "van_valance_F_late",
      "van_wheeldata_F": "van_wheeldata_F",
      "van_wheeldata_R": "van_wheeldata_R",
      "van_windshield": "van_windshield",
      "wheel_F_6": "steelwheel_02b_16x7_F",
      "wheel_R_6": "steelwheel_02b_16x7_R"
    },
    "vars": {}
  }
}
```

</details>

#### `postVehicleEdited`

*自 v3.5.0 起*

参数：`allowed: bool`、`player_id: number`、`vehicle_id: number`、`data: string`
可取消：否

在 `onVehicleEdited` 之后触发。如果有处理程序取消了这次编辑，`allowed` 为 `false`，随后服务器会删除该车辆。`data` 与 `onVehicleEdited` 中的相同。

#### `onVehicleDeleted`

参数：`player_id: number`、`vehicle_id: number`
可取消：否

玩家删除自己的车辆时触发。当 `MP.RemoveVehicle` 移除车辆时、当生成或编辑被取消而车辆被删除时，以及（自 v3.5.0 起）为断开连接的玩家的每辆车，它也会被触发。

#### `onVehicleReset`

参数：`player_id: number`、`vehicle_id: number`、`data: string`
可取消：否

玩家重置自己的车辆时触发。`data` 是车辆更新后的位置和旋转，但**不**包含车辆的配置。你可以使用 [MP.GetPlayerVehicles](#mp-getplayervehicles-player-id-number-table) 来获取车辆的配置。

#### `onVehiclePaintChanged`

*自 v3.7.0 起*

参数：`player_id: number`、`vehicle_id: number`、`data: string`
可取消：否

玩家更改自己车辆的涂装时触发。`data` 是一个 json 字符串，包含车辆的新涂装，它是一个数组。服务器会把新涂装存入车辆的数据中，所以之后 [MP.GetPlayerVehicles](#mp-getplayervehicles-player-id-number-table) 会返回它们。

#### `onFileChanged`

*自 v3.1.0 起*

参数：`path: string`
可取消：否

当 `Resources/Server` 目录*或它的任何子目录*中的文件发生变化时触发。服务器每 3 秒检查一次变化。

`Resources/Server/<plugin>` 目录中（不包括它的子文件夹）的某个 `.lua` 文件发生变化时，服务器会在该插件的 Lua 状态中重新运行这个文件，然后为该插件触发 `onInit`，再触发 `onFileChanged`。状态本身会被保留，所以它的全局变量仍然存在，你之前注册的处理程序也仍然有效。

`Resources/Server/<plugin>` 中的其他任何文件，或者任何子文件夹中的任何文件（例如 `Resources/Server/<plugin>/lua/stuff.lua`）发生变化时，不会运行任何内容，只会触发 `onFileChanged`。这样，你就可以自己以正确的方式重新加载它（或者不重新加载）。

这适用于所有文件，而不仅仅是 `.lua` 文件。

`path` 是相对于服务器根目录的路径，例如 `Resources/Server/myplugin/myfile.txt`。你可以使用 `FS.*` 系列函数对这个字符串做进一步处理，例如提取名称或扩展名（`FS.GetExtension(...)`、`FS.GetFilename(...)` 等）。

注意：服务器启动之后新增的文件*不会*被跟踪。

## 从旧版 Lua 迁移 {#migrating-from-old-lua}

这是一份简短的概要，介绍从旧版 Lua 迁移到新版 Lua 的基本步骤。

### 了解新版 Lua 的工作方式

为此，请仔细阅读[“简介”](#introduction)一节及其所有小节。
这是正确完成后续步骤所必需的。

### 查找与替换

首先，你应该查找并替换所有 MP 函数。替换后，所有 MP 函数前面都要加上 `MP.`，`print()` 除外。

示例：

```lua
local players = GetPlayers()
print(#players)
```
变为

```lua
local players = MP.GetPlayers()
print(#players) -- note how print() doesn't change
```

### 告别线程，迎接事件计时器！

正如简介中所说，线程就是事件计时器。对于所有对 `CreateThread` 的调用，请把它替换为对 `CreateEventTimer` 的调用。请仔细检查你原来的 CreateThread 的时间设置（那个数字表示每秒 X 次），并想一想对应的事件计时器的超时值应该是多少（单位为毫秒）。另外请记住，它接受的是事件名称，而不是函数名称，所以你还需要同时注册一个事件。

示例：

```lua
CreateThread("myFunction", 2) -- calls "myFunction" twice per second
```
变为

```lua
MP.RegisterEvent("myEvent", "myFunction") -- registering our event for the timer
MP.CreateEventTimer("myEvent", 500) -- 500 milliseconds = 2 times per second
```

如果你有很多事件计时器，可以看看能否把它们合并，例如创建一个“每分钟”事件，并为它注册多个需要每分钟调用的函数，而不是使用多个事件计时器。每个事件计时器都会让服务器多花一点点时间来触发。

### 不再有隐式的事件调用

你需要注册所有的事件，不能依赖函数名称。在旧版 Lua 中这一点并不明确，但在新版 Lua 中通常会强制执行。一个好的写法是： 

```lua
MP.RegisterEvent("onChatMessage", "chatMessageHandler")
-- or 
MP.RegisterEvent("onChatMessage", "handleChatMessage")
```

这个写法比让处理程序与事件同名要好，后者具有误导性，也容易让人困惑。
