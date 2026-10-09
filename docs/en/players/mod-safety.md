---
description: "Why local mods can stop BeamMP working, and four ways to fix it: deactivate mods, start a new user folder, clear the Launcher cache, clean the content folder."
---
# Mod Safety

BeamMP can stop working when you have local mods installed. This page explains why, and how to fix it.

## Why do I have to deactivate or remove my mods?

In BeamMP, the Server you decide to connect to, provides the necessary mods. These get downloaded and activated automatically upon connecting.
Having local mods installed and active often leads to BeamMP not functioning properly, even if you have just one additional mod besides BeamMP.


There are four ways to fix problems caused by mods when you use BeamMP.

### Deactivate mods
Before joining any server, make sure you have no mods besides 'multiplayerbeammp' enabled.
If this method does not work, for example the game freezes / shows a blackscreen, or you still have issues, try the next fix.

### Create a new user folder

This gives the game a clean user folder.

1. Close BeamNG.drive.
2. Open the BeamNG launcher and click **Manage User Folder**, then **Open user folder**.
3. Rename the `current` folder, for example to `current_old`.

![The three steps: Manage User Folder in the BeamNG launcher, Open user folder, then renaming the current folder](../../assets/content/new-userfolder.png)

The game now creates a new, clean user folder the next time it starts.

::: warning My settings and configs are gone! How can I restore them?
If you have renamed the userfolder, you forced the game to create a new, clean userfolder. You may copy the 'settings' and 'vehicles' folder from the folder you renamed (e.g. `current_old`) to the new folder it created.
Make sure BeamNG.Drive is closed and replace all elements in the location you want to copy the folders to. You should now have all configs and settings as they were before.
:::

::: warning Be careful when moving back files/folders to the new userfolder.
If you resolved any issues by renaming the userfolder, moving back the old files may cause any issues you had to possibly re-occur.
:::



After you are done, start BeamNG.Drive via the BeamMP-Launcher and you should have 'multiplayerbeammp' as your only enabled mod available in the repository as well as the button on the Main Menu to enter BeamMP.
If you still have issues joining modded server, they likely provide broken/outdated mods.

### Clear the Launcher cache
To clean up cached mods from the BeamMP directories, go to the installation location of your BeamMP-Launcher. By default, the path would be 'C:\Users\AppData\BeamMP-Launcher\'. In there, you will find a 'Resources' folder.
Delete the folder to delete all cached mods. This can be helpful if you need more space on your disk or want to clean out oudated BeamNG mods.

### Remove mods from the content folder
If you have placed mods in the content folder, you should remove them.
To access the Beamng.drive\content\ folder and clean the folder of any mods, open the installation location of BeamNG.drive.
Right click the `content` folder and delete it. Proceed to verify the game files via Steam or Epic Games. This is going to download the base files again.

::: quote DO_NOT_INSTALL_MODS_HERE.txt
Do NOT copy mods into this folder: it can lead to broken mods, slower installation of updates, a broken mod manager, broken Safe Mode and others.
:::