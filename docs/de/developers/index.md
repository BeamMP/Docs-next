---
description: "Mit der Entwicklung für BeamMP beginnen: wie Mod, Launcher und Server zusammenspielen, wie du eine Entwicklungsumgebung einrichtest und wo die Scripting-Referenzen stehen."
---
# Entwickler

BeamMP besteht aus drei Teilen, und für jeden kannst du Code schreiben. Dieser Bereich erklärt, wie sie zusammenspielen und wo du anfangen kannst.

## Die drei Teile

- **Der Mod** wird von BeamNG.drive wie jeder andere Fahrzeug- oder UI-Mod geladen. Er baut eine lokale Verbindung zum Launcher auf und zeigt die Multiplayer-Oberfläche an. Er besteht größtenteils aus Lua, mit etwas JavaScript, HTML und CSS für die Oberfläche. Sein Repository ist [BeamMP/BeamMP](https://github.com/BeamMP/BeamMP).
- **Der Launcher** hält eine dauerhafte Verbindung zum Mod, verbindet sich mit dem Server, den du auswählst, und kümmert sich um die Anmeldung beim BeamMP-Backend. Er ist in C++ geschrieben, wird von BeamMP vorkompiliert bereitgestellt und liegt unter [BeamMP/BeamMP-Launcher](https://github.com/BeamMP/BeamMP-Launcher).
- **Der Server** verbindet einen oder viele Launcher und sendet Heartbeats mit seiner IP-Adresse, seinem Port, seiner Version, der Spielerzahl und mehr an das BeamMP-Backend. Außerdem führt er serverseitige Lua-Plugins aus. Er ist in C++ geschrieben, wird von BeamMP vorkompiliert für mehrere Betriebssysteme und CPU-Architekturen bereitgestellt und liegt unter [BeamMP/BeamMP-Server](https://github.com/BeamMP/BeamMP-Server).

## Wo du anfangen kannst

- **An BeamMP selbst arbeiten:** [Entwicklungsumgebung einrichten](/de/developers/dev-environment-setup).
- **Ein Server-Plugin oder einen Mod schreiben:** [Mod- & Ressourcenerstellung](/de/developers/mod-and-resource-creation).
- **Eine Funktion oder ein Event nachschlagen:** die [Scripting-Referenzen](/de/developers/beammp-scripting/): [Mod (Im Spiel)](/de/developers/beammp-scripting/mod-in-game) und [Server](/de/developers/beammp-scripting/server/latest).
- **Mit BeamNG.drive selbst arbeiten:** [Spieldokumentation](/de/game-documentation/).

Wenn du nicht weiterkommst, frag im Kanal `#scripting` auf dem [Discord-Server](https://discord.gg/beammp).
