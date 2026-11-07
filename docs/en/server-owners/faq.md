---
description: "Answers to common BeamMP server questions: setting one up, Linux, system requirements, players who cannot join, VPNs, and AuthKeys."
---
# Server FAQ

Common questions and known issues about running a BeamMP server.

## Setting up

### How can I set up my own server?

Follow [Host a Server](/en/server-owners/host-a-server). It covers hosting at home and with a hosting company.

### Can I run a server on Linux?

Yes. There are builds for several Debian and Ubuntu versions. See the Linux steps in [Install the server](/en/server-owners/host-a-server#install-the-server). On another distribution, you can build the server from source.

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

Players usually see "Connection Failed!", and error code 10060 or 10061 in their Launcher window (110 or 111 on Linux). Check each of these:

- The server is running, without `[ERROR]` lines in its window.
- Port `30814`, or the port you set in `ServerConfig.toml`, is forwarded for both TCP and UDP. See [Port Forwarding](/en/server-owners/port-forwarding).
- The firewall allows the server for both TCP and UDP. On Windows, see [Allow the server through the firewall](/en/troubleshooting/defender-exclusions#allow-the-server-through-the-firewall). Turning the firewall off usually does **not** work. On Linux, see the Linux steps in [Install the server](/en/server-owners/host-a-server#install-the-server).
- You are not using a VPN or tunnelling service. See [Can I use a VPN or tunnelling service?](#can-i-use-a-vpn-or-tunnelling-service).

To test the port, type `nettest` in the server's window, or use the form in [Test the port](/en/server-owners/port-forwarding#test-the-port).

If everything is set up and the test still fails, your internet provider may use Carrier-grade NAT (CGNAT). Port forwarding does not work behind it. See [Check for CGNAT](/en/server-owners/cgnat). Port forwarding is also not possible on a mobile (4G or 5G) connection.

### I can see my server in the list, but I cannot join it myself

If the server runs on the same computer as the game, join with **Direct Connect**, using the IP address `127.0.0.1` and your server's port.

To join your own home-hosted server through the server list, your router must support NAT loopback. Not many home routers do.

### Can I use a VPN or tunnelling service? {#can-i-use-a-vpn-or-tunnelling-service}

No. BeamMP does not support VPNs and tunnelling services such as Radmin VPN, Hamachi or Playit. They often cause problems, such as not forwarding UDP traffic. Forward the port instead, or use a [hosting company](/en/server-owners/host-a-server#use-a-hosting-company).

If one of these worked before and stopped, its developers changed their software. BeamMP has no control over that.

## AuthKeys

### How many AuthKeys can I have, and how do I get more?

By default an account can have 2 AuthKeys. Patreon tiers and boosting the BeamMP Discord server add more. See [Your key limit](/en/server-owners/authkey#your-key-limit).

### My AuthKey was compromised. What should I do?

Rotate the key in **Keymaster**. The old key stops working at once. See [Replace a key that others have seen](/en/server-owners/authkey#replace-a-key-that-others-have-seen).

## Other questions

<!--@include: ../_parts/faq-code-and-bugs.md-->
