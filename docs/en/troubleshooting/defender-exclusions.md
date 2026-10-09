---
description: "Create exclusions in the Windows Defender Firewall and Antivirus so BeamMP's Launcher and server are not blocked: firewall rules, then an antivirus exclusion."
---
# Defender / Firewall Exclusions

This guide shows how to create exclusions in the Windows Defender Firewall and Antivirus for the BeamMP Launcher and server.

Before you change the firewall, make sure your network is set to **private** in the Windows network settings, if you are on a private network.

::: danger Exclusions are a risk
By creating exclusions, you understand the risks of allowing programs on your computer and opening ports on your home network to the public. You therefore give up the right to hold BeamMP accountable for any and all damages that may happen to you or your household.

We take no responsibility for any content on externally linked services or websites.
:::

## Allow the Launcher through the firewall

1. Open **Windows Defender Firewall with Advanced Security**.
2. Click **Inbound Rules**.
3. Click **New Rule** in the top right.
4. Select **Program** to create a rule for a program.
5. Enter the full path to `BeamMP-Launcher.exe`. The default is `%appdata%\BeamMP-Launcher\BeamMP-Launcher.exe`, without quotes.
6. Choose to allow the connection.
7. Give the rule a name, for example "BeamMP-Launcher", and save it.
8. Restart your computer.

## Allow the server through the firewall

1. Open **Windows Defender Firewall with Advanced Security**.
2. Click **Inbound Rules**.
3. Click **New Rule** in the top right.
4. Select **Port** to create a rule for a port.
5. Enter the same port as in your `ServerConfig.toml`.
6. Enter the full path to `BeamMP-Server.exe`. It is wherever you put the file after downloading it.
7. Choose to allow the connection.
8. Give the rule a name, for example "BeamMP-Server", and save it.
9. Restart your computer.

## Add an antivirus exclusion

This applies to the Launcher and the server.

1. Open the **Windows Security** app.
2. Click **Virus & threat protection**.
3. Under **Virus & threat protection settings**, click **Manage settings**.
4. Scroll down to **Exclusions**.
5. Click **Add or remove exclusions**, click **Add an exclusion** and select **Process**.
6. Enter `BeamMP-Launcher.exe` or `BeamMP-Server.exe` and save it.
7. Restart your computer.

## Still facing issues?

Open a thread on the [forum](https://forum.beammp.com), or ask in the `#support` channel on the [Discord server](https://discord.gg/beammp).
