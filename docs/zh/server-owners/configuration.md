---
description: "BeamMP 服务器 ServerConfig.toml 的所有设置、原版地图路径、如何为服务器名称设置颜色和格式，以及服务器标签列表。"
---
# 服务器配置

BeamMP 服务器的设置、如何为它命名和添加标签，以及原版地图路径。要安装服务器，请参阅[搭建服务器](/zh/server-owners/host-a-server)。要查看日志或更新服务器，请参阅[服务器维护](/zh/server-owners/maintenance)。

## ServerConfig 文件

服务器配置是一个名为 `ServerConfig.toml` 的文件，使用 [TOML 格式](https://toml.io/en/)。

::: info 旧的配置文件
旧的服务器配置文件名为 `Server.cfg`。它已不再使用，如果它仍然存在，服务器会发出警告。这两种格式**不**兼容。
:::

配置分为 `[General]` 和 `[Misc]` 两个部分。默认值为服务器 3.9.4 版本的默认值。

### `[General]` 部分

| 设置项 | 默认值 | 取值 | 作用 |
|---|---|---|---|
| Port | `30814` | 1024-65535 | 服务器可供访问的网络端口。（必须唯一，且不能被同一主机上的其他服务占用。） |
| AuthKey | 空 | AuthKey 格式 `xxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`，其中所有 x 都是字母或数字（数字和字母） | 用于向后端标识一个公开设置的服务器。 |
| AllowGuests | `true` | true/false | 是否允许访客加入服务器。 |
| LogChat | `true` | true/false | 启用（true）时，聊天消息会记录在 server.log 文件中。 |
| Debug | `false` | true/false | 启用（true）时，会在日志中显示更多消息并提供更多信息。如果遇到问题，请启用它。启用后日志文件的大小会急剧增加。 |
| IP | `"::"` | 主机某个网络接口的本地 IP 地址 | 服务器绑定到此 IP 地址。它**不是**你的公网 IP。如果你的机器有多个网络接口，可以使用它。服务器正常运行并不需要你更改它。 |
| Private | `true` | true/false | 启用（true）时，你的服务器不会显示在服务器列表中。任何知道正确 IP 和端口的人仍然可以连接。 |
| InformationPacket | `true` | true/false | 启用（true）时，服务器会允许未经身份验证的客户端直接通过服务器获取与服务器列表中相同的信息。 |
| Name | `"BeamMP Server"` | 任意“文本” | 在服务器列表中显示为你的服务器的名称/标题。你可以使用特殊字符为其设置颜色和样式。 |
| Tags | `"Freeroam"` | 请参阅下方允许使用的标签列表。 | 用于搜索的标签，例如 Police、Racing 等…… |
| MaxCars | `1` | 任意数字 ≥ 1 | 每名玩家的最大车辆数。玩家尝试生成的任何额外车辆都会被立即删除。 |
| MaxPlayers | `8` | 任意数字 ≥ 1 | 每个服务器的最大玩家数。这不会影响车辆数量。 |
| Map | `"/levels/gridmap_v2/info.json"` | 有效的地图位置，例如 `/levels/gridmap_v2/info.json` | 你的服务器将托管的地图。必须是默认已安装的地图（列表见下方），或作为服务器模组安装。 |
| Description | `"BeamMP Default Description"` | 任意“文本” | 在服务器列表中显示为服务器的描述（如果服务器是公开的）。你可以使用特殊字符为其设置颜色和样式。 |
| ResourceFolder | `"Resources"` | 有效的文件夹位置，例如 "D:\Server\BeamMP\Resources" | 便于将服务器和资源文件夹分开存放。 |

### `[Misc]` 部分

| 设置项 | 默认值 | 取值 | 作用 |
|---|---|---|---|
| ImScaredOfUpdates | `true` | true/false | 启用（`true`）时，隐藏提示有新服务器版本发布的定期消息。服务器不会自行更新：请参阅[服务器维护](/zh/server-owners/maintenance#updating-the-server)。 |
| UpdateReminderTime | `"30s"` | 一个数字，后面加上 `s`、`min`、`h` 或 `d`，例如 `30s` | 更新提醒在终端中打印的频率。`30d` 表示每 30 天一次，`0.5min` 表示每半分钟一次。 |

插件可以使用它们自己的部分，例如 `[MyMod]`。

你**必须**自己设置 AuthKey。它默认是空的。请填入你在[安装服务器](/zh/server-owners/host-a-server)时获得的 AuthKey。不要与任何人分享，并且在截图中要将其完全模糊处理。

### 所有原版地图名称 {#all-vanilla-maps-names}

以下是所有原版地图：

- /levels/gridmap_v2/info.json
- /levels/johnson_valley/info.json
- /levels/automation_test_track/info.json
- /levels/east_coast_usa/info.json
- /levels/hirochi_raceway/info.json
- /levels/italy/info.json
- /levels/jungle_rock_island/info.json
- /levels/industrial/info.json
- /levels/small_island/info.json
- /levels/smallgrid/info.json
- /levels/utah/info.json
- /levels/west_coast_usa/info.json
- /levels/driver_training/info.json
- /levels/derby/info.json

### 自定义服务器名称的外观 {#customize-the-look-of-your-server-name}

在文本前使用这些特殊符号，即可在服务器列表中为该文本应用相应的效果：

| 值 | 描述 |
|:-----:|-----------------------------|
| `^r`  | 重置                        |
| `^p`  | 换行（仅限描述）            |
| `^n`  | 下划线                      |
| `^l`  | 粗体                        |
| `^m`  | 删除线                      |
| `^o`  | 斜体                        |
| `^0`  | 黑色                        |
| `^1`  | 蓝色                        |
| `^2`  | 绿色                        |
| `^3`  | 浅蓝色                      |
| `^4`  | 红色                        |
| `^5`  | 粉色                        |
| `^6`  | 橙色                        |
| `^7`  | 灰色                        |
| `^8`  | 深灰色                      |
| `^9`  | 浅紫色                      |
| `^a`  | 浅绿色                      |
| `^b`  | 浅蓝色                      |
| `^c`  | 深橙色                      |
| `^d`  | 浅粉色                      |
| `^e`  | 黄色                        |
| `^f`  | 白色                        |

### 自定义服务器标签

标签可以让人们搜索特定类型的服务器。你的 serverConfig.toml 生成时会带有自由漫游标签 `Tags = "Freeroam"`。

你可以添加多个标签，用逗号分隔，例如 `Tags = "Events,Offroad,lang:english"`，它们不区分大小写。

你可以从以下列表中选择：

::: tabs

== 年龄/内容

- `Mature/18+`

== 玩法类型

- `Freeroam`
- `Roleplay`
- `Economy`
- `Traffic`
- `Challenge`
- `Drift`

== 竞速类别

- `Racing`
- `Racing:NASCAR`
- `Racing:Track`
- `Racing:Drag`
- `Racing:Rally`
- `Touge`

== 越野

- `Offroad`
- `Crawling`
- `Rally`
- `Dakar`

== 毁坏类活动

- `Derby`
- `Arena`

== 天气和时间条件

- `Snow/Ice`
- `Rain`
- `Night`
- `Weather`

== 游戏模式

- `Gamemode`
- `Gamemode:Racing`
- `Gamemode:Rally`
- `Gamemode:Drag`
- `Gamemode:Derby`
- `Gamemode:Infection`
- `Gamemode:Cops-Robbers`
- `Gamemode:Delivery`
- `Gamemode:Sumo`

== 社区和活动

- `Scenarios`
- `Events`
- `Leaderboard`

== 模组

- `Modded`
- `Mod:BeamPaint`
- `Mod:BeamJoy`
- `Mod:CEI`

== 语言

- `Lang:English`
- `Lang:Russian`
- `Lang:French`
- `Lang:Spanish`
- `Lang:Portuguese`
- `Lang:German`
- `Lang:Polish`
- `Lang:Arabic`

== 其他

- `Vanilla`
- `Moderated`

:::


如果列表中缺少某个标签，你可以在[这里](https://forum.beammp.com/t/introducing-server-tags/1320081)提交添加请求。
