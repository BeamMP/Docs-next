---
description: "Внутриигровые (клиентские) Lua-функции BeamMP: события и обработчики, события чата, обработчики клавиш, хуки расширений, а также функции для ников, ролей и списка игроков."
---
# Справочник по скриптингу мода (в игре)

BeamMP позволяет писать и клиентские плагины. Несколько функций позволяют общаться с другими мультиплеерными модами и с другими игроками через сервер. Как настроить плагин, см. на странице [Создание модов и ресурсов](/ru/developers/mod-and-resource-creation). Страница проверена на BeamMP 4.22.5.

## Функции событий

| Функция | Что делает |
|---|---|
| `TriggerServerEvent("eventName", "data")` | Вызывает событие в Lua-окружении сервера. Оба параметра — строки. На сервере для события нужен обработчик, зарегистрированный через `MP.RegisterEvent` |
| `TriggerClientEvent("eventName", "data")` | Вызывает событие в локальном Lua-окружении. Оба параметра — строки. Подходит для связи между плагинами |
| `AddEventHandler("eventName", Function, "name")` | Добавляет `Function`, которая будет вызвана при получении `eventName`, локально или от сервера. `Function` получает один параметр: строку с данными события. Параметр `name` необязателен, см. ниже |
| `RemoveEventHandler("eventName", "name")` | Удаляет обработчик, добавленный через `AddEventHandler`. Параметр `name` необязателен, см. ниже |

- Имя события не может содержать двоеточие (`:`). В данных оно допустимо.
- Обработчик принадлежит файлу, который вызвал `AddEventHandler`. Если тот же файл добавляет обработчик для события, которое он уже обрабатывает, новый обработчик заменяет старый. Чтобы в одном файле хранить несколько обработчиков одного события, задайте каждому свой `name`. Тот же `name` используйте и в `RemoveEventHandler`.
- Если обработчик вызывает ошибку, BeamMP записывает её в журнал и продолжает работу с остальными обработчиками.
- `AddEventHandler` существует только пока загружен BeamMP. Если ваш мод работает и в одиночной игре, напишите `if AddEventHandler then ... end`.

Серверную часть этих событий см. в [справочнике по серверному скриптингу](/ru/developers/beammp-scripting/server/latest).

## События, которые вызывает BeamMP

| Событие | Когда | Данные |
|---|---|---|
| `ChatMessageReceived` | Приходит сообщение чата | `Sender: message`, строка без метки роли отправителя |
| `ChatMessageSent` | Вы отправляете сообщение в чат | `C:Sender: message`, где `Sender` — ваше имя |

## Пример: чтение сообщений чата

Чтобы читать чат, используйте встроенное событие `ChatMessageReceived`:

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

## Обработчики клавиш

| Функция | Что делает |
|---|---|
| `onKeyPressed("NUMPAD1", Function)` | Вызывает `Function`, когда клавишу нажимают |
| `onKeyReleased("NUMPAD1", Function)` | Вызывает `Function`, когда клавишу отпускают |
| `addKeyEventListener("NUMPAD1", Function, "down")` | Вызывает `Function`, когда состояние клавиши меняется. Последний параметр — `"down"`, `"up"` или `"both"`, по умолчанию `"both"` |
| `getKeyState("NUMPAD1")` | Возвращает `true`, пока клавиша удерживается, и `false` в остальное время |

`Function` получает один параметр: `true`, если клавишу нажали, и `false`, если отпустили.

## Хуки расширений

BeamMP вызывает эти хуки у каждого загруженного расширения, которое их определяет:

| Хук | Когда |
|---|---|
| `onBeamMPLauncherConnected` | Игра подключилась к лаунчеру |
| `onBeamMPPostJoin` | Карта сервера загружена в процессе подключения |
| `onBeamMPServerLeave` | Вы покидаете сервер |

## Ники, роли и список игроков

Эти функции находятся в расширении `MPVehicleGE`. Идентификаторы игроков — числа, а идентификатор транспортного средства имеет вид `playerID-vehicleID`, например `"0-1"`.

| Функция | Что делает |
|---|---|
| `MPVehicleGE.getPlayers()` | Возвращает таблицу всех известных игроков, где ключ — идентификатор игрока |
| `MPVehicleGE.getVehicles()` | Возвращает таблицу всех мультиплеерных транспортных средств, где ключ — идентификатор транспортного средства |
| `MPVehicleGE.getPlayerByName("name")` | Возвращает таблицу игрока и идентификатор игрока или `nil`, если такого игрока нет |
| `MPVehicleGE.isOwn(gameVehicleID)` | Возвращает `true`, если игровое транспортное средство с этим номером принадлежит вам |
| `MPVehicleGE.setPlayerNickPrefix("name", "source", "text")` | Добавляет `text` перед ником игрока. Для каждого префикса, который вы хотите сохранить, используйте свой `source` |
| `MPVehicleGE.setPlayerNickSuffix("name", "source", "text")` | Добавляет `text` после ника игрока. Для каждого суффикса, который вы хотите сохранить, используйте свой `source` |
| `MPVehicleGE.hideNicknames(true)` | Отключает отрисовку ников в BeamMP. `false` включает её снова |
| `MPVehicleGE.setPlayerRole(playerID, "tag", "shorttag", red, green, blue)` | Назначает игроку свою роль. Тег и короткий тег — это текст, который BeamMP показывает в квадратных скобках, а цвет фона задаётся тремя числами от 0 до 255. Если аргумент недопустим, возвращает `false` и сообщение об ошибке |
| `MPVehicleGE.clearPlayerRole(playerID)` | Снимает с игрока его собственную роль |
| `MPVehicleGE.setVehicleRole("playerID-vehicleID", "tag", "shorttag", red, green, blue)` | Назначает свою роль одному транспортному средству |
| `MPVehicleGE.clearVehicleRole("playerID-vehicleID")` | Снимает собственную роль с транспортного средства |
| `MPVehicleGE.applyQueuedEvents()` | Применяет все накопленные в очереди изменения транспортных средств |

Чтобы добавить кнопку в контекстное меню списка игроков (по правому клику), добавьте функцию в таблицу, которую возвращает `UI.getCustomPlayerlistButtons()`. Ключ — это текст кнопки. Функция получает имя и идентификатор игрока:

```lua
local buttons = UI.getCustomPlayerlistButtons()
buttons["Say hello"] = function(name, id)
  print("Hello, " .. name .. " (ID " .. tostring(id) .. ")")
end
```
