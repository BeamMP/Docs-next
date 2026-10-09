---
description: "Crea una ventana ImGui básica en BeamNG.drive con Lua: configura ImGui, dibuja la ventana en cada fotograma, añade texto y un botón, y alterna su visibilidad."
---
# Tutorial de ventana ImGui

Esta página muestra cómo crear una ventana ImGui básica.

## Configurar ImGui

Antes de usar ImGui, hace falta cierta configuración:
```lua
local im = ui_imgui -- shortcut to prevent lookups all the time. should help with optimization
local imguiExampleWindowOpen = im.BoolPtr(true)
```
`imguiExampleWindowOpen` se usará para determinar cuándo debe dibujarse esta ventana de ejemplo.

## Dibujar la ventana

Las ventanas ImGui y su contenido deben volver a crearse en cada fotograma en el que se vayan a mostrar. Esto significa que, para usar ImGui, hace falta alguna función de tipo onUpdate.
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
Esto ejecutará una función que crea la ventana de este ejemplo, siempre que el nivel esté completamente cargado y la ventana de ejemplo deba mostrarse.

## Contenido de la ventana

Si es la primera vez que escribes ImGui, piensa en él como un primo lejano de HTML:

* `im.SetNextWindowSize(im.ImVec2(x, y), im.Cond_FirstUseEver)` define el tamaño de tu ventana si aún no está definido
* `im.Begin()` e `im.End()` son tu `<body>` y `</body>`
* `im.Text()` es tu `<p></p>`
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
Puedes añadir la siguiente función para alternar fácilmente la visibilidad de la ventana:
```lua
local function toggleExampleImgui()
	imguiExampleWindowOpen[0] = not imguiExampleWindowOpen[0]
end
```
## Resultado

![BeamNG.drive con una pequeña ventana en la esquina superior izquierda titulada "Hello World, I am a window", con el texto "Hello World, I am text.", un botón llamado "The Hello World Button" y la línea "The Hello World Button has not been pressed."](../../../assets/content/imguiExample.png)

Al pulsar **The Hello World Button**, el texto de debajo cambia para mostrar cuántas veces se ha pulsado.

## Descargar el ejemplo

Este tutorial se basa casi por completo en el mod de ejemplo de ImGui de [StanleyDudek](https://github.com/StanleyDudek). Puedes descargar este mod de ejemplo [aquí](/assets/content/imguiExample.zip).
