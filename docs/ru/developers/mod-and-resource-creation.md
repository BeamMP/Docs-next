---
description: "Создайте плагин BeamMP: структура папки Resources, пример серверного Lua, клиентское Lua-расширение и файл modScript.lua, который его загружает."
---
# Создание модов и ресурсов

Эта страница показывает структуру папок плагина BeamMP и небольшой рабочий пример для каждого необходимого ему файла. Полные списки функций и событий см. в [справочниках по скриптингу](/ru/developers/beammp-scripting/).

## Структура папок и основы работы с файлами

Структура папок и файлов выглядит так:

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

- Серверный Lua — это необходимый минимум. Чтобы добавлять собственные события, нужны также как минимум клиентский Lua-файл и `modScript.lua`.
- В папке `Server` находится по одной подпапке для каждого серверного плагина. Хорошая практика — иметь один главный Lua-файл, а остальные Lua-файлы класть в подпапки. Это не обязательно: если файлов несколько, сервер загружает Lua-файлы в алфавитном порядке.
- В папке `Client` лежат zip-файлы, которые отправляются клиенту, и он загружает их как мод. Любой другой файл в `Client` вызывает ошибку при запуске сервера и в остальном игнорируется.
- BeamNG читает `modScript.lua`, который сообщает игре, какой плагин загружать.

Вы можете скачать пример: [examplePlugin.zip](/assets/content/ResourcesForExamplePlugin.zip).

## Серверный Lua

В примере плагина есть и другие примеры. Вот очень простой, который выводит идентификаторы игрока:

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

`onPlayerAuth` срабатывает, как только игрок хочет подключиться. См. [onPlayerAuth в справочнике по скриптингу](/ru/developers/beammp-scripting/server/latest#onplayerauth).

Ещё один пример использует `onPlayerAuth`, чтобы не пускать гостей. Возвращённое вами сообщение показывается игроку:

```lua
function onPlayerAuth(playerName, playerRole, isGuest, identifiers)
  if isGuest then
    return "No guests allowed, please use a BeamMP account"
  end
end
```

Другие функции, доступные на сервере, описаны в [справочнике по последней версии сервера](/ru/developers/beammp-scripting/server/latest).

## Клиентский Lua

Клиентский Lua в основном следует [расширениям BeamNG](https://documentation.beamng.com/modding/programming/extensions/). Этот пример записывает строку в журнал, когда расширение загружено:

```lua
local M = {}

local function onExtensionLoaded()
  log("I", "examplePlugin", "examplePlugin loaded on client side")
end

M.onExtensionLoaded = onExtensionLoaded

return M
```

Подробнее о выводе сообщений из Lua в BeamNG см. в [документации BeamNG по отладочному выводу](https://documentation.beamng.com/modding/programming/debugging/#a-add-a-log). О функциях, которые BeamMP добавляет на клиенте, см. [справочник по внутриигровому скриптингу](/ru/developers/beammp-scripting/mod-in-game).

Когда игрок покидает сервер, приславший моды, игра перезагружает свой Lua. Ваше расширение загрузится снова при следующем подключении игрока.

## modScript.lua

В `modScript.lua` обычно всего две строки:

```lua
load('examplePlugin')
setExtensionUnloadMode('examplePlugin', 'manual')
```

Режим выгрузки `'manual'` не даёт игре выгрузить расширение самостоятельно. Не используйте `queueExtensionToLoad`: BeamMP показывает для него ошибку.

Можно добавить строку журнала, чтобы видеть в логах, когда BeamNG обрабатывает ваш `modScript.lua`:

```lua
load('examplePlugin')
setExtensionUnloadMode('examplePlugin', 'manual')
log('I', 'modScript', "examplePlugin loaded")
```
