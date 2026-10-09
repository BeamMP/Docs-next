---
description: "为什么本地模组会导致 BeamMP 无法使用，以及四种修复方法：停用模组、新建用户文件夹、清除启动器缓存、清理 content 文件夹。"
---
# 模组安全

当你安装了本地模组时，BeamMP 可能无法正常工作。本页说明原因以及修复方法。

## 为什么我必须停用或移除我的模组？

在 BeamMP 中，你所连接的服务器会提供所需的模组。这些模组会在连接时自动下载并启用。
安装并启用本地模组，往往会导致 BeamMP 无法正常工作，即使除了 BeamMP 之外你只多装了一个模组也一样。


使用 BeamMP 时，有四种方法可以修复由模组引起的问题。

### 停用模组
在加入任何服务器之前，请确保除了 'multiplayerbeammp' 之外，没有启用其他任何模组。
如果这个方法不起作用，例如游戏卡死或显示黑屏，或者你仍然有问题，请尝试下一种修复方法。

### 新建用户文件夹

这会为游戏提供一个干净的用户文件夹。

1. 关闭 BeamNG.drive。
2. 打开 BeamNG 启动程序，点击 **Manage User Folder**，然后点击 **Open user folder**。
3. 重命名 `current` 文件夹，例如改为 `current_old`。

![三个步骤：BeamNG 启动程序中的 Manage User Folder、Open user folder，然后重命名 current 文件夹](../../assets/content/new-userfolder.png)

游戏下次启动时，会创建一个新的、干净的用户文件夹。

::: warning 我的设置和配置不见了！我怎样才能恢复它们？
如果你重命名了用户文件夹，就等于强制游戏创建了一个新的、干净的用户文件夹。你可以把被重命名的文件夹（例如 `current_old`）中的 'settings' 和 'vehicles' 文件夹复制到新创建的文件夹中。
请确保 BeamNG.Drive 已关闭，并替换目标位置中的所有项目。这样你应该就能恢复所有配置和设置，与之前一模一样。
:::

::: warning 将文件或文件夹移回新的用户文件夹时请务必小心。
如果你是通过重命名用户文件夹解决了问题，那么把旧文件移回去，可能会使你之前遇到的问题再次出现。
:::



完成后，请通过 BeamMP 启动器启动 BeamNG.Drive，这时 'multiplayerbeammp' 应该是 Repository 中唯一可用的已启用模组，主菜单上也会有进入 BeamMP 的按钮。
如果你在加入带有模组的服务器时仍然有问题，那很可能是它们提供了损坏或过时的模组。

### 清除启动器缓存
要清理 BeamMP 目录中缓存的模组，请前往 BeamMP 启动器的安装位置。默认路径是 'C:\Users\AppData\BeamMP-Launcher\'。在其中你会找到一个 'Resources' 文件夹。
删除该文件夹即可删除所有缓存的模组。如果你需要更多磁盘空间，或想清理过时的 BeamNG 模组，这会很有帮助。

### 移除 content 文件夹中的模组
如果你把模组放进了 content 文件夹，就应该将它们移除。
要访问 Beamng.drive\content\ 文件夹并清理其中的所有模组，请打开 BeamNG.drive 的安装位置。
右键点击 `content` 文件夹并将其删除。然后通过 Steam 或 Epic Games 验证游戏文件，这会重新下载基础文件。

::: quote DO_NOT_INSTALL_MODS_HERE.txt
请勿将模组复制到此文件夹：这可能导致模组损坏、更新安装变慢、模组管理器损坏、安全模式损坏等问题。
:::
