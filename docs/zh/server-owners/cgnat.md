---
description: "查明你的网络是否处于 CGNAT 之后。即使转发了端口，CGNAT 也会让玩家无法加入你在家托管的 BeamMP 服务器。"
---
# 检查 CGNAT

你的防火墙排除项和端口转发规则都已正确设置，却仍然没有人能加入你在家托管的服务器？你可能处于 CGNAT 之后。

如果你使用的是托管服务并且遇到连接问题，请联系服务商。如果你想使用 VPS，或者无法在家托管，请参阅[合作托管服务](/zh/server-owners/host-a-server#partnered-hosting-services)。

## 什么是 CGNAT？

运营商级 NAT（Carrier-grade NAT，CGNAT）是部分网络运营商采用的一种方案，它会让你很难把端口转发到家里。关于它是什么，以及它为什么会给在家托管带来问题，请参阅[维基百科上的运营商级 NAT](https://en.wikipedia.org/wiki/Carrier-grade_NAT)。

## 检查 CGNAT

### 方法 1：跟踪路由

1. 打开命令提示符并运行：
   ```text
   tracert -4 beammp.com
   ```
   它会列出一系列网络跳数。请等待它完成，最多可能需要 30 跳。
2. 第一跳是你的路由器、调制解调器或网关，不同设备各不相同。请查看它之后的前几个 IP 地址。
3. 如果第一跳之后出现多个介于 `100.64.x.x` 和 `100.127.x.x` 之间的地址，或以 `10.` 开头的地址，那么你很可能处于 CGNAT 之后。

本地网络的官方地址范围是 `10.0.0.x`、`192.168.x.x` 和 `172.16.x.x`。

### 方法 2：比较 IP 地址

在路由器的界面上找到 WAN IP 地址，并将其与 [whatsmyip.org](https://whatsmyip.org) 上显示的地址进行比较。如果两者**不**相同，那么你处于 CGNAT 之后。

## 如果你处于 CGNAT 之后

请致电你的互联网服务提供商（ISP）寻求帮助。根据 ISP 的不同，他们可能不提供专用的动态 IP 地址。不一定需要静态 IP。

::: warning
ISP 可能只把专用 IP 地址作为**付费选项**提供。请将价格与我们的合作托管服务比较一下：后者可能更便宜。
:::

下面是一个没有处于 CGNAT 之后的网络示例：

![未处于 CGNAT 之后的连接的网络示意图](https://github.com/user-attachments/assets/fee21a50-cbb0-4322-9c26-d9f04f88ae37)
