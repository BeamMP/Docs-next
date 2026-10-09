---
description: "在家搭建 BeamMP 服务器：转发端口、允许服务器通过防火墙、获取 AuthKey、安装并配置服务器、添加模组，并让玩家加入。"
---
# 搭建服务器

本指南介绍如何在你自己的 Windows 或 Linux 电脑上，于家中搭建 BeamMP 服务器。如果你使用的是托管公司，或带有管理面板的 VPS，请改为按照[在 VPS 上设置服务器](/zh/server-owners/setup-vps)操作。在家搭建服务器是免费的，而 VPS 更简单也更安全。

## 开始之前

服务器是 BeamMP 不可或缺的一部分：玩家通过服务器相互连接。你可以创建私人服务器，只有你邀请的人才能加入；也可以创建公开服务器，它会显示在官方服务器列表中。

使用服务器之前，请先阅读服务器的 [LICENSE](https://raw.githubusercontent.com/BeamMP/BeamMP-Server/master/LICENSE)。

服务器只支持 IPv4。如果你不知道自己用的是哪一种，请查看 [whatsmyip.org](https://www.whatsmyip.org/) 上显示的 IP 地址。如果其中包含冒号，那就是 IPv6。这种情况下，请向你的 ISP 或懂网络的人咨询，确认你是否同时拥有 IPv4。IPv6 支持已在计划中。

如果遇到问题，请在[论坛](https://forum.beammp.com)或 [Discord 服务器](https://discord.gg/beammp)的 `#support` 频道提问。[服务器配置](/zh/server-owners/configuration)中有关于服务器设置的更多详细信息。

## 转发端口 {#forward-the-port}

只有在路由器上转发了端口，家庭网络以外的玩家才能加入你在家托管的服务器。如果你使用的是 VPS 或独立服务器（rootserver），或者所有玩家都在你自己家里（你的本地网络）之内，请跳过此步骤。

::: danger 端口转发存在风险
进行端口转发，即表示你理解将家庭网络的端口向公众开放的风险。因此，对于你或你的家人可能遭受的任何及所有损害，你放弃追究 BeamMP 责任的权利。

我们不对任何外部链接的服务或网站上的内容负责。
:::

使用我们的合作服务来托管可以避免这一风险。如果要自己转发端口，请按照[端口转发指南](/zh/server-owners/port-forwarding)操作。

## 合作托管服务 {#partnered-hosting-services}

这些服务是付费的：

<!--@include: ./_parts/partners.md-->

## 允许服务器通过防火墙 {#allow-the-server-through-your-firewall}

根据你的环境，你可能需要让 BeamMP 服务器通过防火墙。在 Windows 上就是这种情况，关闭防火墙通常**不**管用；许多预装的 Linux 服务器上也是如此。

请允许 BeamMP 服务器通过防火墙，**入站和出站连接都要允许**，**TCP 和 UDP 也都要允许**。如果你的防火墙要求填写端口，请使用你转发的端口，通常是 30814。

详细指南请参阅 [Defender / 防火墙排除项](/zh/troubleshooting/defender-exclusions)。

<!--@include: ./_parts/authkey.md-->

## 安装服务器

BeamMP 服务器提供 Windows 和 Linux 版本。

### 在 Windows 上安装

请先转发你的端口。否则，家庭网络以外的任何人都无法加入。

1. 安装 [Visual C++ Redistributables](https://aka.ms/vs/17/release/vc_redist.x64.exe)。服务器需要它们才能运行。
2. 从 [beammp.com](https://www.beammp.com/) 下载服务器。你会得到一个名称类似 `BeamMP-Server.exe` 的可执行文件。
3. 在某处创建一个文件夹，并把 `BeamMP-Server.exe` 放进去。这就是你的服务器所在的位置。
4. 双击运行一次服务器，它会生成所需的文件。看到文字出现后，将其关闭。现在，`BeamMP-Server.exe` 旁边就有了一个 `ServerConfig.toml` 文件。
5. 可选：为了以后能快速打开，可以创建桌面快捷方式：**右键单击** > **发送到** > **桌面快捷方式**。

### 在 Linux 上安装

#### 使用我们编译的版本（推荐）

这适用于我们提供二进制文件的所有发行版，列在[最新发布页面](https://github.com/BeamMP/BeamMP-Server/releases/latest)上。如果使用其他发行版或架构，请参阅[从源代码编译](#build-from-source)。

1. 安装[运行时依赖项](https://github.com/BeamMP/BeamMP-Server#runtime-dependencies)中列出的依赖项。
2. 前往 [beammp.com](https://beammp.com/)，点击 **Download Server**。你会被带到服务器的 GitHub 发布页面。
3. 下载适用于你的发行版的版本。本指南称之为 `BeamMP-Server-xxx`，其中 `xxx` 是适用于你的发行版的版本。
4. 在某处创建一个文件夹，并把 `BeamMP-Server-xxx` 放进去。其他下载的文件暂时可以忽略。这就是你的服务器所在的位置。
5. 在该文件夹中打开终端并运行 `chmod +x BeamMP-Server-xxx`，这样你就有权限运行它。
6. 使用 `./BeamMP-Server-xxx` 运行一次服务器，它会生成所需的文件。看到文字出现后，将其关闭。现在，`BeamMP-Server-xxx` 旁边就有了一个 `ServerConfig.toml` 文件。
7. 可选，但强烈建议：创建一个名为 `beammpserver`（或类似名称）的用户，并且只以该用户身份启动服务器。不要以 root、使用 `sudo` 或以你个人的用户身份运行服务器。

#### 从源代码编译 {#build-from-source}

其他发行版也很可能可以使用，但不受官方支持。如果要自己编译服务器，请从 [GitHub](https://github.com/BeamMP/BeamMP-Server) 下载源代码，并按照[编译说明](https://github.com/BeamMP/BeamMP-Server#build-instructions)操作。最后，使用 `./BeamMP-Server` 运行一次服务器。

## 配置服务器 {#configure-the-server}

你运行服务器一次之后，它创建了一些文件，并且很可能打印了一两个错误。这是正常的，因为它还没有配置。你的文件夹中现在有这些文件：

![包含 ServerConfig.toml、Server.log 和 BeamMP-Server.exe 的服务器文件夹](../../assets/content/after-running-once.png)

它们是 `ServerConfig.toml`、`Server.log` 和 `BeamMP-Server.exe`。根据你的设置，你可能看不到 `.toml`、`.log` 和 `.exe` 扩展名。

用记事本等文本编辑器打开 `ServerConfig.toml`：**右键单击** > **打开方式…**，然后选择编辑器。配置示例：
```toml
[General]
Port = 30814
AuthKey = "auth-key"
AllowGuests = false
LogChat = false
Debug = false
IP = "::"
Private = true
InformationPacket = true
Name = "Test Server"
Tags = "Freeroam,Modded,Racing,Police"
MaxCars = 2
MaxPlayers = 10
Map = "/levels/ks_nord/info.json"
Description = "Total Random Beam MP Server"
ResourceFolder = "Resources"
```
此文件使用 TOML 格式。[服务器配置](/zh/server-owners/configuration)介绍了每一项设置。

1. 将 `AuthKey` 设置为你复制的密钥。把它粘贴在引号之间。以示例密钥为例，如下所示：
   ```toml
   AuthKey = '3173a2e-6az0-4542-a3p0-ddqq5ff95558'
   ```
2. 设置 `Name`，即你的服务器在服务器列表中的名称。你可以使用颜色等对它进行格式化：请参阅[自定义服务器名称的外观](/zh/server-owners/configuration#customize-the-look-of-your-server-name)。
3. 如果你选择了 30814 以外的端口，请在 `Port` 中设置它。
4. 当 `Private = true` 时，你的服务器不会显示在服务器列表中。要让它显示在列表中，请设置 `Private = false`。

### 检查是否能启动

再次运行服务器，并查看是否有 `[ERROR]` 或 `[WARN]` 消息。服务器现在应该会保持打开。然后，如果需要，可以添加模组，并了解如何加入。

## 添加模组

车辆模组和地图模组的安装方式不同，但都放在服务器的 `Resources/Client` 文件夹中。请把模组的 `.zip` 文件放进该文件夹。

::: warning
模组可能与 BeamNG、BeamMP 或其他模组不兼容，或者日后变得不兼容。如果遇到问题，请开始逐个移除模组。如果你在添加模组后尝试加入时收到“done”或“start”消息，那么你很可能添加了不兼容或已损坏的模组。如果你的游戏中安装了客户端模组，请参阅[模组安全](/zh/players/mod-safety)了解如何将它们从游戏中移除。
:::

### 车辆模组和其他模组

把模组的 `.zip` 文件放进 `Resources/Client`。所有加入的人都会自动下载它。

### 地图

原版地图无需安装任何东西即可使用。将 `ServerConfig.toml` 中的 `Map` 设置为其中一个[原版地图路径](/zh/server-owners/configuration#all-vanilla-maps-names)。

对于模组地图：

1. 把地图的 `.zip` 文件放进 `Resources/Client`。
2. 不解压，直接打开该 `.zip`，然后打开其中的 `levels` 文件夹。里面有一个以地图命名的文件夹，例如 `myawesomedriftmap2021`。请准确记下这个名称，并保持大小写和拼写一致。
3. 在 `ServerConfig.toml` 中，`Map` 的格式类似 `/levels/MAPNAME/info.json`，其中 `MAPNAME` 很可能是类似 `gridmap_v2` 的内容。请把 `MAPNAME` 替换为第 2 步中得到的文件夹名称。它必须以 `/info.json` 结尾。对于这个例子：
   ```toml
   Map = '/levels/myawesomedriftmap2021/info.json'
   ```
有人加入时，地图会自动下载并正常使用。

如果不起作用，请在单人模式的 BeamNG.drive 中安装该地图并进入它。按 `~`（波浪号）键打开控制台。如果你使用的不是美式键盘，请在 **Options** > **Controls** > **Bindings** 的 **General Debug** 部分中找到 **Toggle System Console** 操作。运行 `print(getMissionFilename())`，它会显示应使用的名称。

### 保护模组不被下载

你可以托管受保护或受限的内容，而无需再分发它们。这适用于“付费模组”，或者希望限制新作品访问范围的模组作者。

要保护某个模组，请在服务器控制台中运行：
```text
protectmod <filename with .zip> <true/false>
```
加入有受保护模组的服务器的玩家，必须自己获取该文件，例如从作者那里或 Patreon 等平台获取，并把它放进启动器的资源文件夹。启动器会告诉他们缺少了文件，游戏中也会弹出通知，显示缺少的文件以及解决方法。

## 让玩家加入

### 加入你自己的服务器

无论是私人还是公开服务器，加入的方式取决于它运行在哪里：

- **与游戏在同一台电脑上：** 使用直接连接。点击服务器列表左侧的 **Direct Connect** 选项卡，保留默认信息（`127.0.0.1` 和你的端口），然后点击 **Connect**。
- **在本地网络中的另一台电脑上：** 使用那台电脑的本地 IP 地址进行直接连接。
- **在家庭网络之外，例如 VPS：** 使用那台机器的公网 IP 地址进行直接连接。

### 私人服务器

把你服务器的公网 IP 地址告诉其他玩家。请谨慎选择分享对象。要加入，他们需要在 BeamMP 中打开 **Direct Connect** 选项卡，并输入你的 IP 地址和端口。

### 公开服务器

其他玩家可以在服务器列表中找到它：输入服务器名称，然后点击 **Connect**。这个名称就是你的 `ServerConfig.toml` 中的名称。如果他们找不到，请让他们关闭搜索筛选，并将地图设置为 **Any**。[Keymaster](https://keymaster.beammp.com/) 网站上也会显示你服务器的 IP 地址。

### “Connection Failed!”

如果你或朋友收到“Connection Failed!”，请在启动器窗口中查看是否有 10060、10061 或 10030 之类的代码。它们意味着以下两种情况之一：你处于 CGNAT 的 IPv4 地址之后，或者在[转发端口](#forward-the-port)或[允许服务器通过防火墙](#allow-the-server-through-your-firewall)时出了问题。

要检查是否处于 CGNAT 之后，请在路由器页面上查看 WAN IP 地址，并将其与你的[公网 IP](https://www.whatsmyip.org/) 进行比较。如果两者相同，那么你没有处于 CGNAT 之后。请参阅[检查 CGNAT](/zh/server-owners/cgnat)。目前尚不支持 IPv6。

## 检查玩家能否访问你的服务器

输入你服务器的公网 IPv4 地址和端口，然后点击 **CheckBeamMP**：

<form action="https://check.beammp.com/api/v2/beammp" method="get" target="_blank">
  <label for="ip">IP address:</label>
  <input type="text" id="ip" name="ip"><br>
  <label for="port">Port:</label>
  <input type="text" id="port" name="port"><br>
  <input type="submit" value="CheckBeamMP">
</form>

## 使用 VPN

BeamMP 不支持 RadminVPN 或 Hamachi 等 VPN，因为它们经常引发问题，其中之一是不转发 UDP 流量。要解决这个问题，请参阅[转发端口](#forward-the-port)。

::: question 可是以前明明可以，为什么现在不行了？
这些应用程序的开发者会更新他们的软件，并做出 BeamMP 无法控制的改动。是否支持 BeamMP 服务器这类特定用途，取决于他们。
:::

## 仍然有问题？

在[论坛](https://forum.beammp.com)上发帖，或在 [Discord 服务器](https://discord.gg/beammp)的 `#support` 频道中提交一个 **Server Support Ticket**。
