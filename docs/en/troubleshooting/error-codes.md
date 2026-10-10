---
description: "What the error codes and messages in the BeamMP Launcher window mean, such as 10060, 10048 or Failed to find the game, and how to fix each."
---
# Error Codes

This page lists the error codes and messages the Launcher can show, and what to do about each. The messages are from Launcher v2.8.1. For errors in a server's window, see the [Server Error Codes](/en/server-owners/error-codes).

The Launcher also writes everything it shows to `Launcher.log`, in the folder that holds the Launcher. The file starts empty each time the Launcher starts, so it holds the last run only. If the Launcher closes at once, read that file.

## Network codes

The number after `error:` or `Error code:` is a Windows socket code. On Linux it is the system error number instead.

| Windows (Linux) | Description | Possible solution |
|---|---|---|
| 10048 (98) | `bind failed with error`: something else already uses the Launcher port or the next one. The default ports are `4444` and `4445` | Run only one Launcher at a time, and restart your PC. If another program uses the ports, [change the Launcher port](/en/troubleshooting/launcher-port). On Linux, this also happens when you join a second server: close the game and the Launcher, then start them again |
| 10060, 10061 (110, 111) | `Client: connect failed! Error code`: no server answered on that IP address and port | If you are the server owner, check the port forwarding and firewall rules in [Host a Server](/en/server-owners/host-a-server). If you are not, choose a different server, or contact the owner |
| 10054 (104) | The connection was reset by the other side | The server you were connected to has gone offline or restarted. Try again later |
| 10038 | `(Game) send failed with error`: the Launcher tried to send to the game after the game had disconnected. Launcher v2.8.0 shows this | Update to the latest Launcher |
| `DNS lookup failed! on` followed by a name | The Launcher could not find the address of the server name you typed | Check the name. Use the server's IP address instead |

## Starting the game

| Message | Description | Possible solution |
|---|---|---|
| `Failed to find the game please launch it. Report this if the issue persists code 3` | Windows. `%LocalAppData%\BeamNG\BeamNG.Drive.ini` exists, but the Launcher cannot read it | Start BeamNG.drive once so it writes the file again |
| `... code 4` | Windows. `installPath` in `BeamNG.Drive.ini` points to a folder that does not exist | Start BeamNG.drive once from its current folder, or correct `installPath` in the file |
| `... code 5` | Windows. `BeamNG.Drive.ini` has no `installPath` | Start BeamNG.drive once |
| `... code 6` | Windows. There is no `BeamNG.Drive.ini`, and the registry key `HKEY_CURRENT_USER\Software\BeamNG\BeamNG.drive` has no `rootpath` value | Start BeamNG.drive once |
| `... code 7` | Windows. There is no `BeamNG.Drive.ini`, and the registry key `HKEY_CURRENT_USER\Software\BeamNG\BeamNG.drive` does not exist | Start BeamNG.drive once |
| `Unsupported Steam installation.` | Linux. None of the Steam folders the Launcher knows has a `steamapps` folder | See [Before you start](/en/get-started/install-beammp#before-you-start) for the folders. Link yours to one of them |
| `libraryfolders.vdf is missing.` | Linux. The Steam folder has no `libraryfolders.vdf` file | Start Steam once, then try again |
| `The game directory was not found.` | Linux. BeamNG.drive is not in any Steam library that `libraryfolders.vdf` lists | Install BeamNG.drive through Steam |
| `Failed to Launch the game! launcher closing soon` | The Launcher could not start `BeamNG.drive.exe` (Windows) or `BinLinux/BeamNG.drive.x64` (Linux) in the game folder. On Windows, the Windows error code and text follow | Verify the game files in Steam, and start the game once before you start the Launcher |
| `Game Closed! launcher closing soon` | The game ended. The Launcher closes 5 seconds later | Normal when you close the game. If the game closed by itself, start the Launcher again |
| `We were unable to clean the multiplayer mods folder! Is the game still running or do you have something open in that folder?` | The Launcher empties the `mods/multiplayer` folder in the game's user folder when it starts, and could not | Close the game and any program that uses that folder, then start the Launcher again |

## The Launcher's own files

| Message | Description | Possible solution |
|---|---|---|
| `logger file init failed!` | The Launcher cannot create `Launcher.log` in its folder | Move the Launcher to a folder you can write to |
| `Config failed to parse make sure it's valid JSON!` | `Launcher.cfg` is not valid JSON. The Launcher closes | Fix the file, or delete it. The Launcher creates a new one with the default settings |
| `Failed to open Launcher.cfg!`, `Failed to write config on disk!` | The Launcher cannot read or create `Launcher.cfg` in the folder it runs from | Run it from a folder you can write to |
| `Failed to create caching directory` | The Launcher cannot create the mod cache folder, which is `Resources` unless you set `CachingDirectory` in `Launcher.cfg` | Set `CachingDirectory` to a folder you can write to |
| `Exception in main()` | A fatal error. The Launcher closes after 5 seconds | Read the text after it, and ask on the [forum](https://forum.beammp.com) or the [Discord server](https://discord.gg/beammp) |

## Updates and the BeamMP servers

| Message | Description | Possible solution |
|---|---|---|
| `Failed to download the launcher update! Please try manually updating it` | Windows. The Launcher could not download its update | See [Launcher Update Issues](/en/troubleshooting/launcher-update) |
| `The authenticity of the updated launcher could not be verified, it was corrupted or tampered with.` | Windows. The downloaded update has no valid signature, so the Launcher deleted it | Download the Launcher from the [GitHub release page](https://github.com/BeamMP/BeamMP-Launcher/releases/latest), as in [Launcher Update Issues](/en/troubleshooting/launcher-update) |
| `Auto update is NOT implemented for the Linux version.` | Linux. A newer Launcher exists | Rebuild the Launcher: see [Update the Launcher on Linux](/en/get-started/install-beammp#update-the-launcher-on-linux) |
| `GET to ... failed` or `POST to ... failed`, then `Curl error` | The Launcher could not reach a BeamMP server. The text after it gives the reason, such as a timeout or a certificate error | Check your internet connection and firewall rules. If there is no problem on your end, check the [BeamMP updates channel](<https://discord.com/channels/601558901657305098/697596153943949352>) on our Discord |
| `Invalid hash from backend, skipping update check.` | The BeamMP backend gave no valid answer. The Launcher skips the check and carries on | Check your internet connection and firewall rules |
| `Failed to communicate with the auth system!` | The sign-in server did not answer | Check your internet connection and firewall rules, then try again |
| `Invalid answer from authentication servers, please try again later!` | The sign-in server gave an answer the Launcher cannot read | Try again later |

## Mods

| Message | Description | Possible solution |
|---|---|---|
| `Mod '...' is protected and therefore must be placed in the Resources/Caching folder manually here:` followed by a path | The server uses a protected mod, which the Launcher does not download | Get the file from its creator and put it in the folder the message shows, keeping its file name |
| `Server cannot find` followed by a file name | The server does not have the mod file it listed | Tell the server owner |
| `Failed to write or download the entire file ... (hash mismatch)` | The mod file did not download correctly | Join again. The Launcher checks the file again and downloads it again |
| `Failed copy to the mods folder!` | The Launcher could not copy a mod into the game's `mods/multiplayer` folder | Close the game and any program that uses that folder, then join again |
