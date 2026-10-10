---
description: "The mod security warning, why local mods can stop BeamMP working, and four fixes for problems caused by mods."
---
# Mod Safety

BeamMP servers can send mods to your game. This page explains the warning you see before that happens, why local mods can stop BeamMP working, and how to fix it.

## The mod security warning

When you connect to a server that has mods, BeamMP shows the **Server Mods Detected** window before anything downloads. It tells you that:

- the server's mods are downloaded and installed automatically.
- mods can contain code that runs on your PC, and that code could be harmful.
- you must trust the server owners before you continue, and you continue at your own risk.
- BeamMP is not responsible for the content a server sends.

Click **Download & Join** to download the mods and join. Click **Cancel & Return** to stay out of the server.

If you trust the servers you join, you can turn the warning off with **Skip the mod security warning popup**, as described in [Multiplayer Settings](/en/players/multiplayer-settings). A server without mods never shows the warning.

## Why do I have to deactivate or remove my mods?

In BeamMP, the server you connect to provides the necessary mods. They are downloaded and activated automatically when you connect, and removed from the game again when you leave.

During a session, BeamMP deactivates every mod that the server did not send. The exceptions are `multiplayerbeammp`, `beammp` and `translations`. Local mods can still cause problems, even if you have only one besides BeamMP, for example when they change game files. When you leave a server that sent mods, the game reloads its Lua.

There are four ways to fix problems caused by mods when you use BeamMP.

### Deactivate mods

Before joining any server, make sure you have no mods besides `multiplayerbeammp` enabled. If this does not work, for example the game freezes or shows a black screen, or you still have problems, try the next fix.

### Create a new user folder

This gives the game a clean user folder.

1. Close BeamNG.drive.
2. Open the BeamNG launcher and click **Manage User Folder**, then **Open user folder**.
3. Rename the `current` folder, for example to `current_old`.

![The three steps: Manage User Folder in the BeamNG launcher, Open user folder, then renaming the current folder](../../assets/content/new-userfolder.png)

The game now creates a new, clean user folder the next time it starts.

::: warning My settings and configs are gone! How can I restore them?
If you renamed the user folder, you forced the game to create a new, clean user folder. You can copy the `settings` and `vehicles` folders from the folder you renamed (for example `current_old`) to the new folder.
Make sure BeamNG.drive is closed, and replace all items in the folder you copy to. You should now have all configs and settings as they were before.
:::

::: warning Be careful when you move files back to the new user folder.
If renaming the user folder solved your problems, moving the old files back can bring the problems back.
:::

After you are done, start BeamNG.drive with the BeamMP Launcher. `multiplayerbeammp` should be the only active mod under **Repository** > **Mods Manager**, and the **More...** menu should have the **BeamMP** entry.
If you still have problems joining a server with mods, the server probably sends broken or outdated mods.

### Clear the Launcher cache

The Launcher keeps the mods it downloaded in a cache. To clear it, open the folder where the BeamMP Launcher is installed. The cache is the `Resources` folder in it. If `Launcher.cfg` has a `CachingDirectory` entry, the cache is in that folder instead.

Delete the folder to delete all cached mods. This helps if you need more space on your disk or want to clear out outdated mods. The Launcher downloads the mods again the next time you join a server that needs them.

### Remove mods from the content folder

If you put mods in the `content` folder, remove them. Open the installation folder of BeamNG.drive, right-click the `content` folder and delete it. Then verify the game files in Steam or Epic Games. This downloads the base files again.

::: quote DO_NOT_INSTALL_MODS_HERE.txt
Do NOT copy mods into this folder: it can lead to broken mods, slower installation of updates, a broken mod manager, broken Safe Mode and others.
:::
