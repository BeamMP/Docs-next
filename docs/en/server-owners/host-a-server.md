---
description: "Set up a BeamMP server at home on Windows or Linux, or with a hosting company: forward the port, install and configure the server, and let players join."
---
# Host a Server

This guide is for anyone who wants to run a BeamMP server. At the end, you have a server that you and other players can join.

## Before you start

Players connect to each other through a server. A **private** server is only for people you give its address to. A **public** server shows in the server list.

- Read the server's [LICENSE](https://raw.githubusercontent.com/BeamMP/BeamMP-Server/master/LICENSE) before you use it.
- Get an AuthKey. A public server needs one. See [Get an AuthKey](/en/server-owners/authkey).
- If you run into problems, ask on the [forum](https://forum.beammp.com) or in the `#support` channel on the [Discord server](https://discord.gg/beammp).

## Choose how to host

You can host the server on your own computer at home, or rent one from a hosting company.

| | At home | Hosting company |
|---|---|---|
| Cost | Free | Paid |
| Router and firewall | You forward a port on your router and open your firewall | No changes to your network |
| Online | Only while your computer is on | All the time |
| Number of servers | As many as your computer can run | Usually one per rental |

To host at home, you need all of these:

- A computer with Windows or Linux, and an administrator account on it.
- A public IPv4 address. The server does not support IPv6. If your provider uses Carrier-grade NAT (CGNAT), players cannot reach you: see [Check for CGNAT](/en/server-owners/cgnat).
- Administrator access to your router.

If you do not have all three, or you do not want to open a port on your home network, [use a hosting company](#use-a-hosting-company).

## Host at home {#host-at-home}

### Forward the port {#forward-the-port}

Players outside your home can only join if you forward the server's port on your router.

::: warning Port forwarding is a risk
Port forwarding opens a port of your home network to the internet. Read the disclaimer at the top of the [port forwarding guide](/en/server-owners/port-forwarding) before you start.
:::

1. Forward port `30814` to the computer that will run the server, for both **TCP** and **UDP**. The [port forwarding guide](/en/server-owners/port-forwarding) shows how.
2. If you run more than one server on this computer, forward a different port for each one, such as `30815`.

BeamMP support cannot help with the settings of a specific router. See your router's manual for its port forwarding page.

Tunnelling and VPN services such as Playit, Radmin VPN and Hamachi are not supported. See [Can I use a VPN or tunnelling service?](/en/server-owners/faq#can-i-use-a-vpn-or-tunnelling-service).

### Install the server {#install-the-server}

:::: tabs

== Windows

1. Install the [Visual C++ Redistributables](https://aka.ms/vs/17/release/vc_redist.x64.exe). The server needs them to run.
2. Download the Windows server from [beammp.com](https://beammp.com). You get a file called `BeamMP-Server.exe`.
3. Make a folder for the server, outside your **Downloads** folder, and move `BeamMP-Server.exe` into it. Each server needs a folder of its own.
4. Double-click `BeamMP-Server.exe`. The server creates `ServerConfig.toml`, `Server.log` and a `Resources` folder. It then shows an error about the AuthKey and closes. This is expected: you set the AuthKey in the next section.
5. Allow the server through Windows Defender Firewall, for both TCP and UDP. Follow [Allow the server through the firewall](/en/troubleshooting/defender-exclusions#allow-the-server-through-the-firewall). Turning the firewall off usually does **not** work.

If Windows Security blocks or removes `BeamMP-Server.exe`, add an [antivirus exclusion](/en/troubleshooting/defender-exclusions#add-an-antivirus-exclusion).

== Linux

1. Install the [runtime dependencies](https://github.com/BeamMP/BeamMP-Server#runtime-dependencies). On Debian and Ubuntu, that is the package `liblua5.3-0`.
2. Download the Linux server from [beammp.com](https://beammp.com) or the [latest release page](https://github.com/BeamMP/BeamMP-Server/releases/latest). Choose the file for your distribution and processor, such as `BeamMP-Server.debian.12.x86_64`. Release v3.9.4 has builds for Debian 12 and 13 and Ubuntu 22.04 and 24.04, each for `x86_64` and `arm64`. Do not download the `debuginfo` files.
3. Make a folder for the server and move the file into it. Each server needs a folder of its own.
4. Create a user for the server, such as `beammpserver`, and run the server as that user only. Do not run it as root, with `sudo`, or as your personal user.
5. Open a terminal in the folder and make the file executable. Use the name of the file you downloaded:

   ```bash
   chmod +x BeamMP-Server.debian.12.x86_64
   ```

6. Start the server once:

   ```bash
   ./BeamMP-Server.debian.12.x86_64
   ```

   The server creates `ServerConfig.toml`, `Server.log` and a `Resources` folder. It then shows an error about the AuthKey and closes. This is expected: you set the AuthKey in the next section.
7. Open the port in your firewall, for both TCP and UDP. On Ubuntu and Debian with `ufw`:

   ```bash
   sudo ufw allow 30814/tcp
   sudo ufw allow 30814/udp
   ```

   On Fedora and Red Hat with `firewalld`:

   ```bash
   sudo firewall-cmd --permanent --add-port=30814/tcp
   sudo firewall-cmd --permanent --add-port=30814/udp
   sudo firewall-cmd --reload
   ```

If there is no build for your distribution or processor, follow the [build instructions](https://github.com/BeamMP/BeamMP-Server#build-instructions) to build the server from source. If your system uses SELinux and connections are still blocked after you open the port, check for denials with `sudo ausearch -m avc -ts recent`.

::::

### Configure the server {#configure-the-server}

1. Open `ServerConfig.toml` in a plain-text editor, such as Notepad on Windows or `nano` on Linux. Do not use a word processor such as Word.
2. Set `AuthKey` to your key, between the quotes: `AuthKey = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"`. The server does not start while it is empty. See [Get an AuthKey](/en/server-owners/authkey).
3. Set `Name` to the name players see, such as `Name = "My BeamMP Server"`.
4. To show the server in the server list, set `Private = false`. The default, `true`, keeps it out of the list.
5. If you forwarded a port other than `30814`, set `Port` to the same number.
6. Save the file.

Leave `IP` and `Map` as they are until you have joined the server once. [Server Configuration](/en/server-owners/configuration) describes every setting.

Start the server again. It now stays open. Look for lines with `[ERROR]` or `[WARN]` in its window.

### Check that players can reach it

While the server runs, type `nettest` in its window. The server asks the BeamMP check service whether players can reach it, and prints the answer. You can also test the port with the form in [Test the port](/en/server-owners/port-forwarding#test-the-port).

### Join the server {#join-the-server}

In BeamMP, use the **Direct Connect** tab with these details:

- **On the same computer as the server:** IP address `127.0.0.1` and your port.
- **On another computer in your home:** the local IP address of the server's computer, and your port.

Other players join from outside your home:

- **Public server:** they type its name in the server list and click **Connect**. If they cannot find it, they turn off the search filters and set the map to **Any**.
- **Private server:** give them your public IP address, which [whatsmyip.org](https://whatsmyip.org) shows, and your port. They enter them in **Direct Connect**. Only share the address with people you trust.

## Use a hosting company {#use-a-hosting-company}

A hosting company runs the server for you. You do not forward ports or change your firewall.

### Choose a provider {#partnered-hosting-services}

These partners offer BeamMP servers. They are paid. Choose one with servers close to your players.

<!--@include: ./_parts/partners.md-->

### Set up the server in the panel

Most hosting companies give you a web panel, such as Pterodactyl. The panel sets the server's settings itself, so changes you make to `ServerConfig.toml` in its file manager are overwritten. Use the panel's fields instead, usually on a tab called **Startup**.

1. Paste your AuthKey into the **AuthKey** field. See [Get an AuthKey](/en/server-owners/authkey).
2. Set the **Private** field. A private server does not show in the server list.
3. Set the name and description players see. To add colours, see [Server Customization](/en/server-owners/server-customization).
4. Start the server and look for lines with `[ERROR]` or `[WARN]` in the console.

[Server Configuration](/en/server-owners/configuration) describes every setting. The fields in your panel set the same values.

### Join the server

- **Public server:** you and other players type its name in the server list and click **Connect**.
- **Private server:** enter the IP address and port shown in the panel in the **Direct Connect** tab.

## Next steps

- Add vehicles, maps and plugins: [Installing Mods](/en/server-owners/mods).
- Add colours and tags to your server's listing: [Server Customization](/en/server-owners/server-customization).
- Keep the server up to date: [Server Maintenance](/en/server-owners/maintenance).
- Players cannot join: see [Players cannot join](/en/server-owners/faq#players-cannot-join) in the Server FAQ.
