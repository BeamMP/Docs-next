---
description: "BeamNG.drive 的 ImGui 代码片段：设置窗口、设置文本格式并使用常见控件，可直接复制使用。"
---
# ImGui 代码片段

可供你复制并修改的 BeamNG.drive 代码片段。

## 设置

### 设置 ImGui
```lua
local im = ui_imgui
```
### 设置窗口
```lua
im.SetNextWindowSize(im.ImVec2(366, 100), im.Cond_FirstUseEver)
```
### 创建窗口
```lua
im.Begin("Window Title") -- Create window
im.End()
```
## 通用

::: tabs

== 基本格式
```lua
im.Text("")
im.TextWrapped("") -- automatic word wrap
im.TextColored(im.ImVec4(0,1,0,1), "") -- R,G,B,A
im.TextDisabled("") -- predefined style for disabled text

im.LabelText("", "")
im.BulletText("") -- Bullet point with text
im.SeparatorText("") -- Separator with centered text

im.Separator() -- might want a NewLine before these
im.SameLine() -- horizontally append the following element to the previous element
im.NewLine()

im.Spacing() -- small padding
im.Indent()
im.Unindent()
```
== 输入
```lua
im.Button("", im.ImVec2(0,0)) -- 0 = fit to content
im.SmallButton("") -- Fit to content and slightly less padding
im.ArrowButton("", 0) -- arg 1: string is not actually used? arg 2: 0 = left, 1 = right, 2 = up, 3 = down
im.InvisibleButton("", im.ImVec2(0,0), ...) -- used for imgui cursor positioning?

im.Checkbox("", im.BoolPtr(false))

im.RadioButton1("", im.BoolPtr(false))
im.RadioButton2("", im.IntPtr(), 0) -- arg. 3: 0 or 1 for disabled or enabled
```
== 其他
```lua
im.Bullet()

im.ProgressBar(0.5, im.ImVec2(0,0), "") -- arg 2: 0 for default width and/or height

im.TextUnformatted("", "") -- Second argument seems to crash the game
```
:::
