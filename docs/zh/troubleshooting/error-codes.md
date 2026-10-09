---
description: "BeamMP 启动器窗口中的错误代码和消息（例如 10060 或 Launcher Update failed）是什么意思，以及如何解决。"
---
# 错误代码

本页列出了启动器可能显示的错误代码和消息，以及对应的处理方法。关于服务器窗口中的错误，请参阅[服务器错误代码](/zh/server-owners/error-codes)。


| 代码 | 描述 | 可能的解决方案 |
|---|---|---|
| 10048 | 其他程序已经在占用启动器端口 | 请确保同一时间只运行一个 BeamMP-Launcher 实例。可以尝试重启电脑。 |
| 10038 / 10060 / 10061 | 在指定的 IP 和/或端口上没有服务器应答 | 如果你是服务器所有者，请检查[搭建服务器](/zh/server-owners/host-a-server)中提到的端口转发和/或防火墙规则。如果你不是服务器所有者，请选择其他服务器，或联系所有者（如果你知道是谁）。 |
| 10054 | 连接被对方重置 | 你要连接的服务器已经离线。 |
| Failed to find the game please launch it. Report this if the issue persists code 3. | 启动器无法在注册表项中找到游戏的信息（游戏目录、配置文件目录、版本等） | 至少运行一次游戏，以便创建注册表值。 |
| Failed to find the game please launch it. Report this if the issue persists code 4. | 启动器无法读取注册表项中游戏的信息（游戏目录、配置文件目录、版本等） | 这个错误最可能出现在使用**盗版**游戏的用户身上。如果你购买了游戏，请至少运行一次，以便创建注册表值。 |
| Failed to Launch the game! launcher closing soon | 启动器无法找到游戏的可执行文件 | 在再次运行启动器之前，请至少运行一次游戏。 |
| Game Closed! launcher closing soon | 游戏已关闭 | 游戏关闭时，或游戏启动失败时，会出现此消息。 |
| Launcher Update failed! | 启动器下载新版本失败 | 请检查你的网络连接以及防火墙/杀毒软件规则，确保启动器没有被拦截。 |
| Logger file init failed | 启动器没有创建文件的权限 | 以管理员身份运行启动器。 |
| Please close the game and try again | 游戏已经打开，启动器无法清空 `multiplayer/mods` 文件夹 | 关闭游戏后重试。 |
| Please launch the game at least once | 启动器尝试修改游戏目录，但失败了 | 在再次运行启动器之前，请至少运行一次游戏。 |
| Primary Servers Offline! Sorry for the inconvenience! | 启动器检查更新失败 | 请检查你的网络连接和防火墙规则。如果你这边没有问题，请查看我们 Discord 上的 [BeamMP 更新频道](<https://discord.com/channels/601558901657305098/697596153943949352>)。 |
| Sorry Backend System Outage! Don't worry it will back on soon! | BeamMP 后端没有响应 | 请检查你的网络连接和防火墙规则。如果你这边没有问题，请查看我们 Discord 上的 [BeamMP 更新频道](<https://discord.com/channels/601558901657305098/697596153943949352>)。 |
| Stuck on updating | 启动器卡在更新阶段，无法继续下一步 | 以管理员身份运行启动器，并检查你的杀毒软件规则，确保启动器没有被拦截。 |

如果启动器立即关闭，请查看你安装 BeamMP 的文件夹中的 `Launcher.log` 文件。
