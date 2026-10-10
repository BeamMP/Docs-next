---
description: "BeamMP 服务器常见问题解答：搭建服务器、Linux、系统要求、玩家无法加入，以及报告 bug 或 AuthKey 泄露。"
---
# 服务器常见问题

关于运行 BeamMP 服务器的常见问题和已知问题。

## 设置

### 我如何设置自己的服务器？

你需要的一切都在[搭建服务器](/zh/server-owners/host-a-server)中；如果你使用托管公司，请参阅[在 VPS 上设置服务器](/zh/server-owners/setup-vps)。

### 我可以在 Linux 上运行服务器吗？

可以。我们在[最新发布页面](https://github.com/BeamMP/BeamMP-Server/releases/latest)上提供了许多 Linux 发行版的二进制文件。如果没有适用于你的发行版的版本，你可以从 [GitHub](https://github.com/BeamMP/BeamMP-Server) 上的源代码自行编译。[编译说明](https://github.com/BeamMP/BeamMP-Server#build-instructions)介绍了具体方法。

### 最低系统要求是什么？

| | 要求 |
|---|---|
| 内存 | 50 MiB 或更多可用内存，不含操作系统 |
| CPU | 高于 1 GHz，最好是多核 |
| 操作系统 | Windows 或 Linux（理论上任何 POSIX 系统均可） |
| GPU | 不需要 |
| 磁盘 | 10 MiB，外加模组和插件 |
| 带宽 | 5–10 Mb/s 上传 |

## 玩家无法加入

### 我网络以外的玩家无法加入我自己托管的服务器

如果其他玩家在启动器中收到错误代码 10060、10061 或 10038，请检查以下内容。完整的指南是[端口转发](/zh/server-owners/port-forwarding)。

- 转发端口 30814，或你在 `ServerConfig.toml` 中设置的端口，TCP 和 UDP 都要转发。
- 允许 BeamMP 通过 Windows 防火墙，入站和出站连接都要允许。关闭防火墙通常**不**管用。
- 确认你没有使用 VPN。它可能会引发问题。
- 确认服务器正在运行，且没有错误或警告。

服务器运行期间，你可以使用 CheckBeamMP 测试端口是否已转发：

<form action="https://check.beammp.com/api/v2/beammp" method="get" target="_blank">
  <label for="ip">IP address:</label>
  <input type="text" id="ip" name="ip"><br>
  <label for="port">Port:</label>
  <input type="text" id="port" name="port"><br>
  <input type="submit" value="CheckBeamMP">
</form>

有些互联网服务提供商不会给你分配专用的 IPv4 地址（CGNAT），因此即使你的路由器提供端口转发，它也可能无法生效。请参阅[检查 CGNAT](/zh/server-owners/cgnat)。在移动（4G 或 5G）连接上无法进行端口转发。

### 我能在列表中看到自己的服务器，但自己加入不了

如果服务器与游戏运行在同一台电脑上，请使用 **Direct Connect** 加入，使用 IP 地址 `127.0.0.1` 和你服务器的端口。

要通过服务器列表加入你自己托管的服务器，你的路由器必须支持 NAT 回环。没有多少家用路由器支持。

## 其他问题

<!--@include: ../_parts/faq-code-and-bugs.md-->

### 我可以拥有多少个 AuthKey，如何获得更多？

默认情况下，一个账号可以拥有 2 个 AuthKey。Patreon 等级和加速（Boost）BeamMP Discord 服务器可以增加更多。[BeamMP Accounts](https://accounts.beammp.com) 中的 **Keymaster** 会显示你已使用的密钥数量，以及每个额外密钥的来源。具体步骤请参阅[获取 AuthKey](/zh/server-owners/host-a-server#get-an-authkey)。

### 我的 AuthKey 泄露了，该怎么办？

在 **Keymaster** 中轮换（rotate）该密钥。旧密钥会立即失效。将新密钥填入你的 `ServerConfig.toml`，然后重启服务器。具体步骤请参阅[获取 AuthKey](/zh/server-owners/host-a-server#get-an-authkey)。

如果你无法自行轮换密钥，例如无法登录 BeamMP Accounts，请在 [Discord](https://discord.gg/beammp) 上创建一个 **Account Support** 工单。
