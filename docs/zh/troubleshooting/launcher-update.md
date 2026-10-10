---
description: "当启动器无法自行更新或显示空白屏幕时，手动更新 BeamMP 启动器：在 Windows 上下载最新的启动器，或在 Linux 上重新编译。"
---
# 启动器更新问题

启动器无法更新，或显示空白屏幕？本指南介绍如何手动更新启动器。

在 Windows 上，按本指南操作之前，你应该已经使用[我们网站](https://beammp.com)上的安装程序安装了 BeamMP。

## 启动器如何更新 {#how-the-launcher-updates}

在 Windows 上，启动器每次启动时都会向 `backend.beammp.com` 检查是否有更新的版本。如果有，它会下载新版本、检查其签名，并把旧文件作为 `BeamMP-Launcher.back` 保留在同一个文件夹中。然后它会重新启动。如果你使用 `--no-update` 或 `--dev` 启动启动器，它会跳过这项检查。

如果更新失败，启动器会显示以下消息之一：

- `Failed to download the launcher update! Please try manually updating it`
- `The authenticity of the updated launcher could not be verified, it was corrupted or tampered with.`

请检查你的网络连接以及防火墙或杀毒软件，方法见 [Defender / 防火墙排除项](/zh/troubleshooting/defender-exclusions)。然后手动更新启动器。

在 Linux 上，启动器从不会自行更新。请按照[在 Linux 上更新启动器](/zh/get-started/install-beammp#update-the-launcher-on-linux)操作，而不是下面的步骤。

## 安装新的启动器

1. 直接从 [GitHub](https://github.com/BeamMP/BeamMP-Launcher/releases/latest/download/BeamMP-Launcher.exe) 下载最新的启动器。
2. 关闭启动器。
3. 前往存放 `BeamMP-Launcher.exe` 的文件夹。默认位置是 `C:\Users\<username>\AppData\Roaming\BeamMP-Launcher`。请把 `<username>` 替换为你的 Windows 用户名。如果你把 BeamMP 安装在了其他位置，例如 `D:\BeamMP-Launcher`，请使用那个文件夹。
4. 用新的启动器替换 BeamMP-Launcher 文件夹中现有的启动器。
5. 像往常一样启动启动器，并检查它是否正常工作。

## 仍然有问题？

请在我们的 [Discord 服务器](https://discord.gg/BeamMP)上创建支持工单。
