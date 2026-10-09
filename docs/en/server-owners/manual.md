---
description: "Reference for the BeamMP server: what it reads from its environment, the Resources folder, environment variables, command-line arguments and backend limits."
---
# Server Manual

This page is the reference for how the BeamMP server behaves. For setting one up, see [Host a Server](/en/server-owners/host-a-server). For the settings in `ServerConfig.toml`, see [Server Maintenance](/en/server-owners/maintenance).

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

Since server release v3.2.0, the server accepts environment variables that **override** the settings in `ServerConfig.toml`. Every setting in the `General` section has one. The setting names are in PascalCase. The variable is the name in ALL_CAPS, with an underscore where each new word starts, and the prefix `BEAMMP_`. For example, `MaxPlayers` becomes `MAX_PLAYERS`, and with the prefix `BEAMMP_MAX_PLAYERS`. These variables exist:

- `BEAMMP_DEBUG`
- `BEAMMP_PRIVATE`
- `BEAMMP_PORT`
- `BEAMMP_MAX_CARS`
- `BEAMMP_MAX_PLAYERS`
- `BEAMMP_MAP`
- `BEAMMP_NAME`
- `BEAMMP_DESCRIPTION`
- `BEAMMP_TAGS`
- `BEAMMP_RESOURCE_FOLDER`
- `BEAMMP_AUTH_KEY`
- `BEAMMP_LOG_CHAT`

For settings that are strings or numbers, the value is a string, for example `BEAMMP_NAME="Cool Server"`, `BEAMMP_NAME=Server1` or `BEAMMP_PORT=12345`.

For settings that are true or false (on or off), the value `true` or `1` means on. Any other value means off.

### Provider settings

These variables let hosting providers, and anyone with many servers, override provider-specific settings.

#### `BEAMMP_PROVIDER_PORT_ENV` (since v3.3.0)

When set to a non-empty string, it names another variable to read the port from, instead of `BEAMMP_PORT`. For example, Pterodactyl may expose the port as `SERVER_PORT`. You could set `BEAMMP_PORT=${SERVER_PORT}`, but it is simpler to set `BEAMMP_PROVIDER_PORT_ENV="SERVER_PORT"`, and the server reads its port from the `SERVER_PORT` variable.

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

## Command-line arguments

Run the server with `--help` to see them, for example `./BeamMP-Server --help`.

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
