---
description: "BeamMP 服务器参考手册：它会读取哪些外部参数、Resources 文件夹、环境变量、命令行参数以及后端限制。"
---
# 服务器手册

本页是关于 BeamMP 服务器行为的参考。关于如何搭建服务器，请参阅[搭建服务器](/zh/server-owners/host-a-server)。关于 `ServerConfig.toml` 中的设置，请参阅[服务器配置](/zh/server-owners/configuration)。

## 哪些因素会影响服务器

服务器会受到以下外部参数状态的影响：

- `Resources` 文件夹
- 环境（进程环境变量）
- 命令行参数
- `ServerConfig.toml` 文件
- 工作目录

## Resources 文件夹

服务器会在启动时创建 `Resources` 文件夹，其中包含 `Client` 和 `Server` 子文件夹。

- `Server` 中存放若干文件夹，每个文件夹至少包含一个 `.lua` 文件。每个文件夹就是一个“插件”。位于插件顶层的 `.lua` 文件在修改时会被热重载。
- `Client` 中只存放 `.zip` 文件。它们在服务器启动时加载，并假定在服务器运行期间不会发生变化。

## 环境变量

### 常规设置

自服务器 v3.2.0 版本起，服务器支持使用环境变量来**覆盖** `ServerConfig.toml` 中的设置。每项设置都有对应的环境变量。设置名称采用 PascalCase。变量名则是全大写的名称，在每个新单词开头加下划线，并加上前缀 `BEAMMP_`。例如，`MaxPlayers` 变成 `MAX_PLAYERS`，加上前缀后是 `BEAMMP_MAX_PLAYERS`。目前存在以下变量（“Since”列是首个读取该变量的服务器版本）：

| 变量 | 设置 | Since |
|---|---|---|
| `BEAMMP_DEBUG` | `Debug` | v3.2.0 |
| `BEAMMP_PRIVATE` | `Private` | v3.2.0 |
| `BEAMMP_PORT` | `Port` | v3.2.0 |
| `BEAMMP_MAX_CARS` | `MaxCars` | v3.2.0 |
| `BEAMMP_MAX_PLAYERS` | `MaxPlayers` | v3.2.0 |
| `BEAMMP_MAP` | `Map` | v3.2.0 |
| `BEAMMP_NAME` | `Name` | v3.2.0 |
| `BEAMMP_DESCRIPTION` | `Description` | v3.2.0 |
| `BEAMMP_TAGS` | `Tags` | v3.2.0 |
| `BEAMMP_RESOURCE_FOLDER` | `ResourceFolder` | v3.2.0 |
| `BEAMMP_AUTH_KEY` | `AuthKey` | v3.2.0 |
| `BEAMMP_LOG_CHAT` | `LogChat` | v3.2.0 |
| `BEAMMP_ALLOW_GUESTS` | `AllowGuests` | v3.5.0 |
| `BEAMMP_INFORMATION_PACKET` | `InformationPacket` | v3.7.0 |
| `BEAMMP_IM_SCARED_OF_UPDATES` | `ImScaredOfUpdates`（`[Misc]` 部分） | v3.8.2 |
| `BEAMMP_UPDATE_REMINDER_TIME` | `UpdateReminderTime`（`[Misc]` 部分） | v3.8.2 |
| `BEAMMP_IP` | `IP` | v3.8.3 |

对于类型为字符串或数字的设置，值是一个字符串，例如 `BEAMMP_NAME="Cool Server"`、`BEAMMP_NAME=Server1` 或 `BEAMMP_PORT=12345`。

对于类型为真或假（开或关）的设置，值为 `true` 或 `1` 表示开启。任何其他值都表示关闭。

### 服务商设置

这些变量允许托管服务商以及拥有大量服务器的用户覆盖服务商特有的设置。

#### `BEAMMP_PROVIDER_PORT_ENV`（自 v3.3.0 起）

当设置为非空字符串时，它指定另一个变量的名称，服务器会从该变量读取端口，而不是从 `BEAMMP_PORT` 读取。例如，Pterodactyl 可能会把端口暴露为 `SERVER_PORT`。你可以设置 `BEAMMP_PORT=${SERVER_PORT}`，但更简单的做法是设置 `BEAMMP_PROVIDER_PORT_ENV="SERVER_PORT"`，这样服务器就会从 `SERVER_PORT` 变量中读取端口。

#### `BEAMMP_PROVIDER_IP_ENV`（自 v3.8.4 起）

当设置为非空字符串时，它指定另一个变量的名称，服务器会从该变量读取 IP 地址，而不是从 `BEAMMP_IP` 读取。它的工作方式与 `BEAMMP_PROVIDER_PORT_ENV` 相同。

#### `BEAMMP_PROVIDER_DISABLE_CONFIG`（自 v3.3.0 起）

如果设置为 `1` 或 `true`，则**不会生成** `ServerConfig.toml`，即使它已存在也**不会读取**。你必须设置 `BEAMMP_AUTH_KEY`，服务器才能运行。

#### `BEAMMP_PROVIDER_UPDATE_MESSAGE`（自 v3.2.2 起）

当设置为非空字符串时，它会替换整条更新消息，默认的更新消息以“NEW VERSION IS OUT! Please update to the new…”开头。

你的消息中**必须**包含 `{}`。服务器会将其替换为新的版本号。例如：
```sh
BEAMMP_PROVIDER_UPDATE_MESSAGE="NEW VERSION of the BeamMP-Server has been released: {}! Please follow the update guide here: https://example.com/update-guide"
```
这会产生如下的更新消息：
```text
NEW VERSION of the BeamMP-Server has been released: v5.0.2! Please follow the update guide here: https://example.com/update-guide
```
请向用户明确说明他们应该更新，并解释如何更新。

#### `BEAMMP_PROVIDER_DISABLE_MP_SET`（自 v3.9.2 起）

如果设置为 `1` 或 `true`，Lua 插件就不能使用 `MP.Set` 更改服务器设置。尝试这样做的插件会收到一个错误，提示该调用已被你的服务器服务商阻止。

#### `BEAMMP_MAX_CONCURRENT_CONNECTIONS`（自 v3.9.2 起）

设置服务器同时处理的最大连接数。它是 1 到 128 之间的整数，默认值为 10。超出范围或不是数字的值会被忽略，并给出警告。

## 命令行参数

使用 `--help` 运行服务器即可查看它们：`./BeamMP-Server --help`。参数如下：

| 参数 | 作用 |
|---|---|
| `--help` | 显示帮助并退出 |
| `--version` | 打印服务器版本并退出 |
| `--port=1234` | 设置服务器监听的 TCP 和 UDP 端口。它会覆盖环境变量和 `ServerConfig.toml` |
| `--config=/path/to/ServerConfig.toml` | 服务器配置文件的绝对或相对路径，包括文件名。路径中含有空格时请加引号 |
| `--working-directory=/path/to/folder` | 设置服务器的工作目录。所有路径（包括 `--config` 中的路径）都相对于它 |

例如，`BeamMP-Server --config=../MyWestCoastServerConfig.toml` 会使用上一级文件夹中的配置文件运行服务器。

## 控制台命令

在服务器控制台中输入这些命令：

| 命令 | 作用 |
|---|---|
| `help` | 显示命令 |
| `exit` | 关闭服务器 |
| `kick <name> [reason]` | 踢出一名玩家，可附带原因 |
| `list` | 列出所有玩家及其相关信息 |
| `say <message>` | 在聊天中向所有玩家发送该消息 |
| `lua [state id]` | 切换到 Lua，可选择进入具有该 ID 的状态 |
| `settings [command]` | 设置或获取服务器设置。运行 `settings help` 了解更多 |
| `status` | 显示服务器的运行情况 |
| `clear` | 清空控制台窗口 |
| `version` | 显示服务器版本 |
| `protectmod <name> <value>` | 设置某个模组是否受保护。值为 `true` 或 `false` |
| `reloadmods` | 从 `Resources/Client` 文件夹重新加载所有模组 |

## ServerConfig.toml

服务器在首次启动时会生成此文件。文件中的注释是对每项设置最新的说明。

## 工作目录

决定 `ServerConfig.toml`、日志文件和 `Resources` 文件夹生成位置的，是服务器的工作目录，而不是服务器可执行文件所在的位置。

## 限制

BeamMP 后端对服务器强制执行以下限制：

- 名称：250 个字符
- 描述：1000 个字符
- 地图：100 个字符
- 标签：100 个字符
