---
description: "Fix BeamMP connection problems: find your server's IP address, test that your port is open with CheckBeamMP, and check whether you are behind CGNAT."
---
# Connection / Networking Issues

Use this page when you or your players cannot connect to a BeamMP server.

## Find your server's IP address

### A server at a hosting company

The IP address is shown in the hosting company's server management interface. You can also find the IP address of your servers on the [Keymaster](https://keymaster.beammp.com/login) website.

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

## Other connection problems

- The Launcher shows error codes 10060 or 10061: see [Error Codes](/en/troubleshooting/error-codes).
- The Launcher is not connecting to the game: see [Changing the Launcher Port](/en/troubleshooting/launcher-port).
- A firewall or antivirus may be blocking BeamMP: see [Defender / Firewall Exclusions](/en/troubleshooting/defender-exclusions).
