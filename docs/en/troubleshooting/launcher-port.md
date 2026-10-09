---
description: "Change the BeamMP Launcher port by hand when the Launcher is not connecting to the game: set the port in BeamNG's options and in launcher.cfg."
---
# Changing the Launcher Port

The Launcher is not connecting to the game? This guide shows how to change the Launcher port by hand. The port must be the same in the game and in the Launcher.

1. Start BeamNG.drive.
2. In the main menu, go to **Options**, then **Multiplayer**.
3. Turn on **Show advanced options**.
4. Scroll all the way down.
5. In **Launcher port**, change the number to something else, for example `4567`.
6. Close BeamNG.drive.
7. Right-click the BeamMP Launcher shortcut and choose **Open file location**.
8. Open `launcher.cfg` in a text editor.
9. Change the number in `"Port": 4444,` to the port you set in the game, in this example `4567`.
10. Save the file and close the editor.
11. Start the Launcher.

If it still does not connect, try another port. Any number from about 2000 to 65535 is a valid port.

## Still facing issues?

Create a support ticket on our [Discord server](https://discord.gg/BeamMP).
