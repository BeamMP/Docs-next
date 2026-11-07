# How to Create a Server

Setting up a server is easy!  Depending on what your goals are, you and your friends can be playing in your very own server *in no time*.  The first step is to decide what method of hosting is <u>right for you</u>.

## Before you start

Servers are an integral part of BeamMP: players connect to each other through the server. You can make a private server, which only people you invite can join, or a public server, which shows in the official server list.

We recommending you read the server's [LICENSE](https://raw.githubusercontent.com/BeamMP/BeamMP-Server/master/LICENSE) before you use it.

If you run into problems, ask on the [forum](https://forum.beammp.com) or in the `#support` channel on the [Discord server](https://discord.gg/beammp). [Server Configuration](/en/server-owners/configuration) has more detail on the server's settings.

## Deciding How to Host
Already know what you want?  Jump straight to [Self Hosting](#self-host) or [Hosting Provider](#hosting-provider)

Effectively, your two most likely options will be deciding between **self-hosting** (free), or by using a **hosting provider** (usually a paid service).  Here are some of the differences between the two:

| **Self-Hosted** | **Hosting Provider** |
| --- | --- |
| Free!  Hosted on your own PC, limited only by your hardware and network availability | Paid service (though very affordable depending on desired specs), usually hosted on Enterprise-grade equipment and often has higher speeds and reliability than residentially available | 
| Requires access to your network (router) configuration to enable port-forwarding, which allows others access to your network | Requires no networking experience and doesn't compromise your network security.
| Is only online when your computer is online | Can be online 24/7 |
| Host as many server instances as your equipment can handle | Often only allows one server instance per rental |

## Option 1: Self Hosted {#self-host}
Before getting started with your self-hosted server, make sure you have the following:
- A computer or server machine running Windows or Linux with an administrative user account
- A stable internet connection with a publicly accessible IP address (not behind CGNAT)
- Administrative access to your router (and a comfortable understanding of how to use it)

::: danger Important
All of these requirements are necessary to self-host your own server.  If one or more of these are unavailable to you, you'll have a better shot at using a Paid Hosting Service (see [Option 2](#hosting-provider)).
::: 

:::: tabs

== Windows

## Windows Installation

### Step 1: Configure Port Forwarding {#port-forwarding}

:::warning Warning

**Port forwarding is a risk.**

By port forwarding, you understand the risks of opening up ports on your home network to the public and therefore void the right to hold BeamMP accountable for any and all damages that may happen to you or your household.

We take no responsibility for any content on any externally linked services or websites.

:::

In order for your friends (or anyone not inside your home) to join your server, you'll need to configure your router to allow this additional traffic.  Otherwise, other players will get "Connection Failed" errors when trying to connect.

When setting up your port forwarding, you'll need to forward the port that you plan to use.  This same port will also need to be configured in [Step 3](#configure-windows).  Typically, the default port is `30814`, however if you changed this or are running multiple servers (i.e. using multiple ports), you'll need to ensure that this matches your server configuration.

Both **TCP** and **UDP** should be forwarded to the local IP address of the machine running the server.

::: tip Note
Unclear on port forwarding? Check your router manufacturer's documentation or search online for instructions specific to your router model.  BeamMP's Support Team is unable to provide support for this stage of the server hosting process.
:::
#### Not working, or not an option?
If port-forwarding is unavailable to you, or is a risk that you do not want to take, the next step is to look into Paid Hosting Services (see [Option 2](#hosting-provider)).

Note:  Tunnelling services such as Playit, Radmin, Hamachi, etc... have not proven to be reliable workarounds, and as such are not officially supported by BeamMP.

### Step 2: Download the Server

Head over to <a href="https://beammp.com">beammp.com</a>, scroll down to "Or Host It Yourself", and download the **Windows Server** file.

::: tip 

Give it a home!  Your Downloads folder can get messy, so we don't suggest leaving it in there.

It is advisable to choose a location for this file that will be easy to access.  If you plan on running multiple servers, you'll want to make sure that it and each instance is in its own dedicated folder.  

:::

### Step 3: Initialize the Server

Once you have your **BeamMP-Server.exe** file where you'd like it, double-click it for the first time.

This will create all of the necessary files and folders needed to get started.

### Step 3: Configure Your Server {#configure-windows}

One of the newly created files should be `ServerConfig.toml`.  

Open the file with **Notepad** or similar a text editor (avoid using document editors, such as Word) and make any desired changes.  Most of it is self-explanatory, but here's a bit more detail in some of the places where people hit snags:

```
Port = 30814
```
This is the port that you'll open up in your Port Forwarding rules (see [Port Forwarding](#port-forwarding)).  

If your goal is to host multiple servers from the same machine, each server will be identified by its own port (30814, 30815, etc...) and each port that you assign to a server will equally need to be opened up in your Port Forwarding rules.

```
AuthKey = ""
```
The AuthKey field must always have *something* in it.  However, it only needs to have a **valid** auth key if you plan on hosting your server on the public list.  If you're keeping your server private, just put something random here (such as 1234).  
Example:  `Authkey = "1234"` 

If you'd like your server on the public list, you can acquire an AuthKey from the [Keymaster Tab](https://accounts.beammp.com/app/keymaster) within your [BeamMP Accounts Portal](https://accounts.beammp.com).  You may need to link your Discord via [Profile > Linked Accounts](https://accounts.beammp.com/app/profile/linked-accounts).  

::: warning Patreon Subscribers!

If you're a Patreon Subscriber using your perks for additional keys, you'll also want to to ensure that your Discord is linked in your **Patreon** account so that the system knows about your extra keys.

:::

More on Auth Keys can be found [here](authkey.md).

```
IP = "::"
```
In most cases, you'll **leave this as-is**.  Do not touch it unless there's some specific configuration requirement leading you to do so.

```
Map = "/levels/gridmap_v2/info.json"
```
This is where you'll specify the map for your server.  We'll go into a bit more detail on this later, but for now let's leave it on **gridmap_v2** until you're able to verify that everything is connecting correctly.

Make sure you save the file `File > Save` when you're done!

### Step 4:  Set up Firewall Rules

In Windows Defender, you'll need to set up Inbound and Outbound rules to allow traffic, similar to the process in Step 4.

### Defender Firewall exclusion for the BeamMP-Server
1.  Open Windows Defender Firewall with advanced setting
2.  Click **New Rule...**
3.  Select **Port**, click **Next**
4.  Enter the same port you specified in [Step 3](#configure-windows)
5.  Specify the path to BeamMP-Server.exe
6.  Select **Allow the connection**
7.  Give the exclusion a name (e.g. "BeamMP-Launcher") and save it.
8.  Create both an **Inbound** and an **Outbound** rule
9.  Restart your PC

### Additional, if needed:

### Defender Antivirus Exclusion for the BeamMP-Launcher/Server
1.  Open the **Windows Security** app
2.  Click the first item **virus and threat protection**
3.  Click **Manage Settings** beneath "Virus & threat protection settings"
4.  Scroll down to navigate to the **Exclusions** tab
5.  Click **Add an exclusion** and select **process**
6.  Enter `BeamMP-Launcher.exe` or `BeamMP-Server.exe` into the field and save it.
7.  Restart your PC

### Ready to Join?
To make sure your port forwarding is working, use the [reachability check](#check-reachability) further down this page.  Otherwise, let's get you connected!
* **You** - If you're joining from the same PC that you're hosting from, you can use **localhost** to connect to your server. In BeamMP, go to the **Direct Connect** tab, and connect to IP: `127.0.0.1` Port: `30814` (or whatever port you opened up)
* **Your Friends** - If your server is public, they can simply search for your server by name in the **Public Server List**.  Otherwise, if you ran your server as private, you'll need to provide them with your **Public IP Address** (Google "What is my IP?") and the port number that you have opened up/specified for your server.  They'll then use this information in the **Direct Connect** page, similar to how you used localhost.

== Linux

## Linux Installation - Option A (Using Our Build)

### Step 1: Configure Port Forwarding {#port-forwarding-linux}

:::warning Warning

Port forwarding is a risk.

By port forwarding, you understand the risks of opening up ports on your home network to the public and therefore void the right to hold BeamMP accountable for any and all damages that may happen to you or your household.

We take no responsibility for any content on any externally linked services or websites.

:::

In order for your friends (or anyone not inside your home) to join your server, you'll need to configure your router to allow this additional traffic.  Otherwise, other players will get "Connection Failed" errors when trying to connect.

When setting up your port forwarding, you'll need to forward the port that you plan to use.  This same port will also need to be configured in [Step 3](#configure-windows).  Typically, the default port is `30814`, however if you changed this or are running multiple servers (i.e. using multiple ports), you'll need to ensure that this matches your server configuration.

Both **TCP** and **UDP** should be forwarded to the local IP address of the machine running the server.

::: tip Note
Unclear on port forwarding? Check your router manufacturer's documentation or search online for instructions specific to your router model.  BeamMP's Support Team is unable to provide support for this stage of the server hosting process.
:::
#### Not working, or not an option?
If port-forwarding is unavailable to you, or is a risk that you do not want to take, the next step is to look into Paid Hosting Services (see [Option 2](#hosting-provider)).

Note:  Tunnelling services such as Playit, Radmin, Hamachi, etc... have not proven to be reliable workarounds, and as such are not officially supported by BeamMP.

### Step 2: Download the Server

Head over to <a href="https://www.beammp.com">https://www.beammp.com</a>, scroll down to "Or Host It Yourself", and download the **Linux Server** file.
This will work on all distributions we provide binaries for. If you're on a different distribution or architecture, refer to "Building from source” below.
Ensure you have the dependencies installed which are listed [here](https://github.com/BeamMP/BeamMP-Server#runtime-dependencies).

::: tip 

Give it a home!  It's easy for downloads to end up scattered across your home directory, so we don't suggest leaving it wherever it landed.

It is advisable to choose a location for this file that will be easy to access.  If you plan on running multiple servers, you'll want to make sure that it and each instance is in its own dedicated folder.  

:::

### Step 3: Initialize the Server

Once you have your **BeamMP-Server** file where you'd like it, open a terminal in that folder, mark it executable, and run it for the first time:

```
chmod +x BeamMP-Server
./BeamMP-Server
```
 here https://github.com/BeamMP/BeamMP-Server/releases/latest
This will create all of the necessary files and folders needed to get started.

### Step 4: Configure Your Server {#configure-linux}

One of the newly created files should be `ServerConfig.toml`.  

Open the file with **nano**, **vim**, or a similar plain-text editor (avoid rich text/document editors).  Most of it is self-explanatory, but here's a bit more detail in some of the places where people hit snags:

```
Port = 30814
```
This is the port that you'll open up in your Port Forwarding rules (see [Port Forwarding](#port-forwarding-linux)).  

If your goal is to host multiple servers from the same machine, each server will be identified by its own port (30814, 30815, etc...) and each port that you assign to a server will equally need to be opened up in your Port Forwarding rules.

```
AuthKey = ""
```
The AuthKey field must always have *something* in it.  However, it only needs to have a **valid** auth key if you plan on hosting your server on the public list.  If you're keeping your server private, just put something random here (such as 1234).  
Example:  `Authkey = "1234"` 

If you'd like your server on the public list, you can acquire an AuthKey from the [Keymaster Tab](https://accounts.beammp.com/app/keymaster) within your [BeamMP Accounts Portal](https://accounts.beammp.com).  You may need to link your Discord via [Profile > Linked Accounts](https://accounts.beammp.com/app/profile/linked-accounts).  

::: warning Patreon Subscribers!

If you're a Patreon Subscriber using your perks for additional keys, you'll also want to to ensure that your Discord is linked in your **Patreon** account so that the system knows about your extra keys.

:::

More on Auth Keys can be found [here](authkey.md).

```
IP = "::"
```
In most cases, you'll **leave this as-is**.  Do not touch it unless there's some specific configuration requirement leading you to do so.

```
Map = "/levels/gridmap_v2/info.json"
```
This is where you'll specify the map for your server.  We'll go into a bit more detail on this later, but for now let's leave it on **gridmap_v2** until you're able to verify that everything is connecting correctly.

Make sure you save the file when you're done — in nano that's `Ctrl+O`, `Enter`, then `Ctrl+X` to exit; in vim that's `Esc` then `:wq` followed by `Enter`.

### Step 5: Set up Firewall Rules

You'll also need to allow the same port through your Linux firewall, similar to the process in Step 4. Which tool you use depends on your distro:

**Ubuntu/Debian (ufw):**
```
sudo ufw allow 30814/tcp here https://github.com/BeamMP/BeamMP-Server/releases/latest
sudo ufw allow 30814/udp
sudo ufw reload
```

**Fedora/Red Hat (firewalld):** below
```
sudo firewall-cmd --permanent --add-port=30814/tcp
sudo firewall-cmd --permanent --add-port=30814/udp
sudo firewall-cmd --reload
```

Replace `30814` with whatever port you set in [Step 3](#configure-linux) if you changed it. No system restart is required — just (re)start `BeamMP-Server` once the rule is in place.

### Additional, if needed:

If you're on a distro that enforces **SELinux** (commonly Fedora/Red Hat) and connections are still being blocked after opening the firewall port, SELinux policy may be the culprit. Check for denials with `sudo ausearch -m avc -ts recent` and consult your distro's SELinux documentation for allowing a custom application port — this isn't something most Ubuntu/Debian setups will need to worry about.

## Linux Installation - Option B (Building from Source)

Other distributions in addition to the ones that already have a binary [here](https://github.com/BeamMP/BeamMP-Server/releases/latest) are likely to work too, but aren't officially supported. If you want to build it yourself you can do so by downloading the source on our [GitHub](https://github.com/BeamMP/BeamMP-Server).  A tutorial can be found [here](https://github.com/BeamMP/BeamMP-Server#build-instructions).

### Ready to Join?
To make sure your port forwarding is working, use the [reachability check](#check-reachability) further down this page.  Otherwise, let's get you connected!
* **You** - If you're joining from the same PC that you're hosting from, you can use **localhost** to connect to your server. In BeamMP, go to the **Direct Connect** tab, and connect to IP: `127.0.0.1` Port: `30814` (or whatever port you opened up)
* **Your Friends** - If your server is public, they can simply search for your server by name in the **Public Server List**.  Otherwise, if you ran your server as private, you'll need to provide them with your **Public IP Address** (Google "What is my IP?") and the port number that you have opened up/specified for your server.  They'll then use this information in the **Direct Connect** page, similar to how you used localhost.

::::

## Option 2: Hosting Provider {#hosting-provider}
If self-hosting doesn't feel right for you, BeamMP has partnered with several great hosting companies that can provide you with a great service; and it likely costs a lot less than you'd expect.

### Step 1:  Choose a Provider
This is *truly* the hard part, but as long as you are checking for who can provide a server in the best geographical location for you, there is no wrong answer!  

Check out our [Partnered Hosting Providers](https://beammp.com/en/partners), and once you're set up with wheover you've decided on, come back here for some guidelines on getting your server working.

### Step 2:  Server Configuration
The great thing about Hosting Providers, is they do most of the hard work for you.  Often, it's as simple as filling in a few text fields, and clicking **Start**.

::: tip 

Many hosting providers use a Pterodactyl Panel or similar for their server management.  In these cases, it's very common to see their panels **override** the ServerConfig.toml file.  

What this means is that instead of finding that file within the File Manager and configuring it as if you were self-hosting, you would instead set the values in something like a **Startup** tab within your hosting panel.

:::

### Important Fields
In the **Startup** tab (or similar) within your hosting panel, the important things to note are the "Private" field, and the "Auth Key" field.
* **Private** - Marking a server as **Private** means that it will not show up on the **Public Server List**.  
* **Auth Key** - This field is required whether your server is public or private, however, it only requires a *valid* auth key if you are planning to host your server publicly.

### Auth Key: Private Servers
For a private server, you do not need to provide an auth key here, but the field **cannot be left blank**.  You can put anything into this field, such as `1234`.  If it is left as blank, the server will not start or may provide an error "The server is still starting..." when you try to join.

### Auth Key: Public Servers
For a public server, you will need to ensure that a **valid auth key** is pasted into this field.  

You can acquire an AuthKey from the [Keymaster Tab](https://accounts.beammp.com/app/keymaster) within your [BeamMP Accounts Portal](https://accounts.beammp.com).  You may need to link your Discord via [Profile > Linked Accounts](https://accounts.beammp.com/app/profile/linked-accounts).  

::: warning Patreon Subscribers!

If you're a Patreon Subscriber using your perks for additional keys, you'll also want to to ensure that your Discord is linked in your **Patreon** account so that the system knows about your extra keys.

:::

More on Auth Keys can be found [here](authkey.md).

### Ready to Join?
Hosting Providers make it easy.  You're good to go!  Now, let's get you connected.
* **Public Server** - If your server is public, you and your friends can simply search for your server by name in the **Public Server List**.
* **Private Server** - If your server is public, you and your friend will need to connect to the **IP Address** and **Port** that the hosting company assigned to your server.  This usually found in the same page as the server console.  You can then use this information in the **Direct Connect** page of BeamMP.

## Creation - Done!
That's it!  Your server should be set up and able to be play!  If not, see [Troubleshooting](#troubleshooting), or visit our [Discord Server](https://discord.gg/beammp) to create a **Server Support Ticket** for assistance from our team.

Otherwise, it's time to **make your server yours!**  Check out [Installing Mods](./mods) and [Server Customization](./server-customization) for more information on how to make your server *what **you** want it to be*!

## Troubleshooting

### "Connection Failed!"

If you or a friend gets "Connection Failed!", look in the Launcher window for codes such as 10060, 10061 or 10030. They mean one of two things: you are behind a CGNAT IPv4 address, or something went wrong in [Forward the port](#forward-the-port) or [Allow the server through your firewall](#allow-the-server-through-your-firewall).

To check for CGNAT, look up the WAN IP address on your router's page and compare it with your [public IP](https://www.whatsmyip.org/). If they are the same, you are not behind a CGNAT. See [Check for CGNAT](/en/server-owners/cgnat). IPv6 is not supported yet.

## Check that players can reach your server {#check-reachability}

While the server runs, you can type `nettest` in its console. The server asks the same check service whether players can reach it on its port, and prints the answer. Or enter your server's public IPv4 address and port, then click **CheckBeamMP**:

<form action="https://check.beammp.com/api/v2/beammp" method="get" target="_blank">
  <label for="ip">IP address:</label>
  <input type="text" id="ip" name="ip"><br>
  <label for="port">Port:</label>
  <input type="text" id="port" name="port"><br>
  <input type="submit" value="CheckBeamMP">
</form>

## Using a VPN

BeamMP does not support VPNs such as RadminVPN or Hamachi, because they often cause problems. One of these is that UDP traffic is not forwarded. To fix that, see [Forward the port](#forward-the-port).

::: question But it worked before. Why not now?
The developers of these applications update their software and make changes that BeamMP has no control over. It is up to them to support specific uses such as a BeamMP server.
:::

## Still facing issues?

Open a thread on the [forum](https://forum.beammp.com), or file a **Server Support Ticket** in the `#support` channel on the [Discord server](https://discord.gg/beammp).
