---
description: "Crea una semplice finestra ImGui in BeamNG.drive con Lua: configura ImGui, disegna la finestra a ogni frame, aggiungi testo e un pulsante, e mostrala o nascondila."
---
# Tutorial finestra ImGui

Questa pagina mostra come creare una semplice finestra ImGui.

## Configurare ImGui

Prima di usare ImGui è necessaria una piccola configurazione:
```lua
local im = ui_imgui -- shortcut to prevent lookups all the time. should help with optimization
local imguiExampleWindowOpen = im.BoolPtr(true)
```
`imguiExampleWindowOpen` servirà a stabilire quando questa finestra di esempio deve essere disegnata.

## Disegnare la finestra

Le finestre ImGui e il loro contenuto vanno ricreati a ogni frame in cui devono essere visibili. Questo significa che per usare ImGui serve una qualche funzione onUpdate.
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
Questo eseguirà una funzione che crea la finestra dell'esempio, a patto che il livello sia completamente caricato e che la finestra di esempio debba essere visibile.

## Contenuto della finestra

Se scrivi ImGui per la prima volta, pensalo come un lontano cugino dell'HTML:

* `im.SetNextWindowSize(im.ImVec2(x, y), im.Cond_FirstUseEver)` definisce le dimensioni della finestra se non sono già state definite
* `im.Begin()` e `im.End()` corrispondono a `<body>` e `</body>`
* `im.Text()` corrisponde a `<p></p>`
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
Puoi aggiungere la seguente funzione per mostrare o nascondere facilmente la finestra:
```lua
local function toggleExampleImgui()
	imguiExampleWindowOpen[0] = not imguiExampleWindowOpen[0]
end
```
## Risultato

![BeamNG.drive con una piccola finestra in alto a sinistra intitolata "Hello World, I am a window", con il testo "Hello World, I am text.", un pulsante chiamato "The Hello World Button" e la riga "The Hello World Button has not been pressed."](../../../assets/content/imguiExample.png)

Quando premi **The Hello World Button**, il testo sotto di esso cambia e mostra quante volte è stato premuto.

## Scarica l'esempio

Questo tutorial si basa quasi interamente sulla mod di esempio ImGui di [StanleyDudek](https://github.com/StanleyDudek). Puoi scaricare questa mod di esempio [qui](/assets/content/imguiExample.zip).
