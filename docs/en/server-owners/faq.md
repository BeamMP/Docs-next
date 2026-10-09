---
description: "Answers to common BeamMP server questions: setting one up, Linux, system requirements, players who cannot join, and reporting bugs or a compromised AuthKey."
---
# Server FAQ

Common questions and known issues about running a BeamMP server.

## Setting up

### How can I set up my own server?

Everything you need is in [Host a Server](/en/server-owners/host-a-server), or [Server Setup on VPS](/en/server-owners/setup-vps) if you use a hosting company.

### Can I run a server on Linux?

Yes. We provide binaries for many Linux distributions on the [latest release page](https://github.com/BeamMP/BeamMP-Server/releases/latest). If there is none for your distribution, you can build it from the source on [GitHub](https://github.com/BeamMP/BeamMP-Server). The [build instructions](https://github.com/BeamMP/BeamMP-Server#build-instructions) explain how.

### What are the minimum system requirements?

| | Requirement |
|---|---|
| RAM | 50 MiB or more usable, not counting the operating system |
| CPU | Faster than 1 GHz, preferably multicore |
| OS | Windows or Linux (theoretically any POSIX system) |
| GPU | None |
| Disk | 10 MiB plus mods and plugins |
| Bandwidth | 5–10 Mb/s upload |

## Players cannot join

### Players outside my network cannot join my self-hosted server

If other players get error code 10060, 10061 or 10038 in their Launcher, check the following. The full guide is [Port Forwarding](/en/server-owners/port-forwarding).

- Forward port 30814, or the port you set in `ServerConfig.toml`, for both TCP and UDP.
- Allow BeamMP through the Windows Firewall, for both incoming and outgoing connections. Turning the firewall off usually does **not** work.
- Make sure you are not using a VPN. It can cause problems.
- Make sure the server is running, without errors or warnings.

While the server is running, you can test whether the port is forwarded with CheckBeamMP:

<form action="https://check.beammp.com/api/v2/beammp" method="get" target="_blank">
  <label for="ip">IP address:</label>
  <input type="text" id="ip" name="ip"><br>
  <label for="port">Port:</label>
  <input type="text" id="port" name="port"><br>
  <input type="submit" value="CheckBeamMP">
</form>

Some internet providers do not give you a dedicated IPv4 address (CGNAT), so port forwarding may not work even when your router offers it. See [Check for CGNAT](/en/server-owners/cgnat). Port forwarding is not possible on a mobile (4G or 5G) connection.

### I can see my server in the list, but I cannot join it myself

If the server runs on the same computer as the game, join with **Direct Connect**, using the IP address `127.0.0.1` and your server's port.

To join your own self-hosted server through the server list, your router must support NAT loopback. Not many home routers do.

## Other questions

### Where can I find the code?

All the source code is on [GitHub](https://github.com/BeamMP). The code is subject to our [Terms of Use](https://forum.beammp.com/t/terms-of-use-v1-0/43) and these licenses:

| Code | License |
|---|---|
| Server | [LICENSE](https://github.com/BeamMP/BeamMP-Server/blob/master/LICENSE) |
| Launcher | [LICENSE](https://github.com/BeamMP/BeamMP-Launcher/blob/master/README.md) |
| Client Lua | [LICENSE](https://github.com/BeamMP/BeamMP/blob/development/LICENSE.md) |

### I found a bug or an exploit. What should I do?

If it is a code problem and you know how to use GitHub, open an "Issue" in the right repository on our [GitHub](https://github.com/BeamMP). We use an issue-based workflow, so even if you already have a fix, open an Issue first, then a "Pull Request" that solves it. More on contributing is in the [contributing guide](https://github.com/BeamMP/BeamMP/blob/development/CONTRIBUTING.md).

If you do not have a GitHub account, or do not know how to use GitHub:

- If it is not sensitive, post on the [BeamMP forum](https://forum.beammp.com) or report it on the [Discord server](https://discord.gg/beammp).
- If it is sensitive, report it directly to a staff member on [Discord](https://discord.gg/beammp).

### My AuthKey was compromised. What should I do?

If you think one of your AuthKeys is compromised, create an **Account Support** ticket on [Discord](https://discord.gg/beammp).
