---
description: "Erstelle mit Lua ein einfaches ImGui-Fenster in BeamNG.drive: ImGui einrichten, das Fenster in jedem Frame rendern, Text und eine Schaltfläche hinzufügen und es ein- und ausblenden."
---
# ImGui-Fenster-Tutorial

Diese Seite zeigt, wie du ein einfaches ImGui-Fenster erstellst.

## ImGui einrichten

Bevor du ImGui verwendest, ist eine Einrichtung nötig:
```lua
local im = ui_imgui -- shortcut to prevent lookups all the time. should help with optimization
local imguiExampleWindowOpen = im.BoolPtr(true)
```
`imguiExampleWindowOpen` wird verwendet, um festzustellen, wann dieses Beispielfenster gerendert werden soll.

## Das Fenster rendern

ImGui-Fenster und ihre Inhalte müssen für jeden Frame, in dem sie angezeigt werden sollen, neu erstellt werden. Das bedeutet, dass du für die Verwendung von ImGui eine Art onUpdate-Funktion brauchst.
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
Das führt eine Funktion aus, die das Fenster dieses Beispiels erstellt, solange das Level vollständig geladen ist und das Beispielfenster angezeigt werden soll.

## Fensterinhalt

Wenn du neu im Schreiben von ImGui bist, stell es dir als entfernten Cousin von HTML vor:

* `im.SetNextWindowSize(im.ImVec2(x, y), im.Cond_FirstUseEver)` legt die Größe deines Viewports fest, falls sie noch nicht festgelegt wurde
* `im.Begin()` und `im.End()` entsprechen deinem `<body>` und `</body>`
* `im.Text()` entspricht deinem `<p></p>`
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
Mit der folgenden Funktion kannst du die Sichtbarkeit des Fensters bequem umschalten:
```lua
local function toggleExampleImgui()
	imguiExampleWindowOpen[0] = not imguiExampleWindowOpen[0]
end
```
## Ergebnis

![BeamNG.drive mit einem kleinen Fenster oben links mit dem Titel „Hello World, I am a window“, dem Text „Hello World, I am text.“, einer Schaltfläche namens „The Hello World Button“ und der Zeile „The Hello World Button has not been pressed.“](../../../assets/content/imguiExample.png)

Wenn du auf **The Hello World Button** drückst, ändert sich der Text darunter und zeigt an, wie oft die Schaltfläche gedrückt wurde.

## Das Beispiel herunterladen

Dieses Tutorial basiert fast vollständig auf dem ImGui-Beispiel-Mod von [StanleyDudek](https://github.com/StanleyDudek). Du kannst diesen Beispiel-Mod [hier](/assets/content/imguiExample.zip) herunterladen.
