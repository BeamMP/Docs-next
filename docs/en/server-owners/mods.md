---
description: "Add vehicle mods, map mods and server plugins to your BeamMP server, set a modded map, and protect paid mods from being downloaded."
---
# Installing Mods

This page shows how to add mods and plugins to a BeamMP server, whether you host it yourself or with a hosting company.

## Before you start

Mods go in the server's `Resources` folder, which the server creates the first time it runs:

- **Server you run yourself:** the `Resources` folder is next to `ServerConfig.toml`, unless you changed `ResourceFolder`.
- **Hosting company:** open the `Resources` folder in the panel's file manager.

After you add, change or remove a mod, restart the server, or type `reloadmods` in the server's console.

::: warning
Mods can be, or become, incompatible with BeamNG.drive, BeamMP or other mods. If you have problems, remove mods until they stop. If you get a "done" or "start" message when you try to join after adding mods, you probably added an incompatible or broken mod. If you have client mods installed, see [Mod Safety](/en/players/mod-safety) about removing them from your game.
:::

## Add a vehicle or other mod

Put the mod's `.zip` file in `Resources/Client`. Do not extract it. Everyone who joins downloads it automatically.

## Add a map {#maps}

The stock maps work without installing anything. Set `Map` in `ServerConfig.toml`, or the **Map** field in your hosting panel, to one of the [stock map paths](/en/server-owners/configuration#stock-map-paths).

For a modded map:

1. Put the map's `.zip` file in `Resources/Client`.
2. Open the `.zip` without extracting it, then open its `levels` folder. It holds one folder named after the map, for example `myawesomedriftmap2021`. Note the name exactly as written.
3. Set `Map`, or the **Map** field, to `/levels/MAPNAME/info.json`, with `MAPNAME` replaced by the folder name from step 2. It must end with `/info.json`. For this example: `Map = "/levels/myawesomedriftmap2021/info.json"`.

When someone joins, the map downloads automatically.

If it does not work, install the map in singleplayer BeamNG.drive and enter it. Open the console with the `~` (tilde) key. On a non-US keyboard, find the **Toggle System Console** action under **Options** > **Controls** > **Bindings**, in the **General Debug** section. Run `print(getMissionFilename())`. It shows the path to use.

## Add a server plugin

Server plugins, such as moderation or game mode scripts, run on the server and go in `Resources/Server`.

1. Extract the plugin. Do not leave it as a `.zip` file.
2. Put its folder in `Resources/Server`. Each plugin needs a folder of its own, with its `.lua` files directly inside.
3. Read the plugin's `README` file, if it has one. Some plugins also need files in `Resources/Client`.

To write your own plugins, see the [Server Scripting Reference](/en/developers/beammp-scripting/server/latest).

## Protect mods from download

You can host a mod without letting players download it from your server. This suits paid mods, or a creator who wants to limit who gets new work.

To protect a mod, type this in the server's console, with the mod's file name including `.zip`:

```text
protectmod <filename.zip> true
```

Use `false` instead of `true` to remove the protection.

Players who join a server with protected mods must get the file themselves, for example from the creator or from a platform such as Patreon, and put it in their Launcher's `Resources` folder. The Launcher tells them when a file is missing, and the game shows which file is missing and how to fix it.
