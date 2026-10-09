---
description: "Start developing for BeamMP: how the mod, Launcher and server fit together, how to set up a development environment, and where the scripting references are."
---
# Developers

BeamMP is split into three parts, and you can write code for each. This section explains how they fit together and where to start.

## The three parts

- **The mod** is loaded by BeamNG.drive like any other vehicle or UI mod. It makes a local connection to the Launcher and shows the multiplayer UI. It is mostly Lua, with some JavaScript, HTML and CSS for the UI. Its repository is [BeamMP/BeamMP](https://github.com/BeamMP/BeamMP).
- **The Launcher** keeps a constant connection to the mod, connects to the server you choose, and handles sign-in with the BeamMP backend. It is written in C++, precompiled by BeamMP, and lives at [BeamMP/BeamMP-Launcher](https://github.com/BeamMP/BeamMP-Launcher).
- **The server** connects one or many Launchers and sends heartbeats to the BeamMP backend with its IP address, port, version, number of players and more. It also runs server-side Lua plugins. It is written in C++, precompiled by BeamMP for several operating systems and CPU architectures, and lives at [BeamMP/BeamMP-Server](https://github.com/BeamMP/BeamMP-Server).

## Where to start

- **Work on BeamMP itself:** [Development Environment Setup](/en/developers/dev-environment-setup).
- **Write a server plugin or a mod:** [Mod & Resource Creation](/en/developers/mod-and-resource-creation).
- **Look up a function or event:** the [scripting references](/en/developers/beammp-scripting/): [Mod (In-Game)](/en/developers/beammp-scripting/mod-in-game) and [Server](/en/developers/beammp-scripting/server/latest).
- **Work with BeamNG.drive itself:** [Game Documentation](/en/game-documentation/).

If you get stuck, ask in the `#scripting` channel on the [Discord server](https://discord.gg/beammp).
