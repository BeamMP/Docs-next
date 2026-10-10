---
description: "Set up a development environment for the BeamMP mod: an unpacked mods folder, the Launcher's dev mode and settings, building the Launcher, a cloned repository, a local server and how to contribute."
---
# Development Environment Setup

This page shows how to set up your computer to work on the BeamMP mod, and how to run a local server. To learn how the mod, Launcher and server fit together, see [Developers](/en/developers/).

## What you need

- BeamNG.drive, installed locally.
- BeamMP, installed locally: at least the Launcher, and the server too if you want to test with one.
- Git, installed locally, and a GitHub account.
- A code editor, for example VSCode or Notepad++.

## Use an unpacked folder for BeamNG

To work on mods efficiently, use an `unpacked` folder instead of packaging a zip after every change.

1. Open the `mods` folder in the BeamNG user folder. On Windows it is `%LocalAppData%\BeamNG\BeamNG.drive\current\mods`. The Launcher shows the folder it uses on the `Game user path:` line when it starts.
2. Create a folder called `unpacked` inside `mods`.

More about the user folder is in the [BeamNG documentation](https://documentation.beamng.com/support/userfolder/).

## Turn on dev mode in the Launcher

Start the Launcher with `--dev`. Dev mode prints debug messages, does not download the BeamMP mod, does not start BeamNG.drive, and does not update the Launcher. If you only want some of this, use the single options below.

Without `--no-download`, the Launcher downloads the released BeamMP mod to `mods/multiplayer`. It also deletes `mods/unpacked/beammp` unless that folder contains a `.git` folder. Use `--no-download` so the released mod does not run next to yours.

| Argument | What it does |
|---|---|
| `--help`, `-h` or `/?` | Prints this list of arguments and closes |
| `--port <port>` or `-p <port>` | Changes the listen port, `4444` by default, to `<port>`. The Launcher also uses `<port>` + 1. It must be set in the game too. It replaces `Port` in `Launcher.cfg` |
| `--verbose` or `-v` | Verbose mode: prints debug messages in the window. They are always written to `Launcher.log` |
| `--no-download` | Skips downloading and installing the BeamMP mod |
| `--no-update` | Skips applying Launcher updates, so you must update by hand |
| `--no-launch` | Skips launching the game, so you must start it yourself |
| `--dev` | Developer mode: the same as `--verbose --no-download --no-launch --no-update` |
| `--user-path <path>` | Windows only. Path to the BeamNG.drive user folder, the folder that holds `current` |
| `--game <args...>` or `-- <args...>` | Passes all the arguments after it to the game |

### Launcher settings file

The Launcher reads `Launcher.cfg` from the folder it runs from. If the file is missing, the Launcher creates it with the first three settings. The command-line options replace the matching settings.

| Setting | Default | What it does |
|---|---|---|
| `"Port"` | `4444` | The port the game connects to. See [Changing the Launcher Port](/en/troubleshooting/launcher-port) |
| `"Build"` | `"Default"` | The build the Launcher asks the BeamMP backend for when it checks for Launcher and mod updates. Leave it at `Default` |
| `"CachingDirectory"` | `"./Resources"` | The folder where the Launcher keeps downloaded server mods |
| `"Dev"` | not set | `true` is the same as `--dev` |
| `"DeleteDuplicateMods"` | `false` | `true` makes the Launcher delete older cached versions of a mod when a server sends a newer one |

### Mod cache

When you join a server, the Launcher downloads each mod the server lists into the `CachingDirectory` folder. A mod is saved as `<name>-<first 8 characters of its SHA-256 hash>.zip`. The Launcher reuses a cached file when its hash matches, and records the last use of each file in `mods.json` in the same folder. It then copies the mod into `mods/multiplayer` in the game's user folder, with a lowercase file name on Linux.

Each time it starts, the Launcher deletes everything in `mods/multiplayer` except `beammp.zip`. Do not keep your own files there.

## Build the Launcher

You only need to build the Launcher if you work on the Launcher itself. The Launcher's `README.md` has no build steps.

On Windows you need Visual Studio with the C++ desktop workload (MSVC), CMake and [vcpkg](https://github.com/microsoft/vcpkg). The libraries in `vcpkg.json` are `cpp-httplib`, `nlohmann-json`, `zlib`, `openssl` and `curl`. The Launcher uses the static C++ runtime, so use the `x64-windows-static` triplet. In the project's root directory, run the following. Change `C:/vcpkg` to where you installed `vcpkg`:

```bash
cmake . -B bin -DCMAKE_BUILD_TYPE=Release -DCMAKE_TOOLCHAIN_FILE=C:/vcpkg/scripts/buildsystems/vcpkg.cmake -DVCPKG_TARGET_TRIPLET=x64-windows-static
cmake --build bin --parallel --config Release
```

The program is `bin/Release/BeamMP-Launcher.exe`. On Windows, the Launcher replaces itself with the official signed release when a newer one exists, so start your own build with `--no-update`.

For Linux, follow [Build the Launcher](/en/get-started/install-beammp#build-the-launcher). The Launcher does not build on macOS.

## Clone the BeamMP repository into the unpacked folder

You can copy the mod files from our GitHub repository by hand, but a source-control system such as git is much better.

1. Create a fork of [BeamMP/BeamMP](https://github.com/BeamMP/BeamMP).
2. Clone it straight into the `unpacked` folder. In PowerShell or CMD opened in that folder, run:

   ```bash
   git clone https://github.com/yourName/BeamMP
   ```

3. In the user folder, delete `mods/multiplayer/beammp.zip` if it exists. A normal start of the Launcher downloads it, and `--no-download` does not remove it. Check that `mods/unpacked/beammp` exists.
4. Try dev mode. Start the Launcher with `--dev`, then start BeamNG manually. In the game, make sure BeamMP is the only active mod. You can use BeamMP as usual.

With a code editor you can now change the code directly in the `unpacked` folder. Reload Lua in the game with `Ctrl` + `L`, and also press `F5` if you changed the UI.

## Set up a local server

A local server helps when you work on BeamMP. Follow [Host a Server](/en/server-owners/host-a-server), leaving out the first two steps (port forwarding and the AuthKey) if you only connect locally.

In `ServerConfig.toml`, set the server to private, and use any string as the `AuthKey`.

## Contribute your changes

When you are happy with your changes, commit them with git. The [Git-SCM website](https://git-scm.com/doc) has tutorials and documentation. When your changes are committed and pushed to your fork, you can make a pull request.

The BeamMP mod repository has a `CONTRIBUTING.md` file with the code format, the commit message format and general development practices. The Launcher repository has a `.clang-format` file for its code style, and its pull request template asks you to confirm that you wrote and understand all the code yourself. The `README.md` of a repository may have the build steps for compiled projects.

If you run into problems, ask in the `#scripting` channel on our [Discord server](https://discord.gg/beammp).
