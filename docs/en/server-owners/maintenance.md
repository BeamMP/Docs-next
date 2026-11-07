---
description: "Look after a running BeamMP server: read the server log file, update the server on Windows or Linux, and check for new releases."
---
# Server Maintenance

How to look after a BeamMP server that is already running: the log file, and updates. For the settings in `ServerConfig.toml`, see [Server Configuration](/en/server-owners/configuration).

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

## Updating the server {#updating-the-server}

Update the server whenever a new version is released. Updates fix bugs and improve stability and security.

New versions are announced in the updates channel on the [Discord server](https://discord.gg/beammp), on the [forum](https://forum.beammp.com), and on the [GitHub releases page](https://github.com/BeamMP/BeamMP-Server/releases).

### With a hosting company

The hosting company updates the server. The steps below usually do not work there. If your server stays on an old version, contact the company.

### On Windows

1. Stop the server.
2. Download the Windows server from [beammp.com](https://beammp.com). You get a new `BeamMP-Server.exe`.
3. Move the new `BeamMP-Server.exe` into your server's folder, the one with `ServerConfig.toml`, and replace the old file.
4. Start the server.

### On Linux

1. Stop the server.
2. Download the file for your distribution and processor from the [latest release page](https://github.com/BeamMP/BeamMP-Server/releases/latest), as when you [installed the server](/en/server-owners/host-a-server#install-the-server).
3. Move it into your server's folder, the one with `ServerConfig.toml`, and replace the old file.
4. Make it executable, using the name of the file: `chmod +x BeamMP-Server.debian.12.x86_64`.
5. Start the server.

If you built the server from source, update the source, run `git submodule update --init --recursive`, and build again.

### Update messages

The server does not update itself. It checks for a newer version when it starts, and prints a message if there is one. It prints the message again at the interval `UpdateReminderTime` sets, unless `ImScaredOfUpdates` is `true`, which is the default. Both settings are in [Server Configuration](/en/server-owners/configuration#the-misc-section). A hosting provider can replace the message: see the provider settings in the [Server Manual](/en/server-owners/manual#provider-settings).

To check for a new version from a script, compare the server's version with the release tags that the GitHub API returns from `https://api.github.com/repos/BeamMP/BeamMP-Server/git/refs/tags`.
