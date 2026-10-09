---
description: "用 Lua 在 BeamNG.drive 中创建一个基础的 ImGui 窗口：设置 ImGui、每帧渲染窗口、添加文本和按钮，并切换窗口的显示。"
---
# ImGui 窗口教程

本页介绍如何创建一个基础的 ImGui 窗口。

## 设置 ImGui

在使用 ImGui 之前，需要先做一些设置：
```lua
local im = ui_imgui -- shortcut to prevent lookups all the time. should help with optimization
local imguiExampleWindowOpen = im.BoolPtr(true)
```
`imguiExampleWindowOpen` 将用来决定这个示例窗口何时应该被渲染。

## 渲染窗口

ImGui 窗口及其内容必须在每一个需要显示的帧中重新创建。这意味着要使用 ImGui，就需要某种形式的 onUpdate 函数。
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
只要关卡已完全加载，并且示例窗口应当显示，这段代码就会运行一个函数来创建该示例窗口。

## 窗口内容

如果你刚接触 ImGui 的写法，可以把它看作 HTML 的远房亲戚：

* `im.SetNextWindowSize(im.ImVec2(x, y), im.Cond_FirstUseEver)` 在视口尺寸尚未定义时，定义你的视口尺寸
* `im.Begin()` 和 `im.End()` 相当于 `<body>` 和 `</body>`
* `im.Text()` 相当于 `<p></p>`
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
你可以添加下面这个函数，以便轻松切换窗口的可见性：
```lua
local function toggleExampleImgui()
	imguiExampleWindowOpen[0] = not imguiExampleWindowOpen[0]
end
```
## 结果

![BeamNG.drive 的左上角有一个标题为“Hello World, I am a window”的小窗口，窗口中有文本“Hello World, I am text.”、一个名为“The Hello World Button”的按钮，以及一行“The Hello World Button has not been pressed.”。](../../../assets/content/imguiExample.png)

当你按下 **The Hello World Button** 时，它下方的文本会更新，显示该按钮已被按下的次数。

## 下载示例

本教程几乎完全基于 [StanleyDudek](https://github.com/StanleyDudek) 的 ImGui 示例模组。你可以从[这里](/assets/content/imguiExample.zip)下载该示例模组。
