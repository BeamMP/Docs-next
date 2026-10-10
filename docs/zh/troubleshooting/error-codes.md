---
description: "BeamMP 启动器窗口中的错误代码和消息（例如 10060、10048 或 Failed to find the game）是什么意思，以及如何解决。"
---
# 错误代码

本页列出了启动器可能显示的错误代码和消息，以及对应的处理方法。这些消息来自启动器 v2.8.1。关于服务器窗口中的错误，请参阅[服务器错误代码](/zh/server-owners/error-codes)。

启动器还会把它显示的所有内容写入 `Launcher.log`，该文件位于启动器所在的文件夹中。每次启动器启动时，这个文件都会被清空，所以它只保存最近一次运行的内容。如果启动器立即关闭，请查看该文件。

## 网络代码

`error:` 或 `Error code:` 后面的数字是 Windows 套接字代码。在 Linux 上则是系统错误号。

| Windows（Linux） | 描述 | 可能的解决方案 |
|---|---|---|
| 10048 (98) | `bind failed with error`：有其他程序已经在占用启动器端口或下一个端口。默认端口为 `4444` 和 `4445` | 同一时间只运行一个启动器，并重启电脑。如果有其他程序占用了这些端口，请[更改启动器端口](/zh/troubleshooting/launcher-port)。在 Linux 上，加入第二个服务器时也会出现这种情况：请关闭游戏和启动器，然后重新启动它们 |
| 10060, 10061 (110, 111) | `Client: connect failed! Error code`：在该 IP 地址和端口上没有服务器应答 | 如果你是服务器所有者，请检查[搭建服务器](/zh/server-owners/host-a-server)中提到的端口转发和防火墙规则。如果你不是服务器所有者，请选择其他服务器，或联系所有者 |
| 10054 (104) | 连接被对方重置 | 你连接的服务器已经离线或重启。请稍后再试 |
| 10038 | `(Game) send failed with error`：游戏断开连接之后，启动器仍尝试向游戏发送数据。启动器 v2.8.0 会显示此消息 | 更新到最新的启动器 |
| `DNS lookup failed! on` 后跟一个名称 | 启动器无法找到你输入的服务器名称对应的地址 | 检查名称是否正确。也可以改用服务器的 IP 地址 |

## 启动游戏

| 消息 | 描述 | 可能的解决方案 |
|---|---|---|
| `Failed to find the game please launch it. Report this if the issue persists code 3` | Windows。`%LocalAppData%\BeamNG\BeamNG.Drive.ini` 存在，但启动器无法读取它 | 启动一次 BeamNG.drive，让它重新写入该文件 |
| `... code 4` | Windows。`BeamNG.Drive.ini` 中的 `installPath` 指向一个不存在的文件夹 | 从 BeamNG.drive 当前所在的文件夹启动一次它，或修正文件中的 `installPath` |
| `... code 5` | Windows。`BeamNG.Drive.ini` 中没有 `installPath` | 启动一次 BeamNG.drive |
| `... code 6` | Windows。不存在 `BeamNG.Drive.ini`，而且注册表项 `HKEY_CURRENT_USER\Software\BeamNG\BeamNG.drive` 中没有 `rootpath` 值 | 启动一次 BeamNG.drive |
| `... code 7` | Windows。不存在 `BeamNG.Drive.ini`，而且注册表项 `HKEY_CURRENT_USER\Software\BeamNG\BeamNG.drive` 不存在 | 启动一次 BeamNG.drive |
| `Unsupported Steam installation.` | Linux。启动器已知的 Steam 文件夹中，没有一个含有 `steamapps` 文件夹 | 这些文件夹请参阅[开始之前](/zh/get-started/install-beammp#before-you-start)。请把你的文件夹链接到其中之一 |
| `libraryfolders.vdf is missing.` | Linux。Steam 文件夹中没有 `libraryfolders.vdf` 文件 | 启动一次 Steam，然后重试 |
| `The game directory was not found.` | Linux。`libraryfolders.vdf` 列出的所有 Steam 库中都没有 BeamNG.drive | 通过 Steam 安装 BeamNG.drive |
| `Failed to Launch the game! launcher closing soon` | 启动器无法启动游戏文件夹中的 `BeamNG.drive.exe`（Windows）或 `BinLinux/BeamNG.drive.x64`（Linux）。在 Windows 上，后面会附带 Windows 错误代码和文字说明 | 在 Steam 中验证游戏文件，并在启动启动器之前先启动一次游戏 |
| `Game Closed! launcher closing soon` | 游戏已结束。启动器会在 5 秒后关闭 | 关闭游戏时出现这条消息是正常的。如果游戏是自己关闭的，请重新启动启动器 |
| `We were unable to clean the multiplayer mods folder! Is the game still running or do you have something open in that folder?` | 启动器在启动时会清空游戏用户文件夹中的 `mods/multiplayer` 文件夹，但这次没能清空 | 关闭游戏以及所有使用该文件夹的程序，然后重新启动启动器 |

## 启动器自身的文件

| 消息 | 描述 | 可能的解决方案 |
|---|---|---|
| `logger file init failed!` | 启动器无法在它所在的文件夹中创建 `Launcher.log` | 把启动器移到一个你有写入权限的文件夹 |
| `Config failed to parse make sure it's valid JSON!` | `Launcher.cfg` 不是有效的 JSON。启动器会关闭 | 修复该文件，或删除它。启动器会使用默认设置创建一个新的 |
| `Failed to open Launcher.cfg!`, `Failed to write config on disk!` | 启动器无法在它运行所在的文件夹中读取或创建 `Launcher.cfg` | 从一个你有写入权限的文件夹运行它 |
| `Failed to create caching directory` | 启动器无法创建模组缓存文件夹，该文件夹默认为 `Resources`，除非你在 `Launcher.cfg` 中设置了 `CachingDirectory` | 将 `CachingDirectory` 设置为一个你有写入权限的文件夹 |
| `Exception in main()` | 发生致命错误。启动器会在 5 秒后关闭 | 阅读它后面的文字，并到[论坛](https://forum.beammp.com)或 [Discord 服务器](https://discord.gg/beammp)提问 |

## 更新与 BeamMP 服务器

| 消息 | 描述 | 可能的解决方案 |
|---|---|---|
| `Failed to download the launcher update! Please try manually updating it` | Windows。启动器无法下载它的更新 | 请参阅[启动器更新问题](/zh/troubleshooting/launcher-update) |
| `The authenticity of the updated launcher could not be verified, it was corrupted or tampered with.` | Windows。下载的更新没有有效的签名，所以启动器把它删除了 | 按照[启动器更新问题](/zh/troubleshooting/launcher-update)中的方法，从 [GitHub 发布页面](https://github.com/BeamMP/BeamMP-Launcher/releases/latest)下载启动器 |
| `Auto update is NOT implemented for the Linux version.` | Linux。存在更新的启动器版本 | 重新编译启动器：请参阅[在 Linux 上更新启动器](/zh/get-started/install-beammp#update-the-launcher-on-linux) |
| `GET to ... failed` 或 `POST to ... failed`，随后是 `Curl error` | 启动器无法连接到 BeamMP 服务器。后面的文字会给出原因，例如超时或证书错误 | 请检查你的网络连接和防火墙规则。如果你这边没有问题，请查看我们 Discord 上的 [BeamMP 更新频道](<https://discord.com/channels/601558901657305098/697596153943949352>) |
| `Invalid hash from backend, skipping update check.` | BeamMP 后端没有给出有效的回应。启动器会跳过检查并继续运行 | 请检查你的网络连接和防火墙规则 |
| `Failed to communicate with the auth system!` | 登录服务器没有应答 | 请检查你的网络连接和防火墙规则，然后重试 |
| `Invalid answer from authentication servers, please try again later!` | 登录服务器给出了启动器无法读取的回应 | 请稍后再试 |

## 模组

| 消息 | 描述 | 可能的解决方案 |
|---|---|---|
| `Mod '...' is protected and therefore must be placed in the Resources/Caching folder manually here:` 后跟一个路径 | 服务器使用了受保护的模组，启动器不会下载它 | 从模组作者处获取该文件，并放入消息中显示的文件夹，保持文件名不变 |
| `Server cannot find` 后跟一个文件名 | 服务器没有它列出的那个模组文件 | 告诉服务器所有者 |
| `Failed to write or download the entire file ... (hash mismatch)` | 模组文件没有正确下载 | 重新加入。启动器会再次检查该文件并重新下载 |
| `Failed copy to the mods folder!` | 启动器无法把模组复制到游戏的 `mods/multiplayer` 文件夹中 | 关闭游戏以及所有使用该文件夹的程序，然后重新加入 |
