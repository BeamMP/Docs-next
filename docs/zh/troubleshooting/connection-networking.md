---
description: "解决 BeamMP 连接问题：查找服务器的 IP 地址，用 CheckBeamMP 测试端口是否开放，并检查你是否处于 CGNAT 之后。"
---
# 连接 / 网络问题

当你或你的玩家无法连接到 BeamMP 服务器时，请参阅本页。

## 查找服务器的 IP 地址

### 托管公司的服务器

IP 地址会显示在托管公司的服务器管理界面中。

### 家中的服务器

在浏览器中打开 [whatsmyip.org](https://whatsmyip.org)。它会显示互联网所看到的公网 IPv4 地址。

`127.0.0.1` 是本地主机（localhost）地址。只有你自己可以使用它，而且只有在服务器与游戏运行在同一台电脑上时才行。

## 测试端口是否开放

如果你的家用服务器仍然有连接问题，请检查你的[端口转发](/zh/server-owners/port-forwarding)，然后在服务器运行时用 CheckBeamMP 进行测试：

<form action="https://check.beammp.com/api/v2/beammp" method="get" target="_blank">
  <label for="ip">IP 地址：</label>
  <input type="text" id="ip" name="ip"><br>
  <label for="port">端口：</label>
  <input type="text" id="port" name="port"><br>
  <input type="submit" value="CheckBeamMP">
</form>

## 检查 CGNAT

有些网络服务提供商（ISP）会让端口转发变得困难。请[检查 CGNAT](/zh/server-owners/cgnat)，看看你能否在家中搭建服务器。

## 启动器使用的端口和地址 {#ports-and-addresses-the-launcher-uses}

如果你使用了严格的防火墙或代理，请为启动器允许以下连接：

| 端口 | 协议 | 连接双方 | 用途 |
|---|---|---|---|
| `4444` | TCP | 游戏到启动器，在你的电脑上 | 服务器列表、登录和加入请求。通过 `Launcher.cfg` 中的 `Port` 设置 |
| `4445`（`Port` + 1） | TCP | 游戏到启动器，在你的电脑上 | 你在服务器上时的游戏数据 |
| 启动时选择的一个空闲端口 | TCP（HTTP） | 游戏到启动器，在 `127.0.0.1` 上 | 为游戏内菜单向 `backend.beammp.com` 和 `forum.beammp.com` 发出的请求 |
| 服务器的端口（`30814`，除非服主更改过） | TCP 和 UDP | 启动器到服务器 | 加入、下载模组和游玩 |
| `443` | HTTPS | 启动器到 `backend.beammp.com`、`auth.beammp.com` 和 `forum.beammp.com` | 更新、服务器列表和登录 |

你不需要转发 `4444` 和 `4445`。它们只用于同一台电脑上的游戏和启动器。服务器的端口必须同时可通过 TCP 和 UDP 访问。

## 其他连接问题

- 启动器显示错误代码 10060 或 10061，或者在 Linux 上显示 `Error code: 110` 或 `111`：请参阅[错误代码](/zh/troubleshooting/error-codes)。
- 启动器没有连接到游戏：请参阅[更改启动器端口](/zh/troubleshooting/launcher-port)。
- 防火墙或杀毒软件可能正在拦截 BeamMP：请参阅 [Defender / 防火墙排除项](/zh/troubleshooting/defender-exclusions)。
