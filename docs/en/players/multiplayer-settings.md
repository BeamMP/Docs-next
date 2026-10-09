---
description: "Every BeamMP multiplayer setting explained: general, the event queue, the default unicycle, blobs, nametags and the Launcher port."
---
# Multiplayer Settings

These are the settings on BeamMP's multiplayer settings page. Each is a collapsed entry: open it to see what it does when it is on and when it is off. If you are new, start with [First-Time Multiplayer Settings](/en/get-started/multiplayer-settings-quickstart).

## General

::: details Show advanced options
If enabled, you will see all multiplayer settings
If disabled, you will see only basic multiplayer settings
:::

::: details Enable config cloning protection
If enabled, your spawned vehicle config will be protected from other players saving it

If disabled, your spawned vehicle config can be saved by other players
:::

:::: details Disable pausing caused by instabilities
If enabled, physics instabilities will not cause your game to pause

If disabled, physics instabilities will cause your game to pause

::: note
It's advised to leave disabled, since repeated instabilities can cause the game to crash
:::
::::

::: details Use simplified vehicles when available
If enabled, the game will replace vehicles of other players with their simplified versions (from AI traffic) if available

If disabled, the game will use the intended vehicle models
:::

:::: details New chat menu
If enabled, the ingame chat will be displayed in an [IMGUI](https://github.com/ocornut/imgui) window, that for example can be dragged out of the game onto another monitor

If disabled, the ingame chat will be displayed in the UI app

::: note
Dragging IMGUI windows out of the main game window can cause performance issues, as well as trick screen recording software into recording the chat window instead of the main game window
:::
::::

::: details Enable vehicle position smoothing
If enabled, BeamMP will use an algorithm to smooth vehicle position updates to regular intervals. Can be beneficial between players with high ping or when a connection experiences a high packet drop rate

If disabled, BeamMP will update vehicle locations as they are received
:::

::: details Skip the mod security warning popups
If enabled, the mod security popup will not be shown when trying to connect to a server with mods

If disabled, the mod security popup will be shown whenever you connect to a server with mods
:::

::: details Enable player vehicle update/edit queuing
If enabled, other players' vehicle spawns and edits will be put into a queue. See the [Event queue](#event-queue) section for details

If disabled, other players' vehicle spawns and edits will be loaded by the game instantly
:::

::: details Enable automatic part sync
If enabled, your vehicles parts will automatically be synced to other players after a few seconds

If disabled, you need to click the part sync button in the part picker in order to send a sync out to other players
:::

::: details Disable switching to other players' vehicles
If enabled, tabbing through vehicles will skip other players' vehicles

If disabled, tabbing through vehicles will cycle over every spawned vehicle
:::

:::: details Fade out vehicles as they get closer
If enabled, other vehicles will fade out as they get closer

If disabled, other vehicles will stay fully visible regardless of distance

::: note
This only affects the visible 3d mesh of a vehicle, not its physics node-beam-mesh. In order to also disable physics, you need to enable `Simplified collision physics` in the Gameplay settings
:::
::::

::: details Show the player IDs
If enabled, the ingame playerlist will have an additional row showing each players ID. Useful for development or moderation

If disabled, the ingame playerlist will only show the rows for playername and ping
:::

::: details Allow the serverlist to refresh ingame
If enabled, the serverlist will update in regular intervals while playing. This can cause lag spikes

If disabled, the serverlist will only update once you open the main menu
:::

## Event queue

::: details Highlight queued players
If enabled, players with a queued event will be highlighted in the ingame playerlist

If disabled, players will not be individually highlighted
:::

::: details Apply vehicle changes with
If set to `Left mouse button`, clicking on a player's name in the playerlist using the left mouse button will load the queued events. Clicking with the right mouse button will spectate said player

If set to `Right mouse button`, clicking on a player's name in the playerlist using the right mouse button will load the queued events. Clicking with the left mouse button will spectate said player
:::

::: details Automatically apply queued vehicle changes
If enabled, the queued events will be automatically loaded once you've been going under the speed threshold for the amount of time set as the timeout

If disabled, the queued events will only load manually, by clicking on either the `Events` button at the top of the screen or on a player's name in the playerlist
:::

::: details Queue apply speed threshold
This setting defines the speed threshold of the automatic event queue loading. Your vehicle has to be slower than this for longer than `Queue apply timeout` in order to load the queued events
:::

::: details Queue apply timeout
This setting defines the time delay of the automatic event queue loading. Your vehicle has to be slower than `Queue apply speed threshold` for this time in order to load the queued events
:::

::: details Skip queue if spectating others
If enabled, an event will instantly load if you are spectating another player

If disabled, an event will be queued just like it would when focused on your own vehicle
:::

::: details Don't queue Unicycles (Snowmen/Beamlings)
If enabled, an event concerning a snowmen/beamling will be loaded instantly

If disabled, snowmen/beamlings will be queued just like other vehicles
:::

## Default unicycle

::: details Default Unicycle config
This setting defines the unicycle variant to be loaded by default. You can choose between premade configs and your own should you have saved custom unicycle configs
:::

::: details Automatically save your last used Unicycle
If enabled, your last used unicycle will be automatically saved and reloaded once you spawn it again

If disabled, your default unicycle config will spawn every time
:::

## Blobs

::: details Enable blobs for unspawned vehicles
If enabled, you will see a placeholder orb, or blob, in place of an unspawned vehicle

If disabled, an unspawned vehicle will be invisible
:::

:::: details Tune colors
::: details Visible
If enabled, a blob will be drawn, using the color below

If disabled, no blob will be drawn for the specified function
:::

::: details RGB HEX values
Queued vehicle: The color a blob will use if a vehicle is queued for spawning. Standard value #FF6400

Illegal vehicle: The color a blob will use if a vehicle is illegal, for example through a mod that was sideloaded. Standard value #000000

Deleted vehicle: The color a blob will use if a vehicle was deleted by the user. Standard value #333333
:::
::::

## Nametags

::: details Hide player nametags
If enabled, player nametags will not be drawn

If disabled, player nametags will be drawn according to their vehicles relative position
:::

::: details Show distance from other players
If enabled, the nametag will be prepended by the distance to the respective vehicle

If disabled, no additional distance will be shown in the nametag
:::

::: details Fade nametags in/out
If enabled, a nametag will be faded in/out according to `Fade distance` and `Invert nametag fade direction`

If disabled, a nametag will be drawn at standard opacity regardless of distance to the respective vehicle
:::

:::: details Fade distance/Invert nametag fade direction
::: details Fade out
Nametags are getting less visible the further away a player is

`Fade distance` defines the distance at which a nametag will be drawn at minimal opacity
:::

::: details Fade in
Nametags are getting more visible the further away a player is

`Fade distance` defines the distance at which a nametag will be drawn at maximal opacity
:::
::::

::: details Don't fully hide nametags
If enabled, a nametag can not get fully invisible, it will retain a minimal opacity regardless of distance

If disabled, nametags can get fully invisible
:::

::: details Shorten nametag and role tags
If enabled, `Nametag length limit` will truncate nametags and roles to the set limit of characters

If disabled, nametag and role tags will be shown at full length
:::

::: details Show spectators' nametag under vehicle nametags
If enabled, a spectator's name will be added underneath a player's nametag

If disabled, no spectator names will be added to nametags
:::

::: details Same color for spectator nametags
If enabled, a spectator's name will always be surrounded by a grey background

If disabled, a spectator's name will be surrounded by a colored background, reflecting the spectators role
:::

## Other settings

:::: details Show network activity in the console
If enabled, the BeamMP network activity will be shown in the console

If disabled, no further network activity will be shown in the console

::: danger
Be careful with this setting, since all the console output gets also written into the log files

They can grow by hundreds of MB in minutes with this setting enabled
:::
::::

:::: details Launcher port
This setting defines the port used for communicating with the launcher

Should only be changed if the standard port 4444 can not be used

Don't forget to also change it on the launcher side, by modifying `launcher.cfg`

::: tip
The port specified is only the first of two, the second port being used is directly following, set port + 1

The first port carries core network packets, the second game network packets, both over TCP
:::
::::