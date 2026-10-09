---
description: "Reference for the BeamMP server: what it reads from its environment, the Resources folder, environment variables, command-line arguments and backend limits."
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

- `Server` holds folders, each with at least one `.lua` file. Each folder is a "plugin". `.lua` files in the top level of a plugin are hot-reloaded when they change.
- `Client` holds only `.zip` files. They are loaded when the server starts and are assumed not to change while it runs.

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

### Provider settings

These variables let hosting providers, and anyone with many servers, override provider-specific settings.

#### `BEAMMP_PROVIDER_PORT_ENV` (since v3.3.0)

When set to a non-empty string, it names another variable to read the port from, instead of `BEAMMP_PORT`. For example, Pterodactyl may expose the port as `SERVER_PORT`. You could set `BEAMMP_PORT=${SERVER_PORT}`, but it is simpler to set `BEAMMP_PROVIDER_PORT_ENV="SERVER_PORT"`, and the server reads its port from the `SERVER_PORT` variable.

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

#### `BEAMMP_MAX_CONCURRENT_CONNECTIONS` (since v3.9.2)

Sets the maximum number of connections the server handles at the same time. It is a whole number from 1 to 128, and the default is 10. A value out of range, or not a number, is ignored with a warning.

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

Type these in the server console:

| Command | What it does |
|---|---|
| `help` | Shows the commands |
| `exit` | Shuts the server down |
| `kick <name> [reason]` | Kicks a player, with an optional reason |
| `list` | Lists all players and information about them |
| `say <message>` | Sends the message to all players in chat |
| `lua [state id]` | Switches to Lua, optionally into the state with that id |
| `settings [command]` | Sets or gets server settings. Run `settings help` for more |
| `status` | Shows how the server is doing |
| `clear` | Clears the console window |
| `version` | Shows the server version |
| `protectmod <name> <value>` | Sets whether a mod is protected. The value is `true` or `false` |
| `reloadmods` | Reloads all mods from the `Resources/Client` folder |

## ServerConfig.toml

The server generates this file on first startup. The comments inside the file are the most up-to-date explanation of each setting.

## Working directory

The server's working directory, not the location of the server executable, decides where `ServerConfig.toml`, the log files and the `Resources` folder are generated.

## Limits

The BeamMP backend enforces these limits on servers:

- Name: 250 characters
- Description: 1000 characters
- Map: 100 characters
- Tags: 100 characters
