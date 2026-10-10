---
description: "Update the BeamMP Launcher by hand when it cannot update itself or shows a blank screen: download the latest Launcher on Windows, or rebuild it on Linux."
---
# Launcher Update Issues

The Launcher cannot update, or shows a blank screen? This guide shows how to update it by hand.

On Windows you should already have installed BeamMP with the installer from [our website](https://beammp.com) before you follow it.

## How the Launcher updates

On Windows, the Launcher checks `backend.beammp.com` for a newer version every time it starts. If there is one, it downloads it, checks its signature and keeps the old file as `BeamMP-Launcher.back` in the same folder. Then it restarts. The Launcher skips the check when you start it with `--no-update` or `--dev`.

If the update fails, the Launcher shows one of these messages:

- `Failed to download the launcher update! Please try manually updating it`
- `The authenticity of the updated launcher could not be verified, it was corrupted or tampered with.`

Check your internet connection and your firewall or antivirus, as in [Defender / Firewall Exclusions](/en/troubleshooting/defender-exclusions). Then update the Launcher by hand.

On Linux, the Launcher never updates itself. Follow [Update the Launcher on Linux](/en/get-started/install-beammp#update-the-launcher-on-linux) instead of the steps below.

## Install a new Launcher

1. Download the latest Launcher directly from [GitHub](https://github.com/BeamMP/BeamMP-Launcher/releases/latest/download/BeamMP-Launcher.exe).
2. Close the Launcher.
3. Go to the folder that holds `BeamMP-Launcher.exe`. By default it is `C:\Users\<username>\AppData\Roaming\BeamMP-Launcher`. Replace `<username>` with your Windows user name. If you installed BeamMP somewhere else, for example `D:\BeamMP-Launcher`, use that folder.
4. Replace the existing Launcher in the BeamMP-Launcher folder with the new one.
5. Start the Launcher as usual and check that it works.

## Still facing issues?

Create a support ticket on our [Discord server](https://discord.gg/BeamMP).
