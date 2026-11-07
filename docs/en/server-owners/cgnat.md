---
description: "Find out if your internet connection is behind CGNAT, which stops players joining a home-hosted BeamMP server even when ports are forwarded."
---
# Check for CGNAT

Your firewall exclusions and port forwarding rules are set up correctly, and still nobody can join your home-hosted server? You may be behind a CGNAT.

If your server is with a hosting company and players cannot connect, contact the company instead. If you cannot host at home, see the [partnered hosting services](/en/server-owners/host-a-server#partnered-hosting-services).

## What is CGNAT?

Carrier-grade NAT (CGNAT) is a setup some internet providers use that makes it difficult to forward ports to your home. For a detailed explanation of what it is and why it is a problem for hosting at home, see [Carrier-grade NAT on Wikipedia](https://en.wikipedia.org/wiki/Carrier-grade_NAT).

This is an example of a network that is not behind a CGNAT:

![A network diagram of a connection that is not behind a CGNAT](https://github.com/user-attachments/assets/fee21a50-cbb0-4322-9c26-d9f04f88ae37)

## Check for CGNAT

### Method 1: trace the route

1. Open a command prompt and run:

   ```text
   tracert -4 beammp.com
   ```

   It lists a series of network hops. Wait for it to finish, which can take up to 30 hops.
2. The first hop is your router, modem or gateway, and differs between devices. Look at the first few IP addresses after it.
3. If several addresses between `100.64.x.x` and `100.127.x.x`, or starting with `10.`, appear after the first hop, you are most likely behind a CGNAT.

Addresses in your own home network start with `192.168.`, `10.`, or `172.16.` to `172.31.`. It is normal for the first hop to have one of them.

### Method 2: compare IP addresses

Find the WAN IP address on your router's interface and compare it with the address shown on [whatsmyip.org](https://whatsmyip.org). If they are **not** the same, you are behind a CGNAT.

## If you are behind a CGNAT

Ask your internet service provider (ISP) for a public IPv4 address that is not behind CGNAT. It does not need to be a static address. Not every ISP offers this.

::: warning
ISPs may only offer a dedicated IP address as a **paid option**. Compare the price with our [partnered hosting services](/en/server-owners/host-a-server#partnered-hosting-services): they may be cheaper.
:::
