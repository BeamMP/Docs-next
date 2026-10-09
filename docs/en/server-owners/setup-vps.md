---
description: "Set up a BeamMP server on a VPS or a hosting company's management panel: get an AuthKey, fill in the panel fields, add mods and let players join."
---
# Server Setup on VPS

This guide is for a server on a VPS, or at a hosting company, that has a management panel. To host at home instead, follow [Host a Server](/en/server-owners/host-a-server).

Hosting with a VPS does not need any firewall or port forwarding changes on your router.

## Before you start

Servers are an integral part of BeamMP: players connect to each other through the server. You can make a private server, which only people you invite can join, or a public server, which shows in the official server list.

Read the server's [LICENSE](https://raw.githubusercontent.com/BeamMP/BeamMP-Server/master/LICENSE) before you use it.

If you run into problems, ask on the [forum](https://forum.beammp.com) or in the `#support` channel on the [Discord server](https://discord.gg/beammp). [Server Configuration](/en/server-owners/configuration) has more detail on the server's settings.

If you have not chosen a VPS yet, look at our partnered hosting services. They are paid.

::: details Partnered hosting services
<!--@include: ./_parts/partners.md-->
:::

## Set up the VPS

Make sure your server management page is reachable. When you have checked that the server is ready for operation, continue.

<!--@include: ./_parts/authkey.md-->

## Fill in the panel fields

The hosting panel has some fields to fill in. Fields marked with `*` are mandatory.

1. Paste your AuthKey into the **Authkey** field.
2. Give your server a name and a description. You can format them with colors and more: see [Customize the look of your server name](/en/server-owners/configuration#customize-the-look-of-your-server-name).

::: warning
You cannot edit `ServerConfig.toml` directly in the file manager. This is intentional, so that the hosting company can enforce limits such as the number of players.
:::

### Check that it starts

Run your server and look for `[ERROR]` or `[WARN]` messages. The server should now stay up. Then add mods if you want them, and see how to join.

## Add mods

You can add mods with the panel's file manager. Vehicle mods and map mods are installed differently, but both go in your server's `Resources/Client` folder. Put the mod's `.zip` file in that folder.

::: warning
Mods can be, or become, incompatible with BeamNG, BeamMP or other mods. If you have problems, start removing mods. If you get a "done" or "start" message when you try to join after adding mods, you probably added an incompatible or broken mod. If you have client mods installed, see [Mod Safety](/en/players/mod-safety) about removing them from your game.
:::

### Vehicle and other mods

Put the mod's `.zip` file in `Resources/Client`. Everyone who joins downloads it automatically.

### Maps

The stock maps work without installing anything. Set the **Map** field in the management panel to one of the [stock map paths](/en/server-owners/configuration#all-vanilla-maps-names).

For a modded map:

1. Put the map's `.zip` file in `Resources/Client`.
2. Open the `.zip` without extracting it, then open its `levels` folder. It holds one folder named after the map, for example `myawesomedriftmap2021`. Note the name exactly as written.
3. In the management panel, the **Map** field looks like `/levels/MAPNAME/info.json`, where `MAPNAME` is likely something like `gridmap_v2`. Replace `MAPNAME` with the folder name from step 2. It must end with `/info.json`. For this example: `/levels/myawesomedriftmap2021/info.json`.

When someone joins, the map downloads automatically and works.

If it does not work, install the map in singleplayer BeamNG.drive and enter it. Open the console with the `~` (tilde) key. On a non-US keyboard, find the **Toggle System Console** action under **Options** > **Controls** > **Bindings**, in the **General Debug** section. Run `print(getMissionFilename())`. It shows the name to use.

## Let players join

Players can direct connect to the server's public IP address and port, both found on the management panel. You can also find the IP address on the [Keymaster](https://keymaster.beammp.com/) website.

For a public server, players can instead open the server list, type the name of the server and click **Connect**. The name is the one you set. If they cannot find it, tell them to turn off the search filters and set the map to **Any**.

If you or a friend gets "Connection Failed!", look in the Launcher window for codes such as 10060, 10061 or 10030. They mean the server cannot be reached, or the IP address and port entered on the client are wrong. IPv6 is not supported yet.

## Still facing issues?

Open a thread on the [forum](https://forum.beammp.com), or file a **Server Support Ticket** in the `#support` channel on the [Discord server](https://discord.gg/beammp).
