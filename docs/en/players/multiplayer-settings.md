---
description: "Every BeamMP multiplayer setting explained: general, the event queue, blobs, the user interface, nametags, players, advanced options and the chat window."
---
# Multiplayer Settings

These are the settings on the **BeamMP** page of the BeamNG.drive options, as in BeamMP 4.22 for BeamNG.drive 0.39. To open them, click **Options** and select **BeamMP**. Every setting is always visible: there is no switch that hides advanced settings.

Each setting below is a collapsed entry. Open it to see its default and what it does when it is on and when it is off. The headings follow the groups on the page: **General**, **Vehicle Update Queue**, **Blobs**, **User Interface**, **Players** and **Advanced**. If you are new, start with [First-Time Multiplayer Settings](/en/get-started/multiplayer-settings-quickstart).

## General

::: details Enable Config Cloning Protection
Default: off.

If enabled, other players cannot clone or save your vehicles. When they try, they see **Vehicle Clone Error** or **Vehicle Save Error**. Changing the setting also updates the vehicles you have already spawned.

If disabled, other players can clone and save your vehicles.
:::

::: details Disable switching to other players vehicles
Default: off.

If enabled, switching between vehicles skips other players' vehicles while you have a vehicle of your own.

If disabled, switching cycles through every spawned vehicle.

Other players' unicycles are always skipped, whatever this setting is.
:::

::: details Automatically save your last used Unicycle
Default: on.

If enabled, BeamMP saves your unicycle's config when you delete it, and uses that config the next time you spawn your unicycle.

If disabled, your unicycle's config is not saved when you delete it.
:::

## Event queue

In the game, this group is called **Vehicle Update Queue**. When another player spawns or changes a vehicle, BeamMP can hold the change in a queue instead of loading it at once, so a load does not interrupt your driving.

While changes wait, a message tells you how many, and the session bar at the top of the screen shows an **Events queued** button. The two numbers on the button are the waiting spawns and the waiting edits, in that order. The button appears only when something is queued. If you have no vehicle, queued changes load at once.

Queued changes load when:

- you click **Events queued** at the top of the screen.
- you press the key bound to **Queue Events**. Bind it in the **BeamMP** category of the controls settings.
- you click a player's name while **Playerlist left click action** is **Queue events**. This loads only that player's changes. **Queue events** in the player's right-click menu does the same.
- the automatic loading below starts.

::: details Enable player vehicle update/edit queuing
Default: on.

If enabled, other players' vehicle spawns and edits wait in the queue until one of the actions above loads them.

If disabled, other players' vehicle spawns and edits load at once.
:::

::: details Automatically apply queued vehicle changes
Default: on. Shown only while queuing is enabled.

If enabled, queued changes load once your vehicle has been at or below **Queue apply speed threshold** for the time set in **Queue apply timeout**.

If disabled, queued changes load only when you load them yourself.
:::

::: details Queue apply speed threshold
Default: 2 m/s. A slider from 0 to 10 m/s. Shown only while automatic loading is enabled.

Your vehicle has to be at or below this speed for the time in **Queue apply timeout** before queued changes load.
:::

::: details Queue apply timeout
Default: 3 s. A slider from 0 to 20 s. Shown only while automatic loading is enabled.

Your vehicle has to be at or below **Queue apply speed threshold** for this long before queued changes load.
:::

::: details Enable automatic part sync
Default: on.

If enabled, a change you make to your vehicle's parts is sent to other players about 15 seconds after your last change.

If disabled, your part changes are not sent automatically.
:::

::: details Skip queue if spectating others
Default: off.

If enabled, queued changes load at once while the vehicle you are in is not your own.

If disabled, queued changes wait in the queue, as they do when you drive your own vehicle.
:::

::: details Don't queue Unicycles (Snowmen/Beamlings)
Default: on.

If enabled, other players' unicycle spawns and edits load at once.

If disabled, unicycles are queued like other vehicles.
:::

## Blobs

A blob is a coloured sphere that stands in for a vehicle that has not spawned for you. It has one of four colours:

- The queued colour: the vehicle is waiting in the queue.
- The illegal colour: the vehicle cannot be spawned, because its mod is missing.
- The deleted colour: you deleted the vehicle. To bring it back, right-click its owner in the player list and select **Queue deleted vehicles**.
- Magenta: any other vehicle that has not spawned yet. You cannot change this colour.

::: details Enable blobs for unspawned vehicles
Default: on.

If enabled, you see a blob in place of each unspawned vehicle.

If disabled, an unspawned vehicle is invisible.
:::

::: details Queued vehicle
Default: shown, `#FF6400`.

The checkbox **Queued vehicle** turns the blob on or off for vehicles in the queue. The field **HEX color value (ex: #FF6400)** sets its colour.
:::

::: details Illegal vehicle
Default: shown, `#000000`.

The checkbox **Illegal vehicle** turns the blob on or off for vehicles that cannot be spawned. The field **HEX color value (ex: #FF6400)** sets its colour.
:::

::: details Deleted vehicle
Default: shown, `#333333`.

The checkbox **Deleted vehicle** turns the blob on or off for vehicles you deleted. The field **HEX color value (ex: #FF6400)** sets its colour.
:::

## User interface

::: details Skip the mod security warning popup
Default: off.

If enabled, the mod security warning is not shown when you connect to a server that has mods. The mods download without asking.

If disabled, the warning is shown each time you connect to a server that has mods. See [Mod Safety](/en/players/mod-safety#the-mod-security-warning).
:::

::: details Allow the serverlist to refresh ingame
Default: off.

If enabled, the server list can be refreshed while you are in a session. This can cause lag spikes.

If disabled, the server list keeps showing the list from before you joined until you leave the session.
:::

::: details HUD App Style
Default: **Old**. The choices are **Old** and **Redesign**.

This sets the look of the BeamMP HUD apps: the session bar, the player list and the chat.
:::

:::: details New chat menu
Default: off.

If enabled, the in-game chat is shown in an [ImGui](https://github.com/ocornut/imgui) window, which you can drag out of the game onto another monitor. See [The chat window](#the-chat-window).

If disabled, the in-game chat is shown in the **BeamMP Chat** HUD app.

::: warning
Dragging an ImGui window out of the main game window can cause performance problems, and can make screen recording software record the chat window instead of the game.
:::
::::

### Nametags

The other nametag settings are unavailable while **Hide player nametags** is on.

::: details Hide player nametags
Default: off.

If enabled, no nametags are drawn.

If disabled, each player's nametag is drawn above their vehicle. The **Player Nametags** key action in the controls settings hides and shows all nametags until you restart the game.
:::

::: details Show distance from other players
Default: on.

If enabled, a nametag ends with the distance to the vehicle when it is more than 10 m away. The distance uses the unit system of the game.

If disabled, a nametag does not show a distance.
:::

::: details Hide nametags behind objects
Default: off.

If enabled, objects such as buildings hide a nametag that is behind them.

If disabled, nametags are drawn over everything.
:::

::: details Shorten nametag and role tags
Default: off.

If enabled, long names are cut to **Nametag length limit**, and role tags use their short form, such as `[EA]` for `[Early Access]`.

If disabled, names and role tags are shown in full.
:::

::: details Nametag length limit
Default: 32. A slider from 0 to 50. Available while **Shorten nametag and role tags** is on.

This is the largest number of characters of a name that is shown. A name that is more than three characters over the limit is cut to the limit and ends in `...`.
:::

::: details Show spectators' nametag under vehicle nametags
Default: on.

If enabled, the names of the players who are spectating a vehicle are shown under its nametag.

If disabled, spectators are not shown.
:::

::: details Same color for spectator nametags
Default: off. Available while **Show spectators' nametag under vehicle nametags** is on.

If enabled, every spectator nametag has the same grey background.

If disabled, a spectator nametag has a background that reflects the spectator's role.
:::

::: details Fade nametags in/out
Default: off.

If enabled, a nametag fades with the distance to its vehicle, using **Fade distance**. **Invert nametag fade direction** sets which way it fades.

If disabled, a nametag is drawn at full opacity at any distance.
:::

::: details Fade distance
Default: 40 m. A slider from 0 to 1500 m. Available while **Fade nametags in/out** is on.

A nametag is fully visible next to the vehicle and fully transparent at this distance. With **Invert nametag fade direction** on, it is the other way round.
:::

::: details Don't fully hide nametags
Default: off. Available while **Fade nametags in/out** is on.

If enabled, a nametag keeps a minimum opacity of 30 percent, at any distance.

If disabled, a nametag can become fully transparent.
:::

::: details Invert nametag fade direction
Default: off. Available while **Fade nametags in/out** is on.

If enabled, nametags are transparent close to the vehicle and become more visible the further away it is.

If disabled, nametags are visible close to the vehicle and fade the further away it is.
:::

### Player list

::: details Show the player ID's
Default: on.

If enabled, the player list has an extra column with each player's ID. The ID is useful for server staff.

If disabled, the player list shows only the names and the ping.
:::

::: details Highlight queued players
Default: on.

If enabled, a player who has queued changes is highlighted in the player list.

If disabled, no player is highlighted.
:::

::: details Playerlist left click action
Default: **Queue events**.

This sets what a left click on a player's name in the player list does. The choices are:

- **Queue events**: loads the queued changes of that player.
- **Switch camera to**: spectates the player.
- **Open profile**: opens the player's forum profile.
- **Delete all vehicles**: deletes all of the player's vehicles in your game.
- **Queue deleted vehicles**: queues the player's vehicles that you deleted.
- **Copy name**: copies the player's name.

A right click on a name always opens a menu with all of these actions.
:::

## Players

::: details Show Player names on license plates
Default: on.

If enabled, the license plate of another player's vehicle shows that player's name.

If disabled, BeamMP does not change the license plate text.
:::

:::: details Fade out vehicles as they get closer
Default: off.

If enabled, other players' vehicles fade as they get closer. They are fully visible from 20 m away and fully transparent at your position. This works only while nametags are shown.

If disabled, other players' vehicles stay fully visible at any distance.

::: info
This changes only how the vehicle looks, not its physics. It is meant for use with collisions turned off. The game's own setting for that is in the **Gameplay** options.
:::
::::

::: details Use simplified vehicles when available
Default: off.

If enabled, other players' vehicles are replaced with the simplified traffic versions from BeamNG.drive, for the vehicles that have one. This lowers the accuracy of collisions and visuals and improves performance.

If disabled, the game uses the vehicle models the other player chose.
:::

## Advanced

::: details Enable vehicle position smoothing
Default: off.

If enabled, BeamMP smooths the position data of players with an unstable connection. This reduces vehicle warping and rubber banding.

If disabled, BeamMP updates vehicle positions as they arrive.
:::

:::: details Show network activity in the console
Default: off.

If enabled, the network activity of BeamMP is shown in the console.

If disabled, the console does not show it.

::: danger
The console output is also written to the log files. With this setting on, they can grow by hundreds of megabytes in minutes.
:::
::::

:::: details Launcher port
Default: 4444.

This is the port the game uses to talk to the Launcher. Change it only if port 4444 cannot be used. Set `Port` in `Launcher.cfg` to the same number.

::: tip
The port you enter is the first of two. The game uses the next port as well: with 4444, that is 4445. The first carries the core network packets and the second the game network packets.
:::
::::

## The chat window

When **New chat menu** is on, the chat is an ImGui window with its own settings. Click the gear icon in the window's title bar to open them. They have two tabs, each with **Reset to default** and **Save** buttons. The settings are stored in `settings/BeamMP/chat.json`.

::: details General tab
**Inactive fade**: default on. If enabled, the window fades out when you do not use it.

**Fade time**: default 2.5 s, at least 0.1 s. How long the window waits before it fades.

**Fade when collapsed**: default off. If enabled, the window also fades when it is collapsed.

**Show on message**: default on. If enabled, the window appears again when a message arrives.

**Keep active on Enter**: default on. If enabled, the cursor stays in the message box after you press `Enter`.
:::

::: details Theming tab
Sets the colours of the window: **Window Background**, **Button Background**, **Button Hovered**, **Button Active**, **Text Color**, **Primary Color** and **Secondary Color**.
:::

The **Bring to Front** and **Toggle Chat** key actions in the controls settings make the window appear again after it fades, and hide it.
