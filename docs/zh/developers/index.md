---
description: "开始为 BeamMP 开发：模组、启动器和服务器如何协同工作，如何搭建开发环境，以及脚本参考在哪里。"
---
# 开发者

BeamMP 分为三个部分，每一部分你都可以为其编写代码。本部分介绍它们如何协同工作，以及从哪里开始。

## 三个部分

- **模组**与其他车辆或界面模组一样，由 BeamNG.drive 加载。它与启动器建立本地连接，并显示多人模式界面。它主要用 Lua 编写，界面部分使用了一些 JavaScript、HTML 和 CSS。它的仓库是 [BeamMP/BeamMP](https://github.com/BeamMP/BeamMP)。
- **启动器**与模组保持持续连接，连接到你所选的服务器，并负责通过 BeamMP 后端进行登录。它用 C++ 编写，由 BeamMP 预先编译，位于 [BeamMP/BeamMP-Launcher](https://github.com/BeamMP/BeamMP-Launcher)。
- **服务器**连接一个或多个启动器，并向 BeamMP 后端发送心跳，内容包括其 IP 地址、端口、版本、玩家数量等。它还会运行服务器端的 Lua 插件。它用 C++ 编写，由 BeamMP 针对多种操作系统和 CPU 架构预先编译，位于 [BeamMP/BeamMP-Server](https://github.com/BeamMP/BeamMP-Server)。

## 从哪里开始

- **参与 BeamMP 本身的开发：** [开发环境设置](/zh/developers/dev-environment-setup)。
- **编写服务器插件或模组：** [模组与资源制作](/zh/developers/mod-and-resource-creation)。
- **让用户通过 BeamMP 登录你的应用：** [使用 BeamMP 登录](/zh/developers/sign-in-with-beammp)。
- **查询函数或事件：** [脚本参考](/zh/developers/beammp-scripting/)：[游戏内模组](/zh/developers/beammp-scripting/mod-in-game)和[服务器](/zh/developers/beammp-scripting/server/latest)。
- **使用 BeamNG.drive 本身：** [游戏文档](/zh/game-documentation/)。

如果遇到困难，请到 [Discord 服务器](https://discord.gg/beammp)的 `#scripting` 频道提问。
