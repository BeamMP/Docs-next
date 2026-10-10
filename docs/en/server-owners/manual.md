---
description: "Reference for the BeamMP server: the Resources folder, environment variables, command-line arguments, console commands and backend limits."
---
# Server Manual

This page is the reference for how the BeamMP server behaves. For setting one up, see [Host a Server](/en/server-owners/host-a-server). For the settings in `ServerConfig.toml`, see [Server Configuration](/en/server-owners/configuration).

## What affects the server

The server is affected by the state of these external parameters:

- The `Resources` folder
- The environment (process environment variables)
- The command-line arguments
- The `ServerConfig.toml` file
- The working directory

## Resources folder

The server creates the `Resources` folder on startup, with `Client` and `Server` subfolders.

- `Server` holds folders, each with at least one `.lua` file. Each folder is a "plugin". The server loads the plugins in alphabetical order, ignoring case, and skips anything in `Server` that is not a folder. `.lua` files in the top level of a plugin are hot-reloaded when they change. To write plugins, see the [Server Scripting Reference](/en/developers/beammp-scripting/server/latest).
- `Client` holds `.zip` files, which players download when they join. The server reads them when it starts, and ignores any file that is not a `.zip` with a warning. To pick up added, changed or removed mods while the server runs, use the `reloadmods` [console command](#console-commands).

The server also keeps a file called `mods.json` in `Client`. It stores the SHA-256 hash of each mod and whether the mod is protected, so the server does not hash an unchanged mod again. The server rewrites the file as needed. Do not edit it.

## Environment variables

### General settings

Since server release v3.2.0, the server accepts environment variables that **override** the settings in `ServerConfig.toml`. Every setting has one. The setting names are in PascalCase. The variable is the name in ALL_CAPS, with an underscore where each new word starts, and the prefix `BEAMMP_`. For example, `MaxPlayers` becomes `MAX_PLAYERS`, and with the prefix `BEAMMP_MAX_PLAYERS`. These variables exist ("Since" is the first server release that reads each one):

| Variable | Setting | Since |
|---|---|---|
| `BEAMMP_DEBUG` | `Debug` | v3.2.0 |
| `BEAMMP_PRIVATE` | `Private` | v3.2.0 |
| `BEAMMP_PORT` | `Port` | v3.2.0 |
| `BEAMMP_MAX_CARS` | `MaxCars` | v3.2.0 |
| `BEAMMP_MAX_PLAYERS` | `MaxPlayers` | v3.2.0 |
| `BEAMMP_MAP` | `Map` | v3.2.0 |
| `BEAMMP_NAME` | `Name` | v3.2.0 |
| `BEAMMP_DESCRIPTION` | `Description` | v3.2.0 |
| `BEAMMP_TAGS` | `Tags` | v3.2.0 |
| `BEAMMP_RESOURCE_FOLDER` | `ResourceFolder` | v3.2.0 |
| `BEAMMP_AUTH_KEY` | `AuthKey` | v3.2.0 |
| `BEAMMP_LOG_CHAT` | `LogChat` | v3.2.0 |
| `BEAMMP_ALLOW_GUESTS` | `AllowGuests` | v3.5.0 |
| `BEAMMP_INFORMATION_PACKET` | `InformationPacket` | v3.7.0 |
| `BEAMMP_IM_SCARED_OF_UPDATES` | `ImScaredOfUpdates` (the `[Misc]` section) | v3.8.2 |
| `BEAMMP_UPDATE_REMINDER_TIME` | `UpdateReminderTime` (the `[Misc]` section) | v3.8.2 |
| `BEAMMP_IP` | `IP` | v3.8.3 |

For settings that are strings or numbers, the value is a string, for example `BEAMMP_NAME="Cool Server"`, `BEAMMP_NAME=Server1` or `BEAMMP_PORT=12345`.

For settings that are true or false (on or off), the value `true` or `1` means on. Any other value means off.

A variable that is empty or not set is ignored. The server writes the values it ends up using, including these, back to `ServerConfig.toml` when it starts, unless `BEAMMP_PROVIDER_DISABLE_CONFIG` is set.

### Provider settings

These variables let hosting providers, and anyone with many servers, override provider-specific settings.

#### `BEAMMP_PROVIDER_PORT_ENV` (v3.3.0 to v3.4.1, and since v3.7.2)

When set to a non-empty string, it names another variable to read the port from, instead of `BEAMMP_PORT`. Servers from v3.5.0 to v3.7.1 do not read it. For example, Pterodactyl may expose the port as `SERVER_PORT`. You could set `BEAMMP_PORT=${SERVER_PORT}`, but it is simpler to set `BEAMMP_PROVIDER_PORT_ENV="SERVER_PORT"`, and the server reads its port from the `SERVER_PORT` variable.

#### `BEAMMP_PROVIDER_IP_ENV` (since v3.8.4)

When set to a non-empty string, it names another variable to read the IP address from, instead of `BEAMMP_IP`. It works like `BEAMMP_PROVIDER_PORT_ENV`.

#### `BEAMMP_PROVIDER_DISABLE_CONFIG` (since v3.3.0)

If set to `1` or `true`, `ServerConfig.toml` is **not generated**, and is **not read** if it exists. You must set `BEAMMP_AUTH_KEY` for the server to work.

#### `BEAMMP_PROVIDER_UPDATE_MESSAGE` (since v3.2.2)

When set to a non-empty string, it replaces the whole update message, which by default starts "NEW VERSION IS OUT! Please update to the new…".

Your message **must** contain `{}` somewhere. The server replaces it with the new version number. For example:

```sh
BEAMMP_PROVIDER_UPDATE_MESSAGE="NEW VERSION of the BeamMP-Server has been released: {}! Please follow the update guide here: https://example.com/update-guide"
```

This gives an update message like:

```text
NEW VERSION of the BeamMP-Server has been released: v5.0.2! Please follow the update guide here: https://example.com/update-guide
```

Make it clear to users that they should update, and explain how.

#### `BEAMMP_PROVIDER_DISABLE_MP_SET` (since v3.9.2)

If set to `1` or `true`, Lua plugins cannot change server settings with `MP.Set`. A plugin that tries gets an error saying the call was blocked by your server provider.

#### `BEAMMP_MAX_CONCURRENT_CONNECTIONS` (since v3.9.4)

Sets the maximum number of connections the server accepts at the same time from one IP address. It is a whole number from 1 to 128, and the default is 10. A value out of range, or not a number, is ignored with a warning. The server also accepts at most 128 connections at the same time in total, which you cannot change. The `status` command shows both limits.

## Command-line arguments

Run the server with `--help` to see them: `./BeamMP-Server --help`. The arguments are:

| Argument | What it does |
|---|---|
| `--help` | Shows the help and exits |
| `--version` | Prints the server version and exits |
| `--port=1234` | Sets the TCP and UDP port the server listens on. It overrides the environment and `ServerConfig.toml` |
| `--config=/path/to/ServerConfig.toml` | The absolute or relative path to the server config file, including the file name. Put quotes around a path with spaces |
| `--working-directory=/path/to/folder` | Sets the server's working directory. Every path, including the one in `--config`, is relative to it |

For example, `BeamMP-Server --config=../MyWestCoastServerConfig.toml` runs the server with the config file one folder above it.

## Console commands

Type these in the server console. Press `Tab` to complete a command.

| Command | What it does |
|---|---|
| `help` | Shows the commands |
| `exit` | Shuts the server down |
| `kick <name> [reason]` | Kicks a player, with an optional reason. The name matches the start of a player's name, ignoring case. Without a reason, the player sees "Kicked by server console" |
| `list` | Lists all players, with their ID and number of cars |
| `say <message>` | Sends the message to all players in chat |
| `lua [state id]` | Switches to the Lua console, optionally into the state with that id. See [Debugging](/en/developers/beammp-scripting/server/latest#debugging) |
| `settings [command]` | Sets or gets server settings. Run `settings help` for more. See [Settings command](#settings-command) |
| `status` | Shows how the server is doing: players, cars, uptime, Lua states, event timers and handlers, the connection limits, and the state of each part of the server |
| `clear` | Clears the console window |
| `version` | Shows the platform, the server version, and the Lua and OpenSSL versions |
| `protectmod <name> <value>` | Sets whether a mod is protected. The name is the file name of the mod including `.zip`. The value is `true` or `false` |
| `reloadmods` | Reloads all mods from the `Resources/Client` folder |
| `nettest` | Asks the BeamMP server check service whether players can reach your server on its port, and prints the answer. `help` does not list it. Since v3.8.5 |

A plugin can add commands of its own with the `onConsoleInput` event. See [Custom commands](/en/developers/beammp-scripting/server/latest#custom-commands).

### Settings command

`settings` has four subcommands:

- `settings list` lists the settings and their values.
- `settings get <category> <setting>` prints one value, for example `settings get General MaxPlayers`.
- `settings set <category> <setting> <value>` changes one value, for example `settings set General MaxPlayers 12`. Put quotes around a value with spaces.
- `settings help` shows these subcommands.

A change lasts until the server stops. It is not written to `ServerConfig.toml`. You can change `Description`, `Tags`, `MaxPlayers`, `Name`, `Map`, `MaxCars`, `Debug`, `AllowGuests` and `InformationPacket` in `General`, and `ImScaredOfUpdates` and `UpdateReminderTime` in `Misc`. `Private`, `IP`, `Port`, `LogChat` and `ResourceFolder` can be read but not changed. `AuthKey` cannot be read or changed.

## ServerConfig.toml

The server generates this file on first startup. The comments inside the file explain each setting briefly, and the server writes the file again every time it starts. See [Server Configuration](/en/server-owners/configuration).

If `AuthKey` is empty, the server prints an error and closes after 10 seconds. This also happens if the file has an error in it, such as a missing quote.

## Working directory

The server's working directory, not the location of the server executable, decides where `ServerConfig.toml`, the log files and the `Resources` folder are generated.

## Limits

The BeamMP backend enforces these limits on servers:

- Name: 250 characters
- Description: 1000 characters
- Map: 100 characters
- Tags: 100 characters

The server itself enforces these:

- Launcher version: a player whose Launcher is older than 2.7.0 is refused, and sees a message that names the required version.
- Chat messages: a message longer than 500 bytes, or an empty one, is dropped.
- Connections: at most 10 at the same time from one IP address by default, and 128 in total. See `BEAMMP_MAX_CONCURRENT_CONNECTIONS`.
