---
description: "解决 BeamMP 连接问题：查找服务器的 IP 地址，用 CheckBeamMP 测试端口是否开放，并检查你是否处于 CGNAT 之后。"
---
# 连接 / 网络问题

当你或你的玩家无法连接到 BeamMP 服务器时，请参阅本页。

## 查找服务器的 IP 地址

### 托管公司的服务器

IP 地址会显示在托管公司的服务器管理界面中。你也可以在 [Keymaster](https://keymaster.beammp.com/login) 网站上找到你的服务器的 IP 地址。

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

## 其他连接问题

- 启动器显示错误代码 10060 或 10061：请参阅[错误代码](/zh/troubleshooting/error-codes)。
- 启动器没有连接到游戏：请参阅[更改启动器端口](/zh/troubleshooting/launcher-port)。
- 防火墙或杀毒软件可能正在拦截 BeamMP：请参阅 [Defender / 防火墙排除项](/zh/troubleshooting/defender-exclusions)。
