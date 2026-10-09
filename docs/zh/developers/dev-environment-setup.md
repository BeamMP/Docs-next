---
description: "为 BeamMP 模组搭建开发环境：未打包的 mods 文件夹、启动器的开发模式、克隆的仓库、本地服务器，以及如何贡献你的更改。"
---
# 开发环境设置

本页介绍如何设置你的电脑以便开发 BeamMP 模组，以及如何运行本地服务器。要了解模组、启动器和服务器如何协同工作，请参阅[开发者](/zh/developers/)。

## 你需要什么

- 安装在本地的 BeamNG.drive。
- 安装在本地的 BeamMP：至少要有启动器；如果你想用服务器进行测试，还需要服务器。
- 安装在本地的 Git，以及一个 GitHub 账号。
- 一个代码编辑器，例如 VSCode 或 Notepad++。

## 为 BeamNG 使用未打包的文件夹

为了高效地开发模组，请使用 `unpacked` 文件夹，而不是每次修改后都打包一个 zip。

1. 打开位于 `%appdata%/Local/BeamNG.drive/0.xx/mods` 的 BeamNG 用户文件夹，其中 `xx` 是最新的 BeamNG 版本。
2. 在 `mods` 中创建一个名为 `unpacked` 的文件夹。

关于用户文件夹的更多信息，请参阅 [BeamNG 文档](https://documentation.beamng.com/support/userfolder/)。

## 在启动器中开启开发模式

自动更新会删除你本地的 git 克隆，所以请用 `--no-download` 将其关闭。如果你还不希望启动器启动 BeamNG，并且想看到调试输出，请使用 `--dev`。

| 参数 | 作用 |
|---|---|
| `--help` 或 `-h` | 打印此参数列表 |
| `--port <port>` 或 `-p` | 将默认监听端口更改为 `<port>`。游戏中也必须设置相同的端口 |
| `--verbose` 或 `-v` | 详细模式：打印调试消息 |
| `--no-download` | 跳过下载和安装 BeamMP Lua 模组 |
| `--no-update` | 跳过应用启动器更新，因此你必须手动更新 |
| `--no-launch` | 跳过启动游戏，因此你必须自己启动游戏 |
| `--dev` | 开发者模式：等同于 `--verbose --no-download --no-launch --no-update` |
| `--game <args...>` 或 `-- <args...>` | 将参数传递给游戏 |

## 将 BeamMP 仓库克隆到 unpacked 文件夹中

你可以手动从我们的 GitHub 仓库复制模组文件，但使用 git 这样的源代码管理系统要好得多。

1. 创建 [BeamMP/BeamMP](https://github.com/BeamMP/BeamMP) 的 fork。
2. 直接将其克隆到 `unpacked` 文件夹中。在该文件夹中打开 PowerShell 或 CMD，然后运行：
   ```bash
   git clone https://github.com/yourName/BeamMP
   ```
3. 在用户文件夹中，确保 `mods` 里没有遗留的 `multiplayer` 文件夹，并且现在有 `unpacked/beammp`。
4. 试试开发模式。先启动启动器，然后手动启动 BeamNG。进入游戏后，确保 BeamMP 是唯一启用的模组。你可以像往常一样使用 BeamMP。

现在，你可以用代码编辑器直接在 `unpacked` 文件夹中修改代码。在游戏中按 `Ctrl` + `L` 重新加载 Lua；如果你修改了界面，还要按 `F5`。

## 设置本地服务器

本地服务器对开发 BeamMP 很有帮助。请按照[搭建服务器](/zh/server-owners/host-a-server)操作；如果你只在本地连接，可以省略前两步（端口转发和 AuthKey）。

在 `ServerConfig.toml` 中，将服务器设置为私有，并使用任意字符串作为 `AuthKey`。

## 贡献你的更改

当你对自己的更改满意时，用 git 提交它们。[Git-SCM 网站](https://git-scm.com/doc)上有教程和文档。把更改提交并推送到你的 fork 之后，你就可以发起拉取请求。

关于代码格式、提交信息格式和一般的开发实践，请参阅每个仓库中的 `CONTRIBUTING.md` 文件。每个仓库中的 `README.md` 通常包含已编译项目的构建步骤。

如果遇到问题，请到我们 [Discord 服务器](https://discord.gg/beammp)的 `#scripting` 频道提问。
