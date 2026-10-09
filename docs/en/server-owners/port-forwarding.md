---
description: "Forward the BeamMP port on your home router, step by step: set a static IP, log in to the router, create the rule and test it with CheckBeamMP."
---
# Port Forwarding

::: danger DISCLAIMER:
**Port forwarding is a risk**.

By Port forwarding you understand the risks of opening up ports on your home network to the public and therefore void the right to hold BeamMP accountable for **any and all** damages that may happen to you or your household.

We take no responsibility for any content on any externally linked services or websites.

<u>**If you do not understand this guide, please consider using one of our partners.**</u>
:::

::: warning
Please make sure your Router is not a 4G/5G exclusive device. If it is a hybrid device, make sure to select the cable connected adapter later in section 3 of this guide!
:::

## What you will do

Creating a port forwarding rule involves a few detailed network terms. Be prepared to write down a few notes as you go through the process.

There are 4 major steps in this guide.

## Quick guide

1. **Assign a static IP address to your computer or devices**

   This is needed to prevent the IP of your device changing and breaking the port forwarding rule.

   [See info about your router](https://portforward.com/router.htm#1)

2. **Log in to your router**

   This can normally be done by finding the 'Default Gateway' IP, which can be found when executing `ipconfig` in a command prompt and entering it in a web browsers address bar.

3. **Forward ports to your computer**

   Find the port forwarding section in your routers web interface. Most routers list the port forwarding section under Network, Advanced, or LAN.

4. **Test that your port is forwarded properly**

   Use a tool such as CheckBeamMP to test if the rule is working.

   <form action="https://check.beammp.com/api/v2/beammp" method="get" target="_blank">
    <label for="ip">IP address:</label>
    <input type="text" id="ip" name="ip"><br>
    <label for="port">Port:</label>
    <input type="text" id="port" name="port"><br>
    <input type="submit" value="CheckBeamMP">
   </form>

## Detailed guide

### Assign a static IP address

#### Method 1: use a DHCP reservation

Another way to set a static IP address in your local network is to use your router's DHCP reservation feature. Not all routers have this feature, so this may not be an option for you. Please search the internet with the model of your router to find a manual. 

If you have managed to do this, skip to [Log in to your router](#log-in-to-your-router)

#### Method 2: set a static IP in Windows

##### Find your current IP address, gateway and DNS servers

Before we can set up a static IP address, we need to know your current network settings. 
You are going to want to write these down, so get a notepad window ready. 
For this step, we are going to use command prompt.

Open up a command prompt. The 3 main ways are:

- Windows Key, then start typing the phrase "cmd", then press Enter when you see "Command Prompt" highlighted.


<figure class="image image_resized" style="width:62%;">

![The Windows Start menu with Command Prompt highlighted](../../assets/content/win11-open-cmd.png)

</figure>

Once you are in the command prompt, run the following command:

```
ipconfig /all
```

You will see a lot of data.
If you have virtual or multiple network adapters, then you will see even more data. 
It is common to see many virtual adapters if you have either Hyper-V or Docker installed.

<figure class="image image_resized" style="width:62%;">

![Command Prompt showing the output of ipconfig with the IPv4 address, subnet mask, default gateway and DNS servers highlighted](../../assets/content/win11-command-prompt-ipconfig-highlighted.png)

</figure>

It is recommended to use a wired network connection which will be running this server, however, it will work over a wireless connection.
You will need to look for an adapter in this list which has an active internet connection. Scroll through the list and find one that has a Default Gateway assigned. 
Many of the virtual adapters will not have a Default Gateway. 

Below are local IPv4 address examples, which atleast one of the adapters should have.
You will need to note down the information of your adapter.

- 192.168.x.x
- 10.x.x.x.
- 172.16.x.x - 172.31.x.x

Subnet Mask (most likely 255.255.255.0)
</br>
Default Gateway (most likely 192.168.0.1 or 192.168.1.1)

::: info Please Note
BeamMP currently does not support IPv6 for hosting a server. 
:::

##### Change the adapter settings

Now we need to change the settings on your network adapter in order for your PC to keep the IP configuration it currently has. To get to the settings for your network, the fastest method is:

- Single tap the Windows key
- Type the phrase "network connections" until you see "View network connections".
- Press the Enter key


<figure class="image image_resized" style="width:62%;">

![The Windows Start menu showing View network connections](../../assets/content/win11-start-menu-view-network-connections.png)

</figure>

You should see a list of network connections on your computer. 
If you have Hyper-V or Docker installed, there can be many. 
Look for any adapters that are not named "Hyper-V".

<figure class="image image_resized" style="width:62%;">

![The Network Connections window with the Ethernet adapter](../../assets/content/win11-network-connections.png)

</figure>


Right-click on your adapter and choose properties. If `Internet Protocol Version 4` is not checked, then this is the wrong adapter. Choose a different one.

<figure class="image image_resized" style="width:62%;">

![The Ethernet properties window with the IPv4 entry highlighted](../../assets/content/win11-ethernet-properties-highlighted.png)

</figure>

Double click on `Internet Protocol Version 4`. Change `Obtain an IP address automatically` to `Use the following IP address`.

Fill out the IP address, Subnet mask, Default gateway, and Preferred DNS server with the information from command prompt (ipconfig /all).

Alternatively, instead of using your DNS servers, you can use either the CloudFlare or Google DNS servers:

- CloudFlare DNS: 1.1.1.1, 1.0.0.1
- Google DNS: 8.8.8.8, 8.8.4.4


<figure class="image image_resized" style="width:62%;">

![The IPv4 properties window with the IP address, subnet mask, default gateway and DNS servers filled in](../../assets/content/win11-network-settings-static-ip.png)

</figure>

Click Ok, then click Ok again, and your adapter is now changed from DHCP to static. Surf the web to make sure that you still have internet connectivity. If you do not, then change your settings back to Obtain an IP address automatically and try the next method.

### Log in to your router

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

### Create the forwarding rules

#### Find the forwarding section

Find the port forwarding section in your router web interface. Navigate around in your router by clicking the tabs or links at the top or left of each page. Most routers list the port forwarding section under Network, Advanced, or LAN. Look for the following keywords to help you find it:

- Port Forwarding
- Forwarding
- Port Range Forwarding
- Virtual Servers
- Apps & Gaming
- Advanced Setup/Settings
- NAT

#### Enter the details

Once you find your router's port forwarding section, you are ready to enter the necessary information.
Your router will have a place to enter the ports to be forwarded and the destination IP address to point those forwarded ports. If your router lists both Internal and External ports, make them the same. 

BeamMP requires both UDP and TCP port 30814 (Unless you have changed this in your [ServerConfig.toml](/en/server-owners/host-a-server#configure-the-server)). 

::: info Note
While the default **Port** is **30814**, you can choose any other number greater than 1024 but less than 65535, but you need to note down what you picked if it's not 30814\. You need to forward both **TCP** and **UDP**.
</br>
It is recommended to stick to the default port as that one is very unlikely to be used by another service on your PC.
</br>
However, If you are hosting multiple servers on one machine, each server needs a different Port. Server 1: 30814, Server 2: 30815 for example.
:::

On some routers you may need to create 2 rules, one for UDP and one for TCP, while others let you do both with a single rule!

Most routers have a 'save' button, and some routers require a restart or reboot for the changes to take effect.

### Test the port

There are a few different ways to test the connection.

Our recommend way is to use our tool **CheckBeamMP** as this tests for BeamMP specific issues and protocols.

<form action="https://check.beammp.com/api/v2/beammp" method="get" target="_blank">
  <label for="ip">IP address:</label>
  <input type="text" id="ip" name="ip"><br>
  <label for="port">Port:</label>
  <input type="text" id="port" name="port"><br>
  <input type="submit" value="CheckBeamMP">
</form>

This can be done by getting your public IPv4 Address, this once again can be done in a few different ways. The main way is to use a website called [whatsmyip.org](https://whatsmyip.org/). This is a simple website which displays your public IP Address. You should be looking for an IP address with the formatting: xxx.xxx.xxx.xxx

Visit the following Link and replace "IP" with your actual IPv4 address, and the "Port" with your servers port. Be sure to leave no spaces.
https://check.beammp.com/api/v2/beammp/ip/port

::: success status: ok
If you get the output above you can now join your server!
There are 2 ways to join, either directly with the details you entered into Probably UP, or, if your server is set to 'public', through the server-list.
Since you are hosting a server on-premise, use 127.0.0.1 (localhost) if the Server is running on the same PC as you play, or the LAN IPv4 of the local machine that is running the server.
:::

::: failure status: error
If the connection fails entirely, your ISP could be using CGNAT (Carrier Grade Network Address Translation). For more details, see [Check for CGNAT](/en/server-owners/cgnat),
  or open a Server Support ticket on our [Discord server](https://discord.gg/beammp) in the `#support` channel and one of our staff will get to your ticket!
  Should you only see TCP working and UDP failing, check Firewall and Port forwarding rules again.
:::
