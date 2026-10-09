---
description: "Создайте простое окно ImGui в BeamNG.drive с помощью Lua: настройте ImGui, отрисовывайте окно каждый кадр, добавьте текст и кнопку и переключайте видимость окна."
---
# Руководство по окну ImGui

На этой странице показано, как создать простое окно ImGui.

## Настройка ImGui

Перед использованием ImGui нужна небольшая настройка:
```lua
local im = ui_imgui -- shortcut to prevent lookups all the time. should help with optimization
local imguiExampleWindowOpen = im.BoolPtr(true)
```
`imguiExampleWindowOpen` будет определять, когда нужно отрисовывать это примерное окно.

## Отрисовка окна

Окна ImGui и их содержимое нужно создавать заново в каждом кадре, в котором они должны отображаться. Это значит, что для работы с ImGui необходима та или иная функция onUpdate.
```lua
local function onUpdate()
	if worldReadyState == 2 then
		if imguiExampleWindowOpen[0] == true then
			imguiExample()
		end
	end
end
M.onUpdate = onUpdate
```
Эта функция создаёт окно примера, если уровень полностью загружен и окно должно отображаться.

## Содержимое окна

Если вы только начинаете писать на ImGui, считайте его дальним родственником HTML:

* `im.SetNextWindowSize(im.ImVec2(x, y), im.Cond_FirstUseEver)` задаёт размер окна, если он ещё не был задан
* `im.Begin()` и `im.End()` — это ваши `<body>` и `</body>`
* `im.Text()` — это ваш `<p></p>`
```lua
local buttonPresses = 0

local function imguiExample()
	im.SetNextWindowSize(im.ImVec2(366, 100), im.Cond_FirstUseEver) -- prepare our window
	im.Begin("Hello World, I am a window") -- create a window with the title of "Hello World, I am a window"
		im.Indent() -- a... padding element
			im.Text("Hello World, I am text.") -- add a line of text, somewhat like a <p> element
			im.SameLine() -- Not really HTML. This appends the following element to the same line as the previous element.
			if im.Button("The Hello World Button") then -- Like <button>. This runs Lua when pressed.
				buttonPresses = buttonPresses + 1
			end
			if buttonPresses > 0 then
				im.Text("The Hello World Button has been pressed " .. buttonPresses .. " times!")
			else
				im.Text("The Hello World Button has not been pressed.")
			end
		im.Unindent() -- end the "padding element"
	im.End() -- complete our "canvas" so it can be drawn
end
```
Чтобы легко включать и выключать отображение окна, добавьте следующую функцию:
```lua
local function toggleExampleImgui()
	imguiExampleWindowOpen[0] = not imguiExampleWindowOpen[0]
end
```
## Результат

![BeamNG.drive с небольшим окном в левом верхнем углу под названием «Hello World, I am a window», с текстом «Hello World, I am text.», кнопкой «The Hello World Button» и строкой «The Hello World Button has not been pressed.»](../../../assets/content/imguiExample.png)

Когда вы нажимаете **The Hello World Button**, текст под ней меняется и показывает, сколько раз она была нажата.

## Скачать пример

Это руководство почти полностью основано на примере мода ImGui от [StanleyDudek](https://github.com/StanleyDudek). Пример мода можно скачать [здесь](/assets/content/imguiExample.zip).
