---
description: "Host a BeamMP server at home: forward the port, allow the server through your firewall, get an AuthKey, install and configure it, add mods and let players join."
---
# Host a Server

This guide covers hosting a BeamMP server at home, on your own Windows or Linux computer. If you use a hosting company or a VPS with a management panel, follow [Server Setup on VPS](/en/server-owners/setup-vps) instead. A home server is free. A VPS is easier and more secure.

## Before you start

Servers are an integral part of BeamMP: players connect to each other through the server. You can make a private server, which only people you invite can join, or a public server, which shows in the official server list.

Read the server's [LICENSE](https://raw.githubusercontent.com/BeamMP/BeamMP-Server/master/LICENSE) before you use it.

The server only supports IPv4. If you do not know which you have, look at the IP address shown on [whatsmyip.org](https://www.whatsmyip.org/). If it contains colons, it is IPv6. In that case, find out whether you also have an IPv4, by asking your ISP or someone who knows networks. IPv6 support is planned.

If you run into problems, ask on the [forum](https://forum.beammp.com) or in the `#support` channel on the [Discord server](https://discord.gg/beammp). [Server Configuration](/en/server-owners/configuration) has more detail on the server's settings.

## Forward the port

Players outside your home can only join your home-hosted server if you forward a port on your router. Skip this step if you are on a VPS or a rootserver, or if everyone who plays is inside your own home (your local network).

::: danger Port forwarding is a risk
By port forwarding, you understand the risks of opening ports on your home network to the public. You therefore give up the right to hold BeamMP accountable for any and all damages that may happen to you or your household.

We take no responsibility for any content on externally linked services or websites.
:::

Hosting with one of our partnered services avoids this risk. To forward a port yourself, follow the [port forwarding guide](/en/server-owners/port-forwarding).

## Partnered hosting services {#partnered-hosting-services}

These services are paid:

<!--@include: ./_parts/partners.md-->

## Allow the server through your firewall

Depending on your setup, you may need to let the BeamMP server through your firewall. This is the case on Windows, where turning the firewall off usually does **not** work, and on many preinstalled Linux servers.

Allow the BeamMP server through the firewall for **both incoming and outgoing connections**, and for **both TCP and UDP**. If your firewall asks for a port instead, use the port you forwarded, usually 30814.

For a detailed guide, see [Defender / Firewall Exclusions](/en/troubleshooting/defender-exclusions).

<!--@include: ./_parts/authkey.md-->

## Install the server

The BeamMP server is available for Windows and Linux.

### Install on Windows

Forward your port first. Without it, nobody outside your home can join.

1. Install the [Visual C++ Redistributables](https://aka.ms/vs/17/release/vc_redist.x64.exe). The server needs them to run.
2. Download the server from [beammp.com](https://www.beammp.com/). You get an executable called something like `BeamMP-Server.exe`.
3. Make a folder somewhere and put `BeamMP-Server.exe` in it. This is where your server lives.
4. Start the server once by double-clicking it. It generates the files it needs. When you see text, close it. You now have a `ServerConfig.toml` file next to `BeamMP-Server.exe`.
5. Optional: for quick access later, create a desktop shortcut with **Right click** > **Send to** > **Desktop (create shortcut)**.

### Install on Linux

#### Use our build (recommended)

This works on every distribution we provide binaries for, listed on the [latest release page](https://github.com/BeamMP/BeamMP-Server/releases/latest). For another distribution or architecture, see [Build from source](#build-from-source).

1. Install the dependencies listed in the [runtime dependencies](https://github.com/BeamMP/BeamMP-Server#runtime-dependencies).
2. Go to [beammp.com](https://beammp.com/) and click **Download Server**. You are taken to the server's GitHub release page.
3. Download the version for your distribution. This guide calls it `BeamMP-Server-xxx`, where `xxx` is the version for your distribution.
4. Make a folder somewhere and put `BeamMP-Server-xxx` in it. You can ignore the other downloaded files for now. This is where your server lives.
5. Open a terminal in that folder and run `chmod +x BeamMP-Server-xxx`, so you have permission to run it.
6. Start the server once with `./BeamMP-Server-xxx`. It generates the files it needs. When you see text, close it. You now have a `ServerConfig.toml` file next to `BeamMP-Server-xxx`.
7. Optional, but strongly recommended: create a user called `beammpserver` (or similar) and start the server as that user only. Do not run the server as root, with `sudo`, or as your personal user.

#### Build from source

Other distributions are likely to work too, but are not officially supported. To build the server yourself, download the source from [GitHub](https://github.com/BeamMP/BeamMP-Server) and follow the [build instructions](https://github.com/BeamMP/BeamMP-Server#build-instructions). At the end, run the server once with `./BeamMP-Server`.

## Configure the server

When you ran the server once, it created some files and probably printed an error or two. That is expected, because it is not configured yet. Your folder now has these files:

![The server folder with ServerConfig.toml, Server.log and BeamMP-Server.exe](../../assets/content/after-running-once.png)

They are `ServerConfig.toml`, `Server.log` and `BeamMP-Server.exe`. Depending on your settings, you may not see the `.toml`, `.log` and `.exe` extensions.

Open `ServerConfig.toml` in a text editor such as Notepad: **Right click** > **Open with…**, then choose the editor. An example configuration:

```toml
[General]
Port = 30814
AuthKey = "auth-key"
AllowGuests = false
LogChat = false
Debug = false
IP = "::"
Private = true
InformationPacket = true
Name = "Test Server"
Tags = "Freeroam,Modded,Racing,Police"
MaxCars = 2
MaxPlayers = 10
Map = "/levels/ks_nord/info.json"
Description = "Total Random Beam MP Server"
ResourceFolder = "Resources"
```

This file uses the TOML format. [Server Configuration](/en/server-owners/configuration) describes every setting.

1. Set `AuthKey` to the key you copied. Paste it between the quotes. For the example key it looks like this:

   ```toml
   AuthKey = '3173a2e-6az0-4542-a3p0-ddqq5ff95558'
   ```

2. Set `Name`, the name of your server in the server list. You can format it with colors and more: see [Customize the look of your server name](/en/server-owners/configuration#customize-the-look-of-your-server-name).
3. If you picked a port other than 30814, set it in `Port`.
4. Your server does not show in the server list while `Private = true`. To list it, set `Private = false`.

### Check that it starts

Run the server again and look for `[ERROR]` or `[WARN]` messages. The server should now stay open. Then add mods if you want them, and see how to join.

## Add mods

Vehicle mods and map mods are installed differently, but both go in your server's `Resources/Client` folder. Put the mod's `.zip` file in that folder.

::: warning
Mods can be, or become, incompatible with BeamNG, BeamMP or other mods. If you have problems, start removing mods. If you get a "done" or "start" message when you try to join after adding mods, you probably added an incompatible or broken mod. If you have client mods installed, see [Mod Safety](/en/players/mod-safety) about removing them from your game.
:::

### Vehicle and other mods

Put the mod's `.zip` file in `Resources/Client`. Everyone who joins downloads it automatically.

### Maps

The stock maps work without installing anything. Set `Map` in `ServerConfig.toml` to one of the [stock map paths](/en/server-owners/configuration#all-vanilla-maps-names).

For a modded map:

1. Put the map's `.zip` file in `Resources/Client`.
2. Open the `.zip` without extracting it, then open its `levels` folder. It holds one folder named after the map, for example `myawesomedriftmap2021`. Note the name exactly as written.
3. In `ServerConfig.toml`, `Map` looks like `/levels/MAPNAME/info.json`, where `MAPNAME` is likely something like `gridmap_v2`. Replace `MAPNAME` with the folder name from step 2. It must end with `/info.json`. For this example:

   ```toml
   Map = '/levels/myawesomedriftmap2021/info.json'
   ```

When someone joins, the map downloads automatically and works.

If it does not work, install the map in singleplayer BeamNG.drive and enter it. Open the console with the `~` (tilde) key. On a non-US keyboard, find the **Toggle System Console** action under **Options** > **Controls** > **Bindings**, in the **General Debug** section. Run `print(getMissionFilename())`. It shows the name to use.

### Protect mods from download

You can host protected or restricted content without redistributing it. This suits "paid mods", or a mod creator who wants limited access to new work.

To protect a mod, run this in the server console:

```text
protectmod <filename with .zip> <true/false>
```

Players who join a server with protected mods must get the file themselves, for example from the creator or from a platform such as Patreon, and put it in their Launcher's resources folder. The Launcher tells them when a file is missing, and the game shows a notification with the missing file and how to fix it.

## Let players join

### Join your own server

Whether it is private or public, how you join depends on where it runs:

- **On the same computer as the game:** use direct connect. Click the **Direct Connect** tab on the left of the server list, leave the default details (`127.0.0.1` and your port), and click **Connect**.
- **On another computer on your local network:** direct connect with that computer's local IP address.
- **Outside your home, such as a VPS:** direct connect with that machine's public IP address.

### Private server

Give other players your server's public IP address. Be careful who you share it with. To join, they open the **Direct Connect** tab in BeamMP and enter your IP address and port.

### Public server

Other players find it in the server list: they type its name and click **Connect**. The name is the one in your `ServerConfig.toml`. If they cannot find it, tell them to turn off the search filters and set the map to **Any**. The [Keymaster](https://keymaster.beammp.com/) website also shows your server's IP address.

### "Connection Failed!"

If you or a friend gets "Connection Failed!", look in the Launcher window for codes such as 10060, 10061 or 10030. They mean one of two things: you are behind a CGNAT IPv4 address, or something went wrong in [Forward the port](#forward-the-port) or [Allow the server through your firewall](#allow-the-server-through-your-firewall).

To check for CGNAT, look up the WAN IP address on your router's page and compare it with your [public IP](https://www.whatsmyip.org/). If they are the same, you are not behind a CGNAT. See [Check for CGNAT](/en/server-owners/cgnat). IPv6 is not supported yet.

## Check that players can reach your server

Enter your server's public IPv4 address and port, then click **CheckBeamMP**:

<form action="https://check.beammp.com/api/v2/beammp" method="get" target="_blank">
  <label for="ip">IP address:</label>
  <input type="text" id="ip" name="ip"><br>
  <label for="port">Port:</label>
  <input type="text" id="port" name="port"><br>
  <input type="submit" value="CheckBeamMP">
</form>

## Using a VPN

BeamMP does not support VPNs such as RadminVPN or Hamachi, because they often cause problems. One of these is that UDP traffic is not forwarded. To fix that, see [Forward the port](#forward-the-port).

::: question But it worked before. Why not now?
The developers of these applications update their software and make changes BeamMP has no control over. It is up to them to support specific uses such as a BeamMP server.
:::

## Still facing issues?

Open a thread on the [forum](https://forum.beammp.com), or file a **Server Support Ticket** in the `#support` channel on the [Discord server](https://discord.gg/beammp).
