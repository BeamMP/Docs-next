---
description: "Every ServerConfig.toml setting for a BeamMP server, the stock map paths, how to colour and format your server name, and the list of server tags."
---
# Server Configuration

The settings of a BeamMP server, how to name and tag it, and the stock map paths. To install a server, see [Host a Server](/en/server-owners/host-a-server). To read the log or update the server, see [Server Maintenance](/en/server-owners/maintenance).

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
| AuthKey | empty | AuthKey format `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx` where all x's are alphanumeric characters (numbers and letters) | Used to identify a public set server with the backend. The server warns at startup if the key is not 36 characters long. |
| AllowGuests | `true` | true/false | Whether guests are allowed to join the server. When disabled (`false`), a guest who tries to join is refused. |
| LogChat | `true` | true/false | When enabled (true), chat messages are logged in the console and in the `Server.log` file. |
| Debug | `false` | true/false | When enabled (true), will show more messages in the log and provide more information. Enable this if you run into issues. Enabling this will drastically increase the size of the log file. |
| IP | `"::"` | A local IP address of one of the network interfaces of the host | The server binds to this IP address. It is **not** your public IP. Use it if your machine has several network interfaces. You do not need to change it for the server to work. The default `"::"` accepts connections on all interfaces. |
| Private | `true` | true/false | When enabled (true), your server will not be shown in the server list. Anyone with the correct IP and port can still connect. |
| InformationPacket | `true` | true/false | When enabled (true), the server is going to allow unauthenticated clients to get the same info as on the server listing but directly via the server. |
| Name | `"BeamMP Server"` | Any "text" | Shown as the name / title of your server in the server list. You can use special characters to format this with colors and styles. |
| Tags | `"Freeroam"` | See list of allowed tags further below. | Tags for search e.g. Police, Racing etc... |
| MaxCars | `1` | Any number ≥ 1 | The maximum number of cars per player. Any additional cars a player tries to spawn will be deleted instantly. The unicycle (walking) does not count. |
| MaxPlayers | `8` | Any Number ≥ 1 | The maximum amount of players per server. This does not affect vehicle count. When the server is full, a joining player is refused with "Server full!", unless a plugin lets them in (see `onPlayerAuth` in the [scripting reference](/en/developers/beammp-scripting/server/latest#onplayerauth)). |
| Map | `"/levels/gridmap_v2/info.json"` | A valid map location, such as `/levels/gridmap_v2/info.json` | The map your server will host. Has to be installed either by default (a list can be found below) or as a server mod. |
| Description | `"BeamMP Default Description"` | Any "text" | Shown as the description of the server in the server list (if the server is public). You can use special characters to format this with colors and styles. |
| ResourceFolder | `"Resources"` | A valid folder location, such as "D:\Server\BeamMP\Resources" | Useful to store the server and the resource folder separately. |

### The `[Misc]` section

| Key | Default | Value | What it does |
|---|---|---|---|
| ImScaredOfUpdates | `true` | true/false | When enabled (`true`), hides the periodic message that tells you a new server version is out. The server does not update itself: see [Server Maintenance](/en/server-owners/maintenance#updating-the-server). |
| UpdateReminderTime | `"30s"` | A number with `s`, `min`, `h` or `d` appended, for example `30s` | How often the update reminder is printed in the terminal. `30d` is every 30 days, `0.5min` every half minute. |

::: warning The server rewrites this file
Every time it starts, the server writes `ServerConfig.toml` again with the current values of the `[General]` and `[Misc]` settings only. Comments you added and sections that plugins added, such as `[MyMod]`, are removed. Values set with [environment variables](/en/server-owners/manual#general-settings) are written to the file too, unless `BEAMMP_PROVIDER_DISABLE_CONFIG` is set.
:::

You **must** set the AuthKey yourself. It is empty by default. Fill in the AuthKey you got while [installing the server](/en/server-owners/host-a-server). Do not share it with anyone, and blur it fully in screenshots.

### All vanilla maps names

Here are all the stock maps:

- /levels/gridmap_v2/info.json
- /levels/johnson_valley/info.json
- /levels/automation_test_track/info.json
- /levels/east_coast_usa/info.json
- /levels/hirochi_raceway/info.json
- /levels/italy/info.json
- /levels/jungle_rock_island/info.json
- /levels/industrial/info.json
- /levels/small_island/info.json
- /levels/smallgrid/info.json
- /levels/utah/info.json
- /levels/west_coast_usa/info.json
- /levels/driver_training/info.json
- /levels/derby/info.json

### Customize the look of your server name

Use these special symbols before your text and it'll apply an effect to that text in the server list:

| Value | Description                 |
|:-----:|-----------------------------|
| `^r`  | Reset                       |
| `^p`  | Newline (descriptions only) |
| `^n`  | Underline                   |
| `^l`  | Bold                        |
| `^m`  | Strike-through              |
| `^o`  | Italic                      |
| `^0`  | Black                       |
| `^1`  | Blue                        |
| `^2`  | Green                       |
| `^3`  | Light blue                  |
| `^4`  | Red                         |
| `^5`  | Pink                        |
| `^6`  | Orange                      |
| `^7`  | Grey                        |
| `^8`  | Dark grey                   |
| `^9`  | Light purple                |
| `^a`  | Light green                 |
| `^b`  | Light blue                  |
| `^c`  | Dark orange                 |
| `^d`  | Light pink                  |
| `^e`  | Yellow                      |
| `^f`  | White                       |

### Customize your server tags

Tags can be used to allow people to search for a specific type of server. Your serverConfig.toml will generate with the freeroam tag `Tags = "Freeroam"`.

You can add multiple tags separated by comma `Tags = "Events,Offroad,lang:english"`, they are not case sensitive.

You can choose from the following list:

::: tabs

== Age/Content

- `Mature/18+`

== Gameplay Types

- `Freeroam`
- `Roleplay`
- `Economy`
- `Traffic`
- `Challenge`
- `Drift`

== Racing Categories

- `Racing`
- `Racing:NASCAR`
- `Racing:Track`
- `Racing:Drag`
- `Racing:Rally`
- `Touge`

== Off-Roading

- `Offroad`
- `Crawling`
- `Rally`
- `Dakar`

== Destruction Events

- `Derby`
- `Arena`

== Weather and Time Conditions

- `Snow/Ice`
- `Rain`
- `Night`
- `Weather`

== Gamemodes

- `Gamemode`
- `Gamemode:Racing`
- `Gamemode:Rally`
- `Gamemode:Drag`
- `Gamemode:Derby`
- `Gamemode:Infection`
- `Gamemode:Cops-Robbers`
- `Gamemode:Delivery`
- `Gamemode:Sumo`

== Community and Events

- `Scenarios`
- `Events`
- `Leaderboard`

== Mods

- `Modded`
- `Mod:BeamPaint`
- `Mod:BeamJoy`
- `Mod:CEI`

== Languages

- `Lang:English`
- `Lang:Russian`
- `Lang:French`
- `Lang:Spanish`
- `Lang:Portuguese`
- `Lang:German`
- `Lang:Polish`
- `Lang:Arabic`

== Other

- `Vanilla`
- `Moderated`

:::


Should a tag be missing from this list, you can submit a request for it to be added [here](https://forum.beammp.com/t/introducing-server-tags/1320081)
