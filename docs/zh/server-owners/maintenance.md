---
description: "维护正在运行的 BeamMP 服务器：阅读服务器日志文件、在 Windows 或 Linux 上更新服务器，以及检查新版本。"
---
# 服务器维护

如何维护一个已经在运行的 BeamMP 服务器：日志文件和更新。关于 `ServerConfig.toml` 中的设置，请参阅[服务器配置](/zh/server-owners/configuration)。

## 服务器日志文件

服务器运行时会生成这个文件。它是你运行服务器时在控制台中看到的消息的镜像。该文件名为 `Server.log`。服务器启动时，会将上一次运行的日志重命名为 `Server.old.log`，并替换掉更早的 `Server.old.log`。每次需要我们的支持人员提供支持时，你都应该附上这个文件，而且它绝不会显示你的 AuthKey，所以通常可以不加修改直接发送。

格式如下（$ 前缀表示“变量”，下面会解释）：

```
[$DATE $TIME] $CONTEXT [$LOG_LEVEL] $MESSAGE
```

其中：

- `$DATE` 是消息的日期，格式为日/月/年，例如 21/07/21
- `$TIME` 是消息的时间，例如 11:05:23。在 Debug 模式下，还会显示毫秒，例如 11:05:23.142
- `$CONTEXT`（仅在 Debug 模式下可见，主要与开发者相关）是消息的上下文，它可能是：
	- `(Player ID) “Player Name”`，其中玩家的 ID 对管理很有用
	- 一个简短的名称，例如“HeartbeatThread”
- `$LOG_LEVEL` 是消息重要程度的级别之一：
	- `DEBUG`：仅在 Debug 模式下可见，通常很刷屏，只对开发者重要
	- `EVENT`：仅在 Debug 模式下可见，表示服务器触发的一个 Lua 事件
	- `INFO`：一般信息
	- `LUA`：来自 Lua 插件的消息
	- `LUA WARN` 和 `LUA ERROR`：来自 Lua 插件系统的警告或错误，例如插件代码中的错误
	- `WARN`：通常描述不应该发生的事情
	- `ERROR`：出了严重的问题，或者发生了非常意外的事情
- `$MESSAGE` 是消息本身，通常是你应该留意并理解的内容。在某些情况下它可能晦涩难懂，但一般规则是：只要服务器没有明显的问题，也没有 ERROR，就一切正常。

## 更新服务器 {#updating-the-server}

### 为什么要更新

每当有新的更新发布时，建议你更新服务器。更新通常包含 bug 修复、稳定性改进和安全性改进，此外还有引入的新功能等。

要接收更新发布的消息，可以关注 Discord 服务器的“update”频道，在论坛上留意，或者查看或询问 [GitHub 发布页面](https://github.com/BeamMP/BeamMP-Server/releases)。

### 如何更新

#### 如果你使用的是 BeamMP 合作托管服务商

如果你使用的是 BeamMP 合作托管服务商，下面的说明很可能不适用。我们建议等待你的托管服务商提供更多详细信息，或联系他们寻求帮助。

#### 自己管理服务器

更新服务器的方法是用新的可执行文件替换旧的。如果你不确定该怎么做，下面有针对 Windows 和 Linux 的分步说明。

如果你是从源代码编译的，只需重新编译即可。重新编译之前，请务必运行 `git submodule update --init --recursive`。

#### 在 Windows 上

1. 请确保你已经安装了 [Visual C++ Redistributables](https://aka.ms/vs/17/release/vc_redist.x64.exe)，这样才能运行服务器。
2. 前往 [BeamMP.com](https://beammp.com/)，点击“Download Server”按钮。
3. 下载完成后，你应该会看到一个名为 `BeamMP-Server.exe` 的文件。我们称之为“新的可执行文件”。
4. 前往你当前的 `BeamMP-Server.exe` 可执行文件所在的文件夹（通常与你的 `ServerConfig.toml` 在同一个文件夹）。我们称之为“旧的可执行文件”。
5. 用新的可执行文件替换旧的可执行文件（例如，将新的可执行文件复制或移动到该文件夹中）。

#### 在 Linux 上

1. 前往 [BeamMP.com](https://beammp.com/)，点击“Download Server”按钮，你会被重定向到服务器的 Github 发布页面。
2. 下载适用于你的发行版和处理器类型的文件。文件名类似 `BeamMP-Server.debian.12.x86_64`。请不要下载 `debuginfo` 文件。为简单起见，从现在开始称之为 `BeamMP-Server-xxx`，其中 `xxx` 表示适用于你所用发行版的版本。
3. 下载完成后，你应该会看到一个名为 `BeamMP-Server-xxx` 的文件，具体取决于你下载的版本。我们称之为“新的可执行文件”。
4. 前往你当前的 `BeamMP-Server-xxx` 可执行文件所在的文件夹（通常与你的 `ServerConfig.toml` 在同一个文件夹）。我们称之为“旧的可执行文件”。
5. 用新的可执行文件替换旧的可执行文件（例如，将新的可执行文件复制或移动到该文件夹中）。
6. 在你刚刚替换了可执行文件的那个文件夹中打开终端，并运行 `sudo chmod +x BeamMP-Server-xxx`。这样可以确保服务器能够运行。

### 更新消息 {#update-messages}

服务器不会自行更新。它会在启动时检查是否有更新的版本，如果有，就打印一条消息。除非 `ImScaredOfUpdates` 为 `true`（这是默认值），否则它会按 `UpdateReminderTime` 设定的间隔再次打印该消息。这两项设置都在[服务器配置](/zh/server-owners/configuration#the-misc-section)中。托管服务商可以替换这条消息：请参阅[服务器手册](/zh/server-owners/manual#provider-settings)中的服务商设置。

如果要通过脚本检查新版本，请向 GitHub API 请求最新发布版本，并将服务器的版本与标签进行比对。你可以通过对 `https://api.github.com/repos/BeamMP/BeamMP-Server/git/refs/tags` 发送 GET 请求来获取。
