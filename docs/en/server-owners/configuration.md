---
description: "Every ServerConfig.toml setting for a BeamMP server, with its default and what it does, and the paths of the stock maps."
---
# Server Configuration

This page is the reference for the settings of a BeamMP server, and lists the paths of the stock maps. To install a server, see [Host a Server](/en/server-owners/host-a-server). To add colours and tags to your server's listing, see [Server Customization](/en/server-owners/server-customization).

## The ServerConfig file

The server config, which is a file called `ServerConfig.toml`, uses the [TOML format](https://toml.io/en/).

::: info Old config file
The old server config file was called `Server.cfg`. It is no longer used, and the server warns if it is still there. The two formats are **not** compatible.
:::

The config has two sections, `[General]` and `[Misc]`. The defaults are those of server version 3.9.4.

### The `[General]` section

| Key | Default | Value | What it does |
|---|---|---|---|
| Port | `30814` | 1024-65535 | The networking port on which the server will be reachable. The server uses it for both TCP and UDP. (Must be unique and not be used by another service on the same host). |
| AuthKey | empty | AuthKey format `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx` where all x's are alphanumeric characters (numbers and letters) | Identifies a public server to the BeamMP backend. The server does not start while it is empty, and warns at startup if the key is not 36 characters long. See [Get an AuthKey](/en/server-owners/authkey). |
| AllowGuests | `true` | true/false | Whether guests are allowed to join the server. When disabled (`false`), a guest who tries to join is refused. |
| LogChat | `true` | true/false | When enabled (true), chat messages are logged in the console and in the `Server.log` file. |
| Debug | `false` | true/false | When enabled (true), will show more messages in the log and provide more information. Enable this if you run into issues. Enabling this will drastically increase the size of the log file. |
| IP | `"::"` | A local IP address of one of the network interfaces of the host | The server binds to this IP address. It is **not** your public IP. Use it if your machine has several network interfaces. You do not need to change it for the server to work. The default `"::"` accepts connections on all interfaces. |
| Private | `true` | true/false | When enabled (true), your server will not be shown in the server list. Anyone with the correct IP and port can still connect. |
| InformationPacket | `true` | true/false | When enabled (true), the server is going to allow unauthenticated clients to get the same info as on the server listing but directly via the server. |
| Name | `"BeamMP Server"` | Any "text" | Shown as the name of your server in the server list. To add colours and styles, see [Server Customization](/en/server-owners/server-customization#format-the-name-and-description). |
| Tags | `"Freeroam"` | Tags from the [list of tags](/en/server-owners/server-customization#add-tags), separated by commas | Lets players find your server by type, such as `Racing` or `Drift`. |
| MaxCars | `1` | Any number ≥ 1 | The maximum number of cars per player. Any additional cars a player tries to spawn will be deleted instantly. The unicycle (walking) does not count. |
| MaxPlayers | `8` | Any Number ≥ 1 | The maximum amount of players per server. This does not affect vehicle count. When the server is full, a joining player is refused with "Server full!", unless a plugin lets them in (see `onPlayerAuth` in the [scripting reference](/en/developers/beammp-scripting/server/latest#onplayerauth)). |
| Map | `"/levels/gridmap_v2/info.json"` | A valid map location, such as `/levels/gridmap_v2/info.json` | The map your server will host. It must be a [stock map](#stock-map-paths) or a [map mod](/en/server-owners/mods#maps) on the server. |
| Description | `"BeamMP Default Description"` | Any "text" | Shown as the description of the server in the server list, if the server is public. To add colours and styles, see [Server Customization](/en/server-owners/server-customization#format-the-name-and-description). |
| ResourceFolder | `"Resources"` | A valid folder location, such as "D:\Server\BeamMP\Resources" | Useful to store the server and the resource folder separately. |

### The `[Misc]` section

| Key | Default | Value | What it does |
|---|---|---|---|
| ImScaredOfUpdates | `true` | true/false | When enabled (`true`), hides the periodic message that tells you a new server version is out. The server does not update itself: see [Server Maintenance](/en/server-owners/maintenance#updating-the-server). |
| UpdateReminderTime | `"30s"` | A number with `s`, `min`, `h` or `d` appended, for example `30s` | How often the update reminder is printed in the terminal. `30d` is every 30 days, `0.5min` every half minute. |

::: warning The server rewrites this file
Every time it starts, the server writes `ServerConfig.toml` again with the current values of the `[General]` and `[Misc]` settings only. Comments you added and sections that plugins added, such as `[MyMod]`, are removed. Values set with [environment variables](/en/server-owners/manual#general-settings) are written to the file too, unless `BEAMMP_PROVIDER_DISABLE_CONFIG` is set.
:::

A hosting company's panel sets these values with its own fields, usually on a **Startup** tab, and overwrites changes you make to the file. See [Use a hosting company](/en/server-owners/host-a-server#use-a-hosting-company).

## Stock map paths {#stock-map-paths}

These maps come with BeamNG.drive. Set `Map` to one of these paths:

- `/levels/gridmap_v2/info.json`
- `/levels/johnson_valley/info.json`
- `/levels/automation_test_track/info.json`
- `/levels/east_coast_usa/info.json`
- `/levels/hirochi_raceway/info.json`
- `/levels/italy/info.json`
- `/levels/jungle_rock_island/info.json`
- `/levels/industrial/info.json`
- `/levels/small_island/info.json`
- `/levels/smallgrid/info.json`
- `/levels/utah/info.json`
- `/levels/west_coast_usa/info.json`
- `/levels/driver_training/info.json`
- `/levels/derby/info.json`
