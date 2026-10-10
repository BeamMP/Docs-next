## Get an AuthKey

The AuthKey, also called "Authentication Key", is what makes a **public** server appear in the server list. It is also recommended for private servers.

- You get a limited number of keys. One key works on one server at a time, so you cannot run two servers with the same key.
- You can get more keys by supporting the project. See [How do I get early access?](/en/players/faq) in the Player FAQ.
- You need a BeamMP account. You do not need a Discord account to create a key.

::: warning
Never share your AuthKey or show it to anyone. Treat it like a password.
:::

1. Open [BeamMP Accounts](https://accounts.beammp.com) and sign in. If you have no account yet, follow [Your BeamMP Account](/en/players/account).
2. Click **Keymaster** in the menu at the top of the page.
3. Click **Create New Server Key**, then click **Create Key**. The new key is added to the **Your Server Keys** list.
4. In **Your Server Keys**, click **Show Keys**. Each key is shortened to its first 8 and last 4 characters, with the date you created it.
5. Click the copy icon next to the key. Keymaster copies the whole key. Keep it for the next step.

A key looks like `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`. Keymaster has no field for a key name and no button to delete a key. A key you do not use still counts toward your limit.

### Your key limit

**Your Server Keys** shows how many keys you have used, such as `1 / 2 keys used`, and where any extra keys come from. By default:

- Every account can have 2 keys.
- A Patreon tier adds one key for each whole US$ of the tier's price. Link your Patreon account in BeamMP Accounts first. See [Your BeamMP Account](/en/players/account#linked-accounts).
- Boosting the BeamMP Discord server adds 5 keys in total, not 5 per boost. Link your Discord account in BeamMP Accounts first. It can take up to a day for a boost to show.

When you reach the limit, **Create New Server Key** shows a **Key Limit Reached** message instead of making a key.

### Replace a key that others have seen

If someone else may know your key, rotate it.

1. In **Your Server Keys**, click the rotate icon next to the key.
2. Click **Rotate Key**. The old key stops working at once, and the server using it leaves the server list.
3. Copy the new key and put it in the `AuthKey` setting of your `ServerConfig.toml`.
4. Restart the server.

A key that staff banned cannot be rotated.

### Move your old keys to BeamMP Accounts

Keys you got before BeamMP Accounts existed are tied to your Discord account.

1. In **Keymaster**, find the **Legacy Keys** box. It shows only while there is something to do.
2. If Discord is not linked, click **Link Discord** and sign in with the Discord account that owned the keys.
3. Click the **Migrate** button, which names the number of keys, and confirm with **Migrate Keys**. Each key keeps its value, so your servers stay online and you change nothing on them.

Migrated keys count toward your limit. If they take you over it, you keep them all, and you cannot create new keys until you are under the limit again.

Keymaster also lists the servers that are online with your keys under **Your Online Servers**, with their player count and version.
