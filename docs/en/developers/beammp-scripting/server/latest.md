---
description: "Reference for the BeamMP server plugin system, version 3: how plugins load, the events and functions the server provides, and how to migrate from the old Lua."
---
# Server Scripting Reference (Version 3.X)

## Introduction

BeamMP-Server release v3.0.0 does some drastic changes to the way the Lua plugin system works. There is no way to use the old lua with a new server, so you'll have to migrate.

The Server's Plugin system uses [Lua 5.3](https://www.lua.org/manual/5.3/). This section details how to get started writing plugins, teaches some basic concepts and gets you started with your first plugin. **It is recommended you read this section even if you know the pre-v3.0.0 system, as a few things changed drastically**.

For a migration guide from pre-v3.0.0 lua, go to the section ["Migrating from old Lua"](#migrating-from-old-lua).


## Directory Structure

Server plugins, unlike mods, are situated (by default) in `Resources/Server`, while mods, which are written for BeamNG.drive and are sent to the clients are in `Resources/Client`. Each plugin must have it's own subfolder in `Resources/Server`, for example for a plugin called "MyPlugin", the structure would be:

```
Resources
└── Server
    ├── MyPlugin
    │   └── main.lua
    └── SomeOtherPlugin
        └── ...
```

Here we also display another plugin called "SomeOtherPlugin", to illustrate how your `Resources/Server` folder can have multiple different plugin folders. We will keep using this directory structure as an example throughout this guide.

You also notice the `main.lua`. You can have as many Lua `.lua` files as you like. All Lua files in your plugin's main directory are loaded in *alphabetical order*, ignoring case (so `aaa.lua` is run before `bbb.lua`).

The plugin folders themselves are also loaded in alphabetical order, ignoring case. Anything in `Resources/Server` that is not a folder is skipped, and the server logs an error for it.


## Lua Files

Each Lua `.lua` file in the plugin's folder is loaded on server startup. This means that statements outside of functions are evaluated ("run") immediately.

Lua files in subfolders are ignored, but can be `require()`-ed. Before `onInit`, the server adds the plugin's folder and its `lua` subfolder to `package.path`, so `require("helpers")` finds `helpers.lua` in either. It adds the plugin's folder and its `lib` subfolder to `package.cpath` for `.so` files (`.dll` files on Windows).

For example, our `main.lua` looks like this:

```lua
function PrintMyName()
	print("I'm 'My Plugin'!")
end

print("What's up!")
```

When the server starts and the `main.lua` is loaded, it will run `print("What's up!")` *immediately*, but will **NOT** *call* the `PrintMyName` function yet (because it wasn't called)!

## Sharing a Lua state

Each plugin runs in its own Lua state, named after its folder. To let several plugins share one state, so that they see each other's globals and event handlers, add a file called `PluginConfig.toml` to each of those plugin folders:

```toml
LuaStateID = "MySharedState"
```

All plugins with the same `LuaStateID` run in the same state. An empty value is ignored, and the plugin keeps its own state. The state's name is also what you give to the `lua` console command (see [Debugging](#debugging)).

## Events

An event is something like "a player is joining", "a player sent a chat message", "a player spawned a vehicle".

You can cancel events (if they are cancellable) by returning `1` from the handler.

In Lua, you usually want to react to some of these. For this, you can register a "Handler". This is a function which is called when an event happens, and gets passed some arguments.

Example:

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

This will effectively make sure that any message that is exactly equal to "darn" will not be sent and won't show in chat (note that for a real profanity filter you'd want to see if the message *contains* "darn", not *is* "darn"). Cancelling an event causes it to not happen, for example a chat message not to be shown to anyone else, a vehicle not to be spawned, etc.

## Custom Events

You can register to any event you like, for example:

```lua
MP.RegisterEvent("MyCoolCustomEvent", "MyHandler")
```

You can then trigger those custom events:

```lua
-- call all event handlers to this in ALL plugins
MP.TriggerGlobalEvent("MyCoolCustomEvent")
-- call all event handlers to this in THIS plugin
MP.TriggerLocalEvent("MyCoolCustomEvent")
```

### Events from the game

A client-side plugin can trigger an event on the server with `TriggerServerEvent("eventName", "data")` (see [Mod (In-Game)](/en/developers/beammp-scripting/mod-in-game)). Register a handler for that name like any other event. The handler gets the ID of the player who sent it and the data string:

```lua
function MyHandler(player_id, data)
	print(MP.GetPlayerName(player_id) .. " sent: " .. data)
end

MP.RegisterEvent("MyClientEvent", "MyHandler")
```

Since v3.9.0, the server ignores a client event that has the name of one of the server's own events, such as `onChatMessage`, so a player cannot fake them. To send an event the other way, use [`MP.TriggerClientEvent`](#mp-triggerclientevent-player-id-number-event-name-string-data-string-boolean).

You can do a lot more with events, but those possibilities will be covered in detail below in the API reference.

## Event Timers ("Threads")

Pre-v3.0.0 Lua had a concept of "threads" which run X times per second. This naming was slightly misleading, as they were synchronous.

v3.0.0 Lua instead has "Event Timers". These are timers which run inside the server, and once they run out, they trigger an event (globally). This is also synchronous. Please be aware that the second argument is an interval in milliseconds.

Example:

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

This will cause "CountSeconds" to be called every second. You can also cancel event timers with `MP.CancelEventTimer` (see API reference).

From the server's console, you can run `status` to see how many event timers are running, how many event handlers are registered, and how many Lua states exist.

## Debugging

Lua is difficult to debug. An industry-grade debugger like `gdb` sadly doesn't exist for embedded Lua.

Generally, you can of course simple `print()` the values you want to inspect at any time. 

In v3.0.0, the server provides a way for you to inject an interpreter into a plugin and subsequently run Lua inside it in realtime. This is the closest we have to a debugger.

Assuming you have the plugin from above which we called `MyPlugin`, you can enter into its Lua state like so:

```
> lua MyPlugin
```

Capitalisation matters here, so be careful its entered correctly. 
The output is something like
```
lua @MyPlugin> 
```
As you can see, we switched into the Lua state for `MyPlugin`. From now on until we enter `:exit`, we will be in `MyPlugin` and can execute Lua there. Do not use `exit()` for this: it shuts the server down.

Commands that start with `:` are for the debugger itself. Anything else is run as Lua. The commands are:

- `:exit` detaches from the Lua state.
- `:help` shows the commands.
- `:events` lists the events and handlers registered in this state.
- `:queued` lists the functions that wait to be run in this state.

Typing `lua` without a name attaches to a state of the console's own, which has no plugin in it.

For example, if we have a global called `MyValue`, we can print that value like so:

```
lua @MyPlugin> print(MyValue)
```

You can call functions here and do anything you expect to be able to do.

You can press TAB to autocomplete functions and variables. This needs v3.1.0 or later.

WARNING: Sadly, if the Lua state is currently busy executing other code (like a `while` loop), this can fully hang the console until it finishes that work, so be very careful switching to states which may be waiting for something to happen.

Additionally, you can run `status` in the regular console (`> `), which shows you some statistics about Lua, among other things.

## Custom Commands

In order to implement custom commands for the server console, the event `onConsoleInput` can be used. 
This can be useful when you want to add a way for the server owner to signal something to your plugin, or to display internal state in a custom way.

Here's an example:

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

The handler gets the whole line that was typed. If it returns a value, the console prints it. If no handler returns a value and the line is not a built-in command, the console prints "Unknown command". The server also triggers this event for the built-in commands, such as `list`, so a plugin can react to them.

This will enable you to do the following in the server's console:

```
> print hello, world
hello, world
```

We implemented our own `print`. As an exercise, try to build a function like `say`, which sends a chat message to all players, or even a specific player (with `MP.SendChatMessage`).

**Caution:** For your own plugins, it's generally recommended to "namespace" them. Our `print` example, in a plugin called `mystuff`, could be called `mystuff.print` or `ms.print` or similar.

## API Reference

Documentation format: `function_name(arg_name: arg_type, arg_name: arg_type) -> return_types`

## Builtin Functions

### `print(...)`, `printRaw(...)`

Prints the message to the server console, prefixed with `[DATE TIME] [LUA]`. If you don't want this prefix, you can use `printRaw(...)`.

Example:

```lua
local name = "John Doe"
print("Hello, I'm", name, "and I'm", 32)
```

It can take as many arguments of arbitrary types as you like. It will also happily dump tables!

This behaves like the lua interpreter's `print`, so it will put tabs between arguments.

### `exit()`

Shuts down the server gracefully. Causes the `onShutdown` event to be triggered.

## MP Functions

### `MP.CreateTimer() -> Timer`

Creates a timer object, which can be used to keep track of how long something took / how much time elapsed. It starts once created, and can be reset/restarted with `mytimer:Start()`.

You can get the current elapsed time in seconds with `mytimer:GetCurrent()`.

Example:

```lua
local mytimer = MP.CreateTimer()
-- do stuff here that needs to be timed
print(mytimer:GetCurrent()) -- print how much time elapsed
```

Timers do not need to be stopped (and can't be stopped), they have no overhead.

### `MP.GetOSName() -> string`

Returns the name of the current OS, either `Windows`, `Linux` or `Other`.

### `MP.GetServerVersion() -> number,number,number`

Returns the current server version in major, minor, patch format. For example, the v3.0.0 version would return `3, 0, 0`.

Example:

```lua
local major, minor, patch = MP.GetServerVersion()
print(major, minor, patch)
```
Output for server v3.9.4:
```
3	9	4
```

### `MP.RegisterEvent(event_name: string, function_name: string)`

Remembers the function with name `Function Name` as an event handler to event with name `Event Name`.

You can register as many handlers to an event as you like.

For a list of events the server provides, see [here](#events-1).

If the event with that name doesn't exist, it's created, and thus RegisterEvent cannot fail. This can be used to create custom events. See [Custom Events](#custom-events) and [Events](#events) for more.

Example:

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

Starts a timer inside the server which triggers the event `event_name` every `interval_ms` milliseconds.

Event timers can be cancelled with `MP.CancelEventTimer`.

Intervals <25 ms are not encouraged, as multiple such intervals will likely not be served in time reliably. While multiple timers can be started on the same event, it's encouraged to create as few event timers as possible. For example, if you need one event that runs every half second, and one which runs every second, consider just making the half-second one and running the every-second-functiosecond trigger.

You may also use `MP.CreateTimer` to make a timer and measure time passed since the last event call, in order to minimize event timers, though this is not necessarily recommended as it increases the code complexity significantly.

**Since 3.0.2:**

An optional `CallStrategy` may be supplied as the third argument. This can be either:

- `MP.CallStrategy.BestEffort` (default): Will try to get your event to trigger at the specified interval, but will refuse to queue handlers if a handler takes too long.
- `MP.CallStrategy.Precise`: Will enqueue event handlers at the exact interval specified. Can lead to the queue filling up if the handler takes longer than the interval. Only use if you NEED the exact interval.

### `MP.CancelEventTimer(event_name: string)`

Cancels all timers on the event with the name `event_name` that were created in the current Lua state. On some occasions, the timer might go off one more time before being cancelled, due to the nature of asynchronous programming.

### `MP.TriggerLocalEvent(event_name: string, ...) -> table`

Plugin-local synchronous event trigger.

Triggers an event locally, which causes all handlers to that event *in the current lua state* (usually the current plugin, unless state was shared via PluginConfig.toml) to be called.

You can pass arguments to this function (`...`) which are copied and sent to all handlers as function arguments.

This call is synchronous and will return once all event handlers finished.

The returned value is a table of all results. If a handler returned a value, it will be in this table, unannotated and unnamed. This can be used to "collect" things, or register sub-handlers for events that can be cancelled. This is practically an array.

Example:

```lua
local Results = MP.TriggerLocalEvent("MyEvent")
print(Results)
```

### `MP.TriggerGlobalEvent(event_name: string, ...) -> table`

Global asynchronous event trigger.

Triggers an event globally, which causes all handlers to that event *in all plugins* (including *this* plugin) to be called.

You can pass arguments to this function (`...`) which are copied and sent to all handlers as function arguments.

This call is asynchronous and returns a future-like object. Local handlers (handlers in the same plugin as the caller) run synchronously and immediately. 

The table returned has two functions:

- `IsDone() -> boolean` tells you whether all handlers have finished. You can wait until this is true by checking it and `MP.Sleep`-ing for a little bit in a loop.
- `GetResults() -> table` returns an unannotated unnamed table with all return values of all handlers. This is practically an array.

Make sure to call these with `Obj:Function()` syntax (`:`, NOT `.`).

Example:

```lua
local Future = MP.TriggerGlobalEvent("MyEvent")
-- wait until handlers finished
while not Future:IsDone() do
	MP.Sleep(100) -- sleep 100 ms
end
local Results = Future:GetResults()
print(Results)
```

Be aware that a handler registering to "MyEvent" here and never returning could lock up your plugin. You likely want to keep track of how long you have waited and stop waiting after a few seconds.

### `MP.Sleep(time_ms: number)`

Waits for an amount of time, specified in milliseconds.

This does not yield the execution of the lua state and nothing will execute in the state while asleep. 

WARNING: Do NOT sleep for >500 ms if you have event handlers registered, unless you know *exactly* what you are doing. This is intended to be used to sleep for 1-100 ms, in order to wait for results or similar. A locked up (sleeping) lua state can slow the entire server down drastically if not careful.

### `MP.SendChatMessage(player_id: number, message: string, [log_chat: boolean])`

Sends a chat message that only the specified player can see (or everyone if the ID is `-1`).
In the game, this will not appear as a directed message.

Since v3.9.2, the optional third argument `log_chat` decides whether the message is written to the server log. It is `true` if you leave it out. Even then, the log only contains chat while the `LogChat` setting is on. The message is not sent to a player who has not finished joining.

You can use this, for example, to tell a player *why* you cancelled their vehicle spawn, chat message, or similar, or to display some information about your server.

Example:
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
Example 2:
```lua
function ChatHandler(player_id, player_name, msg)
    if msg == "hello" then
        MP.SendChatMessage(-1, "Hello World!") -- If the player sends the exact message "hello", announce to the entire server "Hello World!"
        return 0
    end
end
```

### `MP.TriggerClientEvent(player_id: number, event_name: string, data: string) -> boolean`
*until v3.1.0*

### `MP.TriggerClientEvent(player_id: number, event_name: string, data: string) -> boolean,string`
*since v3.1.0*

### `MP.TriggerClientEventJson(player_id: number, event_name: string, data: table) -> boolean,string`
*since v3.1.0*

Will call the given event with the given data on the specified client (-1 for broadcast). This event can then be handled in a clientside lua mod, see the "Client Scripting" documentation for this.

Will return `true` if it was able to send the message (for `id = -1`, so broadcasts, its always `true`), and `false` if the player with that ID doesn't exist or is disconnected but still has an ID (this is a known issue).

If `false` is returned, it makes no sense to retry this event, and a response (if any was expected) shouldn't be expected.

Since v3.1.0, the second return value contains an error message if the function failed. Also since this version, the `*Json` version of the function takes a table as the data argument, and converts it to json. This is simply a shorthand for `MP.TriggerClientEvent(..., Util.JsonEncode(mytable))`.

The error message is `Invalid Player ID` if no such player exists, or `Player hasn't joined yet` if the player is still downloading mods. Since v3.8.3, the server does not send events to a player who is still downloading.

### `MP.SendNotification(player_id: number, message: string, [icon: string], [category: string])`

*since v3.6.0*

Shows a notification in the game of the specified player (or of everyone if the ID is `-1`). If you leave out `icon`, the notification has no icon. If you leave out `category`, it is the same as `message`. Leaving out the icon works since v3.7.2. The function takes two to four arguments, and logs an error for any other number. It returns nothing. A player who has not finished joining does not get the notification.

Example:
```lua
MP.SendNotification(-1, "The race starts in one minute")
```

### `MP.ConfirmationDialog(player_id: number, title: string, body: string, buttons: table, interaction_id: string, [warning: boolean, report_to_server: boolean, report_to_extensions: boolean]) -> boolean,string`

*since v3.8.5*

Shows a dialog window with buttons in the game of the specified player (or of everyone if the ID is `-1`). Give either the first five arguments, or all eight. With five arguments, the function returns nothing. With eight, it returns `true`, or `false` and an error message such as `Player is not synced yet` or `Invalid Player ID`.

- `buttons` is a table of tables. Each has a `label` (the text on the button), a `key` (the name of the event that is triggered on the server when the button is pressed) and, for at most one button, `isCancel = true`. The button with `isCancel` counts as pressed when the player closes the dialog with `Esc`. If no button has `isCancel`, the player can only close the dialog with one of the buttons.
- `interaction_id` is passed to the `key` event as its data, so you can tell which dialog a button belonged to when several dialogs are open.
- `warning` (default `false`) marks the dialog as a warning.
- `report_to_server` (default `true`) and `report_to_extensions` (default `true`) decide where the button press is reported.

The button press arrives like an event from the game: the handler gets the player's ID and the `interaction_id`.

Example:
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

Returns the amount of players currently in the server.

### `MP.GetPositionRaw(pid: number, vid: number) -> table,string`

Returns the current position of the vehicle `vid` (vehicle id) of player `pid` (player id), and an error string if an error occurred.

The table is decoded from a position packet, so it has a variety of data including position and rotation (that's why this function is postfixed "Raw").

Example:
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
Output:
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
Example 2:
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
Output:
```
X: -603.459
Y: -175.078
Z: 26.9505
```

### `MP.IsPlayerConnected(player_id: number) -> boolean`

Whether the player is connected and if the server has received a UDP packet from them.

Example:
```lua
local player_id = 8
print(MP.IsPlayerConnected(player_id)) -- Check if player with ID 8 is properly connected.
```
Output:
```lua
true
```

### `MP.GetPlayerName(player_id: number) -> string`

Gets the display-name of the player. Returns an empty string if there is no player with that ID.

Example:
```lua
local player_id = 4
print(MP.GetPlayerName(player_id)) -- Get the name of the player with ID 4
```
Output:
```
ilovebeammp2004
```

### `MP.GetPlayerIDByName(name: string) -> number`

Returns the ID of the player whose display-name is exactly `name`, including capitalisation. Returns `-1` if there is no such player.

Example:
```lua
local player_id = MP.GetPlayerIDByName("ilovebeammp2004")
if player_id ~= -1 then
    MP.SendChatMessage(player_id, "Hello!")
end
```

### `MP.GetPlayerRole(player_id: number) -> string`

*since v3.6.0*

Returns the role of the player, as the BeamMP backend reports it when the player joins, for example `USER`. Returns `nil` if there is no player with that ID. It is the same value as the `player_role` argument of [`onPlayerAuth`](#onplayerauth).

### `MP.RemoveVehicle(player_id: number, vehicle_id: number) -> boolean,string`

Removes the specified vehicle for the specified player. Triggers [`onVehicleDeleted`](#onvehicledeleted).

Returns `true` if it removed the vehicle. If it did not, it returns `false` and an error message: `Vehicle does not exist` or `Invalid Player ID`.

Example:
```lua
local player_id = 3
local player_vehicles = MP.GetPlayerVehicles(player_id)

-- Loop over all of player 3's vehicles and delete them
for vehicle_id, vehicle_data in pairs(player_vehicles) do
      MP.RemoveVehicle(player_id, vehicle_id)
end
```

### `MP.GetPlayerVehicles(player_id: number) -> table`

Returns a table of all vehicles the player has. Each entry in the table is a mapping from vehicle ID to vehicle data, which is a raw string in the format `role:name:player_id-vehicle_id:json`. Returns `nil` if the player does not exist or has no vehicles.

Example:
```lua
local player_id = 3
local player_vehicles = MP.GetPlayerVehicles(player_id)

for vehicle_id, vehicle_data in pairs(player_vehicles) do
    local start = string.find(vehicle_data, "{")
    local formattedVehicleData = string.sub(vehicle_data, start, -1)
    print(Util.JsonDecode(formattedVehicleData))
end
```
Output:
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

Returns a table of all connected players. This table maps IDs to Names, like so:  
```json
{
	0: "LionKor",
	1: "JohnDoe"
}
```

### `MP.IsPlayerGuest(player_id: number) -> boolean`

Whether the player is a guest. A guest is someone who didn't log in, and instead chose to play as a guest. Their name is usually `guest` followed by a long number.

Because guests are anonymous, you may want to disallow them to join, if so it is recommended to use the [`onPlayerAuth`](#onplayerauth) `is_guest` argument instead.

### `MP.DropPlayer(player_id: number, [reason: string]) -> boolean,string`

Kicks the player with the specified ID. The reason parameter is optional. Without it, the player sees `No reason`.

Returns `true`, or `false` and `Player does not exist` if there is no player with that ID.

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

Returns the memory usage of the current Lua state in bytes.

### `MP.GetLuaMemoryUsage() -> number` 

Returns the memory usage of all lua states combined, in bytes.

### `MP.GetPlayerIdentifiers(player_id: number) -> table`

Returns a table with information about the player, such as BeamMP forum ID, IP address and Discord account ID. Discord ID will only be returned if the user has it linked to their forum account.

You can find a users forum ID by navigating to `https://forum.beammp.com/u/USERNAME.json` and looking for `"user": {"id": 123456}`. A BeamMP ID is unique to the player and cannot be changed unlike the username. Returns `nil` if the player does not exist.

Example:

```lua
local player_id = 5
print(MP.GetPlayerIdentifiers(player_id))
```
Output:
```json
{
    ip: "127.0.0.1",
    discord: "12345678987654321",
    beammp: "1234567",
}
```

*Until v3.1.0 the `ip` field is incorrect and will not work as intended. Fixed in v3.1.0.*

### `MP.Set(setting: number, value)`

Sets a ServerConfig setting temporarily: the change lasts until the server stops and is not written to `ServerConfig.toml`. For the first argument, use a value of the `MP.Settings` table. The type of `value` depends on the setting:

- `MP.Settings.Debug`, `MP.Settings.Private` and `MP.Settings.InformationPacket` take a boolean.
- `MP.Settings.MaxCars` and `MP.Settings.MaxPlayers` take an integer.
- `MP.Settings.Map`, `MP.Settings.Name` and `MP.Settings.Description` take a string.

A value of the wrong type logs an error, and an unknown setting logs a warning. Neither changes anything. A server provider can disable this function, see `BEAMMP_PROVIDER_DISABLE_MP_SET` in the [Server Manual](/en/server-owners/manual#provider-settings). Then every call logs an error and changes nothing.

Example:
```lua
MP.Set(MP.Settings.Debug, true) -- Turns on debug mode
```

### `MP.Get(setting: number) -> boolean | number | string`

*since v3.6.0*

Returns the current value of a ServerConfig setting. For the argument, use a value of the `MP.Settings` table. The type of the result is the type that `MP.Set` takes for that setting. For an unknown setting, it logs a warning and returns `0`.

Example:
```lua
print(MP.Get(MP.Settings.MaxPlayers))
```

### `MP.Settings -> table`

Table map of setting names to ID's. Used with `MP.Set` and `MP.Get` to change and read ServerConfig settings. `InformationPacket` exists since v3.7.0.

Example:
```lua
print(MP.Settings)
```
Output:
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

*since v3.9.4*

Return the reading of the server's own clock. The server also sends this reading to a player's game when the game asks for the time. `MP.GetServerTimeMS()` returns it in milliseconds and `MP.GetServerTime()` in seconds, with decimals. The clock does not show the date or the time of day, and it starts at a different value every time the server starts. Use it to measure how much time passed between two moments, not to find out what time it is.

Example:
```lua
local start = MP.GetServerTimeMS()
-- do something
print("took " .. (MP.GetServerTimeMS() - start) .. " ms")
```
## Util Functions

### `Util.Json*`

Since BeamMP-Server `v3.1.0`.

This is a builtin JSON library, which is usually much faster than any Lua JSON library. Behind the scenes, C++'s `nlohmann::json` library is used, which is JSON compliant, full-coverage unit tested and continuously being fuzzed.

### `Util.JsonEncode(table: table) -> string`

Encodes a Lua table into a JSON string, recursively (tables inside tables inside tables ... work as expected). All primitive types are respected, functions, userdata and similar are ignored.

The resulting JSON is minified and can be pretty-printed by using `Util.JsonPrettify` to prettify it.

Example: 
```lua
local player = {
	name = "Lion",
	age = 69,
	skills = { "skill A", "skill B" }
}
local json = Util.JsonEncode(player)
```

Results in: 
```json
{"name":"Lion","age":69,"skills":["skill A","skill B"]}
```

### `Util.JsonDecode(json: string) -> table`

Decodes JSON into a Lua table. Will return `nil` if this failed, and print an error.

Example:
```lua
local json = "{\"message\":\"OK\",\"code\":200}"
local tbl = Util.JsonDecode(json)
```

Results in:
```lua
{
	message = "OK",
	code = 200,
}
```

### `Util.JsonPrettify(json: string) -> string`

Add indentation and newlines to the json to make it more readable for humans.

Example:
```
local myjson = Util.JsonEncode({ name="Lion", age = 69, skills = { "skill A", "skill B" } })

print(Util.JsonPrettify(myjson))
```

Results in:
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

Removes indentation, newlines and any other whitespace. Not necessary unless you called `Util.JsonPrettify`, as all output from `Util.Json*` is already minified.

Example:
```lua
local pretty = Util.JsonPrettify(Util.JsonEncode({ name="Lion", age = 69, skills = { "skill A", "skill B" } }))

print(Util.JsonMinify(pretty))
```

Results in:
```json
{"age":69.0,"name":"Lion","skills":["skill A","skill B"]}
```

### `Util.JsonFlatten(json: string) -> string`

Creates a JSON object whose key are flattened to JSON pointers, according to RFC 6901. You can restore the original with `Util.JsonUnflatten()`. For this to work, all values need to be primitives.

Example:
```lua
local json = Util.JsonEncode({ name="Lion", age = 69, skills = { "skill A", "skill B" } })
print("normal: " ..json)
print("flattened: " .. Util.JsonFlatten(json))
print("flattened pretty: " .. Util.JsonPrettify(Util.JsonFlatten(json)))

```

Results in: 
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

Restores the arbitrary nesting of a JSON value that has been flattened before using the `Util.JsonFlatten()` function. 

### `Util.JsonDiff(a: string, b: string) -> string`

Creates a JSON diff according to RFC 6902 (http://jsonpatch.com/). Returns the diff.

## `Util.Random*`

Since BeamMP-Server `v3.1.0`.

### `Util.Random() -> float`

Returns a float between 0 and 1.

Example:
```lua
local rand = Util.Random()
print("rand: " .. rand)
```

Results in: 
```lua
rand: 0.135477
```

### `Util.RandomIntRange(min: int, max: int) -> int`

Returns an integer between min and max.

Example:
```lua
local randInt = Util.RandomIntRange(1, 100)
print("randInt: " .. randInt)
```

Results in: 
```lua
randInt:  69
```

### `Util.RandomRange(min: number, max: number) -> float`

Returns a float between min and max.

Example:
```lua
local randFloat = Util.RandomRange(1, 1000)
print("randFloat: " .. randFloat)
```

Results in: 
```lua
randFloat: 420.6969
```

### `Util.LogInfo(params: ...)` et al (since v3.3.0)

```lua
Util.LogInfo("Hello, World!")
Util.LogWarn("Cool warning")
Util.LogError("Oh no!")
Util.LogDebug("hi")
```
produces

```
[19/04/24 11:06:50.142] [Test] [INFO] Hello, World!    
[19/04/24 11:06:50.142] [Test] [WARN] Cool warning    
[19/04/24 11:06:50.142] [Test] [ERROR] Oh no!
[19/04/24 11:06:50.142] [Test] [DEBUG] hi
```

`[Test]` is the name of the Lua state, which is the plugin's name unless the plugin shares a state (see [Sharing a Lua state](#sharing-a-lua-state)). `Util.LogDebug` only prints while the `Debug` setting is on.

Supports the exact same printing / dumping of data as `print()` does.

### `Util.DebugExecutionTime() -> table`

When Lua code runs in the server, each event handler's execution is timed. The min, max, average (mean) and standard deviation of these execution times are calculated, and are returned in a table by this function. The calculation takes place incrementally, so every time an event handler runs the min, max, average and standard deviation are updated. This way, `Util.DebugExecutionTime()` does not usually take any significant amount of time to execute (sub 0.25ms).

It returns a table like this:
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
Per event *handler*, returns the following data:

- `n`: Amount of times the event triggered and a handler was called
- `mean`: Average/mean of all execution times, in ms
- `max`: The longest execution time, in ms
- `min`: The shortest execution time, in ms
- `stdev`: The standard deviation of all execution time averages, in ms

Here's a function you can use to pretty-print this data:

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

You may call it like this to debug your code if it's slow:

```lua
-- event to print the debug times
MP.RegisterEvent("printStuff", "printDebugExecutionTime")
-- run every 5000 ms = 5 seconds (or 10, or 60, whatever makes sense for you
MP.CreateEventTimer("printStuff", 5000)
```

### `Util.DebugStartProfile(name: string)`

### `Util.DebugStopProfile(name: string)`

Since BeamMP-Server `v3.4.0`.

Time any part of your code, not only a whole event handler. `Util.DebugStartProfile` starts a measurement with the given name, and `Util.DebugStopProfile` ends it and adds the time to the statistics for that name. The statistics show up in the table that `Util.DebugExecutionTime()` returns, next to the event handlers. Calling `Util.DebugStopProfile` with a name that was not started logs an error.

Example:
```lua
Util.DebugStartProfile("mySlowPart")
-- do something slow
Util.DebugStopProfile("mySlowPart")
print(Util.DebugExecutionTime()["mySlowPart"].mean)
```

## FS Functions

`FS` functions are **f**ile**s**ystem functions, which aim to be better than the default Lua capabilities.

Please always use `/` as a separator when specifying paths, as this is cross-platform (windows, linux, macos, ...).

### `FS.CreateDirectory(path: string) -> bool,string`


Creates the specified directory, and any parent directories if they don't exist. Behavior is roughly equivalent to the common linux command `mkdir -p`.

If successful, returns `true` and `""`. If creating the directory failed, `false` and an error message (`string`) is returned.

Example:
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

Removes the specified file or empty folder. A folder that has files in it is not removed.

Returns `true` if it succeeded, or if there was nothing to remove. If it failed, it returns `false` and an error message.

Example:
```lua
local success, error_message = FS.Remove("myfile.txt")

if not success then
	print("failed to delete myfile: " .. error_message)
end
```

### `FS.Rename(pathA: string, pathB: string) -> bool,string`

Renames (or moves) `pathA` to `pathB`.

Returns `true` if it succeeded. If it failed, it returns `false` and an error message.

### `FS.Copy(pathA: string, pathB: string) -> bool,string`

Copies `pathA` to `pathB`. A folder is copied with everything in it.

Returns `true` if it succeeded. If it failed, it returns `false` and an error message.

### `FS.GetFilename(path: string) -> string`

Returns the last part of a path, which is usually the filename.
Here are some example inputs + outputs:

```lua
input -> output

"my/path/a.txt" 	-> "a.txt"
"somefile.txt" 		-> "somefile.txt"
"/awesome/path" 	-> "path"
```

### `FS.GetExtension(path: string) -> string`


Returns the extension of the file, or an empty string if no extension exists.
Here are some example inputs + outputs

```lua
input -> output

"myfile.txt" 					-> ".txt"
"somefile." 					-> "."
"/awesome/path" 				-> ""
"/awesome/path/file.zip.txt"	-> ".txt"
"myexe.exe" 					-> ".exe"
```


### `FS.GetParentFolder(path: string) -> string`

Returns the path to the parent directory, i.e. the folder a file or folder is contained in.
Here are some example inputs + outputs:

```lua
input -> output

"/var/tmp/example.txt" 		-> "/var/tmp"
"/"							-> "/"
"mydir/a/b/c.txt"			-> "mydir/a/b"
```


### `FS.Exists(path: string) -> bool`

Returns `true` if the path exists, `false` if it doesn't.

### `FS.IsDirectory(path: string) -> bool`

Returns `true` if the specified path is a directory, `false` if it's not. Note that `false` does NOT imply that the path is a file (see `FS.IsFile()`).

### `FS.IsFile(path: string) -> bool`

Returns `true` if the specified path is a regular file (not a symlink, hardlink, block device, etc.), `false` if it's not. Note taht `false` does NOT imply that the path is a directory (see `FS.IsDirectory()`).

### `FS.ListDirectories(path: string) -> table`

Returns a table of all the directories in the given path. Returns `nil` if the path does not exist.

Example:
```lua
print(FS.ListDirectories("Resources"))
```
Results in: 
```lua
{
    1: "Client",
    2: "Server"
}
```

### `FS.ListFiles(path: string) -> table`

Returns a table of all the files in the given path. Returns `nil` if the path does not exist.

Example:
```lua
print(FS.ListFiles("Resources/Server/examplePlugin"))
```
Results in: 
```lua
{
    1: "example.json",
    2: "example.lua"
}
```

### `FS.ConcatPaths(...) -> string`

Adds together (concatenates) all arguments with the system's preferred path separator.

Example:
```lua  
FS.ConcatPaths("a", "b", "/c/d/e/", "/f/", "g", "h.txt")
```
results in
```
a/b/c/d/e/f/g/h.txt
```

Also resolves `..`, if that exists in the path at any point. This function is safer than concatenating strings in lua, and respects the platform's separators.

Please always use `/` as a separator when specifying paths, as this is cross-platform (windows, linux, macos, ...).

## Events

### Explanation

- Arguments: List of arguments given to handlers of this event
- Cancellable: Whether the event can be cancelled. If it can be cancelled, a handler can do so by returning `1`, like `return 1`.

### Summary of events

A player join triggers the following events in the given order:

1. `onPlayerAuth`
2. `postPlayerAuth` (also if the player was refused)
3. `onPlayerConnecting`
4. `onPlayerJoining`
5. `onPlayerJoin`

Events whose name starts with `post` tell you the outcome of the event of the same name, after it happened. You cannot cancel them.

### System Events

#### `onInit`

Arguments: NONE
Cancellable: NO

Triggered right after all files in the plugin were initialized. The server waits up to 5 seconds for the handlers. It is also triggered again for a plugin when one of its `.lua` files is hot-reloaded.

#### `onConsoleInput`

Arguments: `input: string`
Cancellable: NO

Triggered when the BeamMP console receives an input. The argument is the whole line that was typed. See [Custom Commands](#custom-commands).

#### `onShutdown`

Arguments: NONE
Cancellable: NO

Triggered when the server shuts down, after all players were kicked. The server waits up to 5 seconds for the handlers.

### Game-Related Events

#### `onPlayerAuth`

Arguments: `player_name: string`, `player_role: string`, `is_guest: bool`, `identifiers: table -> beammp, ip`
Cancellable: YES

First event that gets triggered when a player wants to join. A player can be denied from joining by returning `1` or a reason (`string`) from the handler function. A returned reason is shown to the player. With `1`, the player sees "you are not allowed on the server!".

Since v3.6.0, a handler can return `2` to let the player join even if the server is full (`MaxPlayers`). This does not override a refusal from another handler, and it does not allow a guest on a server where `AllowGuests` is `false`.

```lua
function myPlayerAuthorizer(name, role, is_guest, identifiers)
	return "Sorry, you cannot join at this time."
end
MP.RegisterEvent("onPlayerAuth", "myPlayerAuthorizer")
```

#### `postPlayerAuth`

*since v3.5.0*

Arguments: `denied: bool`, `reason: string`, `player_name: string`, `player_role: string`, `is_guest: bool`, `identifiers: table -> beammp, ip`
Cancellable: NO

Triggered right after `onPlayerAuth`, whether the player was allowed to join or not. `denied` is `true` if the player was refused. `reason` is the text shown to the player, or an empty string if there is none.

#### `onPlayerConnecting`

Arguments: `player_id: number`
Cancellable: NO

Triggered when a player first starts connecting, after `onPlayerAuth`. The player gets their ID before this event. The player has not downloaded the mods yet.

#### `onPlayerJoining`

Arguments: `player_id: number`
Cancellable: NO

Triggered when a player has finished loading all mods, after `onPlayerConnecting`.

#### `onPlayerJoin`

Arguments: `player_id: number`
Cancellable: NO

Triggered after `onPlayerJoining`, when the player's game reports that it has joined. The server then starts sending the player the vehicles that already exist.

#### `onPlayerDisconnect`

Arguments: `player_id: number`
Cancellable: NO

Triggered when a player disconnects. It comes after [`onVehicleDeleted`](#onvehicledeleted) was triggered for each of the player's vehicles.

#### `onChatMessage`

Arguments: `player_id: number`, `player_name: string`, `message: string`
Cancellable: YES

Triggered when a player sends a chat message. When cancelled, it will not show the chat message to anyone, not even the player who sent it. The server drops an empty message, and one longer than 500 bytes (since v3.9.1), before it triggers this event.

#### `postChatMessage`

*since v3.5.0*

Arguments: `accepted: bool`, `player_id: number`, `player_name: string`, `message: string`
Cancellable: NO

Triggered after `onChatMessage`. `accepted` is `false` if a handler cancelled the message.

#### `onVehicleSpawn`

Arguments: `player_id: number`, `vehicle_id: number`, `data: string`
Cancellable: YES

Triggered when a player spawns a new vehicle. Note that vehicle swaps/replacements instead fire [`onVehicleEdited`](#onvehicleedited). The `data` argument contains the car's configuration and positional/rotational data for the vehicle as a json string. A vehicle also does not spawn if the player already has `MaxCars` vehicles. The unicycle does not count.

#### `postVehicleSpawn`

*since v3.5.0*

Arguments: `spawned: bool`, `player_id: number`, `vehicle_id: number`, `data: string`
Cancellable: NO

Triggered after `onVehicleSpawn`. `spawned` is `false` if a handler cancelled the spawn, or if the vehicle was refused for another reason, such as the player having `MaxCars` vehicles. `data` is the same as in `onVehicleSpawn`.

<details>

<summary>Example <code>data</code> value</summary>

The data string begins with the player's role and name, then a unique vehicle identifier, which is the player's ID, a hyphen, and then the vehicle ID. This is followed by a JSON object containing information about the vehicles configuration and positioning. The parts are separated by `:`, so the string looks like `role:name:player_id-vehicle_id:{...}`. In the example below, the role and name are left out.

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

Arguments: `player_id: number`, `vehicle_id: number`, `data: string`
Cancellable: YES

Triggered when a player edits or replaces their vehicle. The `data` argument contains the car's updated configuration as a json string but does **not** include positional or rotational data. You can use [MP.GetPositionRaw](#mp-getpositionraw-pid-number-vid-number-table-string) to get positional and rotational data.

<details>

<summary>Example <code>data</code> value</summary>

The data string begins with a unique vehicle identifier, which is the player's ID, a hyphen, and then the vehicle ID. This is followed by a JSON object containing information about the vehicles configuration.

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

*since v3.5.0*

Arguments: `allowed: bool`, `player_id: number`, `vehicle_id: number`, `data: string`
Cancellable: NO

Triggered after `onVehicleEdited`. `allowed` is `false` if a handler cancelled the edit. The server then deletes the vehicle. `data` is the same as in `onVehicleEdited`.

#### `onVehicleDeleted`

Arguments: `player_id: number`, `vehicle_id: number`
Cancellable: NO

Triggered when a player deletes their vehicle. It is also triggered when `MP.RemoveVehicle` removes a vehicle, when a spawn or an edit is cancelled and the vehicle is deleted, and, since v3.5.0, for each vehicle of a player who disconnects.

#### `onVehicleReset`

Arguments: `player_id: number`, `vehicle_id: number`, `data: string`
Cancellable: NO

Triggered when a player resets their vehicle. `data` is the car's updated position and rotation however does **not** include the vehicles configuration. You can use [MP.GetPlayerVehicles](#mp-getplayervehicles-player-id-number-table) to get the vehicles configuration.

#### `onVehiclePaintChanged`

*since v3.7.0*

Arguments: `player_id: number`, `vehicle_id: number`, `data: string`
Cancellable: NO

Triggered when a player changes the paint of their vehicle. `data` is a json string with the new paints of the vehicle, which is an array. The server stores the new paints in the vehicle's data, so [MP.GetPlayerVehicles](#mp-getplayervehicles-player-id-number-table) returns them afterwards.

#### `onFileChanged`

*since v3.1.0*

Arguments: `path: string`
Cancellable: NO

Triggered if a file changes in the `Resources/Server` directory *or any subdirectory of it*. The server checks for changes every 3 seconds.

A change to a `.lua` file in the `Resources/Server/<plugin>` directory (not in a subfolder of it) makes the server run that file again in the plugin's Lua state, then trigger `onInit` for that plugin, and then trigger `onFileChanged`. The state itself is kept, so its globals stay, and handlers you registered before are still registered.

A change to any other file in `Resources/Server/<plugin>`, or to any file in a subfolder, such as `Resources/Server/<plugin>/lua/stuff.lua`, does not run anything and only triggers `onFileChanged`. This way, you can reload it yourself in the correct way (or not reload it).

This applies to all files, not just `.lua` files.

The `path` is relative to the root of the server, for example `Resources/Server/myplugin/myfile.txt`. You can do further processing on this string with the `FS.*` family of functions, such as extracting the name or extension (`FS.GetExtension(...)`, `FS.GetFilename(...)`, ...).

Note: Files added after the server is started are *not* tracked.

## Migrating from old Lua

This is a short run-down of the basic steps to take to migrate from old to new lua.

### Understand how the new lua works

For this, please read through the section ["Introduction"](#introduction) and all its subsections carefully.
It's necessary to do the next steps properly.

### Search & Replace

First, you should search and replace all MP functions. The substitution should add an `MP.` infront of all MP functions, except `print()`.

Example:

```lua
local players = GetPlayers()
print(#players)
```
becomes

```lua
local players = MP.GetPlayers()
print(#players) -- note how print() doesn't change
```

### Goodbye Threads, Hello Event Timers!

As discussed in the introduction, threads are event timers. For any calls to `CreateThread`, replace it with a call to `CreateEventTimer`. Carefully inspect the timing your old CreateThread had (the number was X per second), and think about what the event timer timeout value is for this (which is in milliseconds). Also keep in mind that instead of a function name, it takes an event name, so you will have to register an event as well.

Example:

```lua
CreateThread("myFunction", 2) -- calls "myFunction" twice per second
```
becomes

```lua
MP.RegisterEvent("myEvent", "myFunction") -- registering our event for the timer
MP.CreateEventTimer("myEvent", 500) -- 500 milliseconds = 2 times per second
```

If you have many event timers, it makes sense to see if you can combine them, e.g. by creating a "every minute" event and registering multiple functions to it which need to be called every minute, instead of having multiple event timers. Each event timer costs the server a little bit of time to trigger.

### No more implicit event calling

You need to register all your events. You cannot rely on function names. In the old lua, this was unclear, but in the new lua this is usually enforced. A good pattern is: 

```lua
MP.RegisterEvent("onChatMessage", "chatMessageHandler")
-- or 
MP.RegisterEvent("onChatMessage", "handleChatMessage")
```

This is a better pattern than calling the handler the same as the event, which is misleading and confusing.