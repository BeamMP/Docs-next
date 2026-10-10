---
description: "Install BeamMP on Windows with the installer, or build the BeamMP Launcher yourself on Linux, with the native game or BeamNG.drive through Proton."
---
# Install BeamMP

You need the BeamMP Launcher. On Windows an installer sets it up. On Linux you build it yourself. There is no Launcher for macOS.

::: warning
BeamMP does not work with pirated or outdated copies of BeamNG.drive.
:::

## Install on Windows

1. Go to [beammp.com](https://beammp.com/) and click **Download Now**.
2. Run `BeamMP_Installer.exe` and follow the instructions. Keep **Create a desktop shortcut** selected if you want an icon on your desktop.
3. Start the BeamMP Launcher from the desktop icon. If there is none, search for "BeamMP-Launcher" in the Windows search bar.

The installer does not need administrator rights. By default it puts the Launcher in `%AppData%\BeamMP-Launcher`. The Launcher updates itself when it starts. If it cannot, see [Launcher Update Issues](/en/troubleshooting/launcher-update).

Next: [join your first server](/en/get-started/join-first-server).

## Install on Linux

There is no installer or download for Linux, so you build the Launcher yourself. You need a basic understanding of how to build an application.

### Before you start

- Install BeamNG.drive through Steam. The Launcher finds the game only through Steam. It looks in these folders under your home folder: `.steam/root/steamapps`, `.steam/steam/steamapps`, `.var/app/com.valvesoftware.Steam/.steam/root/steamapps` (Flatpak) and `snap/steam/common/.local/share/Steam/steamapps` (Snap). The game must be in a Steam library that is listed in `libraryfolders.vdf`.
- The Launcher reads and writes the game's user folder at `~/.local/share/BeamNG/BeamNG.drive/current/`. The `--user-path` option has no effect on Linux.
- You need a compiler that supports C++20 and `std::format`, for example GCC 13 or newer.

If the Launcher cannot find the game, it shows `Unsupported Steam installation.`, `libraryfolders.vdf is missing.` or `The game directory was not found.`. See [Error Codes](/en/troubleshooting/error-codes).

::: warning
On Linux, joining a second server after you leave the first can fail. The Launcher window then shows `(Proxy) bind failed with error: 98` or `Connection still alive terminating`. Close the game and the Launcher, then start them again. No Launcher release up to v2.8.1 fixes this.
:::

### Install the build tools

Install the basic development tools. On most systems they are in a package:

| System | Command |
|---|---|
| Debian, Ubuntu | `sudo apt install build-essential` |
| Fedora | `sudo dnf install cmake gcc gcc-c++ make perl perl-IPC-Cmd perl-FindBin perl-File-Compare perl-File-Copy kernel-headers kernel-devel` |
| Arch | `sudo pacman -S base-devel` |
| openSUSE | `zypper in -t pattern devel-basis` |
| SteamOS (Arch) | `sudo pacman -S base-devel linux-api-headers glibc libconfig` |

You also need `cmake`, `git`, `curl`, `zip`, `unzip`, `tar` and `pkg-config`. The `vcpkg` bootstrap script needs `curl`, `zip`, `unzip` and `tar`, and `vcpkg` needs `pkg-config` to build the libraries. Install any of them that your system does not have.

On SteamOS, run `sudo steamos-readonly disable` before you install the packages, and turn it back on afterwards.

### Get vcpkg

Clone `vcpkg`, bootstrap it and add it to your `PATH`:

1. Clone it:

   ```bash
   git clone https://github.com/microsoft/vcpkg.git
   ```

2. Bootstrap it:

   ```bash
   ./vcpkg/bootstrap-vcpkg.sh
   ```

3. Add it to your `PATH`:

   ```bash
   export VCPKG_ROOT="$(pwd)/vcpkg"
   export PATH=$VCPKG_ROOT:$PATH
   ```

### Build the Launcher

1. Clone the [BeamMP-Launcher](https://github.com/BeamMP/BeamMP-Launcher) repository, then go into it:

   ```bash
   git clone https://github.com/BeamMP/BeamMP-Launcher.git
   cd BeamMP-Launcher
   ```

   If you have not cloned a repository before, see GitHub's guide to [cloning a repository](https://docs.github.com/en/repositories/creating-and-managing-repositories/cloning-a-repository).

2. Check out the tag of the [latest release](https://github.com/BeamMP/BeamMP-Launcher/releases/latest). If the latest release is `v2.8.1`, run:

   ```bash
   git checkout v2.8.1
   ```

3. In the project's root directory, configure the build. `vcpkg` downloads and builds the libraries listed in `vcpkg.json` (`cpp-httplib`, `nlohmann-json`, `zlib`, `openssl` and `curl`), so this step takes a while the first time:

   ```bash
   cmake . -B bin -DCMAKE_TOOLCHAIN_FILE=$VCPKG_ROOT/scripts/buildsystems/vcpkg.cmake -DVCPKG_TARGET_TRIPLET=x64-linux
   ```

4. Build it:

   ```bash
   cmake --build bin --parallel
   ```

   If the build runs out of RAM, leave out `--parallel`. The build then uses one CPU thread and less RAM.

5. Move the finished application out of `bin` into its own folder, and run it from there:

   ```bash
   mkdir -p ~/beammp-launcher
   cp bin/BeamMP-Launcher ~/beammp-launcher/
   cd ~/beammp-launcher
   ./BeamMP-Launcher
   ```

The Launcher creates `Launcher.cfg`, the `Resources` mod cache and the `Launcher.log` file in the folder you run it from. The native Linux Launcher starts the native Linux BeamNG.drive from the Steam game folder.

::: details Fedora: vcpkg fails while building OpenSSL
If vcpkg fails with kernel header errors during OpenSSL, make sure the dependencies are installed:

```bash
sudo dnf install kernel-headers kernel-devel gcc gcc-c++ make perl
```

Then clear the vcpkg cache and run the configure command again:

```bash
rm -rf $VCPKG_ROOT/buildtrees/openssl
```
:::

### Use BeamNG.drive through Proton

You can use the native Linux Launcher with BeamNG.drive running through Proton.

1. Start the Launcher with `--no-launch`, so it does not start the native Linux BeamNG.drive. More Launcher arguments are in the [Development Environment Setup](/en/developers/dev-environment-setup#turn-on-dev-mode-in-the-launcher) page.
2. Make the Proton game use the Linux game's user folder, because the native Launcher only writes to that one. A symlink does this:
   1. Find the Linux BeamNG.drive user folder, usually `~/.local/share/BeamNG/BeamNG.drive`, and rename it, for example to `BeamNG.drive_old`.
   2. Find the Proton BeamNG.drive user folder, usually `~/.local/share/Steam/steamapps/compatdata/284160/pfx/drive_c/users/steamuser/AppData/Local/BeamNG/BeamNG.drive`.
   3. Link the two:

      ```bash
      ln -s ~/.local/share/Steam/steamapps/compatdata/284160/pfx/drive_c/users/steamuser/AppData/Local/BeamNG/BeamNG.drive ~/.local/share/BeamNG
      ```

3. In Steam, open the game's **Properties** and replace the launch options with:

   ```bash
   ~/BeamMP/BeamMP-Launcher --no-launch & %command% ; killall BeamMP-Launcher
   ```

   Steam then starts the Launcher with the game.

Change `~/BeamMP/` to the folder where you put the Launcher you built. The Launcher still looks for the game in a Steam library, as described in [Before you start](#before-you-start).

::: tip Emoji in names and chat
To show emoji in server names in the server list, and in the in-game chat, you need a font that has them. One option is the [Linux port of the Windows Segoe UI emoji font](https://github.com/mrbvrz/segoe-ui-linux).
:::

### Update the Launcher on Linux

The Linux Launcher does not update itself. When a newer version exists, it shows `Auto update is NOT implemented for the Linux version. Please update manually ASAP as updates contain security patches.` Rebuild it from the tag of the newest release:

1. Go into the Launcher folder and fetch the new tags:

   ```bash
   export VCPKG_ROOT="$(pwd)/vcpkg"
   cd BeamMP-Launcher
   git fetch --tags
   ```

2. Check out the tag of the [latest release](https://github.com/BeamMP/BeamMP-Launcher/releases/latest), as in [Build the Launcher](#build-the-launcher).
3. Build it again and copy it to your Launcher folder:

   ```bash
   cmake . -B bin -DCMAKE_TOOLCHAIN_FILE=$VCPKG_ROOT/scripts/buildsystems/vcpkg.cmake -DVCPKG_TARGET_TRIPLET=x64-linux
   cmake --build bin --parallel
   cp bin/BeamMP-Launcher ~/beammp-launcher/
   cd ~/beammp-launcher
   ./BeamMP-Launcher
   ```

Next: [join your first server](/en/get-started/join-first-server).
