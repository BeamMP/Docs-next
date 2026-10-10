---
description: "创建和管理你的 BeamMP 账号：登录、密码、双重验证、关联 Discord 和 Patreon 账号、更改用户名以及删除账号。"
---
# 你的 BeamMP 账号

本页面向玩家，介绍如何创建 BeamMP 账号、登录、保障账号安全，并在 [BeamMP Accounts](https://accounts.beammp.com) 管理你的账号。

同一个账号可以用来登录启动器、论坛和 Keymaster，服务器所有者在 Keymaster 中管理他们的 AuthKey。

## 创建账号

1. 打开 [BeamMP Accounts](https://accounts.beammp.com)，点击 **Register**。
2. 输入用户名、电子邮件地址和密码，然后再次输入密码以确认。
3. 完成验证挑战，然后点击 **Create Account**。注册即表示你同意[服务条款](https://beammp.com/terms)和[隐私政策](https://beammp.com/privacy)。
4. 打开 BeamMP 发来的电子邮件，点击其中的验证链接。在验证电子邮件地址之前，你无法登录。

用户名长度为 4 到 20 个字符，可以使用字母、数字和下划线。部分用户名和部分电子邮件服务商不被允许使用。

密码至少 8 个字符，并且必须包含大写字母、小写字母、数字和一个来自 `!@#$%^&*` 的特殊字符。

::: info
BeamMP 可能会在短时间内关闭新用户注册，例如在维护期间。已有账号仍然可以登录。
:::

## 登录

1. 打开 [BeamMP Accounts](https://accounts.beammp.com)。
2. 输入你的用户名或电子邮件地址，以及你的密码。
3. 完成验证挑战，然后点击 **Sign In**。
4. 如果你开启了双重验证，请输入验证器应用中的 6 位数字验证码，或输入你的某个恢复码。

在启动器中，你使用相同的用户名或电子邮件地址和密码登录。

### 我忘记了密码

1. 在登录页面，点击 **Forgot password?**。
2. 输入你的电子邮件地址，然后点击 **Send Reset Link**。
3. 打开电子邮件，按照其中的链接设置新密码。

### 我的电子邮件尚未验证

当你使用未验证的电子邮件地址登录时，BeamMP 会向你发送一个新的验证链接。登录后，主页会显示 **Email not verified** 以及一个 **Resend verification email** 按钮。

### 我的账号需要恢复

一些较早的账号必须先恢复才能登录。此时登录页面会告诉你。

1. 在登录页面，点击 **Start Recovery**。
2. 输入你的账号电子邮件地址，然后点击 **Recover Account**。
3. 按照 BeamMP 发给你的电子邮件中的说明操作。

如果你没有收到电子邮件，请检查垃圾邮件文件夹，并稍后再试。如果仍然无法登录，请在 [Discord](https://discord.gg/beammp) 上创建一个 **Account Support** 工单。

## 你的个人资料

打开右上角的用户菜单，点击 **Your Profile**。**General** 选项卡中有以下选项：

- 你头像旁边的 **Change** 用于上传头像。请使用不超过 5 MB 的 JPEG、PNG、WebP 或 GIF 图片。至少 256 × 256 像素的方形图片效果最好。
- **Bio** 是一段最多 280 个字符的简短文字。
- **Secondary email** 可以添加一个可选的备用地址。BeamMP 会要求你验证它。
- **Change email** 会向新地址发送一个验证链接。只有在你验证之后，你的电子邮件地址才会更改。

### 更改你的用户名 {#change-your-username}

用户名更改需要版主批准。只更改大小写的修改，例如把 `beammp` 改为 `BeamMP`，会立即生效。

1. 打开 **Your Profile**，进入 **Username change request**。
2. 输入你想要的用户名。你可以为版主附上一个理由。
3. 点击 **Submit Request**。

同一时间只能有一个等待处理的申请。结果会显示在你的 **Notifications** 中，**Latest request** 会显示状态。**Former usernames** 列出你以前使用过的名称。用户名的规则与创建账号时相同。

## 安全

打开 **Your Profile**，进入 **Security** 选项卡。

### 更改你的密码

输入你当前的密码，并两次输入新密码，然后点击 **Update Security**。如果你使用双重验证，还需要输入一个验证码。

### 双重验证

双重验证会在你登录 BeamMP Accounts 时，要求你输入验证器应用中的验证码。

1. 在 **Security** 选项卡中，点击 **Enable 2FA**。
2. 用验证器应用扫描二维码，或把密钥输入到应用中。
3. 输入应用中的验证码，然后点击 **Confirm**。
4. 保存 BeamMP 显示给你的 10 个恢复码，然后点击 **I've saved these**。BeamMP 不会再次显示它们。

如果你丢失了验证器应用，每个恢复码都可以使用一次。**Regenerate recovery codes** 会生成一组新的恢复码。**Disable 2FA** 会将其关闭。这两项操作都需要输入你的密码和一个当前有效的验证码。

### 活动会话

**Security** 选项卡列出了已登录你账号的设备。点击 **Revoke** 可以让某台设备退出登录，点击 **Revoke All** 则会让除当前设备以外的所有设备退出登录。

## 关联账号 {#linked-accounts}

打开 **Your Profile**，进入 **Linked Accounts**。点击某个服务旁边的 **Link**，并在打开的窗口中完成登录。点击 **Unlink** 可以随时解除关联。

- **Discord** 会把你旧的服务器密钥转移到你的账号上。它还能让 BeamMP 为你发放 Discord 服务器助力带来的额外服务器密钥。
- **Patreon** 会连接你的 Patreon 会员资格，这样 BeamMP 就会为你发放支持者福利。一个 Patreon 账号只能关联一个 BeamMP 账号。

关于抢先体验和 Patreon 福利，请参阅[玩家常见问题](/zh/players/faq)。

## 你的设置

打开右上角的用户菜单，点击 **Settings**。

- **Language** 和 **Timezone** 会更改 BeamMP Accounts 显示文字和时间的方式。**Auto Detect** 会使用你浏览器的时区。
- **Primary Group** 用来选择你的哪个群组（例如 Early Access）决定 BeamMP 在游戏中为你显示的角色。**Leave** 会把你从某个群组中移除。
- **Download Data Export** 会以 JSON 文件的形式提供你账号的个人数据。
- **Request Account Deletion** 会向你的主电子邮件地址发送一个确认链接。只有在你打开该链接之后，你的账号才会被删除。

::: danger
删除账号是永久性的。它会删除你的个人资料、你的 Patreon 和 Discord 关联以及你的服务器密钥，并且无法撤销。
:::

## 主页和通知

**Home** 页面会显示你的账号 ID、你的时区以及你最近加入的服务器。如果你是抢先体验支持者，页面上也会注明。

**Notifications** 页面列出来自 BeamMP 的消息，例如用户名更改申请或封禁申诉的结果。它还包含你的通知设置：用于安全警报、产品更新和偶尔营销内容的电子邮件通知，以及应用内的通知弹窗。

如果你的账号被封禁，请参阅[封禁与申诉](/zh/players/suspensions-and-appeals)。
