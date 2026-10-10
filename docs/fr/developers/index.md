---
description: "Commencez à développer pour BeamMP : comment le mod, le lanceur et le serveur s'articulent, comment configurer un environnement de développement et où trouver les références de script."
---
# Développeurs

BeamMP se divise en trois parties, et vous pouvez écrire du code pour chacune d'elles. Cette section explique comment elles s'articulent et par où commencer.

## Les trois parties

- **Le mod** est chargé par BeamNG.drive comme n'importe quel mod de véhicule ou d'interface. Il établit une connexion locale avec le lanceur et affiche l'interface multijoueur. Il est principalement écrit en Lua, avec un peu de JavaScript, HTML et CSS pour l'interface. Son dépôt est [BeamMP/BeamMP](https://github.com/BeamMP/BeamMP).
- **Le lanceur** maintient une connexion permanente avec le mod, se connecte au serveur que vous choisissez et gère la connexion au backend de BeamMP. Il est écrit en C++, précompilé par BeamMP, et se trouve sur [BeamMP/BeamMP-Launcher](https://github.com/BeamMP/BeamMP-Launcher).
- **Le serveur** relie un ou plusieurs lanceurs et envoie des « heartbeats » au backend de BeamMP, avec son adresse IP, son port, sa version, son nombre de joueurs et plus encore. Il exécute également des plugins Lua côté serveur. Il est écrit en C++, précompilé par BeamMP pour plusieurs systèmes d'exploitation et architectures de processeur, et se trouve sur [BeamMP/BeamMP-Server](https://github.com/BeamMP/BeamMP-Server).

## Par où commencer

- **Travailler sur BeamMP lui-même :** [Configuration de l’environnement de développement](/fr/developers/dev-environment-setup).
- **Écrire un plugin serveur ou un mod :** [Création de mods et de ressources](/fr/developers/mod-and-resource-creation).
- **Permettre de se connecter à votre application avec BeamMP :** [Se connecter avec BeamMP](/fr/developers/sign-in-with-beammp).
- **Rechercher une fonction ou un événement :** les [références de script](/fr/developers/beammp-scripting/) : [Mod (en jeu)](/fr/developers/beammp-scripting/mod-in-game) et [Serveur](/fr/developers/beammp-scripting/server/latest).
- **Travailler avec BeamNG.drive lui-même :** [Documentation du jeu](/fr/game-documentation/).

Si vous êtes bloqué, posez votre question dans le canal `#scripting` du [serveur Discord](https://discord.gg/beammp).
