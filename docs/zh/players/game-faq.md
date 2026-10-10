---
description: "关于 BeamMP 玩家常见问题的解答：安装、游戏版本、与启动器的连接、Linux、杀毒软件警告、性能不佳以及报告 bug。"
---
# 游戏常见问题

关于游玩 BeamMP 的常见问题。关于账号、Patreon 和抢先体验的问题，请参阅[玩家常见问题](/zh/players/faq)。

## 游玩

### 我如何安装 BeamMP？

请按照[安装 BeamMP](/zh/get-started/install-beammp)操作。其中涵盖 Windows 和 Linux。

### BeamMP 可以在盗版或修改版的 BeamNG.drive 上运行吗？

BeamMP 无法在盗版或过时的 BeamNG.drive 上运行。

修改（包括第三方模组）可能会干扰 BeamMP。如何移除它们，请参阅[模组安全](/zh/players/mod-safety)。

BeamMP 支持团队无法帮助解决盗版、过时或经过其他修改的 BeamNG.drive 上的问题。

### 为什么 BeamMP 提示它与我的 BeamNG.drive 版本不兼容？

BeamMP 4.22 只能与 BeamNG.drive 0.39 配合使用。在任何其他版本上，BeamMP 模组都会自行关闭，并显示 **Error loading BeamMP**。

- 如果你的游戏版本较旧，请更新 BeamNG.drive。
- 如果你的游戏版本较新，请等待 BeamMP 更新。[Discord 服务器](https://discord.gg/BeamMP)会发布更新公告。

### 游戏提示它没有连接到启动器，我该怎么办？

请通过 BeamMP 启动器启动游戏，而不是从 Steam 或 BeamNG 启动程序启动。如果游戏已经在运行，请在该界面上点击 **Connect** 重试。如果启动器使用了不同的端口，请参阅[更改启动器端口](/zh/troubleshooting/launcher-port)。

### BeamMP 可以在 Linux 上运行吗？

客户端在 Linux 上不受官方支持。你可以参考我们的指南，在 Linux 上[安装 BeamMP](/zh/get-started/install-beammp#install-on-linux)。

### 为什么我的杀毒软件或 Windows Defender 会把启动器标记出来？

一些杀毒软件会将 BeamMP 标记为威胁，原因之一是它会使用网络。所有代码中都**没有病毒**。启动器、服务器和 Lua 客户端的代码都在我们的 [GitHub](https://github.com/BeamMP) 上。如果你需要允许启动器通过，请参阅 [Defender / 防火墙排除项](/zh/troubleshooting/defender-exclusions)。

### 我的性能很差，我该怎么办？

我们正在努力让多人模式尽可能稳定。如果你已经降低了图形设置，但性能仍然很差，请尝试玩家较少的服务器。

当很多人一起游玩时，游戏主要受限于 CPU，因此较旧的 CPU（即使是四核）在玩家稍多时就会吃力。一般的经验法则是每个 CPU 线程对应一辆车。

在 BeamMP 选项中开启 **可用时使用简化车辆**，可以把其他玩家的车辆替换为更轻量的版本。请参阅[多人模式设置](/zh/players/multiplayer-settings#players)。

## 其他问题

<!--@include: ../_parts/faq-code-and-bugs.md-->
