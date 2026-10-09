---
description: "一步步在家用路由器上转发 BeamMP 端口：设置静态 IP、登录路由器、创建规则，并用 CheckBeamMP 测试。"
---
# 端口转发

::: danger 免责声明：
**端口转发存在风险**。

进行端口转发，即表示你理解将家庭网络的端口向公众开放的风险，因此，对于你或你的家人可能遭受的**任何及所有**损害，你放弃追究 BeamMP 责任的权利。

我们不对任何外部链接的服务或网站上的任何内容负责。

<u>**如果你看不懂本指南，请考虑使用我们的合作伙伴。**</u>
:::

::: warning
请确认你的路由器不是仅支持 4G/5G 的设备。如果它是混合设备，请务必在本指南稍后的第 3 步中选择通过网线连接的适配器！
:::

## 你要做什么

创建端口转发规则会涉及一些详细的网络术语。在操作过程中，请准备好记下一些笔记。

本指南共有 4 个主要步骤。

## 快速指南

1. **为你的电脑或设备分配静态 IP 地址**

   这是为了防止设备的 IP 发生变化，从而使端口转发规则失效。

   [查看有关你的路由器的信息](https://portforward.com/router.htm#1)

2. **登录你的路由器**

   通常可以这样做：在命令提示符中执行 `ipconfig`，找到“默认网关”（Default Gateway）的 IP，然后把它输入到网络浏览器的地址栏中。

3. **将端口转发到你的电脑**

   在路由器的网页界面中找到端口转发部分。大多数路由器把端口转发部分列在“网络”（Network）、“高级”（Advanced）或“局域网”（LAN）之下。

4. **测试你的端口是否已正确转发**

   使用 CheckBeamMP 之类的工具来测试规则是否生效。

   <form action="https://check.beammp.com/api/v2/beammp" method="get" target="_blank">
    <label for="ip">IP address:</label>
    <input type="text" id="ip" name="ip"><br>
    <label for="port">Port:</label>
    <input type="text" id="port" name="port"><br>
    <input type="submit" value="CheckBeamMP">
   </form>

## 详细指南

### 分配静态 IP 地址

#### 方法 1：使用 DHCP 保留

在本地网络中设置静态 IP 地址的另一种方法，是使用路由器的 DHCP 保留功能。并非所有路由器都有此功能，所以这可能对你不适用。请用你的路由器型号在网上搜索，查找说明书。 

如果你已经成功做到了这一点，请跳到[登录你的路由器](#log-in-to-your-router)。

#### 方法 2：在 Windows 中设置静态 IP

##### 查找你当前的 IP 地址、网关和 DNS 服务器

在设置静态 IP 地址之前，我们需要知道你当前的网络设置。 
你需要把它们记下来，所以请准备好一个记事本窗口。 
这一步我们将使用命令提示符。

打开命令提示符。主要有 3 种方式：

- 按 Windows 键，然后开始输入“cmd”，当“命令提示符”高亮显示时按 Enter。


<figure class="image image_resized" style="width:62%;">

![Windows 开始菜单，命令提示符高亮显示](../../assets/content/win11-open-cmd.png)

</figure>

进入命令提示符后，运行以下命令：
```
ipconfig /all
```
你会看到大量数据。
如果你有虚拟网络适配器或多个网络适配器，数据会更多。 
如果你安装了 Hyper-V 或 Docker，看到很多虚拟适配器是很常见的。

<figure class="image image_resized" style="width:62%;">

![命令提示符中 ipconfig 的输出，其中 IPv4 地址、子网掩码、默认网关和 DNS 服务器已高亮显示](../../assets/content/win11-command-prompt-ipconfig-highlighted.png)

</figure>

建议让运行此服务器的电脑使用有线网络连接，不过无线连接也可以。
你需要在这个列表中找到一个有活动互联网连接的适配器。请滚动列表，找到已分配默认网关的那一个。 
许多虚拟适配器没有默认网关。 

下面是本地 IPv4 地址的示例，至少应该有一个适配器具有这样的地址。
你需要记下你的适配器的信息。

- 192.168.x.x
- 10.x.x.x.
- 172.16.x.x - 172.31.x.x

子网掩码（很可能是 255.255.255.0）
</br>
默认网关（很可能是 192.168.0.1 或 192.168.1.1）

::: info 请注意
BeamMP 目前不支持使用 IPv6 托管服务器。 
:::

##### 更改适配器设置

现在，我们需要更改网络适配器上的设置，让你的电脑保留它当前的 IP 配置。进入网络设置最快的方法是：

- 按一下 Windows 键
- 输入“网络连接”，直到出现“查看网络连接”
- 按 Enter 键


<figure class="image image_resized" style="width:62%;">

![Windows 开始菜单，显示“查看网络连接”](../../assets/content/win11-start-menu-view-network-connections.png)

</figure>

你应该会看到电脑上的网络连接列表。 
如果你安装了 Hyper-V 或 Docker，列表中可能会有很多项。 
请找出名称中不含“Hyper-V”的适配器。

<figure class="image image_resized" style="width:62%;">

![网络连接窗口，其中有以太网适配器](../../assets/content/win11-network-connections.png)

</figure>


右键单击你的适配器并选择“属性”。如果 `Internet Protocol Version 4` 没有被勾选，那么这是错误的适配器，请选择另一个。

<figure class="image image_resized" style="width:62%;">

![以太网属性窗口，其中 IPv4 项已高亮显示](../../assets/content/win11-ethernet-properties-highlighted.png)

</figure>

双击 `Internet Protocol Version 4`。将 `Obtain an IP address automatically` 改为 `Use the following IP address`。

用命令提示符中得到的信息（ipconfig /all）填写 IP 地址、子网掩码、默认网关和首选 DNS 服务器。

或者，你也可以不使用你自己的 DNS 服务器，而是使用 CloudFlare 或 Google 的 DNS 服务器：

- CloudFlare DNS：1.1.1.1、1.0.0.1
- Google DNS：8.8.8.8、8.8.4.4


<figure class="image image_resized" style="width:62%;">

![IPv4 属性窗口，其中已填写 IP 地址、子网掩码、默认网关和 DNS 服务器](../../assets/content/win11-network-settings-static-ip.png)

</figure>

点击“确定”，再点击一次“确定”，你的适配器就已经从 DHCP 改为静态了。上网看看，确认你仍然有网络连接。如果没有，请把设置改回自动获取 IP 地址，然后尝试下一种方法。

### 登录你的路由器 {#log-in-to-your-router}

现在你的设备已经有了静态 IP 地址，可以为 BeamMP 转发端口了！

首先，我们需要登录你的路由器。你之前记下的设置之一就是默认网关，它就是你的路由器的 IP 地址。

大多数路由器使用本地托管的网页进行管理。要查看路由器的菜单和设置：

- 打开网络浏览器。Firefox、Chrome 或 Edge 都可以。
- 在地址栏中输入你的默认网关 IP 地址，例如 192.168.0.1 或 192.168.1.1，然后按 Enter

此时你应该会看到路由器的登录界面。并非所有路由器都需要登录，但大多数需要。你需要知道路由器的用户名和密码。如果你从未登录过，那么用户名和密码很可能是出厂默认值，有时也写在路由器的标签上。

下面列出了一些最常见的出厂用户名和密码：

| 用户名      | 密码      |
| ----------- | --------- |
| admin       | admin     |
| admin       | password  |
| {空白}      | admin     |
| {空白}      | password  |

请尝试 admin、password 和留空的各种组合。*凡是写着“空白”的地方，请尝试将该项留空。* 

### 创建转发规则

#### 找到转发部分

在路由器的网页界面中找到端口转发部分。点击每个页面顶部或左侧的选项卡或链接，在路由器中四处浏览。大多数路由器把端口转发部分列在“网络”（Network）、“高级”（Advanced）或“局域网”（LAN）之下。查找以下关键词可以帮助你找到它：

- Port Forwarding
- Forwarding
- Port Range Forwarding
- Virtual Servers
- Apps & Gaming
- Advanced Setup/Settings
- NAT

#### 输入详细信息

找到路由器的端口转发部分后，就可以输入所需的信息了。
你的路由器会提供位置，让你输入要转发的端口，以及这些转发端口所指向的目标 IP 地址。如果你的路由器同时列出了内部端口和外部端口，请把它们设为相同。 

BeamMP 需要同时使用 UDP 和 TCP 的 30814 端口（除非你已在 [ServerConfig.toml](/zh/server-owners/host-a-server#configure-the-server) 中更改了它）。 

::: info 注意
虽然默认的 **Port** 是 **30814**，但你可以选择大于 1024 且小于 65535 的任何其他数字，不过如果它不是 30814，你需要记下你选择的端口。你需要同时转发 **TCP** 和 **UDP**。
</br>
建议使用默认端口，因为它很不可能被你电脑上的其他服务占用。
</br>
不过，如果你在一台机器上托管多个服务器，每个服务器都需要使用不同的 Port。例如，服务器 1：30814，服务器 2：30815。
:::

在某些路由器上，你可能需要创建 2 条规则，一条用于 UDP，一条用于 TCP；而另一些路由器可以用一条规则同时完成两者！

大多数路由器都有“保存”按钮，有些路由器需要重启才能使更改生效。

### 测试端口

测试连接有几种不同的方法。

我们推荐使用我们的工具 **CheckBeamMP**，因为它会检测 BeamMP 特有的问题和协议。

<form action="https://check.beammp.com/api/v2/beammp" method="get" target="_blank">
  <label for="ip">IP address:</label>
  <input type="text" id="ip" name="ip"><br>
  <label for="port">Port:</label>
  <input type="text" id="port" name="port"><br>
  <input type="submit" value="CheckBeamMP">
</form>

这需要先获取你的公网 IPv4 地址，同样有几种不同的方法。主要的方法是使用名为 [whatsmyip.org](https://whatsmyip.org/) 的网站。这是一个显示你的公网 IP 地址的简单网站。你要找的是格式为 xxx.xxx.xxx.xxx 的 IP 地址。

访问下面的链接，把“IP”替换为你实际的 IPv4 地址，把“Port”替换为你服务器的端口。请确保不要留下空格。
https://check.beammp.com/api/v2/beammp/ip/port

::: success status: ok
如果你得到了上面的输出，现在就可以加入你的服务器了！
有 2 种加入方式：直接使用你输入到 CheckBeamMP 中的信息，或者，如果你的服务器设置为“公开”，则通过服务器列表加入。
由于你是在本地托管服务器，如果服务器与你玩游戏的是同一台电脑，请使用 127.0.0.1（localhost）；否则请使用运行服务器的那台本地机器的局域网 IPv4 地址。
:::

::: failure status: error
如果连接完全失败，你的 ISP 可能在使用 CGNAT（运营商级网络地址转换，Carrier Grade Network Address Translation）。更多详细信息，请参阅[检查 CGNAT](/zh/server-owners/cgnat)，
  或在我们的 [Discord 服务器](https://discord.gg/beammp)的 `#support` 频道中开一个 Server Support 工单，我们的工作人员会处理你的工单！
  如果你只看到 TCP 正常而 UDP 失败，请再次检查防火墙和端口转发规则。
:::
