---
description: "Change the BeamMP Launcher port by hand when the Launcher is not connecting to the game: set the port in BeamNG's options and in Launcher.cfg."
---
# Changing the Launcher Port

The Launcher is not connecting to the game? This guide shows how to change the Launcher port by hand. The port must be the same in the game and in the Launcher.

The default port is `4444`. The Launcher uses this port and the next one, `4445`, on your own computer. Both use TCP, and both must be free. If another program uses one of them, the Launcher shows `bind failed with error`, as listed in [Error Codes](/en/troubleshooting/error-codes).

1. Start BeamNG.drive.
2. In the main menu, go to **Options**, then **BeamMP**.
3. Open the **Advanced** group.
4. In **Launcher port**, change the number to something else, for example `4567`.
5. Close BeamNG.drive.
6. Right-click the BeamMP Launcher shortcut and choose **Open file location**.
7. Open `Launcher.cfg` in a text editor.
8. Change the number in `"Port": 4444,` to the port you set in the game, in this example `4567`.
9. Save the file and close the editor. Keep the file valid JSON: if the Launcher cannot read it, it shows `Config failed to parse make sure it's valid JSON!` and closes.
10. Start the Launcher.

If it still does not connect, try another port. Use a number from 1024 to 65534, because the Launcher also uses the next number.

::: tip
You can set the port without editing `Launcher.cfg`. Start the Launcher with `--port 4567`. The command-line option replaces the value in `Launcher.cfg`. The other options are in [Development Environment Setup](/en/developers/dev-environment-setup#turn-on-dev-mode-in-the-launcher).
:::

## Still facing issues?

Create a support ticket on our [Discord server](https://discord.gg/BeamMP).
