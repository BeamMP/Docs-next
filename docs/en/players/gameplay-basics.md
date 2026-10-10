---
description: "What you see and can do in BeamMP: the server list, the session bar, the player list, nametags, chat, other players' vehicles, the event queue and unstable vehicles."
---
# Gameplay Basics

This page explains what is different about BeamNG.drive when you play on a BeamMP server. The settings behind each part are in [Multiplayer Settings](/en/players/multiplayer-settings).

## The server list

After you sign in, the BeamMP menu opens on the server list. The buttons on the left choose what the list shows:

- **Public Servers**: every server. The official servers are listed first.
- **Official Servers**, **Featured Servers** and **Partner Servers**: only servers with that status.
- **Favorites**: the servers you added with **Add Favorite**.
- **Recent**: the last 50 servers you connected to, newest first. **Clear Recents** empties the list.
- **Direct Connect**: connect to a server by its address.

To find a server:

- Type in the search box to match server names.
- Click a column heading (**Location**, **Title**, **Map** or **Players**) to sort. Click it again to reverse the order.
- Use **Search Filters** to narrow the list by player count (**Empty only**, **Not empty**, **Not full**, or a minimum and maximum with **Advanced Player Count**), **Total Mod Size**, tags, server versions, server locations and maps. With **Match all filters** on, a server must have every tag you select. **Reset Filters** clears them.
- Click **Refresh** to load the list again.

Click a server to see its details: the owner, map, description, tags, the players on it and its mods with their **Total Filesize:**. **Connect** joins the server. **Add Favorite** and **Remove Favorite** change your favorites.

In **Direct Connect**, enter the **Server IP** and **Server Port**, or click **Paste from Clipboard** to paste an address in the form `ip:port`. If you leave them empty, BeamMP uses `127.0.0.1` and port `30814`. **Connect** joins the server and **Save as Favorite** adds it to your favorites.

While you connect, **Connecting to server…** shows the progress, including each mod that downloads. Click **Cancel** to stop. If the server has mods, you first see the mod security warning, described in [Mod Safety](/en/players/mod-safety#the-mod-security-warning).

## The session bar

In a session, the **BeamMP Session** HUD app at the top of the screen shows the server name, the number of **Players**, your **Ping** in ms and a **Leave** button. **Leave** disconnects you and returns you to the main menu. The **Events queued** button appears when changes wait to load, as described in [The event queue](#the-event-queue).

The pause menu also has a **BeamMP** tab. **Player List** shows every player with their ping, and buttons to copy a name and open the player's profile. **Server Details** shows the server's information. The server address is hidden until you click **Reveal**.

If the server removes you, a message shows the reason, with **Return to menu** and **Continue offline**.

## The player list

The **BeamMP Player List** HUD app shows each player's name and ping. It is hidden until you click its arrow button (**<** or **>**), and the same button hides it again. **↔** and **↕** move the list sideways and up or down inside its frame. If **Show the player ID's** is on, it also has a column with each player's ID. A player with queued changes is highlighted when **Highlight queued players** is on.

A role tag follows a name when the player has a role, for example `[EA]`. The role tags are described under [Nametags](#nametags).

Clicking a name does the action you chose in **Playerlist left click action**. The default is **Queue events**. A right click on a name opens a menu with these actions:

- **Copy name**
- **Delete all vehicles**: deletes the player's vehicles in your game.
- **Queue events**
- **Switch camera to**: spectates the player.
- **Open profile**: opens the player's forum profile.
- **Queue deleted vehicles**: brings back that player's vehicles that you deleted.

Mods can add buttons of their own to this menu.

## Nametags

Each player has a nametag above their vehicle. It carries the role tag, and optionally the distance and the names of the players who are spectating the vehicle. You can hide nametags, fade them with distance, and show the distance. The **Player Nametags** key action hides and shows all of them.

The role of a player's BeamMP account sets the tag:

| Tag | Short tag |
|---|---|
| `[Early Access]` | `[EA]` |
| `[Contributor]` | `[CO]` |
| `[Content Creator]` | `[CC]` |
| `[Events Team]` | `[Events]` |
| `[Support]` | `[Staff]` |
| `[BeamMP Staff]` | `[Staff]` |
| `[Moderator]` | `[Mod]` |
| `[Admin]` | `[Adm]` |
| `[BeamMP Dev]` | `[Dev]` |
| `[BeamNG Developer]`, `[BeamNG Staff]`, `[BeamNG Affiliate]` | `[BNG]` |

Players without a role have no tag. A server can also give a player or a vehicle a tag of its own.

## Chat

Chat is in the **BeamMP Chat** HUD app by default. Type in the box and send with **Send**. A message can have up to 500 characters. Press `↑` in the box to bring back your last message. Messages fade after a few seconds, and appear again when you move the mouse over the chat. **↔** and **↕** move the chat.

With **New chat menu** on, chat is in a separate window that you can drag out of the game. See [The chat window](/en/players/multiplayer-settings#the-chat-window) for its settings.

## Other players' vehicles

- Other players' vehicles appear in your game, and their part changes are synced to you. Your own part changes are sent to other players automatically, about 15 seconds after your last change, when **Enable automatic part sync** is on.
- Switching vehicles can skip other players' vehicles. Turn on **Disable switching to other players vehicles** for that. Other players' unicycles are always skipped.
- If you switch from your unicycle to another player's vehicle, the camera goes to a passenger view.
- A vehicle that has not spawned for you yet shows as a coloured sphere, called a blob. See [Blobs](/en/players/multiplayer-settings#blobs).
- If a player spawns a vehicle that uses a mod you do not have, BeamMP skips it and shows a message. The vehicle stays as a blob.
- With **Show Player names on license plates** on, a license plate shows the name of the player who owns the vehicle.
- To protect your build, turn on **Enable Config Cloning Protection**. Other players then cannot clone or save your vehicle. They see **Vehicle Clone Error** or **Vehicle Save Error**.

## The event queue

When another player spawns or edits a vehicle, your game can queue the change instead of loading it at once, so a load does not interrupt your driving. A message tells you that a change is queued, and the **Events queued** button appears in the session bar. It shows the number of waiting spawns, then the number of waiting edits, for example `2|1`.

Queued changes load when you:

- click **Events queued**.
- press the key you bound to **Queue Events**.
- click the name of a player, or select **Queue events** in their menu. This loads only that player's changes.

They also load automatically when you have been driving slowly for long enough, and at once if you have no vehicle. See [the event queue settings](/en/players/multiplayer-settings#event-queue).

## Unstable vehicles

Physics instabilities do not pause the game in a session. BeamMP resets an unstable vehicle's physics instead. This applies to any vehicle in the session, yours or another player's.

If the same vehicle keeps going unstable, BeamMP switches it off for a moment and shows a warning, then switches it on again. A vehicle that keeps going unstable after that is deleted, and a message says so. To bring back another player's vehicle, right-click the player in the player list and select **Queue deleted vehicles**.

## Key actions

In the controls settings, the **BeamMP** category has these actions. Bind them to the keys you want:

| Action | What it does |
|---|---|
| **Bring to Front** | Shows the chat window again after it has faded |
| **Player Nametags** | Shows or hides all player nametags |
| **Queue Events** | Loads all queued changes |
| **Toggle Chat** | Shows or hides the chat window |

## Servers with mods

When you connect to a server that has mods, BeamMP shows a mod security warning first. Read [Mod Safety](/en/players/mod-safety) before you accept it.
