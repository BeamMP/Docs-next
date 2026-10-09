---
description: "Set up a development environment for the BeamMP mod: an unpacked mods folder, the Launcher's dev mode, a cloned repository, a local server and how to contribute."
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

1. Open the BeamNG user folder at `%appdata%/Local/BeamNG.drive/0.xx/mods`, where `xx` is the most recent BeamNG version.
2. Create a folder called `unpacked` inside `mods`.

More about the user folder is in the [BeamNG documentation](https://documentation.beamng.com/support/userfolder/).

## Turn on dev mode in the Launcher

Auto-update would delete your local git clone, so turn it off with `--no-download`. If you also do not want the Launcher to start BeamNG, and you want to see debug prints, use `--dev`.

| Argument | What it does |
|---|---|
| `--help` or `-h` | Prints this list of arguments |
| `--port <port>` or `-p` | Changes the default listen port to `<port>`. It must be set in the game too |
| `--verbose` or `-v` | Verbose mode: prints debug messages |
| `--no-download` | Skips downloading and installing the BeamMP Lua mod |
| `--no-update` | Skips applying Launcher updates, so you must update by hand |
| `--no-launch` | Skips launching the game, so you must start it yourself |
| `--dev` | Developer mode: the same as `--verbose --no-download --no-launch --no-update` |
| `--game <args...>` or `-- <args...>` | Passes arguments to the game |

## Clone the BeamMP repository into the unpacked folder

You can copy the mod files from our GitHub repository by hand, but a source-control system such as git is much better.

1. Create a fork of [BeamMP/BeamMP](https://github.com/BeamMP/BeamMP).
2. Clone it straight into the `unpacked` folder. In PowerShell or CMD opened in that folder, run:

   ```bash
   git clone https://github.com/yourName/BeamMP
   ```

3. In the user folder, make sure there is no `multiplayer` folder left in `mods`, and that there is now `unpacked/beammp`.
4. Try dev mode. Start the Launcher, then start BeamNG manually. In the game, make sure BeamMP is the only active mod. You can use BeamMP as usual.

With a code editor you can now change the code directly in the `unpacked` folder. Reload Lua in the game with `Ctrl` + `L`, and also press `F5` if you changed the UI.

## Set up a local server

A local server helps when you work on BeamMP. Follow [Host a Server](/en/server-owners/host-a-server), leaving out the first two steps (port forwarding and the AuthKey) if you only connect locally.

In `ServerConfig.toml`, set the server to private, and use any string as the `AuthKey`.

## Contribute your changes

When you are happy with your changes, commit them with git. The [Git-SCM website](https://git-scm.com/doc) has tutorials and documentation. When your changes are committed and pushed to your fork, you can make a pull request.

For code format, commit message format and general development practices, see the `CONTRIBUTING.md` file in each repository. The `README.md` in each repository usually has the build steps for compiled projects.

If you run into problems, ask in the `#scripting` channel on our [Discord server](https://discord.gg/beammp).
