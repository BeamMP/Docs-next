---
description: "BeamMP 服务器参考手册：Resources 文件夹、环境变量、命令行参数、控制台命令以及后端限制。"
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

- `Server` 中存放若干文件夹，每个文件夹至少包含一个 `.lua` 文件。每个文件夹就是一个“插件”。服务器会按字母顺序（忽略大小写）加载插件，并跳过 `Server` 中不是文件夹的内容。位于插件顶层的 `.lua` 文件在修改时会被热重载。要编写插件，请参阅[服务器脚本参考](/zh/developers/beammp-scripting/server/latest)。
- `Client` 中存放 `.zip` 文件，玩家加入时会下载它们。服务器在启动时读取这些文件，并会对任何不是 `.zip` 的文件发出警告并忽略。要在服务器运行期间加载新增、修改或删除的模组，请使用 `reloadmods` [控制台命令](#console-commands)。

服务器还会在 `Client` 中保留一个名为 `mods.json` 的文件。它存储每个模组的 SHA-256 哈希值以及该模组是否受保护，这样服务器就不会对没有变化的模组重复计算哈希。服务器会按需重写这个文件。请不要编辑它。

## 环境变量

### 常规设置 {#general-settings}

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

空的或未设置的变量会被忽略。服务器启动时，会把它最终使用的值（包括这些变量的值）写回 `ServerConfig.toml`，除非设置了 `BEAMMP_PROVIDER_DISABLE_CONFIG`。

### 服务商设置 {#provider-settings}

这些变量允许托管服务商以及拥有大量服务器的用户覆盖服务商特有的设置。

#### `BEAMMP_PROVIDER_PORT_ENV`（v3.3.0 至 v3.4.1，以及自 v3.7.2 起）

当设置为非空字符串时，它指定另一个变量的名称，服务器会从该变量读取端口，而不是从 `BEAMMP_PORT` 读取。v3.5.0 至 v3.7.1 的服务器不会读取它。例如，Pterodactyl 可能会把端口暴露为 `SERVER_PORT`。你可以设置 `BEAMMP_PORT=${SERVER_PORT}`，但更简单的做法是设置 `BEAMMP_PROVIDER_PORT_ENV="SERVER_PORT"`，这样服务器就会从 `SERVER_PORT` 变量中读取端口。

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

#### `BEAMMP_MAX_CONCURRENT_CONNECTIONS`（自 v3.9.4 起）

设置服务器同时接受的来自同一个 IP 地址的最大连接数。它是 1 到 128 之间的整数，默认值为 10。超出范围或不是数字的值会被忽略，并给出警告。服务器同时接受的连接总数最多也是 128 个，这个值无法更改。`status` 命令会显示这两个限制。

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

## 控制台命令 {#console-commands}

在服务器控制台中输入这些命令。按 `Tab` 键可以补全命令。

| 命令 | 作用 |
|---|---|
| `help` | 显示命令 |
| `exit` | 关闭服务器 |
| `kick <name> [reason]` | 踢出一名玩家，可附带原因。名称会与玩家名称的开头部分匹配，忽略大小写。如果不填原因，玩家会看到“Kicked by server console” |
| `list` | 列出所有玩家，以及他们的 ID 和车辆数量 |
| `say <message>` | 在聊天中向所有玩家发送该消息 |
| `lua [state id]` | 切换到 Lua 控制台，可选择进入具有该 ID 的状态。请参阅[调试](/zh/developers/beammp-scripting/server/latest#debugging) |
| `settings [command]` | 设置或获取服务器设置。运行 `settings help` 了解更多。请参阅 [settings 命令](#settings-command) |
| `status` | 显示服务器的运行情况：玩家、车辆、运行时间、Lua 状态、事件计时器和处理程序、连接限制，以及服务器各个部分的状态 |
| `clear` | 清空控制台窗口 |
| `version` | 显示平台、服务器版本，以及 Lua 和 OpenSSL 的版本 |
| `protectmod <name> <value>` | 设置某个模组是否受保护。名称是模组的文件名，包括 `.zip`。值为 `true` 或 `false` |
| `reloadmods` | 从 `Resources/Client` 文件夹重新加载所有模组 |
| `nettest` | 询问 BeamMP 服务器检测服务，玩家能否通过服务器的端口访问你的服务器，并打印结果。`help` 不会列出它。自 v3.8.5 起 |

插件可以通过 `onConsoleInput` 事件添加自己的命令。请参阅[自定义命令](/zh/developers/beammp-scripting/server/latest#custom-commands)。

### settings 命令 {#settings-command}

`settings` 有四个子命令：

- `settings list` 列出所有设置及其值。
- `settings get <category> <setting>` 打印一项设置的值，例如 `settings get General MaxPlayers`。
- `settings set <category> <setting> <value>` 更改一项设置的值，例如 `settings set General MaxPlayers 12`。如果值中含有空格，请加引号。
- `settings help` 显示这些子命令。

更改只在服务器停止之前有效，不会写入 `ServerConfig.toml`。你可以更改 `General` 中的 `Description`、`Tags`、`MaxPlayers`、`Name`、`Map`、`MaxCars`、`Debug`、`AllowGuests` 和 `InformationPacket`，以及 `Misc` 中的 `ImScaredOfUpdates` 和 `UpdateReminderTime`。`Private`、`IP`、`Port`、`LogChat` 和 `ResourceFolder` 可以读取但不能更改。`AuthKey` 既不能读取也不能更改。

## ServerConfig.toml

服务器在首次启动时会生成此文件。文件中的注释对每项设置做了简要说明，而且服务器每次启动时都会重新写入该文件。请参阅[服务器配置](/zh/server-owners/configuration)。

如果 `AuthKey` 为空，服务器会打印错误，并在 10 秒后关闭。如果文件中有错误（例如缺少引号），也会出现同样的情况。

## 工作目录

决定 `ServerConfig.toml`、日志文件和 `Resources` 文件夹生成位置的，是服务器的工作目录，而不是服务器可执行文件所在的位置。

## 限制

BeamMP 后端对服务器强制执行以下限制：

- 名称：250 个字符
- 描述：1000 个字符
- 地图：100 个字符
- 标签：100 个字符

服务器本身会强制执行以下限制：

- 启动器版本：启动器版本低于 2.7.0 的玩家会被拒绝，并看到一条指明所需版本的消息。
- 聊天消息：长度超过 500 字节的消息或空消息会被丢弃。
- 连接数：默认情况下，同一个 IP 地址同时最多 10 个连接，总共最多 128 个。请参阅 `BEAMMP_MAX_CONCURRENT_CONNECTIONS`。
