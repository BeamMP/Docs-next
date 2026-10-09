---
description: "Справочник по системе плагинов сервера BeamMP версии 3: как загружаются плагины, какие события и функции предоставляет сервер и как перейти со старого Lua."
---
# Справочник по серверному скриптингу (версия 3.X)

## Введение {#introduction}

Релиз BeamMP-Server v3.0.0 серьёзно изменил то, как работает система плагинов на Lua. Использовать старый lua с новым сервером нельзя, поэтому вам придётся выполнить миграцию.

Система плагинов сервера использует [Lua 5.3](https://www.lua.org/manual/5.3/). В этом разделе описано, как начать писать плагины, объяснены базовые понятия и показано, как создать ваш первый плагин. **Рекомендуем прочитать этот раздел, даже если вы знакомы с системой до v3.0.0, так как несколько вещей изменились кардинально**.

Руководство по миграции с lua до v3.0.0 находится в разделе [«Миграция со старого Lua»](#migrating-from-old-lua).


## Структура каталогов

Серверные плагины, в отличие от модов, находятся (по умолчанию) в `Resources/Server`, а моды, которые пишутся для BeamNG.drive и отправляются клиентам, — в `Resources/Client`. У каждого плагина должна быть своя подпапка в `Resources/Server`. Например, для плагина «MyPlugin» структура будет такой:
```
Resources
└── Server
    ├── MyPlugin
    │   └── main.lua
    └── SomeOtherPlugin
        └── ...
```
Здесь также показан ещё один плагин, «SomeOtherPlugin», чтобы проиллюстрировать, что в вашей папке `Resources/Server` может быть несколько разных папок плагинов. Мы будем использовать эту структуру каталогов как пример на протяжении всего руководства.

Вы также видите `main.lua`. Файлов Lua `.lua` может быть сколько угодно. Все файлы Lua в основной папке вашего плагина загружаются в *алфавитном порядке* (то есть `aaa.lua` выполняется раньше `bbb.lua`).


## Файлы Lua

Каждый файл Lua `.lua` в папке плагина загружается при запуске сервера. Это означает, что выражения вне функций вычисляются («выполняются») сразу.

Файлы Lua в подпапках игнорируются, но их можно подключить через `require()`.

Например, наш `main.lua` выглядит так:
```lua
function PrintMyName()
	print("I'm 'My Plugin'!")
end

print("What's up!")
```
Когда сервер запускается и загружается `main.lua`, он *сразу* выполнит `print("What's up!")`, но функцию `PrintMyName` пока **НЕ** *вызовет* (потому что её не вызывали)!

## События {#events}

Событие — это что-то вроде «игрок подключается», «игрок отправил сообщение в чат», «игрок создал транспорт».

Вы можете отменять события (если их можно отменить), возвращая `1` из обработчика.

В Lua обычно нужно реагировать на некоторые из этих событий. Для этого можно зарегистрировать «обработчик» (Handler). Это функция, которая вызывается при наступлении события и получает некоторые аргументы.

Пример:
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
Так любое сообщение, в точности равное «darn», не будет отправлено и не появится в чате (учтите, что для настоящего фильтра нецензурных слов нужно проверять, *содержит* ли сообщение «darn», а не *равно* ли оно «darn»). Отмена события приводит к тому, что оно не происходит: например, сообщение в чате не показывается никому другому, транспорт не создаётся и так далее.

## Пользовательские события {#custom-events}

Вы можете зарегистрироваться на любое событие, например:
```lua
MP.RegisterEvent("MyCoolCustomEvent", "MyHandler")
```
Затем вы можете запускать эти пользовательские события:
```lua
-- call all event handlers to this in ALL plugins
MP.TriggerGlobalEvent("MyCoolCustomEvent")
-- call all event handlers to this in THIS plugin
MP.TriggerLocalEvent("MyCoolCustomEvent")
```
С событиями можно делать гораздо больше, но эти возможности подробно рассматриваются ниже, в справочнике по API.

## Таймеры событий («потоки»)

В Lua до v3.0.0 существовало понятие «потоков» (threads), которые выполнялись X раз в секунду. Это название немного вводило в заблуждение, так как они были синхронными.

Вместо этого в Lua версии v3.0.0 есть «таймеры событий» (Event Timers). Это таймеры, которые работают внутри сервера и по истечении времени запускают событие (глобально). Они тоже синхронные. Учтите, что второй аргумент — это интервал в миллисекундах.

Пример:
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
В этом примере «CountSeconds» будет вызываться каждую секунду. Таймеры событий также можно отменять с помощью `MP.CancelEventTimer` (см. справочник по API).

В консоли сервера можно выполнить `status`, чтобы увидеть, сколько таймеров событий сейчас работает, а также информацию об обработчиках событий, которые находятся в ожидании. В будущем эта команда будет показывать больше информации.

## Отладка

Lua сложно отлаживать. Отладчика промышленного уровня вроде `gdb`, к сожалению, для встраиваемого Lua не существует.

Как правило, вы, конечно, можете в любой момент просто вывести значения, которые хотите проверить, с помощью `print()`. 

В v3.0.0 сервер позволяет внедрить интерпретатор в плагин и затем выполнять внутри него Lua в реальном времени. Это самое близкое к отладчику, что у нас есть.

Предположим, у вас есть плагин с описанного выше примера, который мы назвали `MyPlugin`. Войти в его состояние Lua можно так:
```
> lua MyPlugin
```
Здесь важен регистр, поэтому будьте внимательны и вводите всё правильно. 
Вывод будет примерно таким
```
lua @MyPlugin> 
```
Как видите, мы переключились в состояние Lua плагина `MyPlugin`. Отныне и до тех пор, пока мы не введём `exit()` (начиная с v3.1.0 — `:exit`), мы находимся в `MyPlugin` и можем выполнять там Lua. 

Например, если у нас есть глобальная переменная `MyValue`, мы можем вывести её значение так:
```
lua @MyPlugin> print(MyValue)
```
Здесь можно вызывать функции и делать всё, что вы ожидаете.

Начиная с v3.1.0: можно нажать TAB для автодополнения функций и переменных.

ПРЕДУПРЕЖДЕНИЕ: к сожалению, если состояние Lua в данный момент занято выполнением другого кода (например, циклом `while`), консоль может полностью зависнуть, пока он не закончит эту работу. Поэтому будьте очень осторожны при переключении на состояния, которые могут чего-то ожидать.

Кроме того, в обычной консоли (`> `) можно выполнить `status`, которая среди прочего покажет статистику по Lua.

## Пользовательские команды

Чтобы реализовать пользовательские команды для консоли сервера, можно использовать событие `onConsoleInput`. 
Это полезно, когда нужно дать владельцу сервера способ что-то сообщить вашему плагину или показать внутреннее состояние особым образом.

Вот пример:
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
Это позволит выполнить в консоли сервера следующее:
```
> print hello, world
hello, world
```
Мы реализовали собственный `print`. В качестве упражнения попробуйте создать функцию вроде `say`, которая отправляет сообщение в чат всем игрокам или даже конкретному игроку (с помощью `MP.SendChatMessage`).

**Внимание:** для собственных плагинов, как правило, рекомендуется использовать «пространства имён». Наш пример с `print` в плагине `mystuff` можно было бы назвать `mystuff.print`, `ms.print` или как-то похоже.

## Справочник по API

Формат документации: `function_name(arg_name: arg_type, arg_name: arg_type) -> return_types`

## Встроенные функции

### `print(...)`, `printRaw(...)`

Выводит сообщение в консоль сервера с префиксом `[DATE TIME] [LUA]`. Если префикс не нужен, используйте `printRaw(...)`.

Пример:
```lua
local name = "John Doe"
print("Hello, I'm", name, "and I'm", 32)
```
Функция принимает любое количество аргументов произвольных типов. Она также без проблем выводит таблицы!

Она ведёт себя как `print` интерпретатора lua, поэтому между аргументами ставятся табуляции.

### `exit()`

Корректно останавливает сервер. Вызывает событие `onShutdown`.

## Функции MP

### `MP.CreateTimer() -> Timer`

Создаёт объект таймера, который можно использовать, чтобы отслеживать, сколько времени заняло что-то или сколько времени прошло. Он запускается сразу после создания, и его можно сбросить или перезапустить с помощью `mytimer:Start()`.

Текущее прошедшее время в секундах можно получить с помощью `mytimer:GetCurrent()`.

Пример:
```lua
local mytimer = MP.CreateTimer()
-- do stuff here that needs to be timed
print(mytimer:GetCurrent()) -- print how much time elapsed
```
Таймеры не нужно останавливать (и остановить их нельзя), накладных расходов у них нет.

### `MP.GetOSName() -> string`

Возвращает название текущей ОС: `Windows`, `Linux` или `Other`.

### `MP.GetServerVersion() -> number,number,number`

Возвращает текущую версию сервера в формате «основная, дополнительная, патч». Например, для версии v3.0.0 вернётся `3, 0, 0`.

Пример:
```lua
local major, minor, patch = MP.GetServerVersion()
print(major, minor, patch)
```
Вывод:
```
2	4	0
```
### `MP.RegisterEvent(event_name: string, function_name: string)`

Запоминает функцию с именем `Function Name` как обработчик события с именем `Event Name`.

На одно событие можно зарегистрировать сколько угодно обработчиков.

Список событий, которые предоставляет сервер, см. [здесь](#events-1).

Если события с таким именем не существует, оно создаётся, поэтому RegisterEvent не может завершиться ошибкой. Это можно использовать для создания пользовательских событий. Подробнее см. [Пользовательские события](#custom-events) и [События](#events).

Пример:
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

Запускает внутри сервера таймер, который вызывает событие `event_name` каждые `interval_ms` миллисекунд.

Таймеры событий можно отменить с помощью `MP.CancelEventTimer`.

Интервалы меньше 25 мс использовать не рекомендуется, так как несколько таких интервалов, скорее всего, не будут надёжно обслуживаться вовремя. Хотя на одно и то же событие можно запустить несколько таймеров, рекомендуется создавать как можно меньше таймеров событий. Например, если вам нужно одно событие каждые полсекунды и ещё одно каждую секунду, подумайте о том, чтобы создать только полусекундное и запускать функции, рассчитанные на каждую секунду, при каждом втором срабатывании.

Вы также можете использовать `MP.CreateTimer`, чтобы создать таймер и измерять время, прошедшее с последнего вызова события, чтобы уменьшить число таймеров событий. Однако это не обязательно рекомендуется, так как значительно усложняет код.

**Начиная с 3.0.2:**

Третьим аргументом можно передать необязательный параметр `CallStrategy`. Это может быть:

- `MP.CallStrategy.BestEffort` (по умолчанию): будет пытаться вызывать ваше событие с указанным интервалом, но откажется ставить обработчики в очередь, если обработчик выполняется слишком долго.
- `MP.CallStrategy.Precise`: будет ставить обработчики событий в очередь точно с указанным интервалом. Если обработчик выполняется дольше интервала, очередь может переполниться. Используйте, только если вам НУЖЕН точный интервал.

### `MP.CancelEventTimer(event_name: string)`

Отменяет все таймеры события с именем `event_name`. В некоторых случаях таймер может сработать ещё один раз до отмены из-за особенностей асинхронного программирования.

### `MP.TriggerLocalEvent(event_name: string, ...) -> table`

Локальный для плагина синхронный запуск события.

Запускает событие локально, из-за чего вызываются все обработчики этого события *в текущем состоянии lua* (обычно это текущий плагин, если только состояние не было общим через PluginConfig.toml).

Этой функции можно передать аргументы (`...`): они копируются и передаются всем обработчикам в качестве аргументов функции.

Этот вызов синхронный и вернёт управление, когда все обработчики событий завершатся.

Возвращаемое значение — таблица всех результатов. Если обработчик вернул значение, оно будет в этой таблице без пометок и имён. Это можно использовать, чтобы «собирать» данные или регистрировать подобработчики для событий, которые можно отменить. По сути это массив.

Пример:
```lua
local Results = MP.TriggerLocalEvent("MyEvent")
print(Results)
```
### `MP.TriggerGlobalEvent(event_name: string, ...) -> table`

Глобальный асинхронный запуск события.

Запускает событие глобально, из-за чего вызываются все обработчики этого события *во всех плагинах* (включая *этот* плагин).

Этой функции можно передать аргументы (`...`): они копируются и передаются всем обработчикам в качестве аргументов функции.

Этот вызов асинхронный и возвращает объект, похожий на future. Локальные обработчики (обработчики в том же плагине, что и вызывающий) выполняются синхронно и сразу. 

У возвращаемой таблицы есть две функции:

- `IsDone() -> boolean` сообщает, завершили ли работу все обработчики. Можно дождаться значения true, проверяя его в цикле и немного ожидая с помощью `MP.Sleep`.
- `GetResults() -> table` возвращает таблицу без пометок и имён со всеми возвращёнными значениями всех обработчиков. По сути это массив.

Обязательно вызывайте их с синтаксисом `Obj:Function()` (через `:`, а НЕ через `.`).

Пример:
```lua
local Future = MP.TriggerGlobalEvent("MyEvent")
-- wait until handlers finished
while not Future:IsDone() do
	MP.Sleep(100) -- sleep 100 ms
end
local Results = Future:GetResults()
print(Results)
```
Учтите, что обработчик, зарегистрированный здесь на «MyEvent» и никогда не возвращающий управление, может заблокировать ваш плагин. Скорее всего, стоит отслеживать, как долго вы ждёте, и прекращать ожидание через несколько секунд.

### `MP.Sleep(time_ms: number)`

Ждёт указанное время в миллисекундах.

Это не передаёт управление состоянию lua, и пока оно «спит», в нём ничего не выполняется. 

ПРЕДУПРЕЖДЕНИЕ: НЕ используйте ожидание дольше 500 мс, если у вас зарегистрированы обработчики событий, пока вы не знаете *точно*, что делаете. Функция предназначена для ожидания в 1–100 мс, чтобы дождаться результатов и тому подобного. Заблокированное («спящее») состояние lua при неосторожном использовании может сильно замедлить весь сервер.

### `MP.SendChatMessage(player_id: number, message: string)`

Отправляет сообщение в чат, которое видит только указанный игрок (или все, если ID равен `-1`).
В игре оно не будет отображаться как адресное сообщение.

Это можно использовать, например, чтобы сообщить игроку, *почему* вы отменили создание его транспорта, его сообщение в чате и тому подобное, или чтобы показать какую-то информацию о вашем сервере.

Пример:
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
Пример 2:
```lua
function ChatHandler(player_id, player_name, msg)
    if msg == "hello" then
        MP.SendChatMessage(-1, "Hello World!") -- If the player sends the exact message "hello", announce to the entire server "Hello World!"
        return 0
    end
end
```
### `MP.TriggerClientEvent(player_id: number, event_name: string, data: string) -> boolean`
*до v3.1.0*

### `MP.TriggerClientEvent(player_id: number, event_name: string, data: string) -> boolean,string`
*начиная с v3.1.0*

### `MP.TriggerClientEventJson(player_id: number, event_name: string, data: table) -> boolean,string`
*начиная с v3.1.0*

Вызывает указанное событие с указанными данными у заданного клиента (-1 для рассылки всем). Затем это событие можно обработать в клиентском lua-моде, см. документацию «Client Scripting».

Вернёт `true`, если сообщение удалось отправить (для `id = -1`, то есть для рассылки, всегда `true`), и `false`, если игрока с таким ID не существует или он отключён, но всё ещё имеет ID (это известная проблема).

Если возвращено `false`, повторять это событие бессмысленно, и ответа (если он ожидался) ждать не следует.

Начиная с v3.1.0, второе возвращаемое значение содержит сообщение об ошибке, если функция не сработала. Также начиная с этой версии версия функции `*Json` принимает таблицу в качестве аргумента data и преобразует её в json. Это просто сокращение для `MP.TriggerClientEvent(..., Util.JsonEncode(mytable))`.

### `MP.GetPlayerCount() -> number`

Возвращает количество игроков, которые сейчас находятся на сервере.

### `MP.GetPositionRaw(pid: number, vid: number) -> table,string`

Возвращает текущую позицию транспорта `vid` (ID транспорта) игрока `pid` (ID игрока), а также строку с ошибкой, если она произошла.

Таблица декодируется из пакета позиции, поэтому содержит разнообразные данные, включая позицию и поворот (поэтому у функции постфикс «Raw»).

Пример:
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
Вывод:
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
Пример 2:
```lua
local player_id = 4
local vehicle_id = 0

local raw_pos, error = MP.GetPositionRaw(player_id, vehicle_id)
if error = "" then
    local x, y, z = table.unpack(raw_pos["pos"])

    print("X:", x)
    print("Y:", y)
    print("Z:", z)
else
    print(error)
end
```
Вывод:
```
X: -603.459
Y: -175.078
Z: 26.9505
```
### `MP.IsPlayerConnected(player_id: number) -> boolean`

Показывает, подключён ли игрок и получил ли сервер от него UDP-пакет.

Пример:
```lua
local player_id = 8
print(MP.IsPlayerConnected(player_id)) -- Check if player with ID 8 is properly connected.
```
Вывод:
```lua
true
```
### `MP.GetPlayerName(player_id: number) -> string`

Возвращает отображаемое имя игрока.

Пример:
```lua
local player_id = 4
print(MP.GetPlayerName(player_id)) -- Get the name of the player with ID 4
```
Вывод:
```
ilovebeammp2004
```
### `MP.RemoveVehicle(player_id: number, vehicle_id: number)`

Удаляет указанный транспорт указанного игрока.

Пример:
```lua
local player_id = 3
local player_vehicles = MP.GetPlayerVehicles(player_id)

-- Loop over all of player 3's vehicles and delete them
for vehicle_id, vehicle_data in pairs(player_vehicles) do
      MP.RemoveVehicle(player_id, vehicle_id)
end
```
### `MP.GetPlayerVehicles(player_id: number) -> table`

Возвращает таблицу всего транспорта, который сейчас есть у игрока. Каждая запись в таблице сопоставляет ID транспорта с данными транспорта (сейчас это необработанная строка json).

Пример:
```lua
local player_id = 3
local player_vehicles = MP.GetPlayerVehicles(player_id)

for vehicle_id, vehicle_data in pairs(player_vehicles) do
    local start = string.find(vehicle_data, "{")
    local formattedVehicleData = string.sub(vehicle_data, start, -1)
    print(Util.JsonDecode(formattedVehicleData))
end
```
Вывод:
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

Возвращает таблицу всех подключённых игроков. Эта таблица сопоставляет ID с именами, например так:  
```json
{
	0: "LionKor",
	1: "JohnDoe"
}
```
### `MP.IsPlayerGuest(player_id: number) -> boolean`

Показывает, является ли игрок гостем. Гость — это тот, кто не вошёл в аккаунт, а выбрал игру в качестве гостя. Его имя обычно состоит из `guest` и длинного числа.

Поскольку гости анонимны, вы можете захотеть запретить им подключаться. В таком случае рекомендуется использовать аргумент `is_guest` события [`onPlayerAuth`](#onplayerauth).

### `MP.DropPlayer(player_id: number, [reason: string])`

Отключает игрока с указанным ID. Параметр reason необязателен.
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

Возвращает использование памяти текущим состоянием Lua в байтах.

### `MP.GetLuaMemoryUsage() -> number` 

Возвращает суммарное использование памяти всеми состояниями lua в байтах.

### `MP.GetPlayerIdentifiers(player_id: number) -> table`

Возвращает таблицу с информацией об игроке, такой как ID на форуме BeamMP, IP-адрес и ID аккаунта Discord. ID Discord вернётся, только если пользователь привязал его к своему аккаунту на форуме.

ID пользователя на форуме можно найти, перейдя на `https://forum.beammp.com/u/USERNAME.json` и найдя `"user": {"id": 123456}`. ID BeamMP уникален для игрока и, в отличие от имени пользователя, не может быть изменён.

Пример:
```lua
local player_id = 5
print(MP.GetPlayerIdentifiers(player_id))
```
Вывод:
```json
{
    ip: "127.0.0.1",
    discord: "12345678987654321",
    beammp: "1234567",
}
```
*До v3.1.0 поле `ip` некорректно и работает не так, как задумано. Исправлено в v3.1.0.*

### `MP.Set(setting: number, ...)`

Временно изменяет параметр ServerConfig. Для этого удобна таблица `MP.Settings`.

Пример:
```lua
MP.Set(MP.Settings.Debug, true) -- Turns on debug mode
```
### `MP.Settings -> table`

Таблица соответствия ID параметров их именам. Используется вместе с `MP.Set` для изменения параметров ServerConfig. 

Пример:
```lua
print(MP.Settings)
```
Вывод:
```json
{
    MaxPlayers: 3,
    Debug: 0,
    Name: 5,
    Description: 6,
    MaxCars: 2,
    Private: 1,
    Map: 4,
}
```
## Функции Util

### `Util.Json*`

Начиная с BeamMP-Server `v3.1.0`.

Это встроенная библиотека JSON, которая обычно намного быстрее любой библиотеки JSON для Lua. Под капотом используется библиотека C++ `nlohmann::json`, которая соответствует стандарту JSON, полностью покрыта модульными тестами и постоянно проверяется фаззингом.

### `Util.JsonEncode(table: table) -> string`

Рекурсивно кодирует таблицу Lua в строку JSON (таблицы внутри таблиц внутри таблиц ... работают как ожидается). Все примитивные типы учитываются, функции, userdata и подобное игнорируются.

Получившийся JSON минифицирован. Чтобы сделать его читаемым, используйте `Util.JsonPrettify`.

Пример: 
```lua
local player = {
	name = "Lion",
	age = 69,
	skills = { "skill A", "skill B" }
}
local json = Util.JsonEncode(player)
```
Результат: 
```json
{"name":"Lion","age":69,"skills":["skill A","skill B"]}
```
### `Util.JsonDecode(json: string) -> table`

Декодирует JSON в таблицу Lua. Если это не удалось, вернёт `nil` и выведет ошибку.

Пример:
```lua
local json = "{\"message\":\"OK\",\"code\":200}"
local tbl = Util.JsonDecode(json)
```
Результат:
```lua
{
	message = "OK",
	code = 200,
}
```
### `Util.JsonPrettify(json: string) -> string`

Добавляет в json отступы и переносы строк, чтобы его было удобнее читать человеку.

Пример:
```
local myjson = Util.JsonEncode({ name="Lion", age = 69, skills = { "skill A", "skill B" } })

print(Util.JsonPrettify(myjson))
```
Результат:
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

Убирает отступы, переносы строк и любые другие пробельные символы. Нужна, только если вы вызывали `Util.JsonPrettify`, так как весь вывод `Util.Json*` уже минифицирован.

Пример:
```lua
local pretty = Util.JsonPrettify(Util.JsonEncode({ name="Lion", age = 69, skills = { "skill A", "skill B" } }))

print(Util.JsonMinify(pretty))
```
Результат:
```json
{"age":69.0,"name":"Lion","skills":["skill A","skill B"]}
```
### `Util.JsonFlatten(json: string) -> string`

Создаёт объект JSON, ключи которого «разворачиваются» в указатели JSON согласно RFC 6901. Исходный вид можно восстановить с помощью `Util.JsonUnflatten()`. Чтобы это работало, все значения должны быть примитивами.

Пример:
```lua
local json = Util.JsonEncode({ name="Lion", age = 69, skills = { "skill A", "skill B" } })
print("normal: " ..json)
print("flattened: " .. Util.JsonFlatten(json))
print("flattened pretty: " .. Util.JsonPrettify(Util.JsonFlatten(json)))

```
Результат: 
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

Восстанавливает произвольную вложенность значения JSON, которое ранее было «развёрнуто» с помощью функции `Util.JsonFlatten()`. 

### `Util.JsonDiff(a: string, b: string) -> string`

Создаёт разницу (diff) JSON согласно RFC 6902 (http://jsonpatch.com/). Затем этот diff можно применить как патч с помощью `Util.JsonDiffApply()`. Возвращает diff.

### `Util.JsonDiffApply(base: string, diff: string) -> string`

Применяет JSON `diff` к `base` как патч JSON (RFC 6902, http://jsonpatch.com/). Возвращает результат.

## `Util.Random*`

Начиная с BeamMP-Server `v3.1.0`.

### `Util.Random() -> float`

Возвращает число с плавающей запятой от 0 до 1.

Пример:
```lua
local rand = Util.Random()
print("rand: " .. rand)
```
Результат: 
```lua
rand: 0.135477
```
### `Util.RandomIntRange(min: int, max: int) -> int`

Возвращает целое число от min до max.

Пример:
```lua
local randInt = Util.RandomIntRange(1, 100)
print("randInt: " .. randInt)
```
Результат: 
```lua
randInt:  69
```
### `Util.RandomRange(min: number, max: number) -> float`

Возвращает число с плавающей запятой от min до max.

Пример:
```lua
local randFloat = Util.RandomRange(1, 1000)
print("randFloat: " .. randFloat)
```
Результат: 
```lua
randFloat: 420.6969
```
### `Util.LogInfo(params: ...)` и другие (начиная с v3.3.0)
```lua
Util.LogInfo("Hello, World!")
Util.LogWarn("Cool warning")
Util.LogError("Oh no!")
Util.LogDebug("hi")
```
выведет
```
[19/04/24 11:06:50.142] [Test] [INFO] Hello, World!    
[19/04/24 11:06:50.142] [Test] [WARN] Cool warning    
[19/04/24 11:06:50.142] [Test] [ERROR] Oh no!
[19/04/24 11:06:50.142] [Test] [DEBUG] hi
```
Поддерживает точно такой же вывод данных, как и `print()`.

### `Util.DebugExecutionTime() -> table`

Когда код Lua выполняется на сервере, время выполнения каждого обработчика событий замеряется. Минимум, максимум, среднее (арифметическое) и стандартное отклонение этих времён вычисляются, и функция возвращает их в таблице. Вычисление происходит постепенно: при каждом запуске обработчика событий минимум, максимум, среднее и стандартное отклонение обновляются. Поэтому `Util.DebugExecutionTime()` обычно не занимает сколько-нибудь заметного времени (менее 0,25 мс).

Она возвращает таблицу такого вида:
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
Для каждого *обработчика* возвращаются следующие данные:

- `n`: сколько раз событие запускалось и вызывался обработчик
- `mean`: среднее время всех выполнений, в мс
- `max`: самое долгое время выполнения, в мс
- `min`: самое короткое время выполнения, в мс
- `stdev`: стандартное отклонение всех средних времён выполнения, в мс

Вот функция, с помощью которой можно красиво вывести эти данные:
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
Если ваш код работает медленно, вы можете вызвать её так для отладки:
```lua
-- event to print the debug times
MP.RegisterEvent("printStuff", "printDebugExecutionTime")
-- run every 5000 ms = 5 seconds (or 10, or 60, whatever makes sense for you
MP.CreateEventTimer("printStuff", 5000)
```
## Функции FS

Функции `FS` — это функции **ф**айловой **с**истемы (**f**ile**s**ystem), которые призваны превосходить стандартные возможности Lua.

Всегда используйте `/` в качестве разделителя при указании путей, так как он работает на всех платформах (Windows, Linux, macOS и других).

### `FS.CreateDirectory(path: string) -> bool,string`


Создаёт указанную папку, а также все родительские папки, если их не существует. Поведение примерно соответствует распространённой команде Linux `mkdir -p`.

В случае успеха возвращает `true` и `""`. Если создать папку не удалось, возвращается `false` и сообщение об ошибке (`string`).

Пример:
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

Удаляет указанный файл или папку.

Возвращает `true`, если произошла ошибка, а сообщение об ошибке — во втором возвращаемом значении.

Пример:
```lua
local error, error_message = FS.Remove("myfile.txt")

if error then
	print("failed to delete myfile: " .. error_message)
end
```
### `FS.Rename(pathA: string, pathB: string) -> bool,string`

Переименовывает (или перемещает) `pathA` в `pathB`.

Возвращает `true`, если произошла ошибка, а сообщение об ошибке — во втором возвращаемом значении.

### `FS.Copy(pathA: string, pathB: string) -> bool,string`

Копирует `pathA` в `pathB`.

Возвращает `true`, если произошла ошибка, а сообщение об ошибке — во втором возвращаемом значении.

### `FS.GetFilename(path: string) -> string`

Возвращает последнюю часть пути, которая обычно является именем файла.
Вот несколько примеров входных и выходных данных:
```lua
input -> output

"my/path/a.txt" 	-> "a.txt"
"somefile.txt" 		-> "somefile.txt"
"/awesome/path" 	-> "path"
```
### `FS.GetExtension(path: string) -> string`


Возвращает расширение файла или пустую строку, если расширения нет.
Вот несколько примеров входных и выходных данных
```lua
input -> output

"myfile.txt" 					-> ".txt"
"somefile." 					-> "."
"/awesome/path" 				-> ""
"/awesome/path/file.zip.txt"	-> ".txt"
"myexe.exe" 					-> ".exe"
```
### `FS.GetParentFolder(path: string) -> string`

Возвращает путь к родительской папке, то есть к папке, в которой находится файл или папка.
Вот несколько примеров входных и выходных данных:
```lua
input -> output

"/var/tmp/example.txt" 		-> "/var/tmp"
"/"							-> "/"
"mydir/a/b/c.txt"			-> "mydir/a/b"
```
### `FS.Exists(path: string) -> bool`

Возвращает `true`, если путь существует, и `false`, если нет.

### `FS.IsDirectory(path: string) -> bool`

Возвращает `true`, если указанный путь — папка, и `false`, если нет. Обратите внимание: `false` НЕ означает, что путь — это файл (см. `FS.IsFile()`).

### `FS.IsFile(path: string) -> bool`

Возвращает `true`, если указанный путь — обычный файл (не символическая ссылка, жёсткая ссылка, блочное устройство и т. д.), и `false`, если нет. Обратите внимание: `false` НЕ означает, что путь — это папка (см. `FS.IsDirectory()`).

### `FS.ListDirectories(path: string) -> table`

Возвращает таблицу всех папок по указанному пути.

Пример:
```lua
print(FS.ListDirectories("Resources"))
```
Результат: 
```lua
{
    1: "Client",
    2: "Server"
}
```
### `FS.ListFiles(path: string) -> table`

Возвращает таблицу всех файлов по указанному пути.

Пример:
```lua
print(FS.ListFiles("Resources/Server/examplePlugin"))
```
Результат: 
```lua
{
    1: "example.json",
    2: "example.lua"
}
```
### `FS.ConcatPaths(...) -> string`

Объединяет (конкатенирует) все аргументы с использованием предпочтительного для системы разделителя пути.

Пример:
```lua  
FS.ConcatPaths("a", "b", "/c/d/e/", "/f/", "g", "h.txt")
```
результат
```
a/b/c/d/e/f/g/h.txt
```
Также разрешает `..`, если он встречается в пути в любом месте. Эта функция безопаснее конкатенации строк в lua и учитывает разделители платформы.

Всегда используйте `/` в качестве разделителя при указании путей, так как он работает на всех платформах (Windows, Linux, macOS и других).

## События {#events-1}

### Пояснение

- Аргументы: список аргументов, передаваемых обработчикам этого события
- Можно отменить: можно ли отменить событие. Если его можно отменить, обработчик может сделать это, вернув `1`, например `return 1`.

### Краткий список событий

Подключение игрока вызывает следующие события в указанном порядке:

1. `onPlayerAuth`
2. `onPlayerConnecting`
3. `onPlayerJoining`
4. `onPlayerJoin`

### Системные события

#### `onInit`

Аргументы: НЕТ
Можно отменить: НЕТ

Вызывается сразу после инициализации всех файлов плагина.

#### `onConsoleInput`

Аргументы: `input: string`
Можно отменить: НЕТ

Вызывается, когда консоль BeamMP получает ввод.

#### `onShutdown`

Аргументы: НЕТ
Можно отменить: НЕТ

Вызывается при остановке сервера. Сейчас это происходит после того, как все игроки были отключены.

### События, связанные с игрой

#### `onPlayerAuth`

Аргументы: `player_name: string`, `player_role: string`, `is_guest: bool`, `identifiers: table -> beammp, ip`
Можно отменить: ДА

Первое событие, которое вызывается, когда игрок хочет подключиться. Игроку можно отказать в подключении, вернув из функции-обработчика `1` или причину (`string`).
```lua
function myPlayerAuthorizer(name, role, is_guest, identifiers)
	return "Sorry, you cannot join at this time."
end
MP.RegisterEvent("onPlayerAuth", "myPlayerAuthorizer")
```
#### `onPlayerConnecting`

Аргументы: `player_id: number`
Можно отменить: НЕТ

Вызывается, когда игрок только начинает подключаться, после `onPlayerAuth`.

#### `onPlayerJoining`

Аргументы: `player_id: number`
Можно отменить: НЕТ

Вызывается, когда игрок завершил загрузку всех модов, после `onPlayerConnecting`.

#### `onPlayerDisconnect`

Аргументы: `player_id: number`
Можно отменить: НЕТ

Вызывается, когда игрок отключается.

#### `onChatMessage`

Аргументы: `player_id: number`, `player_name: string`, `message: string`
Можно отменить: ДА

Вызывается, когда игрок отправляет сообщение в чат. Если событие отменено, сообщение не будет показано никому, даже отправившему его игроку.

#### `onVehicleSpawn`

Аргументы: `player_id: number`, `vehicle_id: number`, `data: string`
Можно отменить: ДА

Вызывается, когда игрок создаёт новый транспорт. Обратите внимание: замена транспорта вместо этого вызывает [`onVehicleEdited`](#onvehicleedited). Аргумент `data` содержит конфигурацию автомобиля и данные о его положении и повороте в виде строки json.

<details>

<summary>Пример значения <code>data</code></summary>

Строка data начинается с уникального идентификатора транспорта: это ID игрока, дефис и затем ID транспорта. Далее следует объект JSON с информацией о конфигурации и положении транспорта.
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

Аргументы: `player_id: number`, `vehicle_id: number`, `data: string`
Можно отменить: ДА

Вызывается, когда игрок изменяет или заменяет свой транспорт. Аргумент `data` содержит обновлённую конфигурацию автомобиля в виде строки json, но **не** содержит данных о положении и повороте. Чтобы получить положение и поворот, можно использовать [MP.GetPositionRaw](#mp-getpositionraw-pid-number-vid-number-table-string).

<details>

<summary>Пример значения <code>data</code></summary>

Строка data начинается с уникального идентификатора транспорта: это ID игрока, дефис и затем ID транспорта. Далее следует объект JSON с информацией о конфигурации транспорта.
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

#### `onVehicleDeleted`

Аргументы: `player_id: number`, `vehicle_id: number`
Можно отменить: НЕТ

Вызывается, когда игрок удаляет свой транспорт.

#### `onVehicleReset`

Аргументы: `player_id: number`, `vehicle_id: number`, `data: string`
Можно отменить: НЕТ

Вызывается, когда игрок сбрасывает свой транспорт. `data` содержит обновлённые положение и поворот автомобиля, но **не** содержит конфигурации транспорта. Чтобы получить конфигурацию транспорта, можно использовать [MP.GetPlayerVehicles](#mp-getplayervehicles-player-id-number-table).

#### `onFileChanged`

*начиная с v3.1.0*

Аргументы: `path: string`
Можно отменить: НЕТ

Вызывается, если файл изменяется в каталоге `Resources/Server` *или в любом его подкаталоге*. 

Любое изменение файла в каталоге `Resources/Server/<plugin>` (не в его подпапке) вызывает перезагрузку состояния Lua и событие `onFileChanged`.

Любой файл в подпапках `Resources/Server/<plugin>`, например `Resources/Server/<plugin>/lua/stuff.lua`, не вызывает перезагрузку состояния, а только событие `onFileChanged`. Так вы можете перезагрузить его самостоятельно правильным способом (или не перезагружать).

Это относится ко всем файлам, а не только к файлам `.lua`.

`path` задаётся относительно корня сервера, например `Resources/Server/myplugin/myfile.txt`. Эту строку можно дополнительно обработать с помощью семейства функций `FS.*`, например извлечь имя или расширение (`FS.GetExtension(...)`, `FS.GetFilename(...)`, ...).

Примечание: файлы, добавленные после запуска сервера, начиная с v3.1.0 *не* отслеживаются.

## Миграция со старого Lua {#migrating-from-old-lua}

Это краткий обзор основных шагов для перехода со старого lua на новый.

### Разберитесь, как работает новый lua

Для этого внимательно прочитайте раздел [«Введение»](#introduction) и все его подразделы.
Это необходимо, чтобы правильно выполнить следующие шаги.

### Поиск и замена

Сначала нужно найти и заменить все функции MP. При замене нужно добавить `MP.` перед всеми функциями MP, кроме `print()`.

Пример:
```lua
local players = GetPlayers()
print(#players)
```
превращается в
```lua
local players = MP.GetPlayers()
print(#players) -- note how print() doesn't change
```
### Прощай, потоки, здравствуй, таймеры событий!

Как сказано во введении, потоки — это таймеры событий. Все вызовы `CreateThread` замените вызовом `CreateEventTimer`. Внимательно проверьте, какую периодичность имел ваш старый CreateThread (число означало X раз в секунду), и подумайте, какое значение таймаута таймера событий ей соответствует (оно задаётся в миллисекундах). Также помните, что вместо имени функции он принимает имя события, поэтому событие тоже придётся зарегистрировать.

Пример:
```lua
CreateThread("myFunction", 2) -- calls "myFunction" twice per second
```
превращается в
```lua
MP.RegisterEvent("myEvent", "myFunction") -- registering our event for the timer
MP.CreateEventTimer("myEvent", 500) -- 500 milliseconds = 2 times per second
```
Если у вас много таймеров событий, имеет смысл проверить, нельзя ли их объединить, например создав событие «каждую минуту» и зарегистрировав на него несколько функций, которые нужно вызывать каждую минуту, вместо нескольких таймеров событий. Каждый таймер событий немного нагружает сервер при срабатывании.

### Больше никаких неявных вызовов событий

Вам нужно зарегистрировать все свои события. Полагаться на имена функций нельзя. В старом lua это было неясно, но в новом lua это, как правило, обязательно. Хороший шаблон:
```lua
MP.RegisterEvent("onChatMessage", "chatMessageHandler")
-- or 
MP.RegisterEvent("onChatMessage", "handleChatMessage")
```
