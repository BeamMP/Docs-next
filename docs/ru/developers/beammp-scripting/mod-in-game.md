---
description: "Внутриигровые (клиентские) Lua-функции BeamMP: TriggerServerEvent, TriggerClientEvent и AddEventHandler, с примером разбора сообщений чата."
---
# Справочник по скриптингу мода (в игре)

BeamMP позволяет писать и клиентские плагины. Несколько функций позволяют общаться с другими мультиплеерными модами и с другими игроками через сервер. Как настроить плагин, см. на странице [Создание модов и ресурсов](/ru/developers/mod-and-resource-creation).

## Функции

| Функция | Что делает |
|---|---|
| `TriggerServerEvent("eventName", "data")` | Вызывает событие в Lua-окружении сервера. Оба параметра — строки |
| `TriggerClientEvent("eventName", "data")` | Вызывает событие в локальном Lua-окружении. Оба параметра — строки. Подходит для связи между плагинами |
| `AddEventHandler("eventName", Function)` | Добавляет `Function`, которая будет вызвана при получении `eventName`, локально или от сервера. `Function` получает один параметр: строку с данными события |

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
    local message = string.sub(msg, i+1, -1)  -- Do whatever you want to with the message
    print("sender: " .. sender)
    print("message: ".. message)
end

AddEventHandler("ChatMessageReceived", chatReceived) -- Add our event handler to the list managed by BeamMP
```
