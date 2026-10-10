---
description: "为 BeamMP 模组搭建开发环境：未打包的 mods 文件夹、启动器的开发模式与设置、编译启动器、克隆的仓库、本地服务器，以及如何贡献你的更改。"
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

1. 打开 BeamNG 用户文件夹中的 `mods` 文件夹。在 Windows 上，它位于 `%LocalAppData%\BeamNG\BeamNG.drive\current\mods`。启动器在启动时会在 `Game user path:` 这一行显示它所使用的文件夹。
2. 在 `mods` 中创建一个名为 `unpacked` 的文件夹。

关于用户文件夹的更多信息，请参阅 [BeamNG 文档](https://documentation.beamng.com/support/userfolder/)。

## 在启动器中开启开发模式 {#turn-on-dev-mode-in-the-launcher}

请用 `--dev` 启动启动器。开发模式会打印调试消息，不会下载 BeamMP 模组，不会启动 BeamNG.drive，也不会更新启动器。如果你只需要其中的一部分，请使用下面的单项选项。

如果不使用 `--no-download`，启动器会把已发布的 BeamMP 模组下载到 `mods/multiplayer`。它还会删除 `mods/unpacked/beammp`，除非该文件夹中包含 `.git` 文件夹。请使用 `--no-download`，这样已发布的模组就不会与你的模组同时运行。

| 参数 | 作用 |
|---|---|
| `--help`、`-h` 或 `/?` | 打印此参数列表并关闭 |
| `--port <port>` 或 `-p <port>` | 将监听端口（默认为 `4444`）更改为 `<port>`。启动器还会使用 `<port>` + 1。游戏中也必须设置相同的端口。它会替换 `Launcher.cfg` 中的 `Port` |
| `--verbose` 或 `-v` | 详细模式：在窗口中打印调试消息。这些消息始终会写入 `Launcher.log` |
| `--no-download` | 跳过下载和安装 BeamMP 模组 |
| `--no-update` | 跳过应用启动器更新，因此你必须手动更新 |
| `--no-launch` | 跳过启动游戏，因此你必须自己启动游戏 |
| `--dev` | 开发者模式：等同于 `--verbose --no-download --no-launch --no-update` |
| `--user-path <path>` | 仅限 Windows。BeamNG.drive 用户文件夹的路径，即包含 `current` 的那个文件夹 |
| `--game <args...>` 或 `-- <args...>` | 将它后面的所有参数传递给游戏 |

### 启动器设置文件

启动器会从它运行所在的文件夹中读取 `Launcher.cfg`。如果该文件不存在，启动器会创建它，并写入前三项设置。命令行选项会替换相应的设置。

| 设置 | 默认值 | 作用 |
|---|---|---|
| `"Port"` | `4444` | 游戏连接所用的端口。请参阅[更改启动器端口](/zh/troubleshooting/launcher-port) |
| `"Build"` | `"Default"` | 启动器在检查启动器和模组更新时，向 BeamMP 后端请求的构建版本。请保持为 `Default` |
| `"CachingDirectory"` | `"./Resources"` | 启动器保存已下载的服务器模组的文件夹 |
| `"Dev"` | 未设置 | `true` 等同于 `--dev` |
| `"DeleteDuplicateMods"` | `false` | 设为 `true` 后，当服务器发送某个模组的较新版本时，启动器会删除该模组缓存的较旧版本 |

### 模组缓存

加入服务器时，启动器会把服务器列出的每个模组下载到 `CachingDirectory` 文件夹中。模组会保存为 `<name>-<其 SHA-256 哈希值的前 8 个字符>.zip`。如果哈希值匹配，启动器会重复使用缓存的文件，并把每个文件最近一次的使用记录写入同一文件夹中的 `mods.json`。然后，它会把该模组复制到游戏用户文件夹的 `mods/multiplayer` 中；在 Linux 上，文件名会转为小写。

启动器每次启动时，都会删除 `mods/multiplayer` 中除 `beammp.zip` 以外的所有内容。请不要在那里存放你自己的文件。

## 编译启动器

只有在你要开发启动器本身时，才需要编译启动器。启动器的 `README.md` 中没有编译步骤。

在 Windows 上，你需要安装带有 C++ 桌面开发工作负载（MSVC）的 Visual Studio、CMake 和 [vcpkg](https://github.com/microsoft/vcpkg)。`vcpkg.json` 中的库有 `cpp-httplib`、`nlohmann-json`、`zlib`、`openssl` 和 `curl`。启动器使用静态 C++ 运行时，因此请使用 `x64-windows-static` 三元组。在项目的根目录中运行以下命令，并把 `C:/vcpkg` 改成你安装 `vcpkg` 的位置：

```bash
cmake . -B bin -DCMAKE_BUILD_TYPE=Release -DCMAKE_TOOLCHAIN_FILE=C:/vcpkg/scripts/buildsystems/vcpkg.cmake -DVCPKG_TARGET_TRIPLET=x64-windows-static
cmake --build bin --parallel --config Release
```

生成的程序是 `bin/Release/BeamMP-Launcher.exe`。在 Windows 上，当有更新的版本时，启动器会用官方签名的发布版替换它自己，因此请用 `--no-update` 启动你自己编译的版本。

在 Linux 上，请按照[编译启动器](/zh/get-started/install-beammp#build-the-launcher)操作。启动器无法在 macOS 上编译。

## 将 BeamMP 仓库克隆到 unpacked 文件夹中

你可以手动从我们的 GitHub 仓库复制模组文件，但使用 git 这样的源代码管理系统要好得多。

1. 创建 [BeamMP/BeamMP](https://github.com/BeamMP/BeamMP) 的 fork。
2. 直接将其克隆到 `unpacked` 文件夹中。在该文件夹中打开 PowerShell 或 CMD，然后运行：

   ```bash
   git clone https://github.com/yourName/BeamMP
   ```

3. 在用户文件夹中，如果存在 `mods/multiplayer/beammp.zip`，请将其删除。启动器正常启动时会下载它，而 `--no-download` 不会把它删除。请确认 `mods/unpacked/beammp` 存在。
4. 试试开发模式。请用 `--dev` 启动启动器，然后手动启动 BeamNG。进入游戏后，确保 BeamMP 是唯一启用的模组。你可以像往常一样使用 BeamMP。

现在，你可以用代码编辑器直接在 `unpacked` 文件夹中修改代码。在游戏中按 `Ctrl` + `L` 重新加载 Lua；如果你修改了界面，还要按 `F5`。

## 设置本地服务器

本地服务器对开发 BeamMP 很有帮助。请按照[搭建服务器](/zh/server-owners/host-a-server)操作；如果你只在本地连接，可以省略前两步（端口转发和 AuthKey）。

在 `ServerConfig.toml` 中，将服务器设置为私有，并使用任意字符串作为 `AuthKey`。

## 贡献你的更改

当你对自己的更改满意时，用 git 提交它们。[Git-SCM 网站](https://git-scm.com/doc)上有教程和文档。把更改提交并推送到你的 fork 之后，你就可以发起拉取请求。

BeamMP 模组仓库中有一个 `CONTRIBUTING.md` 文件，其中说明了代码格式、提交信息格式和一般的开发实践。启动器仓库中有一个 `.clang-format` 文件，用于规定其代码风格，并且它的拉取请求模板要求你确认所有代码都是你自己编写并且理解的。仓库的 `README.md` 中可能包含已编译项目的构建步骤。

如果遇到问题，请到我们 [Discord 服务器](https://discord.gg/beammp)的 `#scripting` 频道提问。
