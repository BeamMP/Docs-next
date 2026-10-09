::: warning Ce site est en cours de construction !
Ce site est actuellement en cours de développement.

Vous pensez pouvoir contribuer ? Cliquez simplement sur l'icône en forme de crayon située à droite de la page !

Vous pouvez également contribuer à n'importe quelle autre page.
:::

# Créer une fenêtre ImGui

Cette page explique comment créer une fenêtre ImGui de base.

## Préparation

Avant d'utiliser ImGui, une petite préparation est nécessaire :

```lua
local im = ui_imgui -- shortcut to prevent lookups all the time. should help with optimization
local imguiExampleWindowOpen = im.BoolPtr(true)
```

`imguiExampleWindowOpen` servira à déterminer quand cette fenêtre d'exemple doit être affichée.

## Affichage de la fenêtre

Les fenêtres ImGui et leur contenu doivent être recréés à chaque image (frame) où elles doivent être affichées. Il faut donc une fonction de type `onUpdate` pour utiliser ImGui.

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

Cela exécute une fonction qui crée la fenêtre de cet exemple, tant que le niveau est entièrement chargé et que la fenêtre d'exemple doit être affichée.

## Contenu de la fenêtre

Si vous découvrez ImGui, considérez-le comme un lointain cousin du HTML :

* `im.SetNextWindowSize(im.ImVec2(x, y), im.Cond_FirstUseEver)` définit la taille de votre fenêtre si elle n'a pas encore été définie
* `im.Begin()` et `im.End()` correspondent à vos balises `<body>` et `</body>`
* `im.Text()` correspond à votre `<p></p>`

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

Vous pouvez ajouter la fonction suivante pour afficher ou masquer facilement la fenêtre :

```lua
local function toggleExampleImgui()
	imguiExampleWindowOpen[0] = not imguiExampleWindowOpen[0]
end
```

## Résultat

<figure class="image image_resized" style="width:100%">

  ![L'exemple de code ImGui affiché en jeu](../../../assets/content/imguiExample.png)

</figure>

Lorsque vous appuyez sur le bouton « The Hello World Button », le compteur situé en dessous se met à jour et affiche le nombre de fois où ce bouton a été pressé.

## Téléchargement

Ce tutoriel est presque entièrement basé sur le mod d'exemple ImGui de [StanleyDudek](https://github.com/StanleyDudek). Vous pouvez télécharger ce mod d'exemple [ici](/assets/content/imguiExample.zip).
