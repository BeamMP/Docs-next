---
description: "在 VPS 或托管公司的管理面板上设置 BeamMP 服务器：获取 AuthKey、填写面板字段、添加模组，并让玩家加入。"
---
# 在 VPS 上设置服务器

本指南适用于在 VPS 上或在带有管理面板的托管公司处运行的服务器。如果你想改为在家搭建，请按照[搭建服务器](/zh/server-owners/host-a-server)操作。

使用 VPS 托管不需要在你的路由器上更改任何防火墙或端口转发设置。

## 开始之前

服务器是 BeamMP 不可或缺的一部分：玩家通过服务器相互连接。你可以创建私人服务器，只有你邀请的人才能加入；也可以创建公开服务器，它会显示在官方服务器列表中。

使用服务器之前，请先阅读服务器的 [LICENSE](https://raw.githubusercontent.com/BeamMP/BeamMP-Server/master/LICENSE)。

如果遇到问题，请在[论坛](https://forum.beammp.com)或 [Discord 服务器](https://discord.gg/beammp)的 `#support` 频道提问。[服务器配置](/zh/server-owners/configuration)中有关于服务器设置的更多详细信息。

如果你还没有选好 VPS，可以看看我们的合作托管服务。它们是付费的。

::: details 合作托管服务
<!--@include: ./_parts/partners.md-->
:::

## 设置 VPS

请确保你的服务器管理页面可以访问。确认服务器已准备好运行后，再继续。

<!--@include: ./_parts/authkey.md-->

## 填写面板字段

托管面板中有一些字段需要填写。标有 `*` 的字段为必填项。

1. 把你的 AuthKey 粘贴到 **Authkey** 字段中。
2. 给你的服务器起一个名称并填写描述。你可以使用颜色等对它们进行格式化：请参阅[自定义服务器名称的外观](/zh/server-owners/configuration#customize-the-look-of-your-server-name)。

::: warning
你不能在文件管理器中直接编辑 `ServerConfig.toml`。这是有意为之，目的是让托管公司能够强制执行玩家数量等限制。
:::

### 检查是否能启动

运行你的服务器，并查看是否有 `[ERROR]` 或 `[WARN]` 消息。服务器现在应该会保持运行。然后，如果需要，可以添加模组，并了解如何加入。

## 添加模组

你可以使用面板的文件管理器添加模组。车辆模组和地图模组的安装方式不同，但都放在服务器的 `Resources/Client` 文件夹中。请把模组的 `.zip` 文件放进该文件夹。

::: warning
模组可能与 BeamNG、BeamMP 或其他模组不兼容，或者日后变得不兼容。如果遇到问题，请开始逐个移除模组。如果你在添加模组后尝试加入时收到“done”或“start”消息，那么你很可能添加了不兼容或已损坏的模组。如果你的游戏中安装了客户端模组，请参阅[模组安全](/zh/players/mod-safety)了解如何将它们从游戏中移除。
:::

### 车辆模组和其他模组

把模组的 `.zip` 文件放进 `Resources/Client`。所有加入的人都会自动下载它。

### 地图

原版地图无需安装任何东西即可使用。将管理面板中的 **Map** 字段设置为其中一个[原版地图路径](/zh/server-owners/configuration#all-vanilla-maps-names)。

对于模组地图：

1. 把地图的 `.zip` 文件放进 `Resources/Client`。
2. 不解压，直接打开该 `.zip`，然后打开其中的 `levels` 文件夹。里面有一个以地图命名的文件夹，例如 `myawesomedriftmap2021`。请准确记下这个名称，并保持大小写和拼写一致。
3. 在管理面板中，**Map** 字段的格式类似 `/levels/MAPNAME/info.json`，其中 `MAPNAME` 很可能是类似 `gridmap_v2` 的内容。请把 `MAPNAME` 替换为第 2 步中得到的文件夹名称。它必须以 `/info.json` 结尾。对于这个例子：`/levels/myawesomedriftmap2021/info.json`。

有人加入时，地图会自动下载并正常使用。

如果不起作用，请在单人模式的 BeamNG.drive 中安装该地图并进入它。按 `~`（波浪号）键打开控制台。如果你使用的不是美式键盘，请在 **选项** > **控制** > **按键绑定** 的 **整体调试** 部分中找到 **开/关系统控制台** 操作。运行 `print(getMissionFilename())`，它会显示应使用的名称。

## 让玩家加入

玩家可以直接连接到服务器的公网 IP 地址和端口，两者都可以在管理面板上找到。

对于公开服务器，玩家也可以打开服务器列表，输入服务器名称并点击 **Connect**。这个名称就是你设置的名称。如果他们找不到，请让他们关闭搜索筛选，并将地图设置为 **Any**。

如果你或朋友收到“Connection Failed!”，请在启动器窗口中查看是否有 10060、10061 或 10030 之类的代码。它们意味着无法访问服务器，或者客户端上输入的 IP 地址和端口有误。目前尚不支持 IPv6。

## 仍然有问题？

在[论坛](https://forum.beammp.com)上发帖，或在 [Discord 服务器](https://discord.gg/beammp)的 `#support` 频道中提交一个 **Server Support Ticket**。
