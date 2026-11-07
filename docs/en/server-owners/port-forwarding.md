---
description: "Forward the BeamMP port on your home router, step by step: set a static IP, log in to the router, create the rule and test it with CheckBeamMP."
---
# Port Forwarding

This guide is for server owners who host at home. It shows how to forward the server's port on your router, so players outside your home can join.

::: danger Port forwarding is a risk
By port forwarding, you understand the risks of opening ports on your home network to the public. You therefore give up the right to hold BeamMP accountable for any and all damages that may happen to you or your household.

We take no responsibility for any content on externally linked services or websites.

If you do not understand this guide, use one of our [partnered hosting services](/en/server-owners/host-a-server#partnered-hosting-services) instead.
:::

::: warning
Port forwarding does not work on a router that only connects over 4G or 5G. If your router has both a cable and a mobile connection, choose the cable connection when you forward the port.
:::

You will need to write down a few network details as you go. Have a text editor open.

## Overview

1. [Assign a static IP address](#assign-a-static-ip-address) to the computer that runs the server, so the rule keeps pointing at it.
2. [Log in to your router](#log-in-to-your-router) at its Default Gateway address.
3. [Create the forwarding rules](#create-the-forwarding-rules) for port `30814`, TCP and UDP.
4. [Test the port](#test-the-port).

## Assign a static IP address

### Method 1: use a DHCP reservation

The simplest way to give your computer a fixed IP address is your router's DHCP reservation feature. Not all routers have it. Search the internet for the manual of your router model. [portforward.com](https://portforward.com/router.htm) has guides for many routers.

If you set a reservation, skip to [Log in to your router](#log-in-to-your-router).

### Method 2: set a static IP in Windows

**Find your current IP address, gateway and DNS servers**

Before we can set up a static IP address, we need to know your current network settings. 
You are going to want to write these down, so get a notepad window ready. 
For this step, we are going to use command prompt.

To open a command prompt, press the Windows key, type `cmd`, and press `Enter` when **Command Prompt** is highlighted.

![The Windows Start menu with Command Prompt highlighted](../../assets/content/win11-open-cmd.png)

Once you are in the command prompt, run the following command:

```
ipconfig /all
```

You will see a lot of data.
If you have virtual or multiple network adapters, then you will see even more data. 
It is common to see many virtual adapters if you have either Hyper-V or Docker installed.

![Command Prompt showing the output of ipconfig with the IPv4 address, subnet mask, default gateway and DNS servers highlighted](../../assets/content/win11-command-prompt-ipconfig-highlighted.png)

It is recommended to use a wired network connection which will be running this server, however, it will work over a wireless connection.
You will need to look for an adapter in this list which has an active internet connection. Scroll through the list and find one that has a Default Gateway assigned. 
Many of the virtual adapters will not have a Default Gateway. 

Below are local IPv4 address examples, which atleast one of the adapters should have.
You will need to note down the information of your adapter.

- 192.168.x.x
- 10.x.x.x.
- 172.16.x.x - 172.31.x.x

Also note the **Subnet Mask**, most likely `255.255.255.0`, and the **Default Gateway**, most likely `192.168.0.1` or `192.168.1.1`. The server does not support IPv6, so use the IPv4 details.

**Change the adapter settings**

Now we need to change the settings on your network adapter in order for your PC to keep the IP configuration it currently has. To get to the settings for your network, the fastest method is:

- Single tap the Windows key
- Type the phrase "network connections" until you see "View network connections".
- Press the Enter key


![The Windows Start menu showing View network connections](../../assets/content/win11-start-menu-view-network-connections.png)

You should see a list of network connections on your computer. 
If you have Hyper-V or Docker installed, there can be many. 
Look for any adapters that are not named "Hyper-V".

![The Network Connections window with the Ethernet adapter](../../assets/content/win11-network-connections.png)


Right-click on your adapter and choose properties. If `Internet Protocol Version 4` is not checked, then this is the wrong adapter. Choose a different one.

![The Ethernet properties window with the IPv4 entry highlighted](../../assets/content/win11-ethernet-properties-highlighted.png)

Double click on `Internet Protocol Version 4`. Change `Obtain an IP address automatically` to `Use the following IP address`.

Fill out the IP address, Subnet mask, Default gateway, and Preferred DNS server with the information from command prompt (ipconfig /all).

Alternatively, instead of using your DNS servers, you can use either the CloudFlare or Google DNS servers:

- CloudFlare DNS: 1.1.1.1, 1.0.0.1
- Google DNS: 8.8.8.8, 8.8.4.4


![The IPv4 properties window with the IP address, subnet mask, default gateway and DNS servers filled in](../../assets/content/win11-network-settings-static-ip.png)

Click Ok, then click Ok again, and your adapter is now changed from DHCP to static. Surf the web to make sure that you still have internet connectivity. If you do not, then change your settings back to Obtain an IP address automatically and try the next method.

## Log in to your router

Now that you have a static IP address on your device, you are ready to forward the port for BeamMP!

To start, we need to log in to your router. Earlier, one of the settings that you wrote down is your Default Gateway. That is the IP address of your router.

Most routers use a locally hosted web page for management. To view your router's menu and settings:

- Open up a web browser. Firefox, Chrome or Edge should work fine.
- In the address bar, type your Default Gateway IP address, such as 192.168.0.1 or 192.168.1.1 and press enter

You should now see your router's login screen. Not all routers require a login, but most do. You need to know your router's username and password. If you have never logged in before, your username and password are most likely set to the factory default values or, in some cases, written on a sticker your router.

Some of the most common factory usernames and passwords are listed here:

| Username    | Password  |
| ----------- | --------- |
| admin       | admin     |
| admin       | password  |
| {blank}     | admin     |
| {blank}     | password  |

Try various combinations of admin, password, and leaving the entries blank. *Where it says blank, try leaving the value blank.* 

## Create the forwarding rules

### Find the forwarding section

Find the port forwarding section in your router web interface. Navigate around in your router by clicking the tabs or links at the top or left of each page. Most routers list the port forwarding section under Network, Advanced, or LAN. Look for the following keywords to help you find it:

- Port Forwarding
- Forwarding
- Port Range Forwarding
- Virtual Servers
- Apps & Gaming
- Advanced Setup/Settings
- NAT

### Enter the details

Once you find your router's port forwarding section, you are ready to enter the necessary information.
Your router will have a place to enter the ports to be forwarded and the destination IP address to point those forwarded ports. If your router lists both Internal and External ports, make them the same. 

BeamMP requires both UDP and TCP port 30814 (Unless you have changed this in your [ServerConfig.toml](/en/server-owners/host-a-server#configure-the-server)). 

::: info
You can use any port from 1024 to 65535 instead of `30814`, as long as `Port` in `ServerConfig.toml` is the same. The default is unlikely to be used by another program. If you host more than one server on one computer, each needs its own port, such as `30814` and `30815`.
:::

On some routers you may need to create 2 rules, one for UDP and one for TCP, while others let you do both with a single rule!

Most routers have a 'save' button, and some routers require a restart or reboot for the changes to take effect.

## Test the port

1. Start the server.
2. Find your public IPv4 address on [whatsmyip.org](https://whatsmyip.org/). It looks like `xxx.xxx.xxx.xxx`.
3. Enter the address and your server's port, then click **CheckBeamMP**. You can also type `nettest` in the server's window, which runs the same check.

<form action="https://check.beammp.com/api/v2/beammp" method="get" target="_blank">
  <label for="ip">IP address:</label>
  <input type="text" id="ip" name="ip"><br>
  <label for="port">Port:</label>
  <input type="text" id="port" name="port"><br>
  <input type="submit" value="CheckBeamMP">
</form>

::: success status: ok
Players can reach your server. See [Join the server](/en/server-owners/host-a-server#join-the-server).
:::

::: failure status: error
If the connection fails entirely, your internet provider may use Carrier-grade NAT (CGNAT). See [Check for CGNAT](/en/server-owners/cgnat). If only TCP works and UDP fails, check the firewall and port forwarding rules again. For more help, open a **Server Support** ticket in the `#support` channel on the [Discord server](https://discord.gg/beammp).
:::
