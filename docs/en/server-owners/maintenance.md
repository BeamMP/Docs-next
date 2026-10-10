---
description: "Look after a running BeamMP server: read the server log file, update the server on Windows or Linux, and check for new releases."
---
# Server Maintenance

How to look after a BeamMP server that is already running: the log file, and updating. For the settings in `ServerConfig.toml`, see [Server Configuration](/en/server-owners/configuration).

## The server log file

This file will be generated when the server runs. It's a mirror of the messages you see in the console when you run the server. The file is called `Server.log`. When the server starts, it renames the log of the previous run to `Server.old.log`, replacing the older `Server.old.log`. You should attach this file every time you need support from our support staff, and it will never show your AuthKey, so you can usually send it without modifications.

The format is as follows ($ prefix means “variable”, explained below):

```
[$DATE $TIME] $CONTEXT [$LOG_LEVEL] $MESSAGE
```

Where:

- `$DATE` is the date of the message as day/month/year, for example 21/07/21
- `$TIME` is the time of the message, for example 11:05:23. In Debug mode it also shows milliseconds, for example 11:05:23.142
- `$CONTEXT` (only visible if in Debug mode and mostly relevant to developers) is the context of the message, which is either:
	- `(Player ID) “Player Name”`, where the Player's ID is useful for moderation
	- A short name such as “HeartbeatThread”
- `$LOG_LEVEL` is one of the levels of importance of a message:
	- `DEBUG`: Only visible in Debug mode, usually spammy and only important to developers
	- `EVENT`: Only visible in Debug mode, a Lua event that the server triggered
	- `INFO`: General information
	- `LUA`: Message from a Lua plugin
	- `LUA WARN` and `LUA ERROR`: A warning or an error from the Lua plugin system, such as an error in a plugin's code
	- `WARN`: Describes something that isn't supposed to happen, usually
	- `ERROR`: Something went very wrong, or was very unexpected
- `$MESSAGE` the message itself, usually something that you should pay attention to and understand. In some cases this might be cryptic, but the general rule is that, as long as nothing is visibly wrong with the server and there are no ERRORs, all is good.

## Updating the server

### Why to update

Whenever a new update is released, you're advised to update your server. Usually this involves bug fixes, stability improvements and security improvements, next to the general new features etc. that are introduced.

To receive news about updates when they come out, either follow the Discord server's “update” channel, look out for it on the forums, or look at / ask the [GitHub releases page](https://github.com/BeamMP/BeamMP-Server/releases).

### How to update

#### If you are using a BeamMP partnered hosting provider

If you are using a BeamMP partnered hosting provider, the instructions below likely won't work. We recommend waiting for more details from your hosting provider, or contacting them for assistance.

#### Managing the server yourself

The server is updated by replacing the old executable with the new one. If you are unsure how to do this, there are step-by-step instructions for Windows and Linux below.

If you built from source, you just rebuild. Make sure to run `git submodule update --init --recursive` before you rebuild.

#### On Windows

1. Ensure you have installed the [Visual C++ Redistributables](https://aka.ms/vs/17/release/vc_redist.x64.exe) in order to run the server.
2. Go to [BeamMP.com](https://beammp.com/) and click the “Download Server” button.
3. Once downloaded, you should see one file called `BeamMP-Server.exe`. We will call this one the “new executable”.
4. Go to the folder where your current `BeamMP-Server.exe` executable is located (same folder where your `ServerConfig.toml` is, usually). We will call this one the “old executable”.
5. Replace the old executable with the new executable (for example by copying or moving the new executable into the folder).

#### On Linux

1. Go to [BeamMP.com](https://beammp.com/) and click the “Download Server” button, you will be redirected to the server's Github release page.
2. Download the file for your distribution and processor type. Its name looks like `BeamMP-Server.debian.12.x86_64`. Do not download the `debuginfo` files. For simplicity, it will now be called `BeamMP-Server-xxx` from now on, where `xxx` denotes the version for the distro you're using.
3. Once downloaded, you should see one file called `BeamMP-Server-xxx` depending on the version you've downloaded. We will call this one the “new executable”.
4. Go to the folder where your current `BeamMP-Server-xxx` executable is located (same folder where your `ServerConfig.toml` is, usually). We will call this one the “old executable”.
5. Replace the old executable with the new executable (for example by copying or moving the new executable into the folder).
6. Open a terminal in that folder where you just replaced the executable, and run `sudo chmod +x BeamMP-Server-xxx`. This will make sure the server can be run.

### Update messages

The server does not update itself. It checks for a newer version when it starts, and prints a message if there is one. It prints the message again at the interval `UpdateReminderTime` sets, unless `ImScaredOfUpdates` is `true`, which is the default. Both settings are in [Server Configuration](/en/server-owners/configuration#the-misc-section). A hosting provider can replace the message: see the provider settings in the [Server Manual](/en/server-owners/manual#provider-settings).

To check for a new version from a script, ask the GitHub API for the latest release by checking the server's version against the tags. You can get that by GET'ing from `https://api.github.com/repos/BeamMP/BeamMP-Server/git/refs/tags`.
