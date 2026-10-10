---
description: "当启动器没有连接到游戏时，手动更改 BeamMP 启动器端口：在 BeamNG 的选项和 Launcher.cfg 中设置端口。"
---
# 更改启动器端口

启动器没有连接到游戏？本指南介绍如何手动更改启动器端口。游戏和启动器中的端口必须相同。

默认端口是 `4444`。启动器会在你自己的电脑上使用这个端口和下一个端口 `4445`。两者都使用 TCP，而且都必须是空闲的。如果有其他程序占用了其中一个，启动器会显示 `bind failed with error`，详见[错误代码](/zh/troubleshooting/error-codes)。

1. 启动 BeamNG.drive。
2. 在主菜单中，进入 **选项**，然后进入 **BeamMP**。
3. 打开 **高级** 分组。
4. 在 **启动器端口：** 中，把数字改成别的，例如 `4567`。游戏会在旁边提示“除非有必要，请勿修改”。
5. 关闭 BeamNG.drive。
6. 右键点击 BeamMP 启动器快捷方式，然后选择 **打开文件所在的位置**。
7. 用文本编辑器打开 `Launcher.cfg`。
8. 把 `"Port": 4444,` 中的数字改成你在游戏中设置的端口，本例中为 `4567`。
9. 保存文件并关闭编辑器。请保持文件是有效的 JSON：如果启动器无法读取它，会显示 `Config failed to parse make sure it's valid JSON!` 并关闭。
10. 启动启动器。

如果仍然无法连接，请换一个端口再试。请使用 1024 到 65534 之间的数字，因为启动器还会使用下一个数字。

::: tip
你也可以不编辑 `Launcher.cfg` 来设置端口。使用 `--port 4567` 启动启动器即可。这个命令行选项会替换 `Launcher.cfg` 中的值。其他选项请参阅[开发环境设置](/zh/developers/dev-environment-setup#turn-on-dev-mode-in-the-launcher)。
:::

## 仍然有问题？

请在我们的 [Discord 服务器](https://discord.gg/BeamMP)上创建支持工单。
