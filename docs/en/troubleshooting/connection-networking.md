---
description: "Fix BeamMP connection problems: find your server's IP address, test that your port is open with CheckBeamMP, and check whether you are behind CGNAT."
---
# Connection / Networking Issues

Use this page when you or your players cannot connect to a BeamMP server.

## Find your server's IP address

### A server at a hosting company

The IP address is shown in the hosting company's server management interface.

### A server at home

Open [whatsmyip.org](https://whatsmyip.org) in a browser. It shows the public IPv4 address that the internet sees.

`127.0.0.1` is the localhost address. Only you can use it, and only if the server runs on the same computer as the game.

## Test that your port is open

If you still have connection problems with a home-hosted server, check your [port forwarding](/en/server-owners/port-forwarding), then test it with CheckBeamMP while the server is running:

<form action="https://check.beammp.com/api/v2/beammp" method="get" target="_blank">
  <label for="ip">IP address:</label>
  <input type="text" id="ip" name="ip"><br>
  <label for="port">Port:</label>
  <input type="text" id="port" name="port"><br>
  <input type="submit" value="CheckBeamMP">
</form>

## Check for CGNAT

Some internet providers make it difficult to forward ports. [Check for CGNAT](/en/server-owners/cgnat) to find out whether you can host a server at home.

## Ports and addresses the Launcher uses

If you use a strict firewall or a proxy, allow these connections for the Launcher:

| Port | Protocol | Connects | Used for |
|---|---|---|---|
| `4444` | TCP | The game to the Launcher, on your computer | The server list, sign-in and join requests. Set with `Port` in `Launcher.cfg` |
| `4445` (`Port` + 1) | TCP | The game to the Launcher, on your computer | Game data while you are on a server |
| A free port chosen at start | TCP (HTTP) | The game to the Launcher, on `127.0.0.1` | Requests to `backend.beammp.com` and `forum.beammp.com` for the in-game menus |
| The server's port (`30814` unless the owner changed it) | TCP and UDP | The Launcher to the server | Joining, downloading mods, and playing |
| `443` | HTTPS | The Launcher to `backend.beammp.com`, `auth.beammp.com` and `forum.beammp.com` | Updates, the server list and sign-in |

You do not forward `4444` and `4445`. They are only for the game and the Launcher on the same computer. The server's port must be reachable over both TCP and UDP.

## Other connection problems

- The Launcher shows error codes 10060 or 10061, or on Linux `Error code: 110` or `111`: see [Error Codes](/en/troubleshooting/error-codes).
- The Launcher is not connecting to the game: see [Changing the Launcher Port](/en/troubleshooting/launcher-port).
- A firewall or antivirus may be blocking BeamMP: see [Defender / Firewall Exclusions](/en/troubleshooting/defender-exclusions).
