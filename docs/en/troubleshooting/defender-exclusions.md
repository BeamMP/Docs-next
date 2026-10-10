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
4. Select **Program** and click **Next**.
5. Select **This program path** and enter the full path to `BeamMP-Launcher.exe`. The default is `%appdata%\BeamMP-Launcher\BeamMP-Launcher.exe`, without quotes.
6. Select **Allow the connection**.
7. Keep the network types that are ticked, and click **Next**.
8. Give the rule a name, for example "BeamMP-Launcher", and click **Finish**.

## Allow the server through the firewall

The server needs a rule for the program and a rule for its port. Players connect to the same port number over TCP and over UDP, so the port needs one rule for each.

1. Create a rule for the program as in the steps above, but use the full path to `BeamMP-Server.exe`, which is wherever you put the file after downloading it. Name it "BeamMP-Server".
2. Click **New Rule** again.
3. Select **Port** and click **Next**.
4. Select **TCP** and **Specific local ports**, and enter the same port as `Port` in your `ServerConfig.toml`. The default is `30814`.
5. Select **Allow the connection**, keep the network types that are ticked, and give the rule a name, for example "BeamMP-Server TCP".
6. Repeat steps 2 to 5 with **UDP**, and name the rule "BeamMP-Server UDP".

A firewall rule applies as soon as you save it. Restart the Launcher or the server afterwards.

## Add an antivirus exclusion

This applies to the Launcher and the server.

1. Open the **Windows Security** app.
2. Click **Virus & threat protection**.
3. Under **Virus & threat protection settings**, click **Manage settings**.
4. Scroll down to **Exclusions** and click **Add or remove exclusions**.
5. Click **Add an exclusion**, select **File**, and select `BeamMP-Launcher.exe` or `BeamMP-Server.exe`. This stops the program itself from being scanned or removed.
6. Click **Add an exclusion** again, select **Process**, and enter the full path to the same program. This stops the files the program opens from being scanned.

An exclusion applies to real-time protection. A scheduled or manual scan can still scan an excluded file.

## Still facing issues?

Open a thread on the [forum](https://forum.beammp.com), or ask in the `#support` channel on the [Discord server](https://discord.gg/beammp).
