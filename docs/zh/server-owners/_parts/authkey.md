## 获取 AuthKey {#get-an-authkey}

AuthKey 也称为“身份验证密钥”（Authentication Key），它能让**公开**服务器出现在服务器列表中。私人服务器也建议使用。

- 你拥有的密钥数量有限。一个密钥同一时间只能用于一个服务器，所以你不能用同一个密钥运行两个服务器。
- 你可以通过支持本项目来获得更多密钥。请参阅玩家常见问题中的[我如何获得抢先体验资格？](/zh/players/faq)。
- 你需要一个 BeamMP 账号。创建密钥不需要 Discord 账号。

::: warning
切勿与任何人分享你的 AuthKey，也不要给任何人看。请像对待密码一样对待它。
:::

1. 打开 [BeamMP Accounts](https://accounts.beammp.com) 并登录。如果你还没有账号，请按照[你的 BeamMP 账号](/zh/players/account)中的说明操作。
2. 点击页面顶部菜单中的 **Keymaster**。
3. 点击 **Create New Server Key**，然后点击 **Create Key**。新密钥会被添加到 **Your Server Keys** 列表中。
4. 在 **Your Server Keys** 中点击 **Show Keys**。每个密钥只显示开头 8 个字符和末尾 4 个字符，并附有创建日期。
5. 点击密钥旁边的复制图标。Keymaster 会复制完整的密钥。请保留它，下一步会用到。

密钥的格式类似 `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`。Keymaster 没有给密钥命名的字段，也没有删除密钥的按钮。你不使用的密钥仍然会计入你的额度。

### 你的密钥额度

**Your Server Keys** 会显示你已使用的密钥数量，例如 `1 / 2 keys used`，以及额外密钥的来源。默认情况下：

- 每个账号可以拥有 2 个密钥。
- Patreon 等级的价格每满 1 美元，就会增加一个密钥。请先在 BeamMP Accounts 中关联你的 Patreon 账号。参见[你的 BeamMP 账号](/zh/players/account#linked-accounts)。
- 加速（Boost）BeamMP Discord 服务器共计增加 5 个密钥，而不是每次加速增加 5 个。请先在 BeamMP Accounts 中关联你的 Discord 账号。加速可能需要最多一天才会显示出来。

达到额度上限后，**Create New Server Key** 不会再创建密钥，而是显示 **Key Limit Reached** 提示。

### 更换已被他人看到的密钥

如果其他人可能知道了你的密钥，请轮换（rotate）它。

1. 在 **Your Server Keys** 中，点击密钥旁边的轮换图标。
2. 点击 **Rotate Key**。旧密钥会立即失效，使用它的服务器会从服务器列表中消失。
3. 复制新密钥，并填入 `ServerConfig.toml` 的 `AuthKey` 设置中。
4. 重启服务器。

被工作人员封禁的密钥无法轮换。

### 将旧密钥迁移到 BeamMP Accounts

在 BeamMP Accounts 出现之前获得的密钥与你的 Discord 账号绑定。

1. 在 **Keymaster** 中找到 **Legacy Keys** 框。只有在有事可做时才会显示它。
2. 如果尚未关联 Discord，请点击 **Link Discord**，并使用曾拥有这些密钥的 Discord 账号登录。
3. 点击 **Migrate** 按钮（按钮上会写明密钥数量），然后点击 **Migrate Keys** 确认。每个密钥的值保持不变，因此你的服务器会继续在线，也无需对服务器做任何修改。

迁移后的密钥同样计入你的额度。如果它们使你超出额度，你仍会保留全部密钥，但在额度恢复到上限以内之前，无法创建新密钥。

Keymaster 还会在 **Your Online Servers** 下列出使用你的密钥在线的服务器，并显示其玩家数量和版本。
